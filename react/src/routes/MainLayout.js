import React from 'react';
import { Row, Col } from 'antd';
import Sider from '../components/Sider';
import styles from './IndexPage.css';

function MainLayout({ children, location }) {
  return (
    <div>
      <Row className={styles.row}>
        <Col span={5}><Sider location={location} /></Col>
        <Col span={19}>
          {children}
        </Col>
      </Row>
    </div>
  );
}

export default MainLayout;
