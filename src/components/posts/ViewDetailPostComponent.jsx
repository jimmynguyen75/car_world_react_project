import React from 'react'
import parse from 'html-react-parser';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import 'moment/locale/vi';
import moment from 'moment';
export default function ViewDetailPostComponent({ record, recordImage }) {
    DecoupledEditor
        .create(document.querySelector('#editor'))
        .then(editor => {
            const toolbarContainer = document.querySelector('#toolbar-container');
            editor.isReadOnly = true
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            editor.ui.view.top.remove(toolbarContainer)
        })
        .catch(error => {
            console.error(error);
        });
    return (
        <div id="post" style={{ margin: '0 auto', width: 900, marginBottom: 50, backgroundColor: 'white', marginTop: '-20px' }}>
            <div style={{ padding: '30px 30px 0px 30px', fontWeight: 600, fontSize: 32, width: 900, marginTop: 30 }}> {record !== '' && record.Title}</div>
            <div style={{ paddingLeft: '30px', paddingTop: '5px', fontSize: 15, color: '#888888' }}>{record !== '' && moment(record.CreatedDate).format('llll')}</div>
            <div style={{ fontWeight: '500', marginBottom: 1, fontSize: 18, padding: ' 10px 30px 0px 30px', width: 900 }}>
                {record !== '' && record.Type === 1 ? <span style={{ color: '#555555', fontWeight: 450 }}>Xe </span> :
                    record !== '' && record.Type === 2 ? <span style={{ color: '#555555', fontWeight: 450 }}>Phụ kiện </span> :
                        record !== '' && record.Type === 3 ? <span style={{ color: '#555555', fontWeight: 450 }}>Sự kiện </span> :
                            record !== '' && record.Type === 4 ? <span style={{ color: '#555555', fontWeight: 450 }}>Cuộc thi </span> : null}
                - {record !== '' && record.Overview}
            </div>
            <div id="toolbar-container"></div>
            <div id="editor" style={{ width: 900, padding: '10px 30px 0px 30px' }}>
                <p>{record !== '' && parse(record.Contents)}</p>
            </div>
            <div style={{ padding: '0px 30px 30px 30px', fontWeight: '500' }}>Thực hiện: {record !== '' && record.CreatedByNavigation.FullName}</div>
        </div>
    )
}
