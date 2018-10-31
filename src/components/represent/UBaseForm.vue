<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>代表</el-breadcrumb-item>
                <el-breadcrumb-item>修改代表履职纪录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="履职登记类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option
                                    :value="0"
                                    label="参加代表小组活动"
                            >
                            </el-option>
                            <el-option
                                    :value="1"
                                    label="联系选民"
                            >
                            </el-option>
                            <el-option
                                    :value="2"
                                    label="提出选民、建议、批评和意见"
                            >
                            </el-option>
                            <el-option
                                    :value="3"
                                    label="持代表证视察"
                            >
                            </el-option>
                            <el-option
                                    :value="4"
                                    label="双带或结对帮扶工作"
                            >
                            </el-option>
                            <el-option
                                    :value="5"
                                    label="为民办实事"
                            >
                            </el-option>
                            <el-option
                                    :value="6"
                                    label="闭会期间的活动"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="参加会议" prop="name">
                        <el-input type="text" v-model="form.name"></el-input>
                    </el-form-item>


                    <el-form-item label="时间" prop="time">
                        <el-date-picker
                                v-model="form.time"
                                type="date"
                                @change="getTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>


                    <el-form-item label="会议内容" prop="desc">
                        <el-input type="textarea" v-model="form.desc"></el-input>
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

    export default {
        name: 'baseform',
        data: function(){
            return {
                dialogVisible: false,
                options:[],
                optionss:[],
                imgSrc:'',
                imgVisible:false,
                form: {
                    name: '',
                    phone:'',
                    rename:'',
                    time:'',
                    sex:'',
                    status:'',
                    gourp:'',
                    desc:'',
                    role:'',
                    type:''
                },
                rules:{
                    name :[{required: true, message: '请输入参加会议标题', trigger: 'blur'}],
                    desc :[{required: true, message: '请输入会议内容', trigger: 'blur'}],
                    time :[{required: true, message: '请选择会议时间', trigger: 'blur'}],
                    type :[{required: true, message: '请选择履职登记类型', trigger: 'blur'}],
                    // role :[{required: true, message: '请选择任职职位', trigger: 'blur'}],
                    // status :[{required: true, message: '请选择履职状态', trigger: 'blur'}],
                }
            }
        },
        created(){
            this.uid=this.$route.query.uid;
            let token = localStorage.getItem('ms_token');
            this.$axios.get('/manager/roles/all',{
                headers: {
                    'Authorization':token,
                }
            }).then(res=>{
                console.log(res.data.data)
                this.optionss=res.data.data;
            })
            this.$axios.get('/manager/npc_members/experiences/details',{
                headers: {
                    'Authorization':token,
                },
                params:{uid:this.uid}}).then(res=>{
                this.form.name = res.data.data.title;
                this.form.time = res.data.data.workAt;
                this.form.desc = res.data.data.content;
                this.form.type = res.data.data.type;
            })
        },

        methods: {

            getTime(val){
                this.form.time=val;
            },
            onSubmit(formName) {
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/npc_members/experiences/update',
                            qs.stringify({
                                workAt: this.form.time,
                                content: this.form.desc,
                                title: this.form.name,
                                type:this.form.type,
                                member: this.uid
                            }),
                            {
                                headers: {
                                    'Authorization':token,
                                }
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
                    that.imgSrc=res.data.data.url;
                    console.log(res.data.data.url)
                    that.$message.success('上传成功！');
                })
                this.imgVisible = true;
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