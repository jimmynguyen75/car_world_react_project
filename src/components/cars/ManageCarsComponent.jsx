import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, message, Modal, Popover, Row, Space, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import CarService from '../../services/CarService';
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import CreateCarModalComponent from './CreateCarModalComponent';
import ViewCarModalComponent from './ViewCarModalComponent';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import 'moment/locale/vi';
import EditCarBodyComponent from './EditCarBodyComponent';
function ManageCarsComponent() {
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [car, setCars] = useState(null);
    const [visible, setVisible] = React.useState(false);
    const [visibleDetail, setVisibleDetail] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [setSuccess] = React.useState(false);
    const [record, setRecord] = React.useState(null);
    const [recordImage, setRecordImage] = React.useState(null);
    const [pageSize, setPageSize] = React.useState(5)
    const [page, setPage] = React.useState(1)
    const contentDelete = (
        <div>
            <p>Bạn sẽ xóa chiếc xe này khi nhấn vào!</p>
        </div>
    );
    const contentView = (
        <div>
            <p>Bạn sẽ được xem chiếc xe này khi nhấn vào</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>Bạn sẽ chỉnh sửa chiếc xe này khi nhấn vào</p>
        </div>
    );
    useEffect(() => {
        let result = []
        CarService
            .getCars()
            .then(res => {
                res.data.forEach((data) => {
                    if (data.IsDeleted === false) {
                        result.push(data)
                    }
                })
                console.log(result)
                setCars(result)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);
    function confirmDelete(id) {
        Modal.confirm({
            title: 'Xóa xe',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có muốn xóa chiếc xe này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => { 
                CarService.deleteCar(id)
                    .then(() => {
                        setTimeout(() => {
                            message.success("Xóa xe thành công");
                        }, 500)
                        setTimeout(() => {
                            window.location.href = '/xe'
                        }, 1500)
                    })
                    .catch(err => {
                        message.error("Lỗi server, vui lòng thử lại sau")
                        console.log(err);
                    })
            }
        });
    }

    const success = () => {
        setSuccess(false);
        message.success('Tạo xe thành công');
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
                                <Col span={3} style={{height: 50, textAlign: 'center', display: 'flex', alignItems: 'center'}}><img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={record.Image === "string" ? imgPlacehoder : record.Image} /></Col>
                                <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15, width: '100%' }} class="textOverflow">{record.Name}</div></Col>
                            </Row>
                        );
                    },
                },
                {
                    title: "Hãng xe",
                    key: 'brand',
                    width: '16%',
                    ...this.getColumnSearchProps('Brand'),
                    render: (brand) => {
                        return (
                            <Row>
                                <Col span={6}>
                                    <Avatar style={{ display: true, height: 'auto', width: 'auto', margin: 'auto', maxHeight: '30px', maxWidth: '30px' }} size="small" src={brand.Brand.Image} />
                                </Col>
                                <Col span={18}>
                                    <div style={{ paddingLeft: 5 }}>{brand.Brand.Name}</div>
                                </Col>
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
                    render: (price) => {
                        return <NumberFormat
                            value={price}
                            displayType="text"
                            suffix=" vnđ"
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                        />
                    }
                },
                {
                    title: 'Ngày tạo',
                    key: 'date',
                    width: '12%',
                    ...this.getColumnSearchProps('CreatedDate'),
                    render: (date) => {
                        return <div style={{ color: '#868686', fontWeight: 450 }}>{moment(date.CreatedDate).format('ll')}</div>
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (record) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title='Xem chi tiết'>
                                    <Button onClick={() => {
                                        showViewDetail()
                                        setRecord(record)
                                        let ex = record.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImage(ex);
                                    }}
                                        block className="viewButton" ><i className="fas fa-eye"></i></Button>
                                </Popover>
                                <Popover content={contentEdit} title='Chỉnh sửa'>
                                    <Button onClick={() => {
                                        showModal()
                                        setRecord(record)
                                        let ex = record.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImage(ex)
                                    }}
                                        block className="editButton"><i className="fas fa-edit"></i></Button>
                                </Popover>
                                <Popover content={contentDelete} title='Xóa'>
                                    <Button onClick={() => confirmDelete(record.Id)}
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
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title='Tạo xe mới'
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >
                <CreateCarBodyModalComponent />
            </Modal>
            <Modal
                destroyOnClose={true}
                title="Chi tiết xe"
                visible={visibleDetail}
                onOk={handleOkDetail}
                confirmLoading={confirmLoading}
                onCancel={handleCancelDetail}
                width={1100}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button type="primary" onClick={handleCancelDetail}>
                            Xong
                        </Button>
                    </Row>
                ]}
            >
                <ViewCarModalComponent record={record} recordImage={recordImage} />
            </Modal>
            <Modal
                destroyOnClose={true}
                title={"Cập nhật xe"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button onClick={handleCancel}>
                            Hủy 
                        </Button>
                        <Button form="myFormEdit" type="primary" key="submit" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Row>
                ]}
            >
                <EditCarBodyComponent record={record} recordImage={recordImage} />
            </Modal>
            <CreateCarModalComponent />
            <Spin
                spinning={car === null ? true : false}
                // delay={100}
                size="large" >
                <Cars />
            </Spin>
        </div>
    )
}

export default ManageCarsComponent
