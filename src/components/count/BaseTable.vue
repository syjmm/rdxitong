<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>代表履职统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div id="myChart"  style="width: 100%;height: 300px"></div>
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="search('ALL')">全部</el-button>
                <el-button type="primary" icon="search" @click="search('MONTH')">本月</el-button>
                <el-button type="primary" icon="search" @click="search('YEAR')">本年</el-button>
                <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        @change="getTime"
                        value-format="yyyy-MM-dd HH:mm"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="代表名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <a href="/api/manager/analysis/export">
                    <el-button type="success" icon="search">导出</el-button>
                </a>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

                <el-table-column prop="name" label="代表名称" width="140" align="center">
                </el-table-column>
                <el-table-column prop="opsCount" label="收到意见次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="sugsCount" label="提出建议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="npcMeetingCount" label="参加人大会议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="otherMeetingCount" label="参加其他会议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="motionCount" label="提出议案次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="inspectCount" label="持证视察次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="groupActivityCount" label="参加小组活动次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="contactPeopleCount" label="联系选民次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="helpWorkCount" label="帮扶工作次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="solvePeopleProblemCount" label="为民办事次数"   align="center">
                </el-table-column>


                <!--<el-table-column label="操作"  align="center" >-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看图表</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPages">
                </el-pagination>
            </div>
        </div>



    </div>
</template>

<script>

    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                msg: "",//记录每一条的信息，便于取id
                uid: "",//返回新闻id
                seedata: "",
                charts: '',
                opinion: [],
                starttime:"",
                endtime:"",
                opinionData1: [],
                opinionData2: [],
                totalPages: 0,
                cur_page: 1,
                multipleSelection: [],
                select_word: '',
                del_list: [],
                editVisible: false,
                form: {
                    name: '',
                    date: '',
                    time: ''
                },
            }
        },
        created() {
            this.getData();
        },
        mounted:function(){
            this.drawLine();
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
            handleSee(index, row) {

                this.editVisible = true;
                this.msg = row;//每一条数据的记录
                this.uid =this.msg.name;
                this.seedata = this.msg.analysis;
                this.$router.push({path:"/echarts",query:{uid:this.uid,analysis:this.seedata}})
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/all', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {
                        page: this.cur_page
                    }

                }).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page = res.data.data.page;
                    this.totalPages = res.data.data.totalPages * 10;

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
            search(TYPE) {
                var type = TYPE || "";
                if( type != 'ALL'&& type != 'MONTH'&& type != 'YEAR'&& this.starttime ==""&& this.select_word ==""){
                    this.$message.error('请选择查询条件');
                    return;
                }

                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/all', {
                    headers: {
                        'Authorization':token,
                    },
                    params:
                        {
                            type:type,
                            startAt:this.starttime,
                            endAt:this.endtime,
                            searchKey: this.select_word
                        }
                }).then(res => {
                    if (res.data.status == 'OK') {
                        this.tableData = res.data.data.content;
                        this.$message.success('查询成功')
                    }

                })

            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                // 绘制图表
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/total',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{

                    this.opinion = res.data.data.xaxis;
                    this.opinionData1 = res.data.data.yaxis[0].data;
                    this.opinionData2 = res.data.data.yaxis[1].data;
                    myChart.setOption({
                        legend: {
                            show: true,
                            data: ['选民意见总数', '代表建议总数']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        tooltip: {
                            trigger: 'axis',
                        },
                        xAxis: {
                            type: 'category',
                            data: this.opinion
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} '
                            },
                            axisPointer: {
                                snap: true
                            }
                        },
                        series: [{
                            name: '选民意见总数',
                            data: this.opinionData1,
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: '#67c23a',
                                }
                            },
                        },{
                            name: '代表建议总数',
                            data: this.opinionData2,
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: '#3398DB',
                                }
                            },
                        }
                        ]
                    });
                    setTimeout(function (){
                        window.onresize = function () {
                            myChart.resize();
                        }
                    },200)
                })

            }

        },

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
