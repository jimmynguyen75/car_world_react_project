import React from 'react'
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
export default function CheckLogin() {
    const history = useHistory();
    function goBack() {
        history.goBack();
    }
    return (
        <div>
            <Result
                icon={<SmileOutlined />}
                title="Chậm lại, đăng nhập để vào Car World nhé!"
                extra={<Button type="primary" onClick={goBack}>Đăng nhập</Button>}
            />
        </div>
    )
}
