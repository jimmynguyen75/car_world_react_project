import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message, Input, Modal, Popover, Row, Space, Spin, Table } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import AccessoryService from '../../services/AccessoryService';
import CreateAccessoryModalComponent from './CreateAccessoryModalComponent';
import EditAccessoryBodyComponent from './EditAccessoryBodyComponent';
import ViewDetailAccessoryComponent from './ViewDetailAccessoryBodyComponent';
function ManageAccessoryComponent() {
    const history = useHistory();
    const [accessories, setAccessories] = useState(null);
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [setSuccess] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [detail, setDetail] = React.useState(false);
    const [dataToChild, setDataToChild] = React.useState(null);
    const [dataToChildFixingImage, setDataToChildFixingImage] = React.useState([]);
    const success = () => {
        setSuccess(false);
        message.success("Create Acccessory Successfully", 2);
    };
    // useEffect(() => {
    //     setDataToChild(dataToChildFixingImage);
    // }, [dataToChildFixingImage])
    useEffect(() => {
        // let result = []
        AccessoryService
            .getAccessories()
            .then(response => {
                // response.data.forEach((req) => {
                //     if (req.IsDeleted === false) {
                //         result.push(req)
                //     }
                // })
                // console.log(result)
                setAccessories(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    const contentDelete = (
        <div>
            <p>B???n s??? x??a ph??? ki???n n??y khi b???n nh???n ?????ng ??!</p>
        </div>
    );
    const contentView = (
        <div>
            <p>B???n s??? xem chi ti???t ph??? ki???n khi nh???n v??o!</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>B???n s??? ch???nh s???a ph??? ki???n khi nh???n v??o!</p>
        </div>
    );
    const showModal = () => {
        setVisible(true);
    };
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
    const handleCancel = () => {
        console.log("cancel clicked")
        setDataToChildFixingImage(0)
        history.push(
            '/phu-kien'
        )
        setVisible(false);
    };
    const handleCancelDetail = () => {
        setDetail(false);
        setDataToChildFixingImage(0)
        console.log("click cancel")
        history.push('/phu-kien')
    }
    function confirmDelete(data) {
        Modal.confirm({
            title: "X??a ph??? ki???n",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    B???n c?? mu???n x??a ph??? ki???n n??y kh??ng?
                </div>
            ),
            okText: "C??",
            onOk() {
                console.log("id", data)
                AccessoryService.deleteAccessoryById(data)
                    .then(() => {
                        message.success("X??a ph??? ki???n th??nh c??ng");
                        setTimeout(() => {
                            window.location.href = '/phu-kien'
                        }, 500)
                    })
                    .catch((err) => {
                        message.success("X??a ph??? ki???n th??nh c??ng");
                        console.log(err)
                    })
            },
            cancelText: "Kh??ng"
        })
    }
    const showViewDetail = () => {
        setDetail(true)
    }
    class App extends React.Component {
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n ph??? ki???n',
                    key: 'name',
                    width: '40%',
                    ...this.getColumnSearchProps('Name'),
                    render: (record) => {
                        return (
                            <div>
                                <Row>
                                    <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={record.Image} /></Col>
                                    <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15, width: '100%' }} class="textOverflow">{record.Name}</div></Col>
                                </Row>
                            </div>
                        );
                    },
                },
                // , margin: 'auto', display: 'block'
                {
                    title: 'H??ng ph??? ki???n',
                    key: 'brand',
                    width: '14%',
                    render: (brand) => {
                        return (
                            <Row>
                                <Avatar size="small" src={brand.Brand.Image} />
                                <Space size="middle">
                                    <div style={{ paddingLeft: 5 }}>{brand.Brand.Name}</div>
                                </Space>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Gi??',
                    key: 'price',
                    width: '14%',
                    ...this.getColumnSearchProps('Price'),
                    render: (price) => {
                        return <NumberFormat
                            value={price.Price}
                            displayType="text"
                            suffix=" vn??"
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            style={{ fontWeight: '500' }}
                        />
                    }
                },
                {
                    title: 'Ng??y t???o',
                    key: 'createdDate',
                    width: '12%',
                    render: (date) => {
                        return <span style={{ color: '#868686', fontWeight: 450 }}>{moment(date.CreatedDate).format('ll')}</span>
                    }
                },
                {
                    title: 'C??c t??c v???',
                    key: 'action',
                    render: (record) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title="Chi ti???t ph??? ki???n">
                                    <Button
                                        onClick={() => {
                                            showViewDetail()
                                            setDataToChild(record)
                                            let ex = record.Image.split("|")
                                            if (ex.length > 1) {
                                                ex.pop();
                                            }
                                            setDataToChildFixingImage(ex)
                                        }}
                                        block className="viewButton" ><i className="fas fa-eye fa-xs"></i></Button>
                                </Popover>
                                <Popover content={contentEdit} title="Ch???nh s???a ph??? ki???n">
                                    <Button
                                        onClick={() => {
                                            showModal();
                                            setDataToChild(record);
                                            let ex = record.Image.split("|")
                                            if (ex.length > 1) {
                                                ex.pop();
                                            }
                                            setDataToChildFixingImage(ex)
                                        }}
                                        block className="editButton"><i className="fas fa-edit fa-xs"></i></Button>
                                </Popover>
                                <Popover content={contentDelete} title="X??a ph??? ki???n">
                                    <Button
                                        onClick={() => confirmDelete(record.Id)}
                                        block className="deleteButton"><i className="far fa-trash-alt fa-xs"></i></Button>
                                </Popover>
                            </Space >
                        )
                    },
                }
            ];
            return <Table
                columns={columns}
                dataSource={accessories}
                rowKey="Id"
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
                title={"C???p nh???t ph??? ki???n"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button form="myForm" type="primary" key="submit" htmlType="submit">
                            C???p nh???t
                        </Button>
                    </Row>
                ]}
            >
                <EditAccessoryBodyComponent setDataToChild={dataToChild} setDataToChildFixingImage={dataToChildFixingImage} />
            </Modal>
            <Modal
                destroyOnClose={true}
                title="Chi ti???t ph??? ki???n"
                visible={detail}
                onCancel={handleCancelDetail}
                width={1000}
                footer={
                    <Row style={{ float: 'right' }}>
                        <Button type="primary" key="submit" onClick={handleCancelDetail}>Xong</Button>
                    </Row>
                }
            >
                <ViewDetailAccessoryComponent setDataToChild={dataToChild} setDataToChildFixingImage={dataToChildFixingImage} />
            </Modal>
            <CreateAccessoryModalComponent />
            <Spin size="large" spinning={accessories === null ? true : false}>
                <App />
            </Spin>
        </div>
    )
}

export default ManageAccessoryComponent;