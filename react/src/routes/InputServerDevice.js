import React, { Component } from 'react';
import {
  Form, Select, InputNumber, Switch, Radio, Pagination,
  Slider, Button, Upload, Icon, message, Input,
} from 'antd';
import PropTypes from 'prop-types';
import styles from '../index.css';
import * as fetchDevice from '../services/device';

const FormItem = Form.Item;
const Option = Select.Option;

class Ndevice extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const dataT = values;
        const data = new FormData(document.getElementById('serverInfo'));
        data.append('Numbering', dataT.Numbering);
        data.append('ratedpower', dataT.ratedpower);
        data.append('height', dataT.height);
        data.append('category', dataT.category);
        data.append('responsible', dataT.responsible);
        data.append('thresholdtemperature', dataT.thresholdtemperature);

        fetchDevice.addDevice(data)
          .then((resp) => {
            if (resp.status === 'success') {
              message.success('增加设备成功');
            } else {
              message.warning('设备编号已存在，增加失败');
            }
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.pt_20}>
        <Form id="serverInfo" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="设备编号"
          >
            {getFieldDecorator('Numbering', {
              rules: [{
                required: true,
                message: '请输入设备编号',
              }],
            })(
              <Input placeholder="请输入设备编号" />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="设备高度"
          >
            {getFieldDecorator('height', {
              rules: [{
                required: true,
                message: '请输入设备高度',
              }],
            })(
              <Input placeholder="请输入设备高度" />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="设备类型"
            hasFeedback
          >
            {getFieldDecorator('category', {
              rules: [
                { required: true, message: '请选择设备类型' },
              ],
            })(
              <Select placeholder="请选择设备类型">
                <Option value="11">机架式服务器</Option>
                <Option value="12">机架式存储设备</Option>
                <Option value="13" disabled>刀片式服务器机框</Option>
                <Option value="14" disabled>定制化服务器机框</Option>
                <Option value="15">小型机</Option>
                <Option value="16">网络交换机</Option>
                <Option value="17">路由器</Option>
                <Option value="18">其他网络设备</Option>
                <Option value="19">配线模块</Option>
              </Select>,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="额定功率"
          >
            {getFieldDecorator('ratedpower', {
              initialValue: 0,
              rules: [{ required: true }],
            })(
              <InputNumber min={1} max={1000} />,
            )}kW
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="阈值温度"
          >
            {getFieldDecorator('thresholdtemperature', {
              initialValue: 0,
              rules: [{ required: true }],
            })(
              <InputNumber min={1} max={1000} />,
            )}C°
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="责任人"
          >
            {getFieldDecorator('responsible', {
              rules: [{
                required: true,
                message: '请输入责任人',
              }],
            })(
              <Input placeholder="请输入责任人" />,
            )}
          </FormItem>

          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const device = Form.create()(Ndevice);

export default device;
