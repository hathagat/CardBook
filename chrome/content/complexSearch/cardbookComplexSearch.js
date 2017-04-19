if ("undefined" == typeof(cardbookComplexSearch)) {
	var cardbookComplexSearch = {
		
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

			for (var i = 0; i < cardbookRepository.cardbookComplexRules.length; i++) {
				buildRegExp(aCard, cardbookRepository.cardbookComplexRules[i][0], cardbookRepository.cardbookComplexRules[i][1], cardbookRepository.cardbookComplexRules[i][2], cardbookRepository.cardbookComplexRules[i][3]);
				function searchArray(element) {
					return element.search(myRegexp) != -1;
				};
				if (myField.length == 0) {
					if (cardbookRepository.cardbookComplexRules[i][2] == "IsEmpty") {
						var found = true;
					} else if (cardbookRepository.cardbookComplexRules[i][2] == "IsntEmpty") {
						var found = true;
					}
				} else if (myField.find(searchArray) == undefined) {
					var found = false;
				} else {
					var found = true;
				}
				
				if (cardbookRepository.cardbookComplexMatchAll) {
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

		searchEngine: function (aData, aParams) {
			cardbookComplexSearch.parseRule(aData);
			var cardbookPrefService = new cardbookPreferenceService(aParams.aPrefId);
			if (!cardbookPrefService.getEnabled()) {
				return;
			}
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if ((cardbookRepository.cardbookComplexSearchAB == myDirPrefId) || (cardbookRepository.cardbookComplexSearchAB === "allAddressBooks")) {
						for (var j = 0; j < cardbookRepository.cardbookDisplayCards[myDirPrefId].length; j++) {
							var myCard = cardbookRepository.cardbookDisplayCards[myDirPrefId][j];
							if (cardbookComplexSearch.isMyCardFound(myCard)) {
								cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(myCard);
							}
						}
					}
				}
			}
			// need to verify that the selected cards are always found
			var myListOfSelectedCards = [];
			if (aParams.aListOfCards) {
				for (var i = 0; i < aParams.aListOfCards.length; i++) {
					var myCard = cardbookRepository.cardbookCards[aParams.aListOfCards[i]];
					if (cardbookComplexSearch.isMyCardFound(myCard)) {
						myListOfSelectedCards.push(aParams.aListOfCards[i]);
					}
				}
			}
			wdw_cardbook.displaySearch(myListOfSelectedCards);
		},

		buildEngine: function (aData) {
			cardbookElementTools.loadAddressBooks("addressbookMenupopup", "addressbookMenulist", cardbookRepository.cardbookComplexSearchAB, true, true, true, false);
			cardbookComplexSearch.loadMatchAll(cardbookRepository.cardbookComplexMatchAll);
			cardbookComplexSearch.constructDynamicRows("searchTerms", cardbookRepository.cardbookComplexRules, "3.0");
			document.getElementById('searchTerms_0_valueBox').focus();
		},

		parseRule: function (aData) {
			var relative = aData.match("^searchAB:([^:]*):searchAll:([^:]*)(.*)");
			cardbookRepository.cardbookComplexSearchAB = relative[1];
			if (relative[2] == "true") {
				cardbookRepository.cardbookComplexMatchAll = true;
			} else {
				cardbookRepository.cardbookComplexMatchAll = false;
			}
			var tmpRuleArray = relative[3].split(/:case:/);
			for (var i = 1; i < tmpRuleArray.length; i++) {
				var relative = tmpRuleArray[i].match("([^:]*):field:([^:]*):term:([^:]*):value:([^:]*)");
				cardbookRepository.cardbookComplexRules.push([relative[1], relative[2], relative[3], relative[4]]);
			}
		},

		loadMatchAll: function (aDefaultValue) {
			if (aDefaultValue) {
				document.getElementById("booleanAndGroup").selectedIndex = 0;
			} else {
				document.getElementById("booleanAndGroup").selectedIndex = 1;
			}
		},

		getAllArray: function (aType) {
			var i = 0;
			var myResult = [];
			while (true) {
				if (document.getElementById(aType + '_' + i + '_hbox')) {
					var mySearchCase = document.getElementById(aType + '_' + i + '_menulistCase').selectedItem.value;
					var mySearchObj = document.getElementById(aType + '_' + i + '_menulistObj').selectedItem.value;
					var mySearchTerm = document.getElementById(aType + '_' + i + '_menulistTerm').selectedItem.value;
					var mySearchValue = document.getElementById(aType + '_' + i + '_valueBox').value;
					myResult.push([mySearchCase, mySearchObj, mySearchTerm, mySearchValue]);
					i++;
				} else {                                                                             
					break;
				}
			}
			return myResult;
		},

		showOrHideForEmpty: function (aId) {
			var myIdArray = aId.split('_');
			if (document.getElementById(aId).selectedItem.value == "IsEmpty" || document.getElementById(aId).selectedItem.value == "IsntEmpty") {
				document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_valueBox').hidden = true;
				document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_menulistCase').hidden = true;
			} else {
				document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_valueBox').hidden = false;
				document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_menulistCase').hidden = false;
			}
		},

		loadDynamicTypes: function (aType, aIndex, aArray, aVersion) {
			var strBundle = document.getElementById("cardbook-strings");
			var aOrigBox = document.getElementById(aType + 'Groupbox');
			
			if (aIndex == 0) {
				cardbookElementTools.addCaption(aType, aOrigBox);
			}
			
			var aHBox = cardbookElementTools.addHBox(aType, aIndex, aOrigBox);

			cardbookElementTools.addMenuCaselist(aHBox, aType, aIndex, aArray[0]);
			cardbookElementTools.addMenuObjlist(aHBox, aType, aIndex, aArray[1]);
			cardbookElementTools.addMenuTermlist(aHBox, aType, aIndex, aArray[2]);
			cardbookElementTools.addKeyTextbox(aHBox, aType + '_' + aIndex + '_valueBox', aArray[3], {flex: "1"}, aVersion, aIndex);

			function fireUpButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookComplexSearch.getAllArray(myIdArray[0]);
				if (myAllValuesArray.length <= 1) {
					return;
				}
				var temp = myAllValuesArray[myIdArray[1]*1-1];
				myAllValuesArray[myIdArray[1]*1-1] = myAllValuesArray[myIdArray[1]];
				myAllValuesArray[myIdArray[1]] = temp;
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				cardbookComplexSearch.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "up", fireUpButton);
			
			function fireDownButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookComplexSearch.getAllArray(myIdArray[0]);
				if (myAllValuesArray.length <= 1) {
					return;
				}
				var temp = myAllValuesArray[myIdArray[1]*1+1];
				myAllValuesArray[myIdArray[1]*1+1] = myAllValuesArray[myIdArray[1]];
				myAllValuesArray[myIdArray[1]] = temp;
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				cardbookComplexSearch.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "down", fireDownButton);

			function fireRemoveButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookComplexSearch.getAllArray(myIdArray[0]);
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				if (myAllValuesArray.length == 0) {
					cardbookComplexSearch.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
				} else {
					var removed = myAllValuesArray.splice(myIdArray[1], 1);
					cardbookComplexSearch.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
				}
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "remove", fireRemoveButton);
			
			function fireAddButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myValue = document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_valueBox').value;
				var myTerm = document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_menulistTerm').selectedItem.value;
				if (myValue == "" && myTerm !== "IsEmpty" && myTerm !== "IsntEmpty") {
					return;
				}
				var myNextIndex = 1+ 1*myIdArray[1];
				cardbookComplexSearch.loadDynamicTypes(myIdArray[0], myNextIndex, ["","","",""], myIdArray[2]);
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "add", fireAddButton);

			cardbookTypes.disableButtons(aType, aIndex, aVersion);
			cardbookComplexSearch.showOrHideForEmpty(aType + '_' + aIndex + '_menulistTerm');
		},

		constructDynamicRows: function (aType, aArray, aVersion) {
			cardbookElementTools.deleteRowsType(aType);
			for (var i = 0; i < aArray.length; i++) {
				cardbookComplexSearch.loadDynamicTypes(aType, i, aArray[i], aVersion);
			}
			if (aArray.length == 0) {
				cardbookComplexSearch.loadDynamicTypes(aType, 0, ["","","",""], aVersion);
			}
		},

		initComplexSearch: function (aSearchId) {
			if (aSearchId != null && aSearchId !== undefined && aSearchId != "") {
				var myFile = cardbookRepository.getRuleFile(aSearchId);
				if (myFile.exists() && myFile.isFile()) {
					var params = {};
					params["showError"] = true;
					cardbookSynchronization.getFileDataAsync(myFile.path, cardbookComplexSearch.buildEngine, params);
				}
			} else {
				cardbookElementTools.loadAddressBooks("addressbookMenupopup", "addressbookMenulist", "allAddressBooks", true, true, true, false);
				cardbookComplexSearch.loadMatchAll("and");
				cardbookComplexSearch.constructDynamicRows("searchTerms", [["","","",""]], "3.0");
				document.getElementById('searchTerms_0_valueBox').focus();
			}
		},

		startComplexSearch: function (aPrefId, aListOfCards) {
			wdw_cardbook.setComplexSearchMode();
			cardbookRepository.cardbookSearchValue=cardbookRepository.cardbookComplexSearchMode;
			wdw_cardbook.clearCard();
			cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue] = [];
			var myFile = cardbookRepository.getRuleFile(aPrefId);
			if (myFile.exists() && myFile.isFile()) {
				var params = {};
				params["showError"] = true;
				params["aPrefId"] = aPrefId;
				params["aListOfCards"] = aListOfCards;
				cardbookSynchronization.getFileDataAsync(myFile.path, cardbookComplexSearch.searchEngine, params);
			}
		},
		
		getSearch: function () {
			var result = "searchAB:" + document.getElementById('addressbookMenulist').selectedItem.value;
			var searchAll = document.getElementById('booleanAndGroup').selectedItem.value == "and" ? "true" : "false";
			result = result + ":searchAll:" + searchAll;
			var found = false;
			var allRules = cardbookComplexSearch.getAllArray("searchTerms");
			for (var i = 0; i < allRules.length; i++) {
				if (allRules[i][2] == "IsEmpty") {
					found = true;
				} else if (allRules[i][2] == "IsntEmpty") {
					found = true;
				} else if (allRules[i][3] != "") {
					found = true;
				}
				if (found) {
					result = result + ":case:" + allRules[i][0] + ":field:" + allRules[i][1] + ":term:" + allRules[i][2] + ":value:" + allRules[i][3];
				}
			}
			if (found) {
				return result;
			} else {
				return "";
			}
		}

	};
};
