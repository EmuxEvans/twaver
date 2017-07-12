import {
  Form, Select, InputNumber, Switch, Radio, Pagination,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import PropTypes from 'prop-types';
import styles from './InputBlock.css';
import $ from 'jquery';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var URL = 'http://127.0.0.1:5000';

class Ndevice extends React.Component {

  constructor (props){
    super(props);

    this.state={
      serverNumbering: [],
      cabinetNumbering: [],
      uNumbering: [],
      height: [],
      category: [],
      responsible: [],
      ratedPower: [],
      actualPowerLoad: [],
      actualTemperature: [],
      thresholdTemperature: [],
      onCabinet: [],
      on: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var dataT;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dataT = values;
      }
      else {
        return;
      }
    });

    var data = new FormData(document.getElementById('serverInfo'));
    data.append('Numbering', dataT.Numbering);
    data.append('cabinetnumbering', dataT.cabinetnumbering);
    data.append('ratedpower', dataT.ratedpower);
    data.append('height', dataT.height);
    data.append('category', dataT.category);
    data.append('responsible', dataT.responsible);
    data.append('thresholdtemperature', dataT.thresholdtemperature);


    fetch('http://127.0.0.1:5000/insertdevice', {
      method: 'POST',
      mode: 'cors',
      header: {
        "Content-Type": 'application/json',
        'Accept': 'application/json'
      },
      body: data
    })
    .then(function(resp) {
      if(resp.ok) {
        console.log("success RESP");
      }
    });

/*
    fetch('http://127.0.0.1:5000/search', {
      method: 'GET',
      mode: 'cors',
      dataType: 'json'
    })
    .then(resp => resp.json())
    .then(resp => {
      this.setState({
        serverNumbering: resp.serverNumbering,
        cabinetNumbering: resp.cabinetNumbering,
        uNumbering: resp.uNumbering,
        height: resp.height,
        category: resp.category,
        responsible: resp.responsible,
        ratedPower: resp.ratedPower,
        actualPowerLoad: resp.actualPowerLoad,
        actualTemperature: resp.actualTemperature,
        thresholdTemperature: resp.thresholdTemperature,
        onCabinet: resp.onCabinet,
        on: resp.on,
      })
    })
    .catch(error => console.log(error))
*/    
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
            <Input placeholder = "请输入设备编号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="所属机柜编号"
        >
          {getFieldDecorator('cabinetnumbering', { 
            rules: [{
              required: true,
              message: 'Please input cabinet No',
            }],
          })(
            <Input placeholder = "请输入所属机柜编号" />
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