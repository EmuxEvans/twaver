import React, { Component } from 'react';
import { Table, Input, DatePicker, Pagination, Spin } from 'antd';
import moment from 'moment';
import { get } from 'lodash';

import Constants from 'general/js/Constants';

const Search = Input.Search;
const URL = Constants.url;

const flexRow = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' };
const levels = {
  INFO: '消息',
  WARNING: '警告',
  ERROR: '错误',
};

class OperateLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // 弹出框
      loading: false,
      logList: [], // 存储数据
      progress: 0, // 进度条
      keyword: '', // 关键字
      currPage: 1,
      total: -1,
      total_nums: -1,
      categoryData: {}, // 处理后的层级数据格式
      startValue: null,
      endValue: null,
      start: '',
      end: '',
      endOpen: false,
      pageSize: 50
    };
  }

  componentDidMount() {//初始化载入数据
    this.searchReslut();
  }

  searchReslut() { // 搜索结果
    const { keyword, startValue, endValue, currPage, pageSize } = this.state;
    this.setState({
      loading: true,
    });
    fetch(URL + `/get_user_operation_log?keyword=${keyword}&&start=${startValue ? formatTime(startValue) : null}&&end=${endValue ? formatTime(endValue) : null}&&current_page=${currPage}&&page_limit=${pageSize}`, {
      method: 'get',
      headers: {
        Authorization: localStorage.token,
      },
    })
      .then(response => response.json())
      .then((res) => {
        this.setState({
          logList: res.response,
          loading: false,
          total_nums: res.total_nums,
          total: res.total_nums >= 0 ? res.total_nums : res.total_pages * pageSize
        });
      }).catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onStartChange = (value) => {
    this.setState({
      startValue: value,
    }, this.searchReslut);
  }

  onEndChange = (value) => {
    this.setState({
      endValue: value,
    }, this.searchReslut);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  handlePagination = (current) => {
    this.setState({
      currPage: current
    }, this.searchReslut);
  }

  renderColorDiv(level) {
    let color = '';

    switch (level) {
      case 'INFO':
        color = '#4f82c4';
        break;
      case 'WARNING':
        color = '#eca36e';
        break;
      case 'ERROR':
        color = '#a00303';
        break;
      default:
        break;
    }

    return <div style={{ backgroundColor: color, width: 11, height: 15 }} />;
  }

  render() {
    const { startValue, endValue, endOpen, logList } = this.state;
    return (
      <div style={{ backgroundColor: 'white', width: 750, margin: '50px auto 0' }}>
        <div style={{ margin: '10px 0', ...flexRow, alignItems: 'flex-start' }}>
          <div>
            <div>
              <Search
                placeholder="搜索"
                style={{ width: 200, marginRight: 20 }}
                onSearch={(value) => {
                  this.setState({ keyword: value }, () => {
                    this.searchReslut();
                  });
                }}
              />
              <DatePicker
                disabledDate={this.disabledStartDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={startValue}
                placeholder="开始时间"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />
              &nbsp;-&nbsp;
              <DatePicker
                disabledDate={this.disabledEndDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={endValue}
                placeholder="结束时间"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
            </div>
            <div style={{ fontSize: 12, color: '#9a9a9a', marginTop: 10, marginLeft: 5, display: `${this.state.total_nums < 0 ? 'none' : 'block'}` }}>{`找到约 ${this.state.total_nums} 条结果`}</div>
          </div>
          <div style={{ ...flexRow, width: 170 }}>
            <div style={{ ...flexRow, flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#4f82c4', width: 36, height: 10 }} />
              <span style={{ fontSize: 14, color: '#6c6c6c' }}>消息</span>
            </div>
            <div style={{ ...flexRow, flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#eca36e', width: 36, height: 10 }} />
              <span style={{ fontSize: 14, color: '#6c6c6c' }}>警告</span>
            </div>
            <div style={{ ...flexRow, flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#a00303', width: 36, height: 10 }} />
              <span style={{ fontSize: 14, color: '#6c6c6c' }}>错误</span>
            </div>
          </div>
        </div>
        <Spin
          size={'large'}
          spinning={this.state.loading}
          delay={500}
        >
          <div style={{ marginTop: 30 }}>
            {
              logList.map((e =>
                <div
                  key={e._id}
                  style={{ ...flexRow, justifyContent: 'flex-start', alignItems: 'flex-start', borderBottom: '1px solid #dcdcdc', padding: '30px 0' }}
                >
                  <div style={{ width: 31 }}>
                    {this.renderColorDiv(e.log_level)}
                  </div>
                  <div style={{ ...flexRow, flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <div
                      style={{ lineHeight: 1, fontSize: 14, color: '#6c6c6c' }}
                      role="button"
                    >{e.operation}
                      <div style={{ marginTop: 10 }}>
                        {get(e, 'request_detail.response.status') === '200 OK' ? '操作成功' : '操作失败'}
                      </div>
                    </div>
                    <div style={{ ...flexRow, width: '100%', marginTop: 20, fontSize: 12, color: '#9a9a9a' }}>
                      <div style={{ width: 300, ...flexRow }}>
                        <span>{e.foreign1[0].name}</span>
                        <span>{e.foreign2[0].name}</span>
                        <span>{levels[e.log_level]}</span>
                      </div>
                      <span>{showTime(e.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </Spin>
        <div className="mt-20" style={{ ...flexRow, flexDirection: 'row-reverse' }}>
          <Pagination
            showQuickJumper
            pageSize={this.state.pageSize}
            total={this.state.total}
            current={this.state.currPage}
            onChange={this.handlePagination}
          />
        </div>
      </div>
    );
  }
}

export default OperateLog;
