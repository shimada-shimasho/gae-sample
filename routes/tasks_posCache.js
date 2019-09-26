// Google App Engine + node.js Sample
//   [Routing] '/tasks/pos_cache/'
//   Copyright 2019 Technosite Corp.

const express = require('express');
const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');
const firestore = new Firestore();
const router = express.Router();

//firebase storageの利用
// var storage = firebase.storage();
// var storageRef = storage.ref();

const posFsColl = 'pos';        // 位置情報Firestoreコレクション
const posDir = '/tmp/pos'       // 屋台位置情報キャッシュディレクトリ

router.get('/', (req, res) => {
    console.log('[GET]');
    console.log('*** pos_chache');
    const ver = process.env.GAE_VERSION;
    console.log(`***GAE_VERSION: ${ver}`);
    // 位置情報キャッシュディレクトリが存在しなければ作成する
    if (!fs.existsSync(posDir)) {
        fs.mkdirSync(posDir);
    }
    //DBG ->
    console.log('*** /tmp/pos files');
    const filenames = fs.readdirSync(posDir);
    console.log(filenames);
    //DBG <-

    const collectionRef = firestore.collection(posFsColl);
    collectionRef.listDocuments().then(docRefs => {
        console.log(`docRefs.length:${docRefs.length}`);
        docRefs.forEach((doc) => {
            doc.get().then(pos => {
                console.log('*** doc.path');
                console.log(doc.path);
                // doc.pathから屋台Noを取り出す('pos/#'の#)
                const yataiNoRegExp = /\d+/.exec(doc.path);
                const yataiNo = yataiNoRegExp[0];
                console.log('*** yataiNo');
                console.log(yataiNo);
                console.log(JSON.stringify(pos.data()));
                console.log(pos.data().latitude);
                console.log(pos.data().longitude);
                // キャッシュディレクトリに位置情報ファイルを保存する
                console.log(`write pos data dir:${posDir}/${yataiNo}, data:${JSON.stringify(pos.data())}`);
                fs.writeFileSync(`${posDir}/${yataiNo}`, JSON.stringify(pos.data()));
            });
        });
    });
    res.end();
});

module.exports = router;
