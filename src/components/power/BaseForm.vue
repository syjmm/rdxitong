<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>特殊职能设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">


            <div class="form-box" style="width: 70%">
                <el-form ref="form" :model="form" label-width="210px">
                    <!--<el-form-item label="设置后台管理人员" prop="gourp">-->
                        <!--<el-cascader-->
                                <!--:options="options"-->
                                <!--v-model="selectedOptions"-->
                                <!--@change="handleChange">-->
                        <!--</el-cascader>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="设置建议接收人员：" prop="gourp">-->
                        <!--<el-cascader-->
                                <!--:options="options"-->
                                <!--v-model="selectedOptions"-->
                                <!--@change="handleChange">-->
                        <!--</el-cascader>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="设置人大代表小组长" prop="gourp">-->
                        <!--<el-cascader-->
                                <!--:options="options"-->
                                <!--v-model="selectedOptions"-->
                                <!--@change="handleChange">-->
                        <!--</el-cascader>-->
                    <!--</el-form-item>-->
                    <el-form-item label="设置通知审核人员：" prop="gourp">
                        <el-cascader
                                :options="options"
                                v-model="selectedOptions2"
                                @change="handleChange2">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="设置新闻发布审核人员：" prop="gourp">
                        <el-cascader
                                :options="options"
                                v-model="selectedOptions1"
                                @change="handleChange1">
                        </el-cascader>
                    </el-form-item>

                    <el-form-item label="设置履职登记审核人员总审核：" prop="gourp">
                        <el-cascader
                                :options="options"
                                v-model="selectedOptions3"
                                @change="handleChange3">
                        </el-cascader>
                    </el-form-item>

                    <el-form-item label="设置履职登记审核人员：" prop="gourp">
                        <div  style="margin-bottom: 5px;">
                            <el-button type="primary" v-for="(item,index) in role" :key="item.uid" style="margin-bottom: 20px;" @click="group(item.uid,item.name,index)">设置{{item.name}}</el-button>
                        </div>
                        <div v-for="item in groups" style="width: 150px !important;">{{item.name}}为
                            <span v-if="item.auditor_name">{{item.auditor_name}} </span>
                            <span v-else>未设置</span>
                        </div>


                    </el-form-item>


                </el-form>
                <div style="width:100%;height: 200px"></div>
            </div>
            <!-- 设置小组人员弹出框 -->
            <el-dialog title="添加小组工作站" :visible.sync="editVisible2" width="20%">
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="所属代表小组：">
                        <div>{{groupname}}</div>
                    </el-form-item>
                    <el-form-item label="具体人员">
                        <el-select v-model="fwork" placeholder="请选择">
                            <el-option
                                    v-for="item in optionss"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                form:{},
                role:[],
                options:[],
                optionss:[],
                fwork:"",
                gid:"",
                groups:[],
                groupname:"",
                selectedOptions: [],
                selectedOptions1:[],
                selectedOptions2:[],
                selectedOptions3:[],
                roles:[],
                uid:"",
                box:false,
                editVisible2:false,
            }
        },
        created() {

            let token = localStorage.getItem('ms_token');
            this.getdata();
            this.$axios.get('/manager/npc_member_groups/all', {
                headers: {
                    'Authorization':token,
                }}).then((res) => {
                this.role = res.data.data;

            })
            this.$axios.get('/manager/npc_member_groups/group_member', {
                headers: {
                    'Authorization':token,
                }}).then((res) => {
                this.options = res.data.data;

            })
        },
        methods: {
            getdata(){
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/system_setting', {
                    headers: {
                        'Authorization':token,
                    }}).then((res) => {
                    this.selectedOptions = res.data.data.advice_receiver;
                    this.selectedOptions1 = res.data.data.news_auditor;
                    this.selectedOptions2 = res.data.data.notification_auditor;
                    this.selectedOptions3 = res.data.data.notification_auditor_manager;
                    this.groups = res.data.data.groups;

                });

            },
            handleChange(value) {
                this.uid = value[1];
                this.mm()
            },
            handleChange1(value) {

                this.uid = value[1];
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/system_setting/news_auditor',

                    qs.stringify({
                        uid:this.uid
                    }),{
                        headers: {
                            'Authorization':token,
                        }
                    }).then((res) => {
                    if (res.data.status == 'OK') {
                        this.$message.success('授权成功！');

                    }


                });
            },
            handleChange2(value) {

                this.uid = value[1];
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/system_setting/notification_auditor',

                    qs.stringify({
                        uid:this.uid
                    }),{
                        headers: {
                            'Authorization':token,
                        }
                    }).then((res) => {
                    if (res.data.status == 'OK') {
                        this.$message.success('授权成功！');

                    }


                });
                this.fwork="";
            },
            handleChange3(value) {
                console.log(value[1])
                this.uid = value[1];
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/system_setting/performance_auditor_manager',

                    qs.stringify({
                        uid:this.uid
                    }),
                    {
                        headers: {
                            'Authorization':token,
                        }
                    }).then((res) => {
                    if (res.data.status == 'OK') {
                        this.$message.success('授权成功！');

                    }


                });
            },
            mm(){
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/system_setting/advice_receiver',
                    qs.stringify({
                        uid:this.uid
                    }),
                    {
                        headers: {
                            'Authorization':token,
                        }
                    }).then((res) => {
                    if (res.data.status == 'OK') {
                        this.$message.success('授权成功！');

                    }
                    });
            },

            group(id,name,index){
                this.editVisible2 = true;
                this.groupname = name;
                this.gid = id;
                console.log(index)
                this.$axios.get('/manager/system_setting', {
                    headers: {
                        'Authorization':token,
                    }}).then((res) => {
                    for(let i= 0;i<this.groups.length;i++){
                        if(index == i){
                                this.fwork=this.groups[i].auditor_uid;
                        }
                    }

                });
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_member_groups/npcmembers', {
                    headers: {
                        'Authorization':token,
                    },
                params:{
                    groupId:id
                }}).then((res) => {
                    this.optionss = res.data.data;




                })
            },
            save(name){
                var that = this;
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/system_setting/performance_group_auditor',
                    qs.stringify({
                        group:that.gid,
                        uid:that.fwork
                    }),{
                        headers: {
                            'Authorization':token,
                        }
                    }).then(res=>{
                    if(res.data.status == 'OK'){
                        that.editVisible2 = false;
                        that.$message.success('授权成功');
                        that.fgroup = "";
                        that.fwork = "";
                        this.getdata();


                    }
                });

            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
