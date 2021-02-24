<template>
    <a-locale-provider :locale="zhCN">
        <div id="mx_sMessage">
            <a-skeleton :loading="loading" active :paragraph="{rows: 20}">
                <a-tabs :activeKey="key" @change="keyChange">
                    <a-tab-pane tab="办学信息" key="1">
                        <h4>{{sName}}</h4>
                        <a-form :form="form">
                            <div class="mx_txtBox">
                                <p>学校电话</p>
                                <a-form-item>
                                    <a-input  placeholder="填写联系电话" v-decorator="[
                                                  'mobile',
                                                    {
                                                      initialValue: schoolD.mobile,
                                                      rules: [
                                                      { required: true, message: '请输入正确的手机号'}]
                                                    }
                                                ]">
                                    </a-input>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>办学性质</p>
                                <a-form-item >
                                    <a-select @change="e => IDchange(e)" v-decorator="['slNature', {initialValue: sID,rules: [{ required: true, message: '请选择办学性质' }]}]" placeholder="请选择办学性质">
                                        <a-select-option :key="item.id" v-for="item in schoolD.nature">{{item.title}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>统一社会信用代码</p>
                                <a-form-item>
                                    <a-input  placeholder="填写统一社会信用代码" v-decorator="[
                                                      'syCode',
                                                        {
                                                          initialValue: schoolD.cCode,
                                                          rules: [
                                                          { required: true, message: '请填写统一社会信用代码'}]
                                                        }
                                                    ]">
                                    </a-input>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>学校标识码</p>
                                <a-form-item>
                                    <a-input  placeholder="填写学校标识码" v-decorator="[
                                                      'slCode',
                                                        {
                                                          initialValue: schoolD.iCode,
                                                          rules: [
                                                          { required: true, message: '请填写学校标识码'}]
                                                        }
                                                    ]">
                                    </a-input>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>学生总人数</p>
                                <a-form-item>
                                    <a-input  placeholder="填写学生人数" v-decorator="[
                                                      'sNum',
                                                        {
                                                          initialValue: schoolD.student,
                                                          rules: [
                                                          { required: true, message: '请填写学生人数'}]
                                                        }
                                                    ]">
                                    </a-input>
                                    <p class="mx_people">人</p>
                                </a-form-item>

                            </div>
                            <div class="mx_lBox">
                                <p>学校学制</p>
                                <a-form-item >
                                    <a-checkbox-group v-decorator="[
                                                            'etStem',
                                                            {
                                                                initialValue: schoolD.cKList,
                                                                rules: [
                                                                    { required: true, message: '请选择学校学制'}
                                                                ]
                                                            }
                                                        ]"
                                    >
                                        <a-row >
                                            <a-col v-for="(item,index) in schoolD.sList" style="width: 180px;" :span="4" @change="e => onChange(e,item)">
                                                <a-checkbox :value="index">{{item.title}}</a-checkbox>
                                                <div v-if="index<3" class="mx_sCBox" v-show="item.state == true" style="width: 150px;">
                                                    <p style="margin-top: 10px;margin-bottom: 15px;">{{item.title}}学制</p>
                                                    <a-select @change="e => plChange(e,index)" :value="sKey[index]" placeholder="请选择学制">
                                                        <a-select-option v-for="(item2,index2) in item.children" :key="item2.id">{{item2.title}}</a-select-option>
                                                    </a-select>
                                                </div>
                                            </a-col>
                                        </a-row>
                                    </a-checkbox-group>
                                </a-form-item>
                            </div>
                            <div class="mx_cBox mx_adsBox">
                                <div class="mx_sCBox long">
                                    <p>所在省/市/区（县）</p>
                                    <a-form-item>
                                        <a-cascader
                                                placeholder="请选择省/市/区"
                                                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                                                v-decorator="[
                                                      'residence',
                                                      {
                                                            initialValue: schoolD.ads,
                                                            rules: [{ type: 'array', required: true, message: '请选择省/市/区' }],
                                                      }
                                                ]"
                                                :options="province"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="mx_FadsBox">
                                <p>详细地址</p>
                                <a-form-item>
                                    <a-input  placeholder="填写详细地址" v-decorator="[
                                                      'slAds',
                                                        {
                                                          initialValue: schoolD.location,
                                                          rules: [
                                                          { required: true, message: '请填写详细地址'}]
                                                        }
                                                    ]">
                                    </a-input>
                                </a-form-item>
                            </div>
                            <div class="Logo on" style="top: 100px;">
                                <p style="width: 100%;">LOGO</p>
                                <div class="img">
                                    <img @click="handlePreview(schoolD.logo)" style="width: 100%;height: 100%;" :src="schoolD.logo" alt="">
                                    <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                                        <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                                    </a-modal>
                                </div>
                                <a-form-item>
                                    <a-upload
                                            v-decorator="['upload', {
                                                initialValue:fileList,
                                                rules: [
                                                    { required: true, message: '请填上传图片'}
                                                ],
                                                getValueFromEvent: normFile,
                                            }]"

                                            name="file"
                                            :headers="headers"
                                            @change="upImg"
                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                    >
                                        <a-button>
                                            <a-icon type="upload" /> 更换LOGO
                                        </a-button>
                                    </a-upload>
                                </a-form-item>
                            </div>
                            <a-button class="mx_smBtn" type="primary" @click="check">更新保存</a-button>
                        </a-form>

                    </a-tab-pane>
                    <a-tab-pane tab="负者人信息" key="2">
                        <a-form :form="form2">
                            <div class="mx_txtBox">
                                <p>学校法人代表</p>
                                <a-form-item>
                                    <a-form-item>
                                        <a-input  placeholder="填写法人姓名" v-decorator="[
                                                        'lpName',
                                                        {
                                                          initialValue: cadreD.pName,
                                                          rules: [
                                                            { required: true, message: '请填写法人姓名'}
                                                          ]
                                                        }
                                                    ]">
                                        </a-input>
                                    </a-form-item>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>法人联系电话</p>
                                <a-form-item>
                                    <a-form-item>
                                        <a-input  placeholder="填写法人联系电话" v-decorator="[
                                                    'lpTel',
                                                    {
                                                      initialValue: cadreD.pPhone,
                                                      rules: [
                                                      { required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },
                                                      { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur']
                                                    }
                                                    ]">
                                        </a-input>
                                    </a-form-item>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>日常负者人</p>
                                <a-form-item>
                                    <a-form-item>
                                        <a-input  placeholder="填写日常负者人姓名" v-decorator="[
                                            'ntName',
                                            {
                                                  initialValue: cadreD.cName,
                                                  rules: [
                                                        { required: true, message: '填写日常负者人姓名'}
                                                  ]
                                            }
                                        ]">
                                        </a-input>
                                    </a-form-item>
                                </a-form-item>
                            </div>
                            <div class="mx_txtBox">
                                <p>日常负者人联系电话</p>
                                <a-form-item>
                                    <a-form-item>
                                        <a-input  placeholder="填写日常负者人联系电话" v-decorator="[
                                            'ntTel',
                                            {
                                                  initialValue: cadreD.cPhone,
                                                  rules: [
                                                        { required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },
                                                  { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur']
                                            }
                                        ]">
                                        </a-input>
                                    </a-form-item>
                                </a-form-item>
                            </div>
                            <a-button class="mx_smBtn" type="primary" @click="check2">更新保存</a-button>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane tab="证件信息" key="3">
                        <a-form :form="form3" style="min-height: 620px;">
                            <!--执照-->
                            <div class="mx_License">
                                <div class="mx_left">
                                    <h2>营业执照信息填写</h2>
                                    <div class="mx_txtBox">
                                        <p>注册号</p>
                                        <a-form-item>
                                            <a-form-item>
                                                <a-input  placeholder="填写营业执照注册号" v-decorator="[
                                                        'rNum',
                                                        {
                                                            initialValue: cfData.lCode,
                                                          rules: [
                                                            { required: true, message: '请填写营业执照注册号'}
                                                          ]
                                                        }
                                                    ]">
                                                </a-input>
                                            </a-form-item>
                                        </a-form-item>
                                    </div>
                                    <div class="mx_txtBox">
                                        <p>有效起始日期</p>
                                        <a-form-item>
                                            <a-range-picker v-decorator="['rpicker',{initialValue: cfData.ltList}, rangeConfig]" />
                                        </a-form-item>
                                    </div>
                                </div>
                                <div class="Logo on">
                                    <p style="width: 100%;">证件图片</p>
                                    <div class="img">
                                        <img @click="handlePreview(cfData.lUrl)" style="width: 100%;height: 100%;" :src="cfData.lUrl" alt="">
                                        <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                                            <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                                        </a-modal>
                                    </div>
                                    <a-form-item>
                                        <a-upload
                                                v-decorator="['upload', {
                                                    initialValue:fileList2,
                                        rules: [
                                            { required: true, message: '请填上传图片'}
                                        ],
                                        getValueFromEvent: normFile,
                                    }]"
                                                name="file"
                                                :headers="headers"
                                                @change="upImg2"
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                        >
                                            <a-button>
                                                <a-icon type="upload" /> 更换LOGO
                                            </a-button>
                                        </a-upload>
                                    </a-form-item>
                                </div>
                            </div>
                            <!--色线-->
                            <div class="mx_color"></div>
                            <!--许可证-->
                            <div class="mx_permit">
                                <div class="mx_left">
                                    <h2>食品经营许可证信息填写</h2>
                                    <div class="mx_txtBox">
                                        <p>许可证编号</p>
                                        <a-form-item>
                                            <a-form-item>
                                                <a-input  placeholder="填写许可证编号" v-decorator="[
                                                        'lCode',
                                                        {
                                                          initialValue: cfData.fCode,
                                                          rules: [
                                                            { required: true, message: '请填许可证编号'}
                                                          ]
                                                        }
                                                    ]">
                                                </a-input>
                                            </a-form-item>
                                        </a-form-item>
                                    </div>
                                    <div class="mx_txtBox">
                                        <p>有效起始日期</p>
                                        <a-form-item>
                                            <a-range-picker v-decorator="['rpicker2',{initialValue: cfData.ftList} ,rangeConfig]" />
                                        </a-form-item>
                                    </div>
                                </div>
                                <div class="Logo on">
                                    <p style="width: 100%;">证件图片</p>
                                    <div class="img">
                                        <img @click="handlePreview(cfData.fUrl)" style="width: 100%;height: 100%;" :src="cfData.fUrl" alt="">
                                        <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                                            <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                                        </a-modal>
                                    </div>
                                    <a-form-item>
                                        <a-upload
                                                v-decorator="['upload2', {
                                                initialValue:fileList3,
                                        rules: [
                                            { required: true, message: '请填上传图片'}
                                        ],
                                        getValueFromEvent: normFile,
                                    }]"
                                                name="file"
                                                :headers="headers"
                                                @change="upImg3"
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                        >
                                            <a-button>
                                                <a-icon type="upload" /> 更换LOGO
                                            </a-button>
                                        </a-upload>
                                    </a-form-item>
                                </div>
                            </div>
                            <a-button class="mx_smBtn" type="primary" @click="check3">更新保存</a-button>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane tab="地理位置" key="4">
                <div class="amap-page-container">
                    <div class="search-box" style="width: 300px;">
                        <input
                                @input="initSearch"
                                v-model="searchKey"
                                type="search"
                                id="search">
                        <button @click="searchByHand">搜索</button>
                        <div class="tip-box" id="searchTip"></div>
                    </div>
                    <el-amap
                            style="height: 620px;"
                            vid="amap"
                            :zoom="zoom"
                            class="amap-demo"
                            :amapManager="amapManager"
                            :events="events"
                    >
                    </el-amap>
                </div>
                <ul id="my-list">
                    <li v-for="item in result" :key="item.id">{{item.name}}</li>
                </ul>
            </a-tab-pane>
                </a-tabs>
            </a-skeleton>
        </div>
    </a-locale-provider>
