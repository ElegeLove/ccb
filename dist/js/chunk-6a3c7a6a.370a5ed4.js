(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a3c7a6a"],{"26bf":function(t,e,i){},"803b":function(t,e,i){"use strict";var a=i("d61d"),n=i.n(a);n.a},"85f2":function(t,e,i){t.exports=i("454f")},ac6a:function(t,e,i){for(var a=i("cadf"),n=i("0d58"),s=i("2aba"),o=i("7726"),c=i("32e9"),l=i("84f2"),r=i("2b4c"),d=r("iterator"),u=r("toStringTag"),h=l.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},m=n(p),f=0;f<m.length;f++){var g,v=m[f],x=p[v],y=o[v],b=y&&y.prototype;if(b&&(b[d]||c(b,d,h),b[u]||c(b,u,v),l[v]=h,x))for(g in a)b[g]||s(b,g,a[g],!0)}},bd86:function(t,e,i){"use strict";i.d(e,"a",function(){return s});var a=i("85f2"),n=i.n(a);function s(t,e,i){return e in t?n()(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}},c653:function(t,e,i){"use strict";var a=i("26bf"),n=i.n(a);n.a},d5fd:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"mx_Jpost"}},[t.uNull?i("div",{staticStyle:{display:"flex","align-items":"center","justify-content":"center",height:"600px","flex-direction":"column"}},[i("img",{staticStyle:{width:"170px",height:"170px"},attrs:{src:"http://img4.imgtn.bdimg.com/it/u=2618861512,4186491346&fm=26&gp=0.jpg",alt:""}}),i("p",{staticStyle:{"margin-top":"45px"}},[t._v("当前无任何职位权限，请联系管理员开通哦")])]):i("div",[t.addShow?i("div",[i("div",{staticClass:"back",on:{click:function(e){return t.jBack()}}},[i("a-icon",{staticStyle:{"font-size":"25px","font-weight":"bold","margin-right":"10px"},attrs:{type:"arrow-left"}}),i("p",[t._v("添加用户")])],1),i("a-form",{attrs:{form:t.form}},[i("div",{staticClass:"mx_txtBox",staticStyle:{"margin-left":"37px","margin-top":"40px"}},[i("p",{staticStyle:{color:"#000"}},[t._v("职位名称")]),i("a-form-item",{staticStyle:{width:"300px"}},[i("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["syCode",{rules:[{required:!0,message:"请填写职位名称"}]}],expression:"[\n\t\t\t\t\t\t\t\t\t\t\t  'syCode',\n\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t  rules: [\n\t\t\t\t\t\t\t\t\t\t\t\t  { required: true, message: '请填写职位名称'}]\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t]"}],attrs:{placeholder:"填写职位名称"}})],1)],1),i("div",{staticClass:"mx_txtBox",staticStyle:{"margin-left":"37px","margin-top":"40px"}},[i("p",{staticStyle:{color:"#000"}},[t._v("职位描述")]),i("a-textarea",{staticStyle:{width:"370px",height:"90px",resize:"none"},attrs:{placeholder:"填写职位描述"}})],1),i("div",{staticStyle:{position:"relative"}},[i("div",{staticClass:"mx_lBox",staticStyle:{"margin-top":"60px","margin-left":"37px"}},[i("p",{staticStyle:{color:"#000"}},[t._v("模块选择")]),i("a-form-item",{staticStyle:{width:"100%"}},[i("a-checkbox-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["etStem",{rules:[{required:!0,message:"请选择至少一个权限板块"}]}],expression:"[\n                                                'etStem',\n                                                {\n                                                    rules: [\n                                                        { required: true, message: '请选择至少一个权限板块'}\n                                                    ]\n                                                }\n                        ]"}],attrs:{options:t.mList},on:{change:t.onChange}})],1)],1)]),t.jlist?i("div",{staticClass:"box",staticStyle:{"margin-left":"37px",border:"1px solid #d9d9d9","border-radius":"5px",padding:"10px 0"}},t._l(t.cList,function(e,a){return i("div",{staticStyle:{"margin-left":"20px"}},[i("div",[i("div",{staticStyle:{display:"flex","align-items":"center"}},[i("a-checkbox",{attrs:{defaultChecked:e.check},on:{change:function(i){return t.cChange(e)}}}),i("p",{staticStyle:{"margin-bottom":"0","margin-left":"10px"}},[t._v(t._s(e.title))])],1),t._l(e.children,function(a,n){return e.children.length>0?i("div",{staticStyle:{"margin-left":"30px","margin-top":"10px"}},[i("div",{staticStyle:{display:"flex","align-items":"center"}},[i("a-checkbox",{attrs:{defaultChecked:a.check},on:{change:function(e){return t.cChange(a)}}}),i("p",{staticStyle:{"margin-bottom":"0","margin-left":"10px"}},[t._v(t._s(a.title))])],1),t._l(a.children,function(e,n){return a.children.length>0?i("div",{staticStyle:{"margin-left":"30px","margin-top":"10px"}},[i("div",{staticStyle:{display:"flex","align-items":"center"}},[i("a-checkbox",{attrs:{defaultChecked:e.check},on:{change:function(i){return t.cChange(e)}}}),i("p",{staticStyle:{"margin-bottom":"0","margin-left":"10px"}},[t._v(t._s(e.title))])],1),t._l(e.children,function(a,n){return e.children.length>0?i("div",{staticStyle:{"margin-left":"30px","margin-top":"10px"}},[i("div",{staticStyle:{display:"flex","align-items":"center"}},[i("a-checkbox",{attrs:{defaultChecked:a.check},on:{change:function(e){return t.cChange(a)}}}),i("p",{staticStyle:{"margin-bottom":"0","margin-left":"10px"}},[t._v(t._s(a.title))])],1)]):t._e()})],2):t._e()})],2):t._e()})],2)])}),0):t._e(),t.isUp?i("a-button",{staticClass:"mx_smBtn",staticStyle:{"margin-left":"37px","margin-top":"90px"},attrs:{type:"primary"},on:{click:function(e){return t.check("add")}}},[t._v("立即添加")]):i("a-button",{staticClass:"mx_smBtn",staticStyle:{"margin-left":"37px","margin-top":"90px"},attrs:{type:"primary"},on:{click:function(e){return t.check("up")}}},[t._v("更新保存")])],1)],1):i("div",[i("div",{staticStyle:{display:"flex","align-items":"center","margin-top":"25px"}},[i("p",{staticStyle:{"margin-bottom":"0","padding-right":"20px"}},[t._v("用户：")]),i("a-input",{staticStyle:{width:"248px","margin-right":"25px"},attrs:{placeholder:"用户名/职位/账号"},model:{value:t.someVal,callback:function(e){t.someVal=e},expression:"someVal"}}),i("a-button",{attrs:{type:"primary"}},[t._v("搜索")])],1),i("div",{staticStyle:{"margin-top":"35px"}},[i("a-button",{staticStyle:{"margin-right":"30px"},attrs:{type:"primary",icon:"user-add"},on:{click:t.addUser}},[t._v("添加用户")]),i("a-button",{staticStyle:{"margin-right":"12px"},on:{click:function(e){return t.action("stop")}}},[t._v("批量停用")]),i("a-button",{staticStyle:{"margin-right":"12px"},on:{click:function(e){return t.action("open")}}},[t._v("批量启用")]),i("a-button",{on:{click:function(e){return t.action("remove")}}},[t._v("批量删除")])],1),t.upData?i("a-table",{staticStyle:{"margin-top":"35px"},attrs:{rowSelection:t.rowSelection,bordered:"",columns:t.columns,dataSource:t.data,pagination:t.pagination},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"txt",fn:function(e,a){return i("p",{staticStyle:{"max-width":"200px",overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap",margin:"0 auto"}},[t._v(t._s(e))])}},{key:"state",fn:function(e,a,n){return i("a-switch",{attrs:{checkedChildren:"开",unCheckedChildren:"关",defaultChecked:e},on:{change:function(e){return t.swOpen(e,n)}}})}},{key:"btn",fn:function(e,a,n){return i("div",{staticStyle:{display:"flex","align-items":"center","justify-content":"center"}},[i("p",{staticStyle:{cursor:"pointer","margin-bottom":"0","margin-right":"10px",color:"#02bb72"},on:{click:function(e){return t.modify(a)}}},[t._v("编辑")]),i("p",{staticStyle:{cursor:"pointer","margin-bottom":"0",color:"#02bb72"},on:{click:function(e){return t.remove(n)}}},[t._v("删除")])])}}],null,!1,961891054)}):t._e()],1)]),i("a-modal",{attrs:{title:t.title},model:{value:t.addFood,callback:function(e){t.addFood=e},expression:"addFood"}},[i("div",{staticClass:"wrap",staticStyle:{height:"150px",display:"flex","align-items":"center","justify-content":"center"}},[i("p",[t._v(t._s(t.tKtxt))])]),t.isR?i("template",{slot:"footer"},[i("a-button",{key:"back",on:{click:function(e){return t.aRve("NO")}}},[t._v("取消")]),i("a-button",{key:"submit",attrs:{type:"primary"},on:{click:function(e){return t.aRve("OK")}}},[t._v("确认")])],1):i("template",{slot:"footer"},[i("a-button",{key:"back",on:{click:function(e){return t.aBack("NO")}}},[t._v("取消")]),i("a-button",{key:"submit",attrs:{type:"primary"},on:{click:function(e){return t.aBack("OK")}}},[t._v("确认")])],1)],2),i("a-modal",{attrs:{title:"确认保存"},model:{value:t.addFood2,callback:function(e){t.addFood2=e},expression:"addFood2"}},[i("div",{staticClass:"wrap",staticStyle:{height:"150px",display:"flex","align-items":"center","justify-content":"center"}},[i("p",[t._v("更新保存后配置该职位的用户也将跟随发生改变")])]),i("template",{slot:"footer"},[i("a-button",{key:"back",on:{click:function(e){return t.Back("NO")}}},[t._v("取消")]),i("a-button",{key:"submit",attrs:{type:"primary"},on:{click:function(e){return t.Back("OK")}}},[t._v("确认")])],1)],2)],1)},n=[],s=i("bd86"),o=(i("ac6a"),{data:function(){var t=this;return{uNull:!1,someVal:"",columns:[{title:"名称",dataIndex:"name",width:"115",align:"center"},{title:"描述",dataIndex:"txt",width:"350",align:"center",scopedSlots:{customRender:"txt"}},{title:"创建人",dataIndex:"userName",width:"95",align:"center"},{title:"创建时间",dataIndex:"sTime",width:"155",align:"center"},{title:"状态",dataIndex:"state",width:"115",align:"center",scopedSlots:{customRender:"state"}},{title:"按钮",dataIndex:"btn",width:"155",align:"center",scopedSlots:{customRender:"btn"}}],data:[{key:"1",name:"郎岩",txt:"校长拥有全部权限，三年一换",userName:"超级管理员",sTime:"2019-07-06   15:25",state:!0},{key:"2",name:"杭健雯",txt:"校长拥有全部权限，三年一换",userName:"超级管理员",sTime:"2019-07-06   15:25",state:!1},{key:"3",name:"孟琬",txt:"校长拥有全部权限，三年一换",userName:"超级管理员",sTime:"2019-07-06   15:25",state:!1}],pagination:{pageSize:10,current:1,showSizeChanger:!0,showQuickJumper:!0,pageSizeOptions:["10","20"],showSizeChange:function(e,i){return t.pagination.pageSize=i},showTotal:function(e){return"共 ".concat(e," 条记录 第 ").concat(t.pagination.current," / ").concat(Math.ceil(e/t.pagination.pageSize)," 页")}},upData:!0,addShow:!1,form:this.$form.createForm(this),mList:[{label:"巡查面板",value:1,disabled:!1},{label:"学校信息管理",value:2,disabled:!1},{label:"学生管理",value:3,disabled:!1},{label:"食堂管理",value:4,disabled:!1},{label:"营养食谱",value:5,disabled:!1},{label:"安全卫生",value:6,disabled:!1},{label:"采购管理",value:7,disabled:!1},{label:"食材选购",value:8,disabled:!1},{label:"食材库管理",value:9,disabled:!1},{label:"过期预警",value:10,disabled:!1},{label:"直播监控",value:11,disabled:!1},{label:"权限管理",value:12,disabled:!1},{label:"通知公告",value:13,disabled:!1},,{label:"数据统计",value:14,disabled:!1}],value:[],jlist:!1,cList:[{title:"首页",check:!0,children:[{title:"快捷操作",check:!1,children:[{title:"后台首页",check:!1,children:[{title:"文件上传",check:!1},{title:"检测版本更新",check:!1}]},{title:"个人设置",check:!1,children:null},{title:"清空缓存",check:!1,children:null},{title:"消息中心",check:!1,children:[{title:"删除",check:!1},{title:"启用",check:!1}]}]}]}],isUp:!1,addFood:!1,addFood2:!1,title:"",tKtxt:"",isR:!1,tState:!1,oKlist:[]}},methods:Object(s["a"])({addUser:function(){this.isUp=!0,this.addShow=!this.addShow},action:function(t){var e=this;if("stop"==t){if(this.oKlist.length<=0)return void this.$message.warning("当前未选择");this.upData=!1,setTimeout(function(){e.data.forEach(function(t,i){i==e.oKlist[i]-1&&1==t.state&&(t.state=!1)}),e.upData=!0,e.$message.success("批量停用用户成功")})}if("open"==t)return this.oKlist.length<=0?void this.$message.warning("当前未选择"):(this.upData=!1,void setTimeout(function(){e.data.forEach(function(t,i){i==e.oKlist[i]-1&&0==t.state&&(t.state=!0)}),e.upData=!0,e.$message.success("批量启用用户成功")}));if("remove"==t){if(this.oKlist.length<=0)return void this.$message.warning("当前未选择");this.upData=!1;for(var i=this.oKlist.length;i>0;i--)this.data.splice(this.oKlist[i]-1,1);return setTimeout(function(){e.upData=!0}),void this.$message.success("批量删除用户成功")}},handleTableChange:function(t,e,i){this.pagination.pageSize=t.pageSize,this.pagination.current=t.current},swOpen:function(t,e){this.isR=!1,this.index=e,this.tState=!t,1==t?(this.$message.success("启用用户成功"),this.data[e].state=t):(this.addFood=!0,this.title="确认停用",this.tKtxt="停用后用户将无法正常登录，是否继续？")},jBack:function(){this.addShow=!this.addShow},onChange:function(t){this.value=t},check:function(t){var e=this,i=this,a=["etStem","syCode"];this.form.validateFields(a,function(a,n){if(!a)if("add"==t){var s=i.data.length;console.log(s);var o={key:s+1,name:"校长",txt:"校长拥有全部权限三年一换啊啊啊啊...",userName:"超级管理员",sTime:"2019-07-06   15:25",state:!1};i.data.push(o),e.$message.success("添加职位成功")}else e.addFood2=!0})},cChange:function(t){t.check=!t.check},modify:function(){this.isUp=!1,this.addShow=!this.addShow},aBack:function(t){var e=this;this.addFood=!1,"OK"==t?(this.data[this.index].state=this.tState,this.data.splice(this.index,1)):(this.upData=!1,setTimeout(function(){e.$set(e.data[e.index],"state",e.tState),e.upData=!0}))},aRve:function(t){this.addFood=!1,"OK"==t&&this.data.splice(this.index,1)},Back:function(t){this.addFood2=!1,"OK"==t&&this.$message.success("编辑职位成功")},remove:function(t){this.isR=!0,this.addFood=!this.addFood,this.title="确认删除",this.tKtxt="删除后用户将无法正常登录，是否继续？",this.index=t}},"action",function(t){var e=this;if("stop"==t){if(this.oKlist.length<=0)return void this.$message.warning("当前未选择");this.upData=!1,setTimeout(function(){e.oKlist.forEach(function(t,i){e.data.forEach(function(e,i){i==t-1&&1==e.state&&(e.state=!1)})}),console.log(e.data),e.upData=!0,e.$message.success("批量停用用户成功")})}if("open"==t)return this.oKlist.length<=0?void this.$message.warning("当前未选择"):(this.upData=!1,void setTimeout(function(){e.oKlist.forEach(function(t,i){e.data.forEach(function(e,i){i==t-1&&0==e.state&&(e.state=!0)})}),e.upData=!0,e.$message.success("批量启用用户成功")}));if("remove"==t){if(this.oKlist.length<=0)return void this.$message.warning("当前未选择");this.upData=!1;for(var i=this.oKlist.length;i>0;i--)this.data.splice(this.oKlist[i-1]-1,1),console.log(this.data);return setTimeout(function(){e.upData=!0}),void this.$message.success("批量删除用户成功")}}),computed:{rowSelection:function(){var t=this;this.selectedRowKeys;return{onChange:function(e,i){t.oKlist=e,console.log(t.oKlist)}}}},watch:{value:function(t,e){t.length>0?this.jlist=!0:this.jlist=!1}}}),c=o,l=(i("803b"),i("c653"),i("2877")),r=Object(l["a"])(c,a,n,!1,null,"cdf52c3a",null);e["default"]=r.exports},d61d:function(t,e,i){}}]);
//# sourceMappingURL=chunk-6a3c7a6a.370a5ed4.js.map