<template>
    <div id="mx_hMessage">
        <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="我的上级" key="1">
                <div class="components-input-demo-presuffix" v-show="nDate">
                    <p class="hmTxt">上级：</p>
                    <a-input placeholder="上级全名称" class="seachBox" v-model="Name" ref="userNameInput">
                        <a-icon v-if="Name" theme="filled" slot="suffix" type="close-circle" @click="emitEmpty" style="color:#999"/>
                    </a-input>
                    <a-button type="primary" class="seachBtn">搜索</a-button>
                </div>
                <div class="hList" v-show="nDate">
                    <a-col :span="12" v-for="(item,index) in hlDate">
                        <div class="dBox" @click="oNew(index)">
                            <div class="mBox">
                                <div class="l">
                                    <img :src="item.url" alt="">
                                </div>
                                <div class="r">
                                    <h4>{{item.name}}</h4>
                                    <p>ID：{{item.id}}</p>
                                    <p class="mbN">联系电话：{{item.tel}}</p>
                                </div>
                            </div>
                            <div class="bBox sN" v-if="item.state == 1">
                                <p class="nOpen">{{item.nTxt}}</p>
                            </div>
                            <div class="bBox sR" v-if="item.state == 2">
                                <p class="rece">{{item.nTxt}}</p>
                                <a-button class="srBtn" type="primary" @click.stop="wrapShow">申请关联</a-button>
                            </div>
                            <div class="bBox rM" v-if="item.state == 3">
                                <p class="rMessage">关联信息：{{item.nTxt}}</p>
                                <div class="notice">
                                    <a-icon type="sound" style="margin-right: 5px;margin-left: 45px;"/>
                                    <p>近期通知：</p>
                                    <p class="ovHd">{{item.rNotice}}</p>
                                </div>
                            </div>
                        </div>
                    </a-col>
                </div>
                <div class="hList" v-show="!nDate">
                    <div v-show="nDate">
                        <a-col :span="24" style="display: flex;justify-content: center;align-items: center;flex-direction: column;min-height: 600px;">
                            <img :src="nImg" alt="" style="width: 150px;height: 150px;margin-bottom: 30px;">
                            <p>请输入您区（县）上级的具体名称哦</p>
                        </a-col>
                    </div>
                    <a-modal
                            title="申请关联"
                            v-model="visible"
                            @ok="ayOk"
                            style="top: 30%;"
                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                    >
                        <a-textarea placeholder="守护孩子们食品安全是我们义不容辞的责任~" v-model="refuse" style="height: 150px;resize: none;"/>
                    </a-modal>
                    <div class="srBox" v-show="!nDate">
                        <div class="back" @click="back()" v-show="!nDate">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p>查看详情</p>
                        </div>
                        <div v-for="item in dInf">
                            <!--基本信息-->
                            <div class="basicM">
                                <div class="l">
                                    <p>上级名称：{{item.name}}</p>
                                    <p>系统  ID：{{item.id}}</p>
                                    <p>联系电话：{{item.tel}}</p>
                                    <p>详细地址：{{item.ads}}</p>
                                </div>
                                <div class="r">
                                    <p>LOGO</p>
                                    <img :src="item.logo" alt="">
                                </div>
                            </div>
                            <!--关联信息-->
                            <div class="relationM" v-show="item.sTime != null">
                                <p>关联时间：{{item.sTime}}</p>
                                <div class="notice">
                                    <a-icon type="sound" style="margin-right: 5px;margin-bottom: 30px;"/>
                                    <p>近期通知：</p>
                                    <p class="ovHd">{{item.notice}}</p>
                                </div>
                            </div>
                            <!--申请人信息-->
                            <div class="appayM" v-show="item.applicant != null">
                                <p>申  请  人：{{item.applicant}}</p>
                                <p>申请时间：{{item.aTime}}</p>
                                <p>申请备注：{{item.aTxt}}</p>
                            </div>
                            <!--审核信息-->
                            <div class="auditM" v-show="item.auditM != null">
                                <p>审核备注：{{item.auditM}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane tab="关联记录" key="2" forceRender>
                <div class="wrap" v-show="!rcShow">
                    <div>
                        <a-form :form="form" class="acBox">
                            <p style="line-height: 30px;margin-right: 10px;">状态：</p>
                            <a-select @change="onChange" v-decorator="['select']" :value="ayState" style="width: 120px;margin-right: 40px;">
                                <a-select-option v-for="(item,index) in ayList" :key="index+1">{{item}}</a-select-option>
                            </a-select>
                            <p style="line-height: 30px;margin-right: 10px;">日期：</p>
                            <a-form-item>
                                <a-range-picker style="margin-right: 40px;" v-decorator="['range-picker']" />
                            </a-form-item>
                            <a-button type="primary" style="margin-right: 10px;">搜索</a-button>
                            <a-button @click="reset">重置</a-button>
                        </a-form>
                    </div>
                    <!--查询操作1-->
                    <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="pagination"  @change="handleTableChange">
                        <img  style="width:100px;heigth:100px" slot="pic" slot-scope="text, record" :src=record.logo />
                        <div slot="logo" slot-scope="text, record" style="display: flex;justify-content: center;align-items: center">
                            <p>{{record.name[0]}}</p>
                            <!--<img :src=record.name[1] alt="" style="width: 15px;height: 15px;margin-bottom: 15px;margin-left: 10px;">-->
                        </div>
                        <div slot="state" slot-scope="text, record">
                            <p  style="margin: 0; color:#ff6600;" v-show="record.state == '待处理'">{{record.state}}</p>
                            <p style="margin: 0;" v-show="record.state != '待处理'">{{record.state}}</p>
                        </div>
                        <template slot="btn" slot-scope="text, record, index">
                            <div class="editable-row-operations">
                                <div style="display: flex;justify-content: center" v-show="record.state != '拒绝'">
                                    <a class="mx_updata mx_color" @click="state('OK')">去处理</a>
                                </div>
                                <div style="display: flex;justify-content: center" v-show="record.state == '拒绝'">
                                    <a class="mx_updata mx_color" @click="state('NO')">查看</a>
                                </div>
                            </div>
                        </template>
                    </a-table>
                </div>
                <div class="srBox wrap" v-show="rcShow">
                    <div class="back" @click="backTwo()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div v-for="item in rcList">
                        <!--基本信息-->
                        <div class="basicM">
                            <div class="l">
                                <p>上级名称：{{item.name}}</p>
                                <p>系统  ID：{{item.id}}</p>
                                <p>联系电话：{{item.tel}}</p>
                                <p>详细地址：{{item.ads}}</p>
                            </div>
                            <div class="r">
                                <p>LOGO</p>
                                <img :src="item.logo" alt="">
                            </div>
                        </div>
                        <!--申请人信息-->
                        <div class="appayM" v-show="item.applicant != null">
                            <p>申  请  人：{{item.applicant}}</p>
                            <p>申请时间：{{item.aTime}}</p>
                            <p>申请备注：{{item.aTxt}}</p>
                        </div>
                        <!--审核信息-->
                        <!--成功或审核中-->
                        <div v-show="item.sFlag" class="auditM" v-for="it in item.sList" >
                            <p>当前状态：{{it.auditT}}</p>
                            <p v-show="it.audTime != null">审核时间：{{it.audTime}}</p>
                            <p v-show="it.auditM != null">审核备注：{{it.auditM}}</p>
                        </div>
                        <!--失败-->
                        <div class="auditM" v-for="it in item.bList" v-show="!item.sFlag">
                            <p>当前状态：{{it.auditT}}</p>
                            <p>审核时间：{{it.audTime}}</p>
                            <p>审核备注：{{it.auditM}}</p>
                        </div>
                        <a-button type="primary" @click="reApy" v-show="!item.sFlag" style="margin-bottom: 40px;">重新申请</a-button>
                        <a-modal
                                title="申请关联"
                                v-model="visible2"
                                @ok="ayOk2"
                                style="top: 30%;"
                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                        >
                            <a-textarea placeholder="守护孩子们食品安全是我们义不容辞的责任~" v-model="refuse" style="height: 150px;resize: none;"/>
                        </a-modal>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                from: null,
                spShow:false,
                dMShow:true,//显示详情or无数据
                nDate:true,//搜索有无数据
                nImg:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3350251943,749232654&fm=26&gp=0.jpg',
                Name: '',
                hlDate:[{
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565774549416&di=a726fdb892c5f16bd20209556ca0400d&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F37b020d287e6a89775f119a58cd9952f6b7d33375fff1-WsK3nc_fw658',
                    id:"------",
                    tel:'------',
                    name:'重庆市教育委员会/教育局',
                    state:1,
                    nTxt:'为了守护孩子们健康成长请及时联系开通吧~',
                    rNotice:null
                },{
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565774549416&di=a726fdb892c5f16bd20209556ca0400d&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F37b020d287e6a89775f119a58cd9952f6b7d33375fff1-WsK3nc_fw658',
                    id:"------",
                    tel:'------',
                    name:'重庆市市场监管局',
                    state:2,
                    nTxt:'已等候您多时啦，快去关联吧',
                    rNotice:null
                },{
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565774549416&di=a726fdb892c5f16bd20209556ca0400d&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F37b020d287e6a89775f119a58cd9952f6b7d33375fff1-WsK3nc_fw658',
                    id:"123526",
                    tel:'15123225252',
                    name:'重庆市教育委员会/教育局',
                    state:3,
                    nTxt:'2019-06-24 关联成功',
                    rNotice:'关于做好食品安全卫生等问题说明sdasdasdasdasdasdasdasd'
                }],
                refuse:'',
                visible:false,
                visible2:false,
                dInf:[{
                    name:'重庆市教育委员会',
                    id:'1532687',
                    tel:'15123586987',
                    ads:'左转上二楼',
                    logo:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3350251943,749232654&fm=26&gp=0.jpg',
                    sTime:'2019-07-07    15:23',
                    notice:'关于做好食品安全卫生等问题说明',
                    applicant:'超级管理员',
                    aTime:'2019-07-01   15:32',
                    aTxt:'守护孩子们食品安全是我们义不容辞的责任~',
                    auditM:'食品安全将由我们一起来守护'
                }],
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
                },{
                    title: '审核状态',
                    align:'center',
                    dataIndex: 'state',
                    scopedSlots: { customRender: "state" }
                },{
                    title: '申请人',
                    align:'center',
                    dataIndex: 'lpName',
                },{
                    title: '申请时间',
                    align:'center',
                    dataIndex: 'sTime',
                },{
                    title: '操作按钮',
                    align:'center',
                    dataIndex: 'btn',
                    scopedSlots: { customRender: "btn" }
                }, ],
                dataSource: [{
                    key: '0',
                    logo:'http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg',
                    name:['张三的猪肉','http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg'],
                    tel:'123',
                    lpName:'123',
                    sTime:'123',
                    state:'待处理',
                    btn:'123'
                },{
                    key: '1',
                    logo:'http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg',
                    name:['张三的猪肉','http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg'],
                    tel:'123',
                    lpName:'123',
                    sTime:'123',
                    state:'通过',
                    btn:'123'
                },{
                    key: '2',
                    logo:'http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg',
                    name:['张三的猪肉','http://www.zmdtvw.cn/d/file/p/2017/05/02/1b1a5990a145aa216688de72423a8c23.jpeg'],
                    tel:'123',
                    lpName:'123',
                    sTime:'123',
                    state:'拒绝',
                    btn:'123'
                }],
                //分页配置
                pagination: {
                    pageSize: 10, // 默认每页显示数量
                    current: 1, //显示当前页数
                    showSizeChanger: true, // 显示可改变每页数量
                    showQuickJumper: true, //显示跳转到输入的那一页
                    pageSizeOptions: ["10", "20"], // 指定每页可以显示多少条
                    showSizeChange: (current, pageSize) =>

                        (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                    showTotal: total =>
                        `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                            total / this.pagination.pageSize
                        )} 页` // 显示总数
                },
                ayState:1,
                ayList:['全部','审核中','已关联','被拒绝'],
                rcShow:false,//申请记录详情,
                rcList:[{
                    sFlag:false,
                    name:'重庆市教育委员会',
                    id:'1532687',
                    tel:'15123586987',
                    ads:'左转上二楼',
                    logo:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3350251943,749232654&fm=26&gp=0.jpg',
                    applicant:'超级管理员',
                    aTime:'2019-07-01   15:32',
                    aTxt:'守护孩子们食品安全是我们义不容辞的责任~',
                    sList:[{
                        auditT:'审核通过',
                        audTime:'2019-07-01   15:32',
                        auditM:'食品安全将由我们一起来守护'
                    }],
                    bList:[{
                        auditT:'被拒绝',
                        audTime:'2019-07-01   15:32',
                        auditM:'请关联行政区域上级'
                    },{
                        auditT:'被拒绝',
                        audTime:'2019-07-01   15:32',
                        auditM:'请关联行政区域上级'
                    },{
                        auditT:'被拒绝',
                        audTime:'2019-07-01   15:32',
                        auditM:'请关联行政区域上级'
                    }]
                }]
            }
        },
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        methods: {
            emitEmpty () {
                this.$refs.userNameInput.focus()
                this.Name = ''
            },
            wrapShow(){
                this.visible = true;
                this.refuse = '';
            },
            ayOk(){
//                this.refuse需要提交的数据
                this.$message.success(`申请关联已提交`);
                this.visible = false;
            },
            oNew(i){
                console.log(i);
                this.dMShow = !this.dMShow;
                this.nDate = !this.nDate
            },
            back(){
                this.dMShow = !this.dMShow;
                this.nDate = !this.nDate
            },
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
            },
            onChange(e){
                this.ayState = e;
            },
            reset(){
                this.ayState = 1;
                this.form.resetFields();
            },
            state(val){
                this.rcShow = !this.rcShow
            },
            backTwo(){
                this.rcShow = !this.rcShow
            },
            reApy(){
                this.refuse = '';
                this.visible2 = true;
            },
            ayOk2(){
//                this.refuse需要提交的数据
                this.$message.success(`申请关联已提交`);
                this.visible2 = false;
            },
        },
        created(){
            if(!this.spShow){
                this.$message.warning(`上级暂未开通，快去联系开通吧`);
            }
        }
    };
