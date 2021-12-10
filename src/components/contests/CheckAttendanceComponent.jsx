import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Table, Input, Button, Space, Row, Col, Modal, Radio, message, Spin } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import ContestService from '../../services/ContestService';
export default function CheckAttendanceComponent() {
    const [events, setEvents] = useState(null)
    const [visibleCheck, setVisibleCheck] = useState(false);
    const [eventId, setEventId] = useState(0)
    const [record, setRecord] = useState(null)
    const check = []
    useEffect(() => {
        ContestService.getUserJoined(eventId).then((result) => {
            setRecord(result.data)
        })
            .catch((error) => console.log(error))
    }, [eventId])
    useEffect(() => {
        ContestService.getOngoingContests().then((response) => { setEvents(response.data) }).catch((error) => console.log(error))
    }, [])
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
                    title: 'Tên cuộc thi',
                    key: 'name',
                    render: (data) => {
                        return (
                            <Row gutter={15}>
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
                    render: (data) => {
                        return (
                            data.Status === 1 ? <Button type="primary" onClick={() => {
                                setVisibleCheck(true)
                                setEventId(data.Id)
                            }}>Điểm danh</Button> : <Button onClick={() => {
                                setVisibleCheck(true)
                                setEventId(data.Id)
                            }}>Sửa điểm danh</Button>
                        )
                    }
                },
            ];
            return <Table columns={columns} dataSource={events} pagination={false} />;
        }
    }
    const handleRadioYes = (data) => {
        const event = {
            contestEventId: eventId,
            userId: data.User.Id,
            type: 2
        }
        const array = check.findIndex(i => i.userId === data.User.Id)
        if (array !== -1) {
            var index = check.indexOf(data.User.Id);
            check.splice(index, 1);
        }
        else {
            check.push(event)
        }
    }
    const handleRadioNo = (data) => {
        const event = {
            contestEventId: eventId,
            userId: data.User.Id,
            type: 3
        }
        const array = check.findIndex(i => i.userId === data.User.Id)
        if (array !== -1) {
            var index = check.indexOf(data.User.Id);
            check.splice(index, 1);
        }
        else {
            check.push(event)
        }
    }
    const handleSubmitCheck = () => {
        return (
            axios.all([check.map((userId) => (
                ContestService.checkUser(userId.type, userId)
            ))])
                .then(axios.spread(() => {
                    message.success("Điểm danh thành công")
                    setTimeout(() => {
                        window.location.href = '/cuoc-thi'
                    }, 500)
                }))
                .catch(() => { message.error("Điểm danh không thành công") })
        )
    }
    const handleCancel = () => {
        setVisibleCheck(false);
    }
    const baseColumns = [
        {
            title: 'Họ và tên',
            key: 'name',
            render: (data) => {
                return (
                    <Row gutter={15}>
                        <Col span={4} style={{ textAlign: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxHeight: '50px' }} src={data.User.Image} /></Col>
                        <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.User.FullName}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            width: '20%',
            render: (data) => {
                return (
                    <div>{data.User.Phone}</div>
                )
            }
        },
        {
            title: 'Có mặt',
            key: 'address',
            width: '25%',
            render: (data) => {
                return (
                    <Radio.Group
                        defaultValue={data.Status === 2 ? "yes" : "no"}
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
                        style={{ marginBottom: 15 }}
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
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleSubmitCheck}>
                            Hoàn tất
                        </Button>
                    </Row>
                }
            >
                <Spin spinning={events === null ? true : false}>
                    <Check />
                </Spin>
            </Modal>
            <Spin spinning={events === null ? true : false}>
                <App />
            </Spin>
        </>
    )
}
