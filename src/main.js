import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import VueRouter from 'vue-router';
import Routers from './router';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import qs from 'qs';
import AMap from 'vue-amap';
import globalApi from './globalApi/globalApi';

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
Vue.component('chart', ECharts)

import Viewer from 'v-viewer'

import 'viewerjs/dist/viewer.css'

Vue.use(Viewer)

Viewer.setDefaults({

Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }

})

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
  
Vue.use(VueQuillEditor)

// import ECharts from 'vue-echarts'
// import 'echarts/lib/chart/line'
//注册到vue原型上

// Vue.component('chart', ECharts)

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(Antd);
Vue.use(AMap);
// const RouterConfig = {
//   routes: Routers
// };

// 接口请求1
Vue.prototype.$apiAxiox = (opt) => {
    // console.log(qs.stringify(opt.data));
    return new Promise((resolve, reject) => {
    axios({
        method: opt.method || "post",
        url: globalApi.BASE_URL + opt.url,
        data: qs.stringify(opt.data),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => {
        resolve(res)
      })
      .catch(function (err) {
        reject(err)
      });
  })
};

Vue.prototype.$get = function (api, data) {
  if (data === undefined) {
    data = {};
  }
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  var ox = axios.get(globalApi.BASE_URL + api, {
    params: data
  });
  return ox;
}
// Vue.prototype.$post = function (api, data) {
//     data = Qs.stringify(data);
//     var ox = axios.post(BASE_URL + api, data);
//     return ox;
// }
// 路由配置
const RouterConfig = {
  //mode: 'history',
  routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (localStorage.getItem('token') != undefined &&  localStorage.getItem('token') != '') { // 判断缓存里面是否有 userName  //在登录的时候设置它的值
      next();
    } else {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
  
});

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')