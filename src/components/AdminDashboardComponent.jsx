import React, { Suspense, useEffect } from 'react';
import 'antd/dist/antd.less';
import logo2 from '../images/logo2.png';
import { useHistory, useLocation } from "react-router-dom";
import { Menu, Avatar, Typography, Modal, Layout, Button, Radio } from 'antd';
import {
    HomeOutlined, MessageOutlined, UserOutlined, LogoutOutlined,
    ExclamationCircleOutlined, CarOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import '../styles/admin-dashboard.less';
import ManageCarsComponent from './cars/ManageCarsComponent';
import ManageFeedbackComponent from './feedback/ManageFeedbackComponent';
import ManageAccountsComponent from './ManageAccountsComponent';
import ProfileComponent from './profile/ProfileComponent';
import AccountService from '../services/AccountService';
import DashboardComponent from './DashboardComponent';
import ManagePostsComponent from './posts/ManagePostsComponent'
import { useTranslation } from 'react-i18next';
import CreatePostModalComponent from './posts/CreatePostModalComponent';
import ManageAccessoryComponent from './accessories/ManageAccessoryComponent';

function AdminDashboardComponent() {
    const { Title } = Typography;
    const { Header, Sider, Content, Footer } = Layout;
    const history = useHistory();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        let title = "Car World"
        document.title = title;
    }, []);

    const currentUser = AccountService.getCurrentUser();

    function logoutButton() {
        AccountService.logOut();
        history.replace('/login');
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
    function manageAccessories() {
        history.push('/manage/accessories')
    }
    function managePosts() {
        history.push('/manage/posts')
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

    function handleLang(lang) {
        i18n.changeLanguage(lang);
        console.log(lang);
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
                    <Menu.Item key="/admin" icon={<HomeOutlined />} onClick={dashboard}>{t('Dashboard.1')}</Menu.Item>
                    <Menu.Item key="/manage/cars" icon={<CarOutlined />} onClick={manageCars}>{t('Manage Cars.1')}</Menu.Item>
                    <Menu.Item key="/manage/accessories" icon={<CarOutlined />} onClick={manageAccessories}>{t('Manage Accessories.1')}</Menu.Item>
                    <Menu.Item key="/manage/posts" icon={<CarOutlined />} onClick={managePosts}>{t('Manage Posts.1')}</Menu.Item>
                    {/* <Menu.Item key="/manage/feedback" icon={<MessageOutlined />} onClick={manageFeedback}>{t('Manage Feedback.1')}</Menu.Item> */}
                    <Menu.Item key="/manage/accounts" icon={<UserSwitchOutlined />} onClick={manageAccounts}>{t('Manage Accounts.1')}</Menu.Item>
                    <Menu.Item key="/profile" icon={<UserOutlined />} onClick={profile}>{t('Profile.1')}</Menu.Item>
                    <Menu.Item key="" onClick={confirmLogout} icon={<LogoutOutlined />}>{t('Log out.1')}</Menu.Item>
                </Menu>

            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                    <Radio.Group defaultValue="a" size="small" style={{ marginTop: 16, marginLeft: 18 }}>
                        <Radio.Button onClick={() => handleLang('en')} value="a" style={{ fontSize: 12, color: '#646464', borderRadius: 15, marginRight: 5 }}><Avatar size={20} className="country" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/300px-Flag_of_the_United_Kingdom.svg.png"} /> EN</Radio.Button>
                        <Radio.Button onClick={() => handleLang('vi')} value="b" style={{ fontSize: 12, color: '#646464', borderRadius: 15 }}><Avatar size={20} className="country" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/330px-Flag_of_Vietnam.svg.png"} /> VI</Radio.Button>
                        <Radio.Button onClick={() => handleLang('ja')} value="c" style={{ fontSize: 12, color: '#646464', borderRadius: 15, marginLeft: 5 }}><Avatar size={20} className="country" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/225px-Flag_of_Japan.svg.png"} /> JA</Radio.Button>
                    </Radio.Group>
                    <Avatar size={45} className="avatar" src={"https://reqres.in/img/faces/8-image.jpg"}> </Avatar>
                    <Title level={5} className="userName">{t('Welcome.1')},</Title>

                </Header>

                <Content style={{ margin: '24px 16px 0' }} >
                    {(() => {
                        switch (location.pathname) {
                            case '/':
                                return (
                                    <DashboardComponent />
                                )
                            case '/admin':
                                return (
                                    <DashboardComponent />
                                )
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
                            case '/manage/accessories':
                                return (
                                    < ManageAccessoryComponent />
                                )
                            case '/manage/posts':
                                return (
                                    <ManagePostsComponent />
                                )
                            case '/create/post':
                                return (
                                    <CreatePostModalComponent />
                                )
                            case '/profile':
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
