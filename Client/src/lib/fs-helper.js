/**
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* exported getFileHandle, getNewFileHandle, readFile, verifyPermission,
writeFile */

/* eslint-disable */

/**
 * Open a handle to an existing file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
 */
function getFileHandle () {
  // For Chrome 86 and later...
  if ('showOpenFilePicker' in window) {
    return window.showOpenFilePicker().then((handles) => handles[0]);
  }
  // For Chrome 85 and earlier...
  return window.chooseFileSystemEntries();
}

/**
 * Create a handle to a new (text) file on the local file system.
 * @param {string} filename suggested filename
 * @return {!Promise<FileSystemFileHandle>} Handle to the new file.
 */
function getNewFileHandle (filename) {
  // For Chrome 86 and later...
  if ('showSaveFilePicker' in window) {
    const opts = {
      types: [{
        description: 'Data Store File (XML Document)',
        accept: {'text/xml': ['.xml']},
      }],
      suggestedName: filename,
    };
    return window.showSaveFilePicker(opts);
  }
  // For Chrome 85 and earlier...
  const opts = {
    type: 'save-file',
    accepts: [{
      description: 'Text file',
      extensions: ['txt'],
      mimeTypes: ['text/plain'],
    }],
  };
  return window.chooseFileSystemEntries(opts);
}

/**
 * Reads the raw text from a file.
 *
 * @param {File} file
 * @return {!Promise<string>} A promise that resolves to the parsed string.
 */
function readFile (file) {
  // If the new .text() reader is available, use it.
  if (file.text) {
    return file.text();
  }
  // Otherwise use the traditional file reading technique.
  return _readFileLegacy(file);
}

/**
 * Reads the raw text from a file.
 *
 * @private
 * @param {File} file
 * @return {Promise<string>} A promise that resolves to the parsed string.
 */
function _readFileLegacy (file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      const text = e.srcElement.result;
      resolve(text);
    });
    reader.readAsText(file);
  });
}

/**
 * Writes the contents to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} contents Contents to write.
 */
async function writeFile (fileHandle, contents) {
  // Support for Chrome 82 and earlier.
  if (fileHandle.createWriter) {
    // Create a writer (request permission if necessary).
    const writer = await fileHandle.createWriter();
    // Write the full length of the contents
    await writer.write(0, contents);
    // Close the file and write the contents to disk
    await writer.close();
    return;
  }
  // For Chrome 83 and later.
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} withWrite True if write permission should be checked.
 * @return {boolean} True if the user has granted read/write permission.
 */
async function verifyPermission (fileHandle, withWrite) {
  const opts = {};
  if (withWrite) {
    opts.writable = true;
    // For Chrome 86 and later...
    opts.mode = 'readwrite';
  }
  // Check if we already have permission, if so, return true.
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}

/**
 * FileSystemFileHandle からそのコンテンツを取得します
 * @param {Object<FileSystemFileHandle>} fileHandle
 * @return {Object}
 */
async function getFileContent(fileHandle) {
  if (verifyPermission(fileHandle, true) === false) return;
  const file = await fileHandle.getFile();
  const fileText = await readFile(file);
  return fileText;
}

export {
  getFileHandle, getNewFileHandle,
  readFile, writeFile, verifyPermission, getFileContent
};
