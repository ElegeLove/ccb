<template>
    <div id="mx_canteen">
        <router-link to="mx_cMessage" class="back">
            <a-icon type="arrow-left" />
            <p>{{title}}</p>
        </router-link>
        <a-skeleton :loading="loading" active :paragraph="{rows: 20}">
            <a-form :form="form">
            <div class="mx_top" style="position: relative;margin-top: 20px;">
                <div class="mx_txtBox">
                    <p>食堂名称</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写食堂名称" v-decorator="[
                                                'ceName',
                                                {
                                                  initialValue: fRoom.title,
                                                  rules: [
                                                    { required: true, message: '请填写食堂名称'}
                                                  ]
                                                }
											]">
                            </a-input>
                        </a-form-item>
                    </a-form-item>
                </div>
                <div class="mx_txtBox">
                    <p>负责人</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写负责人姓名" v-decorator="[
                                                'lpName',
                                                {
                                                  initialValue: fRoom.rName,
                                                  rules: [
                                                    { required: true, message: '请填写负责人姓名'}
                                                  ]
                                                }
											]">
                            </a-input>
                        </a-form-item>
                    </a-form-item>
                </div>
                <div class="mx_txtBox">
                    <p>联系方式</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写联系电话" v-decorator="[
                                            'lpPhone',
                                            {
                                              initialValue: fRoom.tel,
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
                    <p>食堂详细地址</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写食堂详细地址" v-decorator="[
                                    'ceAds',
                                    {
                                          initialValue: fRoom.ads,
                                          rules: [
                                                { required: true, message: '请填写食堂详细地址'}
                                          ]
                                    }
                                ]">
                            </a-input>
                        </a-form-item>
                    </a-form-item>
                </div>
                <div class="mx_lBox">
                    <p>供餐对象选择</p>
                    <a-form-item >
                        <a-checkbox-group v-decorator="[
                                                'etStem',
                                                {
                                                    initialValue: fRoom.stateList,
                                                    rules: [
                                                        { required: true, message: '请选择学校学制'}
                                                    ]
                                                }
                        ]">
                            <a-row >
                                <a-col v-for="(item,index) in fRoom.list" :span="6" @change="e => onChange(e,item)">
                                    <a-checkbox :value="item.id">{{item.title}}</a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </a-form-item>
                </div>
                <div class="mx_txtBox">
                    <p>该食堂就餐教师人数</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写教师就餐人数" v-decorator="[
                                    'pNum',
                                    {
                                          initialValue: fRoom.tNum,
                                          rules: [
                                                { required: true, message: '请填教师就餐人数'}
                                          ]
                                    }
                                ]">
                            </a-input>
                        </a-form-item>
                    </a-form-item>
                </div>
                <div class="Logo">
                    <p style="width: 130%;">餐饮服务安全等级公示</p>
                    <div class="img" :class="{on: rEShow == true}">
                        <img @click="handlePreview(fRoom.img)" style="width: 100%;height: 100%;" :src="fRoom.img" alt="">
                        <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                            <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                        </a-modal>
                    </div>
                    <a-form-item>
                        <a-upload
                                v-decorator="['upload', {
                                initialValue:fRoom.fileList,
                                rules: [
                                    { required: true, message: '请填上传图片'}
                                ],
                                getValueFromEvent: normFile,
                            }]"
                                class="mx_right"
                                :showUploadList="false"
                                :multiple="true"
                                :headers="headers"
                                @change="upImg"
                                name="file"
                                action="http://bate.ccb.micmio.com/api/common/upload"
                        >
                            <a-button>
                                <a-icon type="upload" /> 上传图片
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </div>
            </div>
            <div class="mx_btn" style="position: relative;">
                <h2>营业执照信息填写</h2>
                <div class="mx_txtBox">
                    <p>注册号</p>
                    <a-form-item>
                        <a-form-item>
                            <a-input  placeholder="填写营业执照注册号" v-decorator="[
                                    'code',
                                    {
                                          initialValue: fRoom.code,
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
                        <a-range-picker v-decorator="['rpicker', {initialValue: fRoom.timeList},  rangeConfig]" />
                    </a-form-item>
                </div>
                <div class="Logo on">
                    <p style="width: 100%;">证件图片</p>
                    <div class="img" :class="{on: rEShow2 == true}">
                        <img @click="handlePreview(fRoom.img2)" style="width: 100%;height: 100%;" :src="fRoom.img2" alt="">
                        <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                            <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                        </a-modal>
                    </div>
                    <a-form-item>
                        <a-upload
                                v-decorator="['upload2', {
                                initialValue:fRoom.fileList2,
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
            <a-button class="mx_smBtn" type="primary" @click="check">{{btnName}}</a-button>
        </a-form>
        </a-skeleton>
    </div>
</template>

<script>
    import globalApi from '../../globalApi/globalApi';
    import axios from 'axios';
    import qs from 'qs';
    import moment from 'moment';
    export default {
        data() {
            return {
                previewVisible:false,
                title:'',
                form:this.$form.createForm(this),
                setShow:false,//显示学制选择提示
                etStem:false,//是否选择学校学制
                rangeConfig: {
                    rules: [{ type: 'array', required: true, message: '请选择起始日期' }],
                },
                headers: {
                    authorization: 'authorization-text',
                },//上传图片配置
                rErr:false,//图片是否上传
                rErr2:false,//图片是否上传
                rEShow:false,//图片未上传提示
                rEShow2:false,//图片未上传提示
                btnName:'立即添加',
                //食堂数据
                fRoom:{
                    title:'',
                    rName:'',
                    tel:'',
                    ads:'',
                    list:[],
                    stateList:[],
                    tNum:'',
                    code:'',
                    timeList:[],
                    fileList:[],
                    fileList2:[],
                    //选择对象
                    sList:[],
                    //图片
                    img:'',
                    img2:'',
                },
                //图片显示
                showUrl:'',
                loading:true,
                foodRoomID:'',
            }
        },
        methods:{
            slnChange(val){
                if(val.length>=1){
                    this.etStem = true;
                    this.setShow = false;
                }else{
                    this.etStem = false;
                    this.setShow = true;
                }
            },
            handlePhoneCheck(rule, value, callback){
                callback()
            },
            check(){
                const validateFieldsKey = ['ceName', 'lpName','lpPhone','ceAds','pNum','code','rpicker','etStem','upload','upload2']
                this.form.validateFields(validateFieldsKey,(err,values) => {
                    console.log(values)
                    if (!err) {
                        //编辑
                        if(this.$route.query.btnName != undefined ){
                            let sT = moment(values.rpicker[0]._d).format("YYYY-MM-DD"),
                                eT = moment(values.rpicker[1]._d).format("YYYY-MM-DD");
                            console.log(sT, eT);
                            let x = '';
                            values.etStem.forEach((e,i)=>{
                                x += this.fRoom.list[i].id + ','
                            })
                            x = x.slice(0,x.length-1);
                            let data = {
                                title:values.ceName,
                                charge_title:values.lpName,
                                charge_phone:values.lpPhone,
                                loca_detail:values.ceAds,
                                teacher_count:values.pNum,
                                license_no:values.code,
                                supply:x,
                                security:values.upload[0].response.data.id,
                                enclosure:values.upload2[0].response.data.id,
                                issuance:sT,
                                term:eT
                            };
                            axios({
                                method: "put",
                                url: globalApi.BASE_URL + 'api/school/canteen/' + this.foodRoomID,
                                data: qs.stringify(data),
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then((res) => {
                                if(res.data.code == 0){
                                    this.$message.success(`更新成功`);
                                    this.$router.push({
                                        name: 'mx_cMessage',
                                    });
                                };
                            }).catch(function (err) {

                            });
                        }else{
                            console.log(11111);
                            let sT = moment(values.rpicker[0]._d).format("YYYY-MM-DD"),
                                eT = moment(values.rpicker[1]._d).format("YYYY-MM-DD");
                            let x = '';
                            this.fRoom.list.forEach((e,i)=>{
                                if(e.state == true){
                                    x += this.fRoom.list[i].id + ','
                                }
                            })
                            x = x.slice(0,x.length-1);
                            let data = {
                                url:'api/school/canteen',
                                method:'post',
                                data:{
                                    title:values.ceName,
                                    charge_title:values.lpName,
                                    charge_phone:values.lpPhone,
                                    loca_detail:values.ceAds,
                                    teacher_count:values.pNum,
                                    license_no:values.code,
                                    supply:x,
                                    security:values.upload[0].response.data.id,
                                    enclosure:values.upload2[0].response.data.id,
                                    issuance:sT,
                                    term:eT
                                }
                            };
                            this.$apiAxiox(data).then((res)=>{
                                if(res.data.code == 0){
                                    this.$message.success(`添加成功`);
                                    this.$router.push({
                                        name: 'mx_cMessage',
                                    });
                                };
                            })
                        }
                    }
                });
            },
            upImg(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.fRoom.img = info.file.response.data.url
                    this.$message.success(`上传成功`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败`);
                }
            },
            upImg2(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.fRoom.img2 = info.file.response.data.url
                    this.$message.success(`上传成功`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败`);
                }
            },
            normFile  (e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            },
            onChange(e,val){
                val.state = !val.state;
                console.log(this.fRoom.list);
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
            let that = this;
            this.title = this.$route.query.title;
            this.foodRoomID = this.$route.query.id;
            if(this.$route.query.btnName != undefined ){
                this.btnName = this.$route.query.btnName;
                axios({
                    method: "get",
                    url: globalApi.BASE_URL + 'api/school/canteen/' + this.foodRoomID,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    this.fRoom.title = res.data.data.title;
                    this.fRoom.rName = res.data.data.charge_title;
                    this.fRoom.tel = res.data.data.charge_phone;
                    this.fRoom.ads = res.data.data.loca_detail;
                    this.fRoom.tNum = res.data.data.teacher_count;
                    this.fRoom.list = res.data.data.supply_sate;
                    this.fRoom.code = res.data.data.license_no;
                    //供餐对象
                    if(this.fRoom.list != null){
                        this.fRoom.list.forEach((e,i)=>{
                            if(e.state == true){
                                this.fRoom.stateList.push(e.id);
                            };
                        });
                    }
                    //时间
                    console.log(res.data.data.issuance);
                    if(res.data.data.issuance != '' && res.data.data.issuance != undefined){
                        that.fRoom.timeList.push(moment(res.data.data.issuance * 1000));
                        that.fRoom.timeList.push(moment(res.data.data.term * 1000));
                    }else{
                        that.fRoom.timeList.push(moment(new Date));
                        that.fRoom.timeList.push(moment(new Date));
                    };
                    //证书图片
                    if(res.data.data.enclosure_src != ''){
                        let obj = {
                            response:{
                                data:{
                                    id:res.data.data.enclosure
                                }
                            },
                            status: 'done',
                            url: res.data.data.enclosure_src
                        }
                        that.fRoom.img2 = res.data.data.enclosure_src;
                        that.fRoom.fileList2.push(obj);
                    }
                    if(res.data.data.security_src != ''){
                        let obj = {
                            response:{
                                data:{
                                    id:res.data.data.security
                                }
                            },
                            status: 'done',
                            url: res.data.data.security_src
                        }
                        that.fRoom.img = res.data.data.security_src;
                        that.fRoom.fileList.push(obj);
                    }
                    this.loading = false
                }).catch(function (err) {
                    console.log(err);
                });
            }else{
                //供餐对象
                let data2 = {
                    url:'api/school/intelligence',
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data2).then((res)=>{
                    console.log(res.data.data,'111111');
                    this.fRoom.list = res.data.data
                });
                setTimeout(()=>{
                    this.loading = false
                },500)
            }
        }
    }
</script>

<style scoped>
    #mx_canteen .back{
        width: 100px;
        display: flex;
        min-height:30px;
        justify-content: flex-start;
        align-items: center;
        color: #000;
    }
    #mx_canteen .ant-form.ant-form-horizontal{
        width: 350px;
    }
    #mx_canteen .mx_txtBox{
        width: 100%;
    }
    #mx_canteen .mx_lBox{
        margin-bottom: 20px;
    }
    #mx_canteen .ant-row.ant-form-item{
        width: 330px;
    }
    #mx_canteen .Logo{
        position: absolute;
        top: 0;
        left: 500px;
        width: 110px;
    }
    #mx_canteen .Logo .cTxtR{
        width: 100%;
        color:red;
        text-align: center;
        margin-top: 10px;
    }
    #mx_canteen .Logo .img{
        width: 110px;
        height: 124px;
        border:1px dashed #999;
        margin: 10px 0;
    }

    #mx_canteen .Logo .img.on{
        border-color: red;
    }

    #mx_canteen .mx_right{
        width: 100%;
    }
    #mx_canteen .mx_right p{
        margin: 0;
    }
    #mx_canteen .ant-row{
        width: 330px;
    }
    #mx_canteen .back:hover{
        cursor: pointer;
    }
    #mx_canteen .back p{
        margin: 0 0 0 10px;
    }
    #mx_canteen .mx_txtBox{
        margin-bottom: 20px;
    }
    #mx_canteen .ant-row.ant-form-item{
        margin-bottom: 0;
    }
    #mx_canteen h2{
        margin-top: 50px;
    }
    #mx_canteen .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled){
        border-color:#02bb72;
    }
    .mx_smBtn{
        margin: 40px 0 20px 0;
    }

</style>

<style>
    #mx_canteen .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled){
        border-color:#02bb72;
    }
    #mx_canteen .ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled){
        border-color:#02bb72;
    }
    #mx_canteen .ant-checkbox-wrapper:hover .ant-checkbox-inner{
        border-color:#02BB72;
    }
    #mx_canteen .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner{
        border-color:#02BB72;
        outline:none;
    }
    #mx_canteen .ant-checkbox-checked .ant-checkbox-inner{
        border-color:#02BB72;
        outline:none;
        background: #02BB72;
    }
</style>
