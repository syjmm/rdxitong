<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <!--<template v-if="role == 'AUDITOR'" v-for="item in itemss">-->
            <!--<template v-if="item.subs">-->
                <!--<el-submenu :index="item.index" :key="item.index">-->
                    <!--<template slot="title">-->
                        <!--<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>-->
                    <!--</template>-->
                    <!--<template v-for="subItem in item.subs">-->
                        <!--<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">-->
                            <!--<template slot="title">{{ subItem.title }}</template>-->
                            <!--<el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">-->
                                <!--{{ threeItem.title }}-->
                            <!--</el-menu-item>-->
                        <!--</el-submenu>-->
                        <!--<el-menu-item v-else :index="subItem.index" :key="subItem.index">-->
                            <!--{{ subItem.title }}-->
                        <!--</el-menu-item>-->
                    <!--</template>-->
                <!--</el-submenu>-->
            <!--</template>-->
            <!--<template v-else>-->
                <!--<el-menu-item :index="item.index" :key="item.index">-->
                    <!--<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>-->
                <!--</el-menu-item>-->
            <!--</template>-->
        <!--</template>-->
            <template  v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                role:"",
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'utable',
                        title: '账号管理'
                    },
                    // {
                    //     icon: 'el-icon-tickets',
                    //     index: 'mtable',
                    //     title: '工作管理',
                    // },
                    {
                        icon: 'el-icon-news',
                        index: 'table',
                        title: '新闻管理',

                    },
                    {
                        icon: 'el-icon-message',
                        index: 'ltable',
                        title: '法律法规管理'
                    },
                    {
                        icon: 'el-icon-bell',
                        index: 'itable',
                        title: '通知管理',

                    },
                    {
                        icon: 'el-icon-date',
                        index: 'rtable',
                        title: '代表管理',
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'gtable',
                        title: '代表小组管理',
                    },
                    {
                        icon: 'el-icon-phone-outline',
                        index: 'wtable',
                        title: '工作站管理'
                    },
                    {
                        icon: 'el-icon-message',
                        index: 'etable',
                        title: '选民意见管理'
                    },
                    {
                        icon: 'el-icon-edit',
                        index: 'stable',
                        title: '代表建议管理'
                    },
                    {
                        icon: 'el-icon-edit-outline',
                        index: 'ctable',
                        title: '代表履职统计'
                    },
                    {
                        icon: 'el-icon-document',
                        index: 'power',
                        title: '特殊职能设置'
                    },
                    // {
                    //     icon: 'el-icon-edit-outline',
                    //     index: 'test',
                    //     title: 'test'
                    // },
                    // {
                    //     icon: 'el-icon-star-on',
                    //     index: '3',
                    //     title: '表单相关',
                    //     subs: [
                    //         {
                    //             index: 'form',
                    //             title: '基本表单'
                    //         },
                    //         {
                    //             index: '3-2',
                    //             title: '编辑器',
                    //             subs: [
                    //                 {
                    //                     index: 'editor',
                    //                     title: '富文本编辑器'
                    //                 },
                    //                 {
                    //                     index: 'markdown',
                    //                     title: 'markdown编辑器'
                    //                 },
                    //             ]
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-star-on',
                    //     index: 'charts',
                    //     title: 'schart图表'
                    // },
                    // {
                    //     icon: 'el-icon-rank',
                    //     index: 'drag',
                    //     title: '拖拽列表'
                    // },
                    // {
                    //     icon: 'el-icon-warning',
                    //     index: 'permission',
                    //     title: '权限测试'
                    // },
                    // {
                    //     icon: 'el-icon-error',
                    //     index: '404',
                    //     title: '404页面'
                    // }
                ],
                itemss: [

                    {
                        icon: 'el-icon-tickets',
                        index: 'mstable',
                        title: '审核工作',

                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'newtable',
                        title: '审核新闻',

                    },
                    {
                        icon: 'el-icon-bell',
                        index: 'inewtable',
                        title: '审核通知公告',
                    },

                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            this.role = localStorage.getItem('ms_role')
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
