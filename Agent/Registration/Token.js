const Token = (() => {
  const getRandomChars = (len = 64) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let str = '';
  
    for (let i = 0, max = len; i < max; i += 1) {
      const index = Math.random() * (chars.length - 1);
      str += chars.charAt(index);
    }
    return str;
  }

  const digest = (text) => {
    return Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      text,
      Utilities.Charset.UTF_8
    ); 
  }

  const generate = (minLen = 64) => {
    let token = '';
    while (token.length < minLen) {
      let str = getRandomChars(64) + Utilities.getUuid();
      str = Utilities.base64Encode(digest(str));
      token += str.replaceAll('=', '');
    }
    return token;
  }

  return {
    getRandomChars,
    digest,
    generate,
  };
})();


