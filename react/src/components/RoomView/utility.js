export function sortDevice(deviceData) {
  return deviceData.sort((preElement, currElement) => {
    return parseInt(preElement.uId, 10) - parseInt(currElement.uId, 10);
  });
}
