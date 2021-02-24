<template>
    <div id="mxPhotoGallery">
        <a-form
            layout="inline"
            class="mx_form mx_staff"
        >
            <a-form-item label="食堂：">
                <a-select
                    :value="canteenKey"
                    style="width:150px;"
                    @change="selectChange"
                >
                    <a-select-option
                        v-for="(item,index) in canteen"
                        :key="index+1"
                    >{{item.title}}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <a-form
            layout="inline"
            class="mx_form"
        >
            <a-form-item label="日期：">
                <a-date-picker
                    :disabledDate="safetyStartDate"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="safetyStartValue"
                    placeholder="选择日期"
                    @openChange="safetyStartOpenChange"
                />
                <div class="mx_divide">—</div>
                <a-date-picker
                    :disabledDate="safetyEndDate"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择日期"
                    v-model="safetyEndValue"
                    :open="endOpenSafety"
                    @openChange="safetyEndOpenChange"
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    class="mx_btnbg"
                    type="primary"
                    html-type="submit"
                    @click="mxInquiry"
                >查询</a-button>
                <a-button @click="mxReset">重置</a-button>
            </a-form-item>
            <a-form-item>
                <span class="mx_btn">
                    <span
                        class="mx_outPoeration"
                        @click="mxAllDownload"
                    >
                        批量下载
                    </span>
                </span>
            </a-form-item>
            <a-form-item>
                <span class="mx_btns">
                    <span
                        class="mx_outPoeration"
                        @click="mxAllDel"
                    >
                        批量删除
                    </span>
                </span>
            </a-form-item>
        </a-form>
        <ul class="screen">
            <li
                v-for="(item,index) in screenList"
                :class="{activeLi:screenId==item.id}"
                @click="mxScreen(item.id)"
            >{{item.text}}</li>
        </ul>
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 20}"
        >
            <a-checkbox-group
                style="width:100%;"
                @change="onChange"
            >
                <ul
                    class="mxList"
                    v-if="gallery.length>0"
                >
                    <li v-for="(item,index) in gallery">
                        <div class="mxList_pic">
                            <img
                                :src="item.url"
                                alt=""
                                @click="mxShowPic(index)"
                            >
                            <div class="mx_tabs">
                                <div>
                                    <a-checkbox :value="index"></a-checkbox>
                                </div>
                                <div class="mx_tabs_icon">
                                    <a-icon
                                        style="margin-right:6px; cursor: pointer;"
                                        type="download"
                                        @click="mxDownload"
                                    />
                                    <a-icon
                                        style="cursor: pointer;"
                                        type="delete"
                                        @click="mxDel(item.attachment_id)"
                                    />
                                    <a-modal
                                        title="删除确认"
                                        centered
                                        :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                        v-model="isDelSafety"
                                        @cancel="mxSafetyCel"
                                        @ok="mxDelSafetysure"
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <div class="mx_model">
                                            <div class="mx_model_mainDel">
                                                照片删除后无法恢复，是否继续操作？
                                            </div>
                                        </div>
                                    </a-modal>
                                </div>
                            </div>
                        </div>
                        <div class="mxList_text">
                            <p>食堂：{{item.title}}</p>
                            <p>来源：{{item.category}}</p>
                            <p>上传人：{{item.nickname}}</p>
                            <p>上传时间：{{moment(item.created_at).format('YYYY-MM-DD')}}</p>
                        </div>
                    </li>
                </ul>
                <p
                    v-else
                    style="text-align: center;marginTop:30px;"
                >暂未上传照片</p>
                <div
                    v-if="gallery.length>0"
                    style="position: relative;"
                >
                    <a-pagination
                        style="float: right;margin:16px 0;"
                        :total="total"
                        :pageSize="pageSize"
                        :current="current"
                        :showTotal="total =>`共 ${this.total} 条记录 第 ${this.current} / ${Math.ceil(
                        this.total / this.pageSize)} 页`"
                        showQuickJumper
                        @change="onChangeNum"
                    />
                </div>
            </a-checkbox-group>
        </a-skeleton>
        <div
            class="mx_pic_show"
            v-if="isPic"
            @click="mxShowPicCel"
        >
            <div class="mx_pic_main">
                <div class="mx_pic_icon">
                    <a-icon
                        style="margin-right:6px;cursor: pointer;"
                        type="download"
                        @click="mxDownload"
                    />
                    <a-icon
                        style="margin-right:6px;cursor: pointer;"
                        type="delete"
                        @click="mxDel"
                    />
                    <a-icon
                        style="cursor: pointer;"
                        type="close"
                        @click="mxBtn"
                    />
                </div>
                <a-carousel
                    arrows
                    dotsClass="slick-dots slick-thumb"
                >
                    <div
                        slot="prevArrow"
                        slot-scope="props"
                        class="custom-slick-arrow"
                    >
                        <a-icon
                            type="left-circle"
                            @click="()=>{if(imgIdex < 0){imgIdex = gallery.length-1;}else{imgIdex -= 1;}}"
                            style="left: 10px;font-size: 30px;zIndex: 50;color:#fff;"
                        />
                    </div>
                    <div
                        slot="nextArrow"
                        slot-scope="props"
                        class="custom-slick-arrow"
                    >
                        <a-icon
                            type="right-circle"
                            @click="()=>{if(imgIdex == (gallery.length - imgIdex)){imgIdex = 0;}else{imgIdex += 1;}}"
                            style="right: 10px;font-size: 30px;zIndex: 50;color:#fff;"
                        />
                    </div>
                    <a
                        slot="customPaging"
                        slot-scope="props"
                    >
                        <img :src="getImgUrl(props.i)" />
                    </a>
                    <div
                        class="mx_foot_pic"
                        v-for="item in gallery"
                    >
                        <img :src="item.url" />
                    </div>
                </a-carousel>
                <div class="mx_pic_text">
                    <p>食堂：{{getImgdetail(imgIdex).title}}</p>
                    <p>来源：{{getImgdetail(imgIdex).category}}</p>
                    <p>上传人：{{getImgdetail(imgIdex).nickname}}</p>
                    <p>上传时间：{{moment(getImgdetail(imgIdex).created_at).format('YYYY-MM-DD')}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
const baseUrl = 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
export default {
    data() {
        return {
            loading: true,
            total: 60,
            current: 1,
            pageSize: 15,
            moment,
            canteen: [],
            canteenKey: '全部',
            canteenId: 0,
            // 日期
            safetyStartValue: null,
            safetyEndValue: null,
            endOpenSafety: false,
            startTime: '',
            endTime: '',
            screenList: [
                { text: '全部', id: '0' },
                { text: '陪餐记录', id: '1' },
                { text: '留样记录', id: '2' },
                { text: '餐具消毒', id: '3' },
                { text: '安全巡检', id: '4' },
                { text: '场地消毒', id: '5' },
                { text: '防疫记录', id: '6' }
            ],
            screenId: '0',
            value: "",
            imgIdex: "",
            photoDelId: "",
            pagination: {
                pageSize: 5, // 默认每页显示数量
                current: 1, //显示当前页数
                showSizeChanger: true, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                pageSizeOptions: ["5", "10", "30"], // 指定每页可以显示多少条
                showSizeChange: (current, pageSize) =>
                    (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            recordList: [],
            gallery: [],
            isDelSafety: false,
            isPic: false,
            baseUrl,
            top: 0,

        }
    },
    watch: {
        // 安全巡检
        safetyStartValue(val) {
            if (val) {
                this.startTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
            console.log(this.startTime);
        },
        safetyEndValue(val) {
            if (val) {
                this.endTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
            console.log(this.endTime);
        },
    },
    created() {
        this.getGallery('', '', '', '');
        this.getCanteen();
    },
    methods: {
        onChangeNum(pageNumber) {
            this.current = pageNumber;
            this.loading = true;
            this.getGallery('', '', '', '');
            console.log('Page: ', pageNumber);
        },
        // 日期
        safetyStartDate(startValue) {
            const endValue = this.safetyEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        safetyEndDate(endValue) {
            const startValue = this.safetyStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        safetyStartOpenChange(open) {
            if (!open) {
                this.endOpenSafety = true;
            }
        },
        safetyEndOpenChange(open) {
            this.endOpenSafety = open;
        },
        // 筛选
        mxInquiry() {
            this.loading = true;
            this.getGallery(this.canteenId, this.startTime, this.endTime, this.screenId);
        },
        // 重置
        mxReset() {
            this.safetyStartValue = null;
            this.safetyEndValue = null;
            this.startTime = '';
            this.endTime = '';
            this.canteenKey = 1;
            this.canteenId = 0;
            this.loading = true;
            this.getGallery('', '', '', this.screenId);
        },
        // 获取照片库
        getGallery(canteen_id, begin_time, end_time, category) {
            this.$get("api/school/safety/photo?page=" + this.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time + "&category=" + category).then(res => {
                if (res.data.code == 0) {
                    console.log(res);
                    // this.current = res.data.data.current_page;
                    this.pageSize = res.data.data.per_page;
                    this.total = res.data.data.total;
                    this.gallery = res.data.data.data;
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteen.splice(0, 0, data);
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id;
        },
        // 筛选
        mxScreen(id) {
            this.screenId = id;
            this.current = 1;
            this.loading = true;
            this.getGallery(this.canteenId, this.startTime, this.endTime, this.screenId);
        },
        // 复选框
        onChange(checkedValues) {
            this.recordList = checkedValues;
        },
        // 下载
        mxDownload() {
            this.$message.success('下载照片成功');
        },
        // 批量下载
        mxAllDownload() {
            if (this.recordList.length <= 0) {
                this.$message.warning('请先选择照片');
            } else {
                this.$message.success('下载照片成功');
            }
        },
        // 删除
        mxDel(id) {
            this.isDelSafety = true;
            this.photoDelId = id
        },
        mxSafetyCel() {
            this.isDelSafety = false;
        },
        mxDelSafetysure() {
            this.isDelSafety = false;
            let data = {
                url: "api/school/safety/photo/" + this.photoDelId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除成功");
                this.loading = true;
                this.getGallery(this.canteenId, this.startTime, this.endTime, this.screenId);
            })
        },
        // 批量删除
        mxAllDel() {
            if (this.recordList.length <= 0) {
                this.$message.warning('请先选择照片');
            } else {
                let idArr = [];
                this.recordList.forEach(item => {
                    idArr.push(this.gallery[item].attachment_id);

                })
                let data = {
                    url: "api/school/safety/photo/" + idArr.join(','),
                    method: 'delete',
                    data: {},
                };
                this.$apiAxiox(data).then((res) => {
                    this.$message.success("删除成功");
                    this.loading = true;
                    this.getGallery(this.canteenId, this.startTime, this.endTime, this.screenId);
                })
            }
        },
        mxShowPic(i) {
            console.log(i);
            this.imgIdex = i;
            this.isPic = true;
            let bodyEl = document.body
            if (this.isPic) {
                this.top = window.scrollY

                bodyEl.style.position = 'fixed'
                bodyEl.style.top = -this.top + 'px'
            } else {
                bodyEl.style.position = ''
                bodyEl.style.top = ''

                window.scrollTo(0, this.top) // 回到原先的top
            }

        },
        mxShowPicCel() {
            // this.isPic = false;
        },
        mxBtn() {
            this.isPic = false;
            let bodyEl = document.body
            if (this.isPic) {
                this.top = window.scrollY

                bodyEl.style.position = 'fixed'
                bodyEl.style.top = -this.top + 'px'
            } else {
                bodyEl.style.position = ''
                bodyEl.style.top = ''

                window.scrollTo(0, this.top) // 回到原先的top
            }
        },
        getImgdetail(imgIdex) {
            if (imgIdex < 0) {
                imgIdex = this.gallery.length - 1
            }
            if (imgIdex > this.gallery.length-1) {
                imgIdex = 0
            }
            return this.gallery[imgIdex];
        },
        // 轮播图片
        getImgUrl(i) {
            return `${this.gallery[i].url}`
        }
    },
}
</script>

<style lang="less">
.slick-dots,.slick-thumb{
    white-space: nowrap;
    overflow-x: overlay;
}
.mx_divide {
    line-height: 30px;
    padding: 0 10px;
}
.mx_btnbg {
    margin: 0 10px;
}

.mx_staff {
    margin: 20px 0;
}
.mx_btn {
    margin: 0 20px 0 100px;
}
.mx_btn,
.mx_btns {
    background: #eee;
    padding: 0 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 30px;
    .mx_outPoeration {
        cursor: pointer;
    }
}
.screen {
    display: flex;
    align-items: center;
    margin-top: 30px;
    li {
        margin-right: 30px;
        cursor: pointer;
    }
}
.activeLi {
    color: #02bb72;
}
.mxList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 30px;
    position: relative;
    top: 0;
    // z-index: 5;
    li {
        border: 1px solid #ccc;
        border-radius: 5px;
        position: relative;
        margin: 0 30px 50px 0;
        .mxList_text {
            padding: 14px 0 10px 14px;
            p {
                margin: 0;
            }
        }
        .mxList_pic {
            img {
                width: 200px;
                height: 190px;
                border-radius: 5px 5px 0 0;
            }
            :hover {
                .mx_tabs {
                    .mx_tabs_icon {
                        display: block;
                    }
                }
            }
            .ant-checkbox {
                position: absolute;
                top: 5px;
                left: 10px;
            }
            .mx_tabs {
                width: 100%;
                padding: 0 12px;
                font-size: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: absolute;
                top: 5px;
                right: 0;
            }
        }
    }
}
.mx_tabs_icon {
    display: none;
}
.mxList_pic:hover .mx_tabs_icon {
    display: block;
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
.mx_pic_show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(48, 48, 48, 0.4);
    .mx_pic_main {
        width: 800px;
        height: 712px;
        background: #fff;
        z-index: 40;
        position: relative;
        .mx_pic_icon {
            font-size: 20px;
            position: absolute;
            top: 10px;
            right: 20px;
            z-index: 50;
        }
        .mx_pic_text {
            width: 100%;
            position: absolute;
            bottom: 110px;
            left: 20px;
            z-index: 50;
        }
        .ant-carousel .slick-dots {
            height: auto;
        }
        .ant-carousel .slick-slide img {
            display: block;
            width: 100%;
            height: 600px;
        }
        .ant-carousel .slick-thumb {
            bottom: -100px;
        }
        .ant-carousel .slick-thumb li {
            width: 150px;
            height: 100px;
        }
        .ant-carousel .slick-thumb li img {
            width: 100%;
            height: 100%;
            filter: grayscale(100%);
        }
        .ant-carousel .slick-thumb li.slick-active img {
            filter: grayscale(0%);
        }
        .ant-carousel .slick-next {
            right: 30px;
        }
        .ant-carousel .slick-prev {
            left: 30px;
            z-index: 10;
        }
    }
}
</style>