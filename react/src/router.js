import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import constants from './constants';
import IndexPage from './routes/IndexPage';

const auth = constants.auth;

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} >

        <IndexRedirect to="reviewer" />
        <Route path={`${auth.applicant}`} component={require('./routes/MainLayout')}>
          <IndexRedirect to="roomView3d" />
          <Route path="roomView3d" component={require('./routes/roomView/RoomView3d')} />
          <Route path="serverdevice" component={require('./routes/InputServerDevice')} />
          <Route path="deldevice" component={require('./routes/DeleteServer')} />
          <Route path="upanddown" component={require('./routes/UpAndDown')} />
          <Route path="onandoff" component={require('./routes/OnAndOff')} />
        </Route>
        <Route path={`${auth.reviewer}`} component={require('./routes/MainLayout')}>
          <IndexRedirect to="roomView3d" />
          <Route path="serverdevice" component={require('./routes/InputServerDevice')} />
          {/* <Route path="/serverframe" component={require('./routes/InputServerFrame')} /> */}
          {/* <Route path="/servermodule" component={require('./routes/InputServerModule')} /> */}
          <Route path="deldevice" component={require('./routes/DeleteServer')} />
          <Route path="onandoff" component={require('./routes/OnAndOff')} />
          <Route path="upanddown" component={require('./routes/UpAndDown')} />
          <Route path="threshold" component={require('./routes/SetThreshold')} />
          {/* <Route path="/roomView2d" component={require('./routes/roomView/RoomView2d')} /> */}
          <Route path="roomView3d" component={require('./routes/roomView/RoomView3d')} />
        </Route>

      </Route>

    </Router>
  );
}

export default RouterConfig;

