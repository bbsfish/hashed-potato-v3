/* eslint-disable */
/**
 * AESの鍵を導出する
 * @param {ArrayBuffer|TypedArray} password
 * @param {ArrayBuffer|TypedArray} salt
 * @return {CryptoKey} AES-256-GCMの鍵
 */
async function deriveKey (password, salt) {
  const passwordKey = await window.crypto.subtle.importKey(
      'raw',
      password,
      'PBKDF2',
      false,
      ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 2000,
        hash: 'SHA-256'
      },
      passwordKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
  );
}

/**
 * パスワードを用いて文字列を暗号化する
 * @param {string} message 暗号化するメッセージ
 * @param {string} password パスワード
 * @return {{cipher: ArrayBuffer, iv: Uint8Array, salt: Uint8Array}} 暗号化データ
 */
async function encrypt (message, password) {
  // パスワードをTypedArrayに
  const pwd = new TextEncoder().encode(password);

  // 鍵導出用のsaltを生成
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // パスワードとsaltから鍵を導出する
  const key = await deriveKey(pwd, salt);

  // 初期化ベクトルを生成
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 暗号化を実行
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // GCMモードの改ざんチェック用データの長さ
      // ↓ GCMモードのAAD（追加認証データ）、無くても良い
      additionalData: new TextEncoder().encode('test')
    },
    key,
    new TextEncoder().encode(message)
  );

  // IV, salt, 暗号文を出力とする
  return {
    iv,
    salt,
    cipher
  };
}


/**
 * 暗号文、salt、IVとパスワードで復号する
 * @param {{iv: Uint8Array, salt: Uint8Array}} 暗号鍵 iv, salt
 * @param {ArrayBuffer} cipher 暗号文
 * @param {string} password パスワード
 * @return {string} 復号されたメッセージ
 */
async function decrypt({iv, salt}, cipher, password) {
  // パスワードをTypedArrayに
  const pwd = new TextEncoder().encode(password);

  // パスワードとsaltから鍵を導出する
  const key = await deriveKey(pwd, salt);

  // 復号する
  const buffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
        additionalData: new TextEncoder().encode('test')
      },
      key,
      cipher
  );

  return new TextDecoder().decode(buffer);
}

export {
  encrypt, decrypt
};

