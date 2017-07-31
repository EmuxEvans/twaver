import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import utility from '../utils/utility';
import * as fetchDevice from '../services/device';
import styles from '../index.less';
import constants from '../constants';
import ApplyOnOrOff from '../components/ApplyOnOrOff';

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
      { title: '上柜/下柜', dataIndex: 'onCabinetInfo', key: '8', width: 100 },
      { title: '上电/下电', dataIndex: 'onInfo', key: '7', width: 100, fixed: 'right' }];

    this.state = {
      data: [],
      onData: [],
      offData: [],
      reviewingData: [],
      subData: [],
      show: false,
      modalKey: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchDevice.getAllDevice()
      .then((resp) => {
        const data = [];
        const onData = [];
        const offData = [];
        const reviewingData = [];
        for (const i in resp) {
          const temp = { ...resp[i] };
          temp.key = resp[i].Numbering;
          temp.category = utility.translate(resp[i].category);

          temp.onCabinetInfo = utility.translate(resp[i].onCabinet, 'onCabinet');
          if (resp[i].onCabinet === '0') {
            temp.cabinetNumbering = utility.translate(resp[i].onCabinet, 'onCabinet');
          }

          const on = resp[i].on;
          temp.onInfo = utility.translate(on, 'on');

          if (on === '1') {
            onData.push(temp);
          } else if (on === '0') {
            offData.push(temp);
          } else {
            reviewingData.push(temp);
          }

          data.push(temp);
        }

        this.setState({
          data,
          onData,
          offData,
          reviewingData,
        });
      })
      .catch(error => console.log(error));
  }

  postReview = (status, numbering, on) => {
    const body = new FormData();
    body.append('status', status);
    body.append('on', on);
    body.append('serverNumbering', numbering);
    fetchDevice.reviewOn(body)
      .then((res) => {
        if (res.status === 'success') {
          message.success('操作成功');
          this.loadData();
        }
      })
      .catch(() => {
        message.error('操作失败');
      });
  }

  toggleApply = () => {
    this.setState({
      show: !this.state.show,
      modalKey: Math.random(),
    });
  }

  renderApplyButton() {
    const auth = utility.getAuth(this.props);
    if (allAuth.applicant.includes(auth)) {
      return (
        <div className={`${styles.pt_20} ${styles.pb_20}`}>
          <Button type="primary" onClick={this.toggleApply}>上/下电申请</Button>
        </div>
      );
    }
  }


  render() {
    const { data, onData, offData, reviewingData, show, modalKey } = this.state;
    let dataSource = data;
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
              <a onClick={() => this.postReview('ship', record.Numbering, record.on)}>通过</a>
              <span className="ant-divider" />
              <a onClick={() => this.postReview('no', record.Numbering, record.on)}>不通过</a>
            </span>
          );
        },
      });
      dataSource = reviewingData;
    });
    return (
      <div>
        <ApplyOnOrOff
          modalKey={modalKey}
          show={show}
          onData={onData}
          offData={offData}
          reviewingData={reviewingData}
          toggle={this.toggleApply}
          refetch={this.loadData}
        />
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
