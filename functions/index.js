const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp();


exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = 
    await admin.firestore().collection('messages').add({original: original});
    res.json({result:`Message with Id: ${writeResult.id} added.`});
});

exports.makeUppercase = functions.firestore.document('messages/{documentId}')
    .onCreate((snap, context) =>{
        const original = snap.data().original;
        functions.logger.log('Uppercasing', context.params.documentId, original);
        const uppercase = original.toUpperCase();
        return snap.ref.set({uppercase}, {merge:true});
    });

exports.readMessages = functions.https.onRequest(
    (req,res) => {
        admin.firestore().collection('messages').get().then(docs => {
            const result = docs.docs.map( doc => {
                return {
                    id: doc.id,
                    data: doc.data()
                }
            })
            res.status(200).json(result);
        })
    }
);