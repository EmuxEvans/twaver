import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} >
      
      	<Route path="/serverdevice" component={require('./routes/InputServerDevice.js')} />
      	<Route path="/serverframe" component={require('./routes/InputServerFrame.js')} />
      	<Route path="/servermodule" component={require('./routes/InputServerModule.js')} />
        <Route path="/deldevice" component={require('./routes/DeleteServer.js')} />
      	<Route path="/onandoff" component={require('./routes/OnAndOff.js')} />
      	<Route path="/upanddown" component={require('./routes/UpAndDown.js')} />
      	<Route path="/threshold" component={require('./routes/SetThreshold.js')} />

      </Route>
      
    </Router>
  );
}

export default RouterConfig;

