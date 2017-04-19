if ("undefined" == typeof(ovl_lightningAttendees)) {
	var myCardBookLightningObserver = {
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

	var ovl_lightningAttendees = {
		onLoad: function() {
			myCardBookLightningObserver.register();
			cardbookAutocomplete.setLightningCompletion();
			cardbookAutocomplete.loadCssRules();
			window.removeEventListener('load', arguments.callee, true);
		}
	}
};
window.addEventListener("load", function(e) { ovl_lightningAttendees.onLoad(e); }, false);
