<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>工作站</el-breadcrumb-item>
                <el-breadcrumb-item>修改工作站</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="工作站名称" prop="name">
                        <el-input type="text" v-model="form.name" prop="name" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="工作站图片" prop="imgSrc">
                        <div>
                            <img :src="GLOBAL.BASE_URL + form.imgSrc" style="width:300px;height: 200px">
                        </div>
                        <div  class="el-upload__tip">只能上传jpg/png文件</div>
                        <el-upload
                                class="upload-demo"
                                action=""
                                :before-upload="beforeUpload"
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.GIF"
                                :auto-upload="true"
                                v-show="anniu">
                            <el-button size="small" type="primary" v-show="anniu">点击上传</el-button>
                        </el-upload>
                        <div  v-show="anniu1">正在上传</div>
                        <div class="anniu" v-show="anniu" @click="clears">清空</div>
                    </el-form-item>

                    <el-form-item label="工作站描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" :maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item label="工作站联系方式" prop="phone">
                        <el-input type="text" v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="工作站地址" prop="address">
                        <div class="amap-page-container">
                            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
                            <el-amap vid="amapDemo" :center="mapCenter" :zoom="16" class="amap-demo" :events="events">
                                <el-amap-marker  v-for="(marker,index) in markers" :position="marker" :key="index"></el-amap-marker>
                            </el-amap>
                            <div class="toolbar">
                                当前经纬度: [{{ lng }}, {{ lat }}] 当前地址: {{ address }}
                            </div>
                        </div>
                        <!--<el-input type="text" v-model="form.address" :disabled="true"></el-input>-->
                        <!--<div style="color:#606266;">当前经纬度为：[{{center.lng}},{{center.lat}}]</div>-->
                        <!--<baidu-map v-bind:style="mapStyle" class="bm-view" ak="DD279b2a90afdf0ae7a3796787a0742e"-->
                                   <!--:center="center"-->
                                   <!--:zoom="zoom"-->
                                   <!--:scroll-wheel-zoom="true"-->
                                   <!--@click="getClickInfo"-->
                                   <!--@moving="syncCenterAndZoom"-->
                                   <!--@moveend="syncCenterAndZoom"-->
                                   <!--@zoomend="syncCenterAndZoom">-->
                            <!--<bm-view style="width: 100%; height:500px;"></bm-view>-->
                            <!--<bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">-->
                            <!--</bm-marker>-->
                            <!--<bm-control :offset="{width: '10px', height: '10px'}">-->
                                <!--<bm-auto-complete v-model="form.address" :sugStyle="{zIndex: 999999}">-->
                                    <!--<input type="text" placeholder="请输入搜索关键字" class="serachinput">-->
                                <!--</bm-auto-complete>-->
                            <!--</bm-control>-->
                            <!--<bm-local-search :keyword="form.address" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>-->
                        <!--</baidu-map>-->
                        <!--<div slot="footer" style="margin-top: 0px;">-->
                        <!--<Button @click="cancel" type="ghost"-->
                        <!--style="width: 60px;height: 36px;">取消-->
                        <!--</Button>-->
                        <!--<Button type="primary" style="width: 60px;height: 36px;" @click="confirm">确定</Button>-->
                        <!--</div>-->
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import qs from 'qs'
    import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
    export default {
        name: 'baseform',
        data: function(){
            let self = this;
            return {
                dialogVisible: false,
                options:[],
                anniu1:false,
                anniu:true,

                markers:[],
                searchOption: {
                    city: '',
                    citylimit: true
                },
                mapCenter: [121.59996, 31.197646],
                zoom: 12,
                address: '',
                events: {
                    click(e) {
                        let { lng, lat } = e.lnglat;
                        self.lng = lng;
                        self.lat = lat;

                        // 这里通过高德 SDK 完成。
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        geocoder.getAddress([lng ,lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.regeocode) {
                                    self.address = result.regeocode.formattedAddress;
                                    self.$nextTick();
                                }
                            }
                        });
                    }
                },
                lng: 0,
                lat: 0,
                form: {
                    name: '',
                    phone:'',
                    address:'',
                    desc:'',
                    imgSrc:'',
                },
                rules:{
                    name :[{required: true, message: '请输入工作站名称', trigger: 'blur'}],
                    phone :[{required: true, message: '请输入工作站联系方式', trigger: 'blur'}],
                    address :[{required: true, message: '请输入工作站地址', trigger: 'blur'}],
                    desc :[{required: true, message: '请输入工作站简介', trigger: 'blur'}],
                    imgSrc :[{required: true, message: '请上传工作站图片', trigger: 'blur'}],
                }
            }
        },
        watch: {
            value: function (currentValue) {
                this.showMapComponent = currentValue;
                if (currentValue) {
                    this.keyword = ''
                }
            }
        },
        created(){
            this.uid=this.$route.query.uid;
            this.getdata();

        },

        components: {
            BaiduMap,
            BmControl,
            BmView,
            BmAutoComplete,
            BmLocalSearch,
            BmMarker
        },
        props: {
            value: Boolean,
            mapHeight: {
                type: Number,
                default: 500
            }
        },
        methods: {
            /***
             * 地图点击事件。
             */
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                        // this.markers.push([poi.lng, poi.lat]);
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.markers=[[center.lng, center.lat]];
                    this.mapCenter = [center.lng, center.lat];
                }
            },
            // getClickInfo (e) {
            //     this.center.lng = e.point.lng
            //     this.center.lat = e.point.lat
            // },
            // syncCenterAndZoom (e) {
            //     const {lng, lat} = e.target.getCenter()
            //     this.center.lng = lng
            //     this.center.lat = lat
            //     this.zoom = e.target.getZoom()
            // },
            // /***
            //  * 确认
            //  */
            // confirm: function () {
            //
            // },
            // /***
            //  * 取消
            //  */
            // cancel: function () {
            //
            // },

            getdata(){
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/work_stations/details',{
                    headers: {
                        'Authorization':token,
                    },
                    params:{uid:this.uid}}).then(res=>{
                   this.form.name=res.data.data.name;
                   this.form.desc=res.data.data.description;
                   this.form.phone=res.data.data.telephone;
                   this.form.address=res.data.data.address;
                   this.form.imgSrc=res.data.data.avatar;
                   this.lng=res.data.data.longitude;
                   this.lat=res.data.data.latitude;
                   this.address=res.data.data.address;
                   this.mapCenter=[parseFloat(this.lng),parseFloat(this.lat)];
                    // this.mapCenter[1]=parseFloat(this.lat);
                    this.markers=[[parseFloat(this.lng), parseFloat(this.lat)]];
                    console.log(this.mapCenter)

                })
            },
            onSubmit(formName) {
                this.form.address=this.address;
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/work_stations/update',
                            qs.stringify({
                                avatar: this.form.imgSrc,
                                description: this.form.desc,
                                telephone: this.form.phone,
                                name: this.form.name,
                                longitude:this.lng,
                                latitude:this.lat,
                                address: this.form.address,
                                uid: this.uid
                            }),
                            {
                                headers: {
                                    'Authorization':token,
                                }
                            }).then(res => {
                            // console.log(res)
                            if (res.data.status == 'OK') {
                                this.$message.success('提交成功！');
                                this.$router.push({path: '/wtable'})
                            } else {
                                this.$message.error('提交失败！');
                            }
                        })
                    }})

            },
            clears(){
                this.imgVisible = false;
                this.form.imgSrc = "";
            },

            beforeUpload(file){
                const isJPG = file.type === 'image/jpeg'|| 'image/png';
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    this.anniu =true;
                    this.anniu1=false;
                    return isJPG;
                }
                this.anniu =false;
                this.anniu1=true;
                let token = localStorage.getItem('ms_token');
                let fd = new FormData();
                fd.append('file',file);//传文件
                fd.append('uid',this.uid);//传其他参数
                let that=this;
                this.$axios.post('/manager/work_stations/upload',fd,{
                    headers: {
                        'Authorization':token,
                    }
                }).then(function(res){
                    if(res.data.status == 'OK'){
                        that.form.imgSrc=res.data.data.url;
                        that.anniu = true;
                        that.anniu1 = false;
                        that.$message.success('上传成功！');
                    }else{
                        that.anniu = true;
                        that.anniu1 = false;
                        that.$message.error('只允许上传jpg/png格式！');
                    }
                })
            },
            newSubmitForm(){//确定上传
                this.$refs.newupload.submit();
            },
            cancel(){
                this.$router.push({path:'/wtable'})
            }
        }
    }
