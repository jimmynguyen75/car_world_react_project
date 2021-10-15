import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Space, Row, Col, Modal, Radio, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import EventService from '../../services/EventService';
export default function CheckAttendanceComponent() {
    const [events, setEvents] = useState(null)
    const [visibleCheck, setVisibleCheck] = useState(false);
    const [eventId, setEventId] = useState(0)
    const [record, setRecord] = useState(null)
    const [status, setStatus] = useState(0)
    const [test, setTest] = useState([])
    const check = []
    useEffect(() => {
        EventService.getUserJoined(eventId).then((result) => {
            // let data = result.data.map((e) => e.User)
            setRecord(result.data)
        })
            .catch((error) => console.log(error))
    }, [eventId])
    // console.log("record: ", record.map((e) => e.User))
    useEffect(() => {
        EventService.getOngoingEvents().then((response) => { setEvents(response.data) }).catch((error) => console.log(error))
    }, [])
    useEffect(() => {
        events !== null && events.map((event) => {
            EventService.getUserJoined(event.Id).then((e) => {
                setTest(prevState => [...prevState, e.data])
            })
        })
    }, [events])
    test !== null && test.map((event) => {
        console.log("event: ", event.length)
    })
    class App extends React.Component {
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
                    ...this.getColumnSearchProps('name'),
                    render: (data) => {
                        return (
                            <Row gutter={5}>
                                <Col span={6}><img alt="" style={{ height: 50, width: '100%', objectFit: 'cover' }} src={data.Image} /></Col>
                                <Col span={18} style={{ display: 'flex', alignItems: 'center' }}><div>{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Số lượng',
                    key: 'total',
                    width: '20%',
                    render: (data) => {
                        // EventService.getUserJoined(data.Id).then((result) => { setTest(prevState => [...prevState, result.data]) })
                        return <div>{data.CurrentParticipants}</div>
                    }
                },
                {
                    title: 'Tác vụ',
                    key: 'address',
                    ...this.getColumnSearchProps('address'),
                    sorter: (a, b) => a.address.length - b.address.length,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        EventService.getUserJoined(data.Id).then((result) => {
                            if ((result.data.map((e) => e.User.Status)).indexOf(3) === -1) {
                                setStatus(1)
                            } else {
                                setStatus(2)
                            }
                        })
                        console.log("status:", status)
                        return (
                            status === 1 ?
                                <Button onClick={() => {
                                    setVisibleCheck(true)
                                    setEventId(data.Id)
                                }}>Điểm danh</Button> :
                                <Button onClick={() => {
                                    setVisibleCheck(true)
                                    setEventId(data.Id)
                                }}>Checked</Button>
                        )
                        // if (result.data.map((e) => e.User.Status).indexOf(1) === -1) {
                        //     <Button onClick={() => {
                        //         setVisibleCheck(true)
                        //         setEventId(data.Id)
                        //     }}>Checked</Button>
                        // } else {
                        //     <Button onClick={() => {
                        //         setVisibleCheck(true)
                        //         setEventId(data.Id)
                        //     }}>Not yet</Button>
                        // }
                        // if ()
                        // }).indexOf(1) === -1) {
                        //     <Button onClick={() => {
                        //         setVisibleCheck(true)
                        //         setEventId(data.Id)
                        //     }}>Checked</Button>
                        // } else {
                        //     
                        // }
                    }
                },
            ];
            return <Table columns={columns} dataSource={events} pagination={false} />;
        }
    }
    const handleRadioYes = (data) => {
        if (check.indexOf(data.User.Id) === -1) {
            check.push(data.User.Id)
        }
        console.log("check: ", check)
    }
    const handleRadioNo = (data) => {
        if (check.indexOf(data.User.Id) !== -1) {
            var index = check.indexOf(data.User.Id);
            console.log(index)
            check.splice(index, 1);
        }
        else {
            check.push(data.User.Id)
        }
        console.log("check: ", check)
    }
    const handleSubmitCheck = () => {
        check.map((value) => {
            const event = {
                eventId: eventId,
                userId: value
            }
            console.log(event)
            return (
                EventService.checkUser(event).then(() => { message.success("Điểm danh thành công") }).catch(() => { message.error("Không thành công") })
            )
        })
    }
    const baseColumns = [
        {
            title: 'Họ và tên',
            key: 'name',
            render: (data) => {
                return (
                    <Row gutter={5}>
                        <Col span={6}><img alt="" style={{ height: 50, width: '100%', objectFit: 'cover' }} src={data.User.Image} /></Col>
                        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}><div>{data.User.FullName}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
        },
        {
            title: 'Có mặt',
            key: 'address',
            width: '25%',
            render: (data) => {
                return (
                    <Radio.Group
                        defaultValue={data.Status === 1 ? "no" : "yes"}
                    >
                        <Radio value="yes" onClick={() => handleRadioYes(data)}>Có</Radio>
                        <Radio value="no" onClick={() => handleRadioNo(data)}>Không</Radio>
                    </Radio.Group>
                )
            }
        },
    ];
    class Check extends React.Component {
        constructor(props) {
            super(props);
            this.state = { filterTable: null, columns: baseColumns, baseData: record };
        }
        search = value => {
            const { baseData } = this.state;
            console.log("PASS", { value });
            const filterTable = baseData.filter(o =>
                Object.keys(o.User).some(k =>
                    String(o.User[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            this.setState({ filterTable });
        }
        render() {
            const { filterTable, columns, baseData } = this.state;
            return (
                <div>
                    <Input.Search
                        className="inputSearchCheck"
                        style={{ marginBottom: 5 }}
                        placeholder="Tìm kiếm..."
                        enterButton
                        onSearch={this.search}
                    />
                    <Table columns={columns} dataSource={filterTable === null ? baseData : filterTable} pagination={false} />
                </div>
            )
        }
    }
    return (
        <>
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="Điểm danh"
                visible={visibleCheck}
                onCancel={() => { setVisibleCheck(false) }}
                width={800}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button type="primary" onClick={handleSubmitCheck}>
                            Xong
                        </Button>
                    </Row>
                }
            >
                <Check />
            </Modal>
            <App />
        </>
    )
}
