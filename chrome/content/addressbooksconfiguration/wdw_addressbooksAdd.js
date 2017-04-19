if ("undefined" == typeof(wdw_addressbooksAdd)) {
	var wdw_addressbooksAdd = {

		gType : "",
		gTypeFile : "",
		gFile : {},
		gFinishParams : [],
		gValidateURL : false,
		gValidateDescription : "Validation module",
		gStandardAddressbooks : [],
		
		loadWizard: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			let stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			let strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
			if (window.arguments[0].action == "first") {
				wdw_addressbooksAdd.gType = "STANDARD";
				wdw_addressbooksAdd.loadStandardAddressBooks();
				document.getElementById('addressbook-wizard').goTo("welcomePage");
			} else if (window.arguments[0].action == "search") {
				document.getElementById('addressbook-wizard').goTo("searchPage");
			} else {
				document.getElementById('addressbook-wizard').goTo("initialPage");
			}
		},

		loadStandardAddressBooks: function () {
			wdw_addressbooksAdd.gStandardAddressbooks = [];
			var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
			var contacts = contactManager.directories;
			while ( contacts.hasMoreElements() ) {
				var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
				if (contact.dirPrefId == "ldap_2.servers.history" && window.arguments[0].action == "first") {
					wdw_addressbooksAdd.gStandardAddressbooks.push([contact.dirPrefId, contact.dirName, true]);
				} else {
					wdw_addressbooksAdd.gStandardAddressbooks.push([contact.dirPrefId, contact.dirName, false]);
				}
			}
		},

		checkRequired: function () {
			var canAdvance = true;
			var curPage = document.getElementById('addressbook-wizard').currentPage;
			if (curPage) {
				let eList = curPage.getElementsByAttribute('required', 'true');
				for (let i = 0; i < eList.length && canAdvance; ++i) {
					canAdvance = (eList[i].value != "");
				}
				document.getElementById('addressbook-wizard').canAdvance = canAdvance;
			}
		},

		localPageCheckRequired: function () {
			var type = document.getElementById('localPageType').selectedItem.value;
			if (type == "createDB") {
				var curPage = document.getElementById('addressbook-wizard').currentPage;
				if (curPage) {
					document.getElementById('addressbook-wizard').canAdvance = true;
				}
			} else {
				wdw_addressbooksAdd.checkRequired();
			}
		},

		checkUrlLinesRequired: function () {
			for (var url in cardbookRepository.cardbookServerValidation) {
				wdw_addressbooksAdd.checkLinesRequired(cardbookRepository.cardbookServerValidation[url]);
			}
		},

		checkStandardLinesRequired: function () {
				wdw_addressbooksAdd.checkLinesRequired(wdw_addressbooksAdd.gStandardAddressbooks);
		},

		checkLinesRequired: function (aArray) {
			var canAdvance = true;
			var oneChecked = false;
			for (var i = 0; i < aArray.length; i++) {
				if (document.getElementById('namesCheckbox' + aArray[i][0])) {
					var aCheckbox = document.getElementById('namesCheckbox' + aArray[i][0]);
					var aAddressbookName = document.getElementById('namesTextbox' + aArray[i][0]);
					if (aCheckbox.checked) {
						oneChecked = true;
						 if (aAddressbookName.value == "") {
						 	 canAdvance = false;
						 	 break;
						 }
					}
				} else {
					break;
				}
			}
			document.getElementById('addressbook-wizard').canAdvance = (canAdvance && oneChecked);
		},

		initialAdvance: function () {
			var type = document.getElementById('addressbookType').selectedItem.value;
			var page = document.getElementsByAttribute('pageid', 'initialPage')[0];
			if (type == 'local') {
				page.next = 'localPage';
			} else if (type == 'remote') {
				page.next = 'remotePage';
			} else if (type == 'standard') {
				wdw_addressbooksAdd.gType = "STANDARD";
				wdw_addressbooksAdd.loadStandardAddressBooks();
				page.next = 'namesPage';
			} else if (type == 'search') {
				page.next = 'searchPage';
			}
		},

		localPageTypeSelect: function () {
			document.getElementById('localPageURI').value = "";
			wdw_addressbooksAdd.localPageCheckRequired();
		},

		localPageTypeAdvance: function () {
			var type = document.getElementById('localPageType').selectedItem.value;
			switch(type) {
				case "createDB":
					wdw_addressbooksAdd.gType = "LOCALDB";
					break;
				case "createDirectory":
					wdw_addressbooksAdd.gType = "DIRECTORY";
					wdw_addressbooksAdd.gTypeFile = "CREATEDIRECTORY";
					break;
				case "createFile":
					wdw_addressbooksAdd.gType = "FILE";
					wdw_addressbooksAdd.gTypeFile = "CREATEFILE";
					break;
				case "openDirectory":
					wdw_addressbooksAdd.gType = "DIRECTORY";
					wdw_addressbooksAdd.gTypeFile = "OPENDIRECTORY";
					break;
				case "openFile":
					wdw_addressbooksAdd.gType = "FILE";
					wdw_addressbooksAdd.gTypeFile = "OPENFILE";
					break;
			}
			var page = document.getElementsByAttribute('pageid', 'localPage')[0];
			page.next = 'namePage';
		},

		searchFile: function (aButton) {
			var type = document.getElementById('localPageType').selectedItem.value;
			switch(type) {
				case "createDirectory":
				case "openDirectory":
				case "standard":
					var myFile = cardbookUtils.callDirPicker("dirChooseTitle");
					break;
				case "createFile":
					var myFile = cardbookUtils.callFilePicker("fileCreationTitle", "SAVE", "VCF");
					break;
				case "openFile":
					var myFile = cardbookUtils.callFilePicker("fileSelectionTitle", "OPEN", "VCF");
					break;
			}

			if (myFile != null && myFile !== undefined && myFile != "") {
				var myTextBox = document.getElementById(aButton.id.replace("Button", ""));
				if (type == 'openFile' || type == 'createFile') {
					if (cardbookUtils.isFileAlreadyOpen(myFile.path)) {
						var strBundle = document.getElementById("cardbook-strings");
						var fileAlreadyOpenMsg = strBundle.getFormattedString("fileAlreadyOpen", [myFile.path]);
						var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
						prompts.alert(null, null, fileAlreadyOpenMsg);
						return;
					} else {
						myTextBox.value = myFile.path;
						wdw_addressbooksAdd.gFile = myFile;
					}
				} else {
					if (cardbookUtils.isDirectoryAlreadyOpen(myFile.path)) {
						var strBundle = document.getElementById("cardbook-strings");
						var directoryAlreadyOpenMsg = strBundle.getFormattedString("directoryAlreadyOpen", [myFile.path]);
						var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
						prompts.alert(null, null, directoryAlreadyOpenMsg);
						return;
					} else {
						myTextBox.value = myFile.path;
						wdw_addressbooksAdd.gFile = myFile;
					}
				}
			}
			wdw_addressbooksAdd.checkRequired();
		},

		checklocationNetwork: function () {
			document.getElementById('resultValidation').hidden = true;
			var canValidate = true;
			var curPage = document.getElementById('addressbook-wizard').currentPage;
			if (curPage) {
				if (wdw_addressbooksAdd.gValidateURL) {
					document.getElementById('addressbook-wizard').canAdvance = wdw_addressbooksAdd.gValidateURL;
				} else {
					document.getElementById('addressbook-wizard').canAdvance = wdw_addressbooksAdd.gValidateURL;
					let eList = curPage.getElementsByAttribute('required', 'true');
					for (let i = 0; i < eList.length && canValidate; ++i) {
						canValidate = (eList[i].value != "");
					}
					document.getElementById('validateButton').disabled = !canValidate;
				}
			}
		},

		remotePageTypeSelect: function () {
			wdw_addressbooksAdd.gValidateURL = false;
			document.getElementById('remotePageURI').value = "";
			document.getElementById('remotePageUsername').value = "";
			document.getElementById('remotePagePassword').value = "";
			
			var type = document.getElementById('remotePageType').selectedItem.value;
			if (type == 'GOOGLE') {
				document.getElementById('remotePageUriLabel').disabled=true;
				document.getElementById('remotePageURI').disabled=true;
				document.getElementById('remotePageURI').setAttribute('required', 'false');
				document.getElementById('remotePagePasswordLabel').disabled=true;
				document.getElementById('remotePagePassword').disabled=true;
				document.getElementById('remotePagePassword').setAttribute('required', 'false');
				document.getElementById('passwordCheckBox').disabled=true;
			} else if (type == 'APPLE') {
				document.getElementById('remotePageUriLabel').disabled=true;
				document.getElementById('remotePageURI').disabled=true;
				document.getElementById('remotePageURI').setAttribute('required', 'false');
				document.getElementById('remotePagePasswordLabel').disabled=false;
				document.getElementById('remotePagePassword').disabled=false;
				document.getElementById('remotePagePassword').setAttribute('required', 'true');
				document.getElementById('passwordCheckBox').disabled=false;
			} else {
				document.getElementById('remotePageUriLabel').disabled=false;
				document.getElementById('remotePageURI').disabled=false;
				document.getElementById('remotePageURI').setAttribute('required', 'true');
				document.getElementById('remotePagePasswordLabel').disabled=false;
				document.getElementById('remotePagePassword').disabled=false;
				document.getElementById('remotePagePassword').setAttribute('required', 'true');
				document.getElementById('passwordCheckBox').disabled=false;
			}
			wdw_addressbooksAdd.checklocationNetwork();
		},

		remotePageTextboxInput: function () {
			wdw_addressbooksAdd.gValidateURL = false;
			wdw_addressbooksAdd.checklocationNetwork();
		},

		remotePageTypeAdvance: function () {
			wdw_addressbooksAdd.gType = document.getElementById('remotePageType').selectedItem.value;
		},

		searchPageAdvance: function () {
			wdw_addressbooksAdd.gType = "SEARCH";
			wdw_addressbooksAdd.gTypeFile = cardbookComplexSearch.getSearch();
		},

		checkSearch: function () {
			cardbookComplexSearch.initComplexSearch(window.arguments[0].searchId);
			if (window.arguments[0].searchId != null && window.arguments[0].searchId !== undefined && window.arguments[0].searchId != "") {
				document.getElementById('addressbook-wizard').canAdvance = true;
			} else {
				document.getElementById('addressbook-wizard').canAdvance = false;
			}
			function checkTerms(event) {
				if (cardbookComplexSearch.getSearch() != "") {
					document.getElementById('addressbook-wizard').canAdvance = true;
				} else {
					document.getElementById('addressbook-wizard').canAdvance = false;
				}
			};
			document.getElementById('searchTerms').addEventListener("input", checkTerms, false);
			document.getElementById('searchTerms').addEventListener("command", checkTerms, false);
		},

		showPassword: function () {
			var passwordType = document.getElementById('remotePagePassword').type;
			if (passwordType != "password") {
				document.getElementById('remotePagePassword').type = "password";
			} else {
				document.getElementById('remotePagePassword').type = "";
			}
		},

		decodeURL: function (aURL) {
			var relative = aURL.match("(https?)(://[^/]*)/([^#?]*)");
			if (relative && relative[3]) {
				var relativeHrefArray = [];
				relativeHrefArray = relative[3].split("/");
				for (var i = 0; i < relativeHrefArray.length; i++) {
					relativeHrefArray[i] = decodeURIComponent(relativeHrefArray[i]);
				}
				return relative[1] + relative[2] + "/" + relativeHrefArray.join("/");
			} else {
				return aURL;
			}
		},

		validateURL: function () {
			document.getElementById('remotePageURI').value = wdw_addressbooksAdd.decodeURL(document.getElementById('remotePageURI').value.trim());
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
			document.getElementById('resultValidation').hidden = false;
			document.getElementById('validateButton').disabled = true;
			
			var type = document.getElementById('remotePageType').selectedItem.value;
			var username = document.getElementById('remotePageUsername').value;
			var password = document.getElementById('remotePagePassword').value;
			if (type == 'GOOGLE') {
				var url = cardbookRepository.cardbookgdata.GOOGLE_API;
			} else if (type == 'APPLE') {
				var url = cardbookRepository.APPLE_API;
			} else {
				var url = document.getElementById('remotePageURI').value;
			}
			
			if (cardbookSynchronization.getRootUrl(url) == "") {
				document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingURLFailedLabel") + " : " + url;
				return;
			}

			var dirPrefId = cardbookUtils.getUUID();
			if (type == 'GOOGLE') {
				cardbookSynchronization.initRefreshToken(dirPrefId);
				cardbookRepository.cardbookServerSyncRequest[dirPrefId]++;
				var connection = {connUser: username, connPrefId: dirPrefId, connDescription: wdw_addressbooksAdd.gValidateDescription};
				cardbookSynchronization.requestNewRefreshToken(connection);
				wdw_addressbooksAdd.waitForRefreshTokenFinished(dirPrefId);
			} else {
				wdw_addressbooksAdd.validateCardDAVURL(dirPrefId, url, username, password, type);
			}
		},

		validateCardDAVURL: function (aDirPrefId, aUrl, aUsername, aPassword, aType) {
			let cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			cardbookPrefService.setId(aDirPrefId);
			cardbookPrefService.setUrl(aUrl);

			cardbookPasswordManager.removeAccount(aUsername, aUrl);
			cardbookPasswordManager.addAccount(aUsername, aUrl, aPassword);
			
			cardbookSynchronization.initURLValidation(aDirPrefId);
			cardbookRepository.cardbookServerSyncRequest[aDirPrefId]++;
			var connection = {connUser: aUsername, connPrefId: aDirPrefId, connPrefIdType: aType, connUrl: aUrl, connDescription: wdw_addressbooksAdd.gValidateDescription};
			cardbookSynchronization.discoverPhase1(connection, "GETDISPLAYNAME");
			wdw_addressbooksAdd.waitForDiscoveryFinished(aDirPrefId, aUrl, aUsername, aPassword);
		},

		waitForDiscoveryFinished: function (aDirPrefId, aUrl, aUsername, aPassword, aType) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			lTimerDiscovery = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerDiscovery.initWithCallback({ notify: function(lTimerDiscovery) {
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryRequest : ", cardbookRepository.cardbookServerDiscoveryRequest[aDirPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryResponse : ", cardbookRepository.cardbookServerDiscoveryResponse[aDirPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryError : ", cardbookRepository.cardbookServerDiscoveryError[aDirPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerValidation : ", cardbookRepository.cardbookServerValidation);
						if (cardbookRepository.cardbookServerDiscoveryError[aDirPrefId] >= 1) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							document.getElementById('validateButton').disabled = false;
							cardbookSynchronization.finishMultipleOperations(aDirPrefId);
							let cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
							cardbookPrefService.delBranch();
							lTimerDiscovery.cancel();
						} else if (cardbookRepository.cardbookServerDiscoveryRequest[aDirPrefId] !== cardbookRepository.cardbookServerDiscoveryResponse[aDirPrefId] || cardbookRepository.cardbookServerDiscoveryResponse[aDirPrefId] === 0) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel") + " : " + cardbookRepository.cardbookServerDiscoveryResponse[aDirPrefId] + "/4";
						} else {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							wdw_addressbooksAdd.gValidateURL = false;
							// searching if ctag have been found
							for (var url in cardbookRepository.cardbookServerValidation) {
								for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
									document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationOKLabel");
									wdw_addressbooksAdd.gValidateURL = true;
									wdw_addressbooksAdd.checklocationNetwork();
									break;
								}
								var page = document.getElementsByAttribute('pageid', 'remotePage')[0];
								if (cardbookRepository.cardbookServerValidation[url].length > 1) {
									page.next = 'namesPage';
								} else {
									page.next = 'namePage';
								}
							}
							cardbookSynchronization.finishMultipleOperations(aDirPrefId);
							document.getElementById('validateButton').disabled = false;
							let cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
							cardbookPrefService.delBranch();
							lTimerDiscovery.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForRefreshTokenFinished: function (aPrefId) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			lTimerRefreshToken = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerRefreshToken.initWithCallback({ notify: function(lTimerRefreshToken) {
						if (cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId]  >= 1) {
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							lTimerRefreshToken.cancel();
							document.getElementById('validateButton').disabled = false;
						} else if (cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] !== 1) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
						} else {
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationOKLabel");
							document.getElementById('validateButton').disabled = false;
							wdw_addressbooksAdd.gValidateURL = true;
							wdw_addressbooksAdd.checklocationNetwork();
							lTimerRefreshToken.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		onSuccessfulAuthentication: function (aResponse) {
			var username = document.getElementById('remotePageUsername').value;
			cardbookPasswordManager.removeAccount(username);
			cardbookPasswordManager.addAccount(username, "", aResponse.refresh_token);
			var wizard = document.getElementById("addressbook-wizard");
			wizard.canAdvance = true;
			wizard.advance();
		},

		loadName: function () {
			var aTextbox = document.getElementById('namePageName');
			if (wdw_addressbooksAdd.gType == 'SEARCH') {
				document.getElementById('colorRow').setAttribute('hidden', 'true');
				document.getElementById('vcardVersionRow').setAttribute('hidden', 'true');
				document.getElementById('dateFormatRow').setAttribute('hidden', 'true');
				document.getElementById('readonlyRow').setAttribute('hidden', 'true');
				document.getElementById('urnuuidRow').setAttribute('hidden', 'true');
				if (window.arguments[0].searchId != null && window.arguments[0].searchId !== undefined && window.arguments[0].searchId != "") {
					var cardbookPrefService = new cardbookPreferenceService(window.arguments[0].searchId);
					aTextbox.value = cardbookPrefService.getName();
				}
			} else {
				document.getElementById('colorRow').removeAttribute('hidden');
				document.getElementById('vcardVersionRow').removeAttribute('hidden');
				document.getElementById('dateFormatRow').removeAttribute('hidden');
				document.getElementById('readonlyRow').removeAttribute('hidden');
				document.getElementById('urnuuidRow').removeAttribute('hidden');
				if (wdw_addressbooksAdd.gType == 'FILE' || wdw_addressbooksAdd.gType == 'DIRECTORY') {
					aTextbox.value = wdw_addressbooksAdd.gFile.leafName;
				} else if (wdw_addressbooksAdd.gType == 'GOOGLE') {
					aTextbox.value = document.getElementById('remotePageUsername').value;
				} else {
					for (var url in cardbookRepository.cardbookServerValidation) {
						aTextbox.value = cardbookUtils.undefinedToBlank(cardbookRepository.cardbookServerValidation[url][0][0]);
					}
				}
				var aTextbox = document.getElementById('serverColorInput');
				aTextbox.value = cardbookUtils.randomColor(100);
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var dateFormatMenu = prefs.getComplexValue("extensions.cardbook.dateFormatMenu", Components.interfaces.nsISupportsString).data;
				cardbookElementTools.loadDateFormats("dateFormatMenuPopup", "dateFormatMenuList", dateFormatMenu);
			}
			wdw_addressbooksAdd.checkRequired();
		},

		deleteBoxes: function () {
			var aListRows = document.getElementById('namesRows');
			var childNodes = aListRows.childNodes;
			var toDelete = [];
			for (var i = 0; i < childNodes.length; i++) {
				var child = childNodes[i];
				if (child.getAttribute('id') != "headersRow") {
					toDelete.push(child);
				}
			}
			for (var i = 0; i < toDelete.length; i++) {
				var oldChild = aListRows.removeChild(toDelete[i]);
			}
		},

		createBoxes: function (aId, aName, aCallback) {
			var aListRows = document.getElementById('namesRows');
			var aRow = document.createElement('row');
			aListRows.appendChild(aRow);
			aRow.setAttribute('id', 'namesRow' + aId);
			aRow.setAttribute('flex', '1');
			
			var aCheckbox = document.createElement('checkbox');
			aRow.appendChild(aCheckbox);
			aCheckbox.setAttribute('checked', true);
			aCheckbox.setAttribute('id', 'namesCheckbox' + aId);
			aCheckbox.addEventListener("command", function() {
					var aTextBox = document.getElementById('namesTextbox' + this.id.replace("namesCheckbox",""));
					if (this.checked) {
						aTextBox.setAttribute('required', true);
					} else {
						aTextBox.setAttribute('required', false);
					}
					aCallback();
				}, false);

			var aTextbox = document.createElement('textbox');
			aRow.appendChild(aTextbox);
			aTextbox.setAttribute('id', 'namesTextbox' + aId);
			aTextbox.setAttribute('flex', '1');
			aTextbox.setAttribute('required', true);
			aTextbox.value = aName;
			aTextbox.addEventListener("input", function() {
					aCallback();
				}, false);

			var aColorbox =  document.createElementNS("http://www.w3.org/1999/xhtml","input");
			aRow.appendChild(aColorbox);
			aColorbox.setAttribute('id', 'serverColorInput' + aId);
			aColorbox.setAttribute('class', "small-margin");
			aColorbox.setAttribute('type', "color");
			aColorbox.value = cardbookUtils.randomColor(100);
			
			var aMenuList = document.createElement('menulist');
			aRow.appendChild(aMenuList);
			aMenuList.setAttribute('id', 'vCardVersionPageName' + aId);
			var aMenuPopup = document.createElement('menupopup');
			aMenuList.appendChild(aMenuPopup);
			aMenuPopup.setAttribute('id', 'vCardVersionPageNameMenupopup' + aId);
			var aMenuItem = document.createElement('menuitem');
			aMenuPopup.appendChild(aMenuItem);
			aMenuItem.setAttribute('id', 'vCardVersionPageNameMenuitem3' + aId);
			aMenuItem.setAttribute('label', '3.0');
			aMenuItem.setAttribute('value', '3.0');
			var aMenuItem = document.createElement('menuitem');
			aMenuPopup.appendChild(aMenuItem);
			aMenuItem.setAttribute('id', 'vCardVersionPageNameMenuitem4' + aId);
			aMenuItem.setAttribute('label', '4.0');
			aMenuItem.setAttribute('value', '4.0');
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var cardCreationVersion = prefs.getComplexValue("extensions.cardbook.cardCreationVersion", Components.interfaces.nsISupportsString).data;
			if (cardCreationVersion == "3.0") {
				aMenuList.selectedIndex = 0;
			} else {
				aMenuList.selectedIndex = 1;
			}

			var aMenuList = document.createElement('menulist');
			aRow.appendChild(aMenuList);
			aMenuList.setAttribute('id', 'dateFormatMenuList' + aId);
			var aMenuPopup = document.createElement('menupopup');
			aMenuList.appendChild(aMenuPopup);
			aMenuPopup.setAttribute('id', 'dateFormatMenuPopup' + aId);
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var dateFormatMenu = prefs.getComplexValue("extensions.cardbook.dateFormatMenu", Components.interfaces.nsISupportsString).data;
			cardbookElementTools.loadDateFormats(aMenuPopup.id, aMenuList.id, dateFormatMenu);

			var aCheckbox1 = document.createElement('checkbox');
			aRow.appendChild(aCheckbox1);
			aCheckbox1.setAttribute('checked', false);
			aCheckbox1.setAttribute('id', 'readonlyCheckbox' + aId);
			var aCheckbox2 = document.createElement('checkbox');
			aRow.appendChild(aCheckbox2);
			aCheckbox2.setAttribute('checked', false);
			aCheckbox2.setAttribute('id', 'urnuuidCheckbox' + aId);
		},

		loadNames: function () {
			wdw_addressbooksAdd.deleteBoxes();
			for (var url in cardbookRepository.cardbookServerValidation) {
				for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
					wdw_addressbooksAdd.createBoxes(cardbookRepository.cardbookServerValidation[url][i][0], cardbookRepository.cardbookServerValidation[url][i][0], wdw_addressbooksAdd.checkUrlLinesRequired);
				}
			}
			for (var i = 0; i < wdw_addressbooksAdd.gStandardAddressbooks.length; i++) {
				wdw_addressbooksAdd.createBoxes(wdw_addressbooksAdd.gStandardAddressbooks[i][0], wdw_addressbooksAdd.gStandardAddressbooks[i][1], wdw_addressbooksAdd.checkStandardLinesRequired);
			}
			wdw_addressbooksAdd.checkUrlLinesRequired();
			wdw_addressbooksAdd.checkStandardLinesRequired();
		},

		namesAdvance: function () {
			var page = document.getElementsByAttribute('pageid', 'namesPage')[0];
			wdw_addressbooksAdd.createAddressbook();
			if (wdw_addressbooksAdd.gFinishParams.length > 1) {
				page.next = 'finishsPage';
			} else {
				page.next = 'finishPage';
			}
		},

		locationFirstAdvance: function () {
			var page = document.getElementsByAttribute('pageid', 'locationFirstPage')[0];
			wdw_addressbooksAdd.createAddressbook();
			if (wdw_addressbooksAdd.gFinishParams.length > 1) {
				page.next = 'finishsPage';
			} else {
				page.next = 'finishPage';
			}
		},

		createAddressbook: function () {
			var username = document.getElementById('remotePageUsername').value;

			if (wdw_addressbooksAdd.gType == 'SEARCH') {
				var name = document.getElementById('namePageName').value;
				var color = document.getElementById('serverColorInput').value;
				var vCardVersion = document.getElementById('vCardVersionPageName').value;
				var dirPrefId = cardbookUtils.getUUID();
				if (window.arguments[0].searchId != null && window.arguments[0].searchId !== undefined && window.arguments[0].searchId != "") {
					dirPrefId = window.arguments[0].searchId;
					var cardbookPrefService = new cardbookPreferenceService(window.arguments[0].searchId);
					var enabled = cardbookPrefService.getEnabled();
				} else {
					var enabled = true;
				}
				wdw_addressbooksAdd.gFinishParams.push({searchDef: wdw_addressbooksAdd.gTypeFile, name: name, username: "", color: color, vcard: vCardVersion, enabled: enabled, dirPrefId: dirPrefId, DBcached: false});
			} else if (wdw_addressbooksAdd.gType == 'GOOGLE') {
				var url = cardbookRepository.cardbookgdata.GOOGLE_API;
				var name = document.getElementById('namePageName').value;
				var color = document.getElementById('serverColorInput').value;
				var vCardVersion = document.getElementById('vCardVersionPageName').value;
				var readonly = document.getElementById('readonlyPageName').checked;
				var dateFormat = document.getElementById('dateFormatMenuList').value;
				var urnuuid = document.getElementById('urnuuidPageName').checked;
				var dirPrefId = cardbookUtils.getUUID();
				wdw_addressbooksAdd.gFinishParams.push({url: url, name: name, username: username, color: color, vcard: vCardVersion, readonly: readonly, dirPrefId: dirPrefId, dateFormat: dateFormat,
															urnuuid: urnuuid, DBcached: true});
			} else if (wdw_addressbooksAdd.gType == 'APPLE') {
				var url = cardbookRepository.APPLE_API;
				var name = document.getElementById('namePageName').value;
				var color = document.getElementById('serverColorInput').value;
				var vCardVersion = document.getElementById('vCardVersionPageName').value;
				var readonly = document.getElementById('readonlyPageName').checked;
				var dateFormat = document.getElementById('dateFormatMenuList').value;
				var urnuuid = document.getElementById('urnuuidPageName').checked;
				var dirPrefId = cardbookUtils.getUUID();
				wdw_addressbooksAdd.gFinishParams.push({url: url, name: name, username: username, color: color, vcard: vCardVersion, readonly: readonly, dirPrefId: dirPrefId, dateFormat: dateFormat,
															urnuuid: urnuuid, DBcached: true});
			} else if (wdw_addressbooksAdd.gType == 'CARDDAV') {
				for (var url in cardbookRepository.cardbookServerValidation) {
					if (cardbookRepository.cardbookServerValidation[url].length > 1) {
						for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
							var aCheckbox = document.getElementById('namesCheckbox' + cardbookRepository.cardbookServerValidation[url][i][0]);
							if (aCheckbox.checked) {
								var dirPrefId = cardbookUtils.getUUID();
								var aAddressbookName = document.getElementById('namesTextbox' + cardbookRepository.cardbookServerValidation[url][i][0]).value;
								var aAddressbookColor = document.getElementById('serverColorInput' + cardbookRepository.cardbookServerValidation[url][i][0]).value;
								var aAddressbookVCard = document.getElementById('vCardVersionPageName' + cardbookRepository.cardbookServerValidation[url][i][0]).value;
								var aAddressbookReadOnly = document.getElementById('readonlyCheckbox' + cardbookRepository.cardbookServerValidation[url][i][0]).checked;
								var aAddressbookDateFormat = document.getElementById('dateFormatMenuList' + cardbookRepository.cardbookServerValidation[url][i][0]).value;
								var aAddressbookUrnuuid = document.getElementById('urnuuidCheckbox' + cardbookRepository.cardbookServerValidation[url][i][0]).checked;
								wdw_addressbooksAdd.gFinishParams.push({url: cardbookRepository.cardbookServerValidation[url][i][1], name: aAddressbookName, username: username, color: aAddressbookColor, 
																		vcard: aAddressbookVCard, readonly: aAddressbookReadOnly, dirPrefId: dirPrefId, dateFormat: aAddressbookDateFormat,
																		urnuuid: aAddressbookUrnuuid, DBcached: true});
							}
						}
					} else {
						var url = document.getElementById('remotePageURI').value;
						var name = document.getElementById('namePageName').value;
						var color = document.getElementById('serverColorInput').value;
						var vCardVersion = document.getElementById('vCardVersionPageName').value;
						var readonly = document.getElementById('readonlyPageName').checked;
						var dateFormat = document.getElementById('dateFormatMenuList').value;
						var urnuuid = document.getElementById('urnuuidPageName').checked;
						var dirPrefId = cardbookUtils.getUUID();
						wdw_addressbooksAdd.gFinishParams.push({url: url, name: name, username: username, color: color, vcard: vCardVersion, readonly: readonly, dirPrefId: dirPrefId, dateFormat: dateFormat,
																	urnuuid: urnuuid, DBcached: true});
					}
				}
			} else if (wdw_addressbooksAdd.gType == 'STANDARD') {
				for (var i = 0; i < wdw_addressbooksAdd.gStandardAddressbooks.length; i++) {
					var aCheckbox = document.getElementById('namesCheckbox' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]);
					if (aCheckbox.checked) {
						var aAddressbookId = cardbookUtils.getUUID();
						var aAddressbookName = document.getElementById('namesTextbox' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).value;
						var aAddressbookColor = document.getElementById('serverColorInput' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).value;
						var aAddressbookVCard = document.getElementById('vCardVersionPageName' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).value;
						var aAddressbookReadOnly = document.getElementById('readonlyCheckbox' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).checked;
						var aAddressbookDateFormat = document.getElementById('dateFormatMenuList' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).value;
						var aAddressbookUrnuuid = document.getElementById('urnuuidCheckbox' + wdw_addressbooksAdd.gStandardAddressbooks[i][0]).checked;
						wdw_addressbooksAdd.gFinishParams.push({sourceDirPrefId: wdw_addressbooksAdd.gStandardAddressbooks[i][0],
																name: aAddressbookName, username: "", color: aAddressbookColor, vcard: aAddressbookVCard, readonly: aAddressbookReadOnly, 
																dirPrefId: aAddressbookId, collected: wdw_addressbooksAdd.gStandardAddressbooks[i][2], dateFormat: aAddressbookDateFormat,
																urnuuid: aAddressbookUrnuuid, DBcached: true});
					}
				}
			} else if (wdw_addressbooksAdd.gType == 'LOCALDB') {
				var name = document.getElementById('namePageName').value;
				var color = document.getElementById('serverColorInput').value;
				var vCardVersion = document.getElementById('vCardVersionPageName').value;
				var readonly = document.getElementById('readonlyPageName').checked;
				var dateFormat = document.getElementById('dateFormatMenuList').value;
				var urnuuid = document.getElementById('urnuuidPageName').checked;
				var dirPrefId = cardbookUtils.getUUID();
				wdw_addressbooksAdd.gFinishParams.push({name: name, username: "", color: color, vcard: vCardVersion, readonly: readonly, dirPrefId: dirPrefId, dateFormat: dateFormat,
															urnuuid: urnuuid, DBcached: true});
			} else if (wdw_addressbooksAdd.gType == 'FILE' || wdw_addressbooksAdd.gType == 'DIRECTORY') {
				var dirname = document.getElementById('localPageURI').value;
				var name = document.getElementById('namePageName').value;
				var color = document.getElementById('serverColorInput').value;
				var vCardVersion = document.getElementById('vCardVersionPageName').value;
				var readonly = document.getElementById('readonlyPageName').checked;
				var dateFormat = document.getElementById('dateFormatMenuList').value;
				var urnuuid = document.getElementById('urnuuidPageName').checked;
				var dirPrefId = cardbookUtils.getUUID();
				wdw_addressbooksAdd.gFinishParams.push({actionType: wdw_addressbooksAdd.gTypeFile, file: wdw_addressbooksAdd.gFile, dirname: dirname, name: name, username: "", 
														color: color, vcard: vCardVersion, readonly: readonly, dirPrefId: dirPrefId, dateFormat: dateFormat, urnuuid: urnuuid, DBcached: false});
			}
		},

		setCanRewindFalse: function () {
			document.getElementById('addressbook-wizard').canRewind = false;
		},

		cancelWizard: function () {
			wdw_addressbooksAdd.gType = "";
			wdw_addressbooksAdd.closeWizard();
		},

		closeWizard: function () {
			document.getElementById('addressbook-wizard').canAdvance = false;
			window.arguments[0].serverCallback(wdw_addressbooksAdd.gType, wdw_addressbooksAdd.gFinishParams);
		},

	};

};