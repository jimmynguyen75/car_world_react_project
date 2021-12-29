import { PlusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tag, message } from 'antd';
import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import CarService from '../../services/CarService';

function CreateCarModelsComponent({ brandId }) {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);
    const handleAddBrand = () => {
        console.log('ok')
        window.location.href = '/thuong-hieu'
    }
    const onFinish = (values) => {
        console.log(values)
        CarService.createCarModel(values)
            .then(() => {
                message.success("Tạo mẫu xe thành công")
            })
            .catch(() => { message.error("Tạo mẫu xe không thành công") })
    }
    useEffect(() => {
        BrandService.getAllBrand()
            .then(res => {
                setBrands(res.data);
            })
            .catch(err => console.log(err))
    }, [])
    form.setFieldsValue({
        brandId: brandId
    })
    return (
        <div>
            <Form
                layout="vertical"
                id="createCarModel"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item label="Tên mẫu xe" name="name" rules={[{ required: true, message: "Tên mẫu xe không được bỏ trống" }]} 
                    help="Should be combination of numbers & alphabets"
                    hasFeedback 
                    validateStatus="success"
                >
                    <Input.TextArea
                        placeholder="Nhập tên mẫu xe"
                        showCount maxLength={100}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Form.Item label={<div>Hãng xe <Tag icon={<PlusCircleOutlined />} onClick={handleAddBrand} color="success">
                    Thêm hãng
                </Tag></div>} name="brandId" rules={[{ required: true, message: "Hãng xe không được bỏ trống" }]}>
                    <Select
                        showSearch
                        placeholder="Chọn hãng xe"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {brands.map(brands => (
                            <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateCarModelsComponent
