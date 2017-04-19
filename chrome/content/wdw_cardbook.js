if ("undefined" == typeof(wdw_cardbook)) {
	var wdw_cardbook = {

		currentType : "",
		currentIndex : "",
		currentCardOfListId : "",
		cutAndPaste : [],

		cardbookrefresh : false,

		sortAccounts: function() {
			var myTree = document.getElementById('accountsOrCatsTree');

			// collect open container
			var listOfOpenedContainer = [];			
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][2]) {
					listOfOpenedContainer.push(cardbookRepository.cardbookAccounts[i][4]);
				}
			}

			// close opened container
			for (var i = 0; i < listOfOpenedContainer.length; i++) {
				var treeIndex = cardbookUtils.getPositionOfAccountId(listOfOpenedContainer[i]);
				if (treeIndex != -1)  {
					myTree.view.toggleOpenState(treeIndex);
				}
			}
			
			// sort accounts
			cardbookRepository.cardbookAccounts = cardbookUtils.sortArrayByString(cardbookRepository.cardbookAccounts,0,1);
			// open opened containers
			for (var i = 0; i < listOfOpenedContainer.length; i++) {
				var treeIndex = cardbookUtils.getPositionOfAccountId(listOfOpenedContainer[i]);
				if (treeIndex != -1)  {
					myTree.view.toggleOpenState(treeIndex);
				}
			}
		},

   	firstOpen: function () {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var firstOpen = prefs.getBoolPref("extensions.cardbook.firstOpen");
		if (firstOpen && cardbookRepository.cardbookAccounts.length == 0) {
			wdw_cardbook.addAddressbook("first");
			prefs.setBoolPref("extensions.cardbook.firstOpen", false);
			prefs.setBoolPref("extensions.cardbook.listTabView", false);
			prefs.setBoolPref("extensions.cardbook.mailPopularityTabView", false);
			prefs.setBoolPref("extensions.cardbook.technicalTabView", false);
			prefs.setBoolPref("extensions.cardbook.vcardTabView", false);
		}
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var firstOpenModern = prefs.getBoolPref("extensions.cardbook.firstOpenModern");
		var panesView = prefs.getComplexValue("extensions.cardbook.panesView", Components.interfaces.nsISupportsString).data;
		if (firstOpenModern && panesView == "modern") {
			document.getElementById('dispadr').setAttribute('hidden', 'true');
			document.getElementById('disptel').setAttribute('hidden', 'true');
			document.getElementById('dispemail').setAttribute('hidden', 'true');
			prefs.setBoolPref("extensions.cardbook.firstOpenModern", false);
		}
		wdw_cardbook.showCorrectTabs();
		wdw_cardbook.setElementLabelWithBundle('cardbookToolbarEditButton', "cardbookToolbarEditButtonLabel");
		wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuEditCard', "cardbookToolbarEditButtonLabel");
		wdw_cardbook.setElementLabelWithBundle('editCardFromCards', "cardbookToolbarEditButtonLabel");
		wdw_cardbook.setElementLabelWithBundle('cardbookToolbarRemoveButton', "cardbookToolbarRemoveButtonLabel");
		wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuRemoveCard', "cardbookToolbarRemoveButtonLabel");
		wdw_cardbook.setElementLabelWithBundle('removeCardFromCards', "cardbookToolbarRemoveButtonLabel");
	},

   	setToolbarCustom: function () {
		var toolbox = document.getElementById("cardbook-toolbox");
		toolbox.customizeDone = function(aEvent) {
			MailToolboxCustomizeDone(aEvent, "CustomizeCardBookToolbar");
		};
		toolbox.setAttribute('toolbarHighlight','true');
	},

   	showCorrectTabs: function () {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		document.getElementById('listTab').setAttribute("collapsed", !prefs.getBoolPref("extensions.cardbook.listTabView"));
		document.getElementById('mailPopularityTab').setAttribute("collapsed", !prefs.getBoolPref("extensions.cardbook.mailPopularityTabView"));
		document.getElementById('technicalTab').setAttribute("collapsed", !prefs.getBoolPref("extensions.cardbook.technicalTabView"));
		document.getElementById('vcardTab').setAttribute("collapsed", !prefs.getBoolPref("extensions.cardbook.vcardTabView"));
		document.getElementById('cardbookTabbox').selectedTab = document.getElementById("generalTab");
	},

   	loadFirstWindow: function () {
		Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
		wdw_cardbook.setSyncControl();
		wdw_cardbook.setToolbarCustom();
		wdw_cardbook.setNoSearchMode();
		wdw_cardbook.setNoComplexSearchMode();
		wdw_cardbook.clearCard();
		wdw_cardbook.clearAccountOrCat();
		wdw_cardbook.firstOpen();
		// in case of opening a new window without having a reload
		wdw_cardbook.loadCssRules();
		wdw_cardbook.refreshWindow("accountid:0");
	},

		syncAccounts: function () {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var cardbookPrefService = new cardbookPreferenceService();
				var result = [];
				result = cardbookPrefService.getAllPrefIds();
				for (let i = 0; i < result.length; i++) {
					var myPrefId = result[i];
					var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
					var myPrefName = cardbookPrefService1.getName();
					var myPrefType = cardbookPrefService1.getType();
					if (myPrefType !== "FILE" && myPrefType !== "CACHE" && myPrefType !== "DIRECTORY" && myPrefType !== "SEARCH" && myPrefType !== "LOCALDB") {
						cardbookSynchronization.initSync(myPrefId);
						cardbookSynchronization.syncAccount(myPrefId);
					}
				}
			}
		},

		syncAccountFromAccountsOrCats: function () {
			try {
				if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
					var myTree = document.getElementById('accountsOrCatsTree');
					var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					var myPrefName = cardbookUtils.getPrefNameFromPrefId(myPrefId);
					
					cardbookSynchronization.initSync(myPrefId);
					cardbookSynchronization.syncAccount(myPrefId);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.syncAccountFromAccountsOrCats error : " + e, "Error");
			}
		},

		displayAccountOrCat: function (aCardList) {
			var accountsOrCatsTreeView = {
				get rowCount() { return aCardList.length; },
				isContainer: function(row) { return false },
				cycleHeader: function(row) { return false },
				getRowProperties: function(row) {
					if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
						return "SEARCH color_" + aCardList[row].dirPrefId;
					} else {
						return "NOSEARCH";
					}
				}, 
				getCellText: function(row,column){
					if (column.id == "lastname") return aCardList[row].lastname;
					else if (column.id == "firstname") return aCardList[row].firstname;
					else if (column.id == "othername") return aCardList[row].othername;
					else if (column.id == "prefixname") return aCardList[row].prefixname;
					else if (column.id == "suffixname") return aCardList[row].suffixname;
					else if (column.id == "fn") return aCardList[row].fn;
					else if (column.id == "nickname") return aCardList[row].nickname;
					else if (column.id == "gender") return aCardList[row].gender;
					else if (column.id == "bday") return aCardList[row].bday;
					else if (column.id == "dispadr") return aCardList[row].dispadr;
					else if (column.id == "disphomeadr") return aCardList[row].disphomeadr;
					else if (column.id == "dispworkadr") return aCardList[row].dispworkadr;
					else if (column.id == "disptel") return aCardList[row].disptel;
					else if (column.id == "disphometel") return aCardList[row].disphometel;
					else if (column.id == "dispworktel") return aCardList[row].dispworktel;
					else if (column.id == "dispcelltel") return aCardList[row].dispcelltel;
					else if (column.id == "dispemail") return aCardList[row].dispemail;
					else if (column.id == "disphomeemail") return aCardList[row].disphomeemail;
					else if (column.id == "dispworkemail") return aCardList[row].dispworkemail;
					else if (column.id == "mailer") return aCardList[row].mailer;
					else if (column.id == "tz") return aCardList[row].tz;
					else if (column.id == "geo") return aCardList[row].geo;
					else if (column.id == "title") return aCardList[row].title;
					else if (column.id == "role") return aCardList[row].role;
					else if (column.id == "org") return aCardList[row].org;
					else if (column.id == "dispcategories") return aCardList[row].dispcategories;
					else if (column.id == "note") return aCardList[row].note;
					else if (column.id == "prodid") return aCardList[row].prodid;
					else if (column.id == "sortstring") return aCardList[row].sortstring;
					else if (column.id == "uid") return aCardList[row].uid;
					else if (column.id == "dispurl") return aCardList[row].dispurl;
					else if (column.id == "version") return aCardList[row].version;
					else if (column.id == "class1") return aCardList[row].class1;
					else if (column.id == "dispimpp") return aCardList[row].dispimpp;
					else if (column.id == "dirPrefId") return aCardList[row].dirPrefId;
					else if (column.id == "kind") return aCardList[row].kind;
					else if (column.id == "rev") return aCardList[row].rev;
					else if (column.id == "cardurl") return aCardList[row].cardurl;
					else if (column.id == "etag") return aCardList[row].etag;
					else return "false";
				}
			}
			document.getElementById('cardsTree').view = accountsOrCatsTreeView;
		},

		clearCard: function () {
			cardbookUtils.clearCard();
			document.getElementById('categoriesTextBox').value = "";
			cardbookElementTools.deleteRows('addedCardsBox');
			cardbookUtils.adjustFields();
		},
		
		displayCard: function (aCard) {
			wdw_cardbook.clearCard();
			cardbookUtils.displayCard(aCard, true);
			document.getElementById('vcardTextBox').value = cardbookUtils.cardToVcardData(aCard, false);
			document.getElementById('vcardTextBox').setAttribute('readonly', 'true');
			cardbookUtils.adjustFields();
		},
		
		selectAccountOrCatInNoSearch: function () {
			wdw_cardbook.setNoSearchMode();
			var myTree = document.getElementById('accountsOrCatsTree');
			var mySelectedIndex = myTree.currentIndex;
			if (mySelectedIndex !== -1) {
				var myAccountId = myTree.view.getCellText(mySelectedIndex, {id: "accountId"});
			} else {
				var myAccountId = myTree.view.getCellText(0, {id: "accountId"});
			}
			wdw_cardbook.clearCard();
			wdw_cardbook.refreshWindow("accountid:" + myAccountId);
			if (cardbookRepository.cardbookDisplayCards[myAccountId]) {
				if (cardbookRepository.cardbookDisplayCards[myAccountId].length == 1) {
					var myTree = document.getElementById('cardsTree');
					cardbookUtils.setSelectedCards([cardbookRepository.cardbookDisplayCards[myAccountId][0].uid], myTree.boxObject.getFirstVisibleRow(), myTree.boxObject.getLastVisibleRow());
					wdw_cardbook.displayCard(cardbookRepository.cardbookDisplayCards[myAccountId][0]);
				}
			}
		},

		selectAccountOrCat: function (aAccountOrCat, aListOfCards) {
			if (cardbookRepository.cardbookSearchMode === "SEARCH") {
				wdw_cardbook.startSearch(aListOfCards);
				return;
			}
			var myCurrentDirPrefId = cardbookUtils.getAccountId(aAccountOrCat);
			var cardbookPrefService = new cardbookPreferenceService(myCurrentDirPrefId);
			var myTree = document.getElementById('accountsOrCatsTree');
			var myPosition = cardbookUtils.getPositionOfAccountId(aAccountOrCat);
			if (myPosition == -1) {
				myPosition = cardbookUtils.getPositionOfAccountId(myCurrentDirPrefId);
				if (myPosition == -1) {
					myPosition = 0;
				}
			}
			myTree.view.selection.select(myPosition);
			if (cardbookPrefService.getType() === "SEARCH") {
				cardbookComplexSearch.startComplexSearch(myCurrentDirPrefId, aListOfCards);
			} else {
				wdw_cardbook.setNoComplexSearchMode();
			}
		},

		displaySearch: function (aListOfCards) {
			var myTree = document.getElementById('cardsTree');
			var mySelectedAccount = cardbookRepository.cardbookSearchValue;
			if (cardbookRepository.cardbookDisplayCards[mySelectedAccount]) {
				wdw_cardbook.sortCardsTreeCol();
				if (cardbookRepository.cardbookDisplayCards[mySelectedAccount].length == 1) {
					wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].uid]);
					if (myTree.currentIndex != 0) {
						myTree.view.selection.select(0);
					}
				} else {
					if (aListOfCards) {
						var myListOfUids = []
						for (var i = 0; i < aListOfCards.length; i++) {
							var mySepPosition = aListOfCards[i].indexOf("::",0);
							myListOfUids.push(aListOfCards[i].substr(mySepPosition+2,aListOfCards[i].length));
						}
						cardbookUtils.setSelectedCards(myListOfUids, myTree.boxObject.getFirstVisibleRow(), myTree.boxObject.getLastVisibleRow());
						if (aListOfCards.length == 1) {
							if (cardbookRepository.cardbookCards[aListOfCards[0]]) {
								wdw_cardbook.displayCard(cardbookRepository.cardbookCards[aListOfCards[0]]);
							}
						}
					}
				}
			}
		},

		selectCard: function (aEvent) {
			var myTree = document.getElementById('cardsTree');
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			var numberOfSelectedCard = 0;
			var positionOfSelectedCard = 0;
			for (let i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
			    for (let k = start.value; k <= end.value; k++) {
					numberOfSelectedCard++;
					positionOfSelectedCard = k;
				}
			}
			if ( numberOfSelectedCard != 1 ) {
				wdw_cardbook.clearCard();
			} else {
				var mySelectedCard = myTree.view.getCellText(positionOfSelectedCard, myTree.columns.getNamedColumn("dirPrefId"))+"::"+myTree.view.getCellText(positionOfSelectedCard, myTree.columns.getNamedColumn("uid"));
				if (cardbookRepository.cardbookCards[mySelectedCard]) {
					wdw_cardbook.displayCard(cardbookRepository.cardbookCards[mySelectedCard]);
				} else {
					wdw_cardbook.clearCard();
				}
			}
			if (aEvent) {
				aEvent.stopPropagation();
			}
		},

		clearAccountOrCat: function () {
			wdw_cardbook.displayAccountOrCat([]);
			var myTree = document.getElementById('accountsOrCatsTree');
			myTree.view.selection.clearSelection();
			wdw_cardbook.updateStatusInformation();
		},

		refreshAccountsInDirTree: function() {
			try {
				if (document.getElementById('accountsOrCatsTree')) {
					var myTree = document.getElementById('accountsOrCatsTree');
					cardbookDirTree.childData = cardbookRepository.cardbookAccountsCategories;
					cardbookDirTree.visibleData = cardbookRepository.cardbookAccounts;
					myTree.view = cardbookDirTree;
					if (cardbookRepository.cardbookAccounts.length != 0) {
						wdw_cardbook.sortAccounts();
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.refreshAccountsInDirTree error : " + e, "Error");
			}
		},

		cancelCard: function () {
			wdw_cardbook.selectCard();
		},

		createCard: function () {
			wdw_cardbook.setNoComplexSearchMode();
			wdw_cardbook.setNoSearchMode();
			var myTree = document.getElementById('cardsTree');
			myTree.view.selection.clearSelection();
			wdw_cardbook.clearCard();
			var myNewCard = new cardbookCardParser();
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myCurrentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				myNewCard.dirPrefId = cardbookUtils.getAccountId(myCurrentAccountId);
				var mySepPosition = myCurrentAccountId.indexOf("::",0);
				if (mySepPosition != -1) {
					var myCategory = myCurrentAccountId.substr(mySepPosition+2, myCurrentAccountId.length);
					cardbookRepository.addCategoryToCard(myNewCard, myCategory);
				}
			}
			cardbookUtils.openEditionWindow(myNewCard, "CreateCard", "cardbook.cardAddedDirect");
		},

		editCard: function () {
			var listOfSelectedCard = cardbookUtils.getCardsFromCards();
			if (listOfSelectedCard.length == 1) {
				var myCard = cardbookUtils.getCardsFromCards()[0];
				var myOutCard = new cardbookCardParser();
				cardbookUtils.cloneCard(myCard, myOutCard);
				var cardbookPrefService = new cardbookPreferenceService(myCard.dirPrefId);
				if (cardbookPrefService.getReadOnly()) {
					cardbookUtils.openEditionWindow(myOutCard, "ViewCard");
				} else {
					cardbookUtils.openEditionWindow(myOutCard, "EditCard", "cardbook.cardModifiedDirect");
				}
			}
		},

		editCardFromCard: function (aCard) {
			if (aCard) {
				var myOutCard = new cardbookCardParser();
				cardbookUtils.cloneCard(aCard, myOutCard);
				var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
				if (cardbookPrefService.getReadOnly()) {
					cardbookUtils.openEditionWindow(myOutCard, "ViewCard");
				} else {
					cardbookUtils.openEditionWindow(myOutCard, "EditCard", "cardbook.cardModifiedDirect");
				}
			}
		},

		editCardFromList: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			var myCardToDisplay = cardbookRepository.cardbookCards[wdw_cardbook.currentCardOfListId];
			wdw_cardbook.editCardFromCard(myCardToDisplay)
			cardbookTypes.loadStaticList(myCard);
		},

		mergeCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();

				var myArgs = {cardsIn: listOfSelectedCard, cardsOut: [], hideCreate: false, action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "CREATE") {
					var myNullCard = new cardbookCardParser();
					cardbookRepository.saveCard(myNullCard, myArgs.cardsOut[0], "cardbook.cardAddedDirect");
					cardbookRepository.reWriteFiles([myArgs.cardsOut[0].dirPrefId]);
				} else if (myArgs.action == "CREATEANDREPLACE") {
					var myNullCard = new cardbookCardParser();
					cardbookRepository.deleteCards(myArgs.cardsIn);
					cardbookRepository.saveCard(myNullCard, myArgs.cardsOut[0], "cardbook.cardAddedDirect");
					cardbookRepository.reWriteFiles([myArgs.cardsOut[0].dirPrefId]);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.mergeCards error : " + e, "Error");
			}
		},

		duplicateCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				var listOfFileToRewrite = [];

				cardbookRepository.importConflictChoice = "duplicate";
				cardbookRepository.importConflictChoicePersist = true;
				var dataLength = listOfSelectedCard.length;
				for (var i = 0; i < dataLength; i++) {
					if (i == dataLength - 1) {
						cardbookSynchronization.importCard(listOfSelectedCard[i], listOfSelectedCard[i].dirPrefId, false, "cardbook.cardAddedDirect");
					} else {
						cardbookSynchronization.importCard(listOfSelectedCard[i], listOfSelectedCard[i].dirPrefId, false);
					}
				}
				cardbookRepository.reWriteFiles(listOfFileToRewrite);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.duplicateCards error : " + e, "Error");
			}
		},

		findDuplicatesFromAccountsOrCats: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var myDirPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					wdw_cardbook.findDuplicates(myDirPrefId);
				} else {
					return;
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.findDuplicatesFromAccountsOrCats error : " + e, "Error");
			}
		},

		findDuplicates: function (aDirPrefId) {
			try {
				var myArgs = {dirPrefId: aDirPrefId};
				var myWindow = window.openDialog("chrome://cardbook/content/findDuplicates/wdw_findDuplicates.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.findDuplicates error : " + e, "Error");
			}
		},

		deleteCardsAndValidate: function (aSource, aCardList, aMessage) {
			try {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				var confirmTitle = strBundle.GetStringFromName("confirmTitle");
				if (aCardList && aCardList.constructor === Array) {
					var listOfSelectedCard = aCardList;
				} else {
					var listOfSelectedCard = cardbookUtils.getCardsFromCards();
				}
				var cardsCount = listOfSelectedCard.length;
				if (aMessage != null && aMessage !== undefined && aMessage != "") {
					var confirmMsg = aMessage;
				} else {
					if (cardsCount > 1) {
						var confirmMsg = strBundle.formatStringFromName("selectedCardsDeletionConfirmMessage", [cardsCount], 1);
					} else {
						var confirmMsg = strBundle.GetStringFromName("selectedCardDeletionConfirmMessage");
					}
				}
				if (prompts.confirm(window, confirmTitle, confirmMsg)) {
					cardbookRepository.deleteCards(listOfSelectedCard, aSource);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.deleteCardsAndValidate error : " + e, "Error");
			}
		},

		exportCardsFromAccountsOrCats: function (aMenu) {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
				if (aMenu.id == "cardbookAccountMenuExportToFile" || aMenu.id == "exportCardsToFileFromAccountsOrCats") {
					if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
						var defaultFileName = cardbookRepository.cardbookSearchValue + ".vcf";
					} else {
						var myTree = document.getElementById('accountsOrCatsTree');
						var defaultFileName = myTree.view.getCellText(myTree.currentIndex, {id: "accountName"}) + ".vcf";
					}
					wdw_cardbook.exportCardsToFile(listOfSelectedCard, defaultFileName);
				} else if (aMenu.id == "cardbookAccountMenuExportToDir" || aMenu.id == "exportCardsToDirFromAccountsOrCats") {
					wdw_cardbook.exportCardsToDir(listOfSelectedCard);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsFromAccountsOrCats error : " + e, "Error");
			}
		},

		exportCardsFromCards: function (aMenu) {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				if (aMenu.id == "exportCardsToFileFromCards" || aMenu.id == "cardbookContactsMenuExportCardsToFile") {
					if (listOfSelectedCard.length == 1) {
						var myTree = document.getElementById('cardsTree');
						var defaultFileName = myTree.view.getCellText(myTree.currentIndex, {id: "fn"}) + ".vcf";
					} else {
						var defaultFileName = "export.vcf";
					}
					wdw_cardbook.exportCardsToFile(listOfSelectedCard, defaultFileName);
				} else if (aMenu.id == "exportCardsToDirFromCards" || aMenu.id == "cardbookContactsMenuExportCardsToDir") {
					wdw_cardbook.exportCardsToDir(listOfSelectedCard);
				}
					
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsFromCards error : " + e, "Error");
			}
		},

		exportCardsToFile: function (aListOfSelectedCard, aDefaultFileName) {
			try {
				var myFile = cardbookUtils.callFilePicker("fileSaveTitle", "SAVE", "EXPORTFILE", aDefaultFileName);
				if (myFile != null && myFile !== undefined && myFile != "") {
					if (myFile.exists() == false){
						myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					}
	
					if (cardbookUtils.isFileAlreadyOpen(myFile.path)) {
						cardbookUtils.formatStringForOutput("fileAlreadyOpen", [myFile.leafName]);
						return;
					}

					if (cardbookUtils.getExtension(myFile.path).toLowerCase() == "csv") {
						cardbookSynchronization.writeCardsToCSVFile(myFile.path, myFile.leafName, aListOfSelectedCard);
					} else {
						cardbookSynchronization.writeCardsToFile(myFile.path, aListOfSelectedCard, true);
						if (aListOfSelectedCard.length > 1) {
							cardbookUtils.formatStringForOutput("exportsOKIntoFile", [myFile.leafName]);
						} else {
							cardbookUtils.formatStringForOutput("exportOKIntoFile", [myFile.leafName]);
						}
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsToFile error : " + e, "Error");
			}
		},

		exportCardsToDir: function (aListOfSelectedCard) {
			try {
				var myDir = cardbookUtils.callDirPicker("dirSaveTitle");
				if (myDir != null && myDir !== undefined && myDir != "") {
					if (myDir.exists() == false){
						myDir.create( Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774 );
					}
	
					if (cardbookUtils.isDirectoryAlreadyOpen(myDir.path)) {
						cardbookUtils.formatStringForOutput("directoryAlreadyOpen", [myDir.leafName]);
						return;
					}
	
					cardbookSynchronization.writeCardsToDir(myDir.path, aListOfSelectedCard, true);

					if (aListOfSelectedCard.length > 1) {
						cardbookUtils.formatStringForOutput("exportsOKIntoDir", [myDir.leafName]);
					} else {
						cardbookUtils.formatStringForOutput("exportOKIntoDir", [myDir.leafName]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsToDir error : " + e, "Error");
			}
		},

		importCardsFromFile: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				var myDirPrefId = cardbookUtils.getAccountId(myTarget);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myDirPrefIdUrl = cardbookPrefService.getUrl();
				var myDirPrefIdName = cardbookPrefService.getName();

				var myFile = cardbookUtils.callFilePicker("fileImportTitle", "OPEN", "EXPORTFILE");
				if (myFile != null && myFile !== undefined && myFile != "") {
					// search if file is already open
					if (myFile.path == myDirPrefIdUrl) {
						cardbookUtils.formatStringForOutput("importNotIntoSameFile");
						return;
					}
					cardbookSynchronization.initSync(myDirPrefId);
					cardbookRepository.cardbookFileRequest[myDirPrefId]++;
					if (cardbookUtils.getExtension(myFile.path).toLowerCase() == "csv") {
						cardbookSynchronization.loadCSVFile(myFile, myTarget, "WINDOW", "cardbook.cardImportedFromFile");
					} else {
						cardbookSynchronization.loadFile(myFile, myTarget, "", "WINDOW", "cardbook.cardImportedFromFile");
					}
					cardbookSynchronization.waitForImportFinished(myDirPrefId, myDirPrefIdName);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCardsFromFile error : " + e, "Error");
			}
		},

		importCardsFromDir: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				var myDirPrefId = cardbookUtils.getAccountId(myTarget);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myDirPrefIdUrl = cardbookPrefService.getUrl();
				var myDirPrefIdName = cardbookPrefService.getName();

				var myDir = cardbookUtils.callDirPicker("dirImportTitle");
				if (myDir != null && myDir !== undefined && myDir != "") {
					// search if dir is already open
					if (myDir.path == myDirPrefIdUrl) {
						cardbookUtils.formatStringForOutput("importNotIntoSameDir");
						return;
					}
					cardbookSynchronization.initSync(myDirPrefId);
					cardbookRepository.cardbookDirRequest[myDirPrefId]++;
					cardbookSynchronization.loadDir(myDir, myTarget, "", "WINDOW", "cardbook.cardImportedFromFile");
					cardbookSynchronization.waitForImportFinished(myDirPrefId, myDirPrefIdName);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCardsFromDir error : " + e, "Error");
			}
		},

		cutCardsFromAccountsOrCats: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
				wdw_cardbook.copyCards(listOfSelectedCard, "CUT");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.cutCardsFromAccountsOrCats error : " + e, "Error");
			}
		},

		copyCardsFromAccountsOrCats: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
				wdw_cardbook.copyCards(listOfSelectedCard, "COPY");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCardsFromAccountsOrCats error : " + e, "Error");
			}
		},

		cutCardsFromCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				wdw_cardbook.copyCards(listOfSelectedCard, "CUT");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.cutCardsFromCards error : " + e, "Error");
			}
		},

		copyCardsFromCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				wdw_cardbook.copyCards(listOfSelectedCard, "COPY");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCardsFromCards error : " + e, "Error");
			}
		},

		copyCards: function (aListOfSelectedCard, aMode) {
			try {
				var listOfSelectedUid = [];
				for (var i = 0; i < aListOfSelectedCard.length; i++) {
					listOfSelectedUid.push(aListOfSelectedCard[i].dirPrefId + "::" + aListOfSelectedCard[i].uid);
				}
				let myText = listOfSelectedUid.join("@@@@@");
				if (myText != null && myText !== undefined && myText != "") {
					var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
					var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
					var cardsCount = listOfSelectedUid.length;
					if (cardsCount > 1) {
						var myMessage = strBundle.GetStringFromName("contactsCopied");
					} else {
						var myMessage = strBundle.GetStringFromName("contactCopied");
					}
					cardbookUtils.clipboardSet(myText, myMessage);
					if (aMode == "CUT") {
						var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
						var strBundle = document.getElementById("cardbook-strings");
						if (cardsCount > 1) {
							wdw_cardbook.cutAndPaste = strBundle.getFormattedString("movedCardsDeletionConfirmMessage", [cardsCount]);
						} else {
							wdw_cardbook.cutAndPaste = strBundle.getString("movedCardDeletionConfirmMessage");
						}
					} else {
						wdw_cardbook.cutAndPaste = "";
					}
				} else {
					wdw_cardbooklog.updateStatusProgressInformation("Nothing selected to be copied");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCards error : " + e, "Error");
			}
		},

		pasteCards: function () {
			try {
				let str = cardbookUtils.clipboardGet();
				if (str) {
					var myTree = document.getElementById('accountsOrCatsTree');
					var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var myDirPrefId = cardbookUtils.getAccountId(myTarget);
					var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
					var myListOfCard = [];
					
					var dataArray = str.split("@@@@@");
					if (dataArray.length) {
						var dataLength = dataArray.length
						for (var i = 0; i < dataLength; i++) {
							if (cardbookRepository.cardbookCards[dataArray[i]]) {
								var myCard = cardbookRepository.cardbookCards[dataArray[i]];
								if (myDirPrefId == myCard.dirPrefId) {
									cardbookRepository.importConflictChoicePersist = true;
									cardbookRepository.importConflictChoice = "duplicate";
									var askUser = false;
								} else {
									cardbookRepository.importConflictChoicePersist = false;
									cardbookRepository.importConflictChoice = "overwrite";
									var askUser = true;
								}
								// performance reason
								// update the UI only at the end
								if (i == dataLength - 1) {
									cardbookSynchronization.importCard(myCard, myTarget, askUser, "cardbook.cardPasted");
								} else {
									cardbookSynchronization.importCard(myCard, myTarget, askUser);
								}
								myListOfCard.push(myCard);
							} else {
								cardbookUtils.formatStringForOutput("clipboardWrong");
							}
						}
						cardbookRepository.reWriteFiles([myDirPrefId]);
						if (wdw_cardbook.cutAndPaste != "") {
							wdw_cardbook.deleteCardsAndValidate("cardbook.cardRemovedDirect", myListOfCard, wdw_cardbook.cutAndPaste);
							wdw_cardbook.cutAndPaste = "";
						}
					} else {
						cardbookUtils.formatStringForOutput("clipboardEmpty");
					}
				} else {
					cardbookUtils.formatStringForOutput("clipboardEmpty");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.pasteCards error : " + e, "Error");
			}
		},

		chooseActionTreeForClick: function (aEvent) {
			wdw_cardbook.setCurrentTypeFromEvent(aEvent);
			// only left click
			if (aEvent.button == 0) {
				var myCursorPosition = wdw_cardbook.currentType + '_' + wdw_cardbook.currentIndex + '_valueBox';
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				if (wdw_cardbook.currentType == "email") {
					wdw_cardbook.emailCardFromTree("to");
				} else if (wdw_cardbook.currentType == "url") {
					wdw_cardbook.openURLFromTree();
				} else if (wdw_cardbook.currentType == "adr") {
					wdw_cardbook.localizeCardFromTree();
				} else if (wdw_cardbook.currentType == "impp") {
					wdw_cardbook.openIMPPFromTree();
				} else if (wdw_cardbook.currentType == "tel") {
					wdw_cardbook.openTelFromTree();
				}
			}
			aEvent.stopPropagation();
		},
		
		chooseActionForKey: function (aEvent) {
			if (aEvent.ctrlKey && !aEvent.shiftKey) {
				switch(aEvent.key) {
					case "a":
					case "A":
						wdw_cardbook.selectAllKey();
						aEvent.stopPropagation();
						break;
					case "c":
					case "C":
						wdw_cardbook.copyKey();
						aEvent.stopPropagation();
						break;
					case "f":
					case "F":
					case "g":
					case "G":
						wdw_cardbook.findKey();
						aEvent.stopPropagation();
						break;
					case "k":
					case "K":
						wdw_cardbook.editComplexSearch();
						aEvent.stopPropagation();
						break;
					case "n":
					case "N":
						wdw_cardbook.newKey();
						aEvent.stopPropagation();
						break;
					// intercepted by CTRL+P from the main window
					// case "p":
					// case "P":
					// 	wdw_cardbook.print();
					// 	aEvent.stopPropagation();
					// 	break;
					case "v":
					case "V":
						wdw_cardbook.pasteKey();
						aEvent.stopPropagation();
						break;
					case "x":
					case "X":
						wdw_cardbook.cutKey();
						aEvent.stopPropagation();
						break;
				}
			} else if (aEvent.ctrlKey && aEvent.shiftKey) {
				switch(aEvent.key) {
					case "k":
					case "K":
						wdw_cardbook.findKey();
						aEvent.stopPropagation();
						break;
				}
			} else {
				if (aEvent.key == "Enter") {
					wdw_cardbook.returnKey();
					aEvent.stopPropagation();
				} else if (aEvent.key == "Delete") {
					wdw_cardbook.deleteKey();
					aEvent.stopPropagation();
				} else if (aEvent.key == "F8") {
					wdw_cardbook.F8Key();
					aEvent.stopPropagation();
				} else if (aEvent.key == "F9") {
					wdw_cardbook.F9Key();
					aEvent.stopPropagation();
				}
			}
		},
		
		emailCardFromTree: function (aAction) {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			wdw_cardbook.emailCards(null, [document.getElementById('fnTextBox').value.replace(/,/g, " ").replace(/;/g, " "), myCard.email[wdw_cardbook.currentIndex][0][0]], aAction);
		},
		
		findEmailsFromTree: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			ovl_cardbookMailContacts.findEmails(null, [myCard.email[wdw_cardbook.currentIndex][0]]);
		},
		
		findEventsFromTree: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			var myEmail = myCard.email[wdw_cardbook.currentIndex][0]
			ovl_cardbookMailContacts.findEvents(null, [myEmail], myEmail, "mailto:" + myEmail, myCard.fn);
		},

		localizeCardFromTree: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			wdw_cardbook.localizeCards(null, [myCard.adr[wdw_cardbook.currentIndex][0]]);
		},

		openURLFromTree: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			wdw_cardbook.openURLCards(null, [myCard.url[wdw_cardbook.currentIndex][0]]);
		},

		openIMPPFromTree: function () {
			if (document.getElementById('impp_' + wdw_cardbook.currentIndex + '_valueBox').getAttribute('link') == "true") {
				var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
				var myResult = myCard[wdw_cardbook.currentType][wdw_cardbook.currentIndex];
				cardbookUtils.openIMPP(myResult);
			}
		},

		openTelFromTree: function () {
			if (document.getElementById('tel_' + wdw_cardbook.currentIndex + '_valueBox').getAttribute('link') == "true") {
				var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var telProtocolLine = prefs.getComplexValue("extensions.cardbook.tels.0", Components.interfaces.nsISupportsString).data;
				var telProtocolLineArray = telProtocolLine.split(':');
				var telProtocol = telProtocolLineArray[2];
				var myResult = telProtocol + ":" + myCard[wdw_cardbook.currentType][wdw_cardbook.currentIndex][0];
				cardbookUtils.openExternalURL(cardbookUtils.formatTelForOpenning(myResult));
			}
		},

		doubleClickCardsTree: function (aEvent) {
			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				return;
			}
			if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
				var myTree = document.getElementById('cardsTree');
				var row = { }, col = { }, child = { };
				myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
				if (row.value != -1) {
					wdw_cardbook.chooseActionCardsTree();
				}
			} else {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var myTree = document.getElementById('cardsTree');
					var row = { }, col = { }, child = { };
					myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
					if (row.value != -1) {
						wdw_cardbook.chooseActionCardsTree();
					} else {
						var myTree = document.getElementById('accountsOrCatsTree');
						var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
						var myDirPrefId = cardbookUtils.getAccountId(myTarget);
						var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
						if (!cardbookPrefService.getReadOnly() && cardbookPrefService.getEnabled()) {
							wdw_cardbook.createCard();
						}
					}
				}
			}
		},

		chooseActionCardsTree: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var preferEmailEdition = prefs.getBoolPref("extensions.cardbook.preferEmailEdition");
			if (preferEmailEdition) {
				wdw_cardbook.editCard();
			} else {
				wdw_cardbook.emailCardsFromCards("to");
			}
		},

		emailCardsFromAccountsOrCats: function (aAction) {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
			wdw_cardbook.emailCards(listOfSelectedCard, null, aAction);
		},

		emailCardsFromCards: function (aAction) {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			wdw_cardbook.emailCards(listOfSelectedCard, null, aAction);
		},

		openURLFromCards: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			wdw_cardbook.openURLCards(listOfSelectedCard, null);
		},

		print: function () {
			if (document.commandDispatcher.focusedElement.getAttribute('id') == "cardsTree") {
				var myTree = document.getElementById('cardsTree');
				if (myTree.currentIndex != -1) {
					wdw_cardbook.printFromCards();
				}
			} else if (document.commandDispatcher.focusedElement.getAttribute('id') == "accountsOrCatsTree") {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					wdw_cardbook.printFromAccountsOrCats();
				}
			}
		},

		printFromCards: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			var defaultTitle = "";
			if (listOfSelectedCard.length == 1) {
				defaultTitle = listOfSelectedCard[0].fn;
			}
			wdw_cardbook.openPrintEdition(listOfSelectedCard, defaultTitle);
		},

		printFromAccountsOrCats: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
			var myTree = document.getElementById('accountsOrCatsTree');
			var defaultTitle = myTree.view.getCellText(myTree.currentIndex, {id: "accountName"});
			wdw_cardbook.openPrintEdition(listOfSelectedCard, defaultTitle);
		},

		findEmailsFromCards: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			ovl_cardbookMailContacts.findEmails(listOfSelectedCard, null);
		},

		findEventsFromCards: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			var myCard = listOfSelectedCard[0];
			ovl_cardbookMailContacts.findEvents([myCard], null, myCard.fn, "mailto:" + myCard.emails[0], myCard.fn);
		},

		localizeCardsFromCards: function () {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			wdw_cardbook.localizeCards(listOfSelectedCard, null);
		},

		emailCards: function (aListOfSelectedCard, aListOfSelectedMails, aMsgField) {
			var listOfEmail = [];
			if (aListOfSelectedCard != null && aListOfSelectedCard !== undefined && aListOfSelectedCard != "") {
				listOfEmail = cardbookUtils.getMimeEmailsFromCardsAndLists(aListOfSelectedCard);
			} else if (aListOfSelectedMails != null && aListOfSelectedMails !== undefined && aListOfSelectedMails != "") {
				listOfEmail.push(MailServices.headerParser.makeMimeAddress(aListOfSelectedMails[0], aListOfSelectedMails[1]));
			}
			
			if (listOfEmail.length != 0) {
				var msgComposeType = Components.interfaces.nsIMsgCompType;
				var msgComposFormat = Components.interfaces.nsIMsgCompFormat;
				var msgComposeService = Components.classes["@mozilla.org/messengercompose;1"].getService();
				var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
				msgComposeService = msgComposeService.QueryInterface(Components.interfaces.nsIMsgComposeService);
				if (params) {
					params.type = msgComposeType.New;
					params.format = msgComposFormat.Default;
					var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
					if (composeFields) {
						composeFields[aMsgField] = listOfEmail.join(" , ");
						params.composeFields = composeFields;
						msgComposeService.OpenComposeWindowWithParams(null, params);
					}
				}
			}
		},

		localizeCards: function (aListOfSelectedCard, aListOfSelectedAddresses) {
			var listOfAddresses = [];
			if (aListOfSelectedCard != null && aListOfSelectedCard !== undefined && aListOfSelectedCard != "") {
				listOfAddresses = cardbookUtils.getAddressesFromCards(aListOfSelectedCard);
			} else if (aListOfSelectedAddresses != null && aListOfSelectedAddresses !== undefined && aListOfSelectedAddresses != "") {
				listOfAddresses = JSON.parse(JSON.stringify(aListOfSelectedAddresses));
			}
			
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var localizeEngine = prefs.getComplexValue("extensions.cardbook.localizeEngine", Components.interfaces.nsISupportsString).data;
			var urlEngine = "";
			if (localizeEngine === "GoogleMaps") {
				urlEngine = "https://www.google.com/maps?q=";
			} else if (localizeEngine === "OpenStreetMap") {
				urlEngine = "https://www.openstreetmap.org/search?query=";
			} else if (localizeEngine === "BingMaps") {
				urlEngine = "https://www.bing.com/maps/?q=";
			} else {
				return;
			}

			for (var i = 0; i < listOfAddresses.length; i++) {
				var url = urlEngine + listOfAddresses[i][2].replace(/[\n\u0085\u2028\u2029]|\r\n?/g, "+").replace(/ /g, "+") + "+"
									+ listOfAddresses[i][3].replace(/[\n\u0085\u2028\u2029]|\r\n?/g, "+").replace(/ /g, "+") + "+"
									+ listOfAddresses[i][4].replace(/[\n\u0085\u2028\u2029]|\r\n?/g, "+").replace(/ /g, "+") + "+"
									+ listOfAddresses[i][5].replace(/[\n\u0085\u2028\u2029]|\r\n?/g, "+").replace(/ /g, "+") + "+"
									+ listOfAddresses[i][6].replace(/[\n\u0085\u2028\u2029]|\r\n?/g, "+").replace(/ /g, "+");
				cardbookUtils.openURL(url);
			}
		},

		openURLCards: function (aListOfSelectedCard, aListOfSelectedURLs) {
			var listOfURLs = [];
			if (aListOfSelectedCard != null && aListOfSelectedCard !== undefined && aListOfSelectedCard != "") {
				listOfURLs = cardbookUtils.getURLsFromCards(aListOfSelectedCard);
			} else if (aListOfSelectedURLs != null && aListOfSelectedURLs !== undefined && aListOfSelectedURLs != "") {
				listOfURLs = JSON.parse(JSON.stringify(aListOfSelectedURLs));
			}
			
			for (var i = 0; i < listOfURLs.length; i++) {
				var url = listOfURLs[i][0];
				cardbookUtils.openURL(url);
			}
		},

		cardsTreeContextShowing: function () {
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
			wdw_cardbook.cardsTreeContextShowingNext();
			return true;
		},

		sortTrees: function (aEvent) {
			if (aEvent.button != 0) {
				return;
			}
			var target = aEvent.originalTarget;
			if (target.localName == "treecol") {
				wdw_cardbook.sortCardsTreeCol(target);
			} else {
				wdw_cardbook.selectCard(aEvent);
			}
		},

		sortCardsTreeColFromCol: function (aEvent, aColumn) {
			if (aEvent.button == 0) {
				wdw_cardbook.sortCardsTreeCol(aColumn);
			}
		},

		sortCardsTreeCol: function (aColumn) {
			var myTree = document.getElementById('cardsTree');
			var myFirstVisibleRow = myTree.boxObject.getFirstVisibleRow();
			var myLastVisibleRow = myTree.boxObject.getLastVisibleRow();

			// get selected cards
			var listOfUid = [];
			listOfUid = cardbookUtils.getSelectedCards();

			var columnName;
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
			
			if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
				var mySelectedAccount = cardbookRepository.cardbookSearchValue;
			} else {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var mySelectedAccount = myTree.view.getCellText(myTree.currentIndex, myTree.columns.getNamedColumn("accountId"));
				} else {
					return;
				}
			}
			if (cardbookRepository.cardbookDisplayCards[mySelectedAccount]) {
				cardbookRepository.cardbookDisplayCards[mySelectedAccount] = cardbookUtils.sortArrayByString(cardbookRepository.cardbookDisplayCards[mySelectedAccount], columnName, order);
			} else {
				return;
			}

			//setting these will make the sort option persist
			var myTree = document.getElementById('cardsTree');
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);
			
			wdw_cardbook.displayAccountOrCat(cardbookRepository.cardbookDisplayCards[mySelectedAccount]);
			
			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select Cards back
			cardbookUtils.setSelectedCards(listOfUid, myFirstVisibleRow, myLastVisibleRow);
		},

		startDrag: function (aEvent, aTreeChildren) {
			try {
				var listOfUid = [];
				cardbookDirTree.dragMode = "dragMode";
				if (aTreeChildren.id == "cardsTreeChildren") {
					var myTree = document.getElementById('cardsTree');
					var numRanges = myTree.view.selection.getRangeCount();
					var start = new Object();
					var end = new Object();
					for (var i = 0; i < numRanges; i++) {
						myTree.view.selection.getRangeAt(i,start,end);
						for (var j = start.value; j <= end.value; j++){
							var myId = myTree.view.getCellText(j, {id: "dirPrefId"})+"::"+myTree.view.getCellText(j, {id: "uid"});
							listOfUid.push(myId);
						}
					}
				} else if (aTreeChildren.id == "accountsOrCatsTreeChildren") {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
						var myAccountPrefId = cardbookRepository.cardbookSearchValue;
					} else {
						var myAccountPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					}
					for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAccountPrefId].length; i++) {
						var myId = cardbookRepository.cardbookDisplayCards[myAccountPrefId][i].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[myAccountPrefId][i].uid;
						listOfUid.push(myId);
					}
				}
				aEvent.dataTransfer.setData("text/plain", listOfUid.join("@@@@@"));
				// aEvent.dataTransfer.effectAllowed = "copy";
				// aEvent.dataTransfer.dropEffect = "copy";

				var myCanvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
				var myContext = myCanvas.getContext('2d');
				var myImage = new Image();
				var myIconMaxSize = 26;
				var myIconMaxNumber = 5;
				myCanvas.id = 'dragCanvas';
				myCanvas.height = myIconMaxSize;
				// need to know the canvas size before
				if (listOfUid.length >= myIconMaxNumber) {
					var myLength = myIconMaxNumber;
				} else {
					var myLength = listOfUid.length;
				}
				myCanvas.width = (myLength + 1) * myIconMaxSize;
				// concatenate images
				for (var i = 0; i < myLength; i++) {
					var myId = listOfUid[i];
					var myPhoto = cardbookRepository.cardbookCards[myId].photo.localURI;
					if (myPhoto != null && myPhoto !== undefined && myPhoto != "") {
						myImage.src = myPhoto;
					} else {
						myImage.src = "chrome://cardbook/skin/missing_photo_200_214.png";
					}
					myContext.drawImage(myImage, i*myIconMaxSize, 0, myIconMaxSize, myIconMaxSize);
				}
				if (listOfUid.length > myIconMaxNumber) {
					// Concatenate a triangle
					var path=new Path2D();
					path.moveTo(myIconMaxSize*myIconMaxNumber,0);
					path.lineTo(myIconMaxSize*(myIconMaxNumber+1),myIconMaxSize/2);
					path.lineTo(myIconMaxSize*myIconMaxNumber,myIconMaxSize);
					myContext.fill(path);
				}
				aEvent.dataTransfer.setDragImage(myCanvas, 0, 0);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.startDrag error : " + e, "Error");
			}
		},

		dragCards: function (aEvent) {
			cardbookDirTree.dragMode = "";
			var myTree = document.getElementById('accountsOrCatsTree');
			var row = { }, col = { }, child = { };
			myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
			var myTarget = myTree.view.getCellText(row.value, {id: "accountId"});
			var myDirPrefId = cardbookUtils.getAccountId(myTarget);
			var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdEnabled = cardbookPrefService.getEnabled();
			var myDirPrefIdReadOnly = cardbookPrefService.getReadOnly();

			if (myDirPrefIdType !== "SEARCH") {
				if (myDirPrefIdEnabled) {
					if (!myDirPrefIdReadOnly) {
						aEvent.preventDefault();
						var dataArray = aEvent.dataTransfer.getData("text/plain").split("@@@@@");
						if (dataArray.length) {
							var dataLength = dataArray.length
							for (var i = 0; i < dataLength; i++) {
								if (cardbookRepository.cardbookCards[dataArray[i]]) {
									var myCard = cardbookRepository.cardbookCards[dataArray[i]];
									if (myDirPrefId == myCard.dirPrefId) {
										cardbookRepository.importConflictChoicePersist = true;
										cardbookRepository.importConflictChoice = "duplicate";
										var askUser = false;
									} else {
										cardbookRepository.importConflictChoicePersist = false;
										cardbookRepository.importConflictChoice = "overwrite";
										var askUser = true;
									}
									// performance reason
									// update the UI only at the end
									if (i == dataLength - 1) {
										cardbookSynchronization.importCard(myCard, myTarget, askUser, "cardbook.cardDragged");
									} else {
										cardbookSynchronization.importCard(myCard, myTarget, askUser);
									}
								} else {
									cardbookUtils.formatStringForOutput("draggableWrong");
								}
							}
							cardbookRepository.reWriteFiles([myDirPrefId]);
						} else {
							cardbookUtils.formatStringForOutput("draggableWrong");
						}
					} else {
						var myDirPrefIdName = cardbookPrefService.getName();
						cardbookUtils.formatStringForOutput("addressbookReadOnly", [myDirPrefIdName]);
					}
				} else {
					var myDirPrefIdName = cardbookPrefService.getName();
					cardbookUtils.formatStringForOutput("addressbookDisabled", [myDirPrefIdName]);
				}
			}
		},

		editComplexSearch: function () {
			wdw_cardbook.addAddressbook("search");
		},

		startSearch: function (aListOfCards) {
			wdw_cardbook.setSearchMode();
			var listOfSelectedCard = [];
			if (!(aListOfCards)) {
				listOfSelectedCard = cardbookUtils.getSelectedCardsId();
			} else {
				listOfSelectedCard = aListOfCards;
			}
			
			wdw_cardbook.clearAccountOrCat();
			wdw_cardbook.clearCard();
			cardbookRepository.cardbookSearchValue = document.getElementById('cardbookSearchInput').value.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();

			if (cardbookRepository.cardbookSearchValue != "") {
				cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue] = [];
				for (var i in cardbookRepository.cardbookCardSearch1) {
					if (i.indexOf(cardbookRepository.cardbookSearchValue) >= 0) {
						for (var j = 0; j < cardbookRepository.cardbookCardSearch1[i].length; j++) {
							cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(cardbookRepository.cardbookCardSearch1[i][j]);
						}
					}
				}
				// need to verify that the selected cards are always found
				var myListOfSelectedCards = [];
				for (var i = 0; i < listOfSelectedCard.length; i++) {
					var myCard = cardbookRepository.cardbookCards[listOfSelectedCard[i]];
					if (cardbookRepository.getSearchString(myCard).indexOf(cardbookRepository.cardbookSearchValue) >= 0) {
						myListOfSelectedCards.push(listOfSelectedCard[i]);
					}
				}
				wdw_cardbook.displaySearch(myListOfSelectedCards);
			}
		},

		displayBirthdayList: function() {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			if (cardbookRepository.cardbookBirthdayPopup == 0) {
				cardbookRepository.cardbookBirthdayPopup++;
				var MyWindows = window.openDialog("chrome://cardbook/content/birthdays/wdw_birthdayList.xul", "", "chrome,centerscreen,modal,resizable");
				cardbookRepository.cardbookBirthdayPopup--;
			}
		},
	
		displaySyncList: function() {
			var MyWindows = window.openDialog("chrome://cardbook/content/birthdays/wdw_birthdaySync.xul", "", "chrome,centerscreen,modal,resizable");
		},

		setSyncControl: function () {
			var nIntervId = setInterval(wdw_cardbook.windowControlShowing, 1000);
		},

		setComplexSearchMode: function () {
			cardbookRepository.cardbookComplexSearchAB = "allAddressBooks";
			cardbookRepository.cardbookComplexMatchAll = true;
			cardbookRepository.cardbookComplexRules = [];
			wdw_cardbook.setNoSearchMode();
			cardbookRepository.cardbookComplexSearchMode = "SEARCH";
		},

		setSearchMode: function () {
			wdw_cardbook.setNoComplexSearchMode();
			cardbookRepository.cardbookSearchMode = "SEARCH";
			wdw_cardbook.disableCardCreation();
		},

		setNoComplexSearchMode: function () {
			cardbookRepository.cardbookComplexSearchAB = "allAddressBooks";
			cardbookRepository.cardbookComplexMatchAll = true;
			cardbookRepository.cardbookComplexRules = [];
			cardbookRepository.cardbookComplexSearchMode = "NOSEARCH";
		},

		setNoSearchMode: function () {
			cardbookRepository.cardbookSearchMode = "NOSEARCH";
			cardbookRepository.cardbookSearchValue = "";
			if (document.getElementById('cardbookSearchInput')) {
				document.getElementById('cardbookSearchInput').value = "";
				var strBundle = document.getElementById("cardbook-strings");
				document.getElementById('cardbookSearchInput').placeholder = strBundle.getString("cardbookSearchInputDefault");
			}
		},

		openLogEdition: function () {
			if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook') {
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_logEdition.xul", "", "chrome,modal,resizable,centerscreen");
			}
		},

		openOptionsEdition: function () {
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfiguration.xul", "", "chrome,modal,resizable,centerscreen");
		},

		openPrintEdition: function (aListOfCards, aTitle) {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var statusFeedback = Components.classes["@mozilla.org/messenger/statusfeedback;1"].createInstance();
				statusFeedback = statusFeedback.QueryInterface(Components.interfaces.nsIMsgStatusFeedback);
				var myArgs = {listOfCards: aListOfCards, title: aTitle, feedback: statusFeedback, doPrintPreview: true};
				var printEngineWindow = window.openDialog("chrome://cardbook/content/print/wdw_cardbookPrint.xul", "", "chrome,dialog=no,all", myArgs);
			}
		},

		addAddressbook: function (aAction, aSearchId) {
			if ((aSearchId != null && aSearchId !== undefined && aSearchId != "") || (cardbookRepository.cardbookSyncMode === "NOSYNC")) {
				cardbookRepository.cardbookSyncMode = "SYNC";
				var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);
				var myArgs = {action: aAction, searchId: aSearchId, rootWindow: window, serverCallback: wdw_cardbook.createAddressbook};
				var myWindow = window.openDialog("chrome://cardbook/content/addressbooksconfiguration/wdw_addressbooksAdd.xul", "",
												   // Workaround for Bug 1151440 - the HTML color picker won't work
												   // in linux when opened from modal dialog
												   (xulRuntime.OS == 'Linux') ? "chrome,resizable,centerscreen" : "modal,chrome,resizable,centerscreen"
												   , myArgs);
			}
		},
		
		createAddressbook: function (aFinishAction, aFinishParams) {
			cardbookSynchronization.nullifyMultipleOperations();
			for (var i = 0; i < aFinishParams.length; i++) {
				let cardbookPrefService = new cardbookPreferenceService(aFinishParams[i].dirPrefId);
				if (cardbookPrefService.getType() === "SEARCH") {
					wdw_cardbook.modifySearchAddressbook(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishParams[i].color, aFinishParams[i].vcard, aFinishParams[i].readonly, 
													aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].searchDef);
					return;
				}
			}

			if (aFinishAction === "GOOGLE" || aFinishAction === "CARDDAV" || aFinishAction === "APPLE") {
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishAction, aFinishParams[i].url, aFinishParams[i].username, aFinishParams[i].color,
																true, true, aFinishParams[i].vcard, aFinishParams[i].readonly, aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(aFinishParams[i].dirPrefId);
					cardbookSynchronization.syncAccount(aFinishParams[i].dirPrefId);
				}
			} else if (aFinishAction === "SEARCH") {
				cardbookRepository.cardbookSyncMode = "NOSYNC";
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					var myFile = cardbookRepository.getRuleFile(aFinishParams[i].dirPrefId);
					if (myFile.exists()) {
						myFile.remove(true);
					}
					myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					cardbookSynchronization.writeContentToFile(myFile.path, aFinishParams[i].searchDef, "UTF8");
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishAction, myFile.path, aFinishParams[i].username, aFinishParams[i].color,
																aFinishParams[i].enabled, true, aFinishParams[i].vcard, false, null, null, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
				}
			} else if (aFinishAction === "STANDARD") {
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					if (aFinishParams[i].collected) {
						cardbookRepository.addAccountToCollected(aFinishParams[i].dirPrefId);
					}
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, "LOCALDB", "", aFinishParams[i].username, aFinishParams[i].color,
																true, true, aFinishParams[i].vcard, aFinishParams[i].readonly, aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(aFinishParams[i].dirPrefId);
					cardbookRepository.cardbookDirRequest[aFinishParams[i].dirPrefId]++;
					var myMode = "WINDOW";
					wdw_migrate.importCards(aFinishParams[i].sourceDirPrefId, aFinishParams[i].dirPrefId, aFinishParams[i].name, myMode);
					cardbookSynchronization.waitForDirFinished(aFinishParams[i].dirPrefId, aFinishParams[i].name, myMode);
				}
			} else if (aFinishAction === "LOCALDB") {
				cardbookRepository.cardbookSyncMode = "NOSYNC";
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishAction, "", aFinishParams[i].username, aFinishParams[i].color,
																true, true, aFinishParams[i].vcard, aFinishParams[i].readonly, aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
					wdw_cardbook.loadCssRules();
				}
			} else if (aFinishAction === "FILE") {
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishAction, aFinishParams[i].dirname, aFinishParams[i].username, aFinishParams[i].color,
																true, true, aFinishParams[i].vcard, aFinishParams[i].readonly, aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(aFinishParams[i].dirPrefId);
					cardbookRepository.cardbookFileRequest[aFinishParams[i].dirPrefId]++;
					var myFile = aFinishParams[i].file;
					if (aFinishParams[i].actionType === "CREATEFILE") {
						if (myFile.exists()) {
							myFile.remove(true);
						}
						myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					}
					var myMode = "WINDOW";
					cardbookSynchronization.loadFile(myFile, "", aFinishParams[i].dirPrefId, myMode, "");
					cardbookSynchronization.waitForDirFinished(aFinishParams[i].dirPrefId, aFinishParams[i].name, myMode);
				}
			} else if (aFinishAction === "DIRECTORY") {
				wdw_cardbook.setNoComplexSearchMode();
				wdw_cardbook.setNoSearchMode();
				for (var i = 0; i < aFinishParams.length; i++) {
					var myDir = aFinishParams[i].file;
					if (aFinishParams[i].actionType === "CREATEDIRECTORY") {
						if (myDir.exists()) {
							var aListOfFileName = [];
							aListOfFileName = cardbookSynchronization.getFilesFromDir(myDir.path);
							if (aListOfFileName.length > 0) {
								var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
								var strBundle = document.getElementById("cardbook-strings");
								var confirmTitle = strBundle.getString("confirmTitle");
								var confirmMsg = strBundle.getFormattedString("directoryDeletionConfirmMessage", [myDir.leafName]);
								if (prompts.confirm(window, confirmTitle, confirmMsg)) {
									myDir.remove(true);
									myDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
								} else {
									cardbookRepository.cardbookSyncMode = "NOSYNC";
									return;
								}
							} else {
								myDir.remove(true);
								myDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
							}
						} else {
							myDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
						}
					}
					cardbookRepository.addAccountToRepository(aFinishParams[i].dirPrefId, aFinishParams[i].name, aFinishAction, aFinishParams[i].dirname, aFinishParams[i].username, aFinishParams[i].color,
																true, true, aFinishParams[i].vcard, aFinishParams[i].readonly, aFinishParams[i].dateFormat, aFinishParams[i].urnuuid, aFinishParams[i].DBcached, true);
					cardbookUtils.formatStringForOutput("addressbookCreated", [aFinishParams[i].name]);
					wdw_cardbooklog.addActivity("addressbookCreated", [aFinishParams[i].name], "addItem");
					cardbookUtils.notifyObservers("cardbook.ABAddedDirect", "accountid:" + aFinishParams[i].dirPrefId);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(aFinishParams[i].dirPrefId);
					cardbookRepository.cardbookDirRequest[aFinishParams[i].dirPrefId]++;
					var myMode = "WINDOW";
					cardbookSynchronization.loadDir(myDir, "", aFinishParams[i].dirPrefId, myMode, "");
					cardbookSynchronization.waitForDirFinished(aFinishParams[i].dirPrefId, aFinishParams[i].name, myMode);
				}
			} else {
				cardbookRepository.cardbookSyncMode = "NOSYNC";
			}
		},

		editAddressbook: function () {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					cardbookRepository.cardbookSyncMode = "SYNC";
					var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					var cardbookPrefService = new cardbookPreferenceService(myPrefId);
					var myPrefIdType = cardbookPrefService.getType();
					if (myPrefIdType === "SEARCH") {
						wdw_cardbook.addAddressbook("search", myPrefId);
					} else {
						var myPrefIdName = cardbookPrefService.getName();
						var myPrefIdUrl = cardbookPrefService.getUrl();
						var myPrefIdUser = cardbookPrefService.getUser();
						var myPrefIdColor = cardbookPrefService.getColor();
						var myPrefIdVCard = cardbookPrefService.getVCard();
						var myPrefIdReadOnly = cardbookPrefService.getReadOnly();
						var myPrefIdDateFormat = cardbookPrefService.getDateFormat();
						var myPrefIdUrnuuid = cardbookPrefService.getUrnuuid();
						var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);
						var myArgs = {serverEditionName: myPrefIdName, serverEditionType: myPrefIdType, serverEditionUrl: myPrefIdUrl, serverEditionUser: myPrefIdUser,
										serverEditionReadOnly: myPrefIdReadOnly, serverEditionColor: myPrefIdColor, serverEditionVCard: myPrefIdVCard,
										serverEditionId: myPrefId, serverEditionDateFormat: myPrefIdDateFormat,
										serverEditionUrnuuid: myPrefIdUrnuuid, serverCallback: wdw_cardbook.modifyAddressbook};
						var myWindow = window.openDialog("chrome://cardbook/content/wdw_serverEdition.xul", "",
														   // Workaround for Bug 1151440 - the HTML color picker won't work
														   // in linux when opened from modal dialog
														   (xulRuntime.OS == 'Linux') ? "chrome,resizable,centerscreen" : "modal,chrome,resizable,centerscreen"
														   , myArgs);
					}
				}
			}
		},

		modifyAddressbook: function (aChoice, aDirPrefId, aName, aColor, aVCard, aReadOnly, aDateFormat, aUrnuuid) {
			if (aChoice === "SAVE") {
				var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
				cardbookPrefService.setName(aName);
				cardbookPrefService.setColor(aColor);
				cardbookPrefService.setVCard(aVCard);
				cardbookPrefService.setReadOnly(aReadOnly);
				cardbookPrefService.setDateFormat(aDateFormat);
				cardbookPrefService.setUrnuuid(aUrnuuid);
				wdw_cardbook.loadCssRules();
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][4] === aDirPrefId) {
						cardbookRepository.cardbookAccounts[i][0] = aName;
						cardbookRepository.cardbookAccounts[i][7] = aReadOnly;
						break;
					}
				}
				cardbookUtils.formatStringForOutput("addressbookModified", [aName]);
				wdw_cardbooklog.addActivity("addressbookModified", [aName], "editItem");
				cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + aDirPrefId);
			}
			cardbookRepository.cardbookSyncMode = "NOSYNC";
		},

		modifySearchAddressbook: function (aDirPrefId, aName, aColor, aVCard, aReadOnly, aDateFormat, aUrnuuid, aSearchDef) {
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			cardbookPrefService.setName(aName);
			cardbookPrefService.setColor(aColor);
			cardbookPrefService.setVCard(aVCard);
			cardbookPrefService.setReadOnly(aReadOnly);
			cardbookPrefService.setDateFormat(aDateFormat);
			cardbookPrefService.setUrnuuid(aUrnuuid);
			wdw_cardbook.loadCssRules();
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] === aDirPrefId) {
					cardbookRepository.cardbookAccounts[i][0] = aName;
					cardbookRepository.cardbookAccounts[i][7] = aReadOnly;
					break;
				}
			}
			var myFile = cardbookRepository.getRuleFile(aDirPrefId);
			if (myFile.exists()) {
				myFile.remove(true);
			}
			myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
			cardbookSynchronization.writeContentToFile(myFile.path, aSearchDef, "UTF8");
			cardbookUtils.formatStringForOutput("addressbookModified", [aName]);
			wdw_cardbooklog.addActivity("addressbookModified", [aName], "editItem");
			cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + aDirPrefId);
			cardbookRepository.cardbookSyncMode = "NOSYNC";
		},

		removeAddressbook: function () {
			try {
				if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
					if (cardbookRepository.cardbookAccounts.length != 0) {
						cardbookRepository.cardbookSyncMode = "SYNC";
						var myTree = document.getElementById('accountsOrCatsTree');
						if (myTree.currentIndex != -1) {
							var myParentIndex = myTree.view.getParentIndex(myTree.currentIndex);
							if (myParentIndex == -1) {
								var myParentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
								var myParentAccountName = myTree.view.getCellText(myTree.currentIndex, {id: "accountName"});
								var myParentAccountType = myTree.view.getCellText(myTree.currentIndex, {id: "accountType"});
							} else {
								var myParentAccountId = myTree.view.getCellText(myParentIndex, {id: "accountId"});
								var myParentAccountName = myTree.view.getCellText(myParentIndex, {id: "accountName"});
								var myParentAccountType = myTree.view.getCellText(myParentIndex, {id: "accountType"});
							}
			
							var cardbookPrefService = new cardbookPreferenceService(myParentAccountId);
							var myPrefUrl = cardbookPrefService.getUrl();
							
							var strBundle = document.getElementById("cardbook-strings");
							var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
							var confirmTitle = strBundle.getString("confirmTitle");
							var confirmMsg = strBundle.getFormattedString("accountDeletionConfirmMessage", [myParentAccountName]);
							var returnFlag = false;
							var deleteContentFlag = {value: false};
							
							if (myParentAccountType === "FILE") {
								var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								myFile.initWithPath(myPrefUrl);
								var deleteContentMsg = strBundle.getFormattedString("accountDeletiondeleteContentFileMessage", [myFile.leafName]);
								returnFlag = prompts.confirmCheck(window, confirmTitle, confirmMsg, deleteContentMsg, deleteContentFlag);
							} else if (myParentAccountType === "DIRECTORY") {
								var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								myFile.initWithPath(myPrefUrl);
								var deleteContentMsg = strBundle.getFormattedString("accountDeletiondeleteContentDirMessage", [myFile.leafName]);
								returnFlag = prompts.confirmCheck(window, confirmTitle, confirmMsg, deleteContentMsg, deleteContentFlag);
							} else {
								returnFlag = prompts.confirm(window, confirmTitle, confirmMsg);
							}
							if (returnFlag) {
								cardbookRepository.removeAccountFromRepository(myParentAccountId, myParentAccountName);
								// cannot be launched from cardbookRepository
								cardbookIndexedDB.removeAccount(myParentAccountId, myParentAccountName);
								let cardbookPrefService = new cardbookPreferenceService(myParentAccountId);
								cardbookPrefService.delBranch();
								cardbookUtils.formatStringForOutput("addressbookClosed", [myParentAccountName]);
								wdw_cardbooklog.addActivity("addressbookClosed", [myParentAccountName], "deleteMail");
								cardbookUtils.notifyObservers("cardbook.ABRemovedDirect");
								wdw_cardbook.loadCssRules();
								if (myFile && deleteContentFlag.value) {
									wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : deleting : " + myFile.path);
									myFile.remove(true);
								}
							}
						}
						cardbookRepository.cardbookSyncMode = "NOSYNC";
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeAddressbook error : " + e, "Error");
			}
		},

		enableOrDisableAddressbook: function (aDirPrefId, aValue) {
			if (!(aDirPrefId != null && aDirPrefId !== undefined && aDirPrefId != "")) {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					aDirPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
					var aValue = !cardbookPrefService.getEnabled();
				} else {
					return;
				}
			}
			if (!aValue) {
				cardbookRepository.removeAccountFromCollected(aDirPrefId);
				cardbookRepository.removeAccountFromBirthday(aDirPrefId);
			}
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			var myDirPrefIdName = cardbookPrefService.getName();
			cardbookPrefService.setEnabled(aValue);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] === aDirPrefId) {
					cardbookRepository.cardbookAccounts[i][5] = aValue;
					break;
				}
			}
			wdw_cardbook.loadCssRules();
			if (aValue) {
				cardbookSynchronization.loadAccount(aDirPrefId, true, false, "INITIAL");
				cardbookUtils.formatStringForOutput("addressbookEnabled", [myDirPrefIdName]);
				wdw_cardbooklog.addActivity("addressbookEnabled", [myDirPrefIdName], "editItem");
				cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + aDirPrefId);
			} else {
				cardbookRepository.emptyAccountFromRepository(aDirPrefId);
				cardbookUtils.formatStringForOutput("addressbookDisabled", [myDirPrefIdName]);
				wdw_cardbooklog.addActivity("addressbookDisabled", [myDirPrefIdName], "editItem");
				cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + aDirPrefId);
			}
		},

		readOnlyOrReadWriteAddressbook: function () {
			cardbookRepository.cardbookSyncMode = "SYNC";
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myDirPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myDirPrefIdName = cardbookPrefService.getName();
				var myValue = !cardbookPrefService.getReadOnly();
			} else {
				return;
			}
			if (myValue) {
				cardbookRepository.removeAccountFromCollected(myDirPrefId);
			}
			cardbookPrefService.setReadOnly(myValue);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] === myDirPrefId) {
					cardbookRepository.cardbookAccounts[i][7] = myValue;
					break;
				}
			}
			wdw_cardbook.loadCssRules();
			if (myValue) {
				cardbookUtils.formatStringForOutput("addressbookReadOnly", [myDirPrefIdName]);
				wdw_cardbooklog.addActivity("addressbookReadOnly", [myDirPrefIdName], "editItem");
				cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + myDirPrefId);
			} else {
				cardbookUtils.formatStringForOutput("addressbookReadWrite", [myDirPrefIdName]);
				wdw_cardbooklog.addActivity("addressbookReadWrite", [myDirPrefIdName], "editItem");
				cardbookUtils.notifyObservers("cardbook.ABModifiedDirect", "accountid:" + myDirPrefId);
			}
			cardbookRepository.cardbookSyncMode = "NOSYNC";
		},

		expandOrContractAddressbook: function (aDirPrefId, aValue) {
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			cardbookPrefService.setExpanded(aValue);
		},

		returnKey: function () {
			if (document.commandDispatcher.focusedElement.getAttribute('id') == "cardsTree") {
				wdw_cardbook.chooseActionCardsTree();
			} else if (document.commandDispatcher.focusedElement.getAttribute('id') == "accountsOrCatsTree") {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					if (myTree.view.isContainer(myTree.currentIndex)) {
						wdw_cardbook.editAddressbook();
					} else {
						var myAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
						var mySepPosition = myAccountId.indexOf("::",0);
						var myDirPrefId = myAccountId.substr(0, mySepPosition);
						var myCategoryName = myAccountId.substr(mySepPosition+2, myAccountId.length);
						if (myCategoryName != cardbookRepository.cardbookUncategorizedCards) {
							wdw_cardbook.renameCategory(myDirPrefId, myCategoryName, "cardbook.catModifiedDirect", true);
						}
					}
				}
			}
		},

		newKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				var myDirPrefId = cardbookUtils.getAccountId(myTarget);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				if (!cardbookPrefService.getReadOnly() && cardbookPrefService.getEnabled()) {
					wdw_cardbook.createCard();
				}
			}
		},

		deleteKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				if (document.commandDispatcher.focusedElement.getAttribute('id') == "cardsTree") {
					var myPrefId = cardbookUtils.getAccountId(myAccountId);
					if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
						if (!cardbookUtils.isMyAccountReadOnly(myPrefId)) {
							wdw_cardbook.deleteCardsAndValidate("cardbook.cardRemovedDirect");
						}
					}
				} else if (document.commandDispatcher.focusedElement.getAttribute('id') == "accountsOrCatsTree") {
					if (myTree.view.isContainer(myTree.currentIndex)) {
						wdw_cardbook.removeAddressbook();
					} else {
						var mySepPosition = myAccountId.indexOf("::",0);
						var myDirPrefId = myAccountId.substr(0, mySepPosition);
						var myCategoryName = myAccountId.substr(mySepPosition+2, myAccountId.length);
						if (myCategoryName != cardbookRepository.cardbookUncategorizedCards) {
							if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
								if (!cardbookUtils.isMyAccountReadOnly(myPrefId)) {
									wdw_cardbook.removeCategory(myDirPrefId, myCategoryName, "cardbook.catRemovedDirect", true);
								}
							}
						}
					}
				}
			}
		},

		selectAllKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myCardsTree = document.getElementById('cardsTree');
				myCardsTree.view.selection.selectAll();
			}
		},

		F8Key: function () {
			ovl_cardbookLayout.changeResizePanes('viewABContact');
		},

		F9Key: function () {
			if (document.getElementById('cardbook-menupopup')) {
				document.getElementById('cardbook-menupopup').openPopup(document.getElementById('cardbook-menupopup'), "after_start", 0, 0, false, false);
			}
		},

		copyKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				if (document.commandDispatcher.focusedElement.getAttribute('id') == "cardsTree") {
					wdw_cardbook.copyCardsFromCards();
				} else if (document.commandDispatcher.focusedElement.getAttribute('id') == "accountsOrCatsTree") {
					wdw_cardbook.copyCardsFromAccountsOrCats();
				}
			}
		},

		pasteKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				wdw_cardbook.pasteCards();
			}
		},

		cutKey: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				if (document.commandDispatcher.focusedElement.getAttribute('id') == "cardsTree") {
					wdw_cardbook.cutCardsFromCards();
				} else if (document.commandDispatcher.focusedElement.getAttribute('id') == "accountsOrCatsTree") {
					wdw_cardbook.cutCardsFromAccountsOrCats();
				}
			}
		},

		findKey: function () {
			if (document.getElementById('cardbookSearchInput')) {
				document.getElementById('cardbookSearchInput').focus();
				wdw_cardbook.startSearch();
			}
		},

		doubleClickAccountOrCat: function (aEvent) {
			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				return;
			}
			var myTree = document.getElementById('accountsOrCatsTree');
			var row = { }, col = { }, child = { };
			myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
			var myTarget = myTree.view.getCellText(row.value, {id: "accountId"});
			if (myTarget == "false") {
				wdw_cardbook.addAddressbook();
			} else if (myTarget == cardbookUtils.getAccountId(myTarget)) {
				wdw_cardbook.editAddressbook();
			} else {
				wdw_cardbook.selectCategoryToAction('RENAME');
			}
		},

		addNewCategory: function () {
			var myArgs = {type: "", context: "AddCat", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookRenameField.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE" && myArgs.type != "") {
				var selectedUid = cardbookUtils.getSelectedCardsId();
				var myFirstCard = cardbookRepository.cardbookCards[selectedUid[0]];
				for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[myFirstCard.dirPrefId].length; i++) {
					if (cardbookRepository.cardbookAccountsCategories[myFirstCard.dirPrefId][i] == myArgs.type) {
						return;
					}
				}
				wdw_cardbook.addCategoryToSelectedCards(myArgs.type, "cardbook.catAddedDirect", true);
			}
		},

		addCategoryToSelectedCards: function (aCategory, aTopic, aCategorySelect) {
			var selectedUid = cardbookUtils.getSelectedCardsId();
			var listOfFileToRewrite = [];
			for (var i = 0; i < selectedUid.length; i++) {
				if (cardbookRepository.cardbookCards[selectedUid[i]]) {
					var myCard = cardbookRepository.cardbookCards[selectedUid[i]];
					var myOutCard = new cardbookCardParser();
					cardbookUtils.cloneCard(myCard, myOutCard);
					cardbookRepository.addCategoryToCard(myOutCard, aCategory);
					cardbookRepository.saveCard(myCard, myOutCard, "cardbook.cardModifiedDirect");
					listOfFileToRewrite.push(myOutCard.dirPrefId);
				}
			}
			cardbookRepository.reWriteFiles(listOfFileToRewrite);
			if (aCategorySelect) {
				var dirPrefName = cardbookUtils.getPrefNameFromPrefId(myOutCard.dirPrefId);
				cardbookUtils.formatStringForOutput("categoryCreatedOK", [dirPrefName, aCategory]);
				wdw_cardbooklog.addActivity("categoryCreatedOK", [dirPrefName, aCategory], "addItem");
				cardbookUtils.notifyObservers(aTopic, "accountid:" + myOutCard.dirPrefId+"::"+aCategory);
			}
		},

		removeCategoryFromSelectedCards: function (aCategory) {
			function filterCategories(element) {
				return (element != aCategory);
			}
			var selectedUid = cardbookUtils.getSelectedCardsId();
			var listOfFileToRewrite = [];
			for (var i = 0; i < selectedUid.length; i++) {
				if (cardbookRepository.cardbookCards[selectedUid[i]]) {
					var myCard = cardbookRepository.cardbookCards[selectedUid[i]];
					var myOutCard = new cardbookCardParser();
					cardbookUtils.cloneCard(myCard, myOutCard);
					myOutCard.categories = myOutCard.categories.filter(filterCategories);
					cardbookRepository.saveCard(myCard, myOutCard, "cardbook.cardModifiedDirect");
					listOfFileToRewrite.push(myOutCard.dirPrefId);
				}
			}
			cardbookRepository.reWriteFiles(listOfFileToRewrite);
		},

		loadCssRules: function () {
			for (var prop in document.styleSheets) {
				var styleSheet = document.styleSheets[prop];
				if (styleSheet.href == "chrome://cardbook/skin/cardbookTreeChildrens.css") {
					cardbookRepository.cardbookDynamicCssRules[styleSheet.href] = [];
					cardbookRepository.deleteCssAllRules(styleSheet);
					var createSearchRules = cardbookRepository.isthereSearchRulesToCreate();
					for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
						if (cardbookRepository.cardbookAccounts[i][1]) {
							var dirPrefId = cardbookRepository.cardbookAccounts[i][4];
							var cardbookPrefService = new cardbookPreferenceService(dirPrefId);
							var color = cardbookPrefService.getColor()
							cardbookRepository.createCssAccountRules(styleSheet, dirPrefId, color);
							if (createSearchRules && cardbookRepository.cardbookAccounts[i][5]) {
								cardbookRepository.createCssCardRules(styleSheet, dirPrefId, color);
							}
						}
					}
					cardbookRepository.reloadCss(styleSheet.href);
				}
			}
		},

		renameCategory: function (aDirPrefId, aCategoryName, aTopic, aCategorySelect) {
			try {
				if (cardbookRepository.cardbookSyncMode == "NOSYNC") {
					cardbookRepository.cardbookSyncMode = "SYNC";
				} else {
					return;
				}
				var myArgs = {type: aCategoryName, context: "Cat", typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookRenameField.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE" && myArgs.type != "" && myArgs.type != aCategoryName) {
					var myNewCategoryName = myArgs.type;
					var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdType = cardbookPrefService.getType();
					
					var myCards = cardbookRepository.cardbookDisplayCards[aDirPrefId+"::"+aCategoryName];
					for (var i = 0; i < myCards.length; i++) {
						var myCard = myCards[i];
						var myOutCard = new cardbookCardParser();
						cardbookUtils.cloneCard(myCard, myOutCard);
						cardbookRepository.renameCategoryFromCard(myOutCard, aCategoryName, myNewCategoryName);
						cardbookRepository.saveCard(myCard, myOutCard, "cardbook.cardModifiedDirect");
						cardbookUtils.formatStringForOutput("cardRemovedFromCategory", [myDirPrefIdName, myOutCard.fn, aCategoryName]);
					}
					
					cardbookRepository.reWriteFiles([aDirPrefId]);
					cardbookUtils.formatStringForOutput("categoryRenamedOK", [myDirPrefIdName, aCategoryName]);
					wdw_cardbooklog.addActivity("categoryRenamedOK", [myDirPrefIdName, aCategoryName], "editItem");
					if (aCategorySelect) {
						cardbookUtils.notifyObservers(aTopic, "accountid:" + aDirPrefId+"::"+myNewCategoryName);
					} else {
						cardbookUtils.notifyObservers(aTopic);
					}
				}
				cardbookRepository.cardbookSyncMode = "NOSYNC";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.renameCategory error : " + e, "Error");
			}
		},

		removeCategory: function (aDirPrefId, aCategoryName, aTopic, aCategorySelect) {
			try {
				if (cardbookRepository.cardbookSyncMode == "NOSYNC") {
					cardbookRepository.cardbookSyncMode = "SYNC";
				} else {
					return;
				}
				var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var confirmTitle = strBundle.GetStringFromName("confirmTitle");
				if (cardbookRepository.cardbookDisplayCards[aDirPrefId+"::"+aCategoryName].length > 1) {
					var confirmMsg = strBundle.formatStringFromName("catDeletionsConfirmMessage", [aCategoryName, cardbookRepository.cardbookDisplayCards[aDirPrefId+"::"+aCategoryName].length], 2);
				} else {
					var confirmMsg = strBundle.formatStringFromName("catDeletionConfirmMessage", [aCategoryName], 1);
				}

				if (prompts.confirm(window, confirmTitle, confirmMsg)) {
					var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdType = cardbookPrefService.getType();
					
					var myCards = cardbookRepository.cardbookDisplayCards[aDirPrefId+"::"+aCategoryName];
					for (var i = 0; i < myCards.length; i++) {
						var myCard = myCards[i];
						var myOutCard = new cardbookCardParser();
						cardbookUtils.cloneCard(myCard, myOutCard);
						cardbookRepository.removeCategoryFromCard(myOutCard, aCategoryName);
						cardbookRepository.saveCard(myCard, myOutCard, "cardbook.cardModifiedDirect");
						cardbookUtils.formatStringForOutput("cardRemovedFromCategory", [myDirPrefIdName, myOutCard.fn, aCategoryName]);
					}
					
					cardbookRepository.reWriteFiles([aDirPrefId]);
					cardbookUtils.formatStringForOutput("categoryDeletedOK", [myDirPrefIdName, aCategoryName]);
					wdw_cardbooklog.addActivity("categoryDeletedOK", [myDirPrefIdName, aCategoryName], "deleteMail");
					if (aCategorySelect) {
						cardbookUtils.notifyObservers(aTopic, "accountid:" + aDirPrefId);
					} else {
						cardbookUtils.notifyObservers(aTopic);
					}
				}
				cardbookRepository.cardbookSyncMode = "NOSYNC";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeCategory error : " + e, "Error");
			}
		},

		selectCategoryToAction: function (aAction) {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.view.isContainer(myTree.currentIndex)) {
					return;
				} else {
					var myCategory = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var mySepPosition = myCategory.indexOf("::",0);
					if (mySepPosition != -1) {
						var myDirPrefId = myCategory.substr(0, mySepPosition);
						var myCategoryName = myCategory.substr(mySepPosition+2, myCategory.length);
						if (myCategoryName != cardbookRepository.cardbookUncategorizedCards) {
							if (aAction === "REMOVE") {
								wdw_cardbook.removeCategory(myDirPrefId, myCategoryName, "cardbook.catRemovedDirect", true);
							} else if (aAction === "RENAME") {
								wdw_cardbook.renameCategory(myDirPrefId, myCategoryName, "cardbook.catModifiedDirect", true);
							}
						}
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.selectCategoryToAction error : " + e, "Error");
			}
		},

		convertListToCategory: function () {
			try {
				cardbookRepository.cardbookSyncMode = "SYNC";
				var myDirPrefId = document.getElementById('dirPrefIdTextBox').value;
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myCard = cardbookRepository.cardbookCards[myDirPrefId+"::"+document.getElementById('uidTextBox').value];
				if (!myCard.isAList || cardbookPrefService.getReadOnly()) {
					cardbookRepository.cardbookSyncMode = "NOSYNC";
					return;
				} else {
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdType = cardbookPrefService.getType();
					var myCategoryName = myCard.fn;
					if (myCard.version == "4.0") {
						for (var k = 0; k < myCard.member.length; k++) {
							var uid = myCard.member[k].replace("urn:uuid:", "");
							if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+uid]) {
								var myTargetCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+uid];
								var myOutCard = new cardbookCardParser();
								cardbookUtils.cloneCard(myTargetCard, myOutCard);
								cardbookRepository.addCategoryToCard(myOutCard, myCategoryName);
								cardbookRepository.saveCard(myTargetCard, myOutCard, "cardbook.cardAddedDirect");
								cardbookUtils.formatStringForOutput("cardAddedToCategory", [myDirPrefIdName, myOutCard.fn, myCategoryName]);
							}
						}
					} else if (myCard.version == "3.0") {
						var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
						var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
						for (var k = 0; k < myCard.others.length; k++) {
							var localDelim1 = myCard.others[k].indexOf(":",0);
							if (localDelim1 >= 0) {
								var header = myCard.others[k].substr(0,localDelim1);
								var trailer = myCard.others[k].substr(localDelim1+1,myCard.others[k].length);
								if (header == memberCustom) {
									if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")]) {
										var myTargetCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")];
										var myOutCard = new cardbookCardParser();
										cardbookUtils.cloneCard(myTargetCard, myOutCard);
										cardbookRepository.addCategoryToCard(myOutCard, myCategoryName);
										cardbookRepository.saveCard(myTargetCard, myOutCard, "cardbook.cardAddedDirect");
										cardbookUtils.formatStringForOutput("cardAddedToCategory", [myDirPrefIdName, myOutCard.fn, myCategoryName]);
									}
								}
							}
						}
					}
					cardbookRepository.deleteCards([myCard]);
					cardbookUtils.formatStringForOutput("categoryCreatedOK", [myDirPrefIdName, myCategoryName]);
					wdw_cardbooklog.addActivity("categoryCreatedOK", [myDirPrefIdName, myCategoryName], "addItem");
					cardbookUtils.notifyObservers("cardbook.catAddedDirect", "accountid:" + myOutCard.dirPrefId+"::"+myCategoryName);
					cardbookRepository.reWriteFiles([myDirPrefId]);
					cardbookRepository.cardbookSyncMode = "NOSYNC";
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.convertListToCategory error : " + e, "Error");
			}
		},

		copyCardFromTree: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			var myResult = cardbookUtils.formatAddress(myCard[wdw_cardbook.currentType][wdw_cardbook.currentIndex][0]);
			if (wdw_cardbook.currentType == "adr") {
				myResult = document.getElementById('fnTextBox').value + "\n" + myResult;
			}
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			var myMessage = strBundle.GetStringFromName("lineCopied");
			cardbookUtils.clipboardSet(myResult, myMessage);
		},

		setCurrentTypeFromEvent: function (aEvent) {
			var myElement = document.elementFromPoint(aEvent.clientX, aEvent.clientY);
			var myTempArray = myElement.id.split('_');
			wdw_cardbook.currentType = myTempArray[0];
			wdw_cardbook.currentIndex = myTempArray[1];
		},

		setCurrentListFromEvent: function (aEvent) {
			var myElement = document.elementFromPoint(aEvent.clientX, aEvent.clientY);
			var myTempArray = myElement.id.split('_');
			wdw_cardbook.currentCardOfListId = myTempArray[0];
		},

		cardListContextShowing: function (aEvent) {
			wdw_cardbook.setCurrentListFromEvent(aEvent);
		},

		enableOrDisableElement: function (aArray, aValue) {
			for (var i = 0; i < aArray.length; i++) {
				if (document.getElementById(aArray[i])) {
					document.getElementById(aArray[i]).disabled=aValue;
				}
			}
		},

		setElementLabelWithBundle: function (aElementId, aValue) {
			var strBundle = document.getElementById("cardbook-strings");
			wdw_cardbook.setElementLabel(aElementId, strBundle.getString(aValue));
		},

		setElementLabel: function (aElementId, aValue) {
			if (document.getElementById(aElementId)) {
				document.getElementById(aElementId).label=aValue;
			}
		},

		cardbookAccountMenuContextShowing: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuEditServer', 'cardbookAccountMenuCloseServer', 'cardbookAccountMenuEnableOrDisableAddressbook', 'cardbookAccountMenuReadOnlyOrReadWriteAddressbook'], false);
				if (cardbookPrefService.getEnabled()) {
					var myType = cardbookPrefService.getType();
					if (myType === "FILE" || myType === "CACHE" || myType === "DIRECTORY" || myType === "LOCALDB") {
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuSync'], true);
					} else {
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuSync'], false);
					}
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuEnableOrDisableAddressbook', "disableFromAccountsOrCats");
				} else {
					wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuSync'], true);
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuEnableOrDisableAddressbook', "enableFromAccountsOrCats");
				}
				if (cardbookPrefService.getReadOnly()) {
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuReadOnlyOrReadWriteAddressbook', "readWriteFromAccountsOrCats");
				} else {
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuReadOnlyOrReadWriteAddressbook', "readOnlyFromAccountsOrCats");
				}

				if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuImportFromFile', 'cardbookAccountMenuImportFromDir'], true);
					if (document.getElementById('cardsTree').view.rowCount == 0) {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], true);
					} else if (document.getElementById('cardsTree').view.rowCount == 1) {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], false);
					} else {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardsToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardsToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], false);
					}
				} else if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
					if (cardbookUtils.isMyAccountReadOnly(myPrefId)) {
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuImportFromFile', 'cardbookAccountMenuImportFromDir'], true);
					} else {
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuImportFromFile', 'cardbookAccountMenuImportFromDir'], false);
					}
					if (document.getElementById('cardsTree').view.rowCount == 0) {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], true);
					} else if (document.getElementById('cardsTree').view.rowCount == 1) {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], false);
					} else {
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardsToFileLabel");
						wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardsToDirLabel");
						wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir'], false);
					}
				} else {
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
					wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuExportToFile', 'cardbookAccountMenuImportFromFile', 'cardbookAccountMenuExportToDir', 'cardbookAccountMenuImportFromDir'], true);
				}
				if (cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuEditServer', 'cardbookAccountMenuCloseServer', 'cardbookAccountMenuEnableOrDisableAddressbook', 
														'cardbookAccountMenuExportToFile', 'cardbookAccountMenuExportToDir', ''], false);
					wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuReadOnlyOrReadWriteAddressbook', 'cardbookAccountMenuSync', 'cardbookAccountMenuImportFromFile', 'cardbookAccountMenuImportFromDir'], true);
				}
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookAccountMenuEditServer', 'cardbookAccountMenuCloseServer', 'cardbookAccountMenuEnableOrDisableAddressbook', 
													'cardbookAccountMenuReadOnlyOrReadWriteAddressbook', 'cardbookAccountMenuSync', 'cardbookAccountMenuExportToFile', 'cardbookAccountMenuImportFromFile',
													'cardbookAccountMenuExportToDir', 'cardbookAccountMenuImportFromDir'], true);
				wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuEnableOrDisableAddressbook', "disableFromAccountsOrCats");
				wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuReadOnlyOrReadWriteAddressbook', "readWriteFromAccountsOrCats");
				wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToFile', "exportCardToFileLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookAccountMenuExportToDir', "exportCardToDirLabel");
			}
		},
	
		cardbookContactsMenuContextShowing: function () {
			cardbookUtils.addToIMPPMenuSubMenu('cardbookContactsMenuIMPPCardsMenuPopup');
			cardbookUtils.addCardsToCategoryMenuSubMenu('cardbookContactsMenuCategoriesMenuPopup');
			wdw_cardbook.loadCategories('cardbookContactsMenuCategoriesPanel');
			wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuFindEvents'], true);
			var myTree = document.getElementById('accountsOrCatsTree');
			if (cardbookUtils.getSelectedCardsCount() == 0) {
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuToEmailCards', "toEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCcEmailCards', "ccEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuBccEmailCards', "bccEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuLocalizeCards', "localizeCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuOpenURL', "openURLCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCutCards', "cutCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCopyCards', "copyCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuPasteCards', "pasteCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToFile', "exportCardToFileLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToDir', "exportCardToDirLabel");
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuToEmailCards', 'cardbookContactsMenuCcEmailCards', 'cardbookContactsMenuBccEmailCards', 'cardbookContactsMenuFindEmails', 'cardbookContactsMenuLocalizeCards',
													'cardbookContactsMenuOpenURL', 'cardbookContactsMenuCutCards', 'cardbookContactsMenuCopyCards', 'cardbookContactsMenuPasteCards', 'cardbookContactsMenuExportCardsToFile',
													'cardbookContactsMenuExportCardsToDir', 'cardbookContactsMenuMergeCards', 'cardbookContactsMenuDuplicateCards', 'cardbookContactsMenuIMPPCards', 'cardbookContactsMenuCategories'], true);
			} else if (cardbookUtils.getSelectedCardsCount() == 1) {
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuToEmailCards', "toEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCcEmailCards', "ccEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuBccEmailCards', "bccEmailCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuLocalizeCards', "localizeCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuOpenURL', "openURLCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCutCards', "cutCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCopyCards', "copyCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuPasteCards', "pasteCardFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToFile', "exportCardToFileLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToDir', "exportCardToDirLabel");
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuToEmailCards', 'cardbookContactsMenuCcEmailCards', 'cardbookContactsMenuBccEmailCards', 'cardbookContactsMenuFindEmails', 'cardbookContactsMenuLocalizeCards',
													'cardbookContactsMenuOpenURL', 'cardbookContactsMenuCutCards', 'cardbookContactsMenuCopyCards', 'cardbookContactsMenuPasteCards', 'cardbookContactsMenuExportCardsToFile',
													'cardbookContactsMenuExportCardsToDir', 'cardbookContactsMenuDuplicateCards', 'cardbookContactsMenuIMPPCards', 'cardbookContactsMenuCategories'], false);
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuMergeCards'], true);
				Components.utils.import("resource://gre/modules/AddonManager.jsm");  
				AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, wdw_cardbook.cardbookContactsMenuLightningContextShowing);
			} else {
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuToEmailCards', "toEmailCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCcEmailCards', "ccEmailCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuBccEmailCards', "bccEmailCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuLocalizeCards', "localizeCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuOpenURL', "openURLCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCutCards', "cutCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuCopyCards', "copyCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuPasteCards', "pasteCardsFromCardsLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToFile', "exportCardsToFileLabel");
				wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuExportCardsToDir', "exportCardsToDirLabel");
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuToEmailCards', 'cardbookContactsMenuCcEmailCards', 'cardbookContactsMenuBccEmailCards', 'cardbookContactsMenuLocalizeCards',
													'cardbookContactsMenuOpenURL', 'cardbookContactsMenuCutCards', 'cardbookContactsMenuCopyCards', 'cardbookContactsMenuPasteCards', 'cardbookContactsMenuExportCardsToFile',
													'cardbookContactsMenuExportCardsToDir', 'cardbookContactsMenuMergeCards', 'cardbookContactsMenuDuplicateCards', 'cardbookContactsMenuIMPPCardsMenuPopup', 'cardbookContactsMenuCategories'], false);
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuFindEmails', 'cardbookContactsMenuIMPPCards'], true);
			}
			if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuPasteCards'], true);
			} else {
				if (myTree.currentIndex != -1) {
					var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					var cardbookPrefService = new cardbookPreferenceService(myPrefId);
					if (cardbookPrefService.getEnabled()) {
						if (cardbookPrefService.getReadOnly()) {
							wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuPasteCards'], true);
						} else {
							wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuPasteCards'], false);
						}
					} else {
						wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuPasteCards'], true);
					}
				} else {
					wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuPasteCards'], true);
				}
			}
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (!prefs.getBoolPref("mailnews.database.global.indexer.enabled")) {
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuFindEmails'], true);
			}
			if (cardbookUtils.getSelectedCardsDirPrefId().length == 1) {
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuCategories'], false);
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuCategories'], true);
			}
		},

		cardbookContactsMenuLightningContextShowing: function (addon) {
			if (addon && addon.isActive) {
				document.getElementById("cardbookContactsMenuFindEvents").disabled = false;
			}
		},

		cardbookToolsMenuSyncLightning: function(addon) {
			if (addon && addon.isActive) {
				wdw_cardbook.enableOrDisableElement(['cardbookToolsSyncLightning'], false);
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookToolsSyncLightning'], true);
			}
		},

		cardbookToolsMenuContextShowing: function () {
			Components.utils.import("resource://gre/modules/AddonManager.jsm");  
			AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, wdw_cardbook.cardbookToolsMenuSyncLightning);
		},

		accountsOrCatsTreeContextShowing: function () {
			wdw_cardbook.setElementLabelWithBundle('enableOrDisableFromAccountsOrCats', "disableFromAccountsOrCats");
			wdw_cardbook.setElementLabelWithBundle('readOnlyOrReadWriteFromAccountsOrCats', "readOnlyFromAccountsOrCats");
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var myAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var myPrefId = cardbookUtils.getAccountId(myAccountId);
					var cardbookPrefService = new cardbookPreferenceService(myPrefId);
					if (cardbookPrefService.getEnabled()) {
						if (cardbookPrefService.getReadOnly()) {
							wdw_cardbook.enableOrDisableElement(['pasteCardsFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats', 'importCardsFromDirFromAccountsOrCats'], true);
						} else {
							wdw_cardbook.enableOrDisableElement(['pasteCardsFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats', 'importCardsFromDirFromAccountsOrCats'], false);
						}
						wdw_cardbook.setElementLabelWithBundle('enableOrDisableFromAccountsOrCats', "disableFromAccountsOrCats");
						var myType = cardbookPrefService.getType();
						if (myType === "FILE" || myType === "CACHE" || myType === "DIRECTORY" || myType === "LOCALDB") {
							wdw_cardbook.enableOrDisableElement(['syncAccountFromAccountsOrCats'], true);
						} else {
							wdw_cardbook.enableOrDisableElement(['syncAccountFromAccountsOrCats'], false);
						}
					} else {
						wdw_cardbook.setElementLabelWithBundle('enableOrDisableFromAccountsOrCats', "enableFromAccountsOrCats");
						wdw_cardbook.enableOrDisableElement(['pasteCardsFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats', 'importCardsFromDirFromAccountsOrCats', 'syncAccountFromAccountsOrCats'], true);
					}
					if (cardbookPrefService.getReadOnly()) {
						wdw_cardbook.setElementLabelWithBundle('readOnlyOrReadWriteFromAccountsOrCats', "readWriteFromAccountsOrCats");
					} else {
						wdw_cardbook.setElementLabelWithBundle('readOnlyOrReadWriteFromAccountsOrCats', "readOnlyFromAccountsOrCats");
					}
					if (myTree.view.isContainer(myTree.currentIndex)) {
						wdw_cardbook.enableOrDisableElement(['removeCatFromAccountsOrCats', 'renameCatFromAccountsOrCats'], true);
					} else {
						var mySepPosition = myAccountId.indexOf("::",0);
						var myCategoryName = myAccountId.substr(mySepPosition+2, myAccountId.length);
						if (myCategoryName != cardbookRepository.cardbookUncategorizedCards) {
							wdw_cardbook.enableOrDisableElement(['removeCatFromAccountsOrCats', 'renameCatFromAccountsOrCats'], false);
						} else {
							wdw_cardbook.enableOrDisableElement(['removeCatFromAccountsOrCats', 'renameCatFromAccountsOrCats'], true);
						}
					}
				} else {
					wdw_cardbook.enableOrDisableElement(['renameCatFromAccountsOrCats', 'removeCatFromAccountsOrCats', 'pasteCardsFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats',
														'importCardsFromDirFromAccountsOrCats', 'syncAccountFromAccountsOrCats', 'printFromAccountsOrCats'], true);
				}
				wdw_cardbook.enableOrDisableElement(['addAccountFromAccountsOrCats', 'editAccountFromAccountsOrCats', 'removeAccountFromAccountsOrCats',
													'enableOrDisableFromAccountsOrCats', 'readOnlyOrReadWriteFromAccountsOrCats'], false);
				if (document.getElementById('cardsTree').view.rowCount == 0) {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromAccountsOrCats', "toEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromAccountsOrCats', "ccEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromAccountsOrCats', "bccEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromAccountsOrCats', "cutCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromAccountsOrCats', "copyCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromAccountsOrCats', "exportCardToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromAccountsOrCats', "exportCardToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromAccountsOrCats', 'ccEmailCardsFromAccountsOrCats', 'bccEmailCardsFromAccountsOrCats', 'cutCardsFromAccountsOrCats',
														'copyCardsFromAccountsOrCats', 'exportCardsToFileFromAccountsOrCats', 'exportCardsToDirFromAccountsOrCats', 'findDuplicatesFromAccountsOrCats',
														'renameCatFromAccountsOrCats', 'removeCatFromAccountsOrCats', 'printFromAccountsOrCats'], true);
				} else if (document.getElementById('cardsTree').view.rowCount == 1) {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromAccountsOrCats', "toEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromAccountsOrCats', "ccEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromAccountsOrCats', "bccEmailCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromAccountsOrCats', "cutCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromAccountsOrCats', "copyCardFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromAccountsOrCats', "exportCardToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromAccountsOrCats', "exportCardToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromAccountsOrCats', 'ccEmailCardsFromAccountsOrCats', 'bccEmailCardsFromAccountsOrCats', 'cutCardsFromAccountsOrCats',
														'copyCardsFromAccountsOrCats', 'exportCardsToFileFromAccountsOrCats', 'exportCardsToDirFromAccountsOrCats', 'findDuplicatesFromAccountsOrCats',
														'printFromAccountsOrCats'], false);
				} else {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromAccountsOrCats', "toEmailCardsFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromAccountsOrCats', "ccEmailCardsFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromAccountsOrCats', "bccEmailCardsFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromAccountsOrCats', "cutCardsFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromAccountsOrCats', "copyCardsFromAccountsOrCatsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromAccountsOrCats', "exportCardsToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromAccountsOrCats', "exportCardsToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromAccountsOrCats', 'ccEmailCardsFromAccountsOrCats', 'bccEmailCardsFromAccountsOrCats', 'cutCardsFromAccountsOrCats',
														'copyCardsFromAccountsOrCats', 'exportCardsToFileFromAccountsOrCats', 'exportCardsToDirFromAccountsOrCats', 'findDuplicatesFromAccountsOrCats',
														'printFromAccountsOrCats'], false);
				}
				if (cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromAccountsOrCats', 'ccEmailCardsFromAccountsOrCats', 'bccEmailCardsFromAccountsOrCats', 'cutCardsFromAccountsOrCats',
														'copyCardsFromAccountsOrCats', 'exportCardsToFileFromAccountsOrCats', 'exportCardsToDirFromAccountsOrCats',
														'addAccountFromAccountsOrCats', 'editAccountFromAccountsOrCats', 'removeAccountFromAccountsOrCats', 'enableOrDisableFromAccountsOrCats',
														'printFromAccountsOrCats'], false);
					wdw_cardbook.enableOrDisableElement(['pasteCardsFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats', 'importCardsFromDirFromAccountsOrCats',
														'readOnlyOrReadWriteFromAccountsOrCats', 'syncAccountFromAccountsOrCats', 'findDuplicatesFromAccountsOrCats',
														'renameCatFromAccountsOrCats', 'removeCatFromAccountsOrCats'], true);
				}
			} else {
				wdw_cardbook.enableOrDisableElement(['toEmailCardsFromAccountsOrCats', 'ccEmailCardsFromAccountsOrCats', 'bccEmailCardsFromAccountsOrCats', 'cutCardsFromAccountsOrCats', 'copyCardsFromAccountsOrCats',
													'pasteCardsFromAccountsOrCats', 'exportCardsToFileFromAccountsOrCats', 'exportCardsToDirFromAccountsOrCats', 'importCardsFromFileFromAccountsOrCats',
													'importCardsFromDirFromAccountsOrCats', 'addAccountFromAccountsOrCats', 'editAccountFromAccountsOrCats', 'removeAccountFromAccountsOrCats',
													'renameCatFromAccountsOrCats', 'removeCatFromAccountsOrCats', 'enableOrDisableFromAccountsOrCats', 'readOnlyOrReadWriteFromAccountsOrCats',
													'syncAccountFromAccountsOrCats', 'findDuplicatesFromAccountsOrCats', 'printFromAccountsOrCats'], true);
			}
		},
	
		cardsTreeContextShowingNext: function () {
			cardbookUtils.addToIMPPMenuSubMenu('IMPPCardFromCardsMenuPopup');
			cardbookUtils.addCardsToCategoryMenuSubMenu('categoriesFromCardsMenuPopup');
			wdw_cardbook.enableOrDisableElement(['findEventsFromCards'], true);
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				if (cardbookUtils.getSelectedCardsCount() == 0) {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromCards', "toEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromCards', "ccEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromCards', "bccEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('localizeCardsFromCards', "localizeCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('openURLFromCards', "openURLCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromCards', "cutCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromCards', "copyCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('pasteCardsFromCards', "pasteCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromCards', "exportCardToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromCards', "exportCardToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromCards', 'ccEmailCardsFromCards', 'bccEmailCardsFromCards', 'findEmailsFromCards', 'localizeCardsFromCards',
														'openURLFromCards', 'cutCardsFromCards', 'copyCardsFromCards', 'pasteCardsFromCards', 'exportCardsToFileFromCards',
														'exportCardsToDirFromCards', 'mergeCardsFromCards', 'duplicateCardsFromCards', 'convertListToCategoryFromCards',
														'IMPPCardFromCards', 'categoriesFromCards', 'printFromCards'], true);
				} else if (cardbookUtils.getSelectedCardsCount() == 1) {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromCards', "toEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromCards', "ccEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromCards', "bccEmailCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('localizeCardsFromCards', "localizeCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('openURLFromCards', "openURLCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromCards', "cutCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromCards', "copyCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('pasteCardsFromCards', "pasteCardFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromCards', "exportCardToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromCards', "exportCardToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromCards', 'ccEmailCardsFromCards', 'bccEmailCardsFromCards', 'findEmailsFromCards', 'localizeCardsFromCards',
														'openURLFromCards', 'cutCardsFromCards', 'copyCardsFromCards', 'pasteCardsFromCards', 'exportCardsToFileFromCards',
														'exportCardsToDirFromCards', 'duplicateCardsFromCards', 'IMPPCardFromCards', 'categoriesFromCards', 'printFromCards'], false);
					wdw_cardbook.enableOrDisableElement(['mergeCardsFromCards'], true);
					var myDirPrefId = document.getElementById('dirPrefIdTextBox').value;
					var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
					var myCard = cardbookRepository.cardbookCards[myDirPrefId+"::"+document.getElementById('uidTextBox').value];
					if (myCard) {
						if (!myCard.isAList || cardbookPrefService.getReadOnly()) {
							wdw_cardbook.enableOrDisableElement(['convertListToCategoryFromCards'], true);
						} else {
							wdw_cardbook.enableOrDisableElement(['convertListToCategoryFromCards'], false);
						}
					} else {
						wdw_cardbook.enableOrDisableElement(['convertListToCategoryFromCards'], false);
					}
					Components.utils.import("resource://gre/modules/AddonManager.jsm");  
					AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, wdw_cardbook.cardsTreeLightningContextShowing);
				} else {
					wdw_cardbook.setElementLabelWithBundle('toEmailCardsFromCards', "toEmailCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('ccEmailCardsFromCards', "ccEmailCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('bccEmailCardsFromCards', "bccEmailCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('localizeCardsFromCards', "localizeCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('openURLFromCards', "openURLCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('cutCardsFromCards', "cutCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('copyCardsFromCards', "copyCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('pasteCardsFromCards', "pasteCardsFromCardsLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToFileFromCards', "exportCardsToFileLabel");
					wdw_cardbook.setElementLabelWithBundle('exportCardsToDirFromCards', "exportCardsToDirLabel");
					wdw_cardbook.enableOrDisableElement(['toEmailCardsFromCards', 'ccEmailCardsFromCards', 'bccEmailCardsFromCards', 'localizeCardsFromCards',
														'openURLFromCards', 'cutCardsFromCards', 'copyCardsFromCards', 'pasteCardsFromCards', 'exportCardsToFileFromCards',
														'exportCardsToDirFromCards', 'mergeCardsFromCards', 'duplicateCardsFromCards', 'printFromCards'], false);
					wdw_cardbook.enableOrDisableElement(['convertListToCategoryFromCards', 'findEmailsFromCards', 'IMPPCardFromCards'], true);
				}
				if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					wdw_cardbook.enableOrDisableElement(['pasteCardsFromCards'], true);
				} else {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (myTree.currentIndex != -1) {
						var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
						var cardbookPrefService = new cardbookPreferenceService(myPrefId);
						if (cardbookPrefService.getEnabled()) {
							if (cardbookPrefService.getReadOnly()) {
								wdw_cardbook.enableOrDisableElement(['pasteCardsFromCards'], true);
							} else {
								wdw_cardbook.enableOrDisableElement(['pasteCardsFromCards'], false);
							}
						} else {
							wdw_cardbook.enableOrDisableElement(['pasteCardsFromCards'], true);
						}
					} else {
						wdw_cardbook.enableOrDisableElement(['pasteCardsFromCards'], true);
					}
				}
				if (cardbookUtils.getSelectedCardsDirPrefId().length == 1) {
					wdw_cardbook.enableOrDisableElement(['categoriesFromCards'], false);
				} else {
					wdw_cardbook.enableOrDisableElement(['categoriesFromCards'], true);
				}
			} else {
				wdw_cardbook.enableOrDisableElement(['toEmailCardsFromCards', 'ccEmailCardsFromCards', 'bccEmailCardsFromCards', 'findEmailsFromCards', 'localizeCardsFromCards',
													'openURLFromCards', 'cutCardsFromCards', 'copyCardsFromCards', 'pasteCardsFromCards', 'exportCardsToFileFromCards',
													'exportCardsToDirFromCards', 'mergeCardsFromCards', 'duplicateCardsFromCards', 'convertListToCategoryFromCards',
													'IMPPCardFromCards', 'categoriesFromCards', 'printFromCards'], true);
			}
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (!prefs.getBoolPref("mailnews.database.global.indexer.enabled")) {
				wdw_cardbook.enableOrDisableElement(['findEmailsFromCards'], true);
			}
		},
	
		cardsTreeLightningContextShowing: function (addon) {
			if (addon && addon.isActive) {
				document.getElementById("findEventsFromCards").disabled = false;
			}
		},

		emailTreeContextShowing: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			wdw_cardbook.enableOrDisableElement(['findemailemailTree'], !prefs.getBoolPref("mailnews.database.global.indexer.enabled"));
			document.getElementById("findeventemailTree").setAttribute("hidden", true);
			Components.utils.import("resource://gre/modules/AddonManager.jsm");  
			AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, wdw_cardbook.emailTreeLightningContextShowing);
		},

		emailTreeLightningContextShowing: function (addon) {
			if (addon && addon.isActive) {
				document.getElementById("findeventemailTree").disabled = false;
			}
		},

		imppTreeContextShowing: function () {
			if (document.getElementById('impp_' + wdw_cardbook.currentIndex + '_valueBox').getAttribute('link') == "true") {
				wdw_cardbook.enableOrDisableElement(['connectimppTree'], false);
			} else {
				wdw_cardbook.enableOrDisableElement(['connectimppTree'], true);
			}
		},

		telTreeContextShowing: function () {
			if (document.getElementById('tel_' + wdw_cardbook.currentIndex + '_valueBox').getAttribute('link') == "true") {
				wdw_cardbook.enableOrDisableElement(['connecttelTree'], false);
			} else {
				wdw_cardbook.enableOrDisableElement(['connecttelTree'], true);
			}
		},

		enableCardDeletion: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.disableCardDeletion();
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarRemoveButton'], false);
				wdw_cardbook.enableOrDisableElement(['cardbookContactsMenuRemoveCard'], false);
				wdw_cardbook.enableOrDisableElement(['removeCardFromCards'], false);
				if (cardbookUtils.getSelectedCardsCount() > 1) {
					wdw_cardbook.setElementLabelWithBundle('cardbookToolbarRemoveButton', "deleteCardsButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuRemoveCard', "deleteCardsButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('removeCardFromCards', "deleteCardsButtonLabel");
				} else if (cardbookUtils.getSelectedCardsCount() == 1) {
					wdw_cardbook.setElementLabelWithBundle('cardbookToolbarRemoveButton', "cardbookToolbarRemoveButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuRemoveCard', "cardbookToolbarRemoveButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('removeCardFromCards', "cardbookToolbarRemoveButtonLabel");
				}
			}
		},
	
		enableCardCreation: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.disableCardCreation();
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarAddButton', 'cardbookContactsMenuAddCard', 'addCardFromCards'], false);
			}
		},
	
		enableCardModification: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.disableCardModification();
			} else {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				if (cardbookUtils.isMyAccountReadOnly(myPrefId)) {
					wdw_cardbook.setElementLabelWithBundle('cardbookToolbarEditButton', "viewCardButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuEditCard', "viewCardButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('editCardFromCards', "viewCardButtonLabel");
				} else {
					wdw_cardbook.setElementLabelWithBundle('cardbookToolbarEditButton', "cardbookToolbarEditButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('cardbookContactsMenuEditCard', "cardbookToolbarEditButtonLabel");
					wdw_cardbook.setElementLabelWithBundle('editCardFromCards', "cardbookToolbarEditButtonLabel");
				}
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarEditButton', 'cardbookContactsMenuEditCard', 'editCardFromCards'], false);
			}
		},
	
		disableCardDeletion: function () {
			wdw_cardbook.enableOrDisableElement(['cardbookToolbarRemoveButton', 'cardbookContactsMenuRemoveCard', 'removeCardFromCards'], true);
		},
		
		disableCardCreation: function () {
			wdw_cardbook.enableOrDisableElement(['cardbookToolbarAddButton', 'cardbookContactsMenuAddCard', 'addCardFromCards'], true);
		},
		
		disableCardModification: function () {
			wdw_cardbook.enableOrDisableElement(['cardbookToolbarEditButton', 'cardbookContactsMenuEditCard', 'editCardFromCards'], true);
		},

		updateStatusProgressInformationField: function() {
			if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook') {
				if (cardbookRepository.statusInformation.length === 0) {
					wdw_cardbook.setElementLabel('totalMessageCount', "");
				} else {
					if (cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1][0] == cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1][0].substr(0,150)) {
						wdw_cardbook.setElementLabel('totalMessageCount', cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1][0]);
					} else {
						wdw_cardbook.setElementLabel('totalMessageCount', cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1][0].substr(0,147) + "...");
	
					}
				}
				document.getElementById("totalMessageCount").hidden=false;
			}
		},
	
		updateStatusInformation: function() {
			if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook' && cardbookRepository.cardbookSyncMode !== "SYNC") {
				var myTree = document.getElementById('accountsOrCatsTree');
				var strBundle = document.getElementById("cardbook-strings");
				if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					var myAccountId = cardbookRepository.cardbookSearchValue;
					if (cardbookRepository.cardbookDisplayCards[myAccountId]) {
						var myMessage = strBundle.getFormattedString("numberContactsFound", [cardbookRepository.cardbookDisplayCards[myAccountId].length]);
					} else {
						var myMessage = "";
					}
				} else {
					try {
						var myAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
						var myMessage = strBundle.getFormattedString("numberContacts", [cardbookRepository.cardbookDisplayCards[myAccountId].length]);
					}
					catch(e) {
						var myMessage = "";
					}
				}
				document.getElementById("statusText").hidden=false;
				document.getElementById("unreadMessageCount").hidden=true;
				wdw_cardbook.setElementLabel('statusText', myMessage);
			}
		},
	
		windowControlShowing: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarSyncButton', 'cardbookAccountMenuSyncs'], true);
				wdw_cardbook.disableCardCreation();
				wdw_cardbook.disableCardModification();
				wdw_cardbook.disableCardDeletion();
			} else {
				if (cardbookRepository.cardbookSyncMode === "SYNC") {
					wdw_cardbook.disableCardDeletion();
					wdw_cardbook.disableCardCreation();
					wdw_cardbook.disableCardModification();
					wdw_cardbook.enableOrDisableElement(['cardbookToolbarSyncButton', 'cardbookAccountMenuSyncs'], true);
				} else if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					wdw_cardbook.disableCardCreation();
					if (cardbookUtils.getSelectedCardsCount() >= 2 || cardbookUtils.getSelectedCardsCount() == 0) {
						wdw_cardbook.disableCardModification();
					} else {
						wdw_cardbook.enableCardModification();
					}
					if (cardbookUtils.getSelectedCardsCount() == 0) {
						wdw_cardbook.disableCardDeletion();
					} else {
						wdw_cardbook.enableCardDeletion();
					}
					wdw_cardbook.enableOrDisableElement(['cardbookToolbarSyncButton', 'cardbookAccountMenuSyncs'], !cardbookUtils.isThereNetworkAccountToSync());
				} else {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (myTree.currentIndex != -1) {
						var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
						if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
							if (cardbookUtils.isMyAccountReadOnly(myPrefId)) {
								wdw_cardbook.disableCardCreation();
								wdw_cardbook.disableCardDeletion();
							} else {
								wdw_cardbook.enableCardCreation();
								if (cardbookUtils.getSelectedCardsCount() == 0) {
									wdw_cardbook.disableCardDeletion();
								} else {
									wdw_cardbook.enableCardDeletion();
								}
							}
							if (cardbookUtils.getSelectedCardsCount() >= 2 || cardbookUtils.getSelectedCardsCount() == 0) {
								wdw_cardbook.disableCardModification();
							} else {
								wdw_cardbook.enableCardModification();
							}
						} else {
							wdw_cardbook.disableCardDeletion();
							wdw_cardbook.disableCardCreation();
							wdw_cardbook.disableCardModification();
						}
					} else {
						wdw_cardbook.disableCardDeletion();
						wdw_cardbook.disableCardCreation();
						wdw_cardbook.disableCardModification();
					}
					wdw_cardbook.enableOrDisableElement(['cardbookToolbarSyncButton', 'cardbookAccountMenuSyncs'], !cardbookUtils.isThereNetworkAccountToSync());
				}
			}

			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarAddServerButton', 'cardbookToolbarConfigurationButton', 'accountsOrCatsTreeContextMenu', 'cardsTreeContextMenu',
													'cardbookAccountMenu', 'cardbookContactsMenu', 'cardbookToolsMenu', 'cardbookToolbarComplexSearch', 'cardbookToolbarPrintButton'], true);
			} else {
				wdw_cardbook.enableOrDisableElement(['cardbookToolbarAddServerButton', 'cardbookToolbarConfigurationButton', 'accountsOrCatsTreeContextMenu', 'cardsTreeContextMenu',
													'cardbookAccountMenu', 'cardbookContactsMenu', 'cardbookToolsMenu', 'cardbookToolbarComplexSearch', 'cardbookToolbarPrintButton'], false);
			}
			wdw_cardbook.updateStatusInformation();
			wdw_cardbook.updateStatusProgressInformationField();
		},

		refreshWindow: function (aParams) {
			wdw_cardbook.clearCard();

			// get selected account
			var myAccountId = "";
			if (aParams && aParams.search(/^accountid:/) != -1) {
				myAccountId = aParams.replace(/^accountid:/, "");
			} else {
				var myTree = document.getElementById('accountsOrCatsTree');
				var mySelectedIndex = myTree.currentIndex;
				if (mySelectedIndex !== -1) {
					myAccountId = myTree.view.getCellText(mySelectedIndex, {id: "accountId"});
				} else {
					try {
						myAccountId = myTree.view.getCellText(0, {id: "accountId"});
					} catch (e) { return; }
				}
			}
			
			// get selected cards
			var listOfSelectedCard = [];
			if (aParams && aParams.search(/^cardid:/) != -1) {
				var myId = aParams.replace(/^cardid:/, "");
				if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					listOfSelectedCard.push(myId);
				} else {
					listOfSelectedCard.push(cardbookUtils.getAccountId(myAccountId) + myId.replace(/^(.*)::/, "::"));
				}
			} else {
				listOfSelectedCard = cardbookUtils.getSelectedCardsId();
			}
			
			wdw_cardbook.refreshAccountsInDirTree();
			
			// select account back
			wdw_cardbook.selectAccountOrCat(myAccountId, listOfSelectedCard);

			// for search mode and complex search mode, the reselection is done inside their functions
			if (cardbookRepository.cardbookSearchMode !== "SEARCH" && cardbookRepository.cardbookComplexSearchMode !== "SEARCH") {
				wdw_cardbook.sortCardsTreeCol();
	
				// select cards back
				var myTree = document.getElementById('cardsTree');
				cardbookUtils.setSelectedCards(listOfSelectedCard, myTree.boxObject.getFirstVisibleRow(), myTree.boxObject.getLastVisibleRow());
				listOfSelectedCard = cardbookUtils.getSelectedCardsId();
				if (listOfSelectedCard.length == 1) {
					if (cardbookRepository.cardbookCards[listOfSelectedCard[0]]) {
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[listOfSelectedCard[0]]);
					}
				}
			}
		}

	};
};
