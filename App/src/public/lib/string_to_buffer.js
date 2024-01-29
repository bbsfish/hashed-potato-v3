function arrayBufferToBinaryString(arrayBuffer) {
  let binaryString = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString
}

// Binary String to Binary
// 
function binaryStringToArrayBuffer(binaryString) {
  const codeUnits = new Uint8Array(binaryString.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = binaryString.charCodeAt(i);
  }
  // （...） 内がわかりにくいが、16bit 毎だったバイナリを 8bit 毎にわけて、それぞれを文字列に変換している
  // Uint8Array の　要素の範囲は 0..255 であるため変換後の文字が`バイナリ文字`であることが保証できる
  // return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
  return codeUnits.buffer;
}


function arrayBufferToBase64 (arrayBuffer){
  const binaryString = arrayBufferToBinaryString(arrayBuffer);
  return btoa(binaryString);
}

// Base64 to Array Buffer
// Process: Base64 -> Binary String -> Binary
function base64ToArrayBuffer (base64String){
  const binaryString = atob(base64String);
  return binaryStringToArrayBuffer(binaryString);
}