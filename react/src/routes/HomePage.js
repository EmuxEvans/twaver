import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link } from 'dva/router';
//import styles from './IndexPage.css';
import { Row, Col, Form } from 'antd';
import Sider from '../components/Sider';



class HomePage extends Component {
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

export default HomePage




