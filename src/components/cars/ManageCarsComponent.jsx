import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Avatar, Button, Col, Input, message, Modal, Popover, Row, Space,
    Spin, Image, Table, Carousel, Descriptions, Popconfirm, Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import CarService from '../../services/CarService';
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import CreateCarModalComponent from './CreateCarModalComponent';
import ViewCarModalComponent from './ViewCarModalComponent';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import 'moment/locale/vi';
import EditCarBodyComponent from './EditCarBodyComponent';
import CreateCarComponent from './CreateCarComponent';
import BrandService from '../../services/BrandService';
function ManageCarsComponent() {
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [car, setCars] = useState(null);
    const [visible, setVisible] = React.useState(false);
    const [visibleDetail, setVisibleDetail] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [setSuccess] = React.useState(false);
    const [record, setRecord] = React.useState(null);
    const [recordImage, setRecordImage] = React.useState(null);
    const [pageSize, setPageSize] = React.useState(5)
    const [page, setPage] = React.useState(1)
    const contentDelete = (
        <div>
            <p>Bạn sẽ xóa chiếc xe này khi nhấn vào!</p>
        </div>
    );
    const contentView = (
        <div>
            <p>Bạn sẽ được xem chiếc xe này khi nhấn vào</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>Bạn sẽ chỉnh sửa chiếc xe này khi nhấn vào</p>
        </div>
    );
    useEffect(() => {
        let result = []
        CarService
            .getCars()
            .then(res => {
                // res.data.forEach((data) => {
                //     if (data.IsDeleted === false) {
                //         result.push(data)
                //     }
                // })
                // console.log(result)
                setCars(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);
    function confirmDelete(id) {
        Modal.confirm({
            title: 'Xóa xe',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có muốn xóa chiếc xe này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                CarService.deleteCar(id)
                    .then(() => {
                        setTimeout(() => {
                            message.success("Xóa xe thành công");
                        }, 500)
                        setTimeout(() => {
                            window.location.href = '/xe'
                        }, 1500)
                    })
                    .catch(err => {
                        message.error("Lỗi server, vui lòng thử lại sau")
                        console.log(err);
                    })
            }
        });
    }

    const success = () => {
        setSuccess(false);
        message.success('Tạo xe thành công');
    };
    const showModal = () => {
        setVisible(true);
    };
    const showViewDetail = () => {
        setVisibleDetail(true);
    }
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
        setTimeout(() => {
            success();
            setSuccess(true);
        }, 2000)
    };
    const handleOkDetail = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisibleDetail(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    const handleCancelDetail = () => {
        console.log('Clicked cancel button');
        setVisibleDetail(false);
    };
    class Cars extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Đặt lại
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });

        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        render() {
            const columns = [
                {
                    title: 'Tên xe',
                    key: 'name',
                    width: '40%',
                    ...this.getColumnSearchProps('Name'),
                    render: (record) => {
                        return (
                            <Row>
                                <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={record.Image === "string" ? imgPlacehoder : record.Image} /></Col>
                                <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15, width: '100%' }} class="textOverflow">{record.Name}</div></Col>
                            </Row>
                        );
                    },
                },
                {
                    title: "Hãng xe",
                    key: 'brand',
                    width: '16%',
                    render: (brand) => {
                        return (
                            <Row>
                                <Col span={6}>
                                    <Avatar style={{ display: true, height: 'auto', width: 'auto', margin: 'auto', maxHeight: '30px', maxWidth: '30px' }} size="small" src={brand.Brand.Image} />
                                </Col>
                                <Col span={18}>
                                    <div style={{ paddingLeft: 5 }}>{brand.Brand.Name}</div>
                                </Col>
                            </Row>
                        );
                    }
                },
                {
                    title: 'Giá',
                    dataIndex: 'Price',
                    key: 'price',
                    width: '14%',
                    ...this.getColumnSearchProps('Price'),
                    render: (price) => {
                        return <NumberFormat
                            value={price}
                            displayType="text"
                            suffix=" vnđ"
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                        />
                    }
                },
                {
                    title: 'Ngày tạo',
                    key: 'date',
                    width: '12%',
                    render: (date) => {
                        return <div style={{ color: '#868686', fontWeight: 450 }}>{moment(date.CreatedDate).format('ll')}</div>
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (record) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title='Xem chi tiết'>
                                    <Button onClick={() => {
                                        showViewDetail()
                                        setRecord(record)
                                        let ex = record.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImage(ex);
                                    }}
                                        block className="viewButton" ><i className="fas fa-eye"></i></Button>
                                </Popover>
                                <Popover content={contentEdit} title='Chỉnh sửa'>
                                    <Button onClick={() => {
                                        showModal()
                                        setRecord(record)
                                        let ex = record.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImage(ex)
                                    }}
                                        block className="editButton"><i className="fas fa-edit"></i></Button>
                                </Popover>
                                <Popover content={contentDelete} title='Xóa'>
                                    <Button onClick={() => confirmDelete(record.Id)}
                                        block className="deleteButton"><i className="far fa-trash-alt"></i></Button>
                                </Popover>
                            </Space>
                        )
                    },
                }
            ];
            return <Table
                rowKey="Id"
                columns={columns}
                dataSource={car}
                onChange={() => {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0;
                }}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    },
                    pageSizeOptions: ['5', '10', '15', '20'],
                    showSizeChanger: true,
                    locale: { items_per_page: "/ trang" },
                }}
            />;
        }
    }

    const CarsTable = () => {
        const [attributes, setAttributes] = useState([])
        const [generations, setGenerations] = useState([])
        const [filterTable, setFilterTable] = useState(null)
        const [pageGenerationSize, setPageGenerationSize] = React.useState(5)
        const [pageGeneration, setPageGeneration] = React.useState(1)
        const [visibleCarDetail, setVisibleCarDetail] = React.useState(false)
        const [carDetail, setCarDetail] = React.useState(null)
        const [carImg, setCarImg] = useState([]);
        const [brands, setBrands] = useState([]);
        const [models, setModels] = useState([]);
        const { Option } = Select;
        const baseColumns = [
            {
                title: 'Tên xe',
                key: 'carName',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                            <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '600', fontSize: 15, width: '100%' }} class="textOverflow">{data.Name}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Giá xe',
                key: 'carPrize',
                render: (data) => {
                    return <NumberFormat
                        value={data.Price}
                        displayType="text"
                        suffix=" vnđ"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                    />
                }
            },
            {
                title: 'Năm sản xuất',
                key: 'carPublished',
                render: (data) => {
                    return (
                        <div>{data.YearOfManufactor}</div>
                    )
                }
            },
            {
                title: 'Tác vụ',
                width: '15%',
                key: 'carAction',
                render: (data) => {
                    return (
                        <i className="far fa-edit" onClick={() => { handleVisibleCarDetail(data) }} />
                    )
                }
            }
        ];

        const handleCancelCarDetail = () => {
            setVisibleCarDetail(false);
        }
        const handleVisibleCarDetail = (value) => {
            console.log(value)
            let data = [];
            data = value.Image.split('|')
            if (data.length > 1) {
                data.pop();
            }
            setCarImg(data)
            setCarDetail(value);
            setVisibleCarDetail(true);
            CarService.getCarWithAttributeByGenerationId(value.Id)
                .then((result) => {
                    setAttributes(result.data)
                })
                .catch((error) => { console.log(error); })
        }
        const handleSelectBrand = (value) => {
            CarService.getCarModelsByBrand(value).then((res) => setModels(res.data)).catch((err) => console.log(err))
        }
        const handleBrandClear = (value) => {
            console.log("clear: ", value)
        }
        const handleModelClear = (value) => {
            console.log("clear: ", value)
        }
        const handleModelChange = (value) => {
            console.log(value)
        }
        const confirmDeleteCar = (id) => {
            console.log(id)
            message.loading("Đang tải...")
            CarService.deleteCarWithAttributesByGenerationId(id).then(() => {
                CarService.deleteCarGeneration(id).then(() => {
                    message.destroy()
                    message.success("Xóa xe thành công")
                    setVisibleCarDetail(false)
                    CarService.getGenerationByCarModel("3ab1d3b5-fd22-4bc2-859b-7e110e225acb").then((res) => setGenerations(res.data)).catch((err) => console.log(err))
                }).catch(() => {
                    message.destroy()
                    message.error("Xóa không thành công")
                })
            }).catch(() => {
                message.destroy()
                message.error("Xóa không thành công")
            })
        };
        const ViewCarDetail = () => {
            return (
                <div>
                    <Row gutter={15} style={{ marginBottom: 15 }}>
                        <Col span={12} style={{ marginTop: '15px' }}>
                            <Carousel effect="fade">
                                {carImg.length !== 0 && carImg.map((object, i) => {
                                    return (
                                        <div>
                                            <Image preview={false} style={{ display: 'block', margin: 'auto', maxHeight: '300px' }} key={i} src={object} />
                                        </div>)
                                })}
                            </Carousel>
                        </Col>
                        <Col span={12}>
                            <Descriptions title="Thông số cơ bản" bordered>
                                <Descriptions.Item labelStyle={{ fontWeight: '600' }} label="Tên xe" span={3}>{carDetail.Name}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600' }} label="Mẫu" span={3}>{carDetail.CarModelName}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600' }} label="Hãng" span={3}>{carDetail.Brand}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600' }} label="Năm sản xuất" span={3}>{carDetail.YearOfManufactor}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{ fontWeight: '600' }} label="Giá tham khảo" span={3}>{carDetail.Price}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Descriptions title="Thông số xe" bordered layout="horizontal" style={{ marginBottom: 15 }}>
                        {attributes.length !== 0 && attributes.map((attribute) => (
                            <Descriptions.Item labelStyle={{ fontWeight: '600' }} label={attribute.Attribution.Name}>{attribute.Value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <div style={{ marginTop: '15px', float: 'right' }}>
                                <Popconfirm
                                    title="Bạn có muốn xóa xe này không?"
                                    onConfirm={() => confirmDeleteCar(carDetail.Id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button style={{ marginRight: '8px' }}>Xóa</Button>
                                </Popconfirm>
                                <Button style={{ marginRight: '8px' }}>Sửa</Button>
                                <Button type="primary" onClick={handleCancelCarDetail}>Xong</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
        useEffect(() => {
            CarService.getGenerationByCarModel("3ab1d3b5-fd22-4bc2-859b-7e110e225acb").then((res) => setGenerations(res.data)).catch((err) => console.log(err))
            BrandService.getAllBrand().then((res) => { setBrands(res.data) }).catch((err) => console.log(err))
        }, [])
        const search = value => {
            console.log("PASS", { value });
            const filterTable = generations.filter(o =>
                Object.keys(o).some(k =>
                    String(o[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            setFilterTable(filterTable)
        }
        console.log(generations)
        return (
            <>
                <Modal
                    destroyOnClose={true}
                    title='Xem chi tiết xe'
                    visible={visibleCarDetail}
                    onCancel={handleCancelCarDetail}
                    width={1000}
                    footer={false}
                >
                    <ViewCarDetail />
                </Modal>
                <div>
                    <Select
                        style={{ width: '180px', marginBottom: 5, marginRight: 8 }}
                        showSearch
                        placeholder="Sắp xếp theo hãng"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleSelectBrand}
                        onClear={handleBrandClear}
                        allowClear
                    >
                        {brands.map(brands => (
                            <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: 130 }}
                        disabled={models.length !== 0 ? false : true}
                        showSearch
                        placeholder="Chọn mẫu xe"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleModelChange}
                        onClear={handleModelClear}
                        allowClear
                    >
                        {models.map(model => (
                            <Option key={model.Id} value={model.Name}>{model.Name}</Option>
                        ))}
                    </Select>
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                        <Input.Search
                            className={"fixAnticon"}
                            style={{ marginTop: 1, width: 440 }}
                            placeholder="Tìm kiếm. . ."
                            enterButton
                            onSearch={search}
                            allowClear
                        />
                    </div>
                    <Spin spinning={generations ? false : true}>
                        <Table
                            columns={baseColumns}
                            dataSource={filterTable === null ? generations : filterTable}
                            rowKey="IdModel"
                            pagination={{
                                current: pageGeneration,
                                pageSize: pageGenerationSize,
                                onChange: (pageGeneration, pageGenerationSize) => {
                                    setPageGeneration(pageGeneration)
                                    setPageGenerationSize(pageGenerationSize)
                                },
                                pageSizeOptions: ['5', '10', '15', '20'],
                                showSizeChanger: true,
                                locale: { items_per_page: "/ trang" },
                            }}
                        />
                    </Spin>
                </div>
            </>
        )
    }
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title='Tạo xe mới'
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >
                <CreateCarBodyModalComponent />
            </Modal>
            <Modal
                destroyOnClose={true}
                title="Chi tiết xe"
                visible={visibleDetail}
                onOk={handleOkDetail}
                confirmLoading={confirmLoading}
                onCancel={handleCancelDetail}
                width={1100}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button type="primary" onClick={handleCancelDetail}>
                            Xong
                        </Button>
                    </Row>
                ]}
            >
                <ViewCarModalComponent record={record} recordImage={recordImage} />
            </Modal>
            <Modal
                destroyOnClose={true}
                title={"Cập nhật xe"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Row style={{ float: 'right' }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button form="myFormEdit" type="primary" key="submit" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Row>
                ]}
            >
                <EditCarBodyComponent record={record} recordImage={recordImage} />
            </Modal>
            <CreateCarComponent />
            {/* <Spin
                spinning={car === null ? true : false}
                // delay={100}
                size="large" >
                <Cars />
            </Spin> */}
            <CarsTable />
        </div>
    )
}

export default ManageCarsComponent
