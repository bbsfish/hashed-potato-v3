document.getElementById("writeFile").addEventListener("click", async function (e){
  // await dataMaster.dataEncrypt();
  // console.log(fileMaster.content);
  // await app.selectFile();
  // await app.writeContent(fileMaster.toXML());

    // パスワードをTypedArrayに
    const pwd = new TextEncoder().encode("foo");
    console.log("pwd", pwd)

    // 鍵導出用のsaltを生成
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    console.log("salt", salt )
  
  await deriveKey(pwd, salt);
});

document.getElementById("selectFile").addEventListener("click", async function (e){
  await app.selectFile();
  const file = await app.file.handle.getFile();
  const xml = await readFile(file);
  const parser = new XMLParser();
  const object = parser.parse(xml);
  console.log(object);
  const data = object.data
})

document.addEventListener("DOMContentLoaded", async () => {
  // Verify the APIs we need are supported, show a polite warning if not.
  if (app.hasFSAccess) {
    document.getElementById('not-supported').classList.add('hidden');
    myEvent('File System APIs', 'FSAccess');
  } else {
    document.getElementById('lblLegacyFS').classList.toggle('hidden', false);
    document.getElementById('butSave').classList.toggle('hidden', true);
    myEvent('File System APIs', 'Legacy');
  }

  document.getElementById("createFile").addEventListener("click", app.file.createLocal);
})