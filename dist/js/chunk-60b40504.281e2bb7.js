(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-60b40504"],{"55fd":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"mx_statistics"}},[e("div",{staticClass:"mx_header"},[e("span",[t._v(t._s(t.moment().format("YYYY年MM月DD日 HH:mm:ss")))])]),e("h1",[t._v(t._s(t.name)+"智慧管理云平台")]),e("a-skeleton",{attrs:{loading:t.loading,active:"",title:!1,paragraph:{rows:30}}},[e("a-row",[e("a-col",{attrs:{span:8}},[e("div",{staticClass:"mx_canteenCensus"},[e("p",[t._v("食堂数量："+t._s(t.dataInfo.canteen_num)+"个")]),e("p",[t._v("在校总人数："+t._s(t.dataInfo.student_count)+"人")]),e("p",{staticStyle:{margin:"0"}},[t._v("已守护"+t._s(t.dataInfo.student_count)+"名孩子"+t._s(t.dataInfo.total_day)+"天食品安全")])]),e("div",{staticClass:"mx_estCensus"},[e("table",[e("thead",[e("tr",[e("td",[t._v("就餐应到/实到")]),e("td",[t._v("早餐")]),e("td",[t._v("午餐")]),e("td",[t._v("晚餐")])])]),e("tbody",t._l(5,function(a){return e("tr",[e("td",[t._v("食堂1")]),e("td",[t._v("51人 / 46人")]),e("td",[t._v("51人 / 46人")]),e("td",[t._v("51人 / 46人")])])}),0)])]),e("div",{staticClass:"mx_canteenCensus",staticStyle:{marginTop:"30px"}},[e("p",[t._v("食材订单")]),e("div",{staticClass:"mx_main"},[e("div",[e("p",[t._v(t._s(t.orderFoods.order_service))]),e("p",[t._v("今日送达订单")])]),e("div",[e("p",[t._v("¥"+t._s(t.orderFoods.order_total_price))]),e("p",[t._v("订单总额")])])]),e("div",{staticClass:"mx_main",staticStyle:{marginTop:"40px"}},[e("div",[e("p",[t._v("¥"+t._s(t.orderFoods.order_term_price))]),e("p",[t._v("本学期采购总额")])]),e("div",[e("p",[t._v("¥"+t._s(t.orderFoods.order_loss))]),e("p",[t._v("本学期损耗总额")])])])])]),e("a-col",{attrs:{span:16}},[e("div",{staticClass:"mx_canteenCensus",staticStyle:{display:"flex","flex-wrap":"wrap","align-items":"center",marginLeft:"50px"}},t._l(t.staffInfo,function(a){return e("div",{staticStyle:{margin:"0 2px"}},[e("chart",{ref:"chart1",refInFor:!0,staticStyle:{width:"260px",height:"240px"},attrs:{options:a.option,"auto-resize":!0}}),e("p",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.title))])],1)}),0),e("div",{staticClass:"mx_canteenCensus",staticStyle:{display:"flex","flex-wrap":"wrap","align-items":"center",margin:"20px 0 0 50px"}},t._l(t.safetySituation,function(a){return e("div",[e("chart",{ref:"chart1",refInFor:!0,staticStyle:{width:"260px",height:"240px"},attrs:{options:a.options,"auto-resize":!0}}),e("p",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.title))])],1)}),0)])],1)],1)],1)},i=[],n=(e("ac6a"),e("c1df")),o=e.n(n),r={data:function(){return{moment:o.a,name:"",loading:!0,dataInfo:{},orderFoods:{},staffInfo:[],safetySituation:[],option:{},options:{},datalist:["陪餐记录","留样记录","餐具消毒","健康晨检","安全巡检","场地消毒","废弃物处理","防疫记录"]}},created:function(){this.getDataInfo(),this.name=localStorage.getItem("schoolName")},mounted:function(){this.getDataInfo(),this.option={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c}人"},series:[{name:"人数",type:"pie",radius:"55%",label:{normal:{position:"inner"}},data:[{value:21,name:"出勤"},{value:2,name:"健康证过期"},{value:1,name:"晨检异常"}],itemStyle:{emphasis:{shadowBlur:5,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},this.options={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} 次"},series:[{name:"次数",type:"pie",radius:"55%",label:{normal:{position:"inner"}},center:["50%","60%"],data:[{value:5,name:"食堂1"},{value:5,name:"食堂2"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}},methods:{getDataInfo:function(){var t=this;this.$get("api/school/kanban/report").then(function(a){if(0==a.data.code){t.dataInfo=a.data.data,t.orderFoods=a.data.data.order,a.data.data.staff.forEach(function(t){t.option={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c}人"},series:[{name:"人数",type:"pie",radius:"40%",data:[{value:t.attend_num,name:"出勤"},{value:t.overdue_num,name:"健康证过期"},{value:t.examine_abnormal_num,name:"晨检异常"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}});var e=[];e.push(a.data.data.safety.cater),e.push(a.data.data.safety.sample),e.push(a.data.data.safety.disinfec),e.push(a.data.data.safety.examine),e.push(a.data.data.safety.patrol),e.push(a.data.data.safety.boil),e.push(a.data.data.safety.scrap),e.push(a.data.data.safety.plague),e.forEach(function(t){var a=[];t.data.forEach(function(t){var e={value:t.num,name:t.canteen_str};a.push(e)}),t.options={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} 次"},series:[{name:"次数",type:"pie",radius:"25%",data:a,itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}}),t.safetySituation=e,t.staffInfo=a.data.data.staff,t.loading=!1}else console.log(22)})}}},d=r,l=(e("9cb7"),e("2877")),c=Object(l["a"])(d,s,i,!1,null,"43ad23ae",null);a["default"]=c.exports},"790d":function(t,a,e){},"9cb7":function(t,a,e){"use strict";var s=e("790d"),i=e.n(s);i.a},ac6a:function(t,a,e){for(var s=e("cadf"),i=e("0d58"),n=e("2aba"),o=e("7726"),r=e("32e9"),d=e("84f2"),l=e("2b4c"),c=l("iterator"),p=l("toStringTag"),f=d.Array,u={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},m=i(u),_=0;_<m.length;_++){var h,v=m[_],g=u[v],y=o[v],S=y&&y.prototype;if(S&&(S[c]||r(S,c,f),S[p]||r(S,p,v),d[v]=f,g))for(h in s)S[h]||n(S,h,s[h],!0)}}}]);
//# sourceMappingURL=chunk-60b40504.281e2bb7.js.map