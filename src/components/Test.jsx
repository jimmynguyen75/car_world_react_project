// import React, { useState, useEffect } from 'react'
// import NumberFormat from "react-number-format";
import './testStyle.less'
// export default function Test() {
//     const [num, setNum] = React.useState(0);
//     const onChange = (e) => {
//         console.log(e.target.value)
//         setNum(e.target.value)
//     }
//     const onClick = () => {
//         console.log(num)
//     }
//     // useEffect(() => {
//     //     console.log(num)
//     // }, [])
//     return (
//         <div>
//             <NumberFormat
//                 onChange={onChange}
//                 placeholder="Nhập giá phụ kiện (vnđ)"
//                 class="currency"
//                 displayType="input"
//                 type="primary"
//                 suffix=" vnđ"
//                 thousandSeparator={'.'}
//                 decimalSeparator={','}
//                 spellcheck="false"
//                 style={{
//                     width: '100%',
//                     border: '1px solid #d9d9d9',
//                     padding: '4px 11px'

//                 }}
//             />
//             <NumberFormat
//                 value={num}
//             />
//             <button onClick={onClick}>ok</button>
//         </div>
//     )
// }


// import React, { useEffect } from 'react'
// import AccessoryService from '../services/AccessoryService'
// export default function Test() {
//     const [data, setData] = React.useState("");
//     useEffect(() => {
//         AccessoryService.getAccessories().then(response => {
//             setData(response.data[0].Image)
//             console.log(response.data[0].Image)
//         }, [])
//     })
//     const [array, setArray] = React.useState([]);
//     const datas = "https://firebasestorage.googleapis.com/v0/b/car-world-react-project.appspot.com/o/images%2Fvintage-1950s-887272_1280.jpg?alt=media&token=130e03c8-bc80-4a40-83aa-dfe17fb6b7a4|https://firebasestorage.googleapis.com/v0/b/car-world-react-project.appspot.com/o/images%2Fshoes-434918_1280.jpg?alt=media&token=c9ae5390-95bb-4c09-af86-b31a80fdd82b|";

//     useEffect(() => {
//         setArray(datas.split("|"))
//     }, [datas])
//     console.log("array: ", array)
//     return (
//         <div className="container">
//             {array.map((object, i) => {
//                 return <img key={i} src={object} />
//             })}
//         </div>
//     )
// }

// import React, { useEffect, useState } from 'react'
// import { Table, Input, Row, Typography, AutoComplete, Col, Space, Button } from "antd";
// import Highlighter from 'react-highlight-words';
// import { SearchOutlined } from '@ant-design/icons';
// import AccessoryService from '../services/AccessoryService';
// import "antd/dist/antd.css";
// function App() {
//     const [searchText, setSearchText] = useState('');
//     const [searchedColumn, setSearchedColumn] = useState('');
//     const [data, setData] = useState([]);
//     useEffect(() => {
//         AccessoryService.getAccessories().then((res) => {
//             setData(res.data);
//         })
//     }, [])

//     function getColumnSearchProps(dataIndex) {
//         return {
//             filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//                 <div style={{ padding: 8 }}>
//                     <Input
//                         // ref={node => {
//                         //   this.searchInput = node;
//                         // }}
//                         placeholder={`Search ${dataIndex}`}
//                         value={selectedKeys[0]}
//                         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//                         style={{ width: 188, marginBottom: 8, display: 'block' }}
//                     />
//                     <Space>
//                         <Button
//                             type="primary"
//                             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//                             icon={<SearchOutlined />}
//                             size="small"
//                             style={{ width: 90 }}
//                         >
//                             Search
//                         </Button>
//                         <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                             Reset
//                         </Button>
//                     </Space>
//                 </div>
//             ),
//             filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//             onFilter: (value, record) =>
//                 record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//             onFilterDropdownVisibleChange: visible => {
//                 if (visible) {
//                     // setTimeout(() => this.searchInput.select());
//                 }
//             },
//             render: text =>
//                 searchedColumn === dataIndex ? (
//                     <Highlighter
//                         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                         searchWords={[searchText]}
//                         autoEscape
//                         textToHighlight={text.toString()}
//                     />
//                 ) : (
//                     text
//                 ),
//         }
//     };

//     function handleSearch(selectedKeys, confirm, dataIndex) {
//         confirm();
//         setSearchText(selectedKeys[0]);
//         setSearchedColumn(dataIndex);
//     };

//     function handleReset(clearFilters) {
//         clearFilters();
//         setSearchText('');
//     };

//     const columns = [
//         {
//             title: 'Name',
//             dataIndex: 'Name',
//             key: 'name',
//             width: '30%',
//             ...getColumnSearchProps('Name'),
//         },
//         {
//             title: 'Price',
//             dataIndex: 'Price',
//             key: 'price',
//             width: '30%',
//             ...getColumnSearchProps('Price'),
//         }
//     ];

//     return <Table columns={columns} dataSource={data} />;

// }

// export default App;


// import React, { useState } from 'react';
// import { Modal, Button } from 'antd';
// export default function Test() {
//     const App = () => {
//         const [isModalVisible, setIsModalVisible] = useState(false);

//         const showModal = () => {
//             setIsModalVisible(true);
//         };

//         const handleOk = () => {
//             setIsModalVisible(false);
//         };

//         const handleCancel = () => {
//             setIsModalVisible(false);
//         };

//         return (
//             <>
//                 <Button type="primary" onClick={showModal}>
//                     Open Modal
//                 </Button>
//                 <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
//                     <p>Some contents...</p>
//                     <p>Some contents...</p>
//                     <p>Some contents...</p>
//                 </Modal>
//             </>
//         );
//     };
//     return (
//         <div>
//             <App />
//         </div>
//     )
// }

import React, { useState, useEffect } from 'react'
import { Calendar, Alert, Badge } from 'antd';
import moment from 'moment';

export default function Test() {

    function getListData(value) {
        //   console.log("value: ", value.date())
        let listData;
        switch (value.date()) {
            case 8:
                listData = [
                    { type: 'warning', content: 'This is warning event.' },
                    { type: 'success', content: 'This is usual event.' },
                ];
                break;
            case 10:
                listData = [
                    { type: 'warning', content: 'This is warning event.' },
                    { type: 'success', content: 'This is usual event.' },
                    { type: 'error', content: 'This is error event.' },
                ];
                break;
            case 15:
                listData = [
                    { type: 'warning', content: 'This is warning event' },
                    { type: 'success', content: 'This is very long usual event。。....' },
                    { type: 'error', content: 'This is error event 1.' },
                    { type: 'error', content: 'This is error event 2.' },
                    { type: 'error', content: 'This is error event 3.' },
                    { type: 'error', content: 'This is error event 4.' },
                ];
                break;
            default:
        }
        return listData || [];
    }
    function dateCellRender(value) {
        console.log("value: ", value.month())
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div>
            <Calendar dateCellRender={dateCellRender} />
        </div>
    )
}


