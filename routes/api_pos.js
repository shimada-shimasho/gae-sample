// Google App Engine + node.js Sample
//   [Routing] '/api/pos/'
//   Copyright 2019 Technosite Corp.

const express = require('express');
const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');
const firestore = new Firestore();
const router = express.Router();

router.get('/', (req, res) => {
    console.log('[GET]');
    const posMap = getPosMap();
    console.log('*** posMap');
    console.log(posMap);
    res.redirect('/')
});

router.post('/:no', (req, res) => {
    console.log('[POST]');
    console.log(`No:${req.params.no}, Latitude:${req.body.latitude}, Longtitude:${req.body.longitude}`)
    putPos(req.params.no, req.body.latitude, req.body.longitude);
    res.redirect('/')
});

function putPos(no, latitude, longitude) {
    const pos = {latitude: latitude, longitude: longitude};
    const docRef = firestore.doc(`pos/${no}`);
    docRef.set(pos).then(res => {
        console.log('*** success: put firestore');
        const tmpDirName = '/tmp/pos';
        if (!fs.existsSync(tmpDirName)) {
            fs.mkdirSync(tmpDirName);
        }
        fs.writeFileSync(`${tmpDirName}/${no}`, pos);
    });
}

async function getPosMap() {
    const filenames = fs.readdirSync('/tmp');
    console.log(filenames);

    const posMap = new Map();
    const collectionRef = firestore.collection('pos');
    await collectionRef.listDocuments().then(docRefs => {
        console.log(`docRefs.length:${docRefs.length}`);
        docRefs.forEach((doc) => {
            doc.get().then(pos => {
                console.log('*** doc.path');
                console.log(doc.path);
                let geo = pos.get('geo');
                console.log(`*** geo.latitude:${geo.latitude}`);
                console.log(`*** geo.longitude:${geo.longitude}`);
                posMap.set(doc.path, pos);
            });
        });
    });
    console.log('*** posMap(stringfy');
    console.log(JSON.stringify(posMap));
    return posMap;
}

module.exports = router;
