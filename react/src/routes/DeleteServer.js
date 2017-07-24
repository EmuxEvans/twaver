import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm, message } from 'antd';
import * as fetchDevice from '../services/device';
import translate from '../utils/translate';

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备编号',
      dataIndex: 'deviceNo',
    }, {
      title: '所在机柜编号',
      dataIndex: 'cabinetNo',
    }, {
      title: '额定功率',
      dataIndex: 'ratedPower',
    }, {
      title: '设备类型',
      dataIndex: 'deviceType',
    }, {
      title: '责任人',
      dataIndex: 'responsible',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.dataSource.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.deviceNo)}>
                <a href="#">删除</a>
              </Popconfirm>
            ) : null
        );
      },
    }];

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
          temp.deviceNo = resp[i].Numbering;
          if (resp[i].cabinetNumbering === '-1') {
            temp.cabinetNo = '该设备未上柜';
          } else {
            temp.cabinetNo = resp[i].cabinetNumbering;
          }
          temp.ratedPower = resp[i].ratedPower;
          temp.deviceType = translate(resp[i].category);

          temp.responsible = resp[i].responsible;
          data.push(temp);
        }

        this.setState({
          dataSource: data,
        });
      })
      .catch(error => console.log(error));
  }

  onDelete = (index) => {
    fetchDevice.deleteDevice({ deviceNo: index })
      .then((resp) => {
        if (resp.status === 'success') {
          message.success('成功删除设备');
          this.loadData();
        }
      })
      .catch(() => {
        message.warning('删除失败');
      });
  }

  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}
