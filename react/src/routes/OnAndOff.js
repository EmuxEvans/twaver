import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import utility from '../utils/utility';
import * as fetchDevice from '../services/device';
import styles from '../index.less';
import constants from '../constants';

const allAuth = constants.auth;

export default class OnandOff extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: '设备编号', width: 100, dataIndex: 'Numbering', key: 'Numbering', fixed: 'left' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: '1', width: 100 },
      { title: '起始位置', dataIndex: 'startPosition', key: 'startPosition' },
      { title: '结束位置', dataIndex: 'endPosition', key: 'endPosition' },
      { title: '额定功率', dataIndex: 'ratedPower', key: '2', width: 100 },
      { title: '设备高度', dataIndex: 'height', key: '3', width: 100 },
      { title: '设备类型', dataIndex: 'category', key: '4', width: 100 },
      { title: '实际温度', dataIndex: 'actualTemperature', key: '5', width: 100 },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: '6', width: 100 },
      { title: '负责人', dataIndex: 'responsible', key: '9', width: 100 },
      { title: '上柜/下柜', dataIndex: 'onCabinet', key: '8', width: 100 },
      { title: '上电/下电', dataIndex: 'on', key: '7', width: 100, fixed: 'right' }];

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
          const temp = { ...resp[i] };
          temp.key = resp[i].Numbering;
          temp.category = utility.translate(resp[i].category);

          temp.on = utility.translate(resp[i].on, 'on')
          temp.onCabinet = utility.translate(resp[i].onCabinet, 'onCabinet');

          if (resp[i].onCabinet !== '1') {
            temp.cabinetNumbering = utility.translate(resp[i].onCabinet, 'onCabinet');
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

  renderApplyButton() {
    const auth = utility.getAuth(this.props);
    if (allAuth.applicant.includes(auth)) {
      return (
        <div className={`${styles.pt_20} ${styles.pb_20}`}>
          <Button type="primary">上/下电申请</Button>
        </div>
      );
    }
  }


  render() {
    const { dataSource } = this.state;
    const columns = JSON.parse(JSON.stringify(this.columns));

    utility.checkAuth(this.props, () => {
      columns.push({
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
      });
    });
    return (
      <div>
        {this.renderApplyButton()}
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: columns.length * 100 }}
        />
      </div>
    );
  }
}
