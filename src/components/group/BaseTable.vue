<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 代表小组列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="小组名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="add">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :header-cell-style="{fontSize:'12px'}">
                <el-table-column prop="createAt" label="创建时间" width="230" align="center">
                </el-table-column>
                <el-table-column prop="name" label="小组名称" width="230" align="center">
                </el-table-column>
                <el-table-column prop="description" label="小组介绍"  width="270" align="center">
                </el-table-column>
                <el-table-column prop="description" label="所属村/社区"  width="270" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.villages">{{item.name}}</div>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="workStation" label="工作站"  width="230" align="center">-->
                <!--</el-table-column>-->
                <el-table-column prop="memberCount" label="小组人数" align="center">
                </el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <!--<el-button size="small" @click="handleMember(scope.$index, scope.row)">添加成员</el-button>-->
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <el-form ref="form" :model="seedata" label-width="100px">
                <el-form-item label="创建日期：">
                    <div>{{seedata.createAt}}</div>
                </el-form-item>
                <el-form-item label="小组名称：">
                    <div>{{seedata.name}}</div>
                </el-form-item>
                <el-form-item label="小组介绍：">
                    <div>{{seedata.description}}</div>
                </el-form-item>
                <el-form-item label="具体成员：">
                    <div v-for="item in seedata.members" style="width: 8%;float:left;text-align: center;">{{item.name}}</div>
                </el-form-item>
                <el-form-item label="所属村/社区：">
                    <div v-for="item in seedata.villages">{{item.name}}</div>
                </el-form-item>
                <el-form-item label="小组人数：">
                    <div>{{seedata.memberCount}}</div>
                </el-form-item>
                <!--<el-form-item label="工作站：">-->
                    <!--<div>{{seedata.workStation}}</div>-->
                    <!--<el-button type="success" v-if="seedata.workStation == ''" @click="gadd(seedata.uid,seedata.name)">添加</el-button>-->
                    <!--<el-button type="danger"   v-if="seedata.workStation" @click="gdel(seedata.uid)">移除</el-button>-->
                <!--</el-form-item>-->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加成员弹出框 -->
        <el-dialog title="添加小组成员" :visible.sync="editVisible1" width="30%">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="代表名称：">
                    <el-checkbox-group v-model="receivers" >
                        <el-checkbox  v-for="item in options":label="item.uid"  :key="item.uid">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="type">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加小组工作站弹出框 -->
        <el-dialog title="添加小组工作站" :visible.sync="editVisible2" width="20%">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="所属代表小组：">
                   <div>{{groupname}}</div>
                </el-form-item>
                <el-form-item label="所属工作站">
                    <el-select v-model="fwork" placeholder="请选择">
                        <el-option
                                v-for="item in work"
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
                options:[],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                groupname:"",
                seedata:"",
                gid:'',
                work:'',
                group:'',
                fgroup:'',
                fwork:'',
                receivers:[],
                msg:"",//记录每一条的信息，便于取id
                delarr:"",//存放删除的数据
                mid:'',
                del_list: [],
                totalPages:0,
                is_search: false,
                editVisible: false,
                editVisible1: false,
                editVisible2:false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: '',

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
                this.$axios.get('/manager/npc_member_groups', {
                    headers: {
                        'Authorization':token,
                    },
                    params:{ page: this.cur_page}}).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page=res.data.data.page;
                    this.totalPages=res.data.data.totalPages*10;

                })
            },
            search() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/npc_member_groups', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {endAt:this.form.time,searchKey:this.select_word}}).then(res=>{

                    if(res.data.status == 'OK'){
                        this.tableData=res.data.data.content;
                    }

                })
            },
            add(){
                this.$router.push("/gform")
            },
            gdel(id){
                let token = localStorage.getItem('ms_token');
                var param = id;
                this.$axios.delete('/manager/npc_member_groups/station',{
                    headers: {
                        'Authorization':token,
                    },
                    params:{uid:param}}).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success('移除成功');
                        this.editVisible = false;
                        this.getData();
                    }
                })
            },
            handleSee(index,row){
                this.idx = index;
                this.editVisible = true;
                this.seedata=row;//每一条数据的记录
            },
            //获取工作站数据
            gadd(id,name){
                this.editVisible = false;
                this.editVisible2 = true;
                this.groupname = name;
                this.fgroup = id;
                let token = localStorage.getItem('ms_token');
                // this.$axios.get('/manager/npc_member_groups/all',{
                //     headers: {
                //         'Authorization':token,
                //     }
                // }).then(res=>{
                //     this.group = res.data.data;
                // })
                this.$axios.get('/manager/work_stations/all',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    this.work=res.data.data;
                })
            },
            //添加工作站
            save(){

                var that = this;

                let token = localStorage.getItem('ms_token');
               this.$axios.post('/manager/npc_member_groups/station',
               qs.stringify({
                   group:that.fgroup,
                   station:that.fwork
               }),{
                       headers: {
                           'Authorization':token,
                       }
                   }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.editVisible2 = false;
                        this.$message.success('添加成功');
                        this.getData();
                        this.fgroup = "";
                        this.fwork = "";

                    }
               })
            },

            //添加小组成员
            handleMember(index,row){
                let token = localStorage.getItem('ms_token');
                this.editVisible1 = true;
                this.msg=row;
                this.mid=this.msg.uid;
                this.$axios.get('/manager/npc_members/working',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    this.options=res.data.data;
                })

            },
            //添加小组成员
            type(){
                let token = localStorage.getItem('ms_token');
                this.$axios.post('/manager/npc_member_groups/members',{
                    group:this.mid,
                    members:this.receivers
                },{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{
                    if(res.data.status == 'OK'){
                        this.$message.success(`修改成功`);
                        this.getData()
                        this.editVisible1=false;
                    }
                })
            },
            //编辑
            handleEdit(index, row) {
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.gid=this.msg.uid;//把单行修改的每条数据的id添加进放修改数据的数组
                this.$router.push({path:'/gupdataform',query:{uid:this.gid}});
            },
            //删除
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
                this.$axios.delete("/manager/npc_member_groups",{
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
