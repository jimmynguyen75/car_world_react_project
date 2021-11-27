import { MinusOutlined } from '@ant-design/icons';
import { Carousel, Col, Descriptions, Image, Row, Spin, Input, Table, Modal, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import NumberFormat from 'react-number-format';
import React, { useState, useEffect} from 'react';
import ContestService from '../../services/ContestService';
export default function ViewEventComponent({ record, recordImage }) {
    const [visibleCheck, setVisibleCheck] = useState(false);
    const [userList, setUserList] = useState([])
    const handleCancel = () => {
        setVisibleCheck(false);
    }
    useEffect(() => {
        ContestService.getUserJoined(record.Id)
            .then((user) => {
                setUserList(user.data)
            })
            .catch((error) => { console.log(error) })
    }, [record.Id])
    const baseColumns = [
        {
            title: 'Họ và tên',
            key: 'name',
            render: (data) => {
                return (
                    <Row gutter={15}>
                        <Col span={4} style={{ textAlign: 'center' }}><img alt="" style={{ height: 'auto', maxHeight: '50px', width: 'auto' }} src={data.User.Image} /></Col>
                        <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.User.FullName}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            width: '20%',
            render: (data) => {
                return (
                    <div>{data.User.Phone}</div>
                )
            }
        },
        {
            title: 'Địa chỉ',
            key: 'phone',
            width: '30%',
            render: (data) => {
                return (
                    <div>{data.User.Address}</div>
                )
            }
        }
    ];
    class Check extends React.Component {
        constructor(props) {
            super(props);
            this.state = { filterTable: null, columns: baseColumns, baseData: userList };
        }
        search = value => {
            const { baseData } = this.state;
            console.log("PASS", { value });
            const filterTable = baseData.filter(o =>
                Object.keys(o.User).some(k =>
                    String(o.User[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            this.setState({ filterTable });
        }
        render() {
            const { filterTable, columns, baseData } = this.state;
            return (
                <div>
                    <Input.Search
                        className="inputSearchCheck"
                        style={{ marginBottom: 15 }}
                        placeholder="Tìm kiếm..."
                        enterButton
                        onSearch={this.search}
                    />
                    <Table columns={columns} dataSource={filterTable === null ? baseData : filterTable} pagination={false} />
                </div>
            )
        }
    }
    const ModalBodyView = () => {
        const [visible, setVisible] = useState("none")
        const [loading, setLoading] = useState("0")
        setTimeout(() => {
            setLoading("none")
            setVisible(true)
        }, 800)
        return (
            <>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    title="Danh sách tham gia"
                    visible={visibleCheck}
                    onCancel={() => { setVisibleCheck(false) }}
                    width={800}
                    footer={
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button type="primary" onClick={handleCancel}>
                                Xong
                            </Button>
                        </Row>
                    }
                >
                    <Spin spinning={userList === null ? true : false}>
                        <Check />
                    </Spin>
                </Modal>
                <Row gutter={15}>
                    <Col span={12}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Tên cuộc thi">
                                <div style={{ fontWeight: '500', fontSize: 16, color: '#2A528A' }}>{record.Title}</div>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Thời hạn <span style={{ color: '#BB5A5A', fontWeight: 500 }}>ĐĂNG KÝ</span></div>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Bắt đầu">
                                <i class="fas fa-clock" style={{ color: '#BB5A5A' }}></i>&nbsp;{moment(record.StartRegister).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#BB5A5A' }}></i>&nbsp;{moment(record.StartRegister).format('L')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kết thúc">
                                <i class="fas fa-clock" style={{ color: '#BB5A5A' }}></i>&nbsp;{moment(record.EndRegister).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#BB5A5A' }}></i>&nbsp;{moment(record.EndRegister).format('L')}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Thời gian diễn ra <span style={{ color: '#7BC0A3', fontWeight: 500 }}>CUỘC THI</span></div>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Bắt đầu">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('L')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kết thúc">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('L')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={12}>
                        <Spin size="middle" spinning={recordImage[0] === 'string' ? true : false}>
                            <div style={{ display: loading, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 'bold' }}>Đang tải</span></div>
                            <div style={{ display: visible }}>
                                <Carousel>
                                    {recordImage.map((object, i) => {
                                        return (
                                            <div>
                                                <Image preview={false} style={{ display: 'true', margin: 'auto', height: 'auto', width: 'auto', maxHeight: '289.25px', maxWidth: '467.99px' }} key={i} src={object} />
                                            </div>)
                                    })}
                                </Carousel>
                            </div>
                        </Spin>
                    </Col>
                </Row>
                <br />
                <Row gutter={15}>
                    <Col span={4}>
                        <div className='viewEventText'>Đã tham gia</div>
                        <i style={{ color: '#50C9BA' }} class="fas fa-user-check"></i>&nbsp;&nbsp;{record.CurrentParticipants} - <span style={{ cursor: 'pointer' }} onClick={() => setVisibleCheck(true)}><i class="fas fa-list-ol"></i> <span style={{ color: '#562349', fontWeight: '500' }}>Xem</span></span>
                    </Col>
                    <Col span={4}>
                        <div className='viewEventText'>Số lượng giới hạn</div>
                        <i style={{ color: '#E36387' }} class="fas fa-users"></i>&nbsp;&nbsp;{record.MinParticipants} - {record.MaxParticipants}
                    </Col>
                    <Col span={4}>
                        <div className='viewEventText'>Lệ phí</div>
                        <i style={{ color: '#87A8A4' }} class="fas fa-money-bill"></i>&nbsp;&nbsp;{record.Fee === 0 ? "Miễn phí" :
                            <NumberFormat
                                value={record.Fee}
                                displayType="text"
                                type="text"
                                suffix=" vnđ"
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                            />
                            }
                    </Col>
                    <Col span={12}>
                        <div className='viewEventText'>Địa chỉ</div>
                        <i style={{ color: '#726A95' }} class="fas fa-map-marked-alt"></i>&nbsp;&nbsp;{record.Venue}
                    </Col>
                </Row>
                <div className='viewEventText' style={{ marginTop: 10 }}>Mô tả cuộc thi</div>
                <Input.TextArea style={{ color: 'black', backgroundColor: 'white', cursor: 'auto' }} autoSize={{ maxRows: 30 }} disabled value={record.Description}></Input.TextArea>
            </>
        )
    }
    return (
        <div>
            <ModalBodyView />
        </div>
    )
}
