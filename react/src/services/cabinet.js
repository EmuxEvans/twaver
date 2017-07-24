import request from '../utils/request';

export async function getAllCabinet() {
  return request('/getallcabinet');
}

export async function setThreshold(body) {
  return request('/setthresholdvalue', {
    method: 'post',
    body,
  });
}
