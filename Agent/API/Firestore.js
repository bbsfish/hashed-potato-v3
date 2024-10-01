/**
 * Firestore for Google Apps Scripts
 * https://github.com/grahamearley/FirestoreGoogleAppsScript
 */
const Firestore = (() => {
  const app = FirestoreApp.getFirestore(
    CONSTS.FS.IAM_EMAIL,
    CONSTS.FS.IAM_KEY,
    CONSTS.FS.PROJECT_ID
  );

  Object.assign(app, { COLLECTION_NAME: CONSTS.FS.COLLECTION_NAME });
  return app;
})();
