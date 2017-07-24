import React, { Component } from 'react';
import { Table, Badge, Menu, Dropdown, Icon, message } from 'antd';
import * as fetchDevice from '../services/device';

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
        render: (text, record) => {
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
        render: (text, record) => {
          return (
            <span className={'table-operation'}>
              <a onClick={() => this.onCabinet(record.key)}>上柜</a>
            </span>
          );
        },
      }];


    this.state = {
      data: [],
      subData: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchDevice.getAllDevice()
      .then((resp) => {
        const data = [];
        for (const i in resp) {
          const temp = {};
          temp.key = resp[i].Numbering;
          temp.Numbering = resp[i].Numbering;
          temp.cabinetNumbering = resp[i].cabinetNumbering;
          temp.ratedPower = resp[i].ratedPower;
          temp.height = resp[i].height;
          temp.actualTemperature = resp[i].actualTemperature;
          temp.actualPowerLoad = resp[i].actualPowerLoad;
          if (resp[i].onCabinet === '1') {
            temp.onCabinet = '已上柜';
          } else {
            temp.onCabinet = '未上柜';
            temp.cabinetNumbering = '未上柜';
          }
          data.push(temp);
        }

        this.setState({
          data,
        });
      });
  }

  offCabinet = (numbering) => {
    const formdata = new FormData();
    formdata.append('serverNumbering', numbering);

    fetchDevice.offCabinet(formdata)
      .then((resp) => {
        if (resp.status === 'success') {
          this.loadData();
          message.success('下柜成功');
        }
        if (resp.status === 'onfalse') {
          message.warning('该设备未上柜，无法下柜');
        }
      });
  }

  onCabinet = (numbering) => {
    const { subData } = this.state;
    let tempServerNumbering;
    let tempCabinetNumbering;
    let tempStartPos;
    let tempEndPos;
    Object.keys(subData).forEach((key) => {
      if (subData[key].key === numbering) {
        tempCabinetNumbering = subData[key].cabinetNumbering;
        tempServerNumbering = subData[key].serverNumbering;
        tempStartPos = subData[key].startPosition;
        tempEndPos = subData[key].endPosition;
      }
    });

    const formdata = new FormData();
    formdata.append('serverNumbering', tempServerNumbering);
    formdata.append('cabinetNumber', tempCabinetNumbering);
    formdata.append('startPosition', tempStartPos);
    formdata.append('endPosition', tempEndPos);

    fetchDevice.onCabinet(formdata)
      .then(() => {
        message.success('上柜成功');
        this.loadData();
      });
  }

  handleExpand = (expanded, record) => {
    const formdata = new FormData();
    formdata.append('serverNumbering', record.Numbering);

    fetchDevice.findPosition(record.Numbering)
      .then((resp) => {
        const subdata = [];
        for (const i in resp) {
          const temp = {};
          temp.key = record.Numbering + resp[i].cabinetNumbering;
          temp.serverNumbering = record.Numbering;
          temp.cabinetNumbering = resp[i].cabinetNumbering;
          temp.startPosition = resp[i].startPosition;
          temp.endPosition = resp[i].endPosition;
          subdata.push(temp);
        }

        this.setState({
          subData: subdata,
        });
      });
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

