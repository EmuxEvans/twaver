import { Table, Input, Icon, Button, Popconfirm } from 'antd';
const urlsendindex = 'http://127.0.0.1:5000/deletedevice';
const urlgetdata = 'http://127.0.0.1:5000/getalldevice';

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备编号',
      dataIndex: 'deviceNo',
    }, {
      title: '所在机柜编号',
      dataIndex: 'cabinetNo',
    }, {
      title: '额定功率',
      dataIndex: 'ratedPower',
    }, {
      title: '设备类型',
      dataIndex: 'deviceType',
    }, {
      title: '责任人',
      dataIndex: 'responsible',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.deviceNo)}>
              <a href="#">删除</a>
            </Popconfirm>
          ) : null
        );
      },
    }];

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
          temp["deviceNo"]=resp[i].Numbering;
          temp["cabinetNo"]=resp[i].cabinetNumbering;
          temp["ratedPower"]=resp[i].ratedPower;
          switch(resp[i].category) {
            case "11": {
              temp["deviceType"]="机架式服务器";
              break;
            }
            case "12": {
              temp["deviceType"]="机架式服务器";
              break;
            }
            case "15": {
              temp["deviceType"]="机架式存储设备";
              break;
            }
            case "16": {
              temp["deviceType"]="小型机";
              break;
            }
            case "17": {
              temp["deviceType"]="网络交换机";
              break;
            }
            case "18": {
              temp["deviceType"]="路由器";
              break;
            }
            case "19": {
              temp["deviceType"]="其他网络设备";
              break;
            }                                                                        
          }
          
          temp["responsible"]=resp[i].responsible;
          data.push(temp);        
        }

        this.setState({
          dataSource:data
        });
    })
    .catch(error => console.log(error))
  }

  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);

    var data = new FormData();
    data.append('deviceNo', index);
    fetch(urlsendindex, {
      method: 'POST',
      mode: 'cors',
      header: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: data
    })
    .then(function(resp) {
      if(resp.ok) {
        console.log("success RESP");
      }
    });

    this.setState({ dataSource });
  }

  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}
