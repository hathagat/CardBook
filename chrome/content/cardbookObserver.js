if ("undefined" == typeof(cardbookObserver)) {
	
	var cardBookPrefObserver = {
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
				case "panesView":
					ovl_cardbookLayout.orientPanes();
					break;
				case "viewABPane":
				case "viewABContact":
					ovl_cardbookLayout.resizePanes();
					break;
				case "listTabView":
				case "mailPopularityTabView":
				case "technicalTabView":
				case "vcardTabView":
					wdw_cardbook.showCorrectTabs();
					break;
			}
		}
	};

	var cardbookObserver = {
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

			observerService.addObserver(this, "cardbook.DBOpen", false);
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

			observerService.removeObserver(this, "cardbook.DBOpen");
		},
		
		observe: function(aSubject, aTopic, aData) {
			switch (aTopic) {
				case "cardbook.catAddedIndirect":
					break;
				case "cardbook.cardAddedIndirect":
				case "cardbook.cardRemovedIndirect":
				case "cardbook.cardRemovedDirect":
				case "cardbook.cardModifiedIndirect":
				case "cardbook.syncRunning":
				case "cardbook.cardPasted":
				case "cardbook.cardDragged":
				case "cardbook.cardImportedFromFile":
					wdw_cardbook.refreshWindow();
					break;
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
					wdw_cardbook.refreshWindow(aData);
					break;
				case "cardbook.DBOpen":
					cardbookSynchronization.loadAccounts();
					if (wdw_cardbook) {
						wdw_cardbook.loadFirstWindow();
					}
					break;
			}
		}
	};
};
