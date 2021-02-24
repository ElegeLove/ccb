<template>
    <div id="mx_feedBack">
        <a-form :form="form">
            <a-form-item label="反馈内容">
                <a-textarea
                    style="width:632px;height:225px;resize:none;"
                    placeholder="您的每一条意见我们都将认真阅读"
                    :rows="4"
                    v-decorator="[
                        '反馈内容',
                        {rules: [{ required: true,min:10, message: '请至少输入十个文字' }]}
                    ]"
                />
            </a-form-item>
            <a-form-item>
                <div>
                    <div>
                        上传图片<span style="color:#bbb;">（用于辅助说明问题）</span>
                    </div>
                    <div style="paddingLeft:10px;">
                        <div class="clearfix">
                            <a-upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                :fileList="damagedList"
                                @preview="damagedPreview"
                                @change="damagedChange"
                            >
                                <div v-if="damagedList.length < 2">
                                    <a-icon type="plus" />
                                </div>
                            </a-upload>
                            <a-modal
                                :visible="damagedVisible"
                                :footer="null"
                                @cancel="damagedCancel"
                            >
                                <img
                                    alt="example"
                                    style="width: 100%"
                                    :src="damagedImage"
                                />
                            </a-modal>
                        </div>
                        <a-upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            :fileList="damagedList"
                            @preview="damagedPreview"
                            @change="damagedChange"
                        >
                            <a-button>
                                <a-icon type="upload" />上传图片
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </a-form-item>
            <a-form-item label="请选择您对系统的满意程度">
                <a-radio-group
                    name="radioGroup"
                    :defaultValue="0"
                >
                    <a-radio
                        v-for="(item,index) in satisfaction"
                        :value="index"
                        style="marginRight:70px;"
                    >{{item}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    @click="mxCheck"
                >提交反馈</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            damagedVisible: false,
            damagedImage: "",
            damagedList: [],
            satisfaction: ["非常好用", "感觉一般", "不太好用", "不想用了"],
        };
    },
    methods: {
        // 提交
        mxCheck() {
            this.form.validateFields(
                (err) => {
                    if (!err) {
                        console.info('success');
                        this.$router.push({ path: '/mx_subSucceed' })
                    }
                },
            );
        },
        handleChange(e) {
            this.$nextTick(() => {
                this.form.validateFields(['nickname'], { force: true });
            });
        },
        // 照片上传
        damagedCancel() {
            this.damagedVisible = false;
        },
        damagedPreview(file) {
            this.damagedImage = file.url || file.thumbUrl;
            this.damagedVisible = true;
        },
        damagedChange(info) {
            let damagedList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            damagedList = damagedList.slice(-2);

            // 2. 从响应读取并显示文件链接
            damagedList = damagedList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.url;
                }
                return file;
            });

            this.damagedList = damagedList;
        },
    },
}
</script>

<style lang="less" scoped>
</style>