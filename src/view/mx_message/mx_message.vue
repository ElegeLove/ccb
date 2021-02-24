<template>
    <div id="mx_Message">
        <a-skeleton
            :loading="loadingActive"
            active
            :paragraph="{rows: 20}"
        >
            <a-tabs
                :activeKey="activeKey"
                @change="keyChange"
            >
                <a-tab-pane
                    tab="发送通知"
                    key="1"
                >
                    <div v-if="!upOk">
                        <a-form
                            :form="form"
                            style="display: flex;justify-content: space-between;"
                        >
                            <div style="position: relative;">
                                <div
                                    class="mx_lBox"
                                    style="margin-top: 60px; display: flex;"
                                >
                                    <p style="margin-bottom: 0;width: 65px;">接收人：</p>
                                    <a-form-item style="width: 100%;margin-bottom: 0;">
                                        <a-checkbox-group
                                            @change="onChange"
                                            :options="mList"
                                            v-decorator="[
                                            'etStem',
                                            {
                                                rules: [
                                                    { required: true, message: '请选择至少一个权限板块'}
                                                ]
                                            }
                                        ]"
                                        >
                                        </a-checkbox-group>
                                    </a-form-item>
                                </div>
                            </div>
                            <div style="display: flex;margin-top: 54px;">
                                <a-button
                                    class="mx_smBtn"
                                    @click="check('up')"
                                    style="margin-right: 20px;"
                                >存草稿</a-button>
                                <a-button
                                    class="mx_smBtn"
                                    type="primary"
                                    @click="check('add')"
                                    style="margin-right: 30px;"
                                >立即发送</a-button>
                            </div>
                        </a-form>
                        <div style="display: flex;align-items: center;margin-top: 30px;">
                            <p style="margin-bottom: 0; width: 65px">标题：</p>
                            <a-input
                                placeholder="填写通知标题"
                                v-model="tValue"
                                style="width: 980px;margin-left: -11px;"
                            />
                        </div>
                        <div style="display: flex;margin-top: 30px;">
                            <p style="margin-bottom: 0; width: 65px">正文：</p>
                            <!-- <div
                                id="editorElem"
                                style="width: 980px;text-align:left;margin-left: -11px;zIndex:1;"
                            >
                            </div> -->
                            <div class="edit_container">
                                <quill-editor
                                    style="width: 980px;text-align:left;margin-left: -11px;"
                                    v-model="content"
                                    ref="myQuillEditor"
                                    :options="editorOption"
                                    @blur="onEditorBlur($event)"
                                    @focus="onEditorFocus($event)"
                                    @change="onEditorChange($event)"
                                >
                                </quill-editor>
                                <!-- <button v-on:click="saveHtml">保存</button> -->
                            </div>
                        </div>

                    </div>
                    <div
                        v-else
                        style="display: flex;flex-direction:column;align-items: center;"
                    >
                        <a-icon
                            type="check-circle"
                            theme="twoTone"
                            twoToneColor="#52c41a"
                            style="font-size: 60px;margin-top: 110px;"
                        />
                        <p style="font-size: 20px;color:#000;font-weight: bold;margin-top: 24px;">发送成功</p>
                        <p style="margin-top: 115px;">您已成功向学生家长发送通知</p>
                        <div style="margin-top: 195px;">
                            <a-button
                                style="margin-right: 15px;"
                                @click="look('look')"
                            >查看此通知</a-button>
                            <a-button
                                type="primary"
                                @click="look('back')"
                            >返回首页</a-button>
                        </div>
                    </div>

                </a-tab-pane>
                <a-tab-pane
                    tab="发送记录"
                    key="2"
                    forceRender
                >
                    <div v-if="!dLook">
                        <a-form
                            :form="form2"
                            style="margin-top: 40px;"
                        >
                            <div class="t">
                                <div
                                    class="tabBox"
                                    style="display: flex;"
                                >
                                    <p style="margin-top: 5px;">单号：</p>
                                    <a-form-item style="width: 200px;">
                                        <a-input
                                            v-decorator="[
                                                  'code',
                                                  {rules: [{ required: true, message: '请输入单号'}]}
                                            ]"
                                            placeholder="请输入单号"
                                        />
                                    </a-form-item>
                                    <a-button
                                        type="primary"
                                        style="margin-left: 20px;"
                                        @click="getPlist('1')"
                                    >搜索</a-button>
                                </div>
                            </div>
                            <div
                                class="b"
                                style="display: flex;align-items: center"
                            >
                                <div
                                    class="tabBox"
                                    style="display: flex;"
                                >
                                    <p style="margin-top: 5px;">状态：</p>
                                    <a-select
                                        @change="plChange2"
                                        v-decorator="['select']"
                                        :value="rstate"
                                        style="width: 120px;margin-right: 40px;"
                                    >
                                        <a-select-option
                                            v-for="(item,index) in rList"
                                            :key="index+1"
                                        >{{item}}</a-select-option>
                                    </a-select>
                                </div>
                                <div
                                    class="tabBox"
                                    style="display: flex;height: 40px;"
                                >
                                    <p style="margin-top: 5px;">日期：</p>
                                    <a-form-item>
                                        <a-range-picker v-decorator="['range-picker',{rules: [{ required: true, message: '请选择时间'}]}]" />
                                    </a-form-item>
                                </div>
                                <a-button
                                    type="primary"
                                    style="margin-left: 20px;margin-top: -9px;"
                                    @click="getPlist('2')"
                                >查询</a-button>
                                <a-button
                                    style="margin-left: 20px;margin-top: -9px;"
                                    @click="clearL"
                                >重置</a-button>
                            </div>
                        </a-form>
                        <a-table
                            v-if="upData"
                            style="margin-top: 35px;"
                            bordered
                            :columns="columns"
                            :dataSource="data"
                            :pagination="pagination"
                            @change="handleTableChange"
                        >
                            <!--<a  href="javascript:;">{{text}}</a>-->
                            <p
                                slot="txt"
                                slot-scope="txt,record"
                                style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin:0 auto;"
                            >{{txt}}</p>
                            <a-switch
                                slot="state"
                                slot-scope="state,record,index"
                                checkedChildren="开"
                                unCheckedChildren="关"
                                :defaultChecked="state"
                                @change="e => swOpen(e,index)"
                            />
                            <div
                                slot="btn"
                                slot-scope="btn,record,index"
                                style="display: flex;align-items: center;justify-content: center;"
                            >
                                <p
                                    style="cursor: pointer;margin-bottom: 0;margin-right: 10px;color:#02bb72;"
                                    @click="tLook(record)"
                                >查看</p>
                            </div>
                        </a-table>
                    </div>
                    <div v-else>
                        <div
                            class="back"
                            @click="jBack()"
                        >
                            <a-icon
                                type="arrow-left"
                                style="font-size: 25px;font-weight: bold;margin-right: 10px;"
                            />
                            <p>查看详情</p>
                        </div>
                    </div>

                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
        <a-modal
            v-model="addFood"
            title="确认发送"
        >
            <div
                class="wrap"
                v-if="title"
                style="height: 150px;display: flex;align-items: center;justify-content: center"
            >
                <p>您的通知没有填写标题，接收人为{{vTxt}}，确认继续发送？</p>
            </div>
            <div
                class="wrap"
                v-else
                style="height: 150px;display: flex;align-items: center;justify-content: center"
            >
                <p>接收人为{{vTxt}}，确认继续发送？</p>
            </div>
            <template slot="footer">
                <a-button
                    key="back"
                    @click="Back('NO')"
                >取消</a-button>
                <a-button
                    key="submit"
                    type="primary"
                    @click="Back('OK')"
                >确认</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import E from "wangeditor";
