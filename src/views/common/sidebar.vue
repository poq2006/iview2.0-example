<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 240px;
        left: 0;
        top: 60px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
<template>
    <div class="sidebar">
        <Menu :theme="theme" :active-name="setActive" :open-names="setOpen" accordion @on-select="handleMenu">
            <Menu-item name="application">
                <Icon type="android-apps"></Icon>
                应用管理
            </Menu-item>
            <Menu-item name="service">
                <Icon type="android-apps"></Icon>
                服务管理
            </Menu-item>
            <Submenu name="ruleManager">
                <template slot="title">
                    <Icon type="android-menu"></Icon>
                    规则管理
                </template>
                <Menu-item name="2-1">负载管理</Menu-item>
                <Menu-item name="2-2">权重管理</Menu-item>
            </Submenu>
            <Submenu name="authManager">
                <template slot="title">
                    <Icon type="android-lock"></Icon>
                    授权管理
                </template>
                <Menu-item name="authManager-permission">权限管理</Menu-item>
                <Menu-item name="authManager-role">角色管理</Menu-item>
                <Menu-item name="authManager-authorization">用户授权</Menu-item>
            </Submenu>
            <Submenu name="systemManager">
                <template slot="title">
                    <Icon type="android-settings"></Icon>
                    系统管理
                </template>
                <Menu-item name="3-1">字典管理</Menu-item>
                <Menu-item name="3-2">邮箱管理</Menu-item>
                <Menu-item name="3-3">告警设置</Menu-item>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                theme: this.$util.theme
            }
        },
        computed: {
            setActive() {
                return this.$route.path.replace('/index/','');
            },
            setOpen() {
                return this.$route.path.replace('/index/','').split("-");
            }
        },
        methods: {
            handleMenu(nodeName){
                this.$router.push(nodeName);
            }
        }
    };
</script>