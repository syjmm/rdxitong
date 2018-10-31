<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 80%">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-input v-model="uid" style="display: none"></el-input>
                    <el-form-item label="新密码" prop="newpassword">
                        <el-input v-model="form.newpassword" style="width: 30%"></el-input>
                    </el-form-item>
                    <el-form-item label="旧密码" prop="oldpassword">
                        <el-input v-model="form.oldpassword" style="width: 30%"></el-input>
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
                form: {
                    newpassword: '',
                    oldpassword: '',


                },
                rules:{
                    newpassword :[{required: true, message: '请输入新密码', trigger: 'blur'}],
                    oldpassword :[{required: true, message: '请输入旧密码', trigger: 'blur'}],

                }
            }
        },

        created () {

        },
        methods: {
            //获取数据

            onSubmit(formName) {
                let password = this.$md5(this.$md5(this.$md5(this.form.oldpassword)));
                let password1 = this.$md5(this.$md5(this.$md5(this.form.newpassword)));
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/account/password',
                            qs.stringify({
                                newPwd: password1,
                                oldPwd: password,
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