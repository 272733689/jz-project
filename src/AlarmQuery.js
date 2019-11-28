import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Row, Col,Button ,Table,Popconfirm,Modal,Tabs ,DatePicker,Card,Input } from 'antd';

import reqwest from 'reqwest';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './css/AlarmQuery.css';
const confirm = Modal.confirm;
const pageSize=10;
moment.locale('zh-cn');
const { TabPane } = Tabs;
const {TextArea} = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';



class AlarmQuery  extends Component{
    state = {

        pagination: {pageSize: pageSize,current:1},
        startValue: moment(new Date(), dateFormat), // 开始时间
        endValue: moment(new Date(new Date().getTime() + 24*60*60*1000), dateFormat),  // 结束时间
        endOpen: false,   //打开 ？
        activeKey : '0', // 默认打开的tab1  未处理的页面
        sortType  : '0',      //      充值预警，欠费报警，越限报警，通讯故障
        objectType: '0',   // 小区  热力站  企业
        startDate : moment(new Date(), dateFormat),  // 开始时间
        endDate : moment(new Date(new Date().getTime() + 24*60*60*1000), dateFormat), // 结束时间
        dataSouce  : [] , //表格数据
        visible: false, // 处理打开的编辑框

        id : null ,
        handleTime : null , //处理时间
        handler : null ,    //处理人
        telephone : null , // 联系电话
        handleDesc : null , //处理说明


        visible2 : false , //归档
        archiver : null, //归档人
        archiveTime : null ,// 归档时间
        archiveDesc : null ,//归档说明

        handlerOptionData : [] , //数据集合

        startDate2 : moment(new Date(), dateFormat),  // 开始时间
        endDate2 : moment(new Date(new Date().getTime() + 24*60*60*1000), dateFormat), // 结束时间

    };
    //   加载页面时 触发
    componentDidMount() {
        this.getData();
    };

    //Tab  切换时
    callback = (key) => {
        console.log(key);
        if(key=="0"){
            this.setState({
                startDate : moment(new Date(), dateFormat),  // 开始时间
                endDate : moment(new Date(new Date().getTime() + 24*60*60*1000), dateFormat), // 结束时间
                startValue: moment(new Date(), dateFormat), // 开始时间
                endValue: moment(new Date(new Date().getTime() + 24*60*60*1000), dateFormat),  // 结束时间
            });

        }

        this.setState({
            activeKey: key,  //
        },()=>{
            this.getData();
        });
    }

    // 告警类型 选择下拉
    SelectHandleChange  = (value) => {
        console.log(`selected ${value}`);
        {/*充值预警，欠费报警，越限报警，通讯故障*/}
        if(value===0){
            this.setState({
                sortType: null,  //
            });
        }else{
            this.setState({
                sortType: value,  //
            });
        }

    }

/*    //对象 选择下拉
    SelectObjectChange = (value) => {
        this.setState({
            objectType: value,  //
        });

    }*/



