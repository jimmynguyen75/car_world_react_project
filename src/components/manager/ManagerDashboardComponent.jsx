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
import ManageProposalsComponent from '../proposals/ManageProposalsComponent';
import ManagerBodyDashboardComponent from './ManagerBodyDashboardComponent';


function ManagerDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content } = Layout;
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState("")
    const currentUser = AccountService.getCurrentUser();
    const [title, setTitle] = useState('');
    useEffect(() => {
        if (location.pathname === "/") {
            console.log(location.pathname)
            setTitle('Trang chủ')
        }
        if (location.pathname === "/bai-dang") {
            console.log(location.pathname)
            setTitle('Quản lý bài đăng')
        }
        if (location.pathname === "/de-xuat") {
            console.log(location.pathname)
            setTitle('Quản lý đề xuất')
        }
        if (location.pathname === "/su-kien") {
            console.log(location.pathname)
            setTitle('Quản lý sự kiện')
        }
        if (location.pathname === "/cuoc-thi") {
            console.log(location.pathname)
            setTitle('Quản lý cuộc thi')
        }
        if (location.pathname === "/phan-hoi") {
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
        window.location.href = '/'
    }
    function manageProposal() {
        history.push('/de-xuat')
    }
    function managePosts() {
        history.push('/bai-dang')
    }
    function manageEvents() {
        history.push('/su-kien')
    }
    function dashboard() {
        history.push('/')
    }
    function manageFeedback() {
        history.push('/phan-hoi')
    }
    function manageContests() {
        history.push('/cuoc-thi')
    }
    function profile() {
        history.push('/thong-tin-ca-nhan')
    }
    useEffect(() => {
        AccountService.getUserById(currentUser.Id)
            .then((res) => {
                setUser(res.data)
            })
            .catch(err => { console.log(err) });
    }, [currentUser.Id]);
    function confirmLogout() {
        Modal.confirm({
            title: 'Đăng xuất',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có muốn đăng xuất không?',
            okText: 'Có',
            cancelText: 'Không',
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
                    <Menu.Item key="/" icon={<HomeOutlined style={{ fontSize: 18, color: '#316B83', paddingTop: 2 }} />} onClick={dashboard}>Trang chủ</Menu.Item>
                    <Menu.Item key="/de-xuat" onClick={manageProposal}><i class="far fa-lightbulb" style={{ fontSize: 18, color: '#FF7878', paddingTop: 4 }} />&nbsp;&nbsp;&nbsp;&nbsp;Quản lý đề xuất</Menu.Item>
                    <Menu.Item key="/bai-dang" onClick={managePosts}><i class="far fa-clone" style={{ fontSize: 18, color: '#DBAD68', paddingTop: 4 }} />&nbsp;&nbsp;<span style={{paddingLeft: 2}}>Quản lý bài đăng</span></Menu.Item>
                    <Menu.Item key="/su-kien" onClick={manageEvents}><i class="fas fa-calendar-alt" style={{ fontSize: 18, color: '#52BCC2' }} />&nbsp;&nbsp;&nbsp;Quản lý sự kiện</Menu.Item>
                    <Menu.Item key="/cuoc-thi" onClick={manageContests}><i class="fas fa-trophy" style={{ fontSize: 18, color: '#BFA2DB', paddingTop: 4 }} />&nbsp;&nbsp;Quản lý cuộc thi</Menu.Item>
                    <Menu.Item key="/phan-hoi" icon={<MessageOutlined style={{ fontSize: 18, color: '#6B7AA1', paddingTop: 2 }} />} onClick={manageFeedback}>Quản lý phản hồi</Menu.Item>
                    <Menu.Item key="/thong-tin-ca-nhan" icon={<UserOutlined style={{ fontSize: 18, color: '#9E7777' }} />} onClick={profile}>Thông tin cá nhân</Menu.Item>
                    <Menu.Item key="/dang-xuat" onClick={confirmLogout} icon={<LogoutOutlined style={{ fontSize: 18, color: '#E9BEBE', paddingTop: 2 }} />}>Đăng xuất</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                    <Avatar size={45} className="avatar" src={user.Image}> </Avatar>
                    <Title level={5} className="userName">Welcome, {user.FullName}</Title>
                </Header>

                <Content style={{ margin: '24px 16px 0' }} >
                    {(() => {
                        switch (location.pathname) {
                            case '/quan-ly':
                                return (
                                    <ManagerBodyDashboardComponent />
                                )
                            case '/bai-dang':
                                return (
                                    <ManagePostsComponent />
                                )
                            case '/tao-bai-dang':
                                return (
                                    <CreatePostModalComponent />
                                )
                            case '/phan-hoi':
                                return (
                                    <ManageFeedbackComponent />
                                )
                            case '/su-kien':
                                return (
                                    <ManageEventsComponent />
                                )
                            case '/cuoc-thi':
                                return (
                                    <ManageContestsComponent />
                                )
                            case '/de-xuat':
                                return (
                                    <ManageProposalsComponent />
                                )
                            case '/thong-tin-ca-nhan':
                                return (
                                    <ProfileComponent />
                                )
                            default:
                                return (
                                    console.log("Success")
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
