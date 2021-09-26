import React, { useEffect, useState } from 'react'
import { DownOutlined, SearchOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Form, Input, Menu, Row, Space, Table, Tabs, Tooltip, Spin, Popconfirm, message, Modal, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import './style.less';
import BrandService from '../../services/BrandService';
import CreateBrandModalComponent from './CreateBrandModalComponent';
import { useStorage } from '../../hook/useBrand'
export default function ManageBrandComponent() {
    const { TabPane } = Tabs;
    const [brands, setBrands] = useState({ cars: [], accessories: [] });
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const { url } = useStorage(file)
    useEffect(() => {
        const fetchData = async () => {
            let carFilter = []
            let accessoryFilter = []
            const cars = await BrandService.getAllBrand();
            const accessories = await BrandService.getAllAccessoriesBrand();
            cars.data.forEach((filter) => {
                if (filter.IsDeleted === false) {
                    carFilter.push(filter)
                }
            })
            accessories.data.forEach((filter) => {
                if (filter.IsDeleted === false) {
                    accessoryFilter.push(filter)
                }
            })
            setBrands({ cars: carFilter, accessories: accessoryFilter });
        }
        fetchData();
    }, [])
    const changeImage = (e) => {
        setFile(e.target.files[0])
    }
    useEffect(() => {
        form.setFieldsValue({
            image: url
        })
    }, [url])
    const onFinish1 = (values) => {
        BrandService.updateBrand(values.id, values)
            .then((res) => {
                window.location.href = '/quan-ly/thuong-hieu'
                console.log("okkkk")
            })
            .catch((err) => {
                message.error("Chọn hiệu để cập nhật!")
                console.log(err)
            })
        console.log(values)
    }
    function confirm(id) {
        Modal.confirm({
            title: 'Bạn có muốn xóa hiệu này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                BrandService.deleteBrand(id)
                    .then(() => {
                        console.log('Deleted')
                        setTimeout(() => {
                            message.success("Xóa hiệu thành công");
                        }, 200)
                        setTimeout(() => {
                            window.location.href = '/quan-ly/thuong-hieu'
                        }, 500)
                    })
                    .catch(() => { message.error(id); })
            }
        });
    }
    class Cars extends React.PureComponent {
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
                    title: 'Tên thương hiệu',
                    key: 'name',
                    width: '30%',
                    ...this.getColumnSearchProps('Name'),
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar size="small" src={data.Image} icon={<UserOutlined />} />
                                <div><span style={{ paddingLeft: 7 }}>{data.Name}</span></div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Description',
                    key: 'description',
                    ...this.getColumnSearchProps('Description'),
                    render: (data) => {
                        return <p class="textOverflow">{data}</p>
                    }
                },
                {
                    title: <div style={{ textAlign: 'center' }}>Xóa</div>,
                    key: 'delete',
                    width: '10%',
                    render: (id) => {
                        return (
                            <Tooltip title="Xóa hiệu xe" onClick={() => confirm(id.Id)} color="#FF7878" placement="topLeft">
                                <div style={{ textAlign: 'center', color: '#FF7878' }}><i class="far fa-trash-alt fa-lg"></i></div>
                            </Tooltip>
                        )
                    }
                }
            ];
            return <Table
                onRow={(record) => {
                    return {
                        onClick: () => {
                            console.log(record)
                            form.setFieldsValue({
                                name: record.Name,
                                description: record.Description,
                                image: record.Image,
                                id: record.Id,
                                createdDate: record.CreatedDate,
                                type: record.Type,
                            })
                        }, // click row
                    };
                }}
                columns={columns}
                dataSource={brands.cars}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />;
        }
    }
    class Accessories extends React.PureComponent {
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
                    title: 'Tên thương hiệu',
                    key: 'name',
                    width: '30%',
                    ...this.getColumnSearchProps('Name'),
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar size="small" src={data.Image} icon={<UserOutlined />} />
                                <div><span style={{ paddingLeft: 7 }}>{data.Name}</span></div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Description',
                    key: 'description',
                    ...this.getColumnSearchProps('Description'),
                    render: (data) => {
                        return <p class="textOverflow">{data}</p>
                    }
                },
                {
                    title: <div style={{ textAlign: 'center' }}>Xóa</div>,
                    key: 'delete',
                    width: '10%',
                    render: (id) => {
                        return (
                            <Tooltip title="Xóa hiệu xe" onClick={() => confirm(id.Id)} color="#FF7878" placement="topLeft">
                                <div style={{ textAlign: 'center', color: '#FF7878' }}><i class="far fa-trash-alt fa-lg"></i></div>
                            </Tooltip>
                        )
                    }
                }
            ];
            return <Table
                onRow={(record) => {
                    return {
                        onClick: () => {
                            console.log(record)
                            form.setFieldsValue({
                                name: record.Name,
                                description: record.Description,
                                image: record.Image,
                                id: record.Id,
                                createdDate: record.CreatedDate,
                                type: record.Type,
                            })
                        }, // click row
                    };
                }}
                columns={columns}
                dataSource={brands.accessories}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />;
        }
    }
    return (
        <Spin size="large" spinning={brands.cars.length === 0 ? true : false}>
            <div>
                <CreateBrandModalComponent />
                <Tabs defaultActiveKey="tab1">
                    <TabPane
                        tab={
                            <span className="createButton">
                                <i className="fas fa-car" style={{ color: '#986D8E' }} />&nbsp;
                                Hiệu xe
                            </span>
                        }
                        key="tab1"
                    >
                        <Row gutter={25}>
                            <Col span={15}>
                                <Cars />
                            </Col>
                            <Col span={9}>
                                <Form
                                    form={form}
                                    colon={false}
                                    className="formDetail"
                                    onFinish={onFinish1}
                                >
                                    <Form.Item name="id" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="createdDate" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="type" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item style={{ textAlign: 'center' }}>
                                        <Form.Item name="image" valuePropName="src" noStyle>
                                            <Avatar size={120} icon={<UserOutlined />} />
                                        </Form.Item>
                                        <br />
                                        <label style={{ marginTop: 5 }} className="upload" htmlFor="upload-photo" ><i className="fas fa-plus-circle fa-1x"><span style={{ marginLeft: 3 }}>Chọn ảnh</span></i></label>
                                        <input type="file" onChange={changeImage} name="photo" id="upload-photo" />
                                    </Form.Item>
                                    <Tooltip title="Tên thương hiệu" color="#6B7AA1" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-car fa-lg" style={{ color: '#6B7AA1' }} />} name="name">
                                            <Input id="brandCarName" style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#050505' }} placeholder="Tên thương hiệu" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Mô tả" color="#B97A95" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-sticky-note fa-lg" style={{ color: '#B97A95' }}></i>} name="description">
                                            <Input.TextArea
                                                style={{ marginLeft: 9, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }}
                                                placeholder="Mô tả"
                                                showCount maxLength={200}
                                                autoSize={{ minRows: 3, maxRows: 10 }}
                                            />
                                        </Form.Item>
                                    </Tooltip>
                                    <Form.Item style={{ textAlign: 'center' }}>
                                        <Button type="primary" htmlType="submit">Hoàn tất</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span className="createButton">
                                <i className="fas fa-peace" style={{ color: '#3EA0A5' }} />&nbsp;
                                Hiệu phụ kiện
                            </span>
                        }
                        key="tab2"
                    >
                        <Row gutter={25}>
                            <Col span={15}>
                                <Accessories />
                            </Col>
                            <Col span={9}>
                                <Form
                                    form={form}
                                    colon={false}
                                    className="formDetail"
                                    onFinish={onFinish1}
                                >
                                    <Form.Item name="id" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item style={{ textAlign: 'center' }}>
                                        <Form.Item name="image" valuePropName="src" noStyle>
                                            <Avatar size={120} icon={<UserOutlined />} />
                                        </Form.Item>
                                        <br />
                                        <label style={{ marginTop: 5 }} className="upload" htmlFor="upload-photo" ><i className="fas fa-plus-circle fa-1x"><span style={{ marginLeft: 3 }}>Chọn ảnh</span></i></label>
                                        <input type="file" onChange={changeImage} name="photo" id="upload-photo" />
                                    </Form.Item>
                                    <Tooltip title="Tên thương hiệu" color="#6B7AA1" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-car fa-lg" style={{ color: '#6B7AA1' }} />} name="name">
                                            <Input style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#050505' }} placeholder="Tên thương hiệu" />
                                        </Form.Item>
                                    </Tooltip>
                                    <Tooltip title="Mô tả" color="#B97A95" placement="topLeft">
                                        <Form.Item label={<i className="fas fa-sticky-note fa-lg" style={{ color: '#B97A95' }}></i>} name="description">
                                            <Input.TextArea
                                                style={{ marginLeft: 9, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }}
                                                placeholder="Mô tả"
                                                showCount maxLength={200}
                                                autoSize={{ minRows: 3, maxRows: 10 }}
                                            />
                                        </Form.Item>
                                    </Tooltip>
                                    <Form.Item style={{ textAlign: 'center' }}>
                                        <Button type="primary" htmlType="submit">Hoàn tất</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
    )
}
