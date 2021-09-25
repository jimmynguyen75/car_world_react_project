import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Row } from 'antd';
import React from 'react';
import CreateAccessoryBodyModalComponent from './CreateAccessoryBodyModalComponent';
import { useHistory } from "react-router-dom";
function CreateAccessoryModalComponent() {
    const App = () => {
        const [visible, setVisible] = React.useState(false);
        const [confirmLoading, setConfirmLoading] = React.useState(false);
        const [setSuccess] = React.useState(false);
        const history = useHistory();
        const success = () => {
            setSuccess(false);
            message.success("Create Acccessory Successfully", 2);
        };
        const showModal = () => {
            setVisible(true);
        };
        const handleOk = () => {
            setConfirmLoading(true);
            setTimeout(() => {
                setVisible(false);
                setConfirmLoading(false);
            }, 2000);
            setTimeout(() => {
                success();
                setSuccess(true);
            }, 2000)
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            setVisible(false);
            history.push('/quan-ly/phu-kien');
        };
        return (
            <>
                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>{"Tạo phụ kiện"}</span></Button>
                <Modal
                    title={"Tạo mới phụ kiện"}
                    visible={visible}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    width={1000}
                    footer={
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button form="myForm" type="primary" key="submit" htmlType="submit">
                                Submit
                            </Button>
                        </Row>
                    }
                >
                    <CreateAccessoryBodyModalComponent />
                </Modal>
            </>
        );
    };
    return (
        <div>
            <App />
        </div>
    )
}

export default CreateAccessoryModalComponent;
