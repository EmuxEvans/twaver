import request from '../utils/request';

export async function getAllDevice() {
  return request('/getalldevice', { method: 'get' });
}

export async function getAllCabinet() {
  return request('/getallcabinet', { method: 'get' });
}
