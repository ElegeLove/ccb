<template>
    <div id="mx_Juser">
        <div v-if="!addShow">
            <div style="display: flex; align-items: center;margin-top: 25px;">
                <p style="margin-bottom: 0;width: 100px;">权限范围：</p>
                <a-select @change="plChange" placeholder="单位" :value="sdVal" style="width: 125px;margin-right: 40px;">
                    <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item.title}}</a-select-option>
                </a-select>
            </div>
            <div style="display: flex; align-items: center;margin-top: 25px;">
                <p style="margin-bottom: 0;width: 100px;">用户：</p>
                <a-input style="width: 248px;margin-right: 25px;" placeholder="用户名/职位/账号" v-model="someVal"/>
                <a-button type="primary" @click="search">搜索</a-button>
            </div>
            <div style="display: flex; align-items: center;margin-top: 25px;">
                <p style="margin-bottom: 0;width: 100px;">职位：</p>
                <a-select @change="plChange2" placeholder="单位" :value="sdVal2" style="width: 125px;margin-right: 40px;">
                    <a-select-option v-for="(item,index) in sdList2" :key="index+1">{{item.description}}</a-select-option>
                </a-select>
            </div>
            <div style="margin-top: 35px;">
                <a-button type="primary" icon="user-add" style="margin-right: 30px;" @click="addUser">添加用户</a-button>
                <a-button style="margin-right: 12px;" @click="action('stop')">批量停用</a-button>
                <a-button style="margin-right: 12px;" @click="action('open')">批量启用</a-button>
                <a-button @click="action('remove')">批量删除</a-button>
            </div>
            <a-table v-if="upData" style="margin-top: 35px;" :rowSelection="rowSelection" bordered :columns="columns" :dataSource="data" :pagination="pagination"  @change="handleTableChange">
                <!--<a  href="javascript:;">{{text}}</a>-->
                <img style="width: 70px;height: 70px;"  slot="img" slot-scope="img,record" :src="img"  alt="">

                <a-switch slot="state" slot-scope="state,record,index" checkedChildren="开" unCheckedChildren="关" :defaultChecked="state" @change="e => swOpen(e,index,record.id)"/>
                <div slot="btn" slot-scope="btn,record,index" style="display: flex;align-items: center;justify-content: center;">
                    <p style="cursor: pointer;margin-bottom: 0;margin-right: 10px;color:#02bb72;" @click="modify(record)">编辑</p>
                    <p style="cursor: pointer;margin-bottom: 0;color:#02bb72;" @click="remove(index,record.id)">删除</p>
                </div>
            </a-table>
        </div>
        <div v-else>
            <div class="back" @click="jBack()">
                <a-icon type="arrow-left" style="font-size: 25px;font-weight: bold;margin-right: 10px;"/>
                <p>添加用户</p>
            </div>
            <a-form :form="form">
                <div style="position: relative;width: 650px;">
                    <div v-if="!isFroom" class="mx_lBox" style="margin-top: 60px;margin-left: 37px;">
                        <p style="color:#000;">权限范围</p>
                        <a-form-item >
                            <a-checkbox-group v-decorator="[
                                                'etStem',
                                                {
                                                    rules: [
                                                        { required: true, message: '请选择权限范围食堂'}
                                                    ]
                                                }
                        ]">
                                <a-row style="width: 400px;display: flex;flex-wrap: wrap;justify-content: end;">
                                    <a-checkbox class="long" :value="item.id" v-for="item in setJlist">{{item.title}}</a-checkbox>
                                </a-row>
                            </a-checkbox-group>
                        </a-form-item>
                    </div>
                    <p v-else style="color:#ff6600;margin-top: 60px;margin-left: 37px;">请先创建食堂后再添加用户</p>
                    <div class="Logo on">

                        <p style="width: 100%;">人脸录入</p>
                        <div class="img">
                            <img @click="handlePreview(popImg)" style="width: 100%;height: 100%;" :src="popImg" alt="">
                            <a-modal v-model="previewVisible" @cancel="handleCancel" @ok="handleOk">
                                <img style="width: 100%;height: 100%;" :src="showUrl" alt="">
                            </a-modal>
                        </div>

                        <a-form-item>
                            <a-upload
                                    v-decorator="['upload', {
                                        rules: [
                                            { required: true, message: '请填上传图片'}
                                        ],
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile,
                                    }]"
                                    class="mx_right"
                                    :showUploadList="false"
                                    :multiple="true"
                                    :headers="headers"
                                    @change="upImg"
                                    name="file"
                                    action="http://bate.ccb.micmio.com/api/common/upload"
                            >
                                <a-button>
                                    <a-icon type="upload" /> 上传图片
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </div>
                </div>
                <div class="mx_txtBox" style="margin-left: 37px;">
                    <p style="color:#000;">真实姓名（用户名）<span style="color:#ff6600;font-size: 18px;margin-right: 10px;">*</span><span style="color:#ccc;">添加后不可修改</span></p>
                    <a-form-item style="width: 300px;">
                        <a-input :disabled="isDsb" placeholder="填写统一社会信用代码" v-decorator="[
											  'syCode',
												{
												  initialValue:Muser,
												  rules: [
												  { required: true, message: '请填写真实姓名'}]
												}
											]">
                        </a-input>
                    </a-form-item>
                </div>
                <div class="mx_txtBox" style="margin-left: 37px;">
                    <p style="color:#000;">职位权限</p>
                    <a-form-item style="width: 300px;">
                        <a-select v-decorator="['slNature', {rules: [{ required: true, message: '请选择职位权限' }]}]" placeholder="请选择职位权限">
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>
                            <a-select-option value="disabled">Disabled</a-select-option>
                            <a-select-option value="Yiminghe">yiminghe</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="mx_txtBox" style="margin-left: 37px;">
                    <p style="color:#000;">手机号码（登录账号）<span style="color:#ff6600;font-size: 18px;margin-right: 10px;">*</span><span style="color:#ccc;">添加后不可修改</span></p>
                    <a-form-item style="width: 300px;">
                        <a-input :disabled="isDsb"  placeholder="填写手机号码" v-decorator="[
                                          'mobile',
                                            {
                                              initialValue:Mphone,
                                              rules: [
                                              { required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },
                                              { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur']
                                            }
                                        ]">
                        </a-input>
                    </a-form-item>
                </div>
                <div class="mx_FadsBox" style="margin-left: 37px;">
                    <p>登录密码</p>
                    <a-form-item style="width: 300px;">
                        <a-input  placeholder="填写登录密码" v-decorator="[
											  'slAds',
												{
												  rules: [
												  { required: true, message: '请填写登录密码'}]
												}
											]">
                        </a-input>
                    </a-form-item>
                </div>
                <div class="mx_FadsBox" style="display: flex;margin-left: 37px;">
                    <div style="display: flex;margin-right: 20px;">
                        <p style="margin-bottom: 0;">用户状态：</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="userState" @change="e => swOpen(e,0)"/>
                    </div>
                    <div style="display: flex;margin-right: 20px;">
                        <p style="margin-bottom: 0;">审核权限：</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="jcState" @change="e => swOpen(e,0)"/>
                    </div>
                    <div style="display: flex;">
                        <p style="margin-bottom: 0;">电子秤权限：</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="wState" @change="e => swOpen(e,0)"/>
                    </div>
                </div>
                <a-button :disabled="isFroom" class="mx_smBtn" type="primary" @click="check" style="margin-left: 37px;margin-top: 90px;">更新保存</a-button>
            </a-form>
        </div>
        <a-modal
                v-model="addFood"
                :title="stateTxt"
        >
            <div class="wrap" style="height: 150px;display: flex;align-items: center;justify-content: center">
                <p>{{addTxt}}</p>
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
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    import moment from 'moment';
    import globalApi from '../../globalApi/globalApi';
    export default {
        data() {
            return {
                previewVisible:false,
                //表单
                form: this.$form.createForm(this),
                //输入框信息
                someVal:'',
                //筛选选择
                sdVal:1,
                sdvID:0,
                sdList:[],
                sdVal2:1,
                sdvID2:0,
                sdList2:[],
                //表格数据
                columns:[{
                    title: '食堂',
                    dataIndex: 'fRoom',
                    width:'85',
                    align:'center'
                }, {
                    title: '图片',
                    dataIndex: 'img',
                    width:'120',
                    align:'center',
                    scopedSlots: { customRender: 'img' }
                }, {
                    title: '用户名',
                    dataIndex: 'userName',
                    width:'95',
                    align:'center'
                }, {
                    title: '职位权限',
                    dataIndex: 'post',
                    width:'115',
                    align:'center'
                }, {
                    title: '账号',
                    dataIndex: 'code',
                    width:'190',
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
                data:[],
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
                //添加页面
                addShow:false,
                //状态
                userState:true,
                jcState:false,
                wState:false,
                //图片上传框状态
                rEShow2:false,
                //上传图片配置
                headers: {
                    authorization: 'authorization-text',
                },
                //是否有食堂
                isFroom:false,
                //是否禁用输入
                isDsb:false,
                Muser:'',
                Mphone:'',
                //弹框
                addFood:false,
                stateTxt:'',
                addTxt:'',
                index:'',
                tState:false,
                state:false,
                dataID:0,
                //数据更新
                upData:true,
                //启用/删除
                isR:false,
                //已选择存储
                oKlist:[],
                //已选择ID
                idTxt:'',
                //编辑页权限范围保存
                setJlist:[],
                setIdList:[],
                //暂存图片地址
                popImg:'',
                showUrl:''
            };
        },
        methods:{
            //状态选择
            plChange(e){
                this.sdVal = e;
                this.sdvID = this.sdList[e-1].id;
                console.log(this.sdvID);
            },
            plChange2(e){
                this.sdVal2 = e;
                this.sdvID2 = this.sdList2[e-1].id;
                console.log(this.sdvID2);
            },
            //修改状态
            swOpen(e,i,id){
                this.isR = false;
                this.index = i;
                this.tState = !e;
                this.state = e;
                this.dataID = id;
                if(e == true){
                    this.sgISopen(id,i,e);
                }else{
                    this.addFood = true;
                    this.stateTxt = '确认停用';
                    this.addTxt = '停用后用户将无法正常登录，是否继续？'
                }
            },
            //添加用户
            addUser(){
                this.addShow = !this.addShow;
            },
            //返回列表
            jBack(){
                this.isDsb = !this.isDsb;
                this.addShow = !this.addShow;
            },
            // 手机号验证回调
            handlePhoneCheck(rule, value, callback) {
                callback()
            },
            //保存
            check  () {
                let that = this;
                const validateFieldsKey = ['etStem','mobile', 'syCode','slAds','slNature','upload']
                this.form.validateFields(validateFieldsKey,(err,values) => {

                        if(values.upload == undefined){
                            that.rEShow2 = true;
                        };
                        if (!err) {
                            console.log(values);
                            let x = that.data.length;
                            console.log(x);
                            let obj = {
                                key: x+1,
                                fRoom:'食堂一',
                                img:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1567131517&di=218dfd8f88b91ee1deaf54495bdc5dc5&src=http://pic33.nipic.com/20130914/13161858_000932329000_2.jpg',
                                userName:'张三',
                                post:'校长',
                                code:'15123225893',
                                sTime:'2019-07-06   15:25',
                                state:that.userState,
                            }
                            that.data.push(obj)
                        }

                    },
                );
            },
            normFile  (e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            },
            //图片上传
            upImg(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.popImg = info.file.response.data.url;
                    this.$message.success(`上传成功`);
                    this.rEShow2 = false;
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            //修改
            modify(val){
                let that = this;
                this.Muser = val.userName
                this.Mphone = val.code
                this.isDsb = !this.isDsb;
                this.addShow = !this.addShow;
                this.setJlist = val.fRoom.split(',');
                this.setIdList = val.idList.split(',');
                let x = [];
                this.setJlist.forEach((e,i) =>{
                    let obj = {
                        id: that.setIdList[i],
                        title: e
                    }
                    x.push(obj);
                })
                this.setJlist = x;
            },
            //移除
            remove(i,id){
                this.isR = true;
                this.addFood = !this.addFood;
                this.stateTxt = '确认删除';
                this.addTxt = '删除后用户将无法正常登录，是否继续？';
                this.index = i;
                this.dataID = id;
            },
            //弹框关闭
            aBack(val){
                this.addFood = false;
                if(val == 'OK'){
                    this.sgISopen(this.dataID,this.index,this.state);
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
                    this.sgRemove(this.dataID,this.index)
                }
            },
            //批量操作
            action(val){
                if(val == 'stop'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.smISopen(this.idTxt,'false');
                    }
                }
                if(val == 'open'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.smISopen(this.idTxt,'true');
                    }
                    return;
                }
                if(val == 'remove'){
                    if(this.oKlist.length<=0){
                        this.$message.warning('当前未选择');
                        return
                    }else{
                        this.smIRemove(this.idTxt);
                    }
                    return;
                }
            },
            //分页
            handleTableChange(pagination, filters, sorter) {
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.current = pagination.current;
            },
            //搜索
            search(){
                axios({
                    method: "get",
                    url: globalApi.BASE_URL + 'api/school/member/?canteen_id=' + this.sdvID + '&&key_word=' + this.someVal + '&&role=' + this.sdvID2 ,
                    data: {},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        this.setData(res.data.data.data);
                        this.someVal = '';
                    }
                }).catch(function (err) {

                });
            },
            //获取首次数据
            getData(val){
                let data = {
                    method:'get',
                    url:'api/school/member',
                    data: val
                };
                this.$apiAxiox(data).then((res)=>{
                    if(res.data.code == 0){
                        this.setData(res.data.data.data);
                    }else{

                    }
                })
            },
            //获取权限&&职位
            getJpos(){
                let data = {
                    method:'get',
                    url:'api/common/dictionaries',
                };
                this.$apiAxiox(data).then((res)=>{
                    console.log(res.data.data);
                    if(res.data.code == 0){
                        let obj = {
                            id:0,
                            title:'全部食堂'
                        };

                        let obj2 = {
                            id:0,
                            description:'全部职位'
                        };
                        this.sdList = res.data.data.canteen;
                        this.sdList.splice(0,0,obj);
                        this.sdList2 = res.data.data.duty;
                        this.sdList2.splice(0,0,obj2);
                    }else{

                    }
                })



            },
            //数据处理
            setData(res){
                let that = this;
                this.upData = false;
                this.data = [];
                res.forEach((e,i) =>{
                        e.created_at = moment(e.created_at *1000).format('YYYY-MM-DD HH:mm');
                        if(e.status == 0){
                            e.status = false;
                        }else{
                            e.status = true;
                        }
                        let obj = {
                            id:e.id,
                            key:i,
                            fRoom:e.canteen_titles,
                            img:e.avatar_src,
                            userName:e.realname,
                            post:e.name,
                            code:e.username,
                            sTime:e.created_at,
                            state:e.status,
                            idList:e.canteen_ids
                        }
                        that.data.push(obj);
                    });
                setTimeout(()=>{
                    this.upData = true;
                });
            },
            //单个停用启用
            sgISopen(id,i,e){
                let x = '';
                if(e){
                    x = 1;
                }else{
                    x = 0
                };
                let data = {
                    status: x
                };
                axios({
                    method: "put",
                    url: globalApi.BASE_URL + 'api/school/member/' + id,
                    data:qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        if(e == false){
                            this.$message.success('停用用户成功');
                        }else{
                            this.$message.success('启用用户成功');
                        }
                        this.data[i].state = e
                    }
                }).catch(function (err) {

                });
            },
            //批量停用启用
            smISopen(id,e){
                let x = '';
                if(e == 'true'){
                    x = 1;
                }else{
                    x = 0
                };
                let data = {
                    status: x,
                    scene:'member.update.all',
                };
                axios({
                    method: "put",
                    url: globalApi.BASE_URL + 'api/school/member/' + id,
                    data:qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        if(e == 'false'){
                            this.$message.success('停用用户成功');
                        }else{
                            this.$message.success('启用用户成功');
                        }
                        setTimeout(() =>{
                            let data = {};
                            this.getData(data);
                        })

                    }
                }).catch(function (err) {

                });
            },
            //单个删除
            sgRemove(id,i){
                axios({
                    method: "delete",
                    url: globalApi.BASE_URL + 'api/school/member/' + id,
                    data:{},
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        this.$message.success('删除用户成功');
                        this.data.splice(i,1);
                    }else{
                        this.$message.success('删除用户失败');
                    }
                }).catch(function (err) {
                    this.$message.success('删除用户失败');
                });
            },
            //批量删除
            smIRemove(id){
                let data = {
                    scene:'member.destroy.all',
                };
                axios({
                    method: "delete",
                    url: globalApi.BASE_URL + 'api/school/member/' + id,
                    data:qs.stringify(data),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if(res.data.code == 0){
                        setTimeout(() =>{
                            let data = {};
                            this.getData(data);
                        })
                    }
                }).catch(function (err) {

                });
            },
            //查看图片
            handlePreview (url) {
                this.showUrl = url
                this.previewVisible = true
            },
            handleCancel () {
                this.previewVisible = false
            },
            handleOk(){
                this.previewVisible = false
            }
        },
        computed: {
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        let x = '';
                        selectedRowKeys.forEach((e,i)=>{
                            x += this.data[e].id + ','
                        });
                        x = x.slice(0,x.length-1);
                        this.oKlist = selectedRowKeys;
                        this.idTxt = x;
                    }
                }
            }
        },
        created(){
            let data = {};
            this.getData(data);
            this.getJpos();
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
    #mx_Juser .Logo{
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 108px;
    }
    #mx_Juser .Logo.on{
        top: 0;
    }
    #mx_Juser .Logo p{
        text-indent:10px;
    }
    #mx_Juser .Logo .img{
        width: 90px;
        height: 108px;
        border:1px dashed #999;
        margin-bottom: 20px;
    }
    #mx_Juser .Logo .img.on{
        border-color:red;
    }

</style>

<style>
    #mx_Juser .ant-checkbox-wrapper + .ant-checkbox-wrapper{
        margin-right: 10px;
        width: 90px;
        margin-left: 0;
    }
    #mx_Juser .ant-checkbox-wrapper{
        width: 30px!important;
    }
    #mx_Juser .ant-checkbox-wrapper.long{
        width: 140px!important;
        margin-bottom: 10px;
        margin-right: 10px;
    }
</style>
