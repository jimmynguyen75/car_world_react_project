import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Row, Upload } from 'antd';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import storage from '../../services/ImageFirebase';
import PrizeService from '../../services/PrizeService';

export default function CreatePrizeComponent() {
    // const [loadingButton, setLoadingButton] = React.useState(false)
    const history = useHistory();
    const [visible, setVisible] = React.useState(false);
    const [form] = Form.useForm();
    const [urls, setUrls] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
        history.push('/giai-thuong')
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
        const uploadTask = storage.ref(`contests/${file.name}`).put(file);
        uploadTask.on(
            "state_changed",
            snapshot => { },
            error => {
                onError(error)
            },
            async () => {
                await storage
                    .ref("contests")
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
            <div style={{ marginTop: 8 }}>T???i ???nh</div>
        </div>
    );
    const onFinish = (value) => {
        console.log(value);
        PrizeService.createPrize(value)
            .then(() => { 
                message.success("T???o gi???i th?????ng th??nh c??ng") 
                setTimeout(() => {window.location.href = "/giai-thuong"}, 500)
            })
            .catch(() => { message.error("T???o gi???i th?????ng kh??ng th??nh c??ng") })
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
            <Button shape="round" className="createButton" onClick={() => showModal()} style={{ height: 36, marginLeft: 15, backgroundColor: '#BFA2DB', border: 'none', color: 'white' }}><i class="fas fa-trophy"></i><span style={{ marginTop: 2, marginLeft: 8 }}>T???o gi???i th?????ng</span></Button>
            <Modal
                title={"T???o gi???i th?????ng"}
                visible={visible}
                onCancel={handleCancel}
                width={600}
                okText="Ho??n t???t"
                cancelText="H???y"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" form="prize" key="submit" htmlType="submit"  >
                            Ho??n t???t
                        </Button>
                    </Row>
                ]}
            >
                <Form
                    layout="vertical"
                    id="prize"
                    onFinish={onFinish}
                    form={form}
                    destroyOnClose={true}
                >
                    <Form.Item label="???nh gi???i th?????ng" name="image"
                        getValueFromEvent={normFile}>
                        <Upload
                            name="image"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                            accept=".png,.jpeg,.jpg"
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="T??n gi???i th?????ng" name="name" rules={[{ required: true, message: "T??n gi???i th?????ng kh??ng ???????c b??? tr???ng" }]}>
                        <Input.TextArea
                            placeholder="T??n gi???i th?????ng"
                            showCount maxLength={50}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item label="M?? t??? gi???i th?????ng" name="description">
                        <Input.TextArea
                            placeholder="M?? t??? gi???i th?????ng"
                            showCount maxLength={200}
                            autoSize={{ minRows: 4, maxRows: 10 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
