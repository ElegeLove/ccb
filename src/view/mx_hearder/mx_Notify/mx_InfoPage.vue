<template>
    <div id="mx_InfoPage">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goBack"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
        </a-breadcrumb>
        <div style="display: flex;align-items: center;marginTop:40px;paddingBottom:25px;borderBottom:10px solid #f2f2f2;">
            <a-button
                style="marginRight:34px;"
                type="primary"
                ghost
                @click="mxDel"
            >删除</a-button>
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
            <div>
                <span style="display: inline-block;borderRight:1px solid #000;padding: 0 10px">上一条</span>
                <span style="display: inline-block;padding: 0 10px">下一条</span>
            </div>
        </div>
        <div style="margin:28px 0;borderBottom:1px solid #e4e4e4;paddingBottom:10px;">
            <h2 style="font-weight: bold;">食堂1 仓库1中包包白即将过期</h2>
            <p>发件人：官方系统</p>
            <p>时&emsp;间：2019-09-06 15:23</p>
            <p>类&emsp;型：通知</p>
        </div>
        <!-- <div>
            <div>仓库1中包包白即将过期</div>
        </div> -->
        <div>
            <p>结算周期：2019-06-01 至 2019-07-06</p>
            <p>结算金额：&yen;200.00</p>
        </div>
        <div style="color: #02bb72;marginTop:50px;">
            <a style="color: #02bb72;marginRight:5px;">前往生成</a>
            <a-icon type="right" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDelAll: false,
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        // 删除
        mxDel(val) {
            this.isDelAll = true;
        },
        mxCancel() {
            this.isDelAll = false;
        },
        mxDelete() {
            this.isDelAll = false;
            this.$message.success('删除成功');
        },
    },
}
</script>

<style lang="less" scoped>
#mx_InfoPage {
    color: #000;
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
</style>