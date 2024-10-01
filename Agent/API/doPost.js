function doPost(e) {
  try {
    if (e === undefined) return;
    Logger.log('POST');
    const body = (() => {
      try {
        return e.parameter;
      } catch {
        return null;
      }
    })();
    Logger.log('Body Content ' + JSON.stringify(body));
    if (!body) return Response.error('Invalid Parameters');

    // 変数チェック
    // FIELDS がすべて body にあるかどうか確認する
    // ここでは足りないものが lacked に入る
    const lacked = FIELDS.find((f) => (f in body) === false);
    Logger.log('Lacked ' + JSON.stringify(lacked));
    if (lacked !== undefined) {
      // 不足あり
      return Response.error(`Invalid Parameters, ${lacked} not specified`);
    }

    // 付加情報
    // 時間
    const now = new Date();
    Object.assign(body, {
      requested_time: now.getTime(),
      expires_time: now.getTime() + CONSTS.TIME_LIMIT,
    });
    Logger.log('Customized Body Content ' + JSON.stringify(body));

    // Firestore に保存
    const newDocument = Firestore.createDocument(Firestore.COLLECTION_NAME, body);
    // newDocument => projects/.../documents/{collection_id}/{document_id}
    const newDocId = (newDocument.name).split('/').pop();
    Logger.log('Created Document ID' + newDocId);

    return Response.ok({ reception_id: newDocId });
  } catch(error) {
    error = (typeof error === 'string') ? new Error(error) : error;
    Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s".',
      error.name||'', error.message||'', error.lineNumber||'',
      error.fileName||'', error.stack||'');
    throw error;
  }
}
