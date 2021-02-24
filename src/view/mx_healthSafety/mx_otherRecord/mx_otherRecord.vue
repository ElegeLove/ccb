<template>
    <div id="mxOtherRecord">
        <a-tabs defaultActiveKey="1">
            <a-tab-pane
                tab="防疫记录"
                key="1"
            >
                <!-- main -->
                <div v-if="!isAddSafety && !isShowSafety && !isUpdataSafety">
                    <a-form
                        layout="inline"
                        class="mx_form mx_staff"
                    >
                        <a-form-item label="食堂：">
                            <a-select
                                :value="canteenKey"
                                style="width:150px;"
                                @change="selectChange"
                            >
                                <a-select-option
                                    v-for="(item,index) in canteen"
                                    :key="index+1"
                                >{{item.title}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                    <a-form
                        layout="inline"
                        class="mx_form"
                    >
                        <a-form-item label="日期：">
                            <a-date-picker
                                :disabledDate="safetyStartDate"
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                v-model="safetyStartValue"
                                placeholder="选择日期"
                                @openChange="safetyStartOpenChange"
                            />
                            <div class="mx_divide">—</div>
                            <a-date-picker
                                :disabledDate="safetyEndDate"
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="选择日期"
                                v-model="safetyEndValue"
                                :open="endOpenSafety"
                                @openChange="safetyEndOpenChange"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                class="mx_btnbg"
                                type="primary"
                                html-type="submit"
                                @click="mxInquiry"
                            >查询</a-button>
                            <a-button @click="mxReset">重置</a-button>
                        </a-form-item>
                    </a-form>
                    <div class="mx_operate">
                        <a-button
                            type="primary"
                            icon="form"
                            @click="mxAddSafety"
                        >添加记录</a-button>
                        <div class="mx_switch">
                            <span>公示到家长端：</span>
                            <a-switch
                                checkedChildren="开"
                                unCheckedChildren="关"
                                defaultChecked
                            />
                        </div>
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
                        :title='false'
                        :paragraph="{rows: 20}"
                    >
                        <a-table
                            :columns="safetyColumn"
                            :dataSource="safetyList"
                            bordered
                            :pagination="pagination"
                            @change="safetyTableChange"
                        >
                            <div
                                style="display: flex;justify-content: space-around;"
                                slot="photos_src"
                                slot-scope="text, record,index"
                            >
                                <viewer>
                                    <img
                                        v-for="item in record.photos_src"
                                        style="width:60px;heigth:60px;margin:0 10px;"
                                        :src="item.url"
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
                                            @click="mxShowSafety(record.id)"
                                        >查看</a>
                                        <a
                                            class="mx_operation mx_color"
                                            @click="mxUpdateSafety(record.id)"
                                        >编辑</a>
                                        <a
                                            class="mx_operation mx_color"
                                            @click="mxDelSafety(record.id)"
                                        >删除</a>
                                        <a-modal
                                            title="删除确认"
                                            centered
                                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                            v-model="isDelSafety"
                                            @cancel="mxSafetyCel"
                                            @ok="mxDelSafetysure"
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <div class="mx_model">
                                                <div class="mx_model_mainDel">
                                                    是否确定删除该条安全巡检记录？
                                                </div>
                                            </div>
                                        </a-modal>
                                    </div>
                                </div>
                            </template>
                        </a-table>
                    </a-skeleton>
                </div>
                <!-- 添加记录 -->
                <div v-if="isAddSafety">
                    <!-- 头部 -->
                    <a-breadcrumb separator=" ">
                        <a-breadcrumb-item>
                            <a-icon
                                @click="backAddSafety"
                                class="mx_header_icon"
                                type="arrow-left"
                            />
                        </a-breadcrumb-item>
                        <a-breadcrumb-item class="mx_header_text">添加记录</a-breadcrumb-item>
                    </a-breadcrumb>
                    <a-modal
                        title="确认返回"
                        centered
                        :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                        v-model="isGoSafety"
                        @cancel="mxCancelSafety"
                        @ok="mxGoSafety"
                        okText="确认"
                        cancelText="取消"
                    >
                        <div class="mx_model">
                            <div class="mx_model_mainDel">
                                您还未保存所添加记录，是否继续返回
                            </div>
                        </div>
                    </a-modal>
                    <!-- main -->
                    <a-form
                        :form="form"
                        @submit="safetySubmit"
                    >
                        <a-row class="mx_main">
                            <a-col :span="8">
                                <a-form-item label="所属食堂">
                                    <a-select
                                        style="width:300px;"
                                        placeholder="选择所属食堂"
                                        v-decorator="[
                                            'canteen',
                                            {rules: [{ required: true, message: '请选择所属食堂' }]}
                                        ]"
                                    >
                                        <a-select-option
                                            v-for="(item,index) in canteenShow"
                                            :key="item.id"
                                        >{{item.title}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="事件名称">
                                    <a-input
                                        placeholder="填写事件名称"
                                        style="width:300px;"
                                        v-decorator="[
                                            'title',
                                            {rules: [{ required: true, message: '请填写事件名称' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="执行点">
                                    <a-input
                                        placeholder="填写执行点名称"
                                        style="width:300px;"
                                        v-decorator="[
                                            'loc',
                                            {rules: [{ required: true, message: '请填写执行点名称' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="使用物品">
                                    <a-input
                                        placeholder="填写使用物品名称"
                                        style="width:300px;"
                                        v-decorator="[
                                            'manner',
                                            {rules: [{ required: true, message: '请填写使用物品名称' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="详情说明">
                                    <textarea
                                        style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                        cols="76"
                                        rows="5"
                                        placeholder="填写详情说明"
                                        v-decorator="[
                                            'desc',
                                            {rules: [{ required: true, message: '请填写详情说明' }]}
                                        ]"
                                    ></textarea>
                                </a-form-item>
                                <a-form-item label="执行时间">
                                    <a-date-picker
                                        style="margin-right: 6px;"
                                        placeholder="选择执行时间"
                                        @change="onChangeAddData"
                                        :defaultValue="moment(addData, 'YYYY-MM-DD')"
                                    />
                                    <a-time-picker
                                        @change="onChangeAddTime"
                                        :defaultValue="moment(addTime, 'HH:mm')"
                                        format="HH:mm"
                                    />
                                </a-form-item>
                                <a-form-item label="执行人">
                                    <a-input
                                        placeholder="填写执行人姓名"
                                        style="width:300px;"
                                        v-decorator="[
                                            'person',
                                            {rules: [{ required: true, message: '请填写执行人姓名' }]}
                                        ]"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="16">
                                <a-form-item label="事件照片">
                                    <div v-decorator="[
                                                        '事件照片',
                                                        {rules: [{ required: true, message: '请长传至少一张照片' }]}
                                                    ]">
                                        <div class="clearfix">
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                listType="picture-card"
                                                :fileList="safetyAddList"
                                                @preview="safetyPreview"
                                                @change="safetyAddChange"
                                            >
                                                <div v-if="safetyAddList.length < 3">
                                                    <a-icon type="plus" />
                                                </div>
                                            </a-upload>
                                            <a-modal
                                                :visible="safetyAddVisible"
                                                :footer="null"
                                                @cancel="safetyAddCancel"
                                            >
                                                <img
                                                    alt="example"
                                                    style="width: 100%"
                                                    :src="safetyAddImage"
                                                />
                                            </a-modal>
                                        </div>
                                        <a-upload
                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                            :fileList="safetyAddList"
                                            @preview="safetyPreview"
                                            @change="safetyAddChange"
                                        >
                                            <a-button>
                                                <a-icon type="upload" />上传图片
                                            </a-button>
                                        </a-upload>
                                    </div>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                            >立即添加</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <!-- 编辑记录 -->
                <div v-if="isUpdataSafety">
                    <!-- 头部 -->
                    <a-breadcrumb separator=" ">
                        <a-breadcrumb-item>
                            <a-icon
                                @click="backUpdataSafety"
                                class="mx_header_icon"
                                type="arrow-left"
                            />
                        </a-breadcrumb-item>
                        <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                    </a-breadcrumb>
                    <!-- main -->
                    <a-skeleton
                        :loading="loadingUpdataOther"
                        active
                        :title='false'
                        :paragraph="{rows: 20}"
                    >
                        <a-form
                            :form="formUpdataOther"
                            @submit="safetyUpdataSubmit"
                        >
                            <a-row class="mx_main">
                                <a-col :span="8">
                                    <a-form-item label="所属食堂">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择所属食堂"
                                            v-decorator="[
                                                'canteen',
                                                {initialValue: otherUpdata.canteen,rules: [{ required: true, message: '请选择所属食堂' }]}
                                            ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in canteenShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="事件名称">
                                        <a-input
                                            placeholder="填写执行点名称"
                                            style="width:300px;"
                                            v-decorator="[
                                            'title',
                                            {initialValue: otherUpdata.title,rules: [{ required: true, message: '请填写执行点名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="执行点">
                                        <a-input
                                            placeholder="填写执行点名称"
                                            style="width:300px;"
                                            v-decorator="[
                                            'loc',
                                            {initialValue: otherUpdata.loc,rules: [{ required: true, message: '请填写执行点名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="使用物品">
                                        <a-input
                                            placeholder="填写使用物品名称"
                                            style="width:300px;"
                                            v-decorator="[
                                            'manner',
                                            {initialValue: otherUpdata.manner,rules: [{ required: true, message: '请填写使用物品名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="详情说明">
                                        <textarea
                                            style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                            cols="76"
                                            rows="5"
                                            placeholder="填写详情说明"
                                            v-decorator="[
                                            'desc',
                                            {initialValue: otherUpdata.desc,rules: [{ required: true, message: '请填写详情说明' }]}
                                        ]"
                                        ></textarea>
                                    </a-form-item>
                                    <a-form-item label="执行时间">
                                        <a-date-picker
                                            style="margin-right: 6px;"
                                            placeholder="选择执行时间"
                                            @change="onChangeDataUpdataOther"
                                            :value="moment(updataDataOther, 'YYYY-MM-DD')"
                                        />
                                        <a-time-picker
                                            @change="onChangeTimeUpdataOther"
                                            :value="moment(updataTimeOther, 'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="执行人">
                                        <a-input
                                            placeholder="填写执行人姓名"
                                            style="width:300px;"
                                            v-decorator="[
                                            'person',
                                            {initialValue: otherUpdata.person,rules: [{ required: true, message: '请填写执行人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="事件照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="otherUpdata.safetyUpdataList"
                                                    @preview="safetyUpdataPreview"
                                                    @change="safetyUpdataChange"
                                                >
                                                    <div v-if="otherUpdata.safetyUpdataList.length < 3">
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="safetyUpdataVisible"
                                                    :footer="null"
                                                    @cancel="safetyUpdataCancel"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="safetyUpdataImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="otherUpdata.safetyUpdataList"
                                                @preview="safetyUpdataPreview"
                                                @change="safetyUpdataChange"
                                            >
                                                <a-button>
                                                    <a-icon type="upload" />更换图片
                                                </a-button>
                                            </a-upload>
                                        </div>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item>
                                <a-button
                                    type="primary"
                                    html-type="submit"
                                >更新保存</a-button>
                            </a-form-item>
                        </a-form>
                    </a-skeleton>
                </div>
                <!-- 查看详情 -->
                <div v-if="isShowSafety">
                    <!-- 头部 -->
                    <a-breadcrumb separator=" ">
                        <a-breadcrumb-item>
                            <a-icon
                                @click="backShowSafety"
                                class="mx_header_icon"
                                type="arrow-left"
                            />
                        </a-breadcrumb-item>
                        <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                    </a-breadcrumb>
                    <!-- main -->
                    <a-skeleton
                        :loading="loadingShow"
                        active
                        :title='false'
                        :paragraph="{rows: 20}"
                    >
                        <div class="mx_main">
                            <a-row>
                                <a-col :span="8">
                                    <p>
                                        食&emsp;&emsp;堂：
                                        <span>{{showSafetyList.canteen_str}}</span>
                                    </p>
                                    <p>
                                        事件名称：
                                        <span>{{showSafetyList.title}}</span>
                                    </p>
                                    <p>
                                        执&nbsp;&nbsp;行&nbsp;&nbsp;点：
                                        <span>{{showSafetyList.loc}}</span>
                                    </p>
                                    <p>
                                        使用物品：
                                        <span>{{showSafetyList.manner}}</span>
                                    </p>
                                </a-col>
                                <a-col :span="16">
                                    <div class="clearfix">
                                        <p>事件照片</p>
                                        <div>
                                            <viewer>
                                                <img
                                                    style="width:100px;height:100px;margin-right:30px;"
                                                    v-for="item in showSafetyList.photos_src"
                                                    :src='item.url'
                                                    alt
                                                    srcset
                                                />
                                            </viewer>
                                        </div>
                                    </div>
                                </a-col>
                            </a-row>
                            <p>
                                详情说明：
                                <span>{{showSafetyList.desc}}</span>
                            </p>
                            <p>
                                执行时间：
                                <span>{{showSafetyList.time_str}}</span>
                            </p>
                            <p>
                                执&nbsp;&nbsp;行&nbsp;&nbsp;人：
                                <span>{{showSafetyList.person}}</span>
                            </p>
                            <p>
                                记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                <span>{{showSafetyList.sponsor_str}}</span>
                            </p>
                            <p>
                                记录时间：
                                <span>{{showSafetyList.created_at_str}}</span>
                            </p>
                            <div class="mx_receipt">
                                <p>防疫记录小票<a @click="mxPrintingOther">（点击打印）</a></p>
                                <div class="mx_receipt_main">
                                    <p class="mx_receipt_main_header">防疫记录小票</p>
                                    <img
                                        src="../../../assets/border_bottom.png"
                                        alt=""
                                    >
                                    <p>食&emsp;&emsp;堂：{{showSafetyList.canteen_str}}</p>
                                    <p>事件名称：{{showSafetyList.title}}</p>
                                    <p>执&nbsp;&nbsp;行&nbsp;&nbsp;点：{{showSafetyList.loc}}</p>
                                    <p>使用物品：{{showSafetyList.manner}}</p>
                                    <p>执行日期：{{moment(showSafetyList.time_str).format("YYYY-MM-DD")}}</p>
                                    <p>执&nbsp;&nbsp;行&nbsp;&nbsp;人：{{showSafetyList.person}}</p>
                                    <img
                                        src="../../../assets/border_bottom.png"
                                        alt=""
                                    >
                                    <div style="display: flex;align-items: center;">
                                        <p>扫描二维码即可查看
                                            样详情及图片</p>
                                        <img
                                            style="width:54px;height:54px;"
                                            src="../../../assets/erweima.jpg"
                                            alt=""
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-skeleton>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import moment from 'moment';
// 安全巡检
const safetyColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "事件名称",
        dataIndex: "name",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "执行点",
        dataIndex: "loc",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "loc" }
    },
    {
        title: "使用物品",
        dataIndex: "manner",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "manner" }
    },
    {
        title: "详情说明",
        dataIndex: "desc",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "desc" }
    },
    {
        title: "执行时间",
        dataIndex: "time_str",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "time_str" }
    },
    {
        title: "执行人",
        dataIndex: "person",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "person" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "photos_src" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const safetyList = [];
for (let i = 0; i < 7; i++) {
    var canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    var imgsList = [
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg" },
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" }
        ],
        [
            { pic: "http://pic40.nipic.com/20140424/12259251_002036722178_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic31.nipic.com/20130801/11604791_100539834000_2.jpg" }
        ],
        [
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ]

    ]
    safetyList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        name: `夏季防鼠`,
        loc: `所有食材仓库`,
        manner: `老鼠药`,
        desc: `在各位校领导的积极组积极组积极组`,
        time_str: `2019-0${i}-0${i}   1${i}:2${i}`,
        person: `阿${i}`,
        photos_src: imgsList[i],
    });
}
export default {
    data() {
        return {
            moment,
            loading: true,
            // 健康晨检
            pagination: {
                position: "bottom", // 指定分页显示的位置
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            canteen: '',
            canteenKey: '全部',
            canteenId: 0,
            canteenShow: '',
            // 添加
            form: this.$form.createForm(this),
            fileImg: [],
            isAddSafety: false,
            isGoSafety: false,
            addData: moment().format('YYYY-MM-DD'),
            addTime: moment().format('HH:mm'),
            // 查看
            isShowSafety: false,
            loadingShow: true,
            // 修改
            formUpdataOther: this.$form.createForm(this),
            loadingUpdataOther: true,
            isUpdataSafety: false,
            updataDataOther: '',
            updataTimeOther: '',
            updataOtherId: '',
            otherUpdata: {
                canteen: '',
                loc: '',
                title: '',
                manner: '',
                desc: '',
                person: '',
                safetyUpdataList: [],
            },
            // 删除
            delOtherId: '',
            // 安全巡检     日期
            safetyStartValue: null,
            safetyEndValue: null,
            endOpenSafety: false,
            startTime: '',
            endTime: '',
            safetyColumn,
            safetyList,
            isDelSafety: false,
            safetyAddVisible: false,
            safetyAddImage: '',
            safetyAddList: [],
            value: 1,
            isAbnormal: false,
            isAbnormals: false,
            safetyUpdataVisible: false,
            safetyUpdataImage: '',
            safetyUpdataList: [],
            showSafetyList: {},
        }
    },
    watch: {
        // 安全巡检
        safetyStartValue(val) {
            if (val) {
                this.startTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        safetyEndValue(val) {
            if (val) {
                this.endTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
    },
    created() {
        // 获取其他记录列表
        this.getOtherList('', '', '');
        // 获取食堂
        this.getCanteen();
    },
    methods: {
        // 获取其他记录列表
        getOtherList(canteen_id, begin_time, end_time) {
            let that = this;
            this.$get("api/school/safety/plague?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    console.log(res);

                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.name = item.title;
                        item.photos_src.forEach(items => {
                            if (!items.url) {
                                items.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })

                    });
                    this.safetyList = res.data.data.data;
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
        // 食堂 下拉选中
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id;
            console.log(this.canteenId);

        },
        // 筛选
        mxInquiry() {
            this.loading = true;
            this.getOtherList(this.canteenId, this.startTime, this.endTime);
        },
        // 重置
        mxReset() {
            this.safetyStartValue = null;
            this.safetyEndValue = null;
            this.startTime = '';
            this.endTime = '';
            this.canteenKey = 1;
            this.canteenId = 0;
            this.loading = true;
            this.getOtherList('', '', '');
        },
        // 显示当前日期
        getCurrentData() {
            return new Date().toLocaleDateString();
        },
        // 显示当前时间
        getCurrentTime() {
            return new Date().toLocaleTimeString();
        },
        // 安全巡检  添加记录
        mxAddSafety() {
            this.isAddSafety = true;
        },
        // 返回
        backAddSafety() {
            this.isGoSafety = true;
        },
        mxCancelSafety() {
            this.isGoSafety = false;
        },
        mxGoSafety() {
            this.isGoSafety = false;
            this.isAddSafety = false;
            this.safetyAddList = [];
        },
        // 日期
        safetyStartDate(startValue) {
            const endValue = this.safetyEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        safetyEndDate(endValue) {
            const startValue = this.safetyStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        safetyStartOpenChange(open) {
            if (!open) {
                this.endOpenSafety = true;
            }
        },
        safetyEndOpenChange(open) {
            this.endOpenSafety = open;
        },
        // 表格 分页
        safetyTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 查看
        mxShowSafety(id) {
            this.isShowSafety = true;
            this.$get("api/school/safety/plague/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.photos_src.forEach(item => {
                        if (!item.url) {
                            item.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    })
                    this.showSafetyList = res.data.data;
                    this.loadingShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingOther() {
            this.$message.warning('未配置小票打印设备');
        },
        // 编辑
        mxUpdateSafety(id) {
            this.isUpdataSafety = true;
            this.loadingUpdataOther = true;
            this.$get("api/school/safety/plague/" + id).then(res => {
                if (res.data.code == 0) {
                    this.otherUpdata.canteen = res.data.data.canteen_id
                    this.otherUpdata.loc = res.data.data.loc
                    this.otherUpdata.title = res.data.data.title
                    this.otherUpdata.manner = res.data.data.manner
                    this.otherUpdata.desc = res.data.data.desc
                    this.otherUpdata.person = res.data.data.person
                    let imgArr = []
                    res.data.data.photos_src.forEach(item => {
                        let obj = {
                            uid: item.id,
                            name: 'xxx.png',
                            response: {
                                data: {
                                    id: parseInt(item.id),
                                    url: item.url
                                }
                            },
                            status: 'done',
                            url: item.url
                        }
                        imgArr.push(obj)
                    })
                    this.otherUpdata.safetyUpdataList = imgArr;
                    this.updataDataOther = moment(res.data.data.time_str).format('YYYY-MM-DD')
                    this.updataTimeOther = moment(res.data.data.time_str).format('HH:mm')
                    this.updataOtherId = res.data.data.id;
                    this.loadingUpdataOther = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 删除
        mxDelSafety(id) {
            this.isDelSafety = true;
            this.delOtherId = id;
        },
        mxSafetyCel() {
            this.isDelSafety = false;
        },
        mxDelSafetysure() {
            this.isDelSafety = false;
            let data = {
                url: "api/school/safety/plague/" + this.delOtherId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除成功");
                this.loading = true;
                this.getOtherList('', '', '');
            })
        },
        // 安全情况
        onChangeSituation(e) {
            console.log('radio checked', e.target.value)
            console.log('radio checked', this.value)
            if (e.target.value == 1) {
                this.isAbnormal = false;
            } else {
                this.isAbnormal = true;
            }
        },
        // 添加  日期变化
        onChangeAddData(date, dateString) {
            this.addData = dateString;
        },
        // 添加  时间变化
        onChangeAddTime(date, dateString) {
            this.addTime = dateString;
        },
        // 上传
        safetyAddCancel() {
            this.safetyAddVisible = false;
        },
        safetyPreview(file) {
            this.safetyAddImage = file.url || file.thumbUrl;
            this.safetyAddVisible = true;
        },
        safetyAddChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);

            let imgArr = [];
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    imgArr.push(file.response.data.id)
                }
                return file;
            });
            this.fileImg = imgArr;

            this.safetyAddList = fileList;
        },
        // 添加 提交
        safetySubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log("Received values of form: ", values);
                    console.log(this.fileImg);
                    let data = {
                        url: "api/school/safety/plague",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            title: values.title,
                            manner: values.manner,
                            person: values.person,
                            photos: this.fileImg.join(','),
                            time: this.addData + ' ' + this.addTime,
                            desc: values.desc,
                            loc: values.loc,
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isAddSafety = false;
                            this.$message.success('添加记录成功');
                            this.loading = true;
                            this.getOtherList('', '', '');
                            this.safetyAddList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 编辑记录  返回
        backUpdataSafety() {
            this.isUpdataSafety = false;
            this.loadingUpdataOther = true;
        },
        // 编辑  日期变化
        onChangeDataUpdataOther(date, dateString) {
            this.updataDataOther = dateString;
        },
        // 编辑  时间变化
        onChangeTimeUpdataOther(date, dateString) {
            this.updataTimeOther = dateString;
        },
        // 提交
        safetyUpdataSubmit(e) {
            e.preventDefault();
            this.formUpdataOther.validateFields((err, values) => {
                if (!err) {
                    let imgArr = []
                    this.otherUpdata.safetyUpdataList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/plague/" + this.updataOtherId,
                        method: 'put',
                        data: {
                            canteen_id: values.canteen,
                            title: values.title,
                            manner: values.manner,
                            person: values.person,
                            photos: imgArr.join(","),
                            time: this.updataDataOther + ' ' + this.updataTimeOther,
                            desc: values.desc,
                            loc: values.loc,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('修改记录成功');
                            this.safetyUpdataList = [];
                            this.isUpdataSafety = false;
                            this.loading = true;
                            this.getOtherList('', '', '');
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 安全情况
        onChangeSituat(e) {
            console.log('radio checked', e.target.value)
            console.log('radio checked', this.value)
            if (e.target.value == 1) {
                this.isAbnormals = false;
            } else {
                this.isAbnormals = true;
            }
        },
        // 编辑上传
        safetyUpdataCancel() {
            this.safetyUpdataVisible = false;
        },
        safetyUpdataPreview(file) {
            this.safetyUpdataImage = file.url || file.thumbUrl;
            this.safetyUpdataVisible = true;
        },
        safetyUpdataChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.otherUpdata.safetyUpdataList = fileList;
        },
        // 查看详情
        backShowSafety() {
            this.isShowSafety = false;
            this.loadingShow = true;
        },

    },
}
</script>

<style lang="less" scoped>
.mx_divide {
    line-height: 30px;
    padding: 0 10px;
}
.mx_btnbg {
    margin: 0 10px;
}

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
        margin-left: 30px;
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
.mx_operation {
    margin: 0 5px;
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
// 查看详情
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.mx_main {
    margin-top: 40px;
    color: #000;
    font-size: 16px;
    padding: 0 0 10px 10px;
    .mx_receipt {
        padding: 5px;
        margin-top: 50px;
        .mx_receipt_main {
            width: 220px;
            font-size: 14px;
            padding: 15px;
            box-shadow: 0px 0px 6px 0px #ccc;
            img {
                width: 100%;
                height: 25px;
            }
            .text_p {
                margin: 0;
            }
            .mx_receipt_main_header {
                text-align: center;
            }
        }
    }
}
// 添加记录
.clearfix span {
    display: flex;
}
</style>