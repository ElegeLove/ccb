<template>
    <div id="mx_personal">
        <div v-if="!isChangePhone">
            <div class="header_info">
                <h2 style="fontWeight: bold;">个人中心</h2>
                <div>
                    <p style="width:100px;marginRight:30px;">用&nbsp;户&nbsp;I&nbsp;D：</p>
                    <p>00221634</p>
                </div>
                <div>
                    <p style="width:100px;marginRight:30px;">绑定手机：</p>
                    <p>15123589635</p><span
                        style="marginLeft:30px;color: #02bb72;cursor: pointer;"
                        @click="mxChangePhone"
                    >更换</span>
                </div>
                <div>
                    <p style="width:100px;marginRight:30px;">账号：</p>
                    <p>15123228087</p>
                </div>
                <div style="marginBottom:40px;">
                    <p style="width:100px;marginRight:30px;">密码：</p>
                    <a-input
                        disabled="disabled"
                        style="width:216px;"
                    />
                    <p
                        style="marginLeft:20px;color: #02bb72;cursor: pointer;"
                        @click="mxUpdata"
                    >修改</p>
                    <a-modal
                        title="修改密码"
                        centered
                        :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                        v-model="isUpdata"
                    >
                        <div class="mx_model">
                            <div class="mx_model_mainDel">
                                <a-form :form="form">
                                    <a-form-item
                                        style="display: flex;"
                                        label="原密码："
                                        :label-col="{ span: 6 }"
                                        :wrapper-col="{ span: 12 }"
                                    >
                                        <a-input
                                            style="width:240px;"
                                            v-decorator="[
                                                'pwd',
                                                {rules: [{ required: true, message: '请输入原密码' }]}
                                            ]"
                                            placeholder="请输入原密码"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        style="display: flex;"
                                        label="新密码："
                                        :label-col="{ span: 6 }"
                                        :wrapper-col="{ span: 12 }"
                                    >
                                        <a-input
                                            style="width:240px;"
                                            v-decorator="[
                                                'newpwd',
                                                {rules: [{ required: true, message: '请输入新密码' },{ pattern: /[0-9a-zA-Z]{6,20}/, message: '6~20位数字或字母' }]}
                                            ]"
                                            placeholder="请输入新密码"
                                            @change="mxNewPwd"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        style="display: flex;"
                                        label="再次确认："
                                        :label-col="{ span: 6 }"
                                        :wrapper-col="{ span: 12 }"
                                        id="renewpwd"
                                    >
                                        <a-input
                                            style="width:240px;"
                                            v-decorator="[
                                                'renewpwd',
                                                {rules: [{ required: true, message: '请再次输入确认' }]}
                                            ]"
                                            @blur="validatePhoneBlur"
                                            placeholder="请再次输入确认"
                                        />
                                    </a-form-item>
                                </a-form>
                            </div>
                        </div>
                        <template slot="footer">
                            <a-button
                                key="back"
                                @click="mxUpdataCel"
                            >取 消</a-button>
                            <a-button
                                key="submit"
                                type="primary"
                                @click="mxUpdataOk"
                            >
                                确定
                            </a-button>
                        </template>
                    </a-modal>
                </div>
                <div>
                    <p style="width:100px;marginRight:30px;">创建时间：</p>
                    <p><span>2019-06-24</span>&nbsp;&nbsp;<span>15:26</span></p>
                </div>
                <div>
                    <p style="width:100px;marginRight:30px;">有效使用期至：</p>
                    <p><span>2019-06-24</span>&nbsp;&nbsp;<span>15:26</span></p><span
                        style="marginLeft:30px;color: #02bb72;cursor: pointer;"
                        @click="mxRenew"
                    >续费</span>

                    <a-modal
                        title="续费提示"
                        centered
                        :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                        v-model="isRenew"
                    >
                        <div class="mx_model">
                            <div class="mx_model_mainDel">
                                呼叫续费成功，24小时内我们将主动联系您，请留意
                            </div>
                        </div>
                        <template slot="footer">
                            <a-button
                                key="submit"
                                type="primary"
                                @click="mxOkRenew"
                            >
                                我知道了
                            </a-button>
                        </template>
                    </a-modal>
                </div>
            </div>
            <div style="marginTop:40px;padding:0 45px;">
                <h2>个性化配置</h2>
                <a-form
                    :form="form"
                    @submit="handleSubmit"
                >
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="系统中文名称">
                                <a-input
                                    maxlength="12"
                                    placeholder="自定义系统中文名称"
                                    style="width:330px;"
                                />
                            </a-form-item>
                            <a-form-item label="系统英文名称">
                                <a-input
                                    maxlength="12"
                                    placeholder="自定义系统英文名称"
                                    style="width:330px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item>
                                <div>
                                    <p>系统图标<span style="marginLeft:10px;color: #02bb72;cursor: pointer;">（使用默认）</span></p>
                                    <div>
                                        <div class="clearfix">
                                            <a-upload
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                listType="picture-card"
                                                :fileList="fileList"
                                                @preview="handlePreview"
                                                @change="handleChange"
                                            >
                                                <div v-if="fileList.length < 1">
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
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            :fileList="fileList"
                                            @preview="handlePreview"
                                            @change="handleChange"
                                        >
                                            <a-button>
                                                <a-icon type="upload" />上传图片
                                            </a-button>
                                        </a-upload>
                                    </div>
                                </div>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                        >
                            更新保存
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <!-- 更换绑定手机 -->
        <div v-if="isChangePhone">
            <div style="border-bottom: 12px solid #f6f6f6;padding: 0 22px 0;">
                <!-- 头部 -->
                <a-breadcrumb separator=" ">
                    <a-breadcrumb-item>
                        <a-icon
                            @click="backChangePhone"
                            class="mx_header_icon"
                            type="arrow-left"
                        />
                    </a-breadcrumb-item>
                    <a-breadcrumb-item class="mx_header_text">更换绑定手机</a-breadcrumb-item>
                </a-breadcrumb>
                <div style="margin:66px 0 40px;padding:0 14px;">
                    <p>请输入原密码验证身份</p>
                    <a-input
                        style="width:312px;"
                        placeholder="请输入原密码"
                    />
                </div>
            </div>
            <div style="margin:66px 0 40px;padding:0 36px;">
                <p>新绑定手机号</p>
                <a-input
                    style="width:312px;"
                    placeholder="输入手机号"
                />
                <div style="width:312px;display: flex;align-items: center;margin:30px 0 120px;">
                    <a-input
                        style="marginRight:16px;"
                        placeholder="输入验证码"
                    />
                    <a-button style="borderColor:#02bb72;color:#02bb72;">
                        获取验证码
                    </a-button>
                </div>
                <a-button type="primary">
                    确认更换
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formLayout: 'horizontal',
            form: this.$form.createForm(this),
            previewVisible: false,
            previewImage: "",
            fileList: [],
            isChangePhone: false,
            isRenew: false,
            isUpdata: false,
            form: this.$form.createForm(this),
            newPwd: '',
        };
    },
    methods: {
        // 提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        },
        // 照片上传
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
                    file.url = file.response.url;
                }
                return file;
            });

            this.fileList = fileList;
        },
        // 更换绑定手机
        mxChangePhone() {
            this.isChangePhone = true;
        },
        // 返回
        backChangePhone() {
            this.isChangePhone = false;
        },
        // 缴费
        mxRenew() {
            this.isRenew = true;
        },
        mxOkRenew() {
            this.isRenew = false;
        },
        // 修改密码
        mxUpdata() {
            this.isUpdata = true;
        },
        mxUpdataCel() {
            this.isUpdata = false;
        },
        mxUpdataOk(e) {
            e.preventDefault();
            this.form.validateFields(
                (err, values) => {
                    if (!err) {
                        this.isUpdata = false;
                        this.$message.success('密码修改成功');
                        console.log("Received values of myForm: ", values);
                    }
                },
            );
        },
        mxNewPwd(e) {
            this.newPwd = e.target.value
        },
        // 效验规则
        validatePhoneBlur(e) {
            if (e.target.value != this.newPwd) {
                const arr = [{
                    message: '两次密码输入不一致!',
                    field: 'renewpwd',
                }]
                this.form.setFields({ renewpwd: { value: e.target.value, errors: arr } })
            }
        },
    },
}
</script>

<style lang="less" scoped>
.header_info {
    border-bottom: 12px solid #f6f6f6;
    padding: 0 45px 30px;
    div {
        display: flex;
        align-items: center;
        margin: 15px 0;
        font-weight: 500;
        p {
            margin: 0;
        }
    }
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
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
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
</style>