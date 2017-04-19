if ("undefined" == typeof(ovl_synchro)) {
	var ovl_synchro = {

		lTimerSync: null,
		
		lEventTimerSync : { notify: function(lTimerSync) {
			if (!cardbookRepository.firstLoad) {
				let stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				let strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				cardbookRepository.cardbookUncategorizedCards = strBundle.GetStringFromName("uncategorizedCards");
				cardbookRepository.cardbookCollectedCards = strBundle.GetStringFromName("collectedCards");
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				cardbookRepository.preferEmailPref = prefs.getBoolPref("extensions.cardbook.preferEmailPref");
	
				// migration functions (should be removed)
				// removed : cardbookRepository.setSolveConflicts();
				// removed : cardbookRepository.setTypes();
				cardbookRepository.loadCustoms();
				
				// observers are needed not only UI but also for synchro
				// there is no unregister launched
				cardBookPrefObserver.register();
				cardbookObserver.register();
				
				// once openDB is finished, it will fire an event
				// and then load the cache and maybe sync the accounts
				cardbookIndexedDB.openDB();
				cardbookRepository.firstLoad = true;
			}
			}
		},
		
		runBackgroundSync: function () {
			ovl_synchro.lTimerSync = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			ovl_synchro.lTimerSync.initWithCallback(ovl_synchro.lEventTimerSync, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		}

	};

	// need to launch it a bit later
	ovl_synchro.runBackgroundSync();

};
