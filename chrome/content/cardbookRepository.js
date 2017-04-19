var EXPORTED_SYMBOLS = ["cardbookRepository"];

var cardbookRepository = {
	cardbookDatabase : {},
	cardbookDatabaseVersion : "6",
	cardbookDatabaseName : "CardBook",
	
	LIGHTNING_ID : "{e2fda1a4-762b-4020-b5ad-a41df1933103}",
	
	allColumns : { "display": ["fn"],
					"personal": ["prefixname", "firstname", "othername", "lastname", "suffixname", "nickname", "bday", "gender"],
					"org": ["org", "title", "role"],
					"categories": ["categories"],
					"arrayColumns": [ ["email", ["email"] ],
						["adr", ["postOffice", "extendedAddr", "street", "locality", "region", "postalCode", "country"] ],
						["impp", ["impp"] ],
						["tel", ["tel"] ],
						["url", ["url"] ] ],
					"note": ["note"],
					"technical": ["version"] },

	dateFormats : ["YYYY-MM-DD", "YYYY.MM.DD", "YYYY/MM/DD", "YYYYMMDD", "DD-MM-YYYY", "DD.MM.YYYY", "DD/MM/YYYY", "DDMMYYYY", "MM-DD-YYYY", "MM.DD.YYYY", "MM/DD/YYYY", "MMDDYYYY"],

	defaultFnFormula : "({{1}} |)({{2}} |)({{3}} |)({{4}} |)({{5}} |)({{6}} |)",

	preferEmailPref : true,
	
	cardbookAccounts : [],
	cardbookAccountsCategories : {},
	cardbookCards : {},
	cardbookDisplayCards : {},
	cardbookCardSearch1 : {},
	cardbookCardSearch2 : {},
	cardbookCardEmails : {},
	cardbookFileCacheCards : {},

	cardbookMailPopularityIndex : {},

	cardbookDirRequest : {},
	cardbookDirResponse : {},
	cardbookFileRequest : {},
	cardbookFileResponse : {},
	cardbookDBRequest : {},
	cardbookDBResponse : {},
	filesFromCacheDB : {},
	
	cardbookServerValidation : {},

	cardbookGoogleAccessTokenRequest : {},
	cardbookGoogleAccessTokenResponse : {},
	cardbookGoogleAccessTokenError : {},
	cardbookGoogleRefreshTokenRequest : {},
	cardbookGoogleRefreshTokenResponse : {},
	cardbookGoogleRefreshTokenError : {},
	cardbookServerDiscoveryRequest : {},
	cardbookServerDiscoveryResponse : {},
	cardbookServerDiscoveryError : {},
	cardbookServerSyncRequest : {},
	cardbookServerSyncResponse : {},
	cardbookServerSyncEmptyCache : {},
	cardbookServerSyncLoadCacheDone : {},
	cardbookServerSyncLoadCacheTotal : {},
	cardbookServerSyncDone : {},
	cardbookServerSyncTotal : {},
	cardbookServerSyncError : {},
	cardbookServerSyncNotUpdated : {},
	cardbookServerSyncNewOnServer : {},
	cardbookServerSyncNewOnDisk : {},
	cardbookServerSyncUpdatedOnServer : {},
	cardbookServerSyncUpdatedOnDisk : {},
	cardbookServerSyncUpdatedOnBoth : {},
	cardbookServerSyncUpdatedOnDiskDeletedOnServer : {},
	cardbookServerSyncDeletedOnDisk : {},
	cardbookServerSyncDeletedOnDiskUpdatedOnServer : {},
	cardbookServerSyncDeletedOnServer : {},
	cardbookServerSyncAgain : {},
	cardbookServerSyncCompareWithCacheDone : {},
	cardbookServerSyncCompareWithCacheTotal : {},
	cardbookServerSyncHandleRemainingDone : {},
	cardbookServerSyncHandleRemainingTotal : {},
	cardbookServerGetRequest : {},
	cardbookServerGetResponse : {},
	cardbookServerGetError : {},
	cardbookServerGetForMergeRequest : {},
	cardbookServerGetForMergeResponse : {},
	cardbookServerGetForMergeError : {},
	cardbookServerMultiGetArray : {},
	cardbookServerMultiGetParams : {},
	cardbookServerMultiGetRequest : {},
	cardbookServerMultiGetResponse : {},
	cardbookServerMultiGetError : {},
	cardbookServerUpdatedRequest : {},
	cardbookServerUpdatedResponse : {},
	cardbookServerUpdatedError : {},
	cardbookServerCreatedRequest : {},
	cardbookServerCreatedResponse : {},
	cardbookServerCreatedError : {},
	cardbookServerDeletedRequest : {},
	cardbookServerDeletedResponse : {},
	cardbookServerDeletedError : {},
	cardbookImageGetRequest : {},
	cardbookImageGetResponse : {},
	cardbookImageGetError : {},
	cardbookSyncMode : "NOSYNC",

	cardbookSearchMode : "NOSEARCH",
	cardbookComplexSearchMode : "NOSEARCH",
	cardbookComplexSearchAB : "allAddressBooks",
	cardbookComplexMatchAll : true,
	cardbookComplexRules : [],
	cardbookSearchValue : "",

	lTimerLoadCacheAll : {},
	lTimerDirAll : {},
	lTimerSyncAll : {},
	lTimerImportAll : {},
	lTimerNoSyncModeAll : {},
	
	// used to ensure that the initial load is done only once
	firstLoad : false,

	// used to remember the choice of overriding or not cards
	// while importing, dragging, copying or duplicating
	importConflictChoice : "",
	importConflictChoicePersist : false,

	// used to store the msgIdentityKey by window
	composeMsgIdentity : {},
	
	cardbookDynamicCssRules : {},

	cardbookUncategorizedCards : "",
	cardbookCollectedCards : "",
	cardbookCollectedCardsId : "Collected",
	
	cardbookMailPopularityFile : "mailPopularityIndex.txt",

	customFields : [ 'customField1Name', 'customField2Name', 'customField1Org', 'customField2Org' ],
	customFieldsValue : {},
	customFieldsLabel : {},
									
	statusInformation : [],

	cardbookgdata : {
		CLIENT_ID:                  "779554755808-957jloa2c3c8n0rrm1a5304fkik7onf0.apps.googleusercontent.com",
		CLIENT_SECRET:              "h3NUkhofCKAW2E1X_NKSn4C_",
		REDIRECT_URI:               "urn:ietf:wg:oauth:2.0:oob",
		REDIRECT_TITLE:             "Success code=",
		RESPONSE_TYPE:              "code",
		SCOPE:                      "https://www.googleapis.com/auth/carddav",
		OAUTH_URL:                  "https://accounts.google.com/o/oauth2/auth",
		TOKEN_REQUEST_URL:          "https://accounts.google.com/o/oauth2/token",
		TOKEN_REQUEST_TYPE:         "POST",
		TOKEN_REQUEST_GRANT_TYPE:   "authorization_code",
		REFRESH_REQUEST_URL:        "https://accounts.google.com/o/oauth2/token",
		REFRESH_REQUEST_TYPE:       "POST",
		REFRESH_REQUEST_GRANT_TYPE: "refresh_token",
		AUTH_URL:                   "https://www.google.com/accounts/ClientLogin",
		AUTH_REQUEST_TYPE:          "POST",
		AUTH_SUB_SESSION_URL:       "https://www.google.com/accounts/AuthSubSessionToken",
		AUTH_SUB_SESSION_TYPE:      "GET",
		AUTH_SUB_REVOKE_URL:        "https://www.google.com/accounts/AuthSubRevokeToken",
		AUTH_SUB_REVOKE_TYPE:       "GET",
		GOOGLE_API:                 "https://www.googleapis.com",
	},

	APPLE_API : "https://contacts.icloud.com",
	
	cardbookBirthdayPopup : 0,
	
	jsInclude: function(files, target) {
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
		for (var i = 0; i < files.length; i++) {
			try {
				loader.loadSubScript(files[i], target);
			}
			catch(e) {
				dump("cardbookRepository.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
			}
		}
	},
		
    loadCustoms: function () {
		var cardbookPrefService = new cardbookPreferenceService();
		var myCustoms = [];
		myCustoms = cardbookPrefService.getAllCustoms();
		for (var i in cardbookRepository.customFields) {
			var found = 0;
			for (var j = 0; j < myCustoms.length; j++) {
				var fieldTemp1 = myCustoms[j].split(":");
				var fieldName = fieldTemp1[0];
				var fieldValue = fieldTemp1[1];
				var fieldLabel = fieldTemp1[2];
				if (!(fieldValue != null && fieldValue !== undefined && fieldValue != "")) {
					var fieldLabel = "";
				}
				if (cardbookRepository.customFields[i] == fieldName) {
					cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = fieldValue;
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = fieldLabel;
					j = myCustoms.length;
					found = 1;
				}
			}
			if (found === 0) {
				cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = "";
				cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = "";
			}
		}
	},
		
    setTypes: function () {
		var cardbookPrefService = new cardbookPreferenceService();
		var myTypes = [];
		var myOldTypes = [];
		myTypes = cardbookPrefService.getAllTypesCategory();
		// for file opened with version <= 4.0
		for (var i = 0; i < myTypes.length; i++) {
			if (!(myTypes[i].indexOf(".") >= 0)) {
				myOldTypes.push(cardbookPrefService.getTypes(myTypes[i]));
				cardbookPrefService.delTypes(myTypes[i]);
				myTypes.splice(i,1);
				i--;
			}
		}
		for (var i = 0; i < myOldTypes.length; i++) {
				cardbookPrefService.setTypes("adr", i, myOldTypes[i]);
				cardbookPrefService.setTypes("email", i, myOldTypes[i]);
				cardbookPrefService.setTypes("tel", i, myOldTypes[i]);
				cardbookPrefService.setTypes("impp", i, myOldTypes[i]);
				cardbookPrefService.setTypes("url", i, myOldTypes[i]);
		}
		// for file opened with version <= 4.8
		var myPhoneTypes = [];
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("phone.") >= 0) {
				myPhoneTypes.push(cardbookPrefService.getTypes(myTypes[i]));
				cardbookPrefService.delTypes(myTypes[i]);
				myTypes.splice(i,1);
				i--;
			}
		}
		for (var i = 0; i < myPhoneTypes.length; i++) {
			cardbookPrefService.setTypes("tel", i, myPhoneTypes[i]);
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("url.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertUrlSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("tel.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertTelSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("impp.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertImppSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("email.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertEmailSeedTypes();
		}
		// for file opened with version <= 11.6
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("adr.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertAdrSeedTypes();
		}
		// for file opened with version <= 15.3
		var myIMPPs = [];
		myIMPPs = cardbookPrefService.getAllIMPPs();
		if (myIMPPs.length == 0) {
			cardbookPrefService.insertIMPPsSeed();
		}
	},

	setSolveConflicts: function() {
		try {
			// for file opened with version <= 14.0
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			if (preferDisk) {
				str.data = "Local";
			} else {
				str.data = "Remote";
			}
			prefs.setComplexValue("extensions.cardbook.solveConflicts", Components.interfaces.nsISupportsString, str);
			prefs.deleteBranch("extensions.cardbook.preferDisk");
		}
		catch (e) {
			return "";
		}
	},

	getLocalDirectory: function() {
		let directoryService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
		// this is a reference to the profile dir (ProfD) now.
		let localDir = directoryService.get("ProfD", Components.interfaces.nsIFile);
		
		localDir.append("cardbook");
		
		if (!localDir.exists() || !localDir.isDirectory()) {
			// read and write permissions to owner and group, read-only for others.
			localDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
		}
		return localDir;
	},

	arrayUnique: function (array) {
		var a = array.concat();
		for (var i=0; i<a.length; ++i) {
			for (var j=i+1; j<a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	},
	
	getSearchString: function(aCard) {
		var lResult = "";
		lResult = lResult + aCard.lastname;
		lResult = lResult + aCard.firstname;
		lResult = lResult + aCard.othername;
		lResult = lResult + aCard.prefixname;
		lResult = lResult + aCard.suffixname;
		lResult = lResult + aCard.fn;
		lResult = lResult + aCard.nickname;
		lResult = lResult + aCard.bday;
		lResult = lResult + aCard.fn;
		lResult = lResult + aCard.categories.join();
		for (let i = 0; i < aCard.adr.length; i++) {
			lResult = lResult + aCard.adr[i][0].join();
		}
		for (let i = 0; i < aCard.tel.length; i++) {
			lResult = lResult + aCard.tel[i][0].join();
		}
		for (let i = 0; i < aCard.email.length; i++) {
			lResult = lResult + aCard.email[i][0].join();
		}
		lResult = lResult + aCard.title;
		lResult = lResult + aCard.role;
		lResult = lResult + aCard.org;
		lResult = lResult + aCard.note;
		for (let i = 0; i < aCard.url.length; i++) {
			lResult = lResult + aCard.url[i][0].join();
		}
		for (let i = 0; i < aCard.impp.length; i++) {
			lResult = lResult + aCard.impp[i][0].join();
		}
		lResult = lResult.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
		return lResult;
	},

	setEmptyContainer: function(aAccountId) {
		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			if (cardbookRepository.cardbookAccountsCategories[aAccountId].length > 0) {
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
						cardbookRepository.cardbookAccounts[i][3] = false;
						return;
					}
				}
			} else {
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
						cardbookRepository.cardbookAccounts[i][3] = true;
						cardbookRepository.cardbookAccounts[i][2] = false;
						return;
					}
				}
			}
		}
	},
	
	addAccountToRepository: function(aAccountId, aAccountName, aAccountType, aAccountUrl, aAccountUser, aColor, aEnabled, aExpanded, aVCard, aReadOnly, aDateFormat, aUrnuuid, aDBcached, aPrefInsertion) {
		var cacheDir = cardbookRepository.getLocalDirectory();
		cacheDir.append(aAccountId);
		if (!cacheDir.exists() || !cacheDir.isDirectory()) {
			cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
			cacheDir.append("mediacache");
			cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
		}
		if (aPrefInsertion) {
			let cardbookPrefService = new cardbookPreferenceService(aAccountId);
			cardbookPrefService.setId(aAccountId);
			cardbookPrefService.setName(aAccountName);
			cardbookPrefService.setType(aAccountType);
			cardbookPrefService.setUrl(aAccountUrl);
			cardbookPrefService.setUser(aAccountUser);
			cardbookPrefService.setColor(aColor);
			cardbookPrefService.setEnabled(aEnabled);
			cardbookPrefService.setExpanded(aExpanded);
			cardbookPrefService.setVCard(aVCard);
			cardbookPrefService.setReadOnly(aReadOnly);
			cardbookPrefService.setDateFormat(aDateFormat);
			cardbookPrefService.setUrnuuid(aUrnuuid);
			cardbookPrefService.setDBCached(aDBcached);
		}
		
		cardbookRepository.cardbookAccounts.push([aAccountName, true, aExpanded, true, aAccountId, aEnabled, aAccountType, aReadOnly]);
		cardbookRepository.cardbookDisplayCards[aAccountId] = [];
		cardbookRepository.cardbookAccountsCategories[aAccountId] = [];
	},
		
	removeAccountFromRepository: function(aAccountId, aAccountName) {
		cardbookRepository.removeAccountFromCollected(aAccountId);
		cardbookRepository.removeAccountFromBirthday(aAccountId);

		var cacheDir = cardbookRepository.getLocalDirectory();
		cacheDir.append(aAccountId);
		if (cacheDir.exists() && cacheDir.isDirectory()) {
			cacheDir.remove(true);
		}

		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[aAccountId].length; i++) {
				var myAccountId = aAccountId+"::"+cardbookRepository.cardbookAccountsCategories[aAccountId][i];
				function searchCard1(element) {
					return (element[4] != myAccountId);
				}
				cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard1);
			}
			delete cardbookRepository.cardbookAccountsCategories[aAccountId];
		}

		function searchCard2(element) {
			return (element[4] != aAccountId);
		}
		cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard2, aAccountId);

		for (var key in cardbookRepository.cardbookCards) {
			if (cardbookRepository.cardbookCards.hasOwnProperty(key)) {
				if (key.indexOf(aAccountId) >= 0) {
					cardbookRepository.removeCardFromSearch(cardbookRepository.cardbookCards[key]);
					cardbookRepository.removeCardFromDisplay(cardbookRepository.cardbookCards[key]);
					if (cardbookRepository.cardbookFileCacheCards[aAccountId][cardbookRepository.cardbookCards[key].cacheuri]) {
						delete cardbookRepository.cardbookFileCacheCards[aAccountId][cardbookRepository.cardbookCards[key].cacheuri];
					}
					delete cardbookRepository.cardbookCards[key];
				}
			}
		}
	},
		
	emptyAccountFromRepository: function(aAccountId) {
		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[aAccountId].length; i++) {
				var myAccountId = aAccountId+"::"+cardbookRepository.cardbookAccountsCategories[aAccountId][i];
				function searchCard1(element) {
					return (element[4] != myAccountId);
				}
				cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard1);
				cardbookRepository.cardbookDisplayCards[myAccountId] = [];
			}
			cardbookRepository.cardbookDisplayCards[aAccountId] = [];
			cardbookRepository.cardbookAccountsCategories[aAccountId] = [];
		}
		cardbookRepository.setEmptyContainer(aAccountId);

		for (var key in cardbookRepository.cardbookCards) {
			if (cardbookRepository.cardbookCards.hasOwnProperty(key)) {
				if (key.indexOf(aAccountId) >= 0) {
					cardbookRepository.removeCardFromSearch(cardbookRepository.cardbookCards[key]);
					if (cardbookRepository.cardbookFileCacheCards[aAccountId] && cardbookRepository.cardbookFileCacheCards[aAccountId][cardbookRepository.cardbookCards[key].cacheuri]) {
						delete cardbookRepository.cardbookFileCacheCards[aAccountId][cardbookRepository.cardbookCards[key].cacheuri];
					}
					delete cardbookRepository.cardbookCards[key];
				}
			}
		}
	},
		
	removeAccountFromCollected: function (aDirPrefId) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
		var emailsCollectionList = [];
		emailsCollectionList = emailsCollection.split(',');
		function filterAccount(element) {
			return (element != aDirPrefId);
		}
		emailsCollectionList = emailsCollectionList.filter(filterAccount);
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		str.data = emailsCollectionList.join(',');
		prefs.setComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString, str);
	},

	addAccountToCollected: function (aDirPrefId) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
		var emailsCollectionList = [];
		emailsCollectionList = emailsCollection.split(',');
		emailsCollectionList.push(aDirPrefId);
		function filterAccount(element) {
			return (element != 'init');
		}
		emailsCollectionList = emailsCollectionList.filter(filterAccount);
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		str.data = emailsCollectionList.join(',');
		prefs.setComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString, str);
	},

	removeAccountFromBirthday: function (aDirPrefId) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var addressBooks = prefs.getComplexValue("extensions.cardbook.addressBooksNameList", Components.interfaces.nsISupportsString).data;
		var addressBooksList = [];
		addressBooksList = addressBooks.split(',');
		function filterAccount(element) {
			return (element != aDirPrefId);
		}
		addressBooksList = addressBooksList.filter(filterAccount);
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		str.data = addressBooksList.join(',');
		prefs.setComplexValue("extensions.cardbook.addressBooksNameList", Components.interfaces.nsISupportsString, str);
	},

	removeCardFromRepository: function (aCard, aCacheDeletion) {
		try {
			cardbookRepository.removeCardFromSearch(aCard);
			cardbookRepository.removeCardFromEmails(aCard);
			cardbookRepository.removeCardFromCategories(aCard);
			cardbookRepository.removeCardFromDisplay(aCard);
			if (aCacheDeletion) {
				cardbookRepository.removeCardFromCache(aCard);
			}
			cardbookRepository.removeCardFromList(aCard);
			delete aCard;
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.removeCardFromRepository error : " + e, "Error");
		}
	},

	addCardToRepository: function (aCard, aMode, aFileName) {
		try {
			cardbookRepository.addCardToEmails(aCard);
			cardbookRepository.addCardToSearch(aCard);
			cardbookRepository.addCardToList(aCard);
			cardbookRepository.addCardToCache(aCard, aMode, aFileName);
			cardbookRepository.addCardToCategories(aCard);
			cardbookRepository.addCardToDisplay(aCard);
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.addCardToRepository error : " + e, "Error");
		}
	},

	addCardToList: function(aCard) {
		cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid] = aCard;
	},
		
	removeCardFromList: function(aCard) {
		delete cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid];
	},
		
	addCardToCache: function(aCard, aMode, aFileName) {
		try {
			var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
			var myDirPrefIdName = cardbookPrefService.getName();
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdUrl = cardbookPrefService.getUrl();

			cardbookSynchronization.cachePutMediaCard(aCard, "photo", myDirPrefIdType);
			cardbookSynchronization.cachePutMediaCard(aCard, "logo", myDirPrefIdType);
			cardbookSynchronization.cachePutMediaCard(aCard, "sound", myDirPrefIdType);

			if (myDirPrefIdType === "DIRECTORY") {
				aCard.cacheuri = aFileName;
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(myDirPrefIdUrl);
				myFile.append(aFileName);
				if (aMode === "INITIAL") {
					if (!myFile.exists()) {
						cardbookSynchronization.writeCardsToFile(myFile.path, [aCard], true);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " written to directory");
					}
				} else {
					cardbookSynchronization.writeCardsToFile(myFile.path, [aCard], true);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " written to directory");
				}
			} else if (myDirPrefIdType === "FILE" || myDirPrefIdType === "SEARCH") {
				return;
			} else if (myDirPrefIdType === "GOOGLE" || myDirPrefIdType === "APPLE" || myDirPrefIdType === "CARDDAV" || myDirPrefIdType === "LOCALDB") {
				aCard.cacheuri = aFileName;
				if (cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId]) {
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aFileName] = aCard;
				} else {
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId] = {};
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aFileName] = aCard;
				}
				if (aMode === "INITIAL") {
					cardbookIndexedDB.addItemIfMissing(myDirPrefIdName, aCard);
				} else {
					cardbookIndexedDB.addItem(myDirPrefIdName, aCard);
				}
			} else if (myDirPrefIdType === "CACHE") {
				var myFile = cardbookRepository.getLocalDirectory();
				myFile.append(aCard.dirPrefId);
				myFile.append(aFileName);
				if (aMode === "INITIAL") {
					if (!myFile.exists()) {
						cardbookSynchronization.writeCardsToFile(myFile.path, [aCard], false);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " written to cache");
					}
				} else {
					if (myFile.exists() && myFile.isFile()) {
						myFile.remove(true);
					}
					cardbookSynchronization.writeCardsToFile(myFile.path, [aCard], false);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " written to cache");
				}
				aCard.cacheuri = aFileName;
				if (cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId]) {
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aFileName] = aCard;
				} else {
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId] = {};
					cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aFileName] = aCard;
				}
			}
		}
		catch(e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.addCardToCache error : " + e, "Error");
		}
	},

	removeCardFromCache: function(aCard) {
		try {
			cardbookSynchronization.cacheDeleteMediaCard(aCard);
			
			var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
			var myDirPrefIdName = cardbookPrefService.getName();
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdUrl = cardbookPrefService.getUrl();
			if (myDirPrefIdType === "DIRECTORY") {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(myDirPrefIdUrl);
				myFile.append(aCard.cacheuri);
				if (myFile.exists() && myFile.isFile()) {
					myFile.remove(true);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " deleted from directory");
				}
			} else if (myDirPrefIdType === "FILE" || myDirPrefIdType === "SEARCH") {
				return;
			} else if (myDirPrefIdType === "GOOGLE" || myDirPrefIdType === "APPLE" || myDirPrefIdType === "CARDDAV" || myDirPrefIdType === "LOCALDB") {
				cardbookIndexedDB.removeItem(myDirPrefIdName, aCard);
				if (cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aCard.cacheuri]) {
					delete cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aCard.cacheuri];
				}
			} else if (myDirPrefIdType === "CACHE") {
				var myFile = cardbookRepository.getLocalDirectory();
				myFile.append(aCard.dirPrefId);
				myFile.append(aCard.cacheuri);
				if (myFile.exists() && myFile.isFile()) {
					myFile.remove(true);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myDirPrefIdName + " : debug mode : Contact " + aCard.fn + " deleted from cache");
					if (cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aCard.cacheuri]) {
						delete cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId][aCard.cacheuri];
					}
				}
			}
		}
		catch(e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.removeCardFromCache error : " + e, "Error");
		}
	},

	addCardToCategories: function(aCard) {
		if (aCard.categories.length != 0) {
			cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.arrayUnique(cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].concat(aCard.categories));
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.arrayUnique(cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].concat([uncategorizedCards]));
		}
		cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookUtils.sortArrayByString(cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId],-1,1);
		cardbookRepository.setEmptyContainer(aCard.dirPrefId);
	},
		
	removeCardFromCategories: function(aCard) {
		if (aCard.categories.length != 0) {
			for (var j = 0; j < aCard.categories.length; j++) {
				if (cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId]) {
					function searchCategory(element) {
						if (element != aCard.categories[j]) {
							return true;
						} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length > 1) {
							return true;
						} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length == 1) {
							if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]][0].uid == aCard.uid) {
								return false;
							} else {
								return true;
							}
						}
					}
					cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].filter(searchCategory);
				}
				
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
					if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length === 1) {
						cardbookRepository.removeCategoryFromAccounts(aCard.dirPrefId+"::"+aCard.categories[j]);
						cardbookRepository.removeCategoryFromCategories(aCard.dirPrefId, aCard.categories[j]);
					} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length === 0) {
						cardbookRepository.removeCategoryFromDisplay(aCard.dirPrefId+"::"+aCard.categories[j]);
					}
				}
			}
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			if (cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId]) {
				function searchCategory(element) {
					return ((element == uncategorizedCards && cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length > 1)
							|| (element != uncategorizedCards));
				}
				cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].filter(searchCategory);
			}

			if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length === 1) {
					cardbookRepository.removeCategoryFromAccounts(aCard.dirPrefId+"::"+uncategorizedCards);
				} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length === 0) {
					cardbookRepository.removeCategoryFromDisplay(aCard.dirPrefId+"::"+uncategorizedCards);
				}
			}
		}
		cardbookRepository.setEmptyContainer(aCard.dirPrefId);
	},

	removeCategoryFromAccounts: function(aCategory) {
		function searchAccount(element) {
			return (element[4] !== aCategory);
		}
		cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchAccount);
	},

	removeCategoryFromCategories: function(aDirPrefId, aCategoryName) {
		function searchCategory(element) {
			return (element !== aCategoryName);
		}
		cardbookRepository.cardbookAccountsCategories[aDirPrefId] = cardbookRepository.cardbookAccountsCategories[aDirPrefId].filter(searchCategory);
	},

	addCategoryToCard: function(aCard, aCategoryName) {
		aCard.categories.push(aCategoryName);
		aCard.categories = cardbookUtils.cleanCategories(aCard.categories);
	},

	removeCategoryFromCard: function(aCard, aCategoryName) {
		function searchCategory(element) {
			return (element !== aCategoryName);
		}
		aCard.categories = aCard.categories.filter(searchCategory);
	},

	renameCategoryFromCard: function(aCard, aOldCategoryName, aNewCategoryName) {
		cardbookRepository.removeCategoryFromCard(aCard, aOldCategoryName);
		cardbookRepository.addCategoryToCard(aCard, aNewCategoryName);
	},

	removeCategoryFromDisplay: function(aCategory) {
		delete cardbookRepository.cardbookDisplayCards[aCategory];
	},

	addCardToDisplay: function(aCard) {
		cardbookRepository.cardbookDisplayCards[aCard.dirPrefId].push(aCard);
		if (aCard.categories.length != 0) {
			for (let j = 0; j < aCard.categories.length; j++) {
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].push(aCard);
				} else {
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]] = [];
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].push(aCard);
				}
			}
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].push(aCard);
			} else {
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards] = [];
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].push(aCard);
			}
		}
		var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
		wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " added to display");

		if (cardbookRepository.cardbookSearchMode === "SEARCH") {
			if (cardbookRepository.getSearchString(aCard).indexOf(cardbookRepository.cardbookSearchValue) >= 0) {
				cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(aCard);
			}
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " added to display search");
		} else if (cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
			if (cardbookComplexSearch.isMyCardFound(aCard)) {
				cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(aCard);
			}
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " added to display search");
		}

	},
	
	removeCardFromDisplay: function(aCard) {
		if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId]) {
			function searchCard(element) {
				return (element.uid != aCard.uid);
			}
			cardbookRepository.cardbookDisplayCards[aCard.dirPrefId] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId].filter(searchCard);
			if (aCard.categories.length != 0) {
				for (let j = 0; j < aCard.categories.length; j++) {
					if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
						function searchCard(element) {
							return (element.uid != aCard.uid);
						}
						cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].filter(searchCard);
						if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length == 0) {
							delete cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]];
						}
					}
				}
			} else {
				var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
					function searchCard(element) {
						return (element.uid != aCard.uid);
					}
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].filter(searchCard);
				}
			}
			var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " deleted from display");
		}
		if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
			function searchCard(element) {
				return (element.dirPrefId+"::"+element.uid != aCard.dirPrefId+"::"+aCard.uid);
			}
			cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue] = cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].filter(searchCard);
			var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " deleted from display search");
		}
	},
	
	addCardToEmails: function(aCard) {
		for (var i = 0; i < aCard.email.length; i++) {
			var myEmail = aCard.email[i][0][0].toLowerCase();
			if (myEmail != null && myEmail !== undefined && myEmail != "") {
				if (!cardbookRepository.cardbookCardEmails[aCard.dirPrefId]) {
					cardbookRepository.cardbookCardEmails[aCard.dirPrefId] = {};
				}
				if (!cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail]) {
					cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail] = [];
				}
				cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail].push(aCard);
			}
		}
	},
		
	removeCardFromEmails: function(aCard) {
		if (cardbookRepository.cardbookCardEmails[aCard.dirPrefId]) {
			for (var i = 0; i < aCard.email.length; i++) {
				var myEmail = aCard.email[i][0][0].toLowerCase();
				if (myEmail != null && myEmail !== undefined && myEmail != "") {
					if (cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail]) {
						if (cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail].length == 1) {
							delete cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail];
						} else {
							function searchCard(element) {
								return (element.dirPrefId+"::"+element.uid != aCard.dirPrefId+"::"+aCard.uid);
							}
							cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail] = cardbookRepository.cardbookCardEmails[aCard.dirPrefId][myEmail].filter(searchCard);
						}
					}
				}
			}
		}
	},

	addCardFromDisplayAndEmail: function (aDirPrefId, aDisplayName, aEmail, aCategory) {
		if (!(aDisplayName != null && aDisplayName !== undefined && aDisplayName != "")) {
			if (!(aEmail != null && aEmail !== undefined && aEmail != "")) {
				return;
			} else {
				aDisplayName = aEmail;
			}
		}
		this.jsInclude(["chrome://cardbook/content/cardbookCardParser.js"]);
		var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
		var myDirPrefIdName = cardbookPrefService.getName();
		var myDirPrefIdType = cardbookPrefService.getType();
		var myDirPrefIdUrl = cardbookPrefService.getUrl();
		var myDirPrefIdVCard = cardbookPrefService.getVCard();
		var myDirPrefIdReadOnly = cardbookPrefService.getReadOnly();
		if (!myDirPrefIdReadOnly) {
			var myNewCard = new cardbookCardParser();
			myNewCard.dirPrefId = aDirPrefId;
			myNewCard.version = myDirPrefIdVCard;
			cardbookUtils.setCardUUID(myNewCard);
			myNewCard.fn = aDisplayName;
			if (myNewCard.fn == "") {
				myNewCard.fn = aEmail.substr(0, aEmail.indexOf("@")).replace("."," ").replace("_"," ");
			}
			var myDisplayNameArray = aDisplayName.split(" ");
			if (myDisplayNameArray.length > 1) {
				myNewCard.lastname = myDisplayNameArray[myDisplayNameArray.length - 1];
				var removed = myDisplayNameArray.splice(myDisplayNameArray.length - 1, 1);
				myNewCard.firstname = myDisplayNameArray.join(" ");
			}
			myNewCard.email = [ [ [aEmail], [] ,"", [] ] ];
			if (aCategory != null && aCategory !== undefined && aCategory != "") {
				cardbookRepository.addCategoryToCard(myNewCard, aCategory);
			}
			var myNullCard = new cardbookCardParser();
			cardbookRepository.saveCard(myNullCard, myNewCard, "cardbook.cardAddedIndirect");
			cardbookRepository.reWriteFiles([aDirPrefId]);
		} else {
			cardbookUtils.formatStringForOutput("addressbookReadOnly", [myDirPrefIdName]);
		}
	},

	isEmailRegistered: function(aEmail) {
		if (aEmail != null && aEmail !== undefined && aEmail != "") {
			var myTestString = aEmail.toLowerCase();
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if (cardbookRepository.isEmailInPrefIdRegistered(myDirPrefId, aEmail)) {
						return true;
					}
				}
			}
		}
		return false;
	},
		
	isEmailInPrefIdRegistered: function(aDirPrefId, aEmail) {
		if (aEmail != null && aEmail !== undefined && aEmail != "") {
			var myTestString = aEmail.toLowerCase();
			if (cardbookRepository.cardbookCardEmails[aDirPrefId]) {
				if (cardbookRepository.cardbookCardEmails[aDirPrefId][myTestString]) {
					return true;
				}
			}
		}
		return false;
	},
		
	addCardToSearch: function(aCard) {
		var myText = cardbookRepository.getSearchString(aCard);
		if (myText != null && myText !== undefined && myText != "") {
			if (!cardbookRepository.cardbookCardSearch1[myText]) {
				cardbookRepository.cardbookCardSearch1[myText] = [];
			}
			cardbookRepository.cardbookCardSearch1[myText].push(aCard);
			
			if (!cardbookRepository.cardbookCardSearch2[aCard.dirPrefId]) {
				cardbookRepository.cardbookCardSearch2[aCard.dirPrefId] = {};
			}
			if (!cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText]) {
				cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText] = [];
			}
			cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText].push(aCard);
		}
	},
		
	removeCardFromSearch: function(aCard) {
		var myText = cardbookRepository.getSearchString(aCard);
		if (myText != null && myText !== undefined && myText != "") {
			if (cardbookRepository.cardbookCardSearch1[myText]) {
				if (cardbookRepository.cardbookCardSearch1[myText].length == 1) {
					delete cardbookRepository.cardbookCardSearch1[myText];
				} else {
					function searchCard(element) {
						return (element.dirPrefId+"::"+element.uid != aCard.dirPrefId+"::"+aCard.uid);
					}
					cardbookRepository.cardbookCardSearch1[myText] = cardbookRepository.cardbookCardSearch1[myText].filter(searchCard);
				}
			}
			if (cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText]) {
				if (cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText].length == 1) {
					delete cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText];
				} else {
					function searchCard(element) {
						return (element.dirPrefId+"::"+element.uid != aCard.dirPrefId+"::"+aCard.uid);
					}
					cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText] = cardbookRepository.cardbookCardSearch2[aCard.dirPrefId][myText].filter(searchCard);
				}
			}
		}
	},

	saveCard: function(aOldCard, aNewCard, aSource) {
		try {
			var cardbookPrefService = new cardbookPreferenceService(aNewCard.dirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdName = cardbookPrefService.getName();
			var myDirPrefIdUrl = cardbookPrefService.getUrl();
			if (cardbookPrefService.getReadOnly()) {
				return;
			}

			var newCats = [];
			for (var i = 0; i < aNewCard.categories.length; i++) {
				var found = false;
				for (var j = 0; !found && j < cardbookRepository.cardbookAccountsCategories[aNewCard.dirPrefId].length; j++) {
					if (cardbookRepository.cardbookAccountsCategories[aNewCard.dirPrefId][j] == aNewCard.categories[i]) {
						found = true;
					}
				}
				if (!found) {
					newCats.push(aNewCard.categories[i]);
				}
			}

			cardbookUtils.setCalculatedFields(aNewCard);
			// Existing card
			if (cardbookRepository.cardbookCards[aOldCard.dirPrefId+"::"+aNewCard.uid] && aOldCard.dirPrefId == aNewCard.dirPrefId) {
				var myCard = cardbookRepository.cardbookCards[aOldCard.dirPrefId+"::"+aNewCard.uid];
				if (myDirPrefIdType === "CACHE" || myDirPrefIdType === "DIRECTORY" || myDirPrefIdType === "LOCALDB") {
					// if aOldCard and aNewCard have the same cached medias
					cardbookUtils.changeMediaFromFileToContent(aNewCard);
					cardbookRepository.removeCardFromRepository(myCard, true);
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				} else if (myDirPrefIdType === "FILE") {
					// if aOldCard and aNewCard have the same cached medias
					cardbookUtils.changeMediaFromFileToContent(aNewCard);
					cardbookRepository.removeCardFromRepository(myCard, true);
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
				} else {
					// if aOldCard and aNewCard have the same cached medias
					cardbookUtils.changeMediaFromFileToContent(aNewCard);
					if (!(cardbookUtils.searchTagCreated(aNewCard))) {
						cardbookUtils.addTagUpdated(aNewCard);
					}
					cardbookRepository.removeCardFromRepository(myCard, true);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				}
				cardbookUtils.formatStringForOutput("cardUpdatedOK", [myDirPrefIdName, aNewCard.fn]);
				cardbookUtils.notifyObservers(aSource, "cardid:" + aNewCard.dirPrefId + "::" + aNewCard.uid);
			// Moved card
			} else if (aOldCard.dirPrefId != "" && cardbookRepository.cardbookCards[aOldCard.dirPrefId+"::"+aNewCard.uid] && aOldCard.dirPrefId != aNewCard.dirPrefId) {
				var myCard = cardbookRepository.cardbookCards[aOldCard.dirPrefId+"::"+aNewCard.uid];
				var cardbookPrefService = new cardbookPreferenceService(myCard.dirPrefId);
				var myDirPrefIdName = cardbookPrefService.getName();
				var myDirPrefIdType = cardbookPrefService.getType();
				if (myDirPrefIdType === "FILE") {
					cardbookRepository.removeCardFromRepository(myCard, false);
				} else if (myDirPrefIdType === "CACHE" || myDirPrefIdType === "DIRECTORY" || myDirPrefIdType === "LOCALDB") {
					cardbookRepository.removeCardFromRepository(myCard, true);
				} else {
					if (cardbookUtils.searchTagCreated(myCard)) {
						cardbookRepository.removeCardFromRepository(myCard, true);
					} else {
						cardbookUtils.addTagDeleted(myCard);
						cardbookRepository.addCardToCache(myCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(myCard));
						cardbookRepository.removeCardFromRepository(myCard, false);
					}
				}
				cardbookUtils.formatStringForOutput("cardDeletedOK", [myDirPrefIdName, myCard.fn]);
				wdw_cardbooklog.addActivity("cardDeletedOK", [myDirPrefIdName, myCard.fn], "deleteMail");
				cardbookUtils.notifyObservers("cardbook.cardRemovedIndirect");
				
				var cardbookPrefService = new cardbookPreferenceService(aNewCard.dirPrefId);
				var myDirPrefIdName = cardbookPrefService.getName();
				var myDirPrefIdType = cardbookPrefService.getType();
				aNewCard.cardurl = "";
				cardbookUtils.setCardUUID(aNewCard);
				if (myDirPrefIdType === "CACHE" || myDirPrefIdType === "DIRECTORY" || myDirPrefIdType === "LOCALDB") {
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				} else if (myDirPrefIdType === "FILE") {
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
				} else {
					cardbookUtils.addTagCreated(aNewCard);
					cardbookUtils.addEtag(aNewCard, "0");
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				}
				cardbookUtils.formatStringForOutput("cardCreatedOK", [myDirPrefIdName, aNewCard.fn]);
				wdw_cardbooklog.addActivity("cardCreatedOK", [myDirPrefIdName, aNewCard.fn], "addItem");
				cardbookUtils.notifyObservers(aSource, "cardid:" + aNewCard.dirPrefId + "::" + aNewCard.uid);
			// New card
			} else {
				if (aNewCard.uid == "") {
					cardbookUtils.setCardUUID(aNewCard);
				}
				if (myDirPrefIdType === "CACHE" || myDirPrefIdType === "DIRECTORY" || myDirPrefIdType === "LOCALDB") {
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				} else if (myDirPrefIdType === "FILE") {
					cardbookUtils.nullifyTagModification(aNewCard);
					cardbookUtils.nullifyEtag(aNewCard);
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
				} else {
					cardbookUtils.addTagCreated(aNewCard);
					cardbookUtils.addEtag(aNewCard, "0");
					cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myDirPrefIdType));
				}
				cardbookUtils.formatStringForOutput("cardCreatedOK", [myDirPrefIdName, aNewCard.fn]);
				wdw_cardbooklog.addActivity("cardCreatedOK", [myDirPrefIdName, aNewCard.fn], "addItem");
				cardbookUtils.notifyObservers(aSource, "cardid:" + aNewCard.dirPrefId + "::" + aNewCard.uid);
			}
			delete aOldCard;
			for (var i = 0; i < newCats.length; i++) {
				cardbookUtils.formatStringForOutput("categoryCreatedOK", [myDirPrefIdName, newCats[i]]);
				wdw_cardbooklog.addActivity("categoryCreatedOK", [myDirPrefIdName, newCats[i]], "addItem");
				cardbookUtils.notifyObservers("cardbook.catAddedIndirect", "accountid:" + aNewCard.dirPrefId+"::"+newCats[i]);
			}
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.saveCard error : " + e, "Error");
		}
	},

	deleteCards: function (aListOfCards, aSource) {
		try {
			var listOfFileToRewrite = [];
			for (var i = 0; i < aListOfCards.length; i++) {
				if (!cardbookUtils.isMyAccountReadOnly(aListOfCards[i].dirPrefId)) {
					var cardbookPrefService = new cardbookPreferenceService(aListOfCards[i].dirPrefId);
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdType = cardbookPrefService.getType();
					if (myDirPrefIdType === "FILE") {
						cardbookRepository.removeCardFromRepository(aListOfCards[i], false);
						listOfFileToRewrite.push(aListOfCards[i].dirPrefId);
					} else if (myDirPrefIdType === "CACHE" || myDirPrefIdType === "DIRECTORY" || myDirPrefIdType === "LOCALDB") {
						cardbookRepository.removeCardFromRepository(aListOfCards[i], true);
					} else {
						if (cardbookUtils.searchTagCreated(aListOfCards[i])) {
							cardbookRepository.removeCardFromRepository(aListOfCards[i], true);
						} else {
							cardbookUtils.addTagDeleted(aListOfCards[i]);
							cardbookRepository.addCardToCache(aListOfCards[i], "WINDOW", cardbookUtils.getFileCacheNameFromCard(aListOfCards[i]));
							cardbookRepository.removeCardFromRepository(aListOfCards[i], false);
						}
					}
					cardbookUtils.formatStringForOutput("cardDeletedOK", [myDirPrefIdName, aListOfCards[i].fn]);
					wdw_cardbooklog.addActivity("cardDeletedOK", [myDirPrefIdName, aListOfCards[i].fn], "deleteMail");
					// performance reason
					// update the UI only at the end
					if (i == aListOfCards.length - 1) {
						cardbookUtils.notifyObservers(aSource);
					}
				}
			}
			cardbookRepository.reWriteFiles(listOfFileToRewrite);
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.deleteCards error : " + e, "Error");
		}
	},

	reWriteFiles: function (aListOfFiles) {
		listOfFilesToRewrite = cardbookRepository.arrayUnique(aListOfFiles);
		for (var i = 0; i < listOfFilesToRewrite.length; i++) {
			var cardbookPrefService = new cardbookPreferenceService(listOfFilesToRewrite[i]);
			if (cardbookPrefService.getType() === "FILE" && !cardbookPrefService.getReadOnly()) {
				cardbookSynchronization.writeCardsToFile(cardbookPrefService.getUrl(), cardbookRepository.cardbookDisplayCards[listOfFilesToRewrite[i]], true);
			}
		}
	},

	isthereSearchRulesToCreate: function () {
		var todo = 0;
		var allRules = false;
		for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
			if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
				todo++;
			}
			if (todo >= 2) {
				allRules = true;
				break;
			}
		}
		return allRules;
	},

	getRuleFile: function (aPrefId) {
		var cacheDir = cardbookRepository.getLocalDirectory();
		cacheDir.append(aPrefId);
		cacheDir.append(aPrefId + ".rul");
		return cacheDir;
	},

	deleteCssAllRules: function (aStyleSheet) {
		for (var i = cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].length - 1 ; i >= 0; i--) {
			try {
				aStyleSheet.deleteRule(cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href][i]);
			} catch(e) {}
		}
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href] = [];
	},

	createCssAccountRules: function (aStyleSheet, aDirPrefId, aColor) {
		var ruleString = ".cardbookAccountTreeClass treechildren::-moz-tree-cell(accountColor odd container color_" + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
		var ruleString = ".cardbookAccountTreeClass treechildren::-moz-tree-cell(accountColor even container color_" + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
	},

	createCssCardRules: function (aStyleSheet, aDirPrefId, aColor) {
		var ruleString = ".cardbookCardsTreeClass treechildren::-moz-tree-row(SEARCH odd color_" + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
		var ruleString = ".cardbookCardsTreeClass treechildren::-moz-tree-row(SEARCH even color_" + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
	},

	unregisterCss: function (aChromeUri) {
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(aChromeUri, null, null);
		if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
			sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
		}
	},

	reloadCss: function (aChromeUri) {
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(aChromeUri, null, null);
		if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
			sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
		}
		sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
	},

	getIconType: function (aType) {
		switch(aType) {
			case "CACHE":
			case "DIRECTORY":
			case "FILE":
			case "LOCALDB":
				return "local";
				break;
			case "APPLE":
			case "CARDDAV":
			case "GOOGLE":
				return "remote";
				break;
			case "SEARCH":
				return "search";
				break;
		};
		return aType;
	}

};

cardbookRepository.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
cardbookRepository.jsInclude(["chrome://cardbook/content/wdw_log.js"]);
cardbookRepository.jsInclude(["chrome://cardbook/content/cardbookUtils.js"]);
cardbookRepository.jsInclude(["chrome://cardbook/content/cardbookIndexedDB.js"]);
cardbookRepository.jsInclude(["chrome://cardbook/content/cardbookSynchronization.js"]);
cardbookRepository.jsInclude(["chrome://cardbook/content/complexSearch/cardbookComplexSearch.js"]);

