import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm, message } from 'antd';
import * as fetchDevice from '../services/device';
import utility from '../utils/utility';

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备编号',
      dataIndex: 'Numbering',
    }, {
      title: '所在机柜编号',
      dataIndex: 'cabinetNumbering',
      render: text => (text === '-1' ? '该设备未上柜' : text),
    }, {
      title: '额定功率',
      dataIndex: 'ratedPower',
    }, {
      title: '设备类型',
      dataIndex: 'category',
      render: text => utility.translate(text),
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
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.Numbering)}>
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
        this.setState({
          dataSource: Object.values(resp),
        });
      })
      .catch(error => console.log(error));
  }

  onDelete = (index) => {
    const device = this.state.dataSource.find(element => element.Numbering === index);
    if (device.on === '0') {
      fetchDevice.deleteDevice({ deviceNo: index })
        .then((resp) => {
          if (resp.status === 'success') {
            message.success('成功删除设备');
            this.loadData();
          }
        })
        .catch(() => {
          message.error('删除失败');
        });
    } else {
      message.warning('请先将设备下柜');
    }
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
