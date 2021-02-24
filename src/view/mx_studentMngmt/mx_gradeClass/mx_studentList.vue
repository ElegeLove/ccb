<template>
    <div id="mxStudentList">

        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">{{className}}</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 搜索框 -->
        <div class="components-input-demo-presuffix">
            <p class="hmTxt">学生：</p>
            <a-input
                placeholder="学生姓名"
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
            <a-form-item
                class="mx_formsex"
                label="性别："
            >
                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                <a-select
                    defaultValue="all"
                    style="width:120px;"
                    @change="sexChange"
                >
                    <a-select-option value="all">全部</a-select-option>
                    <a-select-option value="0">男</a-select-option>
                    <a-select-option value="1">女</a-select-option>
                </a-select>
                <!-- </a-form-item> -->
            </a-form-item>
            <a-form-item label="就餐方式：">
                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                <a-select
                    :value="modeKey"
                    style="width:150px;"
                    @change="selectChange"
                >
                    <a-select-option
                        v-for="(item,index) in diningStyle"
                        :key="index+1"
                    >{{item.title}}</a-select-option>
                </a-select>
                <!-- </a-form-item> -->
            </a-form-item>
        </a-form>
        <!-- 按钮 -->
        <div class="mx_btnGroup">
            <a-button
                class="mx_creat_btn mx_btnbg"
                type="primary"
                @click="mxAdd"
            >添加学生</a-button>
            <a-button
                class="mx_creat_btn mx_lever_btn"
                @click="mxRecord"
            >离班记录</a-button>
            <div class="mx_btns">
                <span>导入班级</span>
                <a-divider
                    type="vertical"
                    style="background: #000;"
                />
                <span>下载模板</span>
            </div>
            <div class="mx_btns">
                <span>打印</span>
                <a-divider
                    type="vertical"
                    style="background: #000;"
                />
                <span>导出</span>
            </div>
        </div>
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 12}"
        >
            <!-- 表格 -->
            <a-table
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
                            :src="record.face_id_src"
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
                                class="mx_updata mx_color"
                                @click="mxCheck(record.id)"
                            >查看</a>
                            <a
                                class="mx_updata mx_color"
                                @click="mxRevise(record.id)"
                            >修改</a>

                            <a
                                class="mx_updata mx_color"
                                @click="mxShowOffDuty(record.id)"
                            >离班</a>
                            <!-- 离班 -->
                            <a-modal
                                title="离班原因"
                                centered
                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                v-model="isOffDuty"
                                @cancel="mxCelOffDuty"
                                @ok="mxOffDuty"
                                okText="确认"
                                cancelText="取消"
                            >
                                <div class="mx_model">
                                    <div class="mx_model_main">
                                        <p>
                                            <span>离班原因：</span>
                                            <a-select
                                                placeholder="请选择离班原因"
                                                @change="selectDel"
                                                style="width: 200px"
                                            >
                                                <a-select-option value="0">未知</a-select-option>
                                                <a-select-option value="1">转班</a-select-option>
                                                <a-select-option value="2">转校</a-select-option>
                                                <a-select-option value="3">退学</a-select-option>
                                                <a-select-option value="4">离职</a-select-option>
                                                <a-select-option value="5">退休</a-select-option>
                                                <a-select-option value="6">辞退</a-select-option>
                                            </a-select>
                                        </p>
                                    </div>
                                </div>
                            </a-modal>
                        </div>
                    </div>
                </template>
            </a-table>
        </a-skeleton>
    </div>
</template>

