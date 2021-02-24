<template>
    <div id="mx_contactUs">
        <h1 style="fontWeight: bold;">HI，重庆巴蜀小学</h1>
        <p style="fontSize:18px;">客服在线时间：工作日09:00—18:00</p>
        <p style="fontSize:18px;">服务热线：400-500-600</p>
        <div style="width:100%;display: flex;align-items: center;marginBottom:58px;" v-for="item in 2">
            <div style="display: flex;align-items: center;marginRight:120px;">
                <img style="width:40px;height:40px;marginRight:34px;" src="http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" alt="">
                <p style="margin:0;">1365465651<span style="color:#02bb72;cursor: pointer;" @click="mxCopy">（点击复制）</span></p>
            </div>
            <div style="textAlign:center;padding:10px 16px;boxShadow: 0 0 1px 0 #ccc;">
                <p>扫码添加</p>
                <img style="width:130px;height:130px;" src="http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            mxCopy() {
                this.$message.success('复制成功');
            }
        },
    }
</script>

<style lang="less" scoped>
</style>