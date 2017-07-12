import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
//import styles from './IndexPage.css';
import { Row, Col, Form } from 'antd';
import Sider from '../components/Sider';

        /*
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb>
         */
//{this.props.children || 'content area'}
class NhomePage extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <br />
        <br />
        <Row style={{width:'1000px',margin:'0 auto'}}>
          <Col span={6}><Sider /></Col>
          <Col span={18}>
            <br />
            {this.props.children || 'content'}
          </Col>
        </Row>
      </div>
    )
  }
};

const homePage = Form.create()(NhomePage);
export default homePage