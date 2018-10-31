import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/table'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                // {
                //     path: '/dashboard',
                //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                //     meta: { title: '系统首页' }
                // },
                {
                    path: '/utable',
                    component: resolve => require(['../components/user/BaseTable.vue'], resolve),
                    meta: { title: '账号管理' }
                },
                {
                    path: '/updatapassword',
                    component: resolve => require(['../components/page/UpdataPassword.vue'], resolve),
                    meta: { title: '修改密码' }
                },
                {
                    path: '/updataphone',
                    component: resolve => require(['../components/page/UpdataPhone.vue'], resolve),
                    meta: { title: '修改手机号' }
                },

                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/newtable',
                    component: resolve => require(['../components/page/Table.vue'], resolve),
                    meta: { title: '审核新闻' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    path: '/updataform',
                    component: resolve => require(['../components/page/UpdataForm.vue'], resolve),
                    meta: { title: '修改表单' }
                },
                {
                    path: '/rtable',
                    component: resolve => require(['../components/represent/BaseTable.vue'], resolve),
                    meta: { title: '代表列表' }
                },
                {
                    path: '/rform',
                    component: resolve => require(['../components/represent/BaseForm.vue'], resolve),
                    meta: { title: '代表新增表单' }
                },
                {
                    path: '/sbform',
                    component: resolve => require(['../components/represent/SBaseForm.vue'], resolve),
                    meta: { title: '代表履职登记表单' }
                },
                {
                    path: '/ubform',
                    component: resolve => require(['../components/represent/UBaseForm.vue'], resolve),
                    meta: { title: '修改代表履职登记表单' }
                },
                {
                    path: '/rupdataform',
                    component: resolve => require(['../components/represent/UpdateForm.vue'], resolve),
                    meta: { title: '代表修改表单' }
                },

                {
                    path: '/gtable',
                    component: resolve => require(['../components/group/BaseTable.vue'], resolve),
                    meta: { title: '代表小组列表' }
                },
                {
                    path: '/gform',
                    component: resolve => require(['../components/group/BaseForm.vue'], resolve),
                    meta: { title: '代表小组新增表单' }
                },

                {
                    path: '/gupdataform',
                    component: resolve => require(['../components/group/UpdateForm.vue'], resolve),
                    meta: { title: '代表修改表单' }
                },

                {
                    path: '/wtable',
                    component: resolve => require(['../components/work/BaseTable.vue'], resolve),
                    meta: { title: '工作站管理' }
                },
                {
                    path: '/wform',
                    component: resolve => require(['../components/work/BaseForm.vue'], resolve),
                    meta: { title: '工作站新增表单' }
                },
                {
                    path: '/wupdataform',
                    component: resolve => require(['../components/work/UpdateForm.vue'], resolve),
                    meta: { title: '工作站修改表单' }
                },
                {
                    path: '/etable',
                    component: resolve => require(['../components/elector/BaseTable.vue'], resolve),
                    meta: { title: '选民意见管理' }
                },
                {
                    path: '/stable',
                    component: resolve => require(['../components/suggest/BaseTable.vue'], resolve),
                    meta: { title: '代表建议管理' }
                },
                {
                    path: '/sform',
                    component: resolve => require(['../components/suggest/BaseForm.vue'], resolve),
                    meta: { title: '代表新增表单' }
                },

                {
                    path: '/itable',
                    component: resolve => require(['../components/inform/BaseTable.vue'], resolve),
                    meta: { title: '通知公告管理' }
                },
                {
                    path: '/inewtable',
                    component: resolve => require(['../components/inform/Table.vue'], resolve),
                    meta: { title: '审核通知公告' }
                },
                {
                    path: '/iform',
                    component: resolve => require(['../components/inform/BaseForm.vue'], resolve),
                    meta: { title: '通知公告表单' }
                },
                {
                    path: '/iupdataform',
                    component: resolve => require(['../components/inform/UpdateForm.vue'], resolve),
                    meta: { title: '通知公告修改表单' }
                },
                {
                    path: '/ltable',
                    component: resolve => require(['../components/law/BaseTable.vue'], resolve),
                    meta: { title: '法律法规管理' }
                },
                {
                    path: '/lform',
                    component: resolve => require(['../components/law/BaseForm.vue'], resolve),
                    meta: { title: '通知公告表单' }
                },
                {
                    path: '/lupdataform',
                    component: resolve => require(['../components/law/UpdateForm.vue'], resolve),
                    meta: { title: '通知公告修改表单' }
                },
                {
                    path: '/ctable',
                    component: resolve => require(['../components/count/BaseTable.vue'], resolve),
                    meta: { title: '代表履职统计' }
                },
                {
                    path: '/test',
                    component: resolve => require(['../components/page/test.vue'], resolve),
                    meta: { title: '代表履职管理' }
                },
                {
                    path: '/mtable',
                    component: resolve => require(['../components/workmanage/BaseTable.vue'], resolve),
                    meta: { title: '工作管理' }
                },
                {
                    path: '/mform',
                    component: resolve => require(['../components/workmanage/BaseForm.vue'], resolve),
                    meta: { title: '工作管理表单' }
                },
                {
                    path: '/mstable',
                    component: resolve => require(['../components/workmanage/Table.vue'], resolve),
                    meta: { title: '审核新闻' }
                },
                {
                    path: '/mupdataform',
                    component: resolve => require(['../components/workmanage/UpdateForm.vue'], resolve),
                    meta: { title: '工作管理修改表单' }
                },
                {
                    path: '/echarts',
                    component: resolve => require(['../components/count/Echarts.vue'], resolve),
                    meta: { title: '图表' }
                },
                {
                    path: '/power',
                    component: resolve => require(['../components/power/BaseForm.vue'], resolve),
                    meta: { title: '权限设置' }
                },


            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
