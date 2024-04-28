// const crypto = require('crypto');

// const keygen = require("keygenerator");
// import { generate } from 'generate-password';
// const generatePassword = require('generate-password');
// const ULID = require('ulid');

function genPassword() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  const string = letters + letters.toUpperCase() + numbers;

  const len = 8; // 8文字
  let password = ''; // 文字列が空っぽという定義をする

  /* eslint-disable-next-line no-plusplus */
  for (let i = 0; i < len; i++) {
    password += string.charAt(Math.floor(Math.random() * string.length));
  }
  return password;
}

// module.exports.ulid = () => {
//   return ULID.ulid();
// }

export default genPassword;
