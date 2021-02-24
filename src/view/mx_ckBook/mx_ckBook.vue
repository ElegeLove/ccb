<template>
    <div id="mx_ckBook">
        <a-skeleton :loading="pageLoad" active :paragraph="{rows: 20}">
            <a-tabs :activeKey="keyNum" @change="keyChange">
                <a-tab-pane tab="每周食谱" key="1">
                    <div class="rcps" v-show="!addCK">
                        <div class="ctnBox">
                            <p>食堂：</p>
                            <a-radio-group  v-model="ctnKey" @change="rChange(ctnKey)" style="width: 94%;">
                                <a-radio v-for="(item,index) in ctnList" :value="item.id">{{item.title}}</a-radio>
                            </a-radio-group>
                        </div>
                        <div class="wBox" style="margin-top: 20px;">
                            <p>周期：</p>
                            <p class="brd">{{week.one}} — {{week.seven}}</p>
                            <a-button class="prev" type="ghost" style="margin-left: 20px;color:#02bb72" @click="changeWk('add')"><a-icon type="left" />上一周</a-button>
                            <a-button type="primary" style="margin-left: 20px;" @click="changeWk('zero')">本周</a-button>
                            <a-button class="next" type="ghost" style="margin-left: 20px;color:#02bb72" @click="changeWk('reduce')">下一周<a-icon type="right" /></a-button>
                        </div>
                        <div class="actBox" v-show="iBtn">
                            <a-button style="margin-right: 20px;" icon="form" type="primary" @click="edit('e')">编辑食谱</a-button>
                            <a-button style="margin-right: 80px;" type="primary" @click="edit('u')">{{btnState}}</a-button>
                            <a-button style="margin-right: 20px;" @click="edit('c')">复制食谱</a-button>
                            <div class="btnBox">
                                <span>打印</span>
                                <span class="line"></span>
                                <span>导出</span>
                            </div>
                        </div>
                        <div class="actBox" v-show="!iBtn">
                            <a-button style="margin-right: 20px;" icon="form" type="primary" @click="editB('f')">取消编辑</a-button>
                            <a-button style="margin-right: 80px;" type="primary" @click="editB('p')">保存</a-button>
                            <a-button style="margin-right: 20px;" @click="editB('c')">清空</a-button>
                        </div>
                        <div class="tabBook" v-show="initial">
                            <a-table bordered :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="false">
                                <!--表头插槽-->
                                <div style="position:relative" slot="customTitle">
                                    <p style='position:absolute;margin-bottom: 0;width:30px;left:-9px;top:-17px;'>日期</p>
                                    <p style='position:absolute;width:41px;height:1px;background:#999;margin-bottom0;transform: rotateZ(-45deg);margin-left:10px;margin-top:10px;left:-7px;top:-9px;'></p>
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
                                <!--表头插槽结束-->

                                <!--内容插槽开始-->

                                <!--默认状态-->
                                <div v-for="index in 7" :slot="'ct' + (index+1)" slot-scope="text, record" style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
                                    <div v-for="(item, i) in record.name[index-1]">
                                        <p v-if="!isModify">{{item.title}}</p>
                                        <p v-else :class="{cBor:isExpire[index-1]}">{{item.title}}<span @click="reFood(record.name,i,index)" v-if="isExpire[index-1]" style="margin-left: 5px;cursor: pointer;">X</span></p>
                                    </div>
                                    <!--编辑状态-->
                                    <div v-if="isExpire[index-1]">
                                        <p v-show="isModify" v-if="record.name[index-1].length > 0" @click="addCk(record.name[index-1],index,record)" style="border:1px solid #C9C9C9;border-radius:5px;padding:0 5px;margin-top: 5px;cursor:pointer;"><a-icon type="plus" />添加菜品</p>
                                        <a-icon v-show="isModify" v-else type="plus" style="font-size: 25px;font-weight: bold;color:#999;cursor: pointer;" @click="addCk(record.name[index-1],index,record)"/>
                                    </div>
                                </div>
                                <!--内容插槽结束-->
                                <template slot="footer" slot-scope="currentPageData">
                                    <div class="tWrap" style="display: flex;justify-content: space-around">
                                        <p v-if="!isModify" style="margin-bottom: 0;">营养师：{{btmTxt.dietitian}}</p>
                                        <div v-if="isModify" style="display: flex;">
                                            <p style="margin-bottom: 0;line-height: 31px;">营养师：</p>
                                            <a-input placeholder="填写营养师姓名" class="Inp" :class="{on:col == true}" v-model="btmTxt.dietitian" @change="InpTxt"/>
                                        </div>
                                        <div v-if="isModify" style="display: flex;">
                                            <p style="margin-bottom: 0;line-height: 31px;" v-if="isModify">制谱人：</p>
                                            <a-input v-if="isModify" :disabled="isE" v-model="btmTxt.producer" class="Inp"/>
                                        </div>
                                        <div v-if="isModify" style="display: flex;">
                                            <p  style="margin-bottom: 0;line-height: 31px;" v-if="isModify">审核人：</p>
                                            <a-input v-if="isModify" :disabled="isE" v-model="btmTxt.name" class="Inp"/>
                                        </div>
                                        <p v-if="!isModify" style="margin-bottom: 0;">制谱人：{{btmTxt.producer}}</p>
                                        <p v-if="!isModify" style="margin-bottom: 0;">审核人：{{btmTxt.name}}</p>
                                    </div>
                                </template>
                                <!--内容插入结束-->
                            </a-table>
                        </div>
                    </div>
                    <div class="addCk" v-show="addCK">
                        <div class="back" @click="back()">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p v-show="sFood">查看详情</p>
                            <p v-show="!sFood">创建菜品</p>
                        </div>
                        <div class="sFood" v-show="sFood">
                            <div class="timeBox" style="display: flex;">
                                <p style="margin-right: 10px;">{{dayWeek}}</p>
                                <p style="margin-right: 10px;">{{oWeek}}</p>
                                <p v-if="fNum == 0">早餐</p>
                                <p v-if="fNum == 1">午餐</p>
                                <p v-if="fNum == 2">晚餐</p>
                                <p v-if="fNum == 3">加餐</p>
                            </div>

                            <div class="cBox">
                                <p>菜品：</p>
                                <a-input v-model="foodName" placeholder="菜品名称" style="width: 300px;margin:0 20px;"/>
                                <a-button @click="seachFood">搜索</a-button>
                            </div>
                            <div class="btn" style="display: flex;border:1px solid #999;width: 220px;border-radius: 5px; align-items: center;margin-top: 20px;">
                                <div :class="{on:btnI == 0}" class="l" style="padding: 5px 0;width: 50%;text-align: center;cursor: pointer;" @click="bClick(0)">常用菜品</div>
                                <div :class="{on:btnI == 1}" class="r" style="padding: 5px 0;width: 50%;text-align: center;cursor: pointer;" @click="bClick(1)">全部菜品</div>
                            </div>
                            <div class="wrap" style="display: flex;align-items: center;margin-top: 40px;">
                                <p style="margin: 0 0 20px 0;width: 82px;">已选：</p>
                                <div class="food" style="display: flex;flex-wrap: wrap;">
                                    <div class="f" v-for="(item,index) in foodL" style="display: flex;align-items: center;border:1px solid #ccc;min-width: 50px;margin-right: 20px;margin-bottom: 20px;border-radius: 3px;">
                                        <p style="margin: 0;padding: 2px 3px;">{{item.title}}</p>
                                        <a-icon type="close" style="margin:0 5px;" @click="reFod(index)"/>
                                    </div>
                                </div>
                            </div>
                            <ul style="display: flex; margin-top: 60px;padding-left: 0;">
                                <li class="block" :class="{on:sBtnI == index}" v-for="(item,index) in foodList" style="margin-right: 20px;list-style: none;cursor: pointer;" @click="fLiClick(index,item.id)">{{item.title}}</li>
                            </ul>
                            <div class="Img" style="display: flex;flex-direction: column;align-items: center;margin-top: 80px;" v-show="hasFod">
                                <img style="width: 180px;height: 180px;" src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1565947892&di=2fae88c09ec2947064b5b53e81f58a10&src=http://5b0988e595225.cdn.sohucs.com/images/20171218/c8b036db72f8498dbd80cc9dbd3cd5cd.jpeg" alt="">
                                <p style="margin-top: 15px;" v-show="seachS">当前无常用菜品，<span style="color:#02bb72;cursor: pointer;" @click="all">快去全部菜品选择吧</span></p>
                                <p style="margin-top: 15px;" v-show="!seachS">菜品库里没有<span style="color: #02bb72">“包包白”</span>相关的菜品，<span style="color:#02bb72;cursor: pointer;" @click="addF">请点击此处手动创建</span></p>
                            </div>
                            <div class="img" v-show="!hasFod">
                                <div class="iWrap" style="width: 100%;display: flex;flex-wrap:wrap;">
                                    <div class="fod" v-for="(item,index) in fodList" @click="lookCk(index,item.excipient,item.materials)">
                                        <div class="t">
                                            <a-icon v-if="!item.state" type="plus-circle" style="position: absolute;top: 5px;right: 5px;font-size: 25px;cursor: pointer;" @click.stop="addFood(item,index,item.state)"/>
                                            <a-icon v-else type="check-circle" style="position: absolute;top: 5px;right: 5px;font-size: 25px;cursor: pointer;" @click.stop/>
                                            <img :src="item.url" alt="">
                                        </div>
                                        <div class="b">
                                            <p>{{item.title}}</p>
                                            <p>本月已排<span style="color:#02bb72">{{item.num}}</span>次</p>
                                            <p>最近排期：{{item.time}}</p>
                                        </div>
                                    </div>
                                </div>
                                <a-pagination @change="onpChange" simple :defaultCurrent="pKey" :total="pTotal" />
                            </div>
                        </div>
                        <div class="aFood" v-show="!sFood">
                            <div class="fBox">
                                <a-form :form="form">
                                    <div class="mx_ckBook">
                                        <p calss="iMt">名称</p>
                                        <a-form-item>
                                            <a-form-item>
                                                <a-input  placeholder="填写菜品名称" v-decorator="[
                                                'fName',
                                                {
                                                  rules: [
                                                    { required: true, message: '请填写菜品名称'}
                                                  ]
                                                }
											]">
                                                </a-input>
                                            </a-form-item>
                                        </a-form-item>
                                        <div class="Logo on">
                                            <p style="width: 100%;">证件图片</p>
                                            <div class="img" :class="{on: rEShow2 == true}">
                                                <img src="" alt="">
                                            </div>
                                            <a-form-item>
                                                <a-upload
                                                        v-decorator="['upload', {
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
                                                        @change="upImg"
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
                                    <div class="mx_ckBook">
                                        <p calss="iMt">类别</p>
                                        <a-form-item >
                                            <a-select v-decorator="['fNature', {rules: [{ required: true, message: '请选择菜品类别' }]}]" placeholder="请选择菜品类别">
                                                <a-select-option value="jack">Jack</a-select-option>
                                                <a-select-option value="lucy">Lucy</a-select-option>
                                                <a-select-option value="disabled">Disabled</a-select-option>
                                                <a-select-option value="Yiminghe">yiminghe</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                    <div class="mx_ckBook">
                                        <p calss="iMt">主食材</p>
                                        <a-form-item>
                                            <a-select
                                                    v-decorator="[
                                                'sFood',
                                                {rules: [{ required: true, message: '请添加主食材', type: 'array' }]}]"
                                                    mode="multiple"
                                                    placeholder="请添加主食材"
                                            >
                                                <a-icon slot="suffixIcon" type="search" />
                                                <a-select-option value="red">
                                                    Red
                                                </a-select-option>
                                                <a-select-option value="green">
                                                    Green
                                                </a-select-option>
                                                <a-select-option value="blue">
                                                    Blue
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                    <div class="mx_ckBook">
                                        <p calss="iMt">辅食材</p>
                                        <a-form-item>
                                            <a-select
                                                    v-decorator="[
                                                'sFood2',
                                                {rules: [{ required: true, message: '请添加辅食材', type: 'array' }]}]"
                                                    mode="multiple"
                                                    placeholder="请添加辅食材"
                                            >
                                                <a-icon slot="suffixIcon" type="search" />
                                                <a-select-option value="red">
                                                    Red
                                                </a-select-option>
                                                <a-select-option value="green">
                                                    Green
                                                </a-select-option>
                                                <a-select-option value="blue">
                                                    Blue
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                    <a-button class="mx_smBtn" type="primary" @click="check">添加至食谱</a-button>
                                </a-form>
                            </div>
                        </div>
                    </div>
                    <!--切换食堂提示-->
                    <a-modal
                            v-model="visible"
                            title="切换提示"
                            onOk="handleOk"
                    >
                        <p>当前编辑食谱未保存，是否保存后再进行切换？</p>
                        <template slot="footer">
                            <a-button key="back" @click="handleCancel">取消</a-button>
                            <a-button key="submit" type="primary" @click="handleOk">
                                保存
                            </a-button>
                        </template>
                    </a-modal>
                    <a-modal
                            v-model="visible2"
                            title="菜品食材"
                    >
                        <div class="zBox">
                            <p>主食材：{{zFood}}</p>
                        </div>
                        <div class="fBox">
                            <p>辅食材：{{fFood}}</p>
                        </div>
                        <template slot="footer">
                            <a-button key="back" type="primary" @click="backC">取消</a-button>
                        </template>
                    </a-modal>
                    <a-modal
                            v-model="visible3"
                            :title="v3Title"
                            onOk="v3Clisk"
                    >
                        <a-textarea v-show="btnState == '提交审核'" placeholder="这是6月5日至6月17日的食谱，请查收~" v-model="refuse" style="height: 150px;resize: none;"/>
                        <div class="wrap" style="height: 150px;" v-show="btnState == '审核失败'">
                            <div class="sC">
                                <p>申请人：{{exData.aName}}</p>
                                <p>申请备注：{{exData.aTxt}}</p>
                            </div>
                            <div class="fail">
                                <p>审核人：{{exData.eName}}</p>
                                <p>未通过原因：{{exData.eTxt}}</p>
                            </div>
                        </div>
                        <div class="wrap" style="height: 150px;" v-show="btnState == '审核中'">
                            <div class="sC">
                                <p>申请人：{{exData.aName}}</p>
                                <p>申请备注：{{exData.aTxt}}</p>
                            </div>
                        </div>
                        <div class="wrap" style="height: 150px;" v-show="btnState == '审核通过'">
                            <div class="sC">
                                <p>申请人：{{exData.aName}}</p>
                                <p>申请备注：{{exData.aTxt}}</p>
                                <p>审核人：{{exData.eName}}</p>
                                <p>审核备注：{{exData.eTxt}}</p>
                            </div>
                        </div>
                        <template slot="footer">
                            <a-button  @click="v3back">取消</a-button>
                            <a-button  type="primary" @click="v3Clisk(btnState)">{{btnTxt}}</a-button>
                        </template>
                    </a-modal>
                    <a-modal
                            v-model="visible4"
                            title="选择周期"
                            onOk="ckTime"
                    >
                        <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                            <p style="margin-bottom: 0;">复制至：</p>
                            <a-range-picker @change="onChange" />
                        </div>
                        <template slot="footer">
                            <a-button key="back" @click="tBack">取消</a-button>
                            <a-button key="submit" type="primary" @click="ckTime">
                                确定
                            </a-button>
                        </template>
                    </a-modal>
                </a-tab-pane>
                <a-tab-pane tab="全部食谱" key="2" forceRender>
                    <div class="power" v-show="!power">
                        <a-form :form="form2">
                            <div class="t">
                                <div class="tabBox">
                                    <p>食堂：</p>
                                    <a-form-item>
                                        <a-select v-decorator="['selectF',{initialValue: rState}]" style="width: 120px;margin-right: 40px;">
                                            <a-select-option v-for="(item,index) in rSList" :key="index+1">{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="b">
                                <div class="tabBox">
                                    <p>状态：</p>
                                    <a-form-item style="width: 220px;">
                                        <a-select v-decorator="['selectS',{initialValue: rstate}]" style="width: 120px;margin-right: 40px;">
                                            <a-select-option v-for="(item,index) in rList" :key="index+1">{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </div>
                                <div class="tabBox">
                                    <p>日期：</p>
                                    <a-form-item>
                                        <a-range-picker v-decorator="['rpicker']" />
                                    </a-form-item>
                                </div>
                                <a-button type="primary" style="margin-left: 20px;" @click="getPlist">查询</a-button>
                                <a-button style="margin-left: 20px;" @click="clearL">重置</a-button>
                            </div>
                        </a-form>
                        <div class="oBox" style="display: flex;align-items: center;margin-top: 30px;">
                            <a-button type="primary" @click="newFList">
                                <a-icon type="form" />新建食谱
                            </a-button>
                            <div class="open" style="display: flex;margin-left: 30px;">
                                <p style="margin-bottom: 0;">公示到家长端：</p>
                                <a-switch :checked="oNum" @change="open" checkedChildren="开启" unCheckedChildren="关闭" defaultChecked/>
                            </div>
                        </div>
                        <a-table :loading="kTwoLoad" class="hBox" style="margin-top: 30px;" bordered :dataSource="dataSource2" :columns="columns2" :pagination="pagination"  @change="handleTableChange">
                            <div slot="state" slot-scope="text, record">
                                <p  style="margin: 0; color:#ff6600;" v-show="record.state == '待审核'">{{record.state}}</p>
                                <p style="margin: 0;" v-show="record.state != '待审核'">{{record.state}}</p>
                            </div>
                            <template slot="btn" slot-scope="text, record, index">
                                <div class="editable-row-operations">
                                    <div style="display: flex;justify-content: center" v-show="record.state != '待审核'">
                                        <a class="mx_updata mx_color" @click="kState('OK',record)">查看</a>
                                    </div>
                                    <div style="display: flex;justify-content: center" v-show="record.state == '待审核'">
                                        <a class="mx_updata mx_color" @click="kState('NO',record)">去审核</a>
                                    </div>
                                </div>
                            </template>
                        </a-table>
                    </div>
                    <div class="power" v-show="power">
                        <div class="back" @click="kback()">
                            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                            <p>食谱审核</p>
                        </div>
                        <div class="acBox" style="margin-top: 20px;" v-show="acShow">
                            <a-button type="primary" @click="rOk('OK')">
                                <a-icon type="check"/>通过
                            </a-button>
                            <a-button type="primary" style="margin-left: 30px;" @click="rOk('NO')">
                                <a-icon type="close" style="color:red"/>拒绝
                            </a-button>
                        </div>
                        <div class="acBox" style="margin-top: 20px;" v-show="!acShow">
                            <div class="t" style="display: flex; align-items: center;margin-top: 0;">
                                <p style="width: 100px;">审核状态：{{eMag.state}}</p>
                                <p style="margin-left: 30px;" v-show="eMag.state == '通过'">审核备注：{{eMag.msg}}</p>
                                <p style="margin-left: 30px;" v-show="eMag.state == '拒绝'">拒绝原因：{{eMag.msg}}</p>
                            </div>
                            <div class="b" style="display: flex; align-items: center;margin-top: 0;">
                                <p style="width: 100px;">审核人：{{eMag.name}}</p>
                                <p style="margin-left: 30px;">审核时间：{{eMag.time}}</p>
                            </div>
                        </div>
                        <a-table style="margin-top: 40px;" :loading="sLoading" bordered :dataSource="dataSourceS" :columns="columnsS" :pagination="false">
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
                    <!--公示弹窗-->
                    <a-modal
                            v-model="kVisible"
                            :title="openTxt"
                            onOk="handleOk"
                    >
                        <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                            <p>{{oTxt}}</p>
                        </div>
                        <template slot="footer">
                            <a-button key="back" @click="kBack">取消</a-button>
                            <a-button key="submit" type="primary" @click="kOk">确认</a-button>
                        </template>
                    </a-modal>
                    <!--是否通过弹窗-->
                    <a-modal
                            v-model="pVisible"
                            :title="pTitle"
                            onOk="handleOk"
                    >
                        <a-textarea :placeholder="pLder" v-model="pTxt" style="height: 150px;resize: none;"/>
                        <template slot="footer">
                            <a-button key="back" @click="pBack">取消</a-button>
                            <a-button key="submit" type="primary" @click="pOk">确认</a-button>
                        </template>
                    </a-modal>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                //表三加载
                sLoading:false,
                //表二加载
                kTwoLoad:false,
                //页面加载中
                pageLoad:true,
                //表格加载中
                loading:true,
                //是否能编辑
                isE:true,
                oNum:true,
                //当前tabs页面
                keyNum:"1",
                //当前页面提示框
                kVisible:false,
                //食堂状态
                rState:1,
                rstate:1,
                rSList:[],
                rList:[{
                    id:'',
                    title:'全部',
                },{
                    id:0,
                    title:'未审核',
                },{
                    id:1,
                    title:'已通过',
                },{
                    id:2,
                    title:'已拒绝',
                }],
                //提交审核备注信息
                refuse:'',
                btnTxt:'提交',
                btnState:'提交审核',
                v3Title:'审核备注',
                //审核信息
                exData:{
                    aName:'王阿航',
                    aTxt:'无',
                    eName:'王阿航',
                    eTxt:'吃的太撇！'
                },
                //表单验证
                form:this.$form.createForm(this),
                form2:this.$form.createForm(this),
                sFood:true,
                seachS:true,//常用无菜显示
                rEShow2:false,
                zFood:'包包白',
                fFood:'包包白、玉米、西瓜、哈密瓜',
                hasFod:true,//有菜
                btnI:0,
                sBtnI:0,
                //输入框边框显示
                col:false,
                //弹出框
                visible:false,
                visible2:false,
                visible3:false,
                visible4:false,
                //初始表单数据
                rValue:1,
                addCK:false,
                //保存状态
                state:false,
                ctnList:[],
                ctnKey:1,
                //周期列表
                weekList:[],
                //星期数
                oWeek:'',
                //星期对应日期
                dayWeek:'',
                //初始显示
                initial:true,
                //初始按钮显示
                iBtn:true,
                week:{
                    one:'',
                    seven:'',
                    nOne:'',
                    nSeven:''
                },
                weekNum:0,
                //初始展示表
                columns: [],
                dataSource: [],
                //数据为空时赋值
                notData:[
                    {
                        key: '0',
                        logo:'早餐',
                        name:['本周未编辑']
                    },{
                        key: '1',
                        logo:'午餐',
                        name:[]
                    },{
                        key: '2',
                        logo:'晚餐',
                        name:[]
                    },{
                        key: '3',
                        logo:'加餐',
                        name:[]
                    }
                ],
                notTab:[{
                    slots: { title: 'customTitle' },
                    align:'center',
                    dataIndex: 'logo',
                    width:80,
                    height:50,
                },{
                    slots: { title: 'customTitle2' },
                    align:'center',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        if(index == 0){
                            obj.attrs.rowSpan = 4;
                        }else{
                            obj.attrs.rowSpan = 0;
                        }
                        obj.attrs.colSpan = 7;
                        return obj;
                    },
                    dataIndex: 'name',
                    scopedSlots: {customRender: 'ct2'},
                },{
                    slots: { title: 'customTitle3' },
                    align:'center',
                    dataIndex: 'state',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                },{
                    slots: { title: 'customTitle4' },
                    align:'center',
                    dataIndex: 'lpName',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                },{
                    slots: { title: 'customTitle5' },
                    align:'center',
                    dataIndex: 'sTime',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                },{
                    slots: { title: 'customTitle6' },
                    align:'center',
                    dataIndex: 'btn',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                },{
                    slots: { title: 'customTitle7' },
                    align:'center',
                    dataIndex: '123',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                },{
                    slots: { title: 'customTitle8' },
                    align:'center',
                    dataIndex: '23',
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        obj.attrs.rowSpan = 0;
                        obj.attrs.colSpan = 0;
                        return obj;
                    },
                }],
                hasTab:[{
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
                //是否属于新建
                isNew:true,
                //编辑状态
                isModify:false,
                //是否过期不可编辑
                isExpire:[],
                //底部文案
                btmTxt:{
                    //营养师
                    dietitian:'',
                    //制谱人
                    producer:'',
                    //审核人
                    name:''
                },
                foodList:['全部','发酵面制品','汤面类','油炸类','其他'],
                fodList:[],
                fcList:[],
                headers: {
                    authorization: 'authorization-text',
                },//上传图片配置
                //权限页面
                power:false,
                //权限列表
                columns2: [{
                    title: '食堂',
                    align:'center',
                    dataIndex: 'droom',
                },{
                    title: '周期',
                    align:'center',
                    dataIndex: 'time',
                },{
                    title: '营养师',
                    align:'center',
                    dataIndex: 'nName',
                },{
                    title: '制谱人',
                    align:'center',
                    dataIndex: 'rName',
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
                dataSource2: [],
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
                //公示状态
                isOpen:true,
                oTxt:'关闭后家长端将无法查看食谱',
                openTxt:'关闭公示',
                //展示食谱
                columnsS: [{
                    slots: { title: 'customTitle' },
                    align:'center',
                    dataIndex: 'logo',
                    width:80,
                    height:50,
                    backgroundColor:"#777"
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
                    ],

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
                        [],
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
                    name1:'',
                    name2:'',
                    name3:''
                },
                //按钮展示
                acShow:false,
                pTitle:'',
                pTxt:'',
                pLder:'食谱排的真棒，请继续保持',
                pVisible:false,
                //审核信息
                eMag:{
                    state:'拒绝',
                    msg:'如果我打很多很多很多很多很多字这里不好显示',
                    name:'阿航',
                    time:'2019-06-01   15:23'
                },
                fNum:0,
                wNum:1,
                //食堂老ID
                oFid:0,
                nFid:0,
                //食材名称
                foodName:'',
                //食材条目
                pTotal:0,
                //食材分页数
                pKey:1,
                //暂存当前日期当前餐次菜品
                foodL:[],
                foodI:0,
                //开始结束时间
                time:{
                    s:'',
                    e:''
                },
                //状态ID
                rlID:'',
                //通过&&拒绝状态
                isState:1,
                //订单号
                dCode:0,
                timeList:[]
            }
        },
        beforeCreate () {

        },
        methods: {
            tFormat(){
                this.timeList = [];
                let x = moment(new Date()).day(1).format("MM月DD日"),
                    y = moment(new Date()).day(7).format("MM月DD日"),
                    nX = moment(new Date()).day(1).format("YYYYMMDD"),
                    nY = moment(new Date()).day(7).format("YYYYMMDD");
                for(let i = 1; i < 8; i++){
                    this.weekList.push(moment(new Date()).day(i).format('MM月DD日'));
                    this.timeList.push(moment(new Date()).day(i).format('x'));
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
                this.getFBook();
                this.iBtn = true;
                this.isModify = false;
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
                }
                x = moment(parseInt(moment(new Date()).day(1).format("x")) + x).format('MM月DD日');
                nX = moment(parseInt(moment(new Date()).day(1).format("x")) + nX).format('YYYYMMDD');
                y = moment(parseInt(moment(new Date()).day(1).format("x")) + y).format('MM月DD日');
                nY = moment(parseInt(moment(new Date()).day(1).format("x")) + nY).format('YYYYMMDD');
                this.week.one = x;
                this.week.seven = y;
                this.week.nOne = nX;
                this.week.nSeven = nY;
            },
            edit(val){
                if(val=='e'){
                    if(this.isNew){
                        this.isE = false;
                        this.notData[0].name = [];
                        this.notData.forEach((e,i)=>{
                            e.name = [[],[],[],[],[],[],[]];
                        });
                        this.dataSource = this.notData;
                        this.columns = this.hasTab;

                        let time = moment(new Date()).format("x");
                        this.isExpire = [true,true,true,true,true,true,true];
                        this.timeList.forEach((e,i) =>{
                            if(e <= time){
                                this.isExpire[i] = false;
                            }
                        });
                    }
                    this.iBtn = !this.iBtn;
                    this.isModify = !this.isModify;
                }else if(val == 'u'){
                    if(this.btnState == '提交审核'){
                        this.visible3 = !this.visible3
                        this.v3Title = '审核备注'
                    }else if(this.btnState == '审核通过'){
                        this.visible3 = !this.visible3
                        this.btnTxt ='确定'
                        this.v3Title = '查看详情'
                    }else if(this.btnState == '审核中'){
                        this.visible3 = !this.visible3
                        this.btnTxt ='确定'
                        this.v3Title = '查看详情'
                    }else{
                        this.visible3 = !this.visible3
                        this.btnTxt ='确定'
                        this.v3Title = '查看详情'
                    }
                }else{
                    this.visible4 = !this.visible4
                }
            },
            editB(val){
                if(val=='f'){
                    let list = [];
                    this.dataSource.forEach((e,i)=>{
                        let x = 0;
                        switch (i) {
                            case 0:
                                x = 1;
                                break;
                            case 1:
                                x = 2;
                                break;
                            case 2:
                                x = 3;
                                break;
                            case 3:
                                x = 4;
                        }
                        e.name.forEach((e2,i2)=>{
                            let week = 0
                            switch (i2) {
                                case 0:
                                    week = 1;
                                    break;
                                case 1:
                                    week = 2;
                                    break;
                                case 2:
                                    week = 3;
                                    break;
                                case 3:
                                    week = 4;
                                    break;
                                case 4:
                                    week = 5;
                                    break;
                                case 5:
                                    week = 6;
                                    break;
                                case 6:
                                    week = 7;
                            }
                            e2.forEach((e3)=>{
                                let obj = {
                                    week:week,
                                    meal_times:x,
                                    food_id:e3.food_id || e3.id
                                };
                                list.push(obj)
                            })
                        });
                    });
                    if(this.isModify && list.length > 0){
                        this.state = false;
                    }else{
                        this.state = true;
                        this.notData[0].name[0] = '本周未编辑';
                        this.dataSource = this.notData;
                        this.columns = this.notTab;
                    }
                    this.isModify = !this.isModify;
                    this.iBtn = !this.iBtn;
                }else if(val == 'p'){
                    if(this.btmTxt.dietitian == ''){
                        this.col = true;
                        this.$message.warning(`请填写营养师姓名`);
                    }else{
                        let list = [];
                        this.dataSource.forEach((e,i)=>{
                            let x = 0;
                            switch (i) {
                                case 0:
                                    x = 1;
                                    break;
                                case 1:
                                    x = 2;
                                    break;
                                case 2:
                                    x = 3;
                                    break;
                                case 3:
                                    x = 4;
                            }
                            e.name.forEach((e2,i2)=>{
                                let week = 0
                                switch (i2) {
                                    case 0:
                                        week = 1;
                                        break;
                                    case 1:
                                        week = 2;
                                        break;
                                    case 2:
                                        week = 3;
                                        break;
                                    case 3:
                                        week = 4;
                                        break;
                                    case 4:
                                        week = 5;
                                        break;
                                    case 5:
                                        week = 6;
                                        break;
                                    case 6:
                                        week = 7;
                                }
                                e2.forEach((e3)=>{
                                    let obj = {
                                        week:week,
                                        meal_times:x,
                                        food_id:e3.food_id || e3.id
                                    };
                                    list.push(obj)
                                })
                            });
                        });
                        let data = {
                            url:'api/school/recipes/'+ this.week.nOne + this.week.nSeven,
                            method:'put',
                            data:{
                                id:this.ctnKey,
                                producer:this.btmTxt.producer,
                                dietitian:this.btmTxt.dietitian,
                                foods:JSON.stringify(list)
                            }
                        };
                        this.$apiAxiox(data).then((res)=>{
                            console.log(res);
                            if(res.data.code == 0){
                                this.$message.success(`保存食谱成功`);
                                this.iBtn = !this.iBtn;
                                this.isModify = !this.isModify;
                            }else{
                                this.$message.error(res.data.msg);
                            }
                        });

                    }
                }else{
                    this.notData[0].name[0] = '本周未编辑';
                    this.dataSource = this.notData;
                    this.columns = this.notTab;
                    this.$message.success(`清空食谱成功`);
                }
            },
            //加菜
            addCk(val,i,val2){
                this.foodI = i;
                this.foodL = val;
                if(val2.logo == '早餐'){
                    this.fNum = 0;
                }else if(val2.logo == '午餐'){
                    this.fNum = 1;
                }else if(val2.logo == '晚餐'){
                    this.fNum = 2;
                }else{
                    this.fNum = 3;
                };
                switch (i) {
                    case 1:
                        this.oWeek = "星期一";
                        break;
                    case 2:
                        this.oWeek = "星期二";
                        break;
                    case 3:
                        this.oWeek = "星期三";
                        break;
                    case 4:
                        this.oWeek = "星期四";
                        break;
                    case 5:
                        this.oWeek = "星期五";
                        break;
                    case 6:
                        this.oWeek = "星期六";
                        break;
                    case 7:
                        this.oWeek = "星期天";
                }

                this.dayWeek = this.weekList[i-1];
//                this.fcList = [];
                this.addCK = !this.addCK;
                this.seachFood(0);
            },
            //列表移除菜
            reFood(val,i,index){
                val[index-1].splice(i,1);
            },
            //搜索菜品
            seachFood(val){
                let type = 0;
                if(val==0){
                    type = 0
                }else{
                    type = val;
                }

                let x = this.btnI + 1;
                let data = {
                    method:'get',
//                    url:'api/school/dishes?keyword=' + this.foodName + '&state=' + this.btnI +'&type=' + this.sBtnI + '&page=' + this.pKey,
                    url:'api/school/dishes?keyword=' + this.foodName + '&state=' + x +'&type=' + type + '&page=' + this.pKey,
                };

                this.$apiAxiox(data).then((res)=>{
                    if(res.data.data.data.length == 0){
                        this.hasFod = true;
                        this.seachS = true;
                    }else{
                        this.hasFod = false;
                        this.fodList = [];
                        this.pTotal = res.data.data.total;
                        res.data.data.data.forEach((e,i) =>{
                            if(e.cover == ''){
                                e.cover = '../../assets/login/logo.png'
                            }
                            if(e.last_use == 0){
                                e.last_use = moment(new Date()).format('YYYY-MM-DD');
                            }
                            let x = false;
                            if(this.fcList.length != 0){
                                this.fcList.forEach((e1,i)=>{
                                    if(e1.id == e.id){
                                        x = true;
                                    }
                                })
                            };
                            let obj = {
                                id:e.id,
                                state:x,
                                url:e.cover,
                                title:e.title,
                                num:e.material_num,
                                time:e.last_use,
                                excipient:e.excipient,
                                materials:e.materials
                            };
                            this.fodList.push(obj);
                        });
                        console.log(this.fodList);
                        this.fodList.forEach((e,i)=>{
                            this.foodL.forEach((e2,i2)=>{
                                if(e.id == e2.id){
                                    e.state = true;
                                }
                            })
                        });
                    }
//                    if(res.data.code == 0){
//                        console.log(res.data.data);
//                    }else{
//                        this.$message.warning(res.data.msg);
//                    }

                })

            },
            InpTxt(){
               if(this.Dietitian !=''){
                   this.col = false;
               }
            },
            rChange(e){
                if(this.notData[0].name[0] != '本周未编辑'){
                    let list = [];
                    this.dataSource.forEach((e,i)=>{
                        let x = 0;
                        switch (i) {
                            case 0:
                                x = 1;
                                break;
                            case 1:
                                x = 2;
                                break;
                            case 2:
                                x = 3;
                                break;
                            case 3:
                                x = 4;
                        }
                        e.name.forEach((e2,i2)=>{
                            let week = 0
                            switch (i2) {
                                case 0:
                                    week = 1;
                                    break;
                                case 1:
                                    week = 2;
                                    break;
                                case 2:
                                    week = 3;
                                    break;
                                case 3:
                                    week = 4;
                                    break;
                                case 4:
                                    week = 5;
                                    break;
                                case 5:
                                    week = 6;
                                    break;
                                case 6:
                                    week = 7;
                            }
                            e2.forEach((e3)=>{
                                let obj = {
                                    week:week,
                                    meal_times:x,
                                    food_id:e3.food_id || e3.id
                                };
                                list.push(obj)
                            })
                        });
                        if(list.length <= 0){
                            this.state = true;
                        }else{
                            this.state = false;
                        }
                    });
                }else{
                    this.state = true;
                }

                this.nFid = e;
                if(!this.state){
                    this.visible = !this.visible;
                }
                //  加载菜谱信息
               this.getFBook()
            },
            handleOk(){
                this.visible = !this.visible;
                this.ctnKey = this.nFid;
                this.getFBook();
                this.$message.success(`保存食谱成功`);
            },
            handleCancel(){
                this.visible = !this.visible;
                this.notData.forEach((e,i)=>{
                    e.name = [[],[],[],[],[],[],[]];
                });
                this.dataSource = this.notData;
                this.columns = this.hasTab;
            },
            back(){

//                if(this.fcList.length > 0){
//                    this.fcList.forEach((e,i)=>{
//                        let obj ={
//                            created_at:'',
//                            food_id: e.id,
//                            meal_times:'',
//                            title:e.name,
//                            use_time:'',
//                            week: this.foodI
//                        }
//                        this.foodL.push(obj);
//                    });
//                }else{
//
//                }
                this.addCK = !this.addCK;
            },
            bClick(val){
                this.btnI = val;
                this.seachFood(0);
            },
            fLiClick(val,id){
                this.sBtnI = val;
                this.seachFood(id);
            },
            all(){
                this.sBtnI = 0;
                this.btnI = 1;
                this.seachFood(0);
            },
            addFood(val,i,val2){
                this.fodList[i].state = !val2;
                if(this.foodL.length >=20){
                    this.$message.warning('菜品添加已达上限');
                }else{
                    this.foodL.push(val)
                }
            },
            //删除菜
            reFod(val){
                this.foodL.splice(val, 1);
                this.fodList.forEach((e,i)=>{
                    e.state = false;
                    this.foodL.forEach((e2,i2)=>{
                        if(e.id == e2.id){
                            e.state = true;
                        }
                    });
                });
            },
            //弹框2
            lookCk(val,val2,val3){
                this.fFood = val2;
                this.zFood = val3;
                this.visible2 = !this.visible2;
            },
            backC(){
                this.visible2 = !this.visible2;
            },
            addF(){
                this.sFood = !this.sFood
            },
            //提交新菜品
            check  () {
                const validateFieldsKey = ['fName','fNature', 'sFood','sFood2','upload']
                this.form.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values);
                        if(values.upload == undefined){
                            this.rEShow2 = true
                        }else{
                            this.rEShow2 = false
                        }
                        if (!err) {

                        }

                    },
                );
            },
            //上传图片
            normFile  (e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            },
            upImg(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rEShow2 = false
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            //审核按钮组
            v3Clisk(val){
                if(val == '提交审核'){
                    this.visible3 = !this.visible3;
                    let list = [];
                    if(this.dataSource[0].name[0] == '本周未编辑'){
                        this.$message.warning('本周未编辑');
                        return;
                    }else{
                        this.dataSource.forEach((e,i)=>{
                            let x = 0;
                            switch (i) {
                                case 0:
                                    x = 1;
                                    break;
                                case 1:
                                    x = 2;
                                    break;
                                case 2:
                                    x = 3;
                                    break;
                                case 3:
                                    x = 4;
                            }
                            e.name.forEach((e2,i2)=>{
                                let week = 0
                                switch (i2) {
                                    case 0:
                                        week = 1;
                                        break;
                                    case 1:
                                        week = 2;
                                        break;
                                    case 2:
                                        week = 3;
                                        break;
                                    case 3:
                                        week = 4;
                                        break;
                                    case 4:
                                        week = 5;
                                        break;
                                    case 5:
                                        week = 6;
                                        break;
                                    case 6:
                                        week = 7;
                                }
                                e2.forEach((e3)=>{
                                    let obj = {
                                        week:week,
                                        meal_times:x,
                                        food_id:e3.food_id || e3.id
                                    };
                                    list.push(obj)
                                })
                            });
                        });
                        let data = {
                            url:'api/school/recipes/'+ this.week.nOne + this.week.nSeven,
                            method:'put',
                            data:{
                                id:this.ctnKey,
                                producer:this.btmTxt.producer,
                                dietitian:this.btmTxt.dietitian,
                                remake:this.refuse,
                                foods:JSON.stringify(list)
                            }
                        };
                        this.$apiAxiox(data).then((res)=>{
                            if(res.data.code == 0){
                                this.$message.success(`提交成功`);
                            }else{
                                this.$message.error(res.data.msg);
                            }
                        });
                    };
                }else if(val == '审核通过'){
                    this.visible3 = !this.visible3
                }else if(val == '审核中'){
                    this.visible3 = !this.visible3
                }else{
                    this.visible3 = !this.visible3
                }
            },
            //提示框3
            v3back(){
                this.visible3 = !this.visible3
            },
            //时间获取
            onChange(e){
                console.log(e[0].format("MM月DD日"));
                console.log(e[1].format("MM月DD日"));
//                console.log(e.format("MM月DD日"));
            },
            //提示框4
            tBack(){
                this.visible4 = !this.visible4
            },
            //复制食谱
            ckTime(){
                this.visible4 = !this.visible4
                this.$message.success(`复制成功`);
            },
            //添加菜品
            getPlist(){
                const validateFieldsKey = ['selectF','selectS','rpicker'];
                this.form2.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values);
                        if (!err) {
                            this.ctnKey = this.rSList[values.selectF-1].id;
                            this.rlID = this.rList[values.selectS-1].id;
//                            console.log(this.rList[values.selectS - 1]);
                            if(values.rpicker != undefined){
                                this.time.s = moment(values.rpicker[0]._d).format('YYYYMMDD');
                                this.time.e = moment(values.rpicker[1]._d).format('YYYYMMDD');
                            }else{
                                this.time.s = '';
                                this.time.e = '';
                            }
                            this.getAllFoodBock(1);
                        }

                    },
                );
            },
            //清空搜索状态
            clearL(){
                this.rState = 1;
                this.rstate = 1;
                this.form2.resetFields();
            },
            //分页
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
                this.getAllFoodBock(1);
            },
            //是否开启状态
            open(e){
                this.isOpen = e;
                this.kVisible = true;
                if(this.oNum){
                    this.oTxt='关闭后家长端将无法查看食谱'
                    this.openTxt = '关闭公示'
                }else{
                    this.oTxt='开启后家长端即可查看审核通过的食谱'
                    this.openTxt = '开启公示'
                }
            },
            //公示弹框返回
            kBack(){
                this.kVisible = !this.kVisible
            },
            //公示弹框确定
            kOk(){
                this.kVisible = !this.kVisible
                this.oNum = !this.oNum
            },
            //新建食谱
            newFList(){
                this.keyNum = "1";
            },
            //页面切换
            keyChange(e){
                this.keyNum = e;
                this.getAllFoodBock(0);
            },
            //操作按钮
            kState(val,val2){
                this.sLoading = !this.sLoading;
                this.power = !this.power;
                if(val == 'NO'){
                    this.acShow = true
                }else{
                    this.acShow = false;
                };
                let data = {
                    url:'api/school/recipes/' + val2.code +'?id=' + val2.id,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.dCode = res.data.data.serial_num;
                        this.eData.name1 = res.data.data.dietitian;
                        this.eData.name2 = res.data.data.producer;
                        this.eData.name3 = res.data.data.state_str;
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
                        res.data.data.foods.forEach((e,i)=>{
                            data.name.push(e.meal_times[1]);
                            data1.name.push(e.meal_times[2]);
                            data2.name.push(e.meal_times[3]);
                            data3.name.push(e.meal_times[4]);
                        });
                        this.dataSourceS = [];
                        this.dataSourceS.push(data);
                        this.dataSourceS.push(data1);
                        this.dataSourceS.push(data2);
                        this.dataSourceS.push(data3);
                        this.sLoading = !this.sLoading;
                    };
                });
            },
            rOk(val){
                this.pVisible = !this.pVisible
                if(val == 'OK'){
                    this.pTitle = '审核备注';
                    this.pLder = '食谱排的真棒，请继续保持';
                    this.isState = 1;
                }else{
                    this.pTitle = '拒绝原因';
                    this.pLder = '请仔细检查食谱哦';
                    this.isState = 2;
                }
            },
            //返回食谱审核列表
            kback(){
                this.power = !this.power;
            },
            //是否通过
            pBack(){
                this.pVisible = !this.pVisible;
            },
            pOk(){
                let data = {
                    url:'api/school/examine/recipes',
                    method:'post',
                    data:{
                        serial_num: this.dCode,
                        feedback:this.pTxt,
                        state:this.isState
                    }
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.$message.success(`食谱审核成功`);
                        this.pTxt = '';
                        this.power = !this.power;
                        this.pVisible = !this.pVisible;
                        this.getAllFoodBock(0);
                    }else{
                        this.$message.error(res.data.msg);
                        this.pVisible = false;
                    }
                    return;
                });

            },
            //获取食堂数据
            getData(){
                let data ={
                    url:'api/common/dictionaries',
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        if(res.data.data.canteen.length >0){
                            this.ctnList = res.data.data.canteen;
                            this.ctnKey = this.ctnList[0].id;
                            this.rSList.push({id:0,title:'全部'});
                            this.ctnList.forEach((e,i)=>{
                                this.rSList.push(e);
                            });
                        }else{
                            this.rState = '全部';
                        }
                        this.foodList = res.data.data.gener;
                        this.foodList.splice(0,0,{id:0,title:'全部'});
                    }else{
                        this.$message.warning(res.data.msg);
                    }

                    this.getFBook();
                })
            },
            //获取食谱
            getFBook(){
                this.loading = true;
                let data ={
                    url:'api/school/recipes/'+ this.week.nOne + this.week.nSeven + '?id=' + this.ctnKey,
                    //url:'api/school/recipes/'+ 2019090920190915 + '?id=' + 22,
                    method:'get',
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        if(res.data.data.length == undefined){
                            if(res.data.data.foods == []){
                                this.dataSource = this.notData;
                                this.columns = this.notTab;
                            }else{
                                if(res.data.data.state_str == '未审核'){
                                    res.data.data.state_str = '提交审核'
                                    this.btnState = res.data.data.state_str;
                                }else{
                                    this.btnState = res.data.data.state_str;
                                }
                                this.btmTxt.dietitian = res.data.data.dietitian;
                                this.btmTxt.producer = res.data.data.producer;
                                this.btmTxt.name = res.data.data.auditor_nickname;
                                this.setData(res.data.data.foods);
                                this.isNew = false;
                            }
                            this.loading = false;
                            this.pageLoad = false;
                        }else{
                            this.dataSource = this.notData;
                            this.columns = this.notTab;
                            this.loading = false;
                            this.pageLoad = false;
                            this.isNew = true;
                            this.btnState = '提交审核';
                        }
                    }else{
                        this.isNew = true;
                        this.dataSource = this.notData;
                        this.columns = this.notTab;
                        this.$message.error(res.data.msg);
                        this.loading = false;
                        this.pageLoad = false;
                    }

                })
            },
            //全部食谱分页处理
            getAllFoodBock(val){
                this.kTwoLoad = true;
                let that = this;
                let x = 0;
                if(val == 0){
                    this.pageLoad = true;
                    x = ''
                }else{
                    x = this.ctnKey
                }
                let data = {
                    url:'api/school/recipes?page=' + that.pagination.current +'&cid=' + x + '&state=' + that.rlID + '&begin=' + that.time.s + '&end=' + that.time.e,
                    method:'get',
                    data:{}
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.pagination.total = res.data.data.total;
                        this.dataSource2 = [];
                        res.data.data.data.forEach((e,i)=>{
                            //0审核中,1审核成功,2审核失败
                            let x = '';
                            switch (e.state) {
                                case 0:
                                    x = '待审核';
                                    break;
                                case 1:
                                    x = '已通过';
                                    break;
                                case 2:
                                    x = '已拒绝';
                            }
                            let obj = {
                                key: i,
                                droom:e.canteen_title,
                                time:e.begin_format +  ' - ' + e.end_format,
                                nName:e.dietitian,
                                rName:e.producer,
                                sTime:e.updated_at,
                                state:x,
                                code:e.cycle,
                                id:e.canteen_id
                            };
                            this.dataSource2.push(obj);
                        });
                        if(val == 0){
                            this.pageLoad = !this.pageLoad;
                        };
                        this.kTwoLoad = !this.kTwoLoad;
                    };
                })
            },
            //处理数据
            setData(dataList){
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
                this.isExpire = [];
                dataList.forEach((e,i)=>{
                    data.name.push(e.meal_times[1]);
                    data1.name.push(e.meal_times[2]);
                    data2.name.push(e.meal_times[3]);
                    data3.name.push(e.meal_times[4]);
                    this.isExpire.push(e.state);
                });
                console.log(this.isExpire);
                this.dataSource = [];
                this.dataSource.push(data);
                this.dataSource.push(data1);
                this.dataSource.push(data2);
                this.dataSource.push(data3);
                this.columns = this.hasTab;
            },
            //获取分页
            onpChange(e){
                this.pKey = e;
                this.seachFood(0);
            }
        },

        created(){
            this.getData();
            this.tFormat();
        },
        watch:{
            ctnKey:function(nV,oV){
                this.fID = oV;
            }
        }




    };
