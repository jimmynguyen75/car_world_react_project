import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Row, Select, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
export default function CreateCarBodyModalComponent() {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);
    const { Option } = Select;
    //--------//
    const [price, setPrice] = useState(0);
    const [seats, setSeat] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [displacement, setDisplacement] = useState(0);
    const [groundClearance, setGroundClearance] = useState(0);
    const [turningRadius, setOnTurningRadius] = useState(0);
    const [fuelConsumption, setOnFuelConsumption] = useState(0);
    const [kerbWeight, setOnKerbWeight] = useState(0);
    const [fuelCapacity, setFuelCapacity] = useState(0);
    //***
    const onPrice = (e) => {
        const string = e.target.value;
        setPrice(string.replace(/\D/g, ''))
    }
    const onSeat = (e) => {
        const string = e.target.value;
        setSeat(string.replace(/\D/g, ''))
    }
    const onLength = (e) => {
        const string = e.target.value;
        setLength(string.replace(/\D/g, ''))
    }
    const onWidth = (e) => {
        const string = e.target.value;
        setWidth(string.replace(/\D/g, ''))
    }
    const onHeight = (e) => {
        const string = e.target.value;
        setHeight(string.replace(/\D/g, ''))
    }
    const onDisplacement = (e) => {
        const string = e.target.value;
        setDisplacement(string.replace(/\D/g, ''))
    }
    const onGroundClearance = (e) => {
        const string = e.target.value;
        setGroundClearance(string.replace(/\D/g, ''))
    }
    const onTurningRadius = (e) => {
        const string = e.target.value;
        setOnTurningRadius(string.replace(/\D/g, ''))
    }
    const onFuelConsumption = (e) => {
        const string = e.target.value;
        setOnFuelConsumption(string)
    }
    const onKerbWeight = (e) => {
        const string = e.target.value;
        setOnKerbWeight(string.replace(/\D/g, ''))
    }
    const onFuelCapacity = (e) => {
        const string = e.target.value;
        setFuelCapacity(string.replace(/\D/g, ''))
    }
    form.setFieldsValue({
        price: price,
        seats: seats,
        length: length,
        height: height,
        width: width,
        displacement: displacement,
        groundClearance: groundClearance,
        turningRadius: turningRadius,
        fuelConsumption: fuelConsumption,
        kerbWeight: kerbWeight,
        fuelCapacity: fuelCapacity,
    })
    //--------//
    const onFinish = (values) => {
        console.log("values", values);
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
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    useEffect(() => {
        BrandService.getAllBrand()
            .then(res => {
                console.log(res.data)
                setBrands(res.data);
            })
            .catch(err => console.log(err))
    }, [])
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
                <Form.Item hidden={true} name="seats" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="length" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="width" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="height" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="displacement" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="groundClearance" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="turningRadius" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="fuelConsumption" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="kerbWeight" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="fuelCapacity" >
                    <Input></Input>
                </Form.Item>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Thông số chính</div>
                <Form.Item
                    name="image" label="Ảnh phụ kiện"
                    getValueFromEvent={normFile}
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
                <Form.Item label="Tên xe" name="Name">
                    <Input.TextArea
                        placeholder="Nhập tên xe"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={8}>
                        <Form.Item label="Hãng xe" name="Brand">
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
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Giá">
                            <NumberFormat
                                onChange={onPrice}
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
                    <Col span={8}>
                        <Form.Item label="Hộp số" name="gearBox">
                            <Input placeholder="Nhập hộp số" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={8}>
                        <Form.Item label="Chỗ ngồi">
                            <NumberFormat
                                onChange={onSeat}
                                maxLength={6}
                                placeholder="Nhập chỗ ngồi"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" chỗ"
                                spellCheck="false"
                                style={{
                                    width: '100%',
                                    border: '1px solid #d9d9d9',
                                    padding: '4px 11px'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Năm sản xuất" name="yearOfManufactor">
                            <NumberFormat
                                onChange={onLength}
                                maxLength={4}
                                placeholder="Nhập năm sản xuất"
                                className="currency"
                                displayType="input"
                                type="primary"
                                spellCheck="false"
                                style={{
                                    width: '100%',
                                    border: '1px solid #d9d9d9',
                                    padding: '4px 11px'

                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Xuất xứ" name="origin">
                            <Input placeholder="Nhập xuất xứ" />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Thông số cơ bản</div>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Chiều dài">
                            <NumberFormat
                                onChange={onLength}
                                maxLength={9}
                                placeholder="Nhập chiều dài (mm)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" mm"
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
                    <Col span={6}>
                        <Form.Item label="Chiều rộng">
                            <NumberFormat
                                onChange={onWidth}
                                maxLength={9}
                                placeholder="Nhập chiều rộng (mm)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" mm"
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
                    <Col span={6}>
                        <Form.Item label="Chiều cao">
                            <NumberFormat
                                onChange={onHeight}
                                maxLength={9}
                                placeholder="Nhập chiều cao (mm)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" mm"
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
                    <Col span={6}>
                        <Form.Item label="Dung tích">
                            <NumberFormat
                                onChange={onDisplacement}
                                maxLength={9}
                                placeholder="Nhập dung tích (cc)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" cc"
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
                <Row gutter={15}>

                    <Col span={6}>
                        <Form.Item label="Động cơ" name="enginType">
                            <Input placeholder="Nhập động cơ xe" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Công xuất cực đại" name="maxPower">
                            <Input placeholder="Nhập công xuất cực đại (Hp)" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Mô-men xoắn cực đại" name="maxTorque">
                            <Input placeholder="Nhập mô-men xoắn cực đại (Nm)" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Khoảng cách gầm xe">
                            <NumberFormat
                                onChange={onGroundClearance}
                                maxLength={9}
                                placeholder="Nhập khoảng cách gầm xe (mm)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" mm"
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
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Bán kính quay xe">
                            <NumberFormat
                                onChange={onTurningRadius}
                                maxLength={9}
                                placeholder="Nhập bán kính quay (m)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" m"
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
                    <Col span={6}>
                        <Form.Item label="Tiêu hao nhiên liệu">
                            <NumberFormat
                                onChange={onFuelConsumption}
                                maxLength={13}
                                placeholder="Nhập mức tiêu hao nhiên liệu (lít/100km)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" lít/100km"
                                spellCheck="false"
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                style={{
                                    width: '100%',
                                    border: '1px solid #d9d9d9',
                                    padding: '4px 11px'

                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Thông số kĩ thuật</div>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Trọng lượng khô">
                            <NumberFormat
                                onChange={onKerbWeight}
                                maxLength={10}
                                placeholder="Nhập trọng lượng thô (kg)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" kg"
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
                    <Col span={6}>
                        <Form.Item label="Dung tích bình xăng">
                            <NumberFormat
                                onChange={onFuelCapacity}
                                maxLength={7}
                                placeholder="Nhập dung tích bình xăng (lít)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" lít"
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
                    <Col span={6}>
                        <Form.Item label="Kích thước mâm xe" name="wheelSize">
                            <NumberFormat
                                onChange={onFuelCapacity}
                                maxLength={7}
                                placeholder="Nhập kích thước mâm xe (inch)"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" inch"
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
                    <Col span={6}>
                        <Form.Item label="Thông số lốp" name="tyreSize">
                            <Input placeholder="Nhập thông số lốp" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Hệ thống treo trước" name="frontSuspension">
                            <Input placeholder="Nhập hệ thống treo trước" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Hệ thống treo sau" name="rearSuspension">
                            <Input placeholder="Nhập hệ thống treo sau" />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Nội thất và ngoại thất</div>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Chất liệu nội thất" name="interiorMaterial">
                            <Input placeholder="Nhập chất liệu nội thất" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Cụm đèn trước" name="headLights">
                            <Input placeholder="Nhập cụm đèn trước" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Cụm đèn sau" name="tailLights">
                            <Input placeholder="Nhập cụm đèn sau" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Đèn sương mù" name="fogLamps">
                            <Input placeholder="Nhập đèn sương mù" />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Col span={6}>
                    <Form.Item label="Public">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>
                </Col> */}
                <Form.Item label="Mô tả" name="Description">
                    <Input.TextArea
                        size="large"
                        maxLength={1000} showCount
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
