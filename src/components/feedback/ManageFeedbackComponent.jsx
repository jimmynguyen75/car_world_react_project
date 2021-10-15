import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, Input, Modal, Row, Space, Spin, Table, Tabs, Tag } from 'antd';
import FeebackService from '../../services/FeebackService';
import AccountService from '../../services/AccountService';
function ManageFeedbackComponent() {
    const [data, setData] = useState({ events: [], contests: [], exCars: [], exAccessories: [], exResponse: [] })
    const [user, setUser] = useState([])
    //Effect
    useEffect(() => {
        const fetchData = async () => {
            const events = await FeebackService.getEvents();
            const contests = await FeebackService.getContests();
            const exCars = await FeebackService.getExchangeCars();
            const exAccessories = await FeebackService.getExchangeAccessories();
            const exResponse = await FeebackService.getExchangeResponse();
            setData({ events: events.data, contests: contests.data, exCars: exCars.data, exAccessories: exAccessories.data, exResponse: exResponse.data })
        }
        fetchData()
    }, [])
    useEffect(() => {
        data.events.map((event) => {
            AccountService.getUserById(event.FeedbackUserId).then((response) => (setUser(response.data))).catch((error) => console.log(error))
        })
    }, [data])
    console.log("user: ", user)
    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (data) => {
                return <div>{data.FeedbackUser.FullName}</div>
            }
        }
    ];
    return (
        <>
            <Row gutter={15}>
                <Col style={{ width: '20%' }}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#52BCC2', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-calendar-alt " ></i>&nbsp;&nbsp;Sự kiện</span></div>
                    <Spin size="small" spinning={data.events.length !== 0 ? false : true}><Table columns={columns} dataSource={data.events} /></Spin>
                </Col>
                <Col style={{ width: '20%' }}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#BFA2DB', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-trophy" ></i>&nbsp;&nbsp;Cuộc thi</span></div>
                    <Spin size="small" spinning={data.contests.length !== 0 ? false : true}><Table columns={columns} dataSource={data.contests} /></Spin>
                </Col>
                <Col style={{ width: '20%' }}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#9E7777', padding: '4px 7px 4px 7px', color: 'white' }}><i class="fas fa-car"></i>&nbsp;&nbsp;Trao đổi xe</span></div>
                    <Spin size="small" spinning={data.exCars.length !== 0 ? false : true}><Table columns={columns} dataSource={data.exCars} /></Spin>
                </Col>
                <Col style={{ width: '20%' }}>
                    <div style={{ marginBottom: 10 }}><span style={{ backgroundColor: '#3A6351', padding: '4px 7px 4px 7px', color: 'white' }}><i className="fas fa-peace" ></i>&nbsp;&nbsp;Trao đổi phụ kiện</span></div>
                    <Spin size="small" spinning={data.exAccessories.length !== 0 ? false : true}><Table columns={columns} dataSource={data.exAccessories} /></Spin>
                </Col>
                <Col style={{ width: '20%' }}>
                    <div style={{ marginBottom: 10 }}>ok</div>
                    <Spin size="small" spinning={data.exResponse.length !== 0 ? false : true}><Table columns={columns} dataSource={data.exResponse} /></Spin>
                </Col>
            </Row>
        </>
    )
}

export default ManageFeedbackComponent;
