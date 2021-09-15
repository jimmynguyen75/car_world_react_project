import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCDuA0kQwv0ASOt9HthsqcVQl-iWJ5wrwo",
    authDomain: "car-world-react-project.firebaseapp.com",
    projectId: "car-world-react-project",
    storageBucket: "car-world-react-project.appspot.com",
    messagingSenderId: "245546607778",
    appId: "1:245546607778:web:b8e6edb2ef754a99e623fb",
    measurementId: "G-SV25B684VN"
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;
