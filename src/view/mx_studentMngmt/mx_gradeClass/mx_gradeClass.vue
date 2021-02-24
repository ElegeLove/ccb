<template>
    <div id="mxGradeClass">
        <div v-if="data.length <= 0">
            暂无学制信息
        </div>
        <div
            v-for="(item, index) in data"
            :key="index"
        >
            <a-skeleton
                :loading="loading"
                active
                :title='false'
                :paragraph="{rows: 2}"
            >
                <div class="mx_title">{{ item.title }}</div>
            </a-skeleton>
            <a-skeleton
                :loading="loading"
                active
                :title='false'
                :paragraph="{rows: 6}"
            >
                <a-list
                    class="mx_list"
                    :grid="{ gutter: 16, column: 4 }"
                    :dataSource="item.children"
                >
                    <a-list-item
                        slot="renderItem"
                        slot-scope="itemChild, index"
                    >
                        <a-card
                            class="mx_card"
                            @click="mxListInfo(item.title,itemChild.title,itemChild.id)"
                            :bordered="false"
                        >
                            <div>{{ itemChild.title }}</div>
                            <div>{{ itemChild.num }}个班</div>
                        </a-card>
                    </a-list-item>
                </a-list>
            </a-skeleton>
        </div>
    </div>
</template>

<script>
import formatReq from '../../../globalApi/globalApi'
const data = [
    {
        title: "幼儿园",
        children: [
            {
                title: "小班",
                pid: "1"
            },
            {
                title: "中班",
                pid: "14"
            },
            {
                title: "大班",
                pid: "14"
            },
            {
                title: "学前班",
                pid: "10"
            }
        ]
    },
    {
        title: "小学",
        children: [
            {
                title: "学前班",
                pid: "14"
            },
            {
                title: "一年级",
                pid: "8"
            },
            {
                title: "二年级",
                pid: "12"
            },
            {
                title: "三年级",
                pid: "2"
            },
            {
                title: "四年级",
                pid: "5"
            },
            {
                title: "五年级",
                pid: "5"
            },
            {
                title: "六年级",
                pid: "6"
            }
        ]
    },
    {
        title: "初中",
        children: [
            {
                title: "初一",
                pid: "14"
            },
            {
                title: "初二",
                pid: "14"
            },
            {
                title: "初三",
                pid: "5"
            },
            {
                title: "初四",
                pid: "7"
            }
        ]
    },
    {
        title: "高中",
        children: [
            {
                title: "高一",
                pid: "11"
            },
            {
                title: "高二",
                pid: "10"
            },
            {
                title: "高三",
                pid: "12"
            }
        ]
    }
];
export default {
    data() {
        return {
            loading: true,
            data,
            dataList: [
                {
                    "id": 5,
                    "title": "幼儿园",
                    "pid": 0,
                    "children": [
                        {
                            "id": 44,
                            "title": "小班",
                            "pid": 5
                        },
                        {
                            "id": 45,
                            "title": "中班",
                            "pid": 5
                        },
                        {
                            "id": 46,
                            "title": "大班",
                            "pid": 5
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "小学六年制",
                    "pid": 0,
                    "children": [
                        {
                            "id": 17,
                            "title": "一年级",
                            "pid": 7
                        },
                        {
                            "id": 18,
                            "title": "二年级",
                            "pid": 7
                        },
                        {
                            "id": 19,
                            "title": "三年级",
                            "pid": 7
                        },
                        {
                            "id": 20,
                            "title": "四年级",
                            "pid": 7
                        },
                        {
                            "id": 21,
                            "title": "五年级",
                            "pid": 7
                        },
                        {
                            "id": 22,
                            "title": "六年级",
                            "pid": 7
                        }
                    ]
                }
            ]
        };
    },
    mounted() {
        let data = {
            url: 'api/school/grade',
            method: 'get',
            data: {},
        };
        this.$apiAxiox(data).then((res) => {
            if (res.data.code == 0) {
                this.data = res.data.data
                this.loading = false;
            } else {
                this.$message.warning(res.data.msg);
            }
        })

    },
    methods: {
        mxListInfo(schoolSystem, grade, id) {
            this.$router.push({
                path: "/mxClassList",
                query: {
                    schoolSystem: schoolSystem,
                    gradeName: grade,
                    gradeid: id,
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
#mxGradeClass {
    padding: 0 20px;
}
.mx_title {
    font-size: 16px;
    font-weight: bold;
    line-height: 100px;
}
.mx_list {
    text-align: center;
}
.mx_card {
    width: 214px;
    height: 138px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px #ccc;
    cursor: pointer;
}
</style>