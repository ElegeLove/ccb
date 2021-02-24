<template>
    <div id="mx_showAll">
        <!-- 搜索框 -->
        <a-form
            layout="inline"
            class="mx_form mx_staff"
        >
            <a-form-item label="通知：">
                <span>
                    <a-input
                        type="text"
                        placeholder="标题名称"
                    />
                </span>
            </a-form-item>
            <a-form-item>
                <a-button
                    class="mx_btnbg"
                    type="primary"
                    html-type="submit"
                >搜索</a-button>
            </a-form-item>
        </a-form>
        <a-form
            layout="inline"
            class="mx_form mx_staff"
        >
            <a-form-item label="状态：">
                <a-select
                    defaultValue="unread"
                    style="width: 120px;marginRight:60px;marginTop:4px;"
                >
                    <a-select-option value="all">全部</a-select-option>
                    <a-select-option value="unread">未读</a-select-option>
                    <a-select-option value="read">已读</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="类型：">
                <a-select
                    defaultValue="alls"
                    style="width: 120px;marginTop:4px;"
                >
                    <a-select-option value="alls">全部</a-select-option>
                    <a-select-option value="notice">通知</a-select-option>
                    <a-select-option value="examine">审核</a-select-option>
                    <a-select-option value="notice">公告</a-select-option>
                </a-select>
            </a-form-item>
            <div
                class="mx_operate"
                style="marginLeft:80px;"
            >
                <a-button
                    type="primary"
                    style="marginRight:30px;background: #eee;color:#000;border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;"
                    @click="mxMark"
                >标注已读</a-button>
                <a-button
                    type="primary"
                    style="background: #eee;color:#000;border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;"
                    @click="mxAllDel"
                >批量删除</a-button>
                <a-modal
                    title="确认删除"
                    centered
                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                    v-model="isDelAll"
                    @cancel="mxCancel"
                    @ok="mxDelete"
                    okText="确认"
                    cancelText="取消"
                >
                    <div class="mx_model">
                        <div class="mx_model_mainDel">
                            消息通知删除后无法恢复，是否继续？
                        </div>
                    </div>
                </a-modal>
            </div>
        </a-form>
        <!-- 表格 -->
        <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :columns="healthyColumn"
            :dataSource="healthyList"
            bordered
            :pagination="pagination"
            @change="healthyTableChange"
        >
            <template
                slot="operation"
                slot-scope="text, record, index"
            >
                <div class="editable-row-operations">
                    <div>
                        <a
                            class="mx_operation mx_color"
                            style="marginRight:20px;"
                            @click="mxShowInfo(record)"
                        >查看</a>
                        <a class="mx_operation mx_color" @click="mxDel(record)">删除</a>
                    </div>
                </div>
            </template>
            <div
                slot="titles"
                slot-scope="text, record, index"
            >
                <a-badge
                    :count="index"
                    dot
                >
                    <div style="padding:0 5px;">
                        张三的猪肉申请入驻
                    </div>
                </a-badge>
            </div>
        </a-table>
    </div>
</template>

<script>
const healthyColumn = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" }
    },
    {
        title: "标题",
        dataIndex: "titles",
        align: "center",
        width: "24%",
        scopedSlots: { customRender: "titles" }
    },
    {
        title: "类型",
        dataIndex: "types",
        align: "center",
        width: "24%",
        scopedSlots: { customRender: "types" }
    },
    {
        title: "时间",
        dataIndex: "times",
        align: "center",
        width: "24%",
        scopedSlots: { customRender: "times" }
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
    var types;
    if (i < 1) {
        types = "通知"
    } else if (i < 3) {
        types = "公告"

    } else if (i < 5) {
        types = "审核"
    } else {
        types = "通知"
    }
    healthyList.push({
        key: i.toString(),
        orderNum: `${i + 1}`,
        types: `${types}`,
        times: `2019-09-06   15:23`,
    });
}
export default {
    data() {
        return {
            healthyColumn,
            healthyList,
            selectedRowKeys: [],
            pagination: {
                pageSize: 5, // 默认每页显示数量
                current: 1, //显示当前页数
                showSizeChanger: true, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                pageSizeOptions: ["5", "10", "30"], // 指定每页可以显示多少条
                showSizeChange: (current, pageSize) =>
                    (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            isDelAll: false,
        }
    },
    methods: {
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys
        },
        healthyTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 标记已读
        mxMark() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning('请选择消息通知');
            } else {
                this.$message.success('标注已读成功');
            }
        },
        // 批量删除
        mxAllDel() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning('请选择消息通知');
            } else {
                this.isDelAll = true;
            }
        },
        mxCancel() {
            this.isDelAll = false;
        },
        mxDelete() {
            this.isDelAll = false;
            this.$message.success('删除成功');
        },
        // 删除
        mxDel(val){
            this.isDelAll = true;
        },
        // 查看详情
        mxShowInfo(val){
            console.log(val)
            this.$router.push({ path: '/mx_InfoPage',query:val })
        }
    },
}
</script>

<style lang="less" scoped>
.mx_form {
    margin: 30px 0;
    display: flex;
    align-items: center;
}
.mx_btnbg {
    margin: 0 10px;
}
</style>