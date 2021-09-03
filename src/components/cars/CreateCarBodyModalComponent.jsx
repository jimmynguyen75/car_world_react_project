import React from 'react'
import { Row, Col, Form, Input, Upload, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';

function CreateCarBodyModalComponent() {

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    class PicturesWall extends React.Component {
        state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [
            ],
        };

        handleCancel = () => this.setState({ previewVisible: false });

        handlePreview = async file => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }

            this.setState({
                previewImage: file.url || file.preview,
                previewVisible: true,
                previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
            });
        };

        handleChange = ({ fileList }) => this.setState({ fileList });

        render() {
            const { previewVisible, previewImage, fileList, previewTitle } = this.state;
            const uploadButton = (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Image</div>
                </div>
            );
            return (
                <>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            );
        }
    }

    const App = () => (
        <Form layout="vertical" className="formCreate">
            <PicturesWall />
            <Row gutter={15}>
                <Col span={8}>
                    <Form.Item label="Name">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Brand">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Type">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={8}>
                    <Form.Item label="d">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="e">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return (
        <div>
            <App />
        </div>
    )
}
export default CreateCarBodyModalComponent;
