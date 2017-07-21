const routers = [
	{
		path: '/',
        // component: (resolve) => require(['./views/index.vue'], resolve)
		redirect: '/login'
	},
    {
        path: '/index',
        // meta: {
        //     title: 'dubbo服务治理平台'
        // },
        component: (resolve) => require(['./views/index.vue'], resolve),
        children:[
        	{
        		path: '',
        		component: (resolve) => require(['./views/pages/about.vue'], resolve)
        	},
            {
                path: 'application',
                component: (resolve) => require(['./views/pages/application.vue'], resolve)
            },
            {
                path: 'service',
                component: (resolve) => require(['./views/pages/service.vue'], resolve)
            },
            {
                path: 'authManager-permission',
                component: (resolve) => require(['./views/pages/permission.vue'], resolve)
            },
            {
                path: 'authManager-role',
                component: (resolve) => require(['./views/pages/role.vue'], resolve)
            },
            {
                path: 'authManager-authorization',
                component: (resolve) => require(['./views/pages/authorization.vue'], resolve)
            },
        	{
        		path: 'about',
        		component: (resolve) => require(['./views/pages/about.vue'], resolve)
        	}
        ]
    },
    {
    	path: '/login',
    	component: resolve => require(['./views/pages/login.vue'], resolve)
    },
    {
        path: '/loginOut',
        component: resolve => require(['./views/pages/loginOut.vue'], resolve)
    }
];
export default routers;