Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource:///modules/mailServices.js");
Components.utils.import("resource://gre/modules/Services.jsm");

const ACR = Components.interfaces.nsIAutoCompleteResult;

function cardbookAutocompleteResult(aSearchString) {
    this._searchResults = [];
    this.searchString = aSearchString;
}

cardbookAutocompleteResult.prototype = {
    _searchResults: null,

    searchString: null,
    searchResult: ACR.RESULT_NOMATCH,
    defaultIndex: -1,
    errorDescription: null,

    get matchCount() {
        return this._searchResults.length;
    },

    getValueAt: function getValueAt(aIndex) {
        return this._searchResults[aIndex].value;
    },

    getLabelAt: function getLabelAt(aIndex) {
        return this.getValueAt(aIndex);
    },

    getCommentAt: function getCommentAt(aIndex) {
        return this._searchResults[aIndex].comment;
    },

    getStyleAt: function getStyleAt(aIndex) {
        return this._searchResults[aIndex].style;
        // return "local-abook";
    },

    getImageAt: function getImageAt(aIndex) {
        return "";
    },

    getFinalCompleteValueAt: function(aIndex) {
    	return this.getValueAt(aIndex);
    },

    removeValueAt: function removeValueAt(aRowIndex, aRemoveFromDB) {
    },

    getCardAt: function getCardAt(aIndex) {
        return this._searchResults[aIndex].card;
    },

    getEmailToUse: function getEmailToUse(aIndex) {
        return this._searchResults[aIndex].emailToUse;
    },

    /* nsISupports */
    QueryInterface: XPCOMUtils.generateQI([ACR])
};

function cardbookAutocompleteSearch() {}

