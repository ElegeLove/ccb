(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7822a92b"],{"661c":function(a,t,s){},bc8c:function(a,t,s){"use strict";var n=s("661c"),i=s.n(n);i.a},e7f8:function(a,t,s){"use strict";s.r(t);var n=function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("div",{attrs:{id:"mxStaffInfo"}},[s("a-breadcrumb",{attrs:{separator:" "}},[s("a-breadcrumb-item",[s("a-icon",{staticClass:"mx_header_icon",attrs:{type:"arrow-left"},on:{click:a.goback}})],1),s("a-breadcrumb-item",{staticClass:"mx_header_text"},[a._v("查看详情")])],1),s("a-skeleton",{attrs:{loading:a.loading,active:"",title:!1,paragraph:{rows:20}}},[s("div",{staticClass:"mx_main"},[s("a-row",[s("a-col",{attrs:{span:8}},[s("p",[a._v("\n                        姓  名：\n                        "),s("span",[a._v(a._s(a.staffList.title))])]),s("p",[a._v("\n                        性  别：\n                        "),s("span",[a._v(a._s(a.staffList.sex))])]),s("p",[a._v("\n                        年  龄：\n                        "),s("span",[a._v(a._s(a.staffList.age))])]),s("p",[a._v("\n                        职  位：\n                        "),s("span",[a._v(a._s(a.staffList.job_title))])]),s("p",[a._v("\n                        学  历：\n                        "),s("span",[a._v(a._s(a.staffList.education))])]),s("p",[a._v("\n                        入职日期：\n                        "),s("span",[a._v(a._s(a.staffList.join_time_str))])]),s("p",[a._v("\n                        联系地址：\n                        "),s("span",[a._v(a._s(a.staffList.location))])]),s("p",{staticClass:"mx_IDCard"},[a._v("\n                        身份证号：\n                        "),s("span",[a._v(a._s(a.staffList.card_id))])]),s("p",[a._v("\n                        健康证发证单位：\n                        "),s("span",[a._v(a._s(a.staffList.authority))])]),s("p",[a._v("\n                        健康证发证日期：\n                        "),s("span",[a._v(a._s(a.staffList.issuance_str))])]),s("p",{staticClass:"mx_addman"},[a._v("\n                        添  加  人：\n                        "),s("span",[a._v(a._s(a.userName))])]),s("p",[a._v("\n                        添加时间：\n                        "),s("span",[a._v(a._s(a.staffList.created_at))])])]),s("a-col",{attrs:{span:16}},[s("div",{staticClass:"clearfix"},[s("p",[a._v("人脸图片")]),s("viewer",[s("img",{attrs:{src:a.staffList.face_id_src,alt:"",srcset:""}})])],1),s("div",{staticClass:"clearfix mx_IDimg"},[s("p",[a._v("身份证正反面图片")]),s("viewer",a._l(a.staffList.card_photo_src,function(a){return s("img",{staticClass:"mx_IDPositive",attrs:{src:a.url,alt:"",srcset:""}})}),0)],1),s("div",{staticClass:"clearfix mx_HealthImg"},[s("p",[a._v("健康证图片")]),s("viewer",[s("img",{attrs:{src:a.staffList.health_cert_src,alt:"",srcset:""}})])],1)])],1)],1)])],1)},i=[],e=s("c1df"),r=s.n(e),c={data:function(){return{loading:!0,moment:r.a,staffList:{},userName:""}},mounted:function(){var a=this;this.userName=JSON.parse(localStorage.getItem("userInfo")).username,this.$get("api/school/staff/"+this.$route.query.staffId).then(function(t){0==t.data.code?(console.log(t),t.data.data.staff.join_time=r()(t.data.data.staff.join_time).format("YYYY-MM-DD"),t.data.data.staff.issuance=r()(t.data.data.staff.issuance).format("YYYY-MM-DD"),a.staffList=t.data.data.staff,a.loading=!1):console.log(22)})},methods:{goback:function(){window.history.back(-1)}}},f=c,_=(s("bc8c"),s("2877")),o=Object(_["a"])(f,n,i,!1,null,"a5e7cd30",null);t["default"]=o.exports}}]);
//# sourceMappingURL=chunk-7822a92b.52c51df2.js.map