<template>
    <div id="mxTimeTag">
        <a-skeleton
            :loading="loadingActive"
            active
            :paragraph="{rows: 20}"
        >
            <a-tabs
                :activeKey="activeKey"
                tabPosition="top"
                @change="callback"
            >
                <a-tab-pane
                    tab="每日考勤"
                    key="1"
                    :forceRender="true"
                >
                    <div v-if="datashow">
                        <a-form
                            layout="inline"
                            class="mx_form"
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
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">员工:</p>
                            <a-input
                                placeholder="姓名/职位"
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
                            class="mx_form"
                        >
                            <a-form-item label="日期：">
                                <a-date-picker
                                    placeholder="入职日期选择"
                                    :defaultValue="moment(joinTime, 'YYYY-MM-DD')"
                                    :value="moment(joinTime, 'YYYY-MM-DD')"
                                    @change="handlePanelChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <div class="mx_btns">
                                    <span>打印</span>
                                    <a-divider
                                        type="vertical"
                                        style="background: #000;"
                                    />
                                    <span>导出</span>
                                </div>
                            </a-form-item>
                        </a-form>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loading"
                            active
                            :title='false'
                            :paragraph="{rows: 12}"
                        >
                            <a-table
                                :columns="column"
                                :dataSource="datas"
                                bordered
                                :pagination="pagination"
                                @change="handleTableChange"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="face_id_src"
                                    slot-scope="text, record,index"
                                >
                                    <viewer>
                                        <img
                                            style="width:60px;heigth:60px"
                                            :src="record.face_id_src"
                                        >
                                    </viewer>
                                </div>
                                <div
                                    slot="inRecord"
                                    slot-scope="text, record, index"
                                >
                                    <p>{{record.min}}</p>
                                    <p>{{record.max}}</p>
                                </div>
                                <a
                                    class="mx_updata mx_color"
                                    slot="operation"
                                    slot-scope="text, record, index"
                                    @click="mxShowMonth(record.staff_id,record.staff_name,record.job_title)"
                                >查看本月</a>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <div v-else>
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goback"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看本月</a-breadcrumb-item>
                        </a-breadcrumb>
                        <div class="mx_dateList">
                            <div class="mx_dateList_left">
                                <div class="mx_dateList_left_name">
                                    <span>姓名：</span>
                                    <span>{{userName}}</span>
                                </div>
                                <div>
                                    <span>职位：</span>
                                    <span>{{jobName}}</span>
                                </div>
                            </div>
                            <div class="mx_dateList_right">
                                <div class="mx_dateList_right_name">{{nowdata}}</div>
                                <div>
                                    <span
                                        class="mx_mouth"
                                        @click="mxPreMouth"
                                    >
                                        <a-icon type="left" />上一月</span>
                                    <span
                                        class="mx_thismouth"
                                        @click="mxMouth"
                                    >本月</span>
                                    <span
                                        class="mx_mouth"
                                        @click="mxNextMouth"
                                    >下一月
                                        <a-icon type="right" /></span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <a-calendar>
                                <ul
                                    class="events"
                                    slot-scope="value"
                                    slot="dateCellRender"
                                >
                                    <li
                                        v-for="item in getListData(value)"
                                        :key="item.key"
                                    >
                                        <p style="text-align: center;font-weight: 400;">{{item.content}}</p>

                                    </li>
                                </ul>
                            </a-calendar>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="月度汇总"
                    key="2"
                    :forceRender="true"
                >
                    <a-form
                        layout="inline"
                        class="mx_form"
                    >
                        <a-form-item label="食堂：">
                            <a-select
                                :value="canteensKey"
                                style="width:150px;"
                                @change="selectsChange"
                            >
                                <a-select-option
                                    v-for="(item,index) in canteens"
                                    :key="index+1"
                                >{{item.title}}</a-select-option>
                            </a-select>
                            <!-- </a-form-item> -->
                        </a-form-item>
                    </a-form>
                    <!-- 搜索框 -->
                    <div class="components-input-demo-presuffix">
                        <p class="hmTxt">员工:</p>
                        <a-input
                            placeholder="姓名/职位"
                            class="seachBox"
                            style="width:200px;"
                            v-model="mxStaffVal"
                            ref="userNameInput"
                        >
                            <a-icon
                                v-if="mxStaffVal"
                                theme="filled"
                                slot="suffix"
                                type="close-circle"
                                @click="emitEmptyStaff"
                                style="color:#999"
                            />
                        </a-input>
                    </div>
                    <a-form
                        layout="inline"
                        class="mx_form"
                        :form="form"
                        @submit="handleSubmit"
                    >
                        <a-form-item label="日期：">
                            <a-month-picker
                                @change="onDateChange"
                                placeholder="选择月份"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                class="mx_btnbg"
                                type="primary"
                                html-type="submit"
                            >查询</a-button>
                            <a-button html-type="reset">
                                <div @click="mxReset">重置</div>
                            </a-button>

                        </a-form-item>
                        <a-form-item>
                            <div class="mx_btns">
                                <span>打印</span>
                                <a-divider
                                    type="vertical"
                                    style="background: #000;"
                                />
                                <span>导出</span>
                            </div>
                        </a-form-item>
                    </a-form>
                    <a-skeleton
                        :loading="loadings"
                        active
                        :title='false'
                        :paragraph="{rows: 12}"
                    >
                        <a-table
                            :columns="columns"
                            :dataSource="monthlyList"
                            bordered
                            :pagination="paginations"
                            :locale="locale"
                            @change="handleTableChanges"
                            :scroll="scrollWidth"
                            style="max-width:100%;"
                        >
                            <viewer
                                slot="face_id_src"
                                slot-scope="text, record"
                            >
                                <img
                                    style="width:100px;heigth:100px"
                                    :src="text"
                                />
                            </viewer>
                            <div
                                v-for="col in longNum"
                                :slot="col"
                                slot-scope="text, record, index"
                                style="text-align: center;"
                            >
                                <p>{{record.works[col-1].zao_time}}</p>
                                <p>{{record.works[col-1].wan_time}}</p>
                            </div>
                        </a-table>
                    </a-skeleton>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>
