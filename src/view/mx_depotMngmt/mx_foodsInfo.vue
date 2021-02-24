<template>
    <div id="mx_foodsInfo">
        <!-- 查看详情 -->
        <div>
            <!-- 头部 -->
            <a-breadcrumb separator=" ">
                <a-breadcrumb-item>
                    <a-icon
                        @click="backShowInfo"
                        class="mx_header_icon"
                        type="arrow-left"
                    />
                </a-breadcrumb-item>
                <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
            </a-breadcrumb>
            <!-- main -->
            <a-skeleton
                :loading="loadingInfo"
                active
                :paragraph="{rows: 20}"
            >
                <div>
                    <div
                        class="mx_main"
                        style="marginBottom:60px;position: relative;"
                    >
                        <div style="display: flex;justify-content: space-between;align-items: center;">
                            <div
                                class="mx_title"
                                style="margin:0;"
                            >
                                <div style="margin-right:56px;"><span>{{showListInfo.supplier_title}}</span></div>
                                <div style="margin-right:56px;">所属订单号：{{showListInfo.order_no}}</div>
                                <div><span style="margin-right:18px;">{{showListInfo.created_at}}</span></div>
                            </div>
                        </div>
                        <div class="mx_list">
                            <img
                                :src="showListInfo.material_single_src"
                                alt=""
                            >
                            <span style="margin-right:56px;">{{showListInfo.material_title}}</span>
                            <span style="margin-right:56px;">&yen;{{showListInfo.order_unit_price}}</span>
                            <span style="margin-right:56px;">{{showListInfo.order_num}}</span>
                            <span style="margin-right:56px;">总价：&yen;{{showListInfo.total_price}}</span>
                            <span style="fontSize:16px;fontWeight:bold;">批次号：{{showListInfo.batch_num}}</span>
                        </div>
                        <div style="display: flex;align-items: center;marginLeft:340px;">
                            <p style="marginRight:50px;">预警时间：<span>{{showListInfo.yj_str}}</span></p>
                            <p>过期时间：<span>{{showListInfo.gq_str}}</span></p>
                        </div>
                        <div
                            style="display: flex;justify-content: center;paddingTop:44px;marginTop:26px;borderTop:1px solid #e4e4e4;"
                            v-if="isOpen"
                        >
                            <div style="display: flex;">
                                <div>
                                    <p>品牌名称：<span>{{showListInfo.cargo_title}}</span></p>
                                    <p>生产厂家：<span>{{showListInfo.factory}}</span></p>
                                    <p>产&emsp;&emsp;地：<span>{{showListInfo.source}}</span></p>
                                </div>
                                <div style="margin:0 75px 0 90px;">
                                    <p>生产日期：<span>{{moment(showListInfo.product_date).format("YYYY年MM月DD日")}}</span></p>
                                    <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{showListInfo.shelf_life}}天</span></p>
                                    <p>贮存方式：<span>{{showListInfo.storage_method_str}}</span></p>
                                </div>
                                <div>
                                    <p>包装方式：<span>{{showListInfo.pack_str}}</span></p>
                                    <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>{{showListInfo.net_weight}}</span></p>
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;right:20px;top:10px;">
                            <span v-if="showListInfo.overdue == 0">正常</span>
                            <span
                                v-else
                                style="color:red;"
                            >已过期</span>
                        </div>
                        <div
                            style="color: #1890ff;position: absolute;right:20px;bottom:10px;cursor: pointer;"
                            @click="()=>{isOpen = !isOpen}"
                        >
                            展开商品信息
                            <a-icon
                                v-if="isOpen"
                                type="up"
                            />
                            <a-icon
                                v-else
                                type="down"
                            />
                        </div>
                    </div>
                    <div class="extendPeriod">
                        <p style="fontSize:16px;fontWeight:bold;">延保记录</p>
                        <div
                            class="extendPeriodList"
                            style="display: flex;align-items: center;padding:20px 0 16px;"
                            v-for="items in showListInfo.prolong"
                        >
                            <p style="margin:0;">延长保质期：{{items.prolong}}{{items.prolong_unit}}</p>
                            <p style="margin:0 64px 0 77px;">操 作 人：{{items.username}}</p>
                            <p style="margin:0;">操作时间：{{items.handle_time}}</p>
                            <p style="margin:0 0 0 72px;">延保前过期时间：{{items.previous_time_str}}</p>
                        </div>
                    </div>
                    <div style="width:100%;height:14px;background: #f7f7f7;margin:36px 0;"></div>
                    <a-timeline>
                        <a-timeline-item
                            style="position: relative;marginLeft:150px;"
                            v-for="item in showListInfo.record"
                        >
                            <p style="position: absolute;left:-150px;">{{item.created_at}}</p>
                            <div style="border:2px solid #bcbcbc;padding:10px 16px 12px;borderRadius: 5px;">
                                <a-row style="fontWeigh:bold;color:#000;">
                                    <p style="fontSize:16px;fontWeight:bold;">{{item.record_state_str}}</p>
                                    <a-col :span="8">
                                        <div v-if="item.state == 1">
                                            <p>入库方式：<span>{{item.record_state_str}}</span></p>
                                            <p>存放仓库：<span>{{item.storehou_title}}</span></p>
                                            <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{showListInfo.shelf_life}}天</span></p>
                                            <!-- <p>延长保质期：<span>3天</span></p> -->
                                            <p>操&nbsp;&nbsp;作&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>操作时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 正常 -->
                                        <div v-if="item.out_style == 101">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>出库数量：<span>{{item.number}}斤</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 其他 -->
                                        <div v-if="item.out_style == 0">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>出库数量：<span>{{item.number}}斤</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>使用日期：<span>{{item.user_time_str}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 报损 -->
                                        <div v-if="item.out_style == 102">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>报损数量：<span>{{item.number}}斤</span></p>
                                            <p>报损原因：<span>{{item.damage_reason}}</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 移库 -->
                                        <div v-if="item.out_style == 104">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>移库数量：<span>{{item.number}}斤</span></p>
                                            <p>移入位置：<span>{{showListInfo.canteen_title}}</span>&nbsp;&nbsp;<span>{{item.storehou_title}}</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- 退货 -->
                                        <div v-if="item.out_style == 103">
                                            <p>出库用途：<span>{{item.out_style_str}}</span></p>
                                            <p>退货数量：<span>{{item.number}}斤</span></p>
                                            <p>详情说明：<span>{{item.remark}}</span></p>
                                            <p>退货单单号：<span>{{item.return_on}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{item.username}}</span></p>
                                            <p>出库时间：<span>{{item.created_at}}</span></p>
                                        </div>
                                        <!-- <div style="marginTop:30px;">
                                        <p>盘点盘亏：<span>-50.20斤</span></p>
                                        <p>盘点备注：<span>无</span></p>
                                        <p>审核状态：<span>审核通过</span>&nbsp;&nbsp;<span>审核中</span></p>
                                        <p>盘&nbsp;&nbsp;点&nbsp;&nbsp;人：<span>王阿航</span></p>
                                        <p>盘点时间：<span>2019-06-23</span>&nbsp;&nbsp;<span>13:26</span></p>
                                    </div>
                                    <p style="marginTop:30px;">品牌名称：<span>阿航的白菜</span></p>
                                    <p>生产厂家：<span>重庆餐餐保科技有限公司</span></p>
                                    <p>产&emsp;&emsp;地：<span>重庆</span></p>
                                    <p>生产日期：<span>2019-06-23</span></p>
                                    <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>60天</span></p>
                                    <p>贮存方式：<span>常温贮存</span></p>
                                    <p>包装方式：<span>散装</span></p>
                                    <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>--</span></p> -->
                                    </a-col>
                                    <a-col :span="8">
                                        <div>
                                            <p>食材照片</p>
                                            <viewer>
                                                <img
                                                    style="width:92px;height:92px;marginRight:30px;"
                                                    v-for="itemImg in item.photo_src"
                                                    :src="itemImg.url"
                                                    alt=""
                                                >
                                            </viewer>
                                        </div>
                                    </a-col>
                                    <a-col
                                        :span="8"
                                        v-if="item.out_style != 102 && item.out_style != 103 && item.out_style != 104"
                                    >
                                        <div>
                                            <p>票据照片</p>
                                            <viewer>
                                                <img
                                                    style="width:92px;height:92px;marginRight:30px;"
                                                    v-for="itemImgs in item.bill_src"
                                                    :src="itemImgs.url"
                                                    alt=""
                                                >
                                            </viewer>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </div>
            </a-skeleton>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            loadingInfo: true,
            moment,
            isShowInfo: false,
            showListInfo: {},
            isOpen: false,
        }
    },
    created() {
        // 获取食堂
        this.getDataInfo(this.$route.query.id);
    },
    methods: {
        // 获取详情
        getDataInfo(id) {
            this.$get("api/school/foods/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.record.forEach(item => {
                        if (item.photo_src == '') {
                            let imgArr = [];
                            let url, obj;
                            obj = {
                                url: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                            imgArr.push(obj)
                            item.photo_src = imgArr;
                        }
                        if (item.bill_src == '') {
                            let imgArr = [];
                            let url, obj;
                            obj = {
                                url: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                            imgArr.push(obj)
                            item.bill_src = imgArr;
                        }
                    })
                    this.showListInfo = res.data.data;
                    this.loadingInfo = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 返回
        backShowInfo() {
            window.history.back(-1);
            //传递一个map，choiceHospital是key，hospital是value
            this.eventBus.$emit('choiceHospital', this.$route.query.val);
            //调用router回退页面
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="less" scoped>
.mx_staff {
    margin: 20px 0;
}
.mx_operate {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .mx_switch {
        margin: 0 80px;
    }
    .mx_btns {
        background: #eee;
        padding: 0 10px;
        margin-left: 80px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        color: #000;
        line-height: 30px;
        .mx_outPoeration {
            cursor: pointer;
            .mx_icon {
                margin-right: 6px;
            }
        }
    }
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
.mx_main {
    padding: 18px 28px;
    margin: 4px;
    box-shadow: 0px 0px 8px 0px #ccc;
    border-radius: 4px;
    margin-top: 48px;
    .mx_title {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
    }
    .mx_list {
        display: flex;
        align-items: center;
        padding: 16px 0;
        img {
            width: 77px;
            height: 77px;
            margin-right: 56px;
        }
        .mx_left {
            display: inline-block;
            font-weight: bold;
        }
    }
}
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.extendPeriod .extendPeriodList:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
}
.components-input-demo-presuffix {
    display: flex;
    align-items: center;
    margin: 30px 0;
}
.hmTxt {
    margin: 0 10px 0 0;
}
.seachBtn {
    margin-left: 40px;
}
.seachBox {
    width: 245px;
}
</style>