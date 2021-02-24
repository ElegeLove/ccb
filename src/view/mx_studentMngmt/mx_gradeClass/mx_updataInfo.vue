<template>
    <div id="mxUpdataInfo">
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
                        <div>
                            <p>学生姓名:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写学生姓名"
                                    style="width:300px;"
                                    v-decorator="[
                                    'name',
                                    {initialValue: updataStu.name,rules: [{ required: true, message: '请填写学生姓名' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>性别选择:</p>
                            <a-form-item>
                                <a-select
                                    placeholder="选择性别"
                                    style="width:300px;"
                                    @change="sexChange"
                                    v-decorator="[
                                    'sex',
                                    {initialValue: updataStu.sex,rules: [{ required: true, message: '请选择学生性别' }]}
                                ]"
                                >
                                    <a-select-option value="0">男</a-select-option>
                                    <a-select-option value="1">女</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div>
                            <p>年龄:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写学生年龄"
                                    style="width:300px;"
                                    v-decorator="[
                                    'age',
                                    {initialValue: updataStu.age,rules: [{ required: true, message: '请填写学生年龄' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>身份证号码:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写身份证号码"
                                    style="width:300px;"
                                    v-decorator="[
                                    'cardId',
                                    {initialValue: updataStu.cardId,rules: [{ required: true, message: '请填写身份证号码' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>入校日期:</p>
                            <a-form-item>
                                <a-date-picker
                                    placeholder="选择时间"
                                    @change="mxDateChange"
                                    :value="moment(joinTime, 'YYYY-MM-DD')"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>就餐方式:</p>
                            <a-form-item>
                                <a-select
                                    placeholder="选择就餐方式"
                                    style="width:300px;"
                                    @change="selectChange"
                                    v-decorator="[
                                    'diningStyle',
                                    {initialValue: updataStu.diningStyle,rules: [{ required: true, message: '请选择就餐方式' }]}
                                ]"
                                >
                                    <a-select-option
                                        v-for="item in diningStyle"
                                        :value="item.id"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div>
                            <p>监护人:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写监护人姓名"
                                    style="width:300px;"
                                    v-decorator="[
                                    'parentTitle',
                                    {initialValue: updataStu.parentTitle,rules: [{ required: true, message: '请填写监护人姓名' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>与监护人关系:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写与监护人关系"
                                    style="width:300px;"
                                    v-decorator="[
                                    'parentRelation',
                                    {initialValue: updataStu.parentRelation,rules: [{ required: true, message: '请填写与监护人关系' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <p>监护人联系电话:</p>
                            <a-form-item>
                                <a-input
                                    placeholder="填写联系电话"
                                    style="width:300px;"
                                    v-decorator="[
                                    'parentPhone',
                                    {initialValue: updataStu.parentPhone,rules: [{ required: true, message: '请填写与监护人关系' }]}
                                ]"
                                />
                            </a-form-item>
                        </div>

                    </a-col>
                    <a-col :span="16">
                        <div>
                            <p>人脸图片:</p>
                            <a-form-item>
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
                                                'faceId',
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
                        </div>
                        <div
                            class="mx_outschool"
                            v-if="isCertificate"
                        >
                            <p>校外就餐证明:</p>
                            <a-form-item>
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
                                                'diningEnclosure',
                                                {rules: [{ required: true, message: '请上传图片' }]}
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
                        </div>
                    </a-col>
                </a-row>
                <a-form-item>
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
            loading: true,
            moment,
            previewVisible: false,
            previewImage: "",
            // fileList: [],
            updataStu: {
                age: '',
                cardId: '',
                diningStyle: '',
                name: '',
                parentPhone: '',
                parentRelation: '',
                parentTitle: '',
                sex: '',
            },
            fileList: [],
            previewVisibles: false,
            previewImages: "",
            sedList: [],
            form: this.$form.createForm(this),
            uploading: false,
            diningStyle: [
                {
                    "id": 90,
                    "title": "校内三餐"
                },
                {
                    "id": 91,
                    "title": "校内午晚餐"
                },
                {
                    "id": 92,
                    "title": "校内早餐"
                },
                {
                    "id": 93,
                    "title": "校内午餐"
                },
                {
                    "id": 94,
                    "title": "校内晚餐"
                },
                {
                    "id": 95,
                    "title": "校外就餐"
                }
            ],
            isCertificate: false,
            joinTime: '',
            sex: 0,
            faceId: '',
            diningEnclosure: '',
            dateString: '',

        };
    },
    created() {
        this.$get("api/school/students/" + this.$route.query.id).then(res => {
            if (res.data.code == 0) {
                if (res.data.data.sex == 0) {
                    res.data.data.sex = '男'
                } else if (res.data.data.sex == 1) {
                    res.data.data.sex = '女'
                }
                if (res.data.data.dining_style == 95) {
                    this.isCertificate = true;
                } else {
                    this.isCertificate = false;
                }
                this.updataStu.age = res.data.data.age;
                this.updataStu.cardId = res.data.data.card_id;
                this.updataStu.diningStyle = res.data.data.dining_style;
                this.updataStu.name = res.data.data.title;
                this.updataStu.parentPhone = res.data.data.parent_phone;
                this.updataStu.parentRelation = res.data.data.parent_relation;
                this.updataStu.parentTitle = res.data.data.parent_title;
                this.updataStu.sex = res.data.data.sex;
                let imgArr = []
                let obj = {
                    uid: res.data.data.face_id,
                    name: 'xxx.png',
                    response: {
                        data: {
                            id: parseInt(res.data.data.face_id),
                            url: res.data.data.face_id_photo
                        }
                    },
                    status: 'done',
                    url: res.data.data.face_id_photo
                }
                imgArr.push(obj)
                this.fileList = imgArr;
                let imgArr2 = []
                let obj2 = {
                    uid: res.data.data.dining_enclosure,
                    name: 'xxx.png',
                    response: {
                        data: {
                            id: parseInt(res.data.data.dining_enclosure),
                            url: res.data.data.dining_enclosure_photo
                        }
                    },
                    status: 'done',
                    url: res.data.data.dining_enclosure_photo
                }
                imgArr2.push(obj2)
                this.sedList = imgArr2;
                this.joinTime = res.data.data.join_time_str
                this.loading = false;

            } else {
                this.$message.warning(res.data.msg);
            }
        })
    },
    mounted() {
        this.$get("api/school/dining", {}).then(res => {
            if (res.data.code == 0) {
                this.diningStyle = res.data.data
            } else {
                this.$message.warning(res.data.msg);
            }
        })
    },
    methods: {
        goback() {
            // window.history.back(-1);
            this.$router.go(-1)
        },
        // 选择性别
        sexChange(val) {
            this.sex = val;
        },
        // 表单提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (values.sex == '男') {
                        this.sex = 0;
                    } else if (values.sex == '女') {
                        this.sex = 1;
                    }
                    let imgArr = []
                    this.fileList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let imgArr2 = []
                    this.sedList.forEach(item => {
                        imgArr2.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/students/" + this.$route.query.id,
                        method: 'put',
                        data: {
                            title: values.name,
                            sex: this.sex,
                            age: values.age,
                            card_id: values.cardId,
                            dining_style: values.diningStyle,
                            dining_enclosure: imgArr2.join(','),
                            parent_title: values.parentTitle,
                            parent_relation: values.parentRelation,
                            parent_phone: values.parentPhone,
                            face_id: imgArr.join(','),
                            join_time: this.joinTime
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$router.go(-1)
                            this.$message.success('修改学生信息成功');
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                }
            });
        },
        // 下拉选中
        selectChange(val) {
            if (val == 95) {
                this.isCertificate = true;
            } else {
                this.isCertificate = false;
            }
        },
        // 日期
        mxDateChange(date, dateString) {
            this.joinTime = dateString;
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
                }
                return file;
            });

            this.fileList = fileList;
        },
        // 上传
        handleCancels() {
            this.previewVisibles = false;
        },
        handlePreviews(file) {
            this.previewImages = file.url || file.thumbUrl;
            this.previewVisibles = true;
        },
        handleChanges(info) {
            let sedList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            sedList = sedList.slice(-1);

            // 2. 从响应读取并显示文件链接
            sedList = sedList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                    this.diningEnclosure = file.response.data.id;
                }
                return file;
            });

            this.sedList = sedList;
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