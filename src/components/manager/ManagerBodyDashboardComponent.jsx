import React from 'react'
import { message, Button } from 'antd';

export default function ManagerBodyDashboardComponent() {
    return (
        <div>
            <Button onClick={() => message.success("ccc")}>Show</Button>
        </div>
    )
}
