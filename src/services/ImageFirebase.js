import firebase from 'firebase';
import 'firebase/messaging'

// const firebaseConfig = {
//     apiKey: "AIzaSyCDuA0kQwv0ASOt9HthsqcVQl-iWJ5wrwo",
//     authDomain: "car-world-react-project.firebaseapp.com",
//     databaseURL: "gs://car-world-react-project.appspot.com",
//     projectId: "car-world-react-project",
//     storageBucket: "car-world-react-project.appspot.com",
//     messagingSenderId: "245546607778",
//     appId: "1:245546607778:web:b8e6edb2ef754a99e623fb",
//     measurementId: "G-SV25B684VN"
// };
const firebaseConfig = {
    apiKey: "AIzaSyCgNZKSKuYfMD2E09TGxyqP_kOFdiUEzHc",
    authDomain: "car-world-system.firebaseapp.com",
    databaseURL: "gs://car-world-system.appspot.com/",
    projectId: "car-world-system",
    storageBucket: "car-world-system.appspot.com",
    messagingSenderId: "878362109114",
    appId: "1:878362109114:web:78b0f0629ce15b89e68e83",
    measurementId: "G-TMZ0PFGNB3"
};
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;

const messaging = firebase.messaging();
const { REACT_APP_VAPID_KEY } = process.env
const publicKey = REACT_APP_VAPID_KEY;
export const getToken = async (setTokenFound) => {
    let currentToken = '';
    try {
        currentToken = await messaging.getToken({ vapidKey: publicKey });
        if (currentToken) {
            setTokenFound(true);
        } else {
            setTokenFound(false);
        }
    } catch (error) {
        console.log('An error occurred while retrieving token.', error);
    }
    return currentToken;
};
export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });