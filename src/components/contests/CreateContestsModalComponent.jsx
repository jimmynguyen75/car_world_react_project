import React from 'react'
import { Modal, Button, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

function CreateContestsModalComponent() {
    const App = () => {
        const [visible, setVisible] = React.useState(false);
        const [confirmLoading, setConfirmLoading] = React.useState(false);
        const [visibleSuccess, setSuccess] = React.useState(false);
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
        };
        return (
            <>
                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>{"Tạo cuộc thi"}</span></Button>
                <Modal
                    title={"Create a new Accessory"}
                    visible={visible}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    width={1000}
                >
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

export default CreateContestsModalComponent;
