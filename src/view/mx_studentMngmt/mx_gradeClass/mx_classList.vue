<template>
    <div id="mxClassList">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item href>
                <span class="mx_header_text">{{schoolSystem}}</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">{{gradeName}}</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 搜索框 -->
        <div class="components-input-demo-presuffix">
            <p class="hmTxt">班级：</p>
            <a-input
                placeholder="班级/班主任名称"
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
        <!-- 按钮 -->
        <div class="mx_btnGroup">
            <a-button
                class="mx_creat_btn mx_btnbg"
                type="primary"
                @click="showModal"
            >创建班级</a-button>
            <a-modal
                title="创建班级"
                centered
                v-model="visible"
                @cancel="hideModal"
                @ok="creat"
                okText="确认"
                cancelText="取消"
            >
                <div class="mx_model">
                    <div class="mx_model_main">
                        <p>
                            <span>班级名称：</span>
                            <span>
                                <a-input
                                    class="mx_model_inp"
                                    type="text"
                                    v-model="mxClassName"
                                    placeholder="填写班级名称"
                                />
                            </span>
                        </p>
                        <p>
                            <span>班主任：</span>
                            <span>
                                <a-input
                                    class="mx_model_inp"
                                    type="text"
                                    v-model="mxClassTeacher"
                                    placeholder="填写班主任姓名"
                                />
                            </span>
                        </p>
                        <p>
                            <span>联系电话：</span>
                            <span>
                                <a-input
                                    class="mx_model_inp"
                                    type="text"
                                    v-model="mxClassPhone"
                                    placeholder="填写班主任联系电话"
                                />
                            </span>
                        </p>
                    </div>
                </div>
            </a-modal>
            <div class="mx_btns">
                <span>导入班级</span>
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
            :paragraph="{rows: 6}"
        >
            <a-list
                :grid="{ gutter: 16, column: 4 }"
                :dataSource="data"
            >
                <a-list-item
                    slot="renderItem"
                    slot-scope="item, index"
                >
                    <a-card
                        class="mx_card"
                        :bordered="false"
                    >
                        <div class="mx_car_title">
                            <div>{{ item.title }}</div>
                            <div>
                                <a-icon
                                    class="mx_car_updata"
                                    type="form"
                                    @click="mxShowUpdata(item.title,item.head_teacher_title,item.head_teacher_phone,item.id)"
                                />
                                <!-- 编辑 -->
                                <a-modal
                                    title="编辑班级"
                                    centered
                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                    v-model="isUpdata"
                                    @cancel="mxCelUpdata"
                                    @ok="mxUpdata"
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <div class="mx_model">
                                        <div class="mx_model_main">
                                            <p>
                                                <span>班级名称：</span>
                                                <span>
                                                    <a-input
                                                        class="mx_model_inp"
                                                        type="text"
                                                        v-model="mxName"
                                                        placeholder="填写班级名称"
                                                    />
                                                </span>
                                            </p>
                                            <p>
                                                <span>班主任：</span>
                                                <span>
                                                    <a-input
                                                        class="mx_model_inp"
                                                        type="text"
                                                        v-model="mxTeacher"
                                                        placeholder="填写班主任姓名"
                                                    />
                                                </span>
                                            </p>
                                            <p>
                                                <span>联系电话：</span>
                                                <span>
                                                    <a-input
                                                        class="mx_model_inp"
                                                        type="text"
                                                        v-model="mxPhone"
                                                        placeholder="填写班主任联系电话"
                                                    />
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </a-modal>
                                <a-icon
                                    class="mx_del"
                                    type="delete"
                                    @click="mxShowDel(item.title,item.id)"
                                />
                                <!-- 删除 -->
                                <a-modal
                                    title="删除确认"
                                    centered
                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                    v-model="isDel"
                                    @cancel="mxCancel"
                                    @ok="mxDelete"
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <div class="mx_model">
                                        <div class="mx_model_mainDel">
                                            删除后所有与
                                            <span>{{ gradeTitle }}</span>相关联的信息都会被清空，是否继续？
                                        </div>
                                    </div>
                                </a-modal>
                            </div>
                        </div>
                        <div
                            class="mx_list"
                            @click="mxStudentInfo(item.title,item.id)"
                        >
                            <div>学生人数：{{ item.peoples }}人</div>
                            <div>班 主 任：{{ item.head_teacher_title }}</div>
                            <div>联系电话：{{ item.head_teacher_phone }}</div>
                            <div>班级编号：{{ item.class_sn }}</div>
                        </div>
                    </a-card>
                </a-list-item>
            </a-list>
        </a-skeleton>
    </div>
</template>

