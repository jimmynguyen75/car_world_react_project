import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Image, Input, message, Modal, Row, Select, Tooltip, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import './styles.less';
import AccessoryService from '../../services/AccessoryService';
export default function EditAccessoryBodyComponent({ setDataToChild, setDataToChildFixingImage }) {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);
    const { Option } = Select;
    const [img, setImg] = useState([]);
    const [images, setImages] = useState([]);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const onFinish = (values) => {
        AccessoryService
            .updateAccessoryById(values.id, values)
            .then(() => {
                console.log(values)
                setTimeout(() => {
                    message.success("Cập nhật phụ kiện thành công");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/phu-kien'
                }, 1500)
            })
            .catch(err => {
                console.log(err)
                message.error("Lỗi server hoặc tên không được trùng nhau!")
            });
        console.log("Values: ", values)
    }
    const handleCancel = () => {
        setVisible(false)
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
    const onChangePrice = (price) => {
        form.setFieldsValue({
            price: price === 0 ? setDataToChild.Price : price
        })
        // setPrice(string.replace(/\D/g, ''))
    }
    useEffect(() => {
        const stringUrl = urls.reduce((result, key) => {
            return `${result}${key}|`
        }, "")
        const stringData = img.reduce((result, key) => {
            return `${result}${key}|`
        }, "")
        const data = (stringData + stringUrl)
        setImages(data)
    }, [img, urls])
    form.setFieldsValue({
        name: setDataToChild.Name,
        pricewithoutany: setDataToChild.Price,
        description: setDataToChild.Description,
        brandName: setDataToChild.Brand.Name,
        image: images,
        price: setDataToChild.Price,
        id: setDataToChild.Id,
        createdDate: setDataToChild.CreatedDate,
    })
    function deleteImage(index) {
        setImg(setDataToChildFixingImage.splice(index, 1))
    }
    useEffect(() => {
        setImg(setDataToChildFixingImage)
    }, [setDataToChildFixingImage, img])
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
                <Form.Item hidden={true} name="id" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="createdDate" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="price" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="image" >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="Ảnh phụ kiện "
                >
                    <Row>
                        {img.map((object, i) => {
                            return (

                                <div style={{ marginRight: 8 }}>
                                    <Tooltip placement="topRight" color="#FF7643" title={<i onClick={() => { deleteImage(i) }} id="btnDelete" class="far fa-trash-alt"> Xóa hình</i>}>
                                        <Image style={{ padding: 8, border: '1px solid #d9d9d9' }} width={104} height={104} key={i} src={object} />
                                    </Tooltip>
                                </div>

                            )
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
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Tên phụ kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên phụ kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label="Giá" name="pricewithoutany" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    // formattedValue, floatValue
                                    onChangePrice(values.value)
                                }}
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
                                name="brandName"
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
                <Form.Item label="Mô tả chi tiết" name="description" rules={[{ required: true, message: "Mô tả phụ kiện không được bỏ trống" }]}>
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
            </Form>
        </div>
    )
}
