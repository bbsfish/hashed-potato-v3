/* eslint-disable */
import { XMLBuilder } from './fxbuilder.min';
import { XMLParser } from './fxparser.min';
import Secrets from './secrets';
import {
  getFileHandle, getNewFileHandle, readFile, writeFile, verifyPermission,
} from './fs-helper';

/**
 * ターゲットが空かどうか調べます
 * 0 は Empty とみなされます
 * @param {object, int, string} target 調べる対象
 * @return {boolean} If empty: true; Else false
 */
const isEmpty = (target) => {
  // 基本判定
  if (!target) return true;
  // オブジェクトの判定
  return (Object.keys(target).length === 0);
}

const fileMaster = (function (){
  const fxp = new XMLParser();


  
  const getContent = async (fh) => {
    if (!fh) return;
    if ((await verifyPermission(fh, true)) === false) {
      console.error(`User did not grant permission to '${fh.name}'`);
      return;
    }
    const file = await fh.getFile();
    const fileText = await readFile(file);
    const object = fxp.parse(fileText); // parse to object
    if ('application' in object
      && object.application.group == 'hashed-potato.com'
      && object.application.name == 'Account-Store') {
        return object;
    }
    else return;
  }

  const getSecrets = () => {
    return new Secrets();
  }

  return {
    getContent, getSecrets,
  };
})();

export default fileMaster;
