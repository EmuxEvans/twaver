import request from '../utils/request';

export async function getAllDevice() {
  return request('/getalldevice');
}

export async function getAllCabinet() {
  return request('/getallcabinet');
}
