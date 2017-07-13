import * as getData from '../services/app';

export default {
  namespace: 'app',
  state: {
    allDevice: [],
    allCabinet: [],
  },
  reducers: {
    getCabinetAndDevice(state, { payload: { allDevice, allCabinet } }) {
      return { ...state, allDevice, allCabinet };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data: allDevice } = yield call(getData.getAllDevice);
      const { data: allCabinet } = yield call(getData.getAllCabinet);

      yield put({
        type: 'getCabinetAndDevice',
        payload: {
          allDevice,
          allCabinet,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/roomView3d') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
