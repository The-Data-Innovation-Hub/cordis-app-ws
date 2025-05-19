# Cordis Brand Management

A modern brand management platform with analytics and insights, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 Authentication with Supabase
- 📊 Interactive dashboards with charts
- 🎨 Neumorphic UI design
- 🌓 Light/Dark mode
- 📱 Responsive design
- 🚀 Optimized for performance

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and database)

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/The-Data-Innovation-Hub/cordis-app.git
   cd cordis-brand-management
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://cslxynhkqqqczhaltlim.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbHh5bmhrcXFxY3poYWx0bGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTU3OTMsImV4cCI6MjA2MzA3MTc5M30.k_BDJ-bHZqrwE7L5N2NcrsSuBRVnQAcxqSmWhYi85IA
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Scripts

- `dev`: Start development server
- `build`: Create an optimized production build
- `start`: Start production server
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `type-check`: Check TypeScript types

## 🎨 Styling

This project uses Tailwind CSS for styling. You can find the configuration in `tailwind.config.ts`.

### Theme Colors

- Primary: `#0089AD`
- Secondary: `#000000`
- Background: `#FFFFFF`

## 🧪 Testing

To run tests:

```bash
npm run test
# or
yarn test
```

## 🧑‍💻 Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Husky for git hooks
- Lint-staged for running linters on git staged files

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Project Structure

```
src/
├── app/                    # App router
├── components/             # Reusable UI components
│   └── ui/                 # Shadcn/ui components
├── lib/                    # Utility functions and configurations
│   └── supabase/           # Supabase client configuration
├── context/                # React context providers
├── hooks/                  # Custom React hooks
└── styles/                 # Global styles
```
MIT
6 