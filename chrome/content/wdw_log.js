if ("undefined" == typeof(wdw_cardbooklog)) {
	var wdw_cardbooklog = {

		syncActivity : {},
		
		getTime: function() {
			var objToday = new Date();
			var year = objToday.getFullYear();
			var month = ("0" + (objToday.getMonth() + 1)).slice(-2);
			var day = ("0" + objToday.getDate()).slice(-2);
			var hour = ("0" + objToday.getHours()).slice(-2);
			var min = ("0" + objToday.getMinutes()).slice(-2);
			var sec = ("0" + objToday.getSeconds()).slice(-2);
			var msec = ("00" + objToday.getMilliseconds()).slice(-3);
			return year + "." + month + "." + day + " " + hour + ":" + min + ":" + sec + ":" + msec;
		},

		updateStatusProgressInformation: function(aLogLine, aErrorType) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var statusInformationLength = prefs.getComplexValue("extensions.cardbook.statusInformationLineNumber", Components.interfaces.nsISupportsString).data;
			
			if (cardbookRepository.statusInformation.length >= statusInformationLength) {
				cardbookRepository.statusInformation.shift();
			}
			if (aErrorType) {
				cardbookRepository.statusInformation.push([wdw_cardbooklog.getTime() + " : " + aLogLine, aErrorType]);
			} else {
				cardbookRepository.statusInformation.push([wdw_cardbooklog.getTime() + " : " + aLogLine, "Normal"]);
			}
			// var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			// consoleService.logStringMessage(wdw_cardbooklog.getTime() + " : " + aLogLine);
		},

		updateStatusProgressInformationWithDebug1: function(aLogLine, aResponse) {
			if (aResponse) {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var debugMode = prefs.getBoolPref("extensions.cardbook.debugMode");
				if (debugMode) {
					wdw_cardbooklog.updateStatusProgressInformation(aLogLine + aResponse.toSource());
				}
			}
		},

		updateStatusProgressInformationWithDebug2: function(aLogLine) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var debugMode = prefs.getBoolPref("extensions.cardbook.debugMode");
			if (debugMode) {
				wdw_cardbooklog.updateStatusProgressInformation(aLogLine);
			}
		},

		initSyncActivity: function(aDirPrefId, aDirPrefName) {
			var gActivityManager = Components.classes["@mozilla.org/activity-manager;1"].getService(Components.interfaces.nsIActivityManager);
			var process = Components.classes["@mozilla.org/activity-process;1"].createInstance(Components.interfaces.nsIActivityProcess);
			
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			var processName = strBundle.formatStringFromName("synchroRunning", [aDirPrefName], 1);

			process.init(processName, "CardBook");
			process.iconClass = "syncMail";
			process.groupingStyle = Components.interfaces.nsIActivity.GROUPING_STYLE_BYCONTEXT;
			process.contextDisplayText = aDirPrefName;
			process.contextType = aDirPrefId;
			
			gActivityManager.addActivity(process);

			if (!(wdw_cardbooklog.syncActivity[aDirPrefId] != null && wdw_cardbooklog.syncActivity[aDirPrefId] !== undefined && wdw_cardbooklog.syncActivity[aDirPrefId] != "")) {
				wdw_cardbooklog.syncActivity[aDirPrefId] = {};
			}
			wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess = process;
		},
		
		fetchSyncActivity: function(aDirPrefId, aCountDone, aCountTotal) {
			if (wdw_cardbooklog.syncActivity[aDirPrefId] && wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess) {
				var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				var processMessage = strBundle.formatStringFromName("synchroProcessed", [aCountDone, aCountTotal], 2);
				wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess.setProgress(processMessage, aCountDone, aCountTotal);
			}
		},
		
		finishSyncActivity: function(aDirPrefId, aDirPrefName) {
			if (wdw_cardbooklog.syncActivity[aDirPrefId] && wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess) {
				var gActivityManager = Components.classes["@mozilla.org/activity-manager;1"].getService(Components.interfaces.nsIActivityManager);
				wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess.state = Components.interfaces.nsIActivityProcess.STATE_COMPLETED;
				gActivityManager.removeActivity(wdw_cardbooklog.syncActivity[aDirPrefId].syncProcess.id);
			}
		},
			
		finishSyncActivityOK: function(aDirPrefId, aDirPrefName) {
			var gActivityManager = Components.classes["@mozilla.org/activity-manager;1"].getService(Components.interfaces.nsIActivityManager);
			wdw_cardbooklog.finishSyncActivity(aDirPrefId, aDirPrefName);
			if (wdw_cardbooklog.syncActivity[aDirPrefId].syncEvent) {
				if (gActivityManager.containsActivity(wdw_cardbooklog.syncActivity[aDirPrefId].syncEvent.id)) {
					gActivityManager.removeActivity(wdw_cardbooklog.syncActivity[aDirPrefId].syncEvent.id);
				}
			}
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			var eventName = strBundle.formatStringFromName("synchroFinished", [aDirPrefName], 1);
			var event = Components.classes["@mozilla.org/activity-event;1"].createInstance(Components.interfaces.nsIActivityEvent);
			event.init(eventName, null, "", null, Date.now());
			event.iconClass = "syncMail";
			gActivityManager.addActivity(event);
			wdw_cardbooklog.syncActivity[aDirPrefId].syncEvent = event;
		},
			
		addActivity: function(aMessageCode, aArray, aIcon) {
			var gActivityManager = Components.classes["@mozilla.org/activity-manager;1"].getService(Components.interfaces.nsIActivityManager);
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			var eventName = strBundle.formatStringFromName(aMessageCode, aArray, aArray.length);
			var event = Components.classes["@mozilla.org/activity-event;1"].createInstance(Components.interfaces.nsIActivityEvent);
			event.init(eventName, null, "", null, Date.now());
			event.iconClass = aIcon;// deleteMail addItem
			gActivityManager.addActivity(event);
		}
	}
};
