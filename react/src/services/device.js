import request from '../utils/request';

export async function getAllDevice() {
  return request('/getalldevice');
}

export async function addDevice(body) {
  return request('/insertdevice', {
    method: 'post',
    body,
  });
}

export async function deleteDevice(body) {
  return request('/deletedevice', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function findPosition(id) {
  return request(`/findposition?serverNumbering=${id}`);
}

export async function onCabinet(body) {
  return request('/oncabinet', {
    method: 'post',
    body,
  });
}

export async function offCabinet(body) {
  return request('/offcabinet', {
    method: 'post',
    body,
  });
}

export async function onAndOff(body) {
  return request('/onandoff', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
