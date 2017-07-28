import React from 'react';
import { Menu, Icon, Switch, Form } from 'antd';
import { Link } from 'dva/router';
import utility from '../utils/utility';
import constants from '../constants';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const allAuth = constants.auth;

class Nsider extends React.Component {
  state = {
    mode: 'inline',
  }

  changeMode = (value) => {
    this.setState({
      mode: value ? 'vertical' : 'inline',
    });
  }

  renderByAuth(auth) {
    if (allAuth.reviewer.includes(auth)) {
      return (
        [<SubMenu key="sub3" title={<span><Icon type="setting" /><span>设置警告阈值</span></span>}>
          <Menu.Item key={`/${auth}/threshold`}><Link to={`/${auth}/threshold`}>设置阈值</Link></Menu.Item>
        </SubMenu>,
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>上/下电/柜管理</span></span>}>
          <Menu.Item key={`/${auth}/onandoff`}><Link to={`/${auth}/onandoff`}>上/下电</Link></Menu.Item>
          <Menu.Item key={`/${auth}/upanddown`}><Link to={`/${auth}/upanddown`}>上/下柜</Link></Menu.Item>
        </SubMenu>]
      );
    }
    return (
      <SubMenu key="sub4" title={<span><Icon type="setting" /><span>上/下电/柜申请</span></span>}>
        <Menu.Item key={`/${auth}/onandoff`}><Link to={`/${auth}/onandoff`}>上/下电</Link></Menu.Item>
        <Menu.Item key={`/${auth}/upanddown`}><Link to={`/${auth}/upanddown`}>上/下柜</Link></Menu.Item>
      </SubMenu>
    );
  }

  render() {
    const pathname = this.props.location.pathname;
    const auth = utility.getAuth(this.props);
    console.log(pathname);
    return (
      <div>
        {/* <Switch onChange={this.changeMode} /> */}
        <Menu
          style={{ width: 240 }}
          selectedKeys={[pathname]}
          defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub4']}
          mode={this.state.mode}
        >
          <SubMenu key="sub1" title={<span><Icon type="environment-o" /><span>机房视图</span></span>}>
            <Menu.Item key={`/${auth}/roomView3d`}><Link to={`/${auth}/roomView3d`}>3D机房视图</Link></Menu.Item>
            {/* <Menu.Item key="/roomView2d"><Link to="/roomView2d">2D机房视图</Link></Menu.Item> */}
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="mail" /><span>主设备管理</span></span>}>
            <MenuItemGroup title="增加主设备">
              <Menu.Item key={`/${auth}/serverdevice`}><Link to={`/${auth}/serverdevice`}>增加设备</Link></Menu.Item>
              {/* <Menu.Item key="/serverframe"><Link to="/serverframe">增加机框</Link></Menu.Item> */}
              {/* <Menu.Item key="/servermodule"><Link to="/servermodule">增加模块</Link></Menu.Item> */}
            </MenuItemGroup>
            <MenuItemGroup title="删除主设备">
              <Menu.Item key={`/${auth}/deldevice`}><Link to={`/${auth}/deldevice`}>删除主设备</Link></Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          {this.renderByAuth(auth)}
        </Menu>
      </div>
    );
  }
}

const Sider = Form.create()(Nsider);
export default Sider;
