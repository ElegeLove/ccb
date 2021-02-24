<template>
    <div id="mxWarehouseMngmt">
        <a-form
            layout="inline"
            class="mx_form"
        >
            <a-form-item label="食堂：">
                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
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
            <p class="hmTxt">仓库:</p>
            <a-input
                placeholder="仓库/管理员名称"
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
                @click="mxAdd"
            >
                <a-icon type="user-add" />新建仓库
            </a-button>
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
                                @click="mxRevise(record,record.id)"
                            >修改</a>

                            <a
                                class="mx_updata mx_color"
                                @click="mxShowOffDuty(record.id)"
                            >删除</a>
                            <!-- 删除 -->
                            <a-modal
                                title="确认删除"
                                centered
                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                v-model="isOffDuty"
                                @cancel="mxCelOffDuty"
                                @ok="mxOffDuty"
                                okText="确认"
                                cancelText="取消"
                            >
                                <div class="mx_model">
                                    <div class="mx_model_main">是否确定删除该仓库？</div>
                                </div>
                            </a-modal>
                            <a-modal
                                title="无法删除"
                                centered
                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                v-model="isdel"
                            >
                                <template slot="footer">
                                    <a-button
                                        key="submit"
                                        type="primary"
                                        @click="mxDel"
                                    >我知道了</a-button>
                                </template>
                                <div class="mx_model">
                                    <div class="mx_model_main">请将仓库中食材移库后再进行操作</div>
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
import { constants } from "crypto";
const columns = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "仓库名称",
        dataIndex: "warehouse",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "warehouse" }
    },
    {
        title: "储存类别",
        dataIndex: "greats_str",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "greats_str" }
    },
    {
        title: "仓库地址",
        dataIndex: "location",
        align: "center",
        width: "20%",
        scopedSlots: { customRender: "location" }
    },
    {
        title: "管理员",
        dataIndex: "lead",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "lead" }
    },
    {
        title: "联系电话",
        dataIndex: "lead_phone",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "lead_phone" }
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
    var storageClass, canteen;
    if (i % 2 == 0) {
        storageClass = ["肉禽蛋类", "蔬菜素食"];
    } else {
        storageClass = ["海鲜鱼类", "水果饮品"];
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
        warehouse: `聚宝盆${i}号 `,
        greats_str: `${storageClass}`,
        location: `食堂${i}左转上2楼3-${i}`,
        lead: `采购员${i}`,
        lead_phone: `1354625368${i}`
    });
}
export default {
    data() {
        // this.cacheData = data.map(item => ({ ...item }));
        return {
            loading: true,
            data,
            columns,
            canteen: [],
            canteenKey: '全部',
            canteenId: 0,
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
            isdel: false,
            mxClassVal: '',
            isOffDutyId: '',
            storeClass: [],
        };
    },
    mounted() {
        this.getCanteen();
        this.getHouseList('', '');
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
        // 食堂 下拉选中
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id
            // this.getHouseList(this.canteenId, this.mxClassVal);
        },
        // 搜索
        mxSeach() {
            this.loading = true;
            this.getHouseList(this.canteenId, this.mxClassVal);
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 新建仓库
        mxAdd() {
            this.$router.push({
                path: "/mxAddWarehouse"
                // query: {
                //     goods_id: id,
                //     user_id: userid
                // }
            });
        },
        // 查看详情
        mxCheck(id) {
            // console.log(id);
            this.$router.push({
                path: "/mxWarehouseView",
                query: {
                    id: id
                }
            });
        },
        // 修改信息
        mxRevise(val, id) {
            // console.log(val);
            this.$router.push({
                path: "/mxUpdataMngmnt",
                query: {
                    data: val,
                    id: id
                }
            });
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 查询仓库列表
        getHouseList(canteen_id, key_word) {
            var that = this
            this.$get("api/school/store?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&key_word=" + key_word).then(res => {
                that.pagination.pageSize = res.data.data.per_page;
                that.pagination.total = res.data.data.total
                if (res.data.code == 0) {
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.warehouse = item.title
                    });
                    this.data = res.data.data.data
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 删除
        mxShowOffDuty(id) {
            this.isOffDuty = true;
            this.isOffDutyId = id;
        },
        mxCelOffDuty() {
            this.isOffDuty = false;
        },
        mxOffDuty() {
            this.isOffDuty = false;
            let data = {
                url: "api/school/store/" + this.isOffDutyId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.$message.success("删除成功");
                    this.getHouseList('', '');
                } else {
                    this.isdel = true;
                }
            });
        },
        // mxCelDel() {
        //   this.isdel = false;
        // },
        mxDel() {
            this.isdel = false;
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
.mx_updata {
    margin: 0 10px;
}
.mx_model {
    line-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    .mx_model_main {
        text-align: center;
    }
}
</style>