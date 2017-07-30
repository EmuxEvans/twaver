import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button, message, Modal } from 'antd';
import FormItem from './FormItem';
import utility, { _ } from '../utils/utility';
import * as fetchDevice from '../services/device';
import indexStyles from '../index.less';
import styles from './Apply.less';

const Option = Select.Option;

class ApplyOnOrOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applyType: 'on',
      cabinets: {},
      Numbering: undefined,
      selectedCabinet: undefined,
    };
  }

  applyOn = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          serverNumbering: values.Numbering,
          onOrOff: values.applyType,
        };

        fetchDevice.onAndOff(data)
          .then((res) => {
            if (res.status === 'success') {
              message.success('申请已发送，等待审核');
            } else if (res.status === 'reviewing') {
              return message.error('该设备正在上柜审核中，无法上电');
            } else if (res.status === 'onfalse') {
              return message.error('该设备未上柜，无法上电');
            }
            this.props.toggle();
            this.props.refetch();
          });
      }
    });
  }

  applyOff = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          serverNumbering: values.Numbering,
          onOrOff: values.applyType,
        };

        fetchDevice.onAndOff(data)
          .then((res) => {
            if (res.status === 'success') {
              message.success('申请已发送，等待审核');
            } else if (res.status === 'reviewing') {
              message.success('成功下柜');
            } else if (res.status === 'onfalse') {
              return message.error('该设备未上柜，无法下柜');
            }
            this.props.toggle();
            this.props.refetch();
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
      const ratedPower = option.ratedPower;
      return <Option value={Numbering} key={Numbering}>{`${Numbering}（${applyType === 'on' ? `功率：${ratedPower}W` : `机柜：${cabinetNumbering}`}）`}</Option>;
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
          <Form id="apply-up-or-down" onSubmit={applyType === 'on' ? this.applyOn : this.applyOff}>
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
                    <Option value="on">上电</Option>
                    <Option value="off">下电</Option>
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

ApplyOnOrOff.propTypes = {
  show: PropTypes.bool,
  onData: PropTypes.array,
  offData: PropTypes.array,
  reviewingData: PropTypes.array,
  toggle: PropTypes.func,
  refetch: PropTypes.func,
};

export default Form.create()(ApplyOnOrOff);
