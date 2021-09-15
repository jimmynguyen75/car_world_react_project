import React, { useEffect } from 'react';
import 'antd/dist/antd.less';
import logo2 from '../../images/logo2.png';
import { useHistory, useLocation } from "react-router-dom";
import { Menu, Avatar, Typography, Modal, Layout } from 'antd';
import {
    HomeOutlined, MessageOutlined, UserOutlined, LogoutOutlined,
    ExclamationCircleOutlined, CarOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import '../../styles/admin-dashboard.less';
import ManageCarsComponent from '../cars/ManageCarsComponent';
import ManageFeedbackComponent from '../ManageFeedbackComponent';
import ManageAccountsComponent from '../ManageAccountsComponent';
import ProfileComponent from '../ProfileComponent';

function ManagerDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content, Footer } = Layout;
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        let title = "Car World | Admin"
        document.title = title;
    }, []);

    function logoutButton() {
        history.push('/login');
    }
    function manageCars() {
        history.push('/manage/cars')
    }
    function dashboard() {
        history.push('/admin')
    }
    function manageFeedback() {
        history.push('/manage/feedback')
    }
    function manageAccounts() {
        history.push('/manage/accounts')
    }
    function profile() {
        history.push('/profile')
    }

    function confirmLogout() {
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
                //collapsedWidth="0"
                className="siderDashboard"
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}
            >
                <img src={logo2} className="logo" alt="logo..." />
                <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
                    <Menu.Item key="/admin" icon={<HomeOutlined />} onClick={dashboard}>Dashboard</Menu.Item>
                    <Menu.Item key="/manage/cars" icon={<CarOutlined />} onClick={manageCars}>Manage Events</Menu.Item>
                    <Menu.Item key="/manage/cars" icon={<CarOutlined />} onClick={manageCars}>Manage Contests</Menu.Item>
                    <Menu.Item key="/manage/feedback" icon={<MessageOutlined />} onClick={manageFeedback}>Manage Feedback</Menu.Item>
                    <Menu.Item key="/profile" icon={<UserOutlined />} onClick={profile}>Profile</Menu.Item>
                    <Menu.Item key="" onClick={confirmLogout} icon={<LogoutOutlined />}>Log out</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
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
                            case '/manage/accounts':
                                return (
                                    <ManageAccountsComponent />
                                )
                            case '/logout':
                                return (
                                    <ProfileComponent />
                                )
                            default:
                                return (
                                    console.log("deo ok")
                                )
                        }
                    })()}
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
            </Layout>
        </Layout >

    )
}

export default ManagerDashboardComponent;
