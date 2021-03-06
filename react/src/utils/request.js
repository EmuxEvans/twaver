import fetch from 'dva/fetch';
import constants from '../constants';

const URL = constants.url;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {Object} [options] The options we want to pass to "fetch"
 * @return {Object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(URL + url, options)
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
