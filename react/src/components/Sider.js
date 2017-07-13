import React from 'react';
import { Menu, Icon, Switch, Form } from 'antd';
import { Link } from 'dva/router';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Nsider extends React.Component {
  state = {
    mode: 'inline',
  }

  changeMode = (value) => {
    this.setState({
      mode: value ? 'vertical' : 'inline',
    });
  }

  render() {
    const pathname = this.props.location.pathname;
    return (
      <div>
        <Switch onChange={this.changeMode} />
        <Menu
          style={{ width: 240 }}
          selectedKeys={[pathname]}
          mode={this.state.mode}
        >
          <SubMenu key="sub1" title={<span><Icon type="setting" /><span>机房视图</span></span>}>
            <Menu.Item key="/roomView3d"><Link to="/roomView3d">3D机房视图</Link></Menu.Item>
            <Menu.Item key="/roomView2d"><Link to="/roomView2d">2D机房视图</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="mail" /><span>主设备管理</span></span>}>
            <MenuItemGroup title="增加主设备">
              <Menu.Item key="/serverdevice"><Link to="/serverdevice">增加设备</Link></Menu.Item>
              <Menu.Item key="/serverframe"><Link to="/serverframe">增加机框</Link></Menu.Item>
              <Menu.Item key="/servermodule"><Link to="/servermodule">增加模块</Link></Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title="删除主设备">
              <Menu.Item key="/deldevice"><Link to="/deldevice">删除主设备</Link></Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="setting" /><span>设置警告阈值</span></span>}>
            <Menu.Item key="/threshold"><Link to="/threshold">设置阈值</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" title={<span><Icon type="setting" /><span>上/下电/柜管理</span></span>}>
            <Menu.Item key="/onandoff"><Link to="/onandoff">上/下电</Link></Menu.Item>
            <Menu.Item key="/upanddown"><Link to="/upanddown">上/下柜</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

const Sider = Form.create()(Nsider);
export default Sider;
