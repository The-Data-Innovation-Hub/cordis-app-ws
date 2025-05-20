#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSION_FILE_PATH = path.join(path.dirname(__dirname), 'src', 'lib', 'constants', 'versions.ts');

function incrementVersion(version, type) {
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

async function readVersionFile() {
  const content = await fs.readFile(VERSION_FILE_PATH, 'utf-8');
  
  // Extract the version information using regex
  const appVersionMatch = content.match(/export const APP_VERSION = ({[\s\S]*?});/);
  const versionHistoryMatch = content.match(/export const VERSION_HISTORY = ({[\s\S]*?});/);
  
  if (!appVersionMatch || !versionHistoryMatch) {
    throw new Error('Could not parse version file');
  }
  
  // Parse the extracted JSON by evaluating it as JavaScript
  const APP_VERSION = eval(`(${appVersionMatch[1]})`);
  const VERSION_HISTORY = eval(`(${versionHistoryMatch[1]})`);
  
  return { APP_VERSION, VERSION_HISTORY };
}

async function writeVersionFile(appVersion, versionHistory) {
  const content = `export const APP_VERSION = ${JSON.stringify(appVersion, null, 2)};

export const VERSION_HISTORY = ${JSON.stringify(versionHistory, null, 2)};
`;
  await fs.writeFile(VERSION_FILE_PATH, content, 'utf-8');
}

async function updateVersion(component, type, changes) {
  try {
    // Read current versions
    const { APP_VERSION, VERSION_HISTORY } = await readVersionFile();
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const commitMessages = [];

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

updateVersion(component, type, changes);
