(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-66cce3a2"],{"39f3":function(t,e,i){},"6cdc":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"mx_order"}},[i("div",{staticClass:"dlist"},[i("a-form",{attrs:{form:t.form}},[i("div",{staticClass:"t"},[i("div",{staticClass:"tabBox"},[i("p",[t._v("食堂：")]),i("a-select",{staticStyle:{width:"120px","margin-right":"40px"},attrs:{value:t.rState},on:{change:t.plChange}},t._l(t.rSList,function(e,a){return i("a-select-option",{key:a+1},[t._v(t._s(e.title))])}),1)],1),i("div",{staticClass:"tabBox"},[i("p",[t._v("单号：")]),i("a-form-item",{staticStyle:{width:"200px"}},[i("a-input",{attrs:{placeholder:"请输入单号",value:t.dataObj.code},on:{change:t.inpChange}})],1)],1)]),i("div",{staticClass:"b"},[i("div",{staticClass:"tabBox"},[i("p",[t._v("状态：")]),i("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["select"],expression:"['select']"}],staticStyle:{width:"120px","margin-right":"40px"},attrs:{value:t.rstate},on:{change:t.plChange2}},t._l(t.rList,function(e,a){return i("a-select-option",{key:a+1},[t._v(t._s(e.title))])}),1)],1),i("div",{staticClass:"tabBox"},[i("p",[t._v("日期：")]),i("a-form-item",[i("a-range-picker",{on:{change:t.rPickChange}})],1)],1),i("a-button",{staticStyle:{"margin-left":"20px","margin-top":"20px"},attrs:{type:"primary"},on:{click:function(e){return t.getPlist("2")}}},[t._v("查询")]),i("a-button",{staticStyle:{"margin-left":"20px","margin-top":"20px"},on:{click:t.clearL}},[t._v("重置")])],1)]),t.listData.length>0?i("div",[t._l(t.listData,function(e,a){return i("div",{staticClass:"box"},[i("div",{staticClass:"t"},[i("a-row",{staticStyle:{width:"100%",color:"#000"}},[i("a-col",{staticStyle:{display:"flex","margin-top":"15px"},attrs:{span:20}},[i("p",{staticStyle:{"margin-left":"40px"}},[t._v(t._s(e.fRoom))]),i("p",{staticStyle:{"margin-left":"45px",width:"150px",overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}},[t._v("订单号："+t._s(e.code))]),i("p",{staticStyle:{"margin-left":"40px"}},[t._v(t._s(e.time))]),i("p",{staticStyle:{"margin-left":"50px","margin-right":"40px"}},[t._v(t._s(e.sName))]),i("p",{staticStyle:{"margin-right":"40px"}},[t._v("采购人："+t._s(e.pName))]),e.rote?i("p",{staticStyle:{color:"#02bb72",cursor:"pointer"},on:{click:function(i){return t.mYscore(a,e.cAnt)}}},[t._v(t._s(e.cAnt)),e.score?i("a-icon",{attrs:{type:"right"}}):t._e()],1):t._e()]),i("a-col",{staticStyle:{"margin-top":"15px",display:"flex","justify-content":"space-between"},attrs:{span:4}},["已完成"==e.state?i("a-icon",{staticStyle:{color:"#02bb72","margin-left":"30px","font-size":"30px","margin-top":"-7px"},attrs:{type:"chrome"}}):t._e(),i("p",{staticStyle:{"margin-right":"30px","text-align":"right"}},[t._v(t._s(e.state))])],1)],1)],1),i("div",{staticClass:"c"},t._l(e.list,function(e,a){return i("div",{staticClass:"bgChange",staticStyle:{width:"100%","border-top":"1px solid transparent"}},[i("a-row",{staticStyle:{width:"100%",display:"flex","align-items":"center","margin-top":"20px"}},[i("a-col",{attrs:{span:10}},[i("div",{staticClass:"l"},[i("img",{staticStyle:{width:"90px",height:"90px",margin:"0 35px"},attrs:{src:e.url,alt:""}}),i("p",{staticStyle:{"margin-bottom":"0","margin-right":"44px","max-width":"180px",overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}},[t._v(t._s(e.name))]),i("p",{staticStyle:{"margin-bottom":"0"}},[i("span",{staticStyle:{"font-weight":"bold",color:"#000"}},[t._v(t._s(e.unit))]),t._v("/斤")])])]),i("a-col",{staticStyle:{"text-align":"right"},attrs:{span:14}},t._l(e.list,function(e){return i("div",{staticClass:"r",staticStyle:{margin:"10px 0"}},[i("div",{staticStyle:{width:"100%",display:"flex","align-items":"center","justify-content":"flex-end"}},[i("p",{staticStyle:{"margin-bottom":"0","margin-right":"50px"}},[t._v(t._s(e.time))]),i("p",{staticStyle:{"margin-bottom":"0","margin-right":"45px"}},[t._v(t._s(e.unit))]),i("p",{staticStyle:{"min-width":"70px","margin-bottom":"0","margin-right":"45px","font-weight":"bold",color:"#000"}},[t._v(t._s(e.moeny))]),i("p",{staticStyle:{"margin-bottom":"0","margin-right":"40px",position:"relative"}},[t._v(t._s(e.state)),e.isIcon?i("span",{staticStyle:{position:"absolute",border:"1px solid #d9d9d9",padding:"0 2px"}},[t._v(t._s(e.Istate))]):t._e()]),i("p",{staticStyle:{"margin-bottom":"0","margin-right":"30px"}},[t._v("批次号："+t._s(e.code))])])])}),0)],1),i("div",{staticStyle:{width:"100%",display:"flex","justify-content":"flex-end","margin-top":"10px"}},[i("p",[t._v("总计："),i("span",{staticStyle:{color:"#ff6600","font-weight":"bold"}},[t._v(t._s(e.aNum))])]),i("p",{staticStyle:{"margin-right":"30px","margin-left":"35px"}},[t._v("总价："),i("span",{staticStyle:{color:"#ff6600","font-weight":"bold"}},[t._v(t._s(e.aMy))])])]),i("span",{staticStyle:{height:"1px",background:"#d9d9d9",width:"95%",margin:"0 auto",display:"block","margin-bottom":"20px"}})],1)}),0),i("div",{staticClass:"b",staticStyle:{width:"100%",display:"flex","flex-direction":"column"}},[i("p",{staticStyle:{"text-align":"right","margin-right":"30px"}},[t._v("共计："),i("span",{staticStyle:{color:"#ff6600","font-weight":"bold"}},[t._v("￥"+t._s(e.My))])])])])}),i("div",{staticStyle:{width:"100%",display:"flex","justify-content":"flex-end"}},[[i("a-pagination",{attrs:{simple:"",current:t.page.key,total:t.page.total},on:{change:t.pageSizeChange}})]],2)],2):i("div",{staticStyle:{height:"500px",display:"flex","flex-direction":"column","align-items":"center","justify-content":"center"}},[i("img",{staticStyle:{width:"170px",height:"170px"},attrs:{src:"http://img5.imgtn.bdimg.com/it/u=2424630274,483969025&fm=26&gp=0.jpg",alt:""}}),i("p",[t._v("暂无采购订单")])])],1),i("a-modal",{attrs:{title:t.Title},model:{value:t.visible,callback:function(e){t.visible=e},expression:"visible"}},[i("div",{staticStyle:{height:"150px",display:"flex","align-items":"center","justify-content":"center","flex-direction":"column"}},[i("p",{staticStyle:{"margin-bottom":"0","text-align":"center"},domProps:{innerHTML:t._s(t.refuse)}}),i("a-rate",{attrs:{value:t.rateNum,allowHalf:""},on:{change:t.rateC}})],1),i("template",{slot:"footer"},[i("a-button",{on:{click:function(e){return t.rate("NO")}}},[t._v("取消")]),i("a-button",{attrs:{type:"primary"},on:{click:function(e){return t.rate("OK")}}},[t._v("确认")])],1)],2),i("a-modal",{attrs:{width:"730px",height:"480px",title:t.vTitle},model:{value:t.vImg,callback:function(e){t.vImg=e},expression:"vImg"}},[t.sTate?i("div",[i("a-textarea",{staticStyle:{width:"620px",height:"150px",resize:"none","margin-left":"30px"},attrs:{placeholder:"填写取消原因"},model:{value:t.cancel,callback:function(e){t.cancel=e},expression:"cancel"}})],1):i("div",[i("a-textarea",{staticStyle:{width:"620px",height:"150px",resize:"none","margin-left":"30px"},attrs:{placeholder:"填写退货原因"},model:{value:t.rGoods,callback:function(e){t.rGoods=e},expression:"rGoods"}}),i("div",{staticStyle:{display:"flex","margin-top":"30px"}},[i("div",{staticClass:"Logo",staticStyle:{"margin-left":"30px"}},[i("div",{staticStyle:{width:"110px",height:"120px",border:"1px solid #d9d9d9"}},[i("img",{attrs:{src:"",alt:""}})]),i("a-form-item",[i("a-upload",{directives:[{name:"decorator",rawName:"v-decorator",value:["upload2",{rules:[{required:!0,message:"请填上传图片"}],valuePropName:"fileList",getValueFromEvent:t.normFile}],expression:"['upload2', {\n                            rules: [\n                                { required: true, message: '请填上传图片'}\n                            ],\n                            valuePropName: 'fileList',\n                            getValueFromEvent: normFile,\n                        }]"}],staticClass:"mx_right",attrs:{showUploadList:!1,multiple:!0,headers:t.headers,name:"logo",action:"https://www.mocky.io/v2/5cc8019d300000980a055e76","list-type":"picture"},on:{change:t.upImg2}},[i("a-button",[i("a-icon",{attrs:{type:"upload"}}),t._v(" 上传图片\n                            ")],1)],1)],1)],1),i("div",{staticClass:"Logo",staticStyle:{"margin-left":"30px"}},[i("div",{staticStyle:{width:"110px",height:"120px",border:"1px solid #d9d9d9"}},[i("img",{attrs:{src:"",alt:""}})]),i("a-form-item",[i("a-upload",{directives:[{name:"decorator",rawName:"v-decorator",value:["upload2",{rules:[{required:!0,message:"请填上传图片"}],valuePropName:"fileList",getValueFromEvent:t.normFile}],expression:"['upload2', {\n                            rules: [\n                                { required: true, message: '请填上传图片'}\n                            ],\n                            valuePropName: 'fileList',\n                            getValueFromEvent: normFile,\n                        }]"}],staticClass:"mx_right",attrs:{showUploadList:!1,multiple:!0,headers:t.headers,name:"logo",action:"https://www.mocky.io/v2/5cc8019d300000980a055e76","list-type":"picture"},on:{change:t.upImg2}},[i("a-button",[i("a-icon",{attrs:{type:"upload"}}),t._v(" 上传图片\n                            ")],1)],1)],1)],1)])],1),i("template",{slot:"footer"},[i("a-button",{on:{click:function(e){return t.iBack("NO")}}},[t._v("取消")]),i("a-button",{attrs:{type:"primary"},on:{click:function(e){return t.iBack("OK")}}},[t._v("确认")])],1)],2)],1)},s=[],n=(i("7f7f"),i("ac6a"),i("c1df")),r=i.n(n),o={data:function(){return{rState:1,rstate:1,rSList:[],rList:[{id:"",title:"全部"},{id:0,title:"进行中"},{id:1,title:"已完成"},{id:2,title:"已取消"},{id:3,title:"已退货"}],form:this.$form.createForm(this),listData:[],visible:!1,Title:"供应商评分",refuse:"您对本次交易满意吗？",rateNum:4,keyNum:0,dShow:!1,dlList:[{tit:"第一批",state:"已验收",time:"送达：07-05   上午",txt:"配送中无法取消",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"申请退货",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]},{time:"06-23    15:23",icon:"",state:"开始配送",txt:["配送人：张三的猪肉","联系方式：15923652147"],img:[]},{time:"06-23    15:23",icon:"",state:"验收入库",txt:["验收人：张主任"],img:[]}]},{tit:"第二批",state:"备货中",time:"送达：07-05   上午",txt:"",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"取消批次",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]}]},{tit:"第三批",state:"配送中",time:"送达：07-05   上午",txt:"",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]},{time:"06-23    15:23",icon:"",state:"正在配送",txt:["配送人：张三的猪肉","联系方式：15923652147"],img:[]}]},{tit:"第三批",state:"验收中",time:"送达：07-05   上午",txt:"验收中无法取消",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]},{time:"06-23    15:23",icon:"",state:"正在配送",txt:["配送人：张三的猪肉","联系方式：15923652147"],img:[]},{time:"06-23    15:23",icon:"",state:"正在验收中",txt:["验收人：张主任"],img:[]}]},{tit:"第三批",state:"已取消",time:"送达：07-05   上午",txt:"该批次取消成功",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]},{time:"06-23    15:23",icon:"",state:"取消批次",txt:["取消人：王阿航","取消原因：刮风放假了"],img:[]}]},{tit:"第三批",state:"已退货",time:"送达：07-05   上午",txt:"该批次取消成功",unit:"300斤",My:"￥200.00",code:"批次号：5235644",btn:"",list:[{time:"06-23    15:23",icon:"",state:"开始备货",txt:["商家正在积极备货中..."],img:[]},{time:"06-23    15:23",icon:"",state:"开始配送",txt:["配送人：张三的猪肉","联系方式：15923652147"],img:[]},{time:"06-23    15:23",icon:"",state:"验收入库",txt:["验收人：张主任"],img:[]},{time:"06-23    15:23",icon:"",state:"申请退货",txt:["申请人：张主任","退货原因：不想要了"],img:["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3236563442,765701136&fm=26&gp=0.jpg","https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3236563442,765701136&fm=26&gp=0.jpg"]},{time:"06-23    15:23",icon:"",state:"退货成功",txt:["供应商已同意您的退货申请"],img:[]}]}],vTitle:"",vImg:!1,scssOK:!1,sTate:!1,rangeConfig:{rules:[{type:"array",required:!0,message:"请选择起始日期"}]},headers:{authorization:"authorization-text"},rGoods:"",cancel:"",dataObj:{fid:"",code:"",state:"",sTime:"",eTime:""},page:{total:51,key:1},tData:[]}},methods:{rPickChange:function(t){t.length>0?(this.dataObj.sTime=r()(t[0]._d).format("x")/1e3,this.dataObj.eTime=r()(t[1]._d).format("x")/1e3):(this.dataObj.sTime="",this.dataObj.eTime="")},inpChange:function(t){this.dataObj.code=t.target.value},getFRoom:function(){var t=this,e={url:"api/common/dictionaries",method:"get",data:{}};this.$apiAxiox(e).then(function(e){if(0==e.data.code)if(e.data.data.canteen.length>0){t.rSList=e.data.data.canteen;var i={id:"",title:"全部"};t.rSList.unshift(i),t.rState=t.rSList[0].title}else t.$message.warning("暂无食堂可供选择！")})},action:function(t){var e=this;if(1==t){this.initial=!this.initial,this.crtList=!this.initial;var i=[{key:0,index:1,img:"http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg",name:{name:"小龙虾",state:!0},unit:"斤",num:300,time:["1566184899000","1566184899000"],userNum:[100,200]},{key:1,index:2,img:"http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg",name:{name:"小龙虾",state:!0},unit:"斤",num:311,time:["1566184899000","1566184899000"],userNum:[111,200]}];return i.forEach(function(t,e){for(var i in t.time)t.time[i]=r()(1*t.time[i])}),void(this.dataSource=i)}if(2!=t){if(3==t)return this.dataSource=[],this.allWeek=[],this.$message.success("清空列表成功！"),void this.$message.warning("当前列表无数据！");4!=t?5==t&&(this.dataSource.forEach(function(t,i){""==t.name.name?(e.$message.warning("请输入序号"+t.index+"菜品名称！"),e.dataOK=!1):e.dataOK=!0,t.time.forEach(function(i,a){0==i||0==i.length?(console.log(i),e.$message.warning("请选择序号"+t.index+"使用时间！"),e.dataOK=!1):e.dataOK=!0}),t.userNum.forEach(function(i,a){console.log(i),0==i||0==i.length?(e.$message.warning("请填写序号"+t.index+"使用数量！"),e.dataOK=!1):e.dataOK=!0})}),this.dataOK&&(this.$message.success("提交申请成功！"),this.initial=!this.initial,this.isOK=!this.isOK)):this.$message.success("保存草稿成功！")}else{var a=this.dataSource.length,s=this.dataSource.length+1,n={key:a,index:s,img:"http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg",name:{name:"",state:!1},unit:"斤",num:0,time:[0],userNum:[0]};this.dataSource.push(n)}},plChange:function(t){this.rState=t,this.dataObj.fid=this.rSList[t-1].id},plChange2:function(t){this.rstate=t,this.dataObj.state=this.rList[t-1].id},clearL:function(){this.rState="全部",this.rstate="全部",this.form.resetFields()},mYscore:function(t,e){"去"==e.slice(0,1)&&(this.visible=!this.visible,this.keyNum=t)},rateC:function(t){this.rateNum=t},rate:function(t){var e=this;this.visible=!this.visible,"OK"==t&&(this.listData.forEach(function(t,i){i==e.keyNum&&(t.cAnt="已评"+e.rateNum+"分",t.score=!1)}),this.$message.success("评分成功"))},upData:function(t){return"申请退货"==t?(this.vTitle="申请退货",this.sTate=!1,void(this.vImg=!this.vImg)):"取消批次"==t?(this.vTitle="取消批次",this.sTate=!0,void(this.vImg=!this.vImg)):void 0},normFile:function(t){return console.log("Upload event:",t),Array.isArray(t)?t:t&&t.fileList},upImg2:function(t){"uploading"!==t.file.status&&console.log(t.file,t.fileList),"done"===t.file.status?this.$message.success("".concat(t.file.name," file uploaded successfully")):"error"===t.file.status&&this.$message.error("".concat(t.file.name," file upload failed."))},iBack:function(t){this.vImg=!this.vImg,this.sTate?"OK"==t&&this.$message.success("取消批次成功"):"OK"==t&&(this.scssOK=!this.scssOK)},backD:function(){this.scssOK=!this.scssOK},getPlist:function(){this.getListData()},getListData:function(){var t=this,e={url:"api/school/order?canteen_id="+this.dataObj.fid+"&order_no="+this.dataObj.code+"&order_state="+this.dataObj.state+"&start_time="+this.dataObj.sTime+"&end_time="+this.dataObj.eTime,method:"get",data:{}};this.tData=[],this.$apiAxiox(e).then(function(e){0==e.data.code?(e.data.data.forEach(function(e,i){var a={fRoom:e.canteen_title,code:e.order_no,time:e.order_created_at_str,sName:e.supplier_title,pName:e.username,rote:!1,cAnt:"去评分",score:!0,state:e.order_state_str,list:[],My:e.order_price};e.material.forEach(function(t,e){var i={url:t.material_single_src,name:t.material_title+"    "+t.supplier_cargo_title,unit:t.unit_price,list:[],aNum:t.material_total_num,aMy:t.material_total_price};a.list.push(i),t.batches.forEach(function(t,e){var a={time:t.batch_time_day+"    "+t.cycle_str,unit:t.num,moeny:t.batch_total_price,state:t.order_state_str,isIcon:!1,Istate:"",code:t.batch_num};i.list.push(a)})}),t.tData.push(a)}),t.page.total=t.tData.length,t.listData=t.tData.slice(10*(t.page.key-1),10*t.page.key+1)):t.$message.warning("暂无食堂可供选择！")})},pageSizeChange:function(t){this.page.key=t,this.listData=this.tData.slice(10*(this.page.key-1),10*this.page.key+1)}},created:function(){this.getFRoom(),this.getListData()}},c=o,l=(i("c38a"),i("2877")),m=Object(l["a"])(c,a,s,!1,null,"bf2d7cd0",null);e["default"]=m.exports},ac6a:function(t,e,i){for(var a=i("cadf"),s=i("0d58"),n=i("2aba"),r=i("7726"),o=i("32e9"),c=i("84f2"),l=i("2b4c"),m=l("iterator"),d=l("toStringTag"),p=c.Array,g={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=s(g),u=0;u<h.length;u++){var f,x=h[u],v=g[x],y=r[x],_=y&&y.prototype;if(_&&(_[m]||o(_,m,p),_[d]||o(_,d,x),c[x]=p,v))for(f in a)_[f]||n(_,f,a[f],!0)}},c38a:function(t,e,i){"use strict";var a=i("39f3"),s=i.n(a);s.a}}]);
//# sourceMappingURL=chunk-66cce3a2.b349ed43.js.map