import React from 'react'
import { DatePicker, ConfigProvider, Form, Input, Row, Col } from 'antd';
import 'moment/locale/vi';
import moment from 'moment';
import locale from 'antd/es/locale-provider/fr_FR';
export default function CreateEventBodyModalComponent() {
    const { RangePicker } = DatePicker;

    function onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    function onOk(value) {
        console.log('onOk: ', value);
    }
    return (
        <div>
            <Form layout="vertical">
                <Form.Item label="Ảnh sự kiện" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên sự kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Form.Item label="Tên sự kiện" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên sự kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label={<div>Ngày bắt đầu <span style={{ color: 'red' }}>ĐĂNG KÝ</span> và kết thúc</div>} name="date" rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                            <ConfigProvider locale={locale}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Ngày bắt đầu đăng ký', 'Ngày kết thúc đăng ký']}
                                    showTime={{ format: 'HH:mm' }}
                                    format={"HH:mm" + " - " + "DD/MM/yyyy"}
                                    onChange={onChange}
                                    onOk={onOk}
                                    showTime
                                />
                            </ConfigProvider>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<div>Ngày bắt đầu <span style={{ color: 'green' }}>SỰ KIỆN</span> và kết thúc</div>} name="date" rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                            <ConfigProvider locale={locale}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Ngày bắt đầu sự kiện', 'Ngày kết thúc sự kiện']}
                                    showTime={{ format: 'HH:mm' }}
                                    format={"HH:mm" + " - " + "DD/MM/yyyy"}
                                    onChange={onChange}
                                    onOk={onOk}
                                    showTime
                                />
                            </ConfigProvider>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Tối thiểu người đăng ký" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên sự kiện"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Tối đa người đăng ký" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên sự kiện"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ tổ chức" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên sự kiện"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Mô tả sự kiện" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Mô tả sự kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
