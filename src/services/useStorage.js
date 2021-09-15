import { useState, useEffect } from 'react';
import storage from "./ImageFirebase";

export const useStorage = (file) => {
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (file) {
            console.log("file: " + file)
            const storageRef = storage.ref(`/images/${file.name}`);
            const task = storageRef.put(file.originFileObj);
            task.on("state_changed",
                (snapshot) => {
                    let percentage =
                        Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                    setProgress(percentage);
                },
                (err) => {
                    setError(err);
                },
                async () => {
                    const downloadUrl = await storageRef.getDownloadURL();
                    setUrl(downloadUrl);
                }
            )   
        }
    }, [file]);
    return { url, error, progress };
}