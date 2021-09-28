import { Carousel, Col, Descriptions, Image, Row, Spin } from 'antd';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
function ViewCarModalComponent({ record, recordImage }) {
    const [visible, setVisible] = useState("none")
    const [loading, setLoading] = useState("0")
    setTimeout(() => {
        setVisible(true)
        setLoading("none")
    }, 1000)
    const ViewDetail = () => {
        return (
            <>
                <Row gutter={15}>
                    <Col span={12}>
                        <Spin size="middle" spinning={recordImage[0] === 'string' ? true : false}>
                            <div style={{ display: loading, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 'bold' }}>Đang tải</span></div>
                            <Carousel effect="fade" style={{ display: visible }}>
                                {recordImage.map((object, i) => {
                                    return (
                                        <div>
                                            <Image preview={false} style={{ display: 'block', margin: 'auto' }} key={i} src={object} />
                                        </div>)
                                })}
                            </Carousel>
                        </Spin>
                    </Col>
                    <Col span={12}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 16, width: 200 }}
                            size="small"
                            title={<div style={{ textDecoration: 'underline' }}>Thông số chính</div>}
                        >
                            <Descriptions.Item label="Tên xe">
                                {record.Name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kiểu dáng">
                                {record.BodyType}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hãng xe">
                                {record.Brand.Name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá">
                                <NumberFormat
                                    value={record.Price}
                                    displayType="text"
                                    suffix=" vnđ"
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Hộp số">
                                {record.GearBox}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chỗ ngồi">
                                {record.Seats}
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm sản xuất">
                                {record.YearOfManufactor}
                            </Descriptions.Item>
                            <Descriptions.Item label="Xuất xứ">
                                {record.Origin}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <br />
                <Row gutter={15}>
                    <Col span={8}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '600', fontSize: 16, width: 200 }}
                            size="small"
                            title={<div style={{ textDecoration: 'underline' }}>Thông số cơ bản</div>}
                        >
                            <Descriptions.Item label="Chiều dài">
                                {record.Length}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chiều rộng">
                                {record.Width}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chiều cao">
                                {record.Height}
                            </Descriptions.Item>
                            <Descriptions.Item label="Dung tích">
                                {record.Displacement}
                            </Descriptions.Item>
                            <Descriptions.Item label="Động cơ">
                                {record.EngineType}
                            </Descriptions.Item>
                            <Descriptions.Item label="Công suất cực đại">
                                {record.MaxPower}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô-men xoắn cực đại">
                                {record.MaxTorque}
                            </Descriptions.Item>
                            <Descriptions.Item label="Khoảng cách gầm xe">
                                {record.GroundClearance}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bán kính quay xe">
                                {record.TurningRadius}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêu hao nhiên liệu">
                                {record.FuelConsumption}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={8}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '600', fontSize: 16, width: 185 }}
                            size="small"
                            title={<div style={{ textDecoration: 'underline' }}>Thông số kĩ thuật</div>}
                        >
                            <Descriptions.Item label="Trọng lượng thô">
                                {record.KerbWeight}
                            </Descriptions.Item>
                            <Descriptions.Item label="Dung tích bình xăng">
                                {record.FuelCapacity}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kích thước mâm xe">
                                {record.WheelSize}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thông số lốp">
                                {record.TyreSize}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hệ thống treo trước">
                                {record.FrontSuspension}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hệ thống treo sau">
                                {record.RearSuspension}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={8}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '600', fontSize: 16, width: 185 }}
                            size="small"
                            title={<div style={{ textDecoration: 'underline' }}>Nội thất và ngoại thất</div>}
                        >
                            <Descriptions.Item label="Chất liệu nội thất">
                                {record.InteriorMaterial}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cụm đèn trước">
                                {record.HeadLights}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cụm đèn sau">
                                {record.TailLights}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đèn sương mù">
                                {record.FogLamps}
                            </Descriptions.Item>
                        </Descriptions>

                    </Col>
                </Row>
                <br />
                <Descriptions
                    bordered
                    column={1}
                    size="small"
                    title={<div style={{ textDecoration: 'underline' }}>Mô tả</div>}
                >
                    <Descriptions.Item>
                        {record.Despcription}
                    </Descriptions.Item>
                </Descriptions>
            </>
        )
    }
    return (
        <div>
            <ViewDetail />
        </div>
    )
}

export default ViewCarModalComponent;
