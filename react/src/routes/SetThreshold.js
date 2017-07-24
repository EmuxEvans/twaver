import React, { Component } from 'react';
import { Table, Input, Popconfirm, message } from 'antd';
import * as fetchCabinet from '../services/cabinet';

class EditableCell extends Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value;
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }

  render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    );
  }
}

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '机柜编号',
      dataIndex: 'cabinetNo',
      width: '30%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'cabinetNo', text),
    }, {
      title: '警报阈值',
      dataIndex: 'threshold',
      width: '30%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'threshold', text),
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].threshold;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(record.cabinetNo, index, 'save')}>保存</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(record.cabinetNo, index, 'cancel')}>
                    <span className="ant-divider" />
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                </span>
            }
          </div>
        );
      },
    }];
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchCabinet.getAllCabinet()
      .then((resp) => {
        const data = [];
        for (const i in resp) {
          const temp = {};
          temp.key = resp[i].cabinetNumbering;
          temp.cabinetNo = {
            value: resp[i].cabinetNumbering,
          };
          temp.threshold = {
            value: resp[i].thresholdPowerLoad,
            editable: false,
          };
          data.push(temp);
        }

        this.setState({
          data,
        });
      })
      .catch(error => console.log(error));
  }

  renderColumns(data, index, key, text) {
    const { editable, status } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell editable={editable} value={text} onChange={value => this.handleChange(key, index, value)} status={status} />);
  }

  handleChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }

  edit(index) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data });
  }

  editDone(numbering, index, type) {
    const { data } = this.state;
    let thresholdPower = 0;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
          thresholdPower = data[index].threshold.value;
        }
      });

      const formdata = new FormData();
      formdata.append('cabinetNumbering', numbering);
      formdata.append('thresholdPower', thresholdPower);

      fetchCabinet.setThreshold(formdata)
        .then((resp) => {
          if (resp.status === 'success') {
            message.success('阈值已修改');
          }
        })
        .catch(() => {
          message.warning('修改失败');
        });
    });
  }

  render() {
    const { data } = this.state;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;
    return <Table bordered dataSource={dataSource} columns={columns} />;
  }
}

