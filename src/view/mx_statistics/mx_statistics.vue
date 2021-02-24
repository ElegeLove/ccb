<template>
    <div id="mx_statistics">

        <div class="mx_header"><span>{{moment().format('YYYY年MM月DD日 HH:mm:ss')}}</span></div>
        <h1>{{name}}智慧管理云平台</h1>
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 30}"
        >
            <a-row>
                <a-col :span="8">
                    <div class="mx_canteenCensus">
                        <p>食堂数量：{{dataInfo.canteen_num}}个</p>
                        <p>在校总人数：{{dataInfo.student_count}}人</p>
                        <p style="margin:0;">已守护{{dataInfo.student_count}}名孩子{{dataInfo.total_day}}天食品安全</p>
                    </div>
                    <div class="mx_estCensus">
                        <table>
                            <thead>
                                <tr>
                                    <td>就餐应到/实到</td>
                                    <td>早餐</td>
                                    <td>午餐</td>
                                    <td>晚餐</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in 5">
                                    <td>食堂1</td>
                                    <td>51人 / 46人</td>
                                    <td>51人 / 46人</td>
                                    <td>51人 / 46人</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        class="mx_canteenCensus"
                        style="marginTop:30px;"
                    >
                        <p>食材订单</p>
                        <div class="mx_main">
                            <div>
                                <p>{{orderFoods.order_service}}</p>
                                <p>今日送达订单</p>
                            </div>
                            <div>
                                <p>&yen;{{orderFoods.order_total_price}}</p>
                                <p>订单总额</p>
                            </div>
                        </div>
                        <div
                            class="mx_main"
                            style="marginTop:40px;"
                        >
                            <div>
                                <p>&yen;{{orderFoods.order_term_price}}</p>
                                <p>本学期采购总额</p>
                            </div>
                            <div>
                                <p>&yen;{{orderFoods.order_loss}}</p>
                                <p>本学期损耗总额</p>
                            </div>
                        </div>
                    </div>
                </a-col>
                <a-col :span="16">
                    <!-- <div
                    class="mx_canteenCensus"
                    style="marginLeft:50px;"
                > -->
                    <!-- <p>工勤人员信息</p> -->
                    <div
                        class="mx_canteenCensus"
                        style="display: flex;flex-wrap: wrap;align-items: center;marginLeft:50px;"
                    >
                        <div
                            v-for="item in staffInfo"
                            style="margin:0 2px;"
                        >
                            <chart
                                ref="chart1"
                                style="width:260px; height:240px;"
                                :options="item.option"
                                :auto-resize="true"
                            >
                            </chart>
                            <p style="text-align: center;">{{item.title}}</p>
                        </div>
                    </div>
                    <!-- </div> -->
                    <div
                        class="mx_canteenCensus"
                        style="display: flex;flex-wrap: wrap;align-items: center;margin:20px 0 0 50px;"
                    >
                        <div v-for="item in safetySituation">
                            <chart
                                ref="chart1"
                                style="width:260px; height:240px;"
                                :options="item.options"
                                :auto-resize="true"
                            >
                            </chart>
                            <p style="text-align: center;">{{item.title}}</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            moment,
            name:'',
            loading: true,
            dataInfo: {},
            orderFoods: {},
            staffInfo: [],
            safetySituation: [],
            option: {},
            options: {},
            datalist: ["陪餐记录", "留样记录", "餐具消毒", "健康晨检", "安全巡检", "场地消毒", "废弃物处理", "防疫记录"],
        }
    },
    created() {
        this.getDataInfo();
        this.name = localStorage.getItem('schoolName');
        
    },
    mounted() {
        this.getDataInfo();
        this.option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}人"
            },
            series: [
                {
                    name: '人数',
                    type: 'pie',
                    radius: '55%',
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    // center: ['50%', '60%'],
                    data: [
                        { value: 21, name: '出勤' },
                        { value: 2, name: '健康证过期' },
                        { value: 1, name: '晨检异常' },
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 5,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
            ]
        };
        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} 次"
            },
            series: [
                {
                    name: '次数',
                    type: 'pie',
                    radius: '55%',
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    center: ['50%', '60%'],
                    data: [
                        { value: 5, name: '食堂1' },
                        { value: 5, name: '食堂2' },
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    },
    methods: {
        // 获取数据信息
        getDataInfo() {
            let that = this;
            this.$get("api/school/kanban/report").then(res => {
                if (res.data.code == 0) {
                    that.dataInfo = res.data.data;
                    that.orderFoods = res.data.data.order;
                    res.data.data.staff.forEach(e => {
                        e.option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}人"
                            },
                            series: [
                                {
                                    name: '人数',
                                    type: 'pie',
                                    radius: '40%',//图形的放大缩小
                                    data: [
                                        { value: e.attend_num, name: '出勤' },
                                        { value: e.overdue_num, name: '健康证过期' },
                                        { value: e.examine_abnormal_num, name: '晨检异常' },
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                },
                            ]
                        };
                    });
                    let recordArr = [];
                    recordArr.push(res.data.data.safety.cater);
                    recordArr.push(res.data.data.safety.sample);
                    recordArr.push(res.data.data.safety.disinfec);
                    recordArr.push(res.data.data.safety.examine);
                    recordArr.push(res.data.data.safety.patrol);
                    recordArr.push(res.data.data.safety.boil);
                    recordArr.push(res.data.data.safety.scrap);
                    recordArr.push(res.data.data.safety.plague);

                    recordArr.forEach(e => {
                        let dataArr = [];
                        e.data.forEach(e1 => {
                            let obj = { value: e1.num, name: e1.canteen_str };
                            dataArr.push(obj)
                        })
                        e.options = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} 次"
                            },
                            series: [
                                {
                                    name: '次数',
                                    type: 'pie',
                                    radius: '25%',
                                    // label: {
                                    //     normal: {
                                    //         position: 'inner'
                                    //     }
                                    // },
                                    // center: ['50%', '60%'],
                                    data: dataArr,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        };
                    });
                    that.safetySituation = recordArr;
                    that.staffInfo = res.data.data.staff;
                    that.loading = false;
                } else {
                    console.log(22)
                }
            })
        }
    },
}
</script>

<style lang="less" scoped>
.mx_header {
    text-align: right;
    color: #5a5a5a;
}
h1 {
    width: 100%;
    font-weight: bold;
    text-align: center;
}
.mx_canteenCensus {
    box-shadow: 0px 0px 4px 0px #ccc;
    padding: 20px 24px;
    border-radius: 5px;
    color: #5a5a5a;
}
.mx_estCensus {
    width: 100%;
    box-shadow: 0px 0px 4px 0px #ccc;
    margin-top: 30px;
    text-align: center;
    padding: 20px;
    color: #5a5a5a;
}
.mx_estCensus table {
    width: 100%;
}
.mx_estCensus tr td:first-child {
    text-align: left;
}
.mx_main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 0 10px;
    color: #5a5a5a;
}
</style>