(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-384f72f0"],{"0e2b":function(t,e,a){},"6a6e":function(t,e,a){"use strict";var s=a("fa65"),r=a.n(s);r.a},"6e29":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main user-layout-register"},[a("div",{staticClass:"frame",attrs:{id:"frame"}},[a("a-form",{ref:"formRegister",attrs:{form:t.form,id:"formRegister"}},[a("div",{staticClass:"imgbOX"},[a("P",[t._v("短信验证修改密码")])],1),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.PwShow,expression:"!PwShow"}],staticClass:"phone"},[a("a-form-item",[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["mobile",{rules:[{required:!0,message:"请输入正确的手机号",pattern:/^1[3456789]\d{9}$/},{validator:this.handlePhoneCheck}],validateTrigger:["change","blur"]}],expression:"[\n\t\t\t\t\t\t\t\t\t\t  'mobile',\n\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t  rules: [\n\t\t\t\t\t\t\t\t\t\t\t  { required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\\d{9}$/ },\n\t\t\t\t\t\t\t\t\t\t\t  { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur']\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t]"}],attrs:{size:"large",placeholder:"11 位手机号"}},[a("a-select",{attrs:{slot:"addonBefore",size:"large",defaultValue:"+86"},slot:"addonBefore"},[a("a-select-option",{attrs:{value:"+86"}},[t._v("+86")]),a("a-select-option",{attrs:{value:"+87"}},[t._v("+87")])],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{staticClass:"gutter-row",attrs:{span:16}},[a("a-form-item",[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["captcha",{rules:[{required:!0,message:"请输入验证码"},{validator:this.handleVfCheck}],validateTrigger:["change","blur"]}],expression:"[\n\t\t\t\t\t\t\t\t\t\t\t\t  'captcha',\n\t\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t\t  rules: [\n\t\t\t\t\t\t\t\t\t\t\t\t\t  { required: true, message: '请输入验证码'},\n\t\t\t\t\t\t\t\t\t\t\t\t\t  { validator: this.handleVfCheck } ], validateTrigger: ['change', 'blur']\n\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t]"}],ref:"vFcode",attrs:{size:"large",type:"text",placeholder:"验证码"}},[a("a-icon",{style:{color:"rgba(0,0,0,.25)"},attrs:{slot:"prefix",type:"mail"},slot:"prefix"})],1)],1)],1),a("a-col",{staticClass:"gutter-row",attrs:{span:8}},[a("a-button",{staticClass:"getCaptcha",attrs:{size:"large",disabled:t.state.smsSendBtn},domProps:{textContent:t._s(t.state.smsSendBtn?t.state.time+" s":"获取验证码")},on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.getCaptcha(e)}}})],1)],1),a("a-form-item",{staticClass:"next"},[a("a-button",{staticClass:"register-button",attrs:{size:"large",type:"primary",htmlType:"submit",loading:t.registerBtn,disabled:t.registerBtn},on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.handleSubmit(e)}}},[t._v("下一步\n\t\t\t\t\t")])],1)],1),a("div",{directives:[{name:"show",rawName:"v-show",value:t.PwShow,expression:"PwShow"}],staticClass:"PwBox"},[a("a-popover",{attrs:{placement:"rightTop",trigger:"click",visible:t.state.passwordLevelChecked}},[a("template",{slot:"content"},[a("div",{style:{width:"240px"}},[a("div",{class:["user-register",t.passwordLevelClass]},[t._v("强度："),a("span",[t._v(t._s(t.passwordLevelName))])]),a("a-progress",{attrs:{percent:t.state.percent,showInfo:!1,strokeColor:t.passwordLevelColor}}),a("div",{staticStyle:{"margin-top":"10px"}},[a("span",[t._v("请至少输入 6 个字符。请不要使用容易被猜到的密码。")])])],1)]),a("a-form-item",[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:"至少6位密码，区分大小写"},{validator:this.handlePasswordLevel}],validateTrigger:["change","blur"]}],expression:"[\n\t\t\t\t\t\t\t\t'password',\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\trules: [{ required: true, message: '至少6位密码，区分大小写'},\n\t\t\t\t\t\t\t\t\t{ validator: this.handlePasswordLevel}], validateTrigger: ['change', 'blur']\n\t\t\t\t\t\t\t\t}]"}],attrs:{size:"large",type:"password",autocomplete:"false",placeholder:"至少6位密码，区分大小写"},on:{click:t.handlePasswordInputClick,blur:function(e){return e.preventDefault(),t.blurFn(e)}}})],1)],2),a("a-form-item",[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["password2",{rules:[{required:!0,message:"至少6位密码，区分大小写"},{validator:this.handlePasswordCheck}],validateTrigger:["change","blur"]}],expression:"[\n\t\t\t\t\t\t\t'password2',\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\trules: [{ required: true, message: '至少6位密码，区分大小写'},\n\t\t\t\t\t\t\t\t{ validator: this.handlePasswordCheck}], validateTrigger: ['change', 'blur']\n\t\t\t\t\t\t\t}]"}],attrs:{size:"large",type:"password",autocomplete:"false",placeholder:"确认密码"}})],1),a("a-form-item",{staticClass:"next"},[a("a-button",{staticClass:"register-button",attrs:{size:"large",type:"primary",htmlType:"submit",loading:t.registerBtn,disabled:t.registerBtn},on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.handleSubmit2(e)}}},[t._v("确定\n\t\t\t\t\t")])],1)],1),a("router-link",{staticClass:"login",attrs:{to:{name:"login"}}},[t._v("点击返回登录>>")])],1)],1)])},r=[],i=a("8de6"),o=a("bc3a"),n=a.n(o),l=a("4328"),d=a.n(l),c=(a("1c46"),{0:"低",1:"低",2:"中",3:"强"}),u={0:"error",1:"error",2:"warning",3:"success"},h={0:"#ff0000",1:"#ff0000",2:"#ff7e05",3:"#52c41a"},p={name:"Register",components:{},data:function(){return{form:this.$form.createForm(this),state:{time:60,smsSendBtn:!1,passwordLevel:0,passwordLevelChecked:!1,percent:10,progressColor:"#FF0000"},iphone:0,reCode:"",registerBtn:!1,vFCode:"",cFPwd:"",Strength:!1,pwdFit:!1,PwShow:!1}},computed:{passwordLevelClass:function(){return u[this.state.passwordLevel]},passwordLevelName:function(){return c[this.state.passwordLevel]},passwordLevelColor:function(){return h[this.state.passwordLevel]}},created:function(){this.PwShow=!1},methods:{handlePasswordLevel:function(t,e,a){var s=0;/[0-9]/.test(e)&&s++,/[a-zA-Z]/.test(e)&&s++,/[^0-9a-zA-Z_]/.test(e)&&s++,this.state.passwordLevel=s,this.state.percent=30*s,e.length<6&&(a(new Error("密码长度不够")),this.Strength=!1),s>=2?(s>=3&&(this.state.percent=100),this.cFPwd=e,this.Strength=!0,a()):(0===s&&(this.state.percent=10),this.Strength=!1,a(new Error("密码强度不够")))},handlePasswordCheck:function(t,e,a){var s=this.form.getFieldValue("password2");void 0===s&&(a(new Error("请输入密码")),this.pwdFit=!1),s!=this.cFPwd&&(a(new Error("两次密码不一致")),this.pwdFit=!1),s==this.cFPwd&&(this.pwdFit=!0),a()},handleVfCheck:function(t,e,a){var s=this.form.getFieldValue("captcha");void 0===e&&a(new Error("请输入验证码")),s!=this.vFCode&&a(new Error("验证码输入有误")),a()},handlePhoneCheck:function(t,e,a){a()},handlePasswordInputClick:function(){this.state.passwordLevelChecked=!0},blurFn:function(){this.state.passwordLevelChecked=!1},handleSubmit:function(){var t=this;this.form.validateFields(["captcha","mobile"],{force:!0},function(e,a){if(t.vFCode==a.captcha){var s={username:t.iphone,code:a.captcha};n()({method:"post",url:i["a"].BASE_URL+"api/auth/retrieval",data:d.a.stringify(s),headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}).then(function(e){if(console.log(e.data),"-1003"!=e.data.code)return 0==e.data.code?(t.reCode=e.data.data,void localStorage.setItem("retoken",e.data.data)):void 0;t.requestFailed(e.data.msg)}).catch(function(t){this.state.smsSendBtn=!1,console.log(t)}),t.PwShow=!0}})},handleSubmit2:function(){var t=this;if(this.getCaptcha(),this.state.smsSendBtn=!0,this.Strength&&this.pwdFit){var e={url:"api/auth/repass",data:{repassword:this.cFPwd,retoken:localStorage.getItem("retoken")}};this.$apiAxiox(e).then(function(e){0==e.data.code?(console.log(111),t.$router.push({name:"registerResult"})):t.$notification["error"]({message:"错误",description:e.data.msg,duration:4})})}},getCaptcha:function(t){var e=this;t.preventDefault();this.form.validateFields(["mobile"],{force:!0},function(t,a){if(!t){e.state.smsSendBtn=!0;var s=e.$message.loading("验证码发送中..",0);e.iphone=a.mobile;var r={username:a.mobile};n()({method:"post",url:i["a"].BASE_URL+"api/auth/code",data:d.a.stringify(r),headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}).then(function(t){if(e.state.smsSendBtn=!1,setTimeout(s,10),"-1003"!=t.data.code)return 0==t.data.code?(e.vFCode=t.data.data,void e.loginSuccess(t.data.data)):void 0;e.requestFailed(t.data.msg)}).catch(function(t){this.state.smsSendBtn=!1,console.log(t)})}})},requestFailed:function(t){this.$notification["error"]({message:"错误",description:t||"请求出现错误，请稍后再试",duration:4}),this.registerBtn=!1},loginSuccess:function(t){var e=this;setTimeout(function(){e.$notification.success({message:"验证码发送成功！",description:t})},1e3)}},watch:{"state.passwordLevel":function(t){}}},v=p,m=(a("8feb"),a("6a6e"),a("2877")),g=Object(m["a"])(v,s,r,!1,null,"6d44f841",null);e["default"]=g.exports},"8feb":function(t,e,a){"use strict";var s=a("0e2b"),r=a.n(s);r.a},fa65:function(t,e,a){}}]);
//# sourceMappingURL=chunk-384f72f0.51e572bf.js.map