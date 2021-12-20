import { PlusOutlined } from '@ant-design/icons';
import { Form, message, Modal, Upload, Input } from 'antd';
import React, { useState } from 'react';
import storage from '../../services/ImageFirebase';

function CreateCarTypesComponent() {
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [form] = Form.useForm();
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
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
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );
    const onFinish = (values) => {
        console.log(values);
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
                className="formCreate"
                onFinish={onFinish}
                id="myForm"
                form={form}
            >
                <Form.Item
                    name="image" label="Ảnh loại xe"
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
                        multiple={false}
                        accept=".png,.jpeg,.jpg"
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item> 
                <Form.Item label="Tên loại xe" name="name" rules={[{ required: true, message: "Tên loại xe không được bỏ trống" }]}>
                    <Input.TextArea
                        placeholder="Nhập tên loại xe"
                        showCount maxLength={100}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateCarTypesComponent
