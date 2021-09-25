import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Row, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
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
        // AccountService.createAccount(values)
        //     .then((res) => {
        //         window.location.reload();
        //         console.log("Okkk")
        //     })
        //     .catch((err) => { console.log(err) })
        console.log(values)
    }
    return (
        <div>
            <Tooltip key="Id" title="Chỉ được tạo tài khoản dành cho quản trị và quản lý" color='#6F4C5B'>
                <Button type="primary" onClick={showModal} shape="round" style={{ height: 36, marginBottom: 5 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo tài khoản</span></Button>
            </Tooltip>
            <Modal
                title="Tạo mới tài khoản"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', marginRight: '8px' }}>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button form="myForm" type="primary" onClick={showModal} key="submit" htmlType="submit">
                            Submit
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
                    <Form.Item label="Họ và tên" name="fullname">
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    <Form.Item label="Tên đăng nhập" name="username">
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password">
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="roleId" >
                        <Select
                            showSearch
                            placeholder="Chọn vai trò"
                        >
                            <Option value="1">Quản trị</Option>
                            <Option value="2">Quản lý</Option>
                        </Select>
                    </Form.Item >
                </Form>
            </Modal>
        </div>
    )
}
