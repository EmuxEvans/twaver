import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import * as fetchDevice from '../services/device';
import utility from '../utils/utility';
import styles from '../index.less';
import constants from '../constants';
import ApplyUpOrDown from '../components/ApplyUpOrDown';

const allAuth = constants.auth;

export default class NestedTable extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      { title: '设备编号', dataIndex: 'Numbering', key: 'Numbering' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: 'cabinetNumbering' },
      { title: '起始位置', dataIndex: 'startPosition', key: 'startPosition' },
      { title: '结束位置', dataIndex: 'endPosition', key: 'endPosition' },
      { title: '额定功率', dataIndex: 'ratedPower', key: 'ratedPower' },
      { title: '设备高度', dataIndex: 'height', key: 'height' },
      { title: '实际温度', dataIndex: 'actualTemperature', key: 'actualTemperature' },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: 'actualPowerLoad' },
      { title: '上柜/下柜', dataIndex: 'onCabinetInfo', key: 'onCabinetInfo' }];

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
      onData: [],
      offData: [],
      reviewingData: [],
      subData: [],
      show: false,
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

          const onCabinet = resp[i].onCabinet;
          temp.onCabinetInfo = utility.translate(onCabinet, 'onCabinet');

          if (onCabinet === '0') {
            temp.cabinetNumbering = utility.translate(onCabinet, 'onCabinet');
          }

          if (onCabinet === '1') {
            onData.push(temp);
          } else if (onCabinet === '0') {
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
      });
  }

  postReview = (status, numbering, on) => {
    const body = new FormData();
    body.append('status', status);
    body.append('on', on);
    body.append('serverNumbering', numbering);
    fetchDevice.reviewOnCabinet(body)
      .then((res) => {
        if (res.status === 'success') {
          message.success('操作成功');
          this.loadData();
        }
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

  toggleApply = () => {
    this.setState({
      show: !this.state.show,
    });
  }

  renderExpandedRow(auth) {
    if (auth === 'reviewer') {
      return this.expandedRowRender;
    }
  }

  renderApplyButton(auth) {
    if (allAuth.applicant.includes(auth)) {
      return (
        <div className={`${styles.pt_20} ${styles.pb_20}`}>
          <Button type="primary" onClick={this.toggleApply}>上/下柜申请</Button>
        </div>
      );
    }
  }

  render() {
    const { onData, offData, reviewingData, show, data } = this.state;
    let dataSource = data;
    const auth = utility.getAuth(this.props);
    const columns = JSON.parse(JSON.stringify(this.columns));
    if (allAuth.reviewer.includes(auth)) {
      columns.push({
        title: '审核',
        key: 'operation',
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.postReview('ship', record.Numbering, record.onCabinet)}>通过</a>
              <span className="ant-divider" />
              <a onClick={() => this.postReview('no', record.Numbering, record.onCabinet)}>不通过</a>
            </span>
          );
        },
      });
      dataSource = reviewingData;
    }

    return (
      <div>
        <ApplyUpOrDown
          show={show}
          onData={onData}
          offData={offData}
          reviewingData={reviewingData}
          toggle={this.toggleApply}
          refetch={this.loadData}
        />
        {this.renderApplyButton(auth)}
        <Table
          className="components-table-demo-nested"
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}

