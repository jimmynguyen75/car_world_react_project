import { DownOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Form, Input, Menu, Row, Space, Table, Tabs, Tooltip, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import AccountService from '../../services/AccountService';
import CreateAccountModalComponent from './CreateAccountModalComponent';
import './style.less';
function ManageAccountsComponent() {
    const [user, setUser] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [form] = Form.useForm();
    const currentUser = AccountService.getCurrentUser();
    useEffect(() => {
        let result = []
        AccountService.getAdminAndManger()
            .then((res) => {
                res.data.forEach((filter) => {
                    if (filter.Status !== 0) {
                        result.push(filter)
                    }
                })
                setUser(result);
            })
            .catch((err) => console.log(err))
    }, [])
    useEffect(() => {
        let result = [];
        AccountService.getAllUser()
            .then((res) => {
                res.data.forEach((filter) => {
                    if (filter.Status !== 0) {
                        result.push(filter)
                    }
                })
                setAllUser(result)
            })
            .catch((err) => { console.error(err) })
    }, [])
    function handleUnLock(id) {
        AccountService.changeAccountStatus(id, '1')
            .then((response) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function handleLock(id) {
        AccountService.changeAccountStatus(id, '2')
            .then((response) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function handleManager(id) {
        AccountService.updateRole(id, '2')
            .then((response) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function handleAdmin(id) {
        AccountService.updateRole(id, '1')
            .then((response) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    class AdminAndManager extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder='Tìm kiếm'
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });

        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        render() {
            const columns = [
                {
                    title: 'Họ và tên',
                    key: 'fullname1',
                    ...this.getColumnSearchProps('FullName'),
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar size="small" src={data.Image} icon={<UserOutlined />} />
                                <div><span style={{ paddingLeft: 7 }}>{data.FullName}</span></div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Email',
                    dataIndex: 'Email',
                    key: 'email1',
                    ...this.getColumnSearchProps('Email'),
                },
                {
                    title: 'Vai trò',
                    key: 'role1',
                    sorter: (a, b) => a.RoleId - b.RoleId,
                    sortDirections: ['descend', 'ascend'],
                    render: (role) => {
                        return <div style={{ cursor: 'pointer' }}>

                            {role.RoleId === 1 ?
                                <div><span>
                                    <Dropdown overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => handleManager(role.Id)}>
                                                <span style={{ fontWeight: 500, color: '#F5CA81' }}>Quản lý</span>
                                            </Menu.Item>
                                        </Menu>
                                    } trigger={['click']} disabled={currentUser.Id === role.Id ? true : false}>
                                        <Button style={{ background: '#6B7AA1', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                            Quản trị<DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </span></div>
                                : null || role.RoleId === 2 ? <div><span>
                                    <Dropdown overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => handleAdmin(role.Id)}>
                                                <span style={{ fontWeight: 500, color: '#6B7AA1' }}>Quản trị</span>
                                            </Menu.Item>
                                        </Menu>
                                    } trigger={['click']} disabled={currentUser.Id === role.Id ? true : false}>
                                        <Button style={{ background: '#F5CA81', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                            Quản lý<DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </span></div> : null
                            }
                        </div>
                    }
                },
                {
                    title: 'Trạng thái',
                    key: 'status1',
                    sorter: (a, b) => a.Status - b.Status,
                    sortDirections: ['descend', 'ascend'],
                    render: (status) => {
                        return (
                            <div style={{ cursor: 'pointer' }}>
                                <span >
                                    {
                                        status.Status === 1 ? <span type="submit" >
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#FF7878' }}>Khóa Tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                                trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#70AF85', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang hoạt động<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                            || status.Status === 2 ? <span type="submit" >
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleUnLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#70AF85' }}>Mở khóa tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            } trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#FF7878', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang tạm khóa<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                            || status.Status === null ? <span type="submit">
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#FF7878' }}>Khóa Tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            } trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#70AF85', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang hoạt động<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                    }
                                </span>
                            </div>
                        )
                    }
                }
            ];
            return <Table
                onRow={(record) => {
                    return {
                        onMouseEnter: () => {
                            //setRecord(record)
                            form.setFieldsValue({
                                fullName: record.FullName,
                                roleId: record.RoleId,
                                email: record.Email,
                                phone: record.Phone,
                                address: record.Address,
                                status: record.Status,
                                image: record.Image,
                                username1: record.Username,
                            })
                            console.log(record)
                        }, // click row
                    };
                }}
                rowKey="Id"
                columns={columns}
                dataSource={user}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />;
        }
    }
    class User extends React.PureComponent {
        state = {
            searchText: '',
            searchedColumn: '',
        };

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder='Tìm kiếm'
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });

        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        render() {
            const columns = [
                {
                    title: 'Họ và tên',
                    key: 'fullName2',
                    ...this.getColumnSearchProps('FullName'),
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar size="small" src={data.Image} icon={<UserOutlined />} />
                                <div><span style={{ paddingLeft: 7 }}>{data.FullName}</span></div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Email',
                    dataIndex: 'Email',
                    key: 'email2',
                    ...this.getColumnSearchProps('Email'),
                },
                {
                    title: 'Trạng thái',
                    key: 'status2',
                    sorter: (a, b) => a.Status - b.Status,
                    sortDirections: ['descend', 'ascend'],
                    render: (status) => {
                        return (
                            <div style={{ cursor: 'pointer' }}>
                                <span>
                                    {
                                        status.Status === 1 ? <span type="submit">
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#FF7878' }}>Khóa Tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            } trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#70AF85', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang hoạt động<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                            || status.Status === 2 ? <span type="submit">
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleUnLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#70AF85' }}>Mở khóa tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            } trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#FF7878', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang tạm khóa<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                            || status.Status === null ? <span type="submit">
                                            <Dropdown overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleLock(status.Id)}>
                                                        <span style={{ fontWeight: 500, color: '#FF7878' }}>Khóa Tài khoản</span>
                                                    </Menu.Item>
                                                </Menu>
                                            } trigger={['click']} disabled={currentUser.Id === status.Id ? true : false}>
                                                <Button style={{ background: '#70AF85', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                                    Đang hoạt động<DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </span> : null
                                    }
                                </span>
                            </div>
                        )
                    }
                }
            ];
            return <Table
                onRow={(record) => {
                    return {
                        onMouseEnter: () => {
                            //setRecord(record)
                            console.log(record)
                            form.setFieldsValue({
                                fullName: record.FullName,
                                roleId: record.RoleId,
                                email: record.Email,
                                phone: record.Phone,
                                address: record.Address,
                                status: record.Status,
                                image: record.Image
                            })
                        }, // click row
                    };
                }}
                columns={columns}
                dataSource={allUser}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />;
        }
    }
    const { TabPane } = Tabs;
    return (
        <Spin size="large" spinning={user.length === 0 ? true : false}>
            <div>
                <CreateAccountModalComponent />
                <Tabs defaultActiveKey="tab1">
                    <TabPane
                        tab={
                            <span className="createButton">
                                <i className="fas fa-users-cog" style={{ color: '#986D8E' }} />&nbsp;
                                Quản trị và quản lý
                            </span>
                        }
                        key="tab1"
                    >
                        <Row gutter={25}>
                            <Col span="15">
                                <AdminAndManager />
                            </Col>
                            <Col span="9">
                                <Form
                                    form={form}
                                    colon={false}
                                    className="formDetail"
                                >
                                    <Form.Item style={{ textAlign: 'center' }} name="image" valuePropName="src">
                                        <Avatar shape="square" size={120} icon={<UserOutlined />} />
                                    </Form.Item>
                                    <Tooltip title="Tên đăng nhập" color="#6B7AA1" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-user-tie fa-lg" style={{ color: '#6B7AA1' }} />} name="username1">
                                            <Input disabled style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Tên đăng nhập" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Họ và tên" color="#B97A95" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-user fa-lg" style={{ color: '#B97A95' }}></i>} name="fullName">
                                            <Input disabled style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Họ và tên" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Email" color="#9D9D9D" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-envelope fa-lg" style={{ color: '#9D9D9D' }}></i>} name="email">
                                            <Input disabled style={{ marginLeft: 5, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Email" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Số điện thoại" color="#FABDAD" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-phone fa-lg" style={{ color: '#FABDAD' }}></i>} name="phone">
                                            <Input disabled style={{ marginLeft: 5, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Số điện thoại" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Địa chỉ" color="#BFA2DB" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-address-card fa-lg" style={{ color: '#BFA2DB' }}></i>} name="address">
                                            <Input disabled style={{ marginLeft: 3, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Địa chỉ" />
                                        </Form.Item>
                                    </Tooltip>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span className="createButton">
                                <i className="fas fa-users" style={{ color: '#3EA0A5' }} />&nbsp;
                                Người dùng
                            </span>
                        }
                        key="tab2"
                    >
                        <Row gutter={25}>
                            <Col span="15">
                                <User />
                            </Col>
                            <Col span="9">
                                <Form
                                    form={form}
                                    colon={false}
                                    className="formDetail"
                                >
                                    <Form.Item style={{ textAlign: 'center' }} name="image" valuePropName="src">
                                        <Avatar shape="square" size={120} icon={<UserOutlined />} />
                                    </Form.Item>
                                    <Tooltip title="Họ và tên" color="#B97A95" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-user fa-lg" style={{ color: '#B97A95' }}></i>} name="fullName">
                                            <Input disabled style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Họ và tên" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Email" color="#9D9D9D" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-envelope fa-lg" style={{ color: '#9D9D9D' }}></i>} name="email">
                                            <Input disabled style={{ marginLeft: 5, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Email" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Số điện thoại" color="#FABDAD" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-phone fa-lg" style={{ color: '#FABDAD' }}></i>} name="phone">
                                            <Input disabled style={{ marginLeft: 5, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Số điện thoại" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Địa chỉ" color="#BFA2DB" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-address-card fa-lg" style={{ color: '#BFA2DB' }}></i>} name="address">
                                            <Input disabled style={{ marginLeft: 3, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }} placeholder="Địa chỉ" />
                                        </Form.Item>
                                    </Tooltip>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
    )
}

export default ManageAccountsComponent;


