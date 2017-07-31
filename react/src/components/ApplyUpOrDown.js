import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button, message, Modal } from 'antd';
import FormItem from './FormItem';
import utility, { _ } from '../utils/utility';
import * as fetchDevice from '../services/device';
import indexStyles from '../index.less';
import styles from './Apply.less';

const Option = Select.Option;

class ApplyUpOrDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applyType: 'on',
      cabinets: {},
      Numbering: undefined,
      selectedCabinet: undefined,
    };
  }

  getCandidatePlace(Numbering) {
    fetchDevice.findPosition(Numbering)
      .then((res) => {
        const cabinetKeys = Object.keys(res);
        this.setState({
          cabinetKeys,
          cabinets: res,
        });
      });
  }

  applyOnCabinet = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const body = new FormData();
        body.append('serverNumbering', values.Numbering);
        body.append('cabinetNumber', values.cabinetNumbering);
        body.append('startPosition', values.startPosition);
        body.append('endPosition', values.endPosition);
        fetchDevice.onCabinet(body)
          .then(() => {
            message.success('申请已发送，等待审核');
            this.props.toggle();
            this.props.refetch();
          })
          .catch(() => {
            message.error('操作失败');
          });
      }
    });
  }

  applyOffCabinet = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const body = new FormData();
        body.append('serverNumbering', values.Numbering);

        fetchDevice.offCabinet(body)
          .then((res) => {
            if (res.status === 'success') {
              message.success('申请已发送，等待审核');
            } else if (res.status === 'reviewing') {
              message.success('成功下柜');
            } else if (res.status === 'onfalse') {
              message.error('该设备未上柜，无法下柜');
            }
            this.props.toggle();
            this.props.refetch();
          })
          .catch(() => {
            message.error('操作失败');
          });
      }
    });
  }

  selectApplyType = (value) => {
    this.setState({
      applyType: value,
    });
  }

  selectNumbering = (value) => {
    this.setState({
      Numbering: value,
    });
    if (this.state.applyType === 'on') {
      this.getCandidatePlace(value);
    }
  }

  selectCabinet = (value) => {
    this.setState({
      selectedCabinet: value,
    });
  }

  renderNumberingOptions() {
    let options = [];
    const applyType = this.state.applyType;
    if (applyType === 'on') {
      options = options.concat(this.props.offData);
    } else {
      options = options.concat(this.props.onData, this.props.reviewingData);
    }
    return options.map((option) => {
      const Numbering = option.Numbering;
      const cabinetNumbering = option.cabinetNumbering;
      const height = option.height;
      return <Option value={Numbering} key={Numbering}>{`${Numbering}（${applyType === 'on' ? `高度：${height}U` : `机柜：${cabinetNumbering}`}）`}</Option>;
    });
  }

  renderCabinetOptions() {
    const cabinets = this.state.cabinets;
    return Object.keys(cabinets).map((cabinet) => {
      const cabinetNumbering = cabinets[cabinet].cabinetNumbering;
      const position = cabinets[cabinet].position.map((element) => {
        return `${element[0]}-${element[1]}`;
      });
      return (
        <Option
          value={cabinetNumbering}
          key={cabinetNumbering}
        >
          {`${cabinetNumbering}（空位：${position.join('；')}）`}
        </Option>
      );
    });
  }

  renderPositionOptions() {
    const { cabinets, selectedCabinet } = this.state;
    const position = _.get(cabinets, `[${selectedCabinet}].position`, []);
    const options = [];
    position.forEach((element) => {
      _.range(element[0], element[1] + 1).forEach((num) => {
        options.push(<Option value={`${num}`} key={`${num}`}>{`${num}`}</Option>);
      });
    });
    return options;
  }

  renderUpApplyFormItem() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.applyType === 'on') {
      return (
        [<FormItem
          label="机柜编号："
          key="cabinetNumbering"
        >
          {getFieldDecorator('cabinetNumbering', {
            rules: [{
              required: true,
            }],
          })(
            <Select className={styles.select} onChange={this.selectCabinet}>
              {this.renderCabinetOptions()}
            </Select>)}
        </FormItem>,
        <FormItem
          label="起始位置："
          key="startPosition"
        >
          {getFieldDecorator('startPosition', {
            rules: [{
              required: true,
            }],
          })(
            <Select className={styles.select}>
              {this.renderPositionOptions()}
            </Select>)}
        </FormItem>,
        <FormItem
          label="结束位置："
          key="endPosition"
        >
          {getFieldDecorator('endPosition', {
            rules: [{
              required: true,
            }],
          })(
            <Select className={styles.select}>
              {this.renderPositionOptions()}
            </Select>)}
        </FormItem>]
      );
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const applyType = this.state.applyType;
    return (
      <Modal
        key={2}
        visible={this.props.show}
        title="上/下柜申请"
        footer={null}
        onCancel={this.props.toggle}
      >
        <div className={`${indexStyles.all_form_div} ${styles.normal}`}>
          <Form onSubmit={applyType === 'on' ? this.applyOnCabinet : this.applyOffCabinet}>
            <div>
              <FormItem
                label="申请类型："
              >
                {getFieldDecorator('applyType', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: 'on',
                })(
                  <Select className={styles.select} onChange={this.selectApplyType}>
                    <Option value="on">上柜</Option>
                    <Option value="off">下柜</Option>
                  </Select>)}
              </FormItem>
              <FormItem
                label="设备编号："
              >
                {getFieldDecorator('Numbering', {
                  rules: [{
                    required: true,
                  }],
                })(
                  <Select className={styles.select} onChange={this.selectNumbering}>
                    {this.renderNumberingOptions()}
                  </Select>)}
              </FormItem>
              {this.renderUpApplyFormItem()}
            </div>
            <div className={`${indexStyles.pt_20} ${indexStyles.pb_20} ${indexStyles.ta_c}`}>
              <Button htmlType="submit" type="primary" className={indexStyles.mr_20}>确 定</Button>
              <Button htmlType="button" type="primary" onClick={this.props.toggle}>取 消</Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

ApplyUpOrDown.propTypes = {
  show: PropTypes.bool,
  onData: PropTypes.array,
  offData: PropTypes.array,
  reviewingData: PropTypes.array,
  toggle: PropTypes.func,
  refetch: PropTypes.func,
};

export default Form.create()(ApplyUpOrDown);
