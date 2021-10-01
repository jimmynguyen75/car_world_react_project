import { Form, Modal, Upload, Image, message, Row, Tooltip, Input, ConfigProvider, DatePicker, Col } from "antd";
import React, { useState, useEffect } from 'react';
import storage from '../../services/ImageFirebase';
import { PlusOutlined } from '@ant-design/icons';
import locale from 'antd/es/locale-provider/fr_FR';
import 'moment/locale/vi';
import moment from 'moment';
import AccountService from '../../services/AccountService'
import NumberFormat from 'react-number-format';
import EventService from "../../services/EventService";
export default function CreateBySelectComponent({ record, recordImage }) {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
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
            proposalId: null,
            modifiedBy: null,
            createdBy: AccountService.getCurrentUser().Id,
            min: record.MinParticipants,
            max: record.MaxParticipants,
            id: record.Id,
            createdDate: record.CreatedDate,
            currentParticipants: record.CurrentParticipants,
            //fake           
        })
    }, [form, record])
    useEffect(() => {
        form.setFieldsValue({
            registerFAKE: (moment(r[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : r,
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
        EventService.updateEvent(values.id, values)
            .then((result) => {
                console.log(result);
                setTimeout(() => {
                    message.success("Cập nhật thành công")
                }, 500)
                setTimeout(() => {
                    window.location.href = '/su-kien'
                }, 1000)
            })
            .catch((err) => {
                console.log(err);
                message.error('Cập nhật không thành công')
            })
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
            <Form onFinish={onFinish} layout="vertical" id="editEvent" form={form}>
                <Form.Item hidden={true} name="id"><Input></Input></Form.Item>
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
                <Form.Item label={<div><span style={{ color: 'red', fontFamily: 'SimSun, sans-serif' }}>*</span>&nbsp;Ảnh sự kiện</div>}>
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
                <Form.Item label="Tên sự kiện" name="title" rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                    <Input />
                </Form.Item>
                <Row gutter={15}>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <Form.Item name="registerFAKE" label={<div>Ngày bắt đầu <span style={{ color: 'red' }}>ĐĂNG KÝ</span> và kết thúc</div>} rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                                <RangePicker
                                    //value={(moment(r[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : r}
                                    style={{ width: '100%' }}
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
                            <Form.Item name="startFAKE" label={<div>Ngày bắt đầu <span style={{ color: 'green' }}>SỰ KIỆN</span> và kết thúc</div>} rules={[{ required: true, message: "Ngày không được bỏ trống" }]}>
                                <RangePicker
                                    //value={(moment(s[0], "yyyy-MM-DDTHH:mm:ss")._i) === "" ? null : s}
                                    style={{ width: '100%' }}
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
                        <Form.Item label="Tối thiểu người đăng ký" name="min" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <NumberFormat
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
                        <Form.Item label="Tối đa người đăng ký" name="max" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <NumberFormat
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
                        <Form.Item label="Địa chỉ tổ chức" name="venue" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                            <Input.TextArea
                                placeholder="Nhập tên sự kiện"
                                showCount maxLength={200}
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Mô tả sự kiện" name="description" rules={[{ required: true, message: "Tên sự kiện không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Mô tả sự kiện"
                        showCount maxLength={2000}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div >
    )
}