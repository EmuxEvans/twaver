import _ from 'lodash';

export function getPartOfPathname(props, index = -1) {
  const pathnameArr = props.location.pathname.split('/');
  return _.nth(pathnameArr, index);
}
