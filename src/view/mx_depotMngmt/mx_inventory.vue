<template>
    <div id="mx_inventory">
        <a-skeleton
            :loading="loadingActive"
            active
            :paragraph="{rows: 20}"
        >
            <a-tabs
                :activeKey="activeKey"
                @change="callback"
            >
                <a-tab-pane
                    tab="盘点"
                    key="1"
                >
                    <div
                        class="mx_canteen"
                        style="display: flex;"
                    >
                        <div>
                            食堂：
                        </div>
                        <a-radio-group
                            v-model="canteenId"
                            style="width:94%;"
                            @change="onChange"
                        >
                            <a-radio
                                v-for="(item,index) in canteen"
                                :value="item.id"
                            >{{item.title}}</a-radio>
                        </a-radio-group>
                    </div>
                    <!-- 搜索框 -->
                    <div class="components-input-demo-presuffix">
                        <p class="hmTxt">食材:</p>
                        <a-input
                            placeholder="食材名称/批次号"
                            class="seachBox"
                            style="width:200px;"
                            v-model="mxClassVal"
                            ref="userNameInput"
                        >
                            <a-icon
                                v-if="mxClassVal"
                                theme="filled"
                                slot="suffix"
                                type="close-circle"
                                @click="emitEmpty"
                                style="color:#999"
                            />
                        </a-input>
                        <a-button
                            type="primary"
                            class="seachBtn"
                            @click="mxSeach"
                        >搜索</a-button>
                    </div>
                    <div style="display: flex;justify-content: space-between;align-items: center;">
                        <div style="display: flex;align-items: center;">
                            <p style="margin:0;">仓库：</p>
                            <a-select
                                v-model="storehouseId"
                                @change="mxChangeHouse"
                                style="width: 120px;"
                            >
                                <a-select-option
                                    v-for="(item,index) in storehouse"
                                    :value="item.id"
                                >{{item.title}}</a-select-option>
                            </a-select>
                        </div>
                        <a-button
                            type="primary"
                            @click="mxSub"
                        >提交审核</a-button>
                        <a-modal
                            height="480px"
                            v-model="valInfo"
                            title="审核信息"
                        >
                            <div>
                                <div style="display: flex;margin-top: 20px;">
                                    <a-textarea
                                        placeholder="填写盘点审核备注信息"
                                        v-model="remark"
                                        style="width: 460px;height: 90px;resize: none;"
                                    />
                                </div>
                                <div style="display: flex;margin-top: 20px;">
                                    <div>
                                        <div class="clearfix">
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                listType="picture-card"
                                                :fileList="fileList"
                                                @preview="handlePreview"
                                                @change="handleChange"
                                            >
                                                <div v-if="fileList.length < 2">
                                                    <a-icon type="plus" />
                                                </div>
                                            </a-upload>
                                            <a-modal
                                                :visible="previewVisible"
                                                :footer="null"
                                                @cancel="handleCancel"
                                                style="display:flex"
                                            >
                                                <img
                                                    alt="example"
                                                    style="width: 100%"
                                                    :src="previewImage"
                                                />
                                            </a-modal>
                                        </div>
                                        <a-upload
                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                            :fileList="fileList"
                                            @preview="handlePreview"
                                            @change="handleChange"
                                        >
                                            <a-button icon='upload'>
                                                上传图片
                                            </a-button>
                                        </a-upload>
                                    </div>
                                </div>
                            </div>
                            <template slot="footer">
                                <a-button @click="submit('NO')">取消</a-button>
                                <a-button
                                    type="primary"
                                    @click="submit('OK')"
                                >确认</a-button>
                            </template>
                        </a-modal>
                    </div>
                    <!-- 表格 -->
                    <!-- null -->
                    <a-table
                        :columns="columnNull"
                        :dataSource="dataNull"
                        bordered
                        :pagination="false"
                        v-if="!isDataNull"
                        style="marginTop:24px;"
                    />
                    <a-skeleton
                        :loading="loading"
                        active
                        :paragraph="{rows: 20}"
                    >
                        <a-table
                            :columns="column"
                            :dataSource="dataMain"
                            bordered
                            :pagination="false"
                            v-if="isDataNull"
                            style="marginTop:24px;"
                        >
                            <div
                                style="display: flex;justify-content: space-around;"
                                slot="material_single_src"
                                slot-scope="text, record,index"
                            >
                                <viewer>
                                    <img
                                        style="width:60px;heigth:60px"
                                        :src="text"
                                    >
                                </viewer>
                            </div>
                            <div
                                style="display: flex;justify-content: space-around;"
                                slot="total"
                                slot-scope="text, record,index"
                            >
                                <div style="position: relative;">
                                    <a-input
                                        @keyup="mxInpVal"
                                        :data-index="index"
                                        style="width:68px;paddingRight:24px;"
                                    />
                                    <span style="position: absolute;right:6px;lineHeight:32px;">斤</span>
                                </div>
                            </div>
                            <div
                                slot="checkResults"
                                slot-scope="text, record, index"
                            >
                                <p
                                    style="margin:0;"
                                    v-if="!record.isResult"
                                >-- --</p>
                                <p
                                    style="margin:0;"
                                    v-else-if="record.result_num == 0"
                                >{{record.result_num}}</p>
                                <p
                                    style="margin:0;"
                                    v-else
                                ><span :style="record.result_num < 0?'color:#ff6600':'color:#33cc00'">{{record.result_num}}</span> 斤,&yen;{{record.result_num_price}}</p>
                            </div>
                        </a-table>
                    </a-skeleton>
                </a-tab-pane>
                <a-tab-pane
                    tab="盘点记录"
                    key="2"
                    forceRender
                >
                    <div v-if="!isShowInfo">
                        <a-form layout="inline">
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenRecordKey"
                                    style="width:150px;marginTop:5px;"
                                    @change="selectChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteenShow"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">单号:</p>
                            <a-input
                                placeholder="单号"
                                class="seachBox"
                                style="width:200px;"
                                v-model="mxClassValRecord"
                                ref="userNameInput"
                            >
                                <a-icon
                                    v-if="mxClassValRecord"
                                    theme="filled"
                                    slot="suffix"
                                    type="close-circle"
                                    @click="emitEmptyRecord"
                                    style="color:#999"
                                />
                            </a-input>
                        </div>
                        <div
                            class="b"
                            style="display: flex;align-items:center;"
                        >
                            <div class="tabBox">
                                <!-- 	状态筛选 0审核中 1审核成功 2审核失败 -->
                                <p style="margin:0;">状态：</p>
                                <a-select
                                    @change="plChange"
                                    :value="rstate"
                                    style="width: 120px;margin-right: 40px;"
                                >
                                    <a-select-option value='-1'>全部</a-select-option>
                                    <a-select-option value='0'>审核中</a-select-option>
                                    <a-select-option value='1'>审核成功</a-select-option>
                                    <a-select-option value='2'>审核失败</a-select-option>
                                </a-select>
                            </div>
                            <div
                                class="tabBox"
                                style="height:40px;"
                            >
                                <p style="margin:0;">日期：</p>
                                <div style="display: flex;align-items: center;">
                                    <a-date-picker
                                        :disabledDate="startDate"
                                        showTime
                                        format="YYYY-MM-DD"
                                        v-model="startValue"
                                        placeholder="选择日期"
                                        @openChange="startOpenChange"
                                    />
                                    <div style="margin:0 10px;">—</div>
                                    <a-date-picker
                                        :disabledDate="endDate"
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="选择日期"
                                        v-model="endValue"
                                        :open="endOpen"
                                        @openChange="endOpenChange"
                                    />
                                </div>
                            </div>
                            <a-button
                                type="primary"
                                style="margin-left: 20px;margin-top: -9px;"
                                @click="getPlist"
                            >查询</a-button>
                            <a-button
                                style="margin-left: 20px;margin-top: -9px;"
                                @click="clearL"
                            >重置</a-button>
                        </div>
                        <a-skeleton
                            :loading="loadingRecord"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="columns"
                                :dataSource="dataMains"
                                bordered
                                :pagination="pagination"
                                @change="handleTableChange"
                                style="marginTop:24px;"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="state_text"
                                    slot-scope="text, record,index"
                                >
                                    <div
                                        style="color:red;"
                                        v-if="record.examine || text == '拒绝'"
                                    >{{text}}</div>
                                    <div v-else>{{text}}</div>
                                </div>
                                <template
                                    slot="operation"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        <div>
                                            <a
                                                v-if="!record.examine"
                                                class="mx_operation mx_color"
                                                @click="mxShowInventory(record.id)"
                                            >查看</a>
                                            <a
                                                v-else
                                                class="mx_operation mx_color"
                                                @click="mxShowInventory(record.id)"
                                            >去审核</a>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <div v-if="isShowInfo">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowInfo"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <a-skeleton
                            :loading="loadingRecordInfo"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div>
                                <div style="display: flex;justify-content: space-between;align-items: center;padding:0 10px;">
                                    <p style="margin:38px 0 18px;"><span style="marginRight:120px;">{{recordInfo.canteen_title}}</span><span>单号：{{recordInfo.inventroy_sn}}</span></p>
                                    <div
                                        v-if="recordInfo.state == 0"
                                        style="display: flex;align-items: center;"
                                    >
                                        <a-button
                                            style="display: flex;align-items: center;marginRight:30px;"
                                            type="primary"
                                            @click="mxAgree('同意')"
                                        >
                                            <a-icon
                                                style="color:green;fontSize:16px;font-weight: bold;"
                                                type="check"
                                            /><span>同意</span>
                                        </a-button>
                                        <a-button
                                            style="display: flex;align-items: center;"
                                            type="primary"
                                            @click="mxAgree('拒绝')"
                                        >
                                            <a-icon
                                                style="color:red;fontSize:16px;font-weight: bold;"
                                                type="close"
                                            /><span>拒绝</span>
                                        </a-button>
                                        <a-modal
                                            :title="auditTitle"
                                            centered
                                            :maskClosable="false"
                                            :maskStyle="{'opacity':'0.3','background':'#000','animation':'none'}"
                                            v-model="isAgree"
                                            @ok="mxOkAgree"
                                            @cancel="mxCelAgree"
                                        >
                                            <textarea
                                                cols="30"
                                                rows="10"
                                                v-model="auditCause"
                                                style="width:100%;resize:none;paddingLeft:12px;"
                                                :placeholder="placeholder"
                                            ></textarea>
                                        </a-modal>
                                    </div>
                                </div>
                                <!-- 表格 -->
                                <a-table
                                    :columns="columnShowInfo"
                                    :dataSource="dataShowInfo"
                                    bordered
                                    :pagination="false"
                                >
                                    <div
                                        style="display: flex;justify-content: space-around;"
                                        slot="material_img_src_one"
                                        slot-scope="text, record,index"
                                    >
                                        <viewer>
                                            <img
                                                style="width:60px;heigth:60px"
                                                :src="text"
                                            >
                                        </viewer>
                                    </div>
                                    <div
                                        slot="unit"
                                        slot-scope="text, record,index"
                                    >
                                        &yen;{{record.unit_price}}/{{record.unit}}
                                    </div>
                                    <template
                                        slot="checkResults"
                                        slot-scope="text, record, index"
                                    >
                                        <div class="editable-row-operations">
                                            <div>
                                                <p style="margin:0;"><span :style="record.result_num < 0?'color:#ff6600':'color:#33cc00'">{{record.result_num}}</span>{{record.unit}},<span>&yen;{{record.result_price}}</span></p>
                                            </div>
                                        </div>
                                    </template>
                                </a-table>
                                <a-row style="marginTop:42px;">
                                    <a-col
                                        :span="8"
                                        style="paddingLeft:10px;"
                                    >
                                        <div>
                                            <p>审核备注：<span>{{recordInfo.remark}}</span></p>
                                            <p>盘&nbsp;&nbsp;点&nbsp;&nbsp;人：<span>{{recordInfo.nickname}}</span></p>
                                            <p>盘点时间：<span>{{recordInfo.inventory_time_text}}</span></p>
                                        </div>
                                        <div
                                            v-if="recordInfo.state != 0"
                                            style="marginTop:50px;"
                                        >
                                            <!-- <p>当前状态：<span>通过</span><span style="color:red;">拒绝</span></p> -->
                                            <p>当前状态：<span>{{recordInfo.state_text}}</span></p>
                                            <p v-if="recordInfo.state == 2">拒绝原因：<span>{{recordInfo.audit_remark}}</span></p>
                                            <p v-else>审核备注：<span>{{recordInfo.audit_remark}}</span></p>
                                            <p>审&nbsp;&nbsp;核&nbsp;&nbsp;人：<span>{{recordInfo.audit_nickname}}</span></p>
                                            <p>审核时间：<span>{{recordInfo.audit_time_text}}</span></p>
                                        </div>
                                    </a-col>
                                    <a-col :span="16">
                                        <div>
                                            <p>食材照片</p>
                                            <viewer>
                                                <img
                                                    v-for="item in recordInfo.photo_src"
                                                    style="width:92px;height:92px;borderRadius: 5px;marginRight:20px;"
                                                    :src="item.url"
                                                    alt=""
                                                >
                                            </viewer>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
