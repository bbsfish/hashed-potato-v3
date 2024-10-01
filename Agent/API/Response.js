const Response = (() => {
  const _json = (payload) => {
    const output = ContentService.createTextOutput()
      .setMimeType(ContentService.MimeType.JSON)
      .setContent(JSON.stringify(payload));
    Logger.log('Responce Payload ' + JSON.stringify(payload));
    return output;
  };
  const ok = (data) => _json(data);
  const error = (message) => _json({ error: message });
  return { ok, error };
})();