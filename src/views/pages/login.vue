<template>
    <div class="login-wrap">
        <div class="ms-title">dubbo服务治理平台</div>
        <div class="ms-login">
            <Form ref="ruleForm" :model="ruleForm" :rules="rules">
                <Form-item prop="username">
                    <Input type="text" v-model="ruleForm.username" placeholder="username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="ruleForm.password" placeholder="password" @keyup.enter.native="submitForm('ruleForm')">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item class="login-btn">
                    <Button type="primary" @click="submitForm('ruleForm')" long>登录</Button>
                </Form-item>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',self.ruleForm.username);
                        self.$router.push('/index/about');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:400px;
        height:auto;
        margin:-150px 0 0 -190px;
        padding:40px 40px 20px 40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
        margin: 0;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>