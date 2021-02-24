<template>
    <div id="mx_order">
        <div class="dlist">
            <a-form :form="form">
                <div class="t">
                    <div class="tabBox">
                        <p>食堂：</p>
                        <a-select @change="plChange" :value="rState" style="width: 120px;margin-right: 40px;">
                            <a-select-option v-for="(item,index) in rSList" :key="index+1">{{item.title}}</a-select-option>
                        </a-select>
                    </div>
                    <div class="tabBox">
                        <p>单号：</p>
                        <a-form-item style="width: 200px;">
                            <a-input placeholder="请输入单号" :value="dataObj.code" @change="inpChange"/>
                        </a-form-item>
                    </div>
                </div>
                <div class="b">
                    <div class="tabBox">
                        <p>状态：</p>
                        <a-select @change="plChange2" v-decorator="['select']" :value="rstate" style="width: 120px;margin-right: 40px;">
                            <a-select-option v-for="(item,index) in rList" :key="index+1">{{item.title}}</a-select-option>
                        </a-select>
                    </div>
                    <div class="tabBox">
                        <p>日期：</p>
                        <a-form-item>
                            <a-range-picker @change="rPickChange" />
                        </a-form-item>
                    </div>
                    <a-button type="primary" style="margin-left: 20px;margin-top: 20px;" @click="getPlist('2')">查询</a-button>
                    <a-button style="margin-left: 20px;margin-top: 20px;" @click="clearL">重置</a-button>
                </div>
            </a-form>
            <div v-if="listData.length>0">
                <div class="box" v-for="(item,index) in listData">
                    <div class="t">
                        <a-row style="width: 100%;color:#000;" >
                            <a-col :span="20" style="display: flex;margin-top: 15px;">
                                <p style="margin-left: 40px;">{{item.fRoom}}</p>
                                <p style="margin-left: 45px;width: 150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">订单号：{{item.code}}</p>
                                <p style="margin-left: 40px;">{{item.time}}</p>
                                <p style="margin-left: 50px;margin-right: 40px;">{{item.sName}}</p>
                                <p style="margin-right: 40px;">采购人：{{item.pName}}</p>
                                <p v-if="item.rote" style="color:#02bb72;cursor:pointer;" @click="mYscore(index,item.cAnt)">{{item.cAnt}}<a-icon type="right" v-if="item.score"/></p>
                            </a-col>
                            <a-col :span="4" style="margin-top: 15px;display: flex;justify-content: space-between;">
                                <a-icon v-if="item.state == '已完成'" type="chrome" style="color:#02bb72;margin-left: 30px;font-size: 30px;margin-top: -7px;"/>
                                <p style="margin-right: 30px;text-align: right">{{item.state}}</p>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="c">
                        <div class="bgChange" v-for="(item2,index2) in item.list" style="width: 100%;border-top:1px solid transparent;">
                            <a-row style="width: 100%; display: flex; align-items: center;margin-top: 20px;">
                                <a-col :span="10">
                                    <div class="l">
                                        <img style="width: 90px;height: 90px;margin: 0 35px;" :src="item2.url" alt="">
                                        <p style="margin-bottom: 0;margin-right: 44px;max-width:180px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item2.name}}</p>
                                        <p style="margin-bottom: 0;"><span style="font-weight: bold;color:#000;">{{item2.unit}}</span>/斤</p>
                                    </div>
                                </a-col>
                                <a-col :span="14" style="text-align: right;" >
                                    <div class="r" style="margin: 10px 0;" v-for="item3 in item2.list">
                                        <div style="width: 100%;display: flex;align-items: center;justify-content: flex-end">
                                            <p style="margin-bottom: 0;margin-right: 50px;">{{item3.time}}</p>
                                            <p style="margin-bottom: 0;margin-right: 45px;">{{item3.unit}}</p>
                                            <p style="min-width:70px;margin-bottom: 0;margin-right: 45px;font-weight: bold;color:#000;">{{item3.moeny}}</p>
                                            <p style="margin-bottom: 0;margin-right: 40px; position: relative;">{{item3.state}}<span v-if="item3.isIcon" style="position: absolute;border:1px solid #d9d9d9;padding:0 2px">{{item3.Istate}}</span></p>
                                            <p style="margin-bottom: 0;margin-right: 30px;">批次号：{{item3.code}}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-row>
                            <div style="width: 100%;display: flex;justify-content:flex-end;margin-top: 10px;">
                                <p>总计：<span style="color:#ff6600;font-weight: bold;">{{item2.aNum}}</span></p>
                                <p style="margin-right: 30px;margin-left: 35px;">总价：<span style="color:#ff6600;font-weight: bold;">{{item2.aMy}}</span></p>
                            </div>
                            <span style="height: 1px;background: #d9d9d9; width: 95%;margin:0 auto;display: block;margin-bottom: 20px;"></span>
                        </div>
                    </div>
                    <div class="b" style="width: 100%;display: flex;flex-direction: column;">
                        <p style="text-align: right;margin-right: 30px;">共计：<span style="color:#ff6600;font-weight: bold;">￥{{item.My}}</span></p>
                    </div>
                </div>
                <div style="width: 100%;display: flex;justify-content: flex-end;">
                    <template>
                        <a-pagination simple :current="page.key" :total="page.total" @change="pageSizeChange"/>
                    </template>
                </div>
            </div>
            <div v-else style="height: 500px;display: flex;flex-direction: column;align-items: center;justify-content: center">
                <img style="width: 170px;height: 170px;" src="http://img5.imgtn.bdimg.com/it/u=2424630274,483969025&fm=26&gp=0.jpg" alt="">
                <p>暂无采购订单</p>
            </div>
        </div>
        <a-modal
                v-model="visible"
                :title="Title"
        >
            <div style="height: 150px; display: flex;align-items: center;justify-content: center;flex-direction: column;">
                <p v-html="refuse" style="margin-bottom: 0;text-align: center;"/>
                <a-rate :value="rateNum" allowHalf @change="rateC"/>
            </div>
            <template slot="footer">
                <a-button  @click="rate('NO')">取消</a-button>
                <a-button  type="primary" @click="rate('OK')">确认</a-button>
            </template>
        </a-modal>
        <a-modal
                width="730px"
                height="480px"
                v-model="vImg"
                :title="vTitle"
        >
            <div v-if="!sTate">
                <a-textarea placeholder="填写退货原因" v-model="rGoods" style="width: 620px;height: 150px;resize: none;margin-left: 30px;"/>
                <div style="display: flex;margin-top: 30px;" >
                    <div class="Logo" style="margin-left: 30px;">
                        <div style="width: 110px;height: 120px;border:1px solid #d9d9d9;">
                            <img src="" alt="">
                        </div>
                        <a-form-item>
                            <a-upload
                                    v-decorator="['upload2', {
                                rules: [
                                    { required: true, message: '请填上传图片'}
                                ],
                                valuePropName: 'fileList',
                                getValueFromEvent: normFile,
                            }]"
                                    class="mx_right"
                                    :showUploadList="false"
                                    :multiple="true"
                                    :headers="headers"
                                    @change="upImg2"
                                    name="logo"
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    list-type="picture"
                            >
                                <a-button>
                                    <a-icon type="upload" /> 上传图片
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </div>
                    <div class="Logo" style="margin-left: 30px;">
                        <div style="width: 110px;height: 120px;border:1px solid #d9d9d9;">
                            <img src="" alt="">
                        </div>
                        <a-form-item>
                            <a-upload
                                    v-decorator="['upload2', {
                                rules: [
                                    { required: true, message: '请填上传图片'}
                                ],
                                valuePropName: 'fileList',
                                getValueFromEvent: normFile,
                            }]"
                                    class="mx_right"
                                    :showUploadList="false"
                                    :multiple="true"
                                    :headers="headers"
                                    @change="upImg2"
                                    name="logo"
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    list-type="picture"
                            >
                                <a-button>
                                    <a-icon type="upload" /> 上传图片
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </div>
                </div>
            </div>
            <div v-else>
                <a-textarea placeholder="填写取消原因" v-model="cancel" style="width: 620px;height: 150px;resize: none;margin-left: 30px;"/>
            </div>
            <template slot="footer">
                <a-button  @click="iBack('NO')">取消</a-button>
                <a-button  type="primary" @click="iBack('OK')">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                rState:1,
                rstate:1,
                rSList:[],
                rList:[{
                    id:'',
                    title:'全部'
                },{
                    id:0,
                    title:'进行中'
                },{
                    id:1,
                    title:'已完成'
                },{
                    id:2,
                    title:'已取消'
                },{
                    id:3,
                    title:'已退货'
                }],
                form:this.$form.createForm(this),
                listData:[],
                //弹出框
                visible:false,
                Title:'供应商评分',
                refuse:'您对本次交易满意吗？',
                rateNum:4,
                //记录当前数据Index
                keyNum:0,
                //详情页展示
                dShow:false,
                //详情页数据
                dlList:[{
                    tit:'第一批',
                    state:'已验收',
                    time:'送达：07-05   上午',
                    txt:'配送中无法取消',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'申请退货',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始配送',
                        txt:['配送人：张三的猪肉','联系方式：15923652147'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'验收入库',
                        txt:['验收人：张主任'],
                        img:[]
                    }],
                },{
                    tit:'第二批',
                    state:'备货中',
                    time:'送达：07-05   上午',
                    txt:'',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'取消批次',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    }],
                },{
                    tit:'第三批',
                    state:'配送中',
                    time:'送达：07-05   上午',
                    txt:'',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'正在配送',
                        txt:['配送人：张三的猪肉','联系方式：15923652147'],
                        img:[]
                    }],
                },{
                    tit:'第三批',
                    state:'验收中',
                    time:'送达：07-05   上午',
                    txt:'验收中无法取消',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    }, {
                        time:'06-23    15:23',
                        icon:'',
                        state:'正在配送',
                        txt:['配送人：张三的猪肉','联系方式：15923652147'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'正在验收中',
                        txt:['验收人：张主任'],
                        img:[]
                    }],
                },{
                    tit:'第三批',
                    state:'已取消',
                    time:'送达：07-05   上午',
                    txt:'该批次取消成功',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'取消批次',
                        txt:['取消人：王阿航','取消原因：刮风放假了'],
                        img:[]
                    }],
                },{
                    tit:'第三批',
                    state:'已退货',
                    time:'送达：07-05   上午',
                    txt:'该批次取消成功',
                    unit:'300斤',
                    My:'￥200.00',
                    code:'批次号：5235644',
                    btn:'',
                    list:[{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始备货',
                        txt:['商家正在积极备货中...'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'开始配送',
                        txt:['配送人：张三的猪肉','联系方式：15923652147'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'验收入库',
                        txt:['验收人：张主任'],
                        img:[]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'申请退货',
                        txt:['申请人：张主任','退货原因：不想要了'],
                        img:[
                            'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3236563442,765701136&fm=26&gp=0.jpg',
                            'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3236563442,765701136&fm=26&gp=0.jpg'
                        ]
                    },{
                        time:'06-23    15:23',
                        icon:'',
                        state:'退货成功',
                        txt:['供应商已同意您的退货申请'],
                        img:[]
                    }],
                }],
                //请求弹窗
                vTitle:'',
                vImg:false,
                scssOK:false,
                //申请状态
                sTate:false,
                rangeConfig: {
                    rules: [{ type: 'array', required: true, message: '请选择起始日期' }],
                },
                headers: {
                    authorization: 'authorization-text',
                },//上传图片配置，
                rGoods:'',
                cancel:'',
                //搜索数据
                dataObj:{
                    fid:'',
                    code:'',
                    state:'',
                    sTime:'',
                    eTime:''
                },
                //分页
                page:{
                    total:51,
                    key:1
                },
                //临时数据存放
                tData:[]
            }
        },
        methods: {
            //日期改变
            rPickChange(e){
                if(e.length>0){
                    this.dataObj.sTime = moment(e[0]._d).format('x') / 1000;
                    this.dataObj.eTime = moment(e[1]._d).format('x') / 1000;
                }else{
                    this.dataObj.sTime = '';
                    this.dataObj.eTime = '';
                }
            },
            //单号改变
            inpChange(e){
                this.dataObj.code = e.target.value;
            },
            //获取食堂
            getFRoom(){
                let data ={
                    url:'api/common/dictionaries',
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        if(res.data.data.canteen.length>0){
                            this.rSList = res.data.data.canteen;
                            let obj = {
                                id:'',
                                title:'全部'
                            };
                            this.rSList.unshift(obj);
                            this.rState = this.rSList[0].title;
                        }else{
                            this.$message.warning('暂无食堂可供选择！');
                        }
                    }
                });
            },
            //按钮操作
            action(val){
                if(val == 1){
                    //显示食谱生成表单
                    this.initial = !this.initial
                    this.crtList = !this.initial
                    let dataList = [{
                        key:0,
                        index:1,
                        img:'http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg',
                        name:{
                            name : '小龙虾',
                            state: true
                        },
                        unit:'斤',
                        num:300,
                        time:['1566184899000','1566184899000'],
                        userNum:[100,200],
                    }, {
                        key:1,
                        index:2,
                        img:'http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg',
                        name:{
                            name : '小龙虾',
                            state: true
                        },
                        unit:'斤',
                        num:311,
                        time:['1566184899000','1566184899000'],
                        userNum:[111,200],
                    }];
                    dataList.forEach((e,i)=>{
                        for(let item in e.time){
                            e.time[item] = moment(e.time[item]*1);
                        }
                    });
                    this.dataSource = dataList;
                    return
                }
                if(val == 2){
                    let key = this.dataSource.length,
                        index = this.dataSource.length + 1;
                    let obj = {
                        key:key,
                        index:index,
                        img:'http://pic.rmb.bdstatic.com/fcd9555bd33f379035bcc05e71be30d2.jpeg',
                        name:{
                            name : '',
                            state: false
                        },
                        unit:'斤',
                        num:0,
                        time:[0],
                        userNum:[0],
                    }
                    this.dataSource.push(obj);
                    return;
                }
                if(val == 3){
                    //清空食谱表单
                    this.dataSource = [];
                    this.allWeek = [];
                    this.$message.success('清空列表成功！');
                    this.$message.warning('当前列表无数据！');
                    return
                }
                if(val == 4){
                    //草稿
                    this.$message.success('保存草稿成功！');
                    return
                }
                if(val == 5){
                    //提交表单
                    this.dataSource.forEach((e,i) =>{
                        if(e.name.name == ''){
                            this.$message.warning(`请输入序号`+ e.index +`菜品名称！`);
                            this.dataOK = false;
                        }else{
                            this.dataOK = true;
                        }
                        e.time.forEach((e1,i1)=>{
                            if(e1 == 0 || e1.length==0){
                                console.log(e1);
                                this.$message.warning(`请选择序号`+ e.index +`使用时间！`);
                                this.dataOK = false;
                            }else{
                                this.dataOK = true;
                            }
                        });
                        e.userNum.forEach((e2,i2)=>{
                            console.log(e2);
                            if(e2 == 0 || e2.length==0){
                                this.$message.warning(`请填写序号`+ e.index +`使用数量！`);
                                this.dataOK = false;
                            }else{
                                this.dataOK = true;
                            }
                        });
                    });
                    //判断是否能提交
                    if(this.dataOK){
                        this.$message.success('提交申请成功！');
                        this.initial = !this.initial
                        this.isOK = !this.isOK
                    }
                }
            },
            //搜索状态选择
            plChange(e){
                this.rState = e;
                this.dataObj.fid = this.rSList[e-1].id;
            },
            plChange2(e){
                this.rstate = e;
                this.dataObj.state = this.rList[e-1].id;
            },
            //清空搜索状态
            clearL(){
                this.rState = '全部';
                this.rstate = '全部',
                    this.form.resetFields();
            },
            //打分
            mYscore(val,val2){
               if(val2.slice(0,1) == '去'){
                   this.visible = !this.visible
                   this.keyNum = val
               }else{
                   return;
               }

            },
            rateC(e){
                this.rateNum = e;
            },
            //关闭弹窗
            rate(val){
                let that = this;
                this.visible = !this.visible;
                if(val == 'OK'){
                    this.listData.forEach((e,i) =>{
                        if(i == that.keyNum){
                            e.cAnt = '已评' + that.rateNum + '分';
                            e.score = false;
                        }
                    })
                    this.$message.success('评分成功');
                }
            },
            //提交骚操作
            upData(val){
                if(val == '申请退货'){
                    this.vTitle = '申请退货'
                    this.sTate = false;
                    this.vImg = !this.vImg;
                    return;
                }
                if(val == '取消批次'){
                    this.vTitle = '取消批次'
                    this.sTate = true;
                    this.vImg = !this.vImg;
                    return;
                }
            },
            normFile  (e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            },
            upImg2(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            //提交框隐藏
            iBack(val){
                this.vImg = !this.vImg;
                if(!this.sTate){
                    if(val == 'OK'){
                        this.scssOK = !this.scssOK;
                    }
                }else{
                    if(val == 'OK'){
                        this.$message.success('取消批次成功');
                    }
                }
            },
            //返回详情
            backD(){
                this.scssOK = !this.scssOK;
            },
            //搜索
            getPlist(){
                this.getListData();
            },
            //获取列表数据
            getListData(){
                let data ={
                    url:'api/school/order?canteen_id=' + this.dataObj.fid + '&order_no=' + this.dataObj.code + '&order_state=' + this.dataObj.state + '&start_time=' + this.dataObj.sTime + '&end_time=' + this.dataObj.eTime,
                    method:'get',
                    data:{}
                };
                this.tData = [];
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        res.data.data.forEach((e,i)=>{
                            let obj = {
                                fRoom:e.canteen_title,
                                code:e.order_no,
                                time:e.order_created_at_str,
                                sName:e.supplier_title,
                                pName:e.username,
                                rote:false,
                                cAnt:'去评分',
                                score:true,
                                state:e.order_state_str,
                                list:[],
                                My:e.order_price
                            };
                            e.material.forEach((e2,i2)=>{
                                let obj2 = {
                                    url:e2.material_single_src,
                                    name:e2.material_title + '    ' + e2.supplier_cargo_title,
                                    unit:e2.unit_price,
                                    list:[],
                                    aNum:e2.material_total_num,
                                    aMy:e2.material_total_price
                                };
                                obj.list.push(obj2);
                                e2.batches.forEach((e3,i3)=>{
                                   let obj3 = {
                                       time:e3.batch_time_day +'    '+ e3.cycle_str,
                                       unit:e3.num,
                                       moeny:e3.batch_total_price,
                                       state:e3.order_state_str,
                                       isIcon:false,
                                       Istate:'',
                                       code:e3.batch_num
                                   };
                                   obj2.list.push(obj3);
                                });
                            });
                            this.tData.push(obj);
                        });
                        this.page.total = this.tData.length;
                        this.listData = this.tData.slice((this.page.key - 1) * 10,10 * this.page.key + 1);
                    }else{
                        this.$message.warning('暂无食堂可供选择！');
                    }
                });
            },
            //分页处理
            pageSizeChange(e){
               this.page.key = e;
               this.listData = this.tData.slice((this.page.key - 1) * 10,10 * this.page.key + 1);
            }
        },
        created(){
            this.getFRoom();
            this.getListData();
        }
    };
</script>
<style scoped>
    #mx_order .b{
        display: flex;
    }
    #mx_order .tabBox{
        margin-top: 20px;
        display: flex;
    }
    #mx_order .tabBox p{
        margin-top: 5px;
        margin-bottom: 0;
    }
    #mx_order .box{
        display: flex;
        flex-direction: column;
        border:1px solid #d9d9d9;
        border-radius:5px;
        box-shadow: 0 0 10px #d9d9d9;
        margin-bottom: 20px;
    }
    #mx_order .box .t{
        display: flex;
    }
    #mx_order .box .c .l{
        display: flex;
        align-items: center;
    }
    #mx_order .box .c .r{
        display: flex;
        align-items: center;
    }
    #mx_order .bgChange:hover{
        background: #f4f4f4;
        cursor:pointer;
    }
    #mx_order .back{
        display: flex;
        cursor: pointer;
        width: 100px;
    }
    #mx_order .orderT{
        background: #f4f4f4;
        border-radius: 5px 5px 0 0;
        box-shadow: 0 0 5px #d9d9d9;
    }
    #mx_order .list{
        margin-top: 40px;
        box-shadow: 0 0 5px #d9d9d9;
    }
</style>