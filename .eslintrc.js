const isCI = process.env.CI === 'true'

module.exports = {
  extends: ['expo', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['jest', '@typescript-eslint', 'prettier'],
  rules: {
    'jest/no-focused-tests': isCI ? 'error' : 'off',
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['example/**/*', 'build/**/*', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
}
