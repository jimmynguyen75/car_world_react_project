import React, { useEffect, useState } from 'react'
import { Button, Modal, Row, Col, message, Form, Upload, Input, Select } from 'antd';
import ContestService from '../../services/ContestService';
import { PlusCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import storage from '../../services/ImageFirebase';
import PrizeService from '../../services/PrizeService';
import AccountService from '../../services/AccountService';
export default function CreatePrizeContestComponent() {
    const [loadingButton, setLoadingButton] = React.useState(false)
    const { Option } = Select;
    const [visible, setVisible] = React.useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [contests, setContests] = useState([]);
    const [prizes, setPrizes] = useState([]);
    const [checkPrize, setCheckPrize] = useState("");
    const [ckPrize, setCkPrize] = useState([]);
    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
        history.push('/giai-thuong')
    };
    function onChange(value) {
        console.log(`selected ${value}`);
        setCheckPrize(value);
    }
    useEffect(() => {
        PrizeService.getPrizeContestById(checkPrize)
            .then((result) => {
                setCkPrize(result.data);
            })
            .catch((error) => { console.log(error); })
    }, [checkPrize])
    ckPrize.forEach(n => console.log(n.PrizeOrder))
    useEffect(() => { ContestService.getAllContestPrize().then((result) => { setContests(result.data) }).catch(() => { console.log("Error") }) }, [])
    useEffect(() => { PrizeService.getPrizes().then((result) => { setPrizes(result.data) }).catch(() => { console.log("Error") }) }, [])
    const onFinish = (value) => {
        PrizeService.createPrizeContest(value)
            .then(() => {
                message.success("Tạo giải thưởng cuộc thi thành công")
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 500)
            })
            .catch(() => { message.error("Tạo không thành công") })
    }
    form.setFieldsValue({
        managerId: AccountService.getCurrentUser().Id,
    })
    return (
        <div>
            <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>Tạo giải thưởng cuộc thi</span></Button>
            <Modal
                destroyOnClose={true}
                title={"Tạo giải thưởng cuộc thi"}
                visible={visible}
                onCancel={handleCancel}
                width={600}
                okText="Hoàn tất"
                cancelText="Hủy"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" form="prizeContest" key="submit" htmlType="submit" loading={loadingButton} >
                            Hoàn tất
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
                    <Form.Item label="Chọn cuộc thi" name="contestId" rules={[{ required: true, message: "Cuộc thi không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Chọn cuộc thi"
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
                    <Form.Item label="Chọn giải thưởng" name="prizeId" rules={[{ required: true, message: "Giải thưởng không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Chọn giải thưởng"
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
                    <Form.Item label="Hạng" name="prizeOrder" rules={[{ required: true, message: "Hạng không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Chọn hạng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option key={prizes.Id} value="1">Giải nhất</Option>
                            <Option key={prizes.Id} value="2">Giải nhì</Option>
                            <Option key={prizes.Id} value="3">Giải ba</Option>
                            <Option key={prizes.Id} value="4">Giải khuyến khích</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
