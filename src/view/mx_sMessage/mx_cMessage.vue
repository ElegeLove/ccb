<template>
    <div id="cMessage">
        <a-button type="primary">
                <router-link :to="{path:'mx_canteen',query:{title:'添加食堂'}}">添加食堂</router-link>
            </a-button>
        <a-skeleton :loading="loading" active :paragraph="{rows: 20}">
            <ul class="canteenList" v-if="!dataN">
                <li>您还没有食堂哦，快去添加吧</li>
            </ul>
            <ul class="canteenListData" v-else>
            <a-col v-if="cteenList.length<=0" style="width: 100%;min-height: 600px;text-align: center;line-height: 600px;">
                暂无食堂
            </a-col>
            <a-col v-else :span="12" v-for="(item,index) in cteenList">
                    <li  @click="ctnDets(item.id)">
                        <div class="cldTop">
                            <div class="l">
                                <h3>{{item.cName}}</h3>
                            </div>
                            <div class="r">
                                <a-icon @click.stop.prevent="goNew(item.id)" class="hover" type="form" style="font-size: 20px;color:#999;margin-right: 15px;"/>
                                <a-icon @click.stop.prevent="showModal(item.id)" class="hover" type="delete" style="font-size: 20px;color:#999;"/>
                                <a-modal
                                        title="删除确认"
                                        v-model="visible"
                                        @ok="handleOk"
                                        style="top: 30%;"
                                        :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"

                                >
                                    <p>删除后所有所有关联信息将被清空，是否继续？</p>
                                </a-modal>
                            </div>
                        </div>
                        <div class="cldCnt">
                        <div class="l">
                            <p>负责人：{{item.pName}}</p>
                            <p>联系方式：{{item.cTel}}</p>
                            <p style="max-width:240px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">详细地址：{{item.cAds}}</p>
                            <p>供餐对象：{{item.cStd}}</p>
                        </div>
                        <div class="r">
                            <div class="box">
                                <img v-if="item.url != ''" :src="item.url" alt="">
                                <img v-else src="@/assets/login/logo.png" alt="">
                            </div>
                            <p>就餐教师人数：{{item.num}}人</p>
                        </div>
                    </div>
                    </li>
            </a-col>
        </ul>
        </a-skeleton>
    </div>
</template>

<script>
    import globalApi from '../../globalApi/globalApi';
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data(){
            return{
                visible:false,//删除提示
                dataN:true,
                cteenList:[],
                dltID:'',
                loading:true,
            }
        },
        methods:{
            handleOk(){
                axios({
                    method: "delete",
                    url: globalApi.BASE_URL + 'api/school/canteen/' + this.dltID,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    console.log(res);
                    this.$message.success(`删除成功`);
                })
                .catch(function (err) {

                });

                this.visible = false;
            },
            showModal(val){
                this.dltID = val;
                this.visible = true
            },
            ctnDets(val){
                this.$router.push({
                    name: 'mx_cDetails',
                    query:{
                        id:val,
                    }
                });
            },
            goNew(val){
                this.$router.push({
                    name: 'mx_canteen',
                    query:{
                        btnName:'更新保存',
                        title:'编辑食堂',
                        id:val
                    }
                });
            }
        },
        created(){
            //获取食堂列表
            let data ={
                url:'api/school/canteen',
                method:'get',
                data:{}
            };
            this.$apiAxiox(data).then((res)=>{
                if(res.data.code == 0){
                    res.data.data.forEach((e,i)=>{
                        let x = '';
                        e.supply_state.forEach((e1,i1)=>{
                            if(e1.state == true){
                                x += e1.title + ','
                            }
                        });
                        x = x.slice(0,x.length-1);
                        let obj = {
                            id:e.id,
                            cName:e.title,
                            pName:e.charge_title,
                            cTel:e.charge_phone,
                            cAds:e.loca_detail,
                            cStd:x,
                            url:e.security_src,
                            num:e.teacher_count
                        };
                        this.cteenList.push(obj);
                    });
                    this.loading = false;
                }

//                console.log(this.cteenList);
            });

        }
    }
</script>

<style scoped>
    .canteenList{
        display: flex;
        min-height:600px;
        justify-content: center;
        align-items: center;
    }
    .canteenListData{
        display: flex;
        flex-wrap: wrap;
        min-height:600px;
        max-width:1200px;
        margin:0 auto;
    }
    .canteenList li,.canteenListData li{
        list-style: none;
    }
    .canteenListData li{
        width: 460px;
        height: 320px;
        box-shadow:0 0 10px #ccc;
        border-radius: 5px;
        border-top:1px solid transparent;
        margin: 40px 20px;
    }
    .cldTop{
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
    }
    .cldTop .l{
        margin-left: 36px;
    }
    .cldTop .r{
        margin-right: 22px;
    }
    .cldTop .r .hover:hover{
        cursor: pointer;
    }
    .cldCnt{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .cldCnt .l{
        margin-left: 36px;
    }
    .cldCnt .r{
        margin-right: 22px;
    }
    .cldCnt .r .box{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 105px;
        height: 105px;
        border:1px dashed #999;
        border-radius:5px;
        margin-bottom: 45px;
    }

    .cldCnt .r .box img{
        width: 90%;
        height: 90%;
    }

    .cldCnt p{
        margin-bottom: 30px;
    }
</style>
