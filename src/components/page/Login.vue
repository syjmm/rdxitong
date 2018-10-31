<template>
    <div class="login-wrap">
        <div class="ms-title">黄龙溪代表之家后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input  placeholder="code" v-model="ruleForm.code" style="width: 160px;"></el-input>
                    <el-button type="primary" @click="dx_yzm_bt" style="width: 120px;margin-left: 12px;" v-show="is_dx_yz">获取验证码</el-button> 
             <el-button type="primary" style="width: 120px;margin-left: 12px;" v-show="!is_dx_yz" disabled>{{time}}秒后重新获取</el-button>   

                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        data: function(){
            return {
                is_dx_yz:true,
                time:60,
                ruleForm: {
                    username: '',
                    password: '',
                    code:''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){

        },
        methods: {
            dx_yzm_bt(){

                if(this.ruleForm.username == ""){
                    this.$message.error("请填写用户名");
                    return;
                }
                this.is_dx_yz=false;
                this.$axios.get("/manager/verify/token",{
                    params:{
                        username:this.ruleForm.username
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

            submitForm(formName) {
                var password = this.$md5(this.$md5(this.$md5(this.ruleForm.password)));

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/auth/token',
                        qs.stringify({
                            username:this.ruleForm.username,
                            // password:this.ruleForm.password
                            password:password,
                            verifycode:this.ruleForm.code
                        })).then(res=>{
                            if(res.data.status == 'OK'){
                                localStorage.setItem('ms_username',this.ruleForm.username);
                                localStorage.setItem('ms_token',res.data.data.token);
                                localStorage.setItem('ms_role',res.data.data.role)
                                this.$router.push('/');
                            }else{
                                this.$message.error(res.data.message);
                                this.ruleForm.username="";
                                this.ruleForm.password="";
                                this.ruleForm.code="";
                            }

                        })
                        // localStorage.setItem('ms_username',this.ruleForm.username);
                        // this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:190px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>