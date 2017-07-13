import React, { Component } from 'react';

import { getDeviceData, getRackData } from './Fetch';
import dataJson from './modelData';
import demo from './demo';

const deviceData = [];

function setDeviceData(response) {
  demo.serverRealTimeData = handleDeviceData(response);
  demo.serverRealTimeData.forEach((element) => {
    const obj = {
      type: element.category,
      parentId: element.cabinetNumbering,
      id: element.Numbering,
      height: `${element.height}U`,
      power: parseInt(element.ratedPower, 10),
      uId: element.uNumbering,
      on: element.on,
    };

    deviceData.push(obj);
  });
}

function setRackData(response) {
  demo.cabinet = handleData(response);
  const racks = dataJson.objects.find(e => e.type === 'racks');
  demo.cabinet.forEach((e, i) => {
    const client = {};
    client.id = e.Numbering;
    client.totalU = e.uNumber;
    client.totalPower = e.thresholdPowerLoad;
    racks.clients.push(client);
  });

  dataJson.objects.splice(dataJson.objects.findIndex(e => e.type === 'racks'), 1, racks);
}

function handleData(data) {
  return Object.keys(data).map((key) => {
    return Object.assign(data[key], {
      Numbering: key,
      serverData: demo.serverRealTimeData.filter(ele => ele.cabinetNumbering === key),
    });
  });
}

function handleDeviceData(data) {
  const response = [];
  Object.keys(data).forEach((key) => {
    if (data[key].onCabinet !== '0') {
      const startPosition = getStringNumber(data[key].startPosition);
      const endPosition = getStringNumber(data[key].endPosition);
      response.push(Object.assign(data[key], {
        uNumbering: `${startPosition}U-${endPosition}U`,
        Numbering: key,
      }));
    }
  });

  return response;
}

function getStringNumber(number) {
  const num = parseInt(number, 10);
  if (num && typeof num === 'number') {
    if (num >= 10) {
      return `${num}`;
    }
    return `0${num}`;
  }
}

class RoomView3d extends Component {
  constructor(props) {
    super(props);
    this.mainDivId = 'room-view-3d';
  }

  componentDidMount() {
    getDeviceData()
      .then((res) => {
        setDeviceData(res);
      })
      .then(() => {
        return getRackData();
      })
      .then((res) => {
        setRackData(res);
      })
      .then(() => {
        demo.init(this.mainDivId, dataJson, deviceData);
      });
  }

  componentWillUnmount() {
    document.getElementById(this.mainDivId).remove();
  }

  render() {
    return (
      <div>
        <div id={this.mainDivId} style={{ width: 1000, height: 600, position: 'relative' }} />
      </div>
    );
  }
}

export default RoomView3d;
