import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import AMap from 'vue-amap';

Vue.use(ElementUI, { size: 'small' });
Vue.use(AMap);
AMap.initAMapApiLoader({
    key: '9a0343b609ba238ef075caa01e3467e1',
    plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor','AMap.Geocoder'],
    uiVersion: '1.0.11'});
axios.defaults.baseURL = 'http://192.168.1.22:8080/api';
// axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import global_ from './../static/config/global'
Vue.prototype.$axios = axios;
Vue.prototype.GLOBAL = global_;
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;


//使用钩子函数对路由进行权限跳转

router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    const token =localStorage.getItem('ms_token');
    if(to.path !== '/login'){
        axios.get('/manager/auth/token/valid',{
            headers: {
                'Authorization':token,
            }
        }).then(res=>{
            if(res.data.status == "UNAUTHORIZED"){
                next('/login');

            }
            // else{
            //     next();
            // }
        })
    }

    if(!role &&to.path !== '/login'){
        next('/login');

    }else if(to.meta.permission){

        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');

    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');