import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import indexStyles from '../index.css';
import styles from './IndexPage.css';
import { Row, Col, Form } from 'antd';
import Sider from '../components/Sider';

function HomePage({ children, location }) {
  return (
    <div className={indexStyles.pt_50}>
      <Row className={styles.row}>
        <Col span={5}><Sider location={location} /></Col>
        <Col span={19}>
          {children}
        </Col>
      </Row>
    </div>
  );
}
export default HomePage;
