// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  // 在此处添加自定义规则
  rules: {
    // * 前面是否需要空格
    'generator-star-spacing': 'off',
    'no-console':0,// 0等价于off - 关闭这条检查规划  1 - 开启已警告提示  2 - 开启报错提示
    'no-alert':1,
    // 不准全局定义var
    'no-implicit-globals':1,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
