import { useState, useEffect } from "react";
import storage from "../services/ImageFirebase";

export const useStorage = (file) => {
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    useEffect(() => {
        if (file) {
            const uploadTask = storage.ref(`avatar/${file.name}`);
            uploadTask.put(file).on('state_changed', () => { },
                (err) => {
                    setError(err);
                },
                async () => {
                    const downloadURL = await uploadTask.getDownloadURL();
                    setUrl(downloadURL)
                }
            )
        }
    }, [file]);
    return { url, error }
}