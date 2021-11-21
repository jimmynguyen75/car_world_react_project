import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Image, Input, message, Modal, Row, Select, Tooltip, Upload } from "antd";
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import BrandService from '../../services/BrandService';
import storage from '../../services/ImageFirebase';
import CarService from '../../services/CarService'
export default function EditCarBodyComponent({ record, recordImage }) {
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
    //--------//
    //***
    console.log("record: ", record);
    const onPrice = (price) => {
        console.log("price: ", price)
        form.setFieldsValue({
            price: price === 0 ? record.Price : price
        })
    }
    const onSeat = (seats) => {
        form.setFieldsValue({
            seats: seats === 0 ? record.Seats : seats
        })
    }
    const onLength = (length) => {
        form.setFieldsValue({
            length: length === 0 ? record.Length : length
        })
    }
    const onWidth = (width) => {
        form.setFieldsValue({
            width: width === 0 ? record.Width : width
        })
    }
    const onHeight = (height) => {
        form.setFieldsValue({
            height: height === 0 ? record.Height : height
        })
    }
    const onDisplacement = (displacement) => {
        form.setFieldsValue({
            displacement: displacement === 0 ? record.Displacement : displacement
        })
    }
    const onGroundClearance = (groundClearance) => {
        form.setFieldsValue({
            groundClearance: groundClearance === 0 ? record.GroundClearance : groundClearance
        })
    }
    const onFuelConsumption = (fuelConsumption) => {
        form.setFieldsValue({
            fuelConsumption: fuelConsumption === 0 ? record.FuelConsumption : fuelConsumption
        })
    }
    const onKerbWeight = (kerbWeight) => {
        form.setFieldsValue({
            kerbWeight: kerbWeight === 0 ? record.OnKerbWeight : kerbWeight
        })
    }
    const onFuelCapacity = (fuelCapacity) => {
        form.setFieldsValue({
            fuelCapacity: fuelCapacity === 0 ? record.FuelCapacity : fuelCapacity
        })
    }
    const onWheelSize = (wheelSize) => {
        form.setFieldsValue({
            wheelSize: wheelSize === 0 ? record.WheelSize : wheelSize
        })
    }
    const onYearOfManufactor = (yearOfManufactor) => {
        form.setFieldsValue({
            yearOfManufactor: yearOfManufactor === 0 ? record.YearOfManufactor : yearOfManufactor
        })
    }
    form.setFieldsValue({
        priceWithoutAny: record.Price,
        seatsWithoutAny: record.Seats,
        lengthWithoutAny: record.Length,
        widthWithoutAny: record.Width,
        heightWithoutAny: record.Height,
        displacementWithoutAny: record.Displacement,
        groundClearanceWithoutAny: record.GroundClearance,
        fuelConsumptionWithoutAny: record.FuelConsumption,
        kerbWeightWithoutAny: record.KerbWeight,
        fuelCapacityWithoutAny: record.FuelCapacity,
        wheelSizeWithoutAny: record.WheelSize,
        yearOfManufactorWithoutAny: record.YearOfManufactor,
        yearOfManufactor: record.YearOfManufactor,
        price: record.Price,
        seats: record.Seats,
        length: record.Length,
        width: record.Width,
        height: record.Height,
        displacement: record.Displacement,
        groundClearance: record.GroundClearance,
        fuelConsumption: record.FuelConsumption,
        kerbWeight: record.KerbWeight,
        fuelCapacity: record.FuelCapacity,
        name: record.Name,
        bodyType: record.BodyType,
        brandName: record.Brand.Name,
        gearBox: record.GearBox,
        origin: record.Origin,
        engineType: record.EngineType,
        maxTorque: record.MaxTorque,
        maxPower: record.MaxPower,
        turningRadius: record.TurningRadius,
        tyreSize: record.TyreSize,
        wheelSize: record.WheelSize,
        frontSuspension: record.FrontSuspension,
        rearSuspension: record.RearSuspension,
        tailLights: record.TailLights,
        headLights: record.HeadLights,
        fogLamps: record.FogLamps,
        interiorMaterial: record.InteriorMaterial,
        despcription: record.Despcription,
        image: images,
        createdDate: record.CreatedDate,
        id: record.Id
    })
    //--------//
    const onFinish = (values) => {
        CarService.updateCar(values.id, values)
            .then(() => {
                console.log(values)
                setTimeout(() => {
                    message.success("Cập nhật xe thành công");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/xe'
                }, 1500)
            })
            .catch(err => {
                console.log(err)
                message.error("Lỗi server hoặc tên không được trùng nhau!")
            });
        console.log(values)
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
    function deleteImage(index) {
        setImg(recordImage.splice(index, 1))
    }
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
    useEffect(() => {
        setImg(recordImage)
    }, [recordImage, img])
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
                id="myFormEdit"
                form={form}
            >
                <Form.Item hidden={true} name="id" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="createdDate" >
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name="image">
                    <Input></Input>
                </Form.Item>
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
                    name="image" label="Ảnh xe"
                    rules={[{ required: true, message: "Ảnh xe không được bỏ trống" }]}
                >
                    <Row>
                        {img.map((object, i) => {
                            return (

                                <div style={{ marginRight: 8 }}>
                                    <Tooltip placement="bottomRight" color="#FF7643" title={<i onClick={() => { deleteImage(i) }} id="btnDelete" class="far fa-trash-alt"> Xóa hình</i>}>
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
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                        </div>
                    </Row>
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
                        <Form.Item label="Giá" name="priceWithoutAny" rules={[{ required: true, message: "Giá xe không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onPrice(values.value)
                                }}
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
                        <Form.Item label="Chỗ ngồi" name="seatsWithoutAny" rules={[{ required: true, message: "Chỗ ngồi xe không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onSeat(values.value)
                                }}
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
                        <Form.Item label="Năm sản xuất" name="yearOfManufactorWithoutAny" rules={[{ required: true, message: "Năm sản xuất xe không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onYearOfManufactor(values.value)
                                }}
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
                        <Form.Item label="Chiều dài" name="lengthWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onLength(values.value)
                                }}
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
                        <Form.Item label="Chiều rộng" name="widthWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onWidth(values.value)
                                }}
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
                        <Form.Item label="Chiều cao" name="heightWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onHeight(values.value)
                                }}
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
                        <Form.Item label="Dung tích" name="displacementWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onDisplacement(values.value)
                                }}
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
                        <Form.Item label="Khoảng cách gầm xe" name="groundClearanceWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onGroundClearance(values.value)
                                }}
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
                                allowNegative={false}
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
                        <Form.Item label="Tiêu hao nhiên liệu" name="fuelConsumptionWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onFuelConsumption(values.value)
                                }}
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
                        <Form.Item label="Trọng lượng khô" name="kerbWeightWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onKerbWeight(values.value)
                                }}
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
                        <Form.Item label="Dung tích bình xăng" name="fuelCapacityWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onFuelCapacity(values.value)
                                }}
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
                        <Form.Item label="Kích thước mâm xe" name="wheelSizeWithoutAny" rules={[{ required: true, message: "Không được bỏ trống" }]}>
                            <NumberFormat
                                allowNegative={false}
                                onValueChange={(values) => {
                                    onWheelSize(values.value)
                                }}
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
