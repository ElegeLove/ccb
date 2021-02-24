<template>
    <div id="login" class="main">
        <div class="login">
                    <div class="lBox">
                        <div class="lPic">
                            <img class="logo" src="../../assets/login/logo.png" alt="">
                            <p class="MfBold">餐餐保智慧食堂管理云平台</p>
                            <div class="lineBox">
                                <img src="../../assets/login/picr.png" alt="">
                                <p class="Mf">守护孩子每一餐</p>
                                <img src="../../assets/login/picl.png" alt="">
                            </div>
                        </div>

                        <a-form
                                id="formLogin"
                                class="user-layout-login"
                                ref="formLogin"
                                :form="form"
                                @submit="handleSubmit"
                        >
                            <a-form-item class="Mt20">
                                <a-input
                                        class="tWidth"
                                        size="large"
                                        type="text"
                                        :initialValue="user.name"
                                        placeholder="帐户名 / admin"
                                        v-decorator="[
                            'username',
                            {
                                rules: [{ required: true, message: '请输入正确的用户名' }],
                                validateTrigger: 'change',
                                initialValue:user.name
                            }

                          ]"
                                >
                                    <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                </a-input>
                            </a-form-item>
                            <a-form-item class="Mt20">
                                <a-input
                                        class="tWidth"
                                        size="large"
                                        type="password"
                                        autocomplete="false"
                                        placeholder="密码 / admin"
                                        v-decorator="[
                            'password',
                            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                          ]"
                                >
                                    <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                </a-input>
                            </a-form-item>
                            <a-form-item class="tWidth">
                                <a-checkbox v-decorator="['rememberMe']" :defaultChecked="clickState">记住账户</a-checkbox>
                                <router-link
                                        to="/register"
                                        class="forge-password"
                                        style="float: right;"
                                >忘记密码</router-link>
                            </a-form-item>
                            <a-form-item class="tWidth">
                                <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">登录</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
    </div>
</template>

<script>
import globalApi from '../../globalApi/globalApi';
import axios from 'axios';
import qs from 'qs';
import { constants } from 'crypto';
export default {
  data () {
    return {
      loginBtn: false,
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      user:{
        name:'',
        psd:''
      },
      clickState:false
    }
  },
  created () {
      let x = localStorage.getItem('username');
      console.log(x);
      if(x != ''){
          this.user.name = x;
          this.clickState = true;
      }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password','rememberMe']

      validateFields(validateFieldsKey, { force: true }, (err,values) => {
          if (!err) {
          let data = {
              username:values.username,
              password:values.password
          }
          axios({
            method: "post",
            url:  globalApi.BASE_URL + 'api/auth/login',
            data: qs.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then((res) => {
            state.loginBtn = false
            if(res.data.code == 0){
                localStorage.setItem('openKey','1');
                localStorage.setItem('cheakKey','1');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('state', res.data.data.verify_status);
                var userInfo = {
                  username:res.data.data.username,
                  avatar:res.data.data.avatar,
                  role:res.data.data.role,
                }
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                // console.log(res.data.data)
                this.loginSuccess('登录成功！');
                if(values.rememberMe == true){
                    localStorage.setItem('username', values.username)
                }
                return;
            }else{
                this.requestFailed(res.data.msg)
                return;
            }
              
          })
          .catch(function(err) {
              state.loginBtn = true
              console.log(err)
          });     
        } else {
          setTimeout(() => {
            
          }, 600)
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      this.$router.push({ name: 'home' })
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: res
        })
      }, 1000)
    },
    requestFailed (err) {
      console.log(err)
      this.$notification['error']({
        message: '错误',
        description: err || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style scoped>
.main .forge-password{
    font-family: 'PingFang-SC-Medium';
    color:#02BB72;
}
.main{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #fff none no-repeat center center;
    background-size: cover;
    background-image: url(/img/lBg.9b5bbf21.png);
}
.login{
  display: flex;
  justify-content: center;
  width: 540px;
  height: 750px;
  background: #fff;
  margin-right: 92px;
  border-radius: 10px;
}
.login .lBox{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 395px;
  height: 540px;
  margin-top: 75px;
}
.login .lBox .lPic img.logo{
    margin-left:32%;
}
.main .tWidth{
  width: 360px;
  height: 50px;
  margin: 0;
}
.main .Mt20{
  margin-bottom: 20px;
}
.main .logo{
  width: 120px;
  height: 155px;
  margin-bottom: 14px;
}
.main .lineBox{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 90px;
}
.main .lineBox .Mf{
  font-family: 'MicrosoftYaHei';
  font-size: 16px;
  color:#02BB72;
  margin-bottom: 1px;
}
.main .lineBox img{
  width: 130px;
  height: 6px;
}
.MfBold{
  font-family: 'MicrosoftYaHei-Bold';
  font-size: 30px;
  color:#02BB72;
  margin-bottom: 10px;
}
button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    background: #02BB72;
    outline: none;
    border:none;
  }
  #rememberMe{
    outline: none;
  }
  button.ant-btn-lg{
  	  width: 100%;
  }

</style>

<style>
  #login .ant-input:hover,#login .ant-input:focus{
    border-color:#02BB72;
  }
  
  #login .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner:hover{
    border-color:#02BB72;
  }
  #login .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner{
    border-color:#02BB72;
    outline: none;
  }
  #login .ant-checkbox-checked .ant-checkbox-inner{
     border-color:#02BB72;
     background: #02BB72;
  }
  #login .ant-form-item-children{
      justify-content: space-between;
  }
</style>
