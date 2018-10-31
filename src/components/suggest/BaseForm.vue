<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>建议</el-breadcrumb-item>
                <el-breadcrumb-item>添加建议</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="提出建议代表" prop="name">
                        <el-select v-model="form.name" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid"
                                    >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建议内容" prop="desc">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="建议提出时间">
                        <el-date-picker
                                v-model="form.time"
                                type="datetime"
                                @change="getTime"
                                :picker-options="pickerOptions0"
                                value-format="yyyy-MM-dd HH:mm"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="建议接收人">
                        <el-select v-model="form.rename" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid"
                            >
                            </el-option>
                        </el-select>
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
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                form: {
                    name: '',
                    desc:'',
                    rename:'',
                    time:''
                },
                rules:{
                    name :[{required: true, message: '请输入选择建议代表', trigger: 'blur'}],
                    desc :[{required: true, message: '请输入建议内容', trigger: 'blur'}],
                }
            }
        },
        created(){
            let token = localStorage.getItem('ms_token');
            this.$axios.get('/manager/npc_members/working',{
                headers: {
                    'Authorization':token,
                }
            }).then(res=>{
                this.options=res.data.data;
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
                        this.$axios.post('/manager/suggestions',
                            qs.stringify({
                                content: this.form.desc,
                                receiver: this.form.rename,
                                sendAt: this.form.time,
                                sender: this.form.name
                            }),
                            {
                                headers: {
                                    'Authorization':token,
                                }
                            }).then(res => {
                            // console.log(res)
                            if (res.data.status == 'OK') {
                                this.$message.success('提交成功！');
                                this.$router.push({path: '/stable'})
                            } else {
                                this.$message.success('提交失败！');
                            }
                        })
                    }})

            },
            cancel(){
                this.$router.push({path:'/stable'})
            }
        }
    }
</script>
<style scoped>
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