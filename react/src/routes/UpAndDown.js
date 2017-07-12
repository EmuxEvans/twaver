import React, { Component } from 'react';
import { Table, Badge, Menu, Dropdown, Icon } from 'antd';


export default class NestedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      subData: []
    }
  }

  componentDidMount() {
    this.fetchData();
  }


  loadData() {
    const data = [];
    const subData = [];

    fetch(url, {
      method: 'get'
    })
    .then(resp => resp.json())
    .then(resp => {
      resp.forEach((element) => {

      })
    })
    .then(()=> {
      fetch(url, {
        method: 'get'
      })
      .then(resp => resp.json())
      .then(resp => {
        resp.forEach((element) => {

        })

        this.setState({
          data, subData
        });
      })
    })
  }


  expandedRowRender = () => {
    const columns = [
      { title: '起始位置', dataIndex: 'date', key: 'date' },
      { title: '结束位置', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <span className={'table-operation'}>
            <a>上柜</a>
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={this.state.subData}
        pagination={false}
      />
    );
  };

  render() {
    const columns = [
      { title: '设备编号', dataIndex: 'Numbering', key: 'Numbering' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: 'cabinetNumbering' },
      { title: '额定功率', dataIndex: 'ratedPower', key: 'ratedPower' },
      { title: '设备高度', dataIndex: 'height', key: 'height' },
      { title: '实际温度', dataIndex: 'actualTemperature', key: 'actualTemperature' },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: 'actualPowerLoad' },
      { title: '上柜/下柜', dataIndex: 'onCabinet', key: 'onCabinet' },
      { title: '操作', key: 'operation', render: () => <a>下柜</a> },
    ];

    return (
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={this.expandedRowRender}
        dataSource={this.state.data}
      />
    );
  }
}

