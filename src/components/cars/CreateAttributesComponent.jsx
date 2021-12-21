import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Space, Select, Divider, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

function CreateAttributesComponent() {
    const { Option } = Select;
    let index = 0;

    const Demo = () => {
        const onFinish = values => {
            console.log('Received values of form:', values);
        };

        return (
            <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                autoComplete="off"

            >
                <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'first']}
                                        fieldKey={[fieldKey, 'first']}
                                        rules={[{ required: true, message: 'Tên thuộc tính không được bỏ trống' }]}
                                        style={{ width: '252.03px' }}
                                    >
                                        <Input placeholder="Tên thuộc tính" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'last123']}
                                        fieldKey={[fieldKey, 'last123']}
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
                                        name={[name, 'last']}
                                        fieldKey={[fieldKey, 'last']}
                                        rules={[{ required: true, message: 'Không bỏ trống!' }]}
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
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Nhập thuộc tính
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    };
    class App extends React.Component {
        state = {
            items: ['Xe xăng', 'Xe dầu', 'Xe điện'],
            name: '',
        };

        onNameChange = event => {
            this.setState({
                name: event.target.value,
            });
        };

        addItem = () => {
            console.log('addItem');
            const { items, name } = this.state;
            this.setState({
                items: [...items, name || `New item ${index++}`],
                name: '',
            });
        };

        render() {
            const { items, name } = this.state;
            return (
                <Select
                    style={{ width: '100%', marginBottom: 20 }}
                    placeholder="Chọn loại động cơ"
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
                                <a
                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                    onClick={this.addItem}
                                >
                                    <PlusOutlined /> Thêm động cơ
                                </a>
                            </div>
                        </div>
                    )}
                >
                    {items.map(item => (
                        <Option key={item}>

                            <div>{item}</div>
                            {/* <div onClick={() => console.log("xoa: ", item)}>Xóa</div> */}

                        </Option>
                    ))}
                </Select>
            );
        }
    }
    return (
        <div>
            <App />
            <Demo />
        </div>
    )
}

export default CreateAttributesComponent
