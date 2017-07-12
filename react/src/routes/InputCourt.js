import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import styles from './InputCourt.css';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Nsite extends React.Component {
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
        >
          {getFieldDecorator('siteName', { 
          	rules: [{
          		required: true,
          		message: 'Please input site name',
          	}],
          })(
            <Input placeholder = "请输入局站名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="街道名称"
        >
          {getFieldDecorator('siteAdd1', { 
            rules: [{
              required: true,
              message: 'Please input site address',
            }],
          })(
            <Input placeholder = "请输入街道名称（地址）" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="门牌号"
        >
          {getFieldDecorator('siteAdd1', { 
            rules: [{
              required: true,
              message: 'Please input house number',
            }],
          })(
            <Input placeholder = "请输入门牌号（地址）" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="局站编码"
        >
          {getFieldDecorator('siteCode', { 
            rules: [{
              required: true,
              message: 'Please input site code',
            }],
          })(
            <Input placeholder = "请输入局站编码" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="属性"
          hasFeedback
        >
          {getFieldDecorator('selectType', {
            rules: [
              { required: true, message: 'Please select room type!' },
            ],
          })(
            <Select placeholder="请选择局站属性">
              <Option value="11">核心机楼</Option>
              <Option value="12">一般机楼</Option>
              <Option value="13">专业机楼</Option>
              <Option value="14">接入点</Option>
              <Option value="15">无线基站</Option>
              <Option value="16">末梢网元</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="所属单位"
        >
          {getFieldDecorator('belongto', { 
            rules: [{
              required: true,
              message: 'belong to',
            }],
          })(
            <Input placeholder = "请输入所属单位" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="归属关系"
        >
          {getFieldDecorator('relationship', { 
            rules: [{
              required: true,
              message: 'relationship',
            }],
          })(
            <Input placeholder = "请输入归属关系" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="产权"
        >
          {getFieldDecorator('property right', { 
            rules: [{
              required: true,
              message: 'property right',
            }],
          })(
            <Input placeholder = "请输入产权关系" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="市电引入等级"
          hasFeedback
        >
          {getFieldDecorator('rank', {
            rules: [
              { required: true, message: 'Please select rank' },
            ],
          })(
            <Select placeholder="请选择市电引入等级">
              <Option value="21">110kV</Option>
              <Option value="22">35kV</Option>
              <Option value="23">20kV</Option>
              <Option value="24">10kV</Option>
              <Option value="25">0.4kV</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="引入路数"
        >
          {getFieldDecorator('numberchannel', { initialValue: 1, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={1000} /> 
          )}
        </FormItem>        

        <FormItem
          {...formItemLayout}
          label="电力总容量"
        >
          {getFieldDecorator('totalcapacity', { initialValue: 1, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={1000} /> 
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="局站总面积"
        >
          {getFieldDecorator('sitearea', { initialValue: 500, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={10000} /> 
          )}平方米
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="总建筑面积"
        >
          {getFieldDecorator('totalarea', { initialValue: 5000, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={10000} /> 
          )}平方米
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

const site = Form.create()(Nsite);

export default site