</script>
<style scoped>
    #mx_ckBook .ctnBox{
        display: flex;
    }
    #mx_ckBook .wBox{
        display: flex;
        align-items: center;
    }
    #mx_ckBook .wBox p{
        margin-bottom: 0;
    }
    #mx_ckBook .wBox .brd{
        border:1px solid #efefef;
        background: #eee;
        padding: 5px 10px;
        border-radius:5px;
    }
    #mx_ckBook .wBox .prev,#mx_ckBook .wBox .next{
        border:none;
        outline:none;
        box-shadow: none;
    }
    #mx_ckBook .wBox .prev:hover, #mx_ckBook .wBox .next:hover{
        border:none;
        outline:none;
    }
    #mx_ckBook .actBox{
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    #mx_ckBook .actBox .btnBox{
        position: relative;
        padding:5px 8px;
        border:1px solid #eee;
        border-radius:5px;
    }
    #mx_ckBook .actBox .btnBox span{
        padding:5px 8px;
        cursor: pointer;
    }
    #mx_ckBook .actBox .btnBox span.line{
        position: absolute;
        left: 50%;
        top: 3px;
        padding: 0;
        width: 2px;
        height: 15px;
        margin-top: 5px;
        background: #ccc;
    }
    #mx_ckBook .tabBook{
        margin-top: 40px;
    }
    #mx_ckBook .Inp{
        width:150px;
    }
    #mx_ckBook .Inp.on{
        border-color:red;
    }
    #mx_ckBook .back{
        display: flex;
        cursor:pointer;
    }
    #mx_ckBook .cBox{
        display: flex;
        align-items: center;
    }
    #mx_ckBook .cBox p{
        margin-bottom: 0;
    }
    #mx_ckBook .btn .l.on,#mx_ckBook .btn .r.on{
        background: #02bb72;
        color:#fff;
    }
    #mx_ckBook .block.on{
        font-weight: bold;
        color:#000;
    }
    #mx_ckBook .img{
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        width: 95%;
        margin:20px auto 0;
    }
    #mx_ckBook .fod{
        width: 165px;
        height: 220px;
        border:1px solid #ccc;
        border-radius: 5px;
        margin: 0 20px 20px 0;
    }
    #mx_ckBook .fod .t{
        position: relative;
        height: 140px;
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px solid #ccc;
        overflow: hidden;
    }
    #mx_ckBook .fod .t img{
        margin-top: 30px;
        height: 70%;
        width: 70%;
    }
    #mx_ckBook .fod .b p{
        margin: 2px 0 0 10px;
    }
    #mx_ckBook .mx_ckBook{
        position: relative;
        width: 800px;
        margin-top: 30px;
    }
    #mx_ckBook .mx_smBtn{
        margin-top: 40px;
    }
    #mx_ckBook .Logo{
        position: absolute;
        top: 0;
        right: 0;
    }
    #mx_ckBook .Logo .img{
        width: 110px;
        height: 124px;
        border:1px dashed #999;
        margin-bottom: 20px;
    }
    #mx_ckBook .Logo .img.on{
        border-color:red;
    }
    #mx_ckBook .power .tabBox{
        display: flex;
        align-items: center;
    }
    #mx_ckBook .power .t{
        margin-top: 40px;
    }
    #mx_ckBook .power .b{
        margin-top: 30px;
        display: flex;
        align-items: center;
    }
    #mx_ckBook .power .tabBox p{
        margin-bottom: 0;
    }
    #mx_ckBook .cBor{
        border:1px solid #e8e8e8;
        padding:2px 5px;
        border-radius:5px;
    }
</style>
<style>
    #mx_ckBook .ant-row.ant-form-item{
        margin-bottom: 0;
        width: 300px;
    }
    #mx_ckBook form .ant-select{
        width: 75%;
    }

    #mx_ckBook .hBox .ant-table-tbody > tr > td{
        padding:14px 16px;
    }
    #mx_ckBook .ant-table-tbody > tr > td{
        padding:54px 16px;
    }
    #mx_ckBook .ant-table-row.ant-table-row-level-0:hover{
        background: transparent;
    }
    #mx_ckBook .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td{
        background: transparent;
    }
</style>