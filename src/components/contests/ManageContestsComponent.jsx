import React, { useEffect, useState } from 'react';
import CreateContestsModalComponent from './CreateContestsModalComponent';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Modal, Row, Tooltip, Space, Form, Spin, Table, Tabs, Tag, message, Select, Rate } from 'antd';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import CreateBySelectComponent from './CreateBySelectComponent';
import 'moment/locale/vi';
import { useHistory, useLocation } from "react-router-dom";
import EditContestComponent from './EditContestComponent';
import ViewContestComponent from './ViewContestComponent';
import ContestService from '../../services/ContestService';
import CheckAttendanceComponent from './CheckAttendanceComponent';
import ProposalService from '../../services/ProposalService';
import BrandService from '../../services/BrandService';

function ManageContestsComponent() {
    const [contests, setContests] = useState(null)
    const [form] = Form.useForm();
    const { TabPane } = Tabs;
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalConfirmSelect, setModalConfirmSelect] = useState(false);
    const [visibleView, setVisibleView] = React.useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [visibleCheck, setVisibleCheck] = useState(false);
    const [loadingButton, setLoadingButton] = React.useState(false)
    const history = useHistory();
    const location = useLocation();
    const [record, setRecord] = useState(null)
    const [recordImage, setRecordImage] = useState(null)
    const [recordPro, setRecordPro] = useState(null)
    const [recordImagePro, setRecordImagePro] = useState(null)
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5)
    const [readyContest, setReadyContest] = useState(null)
    const [loadingContest, setLoadingContest] = useState(null)
    const [historyContest, setHistoryContest] = useState(null)
    const [cancelContest, setCancelContest] = useState(null)
    const [proposals, setProposals] = useState(null)
    const [cancelContestId, setCancelContestId] = React.useState(null)
    const [visibleCancel, setVisibleCancel] = useState(false);
    const [brands, setBrands] = useState([]);
    const { Option } = Select;
    const [brandSelected, setBrandSelected] = useState(null)
    const [key, setKey] = useState(0)
    const [brandSelectValue, setBrandValue] = useState(null)
    const [dt, setDt] = useState([])
    const [filteredTable, setFilteredTable] = useState(null);
    if (location.state === true) {
        ContestService.getAllContests()
            .then((response) => {
                location.state = false
                setContests(response.data)
                setVisibleEdit(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    //show
    const showModalView = () => {
        setVisibleView(true);
    };
    const showModalEdit = () => {
        setVisibleEdit(true);
    };
    const showModalCancel = () => {
        setVisibleCancel(true);
    };
    const showModalSelect = () => {
        setVisibleSelect(true);
    };
    const showModalConfirm = () => {
        setModalConfirm(true)
    }
    const showModalConfirmSelect = () => {
        setModalConfirmSelect(true)
    }
    const showModalCheck = () => {
        setVisibleCheck(true)
    }
    const handleOk = () => {
        setLoadingButton(true);
        setTimeout(() => {
            setModalConfirm(false)
            setModalConfirmSelect(false)
        }, 1000);
        setTimeout(() => {
            setLoadingButton(false);
        }, 1000);
    };
    const handleCancel = () => {
        setVisibleView(false);
        setVisibleEdit(false);
        setVisibleSelect(false);
        setVisibleCheck(false);
        setVisibleCancel(false);
        history.push('/cuoc-thi');
    };
    const handleCancelContest = (id) => {
        setLoadingButton(true);
    };
    useEffect(() => {
        BrandService.getAllBrand()
            .then(car => {
                BrandService.getAllAccessoriesBrand()
                    .then(acc => {
                        setBrands([...car.data, ...acc.data])
                    }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }, [])
    const callback = (key) => {
        setBrandValue(null)
        setKey(key)
        setFilteredTable(null)
    }
    useEffect(() => {
        if (key === 0) {
            setDt(contests)
            setBrandSelected(contests)
        } else if (key === '1') {
            setDt(contests)
            setBrandSelected(contests)
        } else if (key === '2') {
            setDt(readyContest)
            setBrandSelected(readyContest)
        } else if (key === '3') {
            setDt(loadingContest)
            setBrandSelected(loadingContest)
        } else if (key === '4') {
            setDt(historyContest)
            setBrandSelected(historyContest)
        } else if (key === '5') {
            setDt(cancelContest)
            setBrandSelected(cancelContest)
        }
    }, [key, contests, readyContest, loadingContest, historyContest, cancelContest])
    //Effect
    // register
    useEffect(() => {
        ContestService.getAllContests()
            .then((response) => {
                setContests(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    //ready
    useEffect(() => {
        ContestService.getPreparedContests()
            .then((response) => {
                setReadyContest(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    //loading
    useEffect(() => {
        ContestService.getOngoingContests()
            .then((response) => {
                setLoadingContest(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    //history
    useEffect(() => {
        ContestService.getFinishedContests()
            .then((response) => {
                setHistoryContest(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    //cancal 
    useEffect(() => {
        ContestService.getCanceledContest()
            .then((response) => {
                setCancelContest(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    //proposal
    useEffect(() => {
        let result = [];
        ProposalService.getAllProposals()
            .then((res) => {
                res.data.forEach((data) => {
                    if (data.Status === 2) {
                        if (data.Type === 1) {
                            result.push(data)
                        }
                    }
                })
                setProposals(result)
            })
    }, [])
    class Register extends React.Component {
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n cu???c thi',
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
                    title: 'Ng??y di???n ra',
                    key: 'age',
                    width: '28%',
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>K???t th??c:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
                            </Row>
                        )
                    }
                },
                {
                    title: '???? tham gia',
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
                    title: 'Th???i h???n ????ng k??',
                    key: 'deadline',
                    render: (data) => {
                        const then = moment(data.EndRegister);
                        const now = moment().format('yyyy-MM-DDTHH:mm:ss');
                        const diff = then.diff(now)
                        const result = (Math.round(diff / 86400) / 1000).toFixed()
                        return (
                            <div>
                                {result !== '0' ? result + ' ng??y c??n l???i' : 'S???p h???t h???n'}
                            </div>
                        )
                    }
                },
                {
                    title: 'T??c v???',
                    width: '15%',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {record.CurrentParticipants !== 0 ?
                                    <Tooltip title="???? c?? ng?????i d??ng ????ng k??" color='geekblue' key='geekblue'>
                                        <i className="fas fa-cog fa-2x" style={{ color: '#E5890A', cursor: 'alias' }}>
                                        </i>
                                    </Tooltip>
                                    :
                                    <i onClick={() => {
                                        showModalEdit()
                                        setRecord(record)
                                        let ex = record.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImage(ex);
                                    }} className="fas fa-cog fa-2x" style={{ color: '#6155A6', cursor: 'alias' }}></i>

                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <i onClick={() => {
                                    showModalCancel()
                                    setCancelContestId(record)
                                }} className="far fa-times-circle fa-2x" style={{ color: '#FF7878', cursor: 'alias' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
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
    class Ready extends React.Component {
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n cu???c thi',
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
                    title: 'Ng??y di???n ra',
                    key: 'age',
                    width: '28%',
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>K???t th??c:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
                            </Row>
                        )
                    }
                },
                {
                    title: '???? tham gia',
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
                    title: 'T??c v???',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {/* <i onClick={() => {
                                    showModalEdit()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="fas fa-cog fa-2x" style={{ color: '#6155A6', cursor: 'alias' }}></i>
                                <i onClick={() => {
                                    showModalCancel()
                                    setCancelContestId(record)
                                }} className="far fa-times-circle fa-2x" style={{ color: '#FF7878', cursor: 'alias' }}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp; */}
                                <i onClick={() => {
                                    showModalCancel()
                                    setCancelContestId(record)
                                }} className="far fa-times-circle fa-2x" style={{ color: '#FF7878', cursor: 'alias' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
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
    class Loading extends React.Component {
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n cu???c thi',
                    key: 'name',
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
                    title: 'Ng??y di???n ra',
                    key: 'age',
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>K???t th??c:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
                            </Row>
                        )
                    }
                },
                {
                    title: '???? tham gia',
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
                    title: 'T??c v???',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n cu???c thi',
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
                    title: 'Ng??y di???n ra',
                    key: 'age',
                    width: '28%',
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>K???t th??c:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
                            </Row>
                        )
                    }
                },
                {
                    title: '???? tham gia',
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
                    title: '????nh gi??',
                    key: 'rate',
                    render: (data) => {
                        const num = data.Rating
                        const result = (Math.round(num * 10) / 10)
                        return (
                            <div><Rate style={{ fontSize: 14 }} disabled allowHalf defaultValue={data.Rating} />&nbsp;{result}</div>
                        )
                    }
                },
                {
                    title: 'T??c v???',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                            </div>
                        )
                    }
                },
            ];
            return <Table
                rowKey="eventKey2"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
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
    class Cancel extends React.Component {
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
                            T??m
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            ?????t l???i
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
                    title: 'T??n cu???c thi',
                    key: 'name',
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
                    title: 'Ng??y di???n ra',
                    key: 'age',
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>K???t th??c:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
                            </Row>
                        )
                    }
                },
                {
                    title: '???? tham gia',
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
                    title: 'T??c v???',
                    key: 'action',
                    render: (record) => {
                        return (
                            <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                <i onClick={() => {
                                    showModalView()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
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
                dataSource={filteredTable === null ? dt : filteredTable}
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
    const Proposal = () => {
        const columns = [
            {
                title: 'T??n ????? xu???t',
                key: 'p1',
                dataIndex: 'Title',
                sorter: (a, b) => a.Title.length - b.Title.length,
                sortDirections: ['descend'],
                //defaultSortOrder: ['descend']
                render: (data) => {
                    return <div style={{ width: 170 }}>{data}</div>
                }
            },
            {
                title: '????? xu???t',
                key: 'p2',
                render: (data) => {
                    return (
                        <div style={{ textAlign: 'center', cursor: 'copy' }}>
                            <span style={{ backgroundColor: '#FF7171', padding: '3px 12px', color: 'white', borderRadius: 5 }}
                                onClick={() => {
                                    showModalSelect()
                                    setRecordPro(data)
                                    let ex = data.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImagePro(ex);
                                }}>
                                Ch???n</span>
                        </div>
                    )
                }
            }
        ];
        return (
            <Table
                columns={columns}
                dataSource={proposals}
                showSorterTooltip={{ title: 'S???p x???p t??ng gi???m' }}
                rowKey="eventKey1"
            />
        )
    }
    const onFinishCancelContent = (values) => {
        ContestService.cancelContest(values.id, values.reason)
            .then(() => {
                message.success("H???y cu???c thi th??nh c??ng")
                setTimeout(() => {
                    setLoadingButton(false);
                }, 200);
                setTimeout(() => {
                    window.location.href = '/cuoc-thi'
                }, 500)
            })
            .catch(() => {
                message.error("H???y cu???c thi kh??ng th??nh c??ng")
            })
    }
    form.setFieldsValue({
        id: cancelContestId !== null && cancelContestId.Id
    })
    const CancelContent = () => {
        return (
            <Form layout="vertical" form={form} onFinish={onFinishCancelContent} id="cancelContentC" style={{ marginTop: '-10px', marginBottom: '-20px' }}>
                <div><span style={{ letterSpacing: 1, color: '#52524E' }}>T??n cu???c thi:</span> &nbsp;<span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>{cancelContestId !== null && cancelContestId.Title}</span></div>
                {cancelContestId !== null && (cancelContestId.CurrentParticipants !== 0 &&
                    <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Th??ng b??o <span style={{ color: 'red' }}>H???Y</span> ?????n ng?????i ????ng k??:</span></div>
                )}
                <Form.Item hidden={true} name='id'>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="reason" hidden={cancelContestId !== null && (cancelContestId.CurrentParticipants !== 0 ? false : true)} style={{ paddingTop: '5px' }}>
                    <Input.TextArea
                        placeholder="Nh???p th??ng b??o"
                        showCount maxLength={200}
                        spellCheck={false}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        )
    }
    const handleSelectBrand = (value) => {
        setBrandValue(value)
        const filterTable = dt.filter(o => Object.keys(o).some(k =>
            String(o[k])
                .includes(value)
        ))
        value !== undefined && setFilteredTable(filterTable)
    }
    const handleBrandClear = () => {
        setFilteredTable(null)
    }
    return (
        <div>
            {/* Modal Select */}
            <Modal
                destroyOnClose={true}
                title={
                    <Row>
                        <Space size="middle"><div>????? xu???t b???i </div></Space>
                        <Avatar src={recordPro !== null ? recordPro.User.Image : null} style={{ marginLeft: 5 }}></Avatar>
                        <Space size="middle"><div style={{ fontWeight: '500', fontSize: 14, color: '#2A528A', marginLeft: 5 }}>{recordPro !== null ? recordPro.User.FullName : null}</div></Space>
                    </Row>
                }
                visible={visibleSelect}
                onCancel={handleCancel}
                width={1000}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" onClick={showModalConfirmSelect}>
                            Ho??n t???t
                        </Button>
                    </Row>
                }
            >
                <CreateBySelectComponent record={recordPro} recordImage={recordImagePro} />
            </Modal>
            <Modal
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>X??c nh???n</span>}
                centered
                icon={<ExclamationCircleOutlined />}
                visible={modalConfirmSelect}
                onCancel={() => setModalConfirmSelect(false)}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={() => setModalConfirmSelect(false)}>H???y </Button>
                        <Button form="editEvent" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">C??</Button>
                    </Row>
                ]}
            ><span style={{ fontSize: '16px', fontWeight: 400 }}>B???n c?? mu???n t???o cu???c thi n??y kh??ng?</span>
            </Modal>
            {/* Modal Edit */}
            <Modal
                destroyOnClose={true}
                title={"Ch???nh s???a cu???c thi"}
                visible={visibleEdit}
                onCancel={handleCancel}
                width={1000}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" onClick={showModalConfirm}>
                            Ho??n t???t
                        </Button>
                    </Row>
                }
            >
                <EditContestComponent record={record} recordImage={recordImage} />
            </Modal>
            <Modal
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>X??c nh???n</span>}
                centered
                icon={<ExclamationCircleOutlined />}
                visible={modalConfirm}
                onCancel={() => setModalConfirm(false)}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={() => setModalConfirm(false)}>H???y </Button>
                        <Button form="editEvent" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">C??</Button>
                    </Row>
                ]}
            ><span style={{ fontSize: '16px', fontWeight: 400 }}>B???n c?? mu???n c???p nh???t cu???c thi n??y kh??ng?</span>
            </Modal>
            {/* Modal View */}
            <Modal
                destroyOnClose={true}
                title="Chi ti???t"
                visible={visibleView}
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
                <ViewContestComponent record={record} recordImage={recordImage} />
            </Modal>
            {/* Modal cancel */}
            <Modal
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>X??c nh???n</span>}
                centered
                icon={<ExclamationCircleOutlined />}
                visible={visibleCancel}
                onCancel={() => handleCancel()}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={() => handleCancel()}>H???y </Button>
                        <Button form="cancelContentC" loading={loadingButton} onClick={handleCancelContest} type="primary" key="submit" htmlType="submit">X??c nh???n</Button>
                    </Row>
                ]}
            >
                <CancelContent />
            </Modal>
            {/* Modal check attendence */}
            <Modal
                destroyOnClose={true}
                title="??i???m danh cu???c thi"
                visible={visibleCheck}
                onCancel={handleCancel}
                width={800}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button type="primary" onClick={handleCancel}>
                            Xong
                        </Button>
                    </Row>
                }
            >
                <CheckAttendanceComponent />
            </Modal>
            {/* end */}
            <Row>
                <Col span={9}>
                    <Row>
                        <CreateContestsModalComponent />
                        <Button shape="round" className="createButton" onClick={() => showModalCheck()} style={{ height: 36, marginLeft: 15, backgroundColor: '#23814F', border: 'none', color: 'white' }}><i class="fas fa-user-check"></i><span style={{ marginTop: 2, marginLeft: 8 }}>??i???m danh</span></Button>
                    </Row>
                </Col>
                <Col span={9}>
                    <div style={{ float: 'right' }}>
                        <Select
                            style={{ width: '180px', marginBottom: 5, marginRight: 8 }}
                            showSearch
                            placeholder="S???p x???p theo h??ng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleSelectBrand}
                            onClear={handleBrandClear}
                            allowClear
                            value={brandSelectValue}
                        >
                            {brandSelected !== null && Array.from(new Set(brandSelected.map(obj => obj.BrandId))).map((contest) => (
                                brands.map((brands) => (
                                    contest === brands.Id && <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                                ))
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col span={6}>
                </Col>
            </Row>
            <Row gutter={15}>
                <Col span={18}>
                    <Tabs type="card" onChange={callback}>
                        <TabPane tab={<div><i class="far fa-check-square" ></i>&nbsp;&nbsp;Cu???c thi ????ng k??</div>} key="1" >
                            <Spin size="large" spinning={contests === null ? true : false}>
                                <Register />
                            </Spin>
                        </TabPane>
                        <TabPane tab={<div><i class="far fa-check-square" ></i>&nbsp;&nbsp;Cu???c thi s???p di???n ra</div>} key="2" >
                            <Ready />
                        </TabPane>
                        <TabPane tab={<div><i className="fas fa-spinner" ></i>&nbsp;&nbsp;Cu???c thi ??ang di???n ra</div>} key="3">
                            <Loading />
                        </TabPane>
                        <TabPane tab={<div><i className="fas fa-history" ></i>&nbsp;&nbsp;L???ch s???</div>} key="4" >
                            <History />
                        </TabPane>
                        <TabPane tab={<div><i class="far fa-times-circle"></i>&nbsp;&nbsp;???? h???y</div>} key="5" >
                            <Cancel />
                        </TabPane>
                    </Tabs>
                </Col>
                <Col span={6}>
                    <p className="textEventAndProposal"><span className="textEventAndProposalChild" ><i className="far fa-lightbulb" />&nbsp;&nbsp;Cu???c thi ????? xu???t</span></p>
                    <Spin size="middle" spinning={proposals === null ? true : false}>
                        <Proposal />
                    </Spin>
                </Col>
            </Row>
        </div>
    )
}

export default ManageContestsComponent;