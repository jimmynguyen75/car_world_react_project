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
                message.success("G???i ph???n h???i th??nh c??ng")
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            })
            .catch(() => {
                message.error("G???i ph???n h???i kh??ng th??nh c??ng")
            })
        console.log("value: ", values)
    }
    const columnsE = [
        {
            title: 'T??n ng?????i g???i',
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
            title: 'T??n s??? ki???n',
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
            title: 'Ng??y di???n ra',
            key: 'da',
            width: '22%',
            render: (ok) => {
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(ok.ContestEvent.StartDate).format('LT')} - {moment(ok.ContestEvent.StartDate).format('L')}</div>
                            <div>K???t th??c:&nbsp;{moment(ok.ContestEvent.EndDate).format('LT')} - {moment(ok.ContestEvent.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: '?????a ??i???m di???n ra',
            key: 'date',
            render: (ok) => {
                return (
                    <div>{ok.ContestEvent.Venue}</div>
                )
            }
        },
        {
            title: 'Tr???ng th??i',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ng??y g???i',
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
            title: 'T??n ng?????i g???i',
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
            title: 'T??n cu???c thi',
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
            title: 'Ng??y di???n ra',
            key: 'da',
            width: '25%',
            render: (ok) => {
                return (
                    <Row>
                        <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(ok.ContestEvent.StartDate).format('LT')} - {moment(ok.ContestEvent.StartDate).format('L')}</div>
                            <div>K???t th??c:&nbsp;{moment(ok.ContestEvent.EndDate).format('LT')} - {moment(ok.ContestEvent.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: '?????a ??i???m di???n ra',
            key: 'date',
            render: (ok) => {
                return (
                    <div>{ok.ContestEvent.Venue}</div>
                )
            }
        },
        {
            title: 'Tr???ng th??i',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 24, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ng??y g???i',
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
            title: 'T??n ng?????i g???i',
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
            title: 'T??n giao d???ch',
            key: 'nameEx123',
            render: (data) => {
                return (
                    <div>{data.Exchange.Title}</div>
                )
            }
        },
        {
            title: 'Lo???i giao d???ch',
            key: 'nameEx',
            render: (data) => {
                function convertFeedbackIDToName(id) {
                    if (id === 1) {
                        return <Tag color={'geekblue'} key={data}>
                            XE
                        </Tag>
                    } else if (id === 2) {
                        return <Tag color={'green'} key={data}>
                            PH??? KI???N
                        </Tag>
                    }
                }
                return (
                    <div>{convertFeedbackIDToName(data !== null && data.Exchange.Type)}</div>
                )
            }
        },
        {
            title: 'Tr???ng th??i',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ng??y g???i',
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
            title: 'T??n ng?????i g???i',
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
            title: 'T??n giao d???ch',
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
            title: 'Lo???i giao d???ch',
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
                            PH??? KI???N
                        </Tag>
                    }
                }
                return (
                    <div>{convertFeedbackIDToName(ok.Type)}</div>
                )
            }
        },
        {
            title: 'Tr???ng th??i',
            key: 'status',
            render: (data) => {
                return (
                    data.ReplyUser !== null ? <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} /></div> :
                        <div style={{ textAlign: 'center' }}><CheckCircleOutlined style={{ fontSize: 18, color: 'red' }} /></div>
                )
            }
        },
        {
            title: 'Ng??y g???i',
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
                title={"Tr??? l???i ph???n h???i"}
                visible={visible}
                onCancel={handleCancel}
                width={600}
                okText="Ho??n t???t"
                cancelText="H???y"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        {dt !== null && (dt.ReplyContent === null ?
                            <div><Button onClick={handleCancel}>
                                H???y
                            </Button>
                                <Button type="primary" form="respone" key="submit" htmlType="submit" >
                                    G???i
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
                            <span style={{ letterSpacing: 1, color: '#52524E' }}>T??n ng?????i g???i:</span> &nbsp; &nbsp;
                            <Avatar alt="" size="small" src={dt !== null && dt.FeedbackUser.Image}></Avatar>
                            <div style={{ marginLeft: 7 }}>{dt !== null && dt.FeedbackUser.FullName}</div>
                        </Row>
                    </div>}

                    {dt !== null && <div style={{ paddingBottom: 7 }}><span style={{ letterSpacing: 1, color: '#52524E' }}>N???i dung:</span> &nbsp;
                        {dt !== null && dt.FeedbackContent}
                    </div>}
                    {dt !== null && (dt.ReplyUser !== null && (
                        <div style={{ paddingBottom: 7 }}>
                            <Row>
                                T??n qu???n l?? ph???n h???i: &nbsp; &nbsp;{dt !== null && (dt.ReplyUser !== null && (
                                    <Row>
                                        <Avatar alt="" size="small" src={dt.ReplyUser.Image}></Avatar>
                                        <div style={{ marginLeft: 7 }}>{dt.ReplyUser.FullName}</div>
                                    </Row>
                                ))}
                            </Row>
                        </div>))}
                    <div style={{marginBottom: 10}}>
                        <span style={{ letterSpacing: 1, color: '#52524E' }}>Tr??? l???i:</span> &nbsp;
                        {dt !== null && (dt.ReplyContent === null ?
                            <Form.Item name="replyContent" style={{ paddingTop: '5px' }} rules={[{ required: true, message: "Tr??? l???i ph???n h???i kh??ng ???????c b??? tr???ng" }]}>
                                <Input.TextArea
                                    placeholder="Nh???p ph???n h???i"
                                    showCount maxLength={200}
                                    spellCheck={false}
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                />
                            </Form.Item> : dt.ReplyContent)}
                    </div>
                </Form>
            </Modal>
            <Tabs type="card">
                <TabPane tab={<div><i class="fas fa-calendar-alt" ></i>&nbsp;&nbsp;S??? ki???n</div>} key="1" >
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
                <TabPane tab={<div><i class="fas fa-trophy" ></i>&nbsp;&nbsp;Cu???c thi</div>} key="2" >
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
                <TabPane tab={<div><i class="fa fa-exchange" ></i>&nbsp;&nbsp;Giao d???ch</div>} key="3" >
                    <Row gutter={15}>
                        <Col span={12}>
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#9E7777', padding: '4px 7px 4px 7px', color: 'white' }}><i class="fas fa-car"></i>&nbsp;&nbsp;Ng?????i b??n</span></div>
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
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#87AAAA', padding: '4px 7px 4px 7px', color: 'white' }}><i class="far fa-life-ring"></i>&nbsp;&nbsp;Ng?????i mua</span></div>
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
