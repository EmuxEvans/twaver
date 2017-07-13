import React from 'react';
import { connect } from 'dva';
import { Input, Form, Button } from 'antd';
const FormItem = Form.Item;

class NaddRole extends React.Component{
	constructor(props) {
		super(props)
	}

	handleSubmit = (e) => {
        console.log('Received values of form: ', values);
  	}

	render() {
		const formItemLayout = {
      		labelCol: { span: 6 },
      		wrapperCol: { span: 14 },
    	};

		return (
			<Form onSubmit={this.handleSubmit}>
			<br />
			<br />			
				<FormItem {...formItemLayout}>
					<Input placeholder="Input the role" />
				</FormItem>
				<FormItem wrapperCol={{ span: 12, offset: 6 }}>
					<Button type="primary" htmlType="submit">Submit</Button>
				</FormItem>
			</Form>
		);
	}
}

const AddRole = Form.create()(NaddRole);
export default AddRole