</template>


<script>
import AMap from 'vue-amap';
import {AMapManager} from "vue-amap"
AMap.initAMapApiLoader({
    //高德的key
    key: "cc644a48b701c256e9a827f068743fdd",
    // 插件集合
    plugin: [
        "AMap.Autocomplete",// 输入提示插件
        "AMap.PlaceSearch",// POI搜索插件
        "AMap.Scale",// 右下角缩略图插件 比例尺
        "AMap.OverView",// 地图鹰眼插件
        "AMap.ToolBar",// 地图工具条
        "AMap.MapType",// 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        "AMap.PolyEditor",// 编辑 折线多，边形
        "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
        "AMap.Geocoder",// 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
        "AMap.AMapUI",// UI组件
        "AMap.ElasticMarker"
    ],
    v: "1.4.4",
    uiVersion: "1.0.11" // 版本号
});
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';//国际化  中文
import moment from 'moment';//国际化
import 'moment/locale/zh-cn';//国际化
import globalApi from '../../globalApi/globalApi';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
            key:'1',
            //加载
            loading:true,
            //预览图片
            previewVisible:false,
            //高德地图配置
            zoom:13,
            center: [121.329402,31.228667],
            result:[],
            address:"",
            radius:100,
            searchKey:'',
            amapManager:new AMapManager(),
            map:null,
            poiPicker:null,
            events:{
                init(o){
                    this.map=o;
                },
            },
            //高德地图配置end
            zhCN,//中文配置
            headers: {
                authorization: 'authorization-text',
            },//上传图片配置
            form: this.$form.createForm(this),
            form2:this.$form.createForm(this),
            form3:this.$form.createForm(this),
            sName:'重庆巴蜀小学',
            slNature:'Jack',//学校性质
            KShow0:false,
            KShow1:false,
            KShow2:false,
            upRImg:false,//营业执照是否上传
            rErr:false,//显示执照提示
            upLImg:false,//食品许可证是否上传
            lErr:false,//显示许可证提示
            jVal:'jack',
            pVal:'jack',
            kVal:'jack',
            province:[],
            cityShow:true,
            areaShow:true,
            rangeConfig: {
                rules: [{ type: 'array', required: true, message: '请选择起始日期' }],
            },
            rEShow2:false,
            rEShow:false,
            //办学信息
            schoolD:{
                sList:[],
                cKList:[],
                cCode:'',
                iCode:'',
                mobile:'',
                ads:[1,2,3],
                student:'',
                location:'',
                nature:[],
                logo:''
            },
            //负责人、法人信息
            cadreD:{
                cNmae:'',
                cPhone:'',
                //法人
                pName:'',
                pPhone:''
            },
            //营业执照&&经营许可
            cfData:{
                //执照
                lCode:'',
                lSTime:'',
                lETime:'',
                lUrl:'',
                ltList:[],
                //许可
                fCode:'',
                fSTime:'',
                fETime:'',
                fUrl:'',
                ftList:[],
            },
            //图片显示
            showUrl:'',
            //图片数组
            fileList:[],
            fileList2:[],
            fileList3:[],
            //学制
            sKey:[0,0,0],
            //办学性质
            sID:0,
        }
    },
    methods: {
        //标签改变
        keyChange(e){
            this.key = e;
            this.loading = true;
           setTimeout(()=>{
               this.loading = false;
           },300);
        },
        IDchange(e) {
            this.sID = e;
        },
        plChange(e,i){
            this.sKey.splice(i,1,e)
            console.log(this.sKey);
        },
        handleChange(e){
            console.log(e);
        },
        onChange(e,val){
            val.state = !val.state;
        },
        check  () {
            const validateFieldsKey = ['etStem','mobile', 'syCode','slCode','sNum','residence','slAds','slNature','upload']
            this.form.validateFields(validateFieldsKey,(err,values) => {
                if (!err) {
                    console.log(values);
                    let x = ''
                    values.etStem.forEach((e,i)=>{
                        x += this.schoolD.sList[e].id + ',' + this.sKey[e] + ','
                    });
                    x = x.slice(0,x.length-1);
                    console.log(x);
                    let data ={
                            url:'api/school',
                            method:'post',
                            data:{
                                scene:'school.store.base',
                                logo:values.upload[0].response.data.id,
                                location:values.slAds,
                                nature:values.slNature,
                                credit_code:values.syCode,
                                sign:values.slCode,
                                student_count:values.sNum,
                                hierarchy:x,
                                province_id:values.residence[0],
                                city_id:values.residence[1],
                                area_id:values.residence[2],
                                mobile:values.mobile
                            }
                        }
                        console.log(data);
                        this.$apiAxiox(data).then((res)=>{
                            if(res.data.code == 0){
                                this.$message.success(`更新成功`);
                            };
                        })
                    }

                },
            );
        },
        check2() {
            const validateFieldsKey = ['lpName', 'lpTel','ntName','ntTel']
            this.form2.validateFields(validateFieldsKey,(err,values) => {
                    console.log(values)
                    if (!err) {
                        let data ={
                            url:'api/school',
                            method:'post',
                            data:{
                                scene:'school.store.lead',
                                person_title:values.lpName,
                                person_phone:values.lpTel,
                                cadre_title:values.ntName,
                                cadre_phone:values.ntTel
                            }
                        }
                        console.log(data);
                        this.$apiAxiox(data).then((res)=>{
                            if(res.data.code == 0){
                                this.$message.success(`更新成功`);
                            };
                        })
                    }
                },
            );
        },
        check3() {
            const validateFieldsKey = ['rNum', 'lCode','rpicker','rpicker2','upload','upload2']
            this.form3.validateFields(validateFieldsKey,(err,values) => {
                    if (!err) {
                        console.log(values);
                        let sT1 = parseInt(new Date(values.rpicker[0]._d).getTime() / 1000),
                            eT1 = parseInt(new Date(values.rpicker[1]._d).getTime() / 1000),
                            sT2 = parseInt(new Date(values.rpicker2[0]._d).getTime() / 1000),
                            eT2 = parseInt(new Date(values.rpicker2[1]._d).getTime() / 1000);

                        console.log(moment(values.rpicker[0]._d).format('YYYY-MM-DD'));
                        console.log(moment(values.rpicker[1]._d).format('YYYY-MM-DD'));
                        console.log(moment(values.rpicker2[0]._d).format('YYYY-MM-DD'));
                        console.log(moment(values.rpicker2[1]._d).format('YYYY-MM-DD'));


//                        return;
                        let data = {
                            url:'api/school',
                            method:'post',
                            data:{
                                scene:'school.store.papers',
                                enclosure_operate:values.upload[0].response.data.id,
                                license_no_operate: values.rNum,
                                issuance_operate: sT1,
                                term_operate:eT1,
                                enclosure_bus:values.upload2[0].response.data.id,
                                license_no_bus:values.lCode,
                                issuance_bus:sT2,
                                term_bus:eT2,
                            },
                        };
                        this.$apiAxiox(data).then((res)=>{
                           if(res.data.code == 0){
                               this.$message.success(`更新成功`);
                           };
                        })

                    }
                },
            );
        },
        // 手机号验证回调
        handlePhoneCheck(rule, value, callback) {
            callback()
        },
        slnChange(val){
            if(val.length>=1){
                this.etStem = true;
                this.setShow = false;
            }else{
                this.etStem = false;
                this.setShow = true;
            }
        },
        upImg(info) {
            if (info.file.status !== 'uploading') {
                console.log(1);
            }
            if (info.file.status === 'done') {
                this.schoolD.logo = info.file.response.data.url
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
            }
        },
        upImg2(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                this.cfData.lUrl = info.file.response.data.url
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
            }
        },
        upImg3(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                this.cfData.fUrl = info.file.response.data.url
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
            }
        },
        initSearch(){
            let vm=this;
            let map=this.amapManager.getMap();

            AMapUI.loadUI(['misc/PoiPicker','overlay/SimpleInfoWindow','misc/MarkerList'], function(PoiPicker,SimpleInfoWindow,MarkerList) {
                let poiPicker = new PoiPicker({
                    input: 'search', //输入框id
                    placeSearchOptions: {
                        map: map,
                        pageSize: 10
                    },//地点搜索配置
                    suggestContainer:'searchTip',//输入提示显示DOM
                    searchResultsContainer:'searchTip',//搜索结果显示DOM

                });
                vm.poiPicker = poiPicker;
                //监听poi选中信息
                poiPicker.on('poiPicked', function(poiResult) {
                    let source = poiResult.source;
                    let poi = poiResult.item;
                    if (source !== 'search') {
                        poiPicker.searchByKeyword(poi.name);
                    } else {
                        poiPicker.clearSearchResults();
                        vm.center=[poiResult.item.location.lng,poiResult.item.location.lat];
                        vm.address=poi.name;
                        vm.searchKey="";
                    }
                });
            });

        },
        searchByHand(){
            if(this.searchKey!=''){
                this.poiPicker.searchByKeyword(this.searchKey);
            }
        },
        normFile  (e) {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        },
        handlePreview (url) {
            this.showUrl = url
            this.previewVisible = true
        },
        handleCancel () {
            this.previewVisible = false
        },
        handleOk(){
            this.previewVisible = false
        }
    },
    created(){
        //地理位置获取
        let x = localStorage.getItem('ads');
        if(x != null){
            let data = JSON.parse(x);
            data.forEach((e,i)=>{
                this.province.push(e)
            })
        }else{
            axios({
                method: "get",
                url: globalApi.BASE_URL + 'api/common/area',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res) => {
                console.log(JSON.stringify(res.data.data));
                localStorage.setItem('ads',JSON.stringify(res.data.data));
                res.data.data.forEach((e,i)=>{
                    this.province.push(e)
                })
            }).catch(function(err) {

            });
        }

        //学校信息获取
        let token = localStorage.getItem('token');
        axios({
            method: "get",
            url: globalApi.BASE_URL + 'api/school',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            this.sKey  = [];
            this.schoolD.ads = [];
            //办学信息
            this.sName = res.data.data.title;
            this.schoolD.sList = res.data.data.grade;
            this.schoolD.cCode = res.data.data.credit_code;
            this.schoolD.iCode = res.data.data.sign;
            this.schoolD.mobile = res.data.data.mobile;
            this.schoolD.student = res.data.data.student_count;
            this.schoolD.location = res.data.data.location;
            this.schoolD.ads.push(res.data.data.province_id);
            this.schoolD.ads.push(res.data.data.city_id);
            this.schoolD.ads.push(res.data.data.area_id);
            this.schoolD.logo = res.data.data.logo_url;
            if(res.data.data.nature != null || res.data.data.nature != ""){
                this.sID = res.data.data.nature;
            }

            this.schoolD.sList.forEach((e,i)=>{
                let flag = true;
                if(e.state == true){
                    this.schoolD.cKList.push(i);
                    flag = true;
                }else{
                    flag = false;
                };

                if(flag){
                    e.children.forEach((e1,i1)=>{
                        if(e1.state == true){
                            this.sKey.push(e1.id);
                        }
                    });
                }else{
                    if(e.children[0] != undefined){
                        this.sKey.push(e.children[0].id);
                    }
                }


            });
            let obj = {
                response:{
                    data:{
                        id:res.data.data.logo
                    }
                },
                status: 'done',
                url: res.data.data.logo_url,
            };

            this.fileList.push(obj);
            //负责人法人信息
            this.cadreD.cName = res.data.data.cadre_title;
            this.cadreD.cPhone = res.data.data.cadre_phone;
            this.cadreD.pName = res.data.data.person_title;
            this.cadreD.pPhone = res.data.data.person_phone;
            //证件信息
            if(res.data.data.cert != null){
                this.cfData.lCode = res.data.data.cert.license_no;
                this.cfData.lUrl = res.data.data.cert.enclosure_src;
                let obj1 = {
                    response:{
                        data:{
                            id:res.data.data.cert.enclosure
                        }
                    },
                    status: 'done',
                    url: res.data.data.cert.enclosure_src,
                }
                this.fileList2.push(obj1);
                if(res.data.data.cert != null){
                    this.cfData.lSTime = moment(res.data.data.cert.issuance*1000);
                    this.cfData.lETime = moment(res.data.data.cert.term*1000);
                }else{
                    this.cfData.lSTime = moment(new Date);
                    this.cfData.lETime = moment(new Date);
                }
                this.cfData.ltList.push(this.cfData.lSTime)
                this.cfData.ltList.push(this.cfData.lETime)

                if(res.data.data.food_license !== null){
                    this.cfData.fCode = res.data.data.food_license.license_no;
                    this.cfData.fUrl = res.data.data.food_license.enclosure_src;
                    let obj2 = {
                        response:{
                            data:{
                                id:res.data.data.food_license.enclosure
                            }
                        },
                        status: 'done',
                        url: res.data.data.food_license.enclosure_src,
                    }
                    this.fileList3.push(obj2);
                }

                if(res.data.data.food_license != null){
                    console.log(res.data.data.food_license.issuance);
                    console.log(res.data.data.food_license.term);
                    this.cfData.fSTime = moment(res.data.data.food_license.issuance*1000);
                    this.cfData.fETime = moment(res.data.data.food_license.term*1000);
                    console.log(this.cfData.fSTime.format('YYYY-MM-DD'));
                    console.log(this.cfData.fETime.format('YYYY-MM-DD'));
                }else{
                    this.cfData.fSTime = moment(new Date);
                    this.cfData.fETime = moment(new Date);
                }
                this.cfData.ftList.push(this.cfData.fSTime)
                this.cfData.ftList.push(this.cfData.fETime)
            }
            this.loading = false;
        }).catch(function(err) {
            console.log(err,'1111');
        });
        //办学性质获取
        let data ={
            url:'api/common/dictionaries',
            method:'get',
            data:{}
        };
        this.$apiAxiox(data).then((res)=>{
            this.schoolD.nature = res.data.data.nature;
            if(this.sID == 0){
                this.sID = this.schoolD.nature[0].id;
            }
        })


    },
    watch:{
        map:function(){
            if(this.map!=null){
                this.initSearch();
            }
        }
    },
}
</script>

