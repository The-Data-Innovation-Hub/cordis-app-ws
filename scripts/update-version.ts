#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { format } from 'date-fns';

type VersionType = 'major' | 'minor' | 'patch';
type Component = 'frontend' | 'database' | 'both';

interface Version {
  frontend: string;
  database: string;
  lastUpdated: string;
}

interface VersionHistoryEntry {
  version: string;
  date: string;
  changes: string[];
}

interface VersionHistory {
  frontend: VersionHistoryEntry[];
  database: VersionHistoryEntry[];
}

const VERSION_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'constants', 'versions.ts');

function incrementVersion(version: string, type: VersionType): string {
  const [major, minor, patch] = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return version;
  }
}

async function readVersionFile(): Promise<{ APP_VERSION: Version; VERSION_HISTORY: VersionHistory }> {
  const content = await fs.readFile(VERSION_FILE_PATH, 'utf-8');
  // Using eval here because we're reading a TypeScript file with exports
  // In a production environment, you might want to use a more robust solution
  const context = { exports: {} };
  eval(content);
  return {
    APP_VERSION: context.exports.APP_VERSION,
    VERSION_HISTORY: context.exports.VERSION_HISTORY,
  };
}

async function writeVersionFile(
  appVersion: Version,
  versionHistory: VersionHistory
): Promise<void> {
  const content = `export const APP_VERSION = ${JSON.stringify(appVersion, null, 2)};

export const VERSION_HISTORY = ${JSON.stringify(versionHistory, null, 2)};
`;
  await fs.writeFile(VERSION_FILE_PATH, content, 'utf-8');
}

async function updateVersion(
  component: Component,
  type: VersionType,
  changes: string[]
): Promise<void> {
  try {
    // Read current versions
    const { APP_VERSION, VERSION_HISTORY } = await readVersionFile();
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const commitMessages: string[] = [];

    // Update versions based on component
    if (component === 'frontend' || component === 'both') {
      const newFrontendVersion = incrementVersion(APP_VERSION.frontend, type);
      APP_VERSION.frontend = newFrontendVersion;
      VERSION_HISTORY.frontend.unshift({
        version: newFrontendVersion,
        date: currentDate,
        changes: changes.filter(change => !change.toLowerCase().includes('database')),
      });
      commitMessages.push(`Frontend v${newFrontendVersion}`);
    }

    if (component === 'database' || component === 'both') {
      const newDatabaseVersion = incrementVersion(APP_VERSION.database, type);
      APP_VERSION.database = newDatabaseVersion;
      VERSION_HISTORY.database.unshift({
        version: newDatabaseVersion,
        date: currentDate,
        changes: changes.filter(change => change.toLowerCase().includes('database')),
      });
      commitMessages.push(`Database v${newDatabaseVersion}`);
    }

    APP_VERSION.lastUpdated = currentDate;

    // Write updated versions back to file
    await writeVersionFile(APP_VERSION, VERSION_HISTORY);

    // Stage and commit changes
    const commitType = type === 'major' ? 'BREAKING CHANGE' : type === 'minor' ? 'feat' : 'fix';
    const commitMessage = `${commitType}: Version update\n\n${commitMessages.join('\n')}\n\nChanges:\n${changes.map(c => `- ${c}`).join('\n')}`;
    
    execSync('git add src/lib/constants/versions.ts', { stdio: 'inherit' });
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    console.log('✅ Version updated successfully!');
    console.log('Changes committed. You can now push to remote with: git push');
  } catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(`
Usage: npm run update-version <component> <type> <changes...>

Component: frontend | database | both
Type: major | minor | patch
Changes: List of changes (wrap multi-word changes in quotes)

Example:
npm run update-version frontend minor "Added new dashboard features" "Improved UI responsiveness"
  `);
  process.exit(1);
}

const [component, type, ...changes] = args;

if (!['frontend', 'database', 'both'].includes(component)) {
  console.error('Invalid component. Must be: frontend, database, or both');
  process.exit(1);
}

if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Invalid version type. Must be: major, minor, or patch');
  process.exit(1);
}

updateVersion(component as Component, type as VersionType, changes);
