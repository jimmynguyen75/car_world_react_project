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
        ContestService.getUserJoined(record.Id)
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
            title: 'Bạn có muốn giải thưởng này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                PrizeService.removePrizeContest(id)
                    .then(() => {
                        console.log('Deleted')
                        setTimeout(() => {
                            message.success("Xóa giải thưởng cuộc thi thành công");
                        }, 200)
                        setTimeout(() => {
                            window.location.href = '/giai-thuong'
                        }, 500)
                    })
                    .catch(() => { message.error("Xóa giải thưởng cuộc thi không thành công"); })
            }
        });
    }
    // async function convertUserIdToName(userId) {
    //     const user = await AccountService.getUserById(userId);
    //     return user.data;
    // }
    function convertPrizeName(prize) {
        if (prize === '1') {
            return "Giải nhất"
        } else if (prize === '2') {
            return "Giải nhì"
        } else if (prize === '3') {
            return "Giải ba"
        } else if (prize === '4') {
            return "Giải khuyến khích"
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
        // PrizeService.createPrizeContest(value).then(() => message.success("Tạo giải thưởng cuộc thi thành công")).catch(() => { message.error("Tạo không thành công") })
        console.log("value: ", value)
        axios.all([priz.map((data) => (
            PrizeService.givePrizeToUser(data.id, data.userId)
        ))])
            .then(axios.spread(() => {
                setTimeout(() => {
                    message.success("Trao giải thưởng thành công")
                }, 500)
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 1000)
            }))
            .catch(() => { message.error("Trao giải thưởng không thành công") })
    }
    const onFinishEdit = (value) => {
        PrizeService.updatePrizeContest(data.Id, value)
            .then(() => {
                message.success("Cập nhật giải thưởng thành công")
                setTimeout(() => {
                    window.location.href = '/giai-thuong'
                }, 1000)
            })
            .catch(() => { message.error("Cập nhật giải thưởng không thành công") })
        console.log(value)
    }
    return (
        <div>
            <Modal
                destroyOnClose={true}
                title={"Cập nhật giải thưởng cuộc thi"}
                visible={visibleEdit}
                onCancel={handleCancel}
                width={600}
                okText="Hoàn tất"
                cancelText="Hủy"
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" form="prizeContest" key="submit" htmlType="submit">
                            Hoàn tất
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
                    <Form.Item label="Giải" name="prizeOrder" rules={[{ required: true, message: "Giải không được bỏ trống" }]}>
                        <Select
                            showSearch
                            placeholder="Giải"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled
                        >
                            <Option value={data.PrizeOrder}>{convertPrizeName(data.PrizeOrder)}</Option>
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
                            disabled={record.CurrentParticipants !== 0 ? true : false}
                        >
                            {prizeList.map((prizes) => (
                                <Option key={prizes.Id} value={prizes.Id}>{prizes.Name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Chọn người tham gia" name="userId">
                        <Select
                            defaultValue={data.UserId}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn người tham gia"
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
                            <Descriptions.Item label="Tên cuộc thi">
                                <div style={{ fontWeight: '500', fontSize: 16, color: '#2A528A' }}>{record.Title}</div>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 12, marginBottom: 7, fontWeight: '450', fontSize: 14, letterSpacing: 1 }}>Thời gian diễn ra <span style={{ color: '#7BC0A3', fontWeight: 500 }}>CUỘC THI</span></div>
                        <Descriptions
                            bordered
                            column={1}
                            labelStyle={{ fontWeight: '500', fontSize: 14, width: 120 }}
                            size="small"
                        >
                            <Descriptions.Item label="Bắt đầu">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.StartDate).format('L')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kết thúc">
                                <i class="fas fa-clock" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('LT')} &nbsp;<MinusOutlined />&nbsp; <i class="far fa-calendar-check" style={{ color: '#7BC0A3' }}></i>&nbsp;{moment(record.EndDate).format('L')}
                            </Descriptions.Item>
                        </Descriptions>
                        <br />
                        <Row gutter={15}>
                            {/* <Col span={6}>
                                <div className='viewEventText'>Đã tham gia</div>
                                <i style={{ color: '#50C9BA' }} class="fas fa-user-check"></i>&nbsp;&nbsp;{record.CurrentParticipants}
                            </Col> */}
                            {/* <Col span={8}>
                                <div className='viewEventText'>Số lượng giới hạn</div>
                                <i style={{ color: '#E36387' }} class="fas fa-users"></i>&nbsp;&nbsp;{record.MinParticipants} - {record.MaxParticipants}
                            </Col> */}
                            <Col span={10}>
                                <div className='viewEventText'>Người tạo</div>
                                <Row>
                                    <Avatar alt="" size="small" src={record !== null && record.CreatedByNavigation.Image}></Avatar>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{record !== null && record.CreatedByNavigation.FullName}</div>
                                </Row>
                            </Col>
                            <Col span={14}>
                                <div className='viewEventText'>Địa chỉ</div>
                                <i style={{ color: '#726A95' }} class="fas fa-map-marked-alt"></i>&nbsp;&nbsp;{record.Venue}
                            </Col>

                        </Row>
                    </Col>
                    <Col span={12}>
                        <Spin size="middle" spinning={recordImage[0] === 'string' ? true : false}>
                            <div style={{ display: loading, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 'bold' }}>Đang tải</span></div>
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
                        <div className='viewEventText'>Giải thưởng cuộc thi</div>
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
                                                        {prize.User !== null ? prize.User.FullName : <Tag color="green">Vui lòng chọn người tham gia</Tag>}</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Row gutter={10}>
                                                <div onClick={() => showModalEdit(prize)}> <span style={{ color: '#5AA469', textDecoration: 'underline', cursor: 'pointer' }}>Sửa</span> </div>
                                                {record.CurrentParticipants === 0 && <div onClick={() => confirm(prize.Id)} style={{ paddingLeft: 10 }}><span style={{ color: '#F38BA0', textDecoration: 'underline', cursor: 'pointer' }}>Xóa</span>  </div>}
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