<style scoped>
    #mx_sMessage .mx_people{
        position: absolute;
        top: 6px;
        right: 6px;
        height: 20px;
        text-align: center;
        line-height: 18px;
    }
    #mx_sMessage .Logo{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: 130px;
        left: 500px;
        width: 124px;
    }
    #mx_sMessage .Logo.on{
        top: 0;
    }
    #mx_sMessage #container {
        width: 100%;
        height: 620px;
    }
    #mx_sMessage .Logo.mx_right{
        top: 30px;
    }
    #mx_sMessage .mx_License{
        position: relative;
        height: 265px;
    }
    #mx_sMessage .mx_color{
        height: 10px;
        background: #f2f2f2;
    }
    #mx_sMessage .mx_permit{
        margin-top: 30px;
        position: relative;
        height: 265px;
    }

    #mx_sMessage .Logo .img{
        width: 100%;
        height: 124px;
        border:1px dashed #999;
        margin-bottom: 20px;
    }
    #mx_sMessage .Logo .img.on{
        border-color:red;
    }
    #mx_sMessage h4{
        font-size: 24px;
        font-weight: bold;
    }
    #mx_sMessage .mx_fClor{
        color:red;
        margin: 0;
        height: 20px;
        line-height: 1;
    }
    #mx_sMessage .mx_txtBox{
        width: 300px;
    }
    #mx_sMessage .mx_lBox{
        width: 1000px;
    }
    #mx_sMessage .mx_cBox{
        margin-top: 10px;
        width: 470px;
    }
    #mx_sMessage .mx_FadsBox{
        margin-top: 20px;
        width: 450px;
    }
    #mx_sMessage .mx_FadsBox p{
        margin-bottom: 5px;
    }
    #mx_sMessage .mx_adsBox{
        margin-top: 30px;
    }
    #mx_sMessage .mx_smBtn{
        margin-top: 20px;
    }
    #mx_sMessage .mx_cBox .mx_sCBox.long{
        width: 96%;
    }
    #mx_sMessage .mx_cBox .mx_sCBox .ant-select.ant-select-enabled{
        width: 100%;
    }
    #mx_sMessage .mx_txtBox p{
       margin: 0 0 5px 0;
    }
    #mx_sMessage .txtBox .ant-form-item{
        margin-bottom: 15px;
    }
    #mx_sMessage .txtBox .mx_borR{
        border-color:red;
    }

    #mx_sMessage .ant-input:hover,#mx_sMessage .ant-input:focus{
        border-color:#02BB72;
    }
    #mx_sMessage .ant-input.mx_borR:hover,#mx_sMessage .ant-input.mx_borR:focus{
        border-color:red;
        outline: none;
    }
    #mx_sMessage .ant-input.mx_borR{
        border-color:red;
    }
    #mx_sMessage .ant-checkbox-wrapper:hover .ant-checkbox-inner{
        border-color:#02BB72;
    }
    #mx_sMessage .ant-checkbox-group{
        width: 100%;
    }
    #mx_sMessage .amap-page-container {
        height: 620px;
        position: relative;
    }
    #mx_sMessage .search-box{
        position: absolute;
        z-index: 5;
        width: 90%;
        left: 5%;
        top: 10px;
        height: 30px;
    }
    #mx_sMessage .search-box input{
        float: left;
        width: 80%;
        height: 100%;
        border: 1px solid #38f;
        padding: 0 8px;
    }
    #mx_sMessage .search-box button{
        float: left;
        width: 20%;
        height: 100%;
        background: #38f;
        border: 1px solid #38f;
        color: #fff;
    }
    #mx_sMessage .tip-box{
        width: 100%;
        max-height:260px;
        position: absolute;
        top: 30px;
        overflow-y: auto;
        background-color: #fff;
    }

</style>

<style>
    #mx_sMessage .ant-select-selection:hover,#mx_sMessage .ant-select-selection:focus{
        border-color:#02BB72!important;
        outline:none;
    }
    #mx_sMessage .ant-row.ant-form-item{
        margin-bottom: 10px;
    }
    #mx_sMessage .ant-checkbox-checked .ant-checkbox-inner{
        border-color:#02BB72;
        background:#02BB72;
        outline:none;
    }
    #mx_sMessage .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner{
        border-color:#02BB72;
        outline:none;
    }
    #mx_sMessage .ant-layout-content{
        overflow: scroll;
    }
    #mx_sMessage .ant-select.ant-select-disabled{
        width: 100%;
    }
</style>