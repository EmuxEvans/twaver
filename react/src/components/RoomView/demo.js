import Heatmap from 'heatmap.js';
import CameraFollow from './CameraFollow';
import inbuilts from './inbuilts';
import Overview3D from './Overview3D';
import createTooltip from './tooltip';
import styles from './index.css';
import constants from './constants';
import translate from '../../utils/translate';
import * as utility from './utility';

const size = constants.size;
const picMap = constants.picMap;
const translateDevice = constants.translateDevice;
const translateRack = constants.translateRack;
const solidColor = constants.solidColor;
const spaceColor = constants.spaceColor;

var demo = {
  LAZY_MIN: 1000,
  LAZY_MAX: 6000,
  CLEAR_COLOR: '#f8f8f8',
  RES_PATH: 'res',

  lastElement: null,
  htmlElement: null,
  timer: null,
  // isDialog: false,

  getRes(file) {
    return require(`../../assets/res/${file}`);
  },

  getEnvMap() {
    if (!demo.defaultEnvmap) {
      demo.defaultEnvmap = [];
      const image = demo.getRes('room.jpg');
      for (let i = 0; i < 6; i++) {
        demo.defaultEnvmap.push(image);
      }
    }
    return demo.defaultEnvmap;
  },

  // all registered object creaters.
  _creators: {},

  // all registered object filters.
  _filters: {},

  // all registered shadow painters.
  _shadowPainters: {},

  filterRack: [],

  resetData() {
    demo._creators = {};
    demo._filters = {};
    demo._shadowPainters = {};
    demo.lastElement = null;
    demo.timer = null;
    // demo.isDialog = false;
    inbuilts();
  },

  registerCreator(type, creator) {
    this._creators[type] = creator;
  },

  getCreator(type) {
    return this._creators[type];
  },

  registerFilter(type, filter) {
    this._filters[type] = filter;
  },

  getFilter(type) {
    return this._filters[type];
  },

  registerShadowPainter(type, painter) {
    this._shadowPainters[type] = painter;
  },

  getShadowPainter(type) {
    return this._shadowPainters[type];
  },

  initOverview(network) {
    const overView = new mono.Overview3D(network);
  },

  init(htmlElementId, modelData, deviceData) {
    demo.resetData();
    Overview3D();
    const Tooltip = createTooltip();

    demo.dataJson = modelData;
    demo.deviceData = deviceData;
    demo.htmlElement = document.getElementById(htmlElementId);

    const network = window.network = new mono.Network3D();
    demo.network = network;
    const box = network.getDataBox();
    demo.typeFinder = new mono.QuickFinder(box, 'type', 'client');
    demo.labelFinder = new mono.QuickFinder(box, 'label', 'client');

    const camera = new mono.PerspectiveCamera(30, 1.5, 30, 30000);
    network.setCamera(camera);

    const interaction = new mono.DefaultInteraction(network);
    interaction.yLowerLimitAngle = Math.PI / 180 * 2;
    interaction.yUpLimitAngle = Math.PI / 2;
    interaction.maxDistance = 20000;
    interaction.minDistance = 50;
    interaction.zoomSpeed = 3;
    interaction.panSpeed = 0.2;

    const editInteraction = new mono.EditInteraction(network);
    editInteraction.setShowHelpers(true);
    editInteraction.setScaleable(false);
    editInteraction.setRotateable(false);
    editInteraction.setTranslateable(true);

    network.setInteractions([interaction, new mono.SelectionInteraction(network), editInteraction]);

    network.isSelectable = function(element) {
      return element.getClient('type') === 'rack';
    };
    network.editableFunction = function(element) {
      return network.moveView && element.getClient('type') === 'rack';
    };
    demo.htmlElement.appendChild(network.getRootView());
    const tooltip = new Tooltip();
    demo.htmlElement.appendChild(tooltip.getView());

    const personLoaded = false;

    const buttons = [{
      label: '场景复位',
      icon: 'reset.png',
      clickFunction() {
        demo.resetView(network);
      },
    },
    /* {
            label: '走线管理',
            icon: 'connection.png',
            clickFunction: function() {
              var showing = network.connectionView;
              demo.resetView(network);
              if (!showing) {
                demo.toggleConnectionView(network);
              }
            }
          }, {
            label: '人工路径',
            icon: 'person.png',
            clickFunction: function() {
              demo.togglePersonVisible(personLoaded, network);
              personLoaded = !personLoaded;
            }
          }, {
            label: '调试信息',
            icon: 'fps.png',
            clickFunction: function() {
              demo.toggleFpsView(network);
            }
          }, */
    {
      label: '拖拽机柜',
      icon: 'edit.png',
      clickFunction() {
        const showing = network.moveView;
        demo.resetView(network);
        if (!showing) {
          demo.toggleMoveView(network);
        }
      },
    }, {
      label: '温度图',
      icon: 'temperature.png',
      clickFunction() {
        const showing = network.temperatureView;
        demo.resetView(network);
        if (!showing) {
          demo.toggleTemperatureView(network);
        }
      },
    }, {
      label: '可用空间',
      icon: 'space.png',
      clickFunction() {
        const showing = network.spaceView;
        demo.resetView(network);
        if (!showing) {
          demo.toggleSpaceView(network);
        }
      },
    }, {
      label: '功率利用率',
      icon: 'usage.png',
      clickFunction() {
        const showing = network.usageView;
        demo.resetView(network);
        if (!showing) {
          demo.toggleUsageView(network);
        }
      },
    }, {
      label: '空调风向',
      icon: 'air.png',
      clickFunction() {
        const showing = network.airView;
        demo.resetView(network);
        if (!showing) {
          demo.toggleAirView(network);
        }
      },
    },
      /* {
            label: '烟雾监控',
            icon: 'smoke.png',
            clickFunction: function() {
              var showing = network.smokeView;
              demo.resetView(network);
              if (!showing) {
                demo.toggleSmokeView(network);
              }
            }
          }, {
            label: '漏水监测',
            icon: 'water.png',
            clickFunction: function() {
              var showing = network.waterView;
              demo.resetView(network);
              if (!showing) {
                demo.toggleWaterView(network);
              }
            }
          }, {
            label: '防盗监测',
            icon: 'security.png',
            clickFunction: function() {
              var showing = network.laserView;
              demo.resetView(network);
              if (!showing) {
                demo.toggleLaserView(network);
              }
            }
          }, {
            label: '供电电缆',
            icon: 'power.png',
            clickFunction: function() {
              var showing = network.powerView;
              demo.resetView(network);
              if (!showing) {
                demo.togglePowerView(network);
              }
            }
          }, {
            label: '告警巡航',
            icon: 'alarm.png',
            clickFunction: function() {
              if (network.inspecting) {
                return;
              }
              demo.resetView(network);
              demo.resetRackPosition(network);
              network.inspecting = true;
              demo.inspection(network);
            }
          },*/
      /* {
      	label: '端口连线',
      	icon: 'connection.png',
      	clickFunction: function(){
      		if(network.inspecting){
      			return;
      		}
      		demo.resetView(network);
      		demo.inspection(network);
      	}
      }*/
    ];
    demo.setupToolbar(buttons);

    this.setupControlBar(network);

    // mono.Utils.autoAdjustNetworkBounds(network, document.documentElement, 'clientWidth', 'clientHeight');
    network.adjustBounds(parseInt(demo.htmlElement.style.width, 10), parseInt(demo.htmlElement.style.height, 10));
    network.getRootView().addEventListener('dblclick', (e) => {
      demo.handleDoubleClick(e, network);
    });
    network.getRootView().addEventListener('mousemove', (e) => {
      demo.handleMouseMove(e, network, tooltip);
    });

    demo.setupLights(box);
    box.getAlarmBox().addDataBoxChangeListener((e) => {
      const alarm = e.data;
      if (e.kind === 'add') {
        const node = box.getDataById(alarm.getElementId());
        node.setStyle('m.alarmColor', null);
      }
    });

    box.addDataPropertyChangeListener((e) => {
      let element = e.source,
        property = e.property,
        oldValue = e.oldValue,
        newValue = e.newValue;
      if (property == 'position' && network.moveView) {
        if (oldValue.y != newValue.y) {
          element.setPositionY(oldValue.y);
        }
      }
    });

    network.addInteractionListener((e) => {
      if (e.kind == 'liveMoveEnd') {
        demo.dirtyShadowMap(network);
      }
    });

    const time1 = new Date().getTime();
    demo.loadData(network);
    const time2 = new Date().getTime();
    console.log(`time:  ${time2 - time1}`);

    demo.startSmokeAnimation(network);
    demo.startFpsAnimation(network);
    demo.resetCamera(network);

    this.initOverview(network);

    const idFinder = new mono.QuickFinder(box, 'id', 'client');
    demo.cabinet.forEach((element) => {
      const rack = idFinder.findFirst(element.Numbering);
      rack.realTimeData = element;
    });
    return idFinder;
  },

  resetCamera(network) {
    network.getCamera().setPosition(790, 1036, 2396);
    network.getCamera().lookAt(new mono.Vec3(0, 0, 0));
  },

  dirtyShadowMap(network) {
    const floor = network.getDataBox().shadowHost;
    const floorCombo = demo.typeFinder.findFirst('floorCombo');
    demo.updateShadowMap(floorCombo, floor, floor.getId(), network.getDataBox());
  },

  togglePersonVisible(visible, network) {
    const camera = network.getCamera();
    const databox = network.getDataBox();
    if (!visible) {
      this.loadObj(camera, databox);
    } else {
      this.removeObj(databox);
    }
  },

  removeObj(box) {
    const person = demo.typeFinder.find('person').get(0);
    person.animate.stop();
    box.removeByDescendant(person);

    const trail = demo.typeFinder.find('trail').get(0);
    box.removeByDescendant(trail);
  },

  _playRackDoorAnimate(label) {
    const element = demo.labelFinder.findFirst(label);
    const rackDoor = element.getChildren().get(0);
    if (rackDoor.getClient('animation')) {
      demo.playAnimation(rackDoor, rackDoor.getClient('animation'));
    }
  },

  loadObj(camera, box) {
    const obj = demo.getRes('worker.obj');
    const mtl = demo.getRes('worker.mtl');

    const loader = new mono.OBJMTLLoader();
    loader.load(obj, mtl, {
      worker: demo.getRes('worker.png'),
    }, (object) => {
      object.setScale(3, 3, 3);
      object.setClient('type', 'person');
      box.addByDescendant(object);

      var updater = function(element) {
        if (element && element.getChildren()) {
          element.getChildren().forEach((child) => {
            child.setStyle('m.normalType', mono.NormalTypeSmooth);
            updater(child);
          });
        }
      };
      updater(object);

      let x = -650,
        z = 600,
        angle = 0;
      object.setPosition(x, 0, z);
      object.setRotationY(angle);
      // var points=[[650, 600], [650, -300], [130, -300], [130, -600], [-650, -600], [-650, 580], [-450, 580], [-400, 550]];
      const points = [
        [-350, 600],
        [-350, 400],
        [450, 400],
        [450, 100],
        [-200, 100],
        [-200, -100],
        [-370, -100],
        [-370, -150],
      ];

      const cameraFollow = new CameraFollow(camera);

      cameraFollow.setHost(object);

      const leftDoor = demo.typeFinder.findFirst('left-door');
      const rightDoor = demo.typeFinder.findFirst('right-door');
      demo.playAnimation(leftDoor, leftDoor.getClient('animation'));
      demo.playAnimation(rightDoor, rightDoor.getClient('animation'), () => {
        object.animate = demo.createPathAnimates(camera, object, points, false, null, () => {
          demo._playRackDoorAnimate('1A03');
        });
        object.animate.play();
      });

      let path = new mono.Path();
      path.moveTo(object.getPositionX(), object.getPositionZ());
      for (let i = 0; i < points.length; i++) {
        path.lineTo(points[i][0], points[i][1]);
      }
      path = mono.PathNode.prototype.adjustPath(path, 5);

      const trail = new mono.PathCube(path, 3, 1);
      trail.s({
        'm.type': 'phong',
        'm.specularStrength': 30,
        'm.color': '#298A08',
        'm.ambient': '#298A08',
        'm.texture.image': demo.getRes('flow.jpg'),
        'm.texture.repeat': new mono.Vec2(150, 1),
      });
      trail.setRotationX(Math.PI);
      trail.setPositionY(5);
      trail.setClient('type', 'trail');
      box.add(trail);
    });
  },

  createPathAnimates(camera, element, points, loop, finalAngle, done) {
    const animates = [];

    if (points && points.length > 0) {
      let x = element.getPositionX();
      let z = element.getPositionZ();
      let angle = element.getRotationY();

      const createRotateAnimate = function(camera, element, toAngle, angle) {
        if (toAngle != angle && !Object.is(toAngle, NaN)) {
          if (toAngle - angle > Math.PI) {
            toAngle -= Math.PI * 2;
          }
          if (toAngle - angle < -Math.PI) {
            toAngle += Math.PI * 2;
          }
          // console.log(angle, toAngle);
          const rotateAnimate = new twaver.Animate({
            from: angle,
            to: toAngle,
            type: 'number',
            dur: Math.abs(toAngle - angle) * 300,
            easing: 'easeNone',
            onPlay() {
              element.animate = this;
            },
            onUpdate(value) {
              element.setRotationY(value);
            },

          });
          rotateAnimate.toAngle = toAngle;
          return rotateAnimate;
        }
      };

      for (var i = 0; i < points.length; i++) {
        const point = points[i];
        const x1 = point[0];
        const z1 = point[1];
        const rotate = Math.atan2(-(z1 - z), x1 - x);

        var rotateAnimate = createRotateAnimate(camera, element, rotate, angle);
        if (rotateAnimate) {
          animates.push(rotateAnimate);
          angle = rotateAnimate.toAngle;
        }

        const moveAnimate = new twaver.Animate({
          from: {
            x,
            y: z,
          },
          to: {
            x: x1,
            y: z1,
          },
          type: 'point',
          dur: Math.sqrt((x1 - x) * (x1 - x) + (z1 - z) * (z1 - z)) * 5,
          easing: 'easeNone',
          onPlay() {
            element.animate = this;
          },
          onUpdate(value) {
            element.setPositionX(value.x);
            element.setPositionZ(value.y);
          },
        });
        animates.push(moveAnimate);

        x = x1;
        z = z1;
      }

      if (finalAngle != undefined && angle != finalAngle) {
        var rotateAnimate = createRotateAnimate(camera, element, finalAngle, angle);
        if (rotateAnimate) {
          animates.push(rotateAnimate);
        }
      }
    }
    animates[animates.length - 1].onDone = done;
    let animate;
    for (var i = 0; i < animates.length; i++) {
      if (i > 0) {
        animates[i - 1].chain(animates[i]);
        if (loop && i == animates.length - 1) {
          animates[i].chain(animate);
        }
      } else {
        animate = animates[i];
      }
    }
    return animate;
  },

  toggleConnectionView(network) {
    network.connectionView = !network.connectionView;

    const connectionView = network.connectionView;
    const box = network.getDataBox();
    const connections = demo.typeFinder.find('connection');
    const rails = demo.typeFinder.find('rail');
    connections.forEach((connection) => {
      connection.setVisible(connectionView);
      if (!connection.billboard) {
        connection.billboard = new mono.Billboard();
        connection.billboard.s({
          'm.texture.image': demo.createConnectionBillboardImage('0'),
          'm.vertical': true,
        });
        connection.billboard.setScale(60, 30, 1);
        connection.billboard.setPosition(400, 230, 330);
        box.add(connection.billboard);
      }
      connection.billboard.setVisible(connectionView);
      if (connection.isVisible()) {
        const offsetAnimate = new twaver.Animate({
          from: 0,
          to: 1,
          type: 'number',
          dur: 1000,
          repeat: Number.POSITIVE_INFINITY,
          reverse: false,
          onUpdate(value) {
            connection.s({
              'm.texture.offset': new mono.Vec2(value, 0),
            });
            if (value === 1) {
              const text = `54${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`;
              connection.billboard.s({
                'm.texture.image': demo.createConnectionBillboardImage(text),
              });
            }
          },
        });
        offsetAnimate.play();
        connection.offsetAnimate = offsetAnimate;
      } else if (connection.offsetAnimate) {
        connection.offsetAnimate.stop();
      }
    });
    rails.forEach((rail) => {
      rail.setVisible(connectionView);
    });
  },

  setupLights(box) {
    var pointLight = new mono.PointLight(0xFFFFFF, 0.3);
    pointLight.setPosition(0, 1000, -1000);
    box.add(pointLight);

    var pointLight = new mono.PointLight(0xFFFFFF, 0.3);
    pointLight.setPosition(0, 1000, 1000);
    box.add(pointLight);

    var pointLight = new mono.PointLight(0xFFFFFF, 0.3);
    pointLight.setPosition(1000, -1000, 1000);
    box.add(pointLight);

    box.add(new mono.AmbientLight('white'));
  },

  handleDoubleClick(e, network) {
    const camera = network.getCamera();
    const interaction = network.getDefaultInteraction();
    const firstClickObject = demo.findFirstObjectByMouse(network, e);
    if (firstClickObject) {
      const element = firstClickObject.element;
      var newTarget = firstClickObject.point;
      var oldTarget = camera.getTarget();

      if (element.realTimeData) {
        // console.log(element.realTimeData);
        demo.showDataDialog(element);
      }

      if (element.getClient('animation')) {
        demo.playAnimation(element, element.getClient('animation'));
      } else if (element.getClient('dbl.func')) {
        const func = element.getClient('dbl.func');
        func();

        if (element.getClient('type') === 'rack') {
          demo.animateCamera(camera, interaction, oldTarget, newTarget);
        }
      } else {
        demo.animateCamera(camera, interaction, oldTarget, newTarget);
      }
    } else {
      var oldTarget = camera.getTarget();
      var newTarget = new mono.Vec3(0, 0, 0);
      demo.animateCamera(camera, interaction, oldTarget, newTarget);
    }
    // demo.showAlarmDialog();
  },

  // 鼠标移动到网元上1S后显示tooltip
  handleMouseMove(e, network, tooltipObj) {
    const objects = network.getElementsByMouseEvent(e);
    // 获取当前网元，如果当前鼠标下有对象并且类型为group，那么就设置currentElement为鼠标下的网元
    let currentElement = null;
    const tooltip = tooltipObj.getView();
    // var tooltip = document.getElementById('tooltip');
    if (objects.length) {
      const first = objects[0];
      const object3d = first.element;
      if (object3d.getClient('type') === 'card' && object3d.getClient('isAlarm')) {
        currentElement = object3d;
        tooltipObj.setValues([object3d.getClient('BID')]);
      }
    }
    // 如果当前和上一次的网元不一致，先清除timer。
    // 如果当前网元有值，起一个timer，2S后显示tooltip。
    // tooltip显示的位置为最近一次鼠标移动时的位置
    if (demo.lastElement != currentElement) {
      clearTimeout(demo.timer);
      if (currentElement) {
        demo.timer = setTimeout(() => {
          tooltip.style.display = 'block';
          tooltip.style.position = 'absolute';
          tooltip.style.left = `${window.lastEvent.pageX - tooltip.clientWidth / 2}px`;
          tooltip.style.top = `${window.lastEvent.pageY - tooltip.clientHeight - 15}px`;
        }, 1000);
      }
    }
    // 设置上一次的网元为当前网元
    demo.lastElement = currentElement;
    // 如果当前鼠标下没有网元，隐藏tooltip
    if (currentElement == null) {
      tooltip.style.display = 'none';
    }
    // 设置每次移动时鼠标的事件对象
    window.lastEvent = e;
  },

  copyProperties(from, to, ignores) {
    if (from && to) {
      for (const name in from) {
        if (ignores && ignores.indexOf(name) >= 0) {
          // ignore.
        } else {
          to[name] = from[name];
        }
      }
    }
  },

  createCubeObject(json) {
    const translate = json.translate || [0, 0, 0];
    const width = json.width;
    const height = json.height;
    const depth = json.depth;
    const sideColor = json.sideColor;
    const topColor = json.topColor;

    const object3d = new mono.Cube(width, height, depth);
    object3d.setPosition(translate[0], translate[1] + height / 2, translate[2]);
    object3d.s({
      'm.color': sideColor,
      'm.ambient': sideColor,
      'left.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
      'right.m.lightmap.image': demo.getRes('outside_lightmap.jpg'),
      'front.m.lightmap.image': demo.getRes('outside_lightmap.jpg'),
      'back.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
      'top.m.color': topColor,
      'top.m.ambient': topColor,
      'bottom.m.color': topColor,
      'bottom.m.ambient': topColor,
    });
    object3d.setClient('type', 'rack');
    return object3d;
  },

  create2DPath(pathData) {
    let path;
    for (let j = 0; j < pathData.length; j++) {
      const point = pathData[j];
      if (path) {
        path.lineTo(point[0], point[1], 0);
      } else {
        path = new mono.Path();
        path.moveTo(point[0], point[1], 0);
      }
    }

    return path;
  },

  create3DPath(pathData) {
    let path;
    for (let j = 0; j < pathData.length; j++) {
      const point = pathData[j];
      if (path) {
        path.lineTo(point[0], point[1], point[2]);
      } else {
        path = new mono.Path();
        path.moveTo(point[0], point[1], point[2]);
      }
    }

    return path;
  },

  createPathObject(json) {
    const translate = json.translate || [0, 0, 0];
    const pathWidth = json.width;
    const pathHeight = json.height;
    const pathData = json.data;
    const path = this.create2DPath(pathData);
    const pathInsideColor = json.insideColor;
    const pathOutsideColor = json.outsideColor;
    const pathTopColor = json.topColor;

    const object3d = this.createWall(path, pathWidth, pathHeight, pathInsideColor, pathOutsideColor, pathTopColor);
    object3d.setPosition(translate[0], translate[1], -translate[2]);
    object3d.shadow = json.shadow;

    return object3d;
  },

  filterJson(box, objects) {
    let newObjects = [];

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const type = object.type;
      const filter = this.getFilter(type);
      if (filter) {
        const filteredObject = filter(box, object);
        if (filteredObject) {
          if (filteredObject instanceof Array) {
            newObjects = newObjects.concat(filteredObject);
          } else {
            this.copyProperties(object, filteredObject, ['type']);
            newObjects.push(filteredObject);
          }
        }
      } else {
        newObjects.push(object);
      }
    }
    return newObjects;
  },

  createCombo(parts) {
    const children = [];
    const ops = [];
    const ids = [];
    for (let i = 0; i < parts.length; i++) {
      const object = parts[i];
      const op = object.op || '+';
      const style = object.style;
      const translate = object.translate || [0, 0, 0];
      const rotate = object.rotate || [0, 0, 0];
      let object3d = null;
      if (object.type === 'path') {
        object3d = this.createPathObject(object);
      }
      if (object.type === 'cube') {
        object3d = this.createCubeObject(object);
      }
      if (object3d) {
        object3d.setRotation(rotate[0], rotate[1], rotate[2]);
        if (style) {
          object3d.s(style);
        }
        children.push(object3d);
        if (children.length > 1) {
          ops.push(op);
        }
        ids.push(object3d.getId());
      }
    }

    if (children.length > 0) {
      const combo = new mono.ComboNode(children, ops);
      combo.setNames(ids);
      return combo;
    }
    return null;
  },

  loadData(network) {
    const json = demo.filterJson(network.getDataBox(), demo.dataJson.objects);
    const box = network.getDataBox();

    network.setClearColor(demo.CLEAR_COLOR);

    const children = [];
    const ops = [];
    const ids = [];
    let shadowHost;
    let shadowHostId;
    for (let i = 0; i < json.length; i++) {
      const object = json[i];
      const op = object.op;
      const style = object.style;
      const client = object.client;
      const translate = object.translate || [0, 0, 0];
      const rotate = object.rotate || [0, 0, 0];
      let object3d = null;

      if (object.type === 'path') {
        object3d = this.createPathObject(object);
      }
      if (object.type === 'cube') {
        object3d = this.createCubeObject(object);
      }

      if (object.shadowHost) {
        shadowHost = object3d;
        shadowHostId = object3d.getId();
        box.shadowHost = shadowHost;
      }

      const creator = demo.getCreator(object.type);
      if (creator) {
        creator(box, object);
        continue;
      }

      if (object3d) {
        object3d.shadow = object.shadow;
        object3d.setRotation(rotate[0], rotate[1], rotate[2]);
        if (style) {
          object3d.s(style);
        }
        if (client) {
          for (const key in client) {
            object3d.setClient(key, client[key]);
          }
        }
        if (op) {
          children.push(object3d);
          if (children.length > 1) {
            ops.push(op);
          }
          ids.push(object3d.getId());
        } else {
          box.add(object3d);
        }
      }
    }

    if (children.length > 0) {
      const combo = new mono.ComboNode(children, ops);
      combo.setNames(ids);
      combo.setClient('type', 'floorCombo');
      box.add(combo);

      // lazy load floor shadow map.
      if (shadowHost && shadowHostId) {
        setTimeout(() => {
          demo.updateShadowMap(combo, shadowHost, shadowHostId, box);
        }, demo.LAZY_MAX);
      }
    }
  },

  updateShadowMap(combo, shadowHost, shadowHostId, box) {
    const shadowMapImage = demo.createShadowImage(box, shadowHost.getWidth(), shadowHost.getDepth());
    const floorTopFaceId = `${shadowHostId}-top.m.lightmap.image`;
    combo.setStyle(floorTopFaceId, shadowMapImage);
  },

  loadRackContent(box, x, y, z, width, height, depth, severity, cube, cut, json, parent, oldRack) {
    const rackDeviceData = demo.deviceData.filter(data => parent.getClient('id') === data.parentId);
    const gap = 6.35;
    let findFaultServer = false;

    rackDeviceData.forEach((data) => {
      const serverData = demo.serverRealTimeData.find(e => e.Numbering === data.id);
      const serverHeight = parseInt(data.height, 10);
      const bottomGap = gap + serverHeight * size / 2;
      const pic = `server${serverHeight}.png`;

      const color = !findFaultServer && severity ? severity.color : null;
      const server = this.createServer(box, cube, cut, pic, color, oldRack, Object.assign({}, serverData, data));

      if (color) {
        findFaultServer = true;
      }

      const positionY = parseInt(data.uId.slice(0, 2), 10) - 1;

      server.setPositionY(positionY * size + bottomGap - height / 2);
      server.setPositionZ(server.getPositionZ() + 5);
      server.setParent(parent);
    });
  },

  createServer(box, cube, cut, pic, color, oldRack, data) {
    const category = data.category;
    const isFrame = category === '13' || category === '14'; // 是否是机框式设备
    // const isFrame = pic === 'server7.png';
    const x = cube.getPositionX();
    const z = cube.getPositionZ();
    var width = cut.getWidth();
    var height = isFrame ? size * parseInt(data.height, 10) : picMap[pic];
    const depth = cut.getDepth();

    const serverBody = new mono.Cube(width - 2, height - 1, depth - 4);
    const bodyColor = color || '#5B6976';
    serverBody.s({
      'm.color': bodyColor,
      'm.ambient': bodyColor,
      'm.type': 'phong',
      'm.texture.image': demo.getRes('rack_inside.jpg'),
    });
    serverBody.setPosition(0, 0.5, (cube.getDepth() - serverBody.getDepth()) / 2);

    const serverPanel = new mono.Cube(width + 2, height, 0.5);
    color = color || '#FFFFFF';
    serverPanel.s({
      'm.texture.image': demo.getRes('rack_inside.jpg'),
      'front.m.texture.image': isFrame ? demo.getRes('serverFrame.png') : demo.getRes(pic),
      'front.m.texture.repeat': new mono.Vec2(1, 1),
      'm.specularStrength': 100,
      'm.transparent': true,
      'm.color': color,
      'm.ambient': color,
    });
    serverPanel.setPosition(0, 0.5, serverBody.getDepth() / 2 + (cube.getDepth() - serverBody.getDepth()) / 2);
    if (isFrame) {
      const serverColor = '#FFFFFF';
      serverPanel.s({
        'm.color': serverColor,
        'm.ambient': serverColor,
      });
    }

    const server = new mono.ComboNode([serverBody, serverPanel], ['+']);
    server.setClient('animation', 'pullOut.z');

    server.realTimeData = data;

    server.setPosition(0.5, 0, -5);
    box.add(server);

    if (isFrame) {
      let isRendered = false;
      let xoffset = 2.1008,
        yoffset = 0.9897;
      var width = width + 2;
      var height = height + 1;
      const totalCount = 14;
      const count = 14;
      const cardWidth = (width - xoffset * 2) / totalCount;

      for (let i = 0; i < count; i++) {
        let cardColor = '#FFFFFF';
        if (i > 5 && !isRendered) {
          cardColor = color;
          isRendered = true;
        }
        const params = {
          height: height - yoffset * 2,
          width: cardWidth,
          depth: depth * 0.4,
          pic: `card${i % 4 + 1}.png`,
          color: cardColor,
        };
        const card = demo.createCard(params);
        box.add(card);

        card.setParent(server);
        card.setClient('type', 'card');
        card.setClient('BID', `card-${i}`);
        card.setClient('isAlarm', cardColor != '#FFFFFF');
        card.p(-width / 2 + xoffset + (i + 0.5) * cardWidth, -height / 2 + yoffset, serverPanel.getPositionZ() - 1);
        card.setClient('animation', 'pullOut.z');

        if (card.getClient('isAlarm')) {
          oldRack.alarmCard = card;
        }
      }
    }
    return server;
  },

  createCard(json) {
    const translate = json.translate || [0, 0, 0];
    let x = translate[0],
      y = translate[1],
      z = translate[2];
    let width = json.width || 10,
      height = json.height || 50,
      depth = json.depth || 50;
    const rotate = json.rotate || [0, 0, 0];
    const color = json.color || 'white';
    const pic = json.pic || 'card1.png';

    const parts = [{
      // card panel
      type: 'cube',
      width,
      height,
      depth: 1,
      translate: [x, y, z + 1],
      rotate,
      op: '+',
      style: {
        'm.color': color,
        'm.ambient': color,
        'm.texture.image': demo.getRes('gray.png'),
        'front.m.texture.image': demo.getRes(pic),
        'back.m.texture.image': demo.getRes(pic),
      },
    }, {
      // card body
      type: 'cube',
      width: 1,
      height: height * 0.95,
      depth,
      translate: [x, y, z - depth / 2 + 1],
      rotate,
      op: '+',
      style: {
        'm.color': color,
        'm.ambient': color,
        'm.texture.image': demo.getRes('gray.png'),
        'left.m.texture.image': demo.getRes('card_body.png'),
        'right.m.texture.image': demo.getRes('card_body.png'),
        'left.m.texture.flipX': true,
        'm.transparent': true,
        'm.lightmap.image': demo.getRes('outside_lightmap.jpg'),
      },
    }];

    return demo.createCombo(parts);
  },

  createShadowImage(box, floorWidth, floorHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = floorWidth;
    canvas.height = floorHeight;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, floorWidth, floorHeight);
    context.fillStyle = 'white';
    context.fill();

    const marker = function(context, text, text2, x, y) {
      let color = '#0B2F3A'; // '#0B2F3A';//'#FE642E';
      context.font = `${60}px "Microsoft Yahei" `;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      // context.shadowBlur = 30;
      context.fillText(text, x, y);
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.strokeText(text, x, y);

      if (!text2) return;
      y += 52;
      color = '#FE642E';
      context.font = `${26}px "Microsoft Yahei" `;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text2, x, y);
    };

    box.forEach((object) => {
      if (object instanceof mono.Entity && object.shadow) {
        const translate = object.getPosition() || {
          x: 0,
          y: 0,
          z: 0,
        };
        var rotate = object.getRotation() || {
          x: 0,
          y: 0,
          z: 0,
        };
        var rotate = -rotate[1];

        demo.paintShadow(object, context, floorWidth, floorHeight, translate, rotate);
      }
    });

    return canvas;
  },

  paintShadow(object, context, floorWidth, floorHeight, translate, rotate) {
    const type = object.getClient('type');
    const shadowPainter = demo.getShadowPainter(type);

    if (shadowPainter) {
      shadowPainter(object, context, floorWidth, floorHeight, translate, rotate);
    }
  },

  findFirstObjectByMouse(network, e) {
    const objects = network.getElementsByMouseEvent(e);
    if (objects.length) {
      for (let i = 0; i < objects.length; i++) {
        const first = objects[i];
        const object3d = first.element;
        if (!(object3d instanceof mono.Billboard)) {
          return first;
        }
      }
    }
    return null;
  },

  animateCamera(camera, interaction, oldPoint, newPoint, onDone) {
    // twaver.Util.stopAllAnimates(true);

    const offset = camera.getPosition().sub(camera.getTarget());
    const animation = new twaver.Animate({
      from: 0,
      to: 1,
      dur: 500,
      easing: 'easeBoth',
      onUpdate(value) {
        const x = oldPoint.x + (newPoint.x - oldPoint.x) * value;
        const y = oldPoint.y + (newPoint.y - oldPoint.y) * value;
        const z = oldPoint.z + (newPoint.z - oldPoint.z) * value;
        const target = new mono.Vec3(x, y, z);
        camera.lookAt(target);
        interaction.target = target;
        const position = new mono.Vec3().addVectors(offset, target);
        camera.setPosition(position);
        // console.log(target, position);
      },
    });
    animation.onDone = onDone;
    animation.play();
  },

  playAnimation(element, animation, done) {
    const params = animation.split('.');
    if (params[0] === 'pullOut') {
      const direction = params[1];
      demo.animatePullOut(element, direction, done);
    }
    if (params[0] === 'rotate') {
      const anchor = params[1];
      const angle = params[2];
      const easing = params[3];
      demo.animateRotate(element, anchor, angle, easing, done);
    }
  },

  animatePullOut(object, direction, done) {
    // twaver.Util.stopAllAnimates(true);

    const size = object.getBoundingBox().size().multiply(object.getScale());

    const movement = 0.8;

    let directionVec = new mono.Vec3(0, 0, 1);
    let distance = 0;
    if (direction === 'x') {
      directionVec = new mono.Vec3(1, 0, 0);
      distance = size.x;
    }
    if (direction === '-x') {
      directionVec = new mono.Vec3(-1, 0, 0);
      distance = size.x;
    }
    if (direction === 'y') {
      directionVec = new mono.Vec3(0, 1, 0);
      distance = size.y;
    }
    if (direction === '-y') {
      directionVec = new mono.Vec3(0, -1, 0);
      distance = size.y;
    }
    if (direction === 'z') {
      directionVec = new mono.Vec3(0, 0, 1);
      distance = size.z;
    }
    if (direction === '-z') {
      directionVec = new mono.Vec3(0, 0, -1);
      distance = size.z;
    }

    distance *= movement;
    if (object.getClient('animated')) {
      directionVec = directionVec.negate();
    }

    const fromPosition = object.getPosition().clone();
    object.setClient('animated', !object.getClient('animated'));

    new twaver.Animate({
      from: 0,
      to: 1,
      dur: 2000,
      easing: 'bounceOut',
      onUpdate(value) {
        // don't forget to clone new instance before use them!
        object.setPosition(fromPosition.clone().add(directionVec.clone().multiplyScalar(distance * value)));
      },
      onDone() {
        demo.animationFinished(object);

        if (done) {
          done();
        }
      },
    }).play();
  },

  animateRotate(object, anchor, angle, easing, done) {
    // twaver.Util.stopAllAnimates(true);
    easing = easing || 'easeInStrong';

    const size = object.getBoundingBox().size().multiply(object.getScale());

    const from = 0;
    let to = 1;
    if (object.getClient('animated')) {
      to = -1;
    }
    object.setClient('animated', !object.getClient('animated'));

    let position;
    var axis;
    if (anchor === 'left') {
      position = new mono.Vec3(-size.x / 2, 0, 0);
      var axis = new mono.Vec3(0, 1, 0);
    }
    if (anchor === 'right') {
      position = new mono.Vec3(size.x / 2, 0, 0);
      var axis = new mono.Vec3(0, 1, 0);
    }

    const animation = new twaver.Animate({
      from,
      to,
      dur: 1500,
      easing,
      onUpdate(value) {
        if (this.lastValue === undefined) {
          this.lastValue = 0;
        }
        object.rotateFromAxis(axis.clone(), position.clone(), Math.PI / 180 * angle * (value - this.lastValue));
        this.lastValue = value;
      },
      onDone() {
        delete this.lastValue;
        demo.animationFinished(object);

        if (done) {
          done();
        }
      },
    });
    animation.play();
  },

  animationFinished(element) {
    const animationDoneFuc = element.getClient('animation.done.func');
    if (animationDoneFuc) {
      animationDoneFuc();
    }
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  },

  getRandomLazyTime() {
    const time = demo.LAZY_MAX - demo.LAZY_MIN;
    return demo.getRandomInt(time) + demo.LAZY_MIN;
  },

  generateAssetImage(text) {
    let width = 512,
      height = 256;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${150}px "Microsoft Yahei" `;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 15;
    ctx.strokeText(text, width / 2, height / 2);

    return canvas;
  },

  toggleTemperatureView(network) {
    network.temperatureView = !network.temperatureView;

    // network.getDataBox().forEach(function(element) {
    //   var type = element.getClient('type');

    //   if (type === 'rack' || type === 'rack.door') {
    //     element.setVisible(!network.temperatureView);
    //     if (type === 'rack') {
    //       if (!element.temperatureFake) {
    //         var fake = new mono.Cube(element.getWidth(), element.getHeight(), element.getDepth());
    //         element.temperatureFake = fake;
    //         var sideImage = demo.createSideTemperatureImage(element, 3 + Math.random() * 10);
    //         fake.s({
    //           'm.texture.image': sideImage,
    //           'top.m.texture.image': element.getStyle('top.m.texture.image'),
    //           'top.m.normalmap.image': demo.getRes('metal_normalmap.jpg'),
    //           'top.m.specularmap.image': element.getStyle('top.m.texture.image'),
    //           'top.m.envmap.image': demo.getEnvMap(),
    //           'top.m.type': 'phong',
    //         });
    //         network.getDataBox().add(fake);
    //       }
    //       element.temperatureFake.setPosition(element.getPosition());
    //       element.temperatureFake.setVisible(network.temperatureView);
    //     }
    //   }
    // });
    if (network.temperatureView) {
      // demo.createTemperatureBoard(network.getDataBox());
      demo.createTemperatureWall(network.getDataBox());
    } else {
      // network.getDataBox().remove(network.getDataBox().temperaturePlane);
      // delete network.getDataBox().temperaturePlane;
      network.getDataBox().remove(network.getDataBox().temperatureWall);
      delete network.getDataBox().temperatureWall;
    }
  },

  createTemperatureBoard(box) {
    const floor = box.shadowHost;
    const board = new TemperatureBoard(512, 512, 'h', 20);

    box.forEach((element) => {
      const type = element.getClient('type');
      if (type === 'rack') {
        const x = element.getPositionX() / floor.getWidth() * 512 + 256;
        const y = element.getPositionZ() / floor.getDepth() * 512 + 256;
        const value = 0.1 + Math.random() * 0.3;
        const width = element.getWidth() / floor.getWidth() * 512;
        const depth = element.getDepth() / floor.getWidth() * 512;

        board.addPoint(x - width / 2, y + depth / 2, value);
        board.addPoint(x + width / 2, y + depth / 2, value);
        board.addPoint(x - width / 2, y - depth / 2, value);
        board.addPoint(x + width / 2, y - depth / 2, value);
        board.addPoint(x, y, value);
      }
    });

    const image = board.getImage();

    const plane = new mono.Plane(floor.getWidth(), floor.getDepth());
    plane.s({
      'm.texture.image': image,
      'm.transparent': true,
      'm.side': mono.DoubleSide,
      'm.type': 'phong',
    });
    plane.setPositionY(10);
    plane.setRotationX(-Math.PI / 2);
    box.add(plane);

    box.temperaturePlane = plane;
  },

  createTemperatureWall(box) {
    const width = 930;
    const depth = 900;
    const cube = new mono.Cube(width, 5, depth);
    cube.s({
      'm.visible': false,
    });
    cube.s({
      'top.m.visible': true,
      'top.m.transparent': true,
      'top.m.opacity': 1,
      'top.m.texture.image': demo.createTemperatureWallImage(width, depth, demo.temperatureData, demo.temperatureUpperLimit),
      'm.side': mono.DoubleSide,
      'm.type': 'phong',
    });
    cube.setPosition(0, 250, 0);
    cube.setRotationX(Math.PI);
    box.add(cube);

    box.temperatureWall = cube;
  },

  createTemperatureWallImage(width, height, data, upperLimit) {
    const div = document.createElement('div');
    demo.htmlElement.appendChild(div);
    div.style.display = 'none';
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    const image = document.createElement('img');

    const heatmap = Heatmap.create({
      container: div,
      radius: 180,
      maxOpacity: 0.8,
    });

    // 修正坐标，使热力图上的点坐标和机柜坐标相符
    const fixedData = data.map((element) => {
      const obj = {};
      obj.value = element.value;
      obj.x = width / 2 + element.x;
      obj.y = height / 2 - element.y;
      return obj;
    })

    heatmap.setData({
      max: upperLimit || 90,
      min: 0,
      data: fixedData,
    });

    const src = heatmap.getDataURL();

    image.setAttribute('src', src);

    return image;
  },

  createSideTemperatureImage(rack, count) {
    const width = 2;
    const height = rack.getHeight();
    const step = height / count;
    const board = new TemperatureBoard(width, height, 'v', height / count);

    for (let i = 0; i < count; i++) {
      let value = 0.3 + Math.random() * 0.2;
      if (value < 4) {
        value = Math.random() * 0.9;
      }
      board.addPoint(width / 2, step * i, value);
    }

    return board.getImage();
  },

  toggleSpaceView(network) {
    network.spaceView = !network.spaceView;

    network.getDataBox().forEach((element) => {
      const type = element.getClient('type');

      if (type === 'rack' || type === 'rack.door') {
        element.setVisible(!network.spaceView);
        if (type === 'rack' && demo.filterRack.includes(element.getClient('id'))) {
          if (!element.spaceCubes) {
            element.spaceCubes = demo.createRackSpaceCubes(network.getDataBox(), element);
          }
          for (let i = 0; i < element.spaceCubes.length; i++) {
            element.spaceCubes[i].setPosition(element.getPositionX(),
              element.spaceCubes[i].getPositionY(),
              element.getPositionZ());
            element.spaceCubes[i].setVisible(network.spaceView);
          }
        }
      }
    });
  },

  createRackSpaceCubes(box, rack) {
    const cubes = [];
    const width = rack.getWidth();
    const height = rack.getHeight();
    const depth = rack.getDepth();
    const rackId = rack.getClient('id');
    const total = parseInt(rack.getClient('totalU'), 10);
    const filterDeviceData = demo.deviceData.filter(e => e.parentId === rackId);

    const step = height / total;

    const groups = demo.groupDeviceData(filterDeviceData, total);
    // console.log(groups, filterDeviceData);

    let isSpace = (!filterDeviceData[0] || filterDeviceData[0].uId.slice(0, 2) !== '01');
    let y = 0;
    groups.forEach((group, i) => {
      const color = isSpace ? spaceColor : solidColor;

      const cube = new mono.Cube(width, step * group - 2, depth);
      cube.setPosition(rack.getPositionX(), y * step + step * group / 2, rack.getPositionZ());
      cube.s({
        'm.type': 'phong',
        'm.color': color,
        'm.ambient': color,
        'm.specularStrength': 50,
      });
      if (color === spaceColor) {
        cube.s({
          'm.transparent': true,
          'm.opacity': 0.8,
        });
      }
      box.add(cube);
      cubes.push(cube);

      isSpace = !isSpace;
      y += group;
    });
    return cubes;
  },

  groupDeviceData(data, size) {
    let solid = 0;
    const groups = [];

    if (data.length !== 0) {
      utility.sortByAttr(data, 'uId').forEach((element, i) => {
        const {
          positionHigh,
          positionLow,
        } = demo.getUPosition(element.uId);

        const space = positionHigh - positionLow;
        const {
          positionHigh: prePositionHigh,
        } = i !== 0 ? demo.getUPosition(data[i - 1].uId) : {
            positionHigh: positionLow,
          };

        if (i === 0 && positionLow !== 0) {
          groups.push(positionLow);
          solid += space;
        } else if (positionLow - prePositionHigh !== 0) {
          groups.push(solid, positionLow - prePositionHigh);
          solid = space;
        } else {
          solid += space;
        }
      });

      const {
        positionHigh: lastPosition,
      } = demo.getUPosition(data[data.length - 1].uId);

      if (lastPosition < size) {
        groups.push(solid, size - lastPosition);
      } else {
        groups.push(solid);
      }
    } else {
      groups.push(42);
    }

    return groups;
  },

  getUPosition(uId) {
    const positionLow = parseInt(uId.slice(0, 2), 10);
    const positionHigh = parseInt(uId.slice(4, 6), 10);

    if (positionHigh) {
      return {
        positionHigh,
        positionLow: positionLow - 1,
      };
    }
    return {
      positionLow: positionLow - 1,
      positionHigh: positionLow,
    };
  },

  toggleUsageView(network) {
    network.usageView = !network.usageView;

    network.getDataBox().forEach((element) => {
      const type = element.getClient('type');

      if (type === 'rack' || type === 'rack.door') {
        element.setVisible(!network.usageView);
        if (type === 'rack') {
          if (!element.usageFakeTotal) {
            const totalPower = parseInt(element.getClient('totalPower'), 10);
            const rackId = element.getClient('id');
            const filterDeviceData = demo.deviceData.filter(e => e.parentId === rackId && e.on !== '0');
            const usedPower = filterDeviceData.reduce((preValue, currValue) => {
              return preValue + currValue.power;
            }, 0);

            const usage = usedPower / totalPower;
            const color = demo.getHSVColor((1 - usage) * 0.7, 0.7, 0.7);

            const usageFakeTotal = new mono.Cube(element.getWidth(), element.getHeight(), element.getDepth());
            element.usageFakeTotal = usageFakeTotal;
            usageFakeTotal.s({
              'm.wireframe': true,
              'm.transparent': true,
              'm.opacity': 0.2,
            });
            usageFakeTotal.setPosition(element.getPosition());
            network.getDataBox().add(usageFakeTotal);

            const height = element.getHeight() * usage;

            const usageFakeUsed = new mono.Cube(element.getWidth(), 0, element.getDepth());
            element.usageFakeUsed = usageFakeUsed;
            usageFakeUsed.s({
              'm.type': 'phong',
              'm.color': color,
              'm.ambient': color,
              'm.specularStrength': 20,
              'left.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
              'right.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
              'back.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
              'front.m.lightmap.image': demo.getRes('inside_lightmap.jpg'),
            });
            usageFakeUsed.setPosition(element.getPosition());
            usageFakeUsed.setPositionY(0);
            network.getDataBox().add(usageFakeUsed);

            const usageAnimation = new twaver.Animate({
              from: 0,
              to: height,
              type: 'number',
              dur: 2000,
              delay: Math.random() * 200,
              easing: 'bounceOut',
              onUpdate(value) {
                usageFakeUsed.setHeight(value);
                usageFakeUsed.setPositionY(usageFakeUsed.getHeight() / 2);
              },
            });
            element.usageAnimation = usageAnimation;
          }

          element.usageFakeTotal.setVisible(network.usageView);
          element.usageFakeUsed.setVisible(network.usageView);
          element.usageFakeTotal.setPosition(element.getPosition().clone());
          element.usageFakeUsed.setHeight(0);
          element.usageFakeUsed.setPosition(element.getPosition().clone());
          element.usageFakeUsed.setPositionY(0);

          if (network.usageView) {
            element.usageAnimation.play();
          } else {
            element.usageAnimation.stop();
          }
        }
      }
    });
  },

  toggleAirView(network) {
    network.airView = !network.airView;

    if (!network.getDataBox().airPlanes) {
      network.getDataBox().airPlanes = demo.createAirPlanes();
    }

    for (let i = 0; i < network.getDataBox().airPlanes.length; i++) {
      const plane = network.getDataBox().airPlanes[i];
      if (network.airView) {
        network.getDataBox().add(plane);
        plane.airAnimation.play();
      } else {
        network.getDataBox().remove(plane);
        plane.airAnimation.stop();
      }
    }
  },

  toggleMoveView(network) {
    network.getDataBox().getSelectionModel().clearSelection();
    network.moveView = !network.moveView;
    network.dirtyNetwork();
  },

  /* h, s, v (0 ~ 1) */
  getHSVColor(h, s, v) {
    let r,
      g,
      b,
      i,
      f,
      p,
      q,
      t;
    if (h && s === undefined && v === undefined) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }
    const rgb = `#${this.toHex(r * 255)}${this.toHex(g * 255)}${this.toHex(b * 255)}`;
    return rgb;
  },

  toHex(value) {
    let result = parseInt(value).toString(16);
    if (result.length == 1) {
      result = `0${result}`;
    }
    return result;
  },

  showDialog(content, title, width, height) {
    title = title || '';
    width = width || 600;
    height = height || 400;
    let div = document.getElementById('dialog');
    if (div) {
      demo.htmlElement.removeChild(div);
    }
    div = document.createElement('div');
    div.setAttribute('id', 'dialog');

    div.style.display = 'block';
    div.style.position = 'absolute';
    div.style.left = '100px';
    div.style.top = '100px';
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    div.style.background = 'rgba(164,186,223,0.75)';
    div.style['border-radius'] = '5px';
    demo.htmlElement.appendChild(div);

    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.color = 'white';
    span.style['font-size'] = '13px';
    span.style.position = 'absolute';
    span.style.left = '10px';
    span.style.top = '2px';
    span.innerHTML = title;
    div.appendChild(span);

    const img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.right = '4px';
    img.style.top = '4px';
    img.setAttribute('src', demo.getRes('close.png'));
    img.onclick = function() {
      demo.htmlElement.removeChild(div);
    };
    div.appendChild(img);

    if (content) {
      content.style.display = 'block';
      content.style.position = 'absolute';
      content.style.left = '3px';
      content.style.top = '24px';
      content.style.width = `${width - 6}px`;
      content.style.height = `${height - 26}px`;
      div.appendChild(content);
    }
  },

  showVideoDialog(title) {
    const video = document.createElement('video');
    video.setAttribute('controls', 'true');
    video.setAttribute('autoplay', 'true');
    const flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: demo.getRes('test.flv')
    });
    flvPlayer.attachMediaElement(video);
    flvPlayer.load();

    demo.showDialog(video, title, 380, 320);
  },

  showDataDialog(element) {
    if (element.realTimeData.serverData) {
      demo.showRackDataDialog(element);
    } else {
      demo.showDeviceDataDialog(element);
    }
  },

  showRackDataDialog(element) {
    const data = element.realTimeData;
    const serverData = data.serverData;

    let height = 0;
    const content = demo.createFlexDiv('column');
    content.style.padding = '20px 0 0';

    const {
      dataListDiv,
      listLength,
    } = demo.createDataList(data, translateRack);
    content.appendChild(dataListDiv);
    height += (25 * listLength);

    if (serverData.length > 0) {
      const serverDataTable = demo.createFlexDiv('row');
      serverDataTable.style.marginTop = '20px';
      content.appendChild(serverDataTable);

      const table = document.createElement('table');
      table.setAttribute('class', styles.gridtable);
      const tr = document.createElement('tr');
      table.appendChild(tr);

      const th1 = demo.createDomElement('th', '设备编号');
      const th2 = demo.createDomElement('th', '设备类型');
      const th3 = demo.createDomElement('th', '位置');
      tr.appendChild(th1);
      tr.appendChild(th2);
      tr.appendChild(th3);

      serverData.forEach((server) => {
        const tr = document.createElement('tr');
        table.appendChild(tr);

        const td1 = demo.createDomElement('td', server.Numbering);
        const td2 = demo.createDomElement('td', `${translate(server.category)}(${parseInt(server.height, 10)}U)`);
        const td3 = demo.createDomElement('td', server.uNumbering);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
      });

      serverDataTable.appendChild(table);
      height += (30 * (serverData.length + 1));
    }

    demo.showDialog(content, `机柜编号：${data.Numbering}`, 320, height + 50);
  },

  showDeviceDataDialog(element) {
    const data = element.realTimeData;
    let height = 0;
    const content = demo.createFlexDiv('column');
    content.style.padding = '20px 0 0';

    const {
      dataListDiv,
      listLength,
    } = demo.createDataList(data, translateDevice);
    content.appendChild(dataListDiv);
    height += (25 * listLength);

    demo.showDialog(content, `设备编号：${data.Numbering}`, 320, height + 40);
  },

  createDataList(data, translate) {
    const dataListDiv = demo.createFlexDiv('column');
    let listLength = 0;
    Object.keys(data).forEach((key) => {
      if (translate[key]) {
        const row = demo.createFlexDiv('row');
        row.style.width = '200px';
        row.style.marginTop = '5px';
        row.style.justifyContent = 'space-between';
        const keyDiv = document.createElement('div');
        keyDiv.innerHTML = translate[key];
        row.appendChild(keyDiv);

        const valueDiv = document.createElement('div');
        valueDiv.innerHTML = data[key];
        row.appendChild(valueDiv);

        dataListDiv.appendChild(row);
        listLength += 1;
      }
    });

    return {
      dataListDiv,
      listLength,
    };
  },

  createFlexDiv(columnOrRow) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = columnOrRow;
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';

    return div;
  },

  createDomElement(elementType, innerHTML) {
    const element = document.createElement(elementType);
    element.innerHTML = innerHTML;
    return element;
  },

  createConnectionBillboardImage(value) {
    let width = 512,
      height = 256;
    let text = '当前网络流量';
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FE642E';
    context.fillRect(0, 0, width, height - height / 6);

    context.beginPath();
    context.moveTo(width * 0.2, 0);
    context.lineTo(width / 2, height);
    context.lineTo(width * 0.8, 0);
    context.fill();

    var color = 'white';
    context.font = `${40}px "Microsoft Yahei" `;
    context.fillStyle = color;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(text, height / 10, height / 5);

    var color = 'white';
    text = value;
    context.font = `${100}px "Microsoft Yahei" `;
    context.fillStyle = color;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(text, height / 10, height / 2);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.strokeText(text, height / 10, height / 2);

    text = 'Mb/s';
    context.font = `${50}px "Microsoft Yahei" `;
    context.fillStyle = color;
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    context.fillText(text, width - height / 10, height / 2 + 20);

    return canvas;
  },

  inspection(network) {
    let leftDoor,
      rightDoor;
    let rack;
    network.getDataBox().forEach((element) => {
      if (element.getClient('type') === 'left-door') {
        leftDoor = element;
      }
      if (element.getClient('type') === 'right-door') {
        rightDoor = element;
      }
      if (element.getClient('label') === '1A04') {
        rack = element;
      }
    });

    const actions1 = [{
      px: 2000,
      py: 500,
      pz: 2000,
      tx: 0,
      ty: 0,
      tz: 0,
    },
    {
      px: 2000,
      pz: -2000,
    },
    {
      px: 0,
      pz: -2500,
    },
    {
      px: -2000,
    },
    {
      px: -2500,
      pz: 0,
    },
    {
      pz: 2000,
    },
    {
      px: -1200,
      tx: -350,
      ty: 170,
      tz: 500,
    },
    {
      px: -550,
      py: 190,
      pz: 1100,
    },
    ];

    const actions2 = [{
      px: -350,
      py: 120,
      pz: 600,
      tx: -340,
      ty: 150,
      tz: -300,
    },
    {
      py: 100,
      pz: 200,
    },
    {
      px: -300,
      py: 300,
      pz: 150,
      ty: 70,
    },
    ];

    const showAlarmAction = function(element) {
      const card = element.alarmCard;
      const position = card.getWorldPosition();
      const actions3 = [{
        px: position.x,
        py: position.y,
        pz: position.z + 120,
        tx: position.x,
        ty: position.y + 10,
        tz: position.z,
      },
      {
        px: position.x - 30,
        py: position.y + 30,
        pz: position.z + 90,
        ty: position.y + 15,
      },
      ];
      mono.AniUtil.playInspection(network, actions3, () => {
        demo.playAnimation(card, card.getClient('animation'), () => {
          network.inspecting = false;
          demo.showAlarmDialog();
        });
      });
    };

    rack.setClient('loaded.func', showAlarmAction);

    const doorOpen = function() {
      demo.playAnimation(leftDoor, leftDoor.getClient('animation'), () => {
        mono.AniUtil.playInspection(network, actions2, () => {
          const door = rack.door;
          demo.playAnimation(door, door.getClient('animation'));
        });
      });
      demo.playAnimation(rightDoor, rightDoor.getClient('animation'));
    };
    mono.AniUtil.playInspection(network, actions1, doorOpen);
  },

  showAlarmDialog() {
    const span = document.createElement('span');
    span.style['background-color'] = 'rgba(255,255,255,0.85)';
    span.style.padding = '10px';
    span.style.color = 'darkslategrey';
    span.innerHTML = '<b>告警描述</b>' +
      '<p>中兴S330板卡有EPE1，LP1，OL16，CSB,SC，EPE1（2M电口）与LP1（155M光）与用户路由器连接。' +
      'EPE1上发生TU-AIS ,TU-LOP，UNEQ，误码秒告警，所配业务均出现，用户路由器上出现频繁up，down告警。' +
      '用户路由器上与1块LP1（有vc12级别的交叉）连接的cpos板卡上也有频繁up，down告警，与另一块LP1（vc4穿通）' +
      '连接的cpos卡上无告警</p>' +
      '<b>故障分析</b>' +
      '<p>情况很多。如果只是单站出现，首先判断所属环上保护，主用光路有没有告警；如果有，解决主用线路问题；' +
      '如果没有，做交叉板主备切换--当然是在晚上进行；很少出现主备交叉板都坏的情况。' +
      '还没解决的话，依次检查单板和接口板。</p>';

    demo.showDialog(span, 'SDH 2M支路板告警', 510, 250);
    span.style.width = '484px';
    span.style.height = '203px';
  },

  toggleLinkVisible(network) {


  },

  resetView(network) {
    demo.resetCamera(network);

    // reset all racks. unload contents, close door.
    const loadedRacks = [];
    network.getDataBox().forEach((element) => {
      if (element.getClient('type') === 'rack' && element.oldRack) {
        loadedRacks.push(element);
      }
    });
    for (var i = 0; i < loadedRacks.length; i++) {
      // restore the old rack.
      const newRack = loadedRacks[i];
      const oldRack = newRack.oldRack;

      if (newRack.alarm) {
        network.getDataBox().getAlarmBox().remove(newRack.alarm);
      }
      network.getDataBox().removeByDescendant(newRack, true);

      network.getDataBox().add(oldRack);
      if (oldRack.alarm) {
        network.getDataBox().getAlarmBox().add(oldRack.alarm);
      }
      oldRack.door.setParent(oldRack);
      oldRack.setClient('loaded', false);

      // reset door.
      var door = oldRack.door;
      network.getDataBox().add(door);
      if (door.getClient('animated')) {
        demo.playAnimation(door, door.getClient('animation'));
      }
    }

    // reset room door.
    const doors = [];
    network.getDataBox().forEach((element) => {
      if (element.getClient('type') === 'left-door' || element.getClient('type') === 'right-door') {
        doors.push(element);
      }
    });
    for (var i = 0; i < doors.length; i++) {
      var door = doors[i];
      if (door.getClient('animated')) {
        demo.playAnimation(door, door.getClient('animation'));
      }
    }

    // reset all views.
    if (network.temperatureView) {
      demo.toggleTemperatureView(network);
    }
    if (network.spaceView) {
      demo.toggleSpaceView(network);
    }
    if (network.usageView) {
      demo.toggleUsageView(network);
    }
    if (network.airView) {
      demo.toggleAirView(network);
    }
    if (network.moveView) {
      demo.toggleMoveView(network);
    }
    if (network.connectionView) {
      demo.toggleConnectionView(network);
    }
    if (network.smokeView) {
      demo.toggleSmokeView(network);
    }
    if (network.waterView) {
      demo.toggleWaterView(network);
    }
    if (network.laserView) {
      demo.toggleLaserView(network);
    }
    if (network.powerView) {
      demo.togglePowerView(network);
    }
  },

  resetRackPosition(network) {
    // reset all rack position
    network.getDataBox().forEach((element) => {
      if (element.getClient('type') === 'rack') {
        element.setPosition(element.getClient('origin'));
      }
    });
    demo.dirtyShadowMap(network);
  },

  showDoorTable() {
    const table = document.createElement('table');
    table.setAttribute('class', styles.gridtable);
    for (let k = 0; k < 8; k++) {
      const tr = document.createElement('tr');
      table.appendChild(tr);
      for (let i = 0; i < 3; i++) {
        const tagName = k == 0 ? 'th' : 'td';
        const td = document.createElement(tagName);
        tr.appendChild(td);
        if (k == 0) {
          if (i == 0) {
            td.innerHTML = '#';
          }
          if (i == 1) {
            td.innerHTML = 'Time';
          }
          if (i == 2) {
            td.innerHTML = 'Activity';
          }
        } else {
          if (i == 0) {
            td.innerHTML = Math.floor(Math.random() * 1000);
          }
          if (i == 1) {
            td.innerHTML = new Date().format('yyyy h:mm');
          }
          if (i == 2) {
            if (Math.random() > 0.5) {
              td.innerHTML = 'Door access allowed';
            } else {
              td.innerHTML = 'Instant Alart - Door access denied';
            }
          }
        }
      }
    }

    demo.showDialog(table, 'Door Security Records', 330, 240);
  },

  toggleSmokeView(network) {
    network.smokeView = !network.smokeView;
    network.getDataBox().forEach((element) => {
      const type = element.getClient('type');
      if (type === 'smoke' || type === 'extinguisher_arrow') {
        element.setVisible(network.smokeView);
      }
    });
  },

  startSmokeAnimation(network) {
    setInterval(demo.updateSmoke(network), 200);
  },

  startFpsAnimation(network) {
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.color = 'white';
    span.style['font-size'] = '10px';
    span.style.position = 'absolute';
    span.style.left = '10px';
    span.style.top = '10px';
    span.style.visibility = 'hidden';
    demo.htmlElement.appendChild(span);
    network.fpsDiv = span;

    demo.fps = 0;
    network.setRenderCallback(() => {
      demo.fps++;
    });
    setInterval(demo.updateFps(network), 1000);
  },

  toggleFpsView(network) {
    network.fpsView = !network.fpsView;

    if (network.fpsView) {
      network.fpsDiv.style.visibility = 'inherit';
    } else {
      network.fpsDiv.style.visibility = 'hidden';
    }
  },


  updateSmoke(network) {
    return function() {
      if (network.smokeView) {
        network.getDataBox().forEach((element) => {
          if (element.getClient('type') === 'smoke' && element.isVisible()) {
            const smoke = element;
            const count = smoke.vertices.length;
            for (let i = 0; i < count; i++) {
              const point = smoke.vertices[i];
              point.y = Math.random() * 200;
              point.x = Math.random() * point.y / 2 - point.y / 4;
              point.z = Math.random() * point.y / 2 - point.y / 4;
            }
            smoke.verticesNeedUpdate = true;
            network.dirtyNetwork();
          }
        });
      }
    };
  },

  updateFps(network) {
    return function() {
      network.fpsDiv.innerHTML = `FPS:  ${demo.fps}`;
      demo.fps = 0;
    };
  },

  toggleWaterView(network) {
    network.waterView = !network.waterView;
    if (network.waterView) {
      demo.createWaterLeaking(network.getDataBox());
      network.getDataBox().oldAlarms = network.getDataBox().getAlarmBox().toDatas();
      network.getDataBox().getAlarmBox().clear();
    } else {
      if (network.getDataBox().waterLeakingObjects) {
        for (let i = 0; i < network.getDataBox().waterLeakingObjects.length; i++) {
          network.getDataBox().remove(network.getDataBox().waterLeakingObjects[i]);
        }
      }
      network.getDataBox().oldAlarms.forEach((alarm) => {
        network.getDataBox().getAlarmBox().add(alarm);
      });
    }

    network.getDataBox().forEach((element) => {
      const type = element.getClient('type');
      if (type === 'water_cable') {
        element.setVisible(network.waterView);
      } else if (type && type !== 'floorCombo' && type !== 'extinguisher' && type !== 'glassWall') {
        if (network.waterView) {
          if (type === 'rack' || type === 'rack_door') {
            element.oldTransparent = element.getStyle('m.transparent');
            element.oldOpacity = element.getStyle('m.opacity');
            element.setStyle('m.transparent', true);
            element.setStyle('m.opacity', 0.1);
          } else {
            element.oldVisible = element.isVisible();
            element.setVisible(false);
          }
        } else if (type === 'rack' || type === 'rack_door') {
          element.setStyle('m.transparent', element.oldTransparent);
          element.setStyle('m.opacity', element.oldOpacity);
        } else {
          element.setVisible(element.oldVisible);
        }
      }
    });
  },

  createWaterLeaking(box) {
    const sign = new mono.Billboard();
    sign.s({
      'm.texture.image': demo.getRes('alert.png'),
      'm.vertical': true,
    });
    sign.setScale(80, 160, 1);
    sign.setPosition(50, 90, 50);
    box.add(sign);

    const ball = new mono.Sphere(30);
    ball.s({
      'm.transparent': true,
      'm.opacity': 0.8,
      'm.type': 'phong',
      'm.color': '#58FAD0',
      'm.ambient': '#81BEF7',
      'm.specularStrength': 50,
      'm.normalmap.image': demo.getRes('rack_inside_normal.jpg'),
    });
    ball.setPosition(50, 0, 50);
    ball.setScale(1, 0.1, 0.7);
    box.add(ball);

    box.waterLeakingObjects = [sign, ball];
  },

  toggleLaserView(network) {
    network.laserView = !network.laserView;

    network.getDataBox().forEach((element) => {
      if (element.getClient('type') === 'laser') {
        element.setVisible(network.laserView);
      }
    });
  },

  setupControlBar(network) {
    const div = document.createElement('div');

    div.setAttribute('id', 'toolbar');
    div.style.display = 'block';
    div.style.position = 'absolute';
    div.style.left = '20px';
    div.style.top = '10px';
    div.style.width = 'auto';
    demo.htmlElement.appendChild(div);
  },

  setupToolbar(buttons) {
    const count = buttons.length;
    const step = 32;

    const div = document.createElement('div');
    div.setAttribute('id', 'toolbar');
    div.style.display = 'block';
    div.style.position = 'absolute';
    div.style.left = '10px';
    div.style.top = '75px';
    div.style.width = '32px';
    div.style.height = `${count * step + step}px`;
    div.style.background = 'rgba(255,255,255,0.75)';
    div.style['border-radius'] = '5px';
    demo.htmlElement.appendChild(div);

    for (let i = 0; i < count; i++) {
      const button = buttons[i];
      const icon = button.icon;
      const img = document.createElement('img');
      img.style.position = 'absolute';
      img.style.left = '4px';
      img.style.top = `${step / 2 + (i * step)}px`;
      img.style['pointer-events'] = 'auto';
      img.style.cursor = 'pointer';
      img.setAttribute('src', demo.getRes(icon));
      img.style.width = '24px';
      img.style.height = '24px';
      img.setAttribute('title', button.label);
      img.onclick = button.clickFunction;
      div.appendChild(img);
    }
  },

  togglePowerView(network) {
    if (!network.powerLineCreated) {
      demo.createPowerLines(network);
    }
    network.powerView = !network.powerView;

    network.getDataBox().forEach((element) => {
      const type = element.getClient('type');
      if (type === 'power_line') {
        element.setVisible(network.powerView);
      }
    });
  },

  createPowerLines(network) {
    const box = network.getDataBox();

    const createRackLines = function(labels, offsetZ) {
      box.forEach((element) => {
        if (element.getClient('type') === 'rack') {
          const label = element.getClient('label');
          if (labels.indexOf(label) > -1) {
            const position = element.getPosition();
            var points = [];
            points.push([position.x, position.y, position.z]);
            points.push([position.x, position.y, position.z - 60]);
            points.push([position.x, 240, position.z - 60]);
            points.push([position.x, 240, offsetZ]);
            points.push([-550, 240, offsetZ]);
            demo.createPathLink(box, points, '#FE9A2E', 'power_line');

            var points = [];
            points.push([position.x - 5, position.y, position.z]);
            points.push([position.x - 5, position.y, position.z - 60]);
            points.push([position.x - 5, 250, position.z - 60]);
            points.push([position.x - 5, 250, offsetZ]);
            points.push([-550, 250, offsetZ]);
            demo.createPathLink(box, points, 'cyan', 'power_line');

            offsetZ -= 5;
          }
        }
      });
    };

    createRackLines(['1A07', '1A08', '1A09', '1A10', '1A11', '1A12', '1A13'], 150);
    createRackLines(['1A00', '1A01', '1A02'], 160);
    createRackLines(['1A03', '1A04', '1A05', '1A06'], -300);

    demo.createPathLink(box, [
      [-1000, 420, 600],
      [-800, 250, 500],
      [-550, 250, 500],
      [-550, 250, -315],
    ], 'cyan', 'power_line');
    demo.createPathLink(box, [
      [-1000, 410, 600],
      [-800, 240, 500],
      [-550, 240, 500],
      [-550, 240, -315],
    ], '#FE9A2E', 'power_line');
  },

  createPathLink(box, points, color, clientType) {
    if (points && points.length > 1) {
      color = color || 'white';
      for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];

        const fromNode = new mono.Cube(0.001, 0.001, 0.001);
        fromNode.s({
          'm.color': color,
        });
        fromNode.setPosition(from[0], from[1], from[2]);
        fromNode.setClient('type', clientType);
        box.add(fromNode);

        const toNode = fromNode.clone();
        toNode.setPosition(to[0], to[1], to[2]);
        toNode.setClient('type', clientType);
        box.add(toNode);

        const link = new mono.Link(fromNode, toNode);
        link.s({
          'm.color': color,
        });
        link.setClient('type', clientType);
        box.add(link);
      }
    }
  },
};

export default demo;
