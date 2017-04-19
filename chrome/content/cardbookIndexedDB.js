if ("undefined" == typeof(cardbookIndexedDB)) {
	var cardbookIndexedDB = {

		// first step in the initial load data
		openDB: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			
			// generic output when errors on DB
			cardbookRepository.cardbookDatabase.onerror = function(e) {
				wdw_cardbooklog.updateStatusProgressInformation("Database error : " + e.value, "Error");
			};

			var request = indexedDB.open(cardbookRepository.cardbookDatabaseName, cardbookRepository.cardbookDatabaseVersion);
		
			// when version changes
			// for the moment delete all and recreate one new empty
			request.onupgradeneeded = function(e) {
				var db = e.target.result;
				e.target.transaction.onerror = cardbookRepository.cardbookDatabase.onerror;
				
				if (db.objectStoreNames.contains("cards")) {
					db.deleteObjectStore("cards");
				}
				
				var store = db.createObjectStore("cards", {keyPath: "cbid", autoIncrement: false});
				store.createIndex("cacheuriIndex", "cacheuri", { unique: false });
			};

			// when success, call the observer for starting the load cache and maybe the sync
			request.onsuccess = function(e) {
				cardbookRepository.cardbookDatabase.db = e.target.result;
				cardbookUtils.notifyObservers("cardbook.DBOpen");
			};

			// when error, call the observer for starting the load cache and maybe the sync
			request.onerror = function(e) {
				cardbookUtils.notifyObservers("cardbook.DBOpen");
				cardbookRepository.cardbookDatabase.onerror();
			};
		},

		// add the contact to the cache only if it is missing
		addItemIfMissing: function (aDirPrefIdName, aCard) {
			var prefName = aDirPrefIdName;
			var card = aCard;
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readonly");
			var store = transaction.objectStore("cards");
			var cursorRequest = store.get(aCard.cbid);
		
			cursorRequest.onsuccess = function(e) {
				if (!(e.target.result != null)) {
					cardbookIndexedDB.addItem(prefName, card);
				}
			};
			
			cursorRequest.onerror = cardbookRepository.cardbookDatabase.onerror;
		},
		
		// add or override the contact to the cache 
		addItem: function (aDirPrefIdName, aCard) {
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readwrite");
			var store = transaction.objectStore("cards");
			var cursorRequest = store.put(aCard);
			cursorRequest.onsuccess = function(e) {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aDirPrefIdName + " : debug mode : Contact " + aCard.fn + " written to DB");
			};
			
			cursorRequest.onerror = cardbookRepository.cardbookDatabase.onerror;
		},

		// delete the contact
		removeItem: function (aDirPrefIdName, aCard) {
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readwrite");
			var store = transaction.objectStore("cards");
			var cursorRequest = store.delete(aCard.cbid);
			cursorRequest.onsuccess = function(e) {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aDirPrefIdName + " : debug mode : Contact " + aCard.fn + " deleted from DB");
			};
			
			cursorRequest.onerror = cardbookRepository.cardbookDatabase.onerror;
		},

		// once the DB is open, this is the second step for the AB
		// which use the DB caching
		loadItems: function (aDirPrefId, aDirPrefName, aMode, aCallback, aKeyRange) {
			var cb = aCallback;
			var myMode = aMode;
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readonly");
			var store = transaction.objectStore("cards");
			var cursorRequest = store.openCursor(aKeyRange);
		
			transaction.oncomplete = function() {
				cb(aDirPrefId);
			};
		
			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					cardbookRepository.addCardToRepository(result.value, myMode, result.value.cacheuri);
					cardbookRepository.cardbookServerSyncDone[aDirPrefId]++;
					cardbookRepository.cardbookServerSyncTotal[aDirPrefId]++;
					cardbookUtils.formatStringForOutput("cardLoadedFromCacheDB", [aDirPrefName, result.value.fn]);
					result.continue();
				}
			};
			
			cursorRequest.onerror = function(e) {
				cardbookRepository.cardbookDatabase.onerror();
			};
		},

		// once the DB is open, this is the second step for the AB
		// which use the DB caching
		getItemByCacheuri: function (aCacheuri, aCallback, aParams) {
			var cb = aCallback;
			var params = aParams;
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readonly");
			var store = transaction.objectStore("cards");
			var keyRange = IDBKeyRange.bound(aCacheuri, aCacheuri + '\uffff');
			var cursorRequest = store.index('cacheuriIndex').openCursor(keyRange);
		
			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					if (result.value.cacheuri == aCacheuri && result.value.dirPrefId == params.aDirPrefId) {
						cb(result.value, params);
					}
					result.continue();
				}
			};
			
			cursorRequest.onerror = function(e) {
				cardbookRepository.cardbookDatabase.onerror();
			};
		},

		// remove an account
		removeAccount: function (aDirPrefId, aDirPrefName) {
			var db = cardbookRepository.cardbookDatabase.db;
			var transaction = db.transaction(["cards"], "readwrite");
			var store = transaction.objectStore("cards");
			var keyRange = IDBKeyRange.bound(aDirPrefId, aDirPrefId + '\uffff');
			var cursorRequest = store.openCursor(keyRange);
		
			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					cardbookIndexedDB.removeItem(aDirPrefName, result.value);
					result.continue();
				}
			};
			
			cursorRequest.onerror = function(e) {
				cardbookRepository.cardbookDatabase.onerror();
			};
		},

		// when all contacts were loaded from the cache
		// tells that it is finished
		itemsComplete: function (aDirPrefId) {
			cardbookRepository.cardbookDBResponse[aDirPrefId]++;
		},
		
		// load all contacts for an addressbook
		loadDB: function (aDirPrefId, aDirPrefName, aMode) {
			var keyRange = IDBKeyRange.bound(aDirPrefId, aDirPrefId + '\uffff');
			cardbookIndexedDB.loadItems(aDirPrefId, aDirPrefName, aMode, cardbookIndexedDB.itemsComplete, keyRange);
		}

	};
};

