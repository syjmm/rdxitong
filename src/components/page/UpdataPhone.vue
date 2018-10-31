<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>修改手机号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 80%">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-input v-model="uid" style="display: none"></el-input>
                    <el-form-item label="新手机号" prop="mobile">
                        <el-input v-model="form.mobile" style="width: 30%"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input  placeholder="code" v-model="form.code" style="width: 160px;"></el-input>
                        <el-button type="primary" @click="dx_yzm_bt" style="width: 120px;margin-left: 12px;" v-show="is_dx_yz">获取验证码</el-button> 
                        <el-button type="primary" style="width: 120px;margin-left: 12px;" disabled v-show="!is_dx_yz">{{time}}秒后重新获取</el-button>   
                    </el-form-item>
                    <el-form-item label="当前密码" prop="oldpassword">
                        <el-input type="password" v-model="form.oldpassword" style="width: 30%"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">确认修改</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
        name: 'updataform',
        data: function(){
            return {
                uid:'',
                editorOption: {},
                dialogVisible: false,
                name:'',
                imageUrl: '',
                imgsrc:"",
                time:60,
                is_dx_yz:true,
                form: {
                    mobile: '',
                    oldpassword: '',
                    code:""

                },
                rules:{
                    mobile :[{required: true, trigger: 'blur',validator: validPhone}],
                    oldpassword :[{required: true, message: '请输入旧密码', trigger: 'blur'}],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]

                }
            }
        },

        created () {

        },
        methods: {
            //获取数据

            onSubmit(formName) {
                let password = this.$md5(this.$md5(this.$md5(this.form.oldpassword)));
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/account/mobile',
                            qs.stringify({
                                mobilenumber: this.form.mobile,
                                verifycode: this.form.code,
                                pwd: password,
                            }),{
                                headers: {
                                    'Authorization':token,
                                }
                            }).then((res) => {
                            if(res.data.status=="OK"){
                                this.$message.success('修改成功！');
                                this.$router.push({path: "/table"})
                            }else{
                                this.$message.error(res.data.message);
                            }
                        })
                    }})
                // this.$message.success('提交成功！');
            },
            dx_yzm_bt(){
                let token = localStorage.getItem('ms_token');
                if(this.form.mobile == ""){
                    this.$message.error("请填写手机号");
                    return;
                }
                this.is_dx_yz=false;
                this.$axios.get("/manager/verify/mobile",{
                    headers: {
                        'Authorization':token,
                    },
                    params:{
                        mobile:this.form.mobile
                    }
                }).then(res=>{
                    console.log(res)
                })
                let dx_djs=setInterval(()=>{
                    if ((this.time--) <= 0) {
                        this.time = 60;
                        this.is_dx_yz = true;
                        window.clearInterval(dx_djs);
                    }
                },1000);
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            cancel(){
                this.$router.push({path:"/utable"})
            }
        }
    }
</script>
<style>
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
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
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