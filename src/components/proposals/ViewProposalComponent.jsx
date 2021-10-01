import { MinusOutlined } from '@ant-design/icons';
import { Carousel, Col, Descriptions, Image, Row, Spin, Tag, Avatar, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState, useEffect } from 'react';
import AccountService from '../../services/AccountService'
export default function ViewProposalComponent({ record, recordImage }) {
    console.log("record: ", record);
    console.log("recordImage: ", recordImage);
    const [userId, setUserId] = useState(0)
    useEffect(() => {
        AccountService.getUserById(record.UserId)
            .then(result => {
                setUserId(result.data)
                console.log(result.data)
            })
    }, [record])
    console.log("userId: ", userId)
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
                        <Row gutter={15}>
                            <Col span={18}>
                                <div className='viewEventText'>Người đề xuất</div>
                                <Row>
                                    <Avatar src={userId.Image}></Avatar>
                                    <Space size="middle"><div style={{ fontWeight: '500', fontSize: 14, color: '#2A528A', marginLeft: 5 }}>{userId.FullName}</div></Space>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <div className='viewEventText'>Loại đề xuất</div>
                                <Tag color={record.Type === 1 ? 'geekblue' : 'green'} key={record.Type}>
                                    {record.Type === 1 ? 'CUỘC THI' : 'SỰ KIỆN'}
                                </Tag>
                            </Col>
                        </Row>
                        <div className='viewEventText' style={{ margin: '12px 0px 7px 0px' }}>Tên sự kiện</div>
                        <div style={{ fontWeight: '500', fontSize: 16, color: '#2A528A' }}>{record.Title}</div>
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Thời gian <span style={{ color: '#BB5A5A', fontWeight: 500 }}>ĐĂNG KÝ</span></div>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Bắt đầu">
                                <i class="far fa-calendar-check" style={{ color: '#BB5A5A' }}></i>&nbsp;&nbsp;{moment(record.StartRegister).format('L')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kết thúc">
                                <i class="far fa-calendar-check" style={{ color: '#BB5A5A' }}></i>&nbsp;&nbsp;{moment(record.EndRegister).format('L')}
                            </Descriptions.Item>
                        </Descriptions>
                        <div className='viewEventText'>Số lượng giới hạn</div>
                        <i style={{ color: '#E36387' }} class="fas fa-users"></i>&nbsp;&nbsp;{record.MinParticipants} - {record.MaxParticipants}
                        <div className='viewEventText'>Địa chỉ</div>
                        <i style={{ color: '#726A95' }} class="fas fa-map-marked-alt"></i>&nbsp;&nbsp;{record.Venue}
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
