import {
  Form, Select, InputNumber, Switch, Radio, Pagination,
  Slider, Button, Upload, Icon, message, Input
} from 'antd';
// import styles from './InputBlock.css';
const FormItem = Form.Item;
const Option = Select.Option;

class Nmodule extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var dataT;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dataT = values;
      }
    });

    var data = new FormData(document.getElementById('moduleInfo'));
    data.append('unitNo', dataT.unitNo);
    data.append('frameNo', dataT.frameNo);
    data.append('brand', dataT.brand);
    data.append('typeSpec', dataT.typeSpec);

    fetch('http://127.0.0.1:5000/insertmodule', {
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
      <Form id="moduleInfo" onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label="卡槽编号"
        >
          {getFieldDecorator('unitNo', { 
          	rules: [{
          		required: true,
          		message: 'Please input unit No',
          	}],
          })(
            <Input placeholder = "请输入卡槽编号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="所属机框编号"
        >
          {getFieldDecorator('frameNo', { 
            rules: [{
              required: true,
              message: 'Please input frame No',
            }],
          })(
            <Input placeholder = "请输入所属机框编号" />
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
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const nmodule = Form.create()(Nmodule);

export default nmodule