cardbookAutocompleteSearch.prototype = {

	ABInclRestrictions: {},
	ABExclRestrictions: {},
	catInclRestrictions: {},
	catExclRestrictions: {},
	
    addResult: function addResult(aResult, aEmailValue, aPopularity, aDebugMode, aStyle) {
		if (aEmailValue != null && aEmailValue !== undefined && aEmailValue != "") {
			// check duplicate email
			for (var i = 0; i < aResult._searchResults.length; i++) {
				if (aResult._searchResults[i].value === aEmailValue) {
					return;
				}
			}

			// add result
			var myPopularity = 0;
			if (aPopularity != null && aPopularity !== undefined && aPopularity != "") {
				myPopularity = aPopularity;
			} else {
				var addresses = {}, names = {}, fullAddresses = {};
				MailServices.headerParser.parseHeadersWithArray(aEmailValue, addresses, names, fullAddresses);
				var myTmpPopularity = 0;
				for (var i = 0; i < addresses.value.length; i++) {
					if (addresses.value[i] == "") {
						continue;
					}
					if (cardbookRepository.cardbookMailPopularityIndex[addresses.value[i].toLowerCase()]) {
						myTmpPopularity = cardbookRepository.cardbookMailPopularityIndex[addresses.value[i].toLowerCase()];
						if (myPopularity === 0) {
							myPopularity = myTmpPopularity;
						}
					} else {
						continue;
					}
					if (myPopularity > myTmpPopularity) {
						myPopularity = myTmpPopularity;
					}
				}
			}
			var aComment = "";
			if (aDebugMode) {
				aComment = "[" + myPopularity + "]";
			}

			if (aResult._searchResults.length === 0) {
				aResult._searchResults.push({
											 value: aEmailValue,
											 comment: aComment,
											 card: null,
											 isPrimaryEmail: true,
											 emailToUse: aEmailValue,
											 popularity: myPopularity,
											 style: aStyle
										 });
			} else {
				var done = 0;
				for (var i = aResult._searchResults.length - 1 ; i >= 0; i--) {
					if (Number(myPopularity) <= Number(aResult._searchResults[i].popularity)) {
						aResult._searchResults.splice(i+1, 0, {
													 value: aEmailValue,
													 comment: aComment,
													 card: null,
													 isPrimaryEmail: true,
													 emailToUse: aEmailValue,
													 popularity: myPopularity,
													 style: aStyle
												 });
						done = 1;
						break;
					}
				}
				if (done === 0) {
					aResult._searchResults.splice(0, 0, {
												 value: aEmailValue,
												 comment: aComment,
												 card: null,
												 isPrimaryEmail: true,
												 emailToUse: aEmailValue,
												 popularity: myPopularity,
												 style: aStyle
											 });
				}
			}
		}
    },

	loadRestrictions: function (aMsgIdentity) {
		var cardbookPrefService = new cardbookPreferenceService();
		var result = [];
		result = cardbookPrefService.getAllRestrictions();
		this.ABInclRestrictions = {};
		this.ABExclRestrictions = {};
		this.catInclRestrictions = {};
		this.catExclRestrictions = {};
		for (var i = 0; i < result.length; i++) {
			var resultArray = result[i].split("::");
			if ((resultArray[0] == "true") && ((resultArray[2] == aMsgIdentity) || (resultArray[2] == "allMailAccounts"))) {
				if (resultArray[1] == "include") {
					this.ABInclRestrictions[resultArray[3]] = 1;
					if (resultArray[4] && resultArray[4] != null && resultArray[4] !== undefined && resultArray[4] != "") {
						if (!(this.catInclRestrictions[resultArray[3]])) {
							this.catInclRestrictions[resultArray[3]] = {};
						}
						this.catInclRestrictions[resultArray[3]][resultArray[4]] = 1;
					}
				} else {
					if (resultArray[4] && resultArray[4] != null && resultArray[4] !== undefined && resultArray[4] != "") {
						if (!(this.catExclRestrictions[resultArray[3]])) {
							this.catExclRestrictions[resultArray[3]] = {};
						}
						this.catExclRestrictions[resultArray[3]][resultArray[4]] = 1;
					} else {
						this.ABExclRestrictions[resultArray[3]] = 1;
					}
				}
			}
		}
		this.ABInclRestrictions["length"] = cardbookUtils.sumElements(this.ABInclRestrictions);
	},
	
	verifyABRestrictions: function (aDirPrefId) {
		if (this.ABExclRestrictions[aDirPrefId]) {
			return false;
		}
		if ((this.ABInclRestrictions.length == 0) || ((this.ABInclRestrictions.length > 0) && (this.ABInclRestrictions[aDirPrefId]))) {
			return true;
		} else {
			return false;
		}
	},
	
	verifyCatRestrictions: function (aDirPrefId, aCategory, aSearchInput) {
		if (this.ABExclRestrictions[aDirPrefId]) {
			return false;
		}
		if (this.catExclRestrictions[aDirPrefId] && this.catExclRestrictions[aDirPrefId][aCategory]) {
			return false;
		}
		if (((!(this.catInclRestrictions[aDirPrefId])) && (aCategory.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase().indexOf(aSearchInput) >= 0 || aSearchInput == "")) ||
				((this.catInclRestrictions[aDirPrefId]) && (this.catInclRestrictions[aDirPrefId][aCategory]))) {
			return true;
		} else {
			return false;
		}
	},
		
    /**
     * Starts a search based on the given parameters.
     *
     * @see nsIAutoCompleteSearch for parameter details.
     *
     * It is expected that aSearchParam contains the identity (if any) to use
     * for determining if an address book should be autocompleted against.
     *
     * aPreviousResult not used because always empty
     * popularity not used because not found how to set
     */
    startSearch: function startSearch(aSearchString, aSearchParam, aPreviousResult, aListener) {
		Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
		var result = new cardbookAutocompleteResult(aSearchString);
		result.fireOnce = 0;
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
		loader.loadSubScript("chrome://cardbook/content/wdw_log.js");
		loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
		loader.loadSubScript("chrome://cardbook/content/preferences/cardbookPreferences.js");
		
		// If the search string isn't value, or contains a comma, or the user
		// hasn't enabled autocomplete, then just return no matches / or the
		// result ignored.
		// The comma check is so that we don't autocomplete against the user
		// entering multiple addresses.
		if (!aSearchString || /,/.test(aSearchString)) {
			result.searchResult = ACR.RESULT_IGNORED;
			aListener.onSearchResult(this, result);
			return;
		}

		aSearchString = aSearchString.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();

		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var debugMode = prefs.getBoolPref("extensions.cardbook.debugMode");

		var mySearchParamObj = JSON.parse(aSearchParam);
		this.loadRestrictions(mySearchParamObj.idKey);
		
		if (prefs.getBoolPref("extensions.cardbook.autocompletion")) {
			// add Cards
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && cardbookRepository.cardbookAccounts[i][6] != "SEARCH") {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if (this.verifyABRestrictions(myDirPrefId)) {
						var myStyle = cardbookRepository.getIconType(cardbookRepository.cardbookAccounts[i][6]) + " color_" + myDirPrefId;
						for (var j in cardbookRepository.cardbookCardSearch2[myDirPrefId]) {
							if (j.indexOf(aSearchString) >= 0 || aSearchString == "") {
								for (var k = 0; k < cardbookRepository.cardbookCardSearch2[myDirPrefId][j].length; k++) {
									var myCard = cardbookRepository.cardbookCardSearch2[myDirPrefId][j][k];
									if (this.catExclRestrictions[myDirPrefId]) {
										var add = true;
										for (var l in this.catExclRestrictions[myDirPrefId]) {
											if (cardbookUtils.contains(myCard.categories, l)) {
												add = false;
												break;
											}
										}
										if (!add) {
											continue;
										}
									}
									if (this.catInclRestrictions[myDirPrefId]) {
										var add = false;
										for (var l in this.catInclRestrictions[myDirPrefId]) {
											if (cardbookUtils.contains(myCard.categories, l)) {
												add = true;
												break;
											}
										}
										if (!add) {
											continue;
										}
									}
									for (var l = 0; l < myCard.email.length; l++) {
										var myCurrentEmail = MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.email[l][0][0]);
										this.addResult(result, myCurrentEmail, null, debugMode, myStyle);
									}
									// add Lists
									if (myCard.isAList) {
										this.addResult(result, myCard.fn + " <" + myCard.fn + ">", null, debugMode, myStyle);
									} else {
										this.addResult(result, cardbookUtils.getMimeEmailsFromCards([myCard]).join(" , "), null, debugMode, myStyle);
									}
								}
							}
						}
					}
				}
			}
			
			// add Categories
			for (var dirPrefId in cardbookRepository.cardbookAccountsCategories) {
				if (this.verifyABRestrictions(dirPrefId)) {
					var cardbookPrefService = new cardbookPreferenceService(dirPrefId);
					var myStyle = cardbookRepository.getIconType(cardbookPrefService.getType()) + " color_" + dirPrefId;
					for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[dirPrefId].length; i++) {
						var myCategory = cardbookRepository.cardbookAccountsCategories[dirPrefId][i];
						if (((!(this.catInclRestrictions[dirPrefId])) && (myCategory != cardbookRepository.cardbookUncategorizedCards)) ||
								((this.catInclRestrictions[dirPrefId]) && (this.catInclRestrictions[dirPrefId][myCategory]))) {
							if (myCategory.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase().indexOf(aSearchString) >= 0) {
								if (this.catExclRestrictions[myDirPrefId]) {
									var add = true;
									for (var l in this.catExclRestrictions[myDirPrefId]) {
										if (cardbookUtils.contains(myCard.categories, l)) {
											add = false;
											break;
										}
									}
									if (!add) {
										continue;
									}
								}
								var myCardList = [] ;
								for (var j = 0; j < cardbookRepository.cardbookDisplayCards[dirPrefId+"::"+myCategory].length; j++) {
									var myCard = cardbookRepository.cardbookDisplayCards[dirPrefId+"::"+myCategory][j];
									myCardList.push(myCard);
								}
								this.addResult(result, cardbookUtils.getMimeEmailsFromCards(myCardList).join(" , "), null, debugMode, myStyle);
							}
						}
					}
				}
			}
		}

		// add Thunderbird standard emails
		if (!prefs.getBoolPref("extensions.cardbook.exclusive")) {
			var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
			var contacts = contactManager.directories;
			var myStyle = "standard-abook";
			while ( contacts.hasMoreElements() ) {
				var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
				if (this.verifyABRestrictions(contact.dirPrefId)) {
					var abCardsEnumerator = contact.childCards;
					while (abCardsEnumerator.hasMoreElements()) {
						var myABCard = abCardsEnumerator.getNext();
						myABCard = myABCard.QueryInterface(Components.interfaces.nsIAbCard);
						var myPrimaryEmail = myABCard.getProperty("PrimaryEmail","");
						var myDisplayName = myABCard.getProperty("DisplayName","");
						if (!myABCard.isMailList) {
							if (myPrimaryEmail != "") {
								var lSearchString = myABCard.getProperty("FirstName","") + myABCard.getProperty("LastName","") + myDisplayName + myABCard.getProperty("NickName","") + myPrimaryEmail;
								lSearchString = lSearchString.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
								if (lSearchString.indexOf(aSearchString) >= 0) {
									if (myDisplayName == "") {
										var delim = myPrimaryEmail.indexOf("@",0);
										myDisplayName = myPrimaryEmail.substr(0,delim);
									}
									var myPopularity = myABCard.getProperty("PopularityIndex", "0");
									this.addResult(result,  MailServices.headerParser.makeMimeAddress(myDisplayName, myPrimaryEmail), myPopularity, null, myStyle);
								}
							}
						} else {
							var myABList = contactManager.getDirectory(myABCard.mailListURI);
							var lSearchString = myDisplayName + myABList.listNickName + myABList.description;
							lSearchString = lSearchString.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
							if (lSearchString.indexOf(aSearchString) >= 0) {
								var myPopularity = myABCard.getProperty("PopularityIndex", "0");
								this.addResult(result,  MailServices.headerParser.makeMimeAddress(myDisplayName, myDisplayName), myPopularity, null, myStyle);
							}
						}
					}
				}
			}
		}

		if (result.matchCount) {
			result.searchResult = ACR.RESULT_SUCCESS;
			result.defaultIndex = 0;
		}

		aListener.onSearchResult(this, result);
    },

    stopSearch: function stopSearch() {
    },

    /* nsIClassInfo */
    getInterfaces: function(aCount) {
        let ifaces = [ Components.interfaces.nsIAutoCompleteSearch,
                       Components.interfaces.nsIClassInfo,
                       Components.interfaces.nsISupports ];
        aCount.value = ifaces.length;

        return ifaces;
    },

    getHelperForLanguage: function(language) {
        return null;
    },

    contractID: "@mozilla.org/autocomplete/search;1?name=addrbook-cardbook",
    classDescription: "Class description",
    classID: Components.ID("{0DE07280-EE68-11E4-B66F-4AD01D5D46B0}"),
    implementationLanguage: Components.interfaces.nsIProgrammingLanguage.JAVASCRIPT,
    flags: 0,

    // nsISupports

    QueryInterface: function(aIID) {
        if (!aIID.equals(Components.interfaces.nsIAutoCompleteSearch)
            && !aIID.equals(Components.interfaces.nsIClassInfo)
            && !aIID.equals(Components.interfaces.nsISupports))
            throw Components.results.NS_ERROR_NO_INTERFACE;
        return this;
    }
};

/** Module Registration */
function NSGetFactory(cid) {
	return (XPCOMUtils.generateNSGetFactory([cardbookAutocompleteSearch]))(cid);
}