</script>
<style>
    .anniu{
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
        font-size: 12px;
        border-radius: 3px;
        width: 60px;
        height: 20px;
        padding:5px 5px;
        line-height: 20px;
        text-align: center;
        float:left;
        margin-top: -50px;
        margin-left: 110px;
        cursor: pointer;
    }
    .el-upload__tip{
        margin-top: -7px !important;
    }
    .upload-demo .el-upload--text {
        width: 100px !important;
        height: 40px !important;
        border:none !important;
        background: transparent !important;
    }
    .upload-demo .el-upload {
        width: 100px !important;
        height: 40px !important;
        border:none !important;
        background: transparent !important;
    }
    .amap-demo {
        height: 300px;
    }

    .search-box {
        position: absolute;
        top: 25px;
        left: 20px;
    }

    .amap-page-container {
        position: relative;
    }
    .amap-demo {
        width: 100%;
        height: 500px!important;
    }
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .serachinput{
        width: 300px;
        box-sizing: border-box;
        padding: 9px;
        border: 1px solid #dddee1;
        line-height: 20px;
        font-size: 16px;
        height: 38px;
        color: #333;
        position: relative;
        border-radius: 4px;
        -webkit-box-shadow: #666 0px 0px 10px;
        -moz-box-shadow: #666 0px 0px 10px;
        box-shadow: #666 0px 0px 10px;
    }

</style>