import { ArrowLeftOutlined } from '@ant-design/icons';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Button, Col, Form, Image, Input, message, Row, Select, Spin } from 'antd';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useStorage } from '../../hook/usePost';
import AccountService from '../../services/AccountService';
import BrandService from '../../services/BrandService';
import storage from "../../services/ImageFirebase";
import PostService from '../../services/PostService';
import './stylePost.less';
export default function EditPostComponent({ record }) {
    const { Option } = Select;
    const [file, setFile] = useState(null);
    const { url } = useStorage(file)
    const [form] = Form.useForm()
    const history = useHistory();
    const [brands, setBrands] = useState([]);
    useEffect(() => {
        BrandService.getAllBrand()
            .then(car => {
                BrandService.getAllAccessoriesBrand()
                    .then(acc => {
                        setBrands([...car.data, ...acc.data])
                    }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }, [])
    const normFile = (data) => {
        form.setFieldsValue({
            contents: data.getData()
        })
    };
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }
        // Starts the upload process.
        upload() {
            return this.loader.file.then(
                file =>
                    new Promise((resolve, reject) => {
                        const storageRef = storage.ref(`/images/${file.name}`)
                        const uploadTask = storageRef.put(file);
                        uploadTask.on(
                            "state_changed", // or 'state_changed'
                            function (snapshot) {
                            },
                            function (error) {
                                switch (error.code) {
                                    case "storageRef/unauthorized":
                                        reject(" User doesn't have permission to access the object");
                                        break;

                                    case "storageRef/canceled":
                                        reject("User canceled the upload");
                                        break;

                                    case "storageRef/unknown":
                                        reject(
                                            "Unknown error occurred, inspect error.serverResponse"
                                        );
                                        break;
                                    default:
                                }
                            },
                            function () {
                                // Upload completed successfully, now we can get the download URL
                                uploadTask.snapshot.ref
                                    .getDownloadURL()
                                    .then(function (downloadURL) {
                                        // console.log("File available at", downloadURL);
                                        resolve({
                                            default: downloadURL
                                        });
                                    });
                            }
                        );
                    })
            );
        }
    }
    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
    }
    console.log(record)
    form.setFieldsValue({
        id: record.Id,
        type: record.Type === 1 ? 1 : record.Type === 2 ? 2 : record.Type === 3 ? 3 : record.Type === 4 ? 4 : null,
        // === 1 ? 'Xe' : record.Type === 2 ? 'Ph??? ki???n' : record.Type === 3 ? 'S??? Ki???n' : record.Type === 4 ? 'Cu???c thi' : null
        title: record.Title,
        featuredImage: record.FeaturedImage,
        overview: record.Overview,
        contents: record.Contents,
        createdBy: record.CreatedBy,
        modifiedBy: AccountService.getCurrentUser().Id,
        createdDate: record.CreatedDate,
        status: record.Status,
        brandId: record.BrandId
    })
    DecoupledEditor
        .create(document.querySelector('#editor'), {
            extraPlugins: [MyCustomUploadAdapterPlugin],
        })
        .then(editor => {
            const toolbarContainer = document.querySelector('#toolbar-container');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            editor.model.document.on('change', () => {
                window.editor = editor;
                normFile(editor)
                console.log("change")
            });
            editor.editing.view.change((writer) => {
                writer.setStyle(
                    "height",
                    "600px",
                    editor.editing.view.document.getRoot()
                );
            });
        })
        .catch(error => {
            console.error(error);
        });
    const onFinish = (values) => {
        console.log(values)
        PostService.updatePost(values.id, values)
            .then(() => {
                setTimeout(() => {
                    message.success("C???p nh???t b??i ????ng th??nh c??ng");
                }, 500)
                setTimeout(() => {
                    window.location.href = '/bai-dang'
                }, 1500)
            })
            .catch((error) => {
                message.error("C???p nh???t b??i ????ng kh??ng th??nh c??ng")
                console.log(error)
            })
    };
    function handleBack() {
        history.goBack();
    }
    const changeImage = (e) => {
        setFile(e.target.files[0])
    }
    useEffect(() => {
        form.setFieldsValue({
            featuredImage: url
        })
    }, [url, form])
    return (
        <>
            <div className="body123">
                <div><Button className="buttonBack" onClick={handleBack}><ArrowLeftOutlined /> Tr??? v???</Button></div>
                <div className="title">S???a b??i ????ng</div>
                <div id="editPost">
                    <Form
                        layout="vertical"
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{ width: 900, margin: '0 auto' }}
                    >
                        <Form.Item hidden={true} name="createdBy"><Input /></Form.Item>
                        <Form.Item hidden={true} name="modifiedBy"><Input /></Form.Item>
                        <Form.Item hidden={true} name="createdDate"><Input /></Form.Item>
                        <Form.Item hidden={true} name="id"><Input /></Form.Item>
                        <Form.Item hidden={true} name="status"><Input /></Form.Item>
                        <Form.Item
                            label={<div style={{ letterSpacing: '1px' }}>???nh ?????i di???n</div>}
                        >
                            <Form.Item name="featuredImage" valuePropName="src" noStyle>
                                <Image alt="" style={{ height: 'auto', width: 'auto', maxHeight: '120px', maxWidth: '140px' }} preview={false} />
                            </Form.Item>
                            <label style={{ marginTop: 5 }} className="upload" htmlFor="upload-photo" ><i className="fas fa-plus-circle fa-1x" style={{ marginLeft: 35 }}><span style={{ marginLeft: 3 }}>?????i ???nh</span></i></label>
                            <input type="file" onChange={changeImage} name="photo" id="upload-photo" />
                        </Form.Item>
                        <Row gutter={15}>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label={<div style={{ letterSpacing: '1px' }}>Ti??u ?????</div>}
                                    rules={[{ required: true, message: "Ti??u ????? kh??ng ???????c b??? tr???ng" }]}
                                >
                                    <Input.TextArea
                                        size="large"
                                        maxLength={200} showCount
                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                        placeholder="Nh???p ti??u ?????"
                                        spellcheck="false"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label={<div style={{ letterSpacing: '1px' }}>Chuy??n m???c</div>}
                                    name="type"
                                    rules={[{ required: true, message: "Chuy??n m???c kh??ng ???????c b??? tr???ng" }]}
                                >
                                    <Select
                                        placeholder="Ch???n chuy??n m???c"
                                        size="large"
                                    >
                                        <Option key="1" value={1}>Xe</Option>
                                        <Option key="2" value={2}>Ph??? Ki???n</Option>
                                        <Option key="3" value={3}>S??? ki???n</Option>
                                        <Option key="4" value={4}>Cu???c thi</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Spin spinning={brands.length !== 0 ? false : true}>
                                    <Form.Item label="Ch???n h??ng" name="brandId" rules={[{ required: true, message: "Vui l??ng nh???p l???i!" }]}>
                                        <Select
                                            showSearch
                                            size="large"
                                            placeholder="Ch???n h??ng xe"
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
                                </Spin>
                            </Col>
                        </Row>
                        <Form.Item
                            name="overview"
                            label={<div style={{ letterSpacing: '1px' }}>M?? t???</div>}
                            rules={[{ required: true, message: "M?? t??? kh??ng ???????c b??? tr???ng" }]}
                        >
                            <Input.TextArea
                                size="large"
                                showCount maxLength={1000}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder="Nh???p M?? t???"
                                spellcheck="false"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<div style={{ letterSpacing: '1px' }}>N???i dung</div>}
                            name="contents"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: "N???i dung kh??ng ???????c b??? tr???ng" }]}
                        >
                            <div id="toolbar-container"></div>
                            <div id="editor" style={{ width: 900, padding: '10px 30px 0px 30px' }}>
                                <p>{record !== '' && parse(record.Contents)}</p>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Row style={{ float: 'right' }}>
                                <Button style={{ marginBottom: 30 }} onClick={handleBack} >H???y</Button>
                                <Button style={{ marginBottom: 30, marginLeft: 10 }} type="primary" htmlType="submit">Ho??n t???t</Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}
