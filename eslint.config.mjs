// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

// Integrate Prettier formatting rules with ESLint.
// Note: install dev dependencies to enable full integration:
// npm i -D prettier eslint-plugin-prettier eslint-config-prettier
export default withNuxt({
  // Tell ESLint to use the Prettier plugin (plugin package required)
  plugins: ['prettier'],
  rules: {
    // Enforce Prettier formatting as ESLint errors and use the same options as .prettierrc
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'lf'
      }
    ]
  }
})

