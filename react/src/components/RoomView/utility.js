export function sortByAttr(deviceData, attribute) {
  return deviceData.sort((preElement, currElement) => {
    return parseInt(preElement[attribute], 10) - parseInt(currElement[attribute], 10);
  });
}

export function average(data) {
  return data.reduce((preValue, currValue) => {
    return preValue + currValue;
  }, 0) / data.lenght;
}
