import React, { useEffect, useState } from 'react';
import CreateContestsModalComponent from './CreateContestsModalComponent';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Modal, Row, Space, Spin, Table, Tabs, Tag, message, Rate } from 'antd';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import CreateBySelectComponent from './CreateBySelectComponent';
import 'moment/locale/vi';
import { useHistory } from "react-router-dom";
import EditContestComponent from './EditContestComponent';
import ViewContestComponent from './ViewContestComponent';
import ContestService from '../../services/ContestService';
import CheckAttendanceComponent from './CheckAttendanceComponent';
import ProposalService from '../../services/ProposalService';
function ManageContestsComponent() {
    const [contests, setContests] = useState(null)
    const { TabPane } = Tabs;
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [modalConfirm, setModalConfirm] = useState(false);
    const [visibleView, setVisibleView] = React.useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [visibleCheck, setVisibleCheck] = useState(false);
    const [loadingButton, setLoadingButton] = React.useState(false)
    const history = useHistory();
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
    const showModalCheck = () => {
        setVisibleCheck(true)
    }
    const handleOk = () => {
        setLoadingButton(true);
        setTimeout(() => {
            setModalConfirm(false)
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
        ContestService.cancelEvent(id)
            .then(() => {
                setTimeout(() => {
                    message.success("Hủy cuộc thi thành công")
                }, 500)
                setTimeout(() => {
                    setLoadingButton(false);
                }, 1000);
                setTimeout(() => {
                    window.location.href = '/su-kien'
                }, 800)
            })
            .catch(() => {
                message.error("Hủy cuộc thi không thành công")
            })
    };
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
                    title: 'Ngày diễn ra',
                    key: 'age',
                    width: '28%',
                    ...this.getColumnSearchProps('age'),
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
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
                    title: 'Thời hạn đăng ký',
                    key: 'deadline',
                    render: (data) => {
                        const then = moment(data.EndRegister);
                        const now = moment().format('yyyy-MM-DDTHH:mm:ss');
                        const diff = then.diff(now)
                        const result = (Math.round(diff / 86400) / 1000).toFixed()
                        return (
                            <div>
                                {/* <Countdown value={countdown} onFinish={onFinish} /> */}
                                {result} ngày còn lại
                            </div>
                        )
                    }
                },
                {
                    title: 'Tác vụ',
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
                                <i onClick={() => {
                                    showModalEdit()
                                    setRecord(record)
                                    let ex = record.Image.split("|")
                                    if (ex.length > 1) {
                                        ex.pop();
                                    }
                                    setRecordImage(ex);
                                }} className="fas fa-cog fa-2x" style={{ color: '#6155A6', cursor: 'alias' }}></i>
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
                    title: 'Ngày diễn ra',
                    key: 'age',
                    width: '28%',
                    ...this.getColumnSearchProps('age'),
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
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
                    title: 'Tác vụ',
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
                                <i onClick={() => {
                                    showModalCancel()
                                    setCancelContestId(record)
                                }} className="far fa-times-circle fa-2x" style={{ color: '#FF7878', cursor: 'alias' }}></i>
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
                dataSource={readyContest}
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
                    title: 'Ngày diễn ra',
                    key: 'age',
                    width: '28%',
                    ...this.getColumnSearchProps('age'),
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
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
                    title: 'Tác vụ',
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
                dataSource={loadingContest}
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
                    title: 'Ngày diễn ra',
                    key: 'age',
                    width: '28%',
                    ...this.getColumnSearchProps('age'),
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
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
                    title: 'Đánh giá',
                    key: 'rate',
                    render: (data) => {
                        return (
                            <Rate allowHalf defaultValue={data.Rating} />
                        )
                    }
                },
                {
                    title: 'Tác vụ',
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
                dataSource={historyContest}
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
                    title: 'Tên sự kiện',
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
                    title: 'Ngày diễn ra',
                    key: 'age',
                    width: '28%',
                    ...this.getColumnSearchProps('age'),
                    render: (data) => {
                        return (
                            <Row>
                                <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                                <div>
                                    <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                                    <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                                </div>
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
                    title: 'Tác vụ',
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
                dataSource={cancelContest}
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
                title: 'Tên đề xuất',
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
                title: 'Đề xuất',
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
                                Chọn</span>
                        </div>
                    )
                }
            }
        ];
        return (
            <Table
                columns={columns}
                dataSource={proposals}
                showSorterTooltip={{ title: 'Sắp xếp tăng giảm' }}
                rowKey="eventKey1"
            />
        )
    }
    return (
        <Spin size="large" spinning={contests === null ? true : false}>
            <div>
                {/* Modal Select */}
                <Modal
                    destroyOnClose={true}
                    title={
                        <Row>
                            <Space size="middle"><div>Đề xuất bởi </div></Space>
                            <Avatar src={recordPro !== null ? recordPro.Manager.Image : null} style={{ marginLeft: 5 }}></Avatar>
                            <Space size="middle"><div style={{ fontWeight: '500', fontSize: 14, color: '#2A528A', marginLeft: 5 }}>{recordPro !== null ? recordPro.Manager.FullName : null}</div></Space>
                        </Row>
                    }
                    visible={visibleSelect}
                    onCancel={handleCancel}
                    width={1000}
                    footer={
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={showModalConfirm}>
                                Hoàn tất
                            </Button>
                        </Row>
                    }
                >
                    <CreateBySelectComponent record={recordPro} recordImage={recordImagePro} />
                </Modal>
                <Modal
                    title={<span style={{ fontSize: 18, fontWeight: 600 }}>Xác nhận</span>}
                    centered
                    icon={<ExclamationCircleOutlined />}
                    visible={modalConfirm}
                    onCancel={() => setModalConfirm(false)}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={() => setModalConfirm(false)}>Hủy </Button>
                            <Button form="editEvent" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">Có</Button>
                        </Row>
                    ]}
                ><span style={{ fontSize: '16px', fontWeight: 400 }}>Bạn có muốn tạo cuộc thi này không?</span>
                </Modal>
                {/* Modal Edit */}
                <Modal
                    destroyOnClose={true}
                    title={"Chỉnh sửa cuộc thi"}
                    visible={visibleEdit}
                    onCancel={handleCancel}
                    width={1000}
                    footer={
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={showModalConfirm}>
                                Hoàn tất
                            </Button>
                        </Row>
                    }
                >
                    <EditContestComponent record={record} recordImage={recordImage} />
                </Modal>
                <Modal
                    title={<span style={{ fontSize: 18, fontWeight: 600 }}>Xác nhận</span>}
                    centered
                    icon={<ExclamationCircleOutlined />}
                    visible={modalConfirm}
                    onCancel={() => setModalConfirm(false)}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={() => setModalConfirm(false)}>Hủy </Button>
                            <Button form="editEvent" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">Có</Button>
                        </Row>
                    ]}
                ><span style={{ fontSize: '16px', fontWeight: 400 }}>Bạn có muốn tạo cuộc thi này không?</span>
                </Modal>
                {/* Modal View */}
                <Modal
                    destroyOnClose={true}
                    title="Chi tiết"
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
                    title={<span style={{ fontSize: 18, fontWeight: 600 }}>Xác nhận</span>}
                    centered
                    icon={<ExclamationCircleOutlined />}
                    visible={visibleCancel}
                    onCancel={() => handleCancel()}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={() => handleCancel()}>Không </Button>
                            <Button loading={loadingButton} onClick={() => handleCancelContest(cancelContestId !== null && cancelContestId.Id)} type="primary">Có</Button>
                        </Row>
                    ]}
                > <div>Bạn có muốn hủy "{cancelContestId !== null && cancelContestId.Title}" không?</div>
                </Modal>
                {/* Modal check attendence */}
                <Modal
                    destroyOnClose={true}
                    title="Điểm danh sự kiện"
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
                    <CreateContestsModalComponent />
                    <Button shape="round" className="createButton" onClick={() => showModalCheck()} style={{ height: 36, marginLeft: 15, backgroundColor: '#23814F', border: 'none', color: 'white' }}><i class="fas fa-user-check"></i><span style={{ marginTop: 2, marginLeft: 8 }}>Điểm danh</span></Button>
                </Row>
                <Row gutter={15}>
                    <Col span={18}>
                        <Tabs type="card">
                            <TabPane tab={<div><i class="far fa-check-square" ></i>&nbsp;&nbsp;Cuộc thi đăng ký</div>} key="1" >
                                <Register />
                            </TabPane>
                            <TabPane tab={<div><i class="far fa-check-square" ></i>&nbsp;&nbsp;Cuộc thi sắp diễn ra</div>} key="2" >
                                <Ready />
                            </TabPane>
                            <TabPane tab={<div><i className="fas fa-spinner" ></i>&nbsp;&nbsp;Cuộc thi đang diễn ra</div>} key="3">
                                <Loading />
                            </TabPane>
                            <TabPane tab={<div><i className="fas fa-history" ></i>&nbsp;&nbsp;Lịch sử</div>} key="4" >
                                <History />
                            </TabPane>
                            <TabPane tab={<div><i class="far fa-times-circle"></i>&nbsp;&nbsp;Đã hủy</div>} key="5" >
                                <Cancel />
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={6}>
                        <p className="textEventAndProposal"><span className="textEventAndProposalChild" ><i className="far fa-lightbulb" />&nbsp;&nbsp;Cuộc thi đề xuất</span></p>
                        <Spin size="middle" spinning={proposals === null ? true : false}>
                            <Proposal />
                        </Spin>
                    </Col>
                </Row>
            </div>
        </Spin>
    )
}

export default ManageContestsComponent;