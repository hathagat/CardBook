if ("undefined" == typeof(cardbookAutocomplete)) {
	var cardbookAutocomplete = {
		
		iconRuleStrings: {},
		celltextRuleStrings: {},
		textRuleStrings: {},
		
		defineMsgIconsRules: function () {
			cardbookAutocomplete.iconRuleStrings["local"] = {};
			cardbookAutocomplete.iconRuleStrings["local"]["LINUX"] = "treechildren::-moz-tree-image(local treecolAutoCompleteValue) {\
				margin-inline-start: 3px;\
				margin-inline-end: 2px;\
				list-style-image: url('chrome://messenger/skin/icons/server.png');\
				-moz-image-region: rect(0 48px 16px 32px);\
				}";
			cardbookAutocomplete.iconRuleStrings["local"]["WIN"] = "treechildren::-moz-tree-image(local treecolAutoCompleteValue) {\
				margin-inline-start: 2px;\
				margin-inline-end: 5px;\
				list-style-image: url('chrome://messenger/skin/icons/server.png');\
				-moz-image-region: rect(0 48px 16px 32px);\
				}";
			cardbookAutocomplete.iconRuleStrings["local"]["OSX"] = "treechildren::-moz-tree-image(local treecolAutoCompleteValue) {\
				margin-top: 2px;\
				margin-bottom: 2px;\
				margin-inline-start: 4px;\
				margin-inline-end: -1px;\
				list-style-image: url('chrome://messenger/skin/icons/server.png');\
				-moz-image-region: rect(0 48px 16px 32px);\
				}";

			cardbookAutocomplete.iconRuleStrings["remote"] = {};
			cardbookAutocomplete.iconRuleStrings["remote"]["LINUX"] = "treechildren::-moz-tree-image(remote treecolAutoCompleteValue) {\
				margin-inline-start: 3px;\
				margin-inline-end: 2px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/remote-addrbook.png');\
				}";
			cardbookAutocomplete.iconRuleStrings["remote"]["WIN"] = "treechildren::-moz-tree-image(remote treecolAutoCompleteValue) {\
				margin-inline-start: 2px;\
				margin-inline-end: 5px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/remote-addrbook.png');\
				}";
			cardbookAutocomplete.iconRuleStrings["remote"]["OSX"] = "treechildren::-moz-tree-image(remote treecolAutoCompleteValue) {\
				margin-top: 2px;\
				margin-bottom: 2px;\
				margin-inline-start: 4px;\
				margin-inline-end: -1px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/remote-addrbook.png');\
				}";
				
			cardbookAutocomplete.iconRuleStrings["standard-abook"] = {};
			cardbookAutocomplete.iconRuleStrings["standard-abook"]["LINUX"] = "treechildren::-moz-tree-image(standard-abook treecolAutoCompleteValue) {\
				margin-inline-start: 3px;\
				margin-inline-end: 2px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/addrbook.png');\
				}";
			cardbookAutocomplete.iconRuleStrings["standard-abook"]["WIN"] = "treechildren::-moz-tree-image(standard-abook treecolAutoCompleteValue) {\
				margin-inline-start: 2px;\
				margin-inline-end: 5px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/addrbook.png');\
				}";
			cardbookAutocomplete.iconRuleStrings["standard-abook"]["OSX"] = "treechildren::-moz-tree-image(standard-abook treecolAutoCompleteValue) {\
				margin-top: 2px;\
				margin-bottom: 2px;\
				margin-inline-start: 4px;\
				margin-inline-end: -1px;\
				list-style-image: url('chrome://messenger/skin/addressbook/icons/addrbook.png');\
				}";
		},

		createCssMsgIconsRules: function (aStyleSheet, aOSName) {
			var ruleIndex = aStyleSheet.insertRule(cardbookAutocomplete.iconRuleStrings["local"][aOSName], aStyleSheet.cssRules.length);
			var ruleIndex = aStyleSheet.insertRule(cardbookAutocomplete.iconRuleStrings["remote"][aOSName], aStyleSheet.cssRules.length);
			var ruleIndex = aStyleSheet.insertRule(cardbookAutocomplete.iconRuleStrings["standard-abook"][aOSName], aStyleSheet.cssRules.length);
		},

		createCssMsgAccountRules: function (aStyleSheet, aStyle, aColor, aOSName) {
			cardbookAutocomplete.celltextRuleStrings["LINUX"] = "treechildren::-moz-tree-cell-text(" + aStyle + ") {\
				}";
			cardbookAutocomplete.celltextRuleStrings["WIN"] = "treechildren::-moz-tree-cell-text(" + aStyle + ") {\
				}";
			cardbookAutocomplete.celltextRuleStrings["OSX"] = "treechildren::-moz-tree-cell-text(" + aStyle + ") {\
				margin-top: 2px;\
				margin-bottom: 2px;\
				margin-inline-start: 15px;\
				margin-inline-end: -3px;\
				border: none;\
				}";
			cardbookAutocomplete.textRuleStrings["LINUX"] = "treechildren::-moz-tree-cell(" + aStyle + ") {\
				background-color: " + aColor + ";\
				}";
			cardbookAutocomplete.textRuleStrings["WIN"] = "treechildren::-moz-tree-cell(" + aStyle + ") {\
				background-color: " + aColor + ";\
				}";
			cardbookAutocomplete.textRuleStrings["OSX"] = "treechildren::-moz-tree-cell(" + aStyle + ") {\
				background-color: " + aColor + ";\
				}";
			var ruleIndex = aStyleSheet.insertRule(cardbookAutocomplete.celltextRuleStrings[aOSName], aStyleSheet.cssRules.length);
			var ruleIndex = aStyleSheet.insertRule(cardbookAutocomplete.textRuleStrings[aOSName], aStyleSheet.cssRules.length);
		},

		loadCssRules: function () {
			try {
				if (navigator.appVersion.indexOf("Win")!=-1) {
					var OSName="WIN";
				} else if (navigator.appVersion.indexOf("Mac")!=-1) {
					var OSName="OSX";
				} else {
					var OSName="LINUX";
				}
				cardbookAutocomplete.defineMsgIconsRules();
				Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
				for (var prop in document.styleSheets) {
					var styleSheet = document.styleSheets[prop];
					if (styleSheet.href == "chrome://cardbook/skin/cardbookAutocomplete.css") {
						for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
							if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && cardbookRepository.cardbookAccounts[i][6] != "SEARCH") {
								var dirPrefId = cardbookRepository.cardbookAccounts[i][4];
								var cardbookPrefService = new cardbookPreferenceService(dirPrefId);
								var myColor = cardbookPrefService.getColor()
								var myStyle = cardbookRepository.getIconType(cardbookRepository.cardbookAccounts[i][6]) + " color_" + dirPrefId;
								cardbookAutocomplete.createCssMsgAccountRules(styleSheet, myStyle, myColor, OSName);
							}
						}
						cardbookAutocomplete.createCssMsgIconsRules(styleSheet, OSName);
						cardbookRepository.reloadCss(styleSheet.href);
					}
				}
			}
			catch (e) {}
		},

		setCompletion: function(aTextBox) {
			try {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				if (prefs.getBoolPref("extensions.cardbook.autocompletion")) {
					aTextBox.setAttribute('autocompletesearch', 'addrbook-cardbook');
				} else {
					aTextBox.setAttribute('autocompletesearch', 'addrbook ldap');
				}
				if (prefs.getBoolPref("extensions.cardbook.debugMode")) {
					aTextBox.showCommentColumn = true;
				} else {
					aTextBox.showCommentColumn = false;
				}
			} catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookAutocomplete.setCompletion error : " + e, "Error");
			};
		},

		setLightningCompletion: function() {
			cardbookAutocomplete.setCompletion(document.getElementById("attendeeCol3#1"));
		},

		setMsgCompletion: function() {
			cardbookAutocomplete.setCompletion(document.getElementById("addressCol2#1"));
		}

	};
};