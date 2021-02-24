<template>
	<div class="main user-layout-register">
		<div class="frame" id="frame">
			<a-form ref="formRegister" :form="form" id="formRegister">
				<div class="imgbOX">
					<P>短信验证修改密码</P>
				</div>
				<!-- 手机号验证 -->
				<div class="phone" v-show="!PwShow">
					<a-form-item>
						<a-input size="large" placeholder="11 位手机号" v-decorator="[
											  'mobile',
												{
												  rules: [
												  { required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },
												  { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur']
												}
											]">
							<a-select slot="addonBefore" size="large" defaultValue="+86">
								<a-select-option value="+86">+86</a-select-option>
								<a-select-option value="+87">+87</a-select-option>
							</a-select>
						</a-input>
					</a-form-item>

					<a-row :gutter="16">
						<a-col class="gutter-row" :span="16">
							<a-form-item>
								<a-input ref='vFcode' size="large" type="text" placeholder="验证码" v-decorator="[
													  'captcha',
														{
														  rules: [
														  { required: true, message: '请输入验证码'},
														  { validator: this.handleVfCheck } ], validateTrigger: ['change', 'blur']
														}
													]">
									<a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
								</a-input>
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="8">
							<a-button class="getCaptcha" size="large" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha" v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
						</a-col>
					</a-row>

					<a-form-item class="next">
						<a-button size="large" type="primary" htmlType="submit" class="register-button" :loading="registerBtn"
						 @click.stop.prevent="handleSubmit" :disabled="registerBtn">下一步
						</a-button>
					</a-form-item>
				</div>


				<!-- 设置密码 -->
				<div class="PwBox" v-show="PwShow">
					<a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
						<template slot="content">
							<div :style="{ width: '240px' }">
								<div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
								<a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
								<div style="margin-top: 10px;">
									<span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
								</div>
							</div>
						</template>

						<a-form-item>
							<a-input 
								size="large" 
								type="password" 
								autocomplete="false" 
								placeholder="至少6位密码，区分大小写"
								@click="handlePasswordInputClick"
								@blur.prevent="blurFn"
								v-decorator="[
									'password',
									{
										rules: [{ required: true, message: '至少6位密码，区分大小写'},
										{ validator: this.handlePasswordLevel}], validateTrigger: ['change', 'blur']
									}]">
							</a-input>
						</a-form-item>
					</a-popover>

					<a-form-item >
						<a-input 
							size="large" 
							type="password" 
							autocomplete="false" 
							placeholder="确认密码"
							v-decorator="[
								'password2',
								{
									rules: [{ required: true, message: '至少6位密码，区分大小写'},
									{ validator: this.handlePasswordCheck}], validateTrigger: ['change', 'blur']
								}]">
							</a-input>
					</a-form-item>
					
					<a-form-item class="next">
						<a-button size="large" type="primary" htmlType="submit" class="register-button" :loading="registerBtn"
						 @click.stop.prevent="handleSubmit2" :disabled="registerBtn">确定
						</a-button>
					</a-form-item>
				
				</div>

				<router-link class="login" :to="{ name: 'login' }">点击返回登录>></router-link>

			</a-form>
		</div>

	</div>
</template>

<script>
	import globalApi from '../../globalApi/globalApi';
	import axios from 'axios';
	import qs from 'qs';
