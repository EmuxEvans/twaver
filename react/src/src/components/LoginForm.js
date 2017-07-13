import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './LoginForm.css';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
const FormItem = Form.Item;


class NormalLoginForm extends React.Component{
  constructor(props) {
  	super(props);
  	this.state = { visible: false }
  }

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
    return (
    
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{fontSize: 13}} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{fontSize: 13}} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot"><Link to = "forgotPsw" target="_blank">Forgot password</Link></a>
        </FormItem>
        <FormItem>  
          <Button type="primary" htmlType="submit" className="login-form-button"><Link to ="sahomepage">
            Log in
          </Link></Button>
        </FormItem>
      </Form>
    
    );
  }
};

const LoginForm = Form.create()(NormalLoginForm);
export default connect()(LoginForm) ;