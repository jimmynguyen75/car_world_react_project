import { MinusOutlined } from '@ant-design/icons';
import { Carousel, Col, Descriptions, Image, Row, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
export default function ViewEventComponent({ record, recordImage }) {
    console.log("record: ", record);
    console.log("recordImage: ", recordImage);
    const ModalBodyView = () => {
        const [visible, setVisible] = useState("none")
        const [loading, setLoading] = useState("0")
        setTimeout(() => {
            setLoading("none")
            setVisible(true)
        }, 800)
        return (
            <>
                <Row gutter={15}>
                    <Col span={12}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Tên sự kiện">
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
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Thời gian diễn ra <span style={{ color: '#7BC0A3', fontWeight: 500 }}>SỰ KIỆN</span></div>
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
                    <Col span={6}>
                        <div className='viewEventText'>Đã tham gia</div>
                        <i style={{ color: '#50C9BA' }} class="fas fa-user-check"></i>&nbsp;&nbsp;{record.CurrentParticipants}
                    </Col>
                    <Col span={6}>
                        <div className='viewEventText'>Số lượng giới hạn</div>
                        <i style={{ color: '#E36387' }} class="fas fa-users"></i>&nbsp;&nbsp;{record.MinParticipants} - {record.MaxParticipants}
                    </Col>
                    <Col span={6}>
                        <div className='viewEventText'>Địa chỉ</div>
                        <i style={{ color: '#726A95' }} class="fas fa-map-marked-alt"></i>&nbsp;&nbsp;{record.Venue}
                    </Col>
                </Row>
                <div className='viewEventText' style={{ marginTop: 10 }}>Mô tả sự kiện</div>
                <div>{record.Description}</div>
            </>
        )
    }
    return (
        <div>
            <ModalBodyView />
        </div>
    )
}
