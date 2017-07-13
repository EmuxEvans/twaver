import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import styles from './InputBlock.css';
const FormItem = Form.Item;
const Option = Select.Option;

class Nblock extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
      <Form onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label="局站名称"
          hasFeedback
        >
          {getFieldDecorator('selectCourt', {
            rules: [
              { required: true, message: 'Please select the court!' },
            ],
          })(
            <Select placeholder="请选择对应局站名称">
              <Option value="1">No.1</Option>
              <Option value="2">No.2</Option>
              <Option value="3">No.3</Option>
              <Option value="4">No.4</Option>
              <Option value="5">No.5</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="机楼名称"
        >
          {getFieldDecorator('blockName', { 
          	rules: [{
          		required: true,
          		message: 'Please input block name',
          	}],
          })(
            <Input placeholder = "请输入机楼名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="机楼编码"
        >
          {getFieldDecorator('blockNumber', { 
            rules: [{
              required: true,
              message: 'Please input block number',
            }],
          })(
            <Input placeholder = "请输入机楼编码" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="局站形式"
          hasFeedback
        >
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: 'Please select the type!' },
            ],
          })(
            <Select placeholder="请选择机楼形式">
              <Option value="11">独立建筑</Option>
              <Option value="12">部分建筑</Option>
              <Option value="13">附属建筑</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="建筑形式"
          hasFeedback
        >
          {getFieldDecorator('builidingType', {
            rules: [
              { required: true, message: 'Please select the building type!' },
            ],
          })(
            <Select placeholder="请选择建筑结构">
              <Option value="21">框架结构</Option>
              <Option value="22">桶装结构</Option>
              <Option value="23">砖混结构</Option>
              <Option value="24">简易板房</Option>
              <Option value="25">室外机柜</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="占地面积"
        >
          {getFieldDecorator('inputarea', { initialValue: 500, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={10000} />
          )}平方米
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="建筑面积"
        >
          {getFieldDecorator('buildingarea', { initialValue: 500, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={10000} />
          )}平方米
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="层数"
        >
          {getFieldDecorator('input-floors', { initialValue: 5, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="各层层高"
        >
          {getFieldDecorator('input-height', { initialValue: 5, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}米
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="各层建筑面积"
        >
          {getFieldDecorator('floor-area', { initialValue: 5, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}平方米
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="机楼规划电力总容量"
        >
          {getFieldDecorator('input-load', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}kVA/kW
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="空调总容量"
        >
          {getFieldDecorator('cooling-load', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}kW
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const block = Form.create()(Nblock);

export default block