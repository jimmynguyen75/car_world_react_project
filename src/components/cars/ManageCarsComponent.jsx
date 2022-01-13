import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Carousel, Col, DatePicker, Descriptions, Divider, Form, Image, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Spin, Steps, Table, Tag, Tooltip, Upload } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import BrandService from '../../services/BrandService';
import CarService from '../../services/CarService';
import storage from '../../services/ImageFirebase';
import numberToWord from '../../utils/numberToWord';
import './styles.less';

function ManageCarsComponent() {
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const CarsTable = () => {
        const [attributes, setAttributes] = useState([])
        const [subs, setSubs] = useState([])
        const [filterTable, setFilterTable] = useState(null)
        const [pageGenerationSize, setPageGenerationSize] = React.useState(5)
        const [pageGeneration, setPageGeneration] = React.useState(1)
        const [visibleCarDetail, setVisibleCarDetail] = React.useState(false)
        const [carDetail, setCarDetail] = React.useState([])
        const [carImg, setCarImg] = useState([]);
        const [models, setModels] = useState([]);
        const [brandName, setBrandName] = useState('');
        const { Option } = Select;
        const [generations, setGenerations] = useState([])
        const [brands, setBrands] = useState([]);
        const history = useHistory();
        const [visibleEdit, setVisibleEdit] = useState(false)
        const [editInfo, setEditInfo] = useState('')
        const [brandSelectValue, setBrandValue] = useState(null)
        const [modelSelectValue, setModelValue] = useState(null)

        const baseColumns = [
            {
                title: 'Tên xe',
                key: 'carName',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ height: 50, justifyContent: 'center', display: 'flex', alignItems: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                            <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15, width: '100%' }} class="textOverflow">{data.Name}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Tên mẫu xe',
                key: 'carModel',
                render: (data) => {
                    return (
                        <div>{data.CarModel.Name}</div>
                    )
                }
            },
            {
                title: 'Giá xe',
                key: 'carPrize',
                render: (data) => {
                    return <NumberFormat
                        value={data.Price}
                        displayType="text"
                        suffix=" vnđ"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                    />
                }
            },
            {
                title: 'Năm sản xuất',
                key: 'carPublished',
                render: (data) => {
                    return (
                        <div>{data.YearOfManufactor}</div>
                    )
                }
            },
            {
                title: 'Tác vụ',
                width: '10%',
                key: 'carAction',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={8}>
                                <i className="far fa-eye" onClick={() => { handleVisibleCarDetail(data) }} />
                            </Col>
                            <Col span={8}>
                                <i className="far fa-edit" onClick={() => { handleShowEdit(data) }} />
                            </Col>
                            <Col span={8}>
                                <Popconfirm
                                    title="Bạn có muốn xóa xe này không?"
                                    onConfirm={() => confirmDeleteCar(data.Id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <i className="far fa-trash-alt" />
                                </Popconfirm>
                            </Col>
                        </Row>
                    )
                }
            }
        ];
        useEffect(() => {
            CarService.getAllGeneration().then((res) => setGenerations(res.data)).catch((err) => console.log(err))
            BrandService.getAllBrand().then((res) => { setBrands(res.data) }).catch((err) => console.log(err))
        }, [])
        const handleCancelEdit = () => {
            setVisibleEdit(false)
        }
        const handleShowEdit = (data) => {
            setEditInfo(data)
            setVisibleEdit(true)
        }
        const handleCancelCarDetail = () => {
            setVisibleCarDetail(false);
        }
        const handleVisibleCarDetail = (value) => {
            let data = [];
            data = value.Image.split('|')
            if (data.length > 1) {
                data.pop();
            }
            setCarImg(data)
            setCarDetail(value);
            setVisibleCarDetail(true);
            let fakeSub = []
            let fakeAttribute = []
            BrandService.getBrandById(value.CarModel.BrandId)
                .then((res) => {
                    setBrandName(res.data.Name)
                })
                .catch((err) => {
                    console.log(err)
                })
            CarService.getCarWithAttributeByGenerationId(value.Id)
                .then((res) => {
                    res.data.forEach((filter) => {
                        if (filter.Attribution.EngineType === "0416e0c8-2120-4d3f-8656-5c708d263c04") {
                            fakeSub.push(filter);
                        } else {
                            fakeAttribute.push(filter);
                        }
                    })
                    setAttributes(fakeAttribute);
                    setSubs(fakeSub)
                })
                .catch((error) => { console.log(error) })
        }
        const handleSelectBrand = (value) => {
            setBrandValue(value)
            CarService.getCarModelsByBrand(value).then((res) => setModels(res.data)).catch((err) => console.log(err))
            CarService.getGenerationByBrand(value)
                .then((result) => {
                    setFilterTable(result.data)
                })
                .catch((err) => console.log(err))
        }
        const handleBrandClear = () => {
            history.push('/xe')
        }
        const handleModelClear = () => {
            history.push('/xe')
        }
        const handleModelChange = (value) => {
            console.log(value)
            setModelValue(value)
            CarService.getGenerationByCarModel(value)
                .then((result) => {
                    setFilterTable(result.data)
                })
                .catch((err) => console.log(err))
        }
        const confirmDeleteCar = (id) => {
            console.log(id)
            message.loading("Đang tải...")
            CarService.deleteCarWithAttributesByGenerationId(id).then(() => {
                CarService.deleteCarGeneration(id).then(() => {
                    message.destroy()
                    message.success("Xóa xe thành công")
                    setVisibleCarDetail(false)
                    CarService.getAllGeneration().then((res) => setGenerations(res.data)).catch((err) => console.log(err))
                }).catch(() => {
                    message.destroy()
                    message.error("Xóa không thành công")
                })
            }).catch(() => {
                message.destroy()
                message.error("Xóa không thành công")
            })
        };
        const ViewCarDetail = () => {
            return (
                <div>
                    <Row gutter={15} style={{ marginBottom: 15 }}>
                        <Col span={12} style={{ marginTop: '15px' }}>
                            <Carousel effect="fade">
                                {carImg.length !== 0 && carImg.map((object, i) => {
                                    return (
                                        <div>
                                            <Image preview={false} style={{ display: 'block', margin: 'auto', maxHeight: '300px' }} key={i} src={object} />
                                        </div>)
                                })}
                            </Carousel>
                        </Col>
                        <Col span={12}>
                            <Descriptions title="Thông số chính" bordered>
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Tên xe" span={3}>{carDetail.Name}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Mẫu xe" span={3}>{carDetail.CarModel.Name}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Hãng xe" span={3}>{brandName}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Năm sản xuất" span={3}>{carDetail.YearOfManufactor}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Giá tham khảo" span={3}>
                                    <NumberFormat
                                        value={carDetail.Price}
                                        displayType="text"
                                        suffix=" vnđ"
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                    /></Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Descriptions title="Thông số cơ bản" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                        {subs.length !== 0 && subs.map((attribute) => (
                            <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={attribute.Attribution.Name}>{attribute.Value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                    <Descriptions title="Thông số xe" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                        {attributes.length !== 0 && attributes.map((attribute) => (
                            <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={attribute.Attribution.Name}>{attribute.Value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <div style={{ marginTop: '15px', float: 'right' }}>

                                <Button type="primary" onClick={handleCancelCarDetail}>Xong</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
        const CreateCarComponent = () => {
            const { Step } = Steps;
            const [visibleStep, setVisibleStep] = React.useState(false);
            const { Option } = Select;
            const [current, setCurrent] = React.useState(0);
            const [base, setBase] = useState([]);
            const [attribute, setAttribute] = useState([]);
            const [sub, setSub] = useState([]);
            const [img, setImg] = useState([]);
            const [type, setType] = useState('');
            const [formCreateBase] = Form.useForm();
            const [attributeName, setAttributeName] = useState([]);
            const [formCreateAttribute] = Form.useForm();
            const [formCreateSub] = Form.useForm();

            useEffect(() => {
                CarService.getAttributeByTypeId(type).then((result) => setAttributeName(result.data)).catch((error) => console.log(error))
            }, [type])
            const next = () => {
                setCurrent(current + 1);
            };
            const prev = () => {
                setCurrent(current - 1);
            };
            const showModalStep = () => {
                setVisibleStep(true);
            };
            const handleCancelStep = () => {
                setVisibleStep(false);
            };
            const CreateAttribute = () => {
                const [engine, setEngine] = useState([])
                const [showAttribute, setShowAttribute] = useState(0)
                const [attributes, setAttributes] = useState([])
                const [typeId, setTypeId] = useState('');
                const [visibleCreate, setVisibleCreate] = React.useState(false);

                useEffect(() => {
                    let data = []
                    CarService.getEngineType()
                        .then((result) => {
                            data = result.data
                            data.shift()
                            setEngine(data)
                        })
                        .catch((error) => console.log(error))
                }, [])
                useEffect(() => {
                    type !== '' && setShowAttribute(1)
                    CarService.getAttributeByTypeId(type).then((result) => {
                        setTypeId(type)
                        setAttributes(result.data)
                    }).catch((error) => console.log(error))
                }, [])
                const onFinishCreateAttribute = (values) => {
                    let attId = []
                    let ref = []
                    let repo = (JSON.stringify(values)).split('",')
                    attributes.forEach((filterData) => {
                        ref.push(filterData.Id)
                    })
                    for (let i = 0; i < ref.length; i++) {
                        attId.push({
                            "value": repo[i].replace("{", "").replace('"}', "").replace(ref[i], "").replace('""', '').replace(':"', '').replace('" ', ''),
                            "attributionId": attributes[i].Id
                        })
                    }
                    let data = {
                        "generationId": "null",
                        "attributionWithValues": attId
                    }
                    setAttribute(data)
                    setType(typeId)
                    next()
                }
                const handleChangeEngine = (values) => {
                    setShowAttribute(1)
                    setTypeId(values)
                    CarService.getAttributeByTypeId(values).then((result) => setAttributes(result.data)).catch((error) => console.log(error))
                }
                const handleCancelCreate = () => {
                    setVisibleCreate(false);
                };
                const CreateAttributeModal = () => {
                    let index = 0;
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
                        console.log(values)
                        message.loading("Đang tải...")
                        if (validate === 1) {
                            message.destroy()
                            message.error("Thuộc tính bị trùng nhau")
                        } else {
                            CarService.createAttribute([values])
                                .then(() => {
                                    message.destroy()
                                    setVisibleCreate(false)
                                    typeId !== '' && setShowAttribute(1)
                                    CarService.getAttributeByTypeId(typeId).then((result) => {
                                        // setTypeId(typeId)
                                        setAttributes(result.data)
                                    }).catch((error) => console.log(error))
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
                                // form.setFieldsValue({ name: data })
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
                            id="createNewAttribute"
                            onFinish={onCreateAttributeFinish}
                            form={formCreate}
                        >
                            <Form.Item label="Tên loại thuộc tính" name="engineType" rules={[{ required: true, message: "Tên loại thuộc tính không được bỏ trống" }]}>
                                <Select
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
                                        item.Id !== '0416e0c8-2120-4d3f-8656-5c708d263c04' && <Option key={item.Id}>{item.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Tên thuộc tính" name="name" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}
                                help={validate === 1 && "Thuộc tính không được trùng nhau"}
                                hasFeedback
                                validateStatus={validate === 1 ? "error" : "success"}
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
                                                            min={1} max={1000000000}
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
                return (
                    <div>
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
                                    <Button type="primary" form="createNewAttribute" key="submit" htmlType="submit">
                                        Hoàn tất
                                    </Button>
                                </Row>
                            ]}
                        >
                            <CreateAttributeModal />
                        </Modal>
                        <div style={{ marginBottom: 15 }}>
                            <Row type="flex" justify="center">
                                <Spin spinning={engine.length !== 0 ? false : true}>
                                    <Select
                                        style={{ width: '240px', marginRight: 15, marginTop: 2, fontWeight: 'bold', marginBottom: 15 }}
                                        showSearch
                                        placeholder="Chọn loại thuộc tính"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        defaultValue={type !== '' ? type : null}
                                        onChange={handleChangeEngine}
                                    >
                                        {engine.map(engine => (
                                            <Option key={engine.Id} value={engine.Id}>{engine.Name}</Option>
                                        ))}
                                    </Select>
                                </Spin>
                            </Row>
                        </div>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishCreateAttribute}
                            id="createAttribute"
                            form={formCreateAttribute}
                        >
                            {
                                showAttribute !== 0 &&
                                <Spin spinning={attributes.length !== 0 ? false : true}>
                                    <Row gutter={15}>
                                        {attributes.map((attribute) =>
                                            attribute.Type === 1 ?
                                                <Col span={8}>
                                                    <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                        <Input.TextArea
                                                            placeholder={"Nhập " + attribute.Name.toLowerCase()}
                                                            showCount maxLength={attribute.RangeOfValue}
                                                            autoSize={{ minRows: 1, maxRows: 10 }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                :
                                                <Col span={8}>
                                                    <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                        <NumberFormat
                                                            // decimalScale={0}
                                                            allowNegative={false}
                                                            isAllowed={(values) => {
                                                                const { formattedValue, floatValue } = values;
                                                                return formattedValue === "" || floatValue <= attribute.RangeOfValue;
                                                            }}
                                                            placeholder={"Nhập " + attribute.Name.toLowerCase() + " (" + attribute.Measure + ")"}
                                                            className="currency"
                                                            displayType="input"
                                                            type="primary"
                                                            suffix={" " + attribute.Measure}
                                                            thousandSeparator={'.'}
                                                            decimalSeparator={','}
                                                            spellCheck="false"
                                                            style={{
                                                                width: '100%',
                                                                border: '1px solid #d9d9d9',
                                                                padding: '4px 11px'

                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                        )}
                                    </Row>
                                </Spin>
                            }
                        </Form>
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div style={{ float: 'right', marginTop: 15 }}> <Button type="primary" onClick={setVisibleCreate} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}>Thêm thuộc tính</Button></div>
                            </Col>
                        </Row>
                    </div>
                )
            }
            const CreateBase = () => {
                const [previewImage, setPreviewImage] = useState('');
                const [previewTitle, setPreviewTitle] = useState('');
                const [fileList, setFileList] = useState([]);
                const [urls, setUrls] = useState([]);
                const [visible, setVisible] = React.useState(false);
                const [brands, setBrands] = useState([]);
                const [models, setModels] = useState([]);
                const [price, setPrice] = useState(0);
                const [visibleCreateModel, setVisibleCreateModel] = React.useState(false);
                const [key, setKey] = useState(null)
                const handleCancelCreateModel = () => {
                    setVisibleCreateModel(false);
                };
                function deleteImage(index) {

                }
                useEffect(() => {
                    BrandService.getAllBrand()
                        .then(res => {
                            setBrands(res.data);
                        })
                        .catch(err => console.log(err))
                }, [])
                const handleCancel = () => {
                    setVisible(false);
                };
                function getBase64(file) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    });
                }
                const handlePreview = async file => {
                    if (!file.url && !file.preview) {
                        file.preview = await getBase64(file.originFileObj);
                    }
                    setVisible(true)
                    setPreviewImage(file.url || file.preview)
                    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
                };
                const handleChange = ({ fileList }) => {
                    setFileList(fileList);
                };
                const customRequest = ({ file, onSuccess, onError }) => {
                    const uploadTask = storage.ref(`images/${file.name}`).put(file);
                    uploadTask.on(
                        "state_changed",
                        snapshot => { },
                        error => {
                            onError(error)
                        },
                        async () => {
                            await storage
                                .ref("images")
                                .child(file.name)
                                .getDownloadURL()
                                .then((urls) => {
                                    onSuccess(setUrls((prevState) => [...prevState, urls]));
                                });
                        }
                    );
                }
                const normFile = (e) => {
                    const stringData = urls.reduce((result, key) => {
                        return `${result}${key}|`
                    }, "")
                    return stringData
                };
                const beforeUpload = (file) => {
                    const isImage = file.type.indexOf('image/') === 0;
                    if (!isImage) {
                        message.error('You can only upload image file!');
                    }
                    const isLt5M = file.size / 1024 / 1024 < 2;
                    if (!isLt5M) {
                        message.error('Image must smaller than 2MB!');
                    }
                    return isImage && isLt5M;
                }
                const uploadButton = (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                    </div>
                );
                const onFinishCreateBase = (values) => {
                    let data = [];
                    data = values.image.split('|')
                    if (data.length > 1) {
                        data.pop();
                    }
                    setImg(data)
                    setBase(values)
                    next()
                    console.log(values)
                }
                const handleBrandChange = (id, key) => {
                    console.log(key.key)
                    setKey(key.key)
                    formCreateBase.setFieldsValue({ carModelId: [], brandName: key.key, carModelName: null })
                    CarService.getCarModelsByBrand(key.key).then((res) => setModels(res.data)).catch((err) => console.log(err))
                }
                const handleModelChange = (id, key) => {
                    console.log(key.key)
                    formCreateBase.setFieldsValue({ carModelId: key.key })
                }
                const onPrice = (e) => {
                    const string = e.target.value;
                    setPrice(string.replace(/\D/g, ''))
                    formCreateBase.setFieldsValue({ price: string.replace(/\D/g, '') })
                }
                const onYear = (date, dateString) => {
                    console.log(dateString);
                    formCreateBase.setFieldsValue({ yearOfManufactor: dateString })
                }
                const CreateCarModelsComponent = () => {
                    const [validate, setValidate] = useState(0);
                    const [carModels, setCarModels] = useState([]);
                    const [form] = Form.useForm();
                    const handleChange = (e) => {
                        var data = e.target.value.toLowerCase();
                        console.log(e.target.value);
                        for (var i = 0; i < carModels.length; i++) {
                            if (data === (carModels[i].toLowerCase())) {
                                form.setFieldsValue({ name: data })
                                setValidate(1)
                                break;
                            } else {
                                setValidate(0)
                            }
                        }
                    };
                    const handleSelectBrand = (id) => {
                        setValidate(0)
                        form.setFieldsValue({ name: null, brandId: id })
                        let data = []
                        CarService.getCarModelsByBrand(id)
                            .then((models) => {
                                models.data.forEach((filter) => {
                                    data.push(filter.Name)
                                })
                                setCarModels(data)
                            })
                            .catch((error) => console.log(error))
                    };
                    const handleAddBrand = () => {
                        console.log('ok')
                        window.location.href = '/thuong-hieu'
                    };
                    const onFinish = (values) => {
                        console.log(values)
                        CarService.createCarModel(values)
                            .then(() => {
                                setVisibleCreateModel(false);
                                CarService.getCarModelsByBrand(key).then((res) => setModels(res.data)).catch((err) => console.log(err))
                                message.success("Tạo mẫu xe thành công")
                            })
                            .catch(() => { message.error("Tạo mẫu xe không thành công") })
                    };
                    useEffect(() => {
                        form.setFieldsValue({
                            brandId: key
                        })
                    },[form])
                    return (
                        <div>
                            <Form
                                layout="vertical"
                                id="createCarModel"
                                onFinish={onFinish}
                                form={form}
                            >
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
                                        onChange={handleSelectBrand}
                                    >
                                        {brands.map(brands => (
                                            <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Tên mẫu xe" name="name" rules={[{ required: true, message: "Tên mẫu xe không được bỏ trống" }]}
                                    help={validate === 1 && "Mẫu xe không được trùng nhau"}
                                    hasFeedback
                                    validateStatus={validate === 1 ? "error" : "success"}
                                >
                                    <Input.TextArea
                                        onChange={handleChange}
                                        placeholder="Nhập tên mẫu xe"
                                        showCount maxLength={100}
                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    )
                }
                console.log(models)
                return (
                    <div>
                        <Modal
                            destroyOnClose={true}
                            title='Tạo mẫu xe'
                            visible={visibleCreateModel}
                            onCancel={handleCancelCreateModel}
                            width={600}
                            footer={[
                                <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                                    <Button onClick={handleCancelCreateModel}>
                                        Hủy
                                    </Button>
                                    <Button type="primary" form="createCarModel" key="submit" htmlType="submit" >
                                        Hoàn tất
                                    </Button>
                                </Row>
                            ]}
                        >
                            <CreateCarModelsComponent />
                        </Modal>
                        <Modal
                            animation={false}
                            visible={visible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishCreateBase}
                            id="createBase"
                            form={formCreateBase}
                        >
                            <Form.Item hidden={true} name="price" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="yearOfManufactor" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="carModelId" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="brandName" ><Input /></Form.Item>
                            <div style={{ paddingBottom: 8, fontSize: 14, fontWeight: '500' }}><span style={{ marginRight: 4, fontSize: 14, color: '#ff4d4f', fontFamily: 'SimSun, sans-serif', lineHeight: 1 }}>*</span>Thêm ảnh</div>
                            <Row>
                                {img.length !== 0 && img.map((object, i) => (
                                    <div style={{ marginRight: 8 }}>
                                        <Tooltip placement="topRight" color="#FF7643" title={<i onClick={() => { deleteImage(i) }} id="btnDelete" class="far fa-trash-alt"> Xóa hình</i>}>
                                            <Image style={{ padding: 8, border: '1px solid #d9d9d9' }} width={104} height={104} key={i} src={object} />
                                        </Tooltip>
                                    </div>
                                ))}
                                <Form.Item
                                    label=""
                                    name="image"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: "" }]}
                                >
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        customRequest={customRequest}
                                        beforeUpload={beforeUpload}
                                        multiple={true}
                                        accept=".png,.jpeg,.jpg"
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Row>
                            <Row gutter={15}>
                                <Col span={8}>
                                    <Spin spinning={brands.length !== 0 ? false : true}>
                                        <Form.Item label="Chọn hãng" name="brand" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                            <Select
                                                showSearch
                                                placeholder="Chọn hãng xe"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onChange={handleBrandChange}
                                            >
                                                {brands.map(brands => (
                                                    <Option key={brands.Id} value={brands.Name}>{brands.Name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Spin>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<div>Chọn mẫu xe <Tag icon={<PlusCircleOutlined />} color="success" onClick={setVisibleCreateModel}>
                                            Thêm mẫu
                                        </Tag></div>}
                                        name="carModelName" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <Select
                                            disabled={models.length !== 0 ? false : true}
                                            showSearch
                                            placeholder="Chọn mẫu xe"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={handleModelChange}
                                        >
                                            {models.map(model => (
                                                <Option key={model.Id} value={model.Name}>{model.Name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Năm sản xuất" name="nam" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <DatePicker onChange={onYear} style={{ width: '100%' }} placeholder="Chọn năm sản xuất" picker="year" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={16}>
                                    <Form.Item label="Tên xe" name="name" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <Input.TextArea
                                            placeholder="Nhập tên xe"
                                            showCount maxLength={200}
                                            autoSize={{ minRows: 1, maxRows: 10 }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={<div>Giá:&nbsp;<span style={{ color: '#8F4068' }}>{numberToWord.DocTienBangChu(price)}</span></div>} name="Gia" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <NumberFormat
                                            allowNegative={false}
                                            decimalScale={0}
                                            onChange={onPrice}
                                            maxLength={20}
                                            placeholder="Nhập giá xe (vnđ)"
                                            className="currency"
                                            displayType="input"
                                            type="primary"
                                            suffix=" vnđ"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            spellCheck="false"
                                            style={{
                                                width: '100%',
                                                border: '1px solid #d9d9d9',
                                                padding: '4px 11px'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div >
                )
            }
            const CreateSub = () => {
                const [subData, setSubData] = useState([])
                const [visibleCreate, setVisibleCreate] = React.useState(false);
                const onFinishCreateSub = (values) => {
                    let attId = []
                    let ref = []
                    let repo = (JSON.stringify(values)).split('",')
                    subData.forEach((filterData) => {
                        ref.push(filterData.Id)
                    })
                    for (let i = 0; i < ref.length; i++) {
                        attId.push({
                            "value": repo[i].replace("{", "").replace('"}', "").replace(ref[i], "").replace('""', '').replace(':"', '').replace('" ', ''),
                            "attributionId": subData[i].Id
                        })
                    }
                    let data = {
                        "generationId": "null",
                        "attributionWithValues": attId
                    }
                    setSub(data)
                    next()
                }
                console.log(sub)
                const handleCancelCreate = () => {
                    setVisibleCreate(false);
                };
                const CreateAttributeModal = () => {
                    let index = 0;
                    const [itemss, setItemss] = useState(['mm', 'kg', 'km/h', 'cc', 'lít'])
                    const [engineCreate, setEngineCreate] = useState([])
                    const [nameItemss, setNameItemss] = useState('')
                    // const [nameItemsCreate, setNameItemsCreate] = useState('')
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
                    // const onNameChangeItemsCreate = (event) => {
                    //     setNameItemsCreate(event.target.value)
                    // };
                    // const addItemsCreate = () => {
                    //     CarService.createEngineType(nameItemsCreate)
                    //         .then(() => {
                    //             CarService.getEngineType().then((result) => { setEngineCreate(result.data) }).catch((error) => console.log(error))
                    //             message.success("Tạo loại thuộc tính thành công")
                    //         })
                    //         .catch(() => { message.error("Tạo loại thuộc tính không thành công") })
                    //     setEngineCreate([...engineCreate, nameItemsCreate || `New item ${index++}`])
                    //     setNameItemsCreate('')
                    // };
                    const onCreateAttributeFinish = (values) => {
                        console.log(values)
                        message.loading("Đang tải...")
                        if (validate === 1) {
                            message.destroy()
                            message.error("Thuộc tính bị trùng nhau")
                        } else {
                            CarService.createAttribute([values])
                                .then(() => {
                                    message.destroy()
                                    setVisibleCreate(false)
                                    CarService.getAttributeByTypeId("0416e0c8-2120-4d3f-8656-5c708d263c04").then((result) => {
                                        // setTypeId(typeId)
                                        setSubData(result.data)
                                    }).catch((error) => console.log(error))
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
                                // form.setFieldsValue({ name: data })
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
                            id="createNewAttributeSub"
                            onFinish={onCreateAttributeFinish}
                            form={formCreate}
                        >
                            <Form.Item label="Tên thuộc tính" name="engineType" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}>
                                <Select
                                    onChange={handleChangeSelectCheckValidate}
                                    placeholder="Chọn loại thuộc tính"
                                    // dropdownRender={menu => (
                                    //     <div>
                                    //         {menu}
                                    //         <Divider style={{ margin: '4px 0' }} />
                                    //         <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    //             <Input style={{ flex: 'auto' }} value={nameItemsCreate} onChange={onNameChangeItemsCreate} />
                                    //             <Button disabled={nameItemsCreate !== '' ? false : true} style={{ marginLeft: '10px' }} onClick={addItemsCreate}>
                                    //                 <PlusOutlined /> Thêm
                                    //             </Button>
                                    //         </div>
                                    //     </div>
                                    // )}
                                >
                                    {engineCreate.length !== 0 && engineCreate.map(item => (
                                        item.Id === '0416e0c8-2120-4d3f-8656-5c708d263c04' && <Option key={item.Id}>{item.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Tên thuộc tính" name="name" rules={[{ required: true, message: "Tên thuộc tính không được bỏ trống" }]}
                                help={validate === 1 && "Thuộc tính không được trùng nhau"}
                                hasFeedback
                                validateStatus={validate === 1 ? "error" : "success"}
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
                                                            min={1} max={1000000000}
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
                useEffect(() => {
                    CarService.getAttributeByTypeId("0416e0c8-2120-4d3f-8656-5c708d263c04").then((res) => { setSubData(res.data) }).catch((err) => { console.log(err) })
                }, [])
                return (
                    <div>
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
                                    <Button type="primary" form="createNewAttributeSub" key="submit" htmlType="submit">
                                        Hoàn tất
                                    </Button>
                                </Row>
                            ]}
                        >
                            <CreateAttributeModal />
                        </Modal>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishCreateSub}
                            id="createSub"
                            form={formCreateSub}
                        >
                            {
                                <Spin spinning={subData.length !== 0 ? false : true}>
                                    <Row gutter={15}>
                                        {subData.map((attribute) =>
                                            attribute.Type === 1 ?
                                                <Col span={8}>
                                                    <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                        <Input.TextArea
                                                            placeholder={"Nhập " + attribute.Name.toLowerCase()}
                                                            showCount maxLength={attribute.RangeOfValue}
                                                            autoSize={{ minRows: 1, maxRows: 10 }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                :
                                                <Col span={8}>
                                                    <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                        <NumberFormat
                                                            // decimalScale={0}
                                                            allowNegative={false}
                                                            isAllowed={(values) => {
                                                                const { formattedValue, floatValue } = values;
                                                                return formattedValue === "" || floatValue <= attribute.RangeOfValue;
                                                            }}
                                                            placeholder={"Nhập " + attribute.Name.toLowerCase() + " (" + attribute.Measure + ")"}
                                                            className="currency"
                                                            displayType="input"
                                                            type="primary"
                                                            suffix={" " + attribute.Measure}
                                                            thousandSeparator={'.'}
                                                            decimalSeparator={','}
                                                            spellCheck="false"
                                                            style={{
                                                                width: '100%',
                                                                border: '1px solid #d9d9d9',
                                                                padding: '4px 11px'

                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                        )}
                                    </Row>
                                </Spin>
                            }
                        </Form>
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div style={{ float: 'right', marginTop: 15 }}> <Button type="primary" onClick={setVisibleCreate} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}>Thêm thuộc tính</Button></div>
                            </Col>
                        </Row>
                    </div>
                )
            }
            const Confirm = () => {
                const [subName, setSubName] = useState([])
                useEffect(() => {
                    CarService.getAttributeByTypeId("0416e0c8-2120-4d3f-8656-5c708d263c04").then((res) => { setSubName(res.data) }).catch((err) => { console.log(err) })
                }, [])
                const data = []
                const subDataPrint = []
                for (let i = 0; i < attributeName.length; i++) {
                    data.push({
                        "name": attributeName.length !== 0 && attributeName[i].Name,
                        "value": attribute.length !== 0 && attribute.attributionWithValues[i].value
                    })
                }
                for (let i = 0; i < subName.length; i++) {
                    subDataPrint.push({
                        "name": subName.length !== 0 && subName[i].Name,
                        "value": sub.length !== 0 && sub.attributionWithValues[i].value
                    })
                }
                return (
                    <div style={{ marginTop: '25px' }}>
                        <Row gutter={15} style={{ marginBottom: 15 }}>
                            <Col span={12} style={{ marginTop: '15px' }}>
                                <Carousel effect="fade">
                                    {img.length !== 0 && img.map((object, i) => {
                                        return (
                                            <div>
                                                <Image preview={false} style={{ display: 'block', margin: 'auto', maxHeight: '300px' }} key={i} src={object} />
                                            </div>)
                                    })}
                                </Carousel>
                            </Col>
                            <Col span={12}>
                                <Descriptions title="Thông số chính" bordered>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Tên xe" span={3}>{base.name}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Mẫu xe" span={3}>{base.carModelName}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Hãng xe" span={3}>{base.brand}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Năm sản xuất" span={3}>{base.yearOfManufactor}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Giá tham khảo" span={3}>
                                        <NumberFormat
                                            value={base.price}
                                            displayType="text"
                                            suffix=" vnđ"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','} /></Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                        <Descriptions title="Thông số cơ bản" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                            {subDataPrint.map((sub) => (
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={sub.name}>{sub.value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                        <Descriptions title="Thông số xe" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                            {data.map((attribute) => (
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={attribute.name}>{attribute.value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    </div >
                )
            }
            const StepSubmit = () => {
                const steps = [
                    {
                        title: 'Thông số chính',
                        content: <CreateBase />,
                    },
                    {
                        title: 'Thông số cơ bản',
                        content: <CreateSub />,
                    },
                    {
                        title: 'Thuộc tính xe',
                        content: <CreateAttribute />,
                    },
                    {
                        title: 'Xác nhận',
                        content: <Confirm />,
                    },
                ];
                const handleSubmit = () => {
                    message.loading("Đang tải...")
                    CarService.createGeneration(base)
                        .then(() => {
                            CarService.getGenerationByCarModel(base.carModelId)
                                .then((result) => {
                                    result.data.forEach((data) => {
                                        if (data.Name === base.name && data.YearOfManufactor.toString() === base.yearOfManufactor) {
                                            var old = JSON.stringify(attribute).replace(/null/g, data.Id)
                                            var news = JSON.parse(old)
                                            var oldSub = JSON.stringify(sub).replace(/null/g, data.Id)
                                            var newsSub = JSON.parse(oldSub)
                                            console.log(newsSub)
                                            CarService.createCarWithAttribute(news)
                                                .then(() => {
                                                    CarService.createCarWithAttribute(newsSub)
                                                        .then(() => {
                                                            message.destroy()
                                                            message.success("Tạo xe thành công")
                                                            setVisibleStep(false)
                                                            CarService.getAllGeneration().then((res) => setGenerations(res.data)).catch((err) => console.log(err))
                                                            BrandService.getAllBrand().then((res) => { setBrands(res.data) }).catch((err) => console.log(err))
                                                        })
                                                        .catch((err) => {
                                                            message.destroy()
                                                            CarService.deleteCarWithAttributesByGenerationId(data.Id).then(() => {
                                                                CarService.deleteCarGeneration(data.Id).then((res) => console.log(res)).catch((err) => console.log(err))
                                                            }).catch(err => console.log(err))
                                                            message.error("Tạo xe không thành công")
                                                            console.log(err)
                                                        })
                                                })
                                                .catch((err) => {
                                                    message.destroy()
                                                    CarService.deleteCarGeneration(data.Id).then((res) => console.log(res)).catch((err) => console.log(err))
                                                    message.error("Tạo xe không thành công")
                                                    console.log(err)
                                                })
                                        }
                                    })
                                })
                        })
                        .catch((err) => {
                            message.destroy()
                            message.error("Tạo xe không thành công")
                            console.log(err)
                        })
                }
                return (
                    <>
                        <Steps current={current} style={{ marginBottom: 15 }}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[current].content}</div>
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div className="steps-action" style={{ marginTop: '15px', float: 'right' }} >
                                    {current > 0 && (
                                        <Button style={{ marginRight: '8px' }} onClick={() => prev()}>
                                            Quay lại
                                        </Button>
                                    )}
                                    {current === 0 && (
                                        <Button type="primary" form="createBase" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === 1 && (
                                        <Button type="primary" form="createSub" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === 2 && (
                                        <Button type="primary" form="createAttribute" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === steps.length - 1 && (
                                        <Button type="primary" onClick={handleSubmit}>
                                            Hoàn tất
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </>
                );
            };
            return (
                <>
                    <div>
                        <Modal
                            destroyOnClose={true}
                            title='Tạo xe mới'
                            visible={visibleStep}
                            onCancel={handleCancelStep}
                            width={1000}
                            footer={false}
                        >
                            <StepSubmit />
                        </Modal>
                        <Button type="primary" shape="round" onClick={showModalStep} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo xe</span></Button>
                    </div>
                </>
            )
        }
        const EditCarComponent = (editInfo) => {
            const { Step } = Steps;
            const [current, setCurrent] = React.useState(0);
            const [base, setBase] = useState([]);
            const [baseData, setBaseData] = useState([]);
            const [sub, setSub] = useState([]);
            const [attribute, setAttribute] = useState([]);
            const [img, setImg] = useState([]);
            const [formUpdateBase] = Form.useForm();
            const [formUpdateAttribute] = Form.useForm();
            const [formUpdateSub] = Form.useForm();
            const [type, setType] = useState('');
            const [engineAttribute, setEngineAttribute] = useState([]);
            const [attributeName, setAttributeName] = useState([]);

            useEffect(() => {
                CarService.getAttributeByTypeId(type).then((result) => setAttributeName(result.data)).catch((error) => console.log(error))
            }, [type])
            useEffect(() => {
                let data = [];
                data = editInfo.editInfo.Image.split('|')
                if (data.length > 1) {
                    data.pop();
                }
                setImg(data)
            }, [editInfo])
            useEffect(() => {
                let dt = []
                base.forEach((data) => {
                    if (data.Attribution.EngineType !== "0416e0c8-2120-4d3f-8656-5c708d263c04") {
                        dt.push(data)
                    }
                })
                setEngineAttribute(dt)
            }, [base])
            const prev = () => {
                setCurrent(current - 1);
            };
            const next = () => {
                setCurrent(current + 1);
            };
            const UpdateBase = () => {
                const [brands, setBrands] = useState([]);
                const [previewImage, setPreviewImage] = useState('');
                const [previewTitle, setPreviewTitle] = useState('');
                const [fileList, setFileList] = useState([]);
                const [urls, setUrls] = useState([]);
                const [visible, setVisible] = React.useState(false);
                const [price, setPrice] = useState(0);

                useEffect(() => {
                    BrandService.getAllBrand()
                        .then(res => {
                            setBrands(res.data);
                        })
                        .catch(err => console.log(err))
                }, [])
                const handleCancel = () => {
                    setVisible(false);
                };
                function deleteImage(index) { }
                function getBase64(file) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    });
                }
                const handlePreview = async file => {
                    if (!file.url && !file.preview) {
                        file.preview = await getBase64(file.originFileObj);
                    }
                    setVisible(true)
                    setPreviewImage(file.url || file.preview)
                    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
                };
                const handleChange = ({ fileList }) => {
                    setFileList(fileList);
                };
                const customRequest = ({ file, onSuccess, onError }) => {
                    const uploadTask = storage.ref(`images/${file.name}`).put(file);
                    uploadTask.on(
                        "state_changed",
                        snapshot => { },
                        error => {
                            onError(error)
                        },
                        async () => {
                            await storage
                                .ref("images")
                                .child(file.name)
                                .getDownloadURL()
                                .then((urls) => {
                                    onSuccess(setUrls((prevState) => [...prevState, urls]));
                                });
                        }
                    );
                }
                const normFile = (e) => {
                    const stringData = urls.reduce((result, key) => {
                        return `${result}${key}|`
                    }, "")
                    return stringData
                };
                const beforeUpload = (file) => {
                    const isImage = file.type.indexOf('image/') === 0;
                    if (!isImage) {
                        message.error('You can only upload image file!');
                    }
                    const isLt5M = file.size / 1024 / 1024 < 2;
                    if (!isLt5M) {
                        message.error('Image must smaller than 2MB!');
                    }
                    return isImage && isLt5M;
                }
                const uploadButton = (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                    </div>
                );
                const onPrice = (e) => {
                    const string = e.target.value;
                    setPrice(string.replace(/\D/g, ''))
                    formUpdateBase.setFieldsValue({ price: string.replace(/\D/g, '') })
                }
                const onYear = (date, dateString) => {
                    console.log(dateString);
                    formUpdateBase.setFieldsValue({ yearOfManufactor: dateString })
                }
                const handleBrandChange = (id, key) => {
                    console.log(key.key)
                    formUpdateBase.setFieldsValue({ carModelId: [], brandName: key.key })
                    CarService.getCarModelsByBrand(key.key).then((res) => setModels(res.data)).catch((err) => console.log(err))
                }
                const onFinishUpdateBase = (values) => {
                    CarService.getCarWithAttributeByGenerationId(values.id).then((res) => setBase(res.data)).catch((err) => console.log(err))
                    setBaseData(values)
                    console.log("ccc: ", values)
                    next()
                }
                const [brandName, setBrandName] = useState('')
                BrandService.getBrandById(editInfo.editInfo.CarModel.BrandId)
                    .then((res) => {
                        setBrandName(res.data.Name)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                formUpdateBase.setFieldsValue({
                    brand: brandName,
                    brandName: editInfo.editInfo.CarModel.BrandId,
                    id: editInfo.editInfo.Id,
                    name: editInfo.editInfo.Name,
                    Gia: editInfo.editInfo.Price,
                    price: editInfo.editInfo.Price,
                    carModelName: editInfo.editInfo.CarModel.Name,
                    image: editInfo.editInfo.Image,
                    nam: moment(editInfo.editInfo.YearOfManufactor, 'yyyy'),
                    yearOfManufactor: editInfo.editInfo.YearOfManufactor,
                    carModelId: editInfo.editInfo.CarModelId
                })
                return (
                    <div>
                        <Modal
                            animation={false}
                            visible={visible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishUpdateBase}
                            id="updateBase"
                            form={formUpdateBase}
                        >
                            <Form.Item hidden={true} name="price" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="yearOfManufactor" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="carModelId" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="brandName" ><Input /></Form.Item>
                            <Form.Item hidden={true} name="id" ><Input /></Form.Item>
                            <div style={{ paddingBottom: 8, fontSize: 14, fontWeight: '500' }}><span style={{ marginRight: 4, fontSize: 14, color: '#ff4d4f', fontFamily: 'SimSun, sans-serif', lineHeight: 1 }}>*</span>Thêm ảnh</div>
                            <Row>
                                {img.length !== 0 && img.map((object, i) => (
                                    <div style={{ marginRight: 8 }}>
                                        <Tooltip placement="topRight" color="#FF7643" title={<i onClick={() => { deleteImage(i) }} id="btnDelete" class="far fa-trash-alt"> Xóa hình</i>}>
                                            <Image style={{ padding: 8, border: '1px solid #d9d9d9' }} width={104} height={104} key={i} src={object} />
                                        </Tooltip>
                                    </div>
                                ))}
                                <Form.Item
                                    label=""
                                    name="image"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: "" }]}
                                >
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        customRequest={customRequest}
                                        beforeUpload={beforeUpload}
                                        multiple={true}
                                        accept=".png,.jpeg,.jpg"
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Row>
                            <Row gutter={15}>
                                <Col span={8}>
                                    <Spin spinning={brands.length !== 0 ? false : true}>
                                        <Form.Item label="Chọn hãng" name="brand" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                            <Select
                                                showSearch
                                                placeholder="Chọn hãng xe"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onChange={handleBrandChange}
                                            >
                                                {brands.map(brands => (
                                                    <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Spin>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={<div>Chọn mẫu xe <Tag icon={<PlusCircleOutlined />} color="success">
                                        Thêm mẫu
                                    </Tag></div>}
                                        name="carModelName" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <Select
                                            disabled={models.length !== 0 ? false : true}
                                            showSearch
                                            placeholder="Chọn mẫu xe"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={handleModelChange}
                                        >
                                            {models.map(model => (
                                                <Option key={model.Id} value={model.Name}>{model.Name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Năm sản xuất" name="nam" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <DatePicker onChange={onYear} style={{ width: '100%' }} placeholder="Chọn năm sản xuất" picker="year" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={16}>
                                    <Form.Item label="Tên xe" name="name" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <Input.TextArea
                                            placeholder="Nhập tên xe"
                                            showCount maxLength={200}
                                            autoSize={{ minRows: 1, maxRows: 10 }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={<div>Giá:&nbsp;<span style={{ color: '#8F4068' }}>{numberToWord.DocTienBangChu(price)}</span></div>} name="Gia" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                        <NumberFormat
                                            allowNegative={false}
                                            decimalScale={0}
                                            onChange={onPrice}
                                            maxLength={20}
                                            placeholder="Nhập giá xe (vnđ)"
                                            className="currency"
                                            displayType="input"
                                            type="primary"
                                            suffix=" vnđ"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            spellCheck="false"
                                            style={{
                                                width: '100%',
                                                border: '1px solid #d9d9d9',
                                                padding: '4px 11px'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div >
                )
            }
            const UpdateSub = () => {
                const [engineBase, setEngineBase] = useState([]);
                const onFinishUpdateSub = (values) => {
                    let attId = []
                    var result = Object.entries(values)
                    result.forEach((res) => {
                        attId.push({
                            "value": res[1],
                            "attributionId": res[0]
                        })
                    })
                    let data = {
                        "generationId": "null",
                        "attributionWithValues": attId
                    }
                    setSub(data)
                    next()
                }
                useEffect(() => {
                    let dt = []
                    base.forEach((data) => {
                        if (data.Attribution.EngineType === "0416e0c8-2120-4d3f-8656-5c708d263c04") {
                            dt.push(data)
                        }
                    })
                    setEngineBase(dt)
                }, [])
                useEffect(() => {
                    let useData = {}
                    // let idV = null
                    // let valueV = null
                    engineBase.map((eb) => (
                        useData = { ...useData, [eb.Attribution.Id]: eb.Value }
                    ))
                    formUpdateSub.setFieldsValue(
                        useData
                    )
                }, [engineBase])
                return (
                    <>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishUpdateSub}
                            id="createSub"
                            form={formUpdateSub}
                        >
                            <Spin spinning={engineBase.length !== 0 ? false : true}>
                                <Row gutter={15}>
                                    {engineBase.map((attribute) =>
                                        attribute.Attribution.Type === 1 ?
                                            <Col span={8}>
                                                <Form.Item label={attribute.Attribution.Name} name={attribute.Attribution.Id}>
                                                    <Input.TextArea
                                                        // defaultValue={attribute.Value}
                                                        placeholder={"Nhập " + attribute.Attribution.Name.toLowerCase()}
                                                        showCount maxLength={attribute.Attribution.RangeOfValue}
                                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            :
                                            <Col span={8}>
                                                <Form.Item label={attribute.Attribution.Name} name={attribute.Attribution.Id} >
                                                    <NumberFormat
                                                        // defaultValue={attribute.Value}
                                                        // decimalScale={0}
                                                        allowNegative={false}
                                                        isAllowed={(values) => {
                                                            const { formattedValue, floatValue } = values;
                                                            return formattedValue === "" || floatValue <= attribute.Attribution.RangeOfValue;
                                                        }}
                                                        placeholder={"Nhập " + attribute.Attribution.Name.toLowerCase() + " (" + attribute.Attribution.Measure + ")"}
                                                        className="currency"
                                                        displayType="input"
                                                        type="primary"
                                                        suffix={" " + attribute.Attribution.Measure}
                                                        thousandSeparator={'.'}
                                                        decimalSeparator={','}
                                                        spellCheck="false"
                                                        style={{
                                                            width: '100%',
                                                            border: '1px solid #d9d9d9',
                                                            padding: '4px 11px'

                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                    )}
                                </Row>
                            </Spin>
                        </Form>
                        {/* <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div style={{ float: 'right', marginTop: 15 }}> <Button type="primary" className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}>Thêm thuộc tính</Button></div>
                            </Col>
                        </Row> */}
                    </>
                )
            }
            const UpdateAttribute = () => {
                const [engine, setEngine] = useState([])
                const [typeId, setTypeId] = useState('');
                useEffect(() => {
                    let data = []
                    CarService.getEngineType()
                        .then((result) => {
                            data = result.data
                            data.shift()
                            setEngine(data)
                        })
                        .catch((error) => console.log(error))
                }, [])
                const onFinishCreateAttribute = (values) => {
                    let attId = []
                    var result = Object.entries(values)

                    result.forEach((res) => {
                        attId.push({
                            "value": res[1],
                            "attributionId": res[0]
                        })
                    })
                    let data = {
                        "generationId": "null",
                        "attributionWithValues": attId
                    }
                    console.log("asd", data)
                    setAttribute(data)
                    setType(engineAttribute[0].Attribution.EngineType)
                    console.log("type: ", typeId)
                    next()
                }
                const handleChangeEngine = (values) => {
                    setTypeId(values)
                    // CarService.getAttributeByTypeId(values).then((result) => setAttributes(result.data)).catch((error) => console.log(error))
                }
                useEffect(() => {
                    let useData = {}
                    // let idV = null
                    // let valueV = null
                    engineAttribute.map((eb) => (
                        useData = { ...useData, [eb.Attribution.Id]: eb.Value }
                    ))
                    formUpdateAttribute.setFieldsValue(
                        useData
                    )
                }, [])
                return (
                    <>
                        <div style={{ marginBottom: 15 }}>
                            <Row type="flex" justify="center">
                                <Spin spinning={engine.length !== 0 ? false : true}>
                                    <Select
                                        style={{ width: '240px', marginRight: 15, marginTop: 2, fontWeight: 'bold', marginBottom: 15 }}
                                        showSearch
                                        placeholder="Chọn loại thuộc tính"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        defaultValue={engineAttribute[0].Attribution.EngineType}
                                        onChange={handleChangeEngine}
                                    >
                                        {engine.map(engine => (
                                            <Option key={engine.Id} value={engine.Id}>{engine.Name}</Option>
                                        ))}
                                    </Select>
                                </Spin>
                            </Row>
                        </div>
                        <Form
                            layout="vertical"
                            className="formCreate"
                            onFinish={onFinishCreateAttribute}
                            id="createAttribute"
                            form={formUpdateAttribute}
                        >
                            <Spin spinning={engineAttribute.length !== 0 ? false : true}>
                                <Row gutter={15}>
                                    {engineAttribute.map((attribute) =>
                                        attribute.Attribution.Type === 1 ?
                                            <Col span={8}>
                                                <Form.Item label={attribute.Attribution.Name} name={attribute.Attribution.Id}>
                                                    <Input.TextArea
                                                        placeholder={"Nhập " + attribute.Attribution.Name.toLowerCase()}
                                                        showCount maxLength={attribute.Attribution.RangeOfValue}
                                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            :
                                            <Col span={8}>
                                                <Form.Item label={attribute.Attribution.Name} name={attribute.Attribution.Id} >
                                                    <NumberFormat
                                                        //  decimalScale={0}
                                                        allowNegative={false}
                                                        isAllowed={(values) => {
                                                            const { formattedValue, floatValue } = values;
                                                            return formattedValue === "" || floatValue <= attribute.Attribution.RangeOfValue;
                                                        }}
                                                        placeholder={"Nhập " + attribute.Attribution.Name.toLowerCase() + " (" + attribute.Attribution.Measure + ")"}
                                                        className="currency"
                                                        displayType="input"
                                                        type="primary"
                                                        suffix={" " + attribute.Attribution.Measure}
                                                        thousandSeparator={'.'}
                                                        decimalSeparator={','}
                                                        spellCheck="false"
                                                        style={{
                                                            width: '100%',
                                                            border: '1px solid #d9d9d9',
                                                            padding: '4px 11px'

                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                    )}
                                </Row>
                            </Spin>
                        </Form>
                        {/* <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div style={{ float: 'right', marginTop: 15 }}> <Button type="primary" className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}>Thêm thuộc tính</Button></div>
                            </Col>
                        </Row> */}
                    </>
                )
            }
            const Confirm = () => {
                const [subName, setSubName] = useState([])
                useEffect(() => {
                    CarService.getAttributeByTypeId("0416e0c8-2120-4d3f-8656-5c708d263c04").then((res) => { setSubName(res.data) }).catch((err) => { console.log(err) })
                }, [])
                const data = []
                const subDataPrint = []
                attributeName.forEach((name) => {
                    attribute.attributionWithValues.forEach((s) => {
                        if (name.Id === s.attributionId) {
                            data.push({
                                "name": name.Name,
                                "value": s.value
                            })
                        }
                    })
                })
                subName.forEach((name) => {
                    sub.attributionWithValues.forEach((s) => {
                        if (name.Id === s.attributionId) {
                            subDataPrint.push({
                                "name": name.Name,
                                "value": s.value
                            })
                        }
                    })
                })
                console.log("sub:", sub)
                console.log("att:", attribute)
                console.log("attName: ", attributeName)
                return (
                    <div style={{ marginTop: '25px' }}>
                        <Row gutter={15} style={{ marginBottom: 15 }}>
                            <Col span={12} style={{ marginTop: '15px' }}>
                                <Carousel effect="fade">
                                    {img.length !== 0 && img.map((object, i) => {
                                        return (
                                            <div>
                                                <Image preview={false} style={{ display: 'block', margin: 'auto', maxHeight: '300px' }} key={i} src={object} />
                                            </div>)
                                    })}
                                </Carousel>
                            </Col>
                            <Col span={12}>
                                <Descriptions title="Thông số chính" bordered>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Tên xe" span={3}>{baseData.name}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Mẫu xe" span={3}>{baseData.carModelName}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Hãng xe" span={3}>{baseData.brand}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Năm sản xuất" span={3}>{baseData.yearOfManufactor}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontWeight: '600', width: 150 }} label="Giá tham khảo" span={3}>
                                        <NumberFormat
                                            value={baseData.price}
                                            displayType="text"
                                            suffix=" vnđ"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','} /></Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                        <Descriptions title="Thông số cơ bản" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                            {subDataPrint.map((sub) => (
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={sub.name}>{sub.value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                        <Descriptions title="Thông số xe" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                            {data.map((attribute) => (
                                <Descriptions.Item labelStyle={{ fontWeight: '600', width: '139.24px' }} contentStyle={{ width: '177.14px' }} label={attribute.name}>{attribute.value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    </div >
                )
            }
            const StepSubmit = () => {
                const steps = [
                    {
                        title: 'Thông số chính',
                        content: <UpdateBase />,
                    },
                    {
                        title: 'Thông số cơ bản',
                        content: <UpdateSub />,
                    },
                    {
                        title: 'Thuộc tính xe',
                        content: <UpdateAttribute />,
                    },
                    {
                        title: 'Xác nhận',
                        content: <Confirm />,
                    },
                ];
                const handleSubmit = () => {
                    message.loading("Đang tải...")
                    CarService.updateCarGeneration(baseData.id, baseData)
                        .then(() => {
                            CarService.getGenerationByCarModel(baseData.carModelId)
                                .then((result) => {
                                    result.data.forEach((data) => {
                                        if (data.Name === baseData.name && (data.YearOfManufactor === baseData.yearOfManufactor || data.YearOfManufactor.toString() === baseData.yearOfManufactor)) {
                                            var old = JSON.stringify(attribute).replace(/null/g, data.Id)
                                            var news = JSON.parse(old)
                                            var oldSub = JSON.stringify(sub).replace(/null/g, data.Id)
                                            var newsSub = JSON.parse(oldSub)
                                            console.log(newsSub)
                                            CarService.updateCarWithAttribute(news)
                                                .then(() => {
                                                    CarService.updateCarWithAttribute(newsSub)
                                                        .then(() => {
                                                            message.destroy()
                                                            message.success("Cập nhật xe thành công")
                                                            setVisibleEdit(false)
                                                            CarService.getAllGeneration().then((res) => setGenerations(res.data)).catch((err) => console.log(err))
                                                            BrandService.getAllBrand().then((res) => { setBrands(res.data) }).catch((err) => console.log(err))
                                                        })
                                                        .catch((err) => {
                                                            message.destroy()
                                                            message.error("Cập nhật xe không thành công")
                                                            console.log(err)
                                                        })
                                                })
                                                .catch((err) => {
                                                    message.destroy()
                                                    message.error("Cập nhật xe không thành công")
                                                    console.log(err)
                                                })
                                        } else {
                                            message.destroy()
                                            message.error("Cập nhật xe không thành công")
                                        }
                                    })
                                })
                                .catch((err) => {
                                    message.destroy()
                                    message.error("Cập nhật xe không thành công")
                                    console.log(err)
                                })
                        })
                        .catch((err) => {
                            message.destroy()
                            message.error("Cập nhật xe không thành công")
                            console.log(err)
                        })
                }
                return (
                    <>
                        <Steps current={current} style={{ marginBottom: 15 }}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[current].content}</div>
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <div className="steps-action" style={{ marginTop: '15px', float: 'right' }} >
                                    {current > 0 && (
                                        <Button style={{ marginRight: '8px' }} onClick={() => prev()}>
                                            Quay lại
                                        </Button>
                                    )}
                                    {current === 0 && (
                                        <Button type="primary" form="updateBase" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === 1 && (
                                        <Button type="primary" form="createSub" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === 2 && (
                                        <Button type="primary" form="createAttribute" key="submit" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    )}
                                    {current === steps.length - 1 && (
                                        <Button type="primary" onClick={handleSubmit}>
                                            Hoàn tất
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </>
                );
            };
            console.log(editInfo)
            return (
                <>
                    <StepSubmit />
                </>
            )
        }
        const search = value => {
            setBrandValue(null)
            setModelValue(null)
            console.log("PASS", { value });
            const filterTable = generations.filter(o =>
                // Object.keys(o).some(k =>
                //     String(o[k])
                o.Name
                    .toLowerCase()
                    .includes(value.toLowerCase())
                // )
            );
            setFilterTable(filterTable)
        }
        return (
            <>
                <CreateCarComponent />
                <Modal
                    destroyOnClose={true}
                    title='Chỉnh sửa xe'
                    visible={visibleEdit}
                    onCancel={handleCancelEdit}
                    width={1000}
                    footer={false}
                >
                    <EditCarComponent editInfo={editInfo} />
                </Modal>
                <Modal
                    destroyOnClose={true}
                    title='Xem chi tiết xe'
                    visible={visibleCarDetail}
                    onCancel={handleCancelCarDetail}
                    width={1000}
                    footer={false}
                >
                    <ViewCarDetail />
                </Modal>
                <div>
                    <Select
                        style={{ width: '180px', marginBottom: 5, marginRight: 8 }}
                        showSearch
                        placeholder="Sắp xếp theo hãng"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleSelectBrand}
                        onClear={handleBrandClear}
                        value={brandSelectValue}
                        allowClear
                    >
                        {generations !== null && Array.from(new Set(generations.map(obj => obj.CarModel.BrandId))).map((contest) => (
                            brands.map((brands) => (
                                contest === brands.Id && <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                            ))
                        ))}
                    </Select>
                    <Select
                        style={{ minWidth: 180 }}
                        disabled={models.length !== 0 ? false : true}
                        showSearch
                        placeholder="Chọn mẫu xe"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleModelChange}
                        onClear={handleModelClear}
                        value={modelSelectValue}
                        allowClear
                    >
                        {generations !== null && Array.from(new Set(generations.map(obj => obj.CarModel.Id))).map((contest) => (
                            models.map((model) => (
                                contest === model.Id && <Option key={model.Id} value={model.Id}>{model.Name}</Option>
                            ))
                        ))}
                    </Select>
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                        <Input.Search
                            className="fixAnticon"
                            style={{ marginTop: 1, width: 440 }}
                            placeholder="Tìm kiếm. . ."
                            enterButton
                            onSearch={search}
                            allowClear
                            onClear={handleModelClear}
                        />
                    </div>
                    <Spin spinning={generations ? false : true}>
                        <Table
                            columns={baseColumns}
                            dataSource={filterTable === null ? generations : filterTable}
                            rowKey="IdModel"
                            pagination={{
                                current: pageGeneration,
                                pageSize: pageGenerationSize,
                                onChange: (pageGeneration, pageGenerationSize) => {
                                    setPageGeneration(pageGeneration)
                                    setPageGenerationSize(pageGenerationSize)
                                },
                                pageSizeOptions: ['5', '10', '15', '20'],
                                showSizeChanger: true,
                                locale: { items_per_page: "/ trang" },
                            }}
                        />
                    </Spin>
                </div>
            </>
        )
    }
    return (
        <div>
            <CarsTable />
        </div>
    )
}

export default ManageCarsComponent
