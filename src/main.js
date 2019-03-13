/*CSS*/
import 'css/reset.css'
import 'css/common.css'

/*基本依赖*/
import Vue from 'vue'
import App from './app'
import store from './store'
import router from './routers'

import "lib/rem" // 移动端独有 rem
import 'lib/favicon' //
import 'lib/global'//websockt tool 的全局安装

/* 插件 */
import './lib/directive'// 全局指令
import 'lib/polyfill' // ES6 新API的支持
import ES6Promise from 'es6-promise' // 使得IE支持 promise
import FormItem from "components/form_item"//input 表单插件
import FormSelect from "components/form_select"//select 表单插件
import Loading from 'components/loading'//全局loading
import Pagination from 'components/pagination'//分页插件
import msg from 'components/msg'
import Dialog from "components/dialog"
import api from 'lib/api'

/* 路由卫士 */
import navigationGuards from "./lib/navigation_guards"

Vue.prototype.$api = api
Vue.prototype.msg = msg
Vue.use(FormItem)//input 表单插件
Vue.use(FormSelect)//select 表单插件
Vue.use(Loading)//全局loading
Vue.use(Pagination)//分页插件
Vue.use(Dialog)//Dialog
ES6Promise.polyfill()// 使得IE支持 promise
navigationGuards(router, store, msg)// 路由卫士 

Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

window.getDeviceInfoResult = function(res){
    // alert(res)
}