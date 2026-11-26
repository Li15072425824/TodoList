import pluginVue from 'eslint-plugin-vue';
import skipPrettier from '@vue/eslint-config-prettier/skip-formatting';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 忽略文件
  {
    ignores: ['node_modules/**', 'dist/**', 'public/**'],
  },
  // 基础配置
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Vue 规则
  ...pluginVue.configs['flat/essential'],
  // Prettier 配置（放在最后以覆盖冲突规则）
  skipPrettier,
  // 自定义规则
  {
    rules: {
      'vue/multi-word-component-names': 'off', // 允许单个单词的组件名
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
];
