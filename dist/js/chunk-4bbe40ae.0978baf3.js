(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4bbe40ae"],{"0bfb":function(t,e,a){"use strict";var n=a("cb7c");t.exports=function(){var t=n(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},2108:function(t,e,a){},3846:function(t,e,a){a("9e1e")&&"g"!=/./g.flags&&a("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:a("0bfb")})},"509d":function(t,e,a){"use strict";a.r(e);for(var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"mxWarehouseMngmt"}},[a("a-form",{staticClass:"mx_form",attrs:{layout:"inline"}},[a("a-form-item",{attrs:{label:"食堂："}},[a("a-select",{staticStyle:{width:"150px"},attrs:{value:t.canteenKey},on:{change:t.selectChange}},t._l(t.canteen,function(e,n){return a("a-select-option",{key:n+1},[t._v(t._s(e.title))])}),1)],1)],1),a("div",{staticClass:"components-input-demo-presuffix"},[a("p",{staticClass:"hmTxt"},[t._v("仓库:")]),a("a-input",{ref:"userNameInput",staticClass:"seachBox",staticStyle:{width:"200px"},attrs:{placeholder:"仓库/管理员名称"},model:{value:t.mxClassVal,callback:function(e){t.mxClassVal=e},expression:"mxClassVal"}},[t.mxClassVal?a("a-icon",{staticStyle:{color:"#999"},attrs:{slot:"suffix",theme:"filled",type:"close-circle"},on:{click:t.emitEmpty},slot:"suffix"}):t._e()],1),a("a-button",{staticClass:"seachBtn",attrs:{type:"primary"},on:{click:t.mxSeach}},[t._v("搜索")])],1),a("div",{staticClass:"mx_btnGroup"},[a("a-button",{staticClass:"mx_creat_btn mx_btnbg",attrs:{type:"primary"},on:{click:t.mxAdd}},[a("a-icon",{attrs:{type:"user-add"}}),t._v("新建仓库\n        ")],1),a("div",{staticClass:"mx_btns"},[a("span",[t._v("打印")]),a("a-divider",{staticStyle:{background:"#000"},attrs:{type:"vertical"}}),a("span",[t._v("导出")])],1)],1),a("a-skeleton",{attrs:{loading:t.loading,active:"",title:!1,paragraph:{rows:12}}},[a("a-table",{attrs:{columns:t.columns,dataSource:t.data,bordered:"",pagination:t.pagination},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"operation",fn:function(e,n,i){return[a("div",{staticClass:"editable-row-operations"},[a("div",[a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxCheck(n.id)}}},[t._v("查看")]),a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxRevise(n,n.id)}}},[t._v("修改")]),a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxShowOffDuty(n.id)}}},[t._v("删除")]),a("a-modal",{attrs:{title:"确认删除",centered:"",maskStyle:{opacity:"0.1",background:"#000",animation:"none"},okText:"确认",cancelText:"取消"},on:{cancel:t.mxCelOffDuty,ok:t.mxOffDuty},model:{value:t.isOffDuty,callback:function(e){t.isOffDuty=e},expression:"isOffDuty"}},[a("div",{staticClass:"mx_model"},[a("div",{staticClass:"mx_model_main"},[t._v("是否确定删除该仓库？")])])]),a("a-modal",{attrs:{title:"无法删除",centered:"",maskStyle:{opacity:"0.1",background:"#000",animation:"none"}},model:{value:t.isdel,callback:function(e){t.isdel=e},expression:"isdel"}},[a("template",{slot:"footer"},[a("a-button",{key:"submit",attrs:{type:"primary"},on:{click:t.mxDel}},[t._v("我知道了")])],1),a("div",{staticClass:"mx_model"},[a("div",{staticClass:"mx_model_main"},[t._v("请将仓库中食材移库后再进行操作")])])],2)],1)])]}}])})],1)],1)},i=[],s=(a("ac6a"),a("6b54"),a("1c46"),[{title:"食堂",dataIndex:"canteen_title",align:"center",width:"13%",scopedSlots:{customRender:"canteen_title"}},{title:"仓库名称",dataIndex:"warehouse",align:"center",width:"13%",scopedSlots:{customRender:"warehouse"}},{title:"储存类别",dataIndex:"greats_str",align:"center",width:"15%",scopedSlots:{customRender:"greats_str"}},{title:"仓库地址",dataIndex:"location",align:"center",width:"20%",scopedSlots:{customRender:"location"}},{title:"管理员",dataIndex:"lead",align:"center",width:"13%",scopedSlots:{customRender:"lead"}},{title:"联系电话",dataIndex:"lead_phone",align:"center",width:"13%",scopedSlots:{customRender:"lead_phone"}},{title:"操作按钮",dataIndex:"operation",align:"center",scopedSlots:{customRender:"operation"}}]),o=[],c=0;c<10;c++){var l,r;l=c%2==0?["肉禽蛋类","蔬菜素食"]:["海鲜鱼类","水果饮品"],r=c<2?"食堂1":c<4?"食堂2":c<6?"食堂3":c<8?"食堂4":"食堂5",o.push({key:c.toString(),canteen_title:"".concat(r),warehouse:"聚宝盆".concat(c,"号 "),greats_str:"".concat(l),location:"食堂".concat(c,"左转上2楼3-").concat(c),lead:"采购员".concat(c),lead_phone:"1354625368".concat(c)})}var u={data:function(){var t=this;return{loading:!0,data:o,columns:s,canteen:[],canteenKey:"全部",canteenId:0,pagination:{pageSize:10,current:1,total:0,showSizeChanger:!1,showQuickJumper:!0,showTotal:function(e){return"共 ".concat(e," 条记录 第 ").concat(t.pagination.current," / ").concat(Math.ceil(e/t.pagination.pageSize)," 页")}},isOffDuty:!1,isdel:!1,mxClassVal:"",isOffDutyId:"",storeClass:[]}},mounted:function(){this.getCanteen(),this.getHouseList("","")},methods:{goback:function(){window.history.back(-1)},getCanteen:function(){var t=this;this.$get("api/school/canteen",{}).then(function(e){if(0==e.data.code){t.canteen=e.data.data;var a={id:0,title:"全部"};t.canteen.splice(0,0,a)}else console.log(22)})},selectChange:function(t){this.canteenKey=t,this.canteenId=this.canteen[t-1].id},mxSeach:function(){this.loading=!0,this.getHouseList(this.canteenId,this.mxClassVal)},emitEmpty:function(){this.$refs.userNameInput.focus(),this.mxClassVal=""},mxAdd:function(){this.$router.push({path:"/mxAddWarehouse"})},mxCheck:function(t){this.$router.push({path:"/mxWarehouseView",query:{id:t}})},mxRevise:function(t,e){this.$router.push({path:"/mxUpdataMngmnt",query:{data:t,id:e}})},handleTableChange:function(t,e,a){this.pagination.pageSize=t.pageSize,this.pagination.current=t.current},getHouseList:function(t,e){var a=this,n=this;this.$get("api/school/store?page="+this.pagination.current+"&canteen_id="+t+"&key_word="+e).then(function(t){n.pagination.pageSize=t.data.data.per_page,n.pagination.total=t.data.data.total,0==t.data.code?(t.data.data.data.forEach(function(t){t.key=t.id,t.warehouse=t.title}),a.data=t.data.data.data,a.loading=!1):console.log(22)})},mxShowOffDuty:function(t){this.isOffDuty=!0,this.isOffDutyId=t},mxCelOffDuty:function(){this.isOffDuty=!1},mxOffDuty:function(){var t=this;this.isOffDuty=!1;var e={url:"api/school/store/"+this.isOffDutyId,method:"delete",data:{}};this.$apiAxiox(e).then(function(e){0==e.data.code?(t.$message.success("删除成功"),t.getHouseList("","")):t.isdel=!0})},mxDel:function(){this.isdel=!1}}},d=u,f=(a("68bf"),a("2877")),m=Object(f["a"])(d,n,i,!1,null,"0fcf2c6e",null);e["default"]=m.exports},"68bf":function(t,e,a){"use strict";var n=a("2108"),i=a.n(n);i.a},"6b54":function(t,e,a){"use strict";a("3846");var n=a("cb7c"),i=a("0bfb"),s=a("9e1e"),o="toString",c=/./[o],l=function(t){a("2aba")(RegExp.prototype,o,t,!0)};a("79e5")(function(){return"/a/b"!=c.call({source:"a",flags:"b"})})?l(function(){var t=n(this);return"/".concat(t.source,"/","flags"in t?t.flags:!s&&t instanceof RegExp?i.call(t):void 0)}):c.name!=o&&l(function(){return c.call(this)})},ac6a:function(t,e,a){for(var n=a("cadf"),i=a("0d58"),s=a("2aba"),o=a("7726"),c=a("32e9"),l=a("84f2"),r=a("2b4c"),u=r("iterator"),d=r("toStringTag"),f=l.Array,m={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=i(m),p=0;p<h.length;p++){var g,x=h[p],y=m[x],v=o[x],b=v&&v.prototype;if(b&&(b[u]||c(b,u,f),b[d]||c(b,d,x),l[x]=f,y))for(g in n)b[g]||s(b,g,n[g],!0)}}}]);
//# sourceMappingURL=chunk-4bbe40ae.0978baf3.js.map