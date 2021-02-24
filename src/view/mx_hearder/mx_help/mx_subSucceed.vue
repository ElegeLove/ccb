<template>
    <div id="mx_subSucceed">
        <div>
            <a-icon
                type="check-circle"
                theme="filled"
                style="color:#52c41a;fontSize:80px;"
            />
            <h1>提交成功</h1>
            <p style="color:#aaa;">您的意见已成功提交</p>
            <p style="margin:80px 0 190px;">感谢您的宝贵意见，我们将持续改进</p>
            <a-button
                type="primary"
                @click="mxBack"
            >返回</a-button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        mxBack() {
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="less" scoped>
#mx_subSucceed {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    h1 {
        font-weight: bold;
        margin-top: 10px;
    }
}
</style>