import { CarOutlined, ExclamationCircleOutlined, HomeOutlined, LogoutOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Modal, Typography } from 'antd';
import 'antd/dist/antd.less';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import logo2 from '../../images/logo2.png';
import AccountService from '../../services/AccountService';
import '../../styles/admin-dashboard.less';
import ManageContestsComponent from '../contests/ManageContestsComponent';
import ManageEventsComponent from '../events/ManageEventsComponent';
import ManageFeedbackComponent from '../feedback/ManageFeedbackComponent';
import CreatePostModalComponent from '../posts/CreatePostModalComponent';
import ManagePostsComponent from '../posts/ManagePostsComponent';
import ProfileComponent from '../profile/ProfileComponent';
import ManagerBodyDashboardComponent from './ManagerBodyDashboardComponent';


function ManagerDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content } = Layout;
    const history = useHistory();
    const location = useLocation();
    const currentUser = AccountService.getCurrentUser();
    const [title, setTitle] = useState('');
    useEffect(() => {
        if (location.pathname === "/quan-ly") {
            console.log(location.pathname)
            setTitle('Trang chủ')
        }
        if (location.pathname === "/quan-ly/bai-dang") {
            console.log(location.pathname)
            setTitle('Quản lý bài đăng')
        }
        if (location.pathname === "/quan-ly/su-kien") {
            console.log(location.pathname)
            setTitle('Quản lý sư kiện')
        }
        if (location.pathname === "/quan-ly/cuoc-thi") {
            console.log(location.pathname)
            setTitle('Quản lý cuộc thi')
        }
        if (location.pathname === "/quan-ly/phan-hoi") {
            console.log(location.pathname)
            setTitle('Quản lý phản hồi')
        }
        if (location.pathname === "/thong-tin-ca-nhan") {
            console.log(location.pathname)
            setTitle('Thông tin cá nhân')
        }
        document.title = title;
    }, [location.pathname, title])

    function logoutButton() {
        AccountService.logOut();
        history.replace('/login');
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
                className="siderDashboard"
                theme="light"
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
                    <Menu.Item key="/log-out" onClick={confirmLogout} icon={<LogoutOutlined />}>Đăng xuất</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                    <Avatar size={40} className="avatar" icon={<UserOutlined />} />
                    <Title level={5} className="userName">Welcome, {currentUser.FullName}</Title>
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
                            case '/quan-ly/tao-bai-dang':
                                return (
                                    <CreatePostModalComponent />
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
