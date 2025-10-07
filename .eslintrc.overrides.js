// Configuration ESLint pour ignorer certains warnings spécifiques
module.exports = {
  rules: {
    // Autoriser les paramètres avec underscore à ne pas être utilisés
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }
    ]
  }
}