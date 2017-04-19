if ("undefined" == typeof(wdw_cardbookAskUser)) {
	var myAskUserObserver = {
		register: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(this, "cardbook.importConflictChoicePersist", false);
		},
		
		unregister: function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.removeObserver(this, "cardbook.importConflictChoicePersist");
		},
		
		observe: function(aSubject, aTopic, aData) {
			switch (aTopic) {
				case "cardbook.importConflictChoicePersist":
					wdw_cardbookAskUser.onChoicePersist();
					break;
			}
		}
	};

	var wdw_cardbookAskUser = {
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			myAskUserObserver.register();
			var strBundle = document.getElementById("cardbook-strings");
			document.title = strBundle.getString("askUserTitle");
			document.getElementById('messageLabel').value = window.arguments[0].message;
			document.getElementById('askUserButton1').label = strBundle.getString(window.arguments[0].button1 + "AskUserLabel");
			document.getElementById('askUserButton2').label = strBundle.getString(window.arguments[0].button2 + "AskUserLabel");
			if (window.arguments[0].button3 != null && window.arguments[0].button3 !== undefined && window.arguments[0].button3 != "") {
				document.getElementById('askUserButton3').label = strBundle.getString(window.arguments[0].button3 + "AskUserLabel");
				document.getElementById('askUserButton3').hidden = false;
			} else {
				document.getElementById('askUserButton3').hidden = true;
			}
			if (window.arguments[0].button4 != null && window.arguments[0].button4 !== undefined && window.arguments[0].button4 != "") {
				document.getElementById('askUserButton4').label = strBundle.getString(window.arguments[0].button4 + "AskUserLabel");
				document.getElementById('askUserButton4').hidden = false;
			} else {
				document.getElementById('askUserButton4').hidden = true;
			}
			if (window.arguments[0].confirmMessage != null && window.arguments[0].confirmMessage !== undefined && window.arguments[0].confirmMessage != "") {
				document.getElementById('confirmCheckBox').label = window.arguments[0].confirmMessage;
				document.getElementById('confirmCheckBox').checked = window.arguments[0].confirmValue;
				document.getElementById('confirmCheckBox').hidden = false;
			} else {
				document.getElementById('confirmCheckBox').hidden = true;
			}
		},

		fireButton: function (aButton) {
			var myButton = aButton.id.replace("askUser", "").toLowerCase(); 
			window.arguments[0].resultConfirm = document.getElementById('confirmCheckBox').checked;
			window.arguments[0].result = window.arguments[0][myButton];
			wdw_cardbookAskUser.close();
		},

		cancel: function () {
			window.arguments[0].result = "cancel";
			wdw_cardbookAskUser.close();
		},

		onChoicePersist: function () {
			if (cardbookRepository.importConflictChoicePersist) {
				window.arguments[0].resultConfirm = cardbookRepository.importConflictChoicePersist;
				window.arguments[0].result = cardbookRepository.importConflictChoice;
				wdw_cardbookAskUser.close();
			}
		},

		close: function () {
			myAskUserObserver.unregister();
			close();
		}

	};

};
