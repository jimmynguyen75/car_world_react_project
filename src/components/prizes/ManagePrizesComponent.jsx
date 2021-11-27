import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import Highlighter from 'react-highlight-words';
import { ExclamationCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Table, Input, Button, Space, Row, Col, Avatar, Modal, message, Tag, Spin, Tooltip, Form, Image } from 'antd';
import { useHistory } from "react-router-dom";
import CreatePrizeComponent from './CreatePrizeComponent';
import ContestService from '../../services/ContestService';
import PrizeService from '../../services/PrizeService';
import CreatePrizeContestComponent from './CreatePrizeContestComponent';
import UpdatePrizeContestComponent from './UpdatePrizeContestComponent';
import { useStorage } from '../../hook/useBrand';
import displayImageP from '../../images/write.gif'
export default function ManagePrizesComponent() {
    // const [modalConfirm, setModalConfirm] = useState(false);
    const [record, setRecord] = useState(null)
    const [file, setFile] = useState(null);
    const { TabPane } = Tabs;
    const history = useHistory();
    const [page, setPage] = React.useState(1);
    // const [key, setKey] = useState("");
    const [pageSize, setPageSize] = React.useState(5)
    const [recordImage, setRecordImage] = useState(null)
    const [prizes, setPrizes] = useState([]);
    const [contests, setContests] = useState(null)
    const [contestHistory, setContestHistory] = useState(null)
    // const [visibleView, setVisibleView] = React.useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    // const [visibleCancel, setVisibleCancel] = useState(false);
    // const [loadingButton, setLoadingButton] = React.useState(false)
    const [editPrize, setEditPrize] = useState("none")
    const [displayImage, setDisplayImage] = useState("true")
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [form] = Form.useForm();
    const { url } = useStorage(file)
    useEffect(() => { ContestService.getAllContestPrize().then((result) => { setContests(result.data) }).catch(() => { console.log("Error") }) }, [])
    useEffect(() => { ContestService.getFinishedContests().then((result) => { setContestHistory(result.data) }).catch(() => { console.log("Error") }) }, [])
    useEffect(() => {
        const data = []
        PrizeService.getPrizes()
            .then((result) => {
                result.data.forEach((filter) => {
                    if (filter.IsDeleted === false) {
                        data.push(filter)
                    }
                })
                setPrizes(data)
            })
            .catch(() => { console.log("Error") })
    }, [])
    useEffect(() => {
        form.setFieldsValue({
            image: url
        })
    }, [url, form])
    // function callback(key) {
    //     setKey(key)
    // }
    const hideDisplayImage = () => {
        setDisplayImage("none")
        setEditPrize(true)
    }
    const handleCancel = () => {
        // setVisibleView(false);
        setVisibleEdit(false);
        history.push('/giai-thuong');
    };
    // const showModalConfirm = (e) => {
    //     e.preventDefault();
    //     setModalConfirm(true)
    // }
    const showModalEdit = () => {
        setVisibleEdit(true);
    };
    // const showModalCancel = () => {
    //     setVisibleCancel(true);
    // };
    // const showModalView = () => {
    //     setVisibleView(true);
    // };
    const changeImage = (e) => {
        setFile(e.target.files[0])
    }
    // const handleOk = () => {
    //     setLoadingButton(true);
    //     setTimeout(() => {
    //         setModalConfirm(false)
    //     }, 1000);
    //     setTimeout(() => {
    //         setLoadingButton(false);
    //     }, 1000);
    // };
    const onFinish = (values) => {
        console.log(values);
        PrizeService.updatePrize(values.id, values)
            .then(() => {
                message.success("Cập nhật giải thưởng thành công")
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            })
            .catch(() => { message.error("Cập nhật giải thưởng không thành công") })
    }
    function confirm(id) {
        Modal.confirm({
            title: 'Bạn có muốn xóa giải thưởng này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                PrizeService.removePrizeById(id)
                    .then(() => {
                        console.log('Deleted')
                        message.success("Xóa giải thưởng thành công")
                        setTimeout(() => {
                            window.location.href = '/giai-thuong'
                        }, 500)
                    })
                    .catch(() => { message.error("Xóa giải thưởng không thành công"); })
            }
        });
    }
    class PrizeContest extends React.Component {
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
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
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
                    title: 'Tên cuộc thi',
                    key: 'name',
                    width: '30%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={5}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                                <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Đã tham gia',
                    key: 'join',
                    sorter: (a, b) => a.CurrentParticipants - b.CurrentParticipants,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        let color = '#4CBE9A';
                        if (data.CurrentParticipants > 10) {
                            color = '#EBA3A4'
                        }
                        if (data.CurrentParticipants > 20) {
                            color = '#9DAD7F'
                        }
                        return (
                            <Tag style={{ fontSize: 15 }} color={color} key={data}>
                                <i className="fas fa-users"></i>&nbsp;&nbsp;{data.CurrentParticipants}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Địa điểm',
                    key: 'location',
                    render: (data) => {
                        return (
                            <div>{data.Venue}</div>
                        )
                    }
                },
                {
                    title: 'Người tạo',
                    key: 'created',
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar alt="" src={data.CreatedByNavigation.Image}></Avatar>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data.CreatedByNavigation.FullName}</div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Tác vụ',
                    width: '5%',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalEdit()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="fas fa-cog fa-2x" style={{ color: '#6155A6', cursor: 'alias' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={contests}
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
    class Prize extends React.Component {
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
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
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
                    title: 'Tên giải thưởng',
                    key: 'name',
                    width: '40%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={6}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                                <Col span={18} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Name}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    key: 'join',
                    render: (data) => {
                        return (<div>{data.Description}</div>)
                    }
                },
                {
                    title: <div style={{ textAlign: 'center' }}>Xóa</div>,
                    key: 'delete',
                    width: '10%',
                    render: (data) => {
                        return (
                            <Tooltip title="Xóa giải thưởng" onClick={() => confirm(data.Id)} color="#FF7878" placement="topLeft">
                                <div style={{ textAlign: 'center', color: '#FF7878' }}><i className="far fa-trash-alt fa-lg"></i></div>
                            </Tooltip>
                        )
                    }
                }
            ];
            return <Table
                onRow={(record) => {
                    return {
                        onClick: () => {
                            console.log(record)
                            form.setFieldsValue({
                                name: record.Name,
                                description: record.Description,
                                image: record.Image,
                                id: record.Id
                            })
                            hideDisplayImage()
                        }, // click row
                    };
                }}
                rowKey="eventKey2"
                columns={columns}
                dataSource={prizes}
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
    const UpdatePrize = () => {
        return (
            <>
                <Form
                    form={form}
                    className="formDetail"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item name="id" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Form.Item name="image" valuePropName="src" noStyle>
                            <Avatar size={120} icon={<UserOutlined />} />
                        </Form.Item>
                        <br />
                        <label style={{ marginTop: 5 }} className="upload" htmlFor="upload-photo" ><i className="fas fa-plus-circle fa-1x"><span style={{ marginLeft: 3 }}>Chọn ảnh</span></i></label>
                        <input type="file" onChange={changeImage} name="photo" id="upload-photo" />
                    </Form.Item>
                    <Form.Item label="Tên giải thưởng" name="name">
                        <Input placeholder="Nhập tên giải thưởng" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                            placeholder="Nhập mô tả"
                            showCount maxLength={200}
                            autoSize={{ minRows: 3, maxRows: 10 }}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
    class History extends React.Component {
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
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
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
                    title: 'Tên cuộc thi',
                    key: 'name',
                    width: '30%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={5}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                                <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Đã tham gia',
                    key: 'join',
                    sorter: (a, b) => a.CurrentParticipants - b.CurrentParticipants,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        let color = '#4CBE9A';
                        if (data.CurrentParticipants > 10) {
                            color = '#EBA3A4'
                        }
                        if (data.CurrentParticipants > 20) {
                            color = '#9DAD7F'
                        }
                        return (
                            <Tag style={{ fontSize: 15 }} color={color} key={data}>
                                <i className="fas fa-users"></i>&nbsp;&nbsp;{data.CurrentParticipants}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Địa điểm',
                    key: 'location',
                    render: (data) => {
                        return (
                            <div>{data.Venue}</div>
                        )
                    }
                },
                {
                    title: 'Người tạo',
                    key: 'created',
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar alt="" src={data.CreatedByNavigation.Image}></Avatar>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data.CreatedByNavigation.FullName}</div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Tác vụ',
                    width: '5%',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                {/* <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp; */}
                                <i onClick={() => {
                                    showModalEdit()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="fas fa-cog fa-2x" style={{ color: '#6155A6', cursor: 'alias' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={contestHistory}
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
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title={"Cập nhật giải thưởng cuộc thi"}
                visible={visibleEdit}
                onCancel={handleCancel}
                width={1000}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button type="primary" onClick={handleCancel}>
                            Xong
                        </Button>
                    </Row>
                }
            >
                <UpdatePrizeContestComponent record={record} recordImage={recordImage} />
            </Modal>
            {/* <Modal
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>Xác nhận</span>}
                centered
                icon={<ExclamationCircleOutlined />}
                visible={modalConfirm}
                onCancel={() => setModalConfirm(false)}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={() => setModalConfirm(false)}>Hủy </Button>
                        <Button form="updatePrizeContest" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">Có</Button>
                    </Row>
                ]}
            ><span style={{ fontSize: '16px', fontWeight: 400 }}>Bạn có muốn cập nhật giải thưởng cuộc thi này không?</span>
            </Modal> */}
            <Row>
                <CreatePrizeContestComponent />
                <CreatePrizeComponent />
            </Row>
            <Tabs type="card">
                <TabPane tab="Cuộc thi" key="1">
                    <Spin spinning={contests === null ? true : false}>
                        <PrizeContest />
                    </Spin>
                </TabPane>
                <TabPane tab="Giải thưởng" key="2">
                    <Row gutter={15}>
                        <Col span={12}>
                            <Spin spinning={prizes === null ? true : false}>
                                <Prize />
                            </Spin>
                        </Col>
                        <Col span={12} style={{ display: editPrize }}>
                            <UpdatePrize />
                        </Col>
                        <Col span={12} style={{ display: displayImage }}>
                            <div>
                                <Image style={{ height: '518px', margin: 'auto', textAlign: 'center' }} src={displayImageP} preview={false}></Image>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Lịch sử" key="3">
                    <History />
                </TabPane>
            </Tabs>
        </div>
    )
}
