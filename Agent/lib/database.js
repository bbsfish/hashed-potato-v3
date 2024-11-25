const sqlite = require('sqlite3');

class Database {
	constructor(databaseFile) {
		this.file = databaseFile;
		this.database = new sqlite.Database(databaseFile);
	}

	get(query, params = []) {
		return new Promise((resolve, reject) => {
			this.database.get(query, params, (err, row) => {
				console.group('# Database.GET');
				console.debug('query:', query);
				console.debug('params:', params);
				console.debug('err:', err);
				console.debug('row:', row);
				console.groupEnd();
				if (err !== null) reject(err);
				else resolve(row);
			});
		});
	}

	all(query, params = []) {
		return new Promise((resolve, reject) => {
			this.database.all(query, params, (err, rows) => {
				console.group('# Database.ALL');
				console.debug('query:', query);
				console.debug('params:', params);
				console.debug('err:', err);
				console.debug('rows:', rows);
				console.groupEnd();
				if (err !== null) reject(err);
				else resolve(rows);
			});
		});
	}

	run(query, params = [], callback = () => {}) {
		this.database.run(query, params, (err) => {
			console.group('# Database.RUN');
			console.debug('query:', query);
			console.debug('params:', params);
			console.debug('err:', err);
			console.groupEnd();
			callback(err);
		});
	}

	close() {
		this.database.close();
	}
}

module.exports = Database;