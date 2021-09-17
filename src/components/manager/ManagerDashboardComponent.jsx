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
import ManagePostsComponent from '../posts/ManagePostsComponent';
import ManageFeedbackComponent from '../feedback/ManageFeedbackComponent';
import ManageContestsComponent from '../contests/ManageContestsComponent';
import ManageEventsComponent from '../events/ManageEventsComponent';
import ProfileComponent from '../profile/ProfileComponent';
import ManagerBodyDashboardComponent from './ManagerBodyDashboardComponent';


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
    function managePosts() {
        history.push('/quan-ly/bai-dang')
    }
    function manageEvents() {
        history.push('/quan-ly/su-kien')
    }
    function dashboard() {
        history.push('/quan-ly')
    }
    function manageFeedback() {
        history.push('/quan-ly/phan-hoi')
    }
    function manageContests() {
        history.push('/quan-ly/cuoc-thi')
    }
    function profile() {
        history.push('/thong-tin-ca-nhan')
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
                    <Menu.Item key="/quan-ly" icon={<HomeOutlined />} onClick={dashboard}>Trang chủ</Menu.Item>
                    <Menu.Item key="/quan-ly/bai-dang" icon={<CarOutlined />} onClick={managePosts}>Quản lý bài đăng</Menu.Item>
                    <Menu.Item key="/quan-ly/su-kien" icon={<CarOutlined />} onClick={manageEvents}>Quản lý sự kiện</Menu.Item>
                    <Menu.Item key="/quan-ly/cuoc-thi" icon={<CarOutlined />} onClick={manageContests}>Quản lý cuộc thi</Menu.Item>
                    <Menu.Item key="/quan-ly/phan-hoi" icon={<MessageOutlined />} onClick={manageFeedback}>Quản lý phản hồi</Menu.Item>
                    <Menu.Item key="/thong-tin-ca-nhan" icon={<UserOutlined />} onClick={profile}>Thông tin cá nhân</Menu.Item>
                    <Menu.Item key="" onClick={confirmLogout} icon={<LogoutOutlined />}>Đăng xuất</Menu.Item>
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
                            case '/quan-ly':
                                return (
                                    <ManagerBodyDashboardComponent />
                                )
                            case '/quan-ly/bai-dang':
                                return (
                                    <ManagePostsComponent />
                                )
                            case '/quan-ly/phan-hoi':
                                return (
                                    <ManageFeedbackComponent />
                                )
                            case '/quan-ly/su-kien':
                                return (
                                    <ManageEventsComponent />
                                )
                            case '/quan-ly/cuoc-thi':
                                return (
                                    <ManageContestsComponent />
                                )
                            case '/quan-ly/cuoc-thi':
                                return (
                                    <ManageContestsComponent />
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
