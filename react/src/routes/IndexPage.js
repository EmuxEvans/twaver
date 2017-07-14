import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
//import styles from './IndexPage.css';
import { Row, Col, Form } from 'antd';
import Sider from '../components/Sider';

function HomePage({ children, location }) {
  return (
    <div>
      <br />
      <br />
      <Row style={{ width: '1000px', margin: '0 auto' }}>
        <Col span={6}><Sider location={location} /></Col>
        <Col span={18}>
          <br />
          {children}
        </Col>
      </Row>
    </div>
  );
}
export default HomePage;
