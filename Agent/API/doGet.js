function doGet(e) {
  if (e === undefined) return;
  Logger.log('GET');
  if (!('reception_id' in e.parameters)) return Response.error('Invalid Parameters');
  const receptionId = e.parameters.reception_id; // 受付ID
  Logger.log('Reception Id ' + receptionId);

  // Firestore 問い合わせ
  const document = (() => {
    try {
      const path = `${Firestore.COLLECTION_NAME}/${encodeURIComponent(receptionId)}`;
      return Firestore.getDocument(path);
    } catch(err) {
      return null;
    }
  })();
  Logger.log('Firestore document ' + JSON.stringify(document));

  // 無効な受付ID
  if (!document) return Response.error('Invalid Parameters');

  // 取得
  let data = {};
  CONSTS.CHK_FIELDS.forEach((f) => { data[f] = document.obj[f]; });
  return Response.ok(data);
}