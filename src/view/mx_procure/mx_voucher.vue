<template>
    <div id="mx_voucher">
        <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="生成凭证" key="1">
                <div v-if="vShow">
                    <a-form :form="form">
                        <div class="mx_lBox">
                            <p style="width: 80px;">结算食堂:</p>
                            <a-form-item class="longT">
                                <a-checkbox-group v-decorator="[
                                                'etStem',
                                                {
                                                    rules: [
                                                        { required: true, message: '请选择结算食堂'}
                                                    ]
                                                }
                        ]">
                                    <a-row >
                                        <a-col :span="6"><a-checkbox value="A">幼儿园</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="B">小学</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="C">初中</a-checkbox></a-col>
                                        <a-col :span="6"><a-checkbox value="D">高中</a-checkbox></a-col>
                                    </a-row>
                                </a-checkbox-group>
                            </a-form-item>
                        </div>
                        <div class="mx_txtBox">
                            <p style="width: 80px;margin:3px 0 0 0;">供应商：</p>
                            <a-form-item >
                                <a-select v-decorator="['slNature', {rules: [{ required: true, message: '请选择办学性质' }]}]" placeholder="请选择办学性质">
                                    <a-select-option value="jack">Jack</a-select-option>
                                    <a-select-option value="lucy">Lucy</a-select-option>
                                    <a-select-option value="disabled">Disabled</a-select-option>
                                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div class="mx_txtBox">
                            <p style="width: 80px;margin:4px 0 0 0;">结算周期：</p>
                            <a-form-item style="width: 300px;">
                                <a-range-picker v-decorator="['range-picker', rangeConfig]" />
                            </a-form-item>
                            <a-button class="mx_smBtn" type="primary" @click="check">生成</a-button>
                        </div>

                    </a-form>
                    <div class="b">
                        <span style="width: 100%;height: 10px;background: #f6f6f6;display: block;"></span>
                        <div class="cnt">
                            <div class="t">
                                <div style="display: flex;margin-top: 30px;">
                                    <img style="width: 85px;height: 85px;margin-left: 20px;" :src="titleList.url" alt="">
                                    <div style="display: flex;flex-direction: column;justify-content: center;margin-left: 25px;">
                                        <p style="margin-bottom: 10px;">{{titleList.name}}</p>
                                        <p style="color:#ccc;margin-bottom: 0;">上次结算：{{titleList.time}}</p>
                                    </div>
                                </div>
                                <div style="display: flex;margin-top: 40px;margin-left: 20px;">
                                    <p style="font-weight: bold;color:#000;margin-right: 30px;">采购订单  <span>{{titleList.sp}}</span>单，退货订单  <span>{{titleList.rd}}</span>单</p>
                                    <p style="color:#ccc;">按订单完成时间计算</p>
                                </div>
                            </div>
                            <div class="b" v-if="titleList.time != '--'">
                                <!--订单盒子-->
                                <div class="spBox">
                                    <div class="top">
                                        <div>
                                            <div class="txt">
                                                <p @click="rtZ('1')" style="margin-left: 20px;margin-right: 10px;font-weight: bold;color:#000;cursor: pointer;">采购订单（<span>25件商品</span>）</p>
                                                <a-icon :class="{on:spUP == true}" type="up" style="margin-right: 10px;transition: .3s;cursor: pointer;"/>
                                                <p style="color:#ccc;">该周期包含15个已结算采购订单，已过滤</p>
                                            </div>
                                        </div>
                                        <div class="box" v-if="spUP" v-for="(item,index) in spuList">
                                            <div class="t">
                                                <a-row style="width: 100%;color:#000;" >
                                                    <a-col :span="20" style="display: flex;margin-top: 15px;">
                                                        <p style="margin-left: 40px;">{{item.fRoom}}</p>
                                                        <p style="margin-left: 45px;">订单号：{{item.code}}</p>
                                                        <p style="margin-left: 40px;">{{item.time}}</p>
                                                        <p style="margin-left: 50px;margin-right: 40px;">{{item.sName}}</p>
                                                        <p style="margin-right: 40px;">采购人：{{item.pName}}</p>
                                                    </a-col>
                                                    <a-col :span="4" style="margin-top: 15px;display: flex;justify-content: flex-end;">
                                                        <p style="margin-right: 30px;text-align: right">{{item.state}}</p>
                                                    </a-col>
                                                </a-row>
                                            </div>
                                            <div class="c">
                                                <div class="bgChange" @click="toDst()" v-for="(item2,index2) in item.list" style="width: 100%;border-top:1px solid transparent;">
                                                    <a-row style="width: 100%; display: flex; align-items: center;margin-top: 20px;">
                                                        <a-col :span="10">
                                                            <div class="l" style="display: flex;align-items: center">
                                                                <img style="width: 90px;height: 90px;margin: 0 35px;" :src="item2.url" alt="">
                                                                <p style="margin-bottom: 0;margin-right: 44px;max-width:180px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item2.name}}</p>
                                                                <p style="margin-bottom: 0;"><span style="font-weight: bold;color:#000;">{{item2.unit}}</span>/斤</p>
                                                            </div>
                                                        </a-col>
                                                        <a-col :span="14" style="text-align: right;" >
                                                            <div class="r" style="margin: 10px 0;" v-for="item3 in item2.list">
                                                                <div style="width: 100%;display: flex;align-items: center;justify-content: flex-end">
                                                                    <p style="margin-bottom: 0;margin-right: 50px;">{{item3.time}}</p>
                                                                    <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;">{{item3.unit}}</p>
                                                                    <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;font-weight: bold;color:#000;">{{item3.moeny}}</p>
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
                                                <p style="text-align: right;margin-right: 30px;">共计：<span style="color:#ff6600;font-weight: bold;">{{item.aMoeny}}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--退货盒子-->
                                <div class="rdBox" style="margin-top: 25px;">
                                    <div>
                                        <div class="txt">
                                            <p @click="rtZ('2')" style="margin-left: 20px;margin-right: 10px;font-weight: bold;color:#000;cursor: pointer;">退货订单（<span>25件商品</span>）</p>
                                            <a-icon :class="{on:rdUP == true}" type="up" style="margin-right: 10px;transition: .3s;cursor: pointer;"/>
                                            <p style="color:#ccc;">该周期包含15个已结算采购订单，已过滤</p>
                                        </div>
                                    </div>
                                    <div class="box" v-if="rdUP" v-for="(item,index) in rduList">
                                        <div class="t">
                                            <a-row style="width: 100%;color:#000;" >
                                                <a-col :span="20" style="display: flex;margin-top: 15px;">
                                                    <p style="margin-left: 40px;">{{item.fRoom}}</p>
                                                    <p style="margin-left: 45px;">订单号：{{item.code}}</p>
                                                    <p style="margin-left: 40px;">{{item.time}}</p>
                                                    <p style="margin-left: 50px;margin-right: 40px;">{{item.sName}}</p>
                                                    <p style="margin-right: 40px;">采购人：{{item.pName}}</p>
                                                </a-col>
                                                <a-col :span="4" style="margin-top: 15px;display: flex;justify-content: flex-end;">
                                                    <p style="margin-right: 30px;text-align: right">{{item.state}}</p>
                                                </a-col>
                                            </a-row>
                                        </div>
                                        <div class="c">
                                            <div class="bgChange" @click="toDst()" v-for="(item2,index2) in item.list" style="width: 100%;border-top:1px solid transparent;">
                                                <a-row style="width: 100%; display: flex; align-items: center;margin-top: 20px;">
                                                    <a-col :span="10">
                                                        <div class="l" style="display: flex;align-items: center">
                                                            <img style="width: 90px;height: 90px;margin: 0 35px;" :src="item2.url" alt="">
                                                            <p style="margin-bottom: 0;margin-right: 44px;max-width:180px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item2.name}}</p>
                                                            <p style="margin-bottom: 0;"><span style="font-weight: bold;color:#000;">{{item2.unit}}</span>/斤</p>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="14" style="text-align: right;" >
                                                        <div class="r" style="margin: 10px 0;" v-for="item3 in item2.list">
                                                            <div style="width: 100%;display: flex;align-items: center;justify-content: flex-end">
                                                                <p style="margin-bottom: 0;margin-right: 50px;">{{item3.time}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;">{{item3.unit}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;font-weight: bold;color:#000;">{{item3.moeny}}</p>
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
                                            <p style="text-align: right;margin-right: 30px;">共计：<span style="color:#ff6600;font-weight: bold;">{{item.aMoeny}}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <!--按钮-->
                                <div style="display: flex;align-items: center;margin-top: 240px;border:1px solid #d9d9d9;box-shadow: 0 0 10px #d9d9d9;border-radius:5px;height: 75px;justify-content: space-between;">
                                    <p style="margin-bottom: 0;margin-left: 32px;">结算周期：<span>2019-06-23  至  2019-07-24</span></p>
                                    <div style="display: flex;align-items: center;">
                                        <p style="margin-bottom: 0;margin-right: 30px;">总计：（采购订单 ￥320.00  -  退货订单 ￥30.00）</p>
                                        <p style="margin-bottom: 0;font-size: 20px;font-weight: bold;color:#000;margin-right: 35px;">￥5000.00</p>
                                        <a-button type="primary" style="margin-right: 45px;" @click="sAcnt">发起结算</a-button>
                                    </div>
                                </div>
                            </div>
                            <div v-else style="display: flex;flex-direction: column;align-items: center;">
                                <img style=" margin: 85px 0 30px 0;width: 150px;height: 150px;" src="http://img5.imgtn.bdimg.com/it/u=1051532725,4274336564&fm=26&gp=0.jpg" alt="">
                                <p>暂无可结算订单</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="display: flex;flex-direction: column;align-items: center;min-height: 600px;justify-content: center;">
                    <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 60px;"/>
                    <p style="margin-top: 15px;font-size: 24px;font-weight: bold;color:#000;">操作成功</p>
                    <p style="color:#ccc;">供应商已收到您的结算通知</p>
                    <p style="margin-top: 93px;">待供应商确认后将生成结算凭证</p>
                    <a-button type="primary" style="margin-top: 125px;" @click="backSA">返回</a-button>
                </div>
            </a-tab-pane>
            <a-tab-pane tab="全部凭证" key="2" forceRender>
                <div v-if="wrap">
                    <a-form :form="form3">
                        <div class="t">
                            <div class="tabBox">
                                <p>食堂：</p>
                                <a-select @change="plChange" v-decorator="['select']" :value="rState" style="width: 120px;margin-right: 40px;">
                                    <a-select-option v-for="(item,index) in rSList" :key="index+1">{{item}}</a-select-option>
                                </a-select>
                            </div>
                            <div class="tabBox">
                                <p>单号：</p>
                                <a-form-item style="width: 200px;margin-left: -1px;">
                                    <a-input
                                            v-decorator="[
                                                  'code',
                                                  {rules: [{ required: true, message: '请输入单号'}]}
                                            ]"
                                            placeholder="请输入单号"
                                    />
                                </a-form-item>
                                <a-button type="primary" style="margin-left: 20px;" @click="getPlist('1')">搜索</a-button>
                            </div>
                        </div>
                        <div class="b" style="display: flex;">
                            <div class="tabBox">
                                <p>状态：</p>
                                <a-select @change="plChange2" v-decorator="['select']" :value="rstate" style="width: 120px;margin-right: 40px;">
                                    <a-select-option v-for="(item,index) in rList" :key="index+1">{{item}}</a-select-option>
                                </a-select>
                            </div>
                            <div class="tabBox">
                                <p>日期：</p>
                                <a-form-item>
                                    <a-range-picker v-decorator="['range-picker',{rules: [{ required: true, message: '请选择时间'}]}]" />
                                </a-form-item>
                            </div>
                            <a-button type="primary" style="margin-left: 20px;margin-top: 20px;" @click="getPlist('2')">查询</a-button>
                            <a-button style="margin-left: 20px;margin-top: 20px;" @click="clearL">重置</a-button>
                            <div class="dLoad btn" style="display: flex;">
                                <div class="l" @click="tabClick('1')">打印</div>
                                <div class="line" style="display: block;width: 1px;height: 60%;background: #fff;"></div>
                                <div class="r" @click="tabClick('2')">导出</div>
                            </div>
                        </div>
                    </a-form>
                    <div v-if="dataSourceJ.length>0">
                        <a-table class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSourceJ" :columns="columnsJ" :pagination="pagination"  @change="handleTableChange">
                            <div slot="droom" slot-scope="droom, record">
                                <p style="width: 90px;margin-bottom: 0;padding-right: 0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{droom}}</p>
                            </div>
                            <div slot="state" slot-scope="text, record">
                                <p  style="margin: 0; color:#ff6600;" v-show="record.state == '拒绝结算'">{{record.state}}</p>
                                <p style="margin: 0;" v-show="record.state != '拒绝结算'">{{record.state}}</p>
                            </div>
                            <template slot="btn" slot-scope="text, record, index">
                                <div class="editable-row-operations">
                                    <div style="display: flex;justify-content: center">
                                        <a class="mx_updata mx_color" @click="e => dtlCk(record,index)">查看</a>
                                    </div>
                                </div>
                            </template>
                        </a-table>
                    </div>
                    <div v-else>
                        <div style="width: 100%;height: 400px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                            <img style="width: 140px;height: 140px;" src="http://img2.imgtn.bdimg.com/it/u=3257446835,3539627749&fm=26&gp=0.jpg" alt="">
                            <p style="margin-top: 30px;">暂未发起过结算</p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="back" @click="dBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div class="dTop">
                        <a-row>
                            <a-col :span="24" style="display: flex;margin-left: 15px;margin-top: 65px;border-bottom: 1px solid #d9d9d9;">
                                <p style="margin-right: 8%;">结算食堂：{{smtdData.fRoom}}</p>
                                <p style="margin-right: 12%;">凭证单号：{{smtdData.code}}</p>
                                <p v-if="smtdData.state !='拒绝结算'">当前状态：{{smtdData.state}}</p>
                                <p v-else>当前状态：<span style="color:#ff6600">{{smtdData.state}}</span></p>
                            </a-col>
                            <a-col :span="24" style="display: flex;margin-left: 15px;flex-direction: column;">
                                <div class="acT">
                                    <img style="width: 80px;height: 80px;margin-right: 30px;" :src="smtdData.hUrl" alt="">
                                    <p>{{smtdData.sName}}</p>
                                </div>
                                <div class="acC">
                                    <div class="cl">
                                        <p>结算周期：{{smtdData.cycle}}</p>
                                        <p>结算金额：{{smtdData.moeny}}</p>
                                        <p v-if="!smtdData.isNg">付款方式：{{smtdData.pay}}</p>
                                        <p v-if="!smtdData.isNg">付款备注：{{smtdData.txt}}</p>
                                        <p v-else>结算备注：{{smtdData.txt}}</p>
                                        <p>结算人：{{smtdData.pName}}</p>
                                        <p>结算时间：{{smtdData.endTime}}</p>
                                    </div>
                                    <div class="cr" v-if="!smtdData.isNg">
                                        <p>付款图片</p>
                                        <div>
                                            <img v-for="item in smtdData.pImg" style="width: 90px;height: 90px;" :src="item" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="acB">
                                    <div style="display: flex;" v-if="smtdData.state !== '正在结算'">
                                        <div class="cl" v-if="smtdData.state !== '拒绝结算'">
                                            <p>供应商确认备注：{{smtdData.spTxt}}</p>
                                            <p v-if="smtdData.isNg">退款备注：无</p>
                                            <p>供应商确认时间：{{smtdData.spTime}}</p>
                                        </div>
                                        <div class="cl" v-else>
                                            <p>供应商拒绝原因：{{smtdData.spTxt}}</p>
                                            <p>供应商拒绝时间：{{smtdData.spTime}}</p>
                                        </div>
                                        <div class="cr" v-if="smtdData.isNg">
                                            <p v-if="smtdData.state !== '拒绝结算'">退款图片</p>
                                            <div style="display: flex;" v-if="smtdData.state !== '拒绝结算'">
                                                <img v-for="item in smtdData.rImg" style="width: 90px;height: 90px;" :src="item" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <p>正在等待供应商确认...</p>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="24" style="display: flex;margin-left: 15px;flex-direction: column;">
                                
                                <span style="display: block;height: 10px;width: 100%;background: #f4f4f4;margin-bottom: 30px;"></span>
                                
                                <p style="font-weight: bold;color:#000;margin-bottom: 15px;">采购订单  <span>{{titleList2.sp}}</span>单，退货订单  <span>{{titleList2.rd}}</span>单</p>

                                <div class="top">
                                    <div>
                                        <div class="txt">
                                            <p @click="rtZ('1')" style="margin-right: 10px;font-weight: bold;color:#000;cursor: pointer;">采购订单（<span>{{titleList2.sData}}</span>件商品）</p>
                                            <a-icon :class="{on:spUP == true}" type="up" style="margin-right: 10px;transition: .3s;cursor: pointer;"/>
                                        </div>
                                    </div>
                                    <div class="box" v-if="spUP" v-for="(item,index) in spuList">
                                        <div class="t">
                                            <a-row style="width: 100%;color:#000;" >
                                                <a-col :span="20" style="display: flex;margin-top: 15px;">
                                                    <p style="margin-left: 40px;">{{item.fRoom}}</p>
                                                    <p style="margin-left: 45px;">订单号：{{item.code}}</p>
                                                    <p style="margin-left: 40px;">{{item.time}}</p>
                                                    <p style="margin-left: 50px;margin-right: 40px;">{{item.sName}}</p>
                                                    <p style="margin-right: 40px;">采购人：{{item.pName}}</p>
                                                </a-col>
                                                <a-col :span="4" style="margin-top: 15px;display: flex;justify-content: flex-end;">
                                                    <p style="margin-right: 30px;text-align: right">{{item.state}}</p>
                                                </a-col>
                                            </a-row>
                                        </div>
                                        <div class="c">
                                            <div class="bgChange" @click="toDst()" v-for="(item2,index2) in item.list" style="width: 100%;border-top:1px solid transparent;">
                                                <a-row style="width: 100%; display: flex; align-items: center;margin-top: 20px;">
                                                    <a-col :span="10">
                                                        <div class="l" style="display: flex;align-items: center">
                                                            <img style="width: 90px;height: 90px;margin: 0 35px;" :src="item2.url" alt="">
                                                            <p style="margin-bottom: 0;margin-right: 44px;max-width:180px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item2.name}}</p>
                                                            <p style="margin-bottom: 0;"><span style="font-weight: bold;color:#000;">{{item2.unit}}</span>/斤</p>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="14" style="text-align: right;" >
                                                        <div class="r" style="margin: 10px 0;" v-for="item3 in item2.list">
                                                            <div style="width: 100%;display: flex;align-items: center;justify-content: flex-end">
                                                                <p style="margin-bottom: 0;margin-right: 50px;">{{item3.time}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;">{{item3.unit}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;font-weight: bold;color:#000;">{{item3.moeny}}</p>
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
                                            <p style="text-align: right;margin-right: 30px;">共计：<span style="color:#ff6600;font-weight: bold;">{{item.aMoeny}}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div class="rdBox" style="margin-top: 25px;">
                                    <div>
                                        <div class="txt">
                                            <p @click="rtZ('2')" style="margin-right: 10px;font-weight: bold;color:#000;cursor: pointer;">退货订单（<span>25件商品</span>）</p>
                                            <a-icon :class="{on:rdUP == true}" type="up" style="margin-right: 10px;transition: .3s;cursor: pointer;"/>
                                        </div>
                                    </div>
                                    <div class="box" v-if="rdUP" v-for="(item,index) in rduList">
                                        <div class="t">
                                            <a-row style="width: 100%;color:#000;" >
                                                <a-col :span="20" style="display: flex;margin-top: 15px;">
                                                    <p style="margin-left: 40px;">{{item.fRoom}}</p>
                                                    <p style="margin-left: 45px;">订单号：{{item.code}}</p>
                                                    <p style="margin-left: 40px;">{{item.time}}</p>
                                                    <p style="margin-left: 50px;margin-right: 40px;">{{item.sName}}</p>
                                                    <p style="margin-right: 40px;">采购人：{{item.pName}}</p>
                                                </a-col>
                                                <a-col :span="4" style="margin-top: 15px;display: flex;justify-content: flex-end;">
                                                    <p style="margin-right: 30px;text-align: right">{{item.state}}</p>
                                                </a-col>
                                            </a-row>
                                        </div>
                                        <div class="c">
                                            <div class="bgChange" @click="toDst()" v-for="(item2,index2) in item.list" style="width: 100%;border-top:1px solid transparent;">
                                                <a-row style="width: 100%; display: flex; align-items: center;margin-top: 20px;">
                                                    <a-col :span="10">
                                                        <div class="l" style="display: flex;align-items: center">
                                                            <img style="width: 90px;height: 90px;margin: 0 35px;" :src="item2.url" alt="">
                                                            <p style="margin-bottom: 0;margin-right: 44px;max-width:180px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item2.name}}</p>
                                                            <p style="margin-bottom: 0;"><span style="font-weight: bold;color:#000;">{{item2.unit}}</span>/斤</p>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="14" style="text-align: right;" >
                                                        <div class="r" style="margin: 10px 0;" v-for="item3 in item2.list">
                                                            <div style="width: 100%;display: flex;align-items: center;justify-content: flex-end">
                                                                <p style="margin-bottom: 0;margin-right: 50px;">{{item3.time}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;">{{item3.unit}}</p>
                                                                <p :class="{line:item3.isLine == true}" style="margin-bottom: 0;margin-right: 45px;font-weight: bold;color:#000;">{{item3.moeny}}</p>
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
                                            <p style="text-align: right;margin-right: 30px;">共计：<span style="color:#ff6600;font-weight: bold;">{{item.aMoeny}}</span></p>
                                        </div>
                                    </div>
                                </div>


                            </a-col>

                        </a-row>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <a-modal
                :width="tWidth"
                height="480px"
                v-model="vImg"
                :title="vTitle"
        >
            <div v-if="!sTate">
                <a-form :form="form2">
                    <!--执照-->
                    <div class="mx_License">
                        <div class="mx_left" >
                            <div class="mx_txtBox" style="display: flex">
                                <p style="margin:5px 30px 0 40px">付款方式:</p>
                                <a-form-item style="margin-bottom: 0;">
                                    <a-form-item style="margin-bottom: 0;">
                                        <a-input  placeholder="填写付款方式" v-decorator="[
                                                'rNum',
                                                {
                                                  rules: [
                                                    { required: true, message: '请填写付款方式'}
                                                  ]
                                                }
											]">
                                        </a-input>
                                    </a-form-item>
                                </a-form-item>
                            </div>
                        </div>
                    </div>
                </a-form>
                <div style="display: flex;margin-top: 20px;">
                    <p style="margin-left: 40px;margin-right: 20px;">付款备注：</p>
                    <a-textarea placeholder="填写退货原因" style="width: 460px;height: 90px;resize: none;"/>
                </div>
                <div style="display: flex;margin-top: 20px;" >
                    <p style="margin-left: 40px;margin-right: 20px;">付款图片：</p>
                    <div style="display: flex;">
                        <div class="Logo">
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
            </div>
            <div v-else style="display: flex;justify-content: center;flex-direction: column;">
                <p>当金额为负数时供应商需上传退款凭证</p>
                <a-textarea placeholder="填写备注信息" style="width: 480px;height: 120px;resize: none;"/>
            </div>
            <template slot="footer">
                <a-button  @click="submit('NO')">取消</a-button>
                <a-button  type="primary" @click="submit('OK')">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: this.$form.createForm(this),//表单提交
                form2:this.$form.createForm(this),//表单提交2
                rangeConfig: {
                    rules: [{ type: 'array', required: true, message: '请选择起始日期' }],
                },
                vShow:true,//结算成功页面
                spUP:false,
                titleList:{
                    url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3333087494,3243237073&fm=26&gp=0.jpg',
                    name:'张三的猪肉',
                    time:'2019-07-25  至  2019-08-25',
                    sp:5,
                    rd:2
                },
                spuList:[{
                    fRoom:'食堂一',
                    code:'515164165',
                    time:'2019-06-26   15:23',
                    sName:'张三的猪肉',
                    pName:'王阿航',
                    state:'已完成',
                    aMoeny:'￥3000.00',
                    list:[{
                        url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572490746&di=60600feaad2b66a4f74326dd3c88810c&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                        name:'包包白',
                        unit:'￥50',
                        list:[{
                            isLine:true,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:true,
                            Istate:'退',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        }],
                        aNum:'500斤',
                        aMy:'￥3000.00'
                    },{
                        url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572490746&di=60600feaad2b66a4f74326dd3c88810c&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                        name:'包包白',
                        unit:'￥50',
                        list:[{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        }],
                        aNum:'500斤',
                        aMy:'￥3000.00'
                    }]
                },{
                    fRoom:'食堂一',
                    code:'515164165',
                    time:'2019-06-26   15:23',
                    sName:'张三的猪肉',
                    pName:'王阿航',
                    state:'已完成',
                    aMoeny:'￥3000.00',
                    list:[{
                        url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572490746&di=60600feaad2b66a4f74326dd3c88810c&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                        name:'包包白',
                        unit:'￥50',
                        list:[{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        }],
                        aNum:'500斤',
                        aMy:'￥3000.00'
                    }]
                }],
                rdUP:false,
                rduList:[{
                    fRoom:'食堂一',
                    code:'515164165',
                    time:'2019-06-26   15:23',
                    sName:'张三的猪肉',
                    pName:'王阿航',
                    state:'已完成',
                    aMoeny:'￥3000.00',
                    list:[{
                        url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572490746&di=60600feaad2b66a4f74326dd3c88810c&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F22%2F13%2F16pic_2213040_b.jpg',
                        name:'包包白 ',
                        unit:'￥50',
                        list:[{
                            isLine:true,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        },{
                            isLine:false,
                            time:'07-05   上午',
                            unit:'300斤',
                            moeny:'￥2000.00',
                            state:'已验收',
                            isIcon:false,
                            Istate:'',
                            code:'5263988'
                        }],
                        aNum:'500斤',
                        aMy:'￥3000.00'
                    }]
                }],
                vImg:false,//结算弹框
                vTitle:'结算信息',
                sTate:false,//结算状态
                headers: {
                    authorization: 'authorization-text',
                },//上传图片配置，
                tWidth:'730px',//弹出框大小
                //下拉框
                form3:this.$form.createForm(this),
                //食堂状态
                rState:'全部',
                rstate:'全部',
                rSList:['全部','食堂一','食堂二','食堂三'],
                rList:['全部','审核中','审核通过','未通过'],
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
                //权限列表
                columnsJ: [{
                    title: '结算食堂',
                    align:'center',
                    dataIndex: 'droom',
                    width:'80',
                    height:'50',
                    scopedSlots: { customRender: "droom" }
                },{
                    title: '凭证单号',
                    align:'center',
                    dataIndex: 'code',
                    width:'130',
                    height:'50'
                },{
                    title: '供应商',
                    align:'center',
                    dataIndex: 'cName',
                    width:'120',
                    height:'50'
                },{
                    title: '结算周期',
                    align:'center',
                    dataIndex: 'aTime',
                    width:'220',
                    height:'50'
                },{
                    title: '结算金额',
                    align:'center',
                    dataIndex: 'sMeony',
                    width:'140',
                    height:'50'
                },{
                    title: '结算人',
                    align:'center',
                    dataIndex: 'pName',
                    width:'130',
                    height:'50',
                },,{
                    title: '结算时间',
                    align:'center',
                    dataIndex: 'sTime',
                    width:'160',
                    height:'50',
                },,{
                    title: '当前状态',
                    align:'center',
                    dataIndex: 'state',
                    width:'110',
                    height:'50',
                    scopedSlots: { customRender: "state" }
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
                    droom:'食堂一、食堂二、食堂一',
                    code:'5125646464846441',
                    cName:'张三的猪肉',
                    aTime:'2019-07-06  至  2019-07-07',
                    sMeony:'-￥200.00',
                    pName:'王阿航',
                    sTime:'2019-07-04   15:23',
                    state:'正在结算',
                },{
                    key: '1',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cName:'张三的猪肉',
                    aTime:'2019-07-06  至  2019-07-07',
                    sMeony:'-￥200.00',
                    pName:'王阿航',
                    sTime:'2019-07-04   15:23',
                    state:'已结算',
                },{
                    key: '2',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cName:'张三的猪肉',
                    aTime:'2019-07-06  至  2019-07-07',
                    sMeony:'-￥200.00',
                    pName:'王阿航',
                    sTime:'2019-07-04   15:23',
                    state:'拒绝结算',
                },{
                    key: '3',
                    droom:'食堂一',
                    code:'5125646464846441',
                    cName:'张三的猪肉',
                    aTime:'2019-07-06  至  2019-07-07',
                    sMeony:'-￥200.00',
                    pName:'王阿航',
                    sTime:'2019-07-04   15:23',
                    state:'正在结算',
                }],
                //查看按钮
                dtlCk(val,i){
                    this.wrap = !this.wrap
                },
                //分页
                handleTableChange(pagination, filters, sorter) {
                    this.pagination.pageSize = pagination.pageSize;
                    this.pagination.current = pagination.current;
                },
                //全部凭证详情显示
                wrap:true,
                //结算详情数据
                smtdData:{
                    fRoom:'食堂1',
                    code:'65564646444',
                    state:'拒绝结算',
                    isNg:true,
                    hUrl:'http://img5.imgtn.bdimg.com/it/u=2509320791,3774848608&fm=26&gp=0.jpg',
                    sName:'张三的猪肉',
                    cycle:'2019-07-23  至  2019-08-23',
                    moeny:'￥5000.00',
                    pay:'银行转账',
                    txt:'无',
                    pName:'张主任',
                    endTime:'2019-06-25   15:23:01',
                    pImg:['http://img4.imgtn.bdimg.com/it/u=2222625952,672095406&fm=26&gp=0.jpg','http://img4.imgtn.bdimg.com/it/u=2222625952,672095406&fm=26&gp=0.jpg'],
                    spTxt:'感谢金主爸爸',
                    spTime:'2019-07-06   15:23',
                    rImg:['http://img4.imgtn.bdimg.com/it/u=2222625952,672095406&fm=26&gp=0.jpg','http://img4.imgtn.bdimg.com/it/u=2222625952,672095406&fm=26&gp=0.jpg']
                },
                //详情数据
                titleList2:{
                    sp:5,
                    rd:2,
                    sData:25,
                    eData:25
                },
            }
        },
        methods: {
            check  () {
                const validateFieldsKey = ['etStem','slNature','range-picker']
                this.form.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values);
                        if (!err) {

                        }

                    },
                );
            },
            rtZ(val){
                if(val=='1'){
                    this.spUP = !this.spUP;
                }else{
                    this.rdUP = !this.rdUP;
                }
            },
            //结算
            sAcnt(){
                if(!this.sTate){
                    this.tWidth = '730px';
                }else{
                    this.tWidth = '500px';
                }
                this.vImg = !this.vImg;
            },
            //上传图片
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
            //凭证结算提交
            submit(val){
                let that = this;
                if(val == 'OK'){
                    if(!this.sTate){
                        const validateFieldsKey = ['rNum']
                        that.form2.validateFields(validateFieldsKey,(err,values) => {
                                if (!err) {
                                    that.vImg = !this.vImg;
                                    that.vShow = !that.vShow;
                                }
                            },
                        );
                    }else{
                        this.vImg = !this.vImg;
                        that.vShow = !that.vShow;
                    }
                }else{
                    this.vImg = !this.vImg;
                }
            },
            //返回凭证
            backSA(){
               this.vShow = !this.vShow;
            },
            //搜索状态选择
            plChange(e){
                this.rState = e;
            },
            plChange2(e){
                this.rstate = e;
            },
            //清空搜索状态
            clearL(){
                this.rState = '全部';
                this.rstate = '全部';
                this.form3.resetFields();
            },
            //打印导出
            tabClick(val){
                console.log(val);
            },
            //搜索
            getPlist(val){
                if(val==1){
                    const validateFieldsKey = ['code','select']
                    this.form.validateFields(validateFieldsKey,(err,values) => {
                            console.log(values)
                            if (!err) {

                            }

                        },
                    );
                }else{
                    const validateFieldsKey = ['range-picker']
                    this.form.validateFields(validateFieldsKey,(err,values) => {
                            console.log(values);
                            if (!err) {

                            }

                        },
                    );
                }

            },
            //详情返回
            dBack(){
                this.wrap = !this.wrap;
            }
        }
    };