export default {
    data() {
        return {
            activeKey: '1',
            loadingActive: false,
            txtVal: '',
            // editor: null,
            // editorContent: '',
            keyNum: '1',
            form: this.$form.createForm(this),
            form2: this.$form.createForm(this),
            mList: [{
                label: '下级账户',
                value: '下级账户',
            }, {
                label: '供应商',
                value: '供应商',
            }, {
                label: '学生家长',
                value: '学生家长',
            }, {
                label: '关联上级',
                value: '关联上级',
            }],
            //保存选择状态
            value: '',
            vTxt: '',
            //弹框显示
            addFood: false,
            title: true,
            tValue: '',
            upOk: false,
            //搜索状态
            rstate: '全部',
            rList: ['全部', '审核中', '审核通过', '未通过'],
            //表格数据
            columns: [
                {
                    title: '标题',
                    dataIndex: 'title',
                    width: '115',
                    align: 'center'
                }, {
                    title: '接收人',
                    dataIndex: 'rName',
                    width: '350',
                    align: 'center',
                }, {
                    title: '发送人',
                    dataIndex: 'Name',
                    width: '95',
                    align: 'center'
                }, {
                    title: '发送时间',
                    dataIndex: 'sTime',
                    width: '155',
                    align: 'center'
                }, {
                    title: '按钮',
                    dataIndex: 'btn',
                    width: '155',
                    align: 'center',
                    scopedSlots: { customRender: 'btn' }
                }
            ],
            data: [{
                key: '1',
                title: '校长1',
                rName: '校长拥有全部权限三年一换啊啊啊啊...',
                Name: '超级管理员1',
                sTime: '2019-07-06   15:25',
            }],
            //分页配置
            pagination: {
                pageSize: 10, // 默认每页显示数量
                current: 1, //显示当前页数
                showSizeChanger: true, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                pageSizeOptions: ["10", "20"], // 指定每页可以显示多少条
                showSizeChange: (current, pageSize) =>

                    (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            //数据更新
            upData: true,
            //分页
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
            },
            //查看详情
            dLook: false,
            content: '',
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'],     //引用，代码块


                        [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],     //列表
                        [{ 'script': 'sub' }, { 'script': 'super' }],   // 上下标
                        [{ 'indent': '-1' }, { 'indent': '+1' }],     // 缩进
                        [{ 'direction': 'rtl' }],             // 文本方向


                        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题


                        [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                        [{ 'font': [] }],     //字体
                        [{ 'align': [] }],    //对齐方式


                        ['clean'],    //清除字体样式
                        ['image', 'video']    //上传图片、上传视频

                    ]
                },
                theme: 'snow'
            }
        };
    },
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    // props: ['catchData'], // 接收父组件的方法
    mounted() {
        // var editorElem = document.querySelector("#editorElem")
        // this.editor = new E(editorElem);
        // console.log(editorElem)
        // // 编辑器的事件，每次改变会获取其html内容
        // this.editor.customConfig.onchange = html => {
        //     this.editorContent = html;
        //     console.log(this.editorContent)
        //     // this.catchData(html); // 把这个html通过catchData的方法传入父组件
        // };
        // this.editor.customConfig.menus = [
        //     // 菜单配置
        //     'head', // 标题
        //     'bold', // 粗体
        //     'fontSize', // 字号
        //     'fontName', // 字体
        //     'italic', // 斜体
        //     'underline', // 下划线
        //     'strikeThrough', // 删除线
        //     'foreColor', // 文字颜色
        //     'backColor', // 背景颜色
        //     'link', // 插入链接
        //     'list', // 列表
        //     'justify', // 对齐方式
        //     'quote', // 引用
        //     'emoticon', // 表情
        //     'image', // 插入图片
        //     'table', // 表格
        //     'video',  // 插入视频
        //     'code', // 插入代码
        //     'undo', // 撤销
        //     'redo' // 重复
        // ];
        // // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
        // this.editor.create(); // 创建富文本实例
        // this.editor.txt.html('<p>用 JS 设置的内容</p>')
        // setTimeout(function () {
        this.loadingActive = false;
        // }, 100);

    },
    methods: {
        //多选
        onChange(e) {
            this.value = e;
        },
        //保存
        check(val) {
            let that = this;
            const validateFieldsKey = ['etStem'];
            this.form.validateFields(validateFieldsKey, (err, values) => {

                if (!err) {
                    this.value = values.etStem
                    if (this.title == true) {

                    }
                    this.addFood = true;
                }

            });
        },
        //返回
        Back(val) {
            this.addFood = false;
            console.log(this.txtVal);
            if (val == 'OK') {
                this.upOk = true;
                localStorage.setItem('txtVal', this.txtVal);
            }
        },
        //查看
        look(val) {
            if (val == 'look') {
                this.keyNum = '2';
                this.dLook = true;
            } else {
                this.upOk = false;

                console.log(this.editor.txt.html());
                console.log(this.editorContent)
                // this.$router.push({
                //     path: "/mxMessage"
                // });
                // this.$router.go(0)
                // this.$router.push({ path: '/mxMessage' })
            }
        },
        //搜索状态选择
        plChange2(e) {
            this.rstate = e;
        },
        //清空搜索状态
        clearL() {
            this.rState = '全部';
            this.rstate = '全部',
                this.form2.resetFields();
        },
        tLook(val) {
            this.dLook = true;
        },
        jBack() {
            this.dLook = false;
        },
        //搜索
        getPlist(val) {
            if (val == 1) {
                const validateFieldsKey = ['code', 'select']
                this.form.validateFields(validateFieldsKey, (err, values) => {
                    console.log(values)
                    if (!err) {

                    }

                },
                );
            } else {
                const validateFieldsKey = ['range-picker']
                this.form.validateFields(validateFieldsKey, (err, values) => {
                    console.log(values);
                    if (!err) {

                    }

                },
                );
            }

        },
        keyChange(e) {
            console.log(e);

            // activeKey:'1',
            // loadingActive:true,
            this.activeKey = e;
            this.loadingActive = true;
            setTimeout(() => {
                this.loadingActive = false;
            }, 300);
            // if (e == '1') {
            //     // 获取食堂
            //     this.getCanteen();
            //     // 获取出库用途
            //     this.getOutPurpose();
            // } else {
            //     this.loadingRecord = true;
            //     this.getOutRecordList('', '', '', '', '');
            // }
        },
        onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur() { }, // 失去焦点事件
        onEditorFocus() { }, // 获得焦点事件
        onEditorChange(e) { 
            console.log(e.html);
            
        }, // 内容改变事件
        // saveHtml:function(event){
        //   alert(this.content);
        // }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
    created() {
        this.txtVal = localStorage.getItem('txtVal');
        console.log(this.txtVal);
    },
    watch: {
        value(nV, oV) {
            if (nV.length == 4) {
                this.vTxt = '全部对象';
                console.log(this.vTxt);
            } else {
                this.vTxt = nV.join('、');
                console.log(this.vTxt);
            }
        },
        tValue(nV, oV) {
            if (nV != '') {
                this.title = false;
            } else {
                this.title = true;
            }
        }
    },

};
</script>

<style scoped>
.back {
    display: flex;
    align-items: center;
    width: 100px;
    cursor: pointer;
}
.back p {
    margin-bottom: 0;
}
</style>
<style>
</style>
