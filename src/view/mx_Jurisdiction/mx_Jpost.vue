<template>
    <div id="mx_Jpost">
        <div v-if="uNull" style="display: flex; align-items: center;justify-content: center;height: 600px;flex-direction: column;">
            <img style="width: 170px;height: 170px;" src="http://img4.imgtn.bdimg.com/it/u=2618861512,4186491346&fm=26&gp=0.jpg" alt="">
            <p style="margin-top: 45px;">当前无任何职位权限，请联系管理员开通哦</p>
        </div>
        <div v-else>
            <div v-if="!addShow">
                <div style="display: flex; align-items: center;margin-top: 25px;">
                    <p style="margin-bottom: 0;padding-right: 20px;">用户：</p>
                    <a-input style="width: 248px;margin-right: 25px;" placeholder="用户名/职位/账号" v-model="someVal"/>
                    <a-button type="primary">搜索</a-button>
                </div>
                <div style="margin-top: 35px;">
                    <a-button type="primary" icon="user-add" style="margin-right: 30px;" @click="addUser">添加用户</a-button>
                    <a-button style="margin-right: 12px;" @click="action('stop')">批量停用</a-button>
                    <a-button style="margin-right: 12px;" @click="action('open')">批量启用</a-button>
                    <a-button @click="action('remove')">批量删除</a-button>
                </div>
                <a-table v-if="upData" style="margin-top: 35px;" :rowSelection="rowSelection" bordered :columns="columns" :dataSource="data" :pagination="pagination"  @change="handleTableChange">
                    <!--<a  href="javascript:;">{{text}}</a>-->
                    <p slot="txt" slot-scope="txt,record" style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin:0 auto;">{{txt}}</p>
                    <a-switch slot="state" slot-scope="state,record,index" checkedChildren="开" unCheckedChildren="关" :defaultChecked="state" @change="e => swOpen(e,index)"/>
                    <div slot="btn" slot-scope="btn,record,index" style="display: flex;align-items: center;justify-content: center;">
                        <p style="cursor: pointer;margin-bottom: 0;margin-right: 10px;color:#02bb72;" @click="modify(record)">编辑</p>
                        <p style="cursor: pointer;margin-bottom: 0;color:#02bb72;" @click="remove(index)">删除</p>
                    </div>
                </a-table>
            </div>
            <div v-else>
                <div class="back" @click="jBack()">
                    <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                    <p>添加用户</p>
                </div>
                <a-form :form="form">
                    <div class="mx_txtBox" style="margin-left: 37px;margin-top: 40px;">
                        <p style="color:#000;">职位名称</p>
                        <a-form-item style="width: 300px;">
                            <a-input  placeholder="填写职位名称" v-decorator="[
											  'syCode',
												{
												  rules: [
												  { required: true, message: '请填写职位名称'}]
												}
											]">
                            </a-input>
                        </a-form-item>
                    </div>
                    <div class="mx_txtBox" style="margin-left: 37px;margin-top: 40px;">
                        <p style="color:#000;">职位描述</p>
                        <a-textarea placeholder="填写职位描述"  style="width: 370px;height: 90px;resize: none"/>
                    </div>
                    <div style="position: relative;">
                        <div class="mx_lBox" style="margin-top: 60px;margin-left: 37px;">
                            <p style="color:#000;">模块选择</p>
                            <a-form-item style="width: 100%;">
                                <a-checkbox-group @change="onChange" :options="mList" v-decorator="[
                                                'etStem',
                                                {
                                                    rules: [
                                                        { required: true, message: '请选择至少一个权限板块'}
                                                    ]
                                                }
                        ]">
                                </a-checkbox-group>
                            </a-form-item>
                        </div>
                    </div>
                    <div class="box" v-if="jlist" style="margin-left: 37px;border:1px solid #d9d9d9; border-radius:5px;padding: 10px 0;">
                        <div style="margin-left: 20px;" v-for="(item,index) in cList">
                            <div>
                                <div style="display: flex;align-items: center">
                                    <a-checkbox @change="cChange(item)" :defaultChecked="item.check"></a-checkbox>
                                    <p style="margin-bottom: 0;margin-left: 10px;">{{item.title}}</p>
                                </div>
                                <div style="margin-left: 30px;margin-top: 10px;" v-if="item.children.length>0" v-for="(item2,index2) in item.children">
                                    <div style="display: flex;align-items: center;">
                                        <a-checkbox @change="cChange(item2)" :defaultChecked="item2.check"></a-checkbox>
                                        <p style="margin-bottom: 0;margin-left: 10px;">{{item2.title}}</p>
                                    </div>
                                    <div style="margin-left: 30px;margin-top: 10px;" v-if="item2.children.length>0" v-for="(item3,index3) in item2.children">
                                        <div style="display: flex;align-items: center;">
                                            <a-checkbox @change="cChange(item3)" :defaultChecked="item3.check"></a-checkbox>
                                            <p style="margin-bottom: 0;margin-left: 10px;">{{item3.title}}</p>
                                        </div>
                                        <div style="margin-left: 30px;margin-top: 10px;" v-if="item3.children.length>0" v-for="(item4,index4) in item3.children">
                                            <div style="display: flex;align-items: center;">
                                                <a-checkbox @change="cChange(item4)" :defaultChecked="item4.check"></a-checkbox>
                                                <p style="margin-bottom: 0;margin-left: 10px;">{{item4.title}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a-button v-if="!isUp" class="mx_smBtn" type="primary" @click="check('up')" style="margin-left: 37px;margin-top: 90px;">更新保存</a-button>
                    <a-button v-else class="mx_smBtn" type="primary" @click="check('add')" style="margin-left: 37px;margin-top: 90px;">立即添加</a-button>
                </a-form>
            </div>
        </div>
        <a-modal
                v-model="addFood"
                :title="title"
        >
            <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                <p>{{tKtxt}}</p>
            </div>
            <template v-if="!isR" slot="footer">
                <a-button key="back" @click="aBack('NO')">取消</a-button>
                <a-button key="submit" type="primary" @click="aBack('OK')">确认</a-button>
            </template>
            <template v-else slot="footer">
                <a-button key="back" @click="aRve('NO')">取消</a-button>
                <a-button key="submit" type="primary" @click="aRve('OK')">确认</a-button>
            </template>
        </a-modal>
        <a-modal
                v-model="addFood2"
                title="确认保存"
        >
            <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                <p>更新保存后配置该职位的用户也将跟随发生改变</p>
            </div>
            <template slot="footer">
                <a-button key="back" @click="Back('NO')">取消</a-button>
                <a-button key="submit" type="primary" @click="Back('OK')">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //无职位
                uNull:false,
                //输入框信息
                someVal:'',
                //表格数据
                columns:[{
                    title: '名称',
                    dataIndex: 'name',
                    width:'115',
                    align:'center'
                }, {
                    title: '描述',
                    dataIndex: 'txt',
                    width:'350',
                    align:'center',
                    scopedSlots: { customRender: 'txt' }
                }, {
                    title: '创建人',
                    dataIndex: 'userName',
                    width:'95',
                    align:'center'
                }, {
                    title: '创建时间',
                    dataIndex: 'sTime',
                    width:'155',
                    align:'center'
                }, {
                    title: '状态',
                    dataIndex: 'state',
                    width:'115',
                    align:'center',
                    scopedSlots: { customRender: 'state' }
                }, {
                    title: '按钮',
                    dataIndex: 'btn',
                    width:'155',
                    align:'center',
                    scopedSlots: { customRender: 'btn' }
                }],
                data:[{
                    key: '1',
                    name:'郎岩',
                    txt:'校长拥有全部权限，三年一换',
                    userName:'超级管理员',
                    sTime:'2019-07-06   15:25',
                    state:true,
                },{
                    key: '2',
                    name:'杭健雯',
                    txt:'校长拥有全部权限，三年一换',
                    userName:'超级管理员',
                    sTime:'2019-07-06   15:25',
                    state:false,
                },{
                    key: '3',
                    name:'孟琬',
                    txt:'校长拥有全部权限，三年一换',
                    userName:'超级管理员',
                    sTime:'2019-07-06   15:25',
                    state:false,
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
                upData:true,
                //添加面板显示
                addShow:false,
                //表单
                form: this.$form.createForm(this),
                //模块权限
                mList:[{
                    label:'巡查面板',
                    value:1,
                    disabled: false
                },{
                    label:'学校信息管理',
                    value:2,
                    disabled: false
                },{
                    label:'学生管理',
                    value:3,
                    disabled: false
                },{
                    label:'食堂管理',
                    value:4,
                    disabled: false
                },{
                    label:'营养食谱',
                    value:5,
                    disabled: false
                },{
                    label:'安全卫生',
                    value:6,
                    disabled: false
                },{
                    label:'采购管理',
                    value:7,
                    disabled: false
                },{
                    label:'食材选购',
                    value:8,
                    disabled: false
                },{
                    label:'食材库管理',
                    value:9,
                    disabled: false
                },{
                    label:'过期预警',
                    value:10,
                    disabled: false
                },{
                    label:'直播监控',
                    value:11,
                    disabled: false
                },{
                    label:'权限管理',
                    value:12,
                    disabled: false
                },{
                    label:'通知公告',
                    value:13,
                    disabled: false
                },,{
                    label:'数据统计',
                    value:14,
                    disabled: false
                }],
                //多选值
                value:[],
                jlist:false,
                //权限列表
                cList:[{
                    title:'首页',
                    check:true,
                    children:[{
                        title:'快捷操作',
                        check:false,
                        children:[{
                            title:'后台首页',
                            check:false,
                            children:[{
                                title:'文件上传',
                                check:false,
                            },{
                                title:'检测版本更新',
                                check:false,
                            }]
                        },{
                            title:'个人设置',
                            check:false,
                            children:null
                        },{
                            title:'清空缓存',
                            check:false,
                            children:null
                        },{
                            title:'消息中心',
                            check:false,
                            children:[{
                                title:'删除',
                                check:false,
                            },{
                                title:'启用',
                                check:false,
                            }]
                        }]
                    }]
                }],
                //是否更新
                isUp:false,
                //弹出框显示
                addFood:false,
                addFood2:false,
                title:'',
                tKtxt:'',
                //启用/删除
                isR:false,
                tState:false,
                oKlist:[]
            };
        },
        methods:{
            //添加用户
            addUser(){
                this.isUp = true;
                this.addShow = !this.addShow;
            },
            //批量操作
            action(val){
                if(val == 'stop'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        setTimeout(()=>{
                            this.data.forEach((e,i) =>{
                                if(i == this.oKlist[i] - 1){
                                    if(e.state == true){
                                        e.state = false;
                                    }
                                }
                            });
                            this.upData = true;
                            this.$message.success('批量停用用户成功');
                        })
                    }
                }
                if(val == 'open'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        setTimeout(()=>{
                            this.data.forEach((e,i) =>{
                                if(i == this.oKlist[i] - 1){
                                    if(e.state == false){
                                        e.state = true;
                                    }
                                }
                            });
                            this.upData = true;
                            this.$message.success('批量启用用户成功');
                        });
                    }
                    return;
                }
                if(val == 'remove'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        for(let i = this.oKlist.length ;i>0;i--){
                            this.data.splice(this.oKlist[i]-1,1)
                        }
                        setTimeout(()=>{
                            this.upData = true;
                        });
                        this.$message.success('批量删除用户成功');
                    }
                    return;
                }
            },
            //分页
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
            },
            //修改状态
            swOpen(e,i){
                this.isR = false;
                this.index = i;
                this.tState = !e;
                if(e == true){
                    this.$message.success('启用用户成功');
                    this.data[i].state = e
                }else{
                    this.addFood = true;
                    this.title = '确认停用';
                    this.tKtxt = '停用后用户将无法正常登录，是否继续？'
                }
            },
            //返回
            jBack(){
                this.addShow = !this.addShow;
            },
            //多选
            onChange (e) {
                this.value = e;
            },
            //保存
            check  (val) {
                let that = this;
                const validateFieldsKey = ['etStem', 'syCode'];
                this.form.validateFields(validateFieldsKey,(err,values) => {
                    if (!err) {
                        if(val == 'add'){
                            let x = that.data.length;
                            console.log(x);
                            let obj = {
                                key: x+1,
                                name:'校长',
                                txt:'校长拥有全部权限三年一换啊啊啊啊...',
                                userName:'超级管理员',
                                sTime:'2019-07-06   15:25',
                                state:false,
                            }
                            that.data.push(obj)
                            this.$message.success('添加职位成功');
                        }else{
                            this.addFood2 = true;
                        }
                    }

                });
            },
            //改变key
            cChange(val){
                val.check = !val.check;
            },
            modify(){
                this.isUp = false;
                this.addShow = !this.addShow;
            },
            //删除、停用、启用
            //弹框关闭
            aBack(val){
                this.addFood = false;
                if(val == 'OK'){
                    this.data[this.index].state = this.tState
                    this.data.splice(this.index,1);
                }else{
                    this.upData = false;
                    setTimeout(()=>{
                        this.$set(this.data[this.index], 'state', this.tState);
                        this.upData = true;
                    })
                }
            },
            aRve(val){
                this.addFood = false;
                if(val == 'OK'){
                    this.data.splice(this.index,1);
                }
            },
            Back(val){
                this.addFood2 = false;
                if(val == 'OK'){
                    this.$message.success('编辑职位成功');
                }
            },
            //移除
            remove(i){
                this.isR = true;
                this.addFood = !this.addFood;
                this.title = '确认删除';
                this.tKtxt = '删除后用户将无法正常登录，是否继续？';
                this.index = i;
            },
            //批量操作
            action(val){
                if(val == 'stop'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        setTimeout(()=>{
                            this.oKlist.forEach((e,i)=>{
                                this.data.forEach((e1,i1) =>{
                                    if(i1 == e - 1){
                                        if(e1.state == true){
                                            e1.state = false;
                                        }
                                    }
                                });
                            })
                            console.log(this.data);
                            this.upData = true;
                            this.$message.success('批量停用用户成功');
                        })
                    }
                }
                if(val == 'open'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        setTimeout(()=>{
                            this.oKlist.forEach((e,i)=>{
                                this.data.forEach((e1,i1) =>{
                                    if(i1 == e - 1){
                                        if(e1.state == false){
                                            e1.state = true;
                                        }
                                    }
                                });
                            })
                            this.upData = true;
                            this.$message.success('批量启用用户成功');
                        });
                    }
                    return;
                }
                if(val == 'remove'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.upData = false;
                        for(let i = this.oKlist.length ;i>0;i--){
                            this.data.splice(this.oKlist[i-1]-1,1)
                            console.log(this.data);
                        }
                        setTimeout(()=>{
                            this.upData = true;
                        });
                        this.$message.success('批量删除用户成功');
                    }
                    return;
                }
            }
        },
        computed: {
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.oKlist = selectedRowKeys;
                        console.log(this.oKlist);
                    }
                }
            }
        },
        watch:{
            value(nV,oV){
                if(nV.length>0){
                    this.jlist = true;
                }else{
                    this.jlist = false;
                }
            }
        }
    };
</script>

<style scoped>
    .back{
        display: flex;
        align-items: center;
        width: 100px;
        cursor: pointer;
    }
    .back p{
        margin-bottom: 0;
    }
</style>
<style>
    #mx_Jpost .ant-form-item label{
        width: 120px;
        margin-bottom: 40px;
        margin-right: 5%;
    }
</style>
