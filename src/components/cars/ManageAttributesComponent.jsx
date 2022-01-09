import { PlusCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Spin, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CarService from '../../services/CarService';

function ManageAttributesComponent() {
    const [engine, setEngine] = useState([]);
    const { Option } = Select;
    const [form] = Form.useForm();
    let index = 0;
    useEffect(() => {
        CarService.getEngineType()
            .then((result) => {
                setEngine(result.data)
            })
            .catch((error) => console.log(error))
    }, [])
    const SelectEngine = () => {
        const [visibleEdit, setVisibleEdit] = React.useState(false);
        const [visibleCreate, setVisibleCreate] = React.useState(false);
        const [visibleEngine, setVisibleEngine] = React.useState(false);
        const [pageTableAttributesSize, setPageTableAttributesSize] = React.useState(5);
        const [pageTableAttributes, setPageTableAttributes] = React.useState(1);
        const [name, setName] = useState('');
        const [filterTable, setFilterTable] = useState(null);
        const [attributesSelected, setAttributesSelected] = useState([]);
        const [searchValue, setSearchValue] = useState('')
        const [data, setData] = useState('')
        const [attributeId, setAttributeId] = useState(0)
        const buttonRefUpdateAttribute = useRef(null);
        const [items, setItems] = useState(engine);
        useEffect(() => {
            form.setFieldsValue({
                id: data.Id,
                name: data.Name,
                rangeOfValue: data.RangeOfValue,
                measure: data.Measure,
                type: data.Type,
                engineType: data.EngineType,
            })
        }, [data])
        useEffect(() => {
            CarService.getAttributeByTypeId(items.length !== 0 && items[0].Id)
                .then((result) => { setAttributesSelected(result.data) })
                .catch((error) => { console.log(error) });
        }, [items])
        function handleChangeSelect(value) {
            setSearchValue('')
            setFilterTable(null)
            setAttributeId(value)
            form.setFieldsValue({ search: '' })
            CarService.getAttributeByTypeId(value)
                .then((result) => { setAttributesSelected(result.data) })
                .catch((error) => { console.log(error) });
        }
        const handleCancelEdit = () => {
            setVisibleEdit(false);
            form.resetFields();
        };
        const handleCancelCreate = () => {
            setVisibleCreate(false);
            form.resetFields();
        };
        const handleCancelEngine = () => {
            CarService.getEngineType()
                .then((result) => {
                    setItems(result.data)
                })
                .catch((error) => console.log(error))
            setVisibleEngine(false);
        };
        const onClickEdit = (data) => {
            setVisibleEdit(true)
            form.setFieldsValue({
                id: data.Id,
                name: data.Name,
                rangeOfValue: data.RangeOfValue,
                measure: data.Measure,
                type: data.Type,
                engineType: data.EngineType,
            })
            setData(data)
        }
        const handleChangeType = (value) => {
            form.setFieldsValue({ type: value, measure: 'N/A' })
        }
        const onUpdateAttributeFinish = (values) => {
            console.log(values)
            CarService.updateAttributeId(values.id, values)
                .then(() => {
                    CarService.getAttributeByTypeId(attributeId !== 0 ? attributeId : (items.length !== 0 && items[0].Id))
                        .then((result) => { setAttributesSelected(result.data) })
                        .catch((error) => { console.log(error) });
                    form.resetFields();
                    setVisibleEdit(false);
                    message.success("Cập nhật thuộc tính thành công")
                })
                .catch(() => {
                    message.error("Cập nhật thuộc tính không thành công")
                })
        }
        const Edit = () => {
            const [itemss, setItemss] = useState(['mm', 'kg', 'km/h', 'cc', 'lít'])
            const [nameItemss, setNameItemss] = useState('')
            const onNameChangeItemss = (event) => {
                setNameItemss(event.target.value)
            };
            const addItemss = () => {
                setItemss([...itemss, nameItemss || `New item ${index++}`])
                setNameItemss('')
            };
            return (
                <Form
                    layout="vertical"
                    form={form}
                    id="editAttribute"
                    onFinish={onUpdateAttributeFinish}
                >
                    <Form.Item hidden={true} name="id"><Input /></Form.Item>
                    <Form.Item hidden={true} name="engineType"><Input /></Form.Item>
                    <Form.Item label="Tên thuộc tính" name="name" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}>
                        <Input.TextArea
                            placeholder="Nhập tên thuộc tính"
                            showCount maxLength={100}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item label="Kiểu nhập" name="type" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Chọn kiểu nhập"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleChangeType}
                        >
                            <Option key={1} value={1}>Chữ</Option>
                            <Option key={2} value={2}>Số</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
                        {() => {
                            return (
                                <Row gutter={15}>
                                    <Col span={12} hidden={form.getFieldValue('type') === 1} >
                                        <Form.Item label="Đơn vị tính" name="measure">
                                            <Select
                                                placeholder="Nhập đơn vị tính"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <Input style={{ flex: 'auto' }} value={nameItemss} onChange={onNameChangeItemss} />
                                                            <div
                                                                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                                onClick={addItemss}
                                                            >
                                                                <PlusOutlined /> Thêm
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                {itemss.map(item => (
                                                    <Option key={item}>{item}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Độ dài tối đa" name="rangeOfValue" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder="Nhập độ dài"
                                                min={1} max={1000000000}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                        }}
                    </Form.Item>
                </Form>
            )
        }
        const CreateAttribute = () => {
            const [itemss, setItemss] = useState(['mm', 'kg', 'km/h', 'cc', 'lít'])
            const [engineCreate, setEngineCreate] = useState([])
            const [nameItemss, setNameItemss] = useState('')
            const [nameItemsCreate, setNameItemsCreate] = useState('')
            const [check, setCheck] = useState(0);
            const [formCreate] = Form.useForm();
            const [attributeNameToCheck, setAttributeNameToCheck] = useState([])
            const [validate, setValidate] = useState(0);
            const handleChangeCreateType = (value) => {
                formCreate.setFieldsValue({ type: value, measure: 'N/A' })
                setCheck(value)
            }
            useEffect(() => {
                CarService.getEngineType()
                    .then((result) => {
                        setEngineCreate(result.data)
                    })
                    .catch((error) => console.log(error))
            }, [])
            const onNameChangeItemss = (event) => {
                setNameItemss(event.target.value)
            };
            const addItemss = () => {
                setItemss([...itemss, nameItemss || `New item ${index++}`])
                setNameItemss('')
            };
            const onNameChangeItemsCreate = (event) => {
                setNameItemsCreate(event.target.value)
            };
            const addItemsCreate = () => {
                CarService.createEngineType(nameItemsCreate)
                    .then(() => {
                        CarService.getEngineType().then((result) => { setEngineCreate(result.data) }).catch((error) => console.log(error))
                        message.success("Tạo loại thuộc tính thành công")
                    })
                    .catch(() => { message.error("Tạo loại thuộc tính không thành công") })
                setEngineCreate([...engineCreate, nameItemsCreate || `New item ${index++}`])
                setNameItemsCreate('')
            };
            const onCreateAttributeFinish = (values) => {
                if (validate === 1) {
                    message.error("Thuộc tính bị trùng nhau")
                } else {
                    CarService.createAttribute([values])
                        .then(() => {
                            setVisibleCreate(false)
                            CarService.getEngineType()
                                .then((result) => {
                                    setItems(result.data)
                                })
                                .catch((error) => console.log(error))
                            CarService.getAttributeByTypeId(attributeId !== 0 ? attributeId : (items.length !== 0 && items[0].Id))
                                .then((result) => { setAttributesSelected(result.data) })
                                .catch((error) => { console.log(error) });
                            message.success("Tạo thuộc tính thành công")
                        })
                        .catch(() => {
                            message.error("Tạo thuộc tính không thành công")
                        })
                }
            }
            const handleChangeSelectCheckValidate = (value) => {
                let data = []
                setValidate(0)
                formCreate.setFieldsValue({ name: null, type: null })
                setCheck(0)
                CarService.getAttributeByTypeId(value)
                    .then((response) => {
                        response.data.forEach((res) => {
                            data.push(res.Name)
                        })
                        setAttributeNameToCheck(data)
                    })
                    .then((error) => { console.log(error) })
            }
            const handleChangeCheckAttribute = (e) => {
                var data = e.target.value.toLowerCase().replace(/\s/g, '');
                for (var i = 0; i < attributeNameToCheck.length; i++) {
                    if (data === (attributeNameToCheck[i].toLowerCase().replace(/\s/g, ''))) {
                        form.setFieldsValue({ name: data })
                        setValidate(1)
                        break;
                    } else {
                        setValidate(0)
                    }
                }
            }
            return (
                <Form
                    layout="vertical"
                    id="createAttribute"
                    onFinish={onCreateAttributeFinish}
                    form={formCreate}
                >
                    <Form.Item label="Tên loại thuộc tính" name="engineType" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}>
                        <Select
                            // defaultValue={items.length !== 0 && items[0].Id}
                            onChange={handleChangeSelectCheckValidate}
                            placeholder="Chọn loại thuộc tính"
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                        <Input style={{ flex: 'auto' }} value={nameItemsCreate} onChange={onNameChangeItemsCreate} />
                                        <Button disabled={nameItemsCreate !== '' ? false : true} style={{ marginLeft: '10px' }} onClick={addItemsCreate}>
                                            <PlusOutlined /> Thêm
                                        </Button>
                                    </div>
                                </div>
                            )}
                        >
                            {engineCreate.length !== 0 && engineCreate.map(item => (
                                <Option key={item.Id}>{item.Name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tên thuộc tính" name="name" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}
                        help={validate === 1 && "Thuộc tính không được trùng nhau"}
                        hasFeedback
                        validateStatus={validate === 1 ? 'error' : 'success'}
                    >
                        <Input.TextArea
                            onChange={handleChangeCheckAttribute}
                            placeholder="Nhập tên thuộc tính"
                            showCount maxLength={100}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item label="Kiểu nhập" name="type" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Chọn kiểu nhập"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleChangeCreateType}
                        >
                            <Option key={1} value={1}>Chữ</Option>
                            <Option key={2} value={2}>Số</Option>
                        </Select>
                    </Form.Item>
                    <div style={{ display: check === 0 ? 'none' : false }}>
                        <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
                            {() => {
                                return (
                                    <Row gutter={15}>
                                        <Col span={12} hidden={formCreate.getFieldValue('type') === 1 || formCreate.getFieldValue('type') === undefined}>
                                            <Form.Item label="Đơn vị tính" name="measure" rules={[{ required: true, message: "Đơn vị tính không được bỏ trống" }]}>
                                                <Select
                                                    placeholder="Nhập đơn vị tính"
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                                <Input style={{ flex: 'auto' }} value={nameItemss} onChange={onNameChangeItemss} />
                                                                <div
                                                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                                    onClick={addItemss}
                                                                >
                                                                    <PlusOutlined /> Thêm
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                >
                                                    {itemss.map(item => (
                                                        <Option key={item}>{item}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} hidden={formCreate.getFieldValue('type') === undefined}>
                                            <Form.Item label="Độ dài tối đa" name="rangeOfValue" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập độ dài"
                                                    min={1} max={1000000}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )
                            }}
                        </Form.Item>
                    </div>
                </Form >
            )
        }
        const confirmDelete = (id) => {
            console.log(id)
            CarService.deleteAttributeById(id)
                .then(() => {
                    CarService.getAttributeByTypeId(attributeId !== 0 ? attributeId : (items.length !== 0 && items[0].Id))
                        .then((result) => { setAttributesSelected(result.data) })
                        .catch((error) => { console.log(error) });
                    message.success("Xóa thuộc tính xe thành công")
                }).catch(() => message.error("Xóa thuộc tính xe không thành công"))
        };
        const onNameChange = event => {
            setName(event.target.value,)
        };
        const addItem = () => {
            console.log('addItem: ', name);
            CarService.createEngineType(name)
                .then(() => {
                    CarService.getEngineType()
                        .then((result) => {
                            setItems(result.data)
                        })
                        .catch((error) => console.log(error))
                    message.success("Tạo loại thuộc tính thành công")
                })
                .catch(() => { message.error("Tạo loại thuộc tính không thành công") })
            setItems([...items, name || `New item ${index++}`])
            setName('')
        };
        const baseColumns = [
            {
                title: 'Tên thuộc tính',
                key: 'attributeName',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.Name}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Kiểu nhập',
                key: 'attributeType',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={20} style={{ display: 'flex', alignItems: 'center' }}>
                                <div>
                                    {data.Type === 1 ?
                                        <Button style={{ padding: '0px 10px', background: '#6B7AA1', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                            Chữ
                                        </Button> :
                                        <Button style={{ padding: '0px 10px', background: '#F5CA81', color: 'white', height: 28, borderRadius: 6, border: 'none', fontWeight: 600 }} size="small">
                                            Số
                                        </Button>
                                    }
                                </div>
                            </Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Đơn vị tính',
                key: 'attributeMeasure',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.Measure}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Độ dài',
                key: 'length',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.RangeOfValue}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Tác vụ',
                width: '10%',
                key: 'modelAction',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={12}>
                                <i className="far fa-edit" onClick={() => onClickEdit(data)}></i>
                            </Col>
                            <Col span={12}>
                                <Popconfirm
                                    title="Bạn có muốn xóa thuộc tính xe này không?"
                                    onConfirm={() => confirmDelete(data.Id)}
                                    // onCancel={cancel}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <i className="far fa-trash-alt"></i>
                                </Popconfirm>
                            </Col>
                        </Row >
                    )
                }
            }
        ];
        const handleOnChangeSearch = (e) => {
            setSearchValue(e.target.value)
        }
        const search = () => {
            console.log("PASS", searchValue);
            const filterTable = attributesSelected.filter(o =>
                Object.keys(o).some(k =>
                    String(o[k])
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                )
            );
            setFilterTable(filterTable)
        }
        const ManageEngine = () => {
            const [filterTable, setFilterTable] = useState(null);
            const [attributeList, setAttributeList] = useState([]);
            const [pageAttributeSize, setPageAttributeSize] = React.useState(5);
            const [pageAttribute, setPageAttribute] = React.useState(1);
            const [attributeName, setAttributeName] = useState(null);
            const [attributeId, setAttributeId] = useState(0);
            const [formCreateEngine] = Form.useForm();
            const [visibleCreateEngine, setVisibleCreateEngine] = useState(false)
            const handleUpdate = (id, name) => {
                setAttributeName(name)
                setAttributeId(id)
            }
            const handleCancelCreateEngine = () => {
                setVisibleCreateEngine(false)
            }
            formCreateEngine.setFieldsValue({
                id: attributeId,
                name: attributeName
            })
            useEffect(() => {
                CarService.getEngineType()
                    .then((result) => {
                        setAttributeList(result.data)
                    })
                    .catch((error) => console.log(error))
            }, [])
            const showModal = () => {
                setVisibleCreateEngine(true)
            };
            const confirmUpdateAttribute = () => {
                buttonRefUpdateAttribute.current.click();
            };
            const onFinishUpdateAttribute = (values) => {
                console.log(values)
                CarService.updateEngineType(values.id, values.name)
                    .then(() => {
                        CarService.getEngineType()
                            .then((result) => {
                                setAttributeList(result.data)
                            })
                            .catch((error) => console.log(error))
                        message.success("Cập nhật thuộc tính thành công")
                    })
                    .catch(() => {
                        message.error("Cập nhật thuộc tính không thành công")
                    })
            }
            const confirmDeleteEngine = (id) => {
                CarService.deleteEngineType(id)
                    .then(() => {
                        CarService.getEngineType().then((result) => { setAttributeList(result.data) }).catch((error) => console.log(error))
                        message.success("Xóa thuộc tính xe thành công")
                    }).catch(() => message.error("Xóa thuộc tính xe không thành công"))
            };
            const baseColumnsAttribute = [
                {
                    title: 'Loại thuộc tính',
                    key: 'modelName',
                    render: (data) => {
                        return (
                            <div>{data.Name}</div>
                        )
                    }
                },
                {
                    title: 'Tác vụ',
                    width: '15%',
                    key: 'modelAction',
                    render: (data) => {
                        return (
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Popconfirm
                                        title={
                                            <Form
                                                layout="vertical"
                                                id="updateCarModel"
                                                onFinish={onFinishUpdateAttribute}
                                                form={formCreateEngine}
                                            >
                                                <Form.Item hidden={true} name="id">
                                                    <Input defaultValue={data.Id} />
                                                </Form.Item>
                                                <Form.Item label="Cập nhật thuộc tính" name="name">
                                                    <Input.TextArea
                                                        placeholder="Nhập tên thuộc tính"
                                                        showCount maxLength={100}
                                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                                        style={{ width: '300px' }}
                                                    />
                                                </Form.Item>
                                                <Form.Item hidden={true}>
                                                    <Button ref={buttonRefUpdateAttribute} form="updateCarModel" type="primary" key="submit" htmlType="submit"></Button>
                                                </Form.Item>
                                            </Form>
                                        }
                                        onConfirm={() => confirmUpdateAttribute()}
                                        okText="Hoàn tất"
                                        cancelText="Hủy"
                                    >
                                        <i className="far fa-edit" onClick={() => handleUpdate(data.Id, data.Name)}></i>
                                    </Popconfirm>
                                </Col>
                                {data.Id !== "0416e0c8-2120-4d3f-8656-5c708d263c04" && <Col span={12}>
                                    <Popconfirm
                                        title="Bạn có muốn xóa thuộc tính xe này không?"
                                        onConfirm={() => confirmDeleteEngine(data.Id)}
                                        // onCancel={cancel}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <i className="far fa-trash-alt" ></i> 
                                    </Popconfirm>
                                </Col>}
                            </Row >
                        )
                    }
                }
            ];
            const search = value => {
                console.log("PASS", { value });
                const filterTable = attributeList.filter(o =>
                    Object.keys(o).some(k =>
                        String(o[k])
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    )
                );
                setFilterTable(filterTable)
            }
            const onCreateEngine = (value) => {
                CarService.createEngineType(value.name)
                    .then(() => {
                        CarService.getEngineType()
                            .then((result) => {
                                setAttributeList(result.data)
                            })
                            .catch((error) => console.log(error))
                        setVisibleCreateEngine(false)
                        message.success("Tạo loại thuộc tính thành công")
                    })
                    .catch(() => { message.error("Tạo loại thuộc tính không thành công") })
            }
            return (
                <div>
                    <Modal
                        destroyOnClose={true}
                        title={'Thêm loại thuộc tính'}
                        visible={visibleCreateEngine}
                        onCancel={handleCancelCreateEngine}
                        width={400}
                        footer={[
                            <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                                <Button onClick={handleCancelCreateEngine}>
                                    Hủy
                                </Button>
                                <Button type="primary" form="createEngine" key="submit" htmlType="submit">
                                    Hoàn tất
                                </Button>
                            </Row>
                        ]}
                    >
                        <Form
                            layout="vertical"
                            id="createEngine"
                            onFinish={onCreateEngine}
                        >
                            <Form.Item label="Loại thuộc tính" name="name" rules={[{ required: true, message: "Loại thuộc tính không được bỏ trống" }]}>
                                <Input.TextArea
                                    placeholder="Nhập loại thuộc tính"
                                    showCount maxLength={100}
                                    autoSize={{ minRows: 1, maxRows: 10 }}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                        <Row gutter={15}>
                            <Col span={20}>
                                <Input.Search
                                    className={"fixAnticon"}
                                    style={{ marginTop: 1 }}
                                    placeholder="Tìm kiếm. . ."
                                    enterButton
                                    onSearch={search}
                                    allowClear
                                />
                            </Col>
                            <Col span={4}>
                                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined style={{ marginTop: 5.5 }} />}></Button>
                            </Col>
                        </Row>
                    </div>
                    <Spin spinning={attributeList.length !== 0 ? false : true}>
                        <Table
                            columns={baseColumnsAttribute}
                            dataSource={filterTable === null ? attributeList : filterTable}
                            rowKey="IdModel"
                            pagination={{
                                current: pageAttribute,
                                pageSize: pageAttributeSize,
                                onChange: (pageAttribute, pageAttributeSize) => {
                                    setPageAttribute(pageAttribute)
                                    setPageAttributeSize(pageAttributeSize)
                                },
                                pageSizeOptions: ['5', '10', '15', '20'],
                                showSizeChanger: true,
                                locale: { items_per_page: "/ trang" },
                            }}
                        />
                    </Spin>
                </div>
            )
        }
        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    title={'Sửa thuộc tính'}
                    visible={visibleEdit}
                    onCancel={handleCancelEdit}
                    width={400}
                    footer={[
                        <Row style={{ float: 'right', marginBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancelEdit}>
                                Hủy
                            </Button>
                            <Button type="primary" form="editAttribute" key="submit" htmlType="submit">
                                Hoàn tất
                            </Button>
                        </Row>
                    ]}
                >
                    <Edit />
                </Modal>
                <Modal
                    destroyOnClose={true}
                    title={'Thêm thuộc tính'}
                    visible={visibleCreate}
                    onCancel={handleCancelCreate}
                    width={400}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancelCreate}>
                                Hủy
                            </Button>
                            <Button type="primary" form="createAttribute" key="submit" htmlType="submit">
                                Hoàn tất
                            </Button>
                        </Row>
                    ]}
                >
                    <CreateAttribute />
                </Modal>
                <Modal
                    destroyOnClose={true}
                    title='Danh sách loại thuộc tính'
                    visible={visibleEngine}
                    onCancel={handleCancelEngine}
                    width={600}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button type="primary" form="createCarModel" key="submit" htmlType="submit" onClick={handleCancelEngine}>
                                Xong
                            </Button>
                        </Row>
                    ]}
                >
                    <ManageEngine />
                </Modal>
                <div>
                    <Row>
                        <Button type="primary" shape="round" onClick={setVisibleCreate} className="createButton" style={{ height: 36, float: 'left', marginRight: 15 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo thuộc tính</span></Button>
                        <Button type="primary" shape="round" onClick={setVisibleEngine} className="createButton" style={{ height: 36, float: 'left' }} icon={<SettingOutlined />}><span style={{ marginTop: 2.5 }}>Quản loại thuộc tính</span></Button>
                    </Row>
                    <Select
                        defaultValue={items.length !== 0 && items[0].Id}
                        onChange={handleChangeSelect}
                        style={{ width: 240 }}
                        placeholder="Chọn loại thuộc tính"
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0' }} />
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <Input style={{ flex: 'auto' }} value={name} onChange={onNameChange} />
                                    <div
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={addItem}
                                    >
                                        <PlusOutlined /> Thêm
                                    </div>
                                </div>
                            </div>
                        )}
                    >
                        {items.map(item => (
                            <Option key={item.Id}>
                                <Row>
                                    <div>{item.Name}</div>
                                    {/* <div onClick={() => console.log("xoa: ", item)}>Xóa</div> */}
                                </Row>
                            </Option>
                        ))}
                    </Select>
                    <div style={{ marginTop: 15 }}>
                        <Form form={form}>
                            <Form.Item name="search">
                                <Input.Search
                                    className={"fixAnticon"}
                                    style={{ marginBottom: 15, width: 500 }}
                                    placeholder="Tìm kiếm. . ."
                                    enterButton
                                    onSearch={search}
                                    allowClear
                                    onChange={handleOnChangeSearch}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <Table
                    columns={baseColumns}
                    dataSource={filterTable === null ? attributesSelected : filterTable}
                    rowKey="Id"
                    pagination={{
                        current: pageTableAttributes,
                        pageSize: pageTableAttributesSize,
                        onChange: (pageTableAttributes, pageTableAttributesSize) => {
                            setPageTableAttributes(pageTableAttributes)
                            setPageTableAttributesSize(pageTableAttributesSize)
                        },
                        pageSizeOptions: ['5', '10', '15', '20'],
                        showSizeChanger: true,
                        locale: { items_per_page: "/ trang" },
                    }}
                />
            </div>
        );
    }
    return (
        <>
            <div style={{ marginBottom: 30, textAlign: 'center' }}>
                <Spin spinning={engine.length !== 0 ? false : true}>
                    <SelectEngine />
                </Spin>
            </div>
        </>
    )
}

export default ManageAttributesComponent
