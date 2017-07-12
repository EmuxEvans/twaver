import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import styles from './InputRoom.css';
const FormItem = Form.Item;
const Option = Select.Option;

class Nroom extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
            <Select placeholder="请选择局站名称">
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
          hasFeedback
        >
          {getFieldDecorator('selectBlock', {
            rules: [
              { required: true, message: 'Please select the block!' },
            ],
          })(
            <Select placeholder="请选择机楼名称">
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
          label="门牌号"
        >
          {getFieldDecorator('roomNo', { 
          	rules: [{
          		required: true,
          		message: 'Please input room number',
          	}],
          })(
            <Input placeholder = "请输入门牌号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="机房类别"
          hasFeedback
        >
          {getFieldDecorator('selectRoomType', {
            rules: [
              { required: true, message: 'Please select room type!' },
            ],
          })(
            <Select placeholder="请选择机房类别">
              <Option value="11">主机房</Option>
              <Option value="12">电力机房</Option>
              <Option value="13">配电机房</Option>
              <Option value="14">空调机房</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Load"
        >
          {getFieldDecorator('input-load', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={100} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Built-up area"
        >
          {getFieldDecorator('area', { 
            rules: [{
              required: true,
              message: 'Please input built up area',
            }],
          })(
            <Input placeholder = "Please input built-up area" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Upload plan"
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )}
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

const room = Form.create()(Nroom);

export default room