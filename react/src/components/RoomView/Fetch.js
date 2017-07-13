import constants from '../../constants';

const URL = constants.url;

function getData(url) {
  return fetch(URL + url, {
    method: 'get',
  })
    .then(res => res.json());
}

function getRackData() {
  return getData('/getallcabinet');
}

function getDeviceData() {
  return getData('/getalldevice');
}

export {
  getRackData,
  getDeviceData,
};
