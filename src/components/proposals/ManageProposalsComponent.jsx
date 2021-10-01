import { Button, Col, Form, Input, Modal, Row, Space, Spin, Table, Tag, message } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import AccountService from '../../services/AccountService';
import ProposalService from '../../services/ProposalService';
import './style.less';
import ViewProposalComponent from './ViewProposalComponent';
export default function ManageProposalsComponent() {
    const history = useHistory();
    const [form] = Form.useForm();
    const [proposal, setProposal] = useState(null);
    const [approved, setApproved] = useState(null);
    const [disapproved, setDisapproved] = useState(null);
    const [proposalDetail, setProposalDetail] = useState(null);
    const [proposalImage, setProposalImage] = useState(null);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5)
    const [visibleApprove, setVisibleApprove] = useState(false);
    const [visibleDisapproved, setVisibleDisapproved] = useState(false);
    const [visibleView, setVisibleView] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const imageHolder = "https://via.placeholder.com/150";
    useEffect(() => {
        let result = [];
        ProposalService.getAllProposals()
            .then((res) => {
                res.data.forEach((data) => {
                    if (data.Status === 1) {
                        result.push(data)
                    }
                })
                setProposal(result)
            })
    }, [])
    useEffect(() => {
        let result = [];
        ProposalService.getAllProposals()
            .then((res) => {
                res.data.forEach((data) => {
                    if (data.Status === 2) {
                        result.push(data)
                    }
                })
                setApproved(result)
            })
    }, [])
    useEffect(() => {
        let result = [];
        ProposalService.getAllProposals()
            .then((res) => {
                res.data.forEach((data) => {
                    if (data.Status === 3) {
                        result.push(data)
                    }
                })
                setDisapproved(result)
            })
    }, [])
    const showModalView = () => {
        setVisibleView(true);
    };
    const showModalApprove = () => {
        setVisibleApprove(true);
    };
    const showModalDisapproved = () => {
        setVisibleDisapproved(true);
    }
    const handleOk = () => {
        setConfirmLoading(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        history.push('/de-xuat')
        form.resetFields();
        setVisibleView(false);
        setVisibleApprove(false);
        setVisibleDisapproved(false);
    };
    const Proposal = () => {
        const columns = [
            {
                title: 'Tên đề xuất',
                key: 'name',
                width: '35%',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3}> <div style={{ textAlign: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '60px', maxHeight: '50px' }} src={data.Image === 'string' ? imageHolder : data.Image} /></div></Col>
                            <Col span={21}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Loại đề xuất',
                dataIndex: 'Type',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cuộc thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 'sự kiện'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'Ngày',
                key: 'address',
                render: (data) => {
                    return (
                        <Row>
                            <div style={{ paddingTop: 15, fontSize: '0.5rem', width: '40px' }}><i class="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                            <div>
                                <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('L')}</div>
                                <div>Kết thúc:&nbsp;{moment(data.EndDate).format('L')}</div>
                            </div>
                        </Row>
                    )
                }
            },
            {
                title: 'Số lượng',
                key: 'join',
                render: (data) => {
                    let color = null
                    return (
                        <Tag color={color} key={data} style={{ fontSize: 14 }}>{data.MinParticipants} - {data.MaxParticipants}</Tag>
                    )
                }
            },
            {
                title: 'Các tác vụ',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <div className="eventDetailBtn" style={{ color: '#CCCC1B' }}
                            onClick={() => {
                                showModalView()
                                setProposalDetail(record)
                                let ex = record.Image.split("|")
                                if (ex.length > 1) {
                                    ex.pop()
                                }
                                setProposalImage(ex)
                            }}>
                            <i class="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi tiết</span>
                        </div>
                        <div className="approveEventBtn" style={{ color: '#3ECA90' }}
                            onClick={() => {
                                showModalApprove()
                                setProposalDetail(record)
                            }}>
                            <i class="far fa-thumbs-up"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Duyệt</span>
                        </div>
                        <div className="disapprovedEventBtn" style={{ color: '#FD7E89' }}
                            onClick={() => {
                                showModalDisapproved()
                                setProposalDetail(record)
                            }}
                        >
                            <i class="far fa-frown-open"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Không duyệt</span>
                        </div>
                    </Space >
                ),
            },
        ]
        return (
            <>
                <Table
                    rowKey="uid1"
                    columns={columns}
                    dataSource={proposal}
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
            </>
        )
    }
    const Approved = () => {
        const columns = [
            {
                title: 'Tên đề xuất',
                key: 'name',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ textAlign: 'center' }}> <div> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '60px', maxHeight: '50px' }} src={data.Image} /></div></Col>
                            <Col span={21}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15 }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Loại đề xuất',
                dataIndex: 'Type',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cuộc thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 'sự kiện'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'Tác vụ',
                key: 'action',
                width: '10%',
                render: (text, record) => (
                    <Space size="middle">
                        <a href="/#">Chọn</a>
                    </Space>
                ),
            },
        ]
        return (
            <Table
                rowKey="uid2"
                columns={columns}
                dataSource={approved}
                pagination={{ locale: { items_per_page: "/ trang" }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />
        )
    }
    const ApproveEventBodyModal = () => {
        return (
            <Form layout="vertical" form={form} onFinish={onFinishApprove} id="approveProposal" style={{ marginTop: '-10px', marginBottom: '-20px' }}>
                <div><span style={{ letterSpacing: 1, color: '#52524E' }}>Tên đề xuất:</span> &nbsp;<span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>{proposalDetail !== null && proposalDetail.Title}</span></div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Loại đề xuất:</span> &nbsp;{proposalDetail !== null && proposalDetail.Type === 1 ?
                    <Tag color='geekblue' key={proposalDetail !== null && proposalDetail.Type}> CUỘC THI </Tag> : <Tag color='green' key={proposalDetail !== null && proposalDetail.Type}> SỰ KIỆN </Tag>}</div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Thông báo <span style={{ color: 'green' }}>DUYỆT</span> đến người đề xuất:</span></div>
                <Form.Item hidden={true} name='id'>
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name='managerId'>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="reason" style={{ paddingTop: '5px' }}>
                    <Input.TextArea
                        placeholder="Nhập thông báo"
                        showCount maxLength={200}
                        spellCheck={false}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        )
    }
    const Disapproved = () => {
        const columns = [
            {
                title: 'Tên đề xuất',
                key: 'name',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ textAlign: 'center' }}> <div> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '40px', maxHeight: '40px' }} src={data.Image} /></div></Col>
                            <Col span={21}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Loại đề xuất',
                dataIndex: 'Type',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cuộc thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 'sự kiện'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'Tác vụ',
                key: 'action',
                width: '11%',
                render: (text, record) => (
                    <Space size="middle">
                        <a href="/#">Chi tiết</a>
                    </Space>
                ),
            },
        ]
        return (
            <Table
                rowKey="uid3"
                columns={columns}
                dataSource={disapproved}
                pagination={{ locale: { items_per_page: "/ trang" }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />
        )
    }
    const DisapprovedBodyModal = () => {
        return (
            <Form layout="vertical" form={form} onFinish={onFinishDisapproved} id="approveProposal" style={{ marginTop: '-10px', marginBottom: '-20px' }}>
                <div><span style={{ letterSpacing: 1, color: '#52524E' }}>Tên đề xuất:</span> &nbsp;<span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>{proposalDetail !== null && proposalDetail.Title}</span></div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Loại đề xuất:</span> &nbsp;{proposalDetail !== null && proposalDetail.Type === 1 ?
                    <Tag color='geekblue' key={proposalDetail !== null && proposalDetail.Type}> CUỘC THI </Tag> : <Tag color='green' key={proposalDetail !== null && proposalDetail.Type}> SỰ KIỆN </Tag>}</div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Thông báo <span style={{ color: 'red' }}>KHÔNG DUYỆT</span> đến người đề xuất:</span></div>
                <Form.Item hidden={true} name='id'>
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name='managerId'>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="reason" style={{ paddingTop: '5px' }}>
                    <Input.TextArea
                        placeholder="Nhập thông báo"
                        showCount maxLength={200}
                        spellCheck={false}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </Form.Item>
            </Form>
        )
    }
    const onFinishApprove = (values) => {
        console.log("Approve: ", values)
        ProposalService.approveProposal(values)
            .then((res) => {
                console.log(res.data)
                message.success("Duyệt đề xuất thành công")
                setTimeout(() => {
                    setVisibleApprove(false);
                    setConfirmLoading(false);
                    window.location.href = "/de-xuat"
                }, 1500);
            })
            .catch((err) => {
                message.error("Lỗi server, duyệt đề xuất không thành công")
                console.log(err)
            })
    }
    const onFinishDisapproved = (values) => {
        console.log("Disapproved: ", values)
        ProposalService.disapproveProposal(values)
            .then((res) => {
                console.log(res.data)
                message.success("Không duyệt đề xuất thành công")
                setTimeout(() => {
                    setVisibleApprove(false);
                    setConfirmLoading(false);
                    window.location.href = "/de-xuat"
                }, 1500);
            })
            .catch((err) => {
                message.error("Lỗi server, duyệt đề xuất không thành công")
                console.log(err)
            })
    }
    form.setFieldsValue({
        managerId: AccountService.getCurrentUser().Id,
        id: proposalDetail !== null && proposalDetail.Id
    })
    return (
        <>
            {/* View Modal */}
            <Modal
                destroyOnClose={true}
                title={"Chi tiết sự kiện"}
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
                <ViewProposalComponent record={proposalDetail} recordImage={proposalImage} />
            </Modal>
            {/* Approved Modal */}
            <Modal
                destroyOnClose={true}
                title="Xác nhận duyệt đề xuất"
                visible={visibleApprove}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button form="approveProposal" loading={confirmLoading} onClick={handleOk} type="primary" key="submit" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Row>
                ]}
            >
                <ApproveEventBodyModal />
            </Modal>
            {/* Disapproved Modal */}
            <Modal
                destroyOnClose={true}
                title="Xác nhận không duyệt đề xuất"
                visible={visibleDisapproved}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button form="approveProposal" loading={confirmLoading} onClick={handleOk} type="primary" key="submit" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Row>
                ]}
            >
                <DisapprovedBodyModal />
            </Modal>
            <div>
                <div><span className="proposalTitle">Các đề xuất</span></div>
                <div className="proposal" > <Spin size="middle" spinning={proposal === null ? true : false}><Proposal /></Spin></div>
                <Row gutter={30}>
                    <Col span="12">
                        <div><span className="proposalTitle">Đã được duyệt</span></div>
                        <div className="proposal" ><Spin size="middle" spinning={approved === null ? true : false} ><Approved /></Spin></div>
                    </Col>
                    <Col span="12">
                        <div><span className="proposalTitle">Không được duyệt</span></div>
                        <div className="proposal" ><Spin size="middle" spinning={disapproved === null ? true : false} ><Disapproved /></Spin></div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
