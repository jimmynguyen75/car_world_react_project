import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Row, Select, Upload, Tag } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import AccessoryService from '../../services/AccessoryService';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import numberToWord from '../../utils/numberToWord';
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
    const handleAddBrand = () => {
        console.log('ok')
        window.location.href = '/thuong-hieu'
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );
    const onFinish = (values) => {
        console.log("values", values);
        AccessoryService.createNewAccessory(values)
            .then((finish) => {
                console.log(finish)
                message.success("Tạo phụ kiện thành công");
                setTimeout(() => {
                    window.location.href = '/phu-kien'
                }, 500)
            })
            .catch((err) => {
                message.error("Tạo không thành công")
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
        BrandService.getAllBrand()
            .then(car => {
                BrandService.getAllAccessoriesBrand()
                    .then(acc => {
                        setBrands([...car.data, ...acc.data])
                    }).catch(err => console.log(err))
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
                        {fileList.length >= 3 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item label="Tên phụ kiện" name="name" rules={[{ required: true, message: "Tên phụ kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên phụ kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>

                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label={<div>Giá:&nbsp;<span style={{ color: '#8F4068' }}>{numberToWord.DocTienBangChu(price)}</span></div>} name="Giá" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                            <NumberFormat
                                decimalScale={0}
                                allowNegative={false}
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
                        <Form.Item label={<div>Hãng phụ kiện <Tag icon={<PlusCircleOutlined />} onClick={handleAddBrand} color="processing">
                            Thêm hãng
                        </Tag></div>} name="brandId" rules={[{ required: true, message: "Hãng phụ kiện không được bỏ trống" }]}>
                            <Select
                                showSearch
                                placeholder="Chọn hãng phụ kiện"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {brands.map(brands => (
                                    <Option key={brands.Id} value={brands.Id}>
                                        {brands.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Avatar alt="" style={{ width: 'auto', height: 'auto', maxHeight: '25px', maxWidth: '25px' }} src={brands.Image}></Avatar> & nbsp;&nbsp; */}

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