import { constants } from 'crypto';

	const levelNames = {
		0: '低',
		1: '低',
		2: '中',
		3: '强'
	}
	const levelClass = {
		0: 'error',
		1: 'error',
		2: 'warning',
		3: 'success'
	}
	const levelColor = {
		0: '#ff0000',
		1: '#ff0000',
		2: '#ff7e05',
		3: '#52c41a'
	}
	export default {
		name: 'Register',
		components: {},
		data() {
			return {
				form: this.$form.createForm(this),
				state: {
					time: 60,
					smsSendBtn: false,
					passwordLevel: 0,
					passwordLevelChecked: false,
					percent: 10,
					progressColor: '#FF0000'
				},
				iphone:0,
				reCode:'',
				registerBtn: false,
				vFCode: '',//验证码
				cFPwd:'',//密码
				Strength:false,//密码强度
				pwdFit:false,//密码是否一致
				PwShow: false,//显示密码输入
			}
		},
		computed: {
			passwordLevelClass() {
				return levelClass[this.state.passwordLevel]
			},
			passwordLevelName() {
				return levelNames[this.state.passwordLevel]
			},
			passwordLevelColor() {
				return levelColor[this.state.passwordLevel]
			}
		},
		created() {
			this.PwShow = false;
		},
		methods: {
			// 密码强度
			handlePasswordLevel(rule, value, callback) {
				let level = 0
				// 判断这个字符串中有没有数字
				if (/[0-9]/.test(value)) {
					level++
				}
				// 判断字符串中有没有字母
				if (/[a-zA-Z]/.test(value)) {
					level++
				}
				// 判断字符串中有没有特殊符号
				if (/[^0-9a-zA-Z_]/.test(value)) {
					level++
				}
				this.state.passwordLevel = level
				this.state.percent = level * 30
				
				if(value.length<6){
					callback(new Error('密码长度不够'))
					this.Strength = false;
				}
				if (level >= 2) {
					if (level >= 3) {
						this.state.percent = 100
					}
					this.cFPwd = value;
					this.Strength = true;
					callback()
				} else {
					if (level === 0) {
						this.state.percent = 10
					}
					this.Strength = false;
					callback(new Error('密码强度不够'))
				}
				
			},
			// 两次输入密码验证
			handlePasswordCheck(rule, value, callback) {
				const password = this.form.getFieldValue('password2')
				if (password === undefined) {
					callback(new Error('请输入密码'))
					this.pwdFit = false;
				}
				if (password != this.cFPwd) {
					callback(new Error('两次密码不一致'))
					this.pwdFit = false;
				}
				if (password == this.cFPwd) {
					this.pwdFit = true;
				}
				callback()
			},
			// 验证码是否一致
			handleVfCheck(rule, value, callback) {
				const vfcode = this.form.getFieldValue('captcha')
				if (value === undefined) {
					callback(new Error('请输入验证码'))
				}
				if (vfcode != this.vFCode) {
					callback(new Error('验证码输入有误'))
				}
				callback()
			},
			// 手机号验证回调
			handlePhoneCheck(rule, value, callback) {
				callback()
			},

			handlePasswordInputClick() {
				this.state.passwordLevelChecked = true
			},
			
			blurFn(){
				this.state.passwordLevelChecked = false
			},

			handleSubmit() {
				this.form.validateFields(['captcha','mobile'], {
					force: true
				}, (err, values) => {
					if (this.vFCode == values.captcha) {

						let data = {
								username:this.iphone,
								code:values.captcha
							}
							axios({
								method: "post",
								url:  globalApi.BASE_URL + 'api/auth/retrieval',
								data: qs.stringify(data),
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							})
							.then((res) => {
								console.log(res.data)
								if(res.data.code == '-1003'){
									this.requestFailed(res.data.msg);
									return;
								}
								if(res.data.code == 0){
									this.reCode = res.data.data;
									localStorage.setItem('retoken', res.data.data)
									return;
								}
								
							})
							.catch(function(err) {
								this.state.smsSendBtn = false
								console.log(err)
							});

						this.PwShow = true;
					}
				})
			},
			
			handleSubmit2(){
			    this.getCaptcha();
				this.state.smsSendBtn = true
				if(this.Strength){
					if(this.pwdFit){
						let data ={
							url:'api/auth/repass',
							data:{
								repassword:this.cFPwd,
								retoken:localStorage.getItem('retoken')
							}
						}
						this.$apiAxiox(data).then((res)=>{
							if(res.data.code == 0){
								console.log(111)
								this.$router.push({ name: 'registerResult' })
							}else {
								this.$notification['error']({
									message: '错误',
									description: res.data.msg,
									duration: 4
								})
							}
						})
					}
				}
			},

			getCaptcha(e) {
				e.preventDefault()
				const that = this
				this.form.validateFields(['mobile'], {
						force: true
					},
					(err, values) => {
                        if (!err) {
							this.state.smsSendBtn = true
							const hide = this.$message.loading('验证码发送中..', 0)
							this.iphone = values.mobile;
							let data = {
								username:values.mobile
							}

							axios({
								method: "post",
								url:  globalApi.BASE_URL + 'api/auth/code',
								data: qs.stringify(data),
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							})
							.then((res) => {
								this.state.smsSendBtn = false
								setTimeout(hide, 10);
								if(res.data.code == '-1003'){
									this.requestFailed(res.data.msg)
									return;
								}
								if(res.data.code == 0){
									this.vFCode = res.data.data
									this.loginSuccess(res.data.data)
									return;
								}
								
							})
							.catch(function(err) {
								this.state.smsSendBtn = false
								console.log(err)
							});
						}
					}
				)
			},
			requestFailed(err) {
				this.$notification['error']({
					message: '错误',
					description: err|| '请求出现错误，请稍后再试',
					duration: 4
				})
				this.registerBtn = false
			},
			loginSuccess (res) {
				setTimeout(() => {
					this.$notification.success({
					message: '验证码发送成功！',
					description: res
					})
				}, 1000)
			},
			
		},
		watch: {
			'state.passwordLevel'(val) {
				
			}
		},
	}
</script>
<style >
	#frame .ant-input:hover,
	#frame .ant-input:focus {
		border-color: #02BB72;
	}

	#frame .ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner,
	.ant-checkbox-input:focus+.ant-checkbox-inner:hover {
		border-color: #02BB72;
	}

	#frame .ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner,
	.ant-checkbox-input:focus+.ant-checkbox-inner {
		border-color: #02BB72;
		outline: none;
	}

	#frame .ant-checkbox-checked .ant-checkbox-inner {
		border-color: #02BB72;
		background: #02BB72;
	}

	.user-register {
		&.error {
			color: #ff0000;
		}

		&.warning {
			color: #ff7e05;
		}

		&.success {
			color: #52c41a;
		}
	}

	.user-layout-register {
		.ant-input-group-addon:first-child {
			background-color: #fff;
		}
	}
</style>
<style scoped>
	.user-layout-register {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: url('../../assets/login/lBg.png');
		background-size: 100% 100%;
	}

	.frame {
		display: flex;
		justify-content: center;
		width: 540px;
		height: 470px;
		background: #fff;
		border-radius: 10px;
		margin-right: 92px;
	}

	#formRegister {
		width: 72%;
	}

	#formRegister .imgbOX {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#formRegister .imgbOX p {
		margin: 85px 0 60px 0;
		font-size: 30px;
		color: #333333;
		font-weight: bold;
		font-family: 'MicrosoftYaHei-Bold';
	}

	.user-layout-register .getCaptcha {
		display: block;
		width: 100%;
		height: 40px;
		background: #02BB72;
		color: #fff;
	}

	.user-layout-register .register-button {
		width: 100%;
		background: #02BB72;
		color: #fff;
	}

	.user-layout-register .login {
		display: block;
		line-height: 40px;
		text-align: center;
		color: #02BB72;
	}

	.ant-form-item.next {
		margin-bottom: 0px;
	}
</style>
