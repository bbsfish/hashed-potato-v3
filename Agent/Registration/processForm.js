function processForm(formObject) {
    try {
        const { pid } = formObject;
        const documents = Firestore
            .query(CONSTS.FS.COLLECTION_PATH)
            .Where("pid", "==", pid)
            .Execute();
        if(documents.length > 0) return Response.error('その ID はすでに登録されています');
        const token = Token.generate(64);
        Firestore.createDocument(CONSTS.FS.COLLECTION_PATH, { pid, token });
        return Response.ok({
            status: 1,
            token,
            message: 'ID は登録されました'
        });
    } catch (error) {
        return Response.error(error.message);
    }
}
