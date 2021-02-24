<template>
    <div id="mx_procure">
        <a-tabs :activeKey="pKey" @change="keyChange">
            <a-tab-pane tab="按计划采购" key="1">
                <div class="wrap" v-if="!sShow">
                    <!--选择食堂-->
                    <div class="ctList" style="display: flex;margin-top: 20px;">
                        <p>食堂：</p>
                        <a-radio-group @change="rChange1" v-model="rVal1" style="width: 95%;">
                            <a-radio :value="item.id" v-for="item in ctData">{{item.title}}</a-radio>
                        </a-radio-group>
                    </div>
                    <!--操作条目-->
                    <div class="listCode">
                        <div class="l">
                            <p>单号：{{codeL.code}}</p>
                            <p>种类：{{codeL.type}}</p>
                            <p>申请时间：{{codeL.time}}</p>
                        </div>
                        <div class="r">
                            <div v-for="(item,i) in btnL" :class="{bc:i==1,bl:i==0,br:i==2,nC:num ==1}" @click="getData(i)">
                                <a-icon type="left" v-if="i<1"/>
                                {{item}}
                                <a-icon type="right" v-if="i>1"/>
                            </div>
                        </div>
                    </div>
                    <!--展示-->
                    <a-row v-if="codeL.orderList.length>0">
                        <a-col :span="24">
                            <div class="bigList">
                                <div :class="{on:item.isClick == -1}" class="smlList" v-for="(item,index) in codeL.orderList">
                                    <div class="sT">
                                        <h3 style="text-indent:20px;">{{item.index}}</h3>
                                    </div>
                                    <div class="sC">
                                        <div class="cL">
                                            <img :src="item.url" alt="">
                                            <p>{{item.name}}</p>
                                            <p>{{item.unit}}</p>
                                            <p>{{item.num}}</p>
                                        </div>
                                        <div class="cR">
                                            <div class="wrap" v-for="(item2,index2) in item.time">
                                                <p>{{item2.time}}</p>
                                                <p>{{item2.num}}</p>
                                                <div class="selBox" v-if="item2.eTimeList.length>0">
                                                    <p style="margin-right: 16px;">送达时间</p>
                                                    <a-select @change="e => plChange(e,item2)" :value="item2.eTime" style="width: 200px;">
                                                        <a-select-option v-for="(item3,index3) in item2.eTimeList" :key="index3+1">{{item3}}</a-select-option>
                                                    </a-select>
                                                </div>
                                                <div class="selBox" v-else style="color:#ff6600">
                                                    已超过使用日期，无法采购
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sB">
                                        <p style="position: relative;" v-show="item.isCK == true" @click="mChange(index4,item)" v-if="item.Merchant.length>0" v-for="(item4,index4) in item.Merchant">
                                            {{item4.supplier_title}}
                                            <span style="color:#ff6600;">
                                            {{item4.price}}</span>
                                            {{item4.unit}}
                                            <a-icon v-if="item4.shop_num > 0" type="insurance" theme="twoTone" twoToneColor="#52c41a" style="position: absolute; top: 0; left: 0;font-size: 20px;"/>
                                            <a-icon v-if="index4 == item.isClick" type="insurance" theme="twoTone" twoToneColor="#ff6600" style="position: absolute; top: 0; left: 0;"/>
                                        </p>
                                        <p v-show="item.isCK == false" style="width: 100%;height: 100%;text-align: center;line-height: 2;border:none;margin-bottom: 0;">该食材已超过使用日期，无法采购</p>
                                        <p v-if="item.Merchant.length<=0" v-show="item.isCK == true" style="width: 100%;height: 100%;text-align: center;line-height: 2;border:none;margin-bottom: 0;">当前无供应商售卖该食材</p>
                                    </div>
                                </div>
                            </div>
                            <div class="btn">
                                <p>共计：<span style="color:#ff6600;margin-right: 30px;font-size: 16px;font-weight: bold">{{codeL.moeny}}</span></p>
                                <a-button type="primary" @click="next">下一步</a-button>
                            </div>
                        </a-col>
                    </a-row>
                    <div style="width: 100%;height: 580px;display: flex;align-items: center;justify-content: center;flex-direction: column;" v-else class="nBox">
                        <a-icon type="frown" theme="twoTone" twoToneColor="#02bb72" style="font-size: 70px;margin-bottom: 30px;"/>
                        当前食堂暂无采购计划
                    </div>
                </div>
                <div class="wrap" v-else>
                    <div class="back" @click="dBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>查看详情</p>
                    </div>
                    <div class="sList" v-for="(item,index) in odList.odList">
                        <div class="wrap">
                            <h4 style="margin-left: 20px;margin-top: 15px;">{{item.name}}</h4>
                            <div v-for="(item2,index2) in item.dList" style="margin-top: 20px;">
                                <div class="iBox" >
                                    <div class="iL">
                                        <img style="width: 90px;height: 90px;margin-left: 45px;margin-right: 30px;" :src="item2.url" alt="">
                                        <p style="margin-right: 85px;">{{item2.food}}</p>
                                        <p style="font-weight: bold">{{item2.uPrice}}</p>
                                    </div>
                                    <div class="iR">
                                        <div style="display: flex;margin: 5px 0" v-for="(item3,index3) in item2.time">
                                            <p style="margin-right: 70px;">{{item3.time}}</p>
                                            <p style="margin-right: 65px;">{{item3.unit}}</p>
                                            <p style="font-weight: bold;">{{item3.meony}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="ibBox">
                                    <p style="margin-right: 36px;">总计：<span style="color:#ff6600;font-weight: bold;">{{item2.all}}</span></p>
                                    <p>总价：<span style="color:#ff6600;font-weight: bold;">{{item2.aMeony}}</span></p>
                                </div>
                                <span class="line"></span>
                            </div>
                        </div>
                        <div class="txt">
                            <p style="margin-left: 25px;margin-right: 70px;">共计：<span style="color:#ff6600">{{item.allMy}}</span></p>
                        </div>
                    </div>
                    <div class="bBtn">
                        <p style="margin-right: 30px;"><span style="color:#ff6600;font-weight: bold;">{{odList.num}}</span>件商品</p>
                        <p style="display: flex;align-items: center;margin-right: 45px;">共计：<span style="color:#ff6600;font-weight: bold;font-size: 20px;">{{odList.aMy}}</span></p>
                        <a-button type="primary" @click="upOdr">提交订单</a-button>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane tab="自选采购" key="2" forceRender>
                <!--搜索-->
                <div v-if="gtShow">
                    <!--选择食堂-->
                    <div class="ctList" style="display: flex;margin-top: 20px;">
                        <p>食堂：</p>
                        <a-radio-group @change="rChange2" v-model="rVal2" style="width: 94%;">
                            <a-radio :value="item.id" v-for="item in ctData">{{item.title}}</a-radio>
                        </a-radio-group>
                    </div>
                    <!--商品列表-->
                    <div class="gdList">
                        <div v-for="(item, index) in gDList" style="display: flex;" @click="gtSp(spNum,item.id)">
                            <img style="width: 20px;height: 20px;" :src="item.icon" alt="">
                            <p>{{item.name}} </p>
                        </div>
                    </div>
                    <!--搜索-->
                    <a-form :form="form">
                        <div class="tabBox">
                            <p>商品：</p>
                            <a-form-item style="width: 200px;">
                                <a-input
                                        v-decorator="[
                                                  'code',
                                                  {rules: [{ required: true, message: '商品/食材名称'}]}
                                            ]"
                                        placeholder="请输入商品/食材名称"
                                />
                            </a-form-item>
                            <a-button type="primary" style="margin-left: 20px;" @click="getPlist()">搜索</a-button>
                        </div>
                    </a-form>
                    <!--类型-->
                    <!--TODO:类型一-->
                    <div class="type">
                        <p style="cursor: pointer;" @click="getSp(tpList,index,item.id)" :class="{on:tpList.val == index}" v-for="(item,index) in tpList.list">{{item.title}}</p>
                    </div>
                    <!--搜索无结果-->
                    <div class="none"  v-if="cmCode.length<=0">
                        <img style="width: 160px;height: 160px;" src="@/assets/login/logo.png" alt="">
                        <p>{{tips}}</p>
                    </div>
                    <!--搜索商户列表-->
                    <div class="mCList">
                        <div style="margin-bottom: 20px;" @click="lookDt(index,item)" class="mcBox" v-for="(item,index) in cmCode">
                            <div class="mcT">
                                <img :src="item.url" alt="">
                            </div>
                            <div class="mcB" style="display: flex;flex-direction: column;justify-content: space-around;">
                                <p style="margin-bottom: 0;text-indent:10px;"><span style="color:#ff6600;font-size: 16px;">{{item.moeny}}</span>{{item.unit}}</p>
                                <div class="txt" style="display: flex;">
                                    <p style="margin-bottom: 0;text-indent:10px;">{{item.fName}}</p>
                                    <p style="margin-left: 5px;margin-bottom: 0;text-indent:10px;width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;/">{{item.txt}}</p>
                                </div>
                                <p style="margin-bottom: 0;text-indent:10px;">{{item.sName}}</p>
                            </div>
                        </div>
                        <div style="width: 100%;">
                            <a-pagination style="float:right;" :defaultPageSize="15" :total="mTotal" />
                        </div>
                    </div>
                </div>
                <!--详情-->
                <div v-if="!dtShow">
                    <div class="back" @click="sdBack()">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>商品详情</p>
                    </div>
                    <div class="sdBox" style="margin-top: 40px;">
                        <div class="sdT">
                            <div class="Top" style="display: flex;">
                                <div class="Tl">
                                    <img style="width: 240px;height: 240px;" v-if="dtData.pic != ''" :src="dtData.pic" alt="">
                                    <img style="width: 240px;height: 240px;" v-else src="@/assets/login/logo.png" alt="">
                                </div>
                                <div class="Tr" style="width:70%;margin-left: 65px;">
                                    <div class="trT" style="width: 100%;">
                                        <div>
                                            <div class="top" style="display: flex;flex-direction: column;width: 100%;">
                                                <div class="Tt" style="display: flex;align-items: center;justify-content: space-between;">
                                                    <h2 style="margin-bottom: 0;color:#000;">{{dtData.dTxt}}</h2>
                                                    <p style="margin-bottom: 0;">{{dtData.name}}</p>
                                                </div>
                                                <div class="Tb" style="margin-top: 5px;display: flex;align-items: center;height: 60px;background: #f8f8f8;">
                                                    <p style="margin-bottom: 0;margin-left: 30px;">商品售价</p>
                                                    <p style="margin-bottom: 0;margin-left: 30px;"><span style="color:#ff6600;font-size: 20px;">{{dtData.moeny}}</span>/斤</p>
                                                </div>
                                            </div>
                                            <div class="btm" style="display: flex;margin-top: 12px;">
                                                <p style="margin-bottom: 0;margin-left: 30px;height: 30px;line-height: 30px;margin-right: 30px;">送达信息</p>

                                                <div style="display: flex;flex-wrap: wrap;width: 320px;justify-content: center;" v-if="hackReset">
                                                    <div :class="{ml:index>0}" v-for="(item,index) in tnData" style="width: 380px;margin-bottom: 20px;display: flex;align-items: center;">
                                                        <div class="wrap" style="display: flex;flex-direction: column;">
                                                            <div style="display: flex;">
                                                                <a-select
                                                                        style="margin-right: 20px;width: 180px;"
                                                                        @change="e => sChange(e, item,index)"
                                                                        placeholder="选择送达时间"
                                                                        :value="tnData[index].key"
                                                                        :defaultValue="tnData[index].key"
                                                                >
                                                                    <a-select-option :key="item2.key" v-for="item2 in item.opList">
                                                                        {{item2.val}}
                                                                    </a-select-option>
                                                                </a-select>
                                                                <a-input
                                                                        :value="item.num"
                                                                        style="width: 120px;"
                                                                        addonAfter="斤"
                                                                        placeholder="填写数量"
                                                                        @change="e => iChange(e, item,index)"
                                                                >
                                                                </a-input>
                                                            </div>
                                                            <p v-if="item.iState" style="color:red;margin-bottom: 0;">请填写完整信息</p>
                                                        </div>
                                                        <a-icon :class="item.iState?'mt5':''" v-if="index>0" type="close" style="font-size: 24px;cursor: pointer;margin-left: 10px;" @click="remove(index,tnData)"/>
                                                    </div>
                                                    <a-button size="small" style="margin: 30px auto;" @click="addDT(dtData.tnData)">
                                                        <a-icon type="plus" />添加新批次
                                                    </a-button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="Btm" style="display: flex;justify-content: center;">
                                <a-button style="margin-right: 30px;" @click="notNull('buy')">立即购买</a-button>
                                <a-button type="primary" @click="notNull('join')">加入购物车</a-button>
                            </div>
                        </div>
                    </div>
                    <div class="imgBox" style="margin-top: 40px;display: flex;">
                        <div class="IL" style="display: flex;flex-direction: column;align-items: center;width: 180px;height: 235px;border:1px solid #d9d9d9">
                            <h3 style="width: 100%;text-indent:10px;color:#000;">{{dtData.name}}</h3>
                            <img v-if="dtData.logo != ''" style="width: 95px;height: 95px;" :src="dtData.logo" alt="">
                            <img style="width: 90px;height: 90px;" v-else src="@/assets/login/logo.png" alt="">
                            <div style="position: relative;margin-top: 15px;margin-bottom: 20px;">
                                <a-rate :value="dtData.stNum" allowHalf />
                                <div style="width: 140px;height: 100%;position: absolute;top: 0;left: 0;"></div>
                            </div>
                            <a-button type="primary" size="small" @click="gtSp(spNum,dtData.id)">进入店铺</a-button>
                        </div>
                        <div class="IR" style="width: 80%;margin-left: 20px;">
                            <div class="title" style="height: 40px;background: #f8f8f8;display: flex;align-items: center">
                                <p style="margin-bottom: 0;margin-left: 30px;">商品介绍</p>
                            </div>
                            <div class="TD" style="display: flex;margin-left: 30px;margin-top: 20px;">
                                <div class="tdL" style="width: 33%;">
                                    <p>品牌名称：{{dtData.pName}}</p>
                                    <p>生产厂家：{{dtData.produce}}</p>
                                    <p>产地：{{dtData.ads}}</p>
                                </div>
                                <div class="tdC" style="width: 33%;">
                                    <p>生产日期：{{dtData.sTime}}</p>
                                    <p>保质期：{{dtData.day}}</p>
                                    <p>贮存方式：{{dtData.dep}}</p>
                                </div>
                                <div class="tdR" style="width: 33%;">
                                    <p>包装方式：{{dtData.pack}}</p>
                                    <p>净含量：{{dtData.nCnt}}</p>
                                </div>
                            </div>
                            <div class="iBox" style="margin-top: 60px;">
                                <img v-for="item in dtData.imgList" style="width: 100%;height: 480px;" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <!--成功-->
                <div v-if="scShow">
                    <div style="height: 125px;background: #f9f9f9;display: flex;align-items: center;">
                        <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 60px;margin:0px 25px 0 50px;"/>
                        <p style="margin-bottom: 0;color:#000;font-size: 22px;">加入“{{ctData[rvIndex].title}}”购物车成功</p>
                    </div>
                    <div style="display: flex; align-items: center;margin-top: 20px;">
                        <div class="scL">
                            <img style="width: 75px;height: 75px;margin-left: 50px;margin-right: 35px;" src="http://img5.imgtn.bdimg.com/it/u=3029025827,2440807936&fm=26&gp=0.jpg" alt="">
                        </div>
                        <div class="scR">
                            <p style="color:#000;font-size: 16px;margin-bottom: 10px;">{{cartMy.txt}}</p>
                            <div class="scrB" style="display: flex;align-items: center">
                                <p style="margin-bottom: 0;color:#ccc;margin-right: 25px;">数量：{{cartMy.num}}斤</p>
                                <p style="margin-bottom: 0;color:#ccc;">总价：￥{{cartMy.My * cartMy.num}}</p>
                            </div>
                        </div>
                    </div>
                    <span style="width: 95%;height: 2px;background: #f8f8f8;display: block;margin:25px auto 0"></span>
                    <div style="margin-top: 90px;">
                        <a-button style="margin-left: 50px;margin-right: 15px;" @click="ctue('c')">继续选购</a-button>
                        <a-button type="primary" @click="ctue('s')">
                            去购物车结算
                            <a-icon type="right"></a-icon>
                        </a-button>
                    </div>
                </div>
                <!--店铺-->
                <div v-if="pdShow">
                    <div class="back" @click="pdBack(spNum)">
                        <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                        <p>店铺详情</p>
                    </div>
                    <div style="display: flex;margin-top: 35px;">
                        <div class="img" >
                            <img style="width: 90px;height: 90px;" :src="this.spData.url" alt="">
                        </div>
                        <div class="rote" style="display: flex;flex-direction: column;justify-content: center;margin-left: 30px;">
                            <div class="reT" style="display: flex;">
                                <p style="margin-bottom: 10px;">{{this.spData.title}}</p>
                                <img style="width: 15px;height: 15px;" :src="this.spData.icon" alt="">
                            </div>
                            <p style="margin-bottom: 0;">经营类目：{{this.spData.style}}</p>
                            <div style="position: relative;">
                                <a-rate :value="dtData.stNum" allowHalf />
                                <div style="width: 140px;height: 100%;position: absolute;top: 0;left: 0;"></div>
                            </div>
                        </div>
                    </div>
                    <!--搜索-->
                    <a-form :form="form">
                        <div class="tabBox">
                            <p>商品：</p>
                            <a-form-item style="width: 200px;">
                                <a-input
                                        v-decorator="[
                                                  'code1',
                                                  {rules: [{ required: true, message: '商品/食材名称'}]}
                                            ]"
                                        placeholder="请输入商品/食材名称"
                                />
                            </a-form-item>
                            <a-button type="primary" style="margin-left: 20px;" @click="getPlist2()">搜索</a-button>
                        </div>
                    </a-form>
                    <!--类型-->
                    <!--TODO:类型二-->
                    <div class="type">
                        <p style="cursor:pointer;" @click="getSp(tpList,index,item.id)" :class="{on:tpList.val == index}" v-for="(item,index) in tpList.list">{{item.title}}</p>
                    </div>
                    <!--搜索无结果-->
                    <div class="none"  v-if="cmCode.length<=0">
                        <img style="width: 160px;height: 160px;" src="@/assets/login/logo.png" alt="">
                        <p>{{tips}}</p>
                    </div>
                    <!--搜索商户列表-->
                    <div class="mCList">
                        <div @click="lookDt(index)" class="mcBox" v-for="(item,index) in cmCode">
                            <div class="mcT">
                                <img :src="item.url" alt="">
                            </div>
                            <div class="mcB" style="display: flex;flex-direction: column;justify-content: space-around;">
                                <p style="margin-bottom: 0;text-indent:10px;"><span style="color:#ff6600;font-size: 16px;">{{item.moeny}}</span>{{item.unit}}</p>
                                <div class="txt" style="display: flex;">
                                    <p style="margin-bottom: 0;text-indent:10px;">{{item.fName}}</p>
                                    <p style="margin-left: 5px;margin-bottom: 0;text-indent:10px;width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;/">{{item.txt}}</p>
                                </div>
                                <p style="margin-bottom: 0;text-indent:10px;">{{item.sName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane tab="购物车" key="3" forceRender>
                <div v-if="sCart">
                    <!--选择食堂-->
                    <div class="ctList" style="display: flex;margin-top: 20px;margin-left: 15px;">
                        <p>食堂：</p>
                        <a-radio-group @change="rChange3" v-model="rVal3" style="width: 95%;">
                            <a-radio :value="item.id" v-for="item in ctData">{{item.title}}</a-radio>
                        </a-radio-group>
                    </div>
                    <!--操作栏-->
                    <div v-if="spcData.length >0">
                        <div class="ckTop" style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                            <a-checkbox @change="ckChange" :checked="isCk" style="margin-left: 15px;">全部商品</a-checkbox>
                            <a-button type="primary" @click="removeAll">移除选中</a-button>

                        </div>
                        <div v-if="item.sList.length>0" style="border:1px solid #d9d9d9;border-radius:5px;margin-top: 30px;" v-for="(item,index) in spcData">
                            <div class="up" style="margin-top: 20px;">
                                <a-checkbox @change="e => ckchange1(e, item.isCk,item)" :checked="item.isCk" style="margin-left: 15px;">{{item.name}}</a-checkbox>
                            </div>
                            <div v-for="(item2,index2) in item.sList" class="cnt" style="display: flex;align-items: center;margin-top: 45px;justify-content: center;margin-bottom: 20px;flex-direction: column;">
                                <a-row style="width: 100%;display: flex;align-items: center;margin-bottom: 30px;">
                                    <a-col :span="2">
                                        <a-checkbox @change="e => ckchange2(e, item2,item)" :checked="item2.isCk" style="margin-left: 15px;"></a-checkbox>
                                    </a-col>
                                    <a-col :span="3">
                                        <img style="width: 90px;height: 90px;" :src="item2.url" alt="">
                                    </a-col>
                                    <a-col :span="4">
                                        <p style="margin-bottom: 0;">{{item2.txt}}</p>
                                    </a-col>
                                    <a-col :span="3">
                                        <p style="margin-bottom: 0;">￥{{item2.moeny}}/{{item2.unit}}</p>
                                    </a-col>
                                    <a-col :span="10">
                                        <div>
                                            <div v-for="(item3,index3) in item2.tData" class="ctList" style="width: 430px;display: flex;margin-bottom: 15px;">
                                                <a-select :value="item3.key" style="width: 160px;" @change="e => sIchange(e,item3,item2.id,item2)">
                                                    <a-select-option :key="item4.key" v-for="item4 in item3.tList">
                                                        {{item4.val}}
                                                    </a-select-option>
                                                </a-select>
                                                <a-input :class="{rCol:item3.num == -1}" @change="e => addW(e, item2.tData[index3],item,item2.moeny,item2)" addonAfter="斤" :value="item3.num" style="width: 120px;margin-left: 30px;"></a-input>
                                                <p style="margin-bottom: 0;line-height: 32px;margin-left: 20px;font-weight: bold">￥{{item3.My}}</p>
                                                <a-icon @click="removeW(item2.tData,index3,item2)" v-if="index3>=1" type="close" style="font-size: 24px;margin-left: 5px;margin-top: 3px;cursor: pointer;"/>
                                            </div>
                                            <a-button  type="primary" size="small" @click="addNew(item2.tData)"><a-icon type="plus" />添加新批次</a-button>
                                            <div  class="btm" style="display: flex;align-items: center;justify-content: flex-end;width: 355px;">
                                                <p style="margin-right: 32px;margin-bottom: 0;">总计：<span style="color:#ff6600;font-weight: bold">{{item2.allS}}</span></p>
                                                <p style="margin-bottom: 0;">总价：<span style="color:#ff6600;font-weight: bold">￥{{item2.allM}}</span></p>
                                            </div>
                                        </div>
                                    </a-col>
                                    <a-col :span="2">
                                        <p style="margin-bottom: 0;color:#02bb72;cursor: pointer" @click="removeL(index2,index,item2)">移除</p>
                                    </a-col>
                                </a-row>
                                <span style="width: 96%;height: 1px;background: #d9d9d9;"></span>
                            </div>
                        </div>
                        <div class="ckTop" style="width: 100%;display: flex;align-items: center;justify-content: space-between;margin: 20px 0">
                            <a-checkbox @change="ckChange" style="margin-left: 15px;">全部商品</a-checkbox>
                            <p style="margin-bottom: 0;cursor:pointer" @click="removeAll">移除选中</p>
                            <p style="margin-bottom: 0;">已选择<span>{{munMy.num}}</span>件商品</p>
                            <p style="margin-bottom: 0;">总价：<span>￥{{munMy.My}}</span></p>
                            <a-button type="primary" @click="getMy">去结算</a-button>
                        </div>
                    </div>
                    <div v-else style="height: 600px;display: flex;flex-direction: column;align-items: center;justify-content: center">
                        <img style="width: 170px;height: 170px;" src="@/assets/login/logo.png" alt="">
                        <p>暂未添加商品</p>
                    </div>
                </div>
                <div v-else>
                    <div v-if="succ">
                        <div class="back" @click="scBack()">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p>查看详情</p>
                        </div>
                        <div class="sList" v-for="(item,index) in spcData" v-if="item.isSck">
                            <div class="wrap">
                                <h4 style="margin-left: 20px;margin-top: 15px;">{{item.name}}</h4>
                                <div v-for="(item2,index2) in item.sList" v-if="item2.isCk" style="margin-top: 20px;">
                                    <div class="iBox" >
                                        <div class="iL">
                                            <img style="width: 90px;height: 90px;margin-left: 45px;margin-right: 30px;" :src="item2.url" alt="">
                                            <p style="margin-right: 85px;">{{item2.txt}}</p>
                                            <p style="font-weight: bold">￥{{item2.moeny}}/{{item2.unit}}</p>
                                        </div>
                                        <div class="iR">
                                            <div style="display: flex;margin: 5px 0" v-for="(item3,index3) in item2.tData">
                                                <p style="margin-right: 70px;">{{item3.tList[item3.key-1].val}}</p>
                                                <p style="margin-right: 65px;">{{item3.num}}/{{item2.unit}}</p>
                                                <p style="font-weight: bold;">￥{{item3.My}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ibBox">
                                        <p style="margin-right: 36px;">总计：<span style="color:#ff6600;font-weight: bold;">{{item2.allS}}</span></p>
                                        <p>总价：<span style="color:#ff6600;font-weight: bold;">{{item2.allM}}</span></p>
                                    </div>
                                    <span class="line"></span>
                                </div>
                            </div>
                            <div class="txt">
                                <p style="width: 50px;margin-left: 20px;">留言：</p>
                                <a-input v-model="item.txt" placeholder="对卖家说点什么" style="width: 70%;"/>
                                <p style="margin-left: 25px;margin-right:70px;">共计：<span style="color:#ff6600">￥{{item.allMy}}</span></p>
                            </div>
                        </div>
                        <div class="bBtn">
                            <p style="margin-right: 30px;"><span style="color:#ff6600;font-weight: bold;">{{munMy.num}}</span>件商品</p>
                            <p style="display: flex;align-items: center;margin-right: 45px;">共计：<span style="color:#ff6600;font-weight: bold;font-size: 20px;">{{munMy.My}}</span></p>
                            <a-button type="primary" @click="upOdr2">提交订单</a-button>
                        </div>
                    </div>
                    <div v-else>
                        <div style="height: 125px;background: #f9f9f9;display: flex;align-items: center;">
                            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 60px;margin:0px 25px 0 50px;"/>
                            <p style="margin-bottom: 0;color:#000;font-size: 22px;">下单成功！请留意验收</p>
                        </div>
                        <div style="display: flex; align-items: center;margin-top: 20px;">
                            <div class="scL">
                                <img style="width: 75px;height: 75px;margin-left: 50px;margin-right: 35px;" src="http://img5.imgtn.bdimg.com/it/u=3029025827,2440807936&fm=26&gp=0.jpg" alt="">
                            </div>
                            <div class="scR">
                                <div class="scrB" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;color:#000;margin-right: 25px;">采购食堂</p>
                                    <p style="margin-bottom: 0;color:#000;">食堂1</p>
                                </div>
                                <div class="scrB" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;color:#000;margin-right: 25px;">下单时间</p>
                                    <p style="margin-bottom: 0;color:#000;">{{spTime}}</p>
                                </div>
                                <div class="scrB" style="display: flex;align-items: center">
                                    <p style="margin-bottom: 0;color:#000;margin-right: 25px;">实际金额</p>
                                    <p style="margin-bottom: 0;color:red;">￥{{munMy.My}}</p>
                                </div>
                            </div>
                        </div>
                        <span style="width: 95%;height: 2px;background: #f8f8f8;display: block;margin:25px auto 0"></span>
                        <div style="margin-top: 90px;">
                            <a-button style="margin-left: 50px;margin-right: 15px;" @click="look">查看我的订单</a-button>
                            <a-button type="primary" @click="shping">
                                继续选购
                            </a-button>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <a-back-top :visibilityHeight="200"/>
        <a-modal
                v-model="visible"
                :title="Title"
        >
            <div style="height: 150px; display: flex;align-items: center;justify-content: center;">
                <p v-html="refuse" style="margin-bottom: 0;text-align: center;"/>
            </div>
            <template slot="footer" v-if="!sShow">
                <a-button  @click="boxBack('NO')">取消</a-button>
                <a-button  type="primary" @click="boxBack('OK')">确认</a-button>
            </template>
            <template slot="footer" v-else>
                <a-button  @click="upBack('NO')">取消</a-button>
                <a-button  type="primary" @click="upBack('OK')">确认</a-button>
            </template>
        </a-modal>
        <a-modal
                v-model="visible2"
                :title="Title2"
        >
            <div style="height: 150px; display: flex;align-items: center;justify-content: center;">
                <p v-html="refuse2" style="margin-bottom: 0;text-align: center;"/>
            </div>
            <template slot="footer" v-if="remB">
                <a-button  @click="remBack('All')">取消</a-button>
                <a-button  type="primary" @click="remOK('All')">确认</a-button>
            </template>
            <template slot="footer" v-else>
                <a-button  @click="remBack('one')">取消</a-button>
                <a-button  type="primary" @click="remOK('one')">确认</a-button>
            </template>
        </a-modal>
        <a-modal
                v-model="visible3"
                :title="Title3"
        >
            <div style="height: 150px; display: flex;align-items: center;justify-content: center;">
                <p v-html="refuse3" style="margin-bottom: 0;text-align: center;"/>
            </div>
            <template slot="footer">
                <a-button  @click="odBack('NO')">取消</a-button>
                <a-button  type="primary" @click="odBack('OK')">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                isCk:false,
                //页面key
                pKey:'1',
                /**按计划采购*/
                //食堂选择
                rVal1:1,
                rVal2:1,
                rVal3:1,
                ctData:[],
                //单号详情
                codeL:{
                    code:'5125646464846441',
                    type:13,
                    time:'2019-07-04   15:23',
                    orderList:[],
                    moeny:'￥5000',
                },
                //有数据
                xx:[{
                    index:1,
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569436524235&di=b23fd3a775194edc22feb97f830a30a9&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2017%2F10%2F25%2FFmbTIIj0tXV76FObWUw54Zpj4sbG.jpg%2521730x0.jpg',
                    name:'包包白',
                    unit:'斤',
                    num:500,
                    time:[{
                        time:'07-02   星期一',
                        num:'200斤',
                        eTime:'全部',
                        eTimeList:['全部','食堂一','食堂二','食堂三']
                    }],
                    Merchant:[{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:true,
                    },{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:false,
                    },{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:false,
                    },{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:false,
                    },{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:false,
                    }],
                    isClick:-2,
                },{
                    index:2,
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569436524235&di=b23fd3a775194edc22feb97f830a30a9&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2017%2F10%2F25%2FFmbTIIj0tXV76FObWUw54Zpj4sbG.jpg%2521730x0.jpg',
                    name:'包包白',
                    unit:'斤',
                    num:500,
                    time:[{
                        time:'07-02   星期一',
                        num:'200斤',
                        eTime:'全部',
                        eTimeList:['全部','食堂一','食堂二','食堂三']
                    }],
                    Merchant:[],
                    isClick:-2,
                }, {
                    index:3,
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569436524235&di=b23fd3a775194edc22feb97f830a30a9&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2017%2F10%2F25%2FFmbTIIj0tXV76FObWUw54Zpj4sbG.jpg%2521730x0.jpg',
                    name:'包包白',
                    unit:'斤',
                    num:500,
                    time:[{
                        time:'07-02   星期一',
                        num:'200斤',
                        eTime:'全部',
                        eTimeList:['全部','食堂一','食堂二','食堂三']
                    }],
                    Merchant:[{
                        name:'赵三的猪肉',
                        money:"￥15",
                        unit:'/斤',
                        cUse:false,
                    }],
                    isClick:-2,
                }, {
                    index:4,
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569436524235&di=b23fd3a775194edc22feb97f830a30a9&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2017%2F10%2F25%2FFmbTIIj0tXV76FObWUw54Zpj4sbG.jpg%2521730x0.jpg',
                    name:'包包白',
                    unit:'斤',
                    num:500,
                    time:[{
                        time:'07-02   星期一',
                        num:'200斤',
                        eTime:'全部',
                        eTimeList:['全部','食堂一','食堂二','食堂三']
                    }],
                    Merchant:[],
                    isClick:-2,
                }],
                //条目操作按钮
                btnL:['上一条','本条','下一条'],
                //当前条数
                num:1,
                //提示框数据
                visible:false,
                Title:'',
                refuse:'',
                //确认订单页面
                sShow:false,
                //确认及留言计划表数据
                odList:{
                    num:15,
                    aMy:'￥5000.00',
                    odList:[{
                        name:'张三的猪肉',
                        dList:[],
                        allMy:'￥3000.00'
                    }],
                },
                /**自选采购*/
                //表单验证
                form:this.$form.createForm(this),
                //商品列表
                gDList:[],
                //类型列表
                tpList:{
                    val:0,
                    list:['全部','肉禽蛋类','海鲜鱼类','蔬菜素食','水果饮品','粮油干杂','其他']
                },
                //类型id
                styleID:'',
                //食材名称
                foodName:'',
                //供应商ID
                splier:'',
                //提示文案
                tips:'暂无供应商经营该类目',
                //商户卡片
                cmCode:[],
                //自选显示
                gtShow:true,
                //详情显示
                dtShow:true,
                //加入购物车成功显示
                scShow:false,
                //店铺详情
                pdShow:false,
                form2:this.$form.createForm(this),
                //详情数据
                dtData:{},
                tnData:[{
                    opList:[],
                    num:'',
                    key:1,
                    iState:false,
                    price:0
                }],
                //进入位置保存
                spNum:1,
                //强制刷新
                hackReset:true,
                /**购物车*/
                //按钮展示
                remB:true,
                //单个移除状态
                remD:false,
                //提示
                visible2:false,
                Title2:'',
                refuse2:'',
                I1:'',
                I2:'',
                visible3:false,
                Title3:'',
                refuse3:'',
                //购物车显示
                sCart:true,
                //购物数据
                spcData:[],
                //购买成功显示
                succ:true,
                //条目数
                mTotal:0,
                //保存可选择时间列表
                Itime:[],
                //暂时存储商品id
                spID:'',
                //店铺数据
                spData:{
                    url:'',
                    title:'',
                    rate:'',
                    style:''
                },
                //类别存储
                styData:[],
                //存储所有条目数据
                allData:[],
                //初始page
                page:0,
                rvIndex:0,
                //订单数量和价格
                munMy:{
                    num:0,
                    My:0
                },
                //购物车数量和价格
                cartMy:{
                    num:0,
                    My:0,
                    txt:''
                },
                //单个移除所需cg_id
                cg_id:0,
                //商品数组
                spList:'',
                spTime: moment(new Date()).format('YYYY-MM-DD h:mm:ss'),
                //当前数据
                newList:[]
            }
        },
        methods: {
            //页面状态改变
            keyChange(e){
                this.pKey = e
                if(e==3){
                    this.getChatList();
                }
            },
            /**按计划采购*/
            //选择食堂
            rChange1(i){
                let x = '';
                this.ctData.forEach((e,i)=>{
                    if(e.id == this.rVal1){
                        x = this.ctData[i].title;
                    }
                });
                this.getJList(this.rVal1);
                this.$message.success('当前选中“'+ x +'”采购计划');
            },
            rChange2(e){
                this.getList();
                this.sceahData();
            },
            rChange3(e){
                this.getChatList();
            },
            //选择条目
            getData(i){
                if(i==0){
                    if(this.num == 1){
                        this.num = 1;
                        this.page = 0;
                        this.setDt(this.allData,this.page);
                        return;
                    };
                    this.num-=1;
                    this.page--;
                    this.setDt(this.allData,this.page);
                }
                if(i==1){
                    this.num = 1;
                    this.page = 0;
                    this.setDt(this.allData,this.page);
                    return;
                }
                if(i==2){
                    if(this.num<this.allData.length){
                        this.num+=1;
                        this.page++;
                        this.setDt(this.allData,this.page);
                        return;
                    }else{
                        this.$message.warning('超过最大可选条目！');
                    }
                }
            },
            //选择商户
            mChange(index,val){
                val.isClick = index;
            },
            //送达时间选择
            //搜索状态选择
            plChange(e,val){
                val.eTime = e;
            },
            //下一步
            next(){
                let x = true;
                for(let i in this.codeL.orderList){
                    if(this.codeL.orderList[i].isCK && this.codeL.orderList[i].issp){
                        if(this.codeL.orderList[i].isClick < 0){
                            x = false;
                            this.codeL.orderList[i].isClick = -1;
                            break;
                        };
                    };
                };
                if(!x){
                    this.$message.warning('请选择供应商！');
                }else{
                    this.visible = !this.visible;
                    this.Title = '采购提示';
                    this.refuse = '当前计划中有食材无供应商售卖或已超过使用日期，将不计入订单中';
                }
            },
            //提示取消/确定
            boxBack(val){
                this.visible = !this.visible;
                if(val == 'OK'){
                    this.sShow = !this.sShow;
                    this.newList.filter(v=> {
                        if(v.isCK && v.issp){
                            console.log(v);
                            let obj = {
                                url:v.url,
                                food:v.name,
                                uPrice:'￥50.00/斤',
                                time:[{
                                    time:'07-01    下午',
                                    unit:'200斤',
                                    meony:'￥2000.00'
                                }],
                                all:v.num,
                                aMeony:'￥3000.00'
                            };
                        }
                    });


                };
            },
            //提交订单
            upOdr(){
                this.visible = !this.visible
                this.Title = '提交订单'
                this.refuse = '当前所选采购计划单号5126546456464，申请时间2019-07-02   15:23提交订单后供应商将按送达时间配送，请再次确认'
            },
            upOdr2(){
                this.visible3 = !this.visible3
                this.Title3 = '提交订单'
                this.refuse3 = '提交订单后供应商将按送达时间配送，请再次确认'
            },
            //提交弹窗
            upBack(val){
                this.visible = !this.visible;
                if(val== 'OK'){
                    this.$message.success('提交成功');
                }
            },
            //返回
            dBack(){
                this.sShow = !this.sShow
            },
            /**自选采购*/
            //搜索
            getPlist(val){
                this.tips = '暂未搜索到对应食材';
                const validateFieldsKey = ['code'];
                this.form.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values)
                        if (!err) {
                            this.foodName = values.code;
                            this.sceahData();
                            this.form.resetFields();
                        };
                    },
                );
            },
            //选择类型
            getSp(val,i,id){
                this.styleID = id;
                this.sceahData();
                val.val = i;
                //无数据提示
                this.tips = '暂无供应商经营该类目'
            },
            //查看商品详情
            lookDt(val,val2){
                console.log(val2);
                this.succ = !this.succ;
                this.spNum = 2;
                this.gtShow = !this.gtShow;
                this.dtShow = !this.dtShow;
                this.tnData = [{
                    opList:this.Itime,
                    num:'',
                    key:1,
                    iState:false,
                }];
                this.cartMy.My = val2.moeny.slice(1,val2.moeny.length) * 1;
                this.cartMy.txt = val2.fName +'    '+ val2.txt;
                this.spID = val2.id;
                //获取商户信息
                let data = {
                    url:'api/school/cargo/' + val2.id,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.tnData.price = res.data.data.price;
                        this.dtData = {
                            id:res.data.data.supplier_id,
                            pic:res.data.data.img_src_one,
                            logo:res.data.data.supplier_logo,
                            dTxt:res.data.data.category_title,
                            name:res.data.data.supplier_title,
                            moeny:'￥' + res.data.data.price,
                            stNum:res.data.data.score_num,
                            pName:res.data.data.supplier_title,
                            produce:res.data.data.factory,
                            ads:res.data.data.source,
                            sTime:res.data.data.product_date_str,
                            day:res.data.data.shelf_life + '天',
                            dep:res.data.data.storage_method_str,
                            pack:res.data.data.pack_str,
                            nCnt:res.data.data.net_weight,
                            imgList:res.data.data.logo_src
                        };
                    }else{
                        console.log(1);
                    }
                });
            },
            //返回
            sdBack(){
                //this.splier = '';
                this.spNum = 1;
                this.gtShow = !this.gtShow;
                this.dtShow = !this.dtShow;
            },
            //添加
            addDT(val){
                if(this.tnData.length < 7){
                    let obj = {
                        key:1,
                        opList:this.Itime ,
                        num:'',
                        iState: false,
                        price:0
                    };
                    let x = this.tnData.length;
                    this.$set(this.tnData, x, obj);
                }else{
                    this.$message.warning('最多添加7个批次，已达上限');
                }
            },
            //加入购物车或购买
            notNull(val){
                if(val === 'join'){
                    let err = true,
                        that = this;
                    this.tnData.forEach((e,i) =>{
                        console.log(e);
                        this.cartMy.num += e.num * 1;
                        if(e.key == ''){
                            e.iState = true;
                            err = false
                        }else{
                            e.iState = false;
                            err = true
                        };
                        if(e.num == '' || e.num == 0){
                            e.iState = true;
                            err = false;
                        }else{
                            e.iState = false;
                            err = true;
                        }
                    });
                    if(err){
                        let obj = {
                            cid:this.rVal2,
                            materials:[{
                                cargo_id:this.spID,
                                detail:[]
                            }]
                        };
                        this.tnData.forEach((e,i)=>{
                            let x ,y;
                            x = new Date().getFullYear() + e.opList[e.key-1].val.substring(0,5).replace('-','');
                            y = e.opList[e.key-1].val.indexOf('上午');
                            if(y != -1){
                                y = 1
                            }else{
                                y = 2
                            }
                            let data = {
                                num: e.num,
                                usetime:x,
                                state:y,
                            };
                            obj.materials[0].detail.push(data);
                            this.$delete(obj,'opList')
                        });
                        obj.materials = JSON.stringify(obj.materials);
                        let data = {
                            url:'api/school/cart',
                            method:'post',
                            data:obj
                        };
                        that.$apiAxiox(data).then((res)=>{
                            if(res.data.code == 0){
                                this.getIndex();
                                this.dtShow = !this.dtShow;
                                this.scShow = !this.scShow;
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        });
                    }
                }else{
                    this.dtShow = !this.dtShow;
                    this.scShow = !this.scShow;
                }
            },
            //修改值
            iChange(e,val,i){
                val.iState = false;
                val.num = e.target.value
            },
            sChange(e,val,i){
                val.key = e
            },
            //继续购买或去购物车
            ctue(val){
                if(val == 'c'){
                    this.spNum = 1;
                    this.scShow = !this.scShow
                    this.gtShow = !this.gtShow
                }else{
                    this.pKey = '3';
                    this.getChatList();
                }

            },
            //搜索2
            getPlist2(val){
                this.tips = '暂未搜索到对应食材'
                const validateFieldsKey = ['code1']
                this.form.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values)
                        if (!err) {
                            this.foodName = values.code1;
                            this.sceahData();
                            this.form.resetFields();
                        }

                    },
                );
            },
            //进入店铺
            gtSp(val,id){
                console.log(id);
                this.splier = id;
                if(val == 1){
                    this.gtShow = !this.gtShow;
                    this.pdShow = !this.pdShow;
                }else{
                    this.dtShow = !this.dtShow;
                    this.pdShow = !this.pdShow;
                }
                this.getSPd(id);
                this.sceahData();
            },
            //返回
            pdBack(val){
                this.splier = '';
                if(val == 1){
                    this.gtShow = !this.gtShow;
                    this.pdShow = !this.pdShow;
                }else{
                    this.dtShow = !this.dtShow;
                    this.pdShow = !this.pdShow;
                }
                this.tpList.list = this.styData;
                this.sceahData();
            },
            //移除时间
            remove(index,val){
//                console.log(val);
//                val.splice(index,1);
                this.$delete(this.tnData,index)
//                this.tnData.splice(index,1);
                this.$forceUpdate();
                console.log(this.tnData);
            },
            /**购物车*/
            //多选
            ckchange1(e,b,val){
                console.log(val);
                val.isCk = e.target.checked
                if(e.target.checked){
                    val.sList.forEach((e,i) =>{
                        e.isCk = true;
                    })
                }else{
                    val.sList.forEach((e,i) =>{
                        e.isCk = false;
                    })
                }
                let x = [],
                    y = true;
                this.spcData.forEach((e,i) =>{
                    x.push(e.isCk);
                })
                x.forEach((e,i)=>{
                    if(e == false){
                        y = false;
                    }
                });
                if(y){
                    this.isCk = true;
                }else{
                    this.isCk = false;
                }
                this.getNumAndMy();
            },
            ckchange2(e,val,val2){
                console.log(val2);
                val.isCk = e.target.checked;
                let x = [],
                    y = true;
                val2.sList.forEach((e,i)=>{
                    x.push(e.isCk)
                })
                x.forEach((e,i)=>{
                    if(e == false){
                        y = false;
                    }
                })
                if(y){
                    val2.isCk = true;
                }else{
                    val2.isCk = false;
                    this.isCk = false;
                }
                this.getNumAndMy();
            },
            //顶部全选
            ckChange(e){
                let that = this;
                this.isCk = e.target.checked
                if(e.target.checked){
                    this.spcData.forEach((e,i) =>{
                        e.isCk = true
                        e.sList.forEach((e2,i2) =>{
                            e2.isCk = true;
                        })
                    })

                }else{
                    this.spcData.forEach((e,i) =>{
                        e.isCk = false;
                        e.sList.forEach((e2,i2) =>{
                            e2.isCk = false;
                        })
                    })
                }
                this.getNumAndMy();
            },
            //移除列表中一项
            removeL(i2,i,val){
                this.cg_id = val.id;
                this.remB = false;
                this.visible2 = true
                this.Title2 = '确认移除'
                this.refuse2 = '是否确认移除该商品？'
                this.I1 = i;
                this.I2 = i2;
            },
            //添加新批次
            addNew(val,i){
                let obj = {
                    key:1,
                    tList:this.tnData[0].opList,
                    My:0,
                    num:0,
                }
                val.push(obj);
            },
            //改变数量
            addW(e,val,item,my,val2){
                val.num = e.target.value
                val.My = (val.num * my).toFixed(2);
                item.sList.forEach((e,i)=>{
                    e.allS = 0;
                    e.allM = 0;
                    e.tData.forEach((e2,i2)=>{
                        e.allS += e2.num * 1;
                        e.allM += e2.My * 1;
                    });
                    e.allM = (e.allM).toFixed(2);
                });
                this.getNumAndMy();
                this.getGoodData(val2,val2.id);
            },
            //移除数量和时间
            removeW(val,i,item){
                val.splice(i, 1);
                item.allS = 0;
                console.log(item);
                item.allM = 0;
                item.tData.forEach((e,i)=>{
                    item.allS += e.num * 1;
                });
                item.allM += (item.moeny * item.allS);
                item.allM = item.allM.toFixed(2);
                this.getNumAndMy();
                this.getGoodData(item,item.id);
            },
            //强制刷新
            reload() {
                this.$forceUpdate()
            },
            removeAll(){
                if(this.munMy.num <= 0) {
                    this.$message.warning('未选择商品！');
                    return;
                };
                this.remB = true;
                this.visible2 = true;
                this.Title2 = '确认移除';
                this.refuse2 = '是否确认移除选中商品？'
            },
            remBack(val){
                this.visible2 = false;
            },
            remOK(val){
                let x = '';
                this.visible2 = false;
                if(val == 'All'){

                    for(let i in this.spcData){
                        for( let i2 in this.spcData[i].sList){
                            if(this.spcData[i].sList[i2].isCk){
                                x += this.spcData[i].sList[i2].id + ',';
                            };
                        }
                    }
                    x = x.substring(0,x.length-1);

                    console.log(x);

                    let data = {
                        url:'api/school/cart/' +  x,
                        method:'delete',
                        data:{
                            cid:this.rVal1
                        }
                    };
                    this.$apiAxiox(data).then((res)=>{
                        if(res.data.code == 0){
                            let long = this.spcData.length;
                            this.spcData.forEach((e,i)=>{
                                if(e.isCk == true){
                                    e.sList.splice(i,1);
                                };
                                if((i+1) == long){
                                    this.spcData.forEach((e,i)=>{
                                        e.sList.forEach((e2,i2)=>{
                                            if(e2.isCk == true){
                                                e.sList.splice(i2,1);
                                            }
                                        });
                                    })
                                }
                            });
                            this.getNumAndMy();
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    });
                }else{
                    let data = {
                        url:'api/school/cart/' +  this.cg_id,
                        method:'delete',
                        data:{
                            cid:this.rVal1
                        }
                    };
                    this.$apiAxiox(data).then((res)=>{
                        if(res.data.code == 0){
                            this.spcData[this.I1].sList.splice(this.I2,1);
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    });
                }
            },
            //结算
            getMy(){
                if(this.munMy.num <= 0) {
                    this.$message.warning('未选择商品！');
                    return;
                };
                let x = true;
                for(let i in this.spcData){
                    for( let i2 in this.spcData[i].sList){
                        if(this.spcData[i].sList[i2].isCk){
                            for(let i3 in this.spcData[i].sList[i2].tData){
                                if(this.spcData[i].sList[i2].tData[i3].num == 0 || this.spcData[i].sList[i2].tData[i3].num == ''){
                                    x = false;
                                    this.$message.warning('填写使用数量！');
                                    break;
                                };
                                if( typeof this.spcData[i].sList[i2].tData[i3].key == "undefined" || this.spcData[i].sList[i2].tData[i3].key == null || this.spcData[i].sList[i2].tData[i3].key == "" ){
                                    x = false;
                                    this.$message.warning('选择使用时间！');
                                    break;
                                }
                            }
                        };
                    }
                }
                if(x){
                    this.sCart = !this.sCart
                }
            },
            //返回
            scBack(){
                this.sCart = !this.sCart
            },
            //提交
            odBack(val){
                this.visible3 = !this.visible3
                if(val == 'OK'){
                    let data = {
                        url:'api/school/order',
                        method:'post',
                        data:{
                            cid:this.rVal3,
                            card_ids:this.spList
                        }
                    };
                    this.$apiAxiox(data).then((res)=>{
                        if(res.data.code == 0){
                            this.succ = !this.succ;
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    });



                }else{
                    console.log(2);
                }
            },
            //前往订单
            look(){
                this.$router.push({
                    path:'/mxOrder',   //跳转的路径
                });
                this.succ = !this.succ;
                this.sCart = !this.sCart;
            },
            //购物车继续选购
            shping(){
                this.succ = !this.succ;
                this.sCart = !this.sCart;
                this.pKey = '2'
                this.munMy.num = 0;
                this.munMy.My = 0;
            },
            //获取index
            getIndex(){
                this.ctData.forEach((e,i)=>{
                    if(e.id == this.rVal2){
                        this.rvIndex = i;
                    };
                });
            },
            //改变选择项
            sIchange(e,val,id,val2){
                val.key = e;
                this.getGoodData(val2,id)
            },
            //处理购物车改变的那一坨数据方法
            getGoodData(val,id){
                let obj = [{
                    cargo_id:id,
                    detail:[]
                }];
                for(let i in val.tData){
                    let x = val.tData[i].tList[val.tData[i].key-1].val.replace('-',''),
                        y = '';
                    x = new Date().getFullYear() + x;
                    if(x.substr(x.length-2,2) == '上午'){
                        y = 1;
                    }else{
                        y = 2
                    }
                    x = x.substring(0,8);

                    let obj2 = {
                        num:val.tData[i].num,
                        usetime:x,
                        state:y
                    }
                    obj[0].detail.push(obj2)
                }
                obj = JSON.stringify(obj);
                this.setCart(obj);
            },
            //获取食堂和食材类别
            getFRoom(){
                let data ={
                    url:'api/common/dictionaries',
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        if(res.data.data.canteen.length>0){
                            this.ctData = res.data.data.canteen;
                            this.rVal1 = this.ctData[0].id;
                            this.rVal2 = this.ctData[0].id;
                            this.rVal3 = this.ctData[0].id;
                            this.tpList.list = res.data.data.food;
                            let obj = {
                                id:'',
                                title:'全部'
                            };
                            this.tpList.list.unshift(obj);

                            //获取按计划采购数据
                            this.getJList(this.rVal1);

                        }else{
                            this.$message.warning('暂无食堂可供选择！');
                        }
                    }
                });
            },
            //搜索商品
            sceahData(){
                let data = {
                    url:'api/school/cargo?classify=' + this.styleID + '&title=' + this.foodName + '&supplier_id=' + this.splier,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.foodName = '';
                        this.mTotal = res.data.data.total;
                        this.cmCode = [];
                        res.data.data.data.forEach((e,i)=>{
                            let obj = {
                                id:e.id,
                                url:e.img_src_one,
                                moeny:'￥' + e.price,
                                unit:'/' + e.unit,
                                fName:e.category_title,
                                txt:e.title,
                                sName:e.supplier_title
                            }
                            this.cmCode.push(obj);
                        });
                    }
                })
            },
            //获取供应商
            getList(){
                let data = {
                    url:'api/school/supplier',
                    method:'get',
                    data:{}
                };
                this.sperList = [];
                this.gDList = [];
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
                                id:e.supplier_id,
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
                            this.gDList.push(obj);
                        });
                    }
                });
            },
            //时间判断
            jdTime(){
                let date;
                //超过
                if(new Date().getHours() > 11){
                    date = moment().add(1,'days');
                    this.getTimeList(date,true);
                }else{
                    date = moment(new Date);
                    this.getTimeList(date,false);
                }
            },
            //获取时间
            getTimeList(val,flag) {
                let t = 0;
                let list = [];
                for(let i = 1; i < 8; i++){
                    let s = t * 24 * 60 * 60 *1000;
                    t++;
                    let ss = moment(parseInt(moment(val).format("x")) + s).format('MM-DD');
                    list.push(ss);
                };
                let iT = ['上午','下午'],
                    x = 0,
                    list2 = [];
                if(flag){
                    x = 1;
                    list.forEach((e,i)=>{
                        iT.forEach((e2)=>{
                            let obj = {
                                key:x,
                                val:e + '  ' + e2
                            };
                            x++;
                            list2.push(obj);
                        });
                    });
                } else {
                    x = 0;
                    list.forEach((e,i)=>{
                        iT.forEach((e2)=>{
                            let obj = {
                                key:x,
                                val:e + '  ' + e2
                            };
                            x++;
                            list2.push(obj);
                        });
                    });
                    list2.splice(0,1);
                }
                this.Itime = list2;
                this.tnData[0].opList = list2;
            },
            //获取购物车列表
            getChatList(){
                let data = {
                    url:'api/school/cart?cid=' + this.rVal3 ,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.spcData = [];
                        res.data.data.forEach((e,i)=>{
                            let obj = {
                                index:i,
                                isCk:false,
                                name:e.title,
                                sList:[],
                                txt:'',
                                allMy:0,
                                isSck:false,
                            };
                            e.materials.forEach((e2,i2)=>{
                                let obj2 = {
                                    isCk:false,
                                    url:'',
                                    txt:e2.material_title,
                                    moeny:e2.price,
                                    tData:[],
                                    unit:e2.unit,
                                    allS:0,
                                    allM:0,
                                    id:e2.cargo_id
                                };
                                e2.detail.forEach((e3,i3)=>{
                                    obj2.allS += (e3.num * 1);
                                    let x = [],
                                        k = '';
                                    if(e3.usetime == '' || e3.usetime ==null){
                                        x = this.tnData[0].opList;
                                        k = '';
                                    }else{
                                        x = this.tnData[0].opList;
                                        k = this.getKey(e3.usetime,e3.state);
                                    }
                                    let obj3 = {
                                        key:k,
                                        tList:x,
                                        My:(e2.price * e3.num).toFixed(2),
                                        num:e3.num,
                                    };
                                    obj2.tData.push(obj3);
                                });
                                obj2.allM += (e2.price * obj2.allS);
                                obj2.allM = obj2.allM.toFixed(2);
                                obj.allMy += obj2.allM * 1;
                                obj.sList.push(obj2);
                            });
                            this.spcData.push(obj);
                        });
                        console.log(this.spcData);

                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            //获取选择时间key
            getKey(val,state){
                val = val.substring(4,6) + '-' + val.substring(6,8);
                if(state == 1){
                    val = val + '  ' + '上午'
                }else{
                    val = val + '  ' + '下午'
                };
                let key = '';
                this.tnData[0].opList.forEach((e,i)=>{
                    if(val == e.val){
                        key = i + 1;
                    }
                });
                return key;
            },
            //查看店铺详情
            getSPd(val){
                let data = {
                    url:'api/school/supplierdetail?supplier_id=' + val ,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.spData.url = res.data.data.logo_src;
                        this.spData.title = res.data.data.title;
                        this.spData.icon = res.data.data.special_mark_src;
                        this.dtData.stNum = res.data.data.scoring;
                        this.spData.style = res.data.data.busin_category_str;
                        this.tpList.list = res.data.data.busin_category_arr;
                        let obj = {
                            id:'',
                            title:'全部'
                        };
                        this.tpList.list.unshift(obj);
                        this.styData = this.tpList.list;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            //获取按计划采购数据
            getJList(val){
                let data = {
                    url:'api/school/plan/procure?cid=' + val ,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.allData = res.data.data;
                        this.setDt(res.data.data,0)
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            //处理7维数组
            setDt(val,page){
                if(val.length <= 0){
                    this.codeL.orderList = [];
                    return
                };
                this.codeL.orderList = [];
                this.newList = [];
                this.codeL.code = val[page].single_number;
                this.codeL.type = val[page].material_types;
                this.codeL.time = val[page].updated_at;
                val[page].materials.forEach((e,i)=>{
                    let obj = {
                        index:i+1,
                        url:e.cover,
                        name:e.title,
                        unit:e.unit,
                        num:e.sum_num,
                        time:[],
                        Merchant:e.supp,
                        isClick:-2,
                        isCK:true,
                        issp:false,

                    };
                    if(e.supp.length > 0){
                        obj.issp = true;
                    };
                    e.batch.forEach((e2,i2)=>{
                        let data = {
                            time:moment(e2.usetime *1000).format('MM-DD  dddd'),
                            num:e2.num,
                            eTime:'',
                            eTimeList:[],
                        };
                        if(e2.choice_items.length<=0){
                            obj.isCK = false;
                        }
                        e2.choice_items.forEach((e3,i3)=>{
                            let x = moment(e3.time * 1000).format('MM-DD'),
                                y = '上午';
                            if(e3.default == 1){
                                data.eTime = i3 + 1;
                            };
                            if(e3.afternoon == 2){
                                y = '下午';
                            };
                            x = x + '  ' + y;
                            data.eTimeList.push(x);
                        });
                        console.log(data.eTimeList);
                        obj.time.push(data);
                    });
                    this.codeL.orderList.push(obj);
                });
                this.newList = this.codeL.orderList;
            },
            //获取选择数目和总价
            getNumAndMy(){
                this.munMy.num = 0;
                this.munMy.My = 0;
                let x = '';
                for(let i in this.spcData){
                    this.spcData[i].isSck = false;
                    this.spcData[i].allMy = 0;
                    for(let item in this.spcData[i].sList){
                        if(this.spcData[i].sList[item].isCk){
                            this.munMy.My += this.spcData[i].sList[item].allM * 1;
                            this.munMy.num += 1;
                            this.spcData[i].isSck = true;
                            this.spcData[i].allMy += this.spcData[i].sList[item].allM * 1;
                            x += this.spcData[i].sList[item].id + ','
                        }
                    }
                }
                this.spList = x.slice(0,x.length-1);
                console.log(this.spList);
            },
            //修改购物车
            setCart(val){
                console.log(1111111);
                let data = {
                    url:'api/school/cart/' + this.rVal3,
                    method:'put',
                    data: {
                        materials:val
                    }
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){

                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            }
        },
        created(){
            this.jdTime();
            //食堂和类别
            this.getFRoom();
            //供应商
            this.getList();
            //食材数据
            this.sceahData();


        }
    };
</script>
<style scoped>
    #mx_procure{
        width: 96%;
        margin:0 auto;
    }
    .noClick{
        cursor:not-allowed;
        pointer-events:none;
        background: #c5c5c5;
        color:#f3f3f3;
    }
    #mx_procure .mt5{
        margin-top: -21px;
    }
    .listCode{
        margin-top: 10px;
        display: flex;
    }
    .listCode .l{
        width: 560px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #f2f2f2;
        border:1px solid #d9d9d9;
        border-radius:5px;
    }
    .listCode .l p{
        margin-bottom: 0;
    }
    .listCode .r{
        margin-left: 45px;
        display: flex;
        width: 218px;
        align-items: center;
        justify-content: space-around;
    }
    .listCode .r div{
        cursor: pointer;
    }
    .listCode .r div.bl{
       color:#02bb72;
    }
    .listCode .r div.bl.nC{
        cursor: not-allowed;
        color:#ccc;
    }
    .listCode .r div.bc{
        background: #02bb72;
        color:#fff;
        padding: 3px 10px;
        border-radius: 5px;
    }
    .listCode .r div.br{
        color:#02bb72;
    }
    .bigList{
        margin-top: 25px;
        min-height: 235px;
        display: flex;
        flex-direction: column;
    }
    .bigList .smlList{
        border:1px solid #d9d9d9;
        box-shadow: 0px 0px 10px #d9d9d9;
        border-radius:5px;
        margin:10px 0;
    }
    .bigList .smlList.on{
        border:1px solid red;
    }
    .bigList .smlList .sC{
        display: flex;
    }
    .bigList .smlList .sC .cL{
        display: flex;
        width: 382px;
        align-items: center;
        justify-content: space-around;
        margin-left: 38px;
    }
    .bigList .smlList .sC .cL p{
        margin-bottom: 0;
    }
    .bigList .smlList .sC .cL img{
        width: 90px;
        height: 90px;
    }
    .bigList .smlList .sC .cR{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 525px;
        margin-left: 120px;
    }
    .bigList .smlList .sC .cR .wrap{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin:6px 0;
    }
    .bigList .smlList .sC .cR .wrap p{
        margin-bottom: 0;
    }
    .bigList .smlList .sC .cR .wrap .selBox{
        display: flex;
        align-items: center;
    }
    .bigList .smlList .sB{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        min-height: 80px;
        width: 96%;
        border-top:2px solid #d9d9d9;
        margin:30px auto 0;
    }
    .bigList .smlList .sB p{
        border: 1px solid #d9d9d9;
        padding: 3px 10px;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .bigList .smlList .sB p.on{
        border-color:#02bb72;
    }
    .btn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .btn p{
        margin-bottom: 0;
    }
    .back{
        display: flex;
        cursor: pointer;
    }
    .back p{
        margin-bottom: 0;
    }
    .sList{
        display: flex;
        flex-direction: column;
        border:2px solid #d9d9d9;
        border-radius:5px;
        margin-top: 30px;
    }
    .sList .wrap{
        display: flex;
        flex-direction: column;
    }
    .sList .wrap .iBox{
        display: flex;
        justify-content: space-between;
    }
    .sList .wrap .iBox .iL{
        width: 396px;
    }
    #mx_procure .sList .wrap .iBox .iR{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 115px;
    }
    .sList .wrap .iBox .iL,.sList .wrap .iBox .iR{
        display: flex;
        align-items: center;;
        color:#000;
    }
    .sList .wrap .iBox .iL p,.sList .wrap .iBox .iR p{
        margin-bottom: 0;
    }
    .sList .wrap .ibBox{
        display: flex;
        justify-content: flex-end;
        margin-right: 115px;
        margin-top: 35px;
    }
    .sList .line{
        display: block;
        margin:0 auto;
        width: 94%;
        height: 4px;
        background: #F5f5f5;
    }
    .sList .txt{
        margin-top: 35px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-bottom: 30px;
    }
    .sList .txt p{
        margin-bottom: 0;
    }
    .bBtn{
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .bBtn p{
        margin-bottom: 0;
    }
    /*自选*/
    .tabBox{
        margin-top: 20px;
        display: flex;
    }
    .tabBox p{
        line-height: 30px;
    }
    .gdList{
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .gdList div{
        padding:0 10px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border:1px solid #d9d9d9;
    }
    .type{
        display: flex;
        align-items: center;

    }
    .type p{
        margin-right: 45px;
    }
    .type p.on{
        color:#000;
        font-weight: bold;
    }
    .none{
        height: 420px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .none p{
        margin-top: 35px;
        color:#000;
    }
    .mCList{
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
    }
    .mcBox{
        display: flex;
        flex-wrap: wrap;
        width: 150px;
        height: 210px;
        border:1px solid #d9d9d9;
        margin:0 10px;
        border-radius:5px;
    }
    .mcBox .mcT{
        width: 100%;
        height: 130px;
    }
    .mcBox .mcT img{
        width: 100%;
        height: 100%;
        border-radius: 5px 5px 0 0;
    }
    .mcBox .mcB{
        width: 100%;
        height: 80px;
    }
</style>
<style>
    #mx_procure .ant-back-top{
        right: 40px;
    }
    #mx_procure .ant-input-group-wrapper.rCol{
        border:1px solid red;
    }
    #mx_procure .ant-select.ant-select-enabled.rCol{
        border:1px solid red;
    }
    .ml{
        margin-left: 34px;
    }
</style>