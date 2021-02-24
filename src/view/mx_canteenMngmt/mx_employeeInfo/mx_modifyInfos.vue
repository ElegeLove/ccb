<template>
    <div id="mxModifyInfos">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">修改信息</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
        <a-skeleton
            :loading="loading"
            active
            :title='false'
            :paragraph="{rows: 20}"
        >
        <a-form
            :form="form"
            @submit="handleSubmit"
        >
            <a-form-item label="身份证正反面图片">
                <div>
                    <div class="clearfix">
                        <a-upload
                            action="http://bate.ccb.micmio.com/api/common/upload"
                            listType="picture-card"
                            :fileList="updataCanteens.fileList"
                            @preview="handlePreview"
                            @change="handleChange"
                        >
                            <div v-if="updataCanteens.fileList.length < 1">
                                <a-icon type="plus" />
                            </div>
                        </a-upload>
                        <a-modal
                            :visible="previewVisible"
                            :footer="null"
                            @cancel="handleCancel"
                        >
                            <img
                                alt="example"
                                style="width: 100%"
                                :src="previewImage"
                            />
                        </a-modal>
                    </div>
                    <a-upload
                        action="http://bate.ccb.micmio.com/api/common/upload"
                        :fileList="updataCanteens.fileList"
                        @preview="handlePreview"
                        @change="handleChange"
                    >
                        <a-button>
                            <a-icon type="upload" />更换图片
                        </a-button>
                    </a-upload>
                </div>
                <div>
                    <div class="clearfix">
                        <a-upload
                            action="http://bate.ccb.micmio.com/api/common/upload"
                            listType="picture-card"
                            :fileList="updataCanteens.sedList"
                            @preview="handlePreviews"
                            @change="handleChanges"
                        >
                            <div v-if="updataCanteens.sedList.length < 1">
                                <a-icon type="plus" />
                            </div>
                        </a-upload>
                        <a-modal
                            :visible="previewVisibles"
                            :footer="null"
                            @cancel="handleCancels"
                        >
                            <img
                                alt="example"
                                style="width: 100%"
                                :src="previewImages"
                            />
                        </a-modal>
                    </div>
                    <a-upload
                        action="http://bate.ccb.micmio.com/api/common/upload"
                        :fileList="updataCanteens.sedList"
                        @preview="handlePreviews"
                        @change="handleChanges"
                    >
                        <a-button>
                            <a-icon type="upload" />更换图片
                        </a-button>
                    </a-upload>
                </div>
            </a-form-item>
            <a-form-item label="身份证号码">
                <a-input
                    placeholder="填写身份证号码"
                    style="width:300px;"
                    v-decorator="[
                        'cardId',
                        {initialValue: updataCanteens.cardId,rules: [{ required: true, message: '请填写身份证号码' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="健康证图片">
                <div>
                    <div class="clearfix">
                        <a-upload
                            action="http://bate.ccb.micmio.com/api/common/upload"
                            listType="picture-card"
                            :fileList="updataCanteens.health"
                            @preview="healthPreview"
                            @change="healthChange"
                        >
                            <div v-if="updataCanteens.health.length < 1">
                                <a-icon type="plus" />
                            </div>
                        </a-upload>
                        <a-modal
                            :visible="healthVisible"
                            :footer="null"
                            @cancel="healthCancel"
                        >
                            <img
                                alt="example"
                                style="width: 100%"
                                :src="healthImage"
                            />
                        </a-modal>
                    </div>
                    <a-upload
                        action="http://bate.ccb.micmio.com/api/common/upload"
                        :fileList="updataCanteens.health"
                        @preview="healthPreview"
                        @change="healthChange"
                    >
                        <a-button>
                            <a-icon type="upload" />更换图片
                        </a-button>
                    </a-upload>
                </div>
            </a-form-item>
            <a-form-item label="健康证发证单位">
                <a-input
                    placeholder="填写发证单位"
                    style="width:300px;"
                    v-decorator="[
                        'authority',
                        {initialValue: updataCanteens.authority,rules: [{ required: true, message: '请填写发证单位' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="健康证发证日期">
                <a-date-picker
                    placeholder="发证日期选择"
                    @change="mxDateChange"
                    :value="moment(issuance, 'YYYY-MM-DD')"
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    class="mx_back"
                    @click="mxBack"
                >上一步</a-button>
                <a-button
                    type="primary"
                    html-type="submit"
                >更新保存</a-button>
            </a-form-item>
        </a-form>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            moment,
            loading:true,
            previewVisible: false,
            previewImage: "",
            fileList: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
            previewVisibles: false,
            previewImages: "",
            sedList: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
            healthVisible: false,
            healthImage: "",
            health: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
            updataCanteens:{
                fileList:[],
                sedList:[],
                health:[],
                cardId:'',
                authority:'',
            },
            form: this.$form.createForm(this),
            uploading: false,
            issuance: '',
            staffOne: '',
            values: {},
            faceId: '',
            faceUrl: '',
            sedId: '',
            sedUrl: '',
            healthId: '',
            healthUrl: '',
            updataCanteen:{},
        };
    },
    created() {
        this.updataCanteen = this.$route.query.updataCanteen
        console.log(this.updataCanteen);
        
        this.$get("api/school/staff/" + this.$route.query.id).then(res => {
            if (res.data.code == 0) {
                this.updataCanteens.cardId = res.data.data.staff.card_id;
                this.updataCanteens.authority = res.data.data.staff.authority;

                this.issuance = res.data.data.staff.join_time_str;
                let imgArr = []
                    let obj = {
                        uid: res.data.data.staff.card_photo_src[0].id,
                        name: 'xxx.png',
                        response: {
                            data: {
                                id: parseInt(res.data.data.staff.card_photo_src[0].id),
                                url: res.data.data.staff.card_photo_src[0].url
                            }
                        },
                        status: 'done',
                        url: res.data.data.staff.card_photo_src[0].url
                    }
                    imgArr.push(obj)

                this.updataCanteens.fileList = imgArr;
                let imgArr2 = []
                    let obj2 = {
                        uid: res.data.data.staff.card_photo_src[1].id,
                        name: 'xxx.png',
                        response: {
                            data: {
                                id: parseInt(res.data.data.staff.card_photo_src[1].id),
                                url: res.data.data.staff.card_photo_src[1].url
                            }
                        },
                        status: 'done',
                        url: res.data.data.staff.card_photo_src[1].url
                    }
                    imgArr2.push(obj2)
                // });

                this.updataCanteens.sedList = imgArr2;

                let imgArr3 = []
                let obj3 = {
                    uid: res.data.data.staff.health_cert_id,
                    name: 'xxx.png',
                    response: {
                        data: {
                            id: parseInt(res.data.data.staff.health_cert_id),
                            url: res.data.data.staff.health_cert_src
                        }
                    },
                    status: 'done',
                    url: res.data.data.staff.health_cert_src
                }
                imgArr3.push(obj3)
                this.updataCanteens.health = imgArr3;
                // this.joinTime = res.data.data.join_time_str
                this.loading = false;

            } else {
                console.log(22)
            }
        })
    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.push({
                path: "/mxEmployeeInfo"
            });
        },
        mxBack() {
            // window.history.back(-1);
            // this.$router.go(-1);
            this.form.validateFields((err, values) => {
                if (!err) {
                    Object.assign(this.updataCanteens, { 'cardId':values.cardId,'authority': values.authority });
                    this.$router.push({
                        path: "/mxModifyInfo",
                        query: {
                            updataCanteen: this.updataCanteen,
                            updataCanteens: this.updataCanteens,
                            id:this.$route.query.id
                        }
                    });
                }
            });
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (this.updataCanteen.sex == '男') {
                        this.updataCanteen.sex = 1
                    }
                    if (this.updataCanteen.sex == '女') {
                        this.updataCanteen.sex = 2
                    }
                    this.updataCanteen.joinTime = (moment(this.updataCanteen.joinTime).format("x") / 1000)
                    this.issuance = (moment(this.issuance).format("x") / 1000)
                    let imgArr = []
                    this.updataCanteens.fileList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let imgArr1 = []
                    this.updataCanteen.fileList.forEach(item => {
                        imgArr1.push(item.response.data.id)
                    })
                    let imgArr2 = []
                    this.updataCanteens.sedList.forEach(item => {
                        imgArr2.push(item.response.data.id)
                    })
                    let imgArr3 = []
                    this.updataCanteens.health.forEach(item => {
                        imgArr3.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/staff/" + this.$route.query.id,
                        method: 'put',
                        data: {
                            canteen_id: this.updataCanteen.canteenId,
                            title: this.updataCanteen.name,
                            sex: this.updataCanteen.sex,
                            age: this.updataCanteen.age,
                            job_title: this.updataCanteen.job_title,
                            education: this.updataCanteen.education,
                            phone: this.updataCanteen.phone,
                            location: this.updataCanteen.location,
                            join_time: this.updataCanteen.joinTime,
                            card_photo: imgArr.join(',') + ',' + imgArr2.join(','),
                            card_id: values.cardId,
                            health_cert: imgArr3.join(','),
                            authority: values.authority,
                            issuance: this.issuance,
                            face_id: imgArr1.join(',')
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('修改员工成功');
                            this.$router.push({
                                path: "/mxEmployeeInfo"
                            });
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 日期
        mxDateChange(date, dateString) {
            // console.log(date, dateString);
            this.issuance = dateString;
        },
        // 上传身份证正反面图片
        handleCancel() {
            this.previewVisible = false;
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        handleChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    this.faceId = file.response.data.id;
                    this.faceUrl = file.response.data.url;
                }
                return file;
            });

            this.updataCanteens.fileList = fileList;
        },
        handleCancels() {
            this.previewVisibles = false;
        },
        handlePreviews(file) {
            this.previewImages = file.url || file.thumbUrl;
            this.previewVisibles = true;
        },
        handleChanges(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    this.sedId = file.response.data.id;
                    this.sedUrl = file.response.data.url;
                }
                return file;
            });

            this.updataCanteens.sedList = fileList;
        },
        // 上传健康证图片
        healthCancel() {
            this.healthVisible = false;
        },
        healthPreview(file) {
            this.healthImage = file.url || file.thumbUrl;
            this.healthVisible = true;
        },
        healthChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    this.healthId = file.response.data.id;
                    this.healthUrl = file.response.data.url;
                }
                return file;
            });

            this.updataCanteens.health = fileList;
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
.clearfix {
    margin-right: 40px;
    min-width: 150px;
    min-height: 112px;
}
.mx_back {
    margin-right: 30px;
    background: #f2f2f2;
}
</style>