import React from 'react';
import { connect } from 'dva';
import RoomView3dComponent from '../../components/RoomView/RoomView3d';

function RoomView3d() {
  return (
    <div>
      <RoomView3dComponent />
    </div>
  );
}

export default connect()(RoomView3d);
