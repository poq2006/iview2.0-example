<style scoped>
.header {
    position: relative;
    width: 100%;
    height: 60px;
    color: #fff;
    text-align: center;
}
.header .logo{
    color: #fff;
    font-weight: bold;
    font-size: large;
    text-align: left;
    padding-left: 35px;
}
.header .user-info a{
    color: #fff;
}
</style>
<template>
    <div class="header">
        <Menu mode="horizontal" :theme="theme">
            <Row type="flex" justify="end">
                <Col span="22">
                    <div class="logo">
                        dubbo服务治理平台
                    </div>
                </Col>
                <Col span="2">
                    <div class="user-info">
                        <Dropdown trigger="click" @on-click="handleCommand">
                            <a href="javascript:void(0)">
                                {{username}}
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <Dropdown-menu slot="list">
                                <Dropdown-item name="loginOut">退出</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </Menu>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: 'linxin',
                theme: this.$util.theme
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginOut'){
                    localStorage.removeItem('ms_username');
                    this.$router.push('/loginOut');
                }
            }
        }
    }
</script>