<script>
import moment from 'moment';
const column = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "人脸图片",
        dataIndex: "face_id_src",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "face_id_src" }
    },
    {
        title: "姓名",
        dataIndex: "staff_name",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "staff_name" }
    },
    {
        title: "职位",
        dataIndex: "job_title",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "job_title" }
    },
    {
        title: "工号",
        dataIndex: "id",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "id" }
    },
    {
        title: "打卡记录",
        dataIndex: "inRecord",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "inRecord" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const datas = [];
for (let i = 0; i < 10; i++) {
    var sex, canteen;
    if (i % 2 == 0) {
        sex = "男";
    } else {
        sex = "女";
    }
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 6) {
        canteen = "食堂3";
    } else if (i < 8) {
        canteen = "食堂4";
    } else {
        canteen = "食堂5";
    }
    datas.push({
        key: i.toString(),
        canteen_title: `${canteen}`,
        face_id_src: `http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg`,
        staff_name: `Edrward ${i}`,
        job_title: `采购员${i}`,
        id: `ST10${i}`,
        inRecordam: `08:3${i}`,
        inRecordpm: `18:0${i}`
    });
}


const monthlyList = [];
for (let i = 0; i < 100; i++) {
    monthlyList.push({
        key: i,
        canteen: `食堂${i}`,
        picurl: `http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg`,
        name: `Edrward ${i}`,
        position: `Edrward ${i}`,
        jobNum: `Edrward ${i}`,
        attendance: `Edrward ${i}`,
        age: 32,
        addressam: `08:3${i}`,
        addresspm: `18:0${i}`
    });
}
export default {
    data() {
        return {
            activeKey:'1',
            loadingActive: false,
            loading: true,
            loadings: true,
            longNum: 6,
            moment,
            dataList: [
                [{
                    content: '08:15',
                },
                {
                    content: '未打卡',
                }]
            ],
            datament: [],
            m: 0,
            datas,
            monthlyList,
            column,
            datashow: true,
            pagination: {
                pageSize: 10, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            paginations: {
                pageSize: 10, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            form: this.$form.createForm(this),
            locale: {
                filterConfirm: "确定",
                filterReset: "重置",
                emptyText: "暂无数据"
            },
            scrollWidth: { x: '101%' },
            nowdata: '',
            // 表格头部数据
            columns: [
                {
                    title: "食堂",
                    width: 100,
                    dataIndex: "canteen",
                    align: "center",
                    key: "canteen",
                    fixed: "left"
                },
                {
                    title: "人脸图片",
                    width: 120,
                    dataIndex: "picurl",
                    align: "center",
                    fixed: "left",
                    key: "pic",
                    scopedSlots: { customRender: "pic" }
                },
                { title: "姓名", width: 120, align: "center", dataIndex: "name", key: "name", fixed: "left" },
                { title: "职位", width: 120, align: "center", dataIndex: "position", key: "position" },
                { title: "工号", width: 120, align: "center", dataIndex: "jobNum", key: "jobNum" },
                { title: "出勤天数", width: 120, align: "center", dataIndex: "attendance", key: "attendance" },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>一</p>
                                <p style='text-align: right;margin-bottom: 0;'>01</p>
                            </div>
                        );
                    },
                    dataIndex: "1",
                    key: "1",
                    width: 150,
                    scopedSlots: { customRender: '1' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>二</p>
                                <p style='text-align: right;margin-bottom: 0;'>02</p>
                            </div>
                        );
                    },
                    dataIndex: "2",
                    key: "2",
                    width: 150,
                    scopedSlots: { customRender: '2' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>三</p>
                                <p style='text-align: right;margin-bottom: 0;'>03</p>
                            </div>
                        );
                    },
                    dataIndex: "3",
                    key: "3",
                    width: 150,
                    scopedSlots: { customRender: '3' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>四</p>
                                <p style='text-align: right;margin-bottom: 0;'>04</p>
                            </div>
                        );
                    },
                    dataIndex: "4",
                    key: "4",
                    width: 150,
                    scopedSlots: { customRender: '4' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>五</p>
                                <p style='text-align: right;margin-bottom: 0;'>05</p>
                            </div>
                        );
                    },
                    dataIndex: "5",
                    key: "5",
                    width: 150,
                    scopedSlots: { customRender: '5' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>六</p>
                                <p style='text-align: right;margin-bottom: 0;'>06</p>
                            </div>
                        );
                    },
                    dataIndex: "6",
                    key: "6",
                    width: 150,
                    scopedSlots: { customRender: '6' },
                },
                {
                    title: (currentPageData) => {
                        return (
                            <div>
                                <p style='text-align: left;margin-bottom: 0;'>七</p>
                                <p style='text-align: right;margin-bottom: 0;'>07</p>
                            </div>
                        );
                    },
                    dataIndex: "7",
                    key: "7",
                    width: 150,
                    scopedSlots: { customRender: '7' },
                }
            ],
            joinTime: '',
            canteen: [],
            canteenKey: '全部',
            canteenId: 0,
            canteens: [],
            canteensKey: '全部',
            canteensId: 0,
            mxClassVal: '',
            mxStaffVal: '',
            monthId: '',
            userName: '',
            jobName: '',
            listData: [],
            inquiryTime: '',
        }
    },
    mounted() {
        this.joinTime = moment(new Date().toLocaleDateString()).format('YYYY-MM-DD')
        this.getTimeTag('', '', this.joinTime);
        this.getCanteen();
    },
    methods: {
        // 标签页
        callback(e) {
            this.activeKey = e;
            this.loadingActive = true;
            if (e == '1') {
                this.getTimeTag('', '', this.joinTime);
            } else {
                this.loadings = true;
                this.getMonthly('', '', '');
            }
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.getTimeTag('', '', this.joinTime);
        },
        // 列表
        handleTableChanges(pagination, filters, sorter) {
            this.paginations.pageSize = pagination.pageSize;
            this.paginations.current = pagination.current;
            this.getMonthly('', '', '');
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                    this.canteens = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteen.splice(0, 0, data)
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中 每日考勤
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id
            this.sexVal = '0';
            // this.loading = true;
            // this.getTimeTag(this.canteenId, this.mxClassVal, this.joinTime);
        },
        // 食堂 下拉选中  月度汇总
        selectsChange(e) {
            this.canteensKey = e;
            this.canteensId = this.canteens[e - 1].id
            this.sexVal = '0';
            // this.loadings = true;
            // this.getMonthly(this.canteensId, this.mxStaffVal, this.inquiryTime);
        },

        // 选择日期
        onDateChange(date, dateString) {
            this.inquiryTime = dateString;
        },
        // 查询
        handleSubmit(e) {
            e.preventDefault();
            this.loadings = true;
            this.getMonthly(this.canteensId, this.mxStaffVal, this.inquiryTime);
        },
        // 重置
        mxReset() {
            this.inquiryTime = ''
            this.loadings = true;
            this.getMonthly('', '', '');
        },
        // 日期
        handlePanelChange(date, dateString) {
            this.joinTime = dateString;
            // this.loading = true;
            // this.getTimeTag(this.canteenId, this.mxClassVal, this.joinTime);
        },
        onSelect(value) {
            this.value = value
            this.selectedValue = value
        },
        onPanelChange(value) {
            this.value = value
        },
        goback() {
            this.datashow = !this.datashow
        },
        // 获取考勤记录
        // getTimeTag(time) {
        getTimeTag(canteen_id, key_word, time) {
            var that = this;
            // this.$get("api/school/attend?time=" + time).then(res => {
            this.$get("api/school/attend?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&key_word=" + key_word + "&time=" + time).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        if (!item.face_id_src) {
                            item.face_id_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.datas = res.data.data.data
                    // console.log(this.datas)
                    this.loadingActive = false;
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 查看本月
        mxShowMonth(i, name, job) {
            this.datashow = !this.datashow;
            this.userName = name;
            this.jobName = job;
            this.monthId = i;
            this.nowdata = moment(this.joinTime).format('YYYY-MM-DD')
            this.joinTime = moment(this.joinTime).format('YYYY-MM')
            this.getMonthRecord(i, this.joinTime)
        },
        // 获取每月考勤记录
        getMonthRecord(id, time) {
            this.$get("api/school/attend/" + id + "/edit?time=" + time).then(res => {
                if (res.data.code == 0) {
                    this.datament = res.data.data
                    // console.log(this.datament)
                } else {
                    console.log(22)
                }
            })
        },
        // onPanelChange(value, mode) {
        //     console.log(value, mode);
        // },
        // 搜索
        mxSeach() {
            // console.log(this.mxClassVal)
            this.loading = true;
            this.getTimeTag(this.canteenId, this.mxClassVal, this.joinTime);
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 获取月度汇总
        getMonthly(canteen_id, key_word, time) {
            var that = this;
            this.$get("api/school/attend/create?page=" + this.paginations.current + "&canteen_id=" + canteen_id + "&key_word=" + key_word + "&time=" + time).then(res => {
                if (res.data.code == 0) {
                    that.paginations.pageSize = res.data.data.per_page;
                    that.paginations.total = res.data.data.total;
                    let obj2;
                    let mainList = [];
                    res.data.data.data.forEach((e, i) => {
                        if (!e.face_id_src) {
                            e.face_id_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                        obj2 = {
                            key: i,
                            canteen: e.canteen_title,
                            face_id_src: e.face_id_src,
                            name: e.staff_name,
                            position: e.job_title,
                            jobNum: e.staff_id,
                            attendance: e.total_day,
                            works: e.works
                        }
                        mainList.push(obj2)
                    })
                    this.monthlyList = mainList
                    // 表头的动态长度
                    this.longNum = 6;
                    this.longNum = this.longNum + res.data.data.data[0].works.length;
                    this.scrollWidth = { x: (120 * 3) + (150 * res.data.data.data[0].works.length) }

                    let list = [];
                    let obj;
                    res.data.data.data[0].works.some((e, i) => {
                        obj = {
                            day: e.day.substr(e.day.length - 2, e.day.length),
                            week: e.weekday
                        }
                        list.push(obj)
                    })
                    this.listData = list;

                    var arr1;
                    // 表头固定
                    let column1 = [
                        {
                            title: "食堂",
                            width: 100,
                            dataIndex: "canteen",
                            align: "center",
                            key: "canteen",
                            fixed: "left"
                        },
                        {
                            title: "人脸图片",
                            width: 120,
                            dataIndex: "face_id_src",
                            align: "center",
                            fixed: "left",
                            key: "face_id_src",
                            scopedSlots: { customRender: "face_id_src" }
                        },
                        { title: "姓名", width: 120, align: "center", dataIndex: "name", key: "name", fixed: "left" },
                        { title: "职位", width: 120, align: "center", dataIndex: "position", key: "position" },
                        { title: "工号", width: 120, align: "center", dataIndex: "jobNum", key: "jobNum" },
                        { title: "出勤天数", width: 120, align: "center", dataIndex: "attendance", key: "attendance" },
                    ]
                    // 表头  月份
                    this.listData.forEach((e, i) => {
                        arr1 = {
                            title: (currentPageData) => {
                                return (
                                    <div>
                                        <p style='text-align: left;margin-bottom: 0;'>{e.week}</p>
                                        <p style='text-align: right;margin-bottom: 0;'>{e.day}</p>
                                    </div>
                                );
                            },
                            dataIndex: i + 1,
                            key: i + 1,
                            width: 150,
                            scopedSlots: { customRender: i + 1 },
                        }
                        column1.push(arr1)
                    })
                    this.columns = column1
                    this.loadingActive = false;
                    this.loadings = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 搜索
        // mxSeachStaff() {
        //     // this.loadings = true;
        //     // this.getMonthly(this.canteensId, this.mxStaffVal, this.inquiryTime);
        // },
        emitEmptyStaff() {
            this.$refs.userNameInput.focus()
            this.mxStaffVal = ''
        },
        // 每月考勤
        getListData(value) {
            const dayList = this.datament
            let t = moment(value._d)
                .format('YY-MM-DD')
                .substring(0, 5)
            let curr_t = new Date()
            let listData

            curr_t = moment(curr_t)
                .format('YY-MM-DD')
                .substring(0, 5)

            if (t === curr_t) {
                // 过滤掉非本月的数据
                dayList &&
                    dayList.forEach((it, index) => {
                        if (value.date() == it.day) {
                            listData = [
                                { content: it.min, key: it.id },
                                { content: it.max, key: it.id + 1 },
                            ]
                        }
                    })
            }
            return listData || [];
        },
        // 上一月
        mxPreMouth() {
            this.m--;
            this.mxMonthMore(this.m)
            this.getMonthRecord(this.monthId, this.joinTime)
        },
        // 本月
        mxMouth() {
            this.m = 0;
            this.mxMonthMore(this.m)
            this.getMonthRecord(this.monthId, this.joinTime)

        },
        // 下一月
        mxNextMouth() {
            this.m++;
            this.mxMonthMore(this.m)
            this.getMonthRecord(this.monthId, this.joinTime)
        },
        // 月数
        mxMonthMore(m) {
            this.nowdata = moment(moment().add(m, 'months')).format('YYYY-MM-DD')
            this.joinTime = moment(moment().add(m, 'months')).format('YYYY-MM')
        },
    },
    created() {
        this.getMonthly('', '', '');
        this.m = 0;
        this.date = moment().add(this.m, 'months')
        this.nowdata = moment(this.date).format('YYYY-MM-DD')
    }
}
</script>
<style  lang="less">
.events {
    list-style: none;
    margin: 0;
    padding: 0;
}
.events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
}
.notes-month {
    text-align: center;
    font-size: 28px;
}
.notes-month section {
    font-size: 28px;
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
.mx_divide {
    line-height: 30px;
    padding: 0 10px;
}
.mx_btnbg {
    margin: 0 10px;
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
.ant-form {
    margin: 20px 0;
}
.mx_dateList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    .mx_dateList_left {
        display: flex;
        align-items: center;
        .mx_dateList_left_name {
            margin-right: 20px;
        }
    }
    .mx_dateList_right {
        display: flex;
        align-items: center;
        font-weight: bold;
        .mx_dateList_right_name {
            font-weight: 500;
            padding: 6px 20px;
            margin-right: 20px;
            border: 1px solid #d9d9d9;
            background: #f2f2f2;
            border-radius: 4px;
        }
        .mx_mouth {
            padding: 4px 10px;
            cursor: pointer;
        }
        .mx_mouth:hover {
            color: #02bb72;
        }
        .mx_thismouth {
            cursor: pointer;
            padding: 4px 10px;
            margin: 0 20px;
            background: #02bb72;
            color: #fff;
        }
    }
}
thead {
    background: #f2f2f2;
}
.ant-fullcalendar-column-header .ant-fullcalendar-column-header-inner {
    margin: 12px 0;
    color: #000;
    font-weight: bold;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-month,
.ant-fullcalendar-fullscreen .ant-fullcalendar-date {
    border-top: 0;
    border-bottom: 2px solid #e8e8e8;
    color: #000;
    font-weight: bold;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-value,
.ant-fullcalendar-fullscreen .ant-fullcalendar-column-header {
    text-align: left;
    padding-left: 10px;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-column-header {
    padding-left: 24px;
}
.ant-fullcalendar-fullscreen
    .ant-fullcalendar-month-panel-selected-cell
    .ant-fullcalendar-month,
.ant-fullcalendar-fullscreen
    .ant-fullcalendar-selected-day
    .ant-fullcalendar-date {
    background: rgba(2, 187, 114, 0.2);
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-month:hover,
.ant-fullcalendar-fullscreen .ant-fullcalendar-date:hover {
    background: rgba(2, 187, 114, 0.2);
}
.ant-fullcalendar-fullscreen
    .ant-fullcalendar-month-panel-selected-cell
    .ant-fullcalendar-value,
.ant-fullcalendar-fullscreen
    .ant-fullcalendar-selected-day
    .ant-fullcalendar-value {
    color: #02bb72;
}
.ant-fullcalendar-header {
    display: none;
}
.ant-fullcalendar-tbody {
    tr {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
}
</style>