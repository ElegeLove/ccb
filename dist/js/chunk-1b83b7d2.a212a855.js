(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b83b7d2"],{"0896":function(t,e,a){},"0bfb":function(t,e,a){"use strict";var i=a("cb7c");t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},"0f3b":function(t,e,a){"use strict";a.r(e);for(var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"mxStudentList"}},[a("a-breadcrumb",{attrs:{separator:" "}},[a("a-breadcrumb-item",[a("a-icon",{staticClass:"mx_header_icon",attrs:{type:"arrow-left"},on:{click:t.goback}})],1),a("a-breadcrumb-item",{staticClass:"mx_header_text"},[t._v(t._s(t.className))])],1),a("div",{staticClass:"components-input-demo-presuffix"},[a("p",{staticClass:"hmTxt"},[t._v("学生：")]),a("a-input",{ref:"userNameInput",staticClass:"seachBox",staticStyle:{width:"200px"},attrs:{placeholder:"学生姓名"},model:{value:t.mxClassVal,callback:function(e){t.mxClassVal=e},expression:"mxClassVal"}},[t.mxClassVal?a("a-icon",{staticStyle:{color:"#999"},attrs:{slot:"suffix",theme:"filled",type:"close-circle"},on:{click:t.emitEmpty},slot:"suffix"}):t._e()],1),a("a-button",{staticClass:"seachBtn",attrs:{type:"primary"},on:{click:t.mxSeach}},[t._v("搜索")])],1),a("a-form",{staticClass:"mx_form",attrs:{layout:"inline"}},[a("a-form-item",{staticClass:"mx_formsex",attrs:{label:"性别："}},[a("a-select",{staticStyle:{width:"120px"},attrs:{defaultValue:"all"},on:{change:t.sexChange}},[a("a-select-option",{attrs:{value:"all"}},[t._v("全部")]),a("a-select-option",{attrs:{value:"0"}},[t._v("男")]),a("a-select-option",{attrs:{value:"1"}},[t._v("女")])],1)],1),a("a-form-item",{attrs:{label:"就餐方式："}},[a("a-select",{staticStyle:{width:"150px"},attrs:{value:t.modeKey},on:{change:t.selectChange}},t._l(t.diningStyle,function(e,i){return a("a-select-option",{key:i+1},[t._v(t._s(e.title))])}),1)],1)],1),a("div",{staticClass:"mx_btnGroup"},[a("a-button",{staticClass:"mx_creat_btn mx_btnbg",attrs:{type:"primary"},on:{click:t.mxAdd}},[t._v("添加学生")]),a("a-button",{staticClass:"mx_creat_btn mx_lever_btn",on:{click:t.mxRecord}},[t._v("离班记录")]),a("div",{staticClass:"mx_btns"},[a("span",[t._v("导入班级")]),a("a-divider",{staticStyle:{background:"#000"},attrs:{type:"vertical"}}),a("span",[t._v("下载模板")])],1),a("div",{staticClass:"mx_btns"},[a("span",[t._v("打印")]),a("a-divider",{staticStyle:{background:"#000"},attrs:{type:"vertical"}}),a("span",[t._v("导出")])],1)],1),a("a-skeleton",{attrs:{loading:t.loading,active:"",title:!1,paragraph:{rows:12}}},[a("a-table",{attrs:{columns:t.columns,dataSource:t.data,bordered:"",pagination:t.pagination},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"face_id_src",fn:function(t,e,i){return a("div",{staticStyle:{display:"flex","justify-content":"space-around"}},[a("viewer",[a("img",{staticStyle:{width:"60px",heigth:"60px"},attrs:{src:e.face_id_src}})])],1)}},{key:"operation",fn:function(e,i,s){return[a("div",{staticClass:"editable-row-operations"},[a("div",[a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxCheck(i.id)}}},[t._v("查看")]),a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxRevise(i.id)}}},[t._v("修改")]),a("a",{staticClass:"mx_updata mx_color",on:{click:function(e){return t.mxShowOffDuty(i.id)}}},[t._v("离班")]),a("a-modal",{attrs:{title:"离班原因",centered:"",maskStyle:{opacity:"0.1",background:"#000",animation:"none"},okText:"确认",cancelText:"取消"},on:{cancel:t.mxCelOffDuty,ok:t.mxOffDuty},model:{value:t.isOffDuty,callback:function(e){t.isOffDuty=e},expression:"isOffDuty"}},[a("div",{staticClass:"mx_model"},[a("div",{staticClass:"mx_model_main"},[a("p",[a("span",[t._v("离班原因：")]),a("a-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择离班原因"},on:{change:t.selectDel}},[a("a-select-option",{attrs:{value:"0"}},[t._v("未知")]),a("a-select-option",{attrs:{value:"1"}},[t._v("转班")]),a("a-select-option",{attrs:{value:"2"}},[t._v("转校")]),a("a-select-option",{attrs:{value:"3"}},[t._v("退学")]),a("a-select-option",{attrs:{value:"4"}},[t._v("离职")]),a("a-select-option",{attrs:{value:"5"}},[t._v("退休")]),a("a-select-option",{attrs:{value:"6"}},[t._v("辞退")])],1)],1)])])])],1)])]}}])})],1)],1)},s=[],n=(a("ac6a"),a("6b54"),[{title:"人脸图片",dataIndex:"face_id_src",align:"center",width:"15%",scopedSlots:{customRender:"face_id_src"}},{title:"姓名",dataIndex:"name",align:"center",width:"25%",scopedSlots:{customRender:"name"}},{title:"性别",dataIndex:"sex",align:"center",width:"15%",scopedSlots:{customRender:"sex"}},{title:"年龄",dataIndex:"age",align:"center",width:"15%",scopedSlots:{customRender:"age"}},{title:"就餐方式",dataIndex:"dining_style_src",align:"center",width:"15%",scopedSlots:{customRender:"dining_style_src"}},{title:"操作按钮",dataIndex:"operation",align:"center",scopedSlots:{customRender:"operation"}}]),c=[],o=0;o<100;o++){var l,r;o%2==0?(l="男",r="校内三次"):(l="女",r="校内一次"),c.push({key:o.toString(),face_id_src:"http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg",name:"Edrward ".concat(o),sex:"".concat(l),age:32,address:"London Park no. ".concat(o),dining_style:"".concat(r)})}var d={data:function(){var t=this;return{loading:!0,data:c,columns:n,pagination:{pageSize:15,current:1,total:0,showSizeChanger:!1,showQuickJumper:!0,showTotal:function(e){return"共 ".concat(e," 条记录 第 ").concat(t.pagination.current," / ").concat(Math.ceil(e/t.pagination.pageSize)," 页")}},isOffDuty:!1,leavingWork:"",studentId:"",mxClassVal:"",className:"",classId:"",diningStyle:[{id:90,title:"校内三餐"},{id:91,title:"校内午晚餐"},{id:92,title:"校内早餐"},{id:93,title:"校内午餐"},{id:94,title:"校内晚餐"},{id:95,title:"校外就餐"}],modeKey:"全部",modeId:0,sexVal:""}},mounted:function(){this.className=this.$route.query.className,this.classId=this.$route.query.classid,this.getDining();var t={class_id:this.classId};this.getStudentList(t)},methods:{goback:function(){this.$router.go(-1)},mxSeach:function(){var t={class_id:this.classId,key_word:this.mxClassVal,sex:this.sexVal,dining_style:this.modeId};this.loading=!0,this.getStudentList(t)},emitEmpty:function(){this.$refs.userNameInput.focus(),this.mxClassVal=""},sexChange:function(t){var e;e="all"==t?"":t,this.sexVal=e},getDining:function(){var t=this;this.$get("api/school/dining",{}).then(function(e){if(0==e.data.code){t.diningStyle=e.data.data;var a={id:0,title:"全部"};t.diningStyle.splice(0,0,a)}else t.$message.warning(e.data.msg)})},selectChange:function(t){this.modeKey=t,this.modeId=this.diningStyle[t-1].id},getStudentList:function(t){var e=this,a=this;this.$get("api/school/students?page="+this.pagination.current,t).then(function(t){0==t.data.code?(a.pagination.pageSize=t.data.data.per_page,a.pagination.total=t.data.data.total,t.data.data.data.forEach(function(t){t.key=t.id,t.face_id_src||(t.face_id_src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"),0==t.sex?t.sex="男":1==t.sex&&(t.sex="女"),t.name=t.title}),e.data=t.data.data.data,e.loading=!1):e.$message.warning(t.data.msg)})},mxAdd:function(){this.$router.push({path:"/mxAddStudent",query:{classid:this.classId}})},mxRecord:function(){this.$router.push({path:"/mxLeaveRecord",query:{classid:this.classId}})},mxCheck:function(t){this.$router.push({path:"/mxStudentInfo",query:{student_id:t}})},mxRevise:function(t){this.$router.push({path:"/mxUpdataInfo",query:{id:t}})},handleTableChange:function(t,e,a){this.pagination.pageSize=t.pageSize,this.pagination.current=t.current;var i={class_id:this.classId};this.getStudentList(i)},mxShowOffDuty:function(t){this.studentId=t,this.isOffDuty=!0},selectDel:function(t){this.leavingWork=t},mxCelOffDuty:function(){this.isOffDuty=!1},mxOffDuty:function(){var t=this,e={url:"api/school/students/"+this.studentId,method:"delete",data:{event:this.leavingWork}};this.$apiAxiox(e).then(function(e){t.isOffDuty=!1,t.$message.success("删除成功");var a={class_id:t.classId};t.getStudentList(a)})}}},u=d,f=(a("5551"),a("2877")),h=Object(f["a"])(u,i,s,!1,null,"60912cdd",null);e["default"]=h.exports},3846:function(t,e,a){a("9e1e")&&"g"!=/./g.flags&&a("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:a("0bfb")})},5551:function(t,e,a){"use strict";var i=a("0896"),s=a.n(i);s.a},"6b54":function(t,e,a){"use strict";a("3846");var i=a("cb7c"),s=a("0bfb"),n=a("9e1e"),c="toString",o=/./[c],l=function(t){a("2aba")(RegExp.prototype,c,t,!0)};a("79e5")(function(){return"/a/b"!=o.call({source:"a",flags:"b"})})?l(function(){var t=i(this);return"/".concat(t.source,"/","flags"in t?t.flags:!n&&t instanceof RegExp?s.call(t):void 0)}):o.name!=c&&l(function(){return o.call(this)})},ac6a:function(t,e,a){for(var i=a("cadf"),s=a("0d58"),n=a("2aba"),c=a("7726"),o=a("32e9"),l=a("84f2"),r=a("2b4c"),d=r("iterator"),u=r("toStringTag"),f=l.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},m=s(h),p=0;p<m.length;p++){var g,x=m[p],v=h[x],_=c[x],y=_&&_.prototype;if(y&&(y[d]||o(y,d,f),y[u]||o(y,u,x),l[x]=f,v))for(g in i)y[g]||n(y,g,i[g],!0)}}}]);
//# sourceMappingURL=chunk-1b83b7d2.a212a855.js.map