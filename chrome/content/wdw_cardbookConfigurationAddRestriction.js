if ("undefined" == typeof(wdw_cardbookConfigurationAddRestriction)) {
	var wdw_cardbookConfigurationAddRestriction = {
		
		loadInclExcl: function () {
			cardbookElementTools.loadInclExcl("typeMenupopup", "typeMenulist", window.arguments[0].includeCode);
		},
		
		loadMailAccounts: function () {
			cardbookElementTools.loadMailAccounts("mailAccountMenupopup", "mailAccountMenulist", window.arguments[0].emailAccountId, true);
		},
		
		loadAB: function () {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			cardbookElementTools.loadAddressBooks("CardBookABMenupopup", "CardBookABMenulist", window.arguments[0].addressBookId, prefs.getBoolPref("extensions.cardbook.exclusive"), false, true, false);
		},
		
		loadCategories: function () {
			var ABList = document.getElementById('CardBookABMenulist');
			if (ABList.value != null && ABList.value !== undefined && ABList.value != "") {
				var ABDefaultValue = ABList.value;
			} else {
				var ABDefaultValue = 0;
			}
			cardbookElementTools.loadCategories("categoryMenupopup", "categoryMenulist", ABDefaultValue, window.arguments[0].categoryId, false, false, false, true);
		},
		
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_cardbookConfigurationAddRestriction.loadInclExcl();
			wdw_cardbookConfigurationAddRestriction.loadMailAccounts();
			wdw_cardbookConfigurationAddRestriction.loadAB();
			wdw_cardbookConfigurationAddRestriction.loadCategories();
		},

		save: function () {
			window.arguments[0].emailAccountId=document.getElementById('mailAccountMenulist').selectedItem.value;
			window.arguments[0].emailAccountName=document.getElementById('mailAccountMenulist').selectedItem.label;
			window.arguments[0].addressBookId=document.getElementById('CardBookABMenulist').selectedItem.value;
			window.arguments[0].addressBookName=document.getElementById('CardBookABMenulist').selectedItem.label;
			window.arguments[0].categoryId=document.getElementById('categoryMenulist').selectedItem.value;
			window.arguments[0].categoryName=document.getElementById('categoryMenulist').selectedItem.label;
			window.arguments[0].includeName=document.getElementById('typeMenulist').selectedItem.label;
			window.arguments[0].includeCode=document.getElementById('typeMenulist').selectedItem.value;
			window.arguments[0].typeAction="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].typeAction="CANCEL";
			close();
		}

	};

};