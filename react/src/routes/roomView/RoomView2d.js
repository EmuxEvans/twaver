import React from 'react';
import { connect } from 'dva';
import styles from './index.css';

import room2d from '../../assets/room2D.min.png';

function RoomView2d() {
  return (
    <div className={styles.room_view}>
      <img className={styles.room_2d} src={room2d} alt="room2D" />
    </div>
  );
}

export default connect()(RoomView2d);
