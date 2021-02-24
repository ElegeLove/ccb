<template>
    <div id="mx_uMessage">
        <a-skeleton :loading="loading" active :paragraph="{rows: 20}">
            <a-tabs :activeKey="actKey" @change="changeKey">
                <a-tab-pane tab="供应商" key="1">
                    <div class="listBox" v-show="listShow">
                        <div class="itCode">
                            <h3>供应商邀请码：</h3>
                            <h3 id="msg">{{itCode}}</h3>
                            <p class="btn" data-clipboard-target="#msg" @click = "copy">（点击复制）</p>
                        </div>
                        <ul class="sperList">
                            <a-col v-if="sperList.length <= 0">没有供应商</a-col>
                            <a-col v-else :span="12" v-for="(item,index) in sperList" >
                                <li @click="goNew(index,item.id)">
                                    <div class="sTop">
                                        <div class="logo">
                                            <img v-if="item.logo !=''" :src="item.logo" alt="">
                                            <img v-else src="@/assets/login/logo.png" alt="">
                                        </div>
                                        <div class="txt">
                                            <div class="name">
                                                <h3>{{item.name}}</h3>
                                                <img :src="item.icon" alt="">
                                            </div>
                                            <p>联系电话：{{item.tel}}</p>
                                            <p>法人：{{item.lperson}}</p>
                                        </div>
                                        <div class="dlt">
                                            <a-icon @click.stop.prevent="showModal(item.id,index)" type="delete" style="color:#999;font-size: 25px;cursor: pointer;position:absolute;right: 25px;top: 10px;"/>
                                            <a-modal
                                                    title="删除确认"
                                                    v-model="visible"
                                                    @ok="handleOk"
                                                    style="top: 30%;"
                                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                                            >
                                                <p>删除后将终止与该供应商合作，已下单商品不受影响，请谨慎操作 ！</p>
                                            </a-modal>
                                        </div>
                                    </div>
                                    <div class="sBtn">
                                        <p class="ads">详细地址：{{item.ads}}</p>
                                        <div class="rate">
                                            <p class="rate">评分：</p>
                                            <a-rate :defaultValue="item.rate"  disabled  allowHalf/>
                                        </div>
                                        <div class="state" v-show="!item.eTime">
                                            <p class="state">当前状态：</p>
                                            <a-switch checkedChildren="启用" unCheckedChildren="停用" :checked="item.state" @change="sChange(item,item.id)" @click.stop.native/>
                                        </div>
                                        <div class="timeEnd" v-show="item.eTime">
                                            <p class="state">当前状态：合作已到期</p>
                                            <p class="col" @click.stop.prevent="showModal2(item.id,index)">点击重设合作时间</p>
                                            <a-modal
                                                    title="合作期限"
                                                    v-model="visible2"
                                                    @ok="handleOk2"
                                                    style="top: 30%;"
                                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                                            >
                                                <div class="dateBox" style="display: flex;align-items: center;margin-left: 90px;padding: 50px 0;">
                                                    <p style="margin: 0;">合作截止时间：</p>
                                                    <a-date-picker @change="onChange"  :showToday="false"/>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </li>
                            </a-col>
                        </ul>
                    </div>
                    <div class="dtlBox" v-show="!listShow">
                        <div class="back" @click="back('one')">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p>食堂详情</p>
                        </div>
                        <div class="uDetails" v-for="item in udList">
                            <div class="udTop">
                                <div class="l">
                                    <div class="name">
                                        <p>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：{{item.pos}}</p>
                                        <div class="sName">
                                            （  <img style="width: 15px;height: 15px;" :src="item.logo" alt=""> {{item.txt}}）
                                        </div>
                                    </div>
                                    <p>经营类目：{{item.caty}}</p>
                                    <p>联系电话：{{item.tel}}</p>
                                    <p>详细地址：{{item.ads}}</p>
                                    <p>配送方式：{{item.dgMode}}</p>
                                    <p>结算周期：{{item.stCycle}}</p>
                                    <p>统一社会信用代码：{{item.syCode}}</p>
                                    <p>合作截止：{{item.endTime}}<span @click="setTime" style="margin-left: 15px;color: #02bb72;cursor: pointer">点击修改</span></p>
                                </div>
                                <div class="r">
                                    <p>LOGO</p>
                                    <img :src="item.mLogo" alt="">
                                    <a-rate :value="item.rate"  disabled  style="margin-left: -13px;"/>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人：{{item.lPerson}}</p>
                                    <p>联系电话：{{item.lTel}}</p>
                                    <p>身份证号码：{{item.idCode}}</p>
                                </div>
                                <div class="r">
                                    <p>身份证正反面图片</p>
                                    <div class="imgBox" style="display: flex;">
                                        <div>
                                            <img v-if="item.idImgP" :src="item.idImgP" alt="">
                                            <img v-if="!item.idImgP" src="../../assets/login/logo.png" alt="">
                                        </div>
                                        <div>
                                            <img v-if="item.idImgN" :src="item.idImgN" alt="">
                                            <img v-if="!item.idImgN" src="../../assets/login/logo.png" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>营业执照</p>
                                    <p>注册号：{{item.rgtCode}}</p>
                                    <p>发证机关：{{item.office}}</p>
                                    <p>成立日期：{{item.sTime}}</p>
                                </div>
                                <div class="r">
                                    <p>营业执照图片</p>
                                    <img v-if="item.lesUrl" :src="item.lesUrl" alt="">
                                    <img v-if="!item.lesUrl" src="../../assets/login/logo.png" alt="">
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>食品流通许可证</p>
                                    <p>许可证号：{{item.permitCode}}</p>
                                    <p>发证机关：{{item.office2}}</p>
                                    <p>许可范围：{{item.Range}}</p>
                                    <p>有效期限：{{item.vTime}}</p>
                                </div>
                                <div class="r">
                                    <p>食品流通许可证图片</p>
                                    <img v-if="item.permitUrl" :src="item.permitUrl" alt="">
                                    <img v-if="!item.permitUrl" src="../../assets/login/logo.png" alt="">
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>收款银行卡号：{{item.bkCode}}</p>
                                    <p>开户名：{{item.bkName}}</p>
                                    <p>开户行：{{item.bank}}</p>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>审核状态：{{item.state}}</p>
                                    <p>审核人：{{item.rwName}}</p>
                                    <p>审核时间：{{item.rwTime}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane tab="申请列表" key="2" >
                    <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="pagination" v-show="apShow" @change="handleTableChange">
                        <img v-if="record.logo != ''"  style="width:100px;heigth:100px" slot="pic" slot-scope="text, record" :src=record.logo />
                        <img v-else slot="pic" style="width:100px;heigth:100px" slot-scope="text, record" src="../../assets/login/logo.png" alt="">
                        <div slot="logo" slot-scope="text, record" style="display: flex;justify-content: center;align-items: center">
                            <p>{{record.name[0]}}</p>
                            <img v-show="record.name[1] != ''" :src=record.name[1] alt="" style="width: 15px;height: 15px;margin-bottom: 15px;margin-left: 10px;">
                        </div>
                        <div slot="state" slot-scope="text, record">
                            <p  style="margin: 0; color:#ff6600;" v-show="record.state == '待审核'">{{record.state}}</p>
                            <p style="margin: 0;" v-show="record.state != '待审核'">{{record.state}}</p>
                        </div>

                        <template slot="btn" slot-scope="text, record, index">
                            <div class="editable-row-operations">
                                <div style="display: flex;justify-content: center;" v-show="record.state == '待审核'">
                                    <a class="mx_updata mx_color" @click="state('OK',record.id)">去处理</a>
                                </div>
                                <div style="display: flex;justify-content: center" v-show="record.state != '待审核'">
                                    <a class="mx_updata mx_color" @click="state('NO',record.id)">查看</a>
                                </div>
                            </div>
                        </template>

                    </a-table>
                    <div class="dtlBox" v-show="!apShow">
                        <div class="back" @click="back('two')">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p>查看详情</p>
                        </div>
                        <div class="uDetails" v-for="item in udList">
                            <div class="udTop">
                                <div class="l">
                                    <div class="name">
                                        <p>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：{{item.pos}}</p>
                                        <div class="sName">
                                            （  <img style="width: 15px;height: 15px;" :src="item.logo" alt=""> {{item.txt}}）
                                        </div>
                                    </div>
                                    <p>经营类目：{{item.caty}}</p>
                                    <p>联系电话：{{item.tel}}</p>
                                    <p>详细地址：{{item.ads}}</p>
                                    <p>配送方式：{{item.dgMode}}</p>
                                    <p>结算周期：{{item.stCycle}}</p>
                                    <p>统一社会信用代码：{{item.syCode}}</p>
                                </div>
                                <div class="r">
                                    <p>LOGO</p>
                                    <img :src="item.mLogo" alt="">
                                    <a-rate :value="item.rate"  disabled  style="margin-left: -13px;"/>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人：{{item.lPerson}}</p>
                                    <p>联系电话：{{item.lTel}}</p>
                                    <p>身份证号码：{{item.idCode}}</p>
                                </div>
                                <div class="r">
                                    <p>身份证正反面图片</p>
                                    <div class="imgBox" style="display: flex;">
                                        <div>
                                            <img v-if="item.idImgP" :src="item.idImgP" alt="">
                                            <img v-if="!item.idImgP" src="../../assets/login/logo.png" alt="">
                                        </div>
                                        <div>
                                            <img v-if="item.idImgN" :src="item.idImgN" alt="">
                                            <img v-if="!item.idImgN" src="../../assets/login/logo.png" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>营业执照</p>
                                    <p>注册号：{{item.rgtCode}}</p>
                                    <p>发证机关：{{item.office}}</p>
                                    <p>成立日期：{{item.sTime}}</p>
                                </div>
                                <div class="r">
                                    <p>营业执照图片</p>
                                    <img v-if="item.lesUrl" :src="item.lesUrl" alt="">
                                    <img v-if="!item.lesUrl" src="../../assets/login/logo.png" alt="">
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>食品流通许可证</p>
                                    <p>许可证号：{{item.permitCode}}</p>
                                    <p>发证机关：{{item.office2}}</p>
                                    <p>许可范围：{{item.Range}}</p>
                                    <p>有效期限：{{item.vTime}}</p>
                                </div>
                                <div class="r">
                                    <p>食品流通许可证图片</p>
                                    <img v-if="item.permitUrl" :src="item.permitUrl" alt="">
                                    <img v-if="!item.permitUrl" src="../../assets/login/logo.png" alt="">
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>收款银行卡号：{{item.bkCode}}</p>
                                    <p>开户名：{{item.bkName}}</p>
                                    <p>开户行：{{item.bank}}</p>
                                </div>
                            </div>
                            <div class="cont">
                                <div class="l">
                                    <p>审核状态：{{item.state}}</p>
                                    <p>审核人：{{item.rwName}}</p>
                                    <p>审核时间：{{item.rwTime}}</p>
                                </div>
                            </div>
                            <div class="bBtn" v-show="bBtnShow">
                                <a-button type="primary" icon="check" class="ok" @click="agrre('OK','supplier.update')">同意</a-button>
                                <a-button type="primary" icon="close" class="no" @click="agrre('NO','supplier.refuse')">拒绝</a-button>
                            </div>
                            <a-modal
                                    :title="v4Data.mTitle"
                                    v-model="v4Data.visible"
                                    @ok="handleOk4"
                                    style="top: 30%;"
                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                            >
                                <div v-show="v4Data.dShow" class="dateBox" style="display: flex;align-items: center;margin-left: 90px;padding: 50px 0;flex-wrap: wrap;">
                                    <p style="margin: 0;">合作截止时间：</p>
                                    <a-date-picker @change="onChange" :showToday="false"/>
                                    <p style="color: red;width: 300px;margin-top: 10px;" v-show="isTs">请选择合作时间</p>
                                </div>

                                <div v-show="!v4Data.dShow" class="dateBox" style="display: flex;align-items: center;">
                                    <a-textarea placeholder="填写拒绝理由" v-model="v4Data.refuse" style="height: 150px;resize: none;"/>
                                </div>
                            </a-modal>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>

<script>
    import Clipboard  from 'clipboard';
    import globalApi from '../../globalApi/globalApi';
    import axios from 'axios';
    import qs from 'qs';
    import moment from 'moment';
    export default {
        data() {
            return{
                isTs:false,
                actKey:'1',
                loading:true,
                itCode:'NK4526',
                sperList:[],
                visible:false,
                visible2:false,
                dTchange:false,
                time:{},
                listShow:true,//状态一 供应商详情
                apShow:true,//状态二 供应商详情
                bBtnShow:true,//详情页底部按钮显示
                udList:[{
                    pos:'张三的猪肉',
                    logo:'',
                    txt:'扶贫供应商',
                    caty:'扶贫供应商',
                    tel:'15623589647',
                    ads:'重庆市天安门广场3号29-8',
                    dgMode:'自配',
                    stCycle:'月结',
                    syCode:'563165416164656',
                    endTime:'2019-07-01',
                    mLogo:'',
                    rate:3,
                    lPerson:'王阿航',
                    lTel:'15623589647',
                    idCode:'5063545465464654',
                    idImgP:'',
                    idImgN:'',
                    rgtCode:'65464644644',
                    office:'重庆市江北区',
                    sTime:'2018-06-23',
                    lesUrl:'',
                    permitCode:'65464644644',
                    office2:'重庆市江北区',
                    Range:'重庆市江北区',
                    vTime:'2019-06-23  至  2020-06-23',
                    permitUrl:'',
                    bkCode:'5236968533254',
                    bkName:'张三的猪肉',
                    bank:'江北建设银行',
                    state:'通过',
                    rwName:'王阿航',
                    rwTime:'2019-07-21'
                }],
                //表格数据
                columns: [{
                    title: 'LOGO',
                    align:'center',
                    dataIndex: 'logo',
                    width:120,
                    scopedSlots: {customRender: 'pic'},
                }, {
                    title: '名称',
                    align:'center',
                    dataIndex: 'name',
                    scopedSlots: {customRender: 'logo'},
                }, {
                    title: '联系电话',
                    align:'center',
                    dataIndex: 'tel',
                },{
                    title: '法人代表',
                    align:'center',
                    dataIndex: 'lpName',
                },{
                    title: '申请时间',
                    align:'center',
                    dataIndex: 'sTime',
                },{
                    title: '审核状态',
                    align:'center',
                    dataIndex: 'state',
                    scopedSlots: { customRender: "state" }
                },{
                    title: '操作按钮',
                    align:'center',
                    dataIndex: 'btn',
                    scopedSlots: { customRender: "btn" }
                }, ],
                dataSource: [],
                //分页配置
                pagination: {
                    pageSize: 15, // 默认每页显示数量
                    current: 1, //显示当前页数
                    total:30,
                    showSizeChanger: false, // 显示可改变每页数量
                    showQuickJumper: true, //显示跳转到输入的那一页
                    pageSizeOptions: ["10", "20"], // 指定每页可以显示多少条
                     // 改变每页数量时更新显示
                    showTotal: total =>
                        `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                            total / this.pagination.pageSize
                        )} 页` // 显示总数
                },
                count: 2,
                downSelect: {},
                v4Data:{
                    mTitle:'合作期限',
                    visible:false,
                    dShow:true,
                    refuse:''
                },
                //供应商ID&&供应商index
                bID:'',
                bIndex:'',
                //上传状态
                upState:''
            }
        },
        methods:{
            copy() {
                let clipboard = new Clipboard('.btn')
                clipboard.on('success',e =>{
                    this.$message.success('复制成功');
                    clipboard.destroy()
                })
                clipboard.on('error',e =>{
                    this.$message.success('复制失败');
                    clipboard.destroy()
                })
            },
            sChange(val,id){
                this.bID = id
                let that = this;
                let data = {
                    scene:'supplier.abled',
                };
                axios({
                    method: "put",
                    url: globalApi.BASE_URL + 'api/school/supplier/' + that.bID,
                    data: qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        val.state = !val.state;
                        console.log(this.sperList);
                        if(val.state){
                            this.$message.success('启用成功');
                        }else{
                            this.$message.success('停用成功');
                        }
                    };
                }).catch(function (err) {

                });

            },
            handleOk(){
                let that = this;
                axios({
                    method: "delete",
                    url: globalApi.BASE_URL + 'api/school/supplier/' + this.bID,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    debugger
                    if(res.data.code == 0){
                        that.$message.success(`删除成功`);
                        that.sperList.splice(that.bIndex,1);
                    };
                }).catch(function (err) {

                });
                this.visible = false
            },
            showModal(val,i){
                this.bID = val;
                this.bIndex = i;
                this.visible = true
            },
            handleOk2(){
                let x = this.getTime(this.time),//转换后的时间
                    that = this;
                let data = {
                    scene:'supplier.update',
                    expire_date:x,
                };
                axios({
                    method: "put",
                    url: globalApi.BASE_URL + 'api/school/supplier/' + that.bID,
                    data: qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        this.sperList[this.bIndex].eTime = false;
                        if(this.dTchange){
                            this.udList[0].endTime = x;
                        }
                        that.$message.success(`设置时间成功`);
                    };
                }).catch(function (err) {

                });


                this.visible2 = false
            },
            showModal2(val,i){
                this.bID = val;
                this.bIndex = i;
                this.visible2 = true
            },
            onChange(e){
                if(e != null){
                    this.time = e._d;
                    this.isTs = false;
                }else{
                    this.time = {};
                    this.isTs = true;
                }
            },
            goNew(i,id){
                this.loading = true;
                this.listShow = !this.listShow
                this.bID = id;
                this.bIndex = i;
                this.dTchange = true;
                this.getDel();
            },
            back(val){
                if(val == 'one'){
                    this.listShow = !this.listShow
                }else{
                    this.apShow = !this.apShow;
                    this.getList();
                }

            },
            getTime(date){
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                var minute = date.getMinutes();
                minute = minute < 10 ? ('0' + minute) : minute;
                return y + '-' + m + '-' + d;
            },
            setTime(){
                this.visible2 = true
            },
            state(val,val2){
                this.bID = val2;
                this.loading = true;
                this.getAyData(val2);
                if(val == 'OK'){
                    this.apShow = !this.apShow
                    this.bBtnShow = true;
                };
                if(val == 'NO'){
                    this.apShow = !this.apShow
                    this.bBtnShow = false;
                };
            },
            agrre(val,val2){
                this.upState = val2;
                if(val == 'OK'){
                    this.v4Data.visible = true;
                    this.v4Data.dShow = true;
                };
                if(val == 'NO'){
                    this.v4Data.visible = true;
                    this.v4Data.dShow = false;
                    this.v4Data.mTitle = '拒绝原因'
                };
            },
            handleOk4(){
                //同意设置期限
                if(this.v4Data.dShow){
                    if( JSON.stringify(this.time)=='{}'){
                        this.isTs = true;
                    }else{
                        let x = this.getTime(this.time)//转换后的时间
                        this.acTion(this.upState,this.bID,x);
                        this.v4Data.visible = false;
                    }
                }else{
                //拒绝填写理由
                    this.acTion(this.upState,this.bID,this.v4Data.refuse);
                    this.v4Data.visible = false;
                }
            },
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
                this.getList();
            },
            //获取首页数据
            getData(){
                let data = {
                    url:'api/school/supplier',
                    method:'get',
                    data:{}
                };
                this.sperList = [];
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        res.data.data.forEach((e,i)=>{
                            let x ,y;
                            if(e.state == 1){
                                x = true;
                            }else{
                                x = false;
                            }
                            if(e.expire_status == 1){
                                y = false;
                            }else{
                                y = true;
                            }
                            let obj = {
                                id:e.id,
                                logo:e.logo_src,
                                name:e.title,
                                icon:e.special_mark_src,
                                tel:e.phone,
                                lperson:e.legal_title,
                                ads:e.loc_detail,
                                rate:e.score_num,
                                state:x,
                                eTime:y
                            }
                            this.sperList.push(obj);
                        });
                        this.loading = false;
                    }
                })
            },
            //获取供应商详情
            getDel(){
                let that = this;
                axios({
                    method: "get",
                    url: globalApi.BASE_URL + 'api/school/supplier/' + that.bID,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    this.udList[0].pos = res.data.data.title;
                    this.udList[0].caty = res.data.data.busin_category_str;
                    this.udList[0].txt = res.data.data.special_mark_str;
                    this.udList[0].logo = res.data.data.special_mark_src;
                    this.udList[0].tel = res.data.data.phone;
                    this.udList[0].ads = res.data.data.loc_detail;
                    this.udList[0].dgMode = res.data.data.out_type_str;
                    this.udList[0].stCycle = res.data.data.pay_cycle_str;
                    this.udList[0].syCode = res.data.data.credit_code;
                    this.udList[0].endTime = res.data.data.expire_date_str;
                    this.udList[0].mLogo = res.data.data.logo_src;
                    this.udList[0].rate = res.data.data.scoring;
                    this.udList[0].lPerson = res.data.data.legal_title;
                    this.udList[0].lTel = res.data.data.legal_phone;
                    this.udList[0].idCode = res.data.data.legal_card_id;
                    if(res.data.data.card_just_src != ''){
                        this.udList[0].idImgP = res.data.data.card_just_src;
                    }else{
                        this.udList[0].idImgP = false;
                    }
                    if(res.data.data.card_back_src != ''){
                        this.udList[0].idImgN = res.data.data.card_back_src;
                    }else{
                        this.udList[0].idImgN = false;
                    }
                    if(res.data.data.cert != null){
                        this.udList[0].rgtCode = res.data.data.cert.license_no;
                        this.udList[0].office = res.data.data.cert.authority;
                        this.udList[0].sTime = res.data.data.cert.issuance_str;
                        if(res.data.data.cert.enclosure_src != ''){
                            this.udList[0].lesUrl = res.data.data.cert.enclosure_src;
                        }else{
                            this.udList[0].lesUrl = false;
                        }
                    }

                    if(res.data.data.food_license != null){
                        this.udList[0].permitCode = res.data.data.food_license.license_no;
                        this.udList[0].office2 = res.data.data.food_license.authority;
                        this.udList[0].Range = res.data.data.food_license.business;
                        if(res.data.data.food_license.enclosure_src != ''){
                            this.udList[0].permitUrl = res.data.data.food_license.enclosure_src;
                        }else{
                            this.udList[0].permitUrl = false;
                        }
                        this.udList[0].vTime = res.data.data.food_license.issuance_str + '至' + res.data.data.food_license.term_str;
                    }
                    if(res.data.data.bonk != null){
                        this.udList[0].bkCode = res.data.data.bonk.bonk_num;
                        this.udList[0].bkName = res.data.data.bonk.account_open;
                        this.udList[0].bank = res.data.data.bonk.bonk_account;
                    }
                    if(res.data.data.auth_info != null){
                        this.udList[0].state = res.data.data.auth_info.status_str;
                        this.udList[0].rwName = res.data.data.auth_info.auth_realname;
                        this.udList[0].rwTime = res.data.data.auth_info.auth_time_str;
                    }
                    this.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            },
            //获取列表
            getList(){
                axios({
                    method: "get",
                    url: globalApi.BASE_URL + 'api/school/examine/supplier/?page=' + this.pagination.current,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    this.dataSource = [];
                    this.pagination.total = res.data.data.total;
                    res.data.data.data.forEach((e,i)=>{
                        let x = '';
                        if(e.status == 0){
                            x = '待审核'
                        }else if(e.status == 1){
                            x = '通过'
                        }else{
                            x = '拒绝'
                        }

                        let obj = {
                            key:i+1,
                            logo:e.logo_src,
                            name:[e.title,e.special_mark_src] ,
                            tel:e.phone,
                            lpName:e.legal_title,
                            sTime:e.apply_time_str,
                            state:x,
                            btn:'123',
                            id:e.id
                        }
                        this.dataSource.push(obj)
                    })
                    this.loading = false;
//                    this.dataSource
                }).catch(function (err) {

                });
            },
            //tabs改变
            changeKey(e){
                this.actKey = e;
                this.loading = true;
                if(e == 2){
                    this.getList();
                }else{
                    setTimeout(()=>{
                        this.loading = false;
                        this.getData();
                    },300);

                }
            },
            //获取申请详情
            getAyData(x){
                axios({
                    method: "get",
                    url: globalApi.BASE_URL + 'api/school/examine/supplier/' + x,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        this.udList[0].pos = res.data.data.title;
                        this.udList[0].caty = res.data.data.busin_category_str;
                        this.udList[0].txt = res.data.data.special_mark_str;
                        this.udList[0].logo = res.data.data.special_mark_src;
                        this.udList[0].tel = res.data.data.phone;
                        this.udList[0].ads = res.data.data.loc_detail;
                        this.udList[0].dgMode = res.data.data.out_type_str;
                        this.udList[0].stCycle = res.data.data.pay_cycle_str;
                        this.udList[0].syCode = res.data.data.credit_code;
                        this.udList[0].endTime = res.data.data.expire_date_str;
                        this.udList[0].mLogo = res.data.data.logo_src;
                        this.udList[0].rate = res.data.data.scoring;
                        this.udList[0].lPerson = res.data.data.legal_title;
                        this.udList[0].lTel = res.data.data.legal_phone;
                        this.udList[0].idCode = res.data.data.legal_card_id;
                        this.udList[0].idImgP = res.data.data.card_just_src;
                        this.udList[0].idImgN = res.data.data.card_back_src;

                        if(res.data.data.cert != null){
                            this.udList[0].rgtCode = res.data.data.cert.license_no;
                            this.udList[0].office = res.data.data.cert.authority;
                            this.udList[0].sTime = res.data.data.cert.issuance_str;
                            this.udList[0].lesUrl = res.data.data.cert.enclosure_src;
                        }

                        if(res.data.data.food_license != null){
                            this.udList[0].permitCode = res.data.data.food_license.license_no;
                            this.udList[0].office2 = res.data.data.food_license.authority;
                            this.udList[0].Range = res.data.data.food_license.business;
                            this.udList[0].permitUrl = res.data.data.food_license.enclosure_src;
                            this.udList[0].vTime = res.data.data.food_license.issuance_str + '至' + res.data.data.food_license.term_str;
                        }
                        if(res.data.data.bonk != null){
                            this.udList[0].bkCode = res.data.data.bonk.bonk_num;
                            this.udList[0].bkName = res.data.data.bonk.account_open;
                            this.udList[0].bank = res.data.data.bonk.bonk_account;
                        }

                        if(res.data.data.auth_info != null){
                            this.udList[0].state = res.data.data.auth_info.status_str;
                            this.udList[0].rwName = res.data.data.auth_info.auth_realname;
                            this.udList[0].rwTime = res.data.data.auth_info.auth_time_str;
                        }
                        this.loading = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            },
            //同意&&拒绝
            acTion(state,id,val){
                if(state == 'supplier.update'){
                    let data = {
                        scene:state,
                        expire_date: val
                    }
                    this.putData(data,id,state);
                }else{
                //拒绝
                    let data = {
                        scene:state,
                        fail_reason: val
                    }
                    this.putData(data,id,state);
                }
            },
            putData(data,id,state){
                axios({
                    method: "put",
                    url: globalApi.BASE_URL + 'api/school/examine/supplier/' + id,
                    data: qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        if(state == 'supplier.update'){
                            this.$message.success(`设置时间成功`);
                        }else{
                            this.$message.success(`拒绝申请成功`);
                        }
                        this.apShow = !this.apShow;
                        this.getList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    console.log(res);
                }).catch(function (err) {

                });
            }
        },
        created(){
            this.itCode = localStorage.getItem('sKey');
            this.getData()
        }
    }
</script>
<style scoped>
    #mx_uMessage .itCode{
        display: flex;
        align-items: center;
    }
    #mx_uMessage .itCode p,.itCode h3{
        margin: 0;
    }
    #mx_uMessage .itCode .btn{
        color:#02bb72;
    }
    #mx_uMessage .itCode .btn:hover{
        cursor: pointer;
    }
    #mx_uMessage .sperList{
        margin: 50px auto 0;
        display: flex;
        flex-wrap: wrap;
        max-width:1200px;
    }
    #mx_uMessage .sperList li{
        display: flex;
        flex-wrap: wrap;
        margin:20px auto;
        width: 460px;
        height: 275px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        box-shadow:0 0 10px #ccc;
        list-style: none;
    }
    #mx_uMessage .sperList li .sTop{
        margin-top: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    #mx_uMessage .sperList li .sTop .logo{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 106px;
        height: 106px;
        border:1px dashed #999;
        border-radius: 10px;
        padding: 0;
        margin-left: 50px;
    }
    #mx_uMessage .sperList li .sTop .logo img{
        width: 90%;
        height: 90%;
        margin: 0;
    }
    #mx_uMessage .sperList li .dlt{
        position: relative;
        height: 100%;
        width: 100px;
    }
    #mx_uMessage .sperList li .sBtn{
        margin-left: 50px;
        padding-bottom: 20px;
    }
    #mx_uMessage .sperList li .rate,#mx_uMessage .sperList li .state,#mx_uMessage .sperList li .timeEnd{
        display: flex;
        align-items: baseline;
        margin-bottom: 20px;
    }
    #mx_uMessage .sperList li .timeEnd .col{
        margin-left: 15px;
        color:#02bb72;
        cursor: pointer;
    }
    #mx_uMessage .sperList li .state{
        margin: 0;
    }
    #mx_uMessage .sperList li .ads{
        margin-bottom: 20px;
    }
    #mx_uMessage .sperList li .rate p{
        margin: 0;
        height: 30px;
        line-height: 30px;
    }
    #mx_uMessage .sperList li  .name{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    #mx_uMessage .sperList li  .name h3{
        margin: 0;
    }
    #mx_uMessage .sperList li  .name img{
        width: 15px;
        height: 15px;
        margin-left: 8px;
    }
    #mx_uMessage .sperList li .sTop{
        display: flex;
    }

    #mx_uMessage .back{
        display: flex;
        color:#000;
        cursor: pointer;
    }
    #mx_uMessage .udTop{
        margin-top: 30px;
        margin-bottom: 15px;
    }
    #mx_uMessage .cont{
        margin: 30px 0;
    }
    #mx_uMessage .udTop,#mx_uMessage .cont{
        display: flex;
    }
    #mx_uMessage .udTop .l,#mx_uMessage .cont .l{
        margin-right: 300px;
        width: 320px;
        margin-left: 50px;
    }
    #mx_uMessage .udTop .l .name p{
        margin-bottom: 0;
    }
    #mx_uMessage .udTop .l .sName{
        margin-top: 20px;
    }
    #mx_uMessage .udTop .l .sName img{
        margin-top: -4px;
    }
    #mx_uMessage .udTop .l p,#mx_uMessage .cont .l p{
        margin: 20px 0;
    }
    #mx_uMessage .udTop .r,#mx_uMessage .cont .r{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    #mx_uMessage .udTop .r img,#mx_uMessage .cont .r img{
        width: 100px;
        height: 100px;
    }
    #mx_uMessage .cont .r .imgBox img{
        margin-right: 10px;
    }
    #mx_uMessage .udTop .l .name{
        display: flex;
        align-items: center;
    }
    #mx_uMessage .bBtn{
        margin-left: 50px;
    }
    #mx_uMessage .bBtn .ok{
        margin-right: 15px;
    }

</style>

<style>
    #mx_uMessage .anticon-check{
        color:#fff;
    }
    #mx_uMessage .anticon-close{
        color:red;
    }
</style>