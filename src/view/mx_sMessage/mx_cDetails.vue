<template>
    <div id="mx_cDetails">
        <router-link to="mx_cMessage" class="back">
            <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
            <p>食堂详情</p>
        </router-link>
        <a-skeleton :loading="loading" active :paragraph="{rows: 20}">
            <div class="mx_cDtlList">
            <div class="l">
                <p>食堂名称：{{cDtlist.cName}}</p>
                <p>负责人：{{cDtlist.pName}}</p>
                <p>联系方式：{{cDtlist.tel}}</p>
                <p>食堂详细地址：{{cDtlist.ads}}</p>
                <p>供餐对象：{{cDtlist.std}}</p>
                <p>该食堂就餐教师人数：{{cDtlist.tNum}}人</p>
                <h3>营业执照信息</h3>
                <p>注册号：{{cDtlist.code}}</p>
                <p>有效起始日期：{{cDtlist.time}}</p>
                <p style="margin-top: 50px;margin-bottom: 20px;">创建人：{{cDtlist.sPel}}</p>
                <p>创建时间：{{cDtlist.sTime}}</p>
            </div>
            <div class="r">
                <p>餐饮服务安全等级公示</p>
                <div class="box">
                    <img :src="cDtlist.tUrl" alt="">
                </div>
                <div class="box on">
                    <img :src="cDtlist.bUrl" alt="">
                </div>
            </div>
        </div>
        </a-skeleton>
    </div>
</template>

<script>
    import globalApi from '../../globalApi/globalApi';
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                cDtlist:{
                    cName:'食堂一',
                    pName:'王主任',
                    tel:'15123228085',
                    ads:'左转上二楼跳下来',
                    std:'小学',
                    tNum:300,
                    code:'520316941',
                    time:'2019-07-01  至  2020-07-01',
                    sPel:'王主任',
                    sTime:'2019-07-01',
                    tUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565608405626&di=0465bc9e3c96dfdaa1393a92dbd15e94&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201802%2F24%2F20180224125328_lpxxq.jpg',
                    bUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565608411920&di=02591dc421fa0217cd4166e6253a0c0f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201801%2F16%2F20180116225233_FRcZH.jpeg'
                },
                numKey:'',
                loading:true,
            }
        },
        methods:{

        },
        created(){
            this.numKey = this.$route.query.id;
            axios({
                method: "get",
                url: globalApi.BASE_URL + 'api/school/canteen/' + this.numKey,
                data: {},
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res) => {
                this.cDtlist.cName = res.data.data.title;
                this.cDtlist.pName = res.data.data.charge_title;
                this.cDtlist.tel = res.data.data.charge_phone;
                this.cDtlist.ads = res.data.data.loca_detail;
                this.cDtlist.tNum = res.data.data.teacher_count;
                this.cDtlist.code = res.data.data.license_no;
                this.cDtlist.sTime = res.data.data.created_at;
                this.cDtlist.tUrl = res.data.data.security_src;
                this.cDtlist.bUrl = res.data.data.enclosure_src;
                this.cDtlist.time = res.data.data.issuance_src +' 至 '+res.data.data.term_src;
                this.cDtlist.sPel = res.data.data.username;

                let list = res.data.data.supply_sate,
                    x = '';
                list.forEach((e,i)=>{
                    if(e.state == true){
                        x += e.title + '、'
                    }
                });
                x = x.slice(0,x.length-1);
                this.cDtlist.std = x;
                this.loading = false;
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
</script>

<style scoped>
    .back{
        display: flex;
        align-items: center;
        color:#000;
    }
    .back p{
        margin: 0;
    }
    .mx_cDtlList{
        margin-top: 50px;
        display: flex;
    }
    .mx_cDtlList .l p{
        margin-bottom: 30px;
        color:#000;
    }
    .mx_cDtlList .l h3{
        margin-bottom: 40px;
        font-size: 25px;
        color:#000;
    }
    .mx_cDtlList .r{
        margin-left: 200px;
    }
    .mx_cDtlList .r .box{
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 115px;
        height: 115px;
        border:1px dashed #999;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .mx_cDtlList .r .box.on{
        margin-top: 180px;
    }
    .mx_cDtlList .r .box img{
        width: 90px;
        height: 90%;
    }
</style>


