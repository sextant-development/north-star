const firebase = require('firebase-admin')

const initializeFirebase = () => {
    const serviceAccount = require('../../serviceAccountKey.json')
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    })
    console.log('Initialized Firebase SDK')
}

module.exports = initializeFirebase