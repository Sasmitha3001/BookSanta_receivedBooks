import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBB_euJbM1He7Gl8uyyqA0AIriMUnTHQX8",
    authDomain: "book-santa-app-1d331.firebaseapp.com",
    projectId: "book-santa-app-1d331",
    storageBucket: "book-santa-app-1d331.appspot.com",
    messagingSenderId: "781442879313",
    appId: "1:781442879313:web:cb2918685362a63e1ecd70"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
