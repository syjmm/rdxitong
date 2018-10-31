<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>代表列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        @change="getTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="代表名称/联系方式" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="add">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="avatar" label="头像"  width="190" align="center">
                    <template slot-scope="scope">
                        <img :src="GLOBAL.BASE_URL+scope.row.avatar" style="width:80px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="160" align="center">
                </el-table-column>
                <el-table-column prop="gender" label="性别"  width="160" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.gender == '1'">男</div>
                        <div v-if="scope.row.gender == '0'">女</div>
                    </template>
                </el-table-column>

                <el-table-column prop="mobile" label="联系方式" width="160" align="center">
                </el-table-column>
                <el-table-column prop="birthday" label="出生日期" width="160" align="center">
                </el-table-column>
                <el-table-column prop="group" label="所属小组" width="160" align="center">
                </el-table-column>

                <!--<el-table-column prop="status" label="履职状态"  align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div v-if="scope.row.status == '0'">本届</div>-->
                        <!--<div v-if="scope.row.status == '1'">往届</div>-->
                        <!--<div v-if="scope.row.status == '-1'">其他</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="status" label="履职状态" width="130" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.status" placeholder="请选择" @change="status(scope.row,scope.row.status)">
                            <el-option label="本届" :value="0"></el-option>
                            <el-option label="往届" :value="1"></el-option>
                            <el-option label="其他" :value="-1"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="任职职位"  align="center">
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">

                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                        <!--<el-button size="small"  @click="handleSign(scope.$index, scope.row)">履职登记</el-button>-->

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>

        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="seedata" label-width="120px">


                <el-form-item label="代表正面照：">
                    <div>
                        <img :src="GLOBAL.BASE_URL+ seedata.avatar" style="width:80px;height: 100px;" >
                    </div>
                </el-form-item>
                <el-form-item label="代表名称：">
                    <div>{{seedata.name}}</div>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <div>{{seedata.mobile}}</div>
                </el-form-item>
                <el-form-item label="出生日期：">
                    <div>{{seedata.birthday}}</div>
                </el-form-item>
                <el-form-item label="性别：">
                    <div v-if="seedata.gender == '1'">男</div>
                    <div v-if="seedata.gender == '0'">女</div>
                </el-form-item>

                <el-form-item label="履职状态：">
                    <div v-if="seedata.status == '1'">往届</div>
                    <div v-if="seedata.status == '0'">本届</div>
                    <div v-if="seedata.status == '-1'">其他</div>
                </el-form-item>
                <el-form-item label="备注：">
                    <div>{{seedata.comment}}</div>
                </el-form-item>
                <!--<el-form-item label="代表履职记录：">-->
                    <!--<el-button type="success" @click="watch(seedata.uid)">查看</el-button>-->

                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加备注" :visible.sync="editVisible2" width="50%">
            <el-form ref="form"  :model="form" :rules="rules" label-width="100px">
                <el-form-item label="备注：" prop="desc">
                    <el-input type="textarea" v-model="form.desc" :maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel1">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </span>
        </el-dialog>
        <!--<el-dialog title="查看" :visible.sync="editVisible2" width="50%">-->
            <!--<el-form ref="form"  label-width="120px">-->
                <!--<div v-for="item in watchdata" style="border:1px solid #f2f2f2;border-radius: 20px;margin-top: 10px;">-->
                    <!--<el-form-item label="会议标题：">-->
                        <!--<div>{{item.title}}</div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="会议时间：">-->
                        <!--<div>{{item.workAt}}</div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="会议内容：">-->
                        <!--<div>{{item.content}}</div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="">-->
                        <!--<el-button type="primary" @click="update(item.uid)">编辑</el-button>-->
                        <!--<el-button type="danger" @click="del(item.uid)">删除</el-button>-->
                    <!--</el-form-item>-->
                <!--</div>-->
            <!--</el-form>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button type="primary" @click="editVisible2 = false">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->

    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据
                tableData: [],
                watchdata:[],
                cur_page: 1,
                totalPages:0,
                multipleSelection: [],
                select_word: '',
                seedata:'',
                starttime:"",
                endtime:"",
                eid:'',
                sid:'',
                zid:"",
                upstatus:"",
                del_list: [],
                is_search: false,
                editVisible: false,
                editVisible2:false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: '',
                    desc:"",
                },
                rules:{
                    desc :[{required: true, message: '请选择履职备注', trigger: 'blur'}],
                },
                idx: -1
            }
        },
        created() {
            this.getData();


        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }

                })
            }
        },
        methods: {
            //查看履职纪录
            // watch(id){
            //     let token = localStorage.getItem('ms_token');
            //     this.editVisible = false;
            //     this.$axios.get('/manager/npc_members/experiences',{
            //         headers: {
            //             'Authorization':token,
            //         },
            //         params:{member:id}}).then(res=>{
            //
            //         this.watchdata = res.data.data.content;
            //         if(this.watchdata){
            //             this.editVisible2 = true;
            //         }else{
            //             this.$message.success('没有相关的履职记录，请先登记')
            //         }
            //     })
            // },
            //修改履职纪录
            // update(id){
            //     this.$router.push({path:"/ubform",query:{uid:id}})
            // },
            del(id){
                let token = localStorage.getItem('ms_token');
                var param = {uid:id};
                this.$axios.delete('/manager/npc_members/experiences',{
                    headers: {
                        'Authorization':token,
                    },
                    params:param}).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('删除成功')
                        this.getData();
                        this.editVisible2 = false;
                    }

                })
            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_members', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{page: this.cur_page}}).then((res) => {
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;

                })
            },
            status(row,val){
                this.upstatus =val;
                this.msg=row;
                this.sid=this.msg.uid;
                if(this.upstatus == '-1'){
                    this.editVisible2 = true;
                }
                let token = localStorage.getItem('ms_token');

                if(this.upstatus == '0'||this.upstatus == '1'){
                    this.$axios.post("/manager/npc_members/status", ({
                            uid: this.sid,
                            status: this.upstatus,

                        }),
                        {
                            headers: {
                                'Authorization': token,
                            }
                        }).then(res => {
                        if (res.data.status == "OK") {
                            this.$message.success("修改状态成功")
                            this.getData();
                        }
                    })
                }


            },
            cancel1(){
                this.editVisible2 = false;
                this.getData();
            },
            save(formName){
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/npc_members/status',
                            ({
                                uid: this.sid,
                                status: this.upstatus,
                                comment: this.form.desc
                            }),
                            {
                                headers: {
                                    'Authorization': token,
                                }
                            }).then(res => {
                            console.log(res.data.status)
                            if (res.data.status == 'OK') {
                                this.editVisible2 = false;
                                this.getData();
                                this.$message.success('修改状态成功')
                            }
                        })
                    }})
            },
            getTime(val){
                if(val == null){
                    this.starttime="";
                    this.endtime="";
                    return;
                }
                this.form.time=val;
                this.starttime = val[0];
                this.endtime = val[1];
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_members', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {startAt:this.starttime,endAt:this.endtime,searchKey:this.select_word}}).then(res=>{
                    console.log(res.data.status)
                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })
            },
            add(){
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_members/uid',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    this.uid=res.data.data.uid;
                    this.$router.push({path:'/rform',query:{uid:this.uid}})
                })
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.msg=row;
                this.eid=this.msg.uid;
                this.$router.push({path:'/rupdataform',query:{uid:this.eid}});
            },
            handleSee(index,row){
                this.idx = index;
                this.editVisible = true;
                this.seedata=row;//每一条数据的记录
            },
            handleSign(index,row){
                this.msg=row;
                this.zid=this.msg.uid;
                this.$router.push({path:'/sbform',query:{uid:this.zid}});
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
