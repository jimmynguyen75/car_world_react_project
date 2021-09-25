import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message, Modal, Popover, Row, Space, Spin, Table } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
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
        let result = []
        AccessoryService
            .getAccessories()
            .then(response => {
                response.data.forEach((req) => {
                    if (req.IsDeleted === false) {
                        result.push(req)
                    }
                })
                console.log(result)
                setAccessories(result);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    const contentDelete = (
        <div>
            <p>Bạn sẽ xóa phụ kiện này khi bạn nhấn đồng ý!</p>
        </div>
    );
    const contentView = (
        <div>
            <p>Bạn sẽ xem chi tiết phụ kiện khi nhấn vào!</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>Bạn sẽ chỉnh sửa phụ kiện khi nhấn vào!</p>
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
        setVisible(false);
    };
    const handleCancelDetail = () => {
        setDetail(false);
        setDataToChildFixingImage({})
        console.log("click cancel")
        history.push('/quan-ly/phu-kien')
    }
    function confirmDelete(data) {
        Modal.confirm({
            title: "Xóa phụ kiện",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    Bạn có muốn xóa {data.Name} không?
                </div>
            ),
            okText: "Đồng ý",
            onOk() {
                console.log(data.Id)
                AccessoryService.deleteAccessoryById(data.Id)
                    .then(() => window.location.reload(), console.log("Delete successfuly!"))
                    .catch((err) => console.log(err))
            },
            cancelText: "Không"
        })
    }
    const showViewDetail = () => {
        setDetail(true)
    }
    class App extends React.Component {
        render() {
            const columns = [
                {
                    title: 'Tên phụ kiện',
                    key: 'name',
                    width: '40%',
                    render: (record) => {
                        return (
                            <div>
                                <Row>
                                    <Col span={3}> <div> <img alt="" style={{ height: 50, maxWidth: '100%' }} src={record.Image} /></div></Col>
                                    <Col span={21}><Space size="middle"><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15 }}>{record.Name}</div></Space></Col>
                                </Row>
                            </div>
                        );
                    },
                },
                // , margin: 'auto', display: 'block'
                {
                    title: 'Hãng phụ kiện',
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
                    title: 'Giá',
                    key: 'price',
                    width: '14%',
                    render: (price) => {
                        return <NumberFormat
                            value={price.Price}
                            displayType="text"
                            suffix=" vnđ"
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                        />
                    }
                },
                {
                    title: 'Ngày tạo',
                    key: 'createdDate',
                    width: '12%',
                    render: (date) => {
                        return <span style={{ color: '#868686', fontWeight: 450 }}>{moment(date.CreatedDate).format('ll')}</span>
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title="Chi tiết phụ kiện">
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
                                <Popover content={contentEdit} title="Chỉnh sửa phụ kiện">
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
                                <Popover content={contentDelete} title="Xóa phụ kiện">
                                    <Button
                                        onClick={() => confirmDelete({ record })}
                                        block className="deleteButton"><i className="far fa-trash-alt fa-xs"></i></Button>
                                </Popover>
                            </Space>
                        )
                    },
                }
            ];
            return <Table columns={columns} dataSource={accessories} rowKey="Id"/>;
        }
    }
    return (
        <div>
            <Modal
                title={"Chỉnh sửa phụ kiện"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button form="myForm" type="primary" key="submit" htmlType="submit">
                            Submit
                        </Button>
                    </Row>
                ]}
            >
                <EditAccessoryBodyComponent setDataToChild={dataToChild} setDataToChildFixingImage={dataToChildFixingImage} />
            </Modal>
            <Modal
                title="Chi tiết phụ kiện"
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