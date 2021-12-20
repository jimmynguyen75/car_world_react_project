import { PlusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tag } from 'antd';
import React, { useState, useEffect}from 'react';
import BrandService from '../../services/BrandService';

function CreateCarModelsComponent() {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);
    const handleAddBrand = () => {
        console.log('ok')
        window.location.href = '/thuong-hieu'
    }
    const onFinish = (values) => {
        console.log(values)
    }
    useEffect(() => {
        BrandService.getAllBrand()
            .then(res => {
                setBrands(res.data);
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            <Form
                layout="vertical"
                id="prizeContest"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item label="Tên mẫu xe" name="name" rules={[{ required: true, message: "Tên mẫu xe không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên mẫu xe"
                        showCount maxLength={100}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Form.Item label={<div>Hãng xe <Tag icon={<PlusCircleOutlined />} onClick={handleAddBrand} color="success">
                    Thêm hãng
                </Tag></div>} name="brandName" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                    <Select
                        showSearch
                        placeholder="Chọn hãng xe"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {brands.map(brands => (
                            <Option key={brands.Id} value={brands.Name}>{brands.Name}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateCarModelsComponent
