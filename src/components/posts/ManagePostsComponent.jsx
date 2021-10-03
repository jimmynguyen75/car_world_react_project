import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './styles.less';
import { Tabs } from 'antd';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PostService from '../../services/PostService'
function ManagePostsComponent() {
    const imageHolder = "https://via.placeholder.com/150";
    const { TabPane } = Tabs;
    const history = useHistory();
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5)
    const [data, setData] = useState({ all: [], car: [], accessory: [], event: [], contest: [] })
    const createModal = () => {
        history.push("/tao-bai-dang");
    }
    useEffect(() => {
        const fetchData = async () => {
            const allEvent = await PostService.getPostByType(1);
            const cars = await PostService.getPostByType(1);
            const accessories = await PostService.getPostByType(2);
            const events = await PostService.getPostByType(3);
            const contests = await PostService.getPostByType(4);
            setData({ all: allEvent.data, car: cars.data, accessory: accessories.data, event: events.data, contest: contests.data })
        }
        fetchData()
    }, [])
    class All extends React.Component {
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
                    title: 'Title',
                    dataIndex: 'Title',
                    key: 'titleAll',
                    width: '30%',
                    ...this.getColumnSearchProps('Title'),
                },
                {
                    title: 'Age',
                    dataIndex: 'Title',
                    key: 'age',
                    width: '20%',
                    ...this.getColumnSearchProps('age'),
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                    ...this.getColumnSearchProps('address'),
                    sorter: (a, b) => a.address.length - b.address.length,
                    sortDirections: ['descend', 'ascend'],
                },
            ];
            return <Table
                rowKey="keyall"
                columns={columns}
                dataSource={data.all}
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
    class Car extends React.Component {
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
                    title: 'Tiêu đề',
                    key: 'titleCar',
                    width: '30%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={data.FearturedImage} /></Col>
                                <Col span={21}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Overview',
                    key: 'age',
                    width: '20%',
                    ...this.getColumnSearchProps('age'),
                },
                {
                    title: 'Người tạo',
                    key: 'address',
                    //sorter: (a, b) => a.CreatedDate - b.CreatedDate,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={24}><div>{data.CreatedBy}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <div className="eventDetailBtn" style={{ color: '#CCCC1B' }}
                                // onClick={() => {
                                //     showModalView()
                                //     setProposalDetail(record)
                                //     let ex = record.Image.split("|")
                                //     if (ex.length > 1) {
                                //         ex.pop()
                                //     }
                                //     setProposalImage(ex)
                                // }}
                                >
                                <i class="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi tiết</span>
                            </div>
                            <div className="approveEventBtn" style={{ color: '#3ECA90' }}
                                // onClick={() => {
                                //     showModalApprove()
                                //     setProposalDetail(record)
                                // }}
                                >
                                <i class="far fa-edit"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Sửa</span>
                            </div>
                            <div className="disapprovedEventBtn" style={{ color: '#FD7E89' }}
                                // onClick={() => {
                                //     showModalDisapproved()
                                //     setProposalDetail(record)
                                // }}
                            >
                                <i class="far fa-trash-alt"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Xóa</span>
                            </div>
                        </Space >
                    ),
                },
            ];
            return <Table
                rowKey="keyCar"
                columns={columns}
                dataSource={data.all}
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
    const Accessory = () => {
        return (<div></div>)
    }
    const Event = () => {
        return (<div></div>)
    }
    const Contest = () => {
        return (<div></div>)
    }
    return (
        <div>
            <Button type="primary" shape="round" onClick={createModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>Tạo bài đăng</span></Button>
            <Tabs type="card">
                <TabPane tab="Tất cả" key="all1">
                    <All />
                </TabPane>
                <TabPane tab="Xe" key="car2">
                    <Car />
                </TabPane>
                <TabPane tab="Phụ kiện" key="accessory3">
                    <Accessory />
                </TabPane>
                <TabPane tab="Sự kiện" key="event4">
                    <Event />
                </TabPane>
                <TabPane tab="Cuộc thi" key="contest5">
                    <Contest />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default ManagePostsComponent;