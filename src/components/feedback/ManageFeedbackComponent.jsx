import { Col, Row, Spin, Table, Avatar, Modal, Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AccountService from '../../services/AccountService';
import FeebackService from '../../services/FeebackService';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/vi';
function ManageFeedbackComponent() {
    const [data, setData] = useState({ CE: [], Exchange: [], ExchangeResponse: [] })
    const [form] = Form.useForm();
    const [user, setUser] = useState([])
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
    const columns = [
        {
            title: 'Tên',
            key: 'name',
            width: '65%',
            render: (data) => {
                return (
                    <Row>
                        <Avatar alt="" size="small" src={data !== null && data.FeedbackUser.Image}></Avatar>
                        <div style={{ marginLeft: 7 }}>{data.FeedbackUser.FullName}</div>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày gửi',
            key: 'date',
            render: (data) => {
                return (
                    <div>{moment(data.FeedbackDate).format('LT')} - {moment(data.FeedbackDate).format('L')}</div>
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
                            <Avatar alt="" size="small" src={dt.FeedbackUser.Image}></Avatar>
                            <div style={{ marginLeft: 7 }}>{dt.FeedbackUser.FullName}</div>
                        </Row>
                    </div>}

                    {dt !== null && <div style={{paddingBottom: 7}}><span style={{ letterSpacing: 1, color: '#52524E' }}>Nội dung:</span> &nbsp;
                        {dt.FeedbackContent}
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
            <Row gutter={15}>
                <Col span={8}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#52BCC2', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-calendar-alt " ></i>&nbsp;&nbsp;Sự kiện, Cuộc thi</span></div>
                    <Spin size="small" spinning={data.CE.length !== 0 ? false : true}>
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
                            dataSource={data.CE}
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
                <Col span={8}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#BFA2DB', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-trophy" ></i>&nbsp;&nbsp;Trao đổi</span></div>
                    <Spin size="small" spinning={data.Exchange.length !== 0 ? false : true}>
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
                <Col span={8}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#9E7777', padding: '4px 7px 4px 7px', color: 'white' }}><i class="fas fa-car"></i>&nbsp;&nbsp;Phản hồi trao đổi</span></div>
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
        </>
    )
}

export default ManageFeedbackComponent;
