<template>
    <div id="mxAddStaff">
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
        <p class="mx_title"><span style='color:red;'>*</span>此处建议添加厨房操作人员，将对健康证等信息公示</p>
        <a-form
            :form="form"
            @submit="handleSubmit"
        >
            <a-row class="mx_main">
                <a-col :span="8">
                    <a-form-item label="所属食堂">
                        <a-select
                            placeholder="所属食堂选择"
                            style="width:300px;"
                            v-decorator="[
                                'canteenId',
                                {rules: [{ required: true, message: '请选择员工所属食堂' }]}
                            ]"
                        >
                            <a-select-option
                                v-for="item in canteen"
                                :value="item.id"
                            >{{item.title}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="姓名">
                        <a-input
                            placeholder="填写员工姓名"
                            style="width:300px;"
                            v-decorator="[
                                'name',
                                {rules: [{ required: true, message: '请填写员工姓名' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="性别选择">
                        <a-select
                            placeholder="选择性别"
                            style="width:300px;"
                            v-decorator="[
                                'sex',
                                {rules: [{ required: true, message: '请选择员工性别' }]}
                            ]"
                        >
                            <a-select-option value="1">男</a-select-option>
                            <a-select-option value="2">女</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="年龄">
                        <a-input
                            placeholder="填写员工年龄"
                            style="width:300px;"
                            v-decorator="[
                                'age',
                                {rules: [{ required: true, message: '请填写员工年龄' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="职位">
                        <a-input
                            placeholder="填写员工职位"
                            style="width:300px;"
                            v-decorator="[
                                'jobTitle',
                                {rules: [{ required: true, message: '请填写员工职位' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="学历">
                        <a-select
                            placeholder="学历选择"
                            style="width:300px;"
                            v-decorator="[
                                'education',
                                {rules: [{ required: true, message: '请选择员工学历' }]}
                            ]"
                        >
                            <a-select-option value="未接受教育">未接受教育</a-select-option>
                            <a-select-option value="小学">小学</a-select-option>
                            <a-select-option value="初中">初中</a-select-option>
                            <a-select-option value="高中">高中</a-select-option>
                            <a-select-option value="专科">专科</a-select-option>
                            <a-select-option value="本科">本科</a-select-option>
                            <a-select-option value="研究生">研究生</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="联系电话">
                        <a-input
                            placeholder="填写联系电话"
                            style="width:300px;"
                            v-decorator="[
                                'phone',
                                {rules: [{ required: true, message: '请填写员工联系电话' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="联系地址">
                        <a-input
                            placeholder="填写联系地址"
                            style="width:300px;"
                            v-decorator="[
                                'location',
                                {rules: [{ required: true, message: '请填写员工联系地址' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="入职日期">
                            <!-- v-decorator="[
                                'joinTime',
                                {rules: [{ required: true, message: '请选择员工入职日期' }]}
                            ]" -->
                        <a-date-picker
                            placeholder="入职日期选择"
                            @change="handlePanelChange"
                        />
                            <!-- v-decorator="[
                                'joinTime',
                                {
                                    initialValue: joinTime,
                                    rules: [
                                    { required: true, message: '请选择员工入职日期'}]
                                }
                            ]" -->
                    </a-form-item>
                </a-col>
                <a-col :span="16">
                    <a-form-item label="人脸图片">
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
                                            '人脸图片',
                                            {rules: [{ required: true, message: '请录入人脸图片' }]}
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
                                    <a-icon type="upload" />人脸录入
                                </a-button>
                            </a-upload>
                        </div>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                >下一步</a-button>
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
            form: this.$form.createForm(this),
            faceId: '',
            faceUrl: '',
            joinTime: '',
            canteen: [],
        };
    },
    mounted() {
        // this.joinTime = moment().format('YYYY-MM-DD')
        this.joinTime=moment().format("YYYY-MM-DD")
        // console.log(now)
        this.getCanteen();
        if (this.$route.query.values) {
            var values = this.$route.query.values
            this.fileList = [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }]
            this.form.setFieldsValue({
                canteenId: values.canteenId,
                name: values.name,
                sex: values.sex,
                age: values.age,
                jobTitle: values.jobTitle,
                education: values.education,
                phone: values.phone,
                location: values.location,
            });
            // joinTime: moment(values.joinTime).format('YYYY-MM-DD')
            // joinTime: moment(values.joinTime).format('YYYY-MM-DD'),
            // this.joinTime = moment(values.joinTime).format('YYYY-MM-DD')
            this.fileList[0].url = values.faceUrl;
            // console.log(222222)
        }
        // this.$route.query

    },
    methods: {
        goback() {
            window.history.back(-1);
        },
        // 日期
        handlePanelChange(value, mode) {
            console.log(value)
            this.joinTime = (moment(value._d).format('x')/1000)
            // this.joinTime = mode
            // console.log(this.joinTime);
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                    console.log(res.data.data)
                    console.log(this.canteen)
                } else {
                    console.log(22)
                }
            })
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                // console.log(values);
                if (!err) {
                    // console.log("Received values of form: ", values);
                    // this.faceId = 1;
                    // Vue.set(values, 'faceId', this.faceId)
                    Object.assign(values, { 'faceId': this.faceId, 'faceUrl': this.faceUrl, 'joinTime': this.joinTime });
                    console.log(values);
                    this.$router.push({
                        path: "/mxAddStaffs",
                        query: values
                    });
                }
            });
        },
        // 上传
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
                    // console.log(file.response.data.id)
                    this.faceId = file.response.data.id;
                    this.faceUrl = file.response.data.url;
                    // this.faceId = 12;
                }
                return file;
            });

            this.fileList = fileList;
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
.mx_title {
    font-size: 20px;
    margin: 20px 0;
}
.mx_main {
    margin-top: 20px;
    .mx_outschool {
        margin-top: 240px;
    }
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
}
</style>