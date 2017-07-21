<style scoped>
</style>
<template>
    <div>
        <div class="crumbs">
            <Breadcrumb>
                <Breadcrumb-item href="about">
                    <Icon type="ios-home-outline"></Icon> Home
                </Breadcrumb-item>
                <Breadcrumb-item>
                     授权管理
                </Breadcrumb-item>
                <Breadcrumb-item>
                     用户授权
                </Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="content-body">
            <Row>
                <Col span="24" align="center">
                    <Cascader align="left" style="width: 300px; display: inline-block;" :data="departData" :load-data="loadUserData" filterable clearable @on-change="selectChange"></Cascader>
                    <Button type="success" style="margin-left: 10px; display: inline-block;" @click="save">重新授权</Button>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span="24" align="center">
                    <h2>角色授权</h2>
                    <hr width="550px" noshade="noshade" style="margin: 10px;" />
                    <div style="width: 570px;">
                    <Transfer align="left"
                        :data="roleData"
                        :target-keys="roleTargetKeys"
                        :list-style="listStyle"
                        filterable
                        :filter-method="filterMethod"
                        @on-change="roleHandleChange"></Transfer>
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24" align="center">
                    <h2>权限授权</h2>
                    <hr width="550px" noshade="noshade" style="margin: 10px;" />
                    <div style="width: 570px;">
                    <Transfer align="left"
                        :data="permitData"
                        :target-keys="permitTargetKeys"
                        :list-style="listStyle"
                        filterable
                        :filter-method="filterMethod"
                        @on-change="permitHandleChange"></Transfer>
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24" align="center">
                </Col>
            </Row>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                userId: '',
                departData: this.departList(),
                roleData: this.getMockData('role'),
                roleTargetKeys: [],
                permitData: this.getMockData('permit'),
                permitTargetKeys: [],
                listStyle: {
                    width: '250px',
                    height: '280px'
                }
            }
        },
        methods: {
            departList (){
                let departData = [];
                this.$util.ajax.get('/hr/depart/getDepartmentListByCondition')
                .then(function(response){
                    for (var i = 0; i < response.data.data.length; i++) {
                        departData.push({value:response.data.data[i].depart_id,label:response.data.data[i].name,children:[],loading:false});
                    }
                })
                .catch(function(err){
                    this.$Message.error({
                            content: err
                    });
                });
                return departData;
            },
            loadUserData (item, callback) {
                item.loading = true;
                this.$util.ajax.get('/hr/user/getUserListByCondition?department='+item.value)
                .then(function(response){
                    for (var i = 0; i < response.data.data.length; i++) {
                        item.children.push({value:response.data.data[i].userId,label:response.data.data[i].name});
                    }
                    item.loading = false;
                    callback();
                })
                .catch(function(err){
                    this.$Message.error({
                            content: err
                    });
                    item.loading = false;
                });
            },
            save (){
                this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确定要重新授权吗？</p>',
                    onOk: () => {
                        let self = this;
                        let paramData = {
                            userId: self.userId,
                            roleAuths: self.roleTargetKeys.toString(),
                            userAuths: self.permitTargetKeys.toString()
                        }
                        this.$util.ajax.post('/dubbo/auth/insertOrUpdateAuth.do',this.$util.qs.stringify(paramData))
                        .then(function(response) {
                            if(response.data.status == 'success'){
                                self.$Message.success('授权成功!');
                            }else{
                                self.$Message.error({
                                    content: response.data.errorCode +':'+response.data.errorMessage
                                });
                            }
                        })
                        .catch(function(err) {
                            self.$Message.error({
                                    content: err
                            });
                        });
                    }
                });
            },
            selectChange (value, data) {
                if(value.length>1){
                    this.userId = value[1];
                    this.roleData = this.getMockData('role');
                    this.permitData = this.getMockData('permit');
                    this.getTargetKeys();
                }else{
                    this.userId = '';
                    this.roleData = [];
                    this.roleTargetKeys = [];
                    this.permitData = [];
                    this.permitTargetKeys = [];
                }
            },
            getMockData (type) {
                let mockData = [];
                if(this.userId){
                    let self = this;
                    if(type === 'role'){
                        this.$util.ajax.get('/dubbo/role/findRoleList.do?pageIndex=0&pageSize=100')
                        .then(function(response){
                            if(response.data.status=='success'){
                                for (var i = 0; i < response.data.data.length; i++) {
                                    mockData.push({key:response.data.data[i].id+'',label:response.data.data[i].roleName});
                                }
                            }else{
                                self.$Message.error({
                                    content: response.data.errorCode +':'+response.data.errorMessage
                                });
                            }
                        })
                        .catch(function(err){
                            self.$Message.error({
                                content: err
                            });
                        });
                    }else{
                        this.$util.ajax.get('/dubbo/permit/findPermissionList.do?pageIndex=0&pageSize=100')
                        .then(function(response){
                            if(response.data.status=='success'){
                                for (var i = 0; i < response.data.data.length; i++) {
                                    mockData.push({key:response.data.data[i].permitKey,label:response.data.data[i].permitName});
                                }
                            }else{
                                self.$Message.error({
                                    content: response.data.errorCode +':'+response.data.errorMessage
                                });
                            }
                        })
                        .catch(function(err){
                            self.$Message.error({
                                content: err
                            });
                        });
                    }
                }
                return mockData;
            },
            getTargetKeys () {
                if(this.userId){
                    let self = this;
                    this.$util.ajax.get('/dubbo/auth/findAuthByCondition.do?userId='+this.userId)
                    .then(function(response){
                        if(response.data.status=='success'){
                            if(response.data.data){
                                self.roleTargetKeys = response.data.data.roleAuths.split(',');
                                self.permitTargetKeys = response.data.data.userAuths.split(',');
                            }
                        }else{
                            self.roleTargetKeys = [];
                            self.permitTargetKeys = [];
                            self.$Message.error({
                                content: response.data.errorCode +':'+response.data.errorMessage
                            });
                        }
                    })
                    .catch(function(err){
                        self.roleTargetKeys = [];
                        self.permitTargetKeys = [];
                        self.$Message.error({
                            content: err
                        });
                    });
                }
            },
            roleHandleChange (newTargetKeys) {
                console.info(newTargetKeys);
                this.roleTargetKeys = newTargetKeys;
            },
            permitHandleChange (newTargetKeys) {
                this.permitTargetKeys = newTargetKeys;
            },
            filterMethod (data, query) {
                return data.label.indexOf(query) > -1;
            }
        }
    }
</script>