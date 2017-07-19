import React, { Component } from 'react';
import { Spin } from 'antd';

import * as utility from './utility';
import { getAllCabinet, getAllDevice } from '../../services/app';
import dataJson from './modelData';
import demo from './demo';

function setDeviceData(response, deviceData) {
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
  demo.cabinet = utility.sortByAttr(handleData(response), 'Numbering');
  const racks = dataJson.objects.find(e => e.type === 'racks');
  racks.clients = [];
  demo.temperatureData = [];
  demo.temperatureUpperLimit = 0;

  demo.cabinet.forEach((e, i) => {
    const client = {};
    client.id = e.Numbering;
    client.totalU = e.uNumber;
    client.totalPower = e.thresholdPowerLoad;
    racks.clients.push(client);

    const temperature = {};
    temperature.value = parseInt(e.actualTemperature, 10);
    temperature.x = racks.translates[i][0];
    temperature.y = racks.translates[i][2];
    demo.temperatureData.push(temperature);
    demo.temperatureUpperLimit += parseInt(e.thresholdCoolingLoad, 10);
  });

  demo.temperatureUpperLimit /= demo.cabinet.length;

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
    this.state = {
      loading: false,
    };
    this.mainDivId = 'room-view-3d';
  }

  componentDidMount() {
    const deviceData = [];
    this.setState({
      loading: true,
    });
    getAllDevice()
      .then(({ data: res }) => {
        setDeviceData(res, deviceData);
      })
      .then(() => {
        return getAllCabinet();
      })
      .then(({ data: res }) => {
        setRackData(res);
      })
      .then(() => {
        this.setState({
          loading: false,
        });
        demo.init(this.mainDivId, dataJson, deviceData);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    document.getElementById(this.mainDivId).remove();
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} delay={300} size="large">
          <div id={this.mainDivId} style={{ width: 1000, height: 600, position: 'relative' }} />
        </Spin>
      </div>
    );
  }
}

export default RoomView3d;