import { log } from 'util';
const columnNull = [
    {
        title: "食堂",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 9;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;
            }
            return obj;
        },
    },
    {
        title: "图片",
        dataIndex: "images",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "images" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "名称",
        dataIndex: "name",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "name" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "仓库",
        dataIndex: "deposit",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "deposit" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "批次号",
        dataIndex: "batchNum",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batchNum" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "单价/单位",
        dataIndex: "unit",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "unit" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "账面数量",
        dataIndex: "num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "num" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "盘点数量(斤)",
        dataIndex: "total",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "total" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "盘点结果",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    }
];

const dataNull = [];
const column = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "图片",
        dataIndex: "material_single_src",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_single_src" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位(/斤)",
        dataIndex: "order_unit_price",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "账面数量",
        dataIndex: "num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "num" }
    },
    {
        title: "盘点数量(斤)",
        dataIndex: "total",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "total" }
    },
    {
        title: "盘点结果",
        dataIndex: "checkResults",
        align: "center",
        scopedSlots: { customRender: "checkResults" }
    }
];

const dataMain = [];
for (let i = 0; i < 2; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
    }
    var imgList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
    ]
    dataMain.push({
        key: i.toString(),
        canteen_title: `食堂${i + 1}`,
        material_single_src: imgList[i],
        material_title: `包包白`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        order_unit_price: `15.00`,
        num: `200`,
    });
}
const columns = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "单号",
        dataIndex: "inventroy_sn",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "inventroy_sn" }
    },
    {
        title: "种类数量",
        dataIndex: "cate_num",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "cate_num" }
    },
    {
        title: "当前状态",
        dataIndex: "state_text",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "state_text" }
    },
    {
        title: "盘点人",
        dataIndex: "nickname",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "nickname" }
    },
    {
        title: "盘点时间",
        dataIndex: "inventory_time_text",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "inventory_time_text" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const dataMains = [];
for (let i = 0; i < 2; i++) {
    dataMains.push({
        key: i.toString(),
        canteen_title: `食堂${i + 1}`,
        inventroy_sn: `561656441566${i}`,
        cate_num: `1${i}`,
        state_text: `1${i}`,
        nickname: `阿${i}`,
        inventory_time_text: `2019-07-02    15:23`,
    });
}

const columnShowInfo = [
    {
        title: "序号",
        dataIndex: "orderNums",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNums" }
    },
    {
        title: "图片",
        dataIndex: "material_img_src_one",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_img_src_one" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位",
        dataIndex: "unit",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "unit" }
    },
    {
        title: "账面数量",
        dataIndex: "paper_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "paper_num" }
    },
    {
        title: "盘点数量",
        dataIndex: "inventory_num",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "inventory_num" }
    },
    {
        title: "盘点结果",
        dataIndex: "checkResults",
        align: "center",
        scopedSlots: { customRender: "checkResults" }
    }
];

