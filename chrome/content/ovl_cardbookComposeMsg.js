if ("undefined" == typeof(ovl_cardbookComposeMsg)) {
	var myCardBookMsgObserver = {
		register: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(this, "cardbook.ABAddedDirect", false);
			observerService.addObserver(this, "cardbook.ABRemovedDirect", false);
			observerService.addObserver(this, "cardbook.ABModifiedDirect", false);
		},
		
		unregister: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.removeObserver(this, "cardbook.ABAddedDirect");
			observerService.removeObserver(this, "cardbook.ABRemovedDirect");
			observerService.removeObserver(this, "cardbook.ABModifiedDirect");
		},
		
		observe: function(aSubject, aTopic, aData) {
			switch (aTopic) {
				case "cardbook.ABAddedDirect":
				case "cardbook.ABRemovedDirect":
				case "cardbook.ABModifiedDirect":
					cardbookAutocomplete.loadCssRules();
					break;
			}
		}
	};

	var ovl_cardbookComposeMsg = {
		onIdentityChanged: function() {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var outerID = content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).outerWindowID;
			cardbookRepository.composeMsgIdentity[outerID] = document.getElementById("msgIdentity").selectedItem.getAttribute("identitykey");
			// this event is used only when the identity is changed, not for the initial start
			cardbookUtils.notifyObservers("cardbook.identityChanged", outerID);
		},

		newInCardBook: function() {
			try {
				var myNewCard = new cardbookCardParser();
				cardbookUtils.openEditionWindow(myNewCard, "CreateCard", "cardbook.cardAddedIndirect");
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "newInCardBook";
				prompts.alert(null, errorTitle, e);
			}
		},

		setAB: function() {
			document.getElementById("tasksMenuAddressBook").removeAttribute("key");
			document.getElementById("key_addressbook").setAttribute("key", "");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var exclusive = prefs.getBoolPref("extensions.cardbook.exclusive");
			var myPopup = document.getElementById("menu_NewPopup");
			if (exclusive) {
				document.getElementById('tasksMenuAddressBook').setAttribute('hidden', 'true');
				// this menu has no id, so we have to do manually
				myPopup.lastChild.remove();
			} else {
				document.getElementById('tasksMenuAddressBook').removeAttribute('hidden');
			}

			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			var myMenuItem = document.createElement("menuitem");
			myMenuItem.setAttribute("id", "newCardBookCardFromMsgMenu");
			myMenuItem.addEventListener("command", function(aEvent) {
					ovl_cardbookComposeMsg.newInCardBook();
					aEvent.stopPropagation();
				}, false);
			myMenuItem.setAttribute("label", strBundle.GetStringFromName("newCardBookCardMenuLabel"));
			myMenuItem.setAttribute("accesskey", strBundle.GetStringFromName("newCardBookCardMenuAccesskey"));
			myPopup.appendChild(myMenuItem);
		},

		loadMsg: function () {
			myCardBookMsgObserver.register();
			ovl_cardbookComposeMsg.setAB();
			cardbookAutocomplete.setMsgCompletion();
			cardbookAutocomplete.loadCssRules();
			window.removeEventListener('load', arguments.callee, true);
		}

	};
	
	// css should be loaded at the end
	window.addEventListener("load", function(e) { ovl_cardbookComposeMsg.loadMsg(); }, false);
	
	// for stopping the observer
	// don't know how to close the msg observer...
	// window.addEventListener("close", function(e) { ovl_cardbookComposeMsg.unloadMsg(); }, false);

};


// LoadIdentity
(function() {
	// Keep a reference to the original function.
	var _original = LoadIdentity;

	// Override a function.
	LoadIdentity = function() {
		// Execute original function.
		var rv = _original.apply(null, arguments);

		// Execute some action afterwards.
		ovl_cardbookComposeMsg.onIdentityChanged();

		// return the original result
		return rv;
	};

})();
