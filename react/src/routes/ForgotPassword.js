import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './LoginForm.css';
import { Form, Icon, Input, Button, Checkbox} from 'antd';
const FormItem = Form.Item;


class NormalForgotForm extends React.Component{
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
      <div style={{padding: '200px 50px', width:'400px', margin:"0 auto"}}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userEmail', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="mail" style={{fontSize: 13}} />} type="email" placeholder="Email" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('verificationCode', {
            rules: [{ required: true, message: 'Please input the verification code!' }],
            })(
              <Input prefix={<Icon type="safety" style={{fontSize: 13}} />} type="text" placeholder="Verification Code" />
            )}
          </FormItem>
          <FormItem>  
            <Button type="primary" htmlType="submit" className="login-form-button">
              Password Retrieval
            </Button>
            <a> send verification code!</a>
          </FormItem>
        </Form>
      </div>
    );
  }
};

const ForgotForm = Form.create()(NormalForgotForm);
export default connect()(ForgotForm) ;


