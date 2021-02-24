<template>
    <div id="wList">
        <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 10px;">
            <div style="display: flex;align-items: center;">
                <p style="margin-bottom: 0;">食堂：</p>
                <a-radio-group @change="onChange" v-model="value">
                    <a-radio v-for="item in fRoomList" :value="item.val">{{item.txt}}</a-radio>
                </a-radio-group>
            </div>
            <a-button @click="open">
                <a-icon v-if="isOpen" type="bell" theme="twoTone" twoToneColor="#52c41a"/>
                <a-icon v-else type="bell" style="color:#ccc;"/>
                {{btnTtx}}
            </a-button>
        </div>
        <a-form :form="form">
            <div class="wC">
                <!--食材预警-->
                <div class="food" style="margin-top: 30px;">
                    <div class="switch">
                        <p>食材预警</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :disabled="sthList.fPower" :defaultChecked="sthList.fSth" @change="e => swOpen(e,0)"/>
                    </div>
                    <div v-if="sthList.fSth">
                        <p style="margin-bottom: 30px;">验收入库时可针对具体食材设置提前预警时间，若设置则以设置时间为准，未设置则以此处时间为准</p>
                        <div style="display: flex;">
                            <div style="display: flex;margin-right: 50px;">
                                <p style="margin-bottom: 0;margin-top: 5px;">肉禽蛋类：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i1',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s1',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div style="display: flex;">
                                <p style="margin-bottom: 0;margin-top: 5px;">水果饮品：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i2',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s2',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                        </div>
                        <div style="display: flex;">
                            <div style="display: flex;margin-right: 50px;">
                                <p style="margin-bottom: 0;margin-top: 5px;">海鲜鱼类：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i3',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s3',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div style="display: flex;">
                                <p style="margin-bottom: 0;margin-top: 5px;">油粮干杂：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i4',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s4',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                        </div>
                        <div style="display: flex;">
                            <div style="display: flex;margin-right: 50px;">
                                <p style="margin-bottom: 0;margin-top: 5px;">蔬菜素食：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i5',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s5',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div style="display: flex;">
                                <p style="margin-bottom: 0;margin-top: 5px;margin-right: 28px;">其他：</p>
                                <a-form-item>
                                    <a-input
                                            style="width: 156px;margin-right: 10px;"
                                            type="number"
                                            v-decorator="[
                                          'i6',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                            placeholder="提前预警时间"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-select @change="plChange" placeholder="单位" v-decorator="['s6',{rules: [{ required: true, message: '请选择单位' }]}]" style="width: 75px;margin-right: 40px;">
                                        <a-select-option v-for="(item,index) in sdList" :key="index+1">{{item}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                        </div>
                    </div>
                </div>
                <!--健康证预警-->
                <div class="healthy">
                    <div class="switch">
                        <p>健康证预警</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :disabled="sthList.hPower" :defaultChecked="sthList.hSth" @change="e => swOpen(e,1)"/>
                        <div v-if="sthList.hSth">
                            <a-form-item style="width: 150px;margin-left: 105px;margin-bottom: 0;">
                                <a-input
                                        addonAfter="天"
                                        type="number"
                                        v-decorator="[
                                          'hi',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                        placeholder="提前预警时间"
                                />
                            </a-form-item>
                        </div>
                    </div>
                </div>
                <!--学校证件预警-->
                <!--供应商证件预警-->
                <div class="school">
                    <div class="switch">
                        <p>学校证件预警</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :disabled="sthList.sPower" :defaultChecked="sthList.sSth" @change="e => swOpen(e,2)"/>
                        <div v-if="sthList.sSth">
                            <a-form-item style="width: 150px;margin-left: 105px;margin-bottom: 0;">
                                <a-input
                                        addonAfter="天"
                                        type="number"
                                        v-decorator="[
                                          'si',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                        placeholder="提前预警时间"
                                />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="switch" style="border-top: none;border-bottom: 1px solid #d9d9d9;">
                        <p>供应商证件预警</p>
                        <a-switch checkedChildren="开" unCheckedChildren="关" :disabled="sthList.pPower" :defaultChecked="sthList.pSth" @change="e => swOpen(e,3)"/>
                        <div v-if="sthList.pSth">
                            <a-form-item style="width: 150px;margin-left: 105px;margin-bottom: 0;">
                                <a-input
                                        addonAfter="天"
                                        type="number"
                                        v-decorator="[
                                          'pi',
                                          {rules: [{ required: true, message: '请输入正确的预警时间' }]}
                                        ]"
                                        placeholder="提前预警时间"
                                />
                            </a-form-item>
                        </div>
                    </div>

                </div>
            </div>
            <a-button type="primary" style="margin-top: 50px;" @click="upData">更新保存</a-button>
        </a-form>
        <a-modal
                v-model="visible"
                :title="Title"
        >
            <div style="height: 150px; display: flex;align-items: center;justify-content: center;">
                <p>{{opTxt}}</p>
            </div>
            <template slot="footer">
                <a-button  @click="opMsg('NO')">取消</a-button>
                <a-button  type="primary" @click="opMsg('OK')">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        data(){
            return {
                form:this.$form.createForm(this),
                //选择默认值
                value:1,
                fRoomList:[{
                    val:1,
                    txt:'食堂1'
                },{
                    val:2,
                    txt:'食堂2'
                }],
                //预警是否开启
                isOpen:true,
                //预警开启关闭提升弹窗
                visible:false,
                Title:'',
                opTxt:'',
                btnTtx:'接收预警通知',
                //预警是否打开
                sthList:{
                    //食材
                    fSth:true,
                    fPower:false,
                    //健康
                    hSth:false,
                    hPower:false,
                    //学校
                    sSth:false,
                    sPower:false,
                    //供应商
                    pSth:false,
                    pPower:false,
                },
                //预警选择
                sdList:['全部','食堂一','食堂二','食堂三'],
            }
        },
        methods:{
            onChange(e){
                this.value = e.target.value
            },
            //打开/关闭预警
            open(){
                this.visible = !this.visible;
                if(this.isOpen){
                    this.Title = '确认关闭';
                    this.opTxt = '关闭后无法接收过期预警的消息通知'
                }else{
                    this.Title = '确认开启';
                    this.opTxt = '开启后即可接收过期预警的消息通知'
                }
            },
            //弹框确认 取消
            opMsg(val){
                if(val == 'OK'){
                    if(this.isOpen){
                        this.btnTtx = '关闭预警通知'
                    }else{
                        this.btnTtx = '接收预警通知'
                    }
                    this.isOpen = !this.isOpen;
                }
                this.visible = !this.visible;
            },
            //开关变化
            swOpen(e,val){
                switch (val) {
                    case 0:
                        this.sthList.fSth = e;
                        break;
                    case 1:
                        this.sthList.hSth = e;
                        break;
                    case 2:
                        this.sthList.sSth = e;
                        break;
                    case 3:
                        this.sthList.pSth = e;
                        break;
                }
            },
            //状态选择
            plChange(e){
                this.rState = e;
            },
            //提交
            upData(){
                const validateFieldsKey = ['s1','s2','s3','s4','s5','s6','i1','i2','i3','i4','i5','i6','hi','si','pi']
                this.form.validateFields(validateFieldsKey,(err,values) => {
                        console.log(values);
                        if (!err) {

                        }
                    },
                );
            }
        },
        created(){


        }
    }
</script>

<style scoped>
    .switch{
        display: flex;
        align-items: center;
        height: 110px;
        border-top: 1px solid #d9d9d9;
    }
    .switch p {
        margin-bottom: 0;
        font-weight: bold;
        color:#000;
        width: 200px;
    }
</style>
<style>

</style>