<script>
const columns = [
    {
        title: "人脸图片",
        dataIndex: "face_id_src",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "face_id_src" }
    },
    {
        title: "姓名",
        dataIndex: "name",
        align: "center",
        width: "25%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "性别",
        dataIndex: "sex",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "sex" }
    },
    {
        title: "年龄",
        dataIndex: "age",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "age" }
    },
    {
        title: "就餐方式",
        dataIndex: "dining_style_src",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "dining_style_src" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const data = [];
for (let i = 0; i < 100; i++) {
    var sex, mode;
    if (i % 2 == 0) {
        sex = "男";
        mode = "校内三次";
    } else {
        sex = "女";
        mode = "校内一次";
    }
    data.push({
        key: i.toString(),
        face_id_src: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg",
        name: `Edrward ${i}`,
        sex: `${sex}`,
        age: 32,
        address: `London Park no. ${i}`,
        dining_style: `${mode}`
    });
}
export default {
    data() {
        return {
            loading: true,
            data,
            columns,
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
            isOffDuty: false,
            leavingWork: '',
            studentId: '',
            mxClassVal: '',
            className: '',
            classId: '',
            diningStyle: [
                {
                    "id": 90,
                    "title": "校内三餐"
                },
                {
                    "id": 91,
                    "title": "校内午晚餐"
                },
                {
                    "id": 92,
                    "title": "校内早餐"
                },
                {
                    "id": 93,
                    "title": "校内午餐"
                },
                {
                    "id": 94,
                    "title": "校内晚餐"
                },
                {
                    "id": 95,
                    "title": "校外就餐"
                }
            ],
            modeKey: '全部',
            modeId: 0,
            sexVal:'',
        };
    },
    mounted() {
        this.className = this.$route.query.className;
        this.classId = this.$route.query.classid;
        this.getDining();
        let data = { class_id: this.classId }
        this.getStudentList(data);

    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        // 搜索
        mxSeach() {
            let data = { class_id: this.classId, key_word: this.mxClassVal, sex: this.sexVal, dining_style: this.modeId }
            this.loading = true;
            this.getStudentList(data)
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 性别
        sexChange(val) {
            var sex;
            if (val == 'all') {
                sex = ''
            } else {
                sex = val
            }
            this.sexVal = sex;
        },
        // 餐次
        getDining() {
            this.$get("api/school/dining", {}).then(res => {
                if (res.data.code == 0) {
                    this.diningStyle = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.diningStyle.splice(0, 0, data)
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 下拉选中
        selectChange(e) {
            this.modeKey = e;
            this.modeId = this.diningStyle[e - 1].id;
        },
        // 获取学生列表
        getStudentList(data) {
            var that = this;
            this.$get("api/school/students?page=" + this.pagination.current, data).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page
                    that.pagination.total = res.data.data.total
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        if (!item.face_id_src) {
                            item.face_id_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
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
        },
        // 添加学生
        mxAdd() {
            this.$router.push({
                path: "/mxAddStudent",
                query: {
                    classid: this.classId,
                }
            });
        },
        // 离班记录
        mxRecord() {
            this.$router.push({
                path: "/mxLeaveRecord",
                query: {
                    classid: this.classId,
                }
            });
        },
        // 查看详情
        mxCheck(id) {
            this.$router.push({
                path: "/mxStudentInfo",
                query: {
                    student_id: id,
                }
            });
        },
        // 修改信息
        mxRevise(id) {
            this.$router.push({
                path: "/mxUpdataInfo",
                query: {
                    id: id,
                }
            });
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            var data = { class_id: this.classId }
            this.getStudentList(data);
        },
        // 离班
        mxShowOffDuty(id) {
            this.studentId = id;
            this.isOffDuty = true;
        },
        // 离班原因
        selectDel(val) {
            this.leavingWork = val;
        },
        mxCelOffDuty() {
            this.isOffDuty = false;
        },
        mxOffDuty() {
            let data = {
                url: "api/school/students/" + this.studentId,
                method: 'delete',
                data: {
                    event: this.leavingWork
                },
            };
            this.$apiAxiox(data).then((res) => {
                this.isOffDuty = false;
                this.$message.success("删除成功");
                let data = { class_id: this.classId }
                this.getStudentList(data);
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
.mx_form {
    margin: 30px 0;
}
.mx_btnGroup {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    .mx_creat_btn {
        margin-right: 50px;
    }
    .mx_lever_btn {
        color: #000;
        background-color: #eee;
        border-color: #ccc;
    }
    .mx_lever_btn.ant-btn:hover,
    .mx_lever_btn.ant-btn:focus {
        color: #000;
        background-color: #eee;
        border-color: #ccc;
    }
    .mx_btns {
        background: #eee;
        padding: 6px 10px;
        margin-left: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        color: #000;
    }
}
.mx_formsex {
    margin-right: 50px;
}
.mx_updata {
    margin: 0 10px;
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    .mx_model_main {
        width: 300px;
        margin: 0;
        p {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .mx_model_inp {
                width: 230px;
                outline: none;
            }
        }
    }
}
.ant-modal-header {
    border: 0;
}
</style>