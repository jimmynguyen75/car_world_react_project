import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import AccountService from '../../services/AccountService';
import ContestService from '../../services/ContestService';
import PrizeService from '../../services/PrizeService';
export default function CreatePrizeContestComponent() {
    // const [loadingButton, setLoadingButton] = React.useState(false)
    const { Option } = Select;
    const [visible, setVisible] = React.useState(false);
    // const [modalConfirm, setModalConfirm] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [contests, setContests] = useState([]);
    const [prizes, setPrizes] = useState([]);
    const [checkPrize, setCheckPrize] = useState("");
    const [ckPrize, setCkPrize] = useState([]);
    const [o1, setO1] = useState(false);
    const [o2, setO2] = useState(false);
    const [o3, setO3] = useState(false);
    const [o4, setO4] = useState(false);
    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
        history.push('/giai-thuong')
    };
    function onChange(value) {
        console.log(`selected ${value}`);
        setO1(false);
        setO2(false);
        setO3(false);
        setO4(false);
        setTimeout(() => {
            setCheckPrize(value);
        }, 500)
    }
    useEffect(() => {
        PrizeService.getPrizeContestById(checkPrize)
            .then((result) => {
                setCkPrize(result.data);
            })
            .catch((error) => { console.log(error); })
    }, [checkPrize])
    useEffect(() => {
        let current = []
        ContestService.getAllContestPrize()
            .then((result) => {
                result.data.forEach((filter) => {
                    if (filter.CurrentParticipants === 0) {
                        current.push(filter)
                    }
                })
                setContests(current)
            })
            .catch(() => { console.log("Error") })
    }, [])
    useEffect(() => { PrizeService.getPrizes().then((result) => { setPrizes(result.data) }).catch(() => { console.log("Error") }) }, [])
    const onFinish = (value) => {
        PrizeService.createPrizeContest(value)
            .then(() => {
                message.success("T???o gi???i th?????ng cu???c thi th??nh c??ng")
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 500)
            })
            .catch(() => { message.error("T???o gi???i th?????ng cu???c thi kh??ng th??nh c??ng") })
    }
    useEffect(() => {
        ckPrize !== null && ckPrize.forEach((n) => {
            n.PrizeOrder === '1' && setO1(true)
            n.PrizeOrder === '2' && setO2(true)
            n.PrizeOrder === '3' && setO3(true)
            n.PrizeOrder === '4' && setO4(true)
        })
    }, [ckPrize])
    form.setFieldsValue({
        managerId: AccountService.getCurrentUser().Id,
    })
    return (
        <div>
            <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>T???o gi???i th?????ng cu???c thi</span></Button>
            <Modal
                destroyOnClose={true}
                title={"T???o gi???i th?????ng cu???c thi"}
                visible={visible}
                onCancel={handleCancel}
                width={600}
                okText="Ho??n t???t"
                cancelText="H???y"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            H???y
                        </Button>
                        <Button type="primary" form="prizeContest" key="submit" htmlType="submit">
                            Ho??n t???t
                        </Button>
                    </Row>
                ]}
            >
                <Form
                    layout="vertical"
                    id="prizeContest"
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item hidden={true} name="managerId"><Input /></Form.Item>
                    <Form.Item label="Ch???n cu???c thi" name="contestId" rules={[{ required: true, message: "Cu???c thi kh??ng ???????c b??? tr???ng" }]}>
                        <Select
                            showSearch
                            placeholder="Ch???n cu???c thi"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {contests.map(contests => (
                                <Option key={contests.Id} value={contests.Id}>{contests.Title}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="H???ng" name="prizeOrder" rules={[{ required: true, message: "H???ng kh??ng ???????c b??? tr???ng" }]}>
                        <Select
                            showSearch
                            placeholder="Ch???n h???ng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option key={prizes.Id} disabled={o1} value="1">Gi???i nh???t</Option>
                            <Option key={prizes.Id} disabled={o2} value="2">Gi???i nh??</Option>
                            <Option key={prizes.Id} disabled={o3} value="3">Gi???i ba</Option>
                            <Option key={prizes.Id} disabled={o4} value="4">Gi???i khuy???n kh??ch</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ch???n gi???i th?????ng" name="prizeId" rules={[{ required: true, message: "Gi???i th?????ng kh??ng ???????c b??? tr???ng" }]}>
                        <Select
                            showSearch
                            placeholder="Ch???n gi???i th?????ng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {prizes.map(prizes => (
                                <Option key={prizes.Id} value={prizes.Id}>{prizes.Name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
