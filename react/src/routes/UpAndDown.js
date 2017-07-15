import React, { Component } from 'react';
import { Table, Badge, Menu, Dropdown, Icon, message } from 'antd';
const urlgetdata = "http://127.0.0.1:5000/getalldevice";
const urloffcabinet = "http://127.0.0.1:5000/offcabinet";

export default class NestedTable extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      { title: '设备编号', dataIndex: 'Numbering', key: 'Numbering' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: 'cabinetNumbering' },
      { title: '额定功率', dataIndex: 'ratedPower', key: 'ratedPower' },
      { title: '设备高度', dataIndex: 'height', key: 'height' },
      { title: '实际温度', dataIndex: 'actualTemperature', key: 'actualTemperature' },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: 'actualPowerLoad' },
      { title: '上柜/下柜', dataIndex: 'onCabinet', key: 'onCabinet' },
      { 
        title: '操作', 
        key: 'operation', 
        render: (text, record, index) => {
          return (
            <a onClick={() => this.offCabinet(record.Numbering)}>下柜</a> 
          );
        },
    }];

    this.nestedcolumns = [
      { title: '设备编号', dataIndex: 'serverNumbering', key: 'serverNumbering' },
      { title: '位置所属机柜', dataIndex: 'cabinetNumbering', key: 'cabinetNumbering' },
      { title: '起始位置', dataIndex: 'startPosition', key: 'startPosition' },
      { title: '结束位置', dataIndex: 'endPosition', key: 'endPosition' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          return(
            <span className={'table-operation'}>
              <a onClick={() => this.onCabinet(record.key)}>上柜</a>
            </span>
          );
        },
      }];


    this.state = {
      data: [],
      subData: []
    }
  }

  componentDidMount() {
    this.loadData();
    setInterval(this.loadData, 20000);
  }

  loadData =()=>{
    fetch(urlgetdata, {
      method: 'GET',
      mode: 'cors',
    })
    .then(resp => resp.json())
    .then(resp => {
        const data=[];
        for (var i in resp) {    
          var temp = new Object();    
          temp["key"]= resp[i].Numbering;
          temp["Numbering"]=resp[i].Numbering;
          temp["cabinetNumbering"]=resp[i].cabinetNumbering;
          temp["ratedPower"]=resp[i].ratedPower;
          temp["height"]=resp[i].height;
          temp["actualTemperature"]=resp[i].actualTemperature;
          temp["actualPowerLoad"]=resp[i].actualPowerLoad;
          if(resp[i].onCabinet == 1)
            temp["onCabinet"]="已上柜";
          else
            temp["onCabinet"]="未上柜";
          data.push(temp);
        }

        this.setState({
          data:data
        });
    })
  }

  offCabinet = (numbering) => {
    const {data} = this.state;

    var formdata = new FormData();
    formdata.append('serverNumbering', numbering);

    fetch("http://127.0.0.1:5000/offcabinet" , {
      method: 'POST',
    
      header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: formdata
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp.status == "success") {
        message.success('下柜成功');
        Object.keys(data).forEach((key) => {
          if(data[key].Numbering == numbering) {
            data[key].onCabinet = "未上柜";
          }
        });
        this.setState({ data });
      }
      if(resp.status == "onfalse")
        message.warning('该设备未上柜，无法下柜');
    });
  }

  onCabinet = (numbering) => {
    const {subData} = this.state;
    const {data} = this.state;
    var tempServerNumbering;
    var tempCabinetNumbering;
    var tempStartPos;
    var tempEndPos;
    Object.keys(subData).forEach((key) => {
      if(subData[key].key == numbering) {
        Object.keys(data).forEach((key_) => {
          if(data[key_].Numbering == subData[key].serverNumbering){
            data[key_].onCabinet = "已上柜";
          }
        })
        tempCabinetNumbering = subData[key].cabinetNumbering;
        tempServerNumbering = subData[key].serverNumbering;
        tempStartPos = subData[key].startPosition;
        tempEndPos = subData[key].endPosition;
      }
    });
    this.setState({ subData });

    var formdata = new FormData();
    formdata.append('serverNumbering', tempServerNumbering);
    formdata.append('cabinetNumber', tempCabinetNumbering);
    formdata.append('startPosition', tempStartPos);
    formdata.append('endPosition', tempEndPos);

    fetch("http://127.0.0.1:5000/oncabinet" , {
      method: 'POST',
      mode: 'cors',
      header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: formdata
    })
    .then(function(resp) {
      if(resp.ok) {
        console.log("success RESP");
      }
    });
  }  

  handleExpand = (expanded, record) => {
    var formdata = new FormData();
    formdata.append('serverNumbering', record.Numbering);

    fetch("http://127.0.0.1:5000/findposition", {
      method: 'POST',

       header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: formdata      
    })
    .then(resp => resp.json())
    .then(resp => {
      const subdata=[];
      for (var i in resp) {    
        var temp = new Object();    
        temp["key"]= record.Numbering + resp[i].cabinetNumbering;
        temp["serverNumbering"]=record.Numbering;
        temp["cabinetNumbering"]=resp[i].cabinetNumbering;
        temp["startPosition"]=resp[i].startPosition;
        temp["endPosition"]=resp[i].endPosition;
        subdata.push(temp);
      }

      this.setState({
        subData:subdata
      });
    })
  }

  expandedRowRender = () => {
    const nestedcolumns = this.nestedcolumns;

    return (
      <Table
        columns={nestedcolumns}
        dataSource={this.state.subData}
        pagination={false}
      />
    );
  };

  render() {
    const columns = this.columns;

    return (
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={this.expandedRowRender}
        dataSource={this.state.data}
        onExpand={this.handleExpand}
      />
    );
  }
}

