import axios from 'axios'
import qs from 'qs'

const BASE_URL = 'http://bate.ccb.micmio.com/'; // 开发环境
//封装请求方法
// export function formatReq(type, url, data) {
//     setToken();
//     return new Promise((reslove, reject) => {
//       axios({
//         method: type,
//         url: BASE_URL+url,
//         headers: {
//           //这里的请求头与后台商量设置
//           'content-Type': 'application/x-www-form-urlencoded'
//         },
//         cancelToken: source.token,
//         data: qs.stringify(data) //java后台用qs转
//         // data:JSON.stringify(data)//PHP后台用JSON转
//       })
//         .then(r => {
//           store.commit('UPDATE_LOADING', false); //隐藏loading
//           //这里可以添加指定对应状态码的处理方式,比如登陆过期,res.data.code === '6666' 路由跳转到login
//           reslove(r);
//         })
//         .catch(e => {
//           store.commit('UPDATE_LOADING', false); //隐藏loading
//           reject(e.message);
//           Message.error(e.message);
//         });
//     });
//   }

// export var getApi = function (api, data) {
//     if (data === undefined) {
//         data = {};
//     }
//     var ox = axios.get(BASE_URL + api, {
//         params: data
//     });
//     return ox;
// }
// export var postApi = function (api, data) {
//     data = Qs.stringify(data);
//     var ox = axios.post(BASE_URL + api, data);
//     return ox;
// }

// const BASE_URL = 'http://ccb.micmio.com/'; // 正式环境
// export function fetch(url, params = {},headers = {}) {
//     return new Promise((resolve, reject) => {
//         axios.get(BASE_URL + url, {
//                 params: params
//             },{headers:headers}
//             )
//             .then(response => {
//                 if (response.data.code === 200) {
//                     //返回成功处理  这里传的啥 后续调用的时候 res就是啥
//                     resolve(response.data.data); //我们后台所有数据都是放在返回的data里所以这里统一处理了
//                 } else {
//                     //错误处理
//                     Toast(response.data.msg)
//                 }
//             })
//             .catch(err => {
//                 reject(err);
//                 let message = '请求失败！请检查网络';
//                 //错误返回
//                 if (err.response) message = err.response.data.message;
//                 Toast(message)
//             })
//     })
// }

// /**
//  * 封装post请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function post(url, data = {},headers = {}) {
//     return new Promise((resolve, reject) => {
//         axios.post(BASE_URL + url, data,{headers:headers})
//             .then(response => {
//                 if (response.data.code === 200) {
//                     resolve(response.data.data);
//                 } else {
//                     Toast(response.data.msg)
//                 }
//             }, err => {
//                 reject(err);
//                 let message = '请求失败！请检查网络';
//                 if (err.response) message = err.response.data.message;
//                 Toast(message)
//             })
//     })
// }

// /**
//  * 封装patch请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function patch(url, data = {},headers = {}) {
//     return new Promise((resolve, reject) => {
//         axios.patch(BASE_URL + url, data,{headers:headers})
//             .then(response => {
//                 if (response.data.code === 200) {
//                     resolve(response.data.data);
//                 } else {
//                     Toast(response.data.msg)
//                 }
//             }, err => {
//                 reject(err);
//                 let message = '请求失败！请检查网络';
//                 if (err.response) message = err.response.data.message;
//                 Toast(message)
//             })
//     })
// }

// /**
//  * 封装put请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function put(url, data = {},headers = {}) {
//     return new Promise((resolve, reject) => {
//         axios.put(BASE_URL + url, data,{headers:headers})
//             .then(response => {
//                 if (response.data.code === 200) {
//                     resolve(response.data.data);
//                 } else {
//                     Toast(response.data.msg)
//                 }
//             }, err => {
//                 reject(err);
//                 let message = '请求失败！请检查网络';
//                 if (err.response) message = err.response.data.message;
//                 Toast(message)
//             })
//     })
// }

// export function del(url, data = {},headers = {}) {
//     return new Promise((resolve, reject) => {
//         axios.delete(BASE_URL + url, data,{headers:headers})
//             .then(response => {
//                 if (response.data.code === 200) {
//                     resolve(response.data.data);
//                 } else {
//                     Toast(response.data.msg)
//                 }
//             }, err => {
//                 reject(err);
//                 let message = '请求失败！请检查网络';
//                 if (err.response) message = err.response.data.message;
//                 Toast(message)
//             })
//     })
// }
export default {
    BASE_URL
};
// export getApi;
// export  postApi;