const dataShowInfo = [];
for (let i = 0; i < 2; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
    }
    var imgList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
    ]
    dataShowInfo.push({
        key: i.toString(),
        orderNums: `${i + 1}`,
        material_img_src_one: imgList[i],
        material_title: `包包白`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        unit: `￥15.00/斤`,
        paper_num: `200斤`,
        inventory_num: `202.35斤`,
    });
}
export default {
    data() {
        return {
            activeKey: '1',
            loadingActive: false,
            moment,
            canteenId: '',
            storehouseId: '',
            loading: true,
            loadingRecord: true,
            column,
            dataMain,
            columnNull,
            dataNull,
            isDataNull: true,
            canteen: [],
            canteenShow: [],
            storehouse: [],
            valInfo: false,
            headers: {
                authorization: 'authorization-text',
            },
            // 食堂
            canteenRecordKey: '全部',
            canteenRecordId: 0,
            //上传图片配置，
            fileList: [],
            previewVisible: false,
            previewImage: "",
            // 关键字
            mxClassVal: "",
            mxClassValRecord: "",
            remark: "",
            rstate: '-1',
            // 日期
            startRecord: '',
            endRecord: '',
            startValue: null,
            endValue: null,
            endOpen: false,
            columns,
            dataMains,
            // 查看详情
            recordInfo: {},
            isShowInfo: false,
            loadingRecordInfo: true,
            dataShowInfoId: '',
            columnShowInfo,
            dataShowInfo,
            pagination: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            auditState: '',
            auditTitle: '',
            placeholder: '',
            auditCause: '',
            isAgree: false,
            isRefuse: false,
        }
    },
    created() {
        // 获取食堂
        this.getCanteen();
        // 获取盘点记录
        this.getInventoryRecord('', '', '', '', '');
    },
    watch: {
        startValue(val) {
            if (val) {
                this.startRecord = moment(val._d).format("YYYY-MM-DD");
            }
        },
        endValue(val) {
            if (val) {
                this.endRecord = moment(val._d).format("YYYY-MM-DD");
            }
        },
    },
    methods: {
        callback(e) {
            this.activeKey = e;
            this.loadingActive = true;
            if (e == '1') {
                this.getCanteen();
            } else {
                this.loadingRecord = true;
                this.getInventoryRecord('', '', '', '', '');
            }
        },
        // 食堂 选中
        onChange(e) {
            this.canteenId = e.target.value;
            this.getStorehouse(e.target.value);
            this.loading = true;
            this.getInventoryList('', e.target.value, '');
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.loadingRecord = true;
            this.getInventoryRecord('', '', '', '', '');
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteenShow = res.data.data;
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteenShow.splice(0, 0, data);
                    let arr = [];
                    this.canteenShow.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item);
                        }
                    });
                    this.canteen = arr;
                    this.canteenId = this.canteen[0].id;
                    this.loadingActive = false;
                    this.getStorehouse(this.canteen[0].id);
                    this.loading = true;
                    this.getInventoryList('', this.canteen[0].id, '')
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectChange(e) {
            this.canteenRecordKey = e;
            this.canteenRecordId = this.canteenShow[e - 1].id;
        },
        // 获取仓库
        getStorehouse(canteen_id) {
            this.$get("api/scale/storehouse?canteen_id=" + canteen_id).then(res => {
                if (res.data.code == 0) {
                    this.storehouse = res.data.data;
                    this.storehouseId = 0;
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.storehouse.splice(0, 0, data);
                } else {
                    console.log(22)
                }
            })
        },
        // 仓库 选中
        mxChangeHouse(e) {
            this.storehouseId = e;
            let id;
            if (e == 0) {
                id = '';
            } else {
                id = e;
            }
            this.loading = true;
            this.getInventoryList(id, this.canteenId, '');
        },
        // 搜索
        mxSeach() {
            let state = '';
            if (this.foodState == '-1') {
                state = ''
            } else {
                state = this.foodState
            }
            let id;
            if (this.storehouseId == 0) {
                id = '';
            } else {
                id = this.storehouseId;
            }
            this.loading = true;
            this.getInventoryList(id, this.canteenId, this.mxClassVal);
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 获取盘点列表
        getInventoryList(storehou_id, canteen_id, keyword) {
            this.$get("api/school/stock?storehou_id=" + storehou_id + "&canteen_id=" + canteen_id + "&keyword=" + keyword).then(res => {
                if (res.data.code == 0) {
                    res.data.data.forEach(item => {
                        item.isResult = false;
                        item.result_num = 0;
                        item.result_num_price = 0;
                        item.key = item.id;
                        if (!item.material_single_src) {
                            item.material_single_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.dataMain = res.data.data;
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 监听表中input的变化
        mxInpVal(e) {
            let data = {
                url: "api/school/stock",
                method: 'post',
                data: {
                    id: this.dataMain[e.target.dataset.index].id,
                    stock_num: e.target.value
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.dataMain[e.target.dataset.index].isResult = true;
                    this.dataMain[e.target.dataset.index].result_num = res.data.data.result_num;
                    this.dataMain[e.target.dataset.index].result_num_price = res.data.data.result_num_price;
                } else {
                    this.$message.success(res.data.msg);
                }
            })
        },
        //上传图片
        handleCancel() {
            this.previewVisible = false;
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        handleChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-2);
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });
            this.fileList = fileList;
        },
        // 提交审核
        mxSub() {
            this.valInfo = !this.valInfo;
        },
        submit(val) {
            this.valInfo = !this.valInfo;
            if (val == "OK") {
                let imgId = [];
                this.fileList.forEach(item => {
                    imgId.push(item.response.data.id);
                })
                let data = {
                    url: "api/school/submit/stock",
                    method: 'post',
                    data: {
                        remark: this.remark,
                        photo: imgId.join(',')
                    },
                };
                this.$apiAxiox(data).then((res) => {
                    if (res.data.code == 0) {
                        this.remark = '';
                        this.fileList = [];
                        this.$message.success('提交盘点审核成功');
                        let id;
                        if (this.storehouseId == 0) {
                            id = '';
                        } else {
                            id = this.storehouseId;
                        }
                        this.loading = true;
                        this.getInventoryList(id, this.canteenId, this.mxClassVal);
                    } else {
                        this.remark = '';
                        this.fileList = [];
                        this.$message.warning(res.data.msg);
                    }
                })
            }
        },
        // 获取盘点记录
        getInventoryRecord(keywords, canteen_id, state, begin_time, end_time) {
            let that = this;
            this.$get("api/school/inventory?page=" + this.pagination.current + "&keywords=" + keywords + "&canteen_id=" + canteen_id + "&state=" + state + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        // 审核状态 0未审核 1审核成功 2审核失败 3审核中
                        if (item.state == 0) {
                            item.examine = true;
                        } else {
                            item.examine = false;
                        }
                    });
                    this.dataMains = res.data.data.data;
                    
                    this.loadingRecord = false;
                    this.loadingActive = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 选择日期
        startDate(startValue) {
            const endValue = this.endValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        endDate(endValue) {
            const startValue = this.startValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        startOpenChange(open) {
            if (!open) {
                this.endOpen = true;
            }
        },
        endOpenChange(open) {
            this.endOpen = open;
        },
        // 搜索框
        emitEmptyRecord() {
            this.$refs.userNameInput.focus()
            this.mxClassValRecord = ''
        },
        //状态选择
        plChange(e) {
            this.rstate = e;
        },
        //清空搜索
        clearL() {
            this.mxClassValRecord = '';
            this.canteenRecordId = 0;
            this.canteenRecordKey = '全部';
            this.rstate = '-1';
            let state = '';
            this.startRecord = '';
            this.endRecord = '';
            this.startValue = null;
            this.endValue = null;
            this.loadingRecord = true;
            this.getInventoryRecord(this.mxClassValRecord, this.canteenRecordId, state, this.startRecord, this.endRecord);
        },
        // 搜索
        getPlist() {
            let state;
            if (this.rstate == '-1') {
                state = '';
            } else {
                state = this.rstate;
            }
            this.loadingRecord = true;
            this.getInventoryRecord(this.mxClassValRecord, this.canteenRecordId, state, this.startRecord, this.endRecord);
        },
        // 查看
        mxShowInventory(id) {
            this.isShowInfo = true;
            this.loadingRecordInfo = true;
            this.$get("api/school/inventory/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.batchs.forEach((item, index) => {
                        item.key = item.id;
                        item.orderNums = index + 1;
                    });
                    if (res.data.data.photo_src.length < 1) {
                        let imgArr = [
                            {
                                url: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        ]
                        res.data.data.photo_src = imgArr;
                    }
                    this.dataShowInfoId = res.data.data.id;
                    this.dataShowInfo = res.data.data.batchs;
                    this.recordInfo = res.data.data;
                    this.loadingRecordInfo = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 返回
        backShowInfo() {
            this.isShowInfo = false;
            let state;
            if (this.rstate == '-1') {
                state = '';
            } else {
                state = this.rstate;
            }
            this.loadingRecord = true;
            this.getInventoryRecord(this.mxClassValRecord, this.canteenRecordId, state, this.startRecord, this.endRecord);
        },
        // 同意
        mxAgree(val) {
            if (val == '拒绝') {
                this.auditState = '2';
                this.auditTitle = '拒绝原因';
                this.placeholder = '请认真核对';
            } else {
                this.auditState = '1';
                this.auditTitle = '审核备注';
                this.placeholder = '快及时处理吧';
            }
            this.isAgree = true;
        },
        mxOkAgree() {
            this.isAgree = false;
            let data = {
                url: "api/school/inventory/" + this.dataShowInfoId,
                method: 'put',
                data: {
                    audit_type: this.auditState,
                    audit_remark: this.auditCause
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.auditState = '';
                    this.auditCause = '';
                    this.$message.success(res.data.msg);
                    this.isShowInfo = false;
                    let state;
                    if (this.rstate == '-1') {
                        state = '';
                    } else {
                        state = this.rstate;
                    }
                    this.loadingRecord = true;
                    this.getInventoryRecord(this.mxClassValRecord, this.canteenRecordId, state, this.startRecord, this.endRecord);
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        mxCelAgree() {
            this.isAgree = false;
            this.auditCause = '';
        },
        // 拒绝
        mxRefuse() {
            this.isRefuse = true;
        },
        mxOkRefuse() {
            this.$message.success('库存报损审核成功');
            this.isRefuse = false;
        },
        mxCelRefuse() {
            this.isRefuse = false;
        },
    },
}
</script>

<style lang="less" scoped>
.mx_form {
    margin: 30px 0;
    display: flex;
    align-items: center;
}
.mx_btnbg {
    margin: 0 10px;
}
.tabBox {
    display: flex;
    align-items: center;
}
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.components-input-demo-presuffix {
    display: flex;
    align-items: center;
    margin: 30px 0;
}
.hmTxt {
    margin: 0 10px 0 0;
}
.seachBtn {
    margin-left: 40px;
}
.seachBox {
    width: 245px;
}
.clearfix {
    display: flex;
}
</style>