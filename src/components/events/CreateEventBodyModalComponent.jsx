import { Col, ConfigProvider, DatePicker, Form, Input, Row, Modal, Upload, message } from 'antd';
import locale from 'antd/es/locale-provider/fr_FR';
import 'moment/locale/vi';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import storage from '../../services/ImageFirebase';
import './styles.less'
import EventService from '../../services/EventService';
import AccountService from '../../services/AccountService';
export default function CreateEventBodyModalComponent() {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startRegister, setStartRegister] = useState(null);
    const [endRegister, setEndRegister] = useState(null);
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
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
    function onChangeDate(value, dateString) {
        const start = moment(dateString[0], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        const end = moment(dateString[1], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        console.log("startt: ", start)
        console.log("enddd: ", end)
        setStartDate(start);
        setEndDate(end);
    }
    function onChangeRegister(value, dateString) {
        const start = moment(dateString[0], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        const end = moment(dateString[1], 'HH:mm - DD/MM/yyyy').format("yyyy-MM-DDTHH:mm:ss")
        console.log("starttRegister: ", start)
        console.log("endddRegister: ", end)
        setStartRegister(start);
        setEndRegister(end);
    }
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
    form.setFieldsValue({
        startDate: startDate,
        endDate: endDate,
        startRegister: startRegister,
        endRegister: endRegister,
        createdBy: AccountService.getCurrentUser().Id,
        type: 1,
        proposalId: null,
        modifiedBy: null
    })
    const onFinish = (values) => {
        console.log(values)
        EventService.createNewEvent(values)
            .then((result) => {
                console.log(result)
                setTimeout(() => {
                    message.success("Tạo sự kiện thành công");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/su-kien'
                }, 1500)
            })
            .catch((error) => {
                message.error("Lỗi server hoặc tên không được trùng nhau!")
                console.log(error)
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
                id="myEvent"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item hidden={true} name="type"><Input /></Form.Item>
                <Form.Item hidden={true} name="createdBy"><Input /></Form.Item>
                <Form.Item hidden={true} name="modifiedBy"><Input /></Form.Item>
                <Form.Item hidden={true} name="proposalId"><Input /></Form.Item>
                <Form.Item hidden={true} name="startDate"><Input /></Form.Item>
                <Form.Item hidden={true} name="endDate"><Input /></Form.Item>
                <Form.Item hidden={true} name="startRegister"><Input /></Form.Item>
                <Form.Item hidden={true} name="endRegister"><Input /></Form.Item>
                <Form.Item hidden={true} name="minParticipants"><Input /></Form.Item>
                <Form.Item hidden={true} name="maxParticipants"><Input /></Form.Item>

                <Form.Item label="Ảnh sự kiện" name="image"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Đảng tải..." }]}>
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
                <Form.Item label="Tên sự kiện" name="title" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên sự kiện"
                        showCount maxLength={200}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <Form.Item label={<div>Ngày bắt đầu <span style={{ color: 'red' }}>ĐĂNG KÝ</span> và kết thúc</div>} name="dateRegister" rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabledDate={disabledDateR}
                                    disabledTime={disabledRangeTimeR}
                                    placeholder={['Ngày bắt đầu đăng ký', 'Ngày kết thúc đăng ký']}
                                    format={"HH:mm - DD/MM/yyyy"}
                                    onChange={onChangeRegister}
                                    showTime
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </Col>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <Form.Item label={<div>Ngày bắt đầu <span style={{ color: 'green' }}>SỰ KIỆN</span> và kết thúc</div>} name="dateEvent" rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabledDate={disabledDateS}
                                    disabledTime={disabledRangeTimeS}
                                    placeholder={['Ngày bắt đầu sự kiện', 'Ngày kết thúc sự kiện']}
                                    format={"HH:mm - DD/MM/yyyy"}
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
                                onValueChange={(values) => {
                                    minRegister(values.value)
                                }}
                                allowNegative={false}
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
                                onValueChange={(values) => {
                                    maxRegister(values.value)
                                }}
                                allowNegative={false}
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
                        <Form.Item label="Địa chỉ tổ chức" name="venue" rules={[{ required: true, message: "Địa chỉ sự kiện được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Địa chỉ tổ chức"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Mô tả sự kiện" name="description" rules={[{ required: true, message: "Mô tả sự kiện được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Mô tả sự kiện"
                        showCount maxLength={2000}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
