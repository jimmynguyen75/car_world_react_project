import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Modal, Row, Select, message } from 'antd';
import React, { useState } from 'react';
import { useStorage } from '../../hook/useBrand';
import BrandService from '../../services/BrandService';
import './style.less';
export default function CreateBrandModalComponent() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const { Option } = Select;
    const { url } = useStorage(file)
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    const onFinish = (values) => {
        BrandService.createNewBrand(values)
            .then(() => {
                window.location.href = '/quan-ly/thuong-hieu';
                console.log("Okkk")
            })
            .catch((err) => { 
                message.error("Vui lòng nhập ảnh")
                console.log(err) 
            })
        console.log(values)
    }
    const changeImage = (e) => {
        setFile(e.target.files[0])
    }
    form.setFieldsValue({
        image: url
    })
    console.log(url)
    return (
        <div>
            <Button type="primary" onClick={showModal} shape="round" style={{ height: 36, marginBottom: 5 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo thương hiệu</span></Button>
            <Modal
                title="Tạo mới thương hiệu"
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
                    <Form.Item name="image" hidden={true} >
                        <Input />
                    </Form.Item>
                    <Form.Item label={<div><span style={{ color: "#ff4d4f", lineHeight: 1, fontSize: 14, fontFamily: ' SimSun, sans-serif'}}>*</span> Ảnh</div>} style={{ textAlign: "center" }}
                    >
                        <Avatar size={64} width="150px" alt="" icon={<UserOutlined />} src={url} /> <br />
                        <label className="upload" htmlFor="upload-photoCreateBand" ><i className="fas fa-plus-circle fa-1x"><span style={{ marginLeft: 3 }}>Chọn ảnh</span></i></label>
                        <input type="file" onChange={changeImage} name="photo" id="upload-photoCreateBand" />
                    </Form.Item>
                    <Form.Item
                        label="Tên thương hiệu"
                        name="name"
                        rules={[{ required: true, message: "Tên thương hiệu không được bỏ trống!" }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    <Form.Item label="Loại thương hiệu" name="type"
                        rules={[{ required: true, message: "Loại thương hiệu không được bỏ trống!" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn thương hiệu"
                        >
                            <Option value="1">Xe</Option>
                            <Option value="2">Phụ kiện</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                            placeholder="Nhập mô tả"
                            showCount maxLength={200}
                            autoSize={{ minRows: 3, maxRows: 10 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
