import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

export const autoRemove = functions.firestore
    .document('locacao/{wildcard}')
    .onWrite((change, context) => {
        
        let date: Date = new Date;
        let dif = date.getMonth() - 3;

        if(dif < 1){
            date.setMonth(12 - dif);
            date.setFullYear(date.getFullYear()-1);
        }else{
            date.setMonth(dif);
        }
        
        let locacao = db.collection('locacao');
        locacao.where('dataDevolucao', '<=' , date)
        .then((snapshot: any) => {
            if(snapshot.empty){
                return;
            }
            snapshot.forEach((doc: any) => {
                doc.delete();
            });
        }).catch((err: any) => console.log('Erro na query', err));

    });

// https://firebase.google.com/docs/functions/firestore-events?hl=pt-BR#reading_and_writing_data
// https://firebase.google.com/docs/firestore/manage-data/delete-data
