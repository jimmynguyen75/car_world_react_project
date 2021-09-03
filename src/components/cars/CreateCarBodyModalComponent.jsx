import React from 'react'
import { Row, Col, Form, Input, Upload, Modal, Switch, Select } from "antd";
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

function CreateCarBodyModalComponent() {

    const { Option } = Select;

    function onChange(value) {
        console.log(`selected ${value}`);
    }

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
    }

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
            <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Car Overview</div>
            <PicturesWall />
            <Form.Item label="Name">
                <Input />
            </Form.Item>
            <Row gutter={15}>
                <Col span={8}>
                    <Form.Item label="Brand">
                        <Select
                            showSearch
                            placeholder="Select a Brand"
                            optionFilterProp="children"
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="jack">Toyota</Option>
                            <Option value="lucy">Lexus</Option>
                            <Option value="tom">Mercedes</Option>
                            <Option value="tom">Hyundai</Option>
                            <Option value="tom">Kia</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Price">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Body Type">
                        <Select
                            showSearch
                            placeholder="Select a Brand"
                            optionFilterProp="children"
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            optionFilterProp="children"
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                        >
                            <Option value="jack">Sedan</Option>
                            <Option value="lucy">Coupe</Option>
                            <Option value="tom">Hatchback</Option>
                            <Option value="tom">SUV</Option>
                            <Option value="tom">Crossover</Option>
                            <Option value="tom">Pickup Truck</Option>
                            <Option value="tom">Wagon</Option>
                            <Option value="tom">MPV</Option>
                            <Option value="tom">Convertible</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Description">
                <Input.TextArea style={{ height: 80 }} />
            </Form.Item>
            <div style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'underline' }}>Car Specifications</div>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Length">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Width">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Height">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Displacement">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Origin">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Engin Type">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Max Torque">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Ground Clearance">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Turning Radius">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Fuel Consumption">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Gear Box">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Seats">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Kerb Weight">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Fuel Capacity">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Wheel Size">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Tyre Size">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Front Suspension">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Rear Suspension">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Interior Material">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Head Lights">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={6}>
                    <Form.Item label="Tail Lights">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Fog Lamps">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Public">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
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
