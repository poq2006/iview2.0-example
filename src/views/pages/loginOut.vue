<template>
    <div class="login-wrap">
        <div class="ms-title">单点系统登出</div>
        <div class="ms-login">
    您已经登出当前系统.<br/>
    需要登出所有系统, <a href="https://sso.biyao.com:8443/cas/logout">请点击</a>.
        </div>
    </div>
</template>

<script>
    export default {
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
        padding:20px;
        border-radius: 5px;
        background: #fff;
        color: red;
        font-size: 20px;
    }
</style>