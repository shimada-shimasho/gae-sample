setTimeout(gps_get(),300000)

function gps_get(){
// Geolocation APIに対応している
if (navigator.geolocation) {
    console.log("この端末では位置情報が取得できます");
    getPosition();
    // Geolocation APIに対応していない
} else {
    console.log("この端末では位置情報が取得できません");
}

// 現在地取得処理
function getPosition() {
    // 現在地を取得
    navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function(position) {
            var send_form = document.createElement('form');
            var latitude = document.createElement('input');
            var longitude = document.createElement('input');
            send_form.method = 'POST';
            send_form.action = '/api/pos';
        
            latitude.type = 'hidden'; //入力フォームが表示されないように
            latitude.name = 'latitude';
            latitude.value = position.coords.latitude;

            longitude.type = 'hidden'; //入力フォームが表示されないように
            longitude.name = 'longitude';
            longitude.value = position.coords.longitude;
        
            send_form.appendChild(latitude);
            send_form.appendChild(longitude);
            document.body.appendChild(send_form);
        
            
            
            console.log("緯度:"+position.coords.latitude+",経度"+position.coords.longitude);

            send_form.submit();

        },
        // 取得失敗した場合
        function(error) {
          switch(error.code) {
            case 1: //PERMISSION_DENIED
              console.log("位置情報の利用が許可されていません");
              break;
            case 2: //POSITION_UNAVAILABLE
              console.log("現在位置が取得できませんでした");
              break;
            case 3: //TIMEOUT
              console.log("タイムアウトになりました");
              break;
            default:
              console.log("その他のエラー(エラーコード:"+error.code+")");
              break;
          }
        }
    );
}

// // 屋台位置情報をFirestoreに保存する
// function putPosToFirestore(no, latitude, longitude) {
//     const pos = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
//     const docRef = firestore.doc(`${posFsColl}/${no}`);
//     docRef.set(pos).then(res => {
//         console.log('*** success: put firestore');
//     });
//     return pos;
// }

}
