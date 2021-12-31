/**
 * env-cmd 注入 node 运行环境变量
 * - env-cmd 支持定义任意多的环境，env-cmd 支持定义任意多的环境，自动注入定义的环境变量，仅需在 package.json scripts 启动时，通过 -e 指定运行时对应的环境；
 * - https://github.com/toddbluhm/env-cmd
 *
 * Tips:
 *  1. 自定义的环境变量:
 *     - 如果你期望在 js 代码中读取，必须以 REACT_APP_ 打头，否则会被 CRA 脚手架经过内部处理忽略掉；
 *     - 如果仅仅在构建阶段使用，可以不使用 REACT_APP_ 前缀；
 *  2. CRA 内置的环境变量列表:
 *     - https://create-react-app.dev/docs/advanced-configuration
 */
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

const GIT_INFO = {
  REACT_APP_BRANCH: gitRevisionPlugin.branch(),
  REACT_APP_VERSION: gitRevisionPlugin.version(),
  REACT_APP_COMMIT_HASH: gitRevisionPlugin.commithash(),
}

module.exports = {
  development: {
    ...GIT_INFO,
    REACT_APP_BUILD_ENV: 'development',
    PUBLIC_URL: '',
    BUILD_PATH: 'build',
  },
  test: {
    ...GIT_INFO,
    REACT_APP_BUILD_ENV: 'test',
    PUBLIC_URL: '',
    BUILD_PATH: 'build',
    GENERATE_SOURCEMAP: false,
  },
  production: {
    ...GIT_INFO,
    REACT_APP_BUILD_ENV: 'production',
    PUBLIC_URL: '',
    BUILD_PATH: 'build',
    GENERATE_SOURCEMAP: false,
    BUILD_ANALYZER: true,
  },
}