</script>
<style scoped>
    #mx_voucher .mx_lBox{
        display: flex;
        width: 400px;
    }
    #mx_voucher .mx_txtBox{
        display: flex;
    }
    #mx_voucher  .ant-checkbox-group{
        width: 100%;
    }
    #mx_voucher  .ant-row.ant-form-item{
        width: 200px;
        margin-left: 10px;
    }
    #mx_voucher  .ant-row.ant-form-item.longT{
        width: 300px;
        margin-left: 10px;
    }
    #mx_voucher  .mx_smBtn{
        margin-left: 35px;
    }
    #mx_voucher .b{
        width: 100%;
    }
    #mx_voucher .spBox{
        margin-top: 65px;
    }
    #mx_voucher .txt{
        display: flex;
        align-items: center;
    }
    #mx_voucher .txt p{
        margin-bottom: 0;
    }
    #mx_voucher .txt .on{
        transform:rotateZ(180deg);
    }
    #mx_voucher .box{
        margin-top: 30px;
        border:1px solid #d9d9d9;
        border-radius:5px;
        box-shadow: 0 0 10px #d9d9d9;
    }
    #mx_voucher .line{
        text-decoration:line-through;
    }
    #mx_voucher .action{
        margin-top: 40px!important;
    }
    #mx_voucher .tabBox{
        margin-top: 20px;
        display: flex;
    }
    #mx_voucher .tabBox p{
        margin-top: 5px;
        margin-bottom: 0;
    }
    #mx_voucher .btn{
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
    #mx_voucher .btn .l,#mx_voucher .btn .r{
        height: 100%;
        width: 45%;
        text-align: center;
        line-height: 2;
        cursor:pointer;
    }
    #mx_voucher .back{
        display: flex;
        align-items: center;
        width: 100px;
        cursor:pointer;
        margin-left: 15px;
    }
    #mx_voucher .back p{
        margin-bottom: 0;
    }
    #mx_voucher .acT{
        display: flex;
        align-items: center;
        margin-top: 40px;
    }
    #mx_voucher .acT p{
        margin-bottom: 0;
    }
    #mx_voucher .acC{
        display: flex;
        align-items: center;
        margin-top: 45px;
    }
    #mx_voucher .acC .cl p{
        width: 240px;
    }
    #mx_voucher .acC .cr{
        margin-left: 20%;
    }
    #mx_voucher .acC .cr img{
        margin-right: 15px;
    }
    #mx_voucher .acB{
        display: flex;
        align-items: center;
        margin-top: 45px;
    }
    #mx_voucher .acB .cl p{
        width: 240px;
    }
    #mx_voucher .acB .cr{
        margin-left: 20%;
    }
    #mx_voucher .acB .cr img{
        margin-right: 15px;
    }
</style>