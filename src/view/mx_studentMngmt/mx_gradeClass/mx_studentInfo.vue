<template>
    <div id="mxStudentInfo">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">学生详情</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 12}"
        >
            <div class="mx_main">
                <a-row>
                    <a-col :span="8">
                        <p>
                            学生姓名：
                            <span>{{data.title}}</span>
                        </p>
                        <p>
                            性&emsp;&emsp;别：
                            <span>{{data.sex==0?'男':'女'}}</span>
                        </p>
                        <p>
                            年&emsp;&emsp;龄：
                            <span>{{data.age}}</span>
                        </p>
                        <p>
                            身份证号码：
                            <span>{{data.card_id}}</span>
                        </p>
                        <p>
                            入校日期：
                            <span>{{this.data.join_time_str}}</span>
                        </p>
                        <p>
                            就餐方式：
                            <span>{{data.dining_style_src}}</span>
                        </p>
                        <p>
                            监&nbsp;&nbsp;护&nbsp;&nbsp;人：
                            <span>{{data.parent_title}}</span>
                        </p>
                        <p>
                            关&emsp;&emsp;系：
                            <span>{{data.parent_relation}}</span>
                        </p>
                        <p>
                            联系电话：
                            <span>{{data.parent_phone}}</span>
                        </p>
                    </a-col>
                    <a-col :span="16">
                        <div class="clearfix">
                            <p>人脸图片</p>
                            <img
                                :src="data.face_id_photo"
                                alt
                                srcset
                            />
                        </div>
                        <div
                            class="clearfix mx_outschool"
                            v-if="isDining"
                        >
                            <p>校外就餐证明</p>
                            <img
                                :src="data.dining_enclosure_photo"
                                alt
                                srcset
                            />
                        </div>
                    </a-col>
                </a-row>
                <div class="mx_footer">
                    <p>
                        上次编辑：
                        <span>{{userName}}</span>
                    </p>
                    <p>
                        编辑时间：
                        <span>{{data.updated_at}}</span>
                    </p>
                </div>
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
            data: {
                "id": 2,
                "title": "周景华",
                "sex": 0,
                "age": 718473600,
                "school_id": 1,
                "grade_id": 3,
                "card_id": "500235199210083474",
                "join_time": 1565920170,
                "join_time_str": "2019-09-09",
                "dining_style": 1,
                "dining_enclosure": "1",
                "parent_title": "霍胡",
                "parent_relation": "父子",
                "parent_phone": null,
                "face_id_src": "23",
                "created_at": "2019-08-16 09:49:30",
                "updated_at": "2019-08-16 17:04:03",
                "del_at": 1565946243
            },
            isDining: false,
            userName:'',
        }
    },
    mounted() {
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username
        var id = this.$route.query.student_id;
        this.$get("api/school/students/" + id).then(res => {
            if (res.data.code == 0) {
                if (res.data.data.dining_style_src == "校外就餐") {
                    this.isDining = true;
                } else {
                    this.isDining = false;
                }
                this.data = res.data.data
                this.loading = false;
            } else {
                this.$message.warning(res.data.msg);
            }
        })
    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.go(-1)
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
    .mx_outschool {
        margin-top: 40px;
    }
    img {
        width: 120px;
        height: 120px;
    }
    .mx_footer {
        margin-top: 40px;
    }
}
</style>