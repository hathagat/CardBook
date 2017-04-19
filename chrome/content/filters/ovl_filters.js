if ("undefined" == typeof(ovl_filters)) {
	var ovl_filters = {
		
		_isLocalSearch: function(aSearchScope) {
			switch (aSearchScope) {
				case Components.interfaces.nsMsgSearchScope.offlineMail:
				case Components.interfaces.nsMsgSearchScope.offlineMailFilter:
				case Components.interfaces.nsMsgSearchScope.onlineMailFilter:
				case Components.interfaces.nsMsgSearchScope.localNews:
					return true;
				default:
					return false;
				}
		},

		_addEmails: function(aMsgHdrs, aActionValue, aField) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
			if (!cardbookUtils.isMyAccountEnabled(aActionValue)) {
				loader.loadSubScript("chrome://cardbook/content/wdw_log.js");
				cardbookUtils.formatStringForOutput("errorFiltersAddEmailsABNotEnabled", [aField, aActionValue], "Error");
				return;
			}
			
			loader.loadSubScript("chrome://cardbook/content/preferences/cardbookPreferences.js");
			let count = aMsgHdrs.length;
			for (var i = 0; i < count; i++) {
				let hdr = aMsgHdrs.queryElementAt(i, Components.interfaces.nsIMsgDBHdr);
				var addresses = {}, names = {}, fullAddresses = {};
				MailServices.headerParser.parseHeadersWithArray(hdr[aField], addresses, names, fullAddresses);
				for (var j = 0; j < addresses.value.length; j++) {
					cardbookRepository.addCardFromDisplayAndEmail(aActionValue, names.value[j], addresses.value[j], "");
				}
			}
		},

		_matchEmails: function(aMsgHdrEmails, aSearchValue, aSearchOp) {
			Components.utils.import("resource:///modules/jsmime.jsm");
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
			if (!cardbookUtils.isMyAccountEnabled(aSearchValue)) {
				loader.loadSubScript("chrome://cardbook/content/wdw_log.js");
				cardbookUtils.formatStringForOutput("errorFiltersMatchEmailsABNotEnabled", [aSearchValue], "Error");
				return false;
			}
			var addresses = {}, names = {}, fullAddresses = {};
			MailServices.headerParser.parseHeadersWithArray(aMsgHdrEmails, addresses, names, fullAddresses);
			var matches = false;
			for (var i = 0; i < addresses.value.length; i++) {
				switch (aSearchOp) {
					case Components.interfaces.nsMsgSearchOp.IsInAB:
					case Components.interfaces.nsMsgSearchOp.IsntInAB:
						if (i === 0) {
							if (cardbookRepository.isEmailInPrefIdRegistered(aSearchValue, addresses.value[i])) {
								matches = true;
							} else {
								matches = false;
							}
						} else { 
							if (cardbookRepository.isEmailInPrefIdRegistered(aSearchValue, addresses.value[i])) {
								matches = (matches && true);
							} else {
								matches = (matches && false);
							}
						}
						break;
					default:
						Components.utils.reportError("invalid search operator : " + aSearchOp);
				}
			}
			if (aSearchOp == Components.interfaces.nsMsgSearchOp.IsntInAB) {
				return !matches;
			}
			return matches;
		},

		onLoad: function () {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");

			var searchFrom = {
				id: "cardbook#searchFrom",
				name: strBundle.GetStringFromName("cardbook.searchFrom.name"),
				getEnabled: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				needsBody: false,
				getAvailable: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				getAvailableOperators: function (scope, length) {
					if (!ovl_filters._isLocalSearch(scope)) {
						length.value = 0;
						return [];
					}
					length.value = 2;
					return [Components.interfaces.nsMsgSearchOp.IsInAB, Components.interfaces.nsMsgSearchOp.IsntInAB];
				},
				match: function (aMsgHdr, aSearchValue, aSearchOp) {
					return ovl_filters._matchEmails(aMsgHdr.author, aSearchValue, aSearchOp);
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomTerm(searchFrom);

			var searchTo = {
				id: "cardbook#searchTo",
				name: strBundle.GetStringFromName("cardbook.searchTo.name"),
				getEnabled: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				needsBody: false,
				getAvailable: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				getAvailableOperators: function (scope, length) {
					if (!ovl_filters._isLocalSearch(scope)) {
						length.value = 0;
						return [];
					}
					length.value = 2;
					return [Components.interfaces.nsMsgSearchOp.IsInAB, Components.interfaces.nsMsgSearchOp.IsntInAB];
				},
				match: function (aMsgHdr, aSearchValue, aSearchOp) {
					return ovl_filters._matchEmails(aMsgHdr.recipients, aSearchValue, aSearchOp);
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomTerm(searchTo);

			var searchCc = {
				id: "cardbook#searchCc",
				name: strBundle.GetStringFromName("cardbook.searchCc.name"),
				getEnabled: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				needsBody: false,
				getAvailable: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				getAvailableOperators: function (scope, length) {
					if (!ovl_filters._isLocalSearch(scope)) {
						length.value = 0;
						return [];
					}
					length.value = 2;
					return [Components.interfaces.nsMsgSearchOp.IsInAB, Components.interfaces.nsMsgSearchOp.IsntInAB];
				},
				match: function (aMsgHdr, aSearchValue, aSearchOp) {
					return ovl_filters._matchEmails(aMsgHdr.ccList, aSearchValue, aSearchOp);
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomTerm(searchCc);

			var searchBcc = {
				id: "cardbook#searchBcc",
				name: strBundle.GetStringFromName("cardbook.searchBcc.name"),
				getEnabled: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				needsBody: false,
				getAvailable: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				getAvailableOperators: function (scope, length) {
					if (!ovl_filters._isLocalSearch(scope)) {
						length.value = 0;
						return [];
					}
					length.value = 2;
					return [Components.interfaces.nsMsgSearchOp.IsInAB, Components.interfaces.nsMsgSearchOp.IsntInAB];
				},
				match: function (aMsgHdr, aSearchValue, aSearchOp) {
					return ovl_filters._matchEmails(aMsgHdr.bccList, aSearchValue, aSearchOp);
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomTerm(searchBcc);

			var searchAll = {
				id: "cardbook#searchAll",
				name: strBundle.GetStringFromName("cardbook.searchAll.name"),
				getEnabled: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				needsBody: false,
				getAvailable: function (scope, op) {
					return ovl_filters._isLocalSearch(scope);
				},
				getAvailableOperators: function (scope, length) {
					if (!ovl_filters._isLocalSearch(scope)) {
						length.value = 0;
						return [];
					}
					length.value = 2;
					return [Components.interfaces.nsMsgSearchOp.IsInAB, Components.interfaces.nsMsgSearchOp.IsntInAB];
				},
				// true && false => false
				// true || false => true
				match: function (aMsgHdr, aSearchValue, aSearchOp) {
					return (ovl_filters._matchEmails(aMsgHdr.author, aSearchValue, aSearchOp) ||
							ovl_filters._matchEmails(aMsgHdr.recipients, aSearchValue, aSearchOp) ||
							ovl_filters._matchEmails(aMsgHdr.ccList, aSearchValue, aSearchOp) ||
							ovl_filters._matchEmails(aMsgHdr.bccList, aSearchValue, aSearchOp));
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomTerm(searchAll);

			var addFrom = {
				id: "cardbook#addFrom",
				name: strBundle.GetStringFromName("cardbook.addFrom.name"),
				isValidForType: function(type, scope) {return true;},
				validateActionValue: function(value, folder, type) { return null;},
				allowDuplicates: true,
				needsBody: false,
				apply: function (aMsgHdrs, aActionValue, aListener, aType, aMsgWindow) {
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "author");
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomAction(addFrom);

			var addTo = {
				id: "cardbook#addTo",
				name: strBundle.GetStringFromName("cardbook.addTo.name"),
				isValidForType: function(type, scope) {return true;},
				validateActionValue: function(value, folder, type) { return null;},
				allowDuplicates: true,
				needsBody: false,
				apply: function (aMsgHdrs, aActionValue, aListener, aType, aMsgWindow) {
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "recipients");
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomAction(addTo);

			var addCc = {
				id: "cardbook#addCc",
				name: strBundle.GetStringFromName("cardbook.addCc.name"),
				isValidForType: function(type, scope) {return true;},
				validateActionValue: function(value, folder, type) { return null;},
				allowDuplicates: true,
				needsBody: false,
				apply: function (aMsgHdrs, aActionValue, aListener, aType, aMsgWindow) {
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "ccList");
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomAction(addCc);

			var addBcc = {
				id: "cardbook#addBcc",
				name: strBundle.GetStringFromName("cardbook.addBcc.name"),
				isValidForType: function(type, scope) {return true;},
				validateActionValue: function(value, folder, type) { return null;},
				allowDuplicates: true,
				needsBody: false,
				apply: function (aMsgHdrs, aActionValue, aListener, aType, aMsgWindow) {
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "bccList");
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomAction(addBcc);

			var addAll = {
				id: "cardbook#addAll",
				name: strBundle.GetStringFromName("cardbook.addAll.name"),
				isValidForType: function(type, scope) {return true;},
				validateActionValue: function(value, folder, type) { return null;},
				allowDuplicates: true,
				needsBody: false,
				apply: function (aMsgHdrs, aActionValue, aListener, aType, aMsgWindow) {
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "author");
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "recipients");
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "ccList");
					ovl_filters._addEmails(aMsgHdrs, aActionValue, "bccList");
				}
			};
			var filterService = Components.classes["@mozilla.org/messenger/services/filters;1"].getService(Components.interfaces.nsIMsgFilterService);
			filterService.addCustomAction(addAll);

			window.removeEventListener('load', arguments.callee, true);
		}

	}
};

window.addEventListener("load", function(e) { ovl_filters.onLoad(e); }, false);
