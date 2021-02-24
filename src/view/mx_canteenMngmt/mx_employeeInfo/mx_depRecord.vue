<template>
    <div id="mxDepRecord">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">离职记录</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- list -->
        <!-- 表格 -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 12}"
        >
            <a-table
                class="mx_tabList"
                :columns="columns"
                :dataSource="data"
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
                            :src="text"
                        >
                    </viewer>
                </div>
            </a-table>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
const columns = [
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
        width: "12%",
        scopedSlots: { customRender: "face_id_src" }
    },
    {
        title: "姓名",
        dataIndex: "staff_name",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "staff_name" }
    },
    {
        title: "性别",
        dataIndex: "sex",
        align: "center",
        width: "5%",
        scopedSlots: { customRender: "sex" }
    },
    {
        title: "年龄",
        dataIndex: "age",
        align: "center",
        width: "5%",
        scopedSlots: { customRender: "age" }
    },
    {
        title: "职位",
        dataIndex: "job_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "job_title" }
    },
    {
        title: "联系方式",
        dataIndex: "phone",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "phone" }
    },
    {
        title: "入职时间",
        dataIndex: "joinTime",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "joinTime" }
    },
    {
        title: "离职时间",
        dataIndex: "leaveTime",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "leaveTime" }
    },
    {
        title: "离职原因",
        dataIndex: "event",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "event" }
    }
];

const data = [];
for (let i = 0; i < 100; i++) {
    var canteen, sex, reason;
    if (i % 2 == 0) {
        sex = "男";
        reason = "正常退休";
    } else {
        sex = "女";
        reason = "正常离职";
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
    data.push({
        key: i.toString(),
        canteen_title: `${canteen}`,
        face_id_src: `"http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"`,
        staff_name: `Edrward ${i}`,
        sex: `${sex}`,
        age: 32,
        job_title: `采购员${i}`,
        phone: `1356425986${i}`,
        joinTime: `2012-02-0${i + 1}`,
        leaveTime: `2018-08-0${i + 1}`,
        event: `${reason}`
    });
}
export default {
    data() {
        // this.cacheData = data.map(item => ({ ...item }));
        return {
            loading: true,
            moment,
            data,
            columns,
            pagination: {
                pageSize: 10, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                pageSizeOptions: ["10", "15", "30"], // 指定每页可以显示多少条
                showSizeChange: (current, pageSize) =>
                    (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            isOffDuty: false
        };
    },
    mounted() {
        this.getLeaveList();
    },
    methods: {
        goback() {
            window.history.back(-1);
            // console.log(this.$router);
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.getLeaveList()
        },
        // 获取离职记录列表
        getLeaveList() {
            var that = this
            this.$get("api/school/staff/leave?page=" + this.pagination.current).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total
                    // this.data = res.data.data.data
                    // this.data = res.data.data.data.favList.forEach(item => (item => item.name = item.title))
                    // console.log(res.data.data.data)
                    res.data.data.data.forEach(item => {
                        if (!item.face_id_src) {
                            item.face_id_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    res.data.data.data.forEach(item => {
                        item.joinTime = moment(item.join_time).format('YYYY-MM-DD');
                        item.leaveTime = moment(item.leave_time).format('YYYY-MM-DD');
                        item.key = item.staff_id;
                    });
                    this.data = res.data.data.data
                    this.loading = false;
                    // this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
    }
};
</script>
<style lang="less" scoped>
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.mx_tabList {
    margin-top: 30px;
    .mx_updata {
        margin: 0 10px;
    }
}
</style>