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
                     应用管理
                </Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="content-body">
            <Row>
                <Col span="5" style="padding-right: 10px">
                    <Input v-model="search.appName" placeholder="请输入应用名称"></Input>
                </Col>
                <Col span="5" style="padding-right: 10px">
                    <Select v-model="search.status" clearable>
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
                    <Table :columns="appColumns" :data="appData" @on-selection-change="selectionChange"></Table>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span="8">
                    <Button type="primary" icon="ios-plus-empty" @click="modal = {appModal: true,appModalType: 'add'},$refs['formValidate'].resetFields()">新增</Button>
                    <Button type="success" icon="ios-compose-outline" @click="edit('all')">编辑</Button>
                    <Button type="error" icon="ios-trash" @click="del('all')">删除</Button>
                </Col>
                <Col span="16" style="text-align:right;">
                    <Page :total="page.recordsTotal" :current="page.pageNum" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
                </Col>
            </Row>
            <Modal v-model="modal.appModal" :title="modal.appModalType=='add'?'新增应用':'编辑应用'">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <Form-item label="应用名称" prop="appName">
                        <Input v-model="formValidate.appName" placeholder="请输入应用名称"></Input>
                    </Form-item>
                    <Form-item label="应用描述" prop="appDesc">
                        <Input v-model="formValidate.appDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入应用描述..."></Input>
                    </Form-item>
                    <Form-item label="应用授权" prop="appAuths">
                        <Select v-model="formValidate.appAuths" filterable multiple>
                            <Option v-for="item in permitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>

                        <!-- <Input v-model="formValidate.appAuths" placeholder="请选择应用授权"></Input> -->
                    </Form-item>
                    <Form-item label="状态" prop="status">
                        <i-switch size="large" :value="formValidate.status=='1'" @on-change="formValidate.status = formValidate.status=='1'?'0':'1'">
                            <span slot="open">启用</span>
                            <span slot="close">禁用</span>
                        </i-switch>
                    </Form-item>
                </Form>
                <div slot="footer">
                    <Button size="large" @click="modal.appModal = false">取消</Button>
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
                    appName: '',
                    status: ''
                },
                modal: {
                    appModal: false,
                    appModalType: 'add'
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
                permitList: this.getPermit(),
                appData: this.mockTableData(),
                // [
                //     {
                //         id: '1',
                //         appName: '超级管理员',
                //         appDesc: '北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居北京市朝阳区芍药居',
                //         appAuths: 'admin,manage',
                //         updateTime: '2017-02-03',
                //         operatorName: 'admin',
                //         status: 1
                //     },
                //     {
                //         id: '2',
                //         appName: '王小明2',
                //         appDesc: '北京市朝阳区芍药居',
                //         appAuths: '18',
                //         updateTime: '2017-02-03',
                //         operatorName: 'admin',
                //         status: 0
                //     }
                // ],
                appColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '应用名',
                        key: 'appName'
                    },
                    {
                        title: '应用描述',
                        key: 'appDesc',
                        ellipsis: true
                    },
                    {
                        title: '应用授权',
                        key: 'appAuths'
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime',
                        render: (h, params) => {
                            return h('div', this.$util.date.formatDate(this.appData[params.index].updateTime,'datetime'));
                        }
                    },
                    {
                        title: '操作人',
                        key: 'operatorName'
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
                    appName: '',
                    appDesc: '',
                    appAuths: [],
                    status: '1'
                },
                ruleValidate: {
                    appName: [
                        { required: true, message: '应用名称不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getPermit (){
                let permitData = [];
                this.$util.ajax.get('/dubbo/permit/findPermissionList.do?pageIndex=0&pageSize=100')
                .then(function(response){
                    if(response.data.status=='success'){
                        for (var i = 0; i < response.data.data.length; i++) {
                            permitData.push({value:response.data.data[i].permitKey,label:response.data.data[i].permitName});
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
                return permitData;
            },
            show (index) {
                this.$Modal.info({
                    title: '应用信息',
                    content: `<div><table width="100%" height="100%">
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">应用名</td><td>${this.appData[index].appName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">应用描述</td><td>${this.appData[index].appDesc}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">应用授权</td><td>${this.appData[index].appAuths}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">创建时间</td><td>${this.$util.date.formatDate(this.appData[index].createTime,'datetime')}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">修改时间</td><td>${this.$util.date.formatDate(this.appData[index].updateTime,'datetime')}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">操作人</td><td>${this.appData[index].operatorName}</td></tr>
                            <tr><td width="70px" align="right" style="padding: 5px 10px 5px 0;">状态</td><td>${this.appData[index].status==1?"启用":"禁用"}</td></tr>
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
                    data = this.appData[index];
                }
                this.formValidate = {
                    id: data.id,
                    appName: data.appName,
                    appDesc: data.appDesc,
                    appAuths: data.appAuths.split(','),
                    status: data.status

                }
                this.modal.appModal = true;
                this.modal.appModalType = 'edit';
            },
            save (){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let url = this.modal.appModalType=='add'?'/dubbo/app/insertapp.do':'/dubbo/app/updateapp.do';
                        let self = this;
                        let paramData = {
                            id: self.formValidate.id,
                            appName: self.formValidate.appName,
                            appDesc: self.formValidate.appDesc,
                            appAuths: self.formValidate.appAuths.toString(),
                            status: self.formValidate.status
                        }
                        this.$util.ajax.post(url,self.$util.qs.stringify(paramData))
                        .then(function(response) {
                            if(response.data.status == 'success'){
                                self.$Message.success('提交成功!');
                                self.modal.appModal = false;
                                self.$refs['formValidate'].resetFields();
                                self.mockTableData();
                            }else{
                                self.modal.appModal = false;
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
                    ids.push(this.appData[index].id);
                }
                this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确定要删除吗？</p>',
                    onOk: () => {
                        let self = this;
                        this.$util.ajax.get('/dubbo/app/deleteapp.do?id='+ids[0])
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
                    if(this.search.appName){
                        params += '&appName='+this.search.appName;
                    }
                    if(this.search.status != ''){
                        params += "&status="+this.search.status;
                    }
                }
                let self = this;
                this.$util.ajax.get('/dubbo/app/findappList.do'+params)
                .then(function(response) {
                    if(response.data.status == 'success'){
                        self.page.recordsTotal = response.data.recordsTotal;
                        self.appData = response.data.data;
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