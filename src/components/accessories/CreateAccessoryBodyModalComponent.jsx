import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Row, Select, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import AccessoryService from '../../services/AccessoryService';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import './styles.less';
export default function CreateAccessoryBodyModalComponent() {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
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
        console.log("values", values);
        AccessoryService.createNewAccessory(values)
            .then((finish) => {
                console.log(finish)
                setTimeout(() => {               
                    message.success("Tạo phụ kiện thành công");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/phu-kien'
                }, 1500)
            })
            .catch((err) => {
                message.error("Lỗi server hoặc tên không được trùng nhau!")
                console.log(err)
            });
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
        const stringData = urls.reduce((result, key) => {
            return `${result}${key}|`
        }, "")
        console.log("oooo: ", stringData)
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
        let result = []
        BrandService.getAllAccessoriesBrand()
            .then(res => {
                res.data.forEach(data => {
                    if (data.IsDeleted === false) {
                        result.push(data)
                    }
                })
                setBrands(result)
            }).catch(err => console.log(err))
    }, [])
    const onChangePrice = (e) => {
        const string = e.target.value;
        setPrice(string.replace(/\D/g, ''))
    }
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
                    name="image" label="Ảnh phụ kiện"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Ảnh phụ kiện không được bỏ trống" }]}
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
                        {fileList.length >= 3 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Tên phụ kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập phụ kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label="Giá" name="Giá" rules={[{ required: true, message: "Tiền phụ kiện không được bỏ trống" }]}>
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
                        <Form.Item label="Hãng phụ kiện" name="brandName" rules={[{ required: true, message: "Hãng phụ kiện không được bỏ trống" }]}>
                            <Select
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
                <Form.Item label="Mô tả chi tiết" name="description" rules={[{ required: true, message: "Mô tả phụ kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        size="large"
                        // style={{ fontSize: 16, fontWeight: 600 }}
                        showCount maxLength={1000}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
