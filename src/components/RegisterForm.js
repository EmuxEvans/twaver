import { Button, Form, Input, Modal, Select } from 'antd';
import React from 'react';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

let NregisterForm = React.createClass({
  getInitialState() {
    return { visible: false };
  },

  handleSubmit() {
    console.log(this.props.form.getFieldsValue());
    this.hideModal();
  },

  showModal() {
    this.setState({ visible: true });
  },

  hideModal() {
    this.setState({ visible: false });
  },

  handleChange(value) {
    console.log(`selected ${value}`);
  },

  render() {
    const { getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    
    return (
      <div id="registerForm">
        Or <a onClick={this.showModal}>Create an account!</a>
        <Modal title="login" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              label="Username"
            >
              <Input {...getFieldProps('username', {})} type="text" autoComplete="off" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Password"
            >
              <Input {...getFieldProps('password', {})} type="password" autoComplete="off" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Role"
            >
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a role"
                optionFilterProp="children"
                onChange={this.handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="other">User</Option>              
                <Option value="system">Admin: System</Option>
                <Option value="planning">Admin: Planning</Option>
                <Option value="operation">Admin: Operation</Option>
                <Option value="resource">Admin: Resource</Option>
                <Option value="requirement">Admin: Requirement</Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
});

const registerForm = createForm()(NregisterForm);
export default registerForm