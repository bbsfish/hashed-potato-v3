class HashedPotatoAgent {
	/**
	 * @param {String} endpoint パートナー情報を送信する、エージェントサーバのエンドポイント
	 * @param {String} requesterId パートナー ID
	 * @param {String} hash 自己証明用のトークン
	 */
	constructor(endpoint, requesterId, hash) {
		/** @type {String} パートナー情報を送信する、エージェントサーバのエンドポイント */
		this.ENDPOINT = endpoint;
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
		const response = await fetch(this.ENDPOINT, options);
		const data = await response.json();
		console.log('RESPONSE:', data);
		return data;
	}
};
