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
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="add">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="createAt" label="工作发布时间"  width="200" align="center">
                </el-table-column>
                <el-table-column prop="title" label="工作标题" width="200" align="center">
                </el-table-column>
                <el-table-column prop="endAt" label="完成工作截至时间" width="200" align="center">
                </el-table-column>
                <el-table-column prop="published" label="是否发布" width="200" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.published == true">已发布</div>
                        <div v-if="scope.row.published == false">未发布</div>
                    </template>
                </el-table-column>
                <el-table-column prop="pass" label="是否通过" width="200" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.audit == '0'">未提交审核</div>
                        <div v-if="scope.row.audit == '-1'">审核失败</div>
                        <div v-if="scope.row.audit == '1'">审核中</div>
                        <div v-if="scope.row.audit == '2'">审核成功</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="审核详情" align="center">
                </el-table-column>
                <el-table-column label="操作" width="350" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" v-if="scope.row.published == false&&scope.row.audit == '2'" @click="handlepublish(scope.$index, scope.row)">发布</el-button>
                        <el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" v-if="scope.row.audit == '0' || scope.row.audit == '-1'" type="success" @click="handleShenhe(scope.$index, scope.row)">提交审核</el-button>
                        <el-button size="small" v-if="scope.row.audit == '0' || scope.row.audit == '-1'" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" v-if="scope.row.audit == '0' || scope.row.audit == '-1'" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <el-form ref="form" :model="seedata" label-width="150px">

                <el-form-item label="工作标题：">
                    <div>{{seedata.title}}</div>
                </el-form-item>
                <el-form-item label="工作内容：" width="50%">
                    <div v-html="seedata.content" style="width:90%;"></div>
                </el-form-item>
                <el-form-item label="完成工作截止时间：">
                    <div>{{seedata.endAt}}</div>
                </el-form-item>
                <el-form-item label="是否发布：">
                    <div v-if="seedata.published == true">是</div>
                    <div v-if="seedata.published == false">否</div>
                </el-form-item>
                <el-form-item label="工作备注：" width="50%">
                    <div v-html="seedata.remarks" style="width:90%;"></div>
                    <el-button type="primary" v-show="editVisible3" @click="watch(seedata.uid)">添加备注</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加备注" :visible.sync="editVisible2" width="50%">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="工作备注：">
                    <el-input type="textarea" v-model="desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据
                uid:"",//返回新闻id
                pid:"",//存放发布新闻的id
                seedata:"",
                desc:"",
                rid:"",
                tid:"",
                editVisible3:false,
                updatarr:"",//存放修改数据
                totalPages:0,
                cur_page: 1,
                starttime:"",
                endtime:"",
                multipleSelection: [],
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                editVisible2:false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    time:''
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
            watch(id){
                this.editVisible = false;
                this.editVisible2 = true;
                this.rid = id;
            },
            save(){
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/jobs/remarks',
                qs.stringify({
                    content:this.desc,
                    job:this.rid
                }),{
                        headers: {
                            'Authorization':token,
                        }
                    }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('添加成功');
                        this.getData();
                        this.editVisible2 = false;
                    }else{
                        this.$message.error('添加失败，请重试');
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
                this.$axios.get('/manager/jobs', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{page: this.cur_page}

                }).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;
                })
            },
            getTime(val){
                console.log(val)
                this.form.time=val;
                this.starttime = val[0];
                this.endtime = val[1];
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/jobs', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {startAt:this.starttime,endAt:this.endtime,searchKey:this.select_word}}).then(res=>{
                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })

            },

            add(){
                this.$router.push({path:'/mform'})
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleShenhe(index,row){
                let token = localStorage.getItem('ms_token');
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.tid= this.msg.uid;
                this.$axios.post('/manager/jobs/to_audit',
                    qs.stringify({
                        uid:this.tid
                    }),
                    {
                        headers: {
                            'Authorization':token,
                        },
                    }).then(res=>{
                    console.log(res.data.status)
                    if(res.data.status == 'OK'){
                        this.$message.success('提交成功');
                        this.getData();
                    }else{
                        this.$message.error('提交失败');
                    }

                })
            },
            handlepublish(index,row){
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.pid=this.msg.uid;

                let token = localStorage.getItem('ms_token');
                this.$axios.put('/manager/jobs/publish',
                qs.stringify({
                    uid:this.pid
                }),
                    {
                        headers: {
                            'Authorization':token,
                        }
                    }).then(res=>{
                    console.log(res.data.status)
                    if(res.data.status == 'OK'){
                        this.$message.success('工作发布成功');
                        this.getData();
                    }else{
                        this.$message.error('工作正在审核中，请等待');
                    }

                })
            },
            handleSee(index,row){
                this.idx = index;
                this.editVisible = true;
                this.seedata=row;//每一条数据的记录
                if(!this.seedata.remarks){
                    this.editVisible3 = true;
                }else{
                    this.editVisible3 = false;
                }
            },
            handleEdit(index, row) {
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.updatarr=this.msg.uid;//把单行修改的每条数据的id添加进放修改数据的数组
                this.$router.push({path:'/mupdataform',query:{uid:this.updatarr}});
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.msg=row;//每一条数据的记录
                this.delarr=this.msg.uid;//把单行删除的每条数据的id添加进放删除数据的数组
                console.log(this.delarr)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                let token = localStorage.getItem('ms_token');
                var param={uid:this.delarr}
                this.$axios.delete("/manager/jobs",{
                    headers: {
                        'Authorization':token,
                    },
                    params: param
                }).then(res=>{
                    console.log(res.data)
                    if(res.data.status=="OK"){
                        this.getData();
                        this.$message.success('删除成功')
                    }

                }).catch(error=>{
                    console.log(error);
                    this.$message.error('删除失败')
                })
                this.delVisible = false;//关闭删除提示模态框

            }
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
