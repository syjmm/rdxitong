<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 法律法规列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="法律法规标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="add">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="cover" label="法律法规封面图"  width="200" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" style="width:80px;height: 100px;">
                    </template>
                </el-table-column>

                <el-table-column prop="title" label="法律法规标题" align="center">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/legals', {
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

                this.form.time=val;
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/legals', {
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

            add(){
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/legals/uid',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{

                    this.uid=res.data.data.uid;
                    this.$router.push({path:'/lform',query:{uid:this.uid}})
                })

            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.updatarr=this.msg.uid;//把单行修改的每条数据的id添加进放修改数据的数组
                this.$router.push({path:'/lupdataform',query:{uid:this.updatarr}});
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.msg=row;//每一条数据的记录
                this.delarr=this.msg.uid;//把单行删除的每条数据的id添加进放删除数据的数组
                // console.log(this.delarr)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                let token = localStorage.getItem('ms_token');
                // this.tableData.splice(this.idx, 1);
                var param={uid:this.delarr}
                this.$axios.delete("/manager/legals",{
                    headers: {
                        'Authorization':token,
                    },
                    params: param}).then(res=>{
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
