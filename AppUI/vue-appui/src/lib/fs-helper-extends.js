import { verifyPermission, readFile } from '@/lib/fs-helper';

/**
 * 設定中の FileSystemFileHandle から
 * すなわち、デバイスファイルからコンテンツを取得します
 * @param {Object<FileSystemFileHandle>} fileHandle
 * @return {Object}
 */
async function getFileContent(fileHandle) {
  return new Promise(async (resolve) => {
    if (!fileHandle) return;
    if (await verifyPermission(fileHandle, true) === false) return;
    const file = await fileHandle.getFile();
    const fileText = await readFile(file);
    resolve(fileText);
  });
}

export { getFileContent }; //eslint-disable-line
