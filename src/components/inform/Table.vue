<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 新闻列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        @change="getTime"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="createAt" label="创建时间"  width="150" align="center">
                </el-table-column>
                <el-table-column prop="title" label="公告标题" width="150" align="center">
                </el-table-column>
                <el-table-column prop="published" label="是否发布" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.published == true">是</div>
                        <div v-if="scope.row.published == false">否</div>
                    </template>
                </el-table-column>
                <el-table-column prop="publishAt" label="发布时间" width="150" align="center">
                </el-table-column>
                <el-table-column prop="published" label="是否通过" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.audit == '0'">未提交审核</div>
                        <div v-if="scope.row.audit == '-1'">审核失败</div>
                        <div v-if="scope.row.audit == '1'">审核中</div>
                        <div v-if="scope.row.audit == '2'">审核成功</div>
                    </template>
                </el-table-column>
                <el-table-column prop="receivers" label="接收人员" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.receivers">{{item.name}}</div>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="content" label="公告内容" align="center">-->
                <!--</el-table-column>-->
                <el-table-column prop="reason" label="审核详情" align="center">
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" v-if="scope.row.audit == '1'" @click="shenhe(scope.$index, scope.row)">审核通过</el-button>
                        <el-button size="small" type="danger" v-if="scope.row.audit == '1'" @click="handleEdit(scope.$index, scope.row)">审核不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>
        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="editVisible1" width="50%">
            <el-form ref="form" :model="seedata" label-width="100px">
                <el-form-item label="创建日期：">
                    <div>{{seedata.createAt}}</div>
                </el-form-item>
                <el-form-item label="公告标题：">
                    <div>{{seedata.title}}</div>
                </el-form-item>
                <el-form-item label="接收人员：" width="50%">
                    <div v-for="item in seedata.receivers">{{item.name}}</div>
                </el-form-item>
                <el-form-item label="公告内容：">
                    <div style="width: 80%;">{{seedata.content}}</div>
                </el-form-item>
                <el-form-item label="是否发布：">
                    <div v-if="seedata.published == true">是</div>
                    <div v-if="seedata.published == false">否</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="审核不通过" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="审核人" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="审核不通过原因" prop="desc">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: 'table',
        data() {
            return {

                tableData: [],
                cur_page: 1,
                totalPages:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                pass:false,
                msg:"",
                sid:"",
                fid:"",
                starttime:"",
                endtime:"",
                is_search: false,
                editVisible: false,
                editVisible1:false,
                seedata:"",
                delVisible: false,
                form: {
                    name: '',
                    desc:'',
                },
                rules:{
                    name :[{required: true, message: '请输入审核人', trigger: 'blur'}],
                    desc :[{required: true, message: '请输入审核内容', trigger: 'blur'}],
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/notifications', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{ page: this.cur_page}
                }).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;
                    console.log(res.data.data.totalPages*10)
                })
            },
            getTime(val){
                this.form.time=val;
                this.starttime = val[0];
                this.endtime = val[1];
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/notifications', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {startAt:this.starttime,endAt:this.endtime,searchKey:this.select_word}}).then(res=>{

                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })
            },

            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleSee(index,row){
                this.idx = index;
                this.editVisible1 = true;
                this.seedata=row;//每一条数据的记录
            },
            shenhe(index, row){
                this.msg=row;
                this.sid=this.msg.uid;
                this.pass=true;
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/notifications/audit',
                qs.stringify({
                    pass:this.pass,
                    uid:this.sid
                }),
                {
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    this.$message.success('审核通过');
                    this.getData()
                })

            },
            handleEdit(index, row) {
                this.idx = index;
                this.editVisible = true;
                this.msg=row;
                this.fid=this.msg.uid;

            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(formName) {


                this.pass=false;
                let token = localStorage.getItem('ms_token');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/manager/notifications/audit',
                            qs.stringify({
                                pass: this.pass,
                                uid: this.fid,
                                reason: this.form.desc
                            }),
                            {
                                headers: {
                                    'Authorization': token,
                                }
                            }).then(res => {
                            this.$message.success('提交成功');
                            this.editVisible = false;
                            this.getData()
                        })
                    }})

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
