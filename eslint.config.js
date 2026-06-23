import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // --- أضف هذا القسم أدناه لإيقاف التحذيرات المزعجة ---
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // يخبره أن React موجود تلقائياً ولا داعي لاستدعائه
      'no-unused-vars': 'off',           // يوقف التحذير الخاص بالمتغيرات التي تم تعريفها ولم تُستخدم
    },
    // ------------------------------------------------
  },
])
