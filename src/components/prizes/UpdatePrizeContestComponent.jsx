import axios from "axios";
import { MinusOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Carousel, Col, Descriptions, Button, Image, Row, Spin, Input, Select, Avatar, Form, message, Modal, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ContestService from '../../services/ContestService';
import PrizeService from '../../services/PrizeService';
import AccountService from '../../services/AccountService';
export default function ViewEventComponent({ record, recordImage }) {
    const { Option } = Select;
    const history = useHistory();
    const [users, setUsers] = useState([])
    const [prizes, setPrizes] = useState([])
    const [prizeList, setPrizeList] = useState([])
    const [visibleEdit, setVisibleEdit] = useState(false);
    // const [loadingButton, setLoadingButton] = React.useState(false)
    const [data, setData] = useState("")
    const [form] = Form.useForm();
    useEffect(() => {
        const result = []
        ContestService.getCheckedAttendance(record.Id)
            .then((user) => {
                user.data.forEach((data) => {
                    result.push(data.User)
                })
                setUsers(result)
            })
            .catch((error) => console.log(error));
    }, [record])
    useEffect(() => { PrizeService.getPrizes().then((result) => { setPrizeList(result.data) }).catch(() => { console.log("Error") }) }, [])
    useEffect(() => { PrizeService.getPrizeContestById(record.Id).then((result) => { setPrizes(result.data) }).catch((error) => console.log(error)) }, [record])
    const [visible, setVisible] = useState("none")
    const [loading, setLoading] = useState("0")
    const priz = []
    const handleCancel = () => {
        setVisibleEdit(false);
        history.push('/giai-thuong');
    };
    const showModalEdit = (prize) => {
        setData(prize);
        console.log(prize);
        setVisibleEdit(true);
    };
    function confirm(id) {
        console.log(id)
        Modal.confirm({
            title: 'B???n c?? mu???n gi???i th?????ng n??y kh??ng?',
            icon: <ExclamationCircleOutlined />,
            okText: 'C??',
            cancelText: 'Kh??ng',
            onOk: () => {
                PrizeService.removePrizeContest(id)
                    .then(() => {
                        console.log('Deleted')
                        setTimeout(() => {
                            message.success("X??a gi???i th?????ng cu???c thi th??nh c??ng");
                        }, 200)
                        setTimeout(() => {
                            window.location.href = '/giai-thuong'
                        }, 500)
                    })
                    .catch(() => { message.error("X??a gi???i th?????ng cu???c thi kh??ng th??nh c??ng"); })
            }
        });
    }
    // async function convertUserIdToName(userId) {
    //     const user = await AccountService.getUserById(userId);
    //     return user.data;
    // }
    function convertPrizeName(prize) {
        if (prize === '1') {
            return "Gi???i nh???t"
        } else if (prize === '2') {
            return "Gi???i nh??"
        } else if (prize === '3') {
            return "Gi???i ba"
        } else if (prize === '4') {
            return "Gi???i khuy???n kh??ch"
        }
    }
    function onSelect(value, data) {
        const option = {
            id: data.prizeId,
            userId: data.key
        }
        const arrayUserId = priz.findIndex(i => i.userId === data.key)
        const arrayId = priz.findIndex(i => i.id === data.prizeId)
        if (arrayUserId === -1 || arrayId === -1) {
            priz.push(option)
        } else if (arrayUserId === -1 && arrayId === -1) {
            var index = priz.indexOf(data.key);
            priz.splice(index, 1);
        }
        console.log("sssdfs: ", priz)
    }
    function onDeselect(value) {
        // var index = priz.indexOf(data.key);
        // priz.splice(index, 1);
        // console.log('DEselected: ', data.key);
        console.log("sssdfs123: ", value)
    }
    setTimeout(() => {
        setLoading("none")
        setVisible(true)
    }, 800)
    form.setFieldsValue({
        contestId: data.ContestId,
        prizeId: data.PrizeId,
        prizeOrder: data.PrizeOrder,
        createdDate: data.CreatedDate,
        managerId: AccountService.getCurrentUser().Id,
    })
    const onFinish = (value) => {
        // PrizeService.createPrizeContest(value).then(() => message.success("T???o gi???i th?????ng cu???c thi th??nh c??ng")).catch(() => { message.error("T???o kh??ng th??nh c??ng") })
        console.log("value: ", value)
        axios.all([priz.map((data) => (
            PrizeService.givePrizeToUser(data.id, data.userId)
        ))])
            .then(axios.spread(() => {
                setTimeout(() => {
                    message.success("Trao gi???i th?????ng th??nh c??ng")
                }, 500)
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 1000)
            }))
            .catch(() => { message.error("Trao gi???i th?????ng kh??ng th??nh c??ng") })
    }
    const onFinishEdit = (value) => {
        PrizeService.updatePrizeContest(data.Id, value)
            .then(() => {
                message.success("C???p nh???t gi???i th?????ng th??nh c??ng")
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 1000)
            })
            .catch(() => { message.error("C???p nh???t gi???i th?????ng kh??ng th??nh c??ng") })
        console.log(value)
    }
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title={"C???p nh???t gi???i th?????ng cu???c thi"}
                visible={visibleEdit}
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
                    onFinish={onFinishEdit}
                    form={form}
                >
                    <Form.Item hidden={true} name="managerId"><Input /></Form.Item>
                    <Form.Item hidden={true} name="contestId"><Input /></Form.Item>
                    <Form.Item hidden={true} name="createdDate"><Input /></Form.Item>
                    <Form.Item label="Gi???i" name="prizeOrder" rules={[{ required: true, message: "Gi???i kh??ng ???????c b??? tr???ng" }]}>
                        <Select
                            showSearch
                            placeholder="Gi???i"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled
                        >
                            <Option value={data.PrizeOrder}>{convertPrizeName(data.PrizeOrder)}</Option>
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
                            disabled={record.CurrentParticipants !== 0 ? true : false}
                        >
                            {prizeList.map((prizes) => (
                                <Option key={prizes.Id} value={prizes.Id}>{prizes.Name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ch???n ng?????i tham gia" name="userId">
                        <Select
                            defaultValue={data.UserId}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Ch???n ng?????i tham gia"
                            onSelect={onSelect}
                            onChange={onDeselect}
                        >
                            {users.map((users) => (
                                <Option key={users.Id} value={users.Id} prizeId={data.Id}>
                                    <Avatar icon={<UserOutlined />} src={users.Image} size={18} style={{ marginBottom: 4 }} />&nbsp;{users.FullName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Form
                layout="vertical"
                id="updatePrizeContest"
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={15}>
                    <Col span={12}>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="T??n cu???c thi">
                                <div style={{ fontWeight: '500', fontSize: 16, color: '#2A528A' }}>{record.Title}</div>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Th???i gian di???n ra <span style={{ color: '#7BC0A3', fontWeight: 500 }}>CU???C THI</span></div>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="B???t ?????u">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('L')}
                            </Descriptions.Item>
                            <Descriptions.Item label="K???t th??c">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('L')}
                            </Descriptions.Item>
                        </Descriptions>
                        <br />
                        <Row gutter={15}>
                            {/* <Col span={6}>
                                <div className='viewEventText'>???? tham gia</div>
                                <i style={{ color: '#50C9BA' }} class="fas fa-user-check"></i>&nbsp;&nbsp;{record.CurrentParticipants}
                            </Col> */}
                            {/* <Col span={8}>
                                <div className='viewEventText'>S??? l?????ng gi???i h???n</div>
                                <i style={{ color: '#E36387' }} class="fas fa-users"></i>&nbsp;&nbsp;{record.MinParticipants} - {record.MaxParticipants}
                            </Col> */}
                            <Col span={10}>
                                <div className='viewEventText'>Ng?????i t???o</div>
                                <Row>
                                    <Avatar alt="" size="small" src={record !== null && record.CreatedByNavigation.Image}></Avatar>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{record !== null && record.CreatedByNavigation.FullName}</div>
                                </Row>
                            </Col>
                            <Col span={14}>
                                <div className='viewEventText'>?????a ch???</div>
                                <i style={{ color: '#726A95' }} class="fas fa-map-marked-alt"></i>&nbsp;&nbsp;{record.Venue}
                            </Col>

                        </Row>
                    </Col>
                    <Col span={12}>
                        <Spin size="middle" spinning={recordImage[0] === 'string' ? true : false}>
                            <div style={{ display: loading, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 'bold' }}>??ang t???i</span></div>
                            <div style={{ display: visible }}>
                                <Carousel>
                                    {recordImage.map((object, i) => {
                                        return (
                                            <div>
                                                <Image preview={false} style={{ display: 'true', margin: 'auto', height: 'auto', width: 'auto', maxHeight: '289.25px', maxWidth: '467.99px' }} key={i} src={object} />
                                            </div>)
                                    })}
                                </Carousel>
                            </div>
                        </Spin>
                    </Col>
                </Row>
                <br />
                <Row >
                    <Col span={24}>
                        {prizes.length !== 0 && <div className='viewEventText'>Gi???i th?????ng cu???c thi</div>}
                        {prizes.map((prize) => (
                            <Descriptions
                                bordered
                                column={1}
                                labelStyle={{ fontWeight: '500', fontSize: 14, width: 150, height: 47.99 }}
                                size="small"
                            >
                                <Descriptions.Item label={convertPrizeName(prize.PrizeOrder)}>
                                    <Row gutter={15}>
                                        <Col span={21}>
                                            <Row gutter={15}>
                                                <Col span={12}><div>{prize.Prize.Name}</div></Col>
                                                <Col span={12}>
                                                    <div>
                                                        <Avatar icon={<UserOutlined />} src={prize.User !== null && prize.User.Image} size={26} style={{ marginBottom: 4 }} />&nbsp;&nbsp;
                                                        {prize.User !== null ? prize.User.FullName : <Tag color="green">Vui l??ng ch???n ng?????i tham gia</Tag>}</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Row gutter={10}>
                                                <div onClick={() => showModalEdit(prize)}> <span style={{ color: '#5AA469', textDecoration: 'underline', cursor: 'pointer' }}>S???a</span> </div>
                                                {record.CurrentParticipants === 0 && <div onClick={() => confirm(prize.Id)} style={{ paddingLeft: 10 }}><span style={{ color: '#F38BA0', textDecoration: 'underline', cursor: 'pointer' }}>X??a</span>  </div>}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Descriptions.Item>
                            </Descriptions>
                        ))}
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
