import { Avatar, Button, Col, Form, Input, message, Modal, Row, Spin, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import FeebackService from '../../services/FeebackService';
import ExchangeService from '../../services/ExchangeService';
import AccountService from '../../services/AccountService'
import { CheckCircleOutlined } from '@ant-design/icons';

function ManageFeedbackComponent() {
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const { TabPane } = Tabs;
    const [data, setData] = useState({ CE: [], Exchange: [], ExchangeResponse: [] })
    const [CE, setCE] = useState({ event: [], contest: [] })
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = React.useState(5)
    const [page, setPage] = React.useState(1)
    const [dt, setDt] = useState(null)
    const [visible, setVisible] = React.useState(false);
    const history = useHistory();
    const [testEx, setTestEx] = useState([])
    const handleCancel = () => {
        setVisible(false);
        history.push('/phan-hoi')
    };
    //Effect
    useEffect(() => {
        const fetchData = async () => {
            const CE = await FeebackService.getCE();
            const Exchange = await FeebackService.getExchange();
            const ExchangeResponse = await FeebackService.getExchangeResponse();
            setData({ CE: CE.data, Exchange: Exchange.data, ExchangeResponse: ExchangeResponse.data })
        }
        fetchData()
    }, [])
    useEffect(() => {
        let exchange = []
        FeebackService.getExchangeResponse().then((response) => {
            response.data.forEach((filter) => {
                ExchangeService.getExchangeById(filter.ExchangeResponse.ExchangeId).then((result) => {
                    exchange.push(result.data)
                })
            })
            setTestEx(exchange)
        })
    }, [])
    useEffect(() => {
        let contest = []
        let event = []
        FeebackService.getCE()
            .then((result) => {
                result.data.forEach((filter) => {
                    if (filter.ContestEvent.Type === 1) {
                        event.push(filter);
                    } else if (filter.ContestEvent.Type === 2) {
                        contest.push(filter);
                    }
                })
                setCE({ event: event, contest: contest })
            }).catch((err) => { console.log(err) })
    }, [])
    const onFinish = (values) => {
        FeebackService.replyFeedback(values.id, values)
            .then(() => {
                message.success("Gửi phản hồi thành công")
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            })
            .catch(() => {
                message.error("Gửi phản hồi không thành công")
            })
        console.log("value: ", values)
    }
    const columnsE = [
        {
            title: 'Tên người gửi',
            key: 'name',
            width: '15%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="middle" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data !== null && data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Tên sự kiện',
            key: 'date',
            render: (ok) => {
                return (
                    <Row>
                        <Col span={5}><img alt="" style={{ height: 40, maxWidth: '100%', objectFit: 'cover', width: 'auto' }} src={ok.ContestEvent.Image === "string" ? imgPlacehoder : ok.ContestEvent.Image} /></Col>
                        <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{ok.ContestEvent.Title}</div></Col>
                    </Row>
                )
            }
        },

        {
            title: 'Ngày diễn ra',
            key: 'da',
            width: '22%',
            render: (ok) => {
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(ok.ContestEvent.StartDate).format('LT')} - {moment(ok.ContestEvent.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(ok.ContestEvent.EndDate).format('LT')} - {moment(ok.ContestEvent.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Địa điểm diễn ra',
            key: 'date',
            render: (ok) => {
                return (
                    <div>{ok.ContestEvent.Venue}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ngày gửi',
            key: 'date',
            dataIndex: 'FeedbackDate',
            sorter: (a, b) => a.FeedbackDate.localeCompare(b.FeedbackDate),
            defaultSortOrder: 'descend',
            render: (data) => {
                return (
                    <div>{moment(data !== null && data).format('LT')} - {moment(data !== null && data).format('L')}</div>
                )
            }
        },
    ];
    const columnsC = [
        {
            title: 'Tên người gửi',
            key: 'name',
            width: '25%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="middle" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data !== null && data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Tên cuộc thi',
            key: 'date',
            render: (ok) => {
                return (
                    <Row>
                        <Col span={5}><img alt="" style={{ height: 40, maxWidth: '100%', objectFit: 'cover', width: 'auto' }} src={ok.ContestEvent.Image === "string" ? imgPlacehoder : ok.ContestEvent.Image} /></Col>
                        <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{ok.ContestEvent.Title}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày diễn ra',
            key: 'da',
            width: '25%',
            render: (ok) => {
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(ok.ContestEvent.StartDate).format('LT')} - {moment(ok.ContestEvent.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(ok.ContestEvent.EndDate).format('LT')} - {moment(ok.ContestEvent.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Địa điểm diễn ra',
            key: 'date',
            render: (ok) => {
                return (
                    <div>{ok.ContestEvent.Venue}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ngày gửi',
            key: 'date',
            dataIndex: 'FeedbackDate',
            sorter: (a, b) => a.FeedbackDate.localeCompare(b.FeedbackDate),
            defaultSortOrder: 'descend',
            render: (data) => {
                return (
                    <div>{moment(data !== null && data).format('LT')} - {moment(data !== null && data).format('L')}</div>
                )
            }
        },
    ];
    const columns1 = [
        {
            title: 'Tên người gửi',
            key: 'name',
            width: '30%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="middle" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data !== null && data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Tên giao dịch',
            key: 'nameEx123',
            render: (data) => {
                return (
                    <div>{data.Exchange.Title}</div>
                )
            }
        },
        {
            title: 'Loại giao dịch',
            key: 'nameEx',
            render: (data) => {
                function convertFeedbackIDToName(id) {
                    if (id === 1) {
                        return <Tag color={'geekblue'} key={data}>
                            XE
                        </Tag>
                    } else if (id === 2) {
                        return <Tag color={'green'} key={data}>
                            PHỤ KIỆN
                        </Tag>
                    }
                }
                return (
                    <div>{convertFeedbackIDToName(data !== null && data.Exchange.Type)}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ngày gửi',
            key: 'date',
            render: (data) => {
                return (
                    <div>{moment(data !== null && data.FeedbackDate).format('LT')} - {moment(data !== null && data.FeedbackDate).format('L')}</div>
                )
            }
        },
    ];
    const columns2 = [
        {
            title: 'Tên người gửi',
            key: 'name',
            width: '30%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="middle" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data !== null && data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Tên giao dịch',
            key: 'nameEx',
            render: (data) => {
                let ok = ''
                testEx.forEach((data1) => {
                    if (data1.Id === data.ExchangeResponse.ExchangeId) {
                        ok = data1
                    }
                })
                return (
                    <div>{ok.Title}</div>
                )
            }
        },
        {
            title: 'Loại giao dịch',
            key: 'nameEx',
            render: (data) => {
                let ok = ''
                testEx.forEach((data1) => {
                    if (data1.Id === data.ExchangeResponse.ExchangeId) {
                        ok = data1
                    }
                })
                function convertFeedbackIDToName(id) {
                    if (id === 1) {
                        return <Tag color={'geekblue'} key={data}>
                            XE
                        </Tag>
                    } else if (id === 2) {
                        return <Tag color={'green'} key={data}>
                            PHỤ KIỆN
                        </Tag>
                    }
                }
                return (
                    <div>{convertFeedbackIDToName(ok.Type)}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ngày gửi',
            key: 'date',
            render: (data) => {
                return (
                    <div>{moment(data !== null && data.FeedbackDate).format('LT')} - {moment(data !== null && data.FeedbackDate).format('L')}</div>
                )
            }
        },
    ];
    form.setFieldsValue({
        replyUserId: AccountService.getCurrentUser().Id,
        id: dt !== null && dt.Id,
        replyContent: dt !== null && dt.ReplyContent
    })
    return (
        <>
            <Modal
                title={"Trả lời phản hồi"}
                visible={visible}
                onCancel={handleCancel}
                width={600}
                okText="Hoàn tất"
                cancelText="Hủy"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        {dt !== null && (dt.ReplyContent === null ?
                            <div><Button onClick={handleCancel}>
                                Hủy
                            </Button>
                                <Button type="primary" form="respone" key="submit" htmlType="submit" >
                                    Gửi
                                </Button></div> : <Button type="primary" onClick={handleCancel}>
                                Xong
                            </Button>)}
                    </Row>
                ]}
            >
                <Form layout="vertical" form={form} onFinish={onFinish} id="respone" style={{ marginTop: '-10px', marginBottom: '-20px' }}>
                    <Form.Item hidden={true} name='id'>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item hidden={true} name='replyUserId'>
                        <Input></Input>
                    </Form.Item>
                    {dt !== null && <div>
                        <Row style={{ paddingBottom: 7 }}>
                            <span style={{ letterSpacing: 1, color: '#52524E' }}>Tên người gửi:</span> &nbsp; &nbsp;
                            <Avatar alt="" size="small" src={dt !== null && dt.FeedbackUser.Image}></Avatar>
                            <div style={{ marginLeft: 7 }}>{dt !== null && dt.FeedbackUser.FullName}</div>
                        </Row>
                    </div>}

                    {dt !== null && <div style={{ paddingBottom: 7 }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Nội dung:</span> &nbsp;
                        {dt !== null && dt.FeedbackContent}
                    </div>}
                    {dt !== null && (dt.ReplyUser !== null && (
                        <div style={{ paddingBottom: 7 }}>
                            <Row>
                                Tên quản lý phản hồi: &nbsp; &nbsp;{dt !== null && (dt.ReplyUser !== null && (
                                    <Row>
                                        <Avatar alt="" size="small" src={dt.ReplyUser.Image}></Avatar>
                                        <div style={{ marginLeft: 7 }}>{dt.ReplyUser.FullName}</div>
                                    </Row>
                                ))}
                            </Row>
                        </div>))}
                    <div style={{marginBottom: 10}}>
                        <span style={{ letterSpacing: 1, color: '#52524E' }}>Trả lời:</span> &nbsp;
                        {dt !== null && (dt.ReplyContent === null ?
                            <Form.Item name="replyContent" style={{ paddingTop: '5px' }} rules={[{ required: true, message: "Trả lời phản hồi không được bỏ trống" }]}>
                                <Input.TextArea
                                    placeholder="Nhập phản hồi"
                                    showCount maxLength={200}
                                    spellCheck={false}
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                />
                            </Form.Item> : dt.ReplyContent)}
                    </div>
                </Form>
            </Modal>
            <Tabs type="card">
                <TabPane tab={<div><i class="fas fa-calendar-alt" ></i>&nbsp;&nbsp;Sự kiện</div>} key="1" >
                    <Spin size="large" spinning={CE.event.length || CE.event ? false : true}>
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        setVisible(true)
                                        setDt(record)
                                        console.log(record)
                                    }, // click row
                                };
                            }}
                            rowKey="Id1"
                            columns={columnsE}
                            dataSource={CE.event}
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
                        />
                    </Spin>
                </TabPane>
                <TabPane tab={<div><i class="fas fa-trophy" ></i>&nbsp;&nbsp;Cuộc thi</div>} key="2" >
                    <Spin size="large" spinning={CE.contest.length || CE.contest ? false : true}>
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        setVisible(true)
                                        setDt(record)
                                        console.log(record)
                                    }, // click row
                                };
                            }}
                            rowKey="Id2"
                            columns={columnsC}
                            dataSource={CE.contest}
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
                        />
                    </Spin>
                </TabPane>
                <TabPane tab={<div><i class="fa fa-exchange" ></i>&nbsp;&nbsp;Giao dịch</div>} key="3" >
                    <Row gutter={15}>
                        <Col span={12}>
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#9E7777', padding: '4px 7px 4px 7px', color: 'white' }}><i class="fas fa-car"></i>&nbsp;&nbsp;Người bán</span></div>
                            <Spin size="large" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                setVisible(true)
                                                setDt(record)
                                                console.log(record)
                                            }, // click row
                                        };
                                    }}
                                    rowKey="Id3"
                                    columns={columns1}
                                    dataSource={data.Exchange}
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
                                />
                            </Spin>
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#87AAAA', padding: '4px 7px 4px 7px', color: 'white' }}><i class="far fa-life-ring"></i>&nbsp;&nbsp;Người mua</span></div>
                            <Spin size="large" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                setVisible(true)
                                                setDt(record)
                                                console.log(record)
                                            }, // click row
                                        };
                                    }}
                                    rowKey="Id4"
                                    columns={columns2}
                                    dataSource={data.ExchangeResponse}
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
                                />
                            </Spin>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </>
    )
}

export default ManageFeedbackComponent;
