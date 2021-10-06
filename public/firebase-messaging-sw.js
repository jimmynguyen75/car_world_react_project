importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyCDuA0kQwv0ASOt9HthsqcVQl-iWJ5wrwo",
    authDomain: "car-world-react-project.firebaseapp.com",
    databaseURL: "gs://car-world-react-project.appspot.com",
    projectId: "car-world-react-project",
    storageBucket: "car-world-react-project.appspot.com",
    messagingSenderId: "245546607778",
    appId: "1:245546607778:web:b8e6edb2ef754a99e623fb",
    measurementId: "G-SV25B684VN"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png",
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});