<template>
    <div id="mxModifyInfo">
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
            <a-row class="mx_main">
                <a-col :span="8">
                    <a-form-item label="所属食堂">
                        <a-select
                            placeholder="所属食堂选择"
                            style="width:300px;"
                            v-decorator="[
                                'canteenId',
                                {initialValue: updataCanteen.canteenId,rules: [{ required: true, message: '请选择员工所属食堂' }]}
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
                                {initialValue: updataCanteen.name,rules: [{ required: true, message: '请填写员工姓名' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="性别选择">
                        <a-select
                            placeholder="选择性别"
                            style="width:300px;"
                            @change="sexChange"
                            v-decorator="[
                                'sex',
                                {initialValue: updataCanteen.sex,rules: [{ required: true, message: '请选择性别' }]}
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
                                {initialValue: updataCanteen.age,rules: [{ required: true, message: '请填写员工年龄' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="职位">
                        <a-input
                            placeholder="填写员工职位"
                            style="width:300px;"
                            v-decorator="[
                                'job_title',
                                {initialValue: updataCanteen.job_title,rules: [{ required: true, message: '请填写员工职位' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="学历">
                        <a-select
                            placeholder="学历选择"
                            style="width:300px;"
                            v-decorator="[
                                'education',
                                {initialValue: updataCanteen.education,rules: [{ required: true, message: '请选择员工学历' }]}
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
                                {initialValue: updataCanteen.phone,rules: [{ required: true, message: '请填写联系电话' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="联系地址">
                        <a-input
                            placeholder="填写联系地址"
                            style="width:300px;"
                            v-decorator="[
                                'location',
                                {initialValue: updataCanteen.location,rules: [{ required: true, message: '请填写联系地址' }]}
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="入职日期">
                        <a-date-picker
                            placeholder="入职日期选择"
                            @change="mxDateChange"
                            :value="moment(joinTime, 'YYYY-MM-DD')"
                        />
                            <!-- :value="moment(joinTime).format('YYYY-MM-DD')" -->
                    </a-form-item>
                </a-col>
                <a-col :span="16">
                    <a-form-item label="人脸图片">
                        <div>
                            <div class="clearfix">
                                <a-upload
                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                    listType="picture-card"
                                    :fileList="updataCanteen.fileList"
                                    @preview="handlePreview"
                                    @change="handleChange"
                                >
                                    <div v-if="updataCanteen.fileList.length < 1">
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
                                :fileList="updataCanteen.fileList"
                                @preview="handlePreview"
                                @change="handleChange"
                            >
                                <a-button>
                                    <a-icon type="upload" />重新录入
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
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            loading:true,
            moment,
            previewVisible: false,
            previewImage: "",
            form: this.$form.createForm(this),
            updataCanteen:{
                canteenId: '',
                name: '',
                sex: '',
                age: '',
                job_title: '',
                education: '',
                phone: '',
                location: '',
                fileList: [],
            },
            uploading: false,
            canteen: [],
            canteenKey: '',
            canteenId: '',
            joinTime: '',
            faceId: '',
            faceUrl: '',
            sex: 0,
            staffList: {}
        };
    },
    created () {
        if(this.$route.query.updataCanteen){
            this.updataCanteen.canteenId = this.$route.query.updataCanteen.canteenId;
                this.updataCanteen.name = this.$route.query.updataCanteen.name;
                this.updataCanteen.sex = this.$route.query.updataCanteen.sex;
                this.updataCanteen.age = this.$route.query.updataCanteen.age;
                this.updataCanteen.job_title = this.$route.query.updataCanteen.job_title;
                this.updataCanteen.education = this.$route.query.updataCanteen.education;
                this.updataCanteen.phone = this.$route.query.updataCanteen.phone;
                this.updataCanteen.location = this.$route.query.updataCanteen.location;
                this.joinTime = this.$route.query.updataCanteen.joinTime;
                this.updataCanteen.fileList = this.$route.query.updataCanteen.fileList;
                this.loading = false;
        }else{
            this.$get("api/school/staff/" + this.$route.query.id).then(res => {
            if (res.data.code == 0) {
                this.updataCanteen.canteenId = res.data.data.staff.canteen_id;
                this.updataCanteen.name = res.data.data.staff.title;
                this.updataCanteen.sex = res.data.data.staff.sex;
                this.updataCanteen.age = res.data.data.staff.age;
                this.updataCanteen.job_title = res.data.data.staff.job_title;
                this.updataCanteen.education = res.data.data.staff.education;
                this.updataCanteen.phone = res.data.data.staff.phone;
                this.updataCanteen.location = res.data.data.staff.location;
                this.joinTime = res.data.data.staff.join_time_str;
                let imgArr = []
                let obj = {
                    uid: res.data.data.staff.face_id,
                    name: 'xxx.png',
                    response: {
                        data: {
                            id: parseInt(res.data.data.staff.face_id),
                            url: res.data.data.staff.face_id_src
                        }
                    },
                    status: 'done',
                    url: res.data.data.staff.face_id_src
                }
                imgArr.push(obj)
                this.updataCanteen.fileList = imgArr;
                this.loading = false;

            } else {
                this.$message.warning(res.data.msg);
            }
        })
        }
    },
    mounted() {
        this.getCanteen();
        // this.staffList = this.$route.query.staffInfo;
        // // console.log(this.$route.query.staffInfo);
        // if (this.$route.query.values) {
        //     var values = this.$route.query.values
        //     this.form.setFieldsValue({
        //         canteenId: values.canteenId,
        //         name: values.name,
        //         sex: values.sex,
        //         age: values.age,
        //         job_title: values.job_title,
        //         education: values.education,
        //         phone: values.phone,
        //         location: values.location,
        //     });
        //     // this.joinTime = values.joinTime;
        //     this.joinTime = values.joinTime;
        //     // this.joinTime = moment(values.joinTime, 'x');
        //     this.fileList[0].url = values.faceUrl;
        //     this.faceId = values.faceId;
        //     this.faceUrl = values.faceUrl;
        // } else {
        //     this.form.setFieldsValue({
        //         canteenId: this.staffList.canteen_id,
        //         name: this.staffList.name,
        //         sex: this.staffList.sex,
        //         age: this.staffList.age,
        //         job_title: this.staffList.job_title,
        //         education: this.staffList.education,
        //         phone: this.staffList.phone,
        //         location: this.staffList.location,
        //     });
        //     // this.joinTime = this.staffList.join_time
        //     this.joinTime = this.staffList.join_time_str
        //     // this.joinTime = moment(this.staffList.join_time).format("YYYY-MM-DD")
        //     this.fileList[0].url = this.staffList.face_id_src;
        //     this.faceId = this.staffList.face_id;
        //     this.faceUrl = this.staffList.face_id_src;
        // }
    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.push({
                path: "/mxEmployeeInfo"
            });
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data;
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 选择性别
        sexChange(val) {
            this.sex = val;
        },
        // 日期
        mxDateChange(date, dateString) {
            this.joinTime = dateString;
        },
        // 下一步
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    Object.assign(values, { 'fileList':this.updataCanteen.fileList,'joinTime': this.joinTime });
                    this.$router.push({
                        path: "/mxModifyInfos",
                        query: {
                            updataCanteen: values,
                            id:this.$route.query.id
                        }
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

            this.updataCanteen.fileList = fileList;
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
.mx_main {
    margin-top: 40px;
    .mx_outschool {
        margin-top: 240px;
    }
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
}
</style>