function cardbookListConversion(aEmails) {
	this.emailResult = [];
	this.recursiveList = [];
	this._convert(aEmails);
}

cardbookListConversion.prototype = {
	_verifyRecursivity: function (aList) {
		for (var i = 0; i < this.recursiveList.length; i++) {
			if (this.recursiveList[i] == aList) {
				cardbookUtils.formatStringForOutput("errorInfiniteLoopRecursion", [this.recursiveList.toSource()], "Error");
				return false;
			}
		}
		this.recursiveList.push(aList);
		return true;
	},
	
	_getEmails: function (aCard, aPrefEmails) {
		if (aCard.isAList) {
			var myList = aCard.fn;
			if (this._verifyRecursivity(myList)) {
				this._convert(MailServices.headerParser.makeMimeAddress(myList, myList));
			}
		} else {
			var listOfEmail = []
			listOfEmail = cardbookUtils.getMimeEmailsFromCards([aCard]).join(", ");
			if (listOfEmail != "") {
				this.emailResult.push(listOfEmail);
			}
		}
	},
	
	_convert: function (aEmails) {
		Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
		var addresses = {}, names = {}, fullAddresses = {};
		MailServices.headerParser.parseHeadersWithArray(aEmails, addresses, names, fullAddresses);
		for (var i = 0; i < addresses.value.length; i++) {
			if (addresses.value[i].indexOf("@") > 0) {
				this.emailResult.push(MailServices.headerParser.makeMimeAddress(names.value[i], addresses.value[i]));
			} else {
				for (j in cardbookRepository.cardbookCards) {
					var myCard = cardbookRepository.cardbookCards[j];
					if (myCard.fn == names.value[i]) {
						this.recursiveList.push(names.value[i]);
						if (myCard.version == "4.0") {
							for (var k = 0; k < myCard.member.length; k++) {
								var uid = myCard.member[k].replace("urn:uuid:", "");
								if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+uid]) {
									var myTargetCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+uid];
									this._getEmails(myTargetCard);
								}
							}
						} else if (myCard.version == "3.0") {
							var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
							var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
							for (var k = 0; k < myCard.others.length; k++) {
								var localDelim1 = myCard.others[k].indexOf(":",0);
								if (localDelim1 >= 0) {
									var header = myCard.others[k].substr(0,localDelim1);
									var trailer = myCard.others[k].substr(localDelim1+1,myCard.others[k].length);
									if (header == memberCustom) {
										if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")]) {
											var myTargetCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")];
											this._getEmails(myTargetCard);
										}
									}
								}
							}
						}
					break;
					}
				}
			}
		}
	}
};
				
if ("undefined" == typeof(ovl_list)) {
	var ovl_list = {
		expandRecipientsFromCardBook: function () {
			Components.utils.import("resource:///modules/jsmime.jsm");
			var myFields = window.gMsgCompose.compFields;
			var listToCollect = ["replyTo", "to", "cc", "fcc", "bcc", "followupTo"];
			for (var i = 0; i < listToCollect.length; i++) {
				if (myFields[listToCollect[i]]) {
					if (myFields[listToCollect[i]] != null && myFields[listToCollect[i]] !== undefined && myFields[listToCollect[i]] != "") {
						var myConversion = new cardbookListConversion(myFields[listToCollect[i]]);
						myFields[listToCollect[i]] = cardbookRepository.arrayUnique(myConversion.emailResult).join(", ");
					}
				}
			}
		}
		
	}
};

// expandRecipients
(function() {
	// Keep a reference to the original function.
	var _original = expandRecipients;
	
	// Override a function.
	expandRecipients = function() {
		// Execute original function.
		var rv = _original.apply(null, arguments);
		
		// Execute some action afterwards.
		ovl_list.expandRecipientsFromCardBook();

		// return the original result
		return rv;
	};

})();

// updateSendLock
(function() {
	// Keep a reference to the original function.
	var _original = updateSendLock;
	
	// Override a function.
	updateSendLock = function() {
		// Execute original function.
		// var rv = _original.apply(null, arguments);
		
		// Execute some action afterwards.
		// if (!gSendLocked) {
		// 	let inputValue = awGetInputElement(row).value.trim();
		// 	ovl_list.mailListNameExistsInCardBook(inputValue.replace(/ *<.*>/, ""));
		// }
        // 
		// return the original result
		gSendLocked = false;
		// return rv;
	};

})();

