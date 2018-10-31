<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>账号列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="用户名称/联系方式/微信" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="createAt" label="创建时间"  width="230" align="center">
                </el-table-column>
                <el-table-column prop="username" label="用户名称" width="230" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="联系方式" width="230" align="center">
                </el-table-column>
                <el-table-column prop="weichat" label="微信" width="230" align="center">
                </el-table-column>
                <el-table-column prop="disabled" label="是否可用" width="230" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.disabled == true">不可用</div>
                        <div v-if="scope.row.disabled == false">可用</div>
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="用户角色" align="center">
                </el-table-column>
                <!--<el-table-column label="操作" width="150" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="small" type="success" v-if="scope.row.disabled == true&&scope.row.canDisabled == true" @click="handleSee(scope.$index, scope.row)">启用</el-button>-->
                        <!--<el-button size="small" type="danger" v-if="scope.row.disabled == false&&scope.row.canDisabled == true" @click="handleDelete(scope.$index, scope.row)">禁用</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>


        <!-- 删除提示框 -->
        <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
            <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="delVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="deleteRow">确 定</el-button>-->
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
                tableData: [],
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据
                uid:"",//返回新闻id
                pid:"",//存放发布新闻的id
                sid:'',
                seedata:"",
                updatarr:"",//存放修改数据
                totalPages:0,
                cur_page: 1,
                multipleSelection: [],
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    time:''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
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
                this.$axios.get('/manager/account', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{page: this.cur_page}}).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;
                    console.log(res.data.data.totalPages*10)
                })
            },
            getTime(val){

                this.form.time=val;
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/account', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {searchKey:this.select_word}}).then(res=>{
                    console.log(res.data.status)
                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })

            },


            filterTag(value, row) {
                return row.tag === value;
            },
            handleSee(index,row){
                let token = localStorage.getItem('ms_token');
                this.idx = index;
                this.seedata=row;//每一条数据的记录
                this.sid = this.seedata.uid;
                this.$axios.put('/manager/account/status',
                qs.stringify({
                    uid:this.sid
                }),
                {
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('启用成功')
                        this.getData();
                    }
                }).catch(error=>{
                    this.$message.error('启用失败')
                })
            },
            handleDelete(index, row) {
                let token = localStorage.getItem('ms_token');
                this.idx = index;
                this.delVisible = true;
                this.msg=row;//每一条数据的记录
                this.delarr=this.msg.uid;//把单行删除的每条数据的id添加进放删除数据的数组
                this.$axios.put('/manager/account/status',
                    qs.stringify({
                        uid:this.delarr
                    }),
                    {
                        headers: {
                            'Authorization':token,
                        }
                    }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('禁用成功')
                        this.getData();
                    }
                }).catch(error=>{
                    this.$message.error('禁用失败')
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            // deleteRow(){
            //     // this.tableData.splice(this.idx, 1);
            //     var param={uid:this.delarr}
            //     this.$axios.delete("/manager/news",{params: param}).then(res=>{
            //         console.log(res.data)
            //         if(res.data.status=="OK"){
            //             this.getData();
            //             this.$message.success('删除成功')
            //         }
            //
            //     }).catch(error=>{
            //         console.log(error);
            //         this.$message.error('删除失败')
            //     })
            //     this.delVisible = false;//关闭删除提示模态框
            //
            // }
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
