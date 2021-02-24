<template>
    <div id="mxAllStudents">
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
                label="学制阶段："
            >
                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                <a-select
                    :value="eduKey"
                    style="width: 120px"
                    @change="mxEdut"
                >
                    <a-select-option
                        v-for="(item,index) in educational"
                        :key="index+1"
                    >{{item.title}}</a-select-option>
                </a-select>
                <!-- </a-form-item> -->
            </a-form-item>
            <a-form-item
                class="mx_formsex"
                label="年级："
            >
                <a-select
                    :value="gradeKey"
                    style="width: 120px"
                    @change="mxGrade"
                    :disabled="disabledGrade"
                >
                    <a-select-option
                        v-for="(item,index) in grade"
                        :key="index+1"
                    >{{item.title}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                class="mx_formsex"
                label="班级："
            >
                <a-select
                    :value="classKey"
                    style="width: 120px"
                    @change="mxClass"
                    :disabled="disabled"
                >
                    <a-select-option
                        v-for="(item,index) in classList"
                        :key="index+1"
                    >{{item.title}}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <!-- 按钮 -->
        <div class="mx_btnGroup">
            <a-form layout="inline">
                <a-form-item label="就餐方式：">
                    <a-select
                        :value="modeKey"
                        style="width: 120px"
                        @change="mxDiningMode"
                    >
                        <a-select-option
                            v-for="(item,index) in diningStyle"
                            :key="index+1"
                        >{{item.title}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
            <div class="mx_btns">
                <span>导入学生</span>
                <a-divider
                    type="vertical"
                    style="background: #000;"
                />
                <span>下载模板</span>
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
        width: "10%",
        scopedSlots: { customRender: "face_id_src" }
    },
    {
        title: "姓名",
        dataIndex: "name",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "性别",
        dataIndex: "sex",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "sex" }
    },
    {
        title: "年龄",
        dataIndex: "age",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "age" }
    },
    {
        title: "阶段",
        dataIndex: "educational_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "educational_str" }
    },
    {
        title: "年级",
        dataIndex: "subgroup_id_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "subgroup_id_str" }
    },
    {
        title: "班级",
        dataIndex: "class_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "class_title" }
    },
    {
        title: "就餐方式",
        dataIndex: "dining_style_src",
        align: "center",
        width: "10%",
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
    var sex, mode, stage;
    if (i % 2 == 0) {
        sex = "男";
        mode = "校内三次";
    } else {
        sex = "女";
        mode = "校内一次";
    }
    if (i < 20) {
        stage = "幼儿园";
    } else if (i < 40) {
        stage = "小学";
    } else if (i < 60) {
        stage = "初中";
    } else if (i < 80) {
        stage = "高中";
    } else {
        stage = "大学";
    }
    data.push({
        key: i.toString(),
        face_id_src: `"http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"`,
        name: `Edrward ${i}`,
        sex: `${sex}`,
        age: 32,
        address: `London Park no. ${i}`,
        educational_str: `${stage}`,
        subgroup_id_str: `${i}年级`,
        class_title: `${i}班`,
        dining_style_src: `${mode}`
    });
}

const provinceData = ["全部", "一年级", "二年级"];
const cityData = {
    全部: [
        "一年级一班",
        "一年级二班",
        "一年级三班",
        "二年级一班",
        "二年级二班",
        "二年级三班",
        "二年级四班"
    ],
    一年级: ["一班", "二班", "三班"],
    二年级: ["一班", "二班", "三班", "四班"]
};
export default {
    data() {
        // this.cacheData = data.map(item => ({ ...item }));
        return {
            loading: true,
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
            disabled: true,
            disabledGrade: true,
            provinceData,
            cityData,
            cities: cityData[provinceData[0]],
            secondCity: "选择班级",
            mxClassVal: '',
            // 学制
            educational: [],
            eduKey: '全部',
            eduId: 0,
            // 餐次
            diningStyle: [],
            modeKey: '全部',
            modeId: 0,
            // 年级
            grade: [],
            gradeKey: '全部',
            gradeId: 0,
            // 班级
            classList: [],
            classKey: '全部',
            classId: 0,
        };
    },
    mounted() {
        // 获取学制
        this.getSchoolSystem();
        // 获取年级
        this.getGrade();
        // 获取餐次
        this.getMeals();
        // 获取所有学生信息
        this.getAllStudents();

    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.go(-1);
        },
        // 搜索
        mxSeach() {
            this.loading = true;
            var data = { key_word: this.mxClassVal, dining_style: this.modeId, educational: this.eduId, grade: this.gradeId, grade: this.gradeId }
            this.getAllStudents(data)
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 获取学制
        getSchoolSystem() {
            this.$get("api/school/intelligence", { state: 1 }).then(res => {
                if (res.data.code == 0) {
                    this.educational = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.educational.splice(0, 0, data);
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 学制变化
        mxEdut(e) {
            this.eduKey = e;
            this.eduId = this.educational[e - 1].id
            this.disabledGrade = false;
            if (this.eduId == 0) {
                this.disabledGrade = true;
                this.$message.warning("由于年级数量过多，请先选择学制");
            }
            this.gradeId = 0;
            this.gradeKey = 1;
            this.disabled = true;
            this.classId = 0;
            this.classKey = '全部';
            this.modeKey = 1;
            this.modeId = 0;
            this.getGrade(this.eduId);
        },
        // 获取年级
        getGrade(id) {
            this.$get("api/school/grade").then(res => {
                if (res.data.code == 0) {
                    this.grade = res.data.data.filter(item => (item.id == id))
                    for (const key in this.grade) {
                        this.grade = this.grade[key].children
                    }
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.grade.splice(0, 0, data)
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 年级变化
        mxGrade(e) {
            this.gradeKey = e;
            this.gradeId = this.grade[e - 1].id;
            this.disabled = false;
            if (this.gradeId == 0) {
                this.disabled = true;
                this.$message.warning("由于班级数量过多，请先选择年级");
            }
            this.classId = 0;
            this.classKey = '全部';
            this.getClass(this.gradeId);
        },
        // 获取班级
        getClass(id) {
            this.$get("api/school/grade/" + id + "/edit").then(res => {
                if (res.data.code == 0) {
                    this.classList = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.classList.splice(0, 0, data)
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 班级变化
        mxClass(e) {
            this.classKey = e;
            this.classId = this.classList[e - 1].id;
        },
        // 获取所有学生信息
        getAllStudents(data) {
            var that = this
            this.$get("api/school/students?page=" + this.pagination.current, data).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
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
                    this.data = res.data.data.data;
                    this.loading = false;
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 获取餐次
        getMeals() {
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
        // 餐次变化
        mxDiningMode(e) {
            this.modeKey = e;
            this.modeId = this.diningStyle[e - 1].id;
            this.eduKey = 1;
            this.eduId = 0;
            this.gradeId = 0;
            this.gradeKey = 1;
            this.disabledGrade = true;
            this.disabled = true;
            this.classId = 0;
            this.classKey = '全部';
        },
        // 添加学生
        mxAdd() {
            this.$router.push({
                path: "/mxAddStudent"
            });
        },
        // 离班记录
        mxRecord() {
            this.$router.push({
                path: "/mxLeaveRecord"
            });
        },
        // 查看详情
        mxCheck(id) {
            this.$router.push({
                path: "/mxStudentInfo",
                query: {
                    student_id: id
                }
            });
        },
        // 修改信息
        mxRevise(id) {
            this.$router.push({
                path: "/mxUpdataInfo",
                query: {
                    id: id
                }
            });
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.getAllStudents()
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
                this.getAllStudents();
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
        margin-right: 30px;
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