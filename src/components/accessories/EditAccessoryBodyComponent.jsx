import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Image, Input, message, Modal, Row, Select, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import './styles.less';
export default function EditAccessoryBodyComponent({ setDataToChild, setDataToChildFixingImage }) {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [setUrls] = useState([]);
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);
    const { Option } = Select;
    const [price, setPrice] = useState(0);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const onFinish = (values) => {
        // AccessoryService
        //     .createNewAccessory(values)
        //     .then(() => console.log("ok"))
        //     .catch(err => console.log(err));
        console.log("Values: ", values)
    }
    const handleCancel = () => setVisible(false);
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
        const stringData = setDataToChildFixingImage.reduce((result, key) => {
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
    useEffect(() => {
        BrandService.getAllAccessoriesBrand().then(res => {
            setBrands(res.data)
        }).catch(err => console.log(err))
    }, [])
    const onChangePrice = (e) => {
        const string = e.target.value;
        setPrice(string.replace(/\D/g, ''))

    }

    form.setFieldsValue({
        name: setDataToChild.Name,
        pricewithoutany: setDataToChild.Price,
        description: setDataToChild.Description,
    })
    form.setFieldsValue({
        price: price
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
                onFinish={onFinish}
                id="myForm"
                form={form}
            >
                <Form.Item hidden={true} name="price" >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="Ảnh phụ kiện"
                    name="image"
                    getValueFromEvent={normFile}
                >
                    <Row>
                        {setDataToChildFixingImage.map((object, i) => {
                            return <div style={{ marginRight: 8 }}><Image style={{ padding: 8, border: '1px solid #d9d9d9' }} width={104} key={i} src={object} /></div>
                        })}
                        <div>
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
                                {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                        </div>
                    </Row>
                </Form.Item>
                <Form.Item label="Name" name="name">
                    <Input placeholder="Nhập tên phụ kiện" />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label="Giá" name="pricewithoutany">
                            <NumberFormat
                                onChange={onChangePrice}
                                placeholder="Nhập giá phụ kiện (vnđ)"
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
                    <Col span={12}>
                        <Form.Item label="Hãng phụ kiện" name="brandName">
                            <Select
                                defaultValue={setDataToChild.Brand.Name}
                                showSearch
                                placeholder="Chọn hãng phụ kiện"
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
                    </Col>
                </Row>
                <Form.Item label="Mô tả chi tiết" name="description">
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
            </Form>
        </div>
    )
}