<script>
const data = [
    {
        "id": 1,
        "school_id": 1,
        "title": "一年级一班",
        "head_teacher_title": "张云峰",
        "head_teacher_phone": "15978990760",
        "peoples": 0,
        "created_at": "2019-08-13 10:34:53",
        "updated_at": "2019-08-13 10:34:53",
        "subgroup_id": 17,
        "class_sn": "GSN-1-17-20190813",
        "del_at": 0
    },
    {
        "id": 2,
        "school_id": 1,
        "title": "一年级二班",
        "head_teacher_title": "刘敏",
        "head_teacher_phone": "15978990760",
        "peoples": 0,
        "created_at": "2019-08-15 09:51:46",
        "updated_at": "2019-08-15 09:51:46",
        "subgroup_id": 17,
        "class_sn": "GSN-1-17-20190815",
        "del_at": 0
    },
    {
        "id": 3,
        "school_id": 1,
        "title": "一年级十三班",
        "head_teacher_title": "吴彦祖",
        "head_teacher_phone": "15978906710",
        "peoples": 0,
        "created_at": "2019-08-15 09:58:05",
        "updated_at": "2019-08-30 14:41:58",
        "subgroup_id": 17,
        "class_sn": "GSN-1-17-92678-20190815",
        "del_at": 1567147318
    }
];
import axios from 'axios';
import qs from 'qs';
export default {
    data() {
        return {
            loading: true,
            data,
            visible: false,
            isUpdata: false,
            isDel: false,
            schoolSystem: '',
            gradeName: '',
            mxClassName: '',
            mxClassTeacher: '',
            mxClassPhone: '',
            gradeid: '',
            gradeTitle: '',
            classid: '',
            mxName: '',
            mxTeacher: '',
            mxPhone: '',
            mxClassVal: '',
        };
    },
    mounted() {
        this.schoolSystem = this.$route.query.schoolSystem;
        this.gradeName = this.$route.query.gradeName;
        this.gradeid = this.$route.query.gradeid;
        this.getClassList(this.$route.query.gradeid)

    },
    methods: {
        goback() {
            window.history.back(-1);
        },
        mxSeach() {
            this.$get("api/school/grade/" + this.gradeid + "/edit", { keyword: this.mxClassVal }).then(res => {
                if (res.data.code == 0) {
                    this.data = res.data.data;
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        showModal() {
            this.visible = true;
        },
        hideModal() {
            this.visible = false;
        },
        creat() {
            let data = {
                url: "api/school/grade",
                method: 'post',
                data: {
                    title: this.mxClassName,
                    head_teacher_title: this.mxClassTeacher,
                    head_teacher_phone: this.mxClassPhone,
                    subgroup_id: this.gradeid,
                },
            };
            this.$apiAxiox(data).then((res) => {
                this.getClassList(this.$route.query.gradeid)
                this.visible = false;
                this.$message.success("创建成功");
                this.mxClassName = '';
                this.mxClassTeacher = '';
                this.mxClassPhone = '';
            })
        },
        mxCelUpdata() {
            this.isUpdata = false;
        },
        mxUpdata() {
            let data = {
                url: "api/school/grade/" + this.classid,
                method: 'put',
                data: {
                    title: this.mxName,
                    head_teacher_title: this.mxTeacher,
                    head_teacher_phone: this.mxPhone,
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.isUpdata = false;
                    this.$message.success("编辑成功");
                    this.getClassList(this.$route.query.gradeid)
                } else {
                    this.$message.warning(res.data.msg);
                }
            })


        },
        mxShowUpdata(className, teacher, phone, id) {
            this.mxName = className;
            this.mxTeacher = teacher;
            this.mxPhone = phone;
            this.classid = id;
            this.isUpdata = true;
        },
        mxShowDel(val, id) {
            this.gradeTitle = val;
            this.classid = id;
            this.isDel = true;
        },
        mxCancel() {
            this.isDel = false;
        },
        mxDelete() {
            let data = {
                url: "api/school/grade/" + this.classid,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.getClassList(this.$route.query.gradeid)
                this.isDel = false;
                this.$message.success("删除成功");
            })
        },
        mxStudentInfo(val, id) {
            this.$router.push({
                path: "/mxStudentList",
                query: {
                    className: val,
                    classid: id
                }
            });
        },
        // 获取班级列表
        getClassList(gradeid) {
            let data = {
                url: "api/school/grade/" + gradeid + "/edit",
                method: 'get',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.data = res.data.data;
                    this.loading = false;
                } else {
                    this.$message.warning(res.data.msg);
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
.mx_btnGroup {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    .mx_creat_btn {
        margin-right: 30px;
    }
    .mx_btns {
        background: #eee;
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        color: #000;
    }
}
.mx_card {
    box-shadow: 0px 0px 10px #ccc;
    font-size: 16px;
    .mx_car_title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mx_car_updata {
            margin-right: 10px;
            cursor: pointer;
        }
        .mx_del {
            cursor: pointer;
        }
    }
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
    .mx_model_mainDel {
        line-height: 160px;
    }
}
.ant-modal-header {
    border: 0;
}
.mx_list :hover {
    cursor: pointer;
}
</style>