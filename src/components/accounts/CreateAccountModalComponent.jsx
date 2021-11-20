import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Row, Select, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import AccountService from '../../services/AccountService'
import './style.less';
export default function CreateAccountModalComponent() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const { Option } = Select;

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    const onFinish = (values) => {
        AccountService.createAccount(values)
            .then((res) => {
                setTimeout(() => {
                    message.success("Tạo thành công")
                }, 200);
                setTimeout(() => {
                    window.location.reload();
                    console.log("Okkk")
                }, [500])
            })
            .catch((err) => {
                message.error("Tạo không thành công")
                console.log(err)
            })
        console.log(values)
    }
    form.setFieldsValue({
        role: 1
    })
    return (
        <div>
            <Tooltip key="Id" title="Chỉ được tạo tài khoản dành cho quản trị và quản lý" color='#6F4C5B'>
                <Button type="primary" onClick={showModal} shape="round" style={{ height: 36, marginBottom: 5 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo tài khoản</span></Button>
            </Tooltip>
            <Modal
                title="Tạo tài khoản"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', marginRight: '8px' }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button form="myForm" type="primary" onClick={showModal} key="submit" htmlType="submit">
                            Hoàn tất
                        </Button>
                    </Row>
                ]}
            >
                <Form
                    key="Id"
                    id="myForm"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item hidden={true} name="role"><Input></Input></Form.Item>
                    <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Tên không được bỏ trống" }]}>
                        <Input.TextArea
                            placeholder="Nhập họ và tên"
                            showCount maxLength={100}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: "Tên đăng nhập không được bỏ trống" }]}>
                        <Input.TextArea
                            placeholder="Nhập tên đăng nhập"
                            showCount maxLength={50}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}>
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
