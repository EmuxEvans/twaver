import { Table, message } from 'antd';
const urlgetdata = "http://127.0.0.1:5000/getalldevice";
const urlonandoff = "http://127.0.0.1:5000/onandoff";

export default class OnandOff extends React.Component{
  constructor(props) {
    super(props);
    this.columns = [
      { title: '设备编号', width: 100, dataIndex: 'Numbering', key: 'Numbering', fixed: 'left' },
      { title: '所属机柜编号', dataIndex: 'cabinetNumbering', key: '1', width: 150},
      { title: '额定功率', dataIndex: 'ratedPower', key: '2', width: 150 },
      { title: '设备高度', dataIndex: 'height', key: '3', width: 150 },
      { title: '设备类型', dataIndex: 'category', key: '4', width: 150 },
      { title: '实际温度', dataIndex: 'actualTemperature', key: '5', width: 150 },
      { title: '实际功率', dataIndex: 'actualPowerLoad', key: '6', width: 150 },
      { title: '上电/下电', dataIndex: 'on', key: '7', width: 150 },
      { title: '上柜/下柜', dataIndex: 'onCabinet', key: '8', width: 150},
      { title: '负责人', dataIndex: 'responsible', key: '9', width: 150},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => {
          return (
            <span>
              <a  onClick={() => this.turnOn(record.Numbering)}>上电</a>
              <span className="ant-divider" />
              <a  onClick={() => this.turnOff(record.Numbering)}>下电</a>
            </span>
          );
        },
      },
    ];

    this.state = {
      dataSource: [],
    };
  }

  componentDidMount =()=>{
    this.loadData();

  }

  loadData=() =>{
    fetch(urlgetdata, {
      method: 'GET',
      mode: 'cors',
    })
    .then(resp => resp.json())
    .then((resp) => {
        const data=[];
        for (var i in resp) {    
          var temp = new Object();    
          temp["key"]= resp[i].Numbering;
          temp["Numbering"]=resp[i].Numbering;
          temp["cabinetNumbering"]=resp[i].cabinetNumbering;
          temp["ratedPower"]=resp[i].ratedPower;
          temp["height"]=resp[i].height;
          switch(resp[i].category) {
            case "11": {
              temp["category"]="机架式服务器";
              break;
            }
            case "12": {
              temp["category"]="机架式服务器";
              break;
            }
            case "15": {
              temp["category"]="机架式存储设备";
              break;
            }
            case "16": {
              temp["category"]="小型机";
              break;
            }
            case "17": {
              temp["category"]="网络交换机";
              break;
            }
            case "18": {
              temp["category"]="路由器";
              break;
            }
            case "19": {
              temp["category"]="其他网络设备";
              break;
            }                                                                        
          }
          temp["responsible"]=resp[i].responsible;
          temp["actualTemperature"]=resp[i].actualTemperature;
          temp["actualPowerLoad"]=resp[i].actualPowerLoad;
          if(resp[i].on == 1)
            temp["on"]="已上电";
          else
            temp["on"]="未上电";

          if(resp[i].onCabinet == 1)
            temp["onCabinet"]="已上柜";
          else
            temp["onCabinet"]="未上柜";
          data.push(temp);
        }

        this.setState({
          dataSource:data
        });

    })
    .catch(error => console.log(error))
  }

  turnOn = (numbering) => {
    const dataSource = [...this.state.dataSource];

    var data = new FormData();
    data.append('serverNumbering', numbering);
    data.append('serviceNumber', 1);

    fetch("http://127.0.0.1:5000/onandoff" , {
      method: 'POST',
      //mode: 'no-cors',
      header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: data
    })
    .then(resp => resp.json())
    .then(resp =>  {
      if(resp.status == "success") {
        message.success('上电成功');
        Object.keys(dataSource).forEach((key) => {
          if(dataSource[key].Numbering == numbering) {
            dataSource[key].on = "已上电";
          }
        });
        this.setState({ dataSource });
      }
      if(resp.status == "fail") 
        message.warning('超过机柜阈值，无法上电');
      if(resp.status == "onfalse") 
        message.warning('该设备未上柜，无法上电');

    });
  }

  turnOff = (numbering) => {
    const dataSource = [...this.state.dataSource];

    var data = new FormData();
    data.append('serverNumbering', numbering);
    data.append('serviceNumber', 2);

    fetch("http://127.0.0.1:5000/onandoff" , {
      method: 'POST',
      mode: 'cors',
      header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: data
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp.status == "success") {
        message.success('下电成功');
        Object.keys(dataSource).forEach((key) => {
          if(dataSource[key].Numbering == numbering) {
            dataSource[key].on = "未上电";
          }
    });
    this.setState({ dataSource });
      }
      if(resp.status == "onCabinetfalse") {
        message.warning('该设备未上柜，无法下电');
      }
      if(resp.status == "onfalse")
        message.warning('该设备未上电，无法下电')
    });
  }


  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return(
      <Table columns={columns} dataSource={dataSource} scroll={{ x: 1500, y: 500 }} />
    );
  }
}