import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Row, Select, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import CarService from '../../services/CarService'
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
    const [fuelConsumption, setOnFuelConsumption] = useState(0);
    const [kerbWeight, setOnKerbWeight] = useState(0);
    const [fuelCapacity, setFuelCapacity] = useState(0);
    const [wheelSize, setWheelSize] = useState(0);
    const [yearOfManufactor, setYearOfManufactor] = useState(0);
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
    const onWheelSize = (e) => {
        const string = e.target.value;
        setWheelSize(string.replace(/\D/g, ''))
    }
    const onYearOfManuFactor = (e) => {
        const string = e.target.value;
        setYearOfManufactor(string.replace(/\D/g, ''))
    }
    form.setFieldsValue({
        price: price,
        seats: seats,
        length: length,
        height: height,
        width: width,
        displacement: displacement,
        groundClearance: groundClearance,
        fuelConsumption: fuelConsumption,
        kerbWeight: kerbWeight,
        fuelCapacity: fuelCapacity,
        wheelSize: wheelSize,
        yearOfManufactor: yearOfManufactor,
    })
    //--------//
    const onFinish = (values) => {
        CarService.createNewCar(values)
            .then(() => {
                console.log(values)
                setTimeout(() => {
                    message.success("Tạo xe thành công");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/quan-ly/xe'
                }, 1500)
            })
            .catch(err => {
                console.log(err)
                message.error("Lỗi server hoặc tên không được trùng nhau!")
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
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    useEffect(() => {
        let result = []
        BrandService.getAllBrand()
            .then(res => {
                res.data.forEach(data => {
                    if (data.IsDeleted === false) {
                        result.push(data)
                    }
                })
                console.log(result)
                setBrands(result);
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
                <Form.Item hidden={true} name="fuelConsumption" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="kerbWeight" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="fuelCapacity" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="wheelSize" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="yearOfManufactor" >
                    <Input></Input>
                </Form.Item>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Thông số chính</div>
                <Form.Item
                    name="image" label="Ảnh phụ kiện"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Ảnh xe không được bỏ trống" }]}
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
                <Form.Item label="Tên xe" name="name" rules={[{ required: true, message: "Tên xe không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên xe"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Form.Item label="Kiểu dáng" name="bodyType" rules={[{ required: true, message: "Kiểu dáng xe không được bỏ trống" }]}>
                    <Input.TextArea placeholder="Nhập kiểu dáng xe"
                        showCount maxLength={50}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={8}>
                        <Form.Item label="Hãng xe" name="brandName" rules={[{ required: true, message: "Hãng xe không được bỏ trống" }]}>
                            <Select
                                showSearch
                                placeholder="Chọn hãng xe"
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
                    <Col span={8}>
                        <Form.Item label="Giá" name="Giá" rules={[{ required: true, message: "Giá xe không được bỏ trống" }]}>
                            <NumberFormat
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
                    <Col span={8}>
                        <Form.Item label="Hộp số" name="gearBox" rules={[{ required: true, message: "Hộp số xe không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập hộp số"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={8}>
                        <Form.Item label="Chỗ ngồi" name="ngoi" rules={[{ required: true, message: "Chỗ ngồi xe không được bỏ trống" }]}>
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
                        <Form.Item label="Năm sản xuất" name="yearOf" rules={[{ required: true, message: "Năm sản xuất xe không được bỏ trống" }]}>
                            <NumberFormat
                                onChange={onYearOfManuFactor}
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
                        <Form.Item label="Xuất xứ" name="origin" rules={[{ required: true, message: "Xuất xứ xe không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập xuất xứ"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Thông số cơ bản</div>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Chiều dài" name="dai" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Chiều rộng" name="rong" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Chiều cao" name="cao" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Dung tích" name="Dung tích" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Động cơ" name="engineType" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập động cơ xe"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Công suất cực đại" name="maxPower" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập công xuất cực đại (Hp)"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Mô-men xoắn cực đại" name="maxTorque" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập mô-men xoắn cực đại"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Khoảng cách gầm xe" name="kho" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Bán kính quay xe" name="turningRadius" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
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
                        <Form.Item label="Tiêu hao nhiên liệu" name="nhien" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                onChange={onFuelConsumption}
                                maxLength={14}
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
                        <Form.Item label="Trọng lượng khô" name="tr" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Dung tích bình xăng" name="dung" rules={[{ required: true, message: "Không được bỏ trống" }]}>
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
                        <Form.Item label="Kích thước mâm xe" name="wheel" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                onChange={onWheelSize}
                                maxLength={10}
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
                        <Form.Item label="Thông số lốp" name="tyreSize" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập thông số lốp"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Hệ thống treo trước" name="frontSuspension" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập hệ thống treo trước"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Hệ thống treo sau" name="rearSuspension" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập hệ thống treo sau"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Nội thất và ngoại thất</div>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Chất liệu nội thất" name="interiorMaterial" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập chất liệu nội thất"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Cụm đèn trước" name="headLights" rules={[{ required: true, message: "Đèn không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập cụm đèn trước"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Cụm đèn sau" name="tailLights" rules={[{ required: true, message: "Đèn không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập cụm đèn sau"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Đèn sương mù" name="fogLamps" rules={[{ required: true, message: "Đèn không được bỏ trống" }]}>
                            <Input.TextArea placeholder="Nhập đèn sương mù"
                                showCount maxLength={50}
                                autoSize={{ minRows: 1, maxRows: 10 }} />
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
                <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Mô tả</div>
                <Form.Item name="despcription">
                    <Input.TextArea
                        size="large"
                        maxLength={2000} showCount
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
