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
                     服务管理
                </Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="content-body">
            <Row>
                <Col span="5" style="padding-right: 10px">
                    <Input v-model="search.serviceName" placeholder="请输入服务名称"></Input>
                </Col>
                <Col span="5" style="padding-right: 10px;">
                    <Select v-model="formValidate.appId" clearable filterable placeholder="请选择应用">
                        <Option v-for="item in appList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="5" style="padding-right: 10px">
                    <Select v-model="search.status" clearable placeholder="请选择状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="5" style="padding-right: 10px">
                    <Button type="info" icon="ios-search" @click="mockTableData">搜索</Button>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span="24">
                    <Table :columns="serviceColumns" :data="serviceData" @on-selection-change="selectionChange"></Table>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span="8">
                    <Button type="primary" icon="ios-plus-empty" @click="modal = {serviceModal: true,serviceModalType: 'add'},$refs['formValidate'].resetFields()">新增</Button>
                    <Button type="success" icon="ios-compose-outline" @click="edit('all')">编辑</Button>
                    <Button type="error" icon="ios-trash" @click="del('all')">删除</Button>
                </Col>
                <Col span="16" style="text-align:right;">
                    <Page :total="page.recordsTotal" :current="page.pageNum" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
                </Col>
            </Row>
            <Modal v-model="modal.serviceModal" :title="modal.serviceModalType=='add'?'新增服务':'编辑服务'">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Form-item label="服务名称" prop="serviceName">
                        <Input v-model="formValidate.serviceName" placeholder="请输入服务名称"></Input>
                    </Form-item>
                    <Form-item label="服务别名" prop="serviceAlias">
                        <Input v-model="formValidate.serviceAlias" placeholder="请输入服务名称"></Input>
                    </Form-item>
                    <Form-item label="服务描述" prop="serviceDesc">
                        <Input v-model="formValidate.serviceDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入服务描述..."></Input>
                    </Form-item>
                    <Form-item label="服务负责人" prop="servicePrincipal">
                        <!-- <Cascader align="left" style="width: 300px; display: inline-block;" :data="departData" :load-data="loadUserData" filterable clearable multiple @on-change="selectChange"></Cascader> -->
                        <Select v-model="formValidate.servicePrincipal" filterable label-in-value @on-change="selectChange">
                            <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="所属应用" prop="appId">
                        <Select v-model="formValidate.appId" filterable label-in-value @on-change="selectChangeApp">
                            <Option v-for="item in appList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="是否报警" prop="isAlert">
                        <i-switch size="large" :value="formValidate.isAlert=='1'" @on-change="formValidate.isAlert = formValidate.isAlert=='1'?'0':'1'">
                            <span slot="open">启用</span>
                            <span slot="close">禁用</span>
                        </i-switch>
                    </Form-item>
                    <Form-item label="状态" prop="status">
                        <i-switch size="large" :value="formValidate.status=='1'" @on-change="formValidate.status = formValidate.status=='1'?'0':'1'">
                            <span slot="open">启用</span>
                            <span slot="close">禁用</span>
                        </i-switch>
                    </Form-item>
                </Form>
                <div slot="footer">
                    <Button size="large" @click="modal.serviceModal = false">取消</Button>
                    <Button type="primary" size="large" @click="save">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                selections: [],
                page: {
                    pageNum: 1,
                    pageIndex: 0,
                    pageSize: 10,
                    recordsTotal: 0
                },
                search: {
                    serviceName: '',
                    appId: '',
                    status: ''
                },
                modal: {
                    serviceModal: false,
                    serviceModalType: 'add'
                },
                statusList: [
                   {
                       value: '1',
                       label: '启用'
                   },
                   {
                       value: '0',
                       label: '禁用'
                   }
                ],
                appList: this.getApp(),
                userList: this.getUserList(),
                serviceData: this.mockTableData(),
                // [
                //     {
                //         id: '1',
                //         serviceName: '超级管理员',
                //         serviceDesc: '北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居',
                //         serviceAuths: 'admin,manage',
                //         updateTime: '2017-02-03',
                //         operatorName: 'admin',
                //         status: 1
                //     },
                //     {
                //         id: '2',
                //         serviceName: '王小明2',
                //         serviceDesc: '北京市朝阳区芍药居',
                //         serviceAuths: '18',
                //         updateTime: '2017-02-03',
                //         operatorName: 'admin',
                //         status: 0
                //     }
                // ],
                serviceColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '服务别名',
                        key: 'serviceAlias'
                    },
                    {
                        title: '服务描述',
                        key: 'serviceDesc',
                        ellipsis: true
                    },
                    {
                        title: '服务负责人',
                        key: 'servicePrincipalName'
                    },
                    {
                        title: '所属应用',
                        key: 'appName'
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime',
                        render: (h, params) => {
                            return h('div', this.$util.date.formatDate(this.serviceData[params.index].updateTime,'datetime'));
                        }
                    },
                    {
                        title: '操作人',
                        key: 'operatorName'
                    },
                    {
                        title: '是否报警',
                        key: 'isAlert',
                        render: (h, params) => {
                            if(params.row.isAlert==1){
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: 'green'
                                        }
                                    },'是')
                                ]);
                            }else{
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: 'yellow'
                                        }
                                    },'否')
                                ]);
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            if(params.row.status==1){
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: 'green'
                                        }
                                    },'启用')
                                ]);
                            }else{
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: 'yellow'
                                        }
                                    },'禁用')
                                ]);
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                formValidate: {
                    serviceName: '',
                    serviceAlias: '',
                    serviceDesc: '',
                    servicePrincipal: '',
                    appId: '',
                    isAlert: '0',
                    status: '1'
                },
                ruleValidate: {
                    serviceName: [
                        { required: true, message: '服务名称不能为空', trigger: 'blur' }
                    ],
                    serviceAlias: [
                        { required: true, message: '服务别名不能为空', trigger: 'blur' }
                    ],
                    servicePrincipal: [
                        { required: true, message: '服务负责人不能为空', trigger: 'blur' }
                    ],
                    appId: [
                        { required: true, type: 'number',  message: '服务所属应用不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getApp (){
                let appData = [];
                this.$util.ajax.get('/dubbo/app/findAppList.do?pageIndex=0&pageSize=100')
                .then(function(response){
                    if(response.data.status=='success'){
                        for (var i = 0; i < response.data.data.length; i++) {
                            appData.push({value:response.data.data[i].id,label:response.data.data[i].appName});
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
                return appData;
            },
            getUserList () {
                let userData = [];
                this.$util.ajax.get('/hr/user/getUserListByCondition')
                .then(function(response){
                    for (var i = 0; i < response.data.data.length; i++) {
                        userData.push({value:response.data.data[i].userId,label:response.data.data[i].name+' - '+response.data.data[i].position});
                    }
                })
                .catch(function(err){
                    this.$Message.error({
                            content: err
                    });
                });
                return userData;
            },
            show (index) {
                this.$Modal.info({
                    title: '服务信息',
                    content: `<div><table width="100%" height="100%">
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">服务别名</td><td>${this.serviceData[index].serviceAlias}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">服务名</td><td>${this.serviceData[index].serviceName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">服务描述</td><td>${this.serviceData[index].serviceDesc}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">服务负责人</td><td>${this.serviceData[index].servicePrincipalName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">所属应用</td><td>${this.serviceData[index].appName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">是否报警</td><td>${this.serviceData[index].isAlert==1?"是":"否"}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">创建时间</td><td>${this.$util.date.formatDate(this.serviceData[index].createTime,'datetime')}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">修改时间</td><td>${this.$util.date.formatDate(this.serviceData[index].updateTime,'datetime')}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">操作人</td><td>${this.serviceData[index].operatorName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">状态</td><td>${this.serviceData[index].status==1?"启用":"禁用"}</td></tr>
                            </table></div>`
                })
            },
            edit (index) {
                this.$refs['formValidate'].resetFields();
                let data = {};
                if(index == "all"){
                    if(this.selections.length==0){
                        this.$Message.warning({
                            content: '请选择操作项'
                        })
                        return ;
                    }else if(this.selections.length>1){
                        this.$Message.warning({
                            content: '只允许编辑一条'
                        })
                        return ;
                    }
                    data = this.selections[0];
                }else{
                    data = this.serviceData[index];
                }
                this.formValidate = {
                    id: data.id,
                    serviceName: data.serviceName,
                    serviceAlias: data.serviceAlias,
                    serviceDesc: data.serviceDesc,
                    servicePrincipal: data.servicePrincipal,
                    servicePrincipalName: data.servicePrincipalName,
                    appId: data.appId,
                    appName: data.appName,
                    isAlert: data.isAlert,
                    status: data.status

                }
                this.modal.serviceModal = true;
                this.modal.serviceModalType = 'edit';
            },
            save (){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let url = this.modal.serviceModalType=='add'?'/dubbo/service/insertService.do':'/dubbo/service/updateService.do';
                        let self = this;
                        this.$util.ajax.post(url,this.$util.qs.stringify(this.formValidate))
                        .then(function(response) {
                            if(response.data.status == 'success'){
                                self.$Message.success('提交成功!');
                                self.modal.serviceModal = false;
                                self.$refs['formValidate'].resetFields();
                                self.mockTableData();
                            }else{
                                self.modal.serviceModal = false;
                                self.$Message.error({
                                        content: response.data.errorCode +':'+response.data.errorMessage
                                });
                            }
                        })
                        .catch(function(err) {
                            self.modal.permitModal = false;
                            self.$Message.error({
                                    content: err
                            });
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            del (index) {
                let ids = []
                if(index == "all"){
                    if(this.selections.length==0){
                        this.$Message.warning({
                            content: '请选择操作项'
                        })
                        return ;
                    }
                    for(var index in this.selections){
                        ids.push(this.selections[index].id);
                    }
                }else{
                    ids.push(this.serviceData[index].id);
                }
                this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确定要删除吗？</p>',
                    onOk: () => {
                        let self = this;
                        this.$util.ajax.get('/dubbo/service/deleteService.do?id='+ids[0])
                        .then(function(response) {
                            if(response.data.status == 'success'){
                                self.mockTableData();
                                self.$Message.success('删除成功!');
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
            selectionChange (selection) {
                this.selections = selection;
                // console.info(selection);
            },
            selectChange (item) {
                this.formValidate.servicePrincipal = item.value;
                this.formValidate.servicePrincipalName = item.label.split(' - ')[0];

            },
            selectChangeApp (item) {
                this.formValidate.appId = item.value;
                this.formValidate.appName = item.label;
            },
            mockTableData() {
                // console.info(this.page);
                // console.info(this.search);
                let params = '?';
                if(this.page){
                    params += 'pageIndex='+this.page.pageIndex+"&pageSize="+this.page.pageSize;
                }else{
                    params += 'pageIndex=0&pageSize=10';
                }
                if(this.search){
                    if(this.search.serviceName){
                        params += '&serviceName='+this.search.serviceName;
                    }
                    if(this.search.appId){
                        params += '&appId='+this.search.appId;
                    }
                    if(this.search.status != ''){
                        params += "&status="+this.search.status;
                    }
                }
                let self = this;
                this.$util.ajax.get('/dubbo/service/findServiceList.do'+params)
                .then(function(response) {
                    if(response.data.status == 'success'){
                        self.page.recordsTotal = response.data.recordsTotal;
                        self.serviceData = response.data.data;
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
            },
            changePage(pageNum) {
                this.page.pageNum = pageNum;
                this.page.pageIndex = (pageNum-1) * this.page.pageSize;
                this.mockTableData();
            },
            changePageSize(pageSize) {
                this.page.pageSize = pageSize;
                this.changePage(1);
            }
        }
    }
</script>