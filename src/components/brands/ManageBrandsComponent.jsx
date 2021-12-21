import { ExclamationCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Space, Spin, Table, Tabs, Tooltip, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useStorage } from '../../hook/useBrand';
import BrandService from '../../services/BrandService';
import CreateBrandModalComponent from './CreateBrandModalComponent';
import carImage from '../../images/thinking.gif'
import accessoryImage from '../../images/write.gif'
import './style.less';
export default function ManageBrandComponent() {
    const { TabPane } = Tabs;
    const [brands, setBrands] = useState({ cars: [], accessories: [] });
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const { url } = useStorage(file)
    const [displayImageCar, setDisplayImageCar] = useState("true")
    const [editCar, setEditCar] = useState("none")
    const [displayImageAccessory, setDisplayImageAccessory] = useState("true")
    const [editAccessory, setEditAccessory] = useState("none")
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5)
    function hideImageCar() {
        setDisplayImageCar("none")
        setEditCar(true)
    }
    function hideImageAccessory() {
        setDisplayImageAccessory("none")
        setEditAccessory(true)
    }
    useEffect(() => {
        const fetchData = async () => {
            // let carFilter = []
            // let accessoryFilter = []
            const cars = await BrandService.getAllBrand();
            const accessories = await BrandService.getAllAccessoriesBrand();
            // cars.data.forEach((filter) => {
            //     if (filter.IsDeleted === false) {
            //         carFilter.push(filter)
            //     }
            // })
            // accessories.data.forEach((filter) => {
            //     if (filter.IsDeleted === false) {
            //         accessoryFilter.push(filter)
            //     }
            // })
            setBrands({ cars: cars.data, accessories: accessories.data });
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
    }, [url, form])
    const onFinish1 = (values) => {
        BrandService.updateBrand(values.id, values)
            .then((res) => {
                setTimeout(() => {
                    message.success("Cập nhật thương hiệu thành công")
                }, 200)
                setTimeout(() => {
                    window.location.href = '/thuong-hieu'
                }, 500)
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
                            message.success("Xóa thương hiệu thành công");
                        }, 200)
                        setTimeout(() => {
                            window.location.href = '/thuong-hieu'
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
                            Tìm
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Đặt lại
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
                    width: '26%',
                    ...this.getColumnSearchProps('Name'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={6}>
                                    <Avatar style={{ height: 'auto', width: 'auto', margin: 'auto', maxHeight: '50px', maxWidth: '50px' }} size="large" src={data.Image} icon={<UserOutlined />} />
                                </Col>
                                <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ paddingLeft: 10 }}><span style={{ color: '#035B81', fontWeight: '600', fontSize: 15 }}>{data.Name}</span></div>
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Description',
                    key: 'description',
                    render: (data) => {
                        return <p className="textOverflow" >{data}</p>
                    }
                },
                {
                    title: <div style={{ textAlign: 'center' }}>Xóa</div>,
                    key: 'delete',
                    width: '10%',
                    render: (id) => {
                        return (
                            <Tooltip title="Xóa hiệu xe" onClick={() => confirm(id.Id)} color="#FF7878" placement="topLeft">
                                <div style={{ textAlign: 'center', color: '#FF7878' }}><i className="far fa-trash-alt fa-lg"></i></div>
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
                            hideImageCar()
                        }, // click row
                    };
                }}
                columns={columns}
                dataSource={brands.cars}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    },
                    pageSizeOptions: ['5', '10', '15', '20'],
                    showSizeChanger: true,
                    locale: { items_per_page: "/ trang" },
                }}
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
                    width: '26%',
                    ...this.getColumnSearchProps('Name'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={6}>
                                    <Avatar style={{ height: 'auto', width: 'auto', margin: 'auto', maxHeight: '50px', maxWidth: '50px' }} size="large" src={data.Image} icon={<UserOutlined />} />
                                </Col>
                                <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ paddingLeft: 10, paddingTop: 7 }}><span style={{ color: '#035B81', fontWeight: '600', fontSize: 15 }}>{data.Name}</span></div>
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Description',
                    key: 'description',
                    render: (data) => {
                        return <p className="textOverflow">{data}</p>
                    }
                },
                {
                    title: <div style={{ textAlign: 'center' }}>Xóa</div>,
                    key: 'delete',
                    width: '10%',
                    render: (id) => {
                        return (
                            <Tooltip title="Xóa hiệu xe" onClick={() => confirm(id.Id)} color="#FF7878" placement="topLeft">
                                <div style={{ textAlign: 'center', color: '#FF7878' }}><i className="far fa-trash-alt fa-lg"></i></div>
                            </Tooltip>
                        )
                    }
                }
            ];
            return <Table
                rowKey="Id"
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
                            hideImageAccessory()
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
                        <Row gutter={20}>
                            <Col span={15}>
                                <Cars />
                            </Col>
                            <Col span={9} style={{ display: editCar }}>
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
                                            <Input.TextArea
                                                id="brandCarName" style={{ marginLeft: 7, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#050505' }}
                                                placeholder="Tên thương hiệu"
                                                showCount maxLength={50}
                                                autoSize={{ minRows: 1, maxRows: 10 }}
                                            />
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
                                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={9} style={{ display: displayImageCar }}>
                                <div>
                                    <Image style={{ height: '520px', margin: 'auto', textAlign: 'center' }} src={carImage} preview={false}></Image>
                                </div>
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
                        <Row gutter={20}>
                            <Col span={15}>
                                <Accessories />
                            </Col>
                            <Col span={9} style={{ display: editAccessory }}>
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
                                            <Input.TextArea
                                                style={{ marginLeft: 9, width: '-webkit-fill-available', backgroundColor: '#FFFFFF', color: '#316B83' }}
                                                placeholder="Mô tả"
                                                showCount maxLength={50}
                                                autoSize={{ minRows: 3, maxRows: 10 }}
                                            />                                        </Form.Item>
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
                                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={9} style={{ display: displayImageAccessory }}>
                                <div>
                                    <Image style={{ height: '520px', margin: 'auto', textAlign: 'center' }} src={accessoryImage} preview={false}></Image>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
    )
}
