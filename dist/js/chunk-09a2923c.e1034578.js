(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-09a2923c"],{"1af6":function(e,a,t){var n=t("63b6");n(n.S,"Array",{isArray:t("9003")})},"24dd":function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{attrs:{id:"mxModifyInfo"}},[t("a-breadcrumb",{attrs:{separator:" "}},[t("a-breadcrumb-item",[t("a-icon",{staticClass:"mx_header_icon",attrs:{type:"arrow-left"},on:{click:e.goback}})],1),t("a-breadcrumb-item",{staticClass:"mx_header_text"},[e._v("修改信息")])],1),t("a-skeleton",{attrs:{loading:e.loading,active:"",title:!1,paragraph:{rows:20}}},[t("a-form",{attrs:{form:e.form},on:{submit:e.handleSubmit}},[t("a-row",{staticClass:"mx_main"},[t("a-col",{attrs:{span:8}},[t("a-form-item",{attrs:{label:"所属食堂"}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["canteenId",{initialValue:e.updataCanteen.canteenId,rules:[{required:!0,message:"请选择员工所属食堂"}]}],expression:"[\n                            'canteenId',\n                            {initialValue: updataCanteen.canteenId,rules: [{ required: true, message: '请选择员工所属食堂' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"所属食堂选择"}},e._l(e.canteen,function(a){return t("a-select-option",{attrs:{value:a.id}},[e._v(e._s(a.title))])}),1)],1),t("a-form-item",{attrs:{label:"姓名"}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{initialValue:e.updataCanteen.name,rules:[{required:!0,message:"请填写员工姓名"}]}],expression:"[\n                            'name',\n                            {initialValue: updataCanteen.name,rules: [{ required: true, message: '请填写员工姓名' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"填写员工姓名"}})],1),t("a-form-item",{attrs:{label:"性别选择"}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["sex",{initialValue:e.updataCanteen.sex,rules:[{required:!0,message:"请选择性别"}]}],expression:"[\n                            'sex',\n                            {initialValue: updataCanteen.sex,rules: [{ required: true, message: '请选择性别' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"选择性别"},on:{change:e.sexChange}},[t("a-select-option",{attrs:{value:"1"}},[e._v("男")]),t("a-select-option",{attrs:{value:"2"}},[e._v("女")])],1)],1),t("a-form-item",{attrs:{label:"年龄"}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["age",{initialValue:e.updataCanteen.age,rules:[{required:!0,message:"请填写员工年龄"}]}],expression:"[\n                            'age',\n                            {initialValue: updataCanteen.age,rules: [{ required: true, message: '请填写员工年龄' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"填写员工年龄"}})],1),t("a-form-item",{attrs:{label:"职位"}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["job_title",{initialValue:e.updataCanteen.job_title,rules:[{required:!0,message:"请填写员工职位"}]}],expression:"[\n                            'job_title',\n                            {initialValue: updataCanteen.job_title,rules: [{ required: true, message: '请填写员工职位' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"填写员工职位"}})],1),t("a-form-item",{attrs:{label:"学历"}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["education",{initialValue:e.updataCanteen.education,rules:[{required:!0,message:"请选择员工学历"}]}],expression:"[\n                            'education',\n                            {initialValue: updataCanteen.education,rules: [{ required: true, message: '请选择员工学历' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"学历选择"}},[t("a-select-option",{attrs:{value:"未接受教育"}},[e._v("未接受教育")]),t("a-select-option",{attrs:{value:"小学"}},[e._v("小学")]),t("a-select-option",{attrs:{value:"初中"}},[e._v("初中")]),t("a-select-option",{attrs:{value:"高中"}},[e._v("高中")]),t("a-select-option",{attrs:{value:"专科"}},[e._v("专科")]),t("a-select-option",{attrs:{value:"本科"}},[e._v("本科")]),t("a-select-option",{attrs:{value:"研究生"}},[e._v("研究生")])],1)],1),t("a-form-item",{attrs:{label:"联系电话"}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["phone",{initialValue:e.updataCanteen.phone,rules:[{required:!0,message:"请填写联系电话"}]}],expression:"[\n                            'phone',\n                            {initialValue: updataCanteen.phone,rules: [{ required: true, message: '请填写联系电话' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"填写联系电话"}})],1),t("a-form-item",{attrs:{label:"联系地址"}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["location",{initialValue:e.updataCanteen.location,rules:[{required:!0,message:"请填写联系地址"}]}],expression:"[\n                            'location',\n                            {initialValue: updataCanteen.location,rules: [{ required: true, message: '请填写联系地址' }]}\n                        ]"}],staticStyle:{width:"300px"},attrs:{placeholder:"填写联系地址"}})],1),t("a-form-item",{attrs:{label:"入职日期"}},[t("a-date-picker",{attrs:{placeholder:"入职日期选择",value:e.moment(e.joinTime,"YYYY-MM-DD")},on:{change:e.mxDateChange}})],1)],1),t("a-col",{attrs:{span:16}},[t("a-form-item",{attrs:{label:"人脸图片"}},[t("div",[t("div",{staticClass:"clearfix"},[t("a-upload",{attrs:{action:"http://bate.ccb.micmio.com/api/common/upload",listType:"picture-card",fileList:e.updataCanteen.fileList},on:{preview:e.handlePreview,change:e.handleChange}},[e.updataCanteen.fileList.length<1?t("div",[t("a-icon",{attrs:{type:"plus"}})],1):e._e()]),t("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancel}},[t("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1),t("a-upload",{attrs:{action:"http://bate.ccb.micmio.com/api/common/upload",fileList:e.updataCanteen.fileList},on:{preview:e.handlePreview,change:e.handleChange}},[t("a-button",[t("a-icon",{attrs:{type:"upload"}}),e._v("重新录入\n                            ")],1)],1)],1)])],1)],1),t("a-form-item",[t("a-button",{attrs:{type:"primary","html-type":"submit"}},[e._v("下一步")])],1)],1)],1)],1)},i=[],r=t("75fc"),s=(t("7f7f"),t("c1df")),o=t.n(s),u={data:function(){return{loading:!0,moment:o.a,previewVisible:!1,previewImage:"",form:this.$form.createForm(this),updataCanteen:{canteenId:"",name:"",sex:"",age:"",job_title:"",education:"",phone:"",location:"",fileList:[]},uploading:!1,canteen:[],canteenKey:"",canteenId:"",joinTime:"",faceId:"",faceUrl:"",sex:0,staffList:{}}},created:function(){var e=this;this.$route.query.updataCanteen?(this.updataCanteen.canteenId=this.$route.query.updataCanteen.canteenId,this.updataCanteen.name=this.$route.query.updataCanteen.name,this.updataCanteen.sex=this.$route.query.updataCanteen.sex,this.updataCanteen.age=this.$route.query.updataCanteen.age,this.updataCanteen.job_title=this.$route.query.updataCanteen.job_title,this.updataCanteen.education=this.$route.query.updataCanteen.education,this.updataCanteen.phone=this.$route.query.updataCanteen.phone,this.updataCanteen.location=this.$route.query.updataCanteen.location,this.joinTime=this.$route.query.updataCanteen.joinTime,this.updataCanteen.fileList=this.$route.query.updataCanteen.fileList,this.loading=!1):this.$get("api/school/staff/"+this.$route.query.id).then(function(a){if(0==a.data.code){e.updataCanteen.canteenId=a.data.data.staff.canteen_id,e.updataCanteen.name=a.data.data.staff.title,e.updataCanteen.sex=a.data.data.staff.sex,e.updataCanteen.age=a.data.data.staff.age,e.updataCanteen.job_title=a.data.data.staff.job_title,e.updataCanteen.education=a.data.data.staff.education,e.updataCanteen.phone=a.data.data.staff.phone,e.updataCanteen.location=a.data.data.staff.location,e.joinTime=a.data.data.staff.join_time_str;var t=[],n={uid:a.data.data.staff.face_id,name:"xxx.png",response:{data:{id:parseInt(a.data.data.staff.face_id),url:a.data.data.staff.face_id_src}},status:"done",url:a.data.data.staff.face_id_src};t.push(n),e.updataCanteen.fileList=t,e.loading=!1}else e.$message.warning(a.data.msg)})},mounted:function(){this.getCanteen()},methods:{goback:function(){this.$router.push({path:"/mxEmployeeInfo"})},getCanteen:function(){var e=this;this.$get("api/school/canteen",{}).then(function(a){0==a.data.code?e.canteen=a.data.data:e.$message.warning(a.data.msg)})},sexChange:function(e){this.sex=e},mxDateChange:function(e,a){this.joinTime=a},handleSubmit:function(e){var a=this;e.preventDefault(),this.form.validateFields(function(e,t){e||(Object.assign(t,{fileList:a.updataCanteen.fileList,joinTime:a.joinTime}),a.$router.push({path:"/mxModifyInfos",query:{updataCanteen:t,id:a.$route.query.id}}))})},handleCancel:function(){this.previewVisible=!1},handlePreview:function(e){this.previewImage=e.url||e.thumbUrl,this.previewVisible=!0},handleChange:function(e){var a=this,t=Object(r["a"])(e.fileList);t=t.slice(-1),t=t.map(function(e){return e.response&&(e.url=e.response.data.url,a.faceId=e.response.data.id,a.faceUrl=e.response.data.url),e}),this.updataCanteen.fileList=t}}},l=u,d=(t("a397"),t("2877")),c=Object(d["a"])(l,n,i,!1,null,"22dac03e",null);a["default"]=c.exports},"75fc":function(e,a,t){"use strict";var n=t("a745"),i=t.n(n);function r(e){if(i()(e)){for(var a=0,t=new Array(e.length);a<e.length;a++)t[a]=e[a];return t}}var s=t("774e"),o=t.n(s),u=t("c8bb"),l=t.n(u);function d(e){if(l()(Object(e))||"[object Arguments]"===Object.prototype.toString.call(e))return o()(e)}function c(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function p(e){return r(e)||d(e)||c()}t.d(a,"a",function(){return p})},"774e":function(e,a,t){e.exports=t("d2d5")},"986c":function(e,a,t){},a397:function(e,a,t){"use strict";var n=t("986c"),i=t.n(n);i.a},a745:function(e,a,t){e.exports=t("f410")},c8bb:function(e,a,t){e.exports=t("54a1")},f410:function(e,a,t){t("1af6"),e.exports=t("584a").Array.isArray}}]);
//# sourceMappingURL=chunk-09a2923c.e1034578.js.map