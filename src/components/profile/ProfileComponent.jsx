import React, { Component } from 'react'
import storage from "../../services/ImageFirebase";
import '../posts/styles.less'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
function ProfileComponent() {
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }
        // Starts the upload process.
        upload() {
            return this.loader.file.then(
                file =>
                    new Promise((resolve, reject) => {
                        const storageRef = storage.ref(`/images/${file.name}`)
                        const uploadTask = storageRef.put(file);
                        uploadTask.on(
                            "state_changed", // or 'state_changed'
                            function (snapshot) {
                            },
                            function (error) {
                                switch (error.code) {
                                    case "storageRef/unauthorized":
                                        reject(" User doesn't have permission to access the object");
                                        break;

                                    case "storageRef/canceled":
                                        reject("User canceled the upload");
                                        break;

                                    case "storageRef/unknown":
                                        reject(
                                            "Unknown error occurred, inspect error.serverResponse"
                                        );
                                        break;
                                }
                            },
                            function () {
                                // Upload completed successfully, now we can get the download URL
                                uploadTask.snapshot.ref
                                    .getDownloadURL()
                                    .then(function (downloadURL) {
                                        // console.log("File available at", downloadURL);
                                        resolve({
                                            default: downloadURL
                                        });
                                    });
                            }
                        );
                    })
            );
        }
    }

    return (
        <div className="App">
            <h2>Using CKEditor 5 build in React</h2>
            <CKEditor
                editor={DecoupledEditor}
                onReady={editor => {
                    editor.ui.getEditableElement().parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                    );
                    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
                        return new MyUploadAdapter(loader);
                    };
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                }}
            />
        </div>
    )
}

export default ProfileComponent;