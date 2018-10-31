<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>通知</el-breadcrumb-item>
                <el-breadcrumb-item>添加通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width:700px">
                <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                    <el-input v-model="uid" style="display: none"></el-input>
                    <el-form-item label="通知标题" prop="name">
                        <el-input v-model="form.name" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="通知内容" prop="content">
                        <el-input type="textarea" v-model="form.content" :maxlength="200"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="接收代表" prop="receivers">-->
                        <!--<div  style="margin-bottom: 5px;">-->
                            <!--<el-button type="primary" v-for="(item,index) in role":key="item.uid" style="margin-bottom: 20px;" @click="group(item.uid,item.name,index)">设置{{item.name}}</el-button>-->
                        <!--</div>-->
                    <!--</el-form-item>-->
                    <el-form-item label="接收代表" prop="receivers">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>

                        <el-checkbox-group v-model="form.receivers" @change="handleCheckedCitiesChange"v-for="item in options" :key="item.value">
                            <span style="z-index:999;font-size: 14px;" v-if="item.children.length>0">{{item.label}}：</span>
                            <el-checkbox v-for="sitem in item.children" :label="sitem.value"  :key="sitem.value">{{sitem.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="附件" >
                        <el-upload
                                v-model="form.fileList"
                                class="upload-demo"
                                action=""
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                :before-upload="beforeUpload"
                                :on-exceed="handleExceed"
                                :file-list="fileList"
                                accept=".word,.excel,.ppt,.pdf,.PPT,.PDF">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <div  class="el-upload__tip">只能上传word、excel、PPT、PDF格式的文件</div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
                <!-- 设置小组人员弹出框 -->
                <el-dialog title="添加小组工作站" :visible.sync="editVisible2" width="50%">
                    <el-form ref="form" :model="form" label-width="110px">
                        <el-form-item label="所属代表小组：">
                            <div>{{groupname}}</div>
                        </el-form-item>
                        <el-form-item label="具体人员">
                            <el-checkbox  :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="form.receivers" @change="handleCheckedCitiesChange">
                                <el-checkbox  v-for="item in optionss":label="item.uid"  :key="item.uid" >{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible2 = false">取 消</el-button>
                        <el-button type="primary" @click="save()">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>

    </div>
</template>

<script>
    import qs from 'qs'
    import {push} from "echarts";
    export default {
        name: 'baseform',
        data: function(){
            return {
                uid:'',
                options: [],
                fileList:[],
                filename:'',
                fileListname:'',
                checkAll: false,
                isIndeterminate: true,
                pp:[],
                editVisible2:false,
                gid:"",
                role:[],
                optionss:[],
                len:[],
                groupname:"",
                fwork:"",
                dialogVisible: false,
                form: {
                    desc: '',
                    name:'',
                    receivers:[],
                    content: '',
                },
                rules:{
                    name :[{required: true, message: '请输入通知公告标题', trigger: 'blur'}],
                    content :[{required: true, message: '请输入公告内容', trigger: 'blur'}],
                    receivers :[{required: true, message: '请选择接收代表', trigger: 'blur'}],
                    // fileList :[{required: true, message: '请上传附件', trigger: 'blur'}],
                }
            }
        },

        created () {
            this.uid=this.$route.query.uid;
            let token = localStorage.getItem('ms_token');
            // this.$axios.get('/manager/npc_members/working',{
            //     headers: {
            //         'Authorization':token,
            //     }
            // }).then(res=>{
            //     this.options = res.data.data;
            // });
            this.$axios.get('/manager/npc_member_groups/all', {
                headers: {
                    'Authorization':token,
                }}).then((res) => {
                this.role = res.data.data;

            });
            this.$axios.get('/manager/npc_member_groups/group_member', {
                headers: {
                    'Authorization':token,
                }}).then((res) => {
                this.options = res.data.data;
                for(var i=0;i<this.options.length;i++){
                    for(var j=0;j<this.options[i].children.length;j++){
                        this.len.push(this.options[i].children[j].value);
                    }
                }

            });

        },
        methods: {
            beforeUpload(file){
                let token = localStorage.getItem('ms_token');
                let fd = new FormData();
                fd.append('file',file);//传文件
                fd.append('uid',this.uid);//传其他参数
                let that=this;
                this.$axios.post('/manager/notifications/upload',fd,{
                    headers: {
                        'Authorization':token,
                    }
                }).then(function(res){
                    if(res.data.status == 'OK'){
                        that.fileList.push(res.data.data);
                        that.form.fileList=that.fileList;
                        that.fileListname=res.data.data.name;
                        that.$message.success('上传成功！');
                    }

                })
            },
            newSubmitForm(){//确定上传
                this.$refs.newupload.submit();
            },
            handleCheckAllChange(val) {
                if(val == true){
                    for(var i=0;i<this.options.length;i++){
                        for(var j=0;j<this.options[i].children.length;j++){

                            this.pp.push(this.options[i].children[j].value);

                        }
                    }

                    this.form.receivers =this.pp;
                    this.isIndeterminate = false;
                }else{
                    this.form.receivers=[];
                    this.pp=[];
                }
            },
            handleCheckedCitiesChange(value) {
                // console.log(value)
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.len.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.len.length;
            },
            onSubmit(formName) {
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/notifications', {
                            content: this.form.content,
                            attachments: this.form.fileList,
                            receivers: this.form.receivers,
                            title: this.form.name,
                            name:this.fileListname,
                            uid: this.uid

                        },{
                            headers: {
                                'Authorization':token,
                            }
                        }).then((res) => {
                            this.$message.success('提交成功！');
                            this.$router.push({path: "/itable"})
                        })
                    }})

            },
            group(id,name,index){

                // this.checkAll = false;
                this.groupname = name;
                this.gid = id;
                // console.log(index)

                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_member_groups/npcmembers', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{
                        groupId:id
                    }}).then((res) => {

                    this.optionss = res.data.data;
                    // console.log(this.optionss)
                    if(!this.optionss){
                        this.editVisible2=false;
                        this.$message.error("还没有小组成员，请先添加")
                    }else{
                        this.editVisible2 = true;
                    }




                })
            },
            save(){
                this.form.receivers.push()
                this.editVisible2 = false;

                console.log(this.form.receivers)
            },
            handleRemove(file, fileList) {
                // console.log(file, fileList);
                console.log(fileList)
                this.fileList = fileList;
                this.form.fileList = fileList;
                // this.fileList.pop(file, fileList)
            },
            handlePreview(file) {
                // console.log(file);
            },
            handleExceed(files, fileList) {

            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            cancel(){
                this.$router.push({path:"/itable"})
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
</style>