import * as deviceService from '../serviecs/device';

export default {
	namespace: 'device',
	state: {

	},

	reducers: {
		save( state, { payload: { data: list, total } }) {
			return { ...state, list, total };
		},
	},

	effects: {
		*fetch({ payload: { page }}, { call put }) {
			const { data, headers } yield call( deviceService.fetch, { page });
			yield put({ type: 'save', payload: { data, total: headers['x-total-count'] }});
		},
	},


}