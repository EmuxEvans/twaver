import React, { Component } from 'react';
import { Spin, Button, InputNumber } from 'antd';
import _ from 'lodash';

import constants from '../../constants';
import * as utility from './utility';
import { getAllCabinet, getAllDevice } from '../../services/app';
import dataJson from './modelData';
import demo from './demo';
import styles from './index.css';

const URL = constants.url;

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
      isInit: false,
      power: 0,
      height: 0,
    };
    this.mainDivId = 'room-view-3d';
  }

  componentDidMount() {
    this.getDataInitDemo();
  }

  componentWillUnmount() {
    document.getElementById(this.mainDivId).remove();
  }

  getDataInitDemo() {
    const deviceData = [];
    this.setState({
      loading: true,
    });
    return getAllDevice()
      .then((res) => {
        setDeviceData(res, deviceData);
      })
      .then(() => {
        return getAllCabinet();
      })
      .then((res) => {
        setRackData(res);
        demo.filterRack = Object.keys(res);
      })
      .then(() => {
        this.setState({
          loading: false,
          isInit: true,
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

  handlePowerChange = (value) => {
    this.setState({
      power: value,
    });
  }

  handleHeightChange = (value) => {
    this.setState({
      height: value,
    });
  }

  searchPosition = () => {
    if (this.state.isInit) {
      fetch(`${URL}/find_position_by_power_height?power=${this.state.power}&&height=${this.state.height}`, {
        method: 'get',
      })
        .then(res => res.json())
        .then((res) => {
          demo.resetView(demo.network);
          demo.filterRack = Object.keys(res);
          demo.toggleSpaceView(demo.network);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  formatter = (value) => {
    return `${_.toInteger(value)}`;
  }

  parser = (value) => {
    return _.toInteger(value);
  }

  render() {
    return (
      <div>
        <div className={styles.room_search}>
          功率（W）：
          <InputNumber
            className={styles.room_select}
            defaultValue={1}
            min={1}
            formatter={this.formatter}
            parser={this.parser}
            onChange={this.handlePowerChange}
          />
          高度（U）：
          <InputNumber
            className={styles.room_select}
            defaultValue={1}
            min={1}
            max={42}
            formatter={this.formatter}
            parser={this.parser}
            onChange={this.handleHeightChange}
          />
          <Button onClick={this.searchPosition}>查询空位</Button>
        </div>
        <Spin spinning={this.state.loading} delay={300} size="large">
          <div id={this.mainDivId} style={{ width: 1000, height: 600, position: 'relative' }} />
        </Spin>
      </div>
    );
  }
}

export default RoomView3d;
