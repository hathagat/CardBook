if ("undefined" == typeof(ovl_birthdays)) {  
	var ovl_birthdays = {
		lTimerPopup : null,
		lPopupShowed : 0,
		lEventTimerPopup : { notify: function(lTimerPopup) {
			if (cardbookBirthdaysUtils.getPref("extensions.cardbook.showPeriodicPopup")) {
				var popupTime = cardbookBirthdaysUtils.getPref("extensions.cardbook.periodicPopupIime");
				var dateOfToday = new Date();
				var dateOfTodayHour = (dateOfToday.getHours()<10?'0':'') + dateOfToday.getHours();
				var dateOfTodayMin = (dateOfToday.getMinutes()<10?'0':'') + dateOfToday.getMinutes();
				var checkTime = dateOfTodayHour.toString() + dateOfTodayMin.toString();
		
				var EmptyParamRegExp1 = new RegExp("(.*)([^0-9])(.*)", "ig");
				if (popupTime.replace(EmptyParamRegExp1, "$1")!=popupTime) {
					var checkPopupHour = popupTime.replace(EmptyParamRegExp1, "$1");
					var checkPopupMin = popupTime.replace(EmptyParamRegExp1, "$3");
					if (checkPopupHour < 10 && checkPopupHour.length == 1) {
						checkPopupHour = "0" + checkPopupHour;
					}
					if (checkPopupMin < 10 && checkPopupMin.length == 1) {
						checkPopupMin = "0" + checkPopupMin;
					}
					var checkPopupTime = checkPopupHour.toString() + checkPopupMin.toString();
				}
				
				if ((checkTime == checkPopupTime) && (ovl_birthdays.lPopupShowed == 0)) {
					ovl_birthdays.lPopupShowed++;
					ovl_birthdays.onShowPopup();
				} else if ((ovl_birthdays.lPopupShowed > 0) && (ovl_birthdays.lPopupShowed < 8)) {
					ovl_birthdays.lPopupShowed++;
				} else {
					ovl_birthdays.lPopupShowed=0;
				}
			}
		} },
	
		onLoad: function() {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			if (cardbookBirthdaysUtils.getPref("extensions.cardbook.showPopupOnStartup")) {
				ovl_birthdays.onShowPopup();
			}
			
			if (cardbookBirthdaysUtils.getPref("extensions.cardbook.syncWithLightningOnStartup")) {
				Components.utils.import("resource://gre/modules/AddonManager.jsm");  
				AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, ovl_birthdays.displaySyncListAddon);
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
	
		displaySyncListAddon: function(addon) {
			if (addon && addon.isActive) {
				cardbookBirthdaysUtils.syncWithLightning();
			}
		},
	
		displaySyncList: function() {
			var MyWindows = window.openDialog("chrome://cardbook/content/birthdays/wdw_birthdaySync.xul", "", "chrome,centerscreen,modal,resizable");
		},
	
		onShowPopup: function() {
			var maxDaysUntilNextBirthday = cardbookBirthdaysUtils.getPref("extensions.cardbook.numberOfDaysForSearching");
			cardbookBirthdaysUtils.loadBirthdays(maxDaysUntilNextBirthday);
			var lshowPopupEvenIfNoBirthday = cardbookBirthdaysUtils.getPref("extensions.cardbook.showPopupEvenIfNoBirthday");
			if ((cardbookBirthdaysUtils.lBirthdayList.length>0) || lshowPopupEvenIfNoBirthday) {
				ovl_birthdays.displayBirthdayList();
			}
		}
	};
	
	ovl_birthdays.lTimerPopup = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	ovl_birthdays.lTimerPopup.initWithCallback(ovl_birthdays.lEventTimerPopup, 10000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
}