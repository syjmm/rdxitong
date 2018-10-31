<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>新闻</el-breadcrumb-item>
                <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width:80%">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
                    <el-input v-model="uid" type="text"  style="display: none"></el-input>
                    <el-form-item label="新闻标题" prop="name" >
                        <el-input v-model="ruleForm.name" style="width: 20% !important;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="新闻封面" prop="imgSrc">
                        <div v-show="imgVisible">
                            <img :src="GLOBAL.BASE_URL + ruleForm.imgSrc" style="width:300px;height: 200px">
                        </div>
                        <div class="el-upload__tip">只能上传jpg/png文件</div>
                        <el-upload
                                class="upload-demo"
                                action=""
                                :before-upload="beforeUpload"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                :auto-upload="true"
                                v-show="anniu">
                            <el-button size="small" type="primary" v-show="anniu">点击上传</el-button>



                        </el-upload>
                        <div  v-show="anniu1">正在上传</div>
                        <div class="anniu" v-show="anniu" @click="clears">清空</div>


                    </el-form-item>
                    <el-form-item label="新闻分类" prop="type">
                        <el-select v-model="ruleForm.type" default-first-option placeholder="请选择">
                            <el-option
                                    :value="1"
                                    label="人大要闻"
                            >
                            </el-option>
                            <el-option
                                    :value="2"
                                    label="主要活动"
                            >
                            </el-option>
                            <el-option
                                    :value="3"
                                    label=" 重要会议"
                            >
                            </el-option>
                            <el-option
                                    :value="4"
                                    label=" 党委相关新闻"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="新闻内容" prop="content">
                        <quill-editor ref="myTextEditor"
                                      v-model="ruleForm.content"
                                      :options="editorOption"
                                      @blur="onEditorBlur($event)"
                                      @focus="onEditorFocus($event)"
                                      @ready="onEditorReady($event)">

                        </quill-editor>
                        <!--<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>-->
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import qs from 'qs'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillRedefine} from 'vue-quill-editor-upload'
    import { quillEditor } from 'vue-quill-editor';
    import  { Quill } from 'vue-quill-editor'
    // import { ImageDrop } from 'quill-image-drop-module'
    // import ImageResize from 'quill-image-resize-module'
    // Quill.register('modules/imageDrop', ImageDrop)
    // Quill.register('modules/imageResize', ImageResize)

    export default {
        name: 'baseform',
        data: function(){
            return {
                uid:'',
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        history: {
                            delay: 1000,
                            maxStack: 50,
                            userOnly: false
                        },
                        imageDrop: true,
                        imageResize: {


                        }
                    }
                },
                imgVisible:false,
                dialogVisible: false,
                name:'',
                imageUrl: '',
                imgsrc:"",
                anniu1:false,
                anniu:true,
                imports:"",
                ruleForm: {
                    name: '',
                    imgSrc:'',
                    content: '',
                    desc: '',
                    type:'',
                    options: []
                },
                rules:{
                    name :[{required: true, message: '请输入新闻标题', trigger: 'blur'}],
                    imgSrc:[{required: true, message: '请上传新闻封面图', trigger: 'blur'}],
                    type:[{required: true, message: '请选择新闻类型', trigger: 'blur'}],
                    content:[{required: true, message: '请输入新闻内容', trigger: 'blur'}],
                }
            }
        },
        components: {

            quillEditor,
            quillRedefine
        },
        created () {
            this.uid=this.$route.query.uid;
            let token = localStorage.getItem('ms_token');
            this.editorOption = quillRedefine(
                {
                    // 图片上传的设置
                    uploadConfig: {
                        action:  this.GLOBAL.BASE_URL+'/api/manager/news/upload',  // 必填参数 图片上传地址
                        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
                        // 你必须把返回的数据中所包含的图片地址 return 回去
                        name:"file",
                        res: (respnse) => {
                            // console.log(respnse.data.url)
                            return this.GLOBAL.BASE_URL + respnse.data.url  // 这里切记要return回你的图片地址
                        },
                        header: (xhr, formData) => {
                            xhr.setRequestHeader('Authorization',token);
                            formData.append('uid', this.uid)
                        },
                    }
                }
            )
            // console.log(this.editorOption)
        },
        methods: {
            clears(){
                this.imgVisible = false;
                this.form.imgSrc = "";
            },
            onEditorBlur(editor) {
                // console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                // console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                // console.log('editor ready!', editor)
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
                this.$axios.post('/manager/news/upload',fd,
                    { headers: {
                        'Authorization':token,
                    }
                    }).then(function(res){
                        if(res.data.status == 'OK'){
                            that.ruleForm.imgSrc=res.data.data.url;
                            that.$message.success('上传成功！');
                            that.anniu = true;
                            that.anniu1 = false;
                        }else{
                            that.$message.error('只允许上传jpg/png格式的图片！');
                            that.imgVisible = false;
                            that.anniu = true;
                            that.anniu1 = false;
                        }


                })
                this.imgVisible = true;
            },
            newSubmitForm(){//确定上传
                this.$refs.newupload.submit();
            },
            onSubmit(formName) {
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/news',
                            qs.stringify({
                                content: this.ruleForm.content,
                                cover: this.ruleForm.imgSrc,
                                title: this.ruleForm.name,
                                type:this.ruleForm.type,
                                uid:this.uid
                            }),
                            { headers: {
                                    'Authorization':token,
                                }
                            }
                        ).then((res) => {
                            this.$message.success('提交成功！');
                            this.$router.push({path:"/table"})
                        })
                    }
                })


            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            cancel(){
                this.$router.push({path:"/table"})
            }
        }
    }
</script>
<style>
    .el-upload__tip{
        margin-top: -7px !important;
    }
    .upload-demo .el-upload--text {
        width: 80px !important;
        height: 33px !important;
        border:none !important;
        background: transparent !important;
    }
    .upload-demo .el-upload {
        width: 80px !important;
        height: 33px !important;
        border:none !important;
        background: transparent !important;
    }
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
        margin-top: -43px;
        margin-left: 110px;
        cursor: pointer;
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