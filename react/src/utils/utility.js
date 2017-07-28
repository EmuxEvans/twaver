import _ from 'lodash';
import * as handleRoute from './handleRoute';
import * as checkAuth from './checkAuth';
import * as translate from './translate';

export default {
  ...handleRoute,
  ...translate,
  ...checkAuth,
};
export {
  _,
};
