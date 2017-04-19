if ("undefined" == typeof(wdw_cardbookContactsSidebar)) {
	var CardBookResultsPaneObserver = {
		onDragStart: function (aEvent, aXferData, aDragAction) {
			var listOfEmails = wdw_cardbookContactsSidebar.getSelectedEmails();
			aXferData.data = new TransferData();
			aXferData.data.addDataForFlavour("text/x-moz-address", listOfEmails.join(", "));
			aXferData.data.addDataForFlavour("text/unicode", listOfEmails.join(", "));
			aDragAction.action = Components.interfaces.nsIDragService.DRAGDROP_ACTION_COPY;
		},
	
		onDrop: function (aEvent, aXferData, aDragSession) {},
		onDragExit: function (aEvent, aDragSession) {},
		onDragOver: function (aEvent, aFlavour, aDragSession) {},
		getSupportedFlavours: function () {
			return null;
		}
	};
	
	var myCardBookObserver = {
		register: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(this, "cardbook.catModifiedIndirect", false);
			observerService.addObserver(this, "cardbook.catModifiedDirect", false);
			observerService.addObserver(this, "cardbook.catRemovedIndirect", false);
			observerService.addObserver(this, "cardbook.catRemovedDirect", false);
			observerService.addObserver(this, "cardbook.catAddedIndirect", false);
			observerService.addObserver(this, "cardbook.catAddedDirect", false);

			observerService.addObserver(this, "cardbook.ABAddedDirect", false);
			observerService.addObserver(this, "cardbook.ABRemovedDirect", false);
			observerService.addObserver(this, "cardbook.ABModifiedDirect", false);

			observerService.addObserver(this, "cardbook.cardAddedIndirect", false);
			observerService.addObserver(this, "cardbook.cardAddedDirect", false);
			observerService.addObserver(this, "cardbook.cardRemovedIndirect", false);
			observerService.addObserver(this, "cardbook.cardRemovedDirect", false);
			observerService.addObserver(this, "cardbook.cardModifiedIndirect", false);
			observerService.addObserver(this, "cardbook.cardModifiedDirect", false);

			observerService.addObserver(this, "cardbook.syncRunning", false);
			observerService.addObserver(this, "cardbook.cardPasted", false);
			observerService.addObserver(this, "cardbook.cardDragged", false);
			observerService.addObserver(this, "cardbook.cardImportedFromFile", false);

			observerService.addObserver(this, "cardbook.identityChanged", false);
			observerService.addObserver(this, "cardbook.restrictionsChanged", false);
		},
		
		unregister: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.removeObserver(this, "cardbook.catModifiedIndirect");
			observerService.removeObserver(this, "cardbook.catModifiedDirect");
			observerService.removeObserver(this, "cardbook.catRemovedIndirect");
			observerService.removeObserver(this, "cardbook.catRemovedDirect");
			observerService.removeObserver(this, "cardbook.catAddedIndirect");
			observerService.removeObserver(this, "cardbook.catAddedDirect");

			observerService.removeObserver(this, "cardbook.ABAddedDirect");
			observerService.removeObserver(this, "cardbook.ABRemovedDirect");
			observerService.removeObserver(this, "cardbook.ABModifiedDirect");

			observerService.removeObserver(this, "cardbook.cardAddedIndirect");
			observerService.removeObserver(this, "cardbook.cardAddedDirect");
			observerService.removeObserver(this, "cardbook.cardRemovedIndirect");
			observerService.removeObserver(this, "cardbook.cardRemovedDirect");
			observerService.removeObserver(this, "cardbook.cardModifiedIndirect");
			observerService.removeObserver(this, "cardbook.cardModifiedDirect");

			observerService.removeObserver(this, "cardbook.syncRunning");
			observerService.removeObserver(this, "cardbook.cardPasted");
			observerService.removeObserver(this, "cardbook.cardDragged");
			observerService.removeObserver(this, "cardbook.cardImportedFromFile");

			observerService.removeObserver(this, "cardbook.identityChanged");
			observerService.removeObserver(this, "cardbook.restrictionsChanged");
		},
		
		observe: function(aSubject, aTopic, aData) {
			switch (aTopic) {
				case "cardbook.catAddedIndirect":
				case "cardbook.cardAddedIndirect":
				case "cardbook.cardRemovedIndirect":
				case "cardbook.cardRemovedDirect":
				case "cardbook.cardModifiedIndirect":
				case "cardbook.syncRunning":
				case "cardbook.cardPasted":
				case "cardbook.cardDragged":
				case "cardbook.cardImportedFromFile":
				case "cardbook.catAddedDirect":
				case "cardbook.catRemovedIndirect":
				case "cardbook.catRemovedDirect":
				case "cardbook.catModifiedIndirect":
				case "cardbook.catModifiedDirect":
				case "cardbook.ABAddedDirect":
				case "cardbook.ABRemovedDirect":
				case "cardbook.ABModifiedDirect":
				case "cardbook.cardAddedDirect":
				case "cardbook.cardModifiedDirect":
					wdw_cardbookContactsSidebar.onABChange();
					break;
				case "cardbook.restrictionsChanged":
					wdw_cardbookContactsSidebar.onRestrictionsChanged();
					break;
				case "cardbook.identityChanged":
					wdw_cardbookContactsSidebar.onIdentityChanged(aData);
					break;
			}
		}
	};

	var myCardBookPrefObserver = {
		register: function() {
			this.branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.cardbook.");
			if (!("addObserver" in this.branch)) {
				this.branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
			}
			this.branch.addObserver("", this, false);
		},
		
		unregister: function() {
			this.branch.removeObserver("", this);
		},
		
		observe: function(aSubject, aTopic, aData) {
			switch (aData) {
				case "exclusive":
					wdw_cardbookContactsSidebar.loadAB();
					break;
				case "preferEmailPref":
					wdw_cardbookContactsSidebar.onABChange();
					break;
			}
		}
	};

	var wdw_cardbookContactsSidebar = {
		mutationObs: null,
		searchResults: [],
		cardbookComplexSearchAB: "allAddressBooks",
		cardbookComplexMatchAll: true,
		cardbookComplexRules: [],
		ABInclRestrictions: {},
		ABExclRestrictions: {},
		catInclRestrictions: {},
		catExclRestrictions: {},

		sortTrees: function (aEvent) {
			if (aEvent.button != 0) {
				return;
			}
			var target = aEvent.originalTarget;
			if (target.localName == "treecol") {
				wdw_cardbookContactsSidebar.sortCardsTreeCol(target, "abResultsTree");
			}
		},

		sortCardsTreeCol: function (aColumn, aTreeName) {
			var myTree = document.getElementById(aTreeName);
			if (aColumn) {
				var listOfUid = [];
				var numRanges = myTree.view.selection.getRangeCount();
				var start = new Object();
				var end = new Object();
				for (var i = 0; i < numRanges; i++) {
					myTree.view.selection.getRangeAt(i,start,end);
					for (var j = start.value; j <= end.value; j++){
						listOfUid.push(myTree.view.getCellText(j, {id: aColumn.id}));
					}
				}
			}

			var columnName;
			var columnArray;
			var order = myTree.getAttribute("sortDirection") == "ascending" ? 1 : -1;
			
			// if the column is passed and it's already sorted by that column, reverse sort
			if (aColumn) {
				columnName = aColumn.id;
				if (myTree.getAttribute("sortResource") == columnName) {
					order *= -1;
				}
			} else {
				columnName = myTree.getAttribute("sortResource");
			}
			switch(columnName) {
				case "GeneratedName":
					columnArray=0;
					break;
				case "addrbook":
					columnArray=1;
					break;
				case "PrimaryEmail":
					columnArray=2;
					break;
			}
			var myData = wdw_cardbookContactsSidebar.searchResults;

			if (myData && myData.length) {
				myData = cardbookUtils.sortArrayByString(myData,columnArray,order);
			}

			//setting these will make the sort option persist
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);
			
			wdw_cardbookContactsSidebar.displaySearchResults();
			
			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select back
			if (aColumn) {
				for (var i = 0; i < listOfUid.length; i++) {
					for (var j = 0; j < myTree.view.rowCount; j++) {
						if (myTree.view.getCellText(j, {id: aColumn.id}) == listOfUid[i]) {
							myTree.view.selection.rangedSelect(j,j,true);
							break;
						}
					}
				}
			}
		},

		displaySearchResults: function () {
			var abResultsTreeView = {
				get rowCount() { return wdw_cardbookContactsSidebar.searchResults.length; },
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "GeneratedName") return wdw_cardbookContactsSidebar.searchResults[idx][0];
					else if (column.id == "addrbook") return wdw_cardbookContactsSidebar.searchResults[idx][1];
					else if (column.id == "PrimaryEmail") return wdw_cardbookContactsSidebar.searchResults[idx][2];
				},
				getRowProperties: function(idx) {
					if (wdw_cardbookContactsSidebar.searchResults[idx] && wdw_cardbookContactsSidebar.searchResults[idx][3]) {
						return "MailList";
					}
				},
				getColumnProperties: function(column) { return column.id },
				getCellProperties: function(idx, column) { return this.getRowProperties(idx) + " " +  this.getColumnProperties(column)}
			}
			document.getElementById('abResultsTree').view = abResultsTreeView;
		},
		
		verifyABRestrictions: function (aDirPrefId, aSearchAB) {
			if (wdw_cardbookContactsSidebar.ABExclRestrictions[aDirPrefId]) {
				return false;
			}
			if (((wdw_cardbookContactsSidebar.ABInclRestrictions.length == 0) && ((aSearchAB == aDirPrefId) || (aSearchAB === "allAddressBooks"))) ||
				((wdw_cardbookContactsSidebar.ABInclRestrictions.length > 0) && ((aSearchAB == aDirPrefId) || ((aSearchAB === "allAddressBooks") && wdw_cardbookContactsSidebar.ABInclRestrictions[aDirPrefId])))) {
				return true;
			} else {
				return false;
			}
		},
		
		verifyCatRestrictions: function (aDirPrefId, aCategory, aSearchInput) {
			if (wdw_cardbookContactsSidebar.ABExclRestrictions[aDirPrefId]) {
				return false;
			}
			if (wdw_cardbookContactsSidebar.catExclRestrictions[aDirPrefId] && wdw_cardbookContactsSidebar.catExclRestrictions[aDirPrefId][aCategory]) {
				return false;
			}
			if (((!(wdw_cardbookContactsSidebar.catInclRestrictions[aDirPrefId])) && (aCategory.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase().indexOf(aSearchInput) >= 0 || aSearchInput == "")) ||
					((wdw_cardbookContactsSidebar.catInclRestrictions[aDirPrefId]) && (wdw_cardbookContactsSidebar.catInclRestrictions[aDirPrefId][aCategory]))) {
				return true;
			} else {
				return false;
			}
		},
		
		search: function () {
			if (document.getElementById('peopleSearchInput').value == "") {
				var strBundle = document.getElementById("cardbook-strings");
				document.getElementById('peopleSearchInput').placeholder = strBundle.getString("cardbookSearchInputDefault");
			}
			wdw_cardbookContactsSidebar.searchResults = [];
			var sort = true;
			var searchAB = document.getElementById('CardBookABMenulist').value;
			var searchCategory = document.getElementById('categoriesMenulist').value;
			var searchInput = document.getElementById("peopleSearchInput").value.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5]) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if (cardbookRepository.cardbookAccounts[i][6] != "SEARCH") {
						if (wdw_cardbookContactsSidebar.verifyABRestrictions(myDirPrefId, searchAB)) {
							var myDirPrefName = cardbookUtils.getPrefNameFromPrefId(myDirPrefId);
							// All No Only categories
							if ((searchCategory === "allCategories") || (searchCategory === "noCategories") || (searchCategory === "onlyCategories")) {
								if (searchCategory !== "onlyCategories") {
									for (var j in cardbookRepository.cardbookCardSearch2[myDirPrefId]) {
										if (j.indexOf(searchInput) >= 0 || searchInput == "") {
											for (var k = 0; k < cardbookRepository.cardbookCardSearch2[myDirPrefId][j].length; k++) {
												var myCard = cardbookRepository.cardbookCardSearch2[myDirPrefId][j][k];
												if (wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
													var add = true;
													for (var l in wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
														if (cardbookUtils.contains(myCard.categories, l)) {
															add = false;
															break;
														}
													}
													if (!add) {
														continue;
													}
												}
												if (wdw_cardbookContactsSidebar.catInclRestrictions[myDirPrefId]) {
													var add = false;
													for (var l in wdw_cardbookContactsSidebar.catInclRestrictions[myDirPrefId]) {
														if (cardbookUtils.contains(myCard.categories, l)) {
															add = true;
															break;
														}
													}
													if (!add) {
														continue;
													}
												}
												if (myCard.isAList) {
													wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName,"", true, "LISTCARDBOOK", myCard, MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.fn), myDirPrefId]);
												} else {
													if (myCard.emails != "") {
														var myFormattedEmails = [];
														for (var l = 0; l < myCard.emails.length; l++) {
															myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.emails[l]));
														}
														wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName, myCard.emails.join(', '), false, "CARDCARDBOOK", myCard, myFormattedEmails.join(', '), myDirPrefId]);
													}
												}
											}
										}
									}
								}
								if (searchCategory !== "noCategories") {
									for (var j = 0; j < cardbookRepository.cardbookAccountsCategories[myDirPrefId].length; j++) {
										var myCategory = cardbookRepository.cardbookAccountsCategories[myDirPrefId][j];
										if (wdw_cardbookContactsSidebar.verifyCatRestrictions(myDirPrefId, myCategory, searchInput)) {
											var myEmails = [] ;
											var myFormattedEmails = [];
											for (var k = 0; k < cardbookRepository.cardbookDisplayCards[myDirPrefId+"::"+myCategory].length; k++) {
												var myCard = cardbookRepository.cardbookDisplayCards[myDirPrefId+"::"+myCategory][k];
												if (myCard.isAList) {
													myEmails.push(myCard.fn);
													myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.fn));
												} else {
													myEmails = myEmails.concat(myCard.emails);
													for (var l = 0; l < myCard.emails.length; l++) {
														myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.emails[l]));
													}
												}
											}
											if (myEmails != "") {
												wdw_cardbookContactsSidebar.searchResults.push([myCategory, myDirPrefName, myEmails.join(', '), true, "CATCARDBOOK", myDirPrefId+"::"+myCategory, myFormattedEmails.join(', '), myDirPrefId]);
											}
										}
									}
								}
							// One category
							} else {
								var mySepPosition = searchCategory.indexOf("::",0);
								var myCategory = searchCategory.substr(mySepPosition+2,searchCategory.length);
								function searchArray(element) {
									return element == myCategory;
								};
								for (var j in cardbookRepository.cardbookCardSearch2[myDirPrefId]) {
									if (j.indexOf(searchInput) >= 0 || searchInput == "") {
										for (var k = 0; k < cardbookRepository.cardbookCardSearch2[myDirPrefId][j].length; k++) {
											var myCard = cardbookRepository.cardbookCardSearch2[myDirPrefId][j][k]
											if (((myCard.categories.find(searchArray) != undefined) && (cardbookRepository.cardbookUncategorizedCards != myCategory))
												|| ((myCard.categories.length == 0) && (cardbookRepository.cardbookUncategorizedCards == myCategory))) {
												if (wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
													var add = true;
													for (var l in wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
														if (cardbookUtils.contains(myCard.categories, l)) {
															add = false;
															break;
														}
													}
													if (!add) {
														continue;
													}
												}
												if (myCard.isAList) {
													wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName,"", true, "LISTCARDBOOK", myCard, MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.fn), myDirPrefId]);
												} else {
													if (myCard.emails != "") {
														var myFormattedEmails = [];
														for (var l = 0; l < myCard.emails.length; l++) {
															myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.emails[l]));
														}
														wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName, myCard.emails.join(', '), false, "CARDCARDBOOK", myCard, myFormattedEmails.join(', '), myDirPrefId]);
													}
												}
											}
										}
									}
								}
								if (myCategory.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase().indexOf(searchInput) >= 0 || searchInput == "") {
									var myEmails = [] ;
									var myFormattedEmails = [];
									for (var k = 0; k < cardbookRepository.cardbookDisplayCards[searchCategory].length; k++) {
										var myCard = cardbookRepository.cardbookDisplayCards[searchCategory][k];
										if (wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
											var add = true;
											for (var l in wdw_cardbookContactsSidebar.catExclRestrictions[myDirPrefId]) {
												if (cardbookUtils.contains(myCard.categories, l)) {
													add = false;
													break;
												}
											}
											if (!add) {
												continue;
											}
										}
										if (myCard.isAList) {
											myEmails.push(myCard.fn);
											myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.fn));
										} else {
											myEmails = myEmails.concat(myCard.emails);
											for (var l = 0; l < myCard.emails.length; l++) {
												myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.emails[l]));
											}
										}
									}
									if (myEmails != "") {
										wdw_cardbookContactsSidebar.searchResults.push([myCategory, myDirPrefName, myEmails.join(', '), true, "CATCARDBOOK", searchCategory, myFormattedEmails.join(', '), myDirPrefId]);
									}
								}
							}
						}
					} else if ((cardbookRepository.cardbookAccounts[i][6] === "SEARCH") && ((searchAB == myDirPrefId))) {
						wdw_cardbookContactsSidebar.startComplexSearch(myDirPrefId);
						sort = false;
						break;
					}
				}
			}
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (!prefs.getBoolPref("extensions.cardbook.exclusive")) {
				var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
				var contacts = contactManager.directories;
				while ( contacts.hasMoreElements() ) {
					var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
					if (wdw_cardbookContactsSidebar.verifyABRestrictions(contact.dirPrefId, searchAB)) {
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
									if (lSearchString.indexOf(searchInput) >= 0 || searchInput == "") {
										if (myDisplayName == "") {
											var delim = myPrimaryEmail.indexOf("@",0);
											myDisplayName = myPrimaryEmail.substr(0,delim);
										}
										wdw_cardbookContactsSidebar.searchResults.push([myDisplayName, contact.dirName, myPrimaryEmail, false, "CARDCORE", myABCard, MailServices.headerParser.makeMimeAddress(myDisplayName, myPrimaryEmail), contact.dirPrefId]);
									}
								}
							} else {
								var myABList = contactManager.getDirectory(myABCard.mailListURI);
								var lSearchString = myDisplayName + myABList.listNickName + myABList.description;
								lSearchString = lSearchString.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
								if (lSearchString.indexOf(searchInput) >= 0 || searchInput == "") {
									wdw_cardbookContactsSidebar.searchResults.push([myDisplayName, contact.dirName, "", true, "LISTCORE", myABCard, MailServices.headerParser.makeMimeAddress(myDisplayName, myDisplayName), contact.dirPrefId]);
								}
							}
						}
					}
				}
			}
			if (sort) {
				wdw_cardbookContactsSidebar.sortCardsTreeCol(null, "abResultsTree");
			}
		},

		isMyCardFound: function (aCard) {
			var myRegexp;
			var inverse;
			var myField = [];
			var result;
		
			function buildRegExp(aCard, aCase, aField, aTerm, aValue) {
				myField = cardbookUtils.getCardValueByField(aCard, aField);
				if (aTerm == "Contains") {
					myRegexp = new RegExp("(.*)" + aValue + "(.*)", aCase);
					inverse = false;
				} else if (aTerm == "DoesntContain") {
					myRegexp = new RegExp("(.*)" + aValue + "(.*)", aCase);
					inverse = true;
				} else if (aTerm == "Is") {
					myRegexp = new RegExp("^" + aValue + "$", aCase);
					inverse = false;
				} else if (aTerm == "Isnt") {
					myRegexp = new RegExp("^" + aValue + "$", aCase);
					inverse = true;
				} else if (aTerm == "BeginsWith") {
					myRegexp = new RegExp("^" + aValue + "(.*)", aCase);
					inverse = false;
				} else if (aTerm == "EndsWith") {
					myRegexp = new RegExp("(.*)" + aValue + "$", aCase);
					inverse = false;
				} else if (aTerm == "IsEmpty") {
					myRegexp = new RegExp("^$", aCase);
					inverse = false;
				} else if (aTerm == "IsntEmpty") {
					myRegexp = new RegExp("^$", aCase);
					inverse = true;
				}
			};

			for (var i = 0; i < wdw_cardbookContactsSidebar.cardbookComplexRules.length; i++) {
				buildRegExp(aCard, wdw_cardbookContactsSidebar.cardbookComplexRules[i][0], wdw_cardbookContactsSidebar.cardbookComplexRules[i][1], wdw_cardbookContactsSidebar.cardbookComplexRules[i][2], wdw_cardbookContactsSidebar.cardbookComplexRules[i][3]);
				function searchArray(element) {
					return element.search(myRegexp) != -1;
				};
				if (myField.length == 0) {
					if (wdw_cardbookContactsSidebar.cardbookComplexRules[i][2] == "IsEmpty") {
						var found = true;
					} else if (wdw_cardbookContactsSidebar.cardbookComplexRules[i][2] == "IsntEmpty") {
						var found = true;
					}
				} else if (myField.find(searchArray) == undefined) {
					var found = false;
				} else {
					var found = true;
				}
				
				if (wdw_cardbookContactsSidebar.cardbookComplexMatchAll) {
					result = true;
					if ((!found && !inverse) || (found && inverse)) {
						result = false;
						break;
					}
				} else {
					result = false;
					if ((found && !inverse) || (!found && inverse)) {
						result = true;
						break;
					}
				}
			}
			return result;
		},

		parseRule: function (aData) {
			var relative = aData.match("^searchAB:([^:]*):searchAll:([^:]*)(.*)");
			wdw_cardbookContactsSidebar.cardbookComplexSearchAB = relative[1];
			if (relative[2] == "true") {
				wdw_cardbookContactsSidebar.cardbookComplexMatchAll = true;
			} else {
				wdw_cardbookContactsSidebar.cardbookComplexMatchAll = false;
			}
			wdw_cardbookContactsSidebar.cardbookComplexRules = [];
			var tmpRuleArray = relative[3].split(/:case:/);
			for (var i = 1; i < tmpRuleArray.length; i++) {
				var relative = tmpRuleArray[i].match("([^:]*):field:([^:]*):term:([^:]*):value:([^:]*)");
				wdw_cardbookContactsSidebar.cardbookComplexRules.push([relative[1], relative[2], relative[3], relative[4]]);
			}
		},

		searchEngine: function (aData, aParams) {
			var searchInput = document.getElementById("peopleSearchInput").value.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
			wdw_cardbookContactsSidebar.parseRule(aData);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if ((wdw_cardbookContactsSidebar.cardbookComplexSearchAB == myDirPrefId) || (wdw_cardbookContactsSidebar.cardbookComplexSearchAB === "allAddressBooks")) {
						var myDirPrefName = cardbookUtils.getPrefNameFromPrefId(myDirPrefId);
						for (var j = 0; j < cardbookRepository.cardbookDisplayCards[myDirPrefId].length; j++) {
							var myCard = cardbookRepository.cardbookDisplayCards[myDirPrefId][j];
							if (wdw_cardbookContactsSidebar.isMyCardFound(myCard)) {
								var lSearchString = cardbookRepository.getSearchString(myCard);
								if (lSearchString.indexOf(searchInput) >= 0 || searchInput == "") {
									if (myCard.isAList) {
										wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName,"", true, "LISTCARDBOOK", myCard, MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.fn), myDirPrefId]);
									} else {
										if (myCard.emails != "") {
											var myFormattedEmails = [];
											for (var l = 0; l < myCard.emails.length; l++) {
												myFormattedEmails.push(MailServices.headerParser.makeMimeAddress(myCard.fn, myCard.emails[l]));
											}
											wdw_cardbookContactsSidebar.searchResults.push([myCard.fn, myDirPrefName, myCard.emails.join(', '), false, "CARDCARDBOOK", myCard, myFormattedEmails.join(', '), myDirPrefId]);
										}
									}
								}
							}
						}
					}
				}
			}
			wdw_cardbookContactsSidebar.sortCardsTreeCol(null, "abResultsTree");
		},

		startComplexSearch: function (aPrefId) {
			wdw_cardbookContactsSidebar.searchResults = [];
			var myFile = cardbookRepository.getRuleFile(aPrefId);
			if (myFile.exists() && myFile.isFile()) {
				var params = {};
				params["showError"] = true;
				params["aPrefId"] = aPrefId;
				cardbookSynchronization.getFileDataAsync(myFile.path, wdw_cardbookContactsSidebar.searchEngine, params);
			}
		},
		
		addEmails: function (aType) {
			var listOfEmails = wdw_cardbookContactsSidebar.getSelectedEmails();
			for (var i = 0; i < listOfEmails.length; i++) {
				parent.AddRecipient(aType, listOfEmails[i]);
			}
		},

		startDrag: function (aEvent) {
			try {
				var listOfEmails = wdw_cardbookContactsSidebar.getSelectedEmails();
				for (var i = 0; i < listOfEmails.length; i++) {
					aEvent.dataTransfer.mozSetDataAt("text/plain", listOfEmails[i], i);
				}
				// aEvent.dataTransfer.setData("text/plain", listOfEmails);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbookContactsSidebar.startDrag error : " + e, "Error");
			}
		},

		getSelectedEmails: function () {
			var myTree = document.getElementById('abResultsTree');
			var listOfEmails = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					var allEmails = [];
					allEmails = wdw_cardbookContactsSidebar.searchResults[j][6].split(', ');
					for (var k = 0; k < allEmails.length; k++) {
						listOfEmails.push(allEmails[k]);
					}
				}
			}
			return listOfEmails;
		},

		getSelectedCards: function () {
			var myTree = document.getElementById('abResultsTree');
			var listOfUid = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push([wdw_cardbookContactsSidebar.searchResults[j][4], wdw_cardbookContactsSidebar.searchResults[j][5], wdw_cardbookContactsSidebar.searchResults[j][7]]);
				}
			}
			return listOfUid;
		},

		getSelectedCardsCount: function () {
			var myTree = document.getElementById('abResultsTree');
			var count = 0;
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					count++;
				}
			}
			return count;
		},

		doubleClickCardsTree: function (aEvent) {
			var myTree = document.getElementById('abResultsTree');
			if (myTree.currentIndex != -1) {
				var row = { }, col = { }, child = { };
				myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
				if (row.value != -1) {
					wdw_cardbookContactsSidebar.addEmails('addr_to');
				}
			}
		},

		deleteCard: function () {
			var listOfUid = wdw_cardbookContactsSidebar.getSelectedCards();
			var AB =  MailServices.ab.getDirectoryFromId(listOfUid[0][2]);
			for (var i = 0; i < listOfUid.length; i++) {
				if (listOfUid[i][0] === "CARDCARDBOOK" || listOfUid[i][0] === "LISTCARDBOOK") {
					wdw_cardbook.deleteCardsAndValidate("cardbook.cardRemovedIndirect", [listOfUid[i][1]]);
				} else if (listOfUid[i][0] === "CATCARDBOOK") {
					var myCatArray = listOfUid[i][1].split("::");
					wdw_cardbook.removeCategory(myCatArray[0], myCatArray[1], "cardbook.catRemovedIndirect", false);
				} else if (listOfUid[i][0] === "CARDCORE" || listOfUid[i][0] === "LISTCORE") {
					var myCard = listOfUid[i][1];
					gAddressBookBundle = document.getElementById("bundle_addressBook");
					if (listOfUid[i][0] === "CARDCORE") {
						confirmDeleteMessage = gAddressBookBundle.getString("confirmDeleteContact");
					} else if (listOfUid[i][0] === "LISTCORE") {
						confirmDeleteMessage = gAddressBookBundle.getString("confirmDeleteMailingList");
					} else {
						return;
					}
					if (Services.prompt.confirm(window, null, confirmDeleteMessage)) {
						let cardArray = Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
						cardArray.appendElement(myCard, false);
						AB.deleteCards(cardArray);
					}
				}
			}
			wdw_cardbookContactsSidebar.search();
		},

		editCard: function () {
			var listOfUid = wdw_cardbookContactsSidebar.getSelectedCards();
			var AB =  MailServices.ab.getDirectoryFromId(listOfUid[0][2]);
			if (listOfUid[0][0] === "CARDCARDBOOK" || listOfUid[0][0] === "LISTCARDBOOK") {
				var myCard = listOfUid[0][1];
				var myOutCard = new cardbookCardParser();
				cardbookUtils.cloneCard(myCard, myOutCard);
				var cardbookPrefService = new cardbookPreferenceService(myCard.dirPrefId);
				if (cardbookPrefService.getReadOnly()) {
					cardbookUtils.openEditionWindow(myOutCard, "ViewCard");
				} else {
					cardbookUtils.openEditionWindow(myOutCard, "EditCard", "cardbook.cardModifiedIndirect");
				}
			} else if (listOfUid[0][0] === "CARDCORE") {
				var myCard = listOfUid[0][1];
				goEditCardDialog(AB.URI, myCard);
			} else if (listOfUid[0][0] === "LISTCORE") {
				var myCard = listOfUid[0][1];
				try {
					goEditListDialog(myCard, myCard.mailListURI);
				}
				catch (e) {
				}
			} else if (listOfUid[0][0] === "CATCARDBOOK") {
				var myCatArray = listOfUid[0][1].split("::");
				wdw_cardbook.renameCategory(myCatArray[0], myCatArray[1], "cardbook.catModifiedIndirect", false);
			}
			wdw_cardbookContactsSidebar.search();
		},

		selectAllKey: function () {
			var myTree = document.getElementById('abResultsTree');
			myTree.view.selection.selectAll();
		},

		cardPropertiesMenuContextShowing: function (aEvent) {
			var target = document.popupNode;
			// If a column header was clicked, show the column picker.
			if (target.localName == "treecol") {
				let treecols = target.parentNode;
				let nodeList = document.getAnonymousNodes(treecols);
				let treeColPicker;
				for (let i = 0; i < nodeList.length; i++) {
					if (nodeList.item(i).localName == "treecolpicker") {
						treeColPicker = nodeList.item(i);
						break;
					}
				}
				let popup = document.getAnonymousElementByAttribute(treeColPicker, "anonid", "popup");
				treeColPicker.buildPopup(popup);
				popup.openPopup(target, "after_start", 0, 0, true);
				return false;
			}
			wdw_cardbookContactsSidebar.cardPropertiesMenuContextShowingNext();
			return true;
		},

		cardPropertiesMenuContextShowingNext: function () {
			var count = wdw_cardbookContactsSidebar.getSelectedCardsCount();
			if (count != 0) {
				if (count != 1) {
					document.getElementById("editCard").disabled=true;
				} else {
					document.getElementById("editCard").disabled=false;
				}
				document.getElementById("toEmail").disabled=false;
				document.getElementById("ccEmail").disabled=false;
				document.getElementById("bccEmail").disabled=false;
				document.getElementById("replytoEmail").disabled=false;
				document.getElementById("deleteCard").disabled=false;
			} else {
				document.getElementById("toEmail").disabled=true;
				document.getElementById("ccEmail").disabled=true;
				document.getElementById("bccEmail").disabled=true;
				document.getElementById("replytoEmail").disabled=true;
				document.getElementById("deleteCard").disabled=true;
				document.getElementById("editCard").disabled=true;
			}
		},

		loadPanel: function () {
			myCardBookObserver.register();
			myCardBookPrefObserver.register();
			document.title = parent.document.getElementById("sidebar-title").value;
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_cardbookContactsSidebar.waitForMsgIdentityFinished();
		},
		
		unloadPanel: function () {
			myCardBookObserver.unregister();
			myCardBookPrefObserver.unregister();
		},
		
		loadRestrictions: function () {
			var outerID = content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).outerWindowID;
			var msgIdentity = cardbookRepository.composeMsgIdentity[outerID];
			var cardbookPrefService = new cardbookPreferenceService();
			var result = [];
			result = cardbookPrefService.getAllRestrictions();
			wdw_cardbookContactsSidebar.ABInclRestrictions = {};
			wdw_cardbookContactsSidebar.ABExclRestrictions = {};
			wdw_cardbookContactsSidebar.catInclRestrictions = {};
			wdw_cardbookContactsSidebar.catExclRestrictions = {};
			for (var i = 0; i < result.length; i++) {
				var resultArray = result[i].split("::");
				if ((resultArray[0] == "true") && ((resultArray[2] == msgIdentity) || (resultArray[2] == "allMailAccounts"))) {
					if (resultArray[1] == "include") {
						wdw_cardbookContactsSidebar.ABInclRestrictions[resultArray[3]] = 1;
						if (resultArray[4] && resultArray[4] != null && resultArray[4] !== undefined && resultArray[4] != "") {
							if (!(wdw_cardbookContactsSidebar.catInclRestrictions[resultArray[3]])) {
								wdw_cardbookContactsSidebar.catInclRestrictions[resultArray[3]] = {};
							}
							wdw_cardbookContactsSidebar.catInclRestrictions[resultArray[3]][resultArray[4]] = 1;
						}
					} else {
						if (resultArray[4] && resultArray[4] != null && resultArray[4] !== undefined && resultArray[4] != "") {
							if (!(wdw_cardbookContactsSidebar.catExclRestrictions[resultArray[3]])) {
								wdw_cardbookContactsSidebar.catExclRestrictions[resultArray[3]] = {};
							}
							wdw_cardbookContactsSidebar.catExclRestrictions[resultArray[3]][resultArray[4]] = 1;
						} else {
							wdw_cardbookContactsSidebar.ABExclRestrictions[resultArray[3]] = 1;
						}
					}
				}
			}
			wdw_cardbookContactsSidebar.ABInclRestrictions["length"] = cardbookUtils.sumElements(wdw_cardbookContactsSidebar.ABInclRestrictions);
		},
		
		loadAB: function () {
			wdw_cardbookContactsSidebar.loadRestrictions();
			var ABList = document.getElementById('CardBookABMenulist');
			if (ABList.value != null && ABList.value !== undefined && ABList.value != "") {
				var ABDefaultValue = ABList.value;
			} else {
				var ABDefaultValue = 0;
			}
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			cardbookElementTools.loadAddressBooks("CardBookABMenupopup", "CardBookABMenulist", ABDefaultValue, prefs.getBoolPref("extensions.cardbook.exclusive"), true, true, true,
													wdw_cardbookContactsSidebar.ABInclRestrictions, wdw_cardbookContactsSidebar.ABExclRestrictions);
			wdw_cardbookContactsSidebar.onABChange();
			
			var strBundle = document.getElementById("cardbook-strings");
			document.getElementById('peopleSearchInput').placeholder = strBundle.getString("cardbookSearchInputDefault");
		},
		
		onABChange: function () {
			var addrbookColumn = document.getElementById("addrbook");
			if (document.getElementById('CardBookABMenulist').value != "allAddressBooks") {
				addrbookColumn.hidden = true;
				addrbookColumn.setAttribute("ignoreincolumnpicker", "true");
			} else {
				addrbookColumn.removeAttribute("ignoreincolumnpicker");
			}

			var ABList = document.getElementById('CardBookABMenulist');
			if (ABList.value != null && ABList.value !== undefined && ABList.value != "") {
				var ABDefaultValue = ABList.value;
			} else {
				var ABDefaultValue = 0;
			}
			var categoryList = document.getElementById('categoriesMenulist');
			if (categoryList.value != null && categoryList.value !== undefined && categoryList.value != "") {
				var categoryDefaultValue = categoryList.value;
			} else {
				var categoryDefaultValue = 0;
			}
			cardbookElementTools.loadCategories("categoriesMenupopup", "categoriesMenulist", ABDefaultValue, categoryDefaultValue, true, true, true, false,
												wdw_cardbookContactsSidebar.catInclRestrictions, wdw_cardbookContactsSidebar.catExclRestrictions);
			
			if (document.getElementById('categoriesMenulist').itemCount == 3) {
				document.getElementById('categoriesPickerLabel').setAttribute('hidden', 'true');
				document.getElementById('categoriesMenulist').setAttribute('hidden', 'true');
			} else {
				document.getElementById('categoriesPickerLabel').removeAttribute('hidden');
				document.getElementById('categoriesMenulist').removeAttribute('hidden');
			}
			
			wdw_cardbookContactsSidebar.search();
		},

		// works only when the restrictions are changed
		onRestrictionsChanged: function () {
			wdw_cardbookContactsSidebar.loadAB();
		},
		
		// works only when the identity is changed, not for the initial start
		onIdentityChanged: function (aWindowId) {
			var outerID = content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).outerWindowID;
			if (aWindowId == outerID) {
				wdw_cardbookContactsSidebar.loadAB();
			}
		},
		
		// works only for the initial start, not when the identity is changed 
		waitForMsgIdentityFinished: function () {
			var lTimerMsgIdentity = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerMsgIdentity.initWithCallback({ notify: function(lTimerMsgIdentity) {
						var outerID = content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).outerWindowID;
						if (cardbookRepository.composeMsgIdentity[outerID]) {
								wdw_cardbookContactsSidebar.loadAB();
								lTimerMsgIdentity.cancel();
							}
						}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},
		
		onCategoryChange: function () {
			wdw_cardbookContactsSidebar.search();
		}
		
	}
};