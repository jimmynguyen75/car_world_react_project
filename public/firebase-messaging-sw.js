
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
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

firebase.initializeApp(firebaseConfig)

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