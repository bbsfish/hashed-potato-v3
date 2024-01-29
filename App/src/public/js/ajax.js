const HOST = location.protocol.concat("//", location.host);

// Prepare Ajax Option
const options = function (bodyObject = null) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: (bodyObject == null) ? "" : JSON.stringify(bodyObject)
    }
}