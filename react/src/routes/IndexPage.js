import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from '../index.css';
// import styles from './IndexPage.css';
import { Row, Col, Form } from 'antd';
import Sider from '../components/Sider';

function HomePage({ children, location }) {
  return (
    <div className={styles.pt_50}>
      <Row style={{ width: '1200px', margin: '0 auto' }}>
        <Col span={5}><Sider location={location} /></Col>
        <Col span={19}>
          {children}
        </Col>
      </Row>
    </div>
  );
}
export default HomePage;