</script>
<style scoped>
    #mx_hMessage .components-input-demo-presuffix{
        display: flex;
        align-items: center;
    }
    #mx_hMessage .hmTxt{
        margin: 0 10px 0 20px;
    }
    #mx_hMessage .seachBtn{
        margin-left: 40px;
    }
    #mx_hMessage .seachBox{
        width: 245px;
    }
    #mx_hMessage .hList{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
    }
    #mx_hMessage .dBox{
        width: 410px;
        height: 265px;
        box-shadow: 0 0 5px #999;
        border:1px solid #efefef;
        border-radius: 5px;
        margin: 40px auto;
    }
    #mx_hMessage .dBox .l,#mx_hMessage .dBox .l img{
        width: 100px;
        height: 100px;
    }
    #mx_hMessage .dBox .mBox{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 32px;
    }
    #mx_hMessage .dBox .mBox img{
        margin-left: 45px;
    }
    #mx_hMessage .dBox .mBox p,#mx_hMessage .dBox .mBox h4{
        margin-left: 82px;
    }
    #mx_hMessage .dBox .mBox p.mbN{
        margin-bottom: 0;
    }
    #mx_hMessage .dBox .bBox.sN p{
        text-align: center;
    }
    #mx_hMessage .dBox .bBox.sN{
        margin-top: 70px;
    }
    #mx_hMessage .dBox .bBox.sR{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #mx_hMessage .dBox .bBox.sR p{
        text-align: center;
        margin-top: 40px;
    }
    #mx_hMessage .dBox .bBox.sR .srBtn{
        width: 90px;
    }
    #mx_hMessage .dBox .bBox.rM{
        display: flex;
        flex-direction: column;
    }
    #mx_hMessage .dBox .bBox.rM .rMessage{
        margin-top: 30px;
        margin-left: 45px;
    }
    #mx_hMessage .dBox .bBox.rM .notice{
        display: flex;
        align-items: center;
    }
    #mx_hMessage .dBox .bBox.rM .notice p{
        margin-bottom: 0;
    }
    #mx_hMessage .dBox .bBox.rM .notice .ovHd{
        width: 250px;
        overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;
    }
    #mx_hMessage .srBox{
        margin-left: 20px;
        color:#000;
    }
    #mx_hMessage .back{
        margin-top: 15px;
        display: flex;
        color: #000;
        cursor: pointer;
        align-items: center;
    }
    #mx_hMessage .back p{
        margin-bottom: 0;
    }
    #mx_hMessage .basicM{
        margin-top: 35px;
        display: flex;
    }
    #mx_hMessage .basicM .r{
        display: flex;
        flex-direction: column;
        margin-left: 175px;
    }
    #mx_hMessage .basicM .r img{
        width: 100px;
        height: 100px;
    }
    #mx_hMessage .relationM .notice{
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    #mx_hMessage .basicM p,#mx_hMessage .relationM p,#mx_hMessage .appayM p,#mx_hMessage .auditM p{
        margin-bottom: 30px;
    }
    #mx_hMessage .appayM{
        margin-top: 41px;
    }
    #mx_hMessage .auditM{
        margin-top: 61px;
    }
    #mx_hMessage .acBox{
        display: flex;
        margin: 40px 0 30px;
    }
</style>