    //时间控件
    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
        /*var formatDate = moment(12345678977).format('YYYY-MM-DD HH:mm:ss'); /!*格式化时间*!/*/
        console.log("当选择一个日期时 1",value.format('YYYY-MM-DD'));
        this.setState({
            startDate: value.format('YYYY-MM-DD'),  //
        });
    };

    onEndChange = value => {
        this.onChange('endValue', value);
        console.log("当选择一个日期时2" ,value.format('YYYY-MM-DD'));
        this.setState({
            endDate: value.format('YYYY-MM-DD'),  //
        });
    };

    /*    handleStartOpenChange = open => {
     if (!open) {
     this.setState({ endOpen: true });
     }
     console.log("打开 或者 关闭时1");



     };

     handleEndOpenChange = open => {
     this.setState({ endOpen: open });
     console.log("打开 或者 关闭时2");

     };*/


    getData = () => {
        let startDate1=  moment(this.state.startDate).format('YYYY-MM-DD');
        let endDate1=  moment(this.state.endDate).format('YYYY-MM-DD');

        reqwest({
            url: '/console/alarmQuery/queryAlarmQuery',
            method: 'GET',
            credentials: 'include',
            data: {
                activeKey:this.state.activeKey,
                startDate :startDate1,
                endDate :endDate1,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            //判断isvalidate 为true 的才展示
            let dateiSValid=[];
            if(ds[0].result != null){
                for (var i=0;i<ds[0].result.length;i++){
                    if(ds[0].result[i].devTermStatus == 3){
                        dateiSValid.push(
                            ds[0].result[i],
                        )
                    }
                }
            }


            this.setState({
                dataSouce: dateiSValid ,
                handlerOptionData : ds[0].resultHand,
            });
        })
    }


    // 点击查询按钮时 出发的方法
    selectqueryInfo=(value)=>{
        console.log("tab 页是 ："+this.state.activeKey);
        console.log("告警类型是："+this.state.sortType );
        console.log("开始时间是："+this.state.startDate);
        console.log("结束时间是："+this.state.endDate);

        let startDate1=  moment(this.state.startDate).format('YYYY-MM-DD');
        let endDate1=  moment(this.state.endDate).format('YYYY-MM-DD');


        if(this.state.sortType ==="0"){
            reqwest({
                url: '/console/alarmQuery/queryAlarmQuery',
                method: 'GET',
                credentials: 'include',
                data: {
                    activeKey:this.state.activeKey,
                    startDate :startDate1,
                    endDate :endDate1,
                    objectType : this.state.objectType
                }
            }).then((data) => {
                var ds = eval('(' + data + ')');
                console.log("返回的数据结果是", ds[0].result);
                let dateiSValid=[];
                if(ds[0].result != null){
                    for (var i=0;i<ds[0].result.length;i++){
                        if(ds[0].result[i].devTermStatus == 3){
                            dateiSValid.push(
                                ds[0].result[i],
                            )
                        }
                    }
                }

                this.setState({
                    dataSouce: dateiSValid ,
                });
            })
        }else{
            reqwest({
                url: '/console/alarmQuery/queryAlarmQuery',
                method: 'GET',
                credentials: 'include',
                data: {
                    activeKey:this.state.activeKey,
                    sortType :this.state.sortType,
                    startDate :startDate1,
                    endDate :endDate1,
                    objectType : this.state.objectType
                }
            }).then((data) => {
                var ds = eval('(' + data + ')');
                console.log("返回的数据结果是", ds[0].result);
                let dateiSValid=[];
                if(ds[0].result != null){
                    for (var i=0;i<ds[0].result.length;i++){
                        if(ds[0].result[i].devTermStatus == 3){
                            dateiSValid.push(
                                ds[0].result[i],
                            )
                        }
                    }
                }

                this.setState({
                    dataSouce: dateiSValid ,
                });
            })
        }


    }


    formatDate(dateVal) {
        var newDate = new Date(dateVal);
        var sMonth = this.padValue(newDate.getMonth() + 1);
        var sDay = this.padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = this.padValue(newDate.getMinutes());
        var ss = newDate.getSeconds();
        var sAMPM = "AM";
        var iHourCheck = parseInt(sHour);
        // if (iHourCheck > 12) {
        //     sAMPM = "PM";
        //     sHour = iHourCheck - 12;
        // }
        // else if (iHourCheck === 0) {
        //     sHour = "12";
        // }
        sHour = this.padValue(sHour);
        ss = this.padValue(ss);
        // return sMonth + "-" + sDay + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
        return sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":"+ss ;

    }
    padValue(value) {
        return (value < 10) ? "0" + value : value;
        // return (value < 10) ? "0" + value : value;
    }




    render() {
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
        const { startValue, endValue, endOpen ,dataPointName} = this.state;

        const columns = [, {
            title: '序号 ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警类型',
            dataIndex: 'soeSortAlias',
            key: 'soeSortAlias',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '对象',
            dataIndex: 'soeObjectName',
            key: 'soeObjectName',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '终端编号',
            dataIndex: 'devTermNo',
            key: 'devTermNo',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警内容',
            dataIndex: 'soeSortDesc',
            key: 'soeSortDesc',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '告警时间',
            dataIndex: 'soeGenTime',
            key: 'soeGenTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },

        }

/*        , {
            title: '操作',
            dataIndex: 'cePointName6',
            key: 'cePointName6',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record) => (
                <span><span><a href="#" onClick={this.showModalEdit.bind(this, record)}>处理</a></span>&nbsp;&nbsp;&nbsp;
                    {/!*        <Popconfirm title="是否确认归档？" onConfirm={this.placeOnFile.bind(this, record)} onCancel={this.cancel} okText="是" cancelText="否">
                     <a href="#">归档</a>
                     </Popconfirm>*!/}
                    {/!*<span><a href="#" onClick={this.placeOnFile.bind(this, record)}>归档</a></span>*!/}
                </span>
            )

        }*/
        ];

        const columns2 = [, {
            title: '序号 ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警类型',
            dataIndex: 'soeSortAlias',
            key: 'soeSortAlias',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '对象',
            dataIndex: 'soeObjectName',
            key: 'soeObjectName',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '终端编号',
            dataIndex: 'devTermNo',
            key: 'devTermNo',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警内容',
            dataIndex: 'soeSortDesc',
            key: 'soeSortDesc',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '告警时间',
            dataIndex: 'soeGenTime',
            key: 'soeGenTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },

        }, {
            title: '复归时间',
            dataIndex: 'soeRecTime',
            key: 'soeRecTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue1 = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue1 }</text>
                    </div>
                )
            },

        }];

        return (

            <div  className="div-back" style={{ height: '100%' }}>

                <Row span={24} >
                    {/*
                     <Tabs defaultActiveKey={this.state.activeKey} onChange={this.callback}>
                     */}
                    <Tabs activeKey ={this.state.activeKey} onChange={this.callback}>

                        <TabPane tab="实时告警" key="0">
                            <Row>
                                <Col span={2}><div style={{ float:'left',marginTop:"3%",  marginLeft:17}}> 告警类型：</div></Col>
                                <Col span={20}>
                                    <Select defaultValue="1"  onChange={this.SelectHandleChange}  style={{float:'left',  width: '200px'}} >
                                        <Option value="1">全部</Option>
                                        <Option value="2">采集设备报警</Option>
                                        <Option value="3">表计异常告警</Option>
                                    </Select>
                                </Col>
                                <Col span={2}>
                                    <div style={{ float:'right',  marginRight: "20%"}}>
                                        <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                    </div>
                                </Col>
                            </Row>
                            <Table
                                style={{ marginTop: 13}}
                                columns={columns}
                                dataSource={this.state.dataSouce}
                                // scroll={{ x: 1300 }}  // 加了这个下面会有滚动条
                                bordered
                                // footer={() => 'Footer'}
                                pagination={{
                                    total: total,
                                    pageSize: pageSize1,
                                    showTotal: function () {
                                        return <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.total} 条数据</div>
                                    }
                                }}
                            />


                        </TabPane>
                        <TabPane tab="历史告警" key="1">

                            <Col span={2}><div style={{ float:'left',marginTop:"3%",  marginLeft:17}}> 告警类型：</div></Col>
                            <Col span={2}>
                                <Select defaultValue="1"  onChange={this.SelectHandleChange}  style={{float:'left',  width: '200px'}} >
                                    <Option value="1">全部</Option>
                                    <Option value="2">采集设备报警</Option>
                                    <Option value="3">表计异常告警</Option>
                                </Select>
                            </Col>
                            <Col span={2}  ><div style={{float:'right',marginTop:"3%"}} >告警日期：</div></Col>
                            <Col span={3}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD"
                                    value={startValue}
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    // onOpenChange={this.handleStartOpenChange}
                                />
                            </Col>
                            {/* <Col span={1}><div style={{ float:'right',marginTop:"3.5%"}}> 至</div></Col>*/}
                            <Col span={5} >

                                <div  style={{ float:'left',marginTop :'1.5%',marginLeft:10}}>
                                    至
                                </div>

                                <DatePicker
                                    style={{ marginLeft: "20%"}}
                                    locale={locale}
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD"
                                    value={endValue}
                                    placeholder="结束时间"
                                    onChange={this.onEndChange}
                                    // open={endOpen}
                                    // onOpenChange={this.handleEndOpenChange}
                                />
                            </Col>

{/*                            <Col span={1}> <div style={{marginTop :"6%" }}>对象：</div></Col>
                            <Col span={7}>
                                <Select defaultValue="0"  onChange={this.SelectObjectChange} style={{width: 140}}>
                                    <Option value="0">全部</Option>
                                    <Option value="1">小区</Option>
                                    <Option value="2">热力站</Option>
                                    <Option value="3">企业</Option>
                                </Select>
                            </Col>*/}
                            <Col span={2}>
                                <div style={{ float:'right',  marginRight: "20%"}}>
                                    <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                </div>
                            </Col>

                            <Table
                                style={{ marginTop: 44}}
                                columns={columns2}
                                dataSource={this.state.dataSouce}
                                // scroll={{ x: 1300 }}  // 加了这个下面会有滚动条
                                bordered
                                // footer={() => 'Footer'}
                                pagination={{
                                    total: total,
                                    pageSize: pageSize1,
                                    showTotal: function () {
                                        return <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.total} 条数据</div>
                                    }
                                }}
                            />


                        </TabPane>
                    </Tabs>,
                </Row>

            </div>

        )
    }


}
export default AlarmQuery;
ReactDOM.render(<AlarmQuery/>, document.getElementById("root"));