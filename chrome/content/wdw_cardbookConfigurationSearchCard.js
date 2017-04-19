if ("undefined" == typeof(wdw_cardbookConfigurationSearchCard)) {
	var wdw_cardbookConfigurationSearchCard = {
		
		contactNotLoaded : true,

		removeContacts: function () {
			document.getElementById("contactMenulist").selectedIndex = 0;
			var myPopup = document.getElementById("contactMenupopup");
			while (myPopup.hasChildNodes()) {
				myPopup.removeChild(myPopup.firstChild);
			}
			wdw_cardbookConfigurationSearchCard.contactNotLoaded = true;
		},
				
		loadContacts: function () {
			if (wdw_cardbookConfigurationSearchCard.contactNotLoaded) {
				var myPopup = document.getElementById("contactMenupopup");
				var myAddressBookId = document.getElementById('addressbookMenulist').selectedItem.value;
				var menuItem = document.createElement("menuitem");
				menuItem.setAttribute("label", "");
				menuItem.setAttribute("value", "");
				myPopup.appendChild(menuItem);
				document.getElementById("contactMenulist").selectedIndex = 0;
				var mySortedContacts = [];
				for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAddressBookId].length; i++) {
					var myCard = cardbookRepository.cardbookDisplayCards[myAddressBookId][i];
					mySortedContacts.push([myCard.fn, myCard.uid]);
				}
				mySortedContacts = cardbookUtils.sortArrayByString(mySortedContacts,0,1);
				for (var i = 0; i < mySortedContacts.length; i++) {
					var menuItem = document.createElement("menuitem");
					menuItem.setAttribute("label", mySortedContacts[i][0]);
					menuItem.setAttribute("value", mySortedContacts[i][1]);
					myPopup.appendChild(menuItem);
				}
				wdw_cardbookConfigurationSearchCard.contactNotLoaded = false;
			}
		},
				
		changeAddressbook: function () {
			wdw_cardbookConfigurationSearchCard.removeContacts();
		},
				
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById("filenameLabel").value = window.arguments[0].filename
			cardbookElementTools.loadAddressBooks("addressbookMenupopup", "addressbookMenulist", null, true, false, true, false);
		},

		save: function () {
			if (document.getElementById('addressbookMenulist').selectedItem && document.getElementById('contactMenulist').selectedItem) {
				window.arguments[0].cardbookId = document.getElementById('addressbookMenulist').selectedItem.value+"::"+document.getElementById('contactMenulist').selectedItem.value;
			}
			window.arguments[0].filename=document.getElementById("filenameLabel").value;
			window.arguments[0].typeAction="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].typeAction="CANCEL";
			close();
		}

	};

};