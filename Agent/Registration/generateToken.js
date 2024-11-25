function generateToken(len) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let token = '';
  
    for (let i = 0, max = len; i < max; i += 1) {
      const index = Math.random() * (chars.length - 1);
      token += chars.charAt(index);
    }
  
    return token;
}