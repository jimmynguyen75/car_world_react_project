import React, { useEffect, useState } from 'react';
import "tui-calendar/dist/tui-calendar.css";
import './style.less';
import { Row, Col, Spin, Tag, Table, Modal, Button } from 'antd'
import EventService from '../../services/EventService';
import ContestService from '../../services/ContestService';
import PostService from '../../services/PostService';
import ProposalService from '../../services/ProposalService';
import moment from 'moment';
import 'moment/locale/vi';
import { useHistory } from "react-router-dom";
import ViewEventComponent from '../events/ViewEventComponent';
import ViewContestComponent from '../contests/ViewContestComponent';
export default function ManagerBodyDashboardComponent() {
    const history = useHistory();
    // const [attendance, setAttendace] = useState(null)
    const imgPlacehoder = 'https://via.placeholder.com/120';
    const [record, setRecord] = useState(null)
    const [visibleViewE, setVisibleViewE] = React.useState(false);
    const [visibleViewC, setVisibleViewC] = React.useState(false);
    const [recordImage, setRecordImage] = useState(null)
    const showModalViewE = () => {
        setVisibleViewE(true);
    };
    const showModalViewC = () => {
        setVisibleViewC(true);
    };
    const handleCancel = () => {
        setVisibleViewE(false);
        setVisibleViewC(false);
        history.push('/');
    };
    const [pageSize, setPageSize] = React.useState(5)
    const [page, setPage] = React.useState(1)
    const [data, setData] = useState({ contest: '', event: '', proposal: '', post: '', events: [], contests: [], eventReady: [], contestReady: [] })
    useEffect(() => {
        const fetchData = async () => {
            const events = await EventService.getAllEvents()
            const contests = await ContestService.getAllContests()
            const eventReady = await EventService.getPreparedEvents()
            const contestReady = await ContestService.getPreparedContests()
            const post = await PostService.getPostByMonth()
            const proposal = await ProposalService.getProposalByMonth()
            const contest = await EventService.getEventByMonth()
            const event = await ContestService.getContestByMonth()
            setData({ contest: contest.data, event: event.data, proposal: proposal.data, post: post.data, events: events.data, contests: contests.data, eventReady: eventReady.data, contestReady: contestReady.data })
        }
        fetchData()
    }, [])
    const columnsE = [
        {
            title: 'Tên sự kiện',
            render: (data) => {
                return (
                    <Row>
                        <Col span={6}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}><div className="titleHome" style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày diễn ra',
            width: '36%',
            render: (data) => {
                return (
                    <Row>
                        {/* <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div> */}
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Đã tham gia',
            sorter: (a, b) => a.CurrentParticipants - b.CurrentParticipants,
            sortDirections: ['descend', 'ascend'],
            render: (data) => {
                let color = '#4CBE9A';
                if (data.CurrentParticipants > 10) {
                    color = '#EBA3A4'
                }
                if (data.CurrentParticipants > 20) {
                    color = '#9DAD7F'
                }
                return (
                    <Tag style={{ fontSize: 15 }} color={color} key={data}>
                        <i className="fas fa-users"></i>&nbsp;&nbsp;{data.CurrentParticipants}
                    </Tag>
                )
            }
        },
        // {
        //     title: 'Thời hạn đăng ký',
        //     key: 'deadline',
        //     render: (data) => {
        //         const then = moment(data.EndRegister);
        //         const now = moment().format('yyyy-MM-DDTHH:mm:ss');
        //         const diff = then.diff(now)
        //         const result = (Math.round(diff / 86400) / 1000).toFixed()
        //         return (
        //             <div>
        //                 {/* <Countdown value={countdown} onFinish={onFinish} /> */}
        //                 {result} ngày còn lại
        //             </div>
        //         )
        //     }
        // },
        {
            title: 'Tác vụ',
            width: '10%',
            render: (record) => {
                return (
                    <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                        <i onClick={() => {
                            showModalViewE()
                            setRecord(record)
                            let ex = record.Image.split("|")
                            if (ex.length > 1) {
                                ex.pop();
                            }
                            setRecordImage(ex);
                        }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                    </div>
                )
            }
        },
    ]
    const columnsC = [
        {
            title: 'Tên cuộc thi',
            render: (data) => {
                return (
                    <Row>
                        <Col span={6}><img alt="" style={{ height: 50, maxWidth: '100%', objectFit: 'cover' }} src={data.Image === "string" ? imgPlacehoder : data.Image} /></Col>
                        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}><div className="titleHome" style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }}>{data.Title}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Ngày diễn ra',
            width: '36%',
            render: (data) => {
                return (
                    <Row>
                        {/* <div style={{ paddingTop: 15, width: '40px', fontSize: '0.5rem' }}><i className="far fa-clock fa-3x" style={{ color: '#F29191' }} /></div> */}
                        <div>
                            <div style={{ marginBottom: 5 }}>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.EndDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Đã tham gia',
            sorter: (a, b) => a.CurrentParticipants - b.CurrentParticipants,
            sortDirections: ['descend', 'ascend'],
            render: (data) => {
                let color = '#4CBE9A';
                if (data.CurrentParticipants > 10) {
                    color = '#EBA3A4'
                }
                if (data.CurrentParticipants > 20) {
                    color = '#9DAD7F'
                }
                return (
                    <Tag style={{ fontSize: 15 }} color={color} key={data}>
                        <i className="fas fa-users"></i>&nbsp;&nbsp;{data.CurrentParticipants}
                    </Tag>
                )
            }
        },
        // {
        //     title: 'Thời hạn đăng ký',
        //     key: 'deadline',
        //     render: (data) => {
        //         const then = moment(data.EndRegister);
        //         const now = moment().format('yyyy-MM-DDTHH:mm:ss');
        //         const diff = then.diff(now)
        //         const result = (Math.round(diff / 86400) / 1000).toFixed()
        //         return (
        //             <div>
        //                 {/* <Countdown value={countdown} onFinish={onFinish} /> */}
        //                 {result} ngày còn lại
        //             </div>
        //         )
        //     }
        // },
        {
            title: 'Tác vụ',
            width: '10%',
            render: (record) => {
                return (
                    <div style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                        <i onClick={() => {
                            showModalViewC()
                            setRecord(record)
                            let ex = record.Image.split("|")
                            if (ex.length > 1) {
                                ex.pop();
                            }
                            setRecordImage(ex);
                        }} className="far fa-eye fa-2x" style={{ color: '#5AA469', cursor: 'zoom-in' }}></i>
                    </div>
                )
            }
        },
    ]
    return (
        <>
            {/* Sự kiện */}
            <Modal
                destroyOnClose={true}
                title="Chi tiết sự kiện"
                visible={visibleViewE}
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
                <ViewEventComponent record={record} recordImage={recordImage} />
            </Modal>
            {/* Cuộc thi */}
            <Modal
                destroyOnClose={true}
                title="Chi tiết cuộc thi"
                visible={visibleViewC}
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
                <ViewContestComponent record={record} recordImage={recordImage} />
            </Modal>
            <Spin spinning={data.post === '' ? true : false}>
                <Row gutter={15}>
                    {/* <Col span={18}></Col>
                <Col span={6}>
                    {data.eventAttendance.length !== 0 ? <Row ><div>Sự kiện</div></Row> : null}
                    {data.consttestAttendance.length !== 0 ? <Row >Cuộc thi</Row> : null}
                    {data.eventReady.length !== 0 ? <Row >Sự kiện sắp diễn ra</Row> : null}
                    {data.contestReady.length !== 0 ? <Row >Cuộc thi sắp diễn ra</Row> : null}
                </Col> */}
                    <Col style={{ width: '25%' }}>
                        <div className="t1">
                            <Row gutter={15}>
                                <Col span={20}><span style={{ fontSize: '15px', letterSpacing: '1px' }}>BÀI ĐĂNG THÁNG {moment().format('MM')}</span></Col>
                                <Col span={4}><i className="far fa-clone" style={{ fontSize: 18, color: 'white', paddingTop: 4 }} /></Col>
                            </Row>
                            <div style={{ fontSize: 60, margin: '0px 0px 20px 0px', fontWeight: 'bold' }}>{data.post}<span style={{ fontSize: 18, letterSpacing: '2px', fontWeight: '400' }}>/tháng</span></div>
                        </div>
                    </Col>
                    <Col style={{ width: '25%' }}>
                        <div className="t2">
                            <Row gutter={15}>
                                <Col span={20}><span style={{ fontSize: '15px', letterSpacing: '1px' }}>ĐỀ XUẤT THÁNG {moment().format('MM')}</span></Col>
                                <Col span={4}><i className="far fa-lightbulb" style={{ fontSize: 18, color: 'white', paddingTop: 4 }} /></Col>
                            </Row>
                            <div style={{ fontSize: 60, margin: '0px 0px 20px 0px', fontWeight: 'bold' }}>{data.proposal}<span style={{ fontSize: 18, letterSpacing: '2px', fontWeight: '400' }}>/tháng</span></div>
                        </div>
                    </Col>
                    <Col style={{ width: '25%' }}>
                        <div className="t3">
                            <Row gutter={15}>
                                <Col span={20}><span style={{ fontSize: '15px', letterSpacing: '1px' }}>SỰ KIỆN THÁNG {moment().format('MM')}</span></Col>
                                <Col span={4}><i className="fas fa-calendar-alt" style={{ fontSize: 18, color: 'white', paddingTop: 4 }} /></Col>
                            </Row>
                            <div style={{ fontSize: 60, margin: '0px 0px 20px 0px', fontWeight: 'bold' }}>{data.event}<span style={{ fontSize: 18, letterSpacing: '2px', fontWeight: '400' }}>/tháng</span></div>
                        </div>
                    </Col>
                    <Col style={{ width: '25%' }}>
                        <div className="t4">
                            <Row gutter={15}>
                                <Col span={20}><span style={{ fontSize: '15px', letterSpacing: '1px' }}>CUỘC THI THÁNG {moment().format('MM')}</span></Col>
                                <Col span={4}><i className="fas fa-trophy" style={{ fontSize: 18, color: 'white', paddingTop: 4 }} /></Col>
                            </Row>
                            <div style={{ fontSize: 60, margin: '0px 0px 20px 0px', fontWeight: 'bold' }}>{data.contest}<span style={{ fontSize: 18, letterSpacing: '2px', fontWeight: '400' }}>/tháng</span></div>
                        </div>
                    </Col>
                </Row>
                <br />
                <Row gutter={15} style={{ marginBottom: 4 }}>
                    <Col span={12}>
                        <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#52BCC2', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-calendar-alt" style={{ fontSize: 16, color: 'white' }} />&nbsp;&nbsp;Sự kiện</span></div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#BFA2DB', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-trophy" style={{ fontSize: 16, color: 'white', paddingTop: 4 }} />&nbsp;&nbsp;Cuộc thi</span></div>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={12}>
                        <Table
                            rowKey="IdE"
                            columns={columnsE}
                            dataSource={data.events}
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
                    </Col>
                    <Col span={12}>
                        <Table
                            rowKey="IdC"
                            columns={columnsC}
                            dataSource={data.contests}
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
                    </Col>
                </Row>
            </Spin>
        </>
    )
}
