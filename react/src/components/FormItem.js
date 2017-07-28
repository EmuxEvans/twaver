import React from 'react';
import { Form } from 'antd';

export default function FormItem(props) {
  const labelCol = props.labelCol || { span: 4, offset: 3 };
  const wrapperCol = props.labelCol || { span: 16, offset: 1 };

  return (
    <Form.Item
      label={props.label}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
    >
      {props.children}
    </Form.Item>
  );
}
