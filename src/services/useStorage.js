import { useState, useEffect } from 'react';
import storage from "./ImageFirebase";

export const useStorage = (images) => {
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const promises = [];
        images.map((image) => {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on("state_changed",
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
                    await storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then((urls) => {
                            setUrl((prevState) => [...prevState, urls]);
                        });
                }
            )
        })

    }, [images]);
    return { url, error, progress };
}