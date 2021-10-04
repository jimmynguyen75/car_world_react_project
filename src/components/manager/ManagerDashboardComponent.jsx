import { ExclamationCircleOutlined, HomeOutlined, LogoutOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Modal, Typography } from 'antd';
import 'antd/dist/antd.less';
import React, { useEffect, useState } from 'react';
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
import ViewDetailPostComponent from '../posts/ViewDetailPostComponent';
import removeVietnamese from '../../utils/removeVietnamese'
import EditPostComponent from '../posts/EditPostComponent';

function ManagerDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content } = Layout;
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState("")
    const currentUser = AccountService.getCurrentUser();
    const [title, setTitle] = useState('');

    // const recordPost = location.state != null && removeVietnamese.removeVietnameseTones(location.state.record.Title).replace(/\s+/g, '-').toLowerCase()
    //dư một space nên ko bằng
    // console.log("ok:", "/" + recordPost)
    // console.log("location:" + location.pathname)
    // useEffect(() => {
    //     if (location.pathname === "/") {
    //         setTitle('Trang chủ')
    //     } else if (location.pathname === "/bai-dang") {
    //         setTitle('Quản lý bài đăng')
    //     } else if (location.pathname === "/de-xuat") {
    //         setTitle('Quản lý đề xuất')
    //     } else if (location.pathname === "/su-kien") {
    //         setTitle('Quản lý sự kiện')
    //     } else if (location.pathname === "/cuoc-thi") {
    //         setTitle('Quản lý cuộc thi')
    //     } else if (location.pathname === "/phan-hoi") {
    //         setTitle('Quản lý phản hồi')
    //     } else if (location.pathname === "/thong-tin-ca-nhan") {
    //         setTitle('Thông tin cá nhân')
    //     } else if (location.pathname === "/tao-bai-dang") {
    //         setTitle('Tạo bài đăng')
    //     } 
    //     document.title = title;
    // }, [location.pathname, title])
    useEffect(() => {
        document.title = title;
        switch (location.pathname) {
            case '/':
                return (setTitle('Trang chủ'))
            case '/bai-dang':
                return (setTitle('Quản lý bài đăng'))
            case '/tao-bai-dang':
                return (setTitle('Tạo bài đăng'))
            case '/phan-hoi':
                return (setTitle('Quản lý phản hồi'))
            case '/su-kien':
                return (setTitle('Quản lý sự kiện'))
            case '/cuoc-thi':
                return (setTitle('Quản lý cuộc thi'))
            case '/de-xuat':
                return (setTitle('Quản lý đề xuất'))
            case '/thong-tin-ca-nhan':
                return (setTitle('Thông tin cá nhân'))
            case '/sua-bai-dang':
                return (setTitle('Sửa bài đăng'))
            case (location.pathname):
                return (setTitle(location.state != null && location.state.record.Title))
            default:
                return;
        }
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
                    <Menu.Item key="/de-xuat" onClick={manageProposal}><i className="far fa-lightbulb" style={{ fontSize: 18, color: '#FF7878', paddingTop: 4 }} />&nbsp;&nbsp;&nbsp;&nbsp;Quản lý đề xuất</Menu.Item>
                    <Menu.Item key="/bai-dang" onClick={managePosts}><i className="far fa-clone" style={{ fontSize: 18, color: '#DBAD68', paddingTop: 4 }} />&nbsp;&nbsp;<span style={{ paddingLeft: 2 }}>Quản lý bài đăng</span></Menu.Item>
                    <Menu.Item key="/su-kien" onClick={manageEvents}><i className="fas fa-calendar-alt" style={{ fontSize: 18, color: '#52BCC2' }} />&nbsp;&nbsp;&nbsp;Quản lý sự kiện</Menu.Item>
                    <Menu.Item key="/cuoc-thi" onClick={manageContests}><i className="fas fa-trophy" style={{ fontSize: 18, color: '#BFA2DB', paddingTop: 4 }} />&nbsp;&nbsp;Quản lý cuộc thi</Menu.Item>
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
                            case '/':
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
                            case '/sua-bai-dang':
                                return (
                                    <EditPostComponent record={location.state != null && location.state.record}/>
                                )
                            //để location ở cuối
                            case (location.pathname):
                                return (
                                    <ViewDetailPostComponent record={location.state != null && location.state.record} />
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
