import constants from '../constants';

const category = constants.category;

export function translate(key, selectedDict) {
  const dict = constants[selectedDict] || { ...category };

  const dictionary = {
    ...dict,
    'applyType': '申请类型',
  };

  if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
    return dictionary[key];
  }
  return key;
}
