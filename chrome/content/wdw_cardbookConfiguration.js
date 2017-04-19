if ("undefined" == typeof(wdw_cardbookConfiguration)) {
	var wdw_cardbookConfiguration = {

		allTypes: {},
		allIMPPs: {},
		allOrg: [],
		allRestrictions: [],
		allMailAccounts: [],
		prefEmailPref: false,
		
		sortTreesFromCol: function (aEvent, aColumn, aTreeName) {
			if (aEvent.button == 0) {
				wdw_cardbookConfiguration.sortTrees(aColumn, aTreeName);
			}
		},

		sortTrees: function (aColumn, aTreeName) {
			var myTree = document.getElementById(aTreeName);
			if (aColumn) {
				if (myTree.currentIndex !== -1) {
					var mySelectedValue = myTree.view.getCellText(myTree.currentIndex, {id: aColumn.id});
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
				case "typesCode":
					columnArray=0;
					break;
				case "typesLabel":
					columnArray=1;
					break;
				case "accountsRestrictionsMailName":
					columnArray=2;
					break;
				case "accountsRestrictionsABName":
					columnArray=4;
					break;
				case "accountsRestrictionsCatName":
					columnArray=6;
					break;
				case "accountsRestrictionsIncludeName":
					columnArray=8;
					break;
				case "mailAccountsName":
					columnArray=2;
					break;
				case "mailAccountsFileName":
					columnArray=3;
					break;
				case "mailAccountsFn":
					columnArray=6;
					break;
				case "IMPPCode":
					columnArray=0;
					break;
				case "IMPPLabel":
					columnArray=1;
					break;
				case "IMPPProtocol":
					columnArray=2;
					break;
			}
			if (aTreeName == "mailAccountsTree") {
				var myData = wdw_cardbookConfiguration.allMailAccounts;
			} else if (aTreeName == "accountsRestrictionsTree") {
				var myData = wdw_cardbookConfiguration.allRestrictions;
			} else if (aTreeName == "IMPPsTree") {
				var myData = wdw_cardbookConfiguration.allIMPPs[document.getElementById('imppsCategoryRadiogroup').selectedItem.value];
			} else {
				var myData = wdw_cardbookConfiguration.allTypes[document.getElementById('typesCategoryRadiogroup').selectedItem.value];
			}
			
			if (myData && myData.length) {
				myData = cardbookUtils.sortArrayByString(myData,columnArray,order);
			}

			//setting these will make the sort option persist
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);
			
			if (aTreeName == "mailAccountsTree") {
				wdw_cardbookConfiguration.displayMailAccounts();
			} else if (aTreeName == "accountsRestrictionsTree") {
				wdw_cardbookConfiguration.displayRestrictions();
			} else if (aTreeName == "IMPPsTree") {
				wdw_cardbookConfiguration.displayIMPPs();
			} else {
				wdw_cardbookConfiguration.displayTypes();
			}
			
			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select back
			if (aColumn && mySelectedValue) {
				for (var i = 0; i < myTree.view.rowCount; i++) {
					if (myTree.view.getCellText(i, {id: aColumn.id}) == mySelectedValue) {
						myTree.view.selection.rangedSelect(i,i,true);
						found = true
						foundIndex = i;
						break;
					}
				}
			}
		},

		doubleClickTree: function (aEvent, aTreeName) {
			var myTree = document.getElementById(aTreeName);
			if (myTree.currentIndex != -1) {
				var row = { }, col = { }, child = { };
				myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
				if (row.value != -1) {
					if (aTreeName == "mailAccountsTree") {
						wdw_cardbookConfiguration.choosevCard();
					} else if (aTreeName == "accountsRestrictionsTree") {
						wdw_cardbookConfiguration.renameRestriction();
					} else if (aTreeName == "IMPPsTree") {
						wdw_cardbookConfiguration.renameIMPP();
					} else {
						wdw_cardbookConfiguration.renameType();
					}
				}
			}
		},

		displayMailAccounts: function () {
			var mailAccountsTreeView = {
				get rowCount() { return wdw_cardbookConfiguration.allMailAccounts.length; },
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) {
					if (column.id == "mailAccountsEnabled") return true;
					else return false;
				},
				getCellText: function(idx, column) {
					if (column.id == "mailAccountsEnabled") return wdw_cardbookConfiguration.allMailAccounts[idx][0];
					else if (column.id == "mailAccountsId") return wdw_cardbookConfiguration.allMailAccounts[idx][1];
					else if (column.id == "mailAccountsName") return wdw_cardbookConfiguration.allMailAccounts[idx][2];
					else if (column.id == "mailAccountsFileName") return wdw_cardbookConfiguration.allMailAccounts[idx][3];
					else if (column.id == "mailAccountsDirPrefId") return wdw_cardbookConfiguration.allMailAccounts[idx][4];
					else if (column.id == "mailAccountsUid") return wdw_cardbookConfiguration.allMailAccounts[idx][5];
					else if (column.id == "mailAccountsFn") return wdw_cardbookConfiguration.allMailAccounts[idx][6];
				},
				getCellValue: function(idx, column) {
					if (column.id == "mailAccountsEnabled") return wdw_cardbookConfiguration.allMailAccounts[idx][0];
				},
				setCellValue: function(idx, column) {
					if (column.id == "mailAccountsEnabled") {
						wdw_cardbookConfiguration.allMailAccounts[idx][0] = !wdw_cardbookConfiguration.allMailAccounts[idx][0];
					}
				}
			}
			document.getElementById('mailAccountsTree').view = mailAccountsTreeView;
		},

		loadMailAccounts: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			wdw_cardbookConfiguration.allMailAccounts = [];
			var accounts = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager).accounts;
			var accountsLength = (typeof accounts.Count === 'undefined') ? accounts.length : accounts.Count();
			for (var i = 0; i < accountsLength; i++) {
				var account = accounts.queryElementAt ? accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount) : accounts.GetElementAt(i).QueryInterface(Components.interfaces.nsIMsgAccount);
				if (!account.incomingServer) {
					continue;
				}
				var identitiesLength = (typeof account.identities.Count === 'undefined') ? account.identities.length : account.identities.Count();
				for (var j = 0; j < identitiesLength; j++) {
					var identity = account.identities.queryElementAt ? account.identities.queryElementAt(j, Components.interfaces.nsIMsgIdentity) : account.identities.GetElementAt(j).QueryInterface(Components.interfaces.nsIMsgIdentity);
					var mailAccountServer = account.incomingServer;
					if (mailAccountServer.type == "pop3" || mailAccountServer.type == "imap") {
						var accountPrettyName = mailAccountServer.prettyName; // gets mail account name
						var enabled = cardbookPrefService.getMailAccountEnabled(identity.key);
						var filename = cardbookPrefService.getMailAccountFileName(identity.key);
						var dirPrefId = cardbookPrefService.getMailAccountDirPrefId(identity.key);
						var uid = cardbookPrefService.getMailAccountUid(identity.key);
						if (cardbookRepository.cardbookCards[dirPrefId+"::"+uid]) {
							var fn = cardbookRepository.cardbookCards[dirPrefId+"::"+uid].fn;
						} else {
							var dirPrefId = "";
							var uid = "";
							var fn = "";
						}
						wdw_cardbookConfiguration.allMailAccounts.push([enabled, identity.key, accountPrettyName, filename, dirPrefId, uid, fn]);
					}
				}
			}
		},

		validateMailAccounts: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			var mailAccountTemp = [];
			mailAccountTemp = cardbookPrefService.getAllMailAccounts();
			for (var i = 0; i < wdw_cardbookConfiguration.allMailAccounts.length; i++) {
				cardbookPrefService.setMailAccountEnabled(wdw_cardbookConfiguration.allMailAccounts[i][1], wdw_cardbookConfiguration.allMailAccounts[i][0]);
				cardbookPrefService.setMailAccountFileName(wdw_cardbookConfiguration.allMailAccounts[i][1], wdw_cardbookConfiguration.allMailAccounts[i][3]);
				cardbookPrefService.setMailAccountDirPrefId(wdw_cardbookConfiguration.allMailAccounts[i][1], wdw_cardbookConfiguration.allMailAccounts[i][4]);
				cardbookPrefService.setMailAccountUid(wdw_cardbookConfiguration.allMailAccounts[i][1], wdw_cardbookConfiguration.allMailAccounts[i][5]);
				function filterArray(element) {
					return (element != wdw_cardbookConfiguration.allMailAccounts[i][1]);
				}
				mailAccountTemp = mailAccountTemp.filter(filterArray);
			}
			for (var i = 0; i < mailAccountTemp.length; i++) {
				cardbookPrefService.delMailAccount(mailAccountTemp[i]);
			}
		},

		choosevCard: function () {
			var myTree = document.getElementById('mailAccountsTree');
			if (myTree.currentIndex != -1) {
				var myMailAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "mailAccountsId"});
				var myMailAccountFilename = myTree.view.getCellText(myTree.currentIndex, {id: "mailAccountsFileName"});
				var myArgs = {filename: myMailAccountFilename, cardbookId: "", typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationSearchCard.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE") {
					var tmpArray = myArgs.cardbookId.split("::");
					if (cardbookRepository.cardbookCards[myArgs.cardbookId]) {
						var fn = cardbookRepository.cardbookCards[myArgs.cardbookId].fn;
					} else {
						var fn = "";
					}
					for (var i = 0; i < wdw_cardbookConfiguration.allMailAccounts.length; i++) {
						if (wdw_cardbookConfiguration.allMailAccounts[i][1] == myMailAccountId) {
							wdw_cardbookConfiguration.allMailAccounts[i][0] = true;
							wdw_cardbookConfiguration.allMailAccounts[i][3] = myArgs.filename;
							wdw_cardbookConfiguration.allMailAccounts[i][4] = tmpArray[0];
							wdw_cardbookConfiguration.allMailAccounts[i][5] = tmpArray[1];
							wdw_cardbookConfiguration.allMailAccounts[i][6] = fn;
							break;
						}
					}
					wdw_cardbookConfiguration.sortTrees(null, "mailAccountsTree");
				}
			}
		},

		displayvCard: function () {
			var myTree = document.getElementById('mailAccountsTree');
			if (myTree.currentIndex != -1) {
				var myMailAccountsDirPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "mailAccountsDirPrefId"});
				var myMailAccountsUid = myTree.view.getCellText(myTree.currentIndex, {id: "mailAccountsUid"});
				if (cardbookRepository.cardbookCards[myMailAccountsDirPrefId+"::"+myMailAccountsUid]) {
					var myCard = cardbookRepository.cardbookCards[myMailAccountsDirPrefId+"::"+myMailAccountsUid];
					var myMailAccountFilename = myTree.view.getCellText(myTree.currentIndex, {id: "mailAccountsFileName"});
					var myArgs = {filename: myMailAccountFilename, data: cardbookUtils.getvCardForEmail(myCard)};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationDisplayCard.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				}
			}
		},

		loadPrefEmailPref: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			wdw_cardbookConfiguration.prefEmailPref = prefs.getBoolPref("extensions.cardbook.preferEmailPref");
		},

		validatePrefEmailPref: function () {
			var myNewCheck = document.getElementById('preferEmailPrefCheckBox').checked;
			if (myNewCheck !== wdw_cardbookConfiguration.prefEmailPref) {
				for (j in cardbookRepository.cardbookCards) {
					let myCard = cardbookRepository.cardbookCards[j];
					if (!myCard.isAList) {
						myCard.emails = cardbookUtils.getEmailsFromCard(myCard, myNewCheck);
					}
				}
				cardbookRepository.preferEmailPref = myNewCheck;
			}
		},

		loadFnFormula: function () {
			var strBundle = document.getElementById("cardbook-strings");
			var myLabel = "";
			myLabel = myLabel + "{{1}} : " + strBundle.getString("prefixnameLabel") + "    ";
			myLabel = myLabel + "{{2}} : " + strBundle.getString("firstnameLabel") + "    ";
			myLabel = myLabel + "{{3}} : " + strBundle.getString("othernameLabel") + "    ";
			myLabel = myLabel + "{{4}} : " + strBundle.getString("lastnameLabel") + "    ";
			myLabel = myLabel + "{{5}} : " + strBundle.getString("suffixnameLabel");
			document.getElementById('fnFormulaDescriptionLabel1').value = myLabel.trim();
			myLabel = "";
			var count = 6;
			if (wdw_cardbookConfiguration.allOrg.length === 0) {
				myLabel = "{{6}} : " + strBundle.getString("orgLabel");
			} else {
				for (var i = 0; i < wdw_cardbookConfiguration.allOrg.length; i++) {
					var index = count + i;
					myLabel = myLabel + "{{" + index + "}} : " + wdw_cardbookConfiguration.allOrg[i] + "    ";
				}
			}
			document.getElementById('fnFormulaDescriptionLabel2').value = myLabel.trim();
		},

		resetFnFormula: function () {
			document.getElementById('fnFormulaTextBox').value = cardbookRepository.defaultFnFormula;
		},

		validateFnFormula: function () {
			if (document.getElementById('fnFormulaTextBox').value == "") {
				wdw_cardbookConfiguration.resetFnFormula();
			}
			// to be sure the pref is saved (resetting its value does not save the preference)
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = document.getElementById('fnFormulaTextBox').value;
			prefs.setComplexValue("extensions.cardbook.fnFormula", Components.interfaces.nsISupportsString, str);
		},

		loadEventEntryTitle: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var eventEntryTitle = prefs.getComplexValue("extensions.cardbook.eventEntryTitle", Components.interfaces.nsISupportsString).data;
			if (eventEntryTitle == "") {
				var strBundle = document.getElementById("cardbook-strings");
				document.getElementById('calendarEntryTitleTextBox').value=strBundle.getString("eventEntryTitleMessage");
			}
		},

		showTab: function () {
			if (window.arguments) {
				if (window.arguments[0].showTab != null && window.arguments[0].showTab !== undefined && window.arguments[0].showTab != "") {
					document.getElementById('advancedPrefs').selectedTab = document.getElementById(window.arguments[0].showTab);
				}
			}
		},

		remindViaPopup: function () {
			if (document.getElementById('showPopupOnStartupCheckBox').checked || document.getElementById('showPeriodicPopupCheckBox').checked) {
				document.getElementById('showPopupEvenIfNoBirthdayCheckBox').disabled=false;
			} else {
				document.getElementById('showPopupEvenIfNoBirthdayCheckBox').disabled=true;
			}
			if (document.getElementById('showPeriodicPopupCheckBox').checked) {
				document.getElementById('periodicPopupTimeTextBox').disabled=false;
				document.getElementById('periodicPopupTimeLabel').disabled=false;
			} else {
				document.getElementById('periodicPopupTimeTextBox').disabled=true;
				document.getElementById('periodicPopupTimeLabel').disabled=true;
			}
		},

		wholeDay: function () {
			if (document.getElementById('calendarEntryWholeDayCheckBox').checked) {
				document.getElementById('calendarEntryTimeTextBox').disabled=true;
				document.getElementById('calendarEntryTimeLabel').disabled=true;
			} else {
				document.getElementById('calendarEntryTimeTextBox').disabled=false;
				document.getElementById('calendarEntryTimeLabel').disabled=false;
			}
		},

		LightningInstallation: function (aValue) {
			document.getElementById('calendarsGoupbox').disabled = aValue;
			document.getElementById('calendarsCheckbox').disabled = aValue;
			document.getElementById('calendarsListbox').disabled = aValue;
			document.getElementById('numberOfDaysForWritingLabel').disabled = aValue;
			document.getElementById('numberOfDaysForWritingTextBox').disabled = aValue;
			document.getElementById('syncWithLightningOnStartupCheckBox').disabled = aValue;
			document.getElementById('calendarEntryTitleLabel').disabled = aValue;
			document.getElementById('calendarEntryTitleTextBox').disabled = aValue;
			if (!aValue) {
				if (document.getElementById('calendarEntryWholeDayCheckBox').checked) {
					document.getElementById('calendarEntryTimeTextBox').disabled=true;
					document.getElementById('calendarEntryTimeLabel').disabled=true;
				} else {
					document.getElementById('calendarEntryTimeTextBox').disabled=false;
					document.getElementById('calendarEntryTimeLabel').disabled=false;
				}
			} else {
				document.getElementById('calendarEntryWholeDayCheckBox').disabled = aValue;
				document.getElementById('calendarEntryTimeLabel').disabled = aValue;
				document.getElementById('calendarEntryTimeTextBox').disabled = aValue;
			}
			document.getElementById('calendarEntryAlarmLabel').disabled = aValue;
			document.getElementById('calendarEntryAlarmTextBox').disabled = aValue;
			document.getElementById('calendarEntryCategoriesLabel').disabled = aValue;
			document.getElementById('calendarEntryCategoriesTextBox').disabled = aValue;
		},

		changeCalendarsPref: function () {
			var aCheckBox = document.getElementById('calendarsCheckbox');
			var aListBox = document.getElementById('calendarsListbox');
			var calendarsNameList = [];
			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				aItem.setAttribute('checked', aCheckBox.checked);
				if (aCheckBox.checked) {
					calendarsNameList.push(aItem.getAttribute('value'));
				}
			}
			var aPref = document.getElementById('extensions.cardbook.calendarsNameList');
			aPref.value = calendarsNameList.join(',');
		},

		changeCalendarPref: function () {
			var aCheckBox = document.getElementById('calendarsCheckbox');
			var aListBox = document.getElementById('calendarsListbox');
			var calendarsNameList = [];
			var totalChecked = 0;
			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				var aItemChecked = aItem.getAttribute('checked');
				aItemChecked = typeof aItemChecked == "boolean" ? aItemChecked : (aItemChecked == 'true' ? true : false);
				if (aItemChecked) {
					totalChecked++;
					calendarsNameList.push(aItem.getAttribute('value'));
				}
			}
			if (totalChecked === aListBox.itemCount) {
				aCheckBox.checked = true;
			} else {
				aCheckBox.checked = false;
			}
			var aPref = document.getElementById('extensions.cardbook.calendarsNameList');
			aPref.value = calendarsNameList.join(',');
		},
		
		loadCalendars: function (addon) {
			if (addon && addon.isActive) {
				var aCheckBox = document.getElementById('calendarsCheckbox');
				var aListBox = document.getElementById('calendarsListbox');
				var aPref = document.getElementById('extensions.cardbook.calendarsNameList');
		
				var sortedCalendars = [];
				var calendarManager = Components.classes["@mozilla.org/calendar/manager;1"].getService(Components.interfaces.calICalendarManager);
				var calendars = calendarManager.getCalendars({});
				for (var prop in calendars) {
					var cal = calendars[prop];
					sortedCalendars.push([cal.name, cal.id]);
				}
				sortedCalendars = cardbookUtils.sortArrayByString(sortedCalendars,0,1);
		
				var totalChecked = 0;
				for (var i = 0; i < sortedCalendars.length; i++) {
					var aItem = aListBox.appendItem(sortedCalendars[i][0], sortedCalendars[i][1]);
					aItem.setAttribute('type', 'checkbox');
					if (aPref.value.indexOf(sortedCalendars[i][1]) >= 0) {
						totalChecked++;
						aItem.setAttribute('checked', true);
					} else {
						aItem.setAttribute('checked', false);
					}
					aItem.addEventListener("command", function(event) {
							wdw_cardbookConfiguration.changeCalendarPref();
						}, false);
					}
				if (totalChecked === aListBox.itemCount) {
					aCheckBox.checked = true;
				} else {
					aCheckBox.checked = false;
				}
				wdw_cardbookConfiguration.LightningInstallation(false);
			} else {
				wdw_cardbookConfiguration.LightningInstallation(true);
			}
		},
	
		changeEmailsCollectionCat: function (aLength) {
			if (aLength === 0) {
				document.getElementById('emailsCollectionCat').disabled = true;
				document.getElementById('emailsCollectionCatTextBox').disabled = true;
			} else {
				document.getElementById('emailsCollectionCat').disabled = false;
				document.getElementById('emailsCollectionCatTextBox').disabled = false;
			}
		},

		changeAddressBooksPref: function (aCheckboxName) {
			var aCheckBox = document.getElementById(aCheckboxName);
			var aListBox = document.getElementById(aCheckboxName.replace('Checkbox', 'Listbox'));
			var addressBooksNameList = [];

			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				aItem.setAttribute('checked', aCheckBox.checked);
				if (aCheckBox.checked) {
					addressBooksNameList.push(aItem.getAttribute('value'));
				}
			}

			var aPref = document.getElementById('extensions.cardbook.' + aCheckboxName.replace('Checkbox', ''));
			aPref.value = addressBooksNameList.join(',');
			wdw_cardbookConfiguration.changeEmailsCollectionCat(addressBooksNameList.length);
		},

		changeAddressBookPref: function (aCheckboxName) {
			var aCheckBox = document.getElementById(aCheckboxName);
			var aListBox = document.getElementById(aCheckboxName.replace('Checkbox', 'Listbox'));
			var addressBooksNameList = [];
			var totalChecked = 0;

			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				var aItemChecked = aItem.getAttribute('checked');
				aItemChecked = typeof aItemChecked == "boolean" ? aItemChecked : (aItemChecked == 'true' ? true : false);
				if (aItemChecked) {
					totalChecked++;
					addressBooksNameList.push(aItem.getAttribute('value'));
				}
			}
			
			if (totalChecked === aListBox.itemCount) {
				aCheckBox.checked = true;
			} else {
				aCheckBox.checked = false;
			}

			var aPref = document.getElementById('extensions.cardbook.' + aCheckboxName.replace('Checkbox', ''));
			aPref.value = addressBooksNameList.join(',');
			wdw_cardbookConfiguration.changeEmailsCollectionCat(addressBooksNameList.length);
		},
		
		loadAddressBooks: function (aType, aNotReadOnly) {
			var aCheckBox = document.getElementById(aType + 'Checkbox');
			var aListBox = document.getElementById(aType + 'Listbox');
			var aPref = document.getElementById('extensions.cardbook.' + aType);

			var sortedAddressBooks = [];
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (aNotReadOnly) {
					if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && !cardbookRepository.cardbookAccounts[i][7] && (cardbookRepository.cardbookAccounts[i][6] !== "SEARCH")) {
						sortedAddressBooks.push([cardbookRepository.cardbookAccounts[i][0], cardbookRepository.cardbookAccounts[i][4]]);
					}
				} else {
					if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] !== "SEARCH")) {
						sortedAddressBooks.push([cardbookRepository.cardbookAccounts[i][0], cardbookRepository.cardbookAccounts[i][4]]);
					}
				}
			}
			sortedAddressBooks = cardbookUtils.sortArrayByString(sortedAddressBooks,0,1);

			var totalChecked = 0;
			for (var i = 0; i < sortedAddressBooks.length; i++) {
				var aItem = aListBox.appendItem(sortedAddressBooks[i][0], sortedAddressBooks[i][1]);
				aItem.setAttribute('id', aCheckBox.id + '_' + i);
				aItem.setAttribute('type', 'checkbox');
				if ( (aPref.value.indexOf(sortedAddressBooks[i][1]) >= 0) || (aPref.value === "allAddressBooks") ) {
					totalChecked++;
					aItem.setAttribute('checked', true);
				} else {
					aItem.setAttribute('checked', false);
				}
				aItem.addEventListener("command", function(event) {
						var myCheckBoxIdArray = this.id.split('_');
						wdw_cardbookConfiguration.changeAddressBookPref(myCheckBoxIdArray[0]);
					}, false);
			}
			if (totalChecked === aListBox.itemCount) {
				aCheckBox.checked = true;
			} else {
				aCheckBox.checked = false;
			}
			if (aNotReadOnly) {
				wdw_cardbookConfiguration.changeEmailsCollectionCat(totalChecked);
			}
		},

		loadDateFormats: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var dateFormatMenu = prefs.getComplexValue("extensions.cardbook.dateFormatMenu", Components.interfaces.nsISupportsString).data;
			cardbookElementTools.loadDateFormats("dateFormatMenuPopup", "dateFormatMenuList", dateFormatMenu);
		},

		validateEventEntryTitle: function () {
			var checkTest = document.getElementById('calendarEntryTitleTextBox').value.split("%S").length - 1;
			if (checkTest != 2) {
				var strBundle = document.getElementById("cardbook-strings");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = strBundle.getString("eventEntryTitleProblemTitle");
				var errorMsg = strBundle.getString("eventEntryTitleProblemMessage") + ' (' + strBundle.getString("eventEntryTitleMessage") + ').';
				prompts.alert(null, errorTitle, errorMsg);
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				str.data = strBundle.getString("eventEntryTitleMessage");
				prefs.setComplexValue("extensions.cardbook.eventEntryTitle", Components.interfaces.nsISupportsString, str);
			}
		},

		//needed for linux
		addAcceptButton: function(e) {
			var buttonAccept = document.documentElement.getButton('accept');
			buttonAccept.hidden = false;
			buttonAccept.disabled = false;
		},

		selectOrg: function() {
			var btnEdit = document.getElementById("renameOrgLabel");
			var listBox = document.getElementById("orgListbox");
			if (listBox.selectedCount > 0) {
				btnEdit.disabled = false;
			} else {
				btnEdit.disabled = true;
			}
			document.getElementById("deleteOrgLabel").disabled = btnEdit.disabled;
		},

		loadCustoms: function () {
			for (var i in cardbookRepository.customFields) {
				document.getElementById(cardbookRepository.customFields[i] + 'Name').value = cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]];
				document.getElementById(cardbookRepository.customFields[i] + 'Label').value = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
			}
		},
		
		refreshListBoxOrg: function () {
			var myListBox = document.getElementById('orgListbox');
			var count = myListBox.itemCount;
			while(count-- > 0){
				myListBox.removeItemAt(0);
			}
			
			if (wdw_cardbookConfiguration.allOrg.length != 0) {
				for (var i = 0; i < wdw_cardbookConfiguration.allOrg.length; i++) {
					var aItem = myListBox.appendItem(wdw_cardbookConfiguration.allOrg[i], wdw_cardbookConfiguration.allOrg[i]);
				}
			}
		},

		loadOrg: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var orgStructure = prefs.getComplexValue("extensions.cardbook.orgStructure", Components.interfaces.nsISupportsString).data;
			if (orgStructure != "") {
				wdw_cardbookConfiguration.allOrg = cardbookUtils.unescapeArray(cardbookUtils.escapeString(orgStructure).split(";"));
			} else {
				wdw_cardbookConfiguration.allOrg = [];
			}
		},
		
		displayOrg: function () {
			wdw_cardbookConfiguration.refreshListBoxOrg();
		},
		
		addOrg: function () {
			var myListBox = document.getElementById('orgListbox');
			var myArgs = {type: "", context: "Org", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookRenameField.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE" && myArgs.type != "") {
				wdw_cardbookConfiguration.allOrg = [];
				for (var i = 0; i < myListBox.itemCount; i++) {
					wdw_cardbookConfiguration.allOrg.push(myListBox.getItemAtIndex(i).getAttribute("value"));
				}
				wdw_cardbookConfiguration.allOrg.push(myArgs.type);
				wdw_cardbookConfiguration.refreshListBoxOrg();
				wdw_cardbookConfiguration.loadFnFormula();
			}
		},
		
		renameOrg: function () {
			var myListBox = document.getElementById('orgListbox');
			if (myListBox.selectedIndex == -1) {
				return;
			} else {
				var myItem = myListBox.getSelectedItem(0);
				var myArgs = {type: myItem.getAttribute("value"), context: "Org", typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookRenameField.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE" && myArgs.type != "") {
					wdw_cardbookConfiguration.allOrg = [];
					for (let i = 0; i < myListBox.itemCount; i++) {
						if (i === myListBox.selectedIndex) {
							wdw_cardbookConfiguration.allOrg.push(myArgs.type);
						} else {
							wdw_cardbookConfiguration.allOrg.push(myListBox.getItemAtIndex(i).getAttribute("value"));
						}
					}
					wdw_cardbookConfiguration.refreshListBoxOrg();
					wdw_cardbookConfiguration.loadFnFormula();
				}
			}
		},
		
		deleteOrg: function () {
			var myListBox = document.getElementById('orgListbox');
			if (myListBox.selectedIndex == -1) {
				return;
			} else {
				wdw_cardbookConfiguration.allOrg = [];
				for (let i = 0; i < myListBox.itemCount; i++) {
					if (i !== myListBox.selectedIndex) {
						wdw_cardbookConfiguration.allOrg.push(myListBox.getItemAtIndex(i).getAttribute("value"));
					}
				}
				wdw_cardbookConfiguration.refreshListBoxOrg();
				wdw_cardbookConfiguration.loadFnFormula();
			}
		},
		
		validateOrg: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = cardbookUtils.unescapeStringSemiColon(cardbookUtils.escapeArraySemiColon(wdw_cardbookConfiguration.allOrg).join(";"));
			prefs.setComplexValue("extensions.cardbook.orgStructure", Components.interfaces.nsISupportsString, str);
		},

		loadPref: function () {
			if (document.getElementById('preferenceTextbox').value == "") {
				var cardbookPrefService = new cardbookPreferenceService();
				document.getElementById('preferenceTextbox').value = cardbookPrefService.getPrefLabel();
			}
			if (document.getElementById('preferenceValueTextbox').value == "") {
				document.getElementById('preferenceValueTextbox').value = cardbookPrefService.getPrefValueLabel();
			}
		},

		selectRestriction: function() {
			var btnEdit = document.getElementById("renameRestrictionLabel");
			var myTree = document.getElementById("accountsRestrictionsTree");
			if (myTree.view.selection.getRangeCount() > 0) {
				btnEdit.disabled = false;
			} else {
				btnEdit.disabled = true;
			}
			document.getElementById("deleteRestrictionLabel").disabled = btnEdit.disabled;
		},

		getEmailAccountName: function(aEmailAccountId) {
			if (aEmailAccountId == "allMailAccounts") {
				var strBundle = document.getElementById("cardbook-strings");
				return strBundle.getString(aEmailAccountId);
			}
			var accounts = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager).accounts;
			var accountsLength = (typeof accounts.Count === 'undefined') ? accounts.length : accounts.Count();
			for (var i = 0; i < accountsLength; i++) {
				var account = accounts.queryElementAt ? accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount) : accounts.GetElementAt(i).QueryInterface(Components.interfaces.nsIMsgAccount);
				if (!account.incomingServer) {
					continue;
				}
				var identitiesLength = (typeof account.identities.Count === 'undefined') ? account.identities.length : account.identities.Count();
				for (var j = 0; j < identitiesLength; j++) {
					var identity = account.identities.queryElementAt ? account.identities.queryElementAt(j, Components.interfaces.nsIMsgIdentity) : account.identities.GetElementAt(j).QueryInterface(Components.interfaces.nsIMsgIdentity);
					var mailAccountServer = account.incomingServer;
					if (mailAccountServer.type == "pop3" || mailAccountServer.type == "imap") {
						if (aEmailAccountId == identity.key) {
							return mailAccountServer.prettyName;
						}
					}
				}
			}
			return "";			
		},

		getABName: function(dirPrefId) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (!prefs.getBoolPref("extensions.cardbook.exclusive")) {
				var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
				var contacts = contactManager.directories;
				while ( contacts.hasMoreElements() ) {
					var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
					if (contact.dirPrefId == dirPrefId) {
						return contact.dirName;
					}
				}
			}
			return cardbookUtils.getPrefNameFromPrefId(dirPrefId);
		},

		loadRestrictions: function () {
			var strBundle = document.getElementById("cardbook-strings");
			var cardbookPrefService = new cardbookPreferenceService();
			var result = [];
			result = cardbookPrefService.getAllRestrictions();
			var count = 0;
			for (var i = 0; i < result.length; i++) {
				var resultArray = result[i].split("::");
				var emailAccountName = wdw_cardbookConfiguration.getEmailAccountName(resultArray[2]);
				if (emailAccountName != "") {
					var ABName = wdw_cardbookConfiguration.getABName(resultArray[3]);
					if (ABName != "") {
						var index = count++;
						if (resultArray[4] && resultArray[4] != null && resultArray[4] !== undefined && resultArray[4] != "") {
							var categoryId = resultArray[3] + "::" + resultArray[4];
							var categoryName = resultArray[4];
						} else {
							var categoryId = "";
							var categoryName = "";
						}
						wdw_cardbookConfiguration.allRestrictions.push([(resultArray[0] == "true"), index.toString(), emailAccountName, resultArray[2],
																		ABName, resultArray[3], categoryName, categoryId, strBundle.getString(resultArray[1] + "Label"), resultArray[1]]);
					}
				}
			}
		},
		
		displayRestrictions: function () {
			var accountsRestrictionsTreeView = {
				get rowCount() { return wdw_cardbookConfiguration.allRestrictions.length; },
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) {
					if (column.id == "accountsRestrictionsEnabled") return true;
					else return false;
				},
				getCellText: function(idx, column) {
					if (column.id == "accountsRestrictionsEnabled") return wdw_cardbookConfiguration.allRestrictions[idx][0];
					else if (column.id == "accountsRestrictionsId") return wdw_cardbookConfiguration.allRestrictions[idx][1];
					else if (column.id == "accountsRestrictionsMailName") return wdw_cardbookConfiguration.allRestrictions[idx][2];
					else if (column.id == "accountsRestrictionsMailId") return wdw_cardbookConfiguration.allRestrictions[idx][3];
					else if (column.id == "accountsRestrictionsABName") return wdw_cardbookConfiguration.allRestrictions[idx][4];
					else if (column.id == "accountsRestrictionsDirPrefId") return wdw_cardbookConfiguration.allRestrictions[idx][5];
					else if (column.id == "accountsRestrictionsCatName") return wdw_cardbookConfiguration.allRestrictions[idx][6];
					else if (column.id == "accountsRestrictionsCatId") return wdw_cardbookConfiguration.allRestrictions[idx][7];
					else if (column.id == "accountsRestrictionsIncludeName") return wdw_cardbookConfiguration.allRestrictions[idx][8];
					else if (column.id == "accountsRestrictionsIncludeCode") return wdw_cardbookConfiguration.allRestrictions[idx][9];
				},
				getCellValue: function(idx, column) {
					if (column.id == "accountsRestrictionsEnabled") return wdw_cardbookConfiguration.allRestrictions[idx][0];
				},
				setCellValue: function(idx, column) {
					if (column.id == "accountsRestrictionsEnabled") {
						wdw_cardbookConfiguration.allRestrictions[idx][0] = !wdw_cardbookConfiguration.allRestrictions[idx][0];
					}
				}
			}
			document.getElementById('accountsRestrictionsTree').view = accountsRestrictionsTreeView;
			wdw_cardbookConfiguration.selectRestriction();
		},
		
		addRestriction: function () {
			var myArgs = {emailAccountId: "", emailAccountName: "", addressBookId: "", addressBookName: "", categoryName: "", includeName: "",  includeCode: "", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationAddRestriction.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE") {
				wdw_cardbookConfiguration.allRestrictions.push([true, wdw_cardbookConfiguration.allRestrictions.length.toString(), myArgs.emailAccountName, myArgs.emailAccountId,
																myArgs.addressBookName, myArgs.addressBookId, myArgs.categoryName, myArgs.categoryId, myArgs.includeName, myArgs.includeCode]);
				wdw_cardbookConfiguration.allRestrictions = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allRestrictions,1,1);
				wdw_cardbookConfiguration.sortTrees(null, "accountsRestrictionsTree");
			}
		},
		
		renameRestriction: function () {
			var myTree = document.getElementById('accountsRestrictionsTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myEnabled = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsEnabled"});
				var myId = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsId"});
				var myMailId = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsMailId"});
				var myMailName = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsMailName"});
				var myABName = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsABName"});
				var myABDirPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsDirPrefId"});
				var myCatName = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsCatName"});
				var myCatId = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsCatId"});
				var myIncludeName = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsIncludeName"});
				var myIncludeCode = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsIncludeCode"});
				var myArgs = {emailAccountId: myMailId, emailAccountName: myMailName, addressBookId: myABDirPrefId, addressBookName: myABName, categoryId: myCatId, categoryName: myCatName,
								includeName: myIncludeName, includeCode: myIncludeCode, typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationAddRestriction.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE") {
					var result = [];
					for (let i = 0; i < wdw_cardbookConfiguration.allRestrictions.length; i++) {
						if (myId === wdw_cardbookConfiguration.allRestrictions[i][1]) {
							result.push([myEnabled, myId, myArgs.emailAccountName, myArgs.emailAccountId, myArgs.addressBookName, myArgs.addressBookId, myArgs.categoryName, myArgs.categoryId,
										myArgs.includeName, myArgs.includeCode]);
						} else {
							result.push(wdw_cardbookConfiguration.allRestrictions[i]);
						}
					}
					wdw_cardbookConfiguration.allRestrictions = JSON.parse(JSON.stringify(result));
					wdw_cardbookConfiguration.allRestrictions = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allRestrictions,1,1);
					wdw_cardbookConfiguration.sortTrees(null, "accountsRestrictionsTree");
				}
			}
		},
		
		deleteRestriction: function () {
			var myTree = document.getElementById('accountsRestrictionsTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myId = myTree.view.getCellText(myTree.currentIndex, {id: "accountsRestrictionsId"});
				var result = [];
				for (let i = 0; i < wdw_cardbookConfiguration.allRestrictions.length; i++) {
					if (myId !== wdw_cardbookConfiguration.allRestrictions[i][1]) {
						result.push(wdw_cardbookConfiguration.allRestrictions[i]);
					}
				}
				wdw_cardbookConfiguration.allRestrictions = JSON.parse(JSON.stringify(result));
				wdw_cardbookConfiguration.sortTrees(null, "accountsRestrictionsTree");
			}
		},
		
		validateRestrictions: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delRestrictions();
			for (var i = 0; i < wdw_cardbookConfiguration.allRestrictions.length; i++) {
				cardbookPrefService.setRestriction(wdw_cardbookConfiguration.allRestrictions[i][1], wdw_cardbookConfiguration.allRestrictions[i][0].toString() + "::" + wdw_cardbookConfiguration.allRestrictions[i][9]
													+ "::" + wdw_cardbookConfiguration.allRestrictions[i][3] + "::" + wdw_cardbookConfiguration.allRestrictions[i][5] + "::" + wdw_cardbookConfiguration.allRestrictions[i][6]);
			}
			cardbookUtils.notifyObservers("cardbook.restrictionsChanged");
		},

		selectTypes: function() {
			var btnEdit = document.getElementById("renameTypeLabel");
			var myTree = document.getElementById("typesTree");
			if (myTree.view.selection.getRangeCount() > 0) {
				btnEdit.disabled = false;
			} else {
				btnEdit.disabled = true;
			}
			document.getElementById("deleteTypeLabel").disabled = btnEdit.disabled;
		},

		loadTypes: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			wdw_cardbookConfiguration.allTypes = cardbookPrefService.getAllTypes();
		},
		
		displayTypes: function () {
			var typesTreeView = {
				typeField: document.getElementById('typesCategoryRadiogroup').selectedItem.value,
				get rowCount() { 
					if (wdw_cardbookConfiguration.allTypes[this.typeField]) {
						return wdw_cardbookConfiguration.allTypes[this.typeField].length;
					} else {
						return 0;
					}
				},
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "typesCode") return wdw_cardbookConfiguration.allTypes[this.typeField][idx][0];
					else if (column.id == "typesLabel") return wdw_cardbookConfiguration.allTypes[this.typeField][idx][1];
				}
			}
			document.getElementById('typesTree').view = typesTreeView;
			wdw_cardbookConfiguration.selectTypes();
		},
		
		addType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myArgs = {code: "", label: "", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookAddType.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE") {
				wdw_cardbookConfiguration.allTypes[type].push([myArgs.code, myArgs.label]);
				wdw_cardbookConfiguration.allTypes[type] = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allTypes[type],1,1);
				wdw_cardbookConfiguration.sortTrees(null, "typesTree");
			}
		},
		
		renameType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myTree = document.getElementById('typesTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myCode = myTree.view.getCellText(myTree.currentIndex, {id: "typesCode"});
				var myLabel = myTree.view.getCellText(myTree.currentIndex, {id: "typesLabel"});
				var myArgs = {code: myCode, label: myLabel, typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookAddType.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE") {
					var result = [];
					for (let i = 0; i < wdw_cardbookConfiguration.allTypes[type].length; i++) {
						if (myCode === wdw_cardbookConfiguration.allTypes[type][i][0]) {
							result.push([myArgs.code, myArgs.label]);
						} else {
							result.push(wdw_cardbookConfiguration.allTypes[type][i]);
						}
					}
					wdw_cardbookConfiguration.allTypes[type] = JSON.parse(JSON.stringify(result));
					wdw_cardbookConfiguration.allTypes[type] = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allTypes[type],1,1);
					wdw_cardbookConfiguration.sortTrees(null, "typesTree");
				}
			}
		},
		
		deleteType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myTree = document.getElementById('typesTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myCode = myTree.view.getCellText(myTree.currentIndex, {id: "typesCode"});
				var result = [];
				for (let i = 0; i < wdw_cardbookConfiguration.allTypes[type].length; i++) {
					if (myCode !== wdw_cardbookConfiguration.allTypes[type][i][0]) {
						result.push(wdw_cardbookConfiguration.allTypes[type][i]);
					}
				}
				wdw_cardbookConfiguration.allTypes[type] = JSON.parse(JSON.stringify(result));
				wdw_cardbookConfiguration.sortTrees(null, "typesTree");
			}
		},
		
		validateTypes: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delTypes();
			for (var i in wdw_cardbookConfiguration.allTypes) {
				for (var j = 0; j < wdw_cardbookConfiguration.allTypes[i].length; j++) {
					cardbookPrefService.setTypes(i, j, wdw_cardbookConfiguration.allTypes[i][j][0] + ":" + wdw_cardbookConfiguration.allTypes[i][j][1]);
				}
			}
		},

		selectIMPPsCategory: function () {
			wdw_cardbookConfiguration.selectIMPPs();
			wdw_cardbookConfiguration.sortTrees(null, 'IMPPsTree');
		},
		
		selectIMPPs: function() {
			var myTree = document.getElementById("IMPPsTree");
			var type = document.getElementById('imppsCategoryRadiogroup').selectedItem.value;
			var btnAdd = document.getElementById("addIMPPLabel");
			btnAdd.disabled = false;
			if (type == "tel" && wdw_cardbookConfiguration.allIMPPs['tel'].length == 1) {
				btnAdd.disabled = true;
			}
			var btnEdit = document.getElementById("renameIMPPLabel");
			if (myTree.view.selection.getRangeCount() > 0) {
				btnEdit.disabled = false;
			} else {
				btnEdit.disabled = true;
			}
			document.getElementById("deleteIMPPLabel").disabled = btnEdit.disabled;
		},

		loadIMPPs: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			wdw_cardbookConfiguration.allIMPPs['impp'] = [];
			wdw_cardbookConfiguration.allIMPPs['impp'] = cardbookPrefService.getAllIMPPs();
			wdw_cardbookConfiguration.allIMPPs['tel'] = [];
			wdw_cardbookConfiguration.allIMPPs['tel'] = cardbookPrefService.getAllTels();
		},
		
		displayIMPPs: function () {
			var IMPPsTreeView = {
				typeField: document.getElementById('imppsCategoryRadiogroup').selectedItem.value,
				get rowCount() { 
					if (wdw_cardbookConfiguration.allIMPPs[this.typeField]) {
						return wdw_cardbookConfiguration.allIMPPs[this.typeField].length;
					} else {
						return 0;
					}
				},
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "IMPPCode") return wdw_cardbookConfiguration.allIMPPs[this.typeField][idx][0];
					else if (column.id == "IMPPLabel") return wdw_cardbookConfiguration.allIMPPs[this.typeField][idx][1];
					else if (column.id == "IMPPProtocol") return wdw_cardbookConfiguration.allIMPPs[this.typeField][idx][2];
				}
			}
			document.getElementById('IMPPsTree').view = IMPPsTreeView;
			wdw_cardbookConfiguration.selectIMPPs();
		},

		addIMPP: function () {
			var type = document.getElementById('imppsCategoryRadiogroup').selectedItem.value;
			var myArgs = {code: "", label: "", protocol: "", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookAddIMPP.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE") {
				wdw_cardbookConfiguration.allIMPPs[type].push([myArgs.code, myArgs.label, myArgs.protocol]);
				wdw_cardbookConfiguration.allIMPPs[type] = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allIMPPs[type],1,1);
				wdw_cardbookConfiguration.sortTrees(null, "IMPPsTree");
			}
		},
		
		renameIMPP: function () {
			var type = document.getElementById('imppsCategoryRadiogroup').selectedItem.value;
			var myTree = document.getElementById('IMPPsTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myCode = myTree.view.getCellText(myTree.currentIndex, {id: "IMPPCode"});
				var myLabel = myTree.view.getCellText(myTree.currentIndex, {id: "IMPPLabel"});
				var myProtocol = myTree.view.getCellText(myTree.currentIndex, {id: "IMPPProtocol"});
				var myArgs = {code: myCode, label: myLabel, protocol: myProtocol, typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookAddIMPP.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE") {
					var result = [];
					for (let i = 0; i < wdw_cardbookConfiguration.allIMPPs[type].length; i++) {
						if (myCode === wdw_cardbookConfiguration.allIMPPs[type][i][0]) {
							result.push([myArgs.code, myArgs.label, myArgs.protocol]);
						} else {
							result.push(wdw_cardbookConfiguration.allIMPPs[type][i]);
						}
					}
					wdw_cardbookConfiguration.allIMPPs[type] = JSON.parse(JSON.stringify(result));
					wdw_cardbookConfiguration.allIMPPs[type] = cardbookUtils.sortArrayByString(wdw_cardbookConfiguration.allIMPPs[type],1,1);
					wdw_cardbookConfiguration.sortTrees(null, "IMPPsTree");
				}
			}
		},
		
		deleteIMPP: function () {
			var type = document.getElementById('imppsCategoryRadiogroup').selectedItem.value;
			var myTree = document.getElementById('IMPPsTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myCode = myTree.view.getCellText(myTree.currentIndex, {id: "IMPPCode"});
				var result = [];
				for (let i = 0; i < wdw_cardbookConfiguration.allIMPPs[type].length; i++) {
					if (myCode !== wdw_cardbookConfiguration.allIMPPs[type][i][0]) {
						result.push(wdw_cardbookConfiguration.allIMPPs[type][i]);
					}
				}
				wdw_cardbookConfiguration.allIMPPs[type] = JSON.parse(JSON.stringify(result));
				wdw_cardbookConfiguration.sortTrees(null, "IMPPsTree");
			}
		},
		
		validateIMPPs: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delIMPPs();
			for (var i in wdw_cardbookConfiguration.allIMPPs['impp']) {
				cardbookPrefService.setIMPPs(i, wdw_cardbookConfiguration.allIMPPs['impp'][i][0] + ":" + wdw_cardbookConfiguration.allIMPPs['impp'][i][1] + ":" + wdw_cardbookConfiguration.allIMPPs['impp'][i][2]);
			}
			cardbookPrefService.delTels();
			for (var i in wdw_cardbookConfiguration.allIMPPs['tel']) {
				cardbookPrefService.setTels(i, wdw_cardbookConfiguration.allIMPPs['tel'][i][0] + ":" + wdw_cardbookConfiguration.allIMPPs['tel'][i][1] + ":" + wdw_cardbookConfiguration.allIMPPs['tel'][i][2]);
			}
		},

		loadPeriodicSync: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var autoSync = prefs.getBoolPref("extensions.cardbook.autoSync");
			if (!(autoSync)) {
				document.getElementById('autoSyncInterval').disabled = true;
				document.getElementById('autoSyncIntervalTextBox').disabled = true;
			}
		},

		validateCustomFieldName: function (aValue) {
			var strBundle = document.getElementById("cardbook-strings");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var customFieldsErrorTitle = strBundle.getString("customFieldsError");
			if (aValue.toUpperCase() !== aValue) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorUPPERCASE", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (!(aValue.toUpperCase().startsWith("X-"))) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorX", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (aValue.toUpperCase() === "X-THUNDERBIRD-ETAG") {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorETAG", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (aValue.indexOf(":") >= 1 || aValue.indexOf(",") >= 1 || aValue.indexOf(";") >= 1 || aValue.indexOf(".") >= 1) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorCHAR", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			}
			return true;
		},
		
		validateUniqueCustomFieldName: function (aList) {
			if (cardbookUtils.cleanArray(aList).length !== cardbookUtils.cleanArray(cardbookRepository.arrayUnique(aList)).length) {
				var strBundle = document.getElementById("cardbook-strings");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var customFieldsErrorTitle = strBundle.getString("customFieldsError");
				var customFieldsErrorMsg = strBundle.getString("customFieldsErrorUNIQUE");
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			}
			return true;
		},
		
		validateCustoms: function () {
			var allcustomFieldNames = [];
			for (var i in cardbookRepository.customFields) {
				var name = document.getElementById(cardbookRepository.customFields[i] + 'Name');
				var nameValue = name.value;
				var label = document.getElementById(cardbookRepository.customFields[i] + 'Label');
				var labelValue = label.value;
				allcustomFieldNames.push(nameValue);
				if (nameValue != null && nameValue !== undefined && nameValue != "") {
					if (wdw_cardbookConfiguration.validateCustomFieldName(nameValue)) {
						if (!(labelValue != null && labelValue !== undefined && labelValue != "")) {
							var strBundle = document.getElementById("cardbook-strings");
							var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
							var customFieldsErrorTitle = strBundle.getString("customFieldsError");
							var customFieldsErrorMsg = strBundle.getString("customFieldsErrorLABEL");
							prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
							return false;
						}
					} else {
						return false;
					}
				}
			}
			var customLists = ['kindCustom', 'memberCustom'];
			for (var i in customLists) {
				var nameValue = document.getElementById(customLists[i] + 'TextBox').value;
				allcustomFieldNames.push(nameValue);
				if (!(wdw_cardbookConfiguration.validateCustomFieldName(nameValue))) {
					return false;
				}
			}
			if (!(wdw_cardbookConfiguration.validateUniqueCustomFieldName(allcustomFieldNames))) {
				return false;
			}
			wdw_cardbookConfiguration.setCustoms();
			return true;
		},
		
		setCustoms: function () {
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delCustoms();
			for (var i in cardbookRepository.customFields) {
				var name = document.getElementById(cardbookRepository.customFields[i] + 'Name');
				var nameValue = name.value;
				var label = document.getElementById(cardbookRepository.customFields[i] + 'Label');
				var labelValue = label.value;
				if (nameValue != null && nameValue !== undefined && nameValue != "") {
					cardbookPrefService.setCustoms(cardbookRepository.customFields[i], nameValue + ":" + labelValue);
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = labelValue;
				} else {
					cardbookPrefService.setCustoms(cardbookRepository.customFields[i], "");
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = "";
				}
				cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = nameValue;
			}
		},
		
		validateStatusInformationLineNumber: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			if (document.getElementById('statusInformationLineNumberTextBox').value < 10) {
				document.getElementById('statusInformationLineNumberTextBox').value = 10;
			}
			while (cardbookRepository.statusInformation.length > document.getElementById('statusInformationLineNumberTextBox').value) {
				cardbookRepository.statusInformation.splice(0,1);
			}
		},

		showautoSyncInterval: function () {
			if (document.getElementById('autoSyncCheckBox').checked) {
				document.getElementById('autoSyncInterval').disabled = false;
				document.getElementById('autoSyncIntervalTextBox').disabled = false;
			} else {
				document.getElementById('autoSyncInterval').disabled = true;
				document.getElementById('autoSyncIntervalTextBox').disabled = true;
			}
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_cardbookConfiguration.addAcceptButton();
			wdw_cardbookConfiguration.loadTypes();
			wdw_cardbookConfiguration.sortTrees(null, "typesTree");
			wdw_cardbookConfiguration.loadIMPPs();
			wdw_cardbookConfiguration.sortTrees(null, "IMPPsTree");
			wdw_cardbookConfiguration.loadPref();
			wdw_cardbookConfiguration.loadOrg();
			wdw_cardbookConfiguration.displayOrg();
			wdw_cardbookConfiguration.loadPeriodicSync();
			wdw_cardbookConfiguration.loadCustoms();
			wdw_cardbookConfiguration.loadAddressBooks("emailsCollection", true);
			wdw_cardbookConfiguration.loadAddressBooks("addressBooksNameList", false);
			wdw_cardbookConfiguration.loadDateFormats();
			wdw_cardbookConfiguration.loadMailAccounts();
			wdw_cardbookConfiguration.sortTrees(null, "mailAccountsTree");
			wdw_cardbookConfiguration.loadRestrictions();
			wdw_cardbookConfiguration.sortTrees(null, "accountsRestrictionsTree");
			wdw_cardbookConfiguration.loadPrefEmailPref();
			// loadFnFormula() depends on loadOrg()
			wdw_cardbookConfiguration.loadFnFormula();
			Components.utils.import("resource://gre/modules/AddonManager.jsm");  
			AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, wdw_cardbookConfiguration.loadCalendars);
			wdw_cardbookConfiguration.remindViaPopup();
			wdw_cardbookConfiguration.loadEventEntryTitle();
			wdw_cardbookConfiguration.showTab();
		},
		
		accept: function () {
			wdw_cardbookConfiguration.validateStatusInformationLineNumber();
			wdw_cardbookConfiguration.validateTypes();
			wdw_cardbookConfiguration.validateIMPPs();
			wdw_cardbookConfiguration.validateOrg();
			wdw_cardbookConfiguration.validateMailAccounts();
			wdw_cardbookConfiguration.validateRestrictions();
			wdw_cardbookConfiguration.validatePrefEmailPref();
			wdw_cardbookConfiguration.validateEventEntryTitle();
			wdw_cardbookConfiguration.validateFnFormula();
			if (!(wdw_cardbookConfiguration.validateCustoms())) {
				// don't work
				// return false;
				throw "CardBook validation error";
			}
		},
		

		cancel: function () {
			close();
		}
	};
};