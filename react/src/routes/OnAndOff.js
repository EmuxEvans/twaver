import React, { Component } from 'react';
import { Table, message } from 'antd';
import translate from '../utils/translate';
import * as fetchDevice from '../services/device';

export default class OnandOff extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: '设备编号', width: 100, dataIndex: 'Numbering', key: 'Numbering', fixed: 'left' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: '1', width: 100 },
      { title: '额定功率', dataIndex: 'ratedPower', key: '2', width: 100 },
      { title: '设备高度', dataIndex: 'height', key: '3', width: 100 },
      { title: '设备类型', dataIndex: 'category', key: '4', width: 100 },
      { title: '实际温度', dataIndex: 'actualTemperature', key: '5', width: 100 },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: '6', width: 100 },
      { title: '负责人', dataIndex: 'responsible', key: '9', width: 100 },
      { title: '上柜/下柜', dataIndex: 'onCabinet', key: '8', width: 100 },
      { title: '上电/下电', dataIndex: 'on', key: '7', width: 100, fixed: 'right' },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.turnOn(record.Numbering)}>上电</a>
              <span className="ant-divider" />
              <a onClick={() => this.turnOff(record.Numbering)}>下电</a>
            </span>
          );
        },
      },
    ];

    this.state = {
      dataSource: [],
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
          temp.category = translate(resp[i].category);

          temp.responsible = resp[i].responsible;
          temp.actualTemperature = resp[i].actualTemperature;
          temp.actualPowerLoad = resp[i].actualPowerLoad;
          if (resp[i].on === '1') {
            temp.on = '已上电';
          } else {
            temp.on = '未上电';
          }

          if (resp[i].onCabinet === '1') {
            temp.onCabinet = '已上柜';
          } else {
            temp.onCabinet = '未上柜';
          }
          data.push(temp);
        }

        this.setState({
          dataSource: data,
        });
      })
      .catch(error => console.log(error));
  }

  turnOn = (numbering) => {
    const dataSource = [...this.state.dataSource];

    const data = {
      serverNumbering: numbering,
      serviceNumber: 1,
    };

    fetchDevice.onAndOff(data)
      .then((resp) => {
        if (resp.status === 'success') {
          message.success('上电成功');
          Object.keys(dataSource).forEach((key) => {
            if (dataSource[key].Numbering === numbering) {
              dataSource[key].on = '已上电';
            }
          });
          this.setState({ dataSource });
        }
        if (resp.status === 'fail') {
          message.warning('超过机柜阈值，无法上电');
        }
        if (resp.status === 'onfalse') {
          message.warning('该设备未上柜，无法上电');
        }
      });
  }

  turnOff = (numbering) => {
    const dataSource = [...this.state.dataSource];

    const data = {
      serverNumbering: numbering,
      serviceNumber: 2,
    };

    fetchDevice.onAndOff(data)
      .then((resp) => {
        if (resp.status === 'success') {
          message.success('下电成功');
          Object.keys(dataSource).forEach((key) => {
            if (dataSource[key].Numbering === numbering) {
              dataSource[key].on = '未上电';
            }
          });
          this.setState({ dataSource });
        }
        if (resp.status === 'onCabinetfalse') {
          message.warning('该设备未上柜，无法下电');
        }
        if (resp.status === 'onfalse') {
          message.warning('该设备未上电，无法下电');
        }
      });
  }


  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1100 }}
      />
    );
  }
}
