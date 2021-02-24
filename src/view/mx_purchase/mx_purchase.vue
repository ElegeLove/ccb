<template>
    <div id="mx_purchase">
        <a-tabs :activeKey="keyNum" @change="keyChange">
            <a-tab-pane tab="采购计划" key="1">
                <div class="add" v-show="initial">
                    <div class="ctList" style="display: flex;margin-top: 20px;">
                        <p>食堂：</p>
                        <a-radio-group @change="rChange(rVal)" v-model="rVal" style="max-width:95%;">
                            <a-radio v-if="index !== 0" :value="item.id" v-for="(item,index) in ctData">{{item.title}}</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="acBtn" style="display: flex;justify-content: space-between;margin-top: 20px;">
                        <div class="l">
                            <a-button style="margin-right: 20px;" @click="action('1')">食谱生成</a-button>
                            <a-button @click="action('2')">添加食材</a-button>
                        </div>
                        <div style="display: flex;align-items: center" class="c" v-show="allWeek.length != 0">
                            <p style="margin: 0;max-width: 650px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">已选<span v-for="item in allWeek">【{{item.one}} - {{item.seven}}】</span>食谱</p>
                        </div>
                        <div class="r">
                            <a-button style="margin-right: 20px;" @click="action('3')">清空</a-button>
                            <a-button type="primary" @click="action('5')">提交申请</a-button>
                        </div>
                    </div>
                    <a-table class="hBox" style="margin-top: 30px;" bordered :locale="nuData" :dataSource="dataSource" :columns="columns" :pagination="false" >
                        <img :data-img="1" v-if="record.img != ''"  style="width:100px;heigth:100px" slot="pic" slot-scope="text, record" :src=record.img />
                        <img :data-img="2" v-else style="width:100px;heigth:100px" slot="pic" slot-scope="text, record" src="@/assets/login/logo.png" alt="">
                        <!--名称插槽-->
                        <template slot="name" slot-scope="name,record,index">
                            <div v-show="name.state" style="margin: 0;padding: 45% 0; width: 100%;user-select: none;" @dblclick="e => nChange(name, record,index)">{{name.name}}</div>
                            <div v-show="!name.state">
                                    <a-select
                                            :placeholder="name.name"
                                            showSearch
                                            :value="shData.value"
                                            placeholder="请输入食材"
                                            style="width: 200px"
                                            :defaultActiveFirstOption="false"
                                            :showArrow="false"
                                            :filterOption="false"
                                            @search="e => inpSearch(e,record)"
                                            @change="e => inpChange(e,name, record,shData.data)"
                                            :notFoundContent="shData.ts ? undefined : null"
                                    >
                                    <a-select-option v-for="d in shData.data" :key="d.key">{{d.val}}</a-select-option>
                                    <!--远程搜索插槽-->
                                    <div slot="notFoundContent" style="display: flex;align-items: center;flex-direction: column;">
                                        <div class="box" v-if="!shData.sc">
                                            搜索中<a-icon type="loading" style="color:#666"/>
                                        </div>
                                        <div class="box" v-if="shData.sc" style="display: flex; flex-direction: column;align-items: center">
                                            <p style="margin-top: 30px;color:#000;">暂无对应食材</p>
                                            <p style="font-size: 14px;">我们正在持续完善食材系统中</p>
                                        </div>
                                    </div>
                                </a-select>
                            </div>
                        </template>
                        <!--自定义时间插槽-->
                        <template slot="time" slot-scope="time,userNum">
                            <div class="tBox1" v-if="item != 0" v-for="(item,index) in time" style="display: flex;align-items: center;padding: 5px 10px;">
                                <a-date-picker  :defaultValue="item" :format="dateFormat"  @change="e => handleChange(e,time,index)" :allowClear="false"/>
                                <a-icon type="close" style="color:#888;font-size: 20px;margin-left: 10px;cursor:pointer;" @click="clearT(time,index,userNum)"/>
                            </div>
                            <div class="tBox2" v-else style="display: flex;align-items: center;padding: 5px 10px;">
                                <a-date-picker :format="dateFormat"  @change="e => handleChange(e,time,index)" :allowClear="false"/>
                                <a-icon type="close" style="color:#888;font-size: 20px;margin-left: 10px;cursor:pointer;" @click="clearT(time,index,userNum)"/>
                            </div>
                            <a-button @click="bClick(time,userNum)" size="small" style="margin-top: 10px;">
                                <a-icon type="plus" />
                                添加使用时间
                            </a-button>
                        </template>
                        <!--自定义输入框插槽-->
                        <template slot="userNum" slot-scope="userNum,time">
                            <div class="tBox1" v-for="(item,index) in userNum" style="display: flex;align-items: center;padding: 5px 10px;">
                                <a-input addonAfter="斤" placeholder="请填写数量" @change="e => iChange(e, userNum, index,time)" :defaultValue="item"/>
                            </div>
                            <a-button size="small" style="opacity: 0;cursor: auto;margin-top: 10px;">
                                <a-icon type="plus" />
                                添加使用时间
                            </a-button>
                        </template>
                        <!--自定义按钮插槽-->
                        <template slot="btn" slot-scope="text, record, index">
                            <a class="mx_updata mx_color" @click="e => clearF(index)">删除</a>
                        </template>
                    </a-table>
                </div>
                <div class="gete" v-show="crtList">
                    <div class="back" @click="back('1')" style="display: flex;cursor:pointer;margin: 20px 0;">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>食谱生成</p>
                    </div>
                    <div class="wBox" style="display: flex;align-items: center;justify-content: space-between;">
                        <div class="l" style="display: flex;align-items: center;">
                            <p style="margin-bottom: 0;">周期：</p>
                            <p style="margin-bottom: 0;border:1px solid #d9d9d9;padding: 5px 10px;border-radius:5px;background: #f2f2f2;" class="brd">{{week.one}} — {{week.seven}}</p>
                            <a-button :disabled="isPW" class="prev" type="ghost" style="margin-left: 20px;color:#02bb72" @click="changeWk('add')"><a-icon type="left" />上一周</a-button>
                            <a-button type="primary" style="margin-left: 20px;" @click="changeWk('zero')">本周</a-button>
                            <a-button class="next" type="ghost" style="margin-left: 20px;color:#02bb72" @click="changeWk('reduce')">下一周<a-icon type="right" /></a-button>
                        </div>
                        <div class="r">
                            <a-button style="margin-right: 30px;" @click="getFood('1')">全部食谱</a-button>
                            <a-button type="primary" @click="getFood('2')">立即生成</a-button>
                        </div>
                    </div>
                    <a-table style="margin-top: 40px;" bordered :dataSource="dataSourceS" :columns="columnsS" :pagination="false">
                        <!--表头插槽-->
                        <div style="position:relative" slot="customTitle">
                            <p style='position:absolute;margin-bottom: 0;width:30px;left:-9px;top:-17px;'>日期</p>
                            <p style='position:absolute;width:41px;height:1px;background:#999;margin-bottom:0;transform: rotateZ(-45deg);margin-left:10px;margin-top:10px;left:-7px;top:-9px;'></p>
                            <p style='position:absolute;text-align: right;margin-bottom: 0;width:30px;left:23px;'>餐次</p>
                        </div>
                        <div style="position:relative" slot="customTitle2">
                            <p>星期一</p>
                            <p style="margin-bottom:0;">{{this.weekList[0]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle3">
                            <p>星期二</p>
                            <p style="margin-bottom:0;">{{this.weekList[1]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle4">
                            <p>星期三</p>
                            <p style="margin-bottom:0;">{{this.weekList[2]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle5">
                            <p>星期四</p>
                            <p style="margin-bottom:0;">{{this.weekList[3]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle6">
                            <p>星期五</p>
                            <p style="margin-bottom:0;">{{this.weekList[4]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle7">
                            <p>星期六</p>
                            <p style="margin-bottom:0;">{{this.weekList[5]}}</p>
                        </div>
                        <div style="position:relative" slot="customTitle8">
                            <p>星期日</p>
                            <p style="margin-bottom:0;">{{this.weekList[6]}}</p>
                        </div>
                        <!--表头插入结束-->
                        <!--内容插槽-->
                        <div v-for="index in 7" :slot="'ct' + (index+1)" slot-scope="text, record" style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
                            <div v-for="(item,index) in record.name[index-1]">
                                {{item.title}}
                            </div>
                        </div>
                        <!--内容插入结束-->
                        <!--底部-->
                        <template slot="footer" slot-scope="currentPageData">
                            <div class="tWrap" style="display: flex;justify-content: space-around">
                                <div class="iBox" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;">营养师：{{eData.name1}}</p>
                                </div>
                                <div class="iBox" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;">制谱人：{{eData.name2}}</p>
                                </div>
                                <div class="iBox" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;">审核人：{{eData.name3}}</p>
                                </div>
                            </div>
                        </template>
                        <!--底部结束-->
                    </a-table>
                </div>
                <div class="fBook" v-show="fList">
                    <div class="back" @click="back('2')" style="display: flex;cursor:pointer;margin: 20px 0;">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>全部食谱</p>
                    </div>
                    <a-table style="margin-top: 40px;" bordered :dataSource="notCData" :columns="notCList" :pagination="pagination" @change="handleTableChange"></a-table>
                </div>
                <div class="sucs" v-show="isOK">
                    <a-row>
                        <a-col :span="24" style="display: flex;flex-direction: column;align-items: center;">
                            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 60px;margin-top: 100px;margin-bottom: 0;"/>
                            <h3 style="margin-top: 24px;margin-bottom: 0;">提交成功</h3>
                            <p style="color:#ccc;margin-top: 20px;margin-bottom: 0;">您的采购计划已成功提交审核</p>
                            <p style="margin-top: 85px;margin-bottom: 0;">待审核通过后即可按采购计划快捷采购食材</p>
                            <a-button type="primary" style="margin-top: 190px;margin-bottom: 0;" @click="backInt">返回</a-button>
                        </a-col>
                    </a-row>
                </div>
                <a-modal
                        v-model="addFood"
                        title="生成提示"
                >
                    <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                        <p>{{addTxt}}</p>
                    </div>
                    <template slot="footer">
                        <a-button key="back" @click="aBack">取消</a-button>
                        <a-button key="submit" type="primary" @click="aOk">确认</a-button>
                    </template>
                </a-modal>
            </a-tab-pane>
            <a-tab-pane tab="全部计划" key="2" forceRender>
                <div class="sehBox" v-show="!dTab">
                    <a-form :form="form">
                        <div class="t">
                            <div class="tabBox">
                                <p>食堂：</p>
                                <a-form-item>
                                    <a-select @change="plChange" v-decorator="['fRoom',{initialValue: rState}]" style="width: 120px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in rSList" :key="index+1">{{item.title}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div style="display: flex;">
                                <div class="tabBox">
                                    <p>单号：</p>
                                    <a-form-item>
                                        <a-input v-decorator="['code']" @change="inpChange2" style="width: 200px;" placeholder="请输入单号"/>
                                    </a-form-item>
                                </div>
                                <div class="tabBox" style="margin-left: 20px;">
                                    <p>状态：</p>
                                    <a-form-item>
                                        <a-select @change="plChange2" v-decorator="['state',{initialValue: rstate}]" style="width: 120px;margin-right: 40px;">
                                            <a-select-option v-for="(item,index) in rList" :key="index+1">{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                        <div class="b">
                            <div class="tabBox">
                                <p>日期：</p>
                                <a-form-item>
                                    <a-range-picker @change="dateChange" v-decorator="['rpicker']" />
                                </a-form-item>
                            </div>
                            <a-button type="primary" style="margin-left: 20px;margin-top: 20px;" @click="getPlist">查询</a-button>
                            <a-button style="margin-left: 20px;margin-top: 20px;" @click="clearL">重置</a-button>
                            <div class="add btn">
                                <div class="l" @click="tabClick('1')">
                                    <a-icon type="plus" />食谱
                                </div>
                                <div class="line"></div>
                                <div class="r" @click="tabClick('2')">
                                    其他
                                </div>
                            </div>
                            <div class="dLoad btn">
                                <div class="l" @click="tabClick('3')">打印</div>
                                <div class="line"></div>
                                <div class="r" @click="tabClick('4')">导出</div>
                            </div>
                        </div>
                    </a-form>
                    <a-table :loading="adLoading" class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSourceJ" :columns="columnsJ" :pagination="pagination"  @change="handleTableChange">
                        <div slot="state" slot-scope="text, record">
                            <p  style="margin: 0; color:#ff6600;" v-show="record.state == '未通过' || record.state == '过期未审'">{{record.state}}</p>
                            <p style="margin: 0;" v-show="record.state != '未通过' && record.state != '过期未审'">{{record.state}}</p>
                        </div>
                        <template slot="btn" slot-scope="text, record, index">
                            <div class="editable-row-operations">
                                <div style="display: flex;justify-content: center">
                                    <a class="mx_updata mx_color" @click="e => dtlCk(record,index,record.state)">查看</a>
                                </div>
                            </div>
                        </template>
                    </a-table>
                </div>
                <div class="tabBxs" v-show="dTab">
                    <div class="back" @click="dBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div class="state" v-if="!admin.admin">
                        <!--通过-->
                        <div class="pass" v-show="eState == '审核通过'" style="display: flex;flex-direction: column;">
                            <div class="pass">
                                <p style="width: 150px;">审核状态：通过</p>
                                <p style="margin-left: 40px;">审核备注：{{admin.exmeTxt}}</p>
                            </div>
                            <div class="pass">
                                <p style="width: 150px;">审核人：{{admin.name}}</p>
                                <p style="margin-left: 40px;">审核时间：{{admin.time}}</p>
                            </div>
                        </div>
                        <!--未通过-->
                        <div class="failed" v-show="eState == '未通过'" style="display: flex;flex-direction: column;">
                            <div class="failed">
                                <p>审核状态：<span style="color:#ff6600">拒绝</span><span style="color:#02bb72;cursor: pointer;" @click="again(showData)">（重新申请）</span></p>
                                <p style="margin-left: 40px;">审核备注：{{admin.exmeTxt}}</p>
                            </div>
                            <div class="failed">
                                <p style="width: 183px;">审核人：{{admin.name}}</p>
                                <p style="margin-left: 40px;">审核时间：{{admin.time}}</p>
                            </div>
                        </div>
                        <!--审核中-->
                        <div class="passing" v-show="eState == '审核中'">
                            <p>审核状态：审核中</p>
                        </div>
                        <!--过期-->
                        <div class="expire" v-show="eState == '过期未审'">
                            <p>审核状态：<span style="color:#ff6600">过期未审</span><span style="color:#02bb72;cursor: pointer;" @click="again(showData)">（重新申请）</span></p>
                        </div>
                    </div>
                    <div class="state" v-else>
                        <!--通过-->
                        <div v-if="admin.state == '通过'">
                            <div class="pass">
                                <p style="width: 150px;">审核状态：通过</p>
                                <p style="margin-left: 40px;">审核备注：{{admin.exmeTxt}}</p>
                            </div>
                            <div class="pass">
                                <p style="width: 150px;">审核人：{{admin.name}}</p>
                                <p style="margin-left: 40px;">审核时间：{{admin.time}}</p>
                            </div>
                        </div>
                        <!--未通过-->
                        <div v-if="admin.state == '拒绝'">
                            <div class="failed">
                                <p style="width: 150px;">审核状态：拒绝</p>
                                <p style="margin-left: 40px;">拒绝原因：{{admin.exmeTxt}}</p>
                            </div>
                            <div class="failed">
                                <p style="width: 150px;">审核人：{{admin.name}}</p>
                                <p style="margin-left: 40px;">审核时间：{{admin.time}}</p>
                            </div>
                        </div>
                        <!--审核中-->
                        <div class="passing" v-if="admin.state == '审核中'">
                            <a-button type="primary" @click="passBtn('OK')" style="color:#fff">
                                <a-icon type="check" />
                                通过
                            </a-button>
                            <a-button type="primary" @click="passBtn('NO')" style="color:#fff;left: 20px;">
                                <a-icon type="close" style="color:red;"/>
                                拒绝
                            </a-button>
                        </div>
                        <!--过期-->
                        <div class="expire" v-if="admin.state == '过期未审'">
                            <p style="margin-top: 20px;">超过食材使用日期，无法审核，请联系重新提审</p>
                        </div>
                    </div>
                    <a-table :showHeader="false" class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSourceD" :columns="columnsD" :pagination="pagination2"  @change="handleTableChange1">
                        <!--头部插槽-->
                        <template slot="title" slot-scope="currentPageData">
                            <p>食堂：{{hList.fRoom}}</p>
                            <p>单号：{{hList.code}}</p>
                            <p>申请人：{{hList.name}}</p>
                            <p>申请时间：{{hList.time}}</p>
                        </template>
                        <!--图片插槽-->
                        <img v-if="pic !=''" :src="pic" alt="" slot="pic" slot-scope="pic, record, index" style="width: 120px;height: 80px;">
                        <img v-else src="@/assets/login/logo.png" alt="" slot="pic" slot-scope="pic, record, index" style="width: 120px;height: 80px;">
                        <!--时间插槽-->
                        <template slot="time" slot-scope="time, record, index">
                            <p style="margin-bottom: 0;" v-for="item in time" :class="{col:item.isE == true}">{{item.time}}</p>
                        </template>
                        <!--数量插槽-->
                        <template slot="num" slot-scope="num, record, index">
                            <p style="margin-bottom: 0;" v-for="item in num" >{{item}}</p>
                        </template>
                    </a-table>
                    <!--审核提示-->
                    <a-modal
                            v-model="visible"
                            :title="Title"
                    >
                        <a-textarea v-model="refuse" style="height: 150px;resize: none;"/>
                        <template slot="footer">
                            <a-button  @click="boxBack('NO')">取消</a-button>
                            <a-button  type="primary" @click="boxBack('OK')">确认</a-button>
                        </template>
                    </a-modal>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    import moment from 'moment';
    import globalApi from '../../globalApi/globalApi';
    export default {
        data(){
            return{
                adLoading:false,
                keyNum:'1',
                ctData:[{
                    id:1,
                    txt:'食堂一'
                },{
                    id:2,
                    txt:'食堂二'
                }],
                rVal:1,
                //展示空食材列表
                columns: [{
                    title: '序号',
                    align:'center',
                    dataIndex: 'index',
                    width:70,
                    height:50,
                    backgroundColor:"#777"
                },{
                    title: '图片',
                    align:'center',
                    width:120,
                    height:50,
                    dataIndex: 'img',
                    scopedSlots: {customRender: 'pic'},
                }, {
                    title: '名称',
                    align:'center',
                    width:200,
                    height:50,
                    dataIndex: 'name',
                    scopedSlots: { customRender: "name" }
                },{
                    title: '单位',
                    align:'center',
                    width:110,
                    height:50,
                    dataIndex: 'unit',
                },{
                    title: '总量',
                    align:'center',
                    width:110,
                    height:50,
                    dataIndex: 'num',
                },{
                    title: '使用时间',
                    align:'center',
                    width:220,
                    height:50,
                    dataIndex: 'time',
                    scopedSlots: { customRender: "time" }
                }, {
                    title: '使用数量',
                    align:'center',
                    width:160,
                    height:50,
                    dataIndex: 'userNum',
                    scopedSlots: { customRender: "userNum" }
                },{
                    title: '操作按钮',
                    align:'center',
                    width:110,
                    height:50,
                    scopedSlots: { customRender: "btn" }
                }],
                dataSource: [],
                //自定义空数据提示
                nuData:{
                    emptyText: '请添加食材'
                },
                //初始展示页面 key = 1
                initial:true,//采购计划
                crtList:false,//表格操作
                fList:false,//全部食谱
                isOK:false,//提交成功
                //周期
                week:{
                    one:'',
                    seven:'',
                    nOne:'',
                    nSeven:''
                },
                weekNum:0,
                weekList:[],
                //保存周期
                allWeek:[],
                //是否能上一周
                isPW:true,
                //食谱生成列表
                columnsS: [{
                    slots: { title: 'customTitle' },
                    align:'center',
                    dataIndex: 'logo',
                    width:80,
                    height:50,
                },{
                    slots: { title: 'customTitle2' },
                    align:'center',
                    dataIndex: 'name',
                    scopedSlots: {customRender: 'ct2'},
                },{
                    slots: { title: 'customTitle3' },
                    align:'center',
                    dataIndex: 'state',
                    scopedSlots: {customRender: 'ct3'},
                },{
                    slots: { title: 'customTitle4' },
                    align:'center',
                    dataIndex: 'lpName',
                    scopedSlots: {customRender: 'ct4'},
                },{
                    slots: { title: 'customTitle5' },
                    align:'center',
                    dataIndex: 'sTime',
                    scopedSlots: {customRender: 'ct5'},
                },{
                    slots: { title: 'customTitle6' },
                    align:'center',
                    dataIndex: 'btn',
                    scopedSlots: {customRender: 'ct6'},
                },{
                    slots: { title: 'customTitle7' },
                    align:'center',
                    dataIndex: '123',
                    scopedSlots: {customRender: 'ct7'},
                },{
                    slots: { title: 'customTitle8' },
                    align:'center',
                    dataIndex: '23',
                    scopedSlots: {customRender: 'ct8'},
                }],
                dataSourceS: [{
                    key: '0',
                    logo:'早餐',
                    name:[
                        ['包子','馒头','豆浆','牛奶','稀饭'],
                        ['包子','馒头','豆浆','牛奶','稀饭'],
                        ['包子','馒头','豆浆','牛奶','稀饭']
                    ]

                },{
                    key: '1',
                    logo:'午餐',
                    name:[
                        ['番茄炒蛋','红烧牛肉','酸菜鱼','泡椒肉丝','红烧肥肠'],
                        ['番茄炒蛋','红烧牛肉','酸菜鱼','泡椒肉丝','红烧肥肠'],
                        ['番茄炒蛋','红烧牛肉','酸菜鱼','泡椒肉丝','红烧肥肠'],
                        ['番茄炒蛋','红烧牛肉','酸菜鱼','泡椒肉丝','红烧肥肠']
                    ],
                },{
                    key: '2',
                    logo:'晚餐',
                    name:[
                        ['番茄','牛肉','酸菜','泡椒','烧肥肠'],
                        ['番茄','牛肉','酸菜','泡椒','烧肥肠']
                    ],

                },{
                    key: '3',
                    logo:'加餐',
                    name:[
                        ['番茄','牛肉','酸菜','泡椒','烧肥肠']
                    ],
                }],
                eData:{
                    name1:'王超',
                    name2:'王航',
                    name3:'王超航'
                },
                //未采购食谱
                notCList:[{
                    align:'center',
                    title:'食堂',
                    dataIndex: 'foodR',
                    width:80,
                    height:50,
                },{
                    title:'周期',
                    align:'center',
                    dataIndex: 'cycle',
                    width:80,
                    height:50,
                },{
                    title:'营养师',
                    align:'center',
                    dataIndex: 'dTian',
                    width:80,
                    height:50,
                },{
                    title:'制谱人',
                    align:'center',
                    dataIndex: 'msName',
                    width:80,
                    height:50,
                },{
                    title:'申请时间',
                    align:'center',
                    dataIndex: 'time',
                    width:80,
                    height:50,
                }],
                notCData:[{
                    key:"0",
                    foodR:'食堂1',
                    cycle:'6月5日   -   6月12日',
                    dTian:'王阿航',
                    msName:'王阿航',
                    time:'2019-07-04   15:23'
                },{
                    key:"1",
                    foodR:'食堂1',
                    cycle:'6月5日   -   6月12日',
                    dTian:'王阿航',
                    msName:'王阿航',
                    time:'2019-07-04   15:23'
                },{
                    key:"2",
                    foodR:'食堂1',
                    cycle:'6月5日   -   6月12日',
                    dTian:'王阿航',
                    msName:'王阿航',
                    time:'2019-07-04   15:23'
                }],
                //生成提示
                isGet:false,
                addFood:false,
                addTxt:'当前食谱已存在采购计划中，继续生成将覆盖原有计划，是否继续？',
                //日期格式化
                dateFormat:'MM-DD dddd',
                //列表搜索数据对象
                shData:{
                    data: [],
                    value:'',
                    ts:false,
                    sc:false
                },
                //是否已打开远程搜索
                loogRg:false,
                //数据是否完善
                dataOK:false,
                /**
                 页面二数据
                 */
                //下拉框
                form:this.$form.createForm(this),
                //食堂状态
                rState:1,
                rstate:1,
                rSList:[],
                rList:[{
                    id:0,
                    title:'全部'
                },{
                    id:1,
                    title:'审核中'
                },{
                    id:2,
                    title:'审核通过'
                },{
                    id:-1,
                    title:'未通过'
                }],
                rsID:0,
                rlID:0,
                time:{
                    s:'',
                    e:''
                },
                code:'',
                //分页配置
                pagination: {
                    pageSize: 15, // 默认每页显示数量
                    current: 1, //显示当前页数
                    total:0,
                    showSizeChanger: false, // 显示可改变每页数量
                    showQuickJumper: true, //显示跳转到输入的那一页
                    pageSizeOptions: ["10", "20"], // 指定每页可以显示多少条
//                    showSizeChange: (current, pageSize) =>
//
//                        (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                    showTotal: total =>
                        `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                            total / this.pagination.pageSize
                        )} 页` // 显示总数
                },
                pagination2: {
                    pageSize: 15, // 默认每页显示数量
                    current: 1, //显示当前页数
                    total2:0,
                    showSizeChanger: false, // 显示可改变每页数量
                    showQuickJumper: true, //显示跳转到输入的那一页
                    pageSizeOptions: ["10", "20"], // 指定每页可以显示多少条
                    showTotal: total2 =>
                        `共 ${total2} 条记录 第 ${this.pagination2.current} / ${Math.ceil(
                            total2 / this.pagination2.pageSize
                        )} 页` // 显示总数
                },
                //权限列表
                columnsJ: [{
                    title: '食堂',
                    align:'center',
                    dataIndex: 'droom',
                    width:'70',
                    height:'50'
                },{
                    title: '单号',
                    align:'center',
                    dataIndex: 'code',
                    width:'240',
                    height:'50'
                },{
                    title: '种类数量',
                    align:'center',
                    dataIndex: 'cNum',
                    width:'125',
                    height:'50'
                },{
                    title: '申请人',
                    align:'center',
                    dataIndex: 'rName',
                    width:'165',
                    height:'50'
                },{
                    title: '申请时间',
                    align:'center',
                    dataIndex: 'sTime',
                    width:'200',
                    height:'50'
                },{
                    title: '审核状态',
                    align:'center',
                    dataIndex: 'state',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "state" }
                },{
                    title: '操作按钮',
                    align:'center',
                    dataIndex: 'btn',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "btn" }
                }, ],
                dataSourceJ: [{
                    key: '0',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cNum:'帝王蟹',
                    rName:'阿航',
                    sTime:'2019-07-04   15:23',
                    state:'审核中',
                },{
                    key: '1',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cNum:'帝王蟹',
                    rName:'阿航',
                    sTime:'2019-07-04   15:23',
                    state:'审核通过',
                },{
                    key: '2',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cNum:'帝王蟹',
                    rName:'阿航',
                    sTime:'2019-07-04   15:23',
                    state:'未通过',
                },{
                    key: '3',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cNum:'帝王蟹',
                    rName:'阿航',
                    sTime:'2019-07-04   15:23',
                    state:'过期未审',
                }],
                //存储当前查看所需数据
                showData:'',//单号
                dTab:false,//详情列表显示
                //审核状态
                eState:'未通过',
                //审核备注
                exmeTxt:'无',
                //订单自定义头部
                hList:{},
                //订单详细列表
                columnsD: [{
                    title: '序号',
                    align:'center',
                    dataIndex: 'index',
                    width:'70',
                    height:'50',
                    scopedSlots: { customRender: 'name' },
                },{
                    title: '图片',
                    align:'center',
                    dataIndex: 'img',
                    width:'240',
                    height:'50',
                    scopedSlots: { customRender: "pic" }
                },{
                    title: '名称',
                    align:'center',
                    dataIndex: 'name',
                    width:'125',
                    height:'50'
                },{
                    title: '单位',
                    align:'center',
                    dataIndex: 'jin',
                    width:'165',
                    height:'50'
                },{
                    title: '总量',
                    align:'center',
                    dataIndex: 'aNum',
                    width:'200',
                    height:'50'
                },{
                    title: '时间',
                    align:'center',
                    dataIndex: 'time',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "time" }
                },{
                    title: '使用数量',
                    align:'center',
                    dataIndex: 'num',
                    width:'140',
                    height:'50',
                    scopedSlots: { customRender: "num" }
                }, ],
                dataSourceD: [],
                //管理员
                admin:{
                    admin:true,
                    state:'审核过期',
                    exmeTxt:'教委突然要来视察，食谱也要改',
                    name:'王主任',
                    time:'2019-06-01   15:23'
                },
                //审核提示
                visible:false,
                Title:'审核备注',
                //文案
                refuse:'快按时按量去采购吧',
            }
        },
        methods:{
            //切换顶部页面
            keyChange(e){
                this.keyNum = e;
                if(e==2){
                    this.getOneData()
                }
            },
            rChange(val){
                this.rVal = val;
                this.dataSource = [];
                this.allWeek = [];
            },
            //按钮操作
            action(val){
                if(val == 1){
                    //显示食谱生成表单
                    this.initial = !this.initial;
                    this.crtList = !this.initial;
                    this.getFBook();
                    return
                }
                if(val == 2){
                    this.shData.data = [];
                    this.shData.value = '';
                    let key = this.dataSource.length,
                        index = this.dataSource.length + 1;
                    let obj = {
                        key:key,
                        index:index,
                        img:require('@/assets/login/logo.png'),
                        name:{
                            name : '',
                            state: false
                        },
                        id:'',
                        unit:'斤',
                        num:0,
                        time:[],
                        userNum:[],
                    };
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
                if(val == 5){
                    this.dataSource.some((e,i) =>{
                        if(e.time.length == 0){
                            this.$message.warning('请添加序号'+(i+1) +'的时间和数量！');
                            this.dataOK = false;
                            return e.time.length == 0;

                        };
                        //  检查item 时间 return boolean
                        let checktime = function (time, _case) {

                            let case_ = _case || 'time';
                            let state = true;
                            let result = -1;

                            if( case_ === 'time'){
                                for(let index in time){
                                    if( typeof  time[index] !== "object" || time[index] === null || time[index] === 0){
                                        state = false;
                                        result = index;
                                        break;
                                    }
                                }
                            };
                            if( case_ === 'num'){
                                for(let _index in time){
                                    if( typeof  time[_index] !== "number" || time[_index] === 0){
                                        state = false;
                                        result = _index;
                                        break;
                                    }
                                }
                            }

                            return {
                                state : state,
                                index : result
                            };
                        };


                        if(e.name.name == ''){
                            this.$message.warning(`请输入序号`+ e.index +`菜品名称！`);
                            this.dataOK = false;
                            return e.name.name == '';
                        }else{
                            this.dataOK = true;
                        };

                        let checkTime = checktime(e.time);
                        if( !checkTime.state ){
                            this.$message.warning(`请选择序号`+ e.index +`使用时间！`);
                            this.dataOK = false;
                            return e.time[checkTime.index] == 0;
                        }else{
                            this.dataOK = true;
                        };

                        let checkUserNum = checktime(e.userNum, 'num');

                        if( !checkUserNum.state){
                            this.$message.warning(`请填写序号`+ e.index +`使用数量！`);
                            this.dataOK = false;
                            return e.userNum[checkUserNum.index] == 0;
                        }else{
                            this.dataOK = true;
                        };

                    });

                    console.log(this.dataOK);

                    //判断是否能提交
                    if(this.dataOK){
//                        this.rVal 食堂id
                        let data = {
                            plans:[],
                            cid:this.rVal
                        };
                        let state = true;
                        this.dataSource.forEach((e,i) =>{
                            let obj = {
                                material_id:e.id,
                                purpose:[]
                            };
                            e.time.some((e2,i2) =>{
                                if(e2 !== null){
                                    let p = {
                                        time:moment(e2._d).format('YYYYMMDD'),
                                        num:e.userNum[i2]
                                    };
                                    obj.purpose.push(p);
                                }else{
                                    state = false;
                                };
                            });
                            data.plans.push(obj);
                        });
                        if(state){
                            data.plans = JSON.stringify(data.plans);
                            axios({
                                method: "post",
                                url: globalApi.BASE_URL + 'api/school/plan/purchase',
                                data: data,
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                    'Accept': 'application/json',
//                                'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then((res) => {
                                if(res.data.code == 0){
                                    this.$message.success('提交申请成功！');
                                    this.initial = !this.initial;
                                    this.isOK = !this.isOK;
                                }else{
                                    this.$message.success(res.data.msg);
                                }
                            }).catch(function (err) {

                            });
                        }
                    }
                }
            },
            //返回展示页
            back(val){
                if(val == 1){
                    console.log(1);
                    this.initial = !this.initial
                    this.crtList = !this.crtList
                }else{
                    console.log(2);
                    this.fList = !this.fList;
                    this.crtList = !this.crtList
                }
            },
            //获取星期数
            tFormat(){
                let x = moment(new Date()).day(1).format("MM月DD日"),
                    y = moment(new Date()).day(7).format("MM月DD日"),
                    nX = moment(new Date()).day(1).format("YYYYMMDD"),
                    nY = moment(new Date()).day(7).format("YYYYMMDD");
                for(let i = 1; i < 8; i++){
                    this.weekList.push(moment(new Date()).day(i).format('MM月DD日'))
                }
                this.week.one = x;
                this.week.seven = y;
                this.week.nOne = nX;
                this.week.nSeven = nY;

            },
            changeWk(val){
                if(val == 'add'){
                    this.weekNum --;
                    this.getWeek(this.weekNum);
                } else if(val == 'zero'){
                    this.weekNum = 0;
                    this.getWeek(this.weekNum)
                }else{
                    this.weekNum ++;
                    this.getWeek(this.weekNum)
                }
                if(this.weekNum <= 0){
                    this.isPW = true;
                }else{
                    this.isPW = false;
                }
                this.getFBook();
            },
            getWeek(val){
                this.weekList = [];
                let x = val * 7 * 24 * 60 * 60 *1000,
                    y = x + 6 * 24 * 60 * 60 *1000,
                    nX = val * 7 * 24 * 60 * 60 *1000,
                    nY = nX + 6 * 24 * 60 * 60 *1000,
                    t = 0;
                for(let i = 1; i < 8; i++){
                    let s = t * 24 * 60 * 60 *1000;
                    t++;
                    let ss = moment(parseInt(moment(new Date()).day(1).format("x")) + x + s).format('MM月DD日');
                    this.weekList.push(ss);
                };
                x = moment(parseInt(moment(new Date()).day(1).format("x")) + x).format('MM月DD日');
                nX = moment(parseInt(moment(new Date()).day(1).format("x")) + nX).format('YYYYMMDD');
                y = moment(parseInt(moment(new Date()).day(1).format("x")) + y).format('MM月DD日');
                nY = moment(parseInt(moment(new Date()).day(1).format("x")) + nY).format('YYYYMMDD');
                this.week.one = x;
                this.week.seven = y;
                this.week.nOne = nX;
                this.week.nSeven = nY;
            },
            //跳转食谱或生成购买列表
            getFood(val){
                if(val == 1){
                    this.fList = !this.fList;
                    this.crtList = !this.crtList
                }else{
                    //判断是否提示已有采购计划
                    if(this.isGet){
                        this.addFood = !this.addFood
                    }else{
//                        this.crtList = !this.crtList
//                        this.initial = !this.initial
//                        this.allWeek.push(this.week)
                        let data ={
                            url:'api/school/plan/recipe/'+ this.week.nOne + this.week.nSeven + '?cid=' + this.rVal,
                            method:'get',
                        };
                        this.$apiAxiox(data).then((res)=>{
                            if(res.data.code == 0){
                                let that = this;
                                that.dataSource = [];
                                res.data.data.forEach((e,i)=>{
                                    let key = i,
                                        index = i + 1;
                                    let obj = {
                                        id:e.original.id,
                                        key:key,
                                        index:index,
                                        img:e.original.img_src[0].url,
                                        name:{
                                            name : e.original.title,
                                            state: true
                                        },
                                        unit:e.original.unit,
                                        num:0,
                                        time:[],
                                        userNum:[],
                                    };
                                    e.weeks.forEach((e2,i2)=>{
                                        if(e2 != 0){
                                            e2 = moment(e2);
                                            obj.time.push(e2);
                                        }else{
                                            obj.time.push(0);
                                        }
                                        obj.userNum.push(0);
                                    });
                                    that.dataSource.push(obj);
                                });
                                that.initial = !that.initial;
                                this.crtList = !this.initial;
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        });
                    }
                }

            },
            //分页
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
                this.getOneData();
            },
            //关闭提示
            aBack(){
                this.addFood = !this.addFood
            },
            //提示确认
            aOk(){
                this.addFood = !this.addFood
                this.crtList = !this.crtList
                this.initial = !this.initial
            },
            //添加时间和数量输入框
            bClick(val,val2){
                val2.userNum.push(0)
                val.push(0)
            },
            //表单时间改变回调
            handleChange (val,va,v) {
                va.splice(v, 1,val)
            },
            //删除时间和数量输入框
            clearT(val,index,val2){
                let sNum = 0;
                val.splice(index, 1);
                val2.userNum.splice(index, 1);
                val2.userNum.forEach((e)=>{
                    sNum += e;
                });
                val2.num = sNum;
            },
            //数量改变回调
            iChange(e,val,i,val2){
                let x = e.target.value * 1;
                val[i] = x;
                let sNum = 0;
                val.forEach((e,i)=>{
                    sNum += e
                })
                val2.num = sNum;
            },
            //双击名称修改
            nChange(val,val2,i){
                console.log(val2);
                if(!this.loogRg){
                    this.loogRg = true;
                    val.state = !val.state;
                    this.shData.value = val2.name.name
                }else{
                    this.$message.warning('请先完成当前更改！');
                }

            },
            //搜索数据
            inpSearch (value,val) {
                let that = this;
                //获取食材
                let data = {
                    url:'api/school/batch?title=' + value,
                    method:'get',
                    data:{}
                };
                this.shData.sc = false;
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        if(res.data.data.length > 0){
                            setTimeout(()=>{
                                this.shData.data = [];
                                res.data.data.forEach((e,i)=>{
                                    this.shData.value = '请选择菜品';
                                    let obj = {
                                        key:e.id,
                                        val:e.title,
                                        img:e.img_src[0].url
                                    };
                                    this.shData.data.push(obj);
                                });
                                this.shData.sc = !this.shData.sc;
                            });
                        }else{
                            this.shData.ts = true;
                            this.shData.sc = true;
                            this.shData.data = [];
                        }
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            //获取检索数据
            inpChange (value,val,val2,val3) {
                this.shData.value = value;
                let x = '',
                    y = '';
                val3.forEach((e,i) =>{
                    if(e.key == value){
                        x = e.val;
                        y = e.img;
                    }
                });
                this.loogRg = false;
                setTimeout(()=>{
                    val.state = !val.state;
                    val2.name.name = x;
                    val2.img = y;
                    val2.id = value;
                    val2.time = [];
                    val2.userNum = [];
                    val2.num = 0;
                    this.shData.data = [];
                    this.shData.value = '';
                },100);
            },
            //删除当前行数据
            clearF(index){
                this.dataSource.splice(index, 1);
                this.dataSource.forEach((e,i) =>{
                   e.key = i;
                   e.index = i+1;
                });
            },
            //订单号
            inpChange2(e){
                console.log(e);
            },
            //成功返回
            backInt(){
                this.initial = !this.initial;
                this.isOK = !this.isOK;
            },
            //获取食谱
            getFBook(){
                let that = this;
                let data ={
                    url:'api/school/recipes/'+ this.week.nOne + this.week.nSeven + '?id=' + this.rVal,
//                    url:'api/school/recipes/'+ 2019090920190915 + '?id=' + 22,
                    method:'get',
                };
                this.$apiAxiox(data).then((res)=>{

                    if(res.data.code == 0){
                        if(res.data.data.length == undefined){
                            if(res.data.data.foods == []){
                                that.$message.success('本周暂无食谱');
                            }else{
                                this.eData.name1 = res.data.data.dietitian;
                                this.eData.name2 = res.data.data.producer;
                                this.eData.name3 = res.data.data.auditor_nickname;
                                that.setfBook(res.data.data.foods);
                            }
                        }else{
                            this.dataSourceS = [];
                            let data = {
                                key: '0',
                                logo:'早餐',
                                name:[],
                            };
                            let data1 = {
                                key: '1',
                                logo:'午餐',
                                name:[],
                            };
                            let data2 = {
                                key: '2',
                                logo:'晚餐',
                                name:[],
                            };
                            let data3 = {
                                key: '3',
                                logo:'加餐',
                                name:[],
                            };
                            this.dataSourceS.push(data);
                            this.dataSourceS.push(data1);
                            this.dataSourceS.push(data2);
                            this.dataSourceS.push(data3);
                            that.$message.success('本周暂无食谱');
                        }
                    }else{
                        this.$message.error(res.data.msg);
                    }

                })
            },
            //处理数据
            setfBook(val){
                this.dataSourceS = [];
                let data = {
                    key: '0',
                    logo:'早餐',
                    name:[],
                };
                let data1 = {
                    key: '1',
                    logo:'午餐',
                    name:[],
                };
                let data2 = {
                    key: '2',
                    logo:'晚餐',
                    name:[],
                };
                let data3 = {
                    key: '3',
                    logo:'加餐',
                    name:[],
                };
                val.forEach((e,i)=>{
                    data.name.push(e.meal_times[1]);
                    data1.name.push(e.meal_times[2]);
                    data2.name.push(e.meal_times[3]);
                    data3.name.push(e.meal_times[4]);
                });
                this.dataSourceS.push(data);
                this.dataSourceS.push(data1);
                this.dataSourceS.push(data2);
                this.dataSourceS.push(data3);

                console.log(this.dataSourceS);
            },
            /**
             页面二方法
             */
            //清空搜索状态
            clearL(){
                this.rState = 1;
                this.rstate = 1,
                this.form.resetFields();
            },
            //搜索状态选择
            plChange(e){
                this.rState = e;
            },
            plChange2(e){
                this.rstate = e;
            },
//            //输入框数据
//            inpChange(e){
//                this.code = e.target.value;
//            },
            //时间数据
            dateChange(e){
                this.time.s = moment(e[0]._d).format('YYYYMMDD');
                this.time.e = moment(e[1]._d).format('YYYYMMDD');
            },
            //搜索
            getPlist(){
                const validateFieldsKey = ['fRoom','state','code'];
                this.form.validateFields(validateFieldsKey,(err,values) => {
                    console.log(values);
                    if(!err){
                        this.rsID = this.rSList[values.fRoom-1].id;
                        this.rlID = this.rList[values.state-1].id;
                        this.code = values.code;
                        this.getOneData();
                    };
                });
            },
            //新建添加打印导出
            tabClick(val){
                if(val==1){
                    this.keyNum = "1";
                    return;
                }
                if(val==2){
                    this.keyNum = "1";
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
                if(val==3){
                    console.log('打印');
                    return;
                }
                if(val==4){
                    console.log('导出');
                    return;
                }
            },
            //列表分页
            handleTableChange1(pagination, filters, sorter) {
                this.pagination2.pageSize = pagination.pageSize;
                this.pagination2.current = pagination.current;
                this.getDPlan();
            },
            //查看按钮
            dtlCk(val,i,val2){
                this.dTab = !this.dTab;
                this.showData= val.code;
                this.eState = val2;
                this.admin.state = val2;
                this.getDPlan();
            },
            //未通过或过期 再次审核
            again(val){
                this.keyNum = "1";
                let data ={
                    url:'api/school/plan/purchase/'+ val,
                    method:'get',
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        let that = this;
                        that.dataSource = [];
                        res.data.data.material.data.forEach((e,i)=>{
                            let key = i,
                                index = i + 1;
                            let obj = {
                                id:e.id,
                                key:key,
                                index:index,
                                img:e.picture,
                                name:{
                                    name : e.title,
                                    state: true
                                },
                                unit:e.unit,
                                num:e.number,
                                time:[],
                                userNum:[],
                            };
                            e.purpose_arr.forEach((e2,i2)=>{
                                e2.time = moment(e2.time);
                                obj.time.push(e2.time);
                                obj.userNum.push(e2.num);
                            });
                            that.dataSource.push(obj);
                        });
                        this.crtList = !this.initial;
                    }
                });


            },
            //返回订单列表
            dBack(){
                this.dTab = !this.dTab
            },
            //是否通过按钮
            passBtn(val){
                this.visible = !this.visible;
                if(val == 'NO'){
                    this.Title = '拒绝原因';
                    this.refuse = '请仔细检查计划列表哦';
                }else{
                    this.Title = '审核备注';
                    this.refuse = '快按时按量去采购吧';
                }
            },
            //提示框按钮
            boxBack(val){
                if(val== 'OK'){
                    let x = 0;
                    if(this.Title == '拒绝原因'){
                        x = -1;
                    }else{
                        x = 2;
                    }
                    let data = {
                        url:'api/school/plan/purchase/' + this.hList.code,
                        method:'put',
                        data:{
                            state: x,
                            des:this.refuse
                        }
                    }
                    this.$apiAxiox(data).then((res)=>{
                        if(res.data.code == 0){
                            this.refuse = '';
                            this.dTab = !this.dTab;
//                            this.getPlist();
                            this.getOneData();
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    });
                }
                this.visible = !this.visible
            },
            //获取全部计划列表
            getOneData(){
                this.adLoading = true;
                let that = this;
                let data = {
                    url:'api/school/plan/purchase?page=' + that.pagination.current +'&cid=' + that.rsID + '&state=' + that.rlID + '&odb=' + that.code + '&begin=' + that.time.s + '&end=' + that.time.e,
                    method:'get',
                    data:{}
                }
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        that.pagination.total = res.data.data.total;
                        this.setData(res.data.data.data)
                    }else{

                    }
                    this.adLoading = !this.adLoading;
                });
            },
            //处理数据
            setData(data){
                this.dataSourceJ = [];
                data.forEach((e,i)=>{
                    let x = '';
                    if(e.state == -1){
                        x = '未通过'
                    }else if(e.state == 1){
                        x = '审核中'
                    }else if(e.state == 2){
                        x = '审核通过'
                    }else{
                        x = '过期未审'
                    }
                    let obj = {
                        key: i,
                        droom:e.canteen_title,
                        code:e.single_number,
                        cNum:e.material_types,
                        rName:e.nickname,
                        sTime:e.created_at,
                        state:x,
                    }
                    this.dataSourceJ.push(obj);
                })
            },
            //获取食堂
            getFroom(){
                let data = {
                    url:'api/common/dictionaries',
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    this.ctData = [];
                    if(res.data.code == 0){
                        if(res.data.data.canteen.length>0){
                            this.ctData = res.data.data.canteen;
                            this.rSList = res.data.data.canteen;
                            let obj = {
                                id:0,
                                title:'全部'
                            };
                            this.rSList.splice(0,0,obj);
                            this.rVal = res.data.data.canteen[1].id;
                        }else{
                            this.rState = '全部';
                            this.$message.warning('暂无食堂可供选择！');
                        }
                    }else{

                    }
                });
            },
            //获取采购计划详情
            getDPlan(){
                let data = {
                    url:'api/school/plan/purchase/' + this.showData,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        //TODO : 审核备注没有
                        this.admin.time = res.data.data.updated_at;
                        this.admin.name = res.data.data.nickname;
                        this.pagination2.total2 = res.data.data.total;
                        switch (res.data.data.state) {
                            case 1:
                                this.admin.state = '审核中';
                                break;
                            case -1:
                                this.admin.state = '拒绝';
                                break;
                            case 2:
                                this.admin.state = '通过';
                                break;
                            case 3:
                                this.admin.state = '过期未审';
                        };
                        this.dataSourceD = [];
                        res.data.data.material.data.forEach((e,i)=>{
                            let obj = {
                                key: i,
                                index:res.data.data.canteen_title,
                                img:e.picture,
                                name:e.title,
                                jin:e.unit,
                                aNum:e.number,
                                time:[],
                                num:[],
                            };
                            obj.time = [];
                            obj.num = [];
                            e.purpose_arr.forEach((e2)=>{
                                let obj3 = {
                                    time:moment(e2.time).format("MM-DD dddd"),
                                    isE:false
                                }
                                obj.time.push(obj3);
                                obj.num.push(e2.num + e.unit);
                            });

                            this.dataSourceD.push(obj);
                        });




                        let obj2 = {
                            fRoom: res.data.data.canteen_title,
                            code:res.data.data.single_number,
                            name:res.data.data.username,
                            time:res.data.data.updated_at
                        };
                        this.hList = obj2;


                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            }
        },
        created(){
            this.tFormat();
            //获取食堂
            this.getFroom();
            //首次进入获取页面二数据
            this.getOneData();
            //获取权限
            let state = localStorage.getItem('state');
            console.log(state);
            if(state == 0){
                this.admin.admin = false;
            }else{
                this.admin.admin = true;
            }


        }
    }
</script>

<style scoped>
    #mx_purchase .b{
        display: flex;
    }
    #mx_purchase .tabBox{
        margin-top: 20px;
        display: flex;
    }
    #mx_purchase .tabBox p{
        margin-top: 5px;
        margin-bottom: 0;
    }
    #mx_purchase .ant-row.ant-form-item{
        margin-bottom: 0;
    }
    #mx_purchase .btn{
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 130px;
        height: 30px;
        border-radius:5px;
        margin-left: 20px;
        margin-top: 20px;
        background: #02bb72;
        color:#fff;
    }
    #mx_purchase .btn .l,#mx_purchase .btn .r{
        height: 100%;
        width: 45%;
        text-align: center;
        line-height: 2;
        cursor:pointer;
    }
    #mx_purchase .btn .line{
        width: 1px;
        height: 60%;
        background: #fff;
    }
    #mx_purchase .back{
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    #mx_purchase .back p{
        margin-top: 0;
        margin-bottom: 0;
    }
    #mx_purchase .state .pass,#mx_purchase .state .failed,#mx_purchase .state .passing,#mx_purchase .state .expire{
        margin-top: 20px;
        display: flex;
    }
    #mx_purchase p.col{
        color:rgb(255, 102, 0);
    }
    #mx_purchase .state .pass p,#mx_purchase .state .failed p,#mx_purchase .state .passing p,#mx_purchase .state .expire p{
        margin-bottom: 0;
    }
</style>
<style>
    #mx_purchase .ant-table-placeholder{
        padding:240px 16px;
    }
    #mx_purchase .ant-table-title{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    #mx_purchase .ant-table-title p{
        margin-bottom: 0;
    }
</style>