<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>代表</el-breadcrumb-item>
                <el-breadcrumb-item>修改代表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="代表名称" prop="name">
                        <el-input type="text" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="代表正面照" prop="imgSrc">
                        <div>
                            <img :src="GLOBAL.BASE_URL + form.imgSrc" style="width:auto;height: 250px;">
                        </div>
                        <div class="el-upload__tip">只能上传jpg/png文件</div>
                        <el-upload
                                class="upload-demo"
                                action=""
                                :before-upload="beforeUpload"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                :auto-upload="true">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>

                    </el-form-item>

                    <el-form-item label="代表出生时间" prop="time">
                        <el-date-picker
                                v-model="form.time"
                                type="date"
                                @change="getTime"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions0"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="1" :value="1">男</el-radio>
                            <el-radio :label="0" :value="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="任职职位"prop="role">
                        <el-select v-model="form.role" placeholder="请选择">
                            <el-option
                                    v-for="item in optionss"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所属小组" prop="gourp">
                        <el-select v-model="form.gourp" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代表手机号" prop="phone">
                        <el-input type="text" v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="代表简介" prop="desc">
                        <el-input type="textarea" v-model="form.desc" :maxlength="200"></el-input>
                    </el-form-item>

                    <el-form-item label="履职状态：" prop="status">
                        <div v-if="form.status == '0'" style="color:#606266;">本届</div>
                        <div v-if="form.status == '1'" style="color:#606266;">往届</div>
                        <div v-if="form.status == '-1'" style="color:#606266;">其他</div>
                        <!--<el-select v-model="form.status" placeholder="请选择" @change="status">-->
                            <!--<el-option label="本届" :value="0"></el-option>-->
                            <!--<el-option label="往届" :value="1"></el-option>-->
                            <!--<el-option label="其他" :value="-1"></el-option>-->

                        <!--</el-select>-->
                    </el-form-item>
                    <el-form-item label="备注：" prop="desc1" v-if="form.status == '-1'">
                        <div style="color:#606266;">{{form.desc1}}</div>

                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-dialog title="添加备注" :visible.sync="editVisible2" width="50%">
                <el-form ref="form"  :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="备注：" prop="desc1">
                        <el-input type="textarea" v-model="form.desc1" :maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="cancel2">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import qs from 'qs'
    import {isvalidPhone} from '../../../config/validate'
    var validPhone=(rule, value,callback)=>{
        if (!value){
            callback(new Error('请输入电话号码'))
        }else  if (!isvalidPhone(value)){
            callback(new Error('请输入正确的11位手机号码'))
        }else {
            callback()
        }
    }
    export default {
        name: 'baseform',
        data: function(){
            return {

                dialogVisible: false,
                desc:"",
                options:[],
                optionss:[],

                editVisible2:false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                uid:'',
                form: {
                    name: '',
                    phone:'',
                    rename:'',
                    time:'',
                    imgSrc:'',
                    sex:'',
                    status:'',
                    gourp:'',
                    desc:'',
                    uid:'',
                    role:'',
                    type:'',
                    notes:'',
                    desc1:''
                },
                rules:{
                    name :[{required: true, message: '请输入代表名称', trigger: 'blur'}],
                    desc :[{required: true, message: '请输入代表简介', trigger: 'blur'}],
                    time :[{required: true, message: '请选择出生日期', trigger: 'blur'}],
                    sex :[{required: true, message: '请选择性别', trigger: 'blur'}],
                    phone :[{required: true, trigger: 'blur',validator: validPhone}],
                    gourp :[{required: true, message: '请选择所属小组', trigger: 'blur'}],
                    imgSrc :[{required: true, message: '请上传代表正面照', trigger: 'blur'}],
                    role :[{required: true, message: '请选择任职职位', trigger: 'blur'}],
                    status :[{required: true, message: '请选择履职状态', trigger: 'blur'}],
                    notes :[{required: true, message: '请选择履职备注', trigger: 'blur'}],
                    desc1 :[{required: true, message: '请选择履职备注', trigger: 'blur'}],
                }
            }
        },
        created(){
            this.uid=this.$route.query.uid;
            //查询所有小组
            let token = localStorage.getItem('ms_token');
            this.$axios.get('/manager/npc_member_groups/all',{
                headers: {
                    'Authorization':token,
                }
            }).then(res=>{
                this.options=res.data.data;
            });
            //查询所有角色
            this.$axios.get('/manager/roles/all',{
                headers: {
                    'Authorization':token,
                }
            }).then(res=>{
                this.optionss=res.data.data;
            });
            this. deilt();

        },

        methods: {
            deilt(){
                //查询某个代表的具体信息
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_members/details',{
                    headers: {
                        'Authorization':token,
                    },
                    params:{uid:this.uid}}).then(res=>{
                    this.form.name=res.data.data.name;
                    this.form.phone=res.data.data.mobile;
                    this.form.sex=res.data.data.gender;
                    this.form.time=res.data.data.birthday;
                    this.form.status=res.data.data.status;
                    this.form.gourp=res.data.data.group;
                    this.form.role=res.data.data.role;
                    this.form.desc=res.data.data.introduction;
                    this.form.imgSrc=res.data.data.avatar;
                    this.form.desc1= res.data.data.comment;
                })
            },

            getTime(val){
                this.form.time=val;
            },
            status(){

                let token = localStorage.getItem('ms_token');
               if(this.form.status == "0"||this.form.status == "1"){
                   this.$axios.post("/manager/npc_members/status", ({
                           uid: this.uid,
                           status: this.form.status,

                       }),
                       {
                           headers: {
                               'Authorization': token,
                           }
                       }).then(res => {
                       if (res.data.status == "OK") {
                          this.$message.success("修改成功")
                       }
                   })
               }
               if(this.form.status == "-1"){
                    this.editVisible2 = true;
               }

            },
            cancel2(){
               this.deilt();
               this.editVisible2 = false;
            },
            save(formName){
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/manager/npc_members/status", ({
                                uid: this.uid,
                                status: this.form.status,
                                comment: this.desc
                            }),
                            {
                                headers: {
                                    'Authorization': token,
                                }
                            }).then(res => {
                            if (res.data.status == "OK") {
                                this.editVisible2 = false;
                                this.desc = "";
                            }
                        })
                    }})
            },
            onSubmit(formName) {
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/npc_members/update',
                            qs.stringify({
                                uid: this.uid,
                                avatar: this.form.imgSrc,
                                birthday: this.form.time,
                                gender: this.form.sex,
                                group: this.form.gourp,
                                role: this.form.role,
                                introduction: this.form.desc,
                                mobile: this.form.phone,
                                name: this.form.name,
                                status: this.form.status,

                            }),
                            {
                                headers: {
                                    'Authorization':token,
                                },
                            }).then(res => {
                            // console.log(res)
                            if (res.data.status == 'OK') {
                                this.$message.success('提交成功！');
                                this.$router.push({path: '/rtable'})
                            } else {
                                this.$message.error('提交失败！');
                            }
                        })
                    }})

            },
            beforeUpload(file){

                let fd = new FormData();
                fd.append('file',file);//传文件
                fd.append('uid',this.uid);//传其他参数
                let that=this;
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/npc_members/upload',fd,{
                    headers: {
                        'Authorization':token,
                    }
                }).then(function(res){
                    that.form.imgSrc=res.data.data.url;
                    console.log(res.data.data.url)
                    that.$message.success('上传成功！');
                })
            },
            newSubmitForm(){//确定上传
                this.$refs.newupload.submit();
            },
            cancel(){
                this.$router.push({path:'/rtable'})
            }
        }
    }
</script>
<style>
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
</style>