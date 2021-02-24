<template>
    <div id="index">
        <div class="top">
            <div style="display: flex;align-items: center">
                <h1>{{schoolName}}</h1>
                <div class="tabBox" style="display: flex;margin-left: 50px;">
                    <p style="margin-top: 5px;">食堂选择：</p>
                    <a-select
                            @change="plChange2"
                            v-decorator="['select']"
                            :value="rstate"
                            style="width: 120px;margin-right: 40px;"
                    >
                        <a-select-option v-for="(item,index) in rList" :key="index+1">{{item}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <h2>{{time}}</h2>
        </div>
        <!--<div class="wrap">-->
            <!--<div class="cont1" v-for="item in fRoomData">-->
                <!--<div class="l">-->
                    <!--<h3 style="margin-top: 7px;margin-left: 25px;color:#000;">{{item.title}}</h3>-->
                    <!--<div class="txt">-->
                        <!--<div>-->
                            <!--<p>食堂1负责人：</p>-->
                            <!--<span>{{item.fName}}</span>-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<p>联系方式：</p>-->
                            <!--<span>{{item.phone}}</span>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="txt">-->
                        <!--<div>-->
                            <!--<p>出勤职工人数：</p>-->
                            <!--<span>{{item.pNum}}人 ></span>-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<p>健康状况：</p>-->
                            <!--<span>{{item.state}}</span>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="txt">-->
                        <!--<div>-->
                            <!--<p>学生就餐人数：</p>-->
                            <!--<span>{{item.sNum}}人</span>-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<p>教职工就餐人数：</p>-->
                            <!--<span>{{item.tNum}}人</span>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <div class="wrap" style="width: 100%;min-height: 600px;display: flex;align-items: center;justify-content: center;">
            <!--<p>暂无数据</p>-->
            <img src="@/assets/zst.png" alt="">
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                schoolName:'',
                rstate: '全部',
                rList: ['全部', '食堂一', '食堂二', '食堂三'],
                time: moment(new Date()).format("YYYY-MM-DD"),
                fRoomData:[{
                    title:'食堂1基本信息',
                    fName:'王阿航',
                    phone:'15123225869',
                    pNum:'25',
                    state:'正常',
                    sNum:'1500',
                    tNum:'180'
                },{
                    title:'食堂1基本信息',
                    fName:'王阿航',
                    phone:'15123225869',
                    pNum:'25',
                    state:'正常',
                    sNum:'1500',
                    tNum:'180'
                }]
            }
        },
        methods:{
            //搜索状态选择
            plChange2(e) {
                this.rstate = e;
            },
        },
        created(){
            this.schoolName = localStorage.getItem('schoolName');
        }
    }
</script>

<style scoped>
    .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .cont1{
        margin-top: 35px;
        margin-left: 30px;
        width: 500px;
        height: 150px;
        box-shadow: 0 0 10px #d9d9d9;
        display: flex;
        flex-direction: column;
        border-radius:5px;
    }
    .cont1 .txt{
        width: 100%;
        display: flex;
    }
    .cont1 .txt div{
        width: 50%;
        margin-left: 25px;
        display: flex;
    }
    .cont1 .txt div p{
        width: 50%;
    }
    .wrap{
        display: flex;
    }
</style>

<style>

</style>
