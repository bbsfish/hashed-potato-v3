const crypto = require('crypto');

module.exports = (() => {
	/**
	 * ランダムなバイト列を指定の長さで生成する
	 * @param {Number} [len=64] バイト列長さ
	 * @returns {Buffer} ランダムなバイト列
	 */
	const getRandomBytes = (len = 64) => {
		return crypto.randomBytes(len);
	}

	const generate = (len = 64) => {
		const buffer = getRandomBytes(len);
		return buffer.toString('base64').substring(0, len);
	}

	return {
		getRandomBytes,
		generate,
	};
})();


