import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Space, Spin, Table, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import AccountService from '../../services/AccountService';
import ProposalService from '../../services/ProposalService';
import './style.less';
import ViewProposalComponent from './ViewProposalComponent';
import CreateBySelectComponent from '../events/CreateBySelectComponent';
import CreateBySelectComponentContest from '../contests/CreateBySelectComponent';
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
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [visibleSelectContest, setVisibleSelectContest] = useState(false);
    const [loadingButton, setLoadingButton] = React.useState(false)
    const [recordPro, setRecordPro] = useState(null)
    const [recordImagePro, setRecordImagePro] = useState(null)
    const [modalConfirm, setModalConfirm] = useState(false);
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
    const showModalSelect = () => {
        setVisibleSelect(true);
    };
    const showModalSelectContest = () => {
        setVisibleSelectContest(true);
    };
    const showModalApprove = () => {
        setVisibleApprove(true);
    };
    const showModalConfirm = () => {
        setModalConfirm(true)
    };
    const showModalDisapproved = () => {
        setVisibleDisapproved(true);
    };
    const handleOk = () => {
        setConfirmLoading(true);
    };
    const handleOkEvent = () => {
        setLoadingButton(true);
        setTimeout(() => {
            setModalConfirm(false)
        }, 1000);
        setTimeout(() => {
            setLoadingButton(false);
        }, 1000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        history.push('/de-xuat')
        form.resetFields();
        setVisibleView(false);
        setVisibleApprove(false);
        setVisibleDisapproved(false);
        setVisibleSelect(false);
        setVisibleSelectContest(false);
    };
    const Proposal = () => {
        const columns = [
            {
                title: 'T??n ????? xu???t',
                key: 'name',
                width: '35%',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={5}> <div style={{ textAlign: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '100%', maxHeight: '50px' }} src={data.Image === 'string' ? imageHolder : data.Image} /></div></Col>
                            <Col span={19} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Lo???i ????? xu???t',
                dataIndex: 'Type',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cu???c thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 's??? ki???n'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'Ng??y',
                key: 'address',
                render: (data) => {
                    return (
                        <Row>
                            <div style={{ paddingTop: 15, fontSize: '0.5rem', width: '40px' }}><i class="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div>
                            <div>
                                <div style={{ marginBottom: 5 }}>B???t ?????u:&nbsp;{moment(data.StartDate).format('L')}</div>
                                <div>K???t th??c:&nbsp;{moment(data.EndDate).format('L')}</div>
                            </div>
                        </Row>
                    )
                }
            },
            {
                title: 'S??? l?????ng',
                key: 'join',
                width: '7%',
                render: (data) => {
                    let color = null
                    return (
                        <Tag color={color} key={data} style={{ fontSize: 14 }}>{data.MinParticipants} - {data.MaxParticipants}</Tag>
                    )
                }
            },
            {
                title: 'C??c t??c v???',
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
                            <i class="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi ti???t</span>
                        </div>
                        <div className="approveEventBtn" style={{ color: '#3ECA90' }}
                            onClick={() => {
                                showModalApprove()
                                setProposalDetail(record)
                            }}>
                            <i class="far fa-thumbs-up"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Duy???t</span>
                        </div>
                        <div className="disapprovedEventBtn" style={{ color: '#FD7E89' }}
                            onClick={() => {
                                showModalDisapproved()
                                setProposalDetail(record)
                            }}
                        >
                            <i class="far fa-frown-open"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Kh??ng duy???t</span>
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
                title: 'T??n ????? xu???t',
                key: 'name',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ textAlign: 'center' }}> <div> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '100%',  maxHeight: '50px' }} src={data.Image} /></div></Col>
                            <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15 }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Lo???i ????? xu???t',
                dataIndex: 'Type',
                width: '20%',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cu???c thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 's??? ki???n'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'T??c v???',
                key: 'action',
                width: '15%',
                render: (data) => {
                    if (data.Type === 1) {
                        return (
                            <div style={{ textAlign: 'center', cursor: 'copy' }}>
                                <span style={{ backgroundColor: '#A685E2', padding: '3px 12px', color: 'white', borderRadius: 5 }}
                                    onClick={() => {
                                        showModalSelectContest()
                                        setRecordPro(data)
                                        let ex = data.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImagePro(ex);
                                    }}>
                                    Ch???n</span>
                            </div>
                        )
                    }
                    if (data.Type === 2) {
                        return (
                            <div style={{ textAlign: 'center', cursor: 'copy' }}>
                                <span style={{ backgroundColor: '#5AA469', padding: '3px 12px', color: 'white', borderRadius: 5 }}
                                    onClick={() => {
                                        showModalSelect()
                                        setRecordPro(data)
                                        let ex = data.Image.split("|")
                                        if (ex.length > 1) {
                                            ex.pop();
                                        }
                                        setRecordImagePro(ex);
                                    }}>
                                    Ch???n</span>
                            </div>
                        )
                    }
                }
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
                <div><span style={{ letterSpacing: 1, color: '#52524E' }}>T??n ????? xu???t:</span> &nbsp;<span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>{proposalDetail !== null && proposalDetail.Title}</span></div>
                <div style={{ paddingTop: '10px', paddingBottom: '20px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Lo???i ????? xu???t:</span> &nbsp;{proposalDetail !== null && proposalDetail.Type === 1 ?
                    <Tag color='geekblue' key={proposalDetail !== null && proposalDetail.Type}> CU???C THI </Tag> : <Tag color='green' key={proposalDetail !== null && proposalDetail.Type}> S??? KI???N </Tag>}
                </div>
                {/* <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Th??ng b??o <span style={{ color: 'green' }}>DUY???T</span> ?????n ng?????i ????? xu???t:</span></div> */}
                <Form.Item hidden={true} name='id'>
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name='managerId'>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="reason" hidden={true} style={{ paddingTop: '5px' }}>
                    <Input.TextArea
                        placeholder="Nh???p th??ng b??o"
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
                title: 'T??n ????? xu???t',
                key: 'name',
                render: (data) => {
                    return (
                        <Row>
                            <Col span={3} style={{ textAlign: 'center' }}> <div> <img alt="" style={{ height: 'auto', width: 'auto', margin: 'auto', maxWidth: '100%', maxHeight: '40px' }} src={data.Image} /></div></Col>
                            <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                        </Row>
                    )
                }
            },
            {
                title: 'Lo???i ????? xu???t',
                dataIndex: 'Type',
                width: '20%',
                key: 'age',
                render: (data) => {
                    let color = null;
                    let text = null;
                    if (data === 1) {
                        color = 'geekblue'
                        text = 'cu???c thi'
                    }
                    if (data === 2) {
                        color = 'green'
                        text = 's??? ki???n'
                    }
                    return (
                        <Tag color={color} key={data}>
                            {text.toUpperCase()}
                        </Tag>
                    )
                }
            },
            {
                title: 'T??c v???',
                key: 'action',
                width: '15%',
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
                            <i class="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi ti???t</span>
                        </div>
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
            <Form layout="vertical" form={form} onFinish={onFinishDisapproved} id="disApproveProposal" style={{ marginTop: '-10px', marginBottom: '-20px' }}>
                <div><span style={{ letterSpacing: 1, color: '#52524E' }}>T??n ????? xu???t:</span> &nbsp;<span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>{proposalDetail !== null && proposalDetail.Title}</span></div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>Lo???i ????? xu???t:</span> &nbsp;{proposalDetail !== null && proposalDetail.Type === 1 ?
                    <Tag color='geekblue' key={proposalDetail !== null && proposalDetail.Type}> CU???C THI </Tag> : <Tag color='green' key={proposalDetail !== null && proposalDetail.Type}> S??? KI???N </Tag>}</div>
                <div style={{ paddingTop: '10px' }}><span style={{ letterSpacing: 1, color: '#52524E' }}>L?? do <span style={{ color: 'red' }}>KH??NG DUY???T</span> ?????n ng?????i ????? xu???t:</span></div>
                <Form.Item hidden={true} name='id'>
                    <Input></Input>
                </Form.Item>
                <Form.Item hidden={true} name='managerId'>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="reason" style={{ paddingTop: '5px' }}>
                    <Input.TextArea
                        placeholder="Nh???p l?? do"
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
                message.success("Duy???t ????? xu???t th??nh c??ng")
                setTimeout(() => {
                    setVisibleApprove(false);
                    setConfirmLoading(false);
                    window.location.href = "/de-xuat"
                }, 500);
            })
            .catch((err) => {
                message.error("Duy???t ????? xu???t kh??ng th??nh c??ng")
                console.log(err)
            })
    }
    const onFinishDisapproved = (values) => {
        console.log("Disapproved: ", values)
        ProposalService.disapproveProposal(values)
            .then((res) => {
                console.log(res.data)
                message.success("Kh??ng duy???t ????? xu???t th??nh c??ng")
                setTimeout(() => {
                    setVisibleApprove(false);
                    setConfirmLoading(false);
                    window.location.href = "/de-xuat"
                }, 500);
            })
            .catch((err) => {
                message.error("Kh??ng duy???t ????? xu???t kh??ng th??nh c??ng")
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
                title={"Chi ti???t ????? xu???t"}
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
                title="X??c nh???n duy???t ????? xu???t"
                visible={visibleApprove}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button form="approveProposal" loading={confirmLoading} onClick={handleOk} type="primary" key="submit" htmlType="submit">
                            X??c nh???n
                        </Button>
                    </Row>
                ]}
            >
                <ApproveEventBodyModal />
            </Modal>
            {/* Disapproved Modal */}
            <Modal
                destroyOnClose={true}
                title="X??c nh???n kh??ng duy???t ????? xu???t"
                visible={visibleDisapproved}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button form="disApproveProposal" loading={confirmLoading} onClick={handleOk} type="primary" key="submit" htmlType="submit">
                            X??c nh???n
                        </Button>
                    </Row>
                ]}
            >
                <DisapprovedBodyModal />
            </Modal>
            {/* Select Contest Modal */}
            <Modal
                destroyOnClose={true}
                title={
                    <Row>
                        <Space size="middle"><div>????? xu???t b???i </div></Space>
                        <Avatar src={recordPro !== null ? recordPro.User.Image : null} style={{ marginLeft: 5 }}></Avatar>
                        <Space size="middle"><div style={{ fontWeight: '500', fontSize: 14, color: '#2A528A', marginLeft: 5 }}>{recordPro !== null ? recordPro.User.FullName : null}</div></Space>
                    </Row>
                }
                visible={visibleSelectContest}
                onCancel={handleCancel}
                width={1000}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" onClick={showModalConfirm}>
                            Ho??n t???t
                        </Button>
                    </Row>
                }
            >
                <CreateBySelectComponentContest record={recordPro} recordImage={recordImagePro} />
            </Modal>
            {/* Select Event Modal */}
            <Modal
                destroyOnClose={true}
                title={
                    <Row>
                        <Space size="middle"><div>????? xu???t b???i </div></Space>
                        <Avatar src={recordPro !== null ? recordPro.User.Image : null} style={{ marginLeft: 5 }}></Avatar>
                        <Space size="middle"><div style={{ fontWeight: '500', fontSize: 14, color: '#2A528A', marginLeft: 5 }}>{recordPro !== null ? recordPro.User.FullName : null}</div></Space>
                    </Row>
                }
                visible={visibleSelect}
                onCancel={handleCancel}
                width={1000}
                footer={
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" onClick={showModalConfirm}>
                            Ho??n t???t
                        </Button>
                    </Row>
                }
            >
                <CreateBySelectComponent record={recordPro} recordImage={recordImagePro} />
            </Modal>
            <Modal
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>X??c nh???n</span>}
                centered
                icon={<ExclamationCircleOutlined />}
                visible={modalConfirm}
                onCancel={() => setModalConfirm(false)}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={() => setModalConfirm(false)}>H???y </Button>
                        <Button form="editEvent" loading={loadingButton} onClick={handleOkEvent} type="primary" key="submit" htmlType="submit">C??</Button>
                    </Row>
                ]}
            ><span style={{ fontSize: '16px', fontWeight: 400 }}>B???n c?? mu???n t???o s??? ki???n n??y kh??ng?</span>
            </Modal>
            <div>
                <div><span className="proposalTitle">C??c ????? xu???t</span></div>
                <div className="proposal" > <Spin size="middle" spinning={proposal === null ? true : false}><Proposal /></Spin></div>
                <Row gutter={30} style={{ marginBottom: 30 }}>
                    <Col span="12">
                        <div><span className="proposalTitle">???? ???????c duy???t</span></div>
                        <div className="proposal" ><Spin size="middle" spinning={approved === null ? true : false} ><Approved /></Spin></div>
                    </Col>
                    <Col span="12">
                        <div><span className="proposalTitle">Kh??ng ???????c duy???t</span></div>
                        <div className="proposal" ><Spin size="middle" spinning={disapproved === null ? true : false} ><Disapproved /></Spin></div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
