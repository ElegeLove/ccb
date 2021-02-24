<template>
    <div id="mxStaffInfo">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 20}"
        >
            <div class="mx_main">
                <a-row>
                    <a-col :span="8">
                        <p>
                            姓&emsp;&emsp;名：
                            <span>{{staffList.title}}</span>
                        </p>
                        <p>
                            性&emsp;&emsp;别：
                            <span>{{staffList.sex}}</span>
                        </p>
                        <p>
                            年&emsp;&emsp;龄：
                            <span>{{staffList.age}}</span>
                        </p>
                        <p>
                            职&emsp;&emsp;位：
                            <span>{{staffList.job_title}}</span>
                        </p>
                        <p>
                            学&emsp;&emsp;历：
                            <span>{{staffList.education}}</span>
                        </p>
                        <p>
                            入职日期：
                            <span>{{staffList.join_time_str}}</span>
                        </p>
                        <p>
                            联系地址：
                            <span>{{staffList.location}}</span>
                        </p>
                        <p class="mx_IDCard">
                            身份证号：
                            <span>{{staffList.card_id}}</span>
                        </p>
                        <p>
                            健康证发证单位：
                            <span>{{staffList.authority}}</span>
                        </p>
                        <p>
                            健康证发证日期：
                            <span>{{staffList.issuance_str}}</span>
                        </p>
                        <p class="mx_addman">
                            添&nbsp;&nbsp;加&nbsp;&nbsp;人：
                            <span>{{userName}}</span>
                        </p>
                        <p>
                            添加时间：
                            <span>{{staffList.created_at}}</span>
                        </p>
                    </a-col>
                    <a-col :span="16">
                        <div class="clearfix">
                            <p>人脸图片</p>
                            <viewer>
                                <img
                                    :src="staffList.face_id_src"
                                    alt
                                    srcset
                                />
                            </viewer>
                        </div>
                        <div class="clearfix mx_IDimg">
                            <p>身份证正反面图片</p>
                            <viewer>
                                <img
                                    class="mx_IDPositive"
                                    v-for="item in staffList.card_photo_src"
                                    :src="item.url"
                                    alt
                                    srcset
                                />
                            </viewer>
                        </div>
                        <div class="clearfix mx_HealthImg">
                            <p>健康证图片</p>
                            <viewer>
                                <img
                                    :src="staffList.health_cert_src"
                                    alt
                                    srcset
                                />
                            </viewer>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            loading: true,
            moment,
            staffList: {},
            userName: '',
        }
    },
    mounted() {
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username
        // var staffId = this.$route.query.staffId;
        this.$get("api/school/staff/" + this.$route.query.staffId).then(res => {
            if (res.data.code == 0) {
                // this.data = res.data.data.data
                // console.log(res)
                // res.data.data.data.forEach(item => {
                //     item.key = item.id;
                // if (item.sex == 0) {
                //     item.sex = '男'
                // } else if (item.sex == 1) {
                //     item.sex = '女'
                // }
                //     item.name = item.title
                // });
                console.log(res)
                res.data.data.staff.join_time = moment(res.data.data.staff.join_time).format('YYYY-MM-DD');
                res.data.data.staff.issuance = moment(res.data.data.staff.issuance).format('YYYY-MM-DD');
                this.staffList = res.data.data.staff;
                this.loading = false;
            } else {
                console.log(22)
            }
        })
    },
    methods: {
        goback() {
            window.history.back(-1);
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
.mx_main {
    margin-top: 40px;
    color: #000;
    font-size: 16px;
    .mx_IDCard {
        margin: 60px 0;
    }
    .mx_addman {
        margin-top: 60px;
    }
    .mx_IDimg {
        margin-top: 100px;
    }
    .mx_IDPositive {
        margin-right: 30px;
    }
    .mx_HealthImg {
        margin-top: 45px;
    }
    img {
        width: 100px;
        height: 100px;
    }
}
</style>