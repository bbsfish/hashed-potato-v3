class HashedPotatoAgent {
	/**
	 * @param {String} endpoint パートナー情報を送信する、エージェントサーバのエンドポイント
	 * @param {String} requesterId パートナー ID
	 * @param {String} hash 自己証明用のトークン
	 */
	constructor(requesterId, hash) {
		/** @type {String} パートナー情報を送信する、エージェントサーバのエンドポイント */
		this.ENDPOINT = 'https://hashed-potato.mydns.jp/store';
		/** @type {String} パートナー ID */
		this.REQUESTER_ID = requesterId;
		/** @type {String} 自己証明用のトークン */
		this.HASH = hash;
	};

	createPostOptions(payload) {
		return {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		};
	}

	/**
	 * @param {{ redirectURI: String, scope: String[], type: String }} params
	 * パートナー情報のオブジェクト.
	 * scope と type はデフォルト値を持つ: scope = ['none'], type = 'bridge'
	 */
	async post({ redirectURI, scope, type }) {
		scope = scope ?? ['none'];
		type = type ?? 'bridge';
		const options = this.createPostOptions({
			requester_id: this.REQUESTER_ID,
			hash: this.HASH,
			redirect_uri: redirectURI,
			scope,
			type,
		});
		console.log('POST - %s\n%O', this.ENDPOINT, options);
		const startTime = performance.now();
		const response = await fetch(this.ENDPOINT, options);
        const endTime = performance.now();
        console.log('エージェントによる受付ID発行にかかった時間: %s ミリ秒', endTime - startTime);
		const data = await response.json();
		console.log('RESPONSE:', data);
		return data;
	}

	async ping() {
		const startTime = performance.now();
		const response = await fetch(`https://hashed-potato.mydns.jp/ping/${startTime}`);
		const data = await response.json();
		console.log('エージェントへの導通時間: starttime=%s, endtime=%s, difference=%s', data.starttime, data.endtime, data.difference);
	}
};
