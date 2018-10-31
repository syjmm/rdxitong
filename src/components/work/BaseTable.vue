<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 工作站列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="工作站名称/地址/联系方式" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="add">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="avatar" label="工作站图片" width="150" align="center">
                    <template slot-scope="scope">
                        <img :src="GLOBAL.BASE_URL+scope.row.avatar" style="width:80px;height: 80px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="工作站名称" width="150" align="center">
                </el-table-column>
                <el-table-column prop="address" label="工作站地址" width="180" align="center">
                </el-table-column>
                <el-table-column prop="telephone" label="工作站联系方式"  width="150" align="center">
                </el-table-column>
                <!--<el-table-column prop="group" label="所属代表小组" align="center" width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="members" label="具体成员" align="center" width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div v-for="item in scope.row.members">{{item.name}}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="memberCount" label="成员个数" align="center" width="100">-->
                <!--</el-table-column>-->
                <el-table-column prop="enabled" label="是否可用" align="center" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.enabled == true">可用</div>
                        <div v-if="scope.row.enabled == false">不可用</div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="工作站描述" align="center">
                </el-table-column>
                <el-table-column label="操作" width="260" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleStart(scope.$index, scope.row)" v-if="scope.row.enabled == false" >启用</el-button>
                        <el-button size="small" type="danger" @click="handleforbidden(scope.$index, scope.row)" v-if="scope.row.enabled == true">禁用</el-button>
                        <el-button size="small" type="primary"@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    import  qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_word: '',
                totalPages:0,
                del_list: [],
                sid:'',
                fid:'',
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据
                updatarr:'',
                is_search: false,
                editVisible: false,
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
                this.$axios.get('/manager/work_stations', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{page: this.cur_page}}).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;
                })
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/work_stations', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {searchKey:this.select_word}}).then(res=>{
                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })

            },
            add(){
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/work_stations/uid',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    this.uid=res.data.data.uid;
                    this.$router.push({path:'/wform',query:{uid:this.uid}})
                })
            },

            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.updatarr=this.msg.uid;//把单行修改的每条数据的id添加进放修改数据的数组
                this.$router.push({path:'/wupdataform',query:{uid:this.updatarr}});
            },
            handleStart(index, row){
                let token = localStorage.getItem('ms_token');
                this.msg = row ;
                this.sid = this.msg.uid;
                this.$axios.post('/manager/work_stations/status',
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
                        this.getData()
                    }
                })

            },
            handleforbidden(index, row){
                let token = localStorage.getItem('ms_token');
                this.msg = row ;
                this.fid = this.msg.uid;
                this.$axios.post('/manager/work_stations/status',
                    qs.stringify({
                        uid:this.fid
                    }),
                    {
                        headers: {
                            'Authorization':token,
                        }
                    }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('禁用成功')
                        this.getData()
                    }
                })
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
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                var param={uid:this.delarr}
                let token = localStorage.getItem('ms_token');
                this.$axios.delete("/manager/work_stations",{
                    headers: {
                        'Authorization':token,
                    },
                    params: param}).then(res=>{
                    // console.log(res.data)
                    if(res.data.status=="OK"){
                        this.getData();
                        this.$message.success('删除成功')
                    }

                }).catch(error=>{
                    // console.log(error);
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
