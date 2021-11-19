import React, { useEffect, useState } from 'react';
import "tui-calendar/dist/tui-calendar.css";
import './style.less';
import { Row, Col } from 'antd'
import EventService from '../../services/EventService';
import ContestService from '../../services/ContestService';

export default function ManagerBodyDashboardComponent() {
    const [attendance, setAttendace] = useState(null)
    const [data, setData] = useState({ eventAttendance: [], consttestAttendance: [], eventReady: [], contestReady: [] })
    useEffect(() => {
        const fetchData = async () => {
            const eventAttendance = await EventService.getOngoingEvents()
            const consttestAttendance = await ContestService.getOngoingContests()
            const eventReady = await EventService.getPreparedEvents()
            const contestReady = await ContestService.getPreparedContests()
            setData({ eventAttendance: eventAttendance.data, consttestAttendance: consttestAttendance.data, eventReady: eventReady.data, contestReady: contestReady.data })
        }
        fetchData()
    }, [])
    
    return (
        <>
            <Row gutter={15}>
                <Col span={18}></Col>
                <Col span={6}>
                    {data.eventAttendance.length !== 0 ? <Row ><div>Sự kiện</div></Row> : null}
                    {data.consttestAttendance.length !== 0 ? <Row >Cuộc thi</Row> : null}
                    {data.eventReady.length !== 0 ? <Row >Sự kiện sắp diễn ra</Row> : null}
                    {data.contestReady.length !== 0 ? <Row >Cuộc thi sắp diễn ra</Row> : null}
                </Col>
            </Row>
        </>
    )
}
