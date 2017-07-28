import { getPartOfPathname } from './handleRoute';
import constants from '../constants';

const allAuth = constants.auth;

export function getAuth(props) {
  return getPartOfPathname(props, -2);
}

export function checkAuth(props, operation, auth = allAuth.reviewer) {
  if (operation && auth.includes(getAuth(props))) {
    return operation();
  }
  return getAuth(props) === auth;
}
