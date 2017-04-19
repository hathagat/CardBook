if ("undefined" == typeof(wdw_migrate)) {
	var wdw_migrate = {

		translateStandardCards: function (aDirPrefIdTarget, aDirPrefIdTargetName, aABCard, aMode) {
			try {
				var myCard = new cardbookCardParser();
				myCard.dirPrefId = aDirPrefIdTarget;
				cardbookUtils.setCardUUID(myCard);
				myCard.version = "3.0";
				var myMap = [ ["FirstName", "firstname"], ["LastName", "lastname"], ["DisplayName", "fn"], ["NickName", "nickname"], ["JobTitle", "title"], ["Notes", "note"] ];
				for (var i = 0; i < myMap.length; i++) {
					var myMapData = aABCard.getProperty(myMap[i][0],"");
					myCard[myMap[i][1]] = myMapData;
				}
				var myDep = aABCard.getProperty("Department","");
				var myOrg = aABCard.getProperty("Company","");
				if (myDep != "") {
					if (myOrg != "") {
						myCard.org = myDep + " - " + myOrg;
					} else {
						myCard.org = myDep;
					}
				} else {
					if (myOrg != "") {
						myCard.org = myOrg;
					}
				}
				
				var myListMap = [ ["PrimaryEmail", ["TYPE=PREF" , "TYPE=HOME"] , "email"], ["SecondEmail", ["TYPE=HOME"], "email"], ["WorkPhone", ["TYPE=WORK"], "tel"], ["HomePhone", ["TYPE=HOME"], "tel"],
								  ["FaxNumber", ["TYPE=FAX"], "tel"], ["PagerNumber", ["TYPE=PAGER"], "tel"], ["CellularNumber", ["TYPE=CELL"], "tel"], ["WebPage1", ["TYPE=WORK"], "url"],
								  ["WebPage2", ["TYPE=HOME"], "url"] ];
				for (var i = 0; i < myListMap.length; i++) {
					var myMapData = aABCard.getProperty(myListMap[i][0],"");
					if (myMapData != "") {
						myCard[myListMap[i][2]].push([[myMapData], myListMap[i][1], "", []]);
					}
				}

				var myAdrMap = [ [ [ ["HomeAddress", "HomeAddress2"], "HomeCity", "HomeState", "HomeZipCode", "HomeCountry"], ["TYPE=HOME"] ],
								 [ [ ["WorkAddress", "WorkAddress2"], "WorkCity", "WorkState", "WorkZipCode", "WorkCountry"], ["TYPE=WORK"] ] ];
				for (var i = 0; i < myAdrMap.length; i++) {
					var lString = "";
					var myAdr = ["", ""];
					for (var j = 0; j < myAdrMap[i][0][0].length; j++) {
						var myProp = aABCard.getProperty(myAdrMap[i][0][0][j],"");
						if (myProp != "") {
							if (lString != "") {
								lString = lString + "\n" + myProp;
							} else { 
								lString = myProp;
							}
						}
					}
					myAdr.push(lString);
					for (var j = 1; j < myAdrMap[i][0].length; j++) {
						myAdr.push(aABCard.getProperty(myAdrMap[i][0][j],""));
					}
					if (cardbookUtils.notNull(myAdr, "") != "") {
						myCard.adr.push([myAdr, myAdrMap[i][1], "", []]);
					}
				}
				
				var day = aABCard.getProperty("BirthDay", "");
				if (! isNaN(day) && day.length == 1) {
					day = "0" + day;
				}
				var month = aABCard.getProperty("BirthMonth", "");
				if (! isNaN(month) && month.length == 1) {
					month = "0" + month;
				}
				var year = aABCard.getProperty("BirthYear", "");
				if (year != "") {
					if (day != "") {
						myCard.bday = year + "-" + month + "-" + day;
					} else { 
						myCard.bday = year;
					}
				} else {
					if (day != "") {
						myCard.bday = month + "-" + day;
					}
				}

				var photoURI = aABCard.getProperty("PhotoURI", "");
				var photoType = aABCard.getProperty("PhotoType", "");
				if (photoType == "file") {
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURI = ioService.newURI(photoURI, null, null);
					var myFileURIArray = photoURI.split(".");
					myCard.photo.extension = cardbookUtils.getExtension(photoURI);
					myCard.photo.value = cardbookSynchronization.getFileBinary(myFileURI);
				} else if (photoType == "web") {
					myCard.photo.extension = cardbookUtils.getExtension(photoURI);
					myCard.photo.URI = photoURI;
				}
				wdw_migrate.getNotNullFn(myCard, aABCard);
				
				cardbookUtils.setCalculatedFields(myCard);
				cardbookRepository.addCardToRepository(myCard, aMode);
				cardbookUtils.formatStringForOutput("cardCreatedOK", [aDirPrefIdTargetName, myCard.fn]);
				wdw_cardbooklog.addActivity("cardCreatedOK", [aDirPrefIdTargetName, myCard.fn], "addItem");

				var email = aABCard.getProperty("PrimaryEmail", "");
				var emailValue = aABCard.getProperty("PopularityIndex", "0");
				if (email != "" && emailValue != "0") {
					cardbookRepository.cardbookMailPopularityIndex[email] = emailValue;
				}
							
				cardbookRepository.cardbookServerSyncDone[aDirPrefIdTarget]++;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_migrate.translateStandardCards error : " + e, "Error");
				cardbookRepository.cardbookServerSyncError[aDirPrefIdTarget]++;
				cardbookRepository.cardbookServerSyncDone[aDirPrefIdTarget]++;
			}
		},

		translateStandardLists: function (aDirPrefIdTarget, aDirPrefIdTargetName, aABList, aMode) {
			try {
				var myCard = new cardbookCardParser();
				myCard.dirPrefId = aDirPrefIdTarget;
				cardbookUtils.setCardUUID(myCard);
				myCard.version = "3.0";
				var myMap = [ ["dirName", "fn"], ["listNickName", "nickname"], ["description", "note"] ];
				for (var i = 0; i < myMap.length; i++) {
					myCard[myMap[i][1]] = aABList[myMap[i][0]];
				}
				var myTargetMembers = [];
				for (var i = 0; i < aABList.addressLists.length; i++) {
					var myABCard = aABList.addressLists.queryElementAt(i, Components.interfaces.nsIAbCard);
					var myEmail = myABCard.primaryEmail.toLowerCase();
					try {
						if (cardbookRepository.cardbookCardEmails[aDirPrefIdTarget][myEmail]) {
							var myTargetCard = cardbookRepository.cardbookCardEmails[aDirPrefIdTarget][myEmail][0];
							myTargetMembers.push(["urn:uuid:" + myTargetCard.uid, myTargetCard.fn]);
						}
					}
					catch (e) {}
				}
				cardbookUtils.parseLists(myCard, myTargetMembers, "group");

				cardbookUtils.setCalculatedFields(myCard);
				cardbookRepository.addCardToRepository(myCard, aMode);
				cardbookUtils.formatStringForOutput("cardCreatedOK", [aDirPrefIdTargetName, myCard.fn]);
				wdw_cardbooklog.addActivity("cardCreatedOK", [aDirPrefIdTargetName, myCard.fn], "addItem");
				cardbookRepository.cardbookServerSyncDone[aDirPrefIdTarget]++;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_migrate.translateStandardLists error : " + e, "Error");
				cardbookRepository.cardbookServerSyncError[aDirPrefIdTarget]++;
				cardbookRepository.cardbookServerSyncDone[aDirPrefIdTarget]++;
			}
		},

		getNotNullFn: function (aCard, aABCard) {
			try {
				if (aCard.fn != "") {
					return;
				}
				if (aCard.org != "") {
					aCard.fn = aCard.org;
					return;
				}
				if (aCard.lastname != "") {
					aCard.fn = aCard.lastname;
					return;
				}
				if (aCard.firstname != "") {
					aCard.fn = aCard.firstname;
					return;
				}
				var myEmail = aABCard.getProperty("PrimaryEmail", "");
				if (myEmail != "") {
					var myTmpArray = myEmail.split("@");
					aCard.fn = myTmpArray[0].replace(/\./g, " ");
					return;
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_migrate.getNotNullFn error : " + e, "Error");
			}
		},

		importCards: function (aDirPrefIdSource, aDirPrefIdTarget, aDirPrefIdTargetName, aMode) {
			var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
			var contacts = contactManager.directories;
			while ( contacts.hasMoreElements() ) {
				var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
				if (contact.dirPrefId == aDirPrefIdSource) {
					var abCardsEnumerator = contact.childCards;
					while (abCardsEnumerator.hasMoreElements()) {
						var myABCard = abCardsEnumerator.getNext();
						myABCard = myABCard.QueryInterface(Components.interfaces.nsIAbCard);
						if (!myABCard.isMailList) {
							cardbookRepository.cardbookServerSyncTotal[aDirPrefIdTarget]++;
							wdw_migrate.translateStandardCards(aDirPrefIdTarget, aDirPrefIdTargetName, myABCard, aMode);
						}
					}
					var abCardsEnumerator = contact.childCards;
					while (abCardsEnumerator.hasMoreElements()) {
						var myABCard = abCardsEnumerator.getNext();
						myABCard = myABCard.QueryInterface(Components.interfaces.nsIAbCard);
						if (myABCard.isMailList) {
							var myABList = contactManager.getDirectory(myABCard.mailListURI);
							cardbookRepository.cardbookServerSyncTotal[aDirPrefIdTarget]++;
							wdw_migrate.translateStandardLists(aDirPrefIdTarget, aDirPrefIdTargetName, myABList, aMode);
						}
					}
					break;
				}
			}	
			cardbookMailPopularity.writeMailPopularity();
			cardbookRepository.cardbookDirResponse[aDirPrefIdTarget]++;
		}
		
	};

};