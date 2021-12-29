import React, { useEffect, useState, useRef } from 'react'
import { Form, Input, Button, Space, Select, Divider, Row, Col, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import CarService from '../../services/CarService';

function CreateAttributesComponent() {
    const { Option } = Select;
    const [typeInput, setTypeInput] = useState(true);
    const [engine, setEngine] = useState([]);
    const [addValue, setAddValue] = useState(0);
    const buttonRef = useRef(null);
    const [form] = Form.useForm();
    let index = 0;
    useEffect(() => {
        CarService.getEngineType()
            .then((result) => {
                setEngine(result.data)
            })
            .catch((error) => console.log(error))
    }, [])
    useEffect(() => {
        buttonRef.current.click();
    }, []);
    const handleChange = (value, fieldKey) => {
        // for (let i = 0; i <= fieldKey; i++) {
        //     console.log("dd", fieldKey + i)
        if (value === '1') {
            form.setFieldsValue({ type: value })
            form.setFieldsValue({ fieldKey: fieldKey })
        }
        if (value === '2') {
            form.setFieldsValue({ type: value })
            form.setFieldsValue({ fieldKey: fieldKey })
        }
        // }

        console.log("type: ", form.getFieldValue('fieldKey'))
    }
    const [formLayout, setFormLayout] = useState('horizontal');

    const onFormLayoutChange = ({ layout }) => {
        setFormLayout(layout);
    };

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            }
            : null;
    const buttonItemLayout =
        formLayout === 'horizontal'
            ? {
                wrapperCol: {
                    span: 14,
                    offset: 4,
                },
            }
            : null;
    const Demo = () => {
        const onFinish = values => {
            console.log('Received values of form:', values);
        };

        return (
            <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.List name="attributes" >
                    {(fields, { add, remove }) => {
                        console.log(fields)
                        return (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            fieldKey={[fieldKey, 'name']}
                                            rules={[{ required: true, message: 'Tên thuộc tính không được bỏ trống' }]}
                                            style={{ width: '252.03px' }}
                                        >
                                            <Input placeholder="Tên thuộc tính" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'type']}
                                            fieldKey={[fieldKey, 'type']}
                                            rules={[{ required: true, message: 'Không bỏ trống!' }]}
                                        >
                                            <Select
                                                onChange={(value) => handleChange(value, fieldKey)}
                                                style={{ width: '95px' }}
                                                showSearch
                                                placeholder="Kiểu nhập"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {/* {brands.map(brands => (
                                                <Option key={brands.Id} value={brands.Name}>{brands.Name}</Option>
                                            ))} */}
                                                <Option key='1'>Chữ</Option>
                                                <Option key='2'>Số</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'measure']}
                                            fieldKey={[fieldKey, 'measure']}
                                            rules={[{ required: true, message: 'Không bỏ trống!' }]}
                                        >
                                            <Select
                                                style={{ width: '95px' }}
                                                showSearch
                                                placeholder="Đơn vị"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {/* {brands.map(brands => (
                                                <Option key={brands.Id} value={brands.Name}>{brands.Name}</Option>
                                            ))} */}
                                                <Option key='1'>cm</Option>
                                                <Option key='2'>mm</Option>
                                                <Option key='3'>kg</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '165px' }}
                                            {...restField}
                                            name={[name, 'att']}
                                            fieldKey={[fieldKey, 'att']}
                                            rules={[{ required: true, message: 'Không bỏ trống!' }]}
                                            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                                        // hidden={fieldKey === form.getFieldValue('fieldKey') ? false : true}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Đơn vị thuộc tính"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {/* {brands.map(brands => (
                                                <Option key={brands.Id} value={brands.Name}>{brands.Name}</Option>
                                            ))} */}
                                                <Option key='1'>Thông số cơ bản</Option>
                                                <Option key='2'>Thông số kỹ thuật</Option>
                                            </Select>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button ref={buttonRef} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm thuộc tính
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    };
    console.log(addValue)
    return (
        <div>
            <Demo />
        </div>
    )
}

export default CreateAttributesComponent
