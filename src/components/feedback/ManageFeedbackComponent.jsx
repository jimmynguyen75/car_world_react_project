import { Avatar, Button, Col, Form, Input, message, Modal, Row, Spin, Table, Tabs } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import FeebackService from '../../services/FeebackService';
function ManageFeedbackComponent() {
    const { TabPane } = Tabs;
    const [data, setData] = useState({ CE: [], Exchange: [], ExchangeResponse: [] })
    const [CE, setCE] = useState({ event: [], contest: [] })
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = React.useState(5)
    const [page, setPage] = React.useState(1)
    const [dt, setDt] = useState(null)
    const [visible, setVisible] = React.useState(false);
    const history = useHistory();
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
    // useEffect(() => {
    //     let event = []
    //     let contest = []
    //     FeebackService.getCE()
    //         .then((result) => {
    //             result.data.forEach((data) => {
    //                 data.ContestEventRegisters.forEach((data) => {
    //                     FeebackService.getCEById(data.ContestEventId)
    //                         .then((result) => {
    //                             if (result.data.Type === 1) {
    //                                 event.push(result.data)
    //                                 console.log("event ", result.data[0]    )
    //                             }
    //                             if (result.data.Type === 2) {
    //                                 console.log("contest ", result.data.ContestEventRegisters[0].ContestEventId)
    //                                 contest.push(result.data)
    //                             }
    //                             setCE({ event: event, contest: contest })
    //                         })
    //                 })
    //             })
    //         })
    // }, [])
    useEffect(() => {
        let contests = []
        let events = []
        FeebackService.getCE()
            .then((result) => {
                result.data.forEach((data1) => {
                    data1.ContestEventRegisters.map((data) => {
                        FeebackService.getCEById(data.ContestEventId).then((result) => {
                            if (result.data.Type === 1) {
                                events.push(data1)
                            }
                            if (result.data.Type === 2) {
                                contests.push(data1)
                            }
                        })
                    })
                })
                setTimeout(() => { setCE({ event: events, contest: contests }) }, 500)
            })
    }, [])
    console.log(CE)
    // async function axiosID(id) {
    //     const response = await FeebackService.getCEById(id)
    //     return response.data.Title
    // }
    const onFinish = (values) => {
        console.log(values)
        FeebackService.replyFeedback(values.id, values)
            .then(() => {
                message.success("Gửi thành công")
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            })
            .catch(() => {
                message.error("Gửi không thành công")
            })
    }
    // useEffect(() => {
    //     data.CE.map((event) => {
    //         AccountService.getUserById(event.FeedbackUserId).then((response) => (setUser(response.data))).catch((error) => console.log(error))
    //     })
    // }, [data])
    // console.log("user: ", user)
    // let ok = [0]
    // axiosID(data.ContestEventRegisters[0].ContestEventId)
    //     .then(a => {
    //         ok.push('ok')
    //     })
    //     .catch(err => console.log(err))
    // console.log('Data: ', ok[0])
    const columns = [
        {
            title: 'Tên',
            key: 'name',
            width: '65%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="small" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ marginLeft: 7 }}>{data !== null && data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Loại',
            key: 'date',
            render: (data) => {
                FeebackService.getCEById(data.ContestEventRegisters[0].ContestEventId)
                    .then((result) => {
                        console.log(result.data.Title)
                        return (result.data.Title)

                    })
                    .catch((error) => {
                        console.error(error);
                    })
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
        replyUserId: dt !== null && dt.FeedbackUserId,
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
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" form="respone" key="submit" htmlType="submit" >
                            Gửi
                        </Button>
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
                        <Form.Item name="replyContent" style={{ paddingTop: '5px' }}>
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
                                        console.log(record)
                                        setVisible(true)
                                        setDt(record)
                                    }, // click row
                                };
                            }}
                            columns={columns}
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
                                        console.log(record)
                                        setVisible(true)
                                        setDt(record)
                                    }, // click row
                                };
                            }}
                            columns={columns}
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
                <TabPane tab={<div><i class="fa fa-exchange" ></i>&nbsp;&nbsp;Trao đổi</div>} key="3" >
                    <Row gutter={15}>
                        <Col span={12}>
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#9E7777', padding: '4px 7px 4px 7px', color: 'white' }}><i class="fas fa-car"></i>&nbsp;&nbsp;Trao đổi xe</span></div>
                            <Spin size="small" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                console.log(record)
                                                setVisible(true)
                                                setDt(record)
                                            }, // click row
                                        };
                                    }}
                                    columns={columns}
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
                        <Col span={12}>
                            <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#87AAAA', padding: '4px 7px 4px 7px', color: 'white' }}><i class="far fa-life-ring"></i>&nbsp;&nbsp;Trao phụ kiện</span></div>
                            <Spin size="small" spinning={data.ExchangeResponse.length !== 0 ? false : true}>
                                <Table
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                console.log(record)
                                                setVisible(true)
                                                setDt(record)
                                            }, // click row
                                        };
                                    }}
                                    columns={columns}
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
