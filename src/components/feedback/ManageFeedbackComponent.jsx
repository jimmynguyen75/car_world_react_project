import { Avatar, Button, Col, Form, Input, message, Modal, Row, Spin, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import FeebackService from '../../services/FeebackService';
import ExchangeService from '../../services/ExchangeService';
import AccountService from '../../services/AccountService'
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
    const [test, setTest] = useState([])
    const [testEx, setTestEx] = useState([])
    const [car, setCar] = useState([])
    const [accessory, setAccessory] = useState([])
    const handleCancel = () => {
        setVisible(false);
        history.push('/phan-hoi')
    };
    //Effect
    useEffect(() => {
        const fetchData = async () => {
            let car = []
            let accessory = []
            const CE = await FeebackService.getCE();
            const Exchange = await FeebackService.getExchange();
            const ExchangeResponse = await FeebackService.getExchangeResponse();
            Exchange.data.forEach((filter) => {
                if (filter.Exchanges.Type === 1) {
                    car.push(filter)
                }
                if (filter.Exchanges.Type === 2) {
                    accessory.push(filter)
                }
            })
            setCar(car)
            setAccessory(accessory)
            setData({ CE: CE.data, Exchange: Exchange.data, ExchangeResponse: ExchangeResponse.data })
        }
        fetchData()
    }, [])
    useEffect(() => {
        let exchange = []
        FeebackService.getExchangeResponse().then((response) => {
            response.data.forEach((filter) => {
                filter.ExchangeResponses.map((data) => {
                    ExchangeService.getExchangeById(data.ExchangeId).then((result) => {
                        exchange.push(result.data)
                    })
                })
            })
            setTestEx(exchange)
        })
    }, [])
    useEffect(() => {
        let contests = []
        let events = []
        let test = []
        FeebackService.getCE()
            .then((result1) => {
                result1.data.forEach((data1) => {
                    data1.ContestEventRegisters.map((data) => {
                        FeebackService.getCEById(data.ContestEventId).then((result) => {
                            test.push(result.data)
                            if (result.data.Type === 1) {
                                events.push(data1)
                            }
                            if (result.data.Type === 2) {
                                contests.push(data1)
                            }
                        })
                    })
                })
                setTimeout(() => { setCE({ event: events, contest: contests }) }, 1000)
                setTest(test)
            })
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
            title: 'Tên sự kiện',
            key: 'date',
            render: (data1) => {
                let ok = ''
                test.map((data) => {
                    if (data.Id === data1.ContestEventRegisters.ContestEventId) {
                        ok = data
                    }
                })
                return (
                    <Row>
                        <Col span={5}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={ok.Image === "string" ? imgPlacehoder : ok.Image} /></Col>
                        <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{ok.Title}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày diễn ra',
            key: 'da',
            width: '25%',
            render: (data) => {
                let ok = ''
                test.map((dataT) => {
                    if (dataT.Id === data.ContestEventRegisters.ContestEventId) {
                        ok = dataT
                    }
                })
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(ok.StartDate).format('LT')} - {moment(ok.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(ok.EndDate).format('LT')} - {moment(ok.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Địa điểm diễn ra',
            key: 'date',
            render: (data1) => {
                let ok = ''
                test.map((data) => {
                    if (data.Id === data1.ContestEventRegisters.ContestEventId) {
                        ok = data
                    }
                })
                return (
                    <div>{ok.Venue}</div>
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
            render: (data1) => {
                let ok = ''
                test.map((data) => {
                    if (data.Id === data1.ContestEventRegisters.ContestEventId) {
                        ok = data
                    }
                })
                return (
                    <Row>
                        <Col span={5}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={ok.Image === "string" ? imgPlacehoder : ok.Image} /></Col>
                        <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{ok.Title}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày diễn ra',
            key: 'da',
            width: '25%',
            render: (data) => {
                let ok = ''
                test.map((dataT) => {
                    if (dataT.Id === data.ContestEventRegisters.ContestEventId) {
                        ok = dataT
                    }
                })
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(ok.StartDate).format('LT')} - {moment(ok.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(ok.EndDate).format('LT')} - {moment(ok.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Địa điểm diễn ra',
            key: 'date',
            render: (data1) => {
                let ok = ''
                test.map((data) => {
                    if (data.Id === data1.ContestEventRegisters.ContestEventId) {
                        ok = data
                    }
                })
                return (
                    <div>{ok.Venue}</div>
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
            key: 'nameEx',
            render: (data) => {
                return (
                    <div>{data.Exchanges.Title}</div>
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
                    <div>{convertFeedbackIDToName(data.Exchanges.Type)}</div>
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
                testEx.map((data1) => {
                    if (data1.Id === data.ExchangeResponses.ExchangeId) {
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
                testEx.map((data1) => {
                    if (data1.Id === data.ExchangeResponses.ExchangeId) {
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
                {/* {dt !== null && <div><span style={{ letterSpacing: 1, color: '#52524E' }}>Trả lời:</span> &nbsp;
                    {dt.ReplyContent}
                </div>} */}
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
                </Form>
            </Modal>
            <Tabs type="card">
                <TabPane tab={<div><i class="fas fa-calendar-alt" ></i>&nbsp;&nbsp;Sự kiện</div>} key="1" >
                    <Spin size="small" spinning={CE.event.length !== 0 ? false : true}>
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        setVisible(true)
                                        setDt(record)
                                    }, // click row
                                };
                            }}
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
                    <Spin size="small" spinning={CE.contest.length !== 0 ? false : true}>
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        setVisible(true)
                                        setDt(record)
                                    }, // click row
                                };
                            }}
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
                            <Spin size="small" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                setVisible(true)
                                                setDt(record)
                                            }, // click row
                                        };
                                    }}
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
                            <Spin size="small" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                setVisible(true)
                                                setDt(record)
                                            }, // click row
                                        };
                                    }}
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
