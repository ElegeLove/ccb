<template>
    <div id="mxEmployeeInfo">
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
                <!-- </a-form-item> -->
            </a-form-item>
        </a-form>
        <!-- 搜索框 -->
        <div class="components-input-demo-presuffix">
            <p class="hmTxt">员工:</p>
            <a-input
                placeholder="员工姓名"
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
            <a-form-item label="职位：">
                <a-select
                    :value="positionKey"
                    style="width:150px;"
                    @change="selectChangePosition"
                    :disabled="positionDisabled"
                >
                    <a-select-option
                        v-for="(item,index) in positionList"
                        :value="item"
                    >{{item}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                class="mx_formsex"
                label="性别："
            >
                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                <a-select
                    v-model="sexVal"
                    defaultValue="0"
                    style="width: 120px"
                    @change="sexChange"
                >
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="2">女</a-select-option>
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
            >
                <a-icon type="user-add" />添加员工
            </a-button>
            <a-button
                class="mx_creat_btn mx_lever_btn"
                @click="mxRecord"
            >离职记录</a-button>
            <div class="mx_btns">
                <span>打印</span>
                <a-divider
                    type="vertical"
                    style="background: #000;"
                />
                <span>导出</span>
            </div>
        </div>
        <!-- 表格 -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 12}"
        >
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
                                class="mx_updata mx_color"
                                @click="mxCheck(record.id)"
                            >查看</a>
                            <a
                                class="mx_updata mx_color"
                                @click="mxRevise(record)"
                            >修改</a>

                            <a
                                class="mx_updata mx_color"
                                @click="mxShowOffDuty(record.id)"
                            >离职</a>
                            <!-- 离职 -->
                            <a-modal
                                title="离职原因"
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
                                            <span>离职原因：</span>
                                            <a-select
                                                placeholder="请选择离班原因"
                                                @change="selectDel"
                                                style="width: 200px"
                                            >
                                                <a-select-option value="0">正常退休</a-select-option>
                                                <a-select-option value="1">正常离职</a-select-option>
                                                <a-select-option value="2">违规辞退</a-select-option>
                                                <a-select-option value="3">其他原因</a-select-option>
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
        dataIndex: "name",
        align: "center",
        width: "12%",
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
        title: "职位",
        dataIndex: "job_title",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "job_title" }
    },
    {
        title: "联系电话",
        dataIndex: "phone",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "phone" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const data = [];
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
    data.push({
        key: i.toString(),
        canteen_title: `${canteen}`,
        face_id_src: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg",
        name: `Edrward ${i}`,
        sex: `${sex}`,
        age: 32,
        job_title: `采购员${i}`,
        phone: `1354625368${i}`
    });
}
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
            positionDisabled: true,
            positionList: [],
            positionKey: '全部',
            canteen: [],
            canteenKey: '全部',
            canteenId: 0,
            mxClassVal: '',
            personnelId: '',
            leavingWork: '',
            sexVal: '0',
        };
    },
    mounted() {
        this.getStaffList();
        this.getCanteen();

    },
    methods: {
        goback() {
            window.history.back(-1);
            // console.log(this.$router);
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
                } else {
                    console.log(22)
                }
            })
        },
        // 获取员工列表
        getStaffList(data) {
            var that = this
            this.$get("api/school/staff?page=" + this.pagination.current, data).then(res => {
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
                    this.data = res.data.data.data
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 下拉选中
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id;
            if (e == 1) {
                this.positionDisabled = true;
                this.positionKey = '全部';
                // this.positionId = 0;
            } else {
                this.positionDisabled = false;
                this.canteen.forEach(item => {
                    if (item.id == this.canteenId) {
                        this.positionList = item.job_title;
                    }
                })
                let data = '全部'
                this.positionList.splice(0, 0, data);
                this.positionKey = '全部';
            }
        },
        // 下拉选中
        selectChangePosition(e) {
            this.positionKey = e;
        },
        // 性别
        sexChange(val) {
            this.sexVal = val;
        },
        // 搜索
        mxSeach() {
            let positionId;
            if(this.positionKey == '全部'){
                positionId = 0;
            }else{
                positionId = this.positionKey
            }
            var data = {
                canteen_id: this.canteenId,
                key_word: this.mxClassVal,
                job_title: positionId,
                sex: this.sexVal
            }
            this.loading = true;
            this.getStaffList(data)
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 添加员工
        mxAdd() {
            this.$router.push({
                path: "/mxAddStaff"
            });
        },
        // 离职记录
        mxRecord() {
            this.$router.push({
                path: "/mxDepRecord"
            });
        },
        // 查看详情
        mxCheck(id) {
            this.$router.push({
                path: "/mxStaffInfo",
                query: {
                    staffId: id
                }
            });
        },
        // 修改信息
        mxRevise(val) {
            this.$router.push({
                path: "/mxModifyInfo",
                query: {
                    staffInfo: val,
                    id: val.id,
                }
            });
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.getStaffList();
        },
        // 离班
        mxShowOffDuty(id) {
            this.personnelId = id;
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
                url: "api/school/staff/" + this.personnelId,
                method: 'delete',
                data: {
                    event: this.leavingWork
                },
            };
            this.$apiAxiox(data).then((res) => {
                this.isOffDuty = false;
                this.$message.success("编辑成功");
                this.getStaffList();
            })
        }
    }
};
</script>

<style lang="less" scoped>
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
    margin: 0 0 30px;
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
    margin-left: 50px;
}
.mx_updata {
    margin: 0 10px;
}
.mx_model {
    line-height: 150px;
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
</style>