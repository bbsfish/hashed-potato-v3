document.getElementById('createFile')
    .addEventListener('click', createDeviceFile);

async function createDeviceFile() {
  const fileMaster = new FileMaster();
  myEvent('app', 'create local');
  try {
    // Fetch Device File ID from server
    const response = await fetch('/devicefile/createid');
    if (!response.ok) { throw new Error('server response error'); }
    const object = await response.json();

    const deviceFileId = object.device_file_id;
    console.log('deviceFileId: ', deviceFileId);

    // get file handle
    const fileHandle = await FileMaster.createFile();
    await fileMaster.setFileHandle(fileHandle);
    fileMaster.copyFileContentTemplate();
    await fileMaster.setRecentFiles();
    fileMaster.setDeviceFileId(deviceFileId);
    await fileMaster.writeOut();

  } catch (err) {
    console.error(err);
  }
}