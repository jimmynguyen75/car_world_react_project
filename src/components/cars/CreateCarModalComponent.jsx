import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm, Row } from 'antd';
import React from 'react';
import { useHistory } from "react-router-dom";
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import './styles.less';

function CreateCarModalComponent() {
    const App = () => {
        const history = useHistory();
        const [visible, setVisible] = React.useState(false);
        const [loadingButton, setLoadingButton] = React.useState(false)
        const success = () => {
            message.success('Created Car Successfully.1');
        };
        const showModal = () => {
            setVisible(true);
        };
        const handleOk = () => {
            setLoadingButton(true);
            setTimeout(() => {
                setVisible(false);
                setLoadingButton(false);
                history.push('/quan-ly/xe')
            }, 2000);
            setTimeout(() => {
                success();
            }, 2000)
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            setVisible(false);
            history.push('/quan-ly/xe')
        };
        // function confirm(e) {
        //     console.log(e);
        //     message.success('Click on Yes');
        // }

        // function cancel(e) {
        //     console.log(e);
        //     message.error('Click on No');
        // }
        return (
            <>
                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo xe</span></Button>
                <Modal
                    title='Tạo xe mới'
                    visible={visible}
                    onCancel={handleCancel}
                    width={1000}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button form="myForm" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">
                                Submit
                            </Button>
                            <Popconfirm
                                title={"Are you sure to delete this task?"}
                            // okText="Submit"
                            // cancelText="Cancel"

                            >
                                <Button type="primary" key="submit" htmlType="submit">
                                    Submit
                                </Button>
                            </Popconfirm>
                        </Row>
                    ]}
                >
                    <CreateCarBodyModalComponent />
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

export default CreateCarModalComponent;
