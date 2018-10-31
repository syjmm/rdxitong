<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 代表建议列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        @change="getTime"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="提出代表" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <!--<el-button type="primary"  @click="add">新增</el-button>-->
                <a href="/api/manager/suggestions/export"><el-button type="success">导出</el-button></a>

            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="sendAt" label="提出时间"  width="200" align="center">
                </el-table-column>
                <el-table-column prop="sender" label="提出代表" width="200" align="center">
                </el-table-column>
                <el-table-column prop="receiver" label="接收代表"  width="240" align="center">
                </el-table-column>
                <el-table-column prop="receiverGroup" label="接收代表所属小组"  width="200" align="center">
                </el-table-column>
                <el-table-column prop="receiverMobile" label="接收代表联系方式"   align="center">
                </el-table-column>
                <el-table-column prop="replied" label="是否回复" width="240" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.replied == true">是</div>
                        <div v-if="scope.row.replied == false">否</div>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="status" label="建议状态" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div v-if="scope.row.status == '1'">已处理</div>-->
                        <!--<div v-if="scope.row.status == '0' || scope.row.status == '-1'">未处理</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                        <!--<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>
        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="editVisible" width="50%" >
            <el-form ref="form" :model="seedata" label-width="100px">
                <el-form-item label="提出时间：">
                    <div>{{seedata.sendAt}}</div>
                </el-form-item>
                <el-form-item label="提出代表：">
                    <div>{{seedata.sender}}</div>
                </el-form-item>
                <el-form-item label="接收代表：" width="50%">
                    <div>{{seedata.receiver}}</div>
                </el-form-item>
                <el-form-item label="是否回复：">
                    <div v-if="seedata.replied == true">是</div>
                    <div v-if="seedata.replied == false">否</div>
                </el-form-item>
                <el-form-item label="建议内容：" width="50%">
                    <div>{{seedata.content}}</div>
                </el-form-item>
                <el-form-item label="相关回复：" width="50%">
                    <div v-for="(item,index) in seedata.replies" style="">
                        <div>第{{index + 1}}条回复</div>
                        <div style="width:600px;border:1px solid #f5f5f5;padding: 10px;">
                            <div>回复时间:{{item.createAt}}</div>
                            <div>回复内容:{{item.reply}}</div>
                            <div>回复人:{{item.replyer}}</div>
                        </div>

                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
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
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                totalPages:0,
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据，
                pid:'',
                starttime:"",
                endtime:"",
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                seedata:{},
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
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
                this.$axios.get('/manager/suggestions', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{page: this.cur_page}}).then((res) => {
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;
                })
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
                this.$axios.get('/manager/suggestions', {
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
                this.$router.push("/sform")
            },


            filterTag(value, row) {
                return row.tag === value;
            },
            handleSee(index,row){
                this.idx = index;
                this.editVisible = true;
                this.seedata=row;//每一条数据的记录
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.msg=row;//每一条数据的记录
                this.delarr=this.msg.uid;//把单行删除的每条数据的id添加进放删除数据的数组
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 确定删除
            deleteRow(){
                let token = localStorage.getItem('ms_token');
                // this.tableData.splice(this.idx, 1);
                var param={uid:this.delarr}
                this.$axios.delete("/manager/suggestions",{
                    headers: {
                        'Authorization':token,
                    },
                    params: param}).then(res=>{
                    if(res.data.status == "OK"){
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
