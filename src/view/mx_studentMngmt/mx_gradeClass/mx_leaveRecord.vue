<template>
    <div id="mxLeaveRecord">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">离班记录</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- list -->
        <!-- 表格 -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 20}"
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
        title: "人脸图片",
        dataIndex: "face_id_src",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "face_id_src" }
    },
    {
        title: "姓名",
        dataIndex: "student_name",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "student_name" }
    },
    {
        title: "性别",
        dataIndex: "sex",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "sex" }
    },
    {
        title: "年龄",
        dataIndex: "age",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "age" }
    },
    {
        title: "就餐方式",
        dataIndex: "dining_style_src",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "dining_style_src" }
    },
    {
        title: "监护人",
        dataIndex: "parent_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "parent_title" }
    },
    {
        title: "关系",
        dataIndex: "parent_relation",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "parent_relation" }
    },
    {
        title: "联系方式",
        dataIndex: "parent_phone",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "parent_phone" }
    },
    {
        title: "离班原因",
        dataIndex: "event",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "event" }
    },
    {
        title: "离班时间",
        dataIndex: "created_at",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "created_at" }
    }
];

const data = [];
for (let i = 0; i < 100; i++) {
    var sex, mode, relation, touch, reason;
    if (i % 2 == 0) {
        sex = "男";
        mode = "校内三次";
        relation = "父子";
        reason = "转班";
    } else {
        sex = "女";
        mode = "校内一次";
        relation = "母女";
        reason = "离校";
    }
    if (i < 10) {
        touch = "1354165060";
    } else {
        touch = "135416506";
    }
    data.push({
        key: i.toString(),
        face_id_src: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg",
        student_name: `Edrward ${i}`,
        sex: `${sex}`,
        age: 32,
        address: `London Park no. ${i}`,
        dining_style_src: `${mode}`,
        parent_title: `me${i}`,
        parent_relation: `${relation}`,
        parent_phone: `${touch}${i}`,
        event: `${reason}`,
        created_at: `${i}天`
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
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            isOffDuty: false,
            classId: ''
        };
    },
    mounted() {
        this.classId = this.$route.query.classid;
        this.getLeaveList();
    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.go(-1)
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.getLeaveList();
        },
        getLeaveList() {
            var that = this;
            this.$get("api/school/students/leave?page=" + this.pagination.current, { class_id: this.classId }).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        if (!item.face_id_src) {
                            item.face_id_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                        // item.created_at = moment(item.created_at,"YYYY-MM-DD")
                        item.key = item.id;
                        if (item.sex == 0) {
                            item.sex = '男'
                        } else if (item.sex == 1) {
                            item.sex = '女'
                        }
                        item.name = item.title
                    });
                    this.data = res.data.data.data
                    this.loading = false;
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        }
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