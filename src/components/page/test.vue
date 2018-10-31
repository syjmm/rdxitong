<template>
    <quill-editor ref="myTextEditor"
                  v-model="content"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)">

    </quill-editor>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import  { Quill } from 'vue-quill-editor'
    import { ImageDrop } from 'quill-image-drop-module'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)
    import {quillRedefine} from 'vue-quill-editor-upload'

    export default {
        name: "test",
        data() {
            return {

                content: ``,
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
                }
            }
        },
        components:{
            quillEditor
        },
        // created () {
        //
        //     this.editorOption = quillRedefine(
        //         {
        //             // 图片上传的设置
        //             uploadConfig: {
        //                 action:  'https://www.cdkhd.com:8443/api/manager/news/upload',  // 必填参数 图片上传地址
        //                 // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        //                 // 你必须把返回的数据中所包含的图片地址 return 回去
        //                 name:"file",
        //                 res: (respnse) => {
        //                     // console.log(respnse.data.url)
        //                     return 'https://www.cdkhd.com:8443' + respnse.data.url  // 这里切记要return回你的图片地址
        //                 },
        //                 header: (xhr, formData) => {
        //                     formData.append('uid', 1111)
        //
        //                 },
        //             }
        //         }
        //     )
        //     // console.log(this.editorOption)
        // },
        mounted(){
            return this.content
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            onEditorBlur(editor) {
                // console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                // console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                // console.log('editor ready!', editor)
            }
        }
    }
</script>

<style scoped>

</style>