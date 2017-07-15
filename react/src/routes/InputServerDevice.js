import {
  Form, Select, InputNumber, Switch, Radio, Pagination,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import PropTypes from 'prop-types';
// import styles from './InputBlock.css';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Ndevice extends React.Component {

  constructor (props){
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var dataT;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dataT = values;
      }
      else {
        return;
      }
    });

    var data = new FormData(document.getElementById('serverInfo'));
    data.append('Numbering', dataT.Numbering);
    data.append('ratedpower', dataT.ratedpower);
    data.append('height', dataT.height);
    data.append('category', dataT.category);
    data.append('responsible', dataT.responsible);
    data.append('thresholdtemperature', dataT.thresholdtemperature);

    fetch('http://127.0.0.1:5000/insertdevice', {
      method: 'POST',
      header: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
      },
      body: data
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp.status == "success")
        message.success('增加设备成功');
      else
        message.warning('设备编号已存在，增加失败');
    });   
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
      <Form id="serverInfo" onSubmit={this.handleSubmit}>
       <FormItem
          {...formItemLayout}
          label="设备编号" 
        >
          {getFieldDecorator('Numbering', { 
            rules: [{
              required: true,
              message: 'Please input device No',
            }],
          })(
            <Input placeholder = "请输入设备编号"  />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备高度"

        >
          {getFieldDecorator('height', { 
            rules: [{
              required: true,
              message: 'Please input device height',
            }],
          })(
            <Input placeholder = "请输入设备高度" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备类型"
          hasFeedback
        >
          {getFieldDecorator('category', {
            rules: [
              { required: true, message: 'Please select device type!' },
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
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="额定功率"
        >
          {getFieldDecorator('ratedpower', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={1000} />
          )}kW
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="阈值温度"
        >
          {getFieldDecorator('thresholdtemperature', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={1000} />
          )}C°
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="责任人"

        >
          {getFieldDecorator('responsible', { 
            rules: [{
              required: true,
              message: 'Please input officer',
            }],
          })(
            <Input placeholder = "请输入责任人" />
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

export default device