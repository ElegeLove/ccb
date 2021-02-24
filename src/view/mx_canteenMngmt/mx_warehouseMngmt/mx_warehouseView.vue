<template>
    <div id="mxWarehouseView">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">查看仓库</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 12}"
        >
            <div class="mx_main">
                <p>
                    所属食堂：
                    <span>{{data.canteen_title}}</span>
                </p>
                <p>
                    仓库名称：
                    <span>{{data.title}}</span>
                </p>
                <p>
                    储存类别：
                    <span>{{data.greats_str}}</span>
                </p>
                <p>
                    仓库地址：
                    <span>{{data.location}}</span>
                </p>
                <p>
                    管&nbsp;&nbsp;理&nbsp;&nbsp;员：
                    <span>{{data.lead}}</span>
                </p>
                <p>
                    联系电话：
                    <span>{{data.lead_phone}}</span>
                </p>
                <p class="mx_creatman">
                    创&nbsp;&nbsp;建&nbsp;&nbsp;人：
                    <span>{{userName}}</span>
                </p>
                <p>
                    创建时间：
                    <span>{{data.created_at}}</span>
                </p>
            </div>
        </a-skeleton>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading:true,
            houseId: '',
            data: [],
            userName: '',
        };
    },
    mounted() {
        this.houseId = this.$route.query.id;
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username
        this.getWareHouseInfo(this.houseId)
    },
    methods: {
        goback() {
            window.history.back(-1);
        },
        getWareHouseInfo(id) {
            this.$get("api/school/store/" + id).then(res => {
                if (res.data.code == 0) {
                    this.data = res.data.data;
                    this.loading = false;
                } else {
                    console.log(22)
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
.mx_main {
    margin-top: 40px;
    color: #000;
    font-size: 16px;
    .mx_creatman {
        margin-top: 45px;
    }
}
</style>