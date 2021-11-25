    import { PlusOutlined } from '@ant-design/icons';
import { Col, ConfigProvider, DatePicker, Form, Image, Input, message, Modal, Row, Tooltip, Upload } from "antd";
import locale from 'antd/es/locale-provider/fr_FR';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import AccountService from '../../services/AccountService';
import ContestService from '../../services/ContestService';
import storage from '../../services/ImageFirebase';
import numberToWord from '../../utils/numberToWord';
export default function CreateBySelectComponent({ record, recordImage }) {
    const [price, setPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [endRegister, setEndRegister] = useState(null);
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
    const [form] = Form.useForm();
    const [img, setImg] = useState([]);
    const [images, setImages] = useState([]);
    const [r, setR] = useState([]);
    const [s, setS] = useState([]);
    //Date --------------------
    function minRegister(value) {
        form.setFieldsValue({
            minParticipants: value
        })
    }
    function maxRegister(value) {
        form.setFieldsValue({
            maxParticipants: value
        })
    }
    function onChangeRegister(value, dateString) {
        const start = moment(dateString[0], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        const end = moment(dateString[1], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        setR([moment(dateString[0], "HH:mm - DD/MM/yyyy"), moment(dateString[1], "HH:mm - DD/MM/yyyy")])
        setEndRegister(end);
        form.setFieldsValue({
            startRegister: start,
            endRegister: end,
        })
    }
    function onChangeDate(value, dateString) {
        const start = moment(dateString[0], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        const end = moment(dateString[1], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        setS([moment(dateString[0], "HH:mm - DD/MM/yyyy"), moment(dateString[1], "HH:mm - DD/MM/yyyy")])
        form.setFieldsValue({
            startDate: start,
            endDate: end
        })
    }
    const { RangePicker } = DatePicker;
    //End ----------------------------------
    //Upload Image -----------------------------
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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
        const uploadTask = storage.ref(`events/${file.name}`).put(file);
        uploadTask.on(
            "state_changed",
            snapshot => { },
            error => {
                onError(error)
            },
            async () => {
                await storage
                    .ref("events")
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
    function deleteImage(index) {
        setImg(recordImage.splice(index, 1))
    }
    //End -----------------------------
    //Effect -----------------------------
    useEffect(() => {
        setR([moment(record.StartRegister, "yyyy-MM-DDTHH:mm:ss"), moment(record.EndRegister, "yyyy-MM-DDTHH:mm:ss")])
        setS([moment(record.StartDate, "yyyy-MM-DDTHH:mm:ss"), moment(record.EndDate, "yyyy-MM-DDTHH:mm:ss")])
        form.setFieldsValue({
            startRegister: record.StartRegister,
            endRegister: record.EndRegister,
            startDate: record.StartDate,
            endDate: record.EndDate,
        })
    }, [record, form])
    form.setFieldsValue({
        image: images,
    })
    useEffect(() => {
        form.setFieldsValue({
            title: record.Title,
            description: record.Description,
            venue: record.Venue,
            proposalId: record.Id,
            modifiedBy: null,
            createdBy: AccountService.getCurrentUser().Id,
            min: record.MinParticipants,
            max: record.MaxParticipants,
            createdDate: record.CreatedDate,
            currentParticipants: record.CurrentParticipants,
            //fake           
        })
    }, [form, record])
    useEffect(() => {
        form.setFieldsValue({
            registerFAKE: (moment(r[0], "yyyy-MM-DDTHH:mm:ss")._isValid) === false ? null : r,
            startFAKE: (moment(s[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : s,
        })
    }, [r, s, form])
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
    //End -----------------------------
    const onFinish = (values) => {
        console.log(values);
        ContestService.createNewContest(values)
            .then((result) => {
                console.log(result);
                setTimeout(() => {
                    message.success("Cập nhật thành công")
                }, 500)
                setTimeout(() => {
                    window.location.href = '/cuoc-thi'
                }, 1000)
            })
            .catch((err) => {
                console.log(err);
                message.error('Cập nhật không thành công')
            })
    }
    function disabledDateR(current) {
        return current && current < moment().subtract(1, 'days').endOf('day');
    }
    function disabledDateS(current) {
        return current && current < moment(endRegister, "yyyy-MM-DDTHH:mm:ss");
    }
    function range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    function disabledRangeTimeR(_, type) {
        if ((_ !== null && moment(_._d).format('DD')) === (moment().format('DD'))) {
            if (type === 'start') {
                return {
                    disabledHours: () => range(0, 60).splice(0, moment().format('H')),
                    disabledMinutes: () => range(0, 60).splice(0, moment(_._d).format('HH') === moment().format('HH') ? moment().format('mm') : 0),
                    disabledSeconds: () => [55, 56],
                };
            }
        }
        if ((_ !== null && moment(_._d).format('DD')) === (moment().format('DD'))) {
            if (type === 'end') {
                return {
                    disabledHours: () => range(0, 60).splice(0, moment().format('H')),
                    disabledMinutes: () => range(0, 60).splice(0, moment(_._d).format('HH') === moment().format('HH') ? moment().format('mm') : 0),
                    disabledSeconds: () => [55, 56],
                };
            }
        }
    }
    function disabledRangeTimeS(_, type) {
        if ((_ !== null && moment(_._d).format('DD')) === (moment(endRegister).format('DD'))) {
            if (type === 'start') {
                return {
                    disabledHours: () => range(0, 60).splice(0, moment(endRegister).format('H')),
                    disabledMinutes: () => range(0, 60).splice(0, moment(endRegister).format('mm')),
                    disabledSeconds: () => [55, 56],
                };
            }
        }
        if ((_ !== null && moment(_._d).format('DD')) === (moment(endRegister).format('DD'))) {
            if (type === 'end') {
                return {
                    disabledHours: () => range(0, 60).splice(0, moment(endRegister).format('H')),
                    disabledMinutes: () => range(0, 60).splice(0, moment(endRegister).format('mm')),
                    disabledSeconds: () => [55, 56],
                };
            }
        }
    }
    const onChangePrice = (e) => {
        const string = e.target.value;
        setPrice(string.replace(/\D/g, ''))
    }
    form.setFieldsValue({
        fee: price
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
            <Form onFinish={onFinish} layout="vertical" id="editEvent" form={form}>
                <Form.Item hidden={true} name="image"><Input></Input></Form.Item>
                <Form.Item hidden={true} name="createdBy"><Input /></Form.Item>
                <Form.Item hidden={true} name="modifiedBy"><Input /></Form.Item>
                <Form.Item hidden={true} name="proposalId"><Input /></Form.Item>
                <Form.Item hidden={true} name="startDate"><Input /></Form.Item>
                <Form.Item hidden={true} name="endDate"><Input /></Form.Item>
                <Form.Item hidden={true} name="startRegister"><Input /></Form.Item>
                <Form.Item hidden={true} name="endRegister"><Input /></Form.Item>
                <Form.Item hidden={true} name="minParticipants"><Input /></Form.Item>
                <Form.Item hidden={true} name="maxParticipants"><Input /></Form.Item>
                <Form.Item hidden={true} name="currentParticipants"><Input /></Form.Item>
                <Form.Item hidden={true} name="createdDate"><Input /></Form.Item>
                <Form.Item hidden={true} name="fee" ><Input></Input> </Form.Item>
                <Form.Item label={<div><span style={{ color: 'red', fontFamily: 'SimSun, sans-serif' }}>*</span>&nbsp;Ảnh cuộc thi</div>}>
                    <Row>
                        {img.map((object, i) => {
                            return (
                                <div style={{ marginRight: 8 }}>
                                    <Tooltip placement="topRight" color="#FF7643" title={<i onClick={() => { deleteImage(i) }} id="btnDelete" class="far fa-trash-alt"> Xóa hình</i>}>
                                        <Image style={{ padding: 8, border: '1px solid #d9d9d9', objectFit: 'cover' }} width={104} height={104} key={i} src={object} />
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
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item label="Tên cuộc thi" name="title" rules={[{ required: true, message: "Tên cuộc thi không được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên cuộc thi"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<div>Giá:&nbsp;<span style={{ color: '#8F4068' }}>{numberToWord.DocTienBangChu(price)}</span></div>} name="Giá" >
                            <NumberFormat
                                allowNegative={false}
                                decimalScale={0}
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
                </Row>
                <Row gutter={15}>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <Form.Item name="registerFAKE" label={<div>Ngày bắt đầu <span style={{ color: 'red' }}>ĐĂNG KÝ</span> và kết thúc</div>} rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                                <RangePicker
                                    //value={(moment(r[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : r}
                                    style={{ width: '100%' }}
                                    placeholder={['Ngày bắt đầu đăng ký', 'Ngày kết thúc đăng ký']}
                                    format={"HH:mm - DD/MM/yyyy"}
                                    disabledDate={disabledDateR}
                                    disabledTime={disabledRangeTimeR}
                                    onChange={onChangeRegister}
                                    showTime
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </Col>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <Form.Item name="startFAKE" label={<div>Ngày bắt đầu <span style={{ color: 'green' }}>cuộc thi</span> và kết thúc</div>} rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                                <RangePicker
                                    //value={(moment(s[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : s}
                                    style={{ width: '100%' }}
                                    placeholder={['Ngày bắt đầu cuộc thi', 'Ngày kết thúc cuộc thi']}
                                    format={"HH:mm - DD/MM/yyyy"}
                                    disabledDate={disabledDateS}
                                    disabledTime={disabledRangeTimeS}
                                    onChange={onChangeDate}
                                    showTime
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item label="Tối thiểu người đăng ký" name="min" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                            <NumberFormat
                                allowNegative={false}
                                decimalScale={0}
                                onValueChange={(values) => {
                                    minRegister(values.value)
                                }}
                                maxLength={20}
                                placeholder="Nhập số lượng tối thiểu"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" người"
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
                        <Form.Item label="Tối đa người đăng ký" name="max" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                            <NumberFormat
                                allowNegative={false}
                                decimalScale={0}
                                onValueChange={(values) => {
                                    maxRegister(values.value)
                                }}
                                maxLength={20}
                                placeholder="Nhập số lượng tối đa"
                                className="currency"
                                displayType="input"
                                type="primary"
                                suffix=" người"
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
                        <Form.Item label="Địa chỉ tổ chức" name="venue" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên cuộc thi"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Mô tả cuộc thi" name="description" rules={[{ required: true, message: "Vui lòng nhập lại" }]}>
                    <Input.TextArea
                        placeholder="Mô tả cuộc thi"
                        showCount maxLength={2000}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div >
    )
}
