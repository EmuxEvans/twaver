import constants from '../constants';

const category = constants.category;

export default function translate(key) {
  const dict = {
    ...category,
  };

  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    return dict[key];
  }
  return key;
}
