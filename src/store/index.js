import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 通过一个webpack的api——require.context去获取指定上下文，来实行自动化导入模块，避免了通过import导入。
const modulesFiles = require.context('./modules', true, /\.js$/)

// 通过require.context来实现自动化导入模块，你不需要再通过import导入modules目录下的module
// keys+reduce是依次遍历出模块名
console.log(modulesFiles)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // 通过过滤出modulePath, 例如将./app.js过滤为 => app，存进moduleName。
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  // 通过modulesFiles方法获取到模块中的包括state、action、getters、mutations等，存放到value对象中。
  const value = modulesFiles(modulePath)
  // 最终存放在json对象modules中，一模块名称为key，对于模块的store作为对象存储。
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
