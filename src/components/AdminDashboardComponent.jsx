import React from 'react';

import 'antd/dist/antd.less';
import logo2 from '../images/logo2.png';
import { useHistory, useLocation } from "react-router-dom";
import { Menu, Avatar, Typography, Modal, Layout } from 'antd';
import {
    HomeOutlined, MessageOutlined, UserOutlined, LogoutOutlined,
    ExclamationCircleOutlined, CarOutlined
} from '@ant-design/icons';
import '../styles/admin-dashboard.less';
import ManageCarsComponent from './ManageCarsComponent';
import ManageFeedbackComponent from './ManageFeedbackComponent';

function AdminDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content, Footer } = Layout;
    const history = useHistory();
    const location = useLocation();

    function logoutButton() {
        history.push('/login');
    }
    function manageCars() {
        history.push('/manage/cars')
    }
    function dashboard() {
        history.push('/')
    }
    function manageFeedback() {
        history.push('/manage/feedback')
    }

    function confirm() {
        Modal.confirm({
            title: 'Log out',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to log out?',
            okText: 'Ok',
            cancelText: 'Cancel',
            onOk: logoutButton,
        });
    }


    return (
        <Layout>
            <Sider
                breakpoint="lg"
                theme="light"
                collapsedWidth="0"
            >
                <img src={logo2} className="logo" alt="logging..." />
                <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
                    <Menu.Item key="/" icon={<HomeOutlined />} onClick={dashboard}>Dashboard</Menu.Item>
                    <Menu.Item key="/manage/cars" icon={<CarOutlined />} onClick={manageCars}>Manage Cars</Menu.Item>
                    <Menu.Item key="/manage/feedback" icon={<MessageOutlined />} onClick={manageFeedback}>Manage Feedback</Menu.Item>
                    <Menu.Item key="25" icon={<UserOutlined />}>Profile</Menu.Item>
                    <Menu.Item key="23" onClick={confirm} icon={<LogoutOutlined />}>Log out</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                    <Avatar size={40} className="avatar" icon={<UserOutlined />} />
                    <Title level={5} className="userName">Welcome, Nguyễn Minh Thư</Title>
                </Header>

                <Content style={{ margin: '24px 16px 0' }} >
                    {(() => {
                        switch (location.pathname) {
                            case '/manage/cars':
                                return (
                                    <ManageCarsComponent />
                                )
                            case '/manage/feedback':
                                return (
                                    <ManageFeedbackComponent />
                                )
                            default:
                                return (
                                    console.log("deo ok")
                                )
                        }
                    })()}
                </Content>
                <Footer style={{ textAlign: 'center' }}></Footer>
            </Layout>
        </Layout>

    )
}

export default AdminDashboardComponent;
