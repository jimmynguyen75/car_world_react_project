import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, message, Modal, Popover, Row, Space, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import CarService from '../../services/CarService';
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import CreateCarModalComponent from './CreateCarModalComponent';
import ViewCarModalComponent from './ViewCarModalComponent';

function ManageCarsComponent() {
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [car, setCars] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [visibleDetail, setVisibleDetail] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [setSuccess] = React.useState(false);

    const contentDelete = (
        <div>
            <p>You will Delete this Car when you click!.1</p>
        </div>
    );
    const contentView = (
        <div>
            <p>You will View Detail this Car when you click!.1'</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>You will Edit this Car when you click!.1</p>
        </div>
    );
    useEffect(() => {
        CarService
            .getCars()
            .then(res => {
                console.log(res.data)
                setCars(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);
    function confirmDelete() {
        Modal.confirm({
            title: 'Delete Car!.1',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to Delete this Car?',
            okText: 'Ok.1',
            cancelText: 'Cancel.1',
        });
    }

    const success = () => {
        setSuccess(false);
        message.success('Created Car Successfully.1', 2);
    };
    const showModal = () => {
        setVisible(true);
    };

    const showViewDetail = () => {
        setVisibleDetail(true);
    }
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
        setTimeout(() => {
            success();
            setSuccess(true);
        }, 2000)
    };
    const handleOkDetail = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisibleDetail(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    const handleCancelDetail = () => {
        console.log('Clicked cancel button');
        setVisibleDetail(false);
    };

    class Cars extends React.Component {
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
                        placeholder={`Search ${dataIndex}`}
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
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
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
                    title: 'Tên xe',
                    key: 'name',
                    width: '40%',
                    ...this.getColumnSearchProps('Name'),
                    render: (record) => {
                        return (
                            <Row>
                                <Col span={8}><img alt="" src={record.Image === "string" ? imgPlacehoder : record.Image} /></Col>
                                <Col span={16}><Space size="middle"> <div style={{ marginLeft: 10, fontWeight: 550 }}>{record.Name}</div></Space></Col>
                            </Row>
                        );
                    },
                },
                {
                    title: "Hãng xe",
                    key: 'brand',
                    width: '14%',
                    ...this.getColumnSearchProps('Brand'),
                    render: (brand) => {
                        return (
                            <Row>
                                <Avatar src={brand.Brand.Image} />
                                <Space size="middle">
                                    <div style={{ paddingLeft: 5 }}>{brand.Brand.Name}</div>
                                </Space>
                            </Row>
                        );
                    }
                },
                {
                    title: 'Giá',
                    dataIndex: 'Price',
                    key: 'price',
                    width: '14%',
                    ...this.getColumnSearchProps('Price'),
                },
                {
                    title: 'Ngày tạo',
                    dataIndex: 'createdDate',
                    key: 'date',
                    width: '12%',
                    ...this.getColumnSearchProps('CreatedDate'),
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (text, record) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title='View Button!.1'>
                                    <Button onClick={showViewDetail}
                                        block className="viewButton" ><i className="fas fa-eye"></i></Button>
                                </Popover>
                                <Popover content={contentEdit} title='Edit Button!.1'>
                                    <Button onClick={showModal}
                                        block className="editButton"><i className="fas fa-edit"></i></Button>
                                </Popover>
                                <Popover content={contentDelete} title='Delete Button!.1'>
                                    <Button onClick={confirmDelete}
                                        block className="deleteButton"><i className="far fa-trash-alt"></i></Button>
                                </Popover>
                            </Space>
                        )
                    },
                }
            ];
            return <Table
                rowKey="Id"
                columns={columns}
                dataSource={car}
                onChange={() => {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0;
                }}
                pagination={{
                    defaultPageSize: 3,
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '10', '15', '20']
                }}
            />;
        }
    }

    return (
        <Spin
            spinning={car === null ? true : false}
            // delay={100}
            size="large" >
            <Modal
                title='Create a new Car.1'
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >
                <CreateCarBodyModalComponent />
            </Modal>
            <Modal
                title="View Car Detail"
                visible={visibleDetail}
                onOk={handleOkDetail}
                confirmLoading={confirmLoading}
                onCancel={handleCancelDetail}
                footer={[
                    <Button onClick={handleCancelDetail}>
                        Ok
                    </Button>
                ]}
            >
                <ViewCarModalComponent />
            </Modal>
            <CreateCarModalComponent />
            <Cars />
        </Spin>
    )
}

export default ManageCarsComponent
