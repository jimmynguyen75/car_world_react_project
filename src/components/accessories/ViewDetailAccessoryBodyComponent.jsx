import { Avatar, Carousel, Col, Image, Row, Spin } from 'antd';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
function ViewDetailAccessoryComponent({ setDataToChild, setDataToChildFixingImage }) {
    const [loading, setLoading] = useState("0");
    const [visible, setVisible] = useState("none")
    setTimeout(() => {
        setVisible(true);
        setLoading("none")
    }, 1000)
    return (
        <div>
            <Row gutter={15}>
                <Col span="12">
                    <Spin size="middle" spinning={setDataToChildFixingImage[0] === 'string' ? true : false}>
                        <div style={{ display: loading, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 'bold' }}>Đang tải</span></div>
                        <div style={{ display: visible }}>
                            <Carousel effect="fade" >
                                {setDataToChildFixingImage.map((object, i) => {
                                    return (
                                        <div>
                                            <Image preview={false} style={{ height: 350, display: 'block', margin: 'auto' }} key={i} src={object} />
                                        </div>
                                    )
                                })}
                            </Carousel>
                        </div>
                    </Spin>
                </Col>
                <Col span="12">
                    <div style={{ fontSize: 30, fontWeight: 600 }}>{setDataToChild.Name}</div>
                    <div>
                        <NumberFormat
                            value={setDataToChild.Price}
                            displayType="text"
                            suffix=" VNĐ"
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            style={{ fontSize: 20, color: '#FF7643' }}
                        />
                    </div>
                    <div style={{ marginTop: 10, fontSize: 14 }}><Avatar size="small" src={setDataToChild.Brand.Image} /><span style={{ marginLeft: 5 }}>{setDataToChild.Brand.Name}</span></div>
                    <div style={{ marginTop: 10, fontSize: 16 }}>Description: {setDataToChild.Description}</div>
                </Col>
            </Row>

        </div>
    )
}

export default ViewDetailAccessoryComponent
