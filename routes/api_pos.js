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
router.get('/', (req, res) => {
    console.log('[GET]');
    console.log(`***GAE_VERSION: ${process.env.GAE_VERSION}`);
    const posMap = getPosMap();
    console.log('*** posMap');
    console.log(posMap);
    res.json(posMap);
});

// [POST] /api/pos/
// 屋台位置情報登録
router.post('/', (req, res) => {
    console.log('[POST]');
    const yataiNo = process.env.GAE_VERSION;
    console.log(`***GAE_VERSION: ${yataiNo}`);
    console.log(`No:${yataiNo}, Latitude:${req.body.latitude}, Longtitude:${req.body.longitude}`)
    const pos = putPosToFirestore(yataiNo, req.body.latitude, req.body.longitude);
    res.json(pos);
});

// 屋台位置情報を取得する
function getPosMap() {
    const posMap = new Map();
    if (!fs.existsSync(posDir)) {
        console.error(`!!! ${posDir} not found. !!!`);
        return posMap;
    }

    const filenames = fs.readdirSync(posDir);
    console.log(filenames);

    filenames.forEach(f => {
        console.log(`filename:${f}`);
        const data = fs.readFileSync(`${posDir}/${f}`);
        console.log(data.toString());
        posMap.set(f, data.toString());
    });
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
