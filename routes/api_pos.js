// Google App Engine + node.js Sample
//   [Routing] '/api/pos/'
//   Copyright 2019 Technosite Corp.

const express = require('express');
const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');
const firestore = new Firestore();
const router = express.Router();

const posFsColl = 'pos';        // 位置情報Firestoreコレクション
const posDir = '/tmp/pos'       // 屋台位置情報キャッシュディレクトリ

// [GET] /api/pos/
// 屋台位置情報取得
router.get('/', async (req, res) => {
    console.log('[GET]');
    console.log(`***GAE_VERSION: ${process.env.GAE_VERSION}`);
    const posMap = await getPosMap();
    console.log('*** posMap');
    console.log(posMap);
    console.log('*** posMap[1]');
    console.log(posMap[1]);
    console.log('*** posMap-stringfy');
    console.log(JSON.stringify(posMap));
    const strMap = JSON.stringify(posMap);
    console.log('[GET] end');
    res.send(strMap);
});

// [POST] /api/pos/
// 屋台位置情報登録
router.post('/', (req, res) => {
    console.log('[POST]');
    // 現在のデプロイバージョンを屋台Noとする
    const yataiNo = process.env.GAE_VERSION;
    console.log(`***GAE_VERSION: ${yataiNo}`);
    console.log(`No:${yataiNo}, Latitude:${req.body.latitude}, Longtitude:${req.body.longitude}`)
    const pos = putPosToFirestore(yataiNo, req.body.latitude, req.body.longitude);
    console.log('[POST] end');
    res.send(pos);
});

// 屋台位置情報を取得する
async function getPosMap() {
    console.log('##### getPosMap(): start');
    // Firestoreより取得
    const posMap = new Array();
    // async/await版
    const collectionRef = firestore.collection(posFsColl);
    const snapshot = await collectionRef.listDocuments();
    for (const [ix, doc] of snapshot.entries()) {
        console.log('*** doc.path');
        console.log(doc.path);
        console.log(JSON.stringify(doc));
        const pos = await doc.get();
        // doc.pathから屋台Noを取り出す('pos/#'の#)
        const yataiNoRegExp = /\d+/.exec(doc.path);
        const yataiNo = Number(yataiNoRegExp[0]);
        console.log('*** yataiNo');
        console.log(yataiNo);
        console.log(JSON.stringify(pos.data()));
        posMap[yataiNo] = pos.data();
    }
    // snapshot.forEach(async doc => {
    //     console.log('*** doc.path');
    //     console.log(doc.path);
    //     console.log(JSON.stringify(doc));
    //     const pos = await doc.get();
    //     // doc.pathから屋台Noを取り出す('pos/#'の#)
    //     const yataiNoRegExp = /\d+/.exec(doc.path);
    //     const yataiNo = Number(yataiNoRegExp[0]);
    //     console.log('*** yataiNo');
    //     console.log(yataiNo);
    //     console.log(JSON.stringify(pos.data()));
    //     posMap[yataiNo] = pos.data();
    // });

    // ### Promise版
    // const collectionRef = firestore.collection(posFsColl);
    // collectionRef.listDocuments().then(docRefs => {
    //     console.log(`docRefs.length:${docRefs.length}`);
    //     docRefs.forEach((doc) => {
    //         doc.get().then(pos => {
    //             console.log('*** doc.path');
    //             console.log(doc.path);
    //             // doc.pathから屋台Noを取り出す('pos/#'の#)
    //             const yataiNoRegExp = /\d+/.exec(doc.path);
    //             const yataiNo = yataiNoRegExp[0];
    //             console.log('*** yataiNo');
    //             console.log(yataiNo);
    //             console.log(JSON.stringify(pos.data()));
    //             console.log(pos.data().latitude);
    //             console.log(pos.data().longitude);
    //             posMap[yataiNo] = pos.data();
    //             // // キャッシュディレクトリに位置情報ファイルを保存する
    //             // console.log(`write pos data dir:${posDir}/${yataiNo}, data:${JSON.stringify(pos.data())}`);
    //             // fs.writeFileSync(`${posDir}/${yataiNo}`, JSON.stringify(pos.data()));
    //         });
    //     });
    // });

    // // /tmp/posより取得
    // const posMap = new Map();
    // if (!fs.existsSync(posDir)) {
    //     // 位置情報キャッシュディレクトリが存在しなければそのままreturn
    //     console.error(`!!! ${posDir} not found. !!!`);
    //     return posMap;
    // }

    // // キャッシュディレクトリ内のファイル取得
    // const filenames = fs.readdirSync(posDir);
    // console.log(filenames);
    // filenames.forEach(f => {
    //     // ファイルの内容を読み込み、posMapに格納する
    //     console.log(`filename:${f}`);
    //     const data = fs.readFileSync(`${posDir}/${f}`);
    //     console.log(data.toString());
    //     posMap.set(f, data.toString());
    // });
    console.log('##### getPosMap(): end');
    return posMap;
}

// 屋台位置情報をFirestoreに保存する
function putPosToFirestore(no, latitude, longitude) {
    const pos = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
    const docRef = firestore.doc(`${posFsColl}/${no}`);
    docRef.set(pos).then(res => {
        console.log('*** success: put firestore');
    });
    return pos;
}

module.exports = router;
