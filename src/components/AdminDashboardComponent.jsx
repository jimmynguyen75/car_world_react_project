import React from 'react';
import 'antd/dist/antd.less';
import { Menu, Avatar, Typography, Modal } from 'antd';
import {
    AppstoreOutlined, MailOutlined, SettingOutlined, HomeOutlined, MessageOutlined, UserOutlined, LogoutOutlined,
    ExclamationCircleOutlined, CarOutlined } from '@ant-design/icons';
import '../styles/admin-dashboard.less';

function AdminDashboardComponent() {
    const { SubMenu } = Menu;
    const { Title } = Typography;

    function confirm()  {
        Modal.confirm({
            title: 'Log out',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to log out?',
            okText: 'Cancel',
            cancelText: 'Ok',
        });
    }
    class Sider extends React.Component {
        handleClick = e => {
            console.log('click ', e);
        };

        render() {
            return (
                <Menu
                    onClick={this.handleClick}
                    style={{ width: 300 }}
                    defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <Avatar size={80} className="avatar" icon={<UserOutlined />} />
                    <Title level={4} className="userName">Nguyễn Minh Thư</Title>
                    <Menu.Item key="21" icon={<HomeOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="24" icon={<CarOutlined />}>Manage Cars</Menu.Item>
                    <Menu.Item key="22" icon={<MessageOutlined />}>Manage Feedback</Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
                        <Menu.ItemGroup key="g1" title="Item 1">
                            <Menu.Item key="1">Option 1</Menu.Item>
                            <Menu.Item key="2">Option 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup key="g2" title="Item 2">
                            <Menu.Item key="3">Option 3</Menu.Item>
                            <Menu.Item key="4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
                        <Menu.Item key="5">Option 5</Menu.Item>
                        <Menu.Item key="6">Option 6</Menu.Item>
                        <SubMenu key="sub3" title="Submenu">
                            <Menu.Item key="7">Option 7</Menu.Item>
                            <Menu.Item key="8">Option 8</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="25" icon={<UserOutlined />}>Profile</Menu.Item>
                    <Menu.Item key="23" onClick={confirm} icon={<LogoutOutlined />}>Log out</Menu.Item>
                </Menu>
            );
        }
    }

    return (
        <Sider />
    )
}

export default AdminDashboardComponent;
