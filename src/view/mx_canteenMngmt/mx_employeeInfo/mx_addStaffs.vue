<template>
    <div id="mxAddStaffs">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">添加员工</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
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
                            :fileList="fileList"
                            @preview="handlePreview"
                            @change="handleChange"
                        >
                            <div
                                v-if="fileList.length < 1"
                                v-decorator="[
                                    '身份证正面图片',
                                    {rules: [{ required: true, message: '请上传身份证正面图片' }]}
                                ]"
                            >
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
                        :fileList="fileList"
                        @preview="handlePreview"
                        @change="handleChange"
                    >
                        <a-button>
                            <a-icon type="upload" />上传图片
                        </a-button>
                    </a-upload>
                </div>
                <div>
                    <div class="clearfix">
                        <a-upload
                            action="http://bate.ccb.micmio.com/api/common/upload"
                            listType="picture-card"
                            :fileList="sedList"
                            @preview="handlePreviews"
                            @change="handleChanges"
                        >
                            <div
                                v-if="sedList.length < 1"
                                v-decorator="[
                                    '身份证反面图片',
                                    {rules: [{ required: true, message: '请上传身份证反面图片' }]}
                                ]"
                            >
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
                        :fileList="sedList"
                        @preview="handlePreviews"
                        @change="handleChanges"
                    >
                        <a-button>
                            <a-icon type="upload" />上传图片
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
                        {rules: [{ required: true, message: '请填写身份证号码' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="健康证图片">
                <div>
                    <div class="clearfix">
                        <a-upload
                            action="http://bate.ccb.micmio.com/api/common/upload"
                            listType="picture-card"
                            :fileList="health"
                            @preview="healthPreview"
                            @change="healthChange"
                        >
                            <div
                                v-if="health.length < 1"
                                v-decorator="[
                                    '健康证图片',
                                    {rules: [{ required: true, message: '请上传健康证图片' }]}
                                ]"
                            >
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
                        :fileList="health"
                        @preview="healthPreview"
                        @change="healthChange"
                    >
                        <a-button>
                            <a-icon type="upload" />上传图片
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
                        {rules: [{ required: true, message: '请填写发证单位' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item label="健康证发证日期">
                <a-date-picker
                    placeholder="发证日期选择"
                    @change="mxDateChange"
                    v-decorator="[
                        'issuance',
                        {rules: [{ required: true, message: '请选择发证日期' }]}
                    ]"
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
                >立即添加</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            moment,
            previewVisible: false,
            previewImage: "",
            fileList: [],
            previewVisibles: false,
            previewImages: "",
            sedList: [],
            healthVisible: false,
            healthImage: "",
            health: [],
            form: this.$form.createForm(this),
            uploading: false,
            addStaff: {},
            dateString: '',
            justId: '',
            backId: '',
            healthId: '',
        };
    },
    mounted() {
        this.addStaff = this.$route.query
        console.log(this.addStaff)
    },
    methods: {
        goback() {
            this.$router.push({
                path: "/mxEmployeeInfo"
                // query: {
                //     goods_id: id,
                //     user_id: userid
                // }
            });
        },
        mxBack() {
            // window.history.back(-1);
            // this.$router.go(-1);
            this.$router.push({
                path: "/mxAddStaff",
                query: {
                    values: this.addStaff
                }
            });
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log("Received values of form: ", values);
                    let data = {
                        url: "api/school/staff",
                        method: 'post',
                        data: {
                            canteen_id: this.addStaff.canteenId,
                            title: this.addStaff.name,
                            sex: this.addStaff.sex,
                            age: this.addStaff.age,
                            job_title: this.addStaff.jobTitle,
                            education: this.addStaff.education,
                            phone: this.addStaff.phone,
                            location: this.addStaff.location,
                            join_time: this.addStaff.joinTime,
                            card_photo: this.justId + ',' + this.backId,
                            card_id: values.cardId,
                            health_cert: this.healthId,
                            authority: values.authority,
                            issuance: this.dateString,
                            face_id: this.addStaff.faceId
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('添加员工成功');
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
            this.dateString = (moment(date._d).format('x')/1000)
            // this.dateString = dateString;
        },
        // 上传身份证正反面图片
        handleCancel() {
            this.previewVisible = false;
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        // handleChange ({ fileList }) {
        //     this.fileList = fileList
        // },
        handleChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    console.log(file.response.data.id)
                    this.justId = file.response.data.id;
                    // this.justId = 20;
                }
                return file;
            });

            this.fileList = fileList;
        },
        handleCancels() {
            this.previewVisibles = false;
        },
        handlePreviews(file) {
            this.previewImages = file.url || file.thumbUrl;
            this.previewVisibles = true;
        },
        // handleChange ({ fileList }) {
        //     this.fileList = fileList
        // },
        handleChanges(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    console.log(file.response.data.id)
                    this.backId = file.response.data.id;
                    // this.backId = 18;
                }
                return file;
            });

            this.sedList = fileList;
        },
        // 上传健康证图片
        healthCancel() {
            this.healthVisible = false;
        },
        healthPreview(file) {
            this.healthImage = file.url || file.thumbUrl;
            this.healthVisible = true;
        },
        // handleChange ({ fileList }) {
        //     this.fileList = fileList
        // },
        healthChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    console.log(file.response.data.id)
                    this.healthId = file.response.data.id;
                    // this.healthId = 15;
                }
                return file;
            });

            this.health = fileList;
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
}
.mx_back {
    margin-right: 30px;
    background: #f2f2f2;
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
}
</style>