import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import RoomView3dComponent from '../../components/RoomView/RoomView3d';

function RoomView3d() {
  return (
    <div className={styles.room_view}>
      <RoomView3dComponent />
    </div>
  );
}

export default connect()(RoomView3d);
