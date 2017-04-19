if ("undefined" == typeof(ovl_collected)) {
	var ovl_collected = {
		
		collectToCardBook: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			Components.utils.import("resource:///modules/jsmime.jsm");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : start of emails collection : " + emailsCollection);
			if (emailsCollection != "") {
				var emailsCollectionCat = prefs.getComplexValue("extensions.cardbook.emailsCollectionCat", Components.interfaces.nsISupportsString).data;
				var myFields = gMsgCompose.compFields;
				var listToCollect = ["replyTo", "to", "cc", "fcc", "bcc", "followupTo"];
				for (var i = 0; i < listToCollect.length; i++) {
					if (myFields[listToCollect[i]]) {
						if (myFields[listToCollect[i]] != null && myFields[listToCollect[i]] !== undefined && myFields[listToCollect[i]] != "") {
							var emailsCollectionList = [];
							emailsCollectionList = emailsCollection.split(',');
							var addresses = {}, names = {}, fullAddresses = {};
							MailServices.headerParser.parseHeadersWithArray(myFields[listToCollect[i]], addresses, names, fullAddresses);
							for (var j = 0; j < addresses.value.length; j++) {
								if (!cardbookRepository.isEmailRegistered(addresses.value[j])) {
									for (var k = 0; k < emailsCollectionList.length; k++) {
										var dirPrefIdName = cardbookUtils.getPrefNameFromPrefId(emailsCollectionList[k]);
										wdw_cardbooklog.updateStatusProgressInformationWithDebug2(dirPrefIdName + " : debug mode : trying to collect contact " + addresses.value[j]);
										cardbookRepository.addCardFromDisplayAndEmail(emailsCollectionList[k], names.value[j], addresses.value[j], emailsCollectionCat);
									}
								}
								cardbookMailPopularity.updateMailPopularity(addresses.value[j]);
							}
						}
					}
				}
			} else {
				var myFields = gMsgCompose.compFields;
				var listToCollect = ["replyTo", "to", "cc", "fcc", "bcc", "followupTo"];
				for (var i = 0; i < listToCollect.length; i++) {
					if (myFields[listToCollect[i]]) {
						if (myFields[listToCollect[i]] != null && myFields[listToCollect[i]] !== undefined && myFields[listToCollect[i]] != "") {
							var emailsCollectionList = [];
							emailsCollectionList = emailsCollection.split(',');
							var addresses = {}, names = {}, fullAddresses = {};
							MailServices.headerParser.parseHeadersWithArray(myFields[listToCollect[i]], addresses, names, fullAddresses);
							for (var j = 0; j < addresses.value.length; j++) {
								cardbookMailPopularity.updateMailPopularity(addresses.value[j]);
							}
						}
					}
				}
			}
		}

	}
};

window.addEventListener("compose-send-message", function(e) { ovl_collected.collectToCardBook(e); }, true);
