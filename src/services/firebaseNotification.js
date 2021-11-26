// import firebase from 'firebase';
// import 'firebase/messaging'

// const messaging = firebase.messaging();
// const { REACT_APP_VAPID_KEY } = process.env
// const publicKey = REACT_APP_VAPID_KEY;
// const firebaseConfig = {
//     apiKey: "AIzaSyCgNZKSKuYfMD2E09TGxyqP_kOFdiUEzHc",
//     authDomain: "car-world-system.firebaseapp.com",
//     databaseURL: "https://car-world-system-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "car-world-system",
//     storageBucket: "car-world-system.appspot.com",
//     messagingSenderId: "878362109114",
//     appId: "1:878362109114:web:78b0f0629ce15b89e68e83",
//     measurementId: "G-TMZ0PFGNB3"
// };
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig)
// } else {
//     firebase.app(); // if already initialized, use that one
// }

// var storage = firebase.storage();
// export default storage;
// export const getToken = async (setTokenFound) => {
//     let currentToken = '';
//     try {
//         currentToken = await messaging.getToken({ vapidKey: publicKey });
//         if (currentToken) {
//             setTokenFound(true);
//         } else {
//             setTokenFound(false);
//         }
//     } catch (error) {
//         console.log('An error occurred while retrieving token.', error);
//     }
//     return currentToken;
// };
// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         messaging.onMessage((payload) => {
//             resolve(payload);
//         });
//     });
