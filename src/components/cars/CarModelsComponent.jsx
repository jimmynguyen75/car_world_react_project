import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Table, Tag, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import BrandService from '../../services/BrandService';
import CarService from '../../services/CarService';

function CarModelsComponent() {
    const [visible, setVisible] = React.useState(false);
    const [visibleModel, setVisibleModel] = React.useState(false);
    const [pageBrandSize, setPageBrandSize] = React.useState(5);
    const [pageBrand, setPageBrand] = React.useState(1);
    const [brands, setBrands] = useState([]);
    const [model, setModel] = useState(null);
    const [modelName, setModelName] = useState(null);
    const [modelId, setModelId] = useState(0);
    const [brandId, setBrandId] = useState(null);
    const [brandName, setBrandName] = useState(null);
    const [pageModelSize, setPageModelSize] = React.useState(5);
    const [pageModel, setPageModel] = React.useState(1);
    const [form] = Form.useForm();
    const buttonRef = useRef(null);
    const { Option } = Select;
    const [refesh, setRefesh] = React.useState(false)
    form.setFieldsValue({
        brandId: brandId,
        id: modelId,
        name: modelName
    })
    const handleModel = (id, name) => {
        setVisibleModel(true);
        setBrandId(id)
        setBrandName(name)
        CarService.getCarModelsByBrand(id).then((models) => { setModel(models.data) }).catch((err) => { console.log(err) })
    }
    const handleAddBrand = () => {
        console.log('ok')
        window.location.href = '/thuong-hieu'
    }
    const handleCancel = () => {
        setVisible(false);
    };
    const handleCancelModel = () => {
        setVisibleModel(false);
        setRefesh(true)
        setBrandId(null)
        setModel(null)
    };
    const showModal = () => {
        setVisible(true);
        setModelName(null);
    };
    const confirmDelete = (id) => {
        console.log(id)
        CarService.deleteCarModel(id)
            .then(() => {
                CarService.getCarModelsByBrand(brandId).then((models) => { setModel(models.data) }).catch((err) => { console.log(err) })
                message.success("X??a m???u xe th??nh c??ng")
            }).catch(() => message.error("X??a m???u xe kh??ng th??nh c??ng"))
    };
    const confirmUpdate = () => {
        buttonRef.current.click();
    };
    const handleCreateModel = () => {
        console.log('cc')
    }
    useEffect(() => {
        let getData = []
        CarService.getCarModels().then((models) => {
            let model = Array.from(new Set(models.data.map((obj) => obj.BrandId)))
            BrandService.getAllBrand()
                .then((res) => {
                    model.forEach((md) => {
                        res.data.forEach((result) => {
                            if (result.Id === md) {
                                getData.push(result)
                            }
                        })
                    })
                    setRefesh(false)
                    setBrands(getData.sort((a, b) => a.Name.localeCompare(b.Name)))
                })
                .catch(err => console.error(err))
        }).catch(err => console.error(err))
    }, [refesh])
    const onFinish = (values) => {
        console.log(values)
        CarService.createCarModel(values)
            .then(() => {
                setVisible(false);
                setRefesh(true)
                CarService.getCarModelsByBrand(brandId).then((models) => { setModel(models.data) }).catch((err) => { console.log(err) })
                message.success("T???o m???u xe th??nh c??ng")
            })
            .catch(() => { message.error("T???o m???u xe kh??ng th??nh c??ng") })
    }
    const onFinishUpdate = (values) => {
        console.log(values)
        CarService.updateCarModel(values.id, values)
            .then(() => {
                CarService.getCarModelsByBrand(brandId).then((models) => { setModel(models.data) }).catch((err) => { console.log(err) })
                message.success("C???p nh???t m???u xe th??nh c??ng")
            })
            .catch(() => { message.error("C???p nh???t m???u xe kh??ng th??nh c??ng") })
    }
    const CreateCarModelsComponent = () => {
        const [validate, setValidate] = useState(0);
        const [carModels, setCarModels] = useState([]);
        const [brandss, setBrandss] = useState([]);
        useEffect(() => {
            BrandService.getAllBrand()
                .then((res) => {
                    setBrandss(res.data)
                })
                .catch(err => console.error(err))
        }, [])
        useEffect(() => {
            let data = []
            CarService.getCarModelsByBrand(brandId)
                .then((models) => {
                    models.data.forEach((filter) => {
                        data.push(filter.Name)
                    })
                    setCarModels(data)
                })
                .catch((error) => console.log(error))
        }, [])
        const handleChange = (e) => {
            var data = e.target.value.toLowerCase();
            console.log(e.target.value);
            for (var i = 0; i < carModels.length; i++) {
                if (data === (carModels[i].toLowerCase())) {
                    form.setFieldsValue({ name: data })
                    setValidate(1)
                    break;
                } else {
                    setValidate(0)
                }
            }
        };
        const handleSelectBrand = (id) => {
            setValidate(0)
            form.setFieldsValue({ name: null })
            let data = []
            CarService.getCarModelsByBrand(id)
                .then((models) => {
                    models.data.forEach((filter) => {
                        data.push(filter.Name)
                    })
                    setCarModels(data)
                })
                .catch((error) => console.log(error))
        };
        return (
            <div>
                <Form
                    layout="vertical"
                    id="createCarModel"
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item label={<div>H??ng xe <Tag icon={<PlusCircleOutlined />} onClick={handleAddBrand} color="success">
                        Th??m h??ng
                    </Tag></div>} name="brandId" rules={[{ required: true, message: "H??ng xe kh??ng ???????c b??? tr???ng" }]}>
                        <Select
                            showSearch
                            placeholder="Ch???n h??ng xe"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleSelectBrand}
                        >
                            {brandss.map(brands => (
                                <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="T??n m???u xe" name="name" rules={[{ required: true, message: "T??n m???u xe kh??ng ???????c b??? tr???ng" }]}
                        help={validate === 1 && "M???u xe kh??ng ???????c tr??ng nhau"}
                        hasFeedback
                        validateStatus={validate === 1 ? "error" : "success"}
                    >
                        <Input.TextArea
                            onChange={handleChange}
                            placeholder="Nh???p t??n m???u xe"
                            showCount maxLength={100}
                            autoSize={{ minRows: 1, maxRows: 10 }}
                        />
                    </Form.Item>
                </Form>
            </div>
        )
    }
    const TableBrand = () => {
        const [filterTable, setFilterTable] = useState(null);
        const baseColumns = [
            {
                title: 'H??ng xe',
                key: 'brandName',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={4} style={{ textAlign: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxHeight: '50px', maxWidth: '80px' }} src={data.Image} /></Col>
                            <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.Name}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'T??c v???',
                key: 'brandAction',
                width: '20%',
                render: (data) => {
                    return (
                        <Button type="primary" onClick={() => handleModel(data.Id, data.Name)}>Xem m???u xe</Button>
                    )
                }
            }
        ];
        const search = value => {
            console.log("PASS", { value });
            const filterTable = brands.filter(o =>
                // Object.keys(o).some(k =>
                //     String(o[k])
                o.Name
                    .toLowerCase()
                    .includes(value.toLowerCase())
                // )
            );
            setFilterTable(filterTable)
        }
        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <Input.Search
                        className="fixAnticon"
                        style={{ marginBottom: 15, width: 500 }}
                        placeholder="T??m ki???m. . ."
                        enterButton
                        onSearch={search}
                        allowClear
                    />
                </div>
                <Table
                    columns={baseColumns}
                    dataSource={filterTable === null ? brands : filterTable}
                    rowKey="Id"
                    pagination={{
                        current: pageBrand,
                        pageSize: pageBrandSize,
                        onChange: (pageBrand, pageBrandSize) => {
                            setPageBrand(pageBrand)
                            setPageBrandSize(pageBrandSize)
                        },
                        pageSizeOptions: ['5', '10', '15', '20'],
                        showSizeChanger: true,
                        locale: { items_per_page: "/ trang" },
                    }}
                />
            </div>
        )
    }
    const TableModel = () => {
        const [filterTable, setFilterTable] = useState(null);
        const handleUpdate = (id, name) => {
            setModelName(name)
            setModelId(id)
        }
        const baseColumnsModel = [
            {
                title: 'M???u xe',
                key: 'modelName',
                render: (data) => {
                    return (
                        <div>{data.Name}</div>
                    )
                }
            },
            {
                title: 'T??c v???',
                width: '15%',
                key: 'modelAction',
                render: (data) => {
                    return (
                        <Row gutter={15}>
                            <Col span={12}>
                                <Popconfirm
                                    title={
                                        <Form
                                            layout="vertical"
                                            id="updateCarModel"
                                            onFinish={onFinishUpdate}
                                            form={form}
                                        >
                                            <Form.Item hidden={true} name="id">
                                                <Input defaultValue={data.Id} />
                                            </Form.Item>
                                            <Form.Item hidden={true} name="brandId">
                                                <Input defaultValue={data.BrandId} />
                                            </Form.Item>
                                            <Form.Item label="C???p nh???t m???u xe" name="name">
                                                <Input.TextArea
                                                    placeholder="Nh???p t??n m???u xe"
                                                    showCount maxLength={100}
                                                    autoSize={{ minRows: 1, maxRows: 10 }}
                                                    style={{ width: '300px' }}
                                                />
                                            </Form.Item>
                                            <Form.Item hidden={true}>
                                                <Button ref={buttonRef} form="updateCarModel" type="primary" key="submit" htmlType="submit">Hoan</Button>
                                            </Form.Item>
                                        </Form>
                                    }
                                    onConfirm={() => confirmUpdate()}
                                    okText="Ho??n t???t"
                                    cancelText="H???y"
                                >
                                    <i className="far fa-edit" onClick={() => handleUpdate(data.Id, data.Name)}></i>
                                </Popconfirm>
                            </Col>
                            <Col span={12}>
                                <Popconfirm
                                    title="B???n c?? mu???n x??a m???u xe n??y kh??ng?"
                                    onConfirm={() => confirmDelete(data.Id)}
                                    // onCancel={cancel}
                                    okText="C??"
                                    cancelText="Kh??ng"
                                >
                                    <i className="far fa-trash-alt"></i>
                                </Popconfirm>
                            </Col>
                        </Row >
                    )
                }
            }
        ];
        const search = value => {
            console.log("PASS", { value });
            const filterTable = model.filter(o =>
                Object.keys(o).some(k =>
                    String(o[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            setFilterTable(filterTable)
        }
        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <Row gutter={15}>
                        <Col span={20}>
                            <Input.Search
                                className="fixAnticon"
                                style={{ marginTop: 1 }}
                                placeholder="T??m ki???m. . ."
                                enterButton
                                onSearch={search}
                                allowClear
                            />
                        </Col>
                        <Col span={4}>
                            <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined style={{ marginTop: 5.5 }} />}></Button>
                        </Col>
                    </Row>
                </div>
                <Spin spinning={model !== null ? false : true}>
                    <Table
                        columns={baseColumnsModel}
                        dataSource={filterTable === null ? model : filterTable}
                        rowKey="IdModel"
                        pagination={{
                            current: pageModel,
                            pageSize: pageModelSize,
                            onChange: (pageModel, pageModelSize) => {
                                setPageModel(pageModel)
                                setPageModelSize(pageModelSize)
                            },
                            pageSizeOptions: ['5', '10', '15', '20'],
                            showSizeChanger: true,
                            locale: { items_per_page: "/ trang" },
                        }}
                    />
                </Spin>
            </div>
        )
    }
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title='T???o m???u xe'
                visible={visible}
                onCancel={handleCancel}
                width={600}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" form="createCarModel" key="submit" htmlType="submit" onClick={handleCreateModel}>
                            Ho??n t???t
                        </Button>
                    </Row>
                ]}
            >
                <CreateCarModelsComponent />
            </Modal>
            <Modal
                destroyOnClose={true}
                title={<div>Danh s??ch m???u xe <span style={{ color: 'green' }}>{brandName}</span></div>}
                visible={visibleModel}
                onCancel={handleCancelModel}
                width={600}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        {/* <Button onClick={handleCancelModel}>
                            H???y
                        </Button> */}
                        <Button type="primary" form="createCarModel" key="submit" htmlType="submit" onClick={handleCancelModel}>
                            Xong
                        </Button>
                    </Row>
                ]}
            >
                <TableModel />
            </Modal>
            <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>T???o m???u xe</span></Button>
            <Spin spinning={brands.length === 0 ? true : false}>
                <TableBrand />
            </Spin>
        </div>
    )
}

export default CarModelsComponent
