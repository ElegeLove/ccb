<template>
    <div id="wList">
        <a-tabs defaultActiveKey="2">
            <a-tab-pane tab="未处理" key="1">
                <div v-if="!dShow">
                    <div class="tabBox">
                        <p>所属：</p>
                        <a-select @change="plChange" v-decorator="['select']" :value="rState" style="width: 120px;margin-right: 40px;">
                            <a-select-option v-for="(item,index) in rSList" :key="index+1">{{item}}</a-select-option>
                        </a-select>
                    </div>
                    <div class="tabBox">
                        <p>类型：</p>
                        <a-select @change="plChange" v-decorator="['select']" :value="rState2" style="width: 120px;margin-right: 40px;">
                            <a-select-option v-for="(item,index) in rSList2" :key="index+1">{{item}}</a-select-option>
                        </a-select>
                        <p style="margin-top: 5px;">未处理过期后会将异常反馈至关联上级，请及时处理</p>
                    </div>
                    <a-table class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSourceJ" :columns="columnsJ" :pagination="pagination"  @change="handleTableChange">
                        <div slot="img" slot-scope="img, record">
                            <img style="width: 70px;height: 70px;" :src="img" alt="">
                        </div>
                        <div slot="time" slot-scope="time, record">
                            <p v-if="record.overdue" style="margin-bottom: 0;color:#ff6600">{{time}}</p>
                            <p v-else style="margin-bottom: 0;">{{time}}</p>
                        </div>
                        <template slot="btn" slot-scope="text, record, index">
                            <div class="editable-row-operations">
                                <div style="display: flex;justify-content: center">
                                    <a class="mx_updata mx_color" style="margin-right: 15px;" @click="e => dtlCk(record,index)">查看</a>
                                    <a v-if="!record.overdue" class="mx_updata mx_color" @click="e => Handle(record,index)">去处理</a>
                                    <a v-if="record.overdue" class="mx_updata mx_color" @click="e => Handle(record,index)">处理过期</a>
                                </div>
                            </div>
                        </template>
                    </a-table>
                </div>
                <div v-else>
                    <div class="back" @click="dBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div>
                        <div class="card">
                            <div class="ct">
                                <p style="font-weight: bold;color:#000;">{{this.tyData.ads}}</p>
                            </div>
                            <div class="cC">
                                <img style="width: 80px;height: 80px;" src="@/assets/login/logo.png" alt="">
                                <div style="display: flex;" v-if="tyData.style == '食材'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.food.moeny}}</p>
                                    <p style="margin-left: 35px;">{{realData.food.num}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '健康证'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.sound.phone}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '供应商证件'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.splier.phone}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '学校证件'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                </div>
                            </div>
                            <div class="cB" v-if="tyData.style == '食材'">
                                <p>总价：<span style="font-weight: bold;">{{realData.food.aMy}}</span></p>
                            </div>
                        </div>
                        <div class="dst">
                            <div class="l" v-if="tyData.style == '食材'">
                                <p>入库时间：{{realData.food.sTime}}</p>
                                <p>保质期：{{realData.food.sLife}}</p>
                                <p>有效截止日期：{{realData.food.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '健康证'">
                                <p>发证单位：{{realData.sound.unit}}</p>
                                <p>发证日期：{{realData.sound.sTime}}</p>
                                <p>有效期：{{realData.sound.sLife}}</p>
                                <p>有效截止日期：{{realData.sound.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '供应商证件'">
                                <p>许可证号：{{realData.splier.phone}}</p>
                                <p>发证机关：{{realData.splier.unit}}</p>
                                <p>有效期限：  {{realData.splier.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '学校证件'">
                                <p>许可证号：{{realData.school.code}}</p>
                                <p>有效期限：  {{realData.school.eTime}}</p>
                            </div>
                            <div class="r" v-if="tyData.style == '健康证'" style="margin-left: 210px;">
                                <img :src="realData.sound.url" alt="">
                            </div>
                            <div class="r" v-if="tyData.style == '供应商证件'" style="margin-left: 210px;">
                                <img :src="realData.splier.url" alt="">
                            </div>
                            <div class="r" v-if="tyData.style == '学校证件'" style="margin-left: 210px;">
                                <img :src="realData.school.url" alt="">
                            </div>
                        </div>
                        <a-button type="primary" v-if="!tyData.overdue" @click="Handle(tyData)">去处理</a-button>
                        <a-button type="primary" v-else style="background: #ff6600;border:none;" @click="Handle(tyData)">处理过期</a-button>
                    </div>
                </div>
                <a-modal
                        v-model="visible"
                        :title="Title"
                >
                    <div style="height: 150px; display: flex;align-items: center;justify-content: center;flex-direction: column;">
                        <a-form :form="form">
                            <a-form-item>
                                <a-textarea style="width: 490px;height: 150px;resize: none;" v-decorator="[
                                              'txt',
                                              {rules: [{ required: true, message: '请填写处理方式说明' }]}
                                            ]"
                                placeholder="填写处理方式说明"
                                />
                            </a-form-item>
                        </a-form>
                    </div>
                    <template slot="footer">
                        <a-button  @click="hAndle('NO')">取消</a-button>
                        <a-button  type="primary" @click="hAndle('OK')">确认</a-button>
                    </template>
                </a-modal>
            </a-tab-pane>
            <a-tab-pane tab="处理记录" key="2" forceRender>
                <div v-if="!hShow">
                    <a-form :form="form2">
                        <div class="t">
                            <div class="tabBox">
                                <p>所属：</p>
                                <a-select @change="plChange" v-decorator="['select']" :value="sdState" style="width: 120px;margin-right: 40px;">
                                    <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                </a-select>
                            </div>
                        </div>
                        <div class="b" style="display: flex;">
                            <div class="tabBox">
                                <p>类型：</p>
                                <a-select @change="plChange2" v-decorator="['select']" :value="syState" style="width: 120px;margin-right: 40px;">
                                    <a-select-option v-for="(item,index) in syList" :key="index+1">{{item}}</a-select-option>
                                </a-select>
                            </div>
                            <div class="tabBox">
                                <p>状态：</p>
                                <a-select @change="plChange3" v-decorator="['select']" :value="sState" style="width: 120px;margin-right: 40px;">
                                    <a-select-option v-for="(item,index) in sList" :key="index+1">{{item}}</a-select-option>
                                </a-select>
                            </div>
                            <div class="tabBox">
                                <p>日期：</p>
                                <a-form-item>
                                    <a-range-picker v-decorator="['range-picker',{rules: [{ required: true, message: '请选择时间'}]}]" />
                                </a-form-item>
                            </div>
                            <a-button type="primary" style="margin-left: 20px;margin-top: 24px;" @click="getPlist('2')">查询</a-button>
                            <a-button style="margin-left: 20px;margin-top: 24px;" @click="clearL">重置</a-button>
                        </div>
                    </a-form>
                    <a-table class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSourceH" :columns="columnsH" :pagination="pagination"  @change="handleTableChange">
                        <div slot="img" slot-scope="img, record">
                            <img style="width: 70px;height: 70px;" v-if="img != ''" :src="img" alt="" >
                            <img style="width: 70px;height: 70px;" v-if="img == ''" src="@/assets/login/logo.png">
                        </div>
                        <div slot="time" slot-scope="time, record">
                            <p style="margin-bottom: 0;">{{time}}</p>
                        </div>
                        <div slot="ads" slot-scope="ads, record">
                            <p style="margin: 0 auto; max-width:260px;word-wrap: break-word;word-break: break-all;overflow: hidden;">{{ads}}</p>
                        </div>
                        <template slot="btn" slot-scope="text, record, index">
                            <div class="editable-row-operations">
                                <div style="display: flex;justify-content: center">
                                    <a class="mx_updata mx_color" @click="e => hLook(record,index)">查看</a>
                                </div>
                            </div>
                        </template>
                    </a-table>
                </div>
                <div v-else>
                    <div class="back" @click="HBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div>
                        <div class="card">
                            <div class="ct">
                                <p style="font-weight: bold;color:#000;">{{this.tyData.ads}}</p>
                            </div>
                            <div class="cC">
                                <img style="width: 80px;height: 80px;" src="@/assets/login/logo.png" alt="">
                                <div style="display: flex;" v-if="tyData.style == '食材'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.food.moeny}}</p>
                                    <p style="margin-left: 35px;">{{realData.food.num}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '健康证'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.sound.phone}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '供应商证件'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                    <p style="margin-left: 35px;">{{realData.splier.phone}}</p>
                                </div>
                                <div style="display: flex;" v-if="tyData.style == '学校证件'">
                                    <p style="margin-left: 35px;">{{this.tyData.name}}</p>
                                </div>
                            </div>
                            <div class="cB" v-if="tyData.style == '食材'">
                                <p>总价：<span style="font-weight: bold;">{{realData.food.aMy}}</span></p>
                            </div>
                        </div>
                        <div class="dst">
                            <div class="l" v-if="tyData.style == '食材'">
                                <p>入库时间：{{realData.food.sTime}}</p>
                                <p>保质期：{{realData.food.sLife}}</p>
                                <p>有效截止日期：{{realData.food.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '健康证'">
                                <p>发证单位：{{realData.sound.unit}}</p>
                                <p>发证日期：{{realData.sound.sTime}}</p>
                                <p>有效期：{{realData.sound.sLife}}</p>
                                <p>有效截止日期：{{realData.sound.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '供应商证件'">
                                <p>许可证号：{{realData.splier.phone}}</p>
                                <p>发证机关：{{realData.splier.unit}}</p>
                                <p>有效期限：  {{realData.splier.eTime}}</p>
                            </div>
                            <div class="l" v-if="tyData.style == '学校证件'">
                                <p>许可证号：{{realData.school.code}}</p>
                                <p>有效期限：  {{realData.school.eTime}}</p>
                            </div>
                            <div class="r" v-if="tyData.style == '健康证'" style="margin-left: 210px;">
                                <img :src="realData.sound.url" alt="">
                            </div>
                            <div class="r" v-if="tyData.style == '供应商证件'" style="margin-left: 210px;">
                                <img :src="realData.splier.url" alt="">
                            </div>
                            <div class="r" v-if="tyData.style == '学校证件'" style="margin-left: 210px;">
                                <img :src="realData.school.url" alt="">
                            </div>
                        </div>
                        <div class="btm">
                            <p>处理状态：{{tyData.state}}</p>
                            <p>处理说明：{{tyData.txt}}</p>
                            <p>处  理  人：{{tyData.hName}}</p>
                            <p>处理时间：{{tyData.time}}</p>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        data(){
            return {
                //提交
                form:this.$form.createForm(this),
                form2:this.$form.createForm(this),
                //下拉框
                rState:'全部',
                rSList:['全部','食堂一','食堂二','食堂三'],
                rState2:'全部',
                rSList2:['全部','食堂一','食堂二','食堂三'],
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
                //分页
                handleTableChange(pagination, filters, sorter) {
                    this.pagination.pageSize = pagination.pageSize;
                    this.pagination.current = pagination.current;
                },
                //权限列表
                columnsJ: [{
                    title: '所属',
                    align:'center',
                    dataIndex: 'beTo',
                    width:'70',
                    height:'50',
                },{
                    title: '类型',
                    align:'center',
                    dataIndex: 'style',
                    width:'140',
                    height:'50'
                }, {
                    title: '图片',
                    align:'center',
                    dataIndex: 'img',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "img" }
                },{
                    title: '名称',
                    align:'center',
                    dataIndex: 'name',
                    width:'160',
                    height:'50'
                },{
                    title: '定位',
                    align:'center',
                    dataIndex: 'ads',
                    width:'230',
                    height:'50'
                },{
                    title: '有效截止日期',
                    align:'center',
                    dataIndex: 'time',
                    width:'180',
                    height:'50',
                    scopedSlots: { customRender: "time" }
                },{
                    title: '操作按钮',
                    align:'center',
                    dataIndex: 'btn',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "btn" }
                }],
                dataSourceJ: [{
                    key: '0',
                    beTo:'食堂1',
                    style:'食材',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896028515&di=90e61a39e06875b389adf5697903715e&imgtype=0&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                    name:'包包白',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    time:'2019-07-06',
                    overdue:false,
                },{
                    key: '1',
                    beTo:'食堂1',
                    style:'健康证',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896340445&di=fe147887fdb48c5a41bb0a83ca88741e&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8b13632762d0f703807cbc6708fa513d2797c5ba.jpg',
                    name:'王阿航',
                    ads:'食堂1 ，采购员',
                    time:'2019-07-06',
                    overdue:false,
                },{
                    key: '2',
                    beTo:'食堂1',
                    style:'供应商证件',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896340445&di=fe147887fdb48c5a41bb0a83ca88741e&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8b13632762d0f703807cbc6708fa513d2797c5ba.jpg',
                    name:'张三的猪肉',
                    ads:'食品流通许可证',
                    time:'2019-07-06',
                    overdue:false,
                },{
                    key: '3',
                    beTo:'学校',
                    style:'学校证件',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896373515&di=9a583521ee2b553df16b5d510855a735&imgtype=0&src=http%3A%2F%2Fimg.91goodschool.com%2FUpFiles%2Fag%2F1968%2F1000%2F201508%2F21%2F162512030738.jpg',
                    name:'重庆巴蜀小学',
                    ads:'食品经营许可证',
                    time:'2019-07-06',
                    overdue:false,
                }],
                //详情显示
                dShow:false,
                //暂存数据
                tyData:{
                    key: '0',
                    beTo:'食堂1',
                    style:'食材',
                    img:'http://img2.imgtn.bdimg.com/it/u=2781272855,1588986775&fm=26&gp=0.jpg',
                    name:'包包白',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    time:'2019-07-06',
                    overdue:true,
                },
                //获取数据
                realData:{
                    food:{
                        moeny:'￥15.00/斤',
                        num:'200斤',
                        aMy:'￥500.00',
                        sTime:'2019-06-30',
                        sLife:'30天',
                        eTime:'2019-07-30'
                    },
                    sound:{
                        unit:'重庆市人民医院',
                        phone:'15225896352',
                        sTime:'2019-06-21',
                        sLife:'一年',
                        eTime:'2019-07-30',
                        url:'@/assets/login/logo.png'
                    },
                    splier:{
                        phone:'15225896352',
                        code:'65654654646',
                        unit:'重庆市人民医院',
                        eTime:' 2019-06-21 至 2020-06-30',
                        url:'http://b-ssl.duitang.com/uploads/item/201707/14/20170714224050_PsGm3.jpeg'
                    },
                    school:{
                        code:'65654654646',
                        eTime:' 2019-06-21 至 2020-06-30',
                        url:'http://b-ssl.duitang.com/uploads/item/201707/14/20170714224050_PsGm3.jpeg'
                    }
                },
                //处理
                visible:false,
                Title:'',
                //处理记录
                sdState:'全部',
                sdList:['全部','食堂一','食堂二','食堂三'],
                syState:'全部',
                syList:['全部','审核中','审核通过','未通过'],
                sState:'全部',
                sList:['全部','审核中','审核通过','未通过'],
                //处理列表
                columnsH: [{
                    title: '所属',
                    align:'center',
                    dataIndex: 'beTo',
                    width:'70',
                    height:'50',
                },{
                    title: '预警类型',
                    align:'center',
                    dataIndex: 'style',
                    width:'140',
                    height:'50'
                }, {
                    title: '图片',
                    align:'center',
                    dataIndex: 'img',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "img" }
                },{
                    title: '名称',
                    align:'center',
                    dataIndex: 'name',
                    width:'160',
                    height:'50'
                },{
                    title: '定位',
                    align:'center',
                    dataIndex: 'ads',
                    width:'230',
                    height:'50',
                    scopedSlots: { customRender: "ads" }
                },{
                    title: '处理状态',
                    align:'center',
                    dataIndex: 'state',
                    width:'180',
                    height:'50'
                },{
                    title: '处理说明',
                    align:'center',
                    dataIndex: 'txt',
                    width:'180',
                    height:'50'
                },{
                    title: '处理人',
                    align:'center',
                    dataIndex: 'hName',
                    width:'180',
                    height:'50'
                },{
                    title: '处理时间',
                    align:'center',
                    dataIndex: 'time',
                    width:'180',
                    height:'50'
                }, {
                    title: '操作按钮',
                    align:'center',
                    dataIndex: 'btn',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "btn" }
                }],
                dataSourceH: [{
                    key: '0',
                    beTo:'食堂1',
                    style:'食材',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896028515&di=90e61a39e06875b389adf5697903715e&imgtype=0&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                    name:'包包白',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    state:'正常预警',
                    txt:'已经吃了',
                    hName:'王阿航',
                    time:'2019-07-02    15:23',
                },{
                    key: '1',
                    beTo:'食堂2',
                    style:'健康证',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896340445&di=fe147887fdb48c5a41bb0a83ca88741e&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8b13632762d0f703807cbc6708fa513d2797c5ba.jpg',
                    name:'证件',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    state:'已过期',
                    txt:'叫他办了',
                    hName:'王阿航',
                    time:'2019-07-02    15:23',
                },{
                    key: '2',
                    beTo:'供应商',
                    style:'供应商证件',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896340445&di=fe147887fdb48c5a41bb0a83ca88741e&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8b13632762d0f703807cbc6708fa513d2797c5ba.jpg',
                    name:'证件',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    state:'正常预警',
                    txt:'已删除该供应商',
                    hName:'王阿航',
                    time:'2019-07-02    15:23',
                },{
                    key: '3',
                    beTo:'学校',
                    style:'学校证件',
                    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571896373515&di=9a583521ee2b553df16b5d510855a735&imgtype=0&src=http%3A%2F%2Fimg.91goodschool.com%2FUpFiles%2Fag%2F1968%2F1000%2F201508%2F21%2F162512030738.jpg',
                    name:'证件',
                    ads:'食堂1 ，仓库2 ，批次号：21659',
                    state:'正常预警',
                    txt:'学校不开了',
                    hName:'王阿航',
                    time:'2019-07-02    15:23',
                }],
                //详情
                hShow:false,
            }
        },
        methods:{
            //搜索
            getPlist(val){

                const validateFieldsKey = ['range-picker']
                this.form2.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values);
                        if (!err) {

                        }

                    },
                );


            },
            //搜索状态选择
            plChange(e){
                this.rState = e;
            },
            //详情页
            dtlCk(val,i){
                console.log(val);
                this.tyData = val
                this.dShow = !this.dShow;
            },
            //返回
            dBack(){
                this.dShow = !this.dShow;
            },
            //处理
            Handle(val){
                if(val.overdue){
                    this.visible = !this.visible;
                    this.Title = '处理过期';
                }else{
                    this.visible = !this.visible;
                    this.Title = '确认处理';
                }
            },
            hAndle(val){
                if(val == 'OK'){
                    const validateFieldsKey = ['txt']
                    this.form.validateFields(validateFieldsKey,(err,values) => {
                        if (!err) {
                            this.visible = !this.visible;
                        }
                    });
                }else{
                    this.visible = !this.visible;
                }
            },
            //清空搜索状态
            clearL(){
                this.sdState = '全部';
                this.syState = '全部';
                this.sState = '全部';
                this.form2.resetFields();
            },
            //搜索状态选择
            plChange(e){
                this.sdState = e;
            },
            plChange2(e){
                this.syState = e;
            },
            plChange3(e){
                this.sState = e;
            },
            //打开详情
            hLook(val){
                this.tyData = val
                this.hShow = !this.hShow
            },
            //返回
            HBack(){
                this.hShow = !this.hShow
            }
        },
        created(){

        }
    }
</script>

<style scoped>
    .tabBox{
        display: flex;
        margin-top: 25px;
    }
    .tabBox p{
        margin-bottom: 0;
        line-height: 2.2;
    }
    .back{
        display: flex;
        width: 100px;
        cursor: pointer;
    }
    .cC{
        display: flex;
        align-items: center;
    }
    .cC p{
        margin-bottom: 0;
    }
    .cC img{
        margin-left: 25px;
    }
    .ct{
        margin: 15px 0 0 25px;
    }
    .cB{
        display: flex;
        justify-content: flex-end;
    }
    .cB p{
        margin-right: 26px;
    }
    .card{
        width: 480px;
        height: 170px;
        box-shadow:0 0 10px #d9d9d9;
        border:1px solid #d9d9d9;
        border-radius:5px;
        margin-top: 32px;
    }
    .dst{
        display: flex;
        align-items: center;
        margin-top: 50px;
        margin-bottom: 46px;
    }
    .dst img{
        width: 110px;
        height: 110px;
    }
</style>
<style>

</style>