import {
  Form, Select, InputNumber, Switch, Radio, Pagination,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
import styles from './InputBlock.css';
const FormItem = Form.Item;
const Option = Select.Option;

class Nframe extends React.Component {
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

    var data = new FormData(document.getElementById('frameInfo'));
    data.append('deviceNo', dataT.deviceNo);
    data.append('cabinetNo', dataT.cabinetNo);
    data.append('location', dataT.location);
    data.append('deviceHeight', dataT.deviceHeight);
    data.append('deviceType', dataT.deviceType);
    data.append('brand', dataT.brand);
    data.append('typeSpec', dataT.typeSpec);
    data.append('unitNumber', dataT.unitNumber);
    data.append('systemName', dataT.systemName);
    data.append('functionPart', dataT.functionPart);
    data.append('section', dataT.section);
    data.append('officer', dataT.officer);
    data.append('contaction', dataT.contaction);

    fetch('http://127.0.0.1:5000/insertframe', {
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

  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Pagination defaultCurrent={1} total={2} />,
      <Form id="frameInfo" onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label="设备编号"
        >
          {getFieldDecorator('deviceNo', { 
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
          {getFieldDecorator('cabinetNo', { 
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
          label="安装位置（U位编号）"
        >
          {getFieldDecorator('location', { 
            rules: [{
              required: true,
              message: 'Please input location',
            }],
          })(
            <Input placeholder = "请输入安装位置（U位编号）" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备高度"

        >
          {getFieldDecorator('deviceHeight', { 
            rules: [{
              required: true,
              message: 'Please input cabinet No',
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
          {getFieldDecorator('deviceType', {
            rules: [
              { required: true, message: 'Please select device type!' },
            ],
          })(
            <Select placeholder="请选择设备类型">
              <Option value="11" disabled>机架式服务器</Option>
              <Option value="12" disabled>机架式存储设备</Option>
              <Option value="13">刀片式服务器机框</Option>
              <Option value="14">定制化服务器机框</Option>
              <Option value="15" disabled>小型机</Option>
              <Option value="16" disabled>网络交换机</Option>
              <Option value="17" disabled>路由器</Option>
              <Option value="18" disabled>其他网络设备</Option>
              <Option value="19" disabled>配线模块</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备品牌"

        >
          {getFieldDecorator('brand', { 
            rules: [{
              required: true,
              message: 'Please input device brand',
            }],
          })(
            <Input placeholder = "请输入设备品牌" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="规格型号"

        >
          {getFieldDecorator('typeSpec', { 
            rules: [{
              required: true,
              message: 'Please input type spec',
            }],
          })(
            <Input placeholder = "请输入规格型号" />
          )}
        </FormItem>        

        <FormItem
          {...formItemLayout}
          label="卡槽数量"
        >
          {getFieldDecorator('unitNumber', { initialValue: 0, 
            rules: [{ required: true,}]
          })(
            <InputNumber min={1} max={1000} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="所属系统名称"
        >
          {getFieldDecorator('systemName', { 
            rules: [{
              required: true,
              message: 'Please input system',
            }],
          })(
            <Input placeholder = "请输入所属系统名称" />
          )}
        </FormItem> 

        <FormItem
          {...formItemLayout}
          label="所属专业"

        >
          {getFieldDecorator('functionPart', { 
            rules: [{
              required: true,
              message: 'Please input functional part',
            }],
          })(
            <Input placeholder = "请输入所属专业" />
          )}
        </FormItem> 

        <FormItem
          {...formItemLayout}
          label="责任部门"

        >
          {getFieldDecorator('section', { 
            rules: [{
              required: true,
              message: 'Please input section',
            }],
          })(
            <Input placeholder = "请输入责任部门" />
          )}
        </FormItem> 

        <FormItem
          {...formItemLayout}
          label="责任人"

        >
          {getFieldDecorator('officer', { 
            rules: [{
              required: true,
              message: 'Please input officer',
            }],
          })(
            <Input placeholder = "请输入责任人" />
          )}
        </FormItem> 

        <FormItem
          {...formItemLayout}
          label="联系方式"

        >
          {getFieldDecorator('contaction', { 
            rules: [{
              required: true,
              message: 'Please input contaction',
            }],
          })(
            <Input placeholder = "请输入联系方式" />
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

const frame = Form.create()(Nframe);

export default frame