import React from 'react';
import { connect } from "dva";
import Buckets from "../components/Buckets.js";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    onCollapse(collapsed){
       console.log(collapsed);
       this.setState({ collapsed });
     }
    render() {
        return (
            <div>
               <Layout style={{ minHeight: '100vh' }}>
                       <Sider
                         collapsible
                         collapsed={this.state.collapsed}
                         onCollapse={this.onCollapse.bind(this)}
                       >
                         <div className="logo" />
                         <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                           <Menu.Item key="1">
                             <Icon type="pie-chart" />
                             <span>云服务器 ECS</span>
                           </Menu.Item>
                           <Menu.Item key="2">
                             <Icon type="desktop" />
                             <span>云数据库 RDS</span>
                           </Menu.Item>
                           <Menu.Item key="22">
                             <Icon type="desktop" />
                             <span>专有网络 VPC</span>
                           </Menu.Item>
                           <SubMenu
                             key="sub1"
                             title={<span><Icon type="user" /><span>对象存储 OSS</span></span>}
                           >
                             <Menu.Item key="3">创建存储</Menu.Item>
                           </SubMenu>
                           <SubMenu
                             key="sub2"
                             title={<span><Icon type="team" /><span>负载均衡</span></span>}
                           >
                             <Menu.Item key="6">实例管理</Menu.Item>
                             <Menu.Item key="8">证书管理</Menu.Item>
                             <Menu.Item key="9">访问控制</Menu.Item>
                             <Menu.Item key="10">操作日志</Menu.Item>
                             <Menu.Item key="11">访问日志</Menu.Item>
                           </SubMenu>
                           <Menu.Item key="12">
                             <Icon type="file" />
                             <span>云市场</span>
                           </Menu.Item>
                         </Menu>
                       </Sider>
                       <Layout>
                         <Header style={{ background: '#fff', padding: 24 }} />
                         <Content style={{ margin: '0 16px',padding: 24, background: '#fff', minHeight: 360 }}>
                           <Buckets></Buckets>
                         </Content>
                         <Footer style={{ textAlign: 'center' }}>
                           云存储服务 ©2018-09-08 Created by HuangChunLong
                         </Footer>
                       </Layout>
                     </Layout>
            </div>
        );
    }
}
