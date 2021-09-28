import { CarOutlined, ExclamationCircleOutlined, HomeOutlined, LogoutOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Modal, Typography } from 'antd';
import 'antd/dist/antd.less';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import logo2 from '../images/logo2.png';
import AccountService from '../services/AccountService';
import '../styles/admin-dashboard.less';
import ManageAccessoryComponent from './accessories/ManageAccessoryComponent';
import ManageAccountsComponent from './accounts/ManageAccountsComponent';
import ManageBrandsComponent from './brands/ManageBrandsComponent';
import ManageCarsComponent from './cars/ManageCarsComponent';
import DashboardComponent from './DashboardComponent';
import ProfileComponent from './profile/ProfileComponent';

function AdminDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content } = Layout;
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState("")
    const currentUser = AccountService.getCurrentUser();
    const [title, setTitle] = useState('');
    useEffect(() => {
        if (location.pathname === "/quan-tri") {
            console.log(location.pathname)
            setTitle('Trang chủ')
        }
        if (location.pathname === "/quan-ly/xe") {
            console.log(location.pathname)
            setTitle('Quản lý xe')
        }
        if (location.pathname === "/quan-ly/phu-kien") {
            console.log(location.pathname)
            setTitle('Quản lý phụ kiện')
        }
        if (location.pathname === "/quan-ly/tai-khoan") {
            console.log(location.pathname)
            setTitle('Quản lý tài khoản')
        }
        if (location.pathname === "/quan-ly/thuong-hieu") {
            console.log(location.pathname)
            setTitle('Quản lý thương hiệu')
        }
        if (location.pathname === "/thong-tin-ca-nhan") {
            console.log(location.pathname)
            setTitle('Thông tin cá nhân')
        }
        document.title = title;
    }, [location.pathname, title])
    useEffect(() => {
        AccountService.getUserById(currentUser.Id)
            .then((res) => {
                setUser(res.data)
            })
            .catch(err => { console.log(err) });
    }, [currentUser.Id]);
    function logoutButton() {
        AccountService.logOut();
        history.replace('/dang-nhap');
    }
    function manageCars() {
        history.push('/quan-ly/xe')
    }
    function dashboard() {
        history.push('/quan-tri')
    }
    function manageAccounts() {
        history.push('/quan-ly/tai-khoan')
    }
    function profile() {
        history.push('/thong-tin-ca-nhan')
    }
    function manageAccessories() {
        history.push('/quan-ly/phu-kien')
    }
    function manageBrands() {
        history.push('/quan-ly/thuong-hieu')
    }

    function confirmLogout() {
        Modal.confirm({
            title: 'Đăng xuất',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc bạn muốn đăng xuất không?',
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
                    <Menu.Item key="/quan-tri" icon={<HomeOutlined style={{ color: '#316B83' }} />} onClick={dashboard}>Trang chủ</Menu.Item>
                    <Menu.Item key="/quan-ly/xe" icon={<CarOutlined style={{ color: '#F4D19B' }} />} onClick={manageCars}>Quản lý xe</Menu.Item>
                    <Menu.Item key="/quan-ly/phu-kien" icon={<CarOutlined style={{ color: '#BFA2DB' }} />} onClick={manageAccessories}>Quản lý phụ kiện</Menu.Item>
                    <Menu.Item key="/quan-ly/thuong-hieu" icon={<CarOutlined style={{ color: '#BFA2DB' }} />} onClick={manageBrands}>Quản lý thương hiệu</Menu.Item>
                    <Menu.Item key="/quan-ly/tai-khoan" icon={<UserSwitchOutlined style={{ color: '#6B7AA1' }} />} onClick={manageAccounts}>Quản lý tài khoản</Menu.Item>
                    <Menu.Item key="/thong-tin-ca-nhan" icon={<UserOutlined style={{ color: '#9E7777' }} />} onClick={profile}>Thông tin cá nhân</Menu.Item>
                    <Menu.Item key="/log-out" onClick={confirmLogout} icon={<LogoutOutlined style={{ color: '#E2D5D5' }} />}>Đăng xuất</Menu.Item>
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
                                    <DashboardComponent />
                                )
                            case '/quan-tri':
                                return (
                                    <DashboardComponent />
                                )
                            case '/quan-ly/xe':
                                return (
                                    <ManageCarsComponent />
                                )
                            case '/quan-ly/tai-khoan':
                                return (
                                    <ManageAccountsComponent />
                                )
                            case '/quan-ly/phu-kien':
                                return (
                                    < ManageAccessoryComponent />
                                )
                            case '/quan-ly/thuong-hieu':
                                return (
                                    < ManageBrandsComponent />
                                )
                            case '/thong-tin-ca-nhan':
                                return (
                                    <ProfileComponent />
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

export default AdminDashboardComponent;
