import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Row, Col } from 'antd';
import './style.less';
import moment from 'moment';
import 'moment/locale/vi';
import ProposalService from '../../services/ProposalService'
export default function ManageProposalsComponent() {
    const [proposal, setProposal] = useState(null);
    const columns = [
        {
            title: 'Tên đề xuất',
            key: 'name',
            render: (data) => {
                return (
                    <Row>
                        <Col span={3}> <div> <img alt="" style={{ height: 50, maxWidth: '100%' }} src={data.Image} /></div></Col>
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
                        <div style={{ paddingTop: 8, width: '40px' }}><i class="far fa-clock fa-2x" style={{ color: '#F29191' }} /></div>
                        <div>
                            <div>Bắt đầu:&nbsp;{moment(data.StartDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                            <div>Kết thúc:&nbsp;{moment(data.EndDate).format('LT')} - {moment(data.StartDate).format('L')}</div>
                        </div>
                    </Row>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        ProposalService.getAllProposals()
            .then((res) => {
                setProposal(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    const Proposal = () => {
        return (
            <Table
                columns={columns}
                dataSource={proposal}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20'] }}
            />
        )
    }
    return (
        <div>
            <div><span className="proposalTitle">Các đề xuất</span></div>
            <div className="proposal" ><Proposal /></div>
            <Row gutter={30}>
                <Col span="12">
                    <div><span className="proposalTitle">Đã được duyệt</span></div>
                    <div className="proposal" ><Proposal /></div>
                </Col>
                <Col span="12">
                    <div><span className="proposalTitle">Không được duyệt</span></div>
                    <div className="proposal" ><Proposal /></div>
                </Col>
            </Row>
        </div>
    )
}
