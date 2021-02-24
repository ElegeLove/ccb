<template>
    <div id="mx_foodLibrary">
        <div v-if="!isShowInfo">
            <a-form
                layout="inline"
                class="mx_form mx_staff"
            >
                <a-form-item label="食堂：">
                    <a-select
                        :value="canteenSampleKey"
                        style="width:150px;"
                        @change="selectSampleChange"
                    >
                        <a-select-option
                            v-for="(item,index) in canteen"
                            :key="index+1"
                        >{{item.title}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
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
            <a-form
                layout="inline"
                class="mx_form mx_staff"
            >
                <a-form-item label="仓库：">
                    <a-select
                        :value="storehouseKey"
                        style="width:150px;marginRight:60px;"
                        :disabled="isDisabled"
                        @change="(e)=>{storehouseKey = e;storehouseId = storehouseList[e - 1].id;}"
                    >
                        <a-select-option
                            v-for="(item,index) in storehouseList"
                            :key="index+1"
                        >{{item.title}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="供应商：">
                    <a-select
                        :value="supplierKey"
                        style="width:150px;marginRight:60px;"
                        @change="(e)=>{supplierKey = e;supplierId = supplierList[e - 1].supplier_id;}"
                    >
                        <a-select-option
                            v-for="(item,index) in supplierList"
                            :key="index+1"
                        >{{item.title}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="食材状态：">
                    <a-select
                        style="width: 120px"
                        v-model="foodState"
                    >
                        <a-select-option value="-1">全部</a-select-option>
                        <a-select-option value="0">正常</a-select-option>
                        <a-select-option value="1">已过期</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
            <div class="mx_operate">
                <a-button
                    type="primary"
                    style="marginRight:30px;background: #eee;color:#000;border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;"
                    @click="mxFoodOut"
                >食材出库</a-button>
                <a-modal
                    title="食材出库"
                    centered
                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                    v-model="isFoodOut"
                    @cancel="mxFoodOutCel"
                    @ok="mxOkFoodOut"
                    okText="确认"
                    cancelText="取消"
                >
                    <div class="mx_model">
                        即将跳转至出库列表页面
                    </div>
                </a-modal>
                <a-button
                    type="primary"
                    style="background: #eee;color:#000;border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;"
                    @click="mxLongWarranty"
                >延长保质期</a-button>
                <a-modal
                    title="食材延保"
                    centered
                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                    v-model="isLongWarranty"
                    @cancel="mxLongWarrantyCel"
                    @ok="mxOkLongWarranty"
                    okText="确认"
                    cancelText="取消"
                >
                    <div class="mx_model">
                        <div>
                            <span>延长时间：</span>
                            <a-input
                                v-model="extendTimes"
                                style="width:150px; marginRight:10px;"
                            />
                            <!-- <span style="position: absolute;left:376px;lineHeight:32px;">天</span> -->
                            <a-select
                                :defaultValue="early"
                                style="width:80px;"
                                @change="(e)=>{early = e;}"
                            >
                                <a-select-option value="d">天</a-select-option>
                                <a-select-option value="H">小时</a-select-option>
                            </a-select>
                            <p style="marginTop:10px;"><span style="color:red;">*</span>延保后预警提醒时间也会一起延长，请留意</p>
                        </div>
                    </div>
                </a-modal>
                <span class="mx_btns">
                    <span class="mx_outPoeration">
                        <a-icon
                            class="mx_icon"
                            type="printer"
                        />
                        <span>打印</span>
                    </span>
                    <a-divider
                        type="vertical"
                        style="background: #000;"
                    />
                    <span class="mx_outPoeration">
                        <a-icon
                            class="mx_icon"
                            type="printer"
                        />
                        <span>导出</span>
                    </span>
                </span>
            </div>
            <!-- 表格 -->
            <a-skeleton
                :loading="loading"
                active
                :paragraph="{rows: 20}"
            >
                <a-table
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :columns="healthyColumn"
                    :dataSource="healthyList"
                    bordered
                    :pagination="pagination"
                    @change="healthyTableChange"
                >
                    <div
                        style="display: flex;justify-content: space-around;"
                        slot="material_single_src"
                        slot-scope="text, record,index"
                    >
                        <viewer>
                            <img
                                style="width:60px;height:60px;"
                                :src="text"
                            >
                        </viewer>
                    </div>
                    <template
                        slot="operation"
                        slot-scope="text, record, index"
                    >
                        <div class="editable-row-operations">
                            <div>
                                <a
                                    class="mx_operation mx_color"
                                    @click="mxShowInfo(record.storage_id)"
                                >查看食材</a>
                            </div>
                        </div>
                    </template>
                </a-table>
            </a-skeleton>
        </div>
        <!-- 查看详情 -->
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
            <!-- main -->
            <a-skeleton
                :loading="loadingInfo"
                active
                :paragraph="{rows: 20}"
            >
                <div>
                    <div
                        class="mx_main"
                        style="marginBottom:60px;position: relative;"
                    >
                        <div style="display: flex;justify-content: space-between;align-items: center;">
                            <div
                                class="mx_title"
                                style="margin:0;"
                            >
                                <div style="margin-right:56px;"><span>{{showListInfo.supplier_title}}</span></div>
                                <div style="margin-right:56px;">所属订单号：{{showListInfo.order_no}}</div>
                                <div><span style="margin-right:18px;">{{showListInfo.created_at}}</span></div>
                            </div>
                        </div>
                        <div class="mx_list">
                            <img
                                :src="showListInfo.material_single_src"
                                alt=""
                            >
                            <span style="margin-right:56px;">{{showListInfo.material_title}}</span>
                            <span style="margin-right:56px;">&yen;{{showListInfo.order_unit_price}}</span>
                            <span style="margin-right:56px;">{{showListInfo.order_num}}</span>
                            <span style="margin-right:56px;">总价：&yen;{{showListInfo.total_price}}</span>
                            <span style="fontSize:16px;fontWeight:bold;">批次号：{{showListInfo.batch_num}}</span>
                        </div>
                        <div style="display: flex;align-items: center;marginLeft:340px;">
                            <p style="marginRight:50px;">预警时间：<span>{{showListInfo.yj_str}}</span></p>
                            <p>过期时间：<span>{{showListInfo.gq_str}}</span></p>
                        </div>
                        <div
                            style="display: flex;justify-content: center;paddingTop:44px;marginTop:26px;borderTop:1px solid #e4e4e4;"
                            v-if="isOpen"
                        >
                            <div style="display: flex;">
                                <div>
                                    <p>品牌名称：<span>{{showListInfo.cargo_title}}</span></p>
                                    <p>生产厂家：<span>{{showListInfo.factory}}</span></p>
                                    <p>产&emsp;&emsp;地：<span>{{showListInfo.source}}</span></p>
                                </div>
                                <div style="margin:0 75px 0 90px;">
                                    <p>生产日期：<span>{{moment(showListInfo.product_date).format("YYYY年MM月DD日")}}</span></p>
                                    <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{showListInfo.shelf_life}}天</span></p>
                                    <p>贮存方式：<span>{{showListInfo.storage_method_str}}</span></p>
                                </div>
                                <div>
                                    <p>包装方式：<span>{{showListInfo.pack_str}}</span></p>
                                    <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>{{showListInfo.net_weight}}</span></p>
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;right:20px;top:10px;">
                            <span v-if="showListInfo.overdue == 0">正常</span>
                            <span
                                v-else
                                style="color:red;"
                            >已过期</span>
                        </div>
                        <div
                            style="color: #1890ff;position: absolute;right:20px;bottom:10px;cursor: pointer;"
                            @click="()=>{isOpen = !isOpen}"
                        >
                            展开商品信息
                            <a-icon
                                v-if="isOpen"
                                type="up"
                            />
                            <a-icon
                                v-else
                                type="down"
                            />
                        </div>
                    </div>
                    <div class="extendPeriod">
                        <p style="fontSize:16px;fontWeight:bold;">延保记录</p>
                        <div
                            class="extendPeriodList"
                            style="display: flex;align-items: center;padding:20px 0 16px;"
                            v-for="items in showListInfo.prolong"
                        >
                            <p style="margin:0;">延长保质期：{{items.prolong}}{{items.prolong_unit}}</p>
                            <p style="margin:0 64px 0 77px;">操 作 人：{{items.username}}</p>
                            <p style="margin:0;">操作时间：{{items.handle_time}}</p>
                            <p style="margin:0 0 0 72px;">延保前过期时间：{{items.previous_time_str}}</p>
                        </div>
                    </div>
                    <div style="width:100%;height:14px;background: #f7f7f7;margin:36px 0;"></div>
                    <a-timeline>
                        <a-timeline-item
                            style="position: relative;marginLeft:150px;"
                            v-for="item in showListInfo.record"
                        >
                            <p style="position: absolute;left:-150px;">{{item.created_at}}</p>
                            <div style="border:2px solid #bcbcbc;padding:10px 16px 12px;borderRadius: 5px;">
                                <a-row style="fontWeigh:bold;color:#000;">
                                    <p style="fontSize:16px;fontWeight:bold;">{{item.record_state_str}}</p>
                                    <a-col :span="8">
                                        <div v-if="item.state == 1">
                                            <p>入库方式：<span>{{item.record_state_str}}</span></p>
                                            <p>存放仓库：<span>{{item.storehou_title}}</span></p>
                                            <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{showListInfo.shelf_life}}天</span></p>
                                            <!-- <p>延长保质期：<span>3天</span></p> -->
                                            <p>操&nbsp;&nbsp;作&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>操作时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 正常 -->
                                        <div v-if="item.out_style == 101">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>出库数量：<span>{{item.number}}斤</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 其他 -->
                                        <div v-if="item.out_style == 0">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>出库数量：<span>{{item.number}}斤</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>使用日期：<span>{{item.user_time_str}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 报损 -->
                                        <div v-if="item.out_style == 102">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>报损数量：<span>{{item.number}}斤</span></p>
                                            <p>报损原因：<span>{{item.damage_reason}}</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 移库 -->
                                        <div v-if="item.out_style == 104">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>移库数量：<span>{{item.number}}斤</span></p>
                                            <p>移入位置：<span>{{showListInfo.canteen_title}}</span>&nbsp;&nbsp;<span>{{item.storehou_title}}</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 退货 -->
                                        <div v-if="item.out_style == 103">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>退货数量：<span>{{item.number}}斤</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>退货单单号：<span>{{item.return_on}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- <div style="marginTop:30px;">
                                        <p>盘点盘亏：<span>-50.20斤</span></p>
                                        <p>盘点备注：<span>无</span></p>
                                        <p>审核状态：<span>审核通过</span>&nbsp;&nbsp;<span>审核中</span></p>
                                        <p>盘&nbsp;&nbsp;点&nbsp;&nbsp;人：<span>王阿航</span></p>
                                        <p>盘点时间：<span>2019-06-23</span>&nbsp;&nbsp;<span>13:26</span></p>
                                    </div>
                                    <p style="marginTop:30px;">品牌名称：<span>阿航的白菜</span></p>
                                    <p>生产厂家：<span>重庆餐餐保科技有限公司</span></p>
                                    <p>产&emsp;&emsp;地：<span>重庆</span></p>
                                    <p>生产日期：<span>2019-06-23</span></p>
                                    <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>60天</span></p>
                                    <p>贮存方式：<span>常温贮存</span></p>
                                    <p>包装方式：<span>散装</span></p>
                                    <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>--</span></p> -->
                                    </a-col>
                                    <a-col :span="8">
                                        <div>
                                            <p>食材照片</p>
                                            <viewer>
                                                <img
                                                    style="width:92px;height:92px;marginRight:30px;"
                                                    v-for="itemImg in item.photo_src"
                                                    :src="itemImg.url"
                                                    alt=""
                                                >
                                            </viewer>
                                        </div>
                                    </a-col>
                                    <a-col
                                        :span="8"
                                        v-if="item.out_style != 102 && item.out_style != 103 && item.out_style != 104"
                                    >
                                        <div>
                                            <p>票据照片</p>
                                            <viewer>
                                                <img
                                                    style="width:92px;height:92px;marginRight:30px;"
                                                    v-for="itemImgs in item.bill_src"
                                                    :src="itemImgs.url"
                                                    alt=""
                                                >
                                            </viewer>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </div>
            </a-skeleton>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
const healthyColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "5%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "图片",
        dataIndex: "material_single_src",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "material_single_src" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "4%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "分类所属",
        dataIndex: "material_classify_src",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "material_classify_src" }
    },
    {
        title: "单位/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "order_num",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "order_num" }
    },
    {
        title: "总价",
        dataIndex: "total_price",
        align: "center",
        width: "4%",
        scopedSlots: { customRender: "total_price" }
    },
    {
        title: "仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "5%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "供应商",
        dataIndex: "supplier_title",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "supplier_title" }
    },
    {
        title: "预警时间",
        dataIndex: "yj_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "yj_str" }
    },
    {
        title: "过期时间",
        dataIndex: "gq_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "gq_str" }
    },
    {
        title: "食材状态",
        dataIndex: "overdue_str",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "overdue_str" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const healthyList = [];
for (let i = 0; i < 10; i++) {
    var state, canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    if (i % 2 == 0) {
        state = "正常"
    } else {
        state = "已过期"
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
    healthyList.push({
        key: i.toString(),
        canteen_title: `${canteen}`,
        material_single_src: imgList[i],
        material_title: `包包白${i}`,
        material_classify_src: `海鲜鱼类${i}`,
        order_unit_price: `￥15.00/斤`,
        order_num: `200斤`,
        total_price: `￥500.00`,
        storehou_title: `仓库${i}`,
        batch_num: `6546546${i}`,
        supplier_title: `张三的${i}`,
        yj_str: `2019-07-0${i}   15:2${i}`,
        gq_str: `2019-0${i}-0${i}   15:2${i}`,
        overdue_str: `${state}`,
    });
}
export default {
    data() {
        return {
            loading: true,
            loadingInfo: true,
            moment,
            healthyColumn,
            healthyList,
            selectedRowKeys: [],
            selectedRowList: [],
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
            isFoodOut: false,
            isLongWarranty: false,
            isShowInfo: false,
            showListInfo: {},
            isOpen: false,
            // 食堂
            canteen: [],
            canteenShow: [],
            canteenSampleKey: '全部',
            canteenSampleId: 0,
            // 关键字
            mxClassVal: "",
            // 仓库
            storehouseList: [],
            storehouseKey: '全部',
            storehouseId: 0,
            isDisabled: true,
            // 供应商
            supplierList: [],
            supplierKey: '全部',
            supplierId: 0,
            // 食材状态
            foodState: '-1',
            // 延长保质期
            extendTimes: '',
            early: 'd',
        }
    },
    created() {
        // 获取食堂
        this.getCanteen();
        // 获取供应商
        this.getSupplier();
        // 获取食材列表
        this.getFoodList('', '', '', '', '');
    },
    methods: {
        // 选中
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRowList = selectedRows;
        },
        // 表格变化
        healthyTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 获取食材列表
        getFoodList(canteen_id, keyword, supplier_id, storehou_id, state) {
            var that = this;
            this.$get("api/school/foods?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&keyword=" + keyword + "&supplier_id=" + supplier_id + "&storehou_id=" + storehou_id + "&state=" + state).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.batch_id
                        if (!item.material_single_src) {
                            itemclider.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.healthyList = res.data.data.data;
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteen.splice(0, 0, data)
                    let arr = []
                    this.canteen.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item)
                        }
                    });
                    this.canteenShow = arr
                } else {
                    console.log(22)
                }
            })
        },
        // 获取供应商
        getSupplier() {
            this.$get("api/school/supplier", {}).then(res => {
                if (res.data.code == 0) {
                    this.supplierList = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.supplierList.splice(0, 0, data);
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectSampleChange(e) {
            this.canteenSampleKey = e;
            this.canteenSampleId = this.canteen[e - 1].id;
            this.storehouseKey = '全部';
            this.storehouseId = 0;
            if (e == 1) {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
            this.$get("api/scale/storehouse?canteen_id=" + this.canteenSampleId, {}).then(res => {
                if (res.data.code == 0) {
                    this.storehouseList = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.storehouseList.splice(0, 0, data);
                } else {
                    console.log(22)
                }
            })
        },
        // 搜索
        mxSeach() {
            let state = '';
            if (this.foodState == '-1') {
                state = ''
            } else {
                state = this.foodState
            }
            this.loading = true;
            this.getFoodList(this.canteenSampleId, this.mxClassVal, this.supplierId, this.storehouseId, state);
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        //查看
        mxShowInfo(id) {
            this.loadingInfo = true;
            this.getDataInfo(id);
            this.isShowInfo = true;
        },
        // 获取详情
        getDataInfo(id) {
            this.$get("api/school/foods/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.record.forEach(item => {
                        if (item.photo_src == '') {
                            let imgArr = [];
                            let url, obj;
                            obj = {
                                url: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                            imgArr.push(obj)
                            item.photo_src = imgArr;
                        }
                        if (item.bill_src == '') {
                            let imgArr = [];
                            let url, obj;
                            obj = {
                                url: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                            imgArr.push(obj)
                            item.bill_src = imgArr;
                        }
                    })
                    this.showListInfo = res.data.data;
                    this.loadingInfo = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 返回
        backShowInfo() {
            this.isShowInfo = false;
        },
        // 食材出库
        mxFoodOut() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning('请选择食材');
            } else if (this.selectedRowKeys.length == 1) {
                this.isFoodOut = true;
            } else {
                let stang = false;
                let stangVal = '';
                this.selectedRowList.some(item => {
                    if (stangVal == '') {
                        stangVal = item.canteen_id;
                    } else {
                        if (stangVal == item.canteen_id) {
                            stang = true;
                        } else {
                            stang = false;
                            this.$message.warning('请选择单个食堂下食材出库');
                            return true;
                        }
                    }
                });
                if (stang) {
                    this.isFoodOut = true;
                } else {
                    this.isFoodOut = false;
                }
            }
        },
        mxFoodOutCel() {
            this.isFoodOut = false;
        },
        mxOkFoodOut() {
            this.isFoodOut = false;
            let arr = [];
            let arr1 = [];
                let canteen_id;
            this.selectedRowList.forEach(item => {
                arr.push(item.record_id);
                arr1.push(parseFloat(item.order_num));
                canteen_id = item.canteen_id;
            })
            this.$get("api/school/outfirtstep?num=" + arr1.join(',') + '&id=' + arr.join(','), {}).then(res => {
                if (res.data.code == 0) {
                    this.$router.push({
                        path: "/mxOutLibrary",
                        query: {
                            canteen_id: canteen_id
                        }
                    });
                } else {
                    console.log(22)
                }
            })
        },
        // 延长保质期
        mxLongWarranty() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning('请选择食材');
            } else {
                this.isLongWarranty = true;
            }
        },
        mxLongWarrantyCel() {
            this.isLongWarranty = false;
        },
        mxOkLongWarranty() {
            this.isLongWarranty = false;
            let data = {
                url: "api/school/foods/" + this.selectedRowKeys.join(','),
                method: 'put',
                data: {
                    expiry_unit: this.early,
                    expiry: this.extendTimes,
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.$message.success('延长保质期成功');
                    this.early = 'd';
                    this.extendTimes = '';
                    this.selectedRowKeys = [];
                    this.loading = true;
                    this.getFoodList('', '', '', '', '');
                } else {
                    this.$message.success(res.data.msg);
                }
            })

        },
    },
}
</script>

<style lang="less" scoped>
.mx_staff {
    margin: 20px 0;
}
.mx_operate {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .mx_switch {
        margin: 0 80px;
    }
    .mx_btns {
        background: #eee;
        padding: 0 10px;
        margin-left: 80px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        color: #000;
        line-height: 30px;
        .mx_outPoeration {
            cursor: pointer;
            .mx_icon {
                margin-right: 6px;
            }
        }
    }
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
.mx_main {
    padding: 18px 28px;
    margin: 4px;
    box-shadow: 0px 0px 8px 0px #ccc;
    border-radius: 4px;
    margin-top: 48px;
    .mx_title {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
    }
    .mx_list {
        display: flex;
        align-items: center;
        padding: 16px 0;
        img {
            width: 77px;
            height: 77px;
            margin-right: 56px;
        }
        .mx_left {
            display: inline-block;
            font-weight: bold;
        }
    }
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
.extendPeriod .extendPeriodList:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
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
</style>