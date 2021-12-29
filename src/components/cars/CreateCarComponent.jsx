import React, { useEffect, useState } from 'react'
import { Button, Modal, Row, Steps, message, Col, Form, Upload, Select, Input, Spin } from 'antd';
import { ExclamationCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import storage from '../../services/ImageFirebase';
import BrandService from '../../services/BrandService';
import CarService from '../../services/CarService';
import numberToWord from '../../utils/numberToWord';
import NumberFormat from 'react-number-format';

function CreateCarComponent() {
    const { Step } = Steps;
    const [visibleStep, setVisibleStep] = React.useState(false);
    const { Option } = Select;
    const [current, setCurrent] = React.useState(0);
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
        const [formCreateAttribute] = Form.useForm();
        const [attributes, setAttributes] = useState([])
        const [showAttribute, setShowAttribute] = useState(0)

        useEffect(() => {
            CarService.getEngineType()
                .then((result) => {
                    setEngine(result.data)
                })
                .catch((error) => console.log(error))
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
                    // "value": repo[i].replace("/[{}]/g", "").replace(ref[i], "").replace('""', '').replace(':"', '').replace('" ', '')
                })
            }
            let data = {
                "generationId": "16d21ff8-ca55-4a88-99e1-51ab26dd94b2",
                "attributionWithValues": attId
            }
            console.log(data)
            CarService.createCarWithAttribute(data)
                .then(() => { message.success("Tạo thành công") })
                .catch(err => { console.log(err) })
        }
        const handleChangeEngine = (values) => {
            setShowAttribute(1)
            CarService.getAttributeByTypeId(values).then((result) => setAttributes(result.data)).catch((error) => console.log(error))
        }
        console.log(attributes.length !== 0 && attributes[0].Id)
        return (
            <div>
                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                    <Spin spinning={engine.length !== 0 ? false : true}>
                        <Select
                            style={{ width: '240px' }}
                            showSearch
                            placeholder="Chọn động cơ"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleChangeEngine}
                        >
                            {engine.map(engine => (
                                <Option key={engine.Id} value={engine.Id}>{engine.Name}</Option>
                            ))}
                        </Select>
                    </Spin>
                </div>
                <Form
                    layout="vertical"
                    className="formCreate"
                    name="cc"
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
                                            {/* <Form.Item label={attribute.Name} name={[attribute.Id, 'attributionId']}><input type="text" size="32" placeholder="1000" name="fee" /></Form.Item> */}
                                            <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                <Input.TextArea
                                                    placeholder={"Nhập " + attribute.Name}
                                                    showCount maxLength={200}
                                                    autoSize={{ minRows: 1, maxRows: 10 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        :
                                        <Col span={8}>
                                            {/* <Form.Item hidden={true} name={[attribute.Id, 'attributionId']}><Input defaultValue={attribute.Id} /></Form.Item> */}
                                            <Form.Item label={attribute.Name} name={attribute.Id} rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                                <NumberFormat
                                                    decimalScale={0}
                                                    allowNegative={false}
                                                    // onChange={onLength}
                                                    maxLength={9}
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
            </div>
        )
    }
    const CreateBase = () => {
        const [formCreateBase] = Form.useForm();
        const [previewImage, setPreviewImage] = useState('');
        const [previewTitle, setPreviewTitle] = useState('');
        const [fileList, setFileList] = useState([]);
        const [urls, setUrls] = useState([]);
        const [visible, setVisible] = React.useState(false);
        const [brands, setBrands] = useState([]);
        const [models, setModels] = useState([]);
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
            console.log(values)
            // CarService.createGeneration(values)
            // .then(() => next())
            // .catch(() => message.error("Vui lòng kiểm tra lại"))
        }
        const handleBrandChange = (value) => {
            console.log(value)
            formCreateBase.setFieldsValue({ carModelId: [] })
            CarService.getCarModelsByBrand(value).then((res) => setModels(res.data)).catch((err) => console.log(err))
        }
        const onPrice = (e) => {
            const string = e.target.value;
            setPrice(string.replace(/\D/g, ''))
            formCreateBase.setFieldsValue({ price: string.replace(/\D/g, '') })
        }
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
                    onFinish={onFinishCreateBase}
                    id="createBase"
                    form={formCreateBase}
                >
                    <Form.Item hidden={true} name="price" >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        name="image" label="Ảnh xe"
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
                    <Row gutter={15}>
                        <Col span={8}>
                            <Form.Item label="Chọn hãng" name="brandName" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                <Spin spinning={brands.length !== 0 ? false : true}>
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
                                </Spin>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Chọn mẫu xe" name="carModelId" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                <Select
                                    disabled={models.length !== 0 ? false : true}
                                    showSearch
                                    placeholder="Chọn mẫu xe"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                // onChange={handleBrandChange}
                                >
                                    {models.map(model => (
                                        <Option key={model.Id} value={model.Id}>{model.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Năm sản xuất" name="yearOfManufactor" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
                                <Input.TextArea
                                    placeholder="Chọn năm sản xuất"
                                    showCount maxLength={200}
                                    autoSize={{ minRows: 1, maxRows: 10 }}
                                />
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
                            <Form.Item label={<div>Giá:&nbsp;<span style={{ color: '#8F4068' }}>{numberToWord.DocTienBangChu(price)}</span></div>} name="Giá" rules={[{ required: true, message: "Vui lòng nhập lại!" }]}>
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
            </div>
        )
    }
    const StepSubmit = () => {
        const steps = [
            {
                title: 'Thông số cơ bản',
                content: <CreateBase />,
            },
            {
                title: 'Thuộc tính xe',
                content: <CreateAttribute />,
            },
            {
                title: 'Xác nhận',
                content: 'Last-content',
            },
        ];
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
                                <Button onClick={() => next()} type="primary" form="createBase" key="submit" htmlType="submit">
                                    Tiếp tục
                                </Button>
                            )}
                            {current === 1 && (
                                <Button type="primary" form="createAttribute" key="submit" htmlType="submit">
                                    Tiếp tục
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => message.success('Processing complete!')}>
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
        <div>
            <Modal
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
    )
}

export default CreateCarComponent
