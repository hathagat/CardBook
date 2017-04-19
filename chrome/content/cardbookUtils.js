if ("undefined" == typeof(cardbookUtils)) {
	var cardbookUtils = {
		
		jsInclude: function(files, target) {
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			for (var i = 0; i < files.length; i++) {
				try {
					loader.loadSubScript(files[i], target);
				}
				catch(e) {
					loader.loadSubScript("chrome://cardbook/content/wdw_log.js");
					wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
					dump("cardbookUtils.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
				}
			}
		},

	formatTelForOpenning: function (aString) {
		return aString.replace(/\s*/g, "");
	},

	formatIMPPForOpenning: function (aString) {
		return aString.replace(/\s*/g, "");
	},

	formatExtension: function (aExtension, aVersion) {
			switch (aExtension) {
				case "JPG":
				case "jpg":
					aExtension = "jpeg";
					break;
				case "TIF":
				case "tif":
					aExtension = "tiff";
					break;
				case "":
					aExtension = "jpeg";
			}
			if (aVersion == "4.0") {
				aExtension = aExtension.toLowerCase();
			} else {
				aExtension = aExtension.toUpperCase();
			}
			return aExtension;
		},

		cleanCategories: function (aCategoryList) {
			function filterCategories(element) {
				return (element != cardbookRepository.cardbookUncategorizedCards);
			}
			return cardbookRepository.arrayUnique(aCategoryList.filter(filterCategories));
		},

		formatCategories: function (aCategoryList) {
			return cardbookUtils.sortArrayByString(aCategoryList,-1,1).join("    ");
		},

		formatAddress: function (aAddress) {
			function appendElement(aResult, aArrayElement) {
				var myElement = "";
				for (var i = 0; i < aArrayElement.length; i++) {
					if (aArrayElement[i] != null && aArrayElement[i] !== undefined && aArrayElement[i] != "") {
						if (myElement == "") {
							myElement = aArrayElement[i];
						} else {
							myElement = myElement + " " + aArrayElement[i];
						}
					}
				}
				var myResultTemp = myElement.trim();
				if (myResultTemp != "") {
					if (aResult == "") {
						aResult = myResultTemp;
					} else {
						aResult = aResult + "\r\n" + myResultTemp;
					}
				}
				return aResult;
			};
			var myResult = "";
			myResult = appendElement(myResult, [aAddress[0], aAddress[1]]);
			myResult = appendElement(myResult, [aAddress[2]]);
			myResult = appendElement(myResult, [aAddress[3], aAddress[4], aAddress[5]]);
			myResult = appendElement(myResult, [aAddress[6]]);
			return myResult;
		},

		updateCategoryMenulist: function (aPanel) {
			var strBundle = document.getElementById("cardbook-strings");
			let myMenulist = document.getElementById(aPanel.id.replace("Panel", "Menulist"));
			
			let label;
			let categoryList = aPanel.categories;
			if (categoryList.length > 1) {
				label = strBundle.getString("multipleCategories");
			} else if (categoryList.length == 1) {
				label = categoryList[0];
			} else {
				label = strBundle.getString("None");
			}
			myMenulist.setAttribute("label", label);
		},

		contains: function (aArray, aValue) {
			for (var i = 0; i < aArray.length; i++) {
				if (aArray[i] === aValue) {
					return true;
				}
			}
			return false;
		},
		
		sumElements: function (aObject) {
			var sum = 0;
			for (var i in aObject) {
				sum = sum + aObject[i];
			}
			return sum;
		},
		
		sortArrayByString: function (aArray, aIndex, aInvert) {
			Components.utils.import("resource://gre/modules/Services.jsm");
			if (Services.locale.getApplicationLocale) {
				var collator = Components.classes["@mozilla.org/intl/collation-factory;1"].getService(Components.interfaces.nsICollationFactory).CreateCollation(Services.locale.getApplicationLocale());
			} else {
				var collator = Components.classes["@mozilla.org/intl/collation-factory;1"].getService(Components.interfaces.nsICollationFactory).CreateCollation();
			}
			function compare1(a, b) { return collator.compareString(0, a[aIndex], b[aIndex])*aInvert; };
			function compare2(a, b) { return collator.compareString(0, a, b)*aInvert; };
			if (aIndex != -1) {
				return aArray.sort(compare1);
			} else {
				return aArray.sort(compare2);
			}
		},
		
		sortArrayByNumber: function (aArray, aIndex, aInvert) {
			function compare1(a, b) { return (a[aIndex] - b[aIndex])*aInvert; };
			function compare2(a, b) { return (a - b)*aInvert; };
			if (aIndex != -1) {
				return aArray.sort(compare1);
			} else {
				return aArray.sort(compare2);
			}
		},
		
		arrayUnique2D: function (aArray) {
			for (var i=0; i<aArray.length; i++) {
				var listI = aArray[i];
				loopJ: for (var j=0; j<aArray.length; j++) {
					var listJ = aArray[j];
					if (listI === listJ) continue; //Ignore itself
					for (var k=listJ.length; k>=0; k--) {
						if (listJ[k] !== listI[k]) continue loopJ;
					}
					// At this point, their values are equal.
					aArray.splice(j, 1);
				}
			}
			return aArray;
		},
		
		splitLine: function (vString) {
			var lLineLength = 75;
			var lResult = "";
			while (vString.length) {
				if (lResult == "") {
					lResult = vString.substr(0, lLineLength);
					vString = vString.substr(lLineLength);
				} else {
					lResult = lResult + "\r\n " + vString.substr(0, lLineLength - 1);
					vString = vString.substr(lLineLength - 1);
				}
			}
			return lResult;
		},
	
		undefinedToBlank: function (vString1) {
			if (vString1 != null && vString1 !== undefined && vString1 != "") {
				return vString1;
			} else {
				return "";
			}
		},

		notNull: function (vArray1, vArray2) {
			var vString1 = vArray1.join("");
			if (vString1 != null && vString1 !== undefined && vString1 != "") {
				return vArray1;
			} else {
				return vArray2;
			}
		},

		appendArrayToVcardData: function (aInitialValue, aField, aVersion, aArray) {
			var aResultValue = aInitialValue;
			for (let i = 0; i < aArray.length; i++) {
				if (aArray[i][2] != null && aArray[i][2] !== undefined && aArray[i][2] != "") {
					if (cardbookUtils.getPrefBooleanFromTypes(aArray[i][1])) {
						if (aVersion == "4.0") {
							var lString = "PREF=" + cardbookUtils.getPrefValueFromTypes(aArray[i][1], aVersion) + ":";
						} else {
							var lString = "TYPE=PREF:";
						}
					} else {
						var lString = "";
					}
					aResultValue = this.appendToVcardData1(aResultValue, aArray[i][2] + "." + aField, false, lString + this.escapeArrays2(aArray[i][0]).join(";"));
					aResultValue = this.appendToVcardData1(aResultValue, aArray[i][2] + ".X-ABLABEL", false, aArray[i][3][0]);
				} else {
					var lString = aArray[i][1].join(";");
					if (lString != "") {
						lString = lString + ":";
					}
					aResultValue = this.appendToVcardData1(aResultValue, aField, false, lString + this.escapeArrays2(aArray[i][0]).join(";"));
				}
			}
			return aResultValue;
		},
		
		appendToVcardData1: function (vString1, vString2, vBool1, vString3) {
			var lResult = "";
			if (vBool1) {
				lResult = vString1 + vString2 + "\r\n";
			} else {
				if (vString3 != null && vString3 !== undefined && vString3 != "") {
					if (vString2 != null && vString2 !== undefined && vString2 != "") {
						var lString4 = vString3.toUpperCase();
						if (lString4.indexOf("TYPE=") != -1 || lString4.indexOf("PREF") != -1 || lString4.indexOf("ENCODING=") != -1 || lString4.indexOf("VALUE=") != -1) {
							lResult = vString1 + this.splitLine(vString2 + ";" + vString3) + "\r\n";
						} else {
							lResult = vString1 + this.splitLine(vString2 + ":" + vString3) + "\r\n";
						}
					} else {
						lResult = vString1 + this.splitLine(vString3) + "\r\n";
					}
				} else {
					lResult = vString1;
				}
			}
			return lResult;
		},
		
		appendToVcardData2: function (vString1, vString2, vBool1, vString3) {
			var lResult = "";
			if (vBool1) {
				lResult = vString1 + vString2 + "\r\n";
			} else {
				if (vString3 != null && vString3 !== undefined && vString3 != "") {
					if (vString2 != null && vString2 !== undefined && vString2 != "") {
						lResult = vString1 + this.splitLine(vString2 + ":" + vString3) + "\r\n";
					} else {
						lResult = vString1 + this.splitLine(vString3) + "\r\n";
					}
				} else {
					lResult = vString1;
				}
			}
			return lResult;
		},
		
		escapeString: function (vString) {
			return vString.replace(/\\;/g,"@ESCAPEDSEMICOLON@").replace(/\\,/g,"@ESCAPEDCOMMA@");
		},
	
		escapeString1: function (vString) {
			return vString.replace(/\\\(/g,"@ESCAPEDLEFTPARENTHESIS@").replace(/\\\)/g,"@ESCAPEDRIGHTPARENTHESIS@");
		},
	
		escapeArray: function (vArray) {
			for (let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					vArray[i] = vArray[i].replace(/\\;/g,"@ESCAPEDSEMICOLON@").replace(/\\,/g,"@ESCAPEDCOMMA@");
				}
			}
			return vArray;
		},
	
		replaceArrayComma: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/\\n/g,"\n").replace(/,/g,"\n");
				}
			}
			return vArrayNew;
		},
	
		escapeArrayComma: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/,/g,"@ESCAPEDCOMMA@");
				}
			}
			return vArrayNew;
		},
	
		unescapeArrayComma: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/@ESCAPEDCOMMA@/g,"\\,");
				}
			}
			return vArrayNew;
		},
	
		escapeArraySemiColon: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/;/g,"@ESCAPEDSEMICOLON@");
				}
			}
			return vArrayNew;
		},
	
		escapeStringSemiColon: function (vString) {
			return vString.replace(/;/g,"@ESCAPEDSEMICOLON@");
		},
	
		unescapeStringSemiColon: function (vString) {
			return vString.replace(/@ESCAPEDSEMICOLON@/g,"\\;");
		},
	
		unescapeString: function (vString) {
			return vString.replace(/@ESCAPEDSEMICOLON@/g,";").replace(/\\;/g,";").replace(/@ESCAPEDCOMMA@/g,",").replace(/\\,/g,",");
		},
	
		unescapeString1: function (vString) {
			return vString.replace(/@ESCAPEDLEFTPARENTHESIS@/g,"(").replace(/@ESCAPEDRIGHTPARENTHESIS@/g,")");
		},
	
		unescapeArray: function (vArray) {
			for (let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					vArray[i] = vArray[i].replace(/@ESCAPEDSEMICOLON@/g,";").replace(/\\;/g,";").replace(/@ESCAPEDCOMMA@/g,",").replace(/\\,/g,",");
				}
			}
			return vArray;
		},
	
		escapeStrings: function (vString) {
			return vString.replace(/;/g,"\\;").replace(/,/g,"\\,").split("\n").join("\\n");
		},

		escapeArrays2: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = this.escapeStrings(vArrayNew[i]);
				}
			}
			return vArrayNew;
		},

		cleanArray: function (vArray) {
			var newArray = [];
			for(let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					newArray.push(vArray[i]);
				}
			}
			return newArray;
		},
		
		parseArray: function (vArray) {
			var lTemp = "";
			for (let vArrayIndex = 0; vArrayIndex < vArray.length; vArrayIndex++) {
				if (vArrayIndex === 0) {
					lTemp = this.cleanArray(vArray[vArrayIndex]).join(" ");
				} else {
					lTemp = lTemp + "\n" + this.cleanArray(vArray[vArrayIndex]).join(" ");
				}
			}
			return lTemp;
		},
		
		parseArrayByType: function (vArray) {
			var lTemp1 = "";
			for (let i = 0; i < vArray.length; i++) {
				if (i === 0) {
					lTemp1 = lTemp1 + vArray[i][0][0];
				} else {
					lTemp1 = lTemp1 + " " + vArray[i][0][0];
				}
			}
			return lTemp1;
		},
		
		cardToVcardData: function (vCard, aMediaConversion) {
			if (vCard.uid == "") {
				return "";
			}
			var vCardData = "";
			vCardData = this.appendToVcardData2(vCardData,"BEGIN:VCARD",true,"");
			vCardData = this.appendToVcardData2(vCardData,"VERSION",false,vCard.version);
			vCardData = this.appendToVcardData2(vCardData,"PRODID",false,vCard.prodid);
			vCardData = this.appendToVcardData2(vCardData,"UID",false,vCard.uid);
			vCardData = this.appendToVcardData2(vCardData,"CATEGORIES",false,this.unescapeArrayComma(this.escapeArrayComma(vCard.categories)).join(","));
			if (vCard.version == "3.0") {
				vCardData = this.appendToVcardData2(vCardData,"N",false,this.escapeStrings(vCard.lastname) + ";" + this.escapeStrings(vCard.firstname) + ";" +
														this.escapeStrings(vCard.othername) + ";" + this.escapeStrings(vCard.prefixname) + ";" + this.escapeStrings(vCard.suffixname));
			} else if (!(vCard.lastname == "" && vCard.firstname == "" && vCard.othername == "" && vCard.prefixname == "" && vCard.suffixname == "")) {
				vCardData = this.appendToVcardData2(vCardData,"N",false,this.escapeStrings(vCard.lastname) + ";" + this.escapeStrings(vCard.firstname) + ";" +
														this.escapeStrings(vCard.othername) + ";" + this.escapeStrings(vCard.prefixname) + ";" + this.escapeStrings(vCard.suffixname));
			}
			vCardData = this.appendToVcardData2(vCardData,"FN",false,this.escapeStrings(vCard.fn));
			vCardData = this.appendToVcardData2(vCardData,"NICKNAME",false,this.escapeStrings(vCard.nickname));
			vCardData = this.appendToVcardData2(vCardData,"SORT-STRING",false,vCard.sortstring);
			vCardData = this.appendToVcardData2(vCardData,"GENDER",false,vCard.gender);
			vCardData = this.appendToVcardData2(vCardData,"BDAY",false,vCard.bday);
			vCardData = this.appendToVcardData2(vCardData,"TITLE",false,this.escapeStrings(vCard.title));
			vCardData = this.appendToVcardData2(vCardData,"ROLE",false,this.escapeStrings(vCard.role));
			vCardData = this.appendToVcardData2(vCardData,"ORG",false,vCard.org);
			vCardData = this.appendToVcardData2(vCardData,"CLASS",false,vCard.class1);
			vCardData = this.appendToVcardData2(vCardData,"REV",false,vCard.rev);

			vCardData = this.appendArrayToVcardData(vCardData, "ADR", vCard.version, vCard.adr);
			vCardData = this.appendArrayToVcardData(vCardData, "TEL", vCard.version, vCard.tel);
			vCardData = this.appendArrayToVcardData(vCardData, "EMAIL", vCard.version, vCard.email);
			vCardData = this.appendArrayToVcardData(vCardData, "URL", vCard.version, vCard.url);
			vCardData = this.appendArrayToVcardData(vCardData, "IMPP", vCard.version, vCard.impp);

			vCardData = this.appendToVcardData2(vCardData,"NOTE",false,this.escapeStrings(vCard.note));
			vCardData = this.appendToVcardData2(vCardData,"GEO",false,vCard.geo);
			vCardData = this.appendToVcardData2(vCardData,"MAILER",false,vCard.mailer);
			
			if (vCard.version == "4.0") {
				vCardData = this.appendToVcardData2(vCardData,"KIND",false,vCard.kind);
				for (let i = 0; i < vCard.member.length; i++) {
					vCardData = this.appendToVcardData2(vCardData,"MEMBER",false,vCard.member[i]);
				}
			}

			vCardData = this.appendToVcardData1(vCardData,"PHOTO",false,cardbookUtils.getMediaContentForCard(vCard, "photo", aMediaConversion));
			vCardData = this.appendToVcardData1(vCardData,"LOGO",false,cardbookUtils.getMediaContentForCard(vCard, "logo", aMediaConversion));
			vCardData = this.appendToVcardData1(vCardData,"SOUND",false,cardbookUtils.getMediaContentForCard(vCard, "sound", aMediaConversion));
			
			vCardData = this.appendToVcardData2(vCardData,"AGENT",false,vCard.agent);
			vCardData = this.appendToVcardData2(vCardData,"TZ",false,this.escapeStrings(vCard.tz));
			vCardData = this.appendToVcardData2(vCardData,"KEY",false,vCard.key);

			for (let i = 0; i < vCard.others.length; i++) {
				vCardData = this.appendToVcardData2(vCardData,"",false,vCard.others[i]);
			}

			vCardData = this.appendToVcardData2(vCardData,"END:VCARD",true,"");

			return vCardData;
		},

		getvCardForEmail: function(aCard) {
			var cardContent = cardbookUtils.cardToVcardData(aCard, true);
			var re = /[\n\u0085\u2028\u2029]|\r\n?/;
			var tmpArray = cardContent.split(re);
			function filterArray(element) {
				return (element.search(/^UID:/) == -1 &&
							element.search(/^PRODID:/) == -1 &&
							element.search(/^REV:/) == -1 &&
							element.search(/^X-THUNDERBIRD-MODIFICATION:/) == -1 &&
							element.search(/^X-THUNDERBIRD-ETAG:/) == -1);
			}
			tmpArray = tmpArray.filter(filterArray);
			return tmpArray.join("\r\n");
		},

		getMediaContentForCard: function(aCard, aType, aMediaConversion) {
			try {
				var result = "";
				if (aMediaConversion) {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=URI:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=URI:" + aCard[aType].localURI;
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var myFileURI = ioService.newURI(aCard[aType].localURI, null, null);
						var content = btoa(cardbookSynchronization.getFileBinary(myFileURI));
						if (aCard.version === "4.0") {
							if (aCard[aType].extension != "") {
								result = "DATA:IMAGE/" + aCard[aType].extension.toUpperCase() + ";BASE64," + content;
							} else {
								result = "BASE64," + content;
							}
						} else if (aCard.version === "3.0") {
							if (aCard[aType].extension != "") {
								result = "ENCODING=B;TYPE=" + aCard[aType].extension.toUpperCase() + ":" + content;
							} else {
								result = "ENCODING=B:" + content;
							}
						}
					}
				} else {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=URI:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=URI:" + aCard[aType].localURI;
					}
				}
				return result;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getMediaContentForCard error : " + e, "Error");
			}
		},

		/*getMediaContentForCard: function(aCard, aType, aMediaConversion) {
			try {
				var result = "";
				if (aMediaConversion) {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=uri:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=uri:" + aCard[aType].localURI;
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var myFileURI = ioService.newURI(aCard[aType].localURI, null, null);
						var content = btoa(cardbookSynchronization.getFileBinary(myFileURI));
						if (aCard.version === "4.0") {
							if (aCard[aType].extension != "") {
								result = "data:image/" + aCard[aType].extension + ";base64," + content;
							} else {
								result = "base64," + content;
							}
						} else if (aCard.version === "3.0") {
							if (aCard[aType].extension != "") {
								result = "ENCODING=b;TYPE=" + aCard[aType].extension + ":" + content;
							} else {
								result = "ENCODING=b:" + content;
							}
						}
					}
				} else {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=uri:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=uri:" + aCard[aType].localURI;
					}
				}
				return result;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getMediaContentForCard error : " + e, "Error");
			}
		},*/

		// only used by getDisplayedName
		// used to fill the second part of the blocks (first part|second part)
		replaceEmptyPart: function(aString, aNewN, aOrgStructure, aNewOrg) {
			var result = "";
			// personal informations part
			if (aString.indexOf("{{1}}") >= 0) {
				if (aNewN[0] != "") {
					result = result + aString.replace(/\{\{1\}\}/g, aNewN[0]);
				}
			}
			if (aString.indexOf("{{2}}") >= 0) {
				if (aNewN[1] != "") {
					result = result + aString.replace(/\{\{2\}\}/g, aNewN[1]);
				}
			}
			if (aString.indexOf("{{3}}") >= 0) {
				if (aNewN[2] != "") {
					result = result + aString.replace(/\{\{3\}\}/g, aNewN[2]);
				}
			}
			if (aString.indexOf("{{4}}") >= 0) {
				if (aNewN[3] != "") {
					result = result + aString.replace(/\{\{4\}\}/g, aNewN[3]);
				}
			}
			if (aString.indexOf("{{5}}") >= 0) {
				if (aNewN[4] != "") {
					result = result + aString.replace(/\{\{5\}\}/g, aNewN[4]);
				}
			}

			// professional informations part
			if (aOrgStructure != "") {
				var count = 6;
				var aOrgArray = cardbookUtils.unescapeArray(cardbookUtils.escapeString(aNewOrg).split(";"));
				var allOrg = cardbookUtils.unescapeArray(cardbookUtils.escapeString(aOrgStructure).split(";"));
				for (var j = 0; j < allOrg.length; j++) {
					var index = count + j;
					if (aString.indexOf("{{" + index + "}}") >= 0) {
						if (aOrgArray[j]) {
							if (aOrgArray[j] != "") {
								var myRegExp = new RegExp("\\{\\{" + index + "\\}\\}", "ig");
								result = result + aString.replace(myRegExp, aOrgArray[j]);
							}
						}
					}
				}
			} else {
				if (aString.indexOf("{{6}}") >= 0) {
					if (aNewOrg != "") {
						result = result + aString.replace(/\{\{6\}\}/g, cardbookUtils.unescapeString(cardbookUtils.escapeString(aNewOrg)));
					}
				}
			}
			return result;
		},

		getDisplayedName: function(aNewN, aNewOrg) {
			var fnFormula = "";
			var result =  "";
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			fnFormula = prefs.getComplexValue("extensions.cardbook.fnFormula", Components.interfaces.nsISupportsString).data;
			if (fnFormula == "") {
				fnFormula = cardbookRepository.defaultFnFormula;
			}
			var orgStructure = prefs.getComplexValue("extensions.cardbook.orgStructure", Components.interfaces.nsISupportsString).data;

			// personal informations part
			var fnFormulaArray = cardbookUtils.escapeString1(fnFormula).split(')');
			for (var i = 0; i < fnFormulaArray.length; i++) {
				var tmpString = fnFormulaArray[i].substr(fnFormulaArray[i].indexOf("(")+1,fnFormulaArray[i].length);
				var tmpStringArray = tmpString.split('|');
				if (tmpStringArray[0].indexOf("{{1}}") >= 0) {
					if (aNewN[0] != "") {
						result = result + tmpStringArray[0].replace(/\{\{1\}\}/g, aNewN[0]);
					} else if (tmpStringArray[1]) {
						result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
					}
				}
				if (tmpStringArray[0].indexOf("{{2}}") >= 0) {
					if (aNewN[1] != "") {
						result = result + tmpStringArray[0].replace(/\{\{2\}\}/g, aNewN[1]);
					} else if (tmpStringArray[1]) {
						result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
					}
				}
				if (tmpStringArray[0].indexOf("{{3}}") >= 0) {
					if (aNewN[2] != "") {
						result = result + tmpStringArray[0].replace(/\{\{3\}\}/g, aNewN[2]);
					} else if (tmpStringArray[1]) {
						result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
					}
				}
				if (tmpStringArray[0].indexOf("{{4}}") >= 0) {
					if (aNewN[3] != "") {
						result = result + tmpStringArray[0].replace(/\{\{4\}\}/g, aNewN[3]);
					} else if (tmpStringArray[1]) {
						result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
					}
				}
				if (tmpStringArray[0].indexOf("{{5}}") >= 0) {
					if (aNewN[4] != "") {
						result = result + tmpStringArray[0].replace(/\{\{5\}\}/g, aNewN[4]);
					} else if (tmpStringArray[1]) {
						result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
					}
				}

				// professional informations part
				if (orgStructure != "") {
					var count = 6;
					var aOrgArray = cardbookUtils.unescapeArray(cardbookUtils.escapeString(aNewOrg).split(";"));
					var allOrg = cardbookUtils.unescapeArray(cardbookUtils.escapeString(orgStructure).split(";"));
					for (var j = 0; j < allOrg.length; j++) {
						var index = count + j;
						if (tmpStringArray[0].indexOf("{{" + index + "}}") >= 0) {
							if (aOrgArray[j]) {
								if (aOrgArray[j] != "") {
									var myRegExp = new RegExp("\\{\\{" + index + "\\}\\}", "ig");
									result = result + tmpStringArray[0].replace(myRegExp, aOrgArray[j]);
								} else if (tmpStringArray[1]) {
									result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
								}
							} else if (tmpStringArray[1]) {
								result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, aNewOrg);
							}
						}
					}
				} else {
					if (tmpStringArray[0].indexOf("{{6}}") >= 0) {
						var myOrg = cardbookUtils.unescapeString(cardbookUtils.escapeString(aNewOrg));
						if (aNewOrg != "") {
							result = result + tmpStringArray[0].replace(/\{\{6\}\}/g, myOrg);
						} else if (tmpStringArray[1]) {
							result = result + cardbookUtils.replaceEmptyPart(tmpStringArray[1], aNewN, orgStructure, myOrg);
						}
					}
				}
			}
			return cardbookUtils.unescapeString1(result).trim();
		},

		parseLists: function(aCard, aMemberLines, aKindValue) {
			if (aCard.version == "4.0") {
				aCard.member = [];
				for (var i = 0; i < aMemberLines.length; i++) {
					if (i === 0) {
						if (aKindValue != null && aKindValue !== undefined && aKindValue != "") {
							aCard.kind = aKindValue;
						} else {
							aCard.kind = "group";
						}
					}
					aCard.member.push(aMemberLines[i][0]);
				}
			} else if (aCard.version == "3.0") {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
						if (header == kindCustom || header == memberCustom) {
							aCard.others.splice(i, 1);
							i--;
							continue;
						}
					}
				}
				for (var i = 0; i < aMemberLines.length; i++) {
					if (i === 0) {
						if (aKindValue != null && aKindValue !== undefined && aKindValue != "") {
							aCard.others.push(kindCustom + ":" + aKindValue);
						} else {
							aCard.others.push(kindCustom + ":group");
						}
					}
					aCard.others.push(memberCustom + ":" + aMemberLines[i][0]);
				}
			}
		},

		parseAdrsCard: function(aCard) {
			aCard.dispadr = "";
			aCard.disphomeadr = "";
			aCard.dispworkadr = "";
			for (var i = 0; i < aCard.adr.length; i++) {
				let value = aCard.adr[i][0];
				let type = cardbookUtils.getOnlyTypesFromTypes(aCard.adr[i][1]);
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphomeadr == "") {
								aCard.disphomeadr = cardbookUtils.parseArray([value]);
							} else {
								aCard.disphomeadr = aCard.disphomeadr + " " + cardbookUtils.parseArray([value]);
							}
							break;
						case "WORK":
							if (aCard.dispworkadr == "") {
								aCard.dispworkadr = cardbookUtils.parseArray([value]);
							} else {
								aCard.dispworkadr = aCard.dispworkadr + " " + cardbookUtils.parseArray([value]);
							}
							break;
					}
				}
				if (aCard.dispadr == "") {
					aCard.dispadr = cardbookUtils.parseArray([value]);
				} else {
					aCard.dispadr = aCard.dispadr + " " + cardbookUtils.parseArray([value]);
				}
			}
		},

		parseEmailsCard: function(aCard) {
			aCard.dispemail = "";
			aCard.disphomeemail = "";
			aCard.dispworkemail = "";
			for (var i = 0; i < aCard.email.length; i++) {
				let value = aCard.email[i][0][0];
				let type = cardbookUtils.getOnlyTypesFromTypes(aCard.email[i][1]);
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphomeemail == "") {
								aCard.disphomeemail = value;
							} else {
								aCard.disphomeemail = aCard.disphomeemail + " " + value;
							}
							break;
						case "WORK":
							if (aCard.dispworkemail == "") {
								aCard.dispworkemail = value;
							} else {
								aCard.dispworkemail = aCard.dispworkemail + " " + value;
							}
							break;
					}
				}
				if (aCard.dispemail == "") {
					aCard.dispemail = value;
				} else {
					aCard.dispemail = aCard.dispemail + " " + value;
				}
			}
		},

		parseTelsCard: function(aCard) {
			aCard.disptel = "";
			aCard.disphometel = "";
			aCard.dispworktel = "";
			aCard.dispcelltel = "";
			for (var i = 0; i < aCard.tel.length; i++) {
				let value = aCard.tel[i][0][0];
				let type = cardbookUtils.getOnlyTypesFromTypes(aCard.tel[i][1]);
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphometel == "") {
								aCard.disphometel = value;
							} else {
								aCard.disphometel = aCard.disphometel + " " + value;
							}
							break;
						case "WORK":
							if (aCard.dispworktel == "") {
								aCard.dispworktel = value;
							} else {
								aCard.dispworktel = aCard.dispworktel + " " + value;
							}
							break;
						case "CELL":
							if (aCard.dispcelltel == "") {
								aCard.dispcelltel = value;
							} else {
								aCard.dispcelltel = aCard.dispcelltel + " " + value;
							}
							break;
					}
				}
				if (aCard.disptel == "") {
					aCard.disptel = value;
				} else {
					aCard.disptel = aCard.disptel + " " + value;
				}
			}
		},

		clearCard: function () {
			var fieldArray = [ "fn", "lastname", "firstname", "othername", "prefixname", "suffixname", "nickname", "bday",
								"gender", "note", "mailer", "geo", "sortstring", "class1", "tz",
								"agent", "key", "prodid", "uid", "version", "dirPrefId", "cardurl", "rev", "etag", "others", "vcard",
								"photolocalURI", "logolocalURI", "soundlocalURI", "photoURI", "logoURI", "soundURI" ];
			for (var i = 0; i < fieldArray.length; i++) {
				if (document.getElementById(fieldArray[i] + 'TextBox')) {
					document.getElementById(fieldArray[i] + 'TextBox').value = "";
				}
			}

			cardbookElementTools.deleteRows('orgRows');
			
			var typesList = [ 'email', 'tel', 'impp', 'url', 'adr' ];
			for (var i in typesList) {
				cardbookElementTools.deleteRowsType(typesList[i]);
			}
			for (var j in cardbookRepository.customFields) {
				if (document.getElementById(cardbookRepository.customFields[j] + 'TextBox')) {
					document.getElementById(cardbookRepository.customFields[j] + 'TextBox').value = "";
				}
			}
			document.getElementById('defaultCardImage').src = "";
			cardbookElementTools.deleteRows('mailPopularityRows');
		},

		displayCard: function (aCard, aReadOnly) {
			var fieldArray = [ "fn", "lastname", "firstname", "othername", "prefixname", "suffixname", "nickname", "bday",
								"gender", "note", "mailer", "geo", "sortstring", "class1", "tz", "agent", "key", "prodid",
								"uid", "version", "dirPrefId", "cardurl", "rev", "etag" ];
			for (var i = 0; i < fieldArray.length; i++) {
				if (document.getElementById(fieldArray[i] + 'TextBox')) {
					document.getElementById(fieldArray[i] + 'TextBox').value = aCard[fieldArray[i]];
					if (aReadOnly) {
						document.getElementById(fieldArray[i] + 'TextBox').setAttribute('readonly', 'true');
						if (fieldArray[i] === "note") {
							var re = /[\n\u0085\u2028\u2029]|\r\n?/;
							var noteArray = aCard[fieldArray[i]].split(re);
							document.getElementById(fieldArray[i] + 'TextBox').setAttribute('rows', noteArray.length);
						}
					} else {
						document.getElementById(fieldArray[i] + 'TextBox').removeAttribute('readonly');
					}
				}
			}

			/* var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdUrl = cardbookPrefService.getUrl();
			if (myDirPrefIdType === "DIRECTORY") {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(myDirPrefIdUrl);
				myFile.append(aCard.cacheuri);
			} else if (myDirPrefIdType === "FILE") {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(myDirPrefIdUrl);
			} else {
				var myFile = cardbookRepository.getLocalDirectory();
				myFile.append(aCard.dirPrefId);
				myFile.append(aCard.cacheuri);
			}
			var fieldArray = [ "cacheuri" ];
			for (var i = 0; i < fieldArray.length; i++) {
				if (document.getElementById(fieldArray[i] + 'TextBox')) {
					document.getElementById(fieldArray[i] + 'TextBox').value = myFile.path;
					if (aReadOnly) {
						document.getElementById(fieldArray[i] + 'TextBox').setAttribute('readonly', 'true');
					} else {
						document.getElementById(fieldArray[i] + 'TextBox').removeAttribute('readonly');
					}
				}
			}*/

			var myCustomField1OrgValue = "";
			var myCustomField2OrgValue = "";
			var myCustomField1OrgLabel = "";
			var myCustomField2OrgLabel = "";
			var othersTemp = JSON.parse(JSON.stringify(aCard.others));

			for (var i in cardbookRepository.customFields) {
				if (cardbookRepository.customFields[i] == "customField1Org" ) {
					myCustomField1OrgLabel = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
				} else if (cardbookRepository.customFields[i] == "customField2Org" ) {
					myCustomField2OrgLabel = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
				} else {
					document.getElementById(cardbookRepository.customFields[i] + 'Label').value = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
				}
				for (var j = 0; j < othersTemp.length; j++) {
					var othersTempArray = othersTemp[j].split(":");
					if (cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] == othersTempArray[0]) {
						if (cardbookRepository.customFields[i] == "customField1Org" ) {
							myCustomField1OrgValue = othersTempArray[1];
							myCustomField1OrgLabel = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
						} else if (cardbookRepository.customFields[i] == "customField2Org" ) {
							myCustomField2OrgValue = othersTempArray[1];
							myCustomField2OrgLabel = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
						} else {
							document.getElementById(cardbookRepository.customFields[i] + 'TextBox').value = othersTempArray[1];
						}
						var dummy = othersTemp.splice(j,1);
						j--;
					}
				}
			}
			
			document.getElementById('othersTextBox').value = othersTemp.join("\n");
			if (aReadOnly) {
				document.getElementById('othersTextBox').setAttribute('readonly', 'true');
			} else {
				document.getElementById('othersTextBox').removeAttribute('readonly');
			}

			var fieldArray = [ [ "photo", "localURI" ] , [ "photo", "URI" ], [ "logo", "localURI" ] , [ "logo", "URI" ], [ "sound", "localURI" ] , [ "sound", "URI" ] ];
			for (var i = 0; i < fieldArray.length; i++) {
				if (document.getElementById(fieldArray[i][0] + fieldArray[i][1] + 'TextBox')) {
					document.getElementById(fieldArray[i][0] + fieldArray[i][1] + 'TextBox').value = aCard[fieldArray[i][0]][fieldArray[i][1]];
					if (aReadOnly) {
						document.getElementById(fieldArray[i][0] + fieldArray[i][1] + 'TextBox').setAttribute('readonly', 'true');
					} else {
						document.getElementById(fieldArray[i][0] + fieldArray[i][1] + 'TextBox').removeAttribute('readonly');
					}
				}
			}
			
			cardbookTypes.constructOrg(aReadOnly, aCard.org, aCard.title, aCard.role, myCustomField1OrgValue, myCustomField1OrgLabel, myCustomField2OrgValue, myCustomField2OrgLabel);
			
			wdw_imageEdition.displayImageCard(aCard, !aReadOnly);
			wdw_cardEdition.displayCustomsName(aReadOnly);
			wdw_cardEdition.display40(aCard.version, aReadOnly);
			
			document.getElementById('categoriesTextBox').value = cardbookUtils.formatCategories(aCard.categories);
			if (aReadOnly) {
				document.getElementById('categoriesTextBox').setAttribute('readonly', 'true');
			} else {
				document.getElementById('categoriesTextBox').removeAttribute('readonly');
			}

			var typesList = [ 'email', 'tel', 'impp', 'url', 'adr' ];
			for (var i in typesList) {
				if (aReadOnly) {
					cardbookTypes.constructStaticRows(typesList[i], aCard[typesList[i]], aCard.version);
				} else {
					if (typesList[i] === "impp") {
						cardbookTypes.loadIMPPs(aCard[typesList[i]]);
					}
					cardbookTypes.constructDynamicRows(typesList[i], aCard[typesList[i]], aCard.version);
				}
			}
			if (aReadOnly) {
				cardbookTypes.loadStaticList(aCard);
				cardbookTypes.constructStaticMailPopularity(aCard.email);
			} else {
				wdw_cardEdition.displayLists(aCard);
				cardbookTypes.constructDynamicMailPopularity(aCard.email);
			}
		},

		adjustFields: function () {
			var nullableFields = {fn: [ 'fn' ],
									pers: [ 'lastname', 'firstname', 'othername', 'prefixname', 'suffixname', 'nickname', 'gender', 'bday', 'customField1Name', 'customField2Name' ],
									categories: [ 'categories' ],
									note: [ 'note' ],
									misc: [ 'mailer', 'geo', 'sortstring', 'class1', 'tz', 'agent', 'key', 'photolocalURI', 'photoURI', 'logolocalURI', 'logoURI', 'soundlocalURI', 'soundURI' ],
									tech: [ 'dirPrefId', 'version', 'prodid', 'uid', 'cardurl', 'rev', 'etag' ],
									others: [ 'others' ],
									vcard: [ 'vcard' ],
									};
			for (var i in nullableFields) {
				var found = false;
				for (var j = 0; j < nullableFields[i].length; j++) {
					var row = document.getElementById(nullableFields[i][j] + 'Row');
					var textbox = document.getElementById(nullableFields[i][j] + 'TextBox');
					var label = document.getElementById(nullableFields[i][j] + 'Label');
					if (textbox) {
						var myTestValue = ""; 
						if (textbox.value) {
							myTestValue = textbox.value;
						} else {
							myTestValue = textbox.getAttribute('value');
						}
						if (myTestValue != "") {
							if (row) {
								row.removeAttribute('hidden');
							}
							if (textbox) {
								textbox.removeAttribute('hidden');
							}
							if (label) {
								label.removeAttribute('hidden');
							}
							found = true;
						} else {
							if (row) {
								row.setAttribute('hidden', 'true');
							}
							if (textbox) {
								textbox.setAttribute('hidden', 'true');
							}
							if (label) {
								label.setAttribute('hidden', 'true');
							}
						}
					}
				}
				var groupbox = document.getElementById(i + 'Groupbox');
				if (groupbox) {
					if (found) {
						groupbox.removeAttribute('hidden');
					} else {
						groupbox.setAttribute('hidden', 'true');
					}
				}
			}
			
			var groupbox = document.getElementById('orgGroupbox');
			if (document.getElementById('orgRows').childElementCount != "0") {
				groupbox.removeAttribute('hidden');
			} else {
				groupbox.setAttribute('hidden', 'true');
			}
			
			var typesList = [ 'email', 'tel', 'impp', 'url', 'adr' ];
			for (var i in typesList) {
				var box = document.getElementById(typesList[i] + 'Groupbox');
				if (document.getElementById(typesList[i] + '_0_valueBox')) {
					box.removeAttribute('hidden');
				} else {
					box.setAttribute('hidden', 'true');
				}
			}
		},

		setCalculatedFieldsWithoutRev: function(aCard) {
			cardbookUtils.parseAdrsCard(aCard);
			cardbookUtils.parseTelsCard(aCard);
			cardbookUtils.parseEmailsCard(aCard);
			aCard.dispimpp = cardbookUtils.parseArrayByType(aCard.impp)
			aCard.dispurl = cardbookUtils.parseArrayByType(aCard.url)
			aCard.dispcategories = aCard.categories.join(" ");
			aCard.isAList = cardbookUtils.isMyCardAList(aCard);
			if (!aCard.isAList) {
				aCard.emails = cardbookUtils.getEmailsFromCard(aCard, cardbookRepository.preferEmailPref);
			}
			if (aCard.dirPrefId != "" && aCard.uid != "") {
				aCard.cbid = aCard.dirPrefId + "::" + aCard.uid;
			}
			if (aCard.dirPrefId) {
				aCard.emails = cardbookUtils.getEmailsFromCard(aCard, cardbookRepository.preferEmailPref);
			}
		},

		setCalculatedFields: function(aCard) {
			cardbookUtils.setCalculatedFieldsWithoutRev(aCard);
			cardbookUtils.updateRev(aCard);
		},

		cloneCard: function(sourceCard, targetCard) {
			targetCard.dirPrefId = sourceCard.dirPrefId;
			targetCard.cardurl = sourceCard.cardurl;
			targetCard.etag = sourceCard.etag;
	
			targetCard.lastname = sourceCard.lastname;
			targetCard.firstname = sourceCard.firstname;
			targetCard.othername = sourceCard.othername;
			targetCard.prefixname = sourceCard.prefixname;
			targetCard.suffixname = sourceCard.suffixname;
			targetCard.fn = sourceCard.fn;
			targetCard.nickname = sourceCard.nickname;
			targetCard.gender = sourceCard.gender;
			targetCard.bday = sourceCard.bday;

			targetCard.adr = JSON.parse(JSON.stringify(sourceCard.adr));
			targetCard.tel = JSON.parse(JSON.stringify(sourceCard.tel));
			targetCard.email = JSON.parse(JSON.stringify(sourceCard.email));
			targetCard.url = JSON.parse(JSON.stringify(sourceCard.url));
			targetCard.impp = JSON.parse(JSON.stringify(sourceCard.impp));
			targetCard.categories = JSON.parse(JSON.stringify(sourceCard.categories));

			targetCard.mailer = sourceCard.mailer;
			targetCard.tz = sourceCard.tz;
			targetCard.geo = sourceCard.geo;
			targetCard.title = sourceCard.title;
			targetCard.role = sourceCard.role;
			targetCard.agent = sourceCard.agent;
			targetCard.org = sourceCard.org;
			targetCard.note = sourceCard.note;
			targetCard.prodid = sourceCard.prodid;
			targetCard.sortstring = sourceCard.sortstring;
			targetCard.uid = sourceCard.uid;
			cardbookUtils.setCalculatedFields(targetCard);

			targetCard.member = JSON.parse(JSON.stringify(sourceCard.member));
			targetCard.kind = sourceCard.kind;

			targetCard.photo = JSON.parse(JSON.stringify(sourceCard.photo));
			targetCard.logo = JSON.parse(JSON.stringify(sourceCard.logo));
			targetCard.sound = JSON.parse(JSON.stringify(sourceCard.sound));

			targetCard.version = sourceCard.version;
			targetCard.class1 = sourceCard.class1;
			targetCard.key = sourceCard.key;

			targetCard.updated = sourceCard.updated;
			targetCard.created = sourceCard.created;
			targetCard.deleted = sourceCard.deleted;

			targetCard.others = sourceCard.others;
			
			targetCard.dispadr = sourceCard.dispadr;
			targetCard.disphomeadr = sourceCard.disphomeadr;
			targetCard.dispworkadr = sourceCard.dispworkadr;
			targetCard.disptel = sourceCard.disptel;
			targetCard.disphometel = sourceCard.disphometel;
			targetCard.dispworktel = sourceCard.dispworktel;
			targetCard.dispcelltel = sourceCard.dispcelltel;
			targetCard.dispemail = sourceCard.dispemail;
			targetCard.disphomeemail = sourceCard.disphomeemail;
			targetCard.dispworkemail = sourceCard.dispworkemail;
			targetCard.dispimpp = sourceCard.dispimpp;
			targetCard.dispurl = sourceCard.dispurl;
			targetCard.dispcategories = sourceCard.dispcategories;
		},

		getCustomValue: function(aCard, aCustomElement) {
			for (var i = 0; i < aCard.others.length; i++) {
				var othersTempArray = aCard.others[i].split(":");
				if (cardbookRepository.customFieldsValue[aCustomElement] == othersTempArray[0]) {
					return othersTempArray[1];
				}
			}
			return "";
		},

		getCardValueByField: function(aCard, aField) {
			var result = [];
			if (aField.indexOf(".") > 0) {
				var myFieldArray = aField.split(".");
				var myField = myFieldArray[0];
				var myPosition = myFieldArray[1];
				var myType = myFieldArray[2];
				if (myType == "all") {
					if (aCard[myField]) {
						for (var i = 0; i < aCard[myField].length; i++) {
							if (aCard[myField][i][0][myPosition] != "") {
								result.push(aCard[myField][i][0][myPosition]);
							}
						}
					}
				} else if (myType == "array") {
					if (aCard[myField].length != 0) {
						result = result.concat(aCard[myField]);
					}
				} else {
					if (aCard[myField]) {
						for (var i = 0; i < aCard[myField].length; i++) {
							if (aCard[myField][i][1].length == 0 && myType == "notype") {
								result.push(aCard[myField][i][0][myPosition]);
							} else {
								for (var j = 0; j < aCard[myField][i][1].length; j++) {
									if (aCard[myField][i][1][j].toLowerCase() == "type=" + myType.toLowerCase()) {
										result.push(aCard[myField][i][0][myPosition]);
										break;
									}
								}
							}
						}
					}
				}
			} else {
				if (aCard[aField]) {
					result.push(aCard[aField]);
				} else {
					for (var i = 0; i < aCard.others.length; i++) {
						var othersTempArray = aCard.others[i].split(":");
						if (aField == othersTempArray[0]) {
							result.push(othersTempArray[1]);
							return result;
						}
					}
				}
			}
			return result;
		},

		setCardValueByField: function(aCard, aField, aValue) {
			aValue = aValue.replace(/^\"|\"$/g, "");
			if (aValue == "") {
				return;
			} else if (aField == "blank") {
				return;
			} else if (aField.indexOf(".") > 0) {
				var myFieldArray = aField.split(".");
				var myField = myFieldArray[0];
				var myPosition = myFieldArray[1];
				var myType = myFieldArray[2];
				if (aCard[myField]) {
					if (myField == "adr") {
						for (var i = 0; i < aCard[myField].length; i++) {
							var found = false;
							if (aCard[myField][i][1][0].toLowerCase() == "type=" + myType.toLowerCase()) {
								aCard[myField][i][0][myPosition] = aValue;
								found = true;
								break;
							}
						}
						if (!found) {
							if (myType == "notype") {
								var myType2 = "";
							} else {
								var myType2 = "type=" + myType;
							}
							aCard[myField].push([ ["", "", "", "", "", "", ""], [myType2], "", [] ]);
							aCard[myField][i][0][myPosition] = aValue;
						}
					} else if (myField == "categories") {
						aCard[myField] = cardbookUtils.unescapeArray(cardbookUtils.escapeString(aValue).split(","));
					} else {
						if (myType == "notype") {
							var myType2 = "";
						} else {
							var myType2 = "type=" + myType;
						}
						aCard[myField].push([ [aValue], [myType2], "", [] ]);
					}
				}
			} else {
				var found = false;
				for (var i in cardbookRepository.customFields) {
					if (cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] == aField) {
						aCard.others.push(aField + ":" + aValue);
						found = true;
					}
				}
				if (!found) {
					aCard[aField] = aValue;
				}
			}
		},

		getPrefBooleanFromTypes: function(aArray) {
			for (var i = 0; i < aArray.length; i++) {
				var upperElement = aArray[i].toUpperCase();
				if (upperElement === "PREF" || upperElement === "TYPE=PREF") {
					return true;
				} else if (upperElement.replace(/PREF=[0-9]*/i,"PREF") == "PREF") {
					return true;
				} else if (upperElement.replace(/^TYPE=/ig,"") !== upperElement) {
					var tmpArray = aArray[i].replace(/^TYPE=/ig,"").split(",");
					for (var j = 0; j < tmpArray.length; j++) {
						var upperElement1 = tmpArray[j].toUpperCase();
						if (upperElement1 === "PREF") {
							return true;
						} else if (upperElement1.replace(/PREF=[0-9]*/i,"PREF") == "PREF") {
							return true;
						}
					}
				}
			}
			return false;
		},

		getPrefValueFromTypes: function(aArray, aVersion) {
			if (aVersion == "3.0") {
				return "";
			} else if (cardbookUtils.getPrefBooleanFromTypes(aArray)) {
				for (var i = 0; i < aArray.length; i++) {
					var upperElement = aArray[i].toUpperCase();
					if (upperElement === "PREF" || upperElement === "TYPE=PREF") {
						continue;
					} else if (upperElement.replace(/PREF=[0-9]*/i,"PREF") == "PREF") {
						return upperElement.replace(/PREF=/i,"");
					} else if (upperElement.replace(/^TYPE=/i,"") !== upperElement) {
						var tmpArray = aArray[i].replace(/^TYPE=/ig,"").split(",");
						for (var j = 0; j < tmpArray.length; j++) {
							var upperElement1 = tmpArray[j].toUpperCase();
							if (upperElement1 === "PREF") {
								continue;
							} else if (upperElement1.replace(/PREF=[0-9]*/i,"PREF") == "PREF") {
								return upperElement1.replace(/PREF=/i,"");
							}
						}
					}
				}
			}
			return "";
		},

		getOnlyTypesFromTypes: function(aArray) {
			function deletePrefs(element) {
				return !(element.toUpperCase().replace(/TYPE=PREF/i,"PREF").replace(/PREF=[0-9]*/i,"PREF") == "PREF");
			}
			var result = [];
			for (var i = 0; i < aArray.length; i++) {
				var upperElement = aArray[i].toUpperCase();
				if (upperElement === "PREF" || upperElement === "TYPE=PREF") {
					continue;
				} else if (upperElement === "HOME" || upperElement === "FAX" || upperElement === "CELL" || upperElement === "WORK" || upperElement === "PHONE" || upperElement === "BUSINESS"
					 || upperElement === "VOICE"|| upperElement === "OTHER") {
					result.push(aArray[i]);
				} else if (upperElement.replace(/^TYPE=/i,"") !== upperElement) {
					var tmpArray = aArray[i].replace(/^TYPE=/ig,"").split(",").filter(deletePrefs);
					for (var j = 0; j < tmpArray.length; j++) {
						result.push(tmpArray[j]);
					}
				}
			}
			return result;
		},

		getNotTypesFromTypes: function(aArray) {
			var result = [];
			for (var i = 0; i < aArray.length; i++) {
				var upperElement = aArray[i].toUpperCase();
				if (upperElement === "PREF" || upperElement === "TYPE=PREF") {
					continue;
				} else if (upperElement === "HOME" || upperElement === "FAX" || upperElement === "CELL" || upperElement === "WORK" || upperElement === "PHONE" || upperElement === "BUSINESS"
					 || upperElement === "VOICE"|| upperElement === "OTHER") {
					continue;
				} else if (upperElement.replace(/PREF=[0-9]*/i,"PREF") == "PREF") {
					continue;
				} else if (upperElement.replace(/^TYPE=/i,"") === upperElement) {
					result.push(aArray[i]);
				}
			}
			return result.join(",");
		},

		getDataForUpdatingFile: function(aList, aMediaConversion) {
			var dataForExport = "";
			var k = 0;
			for (var i = 0; i < aList.length; i++) {
				if (k === 0) {
					dataForExport = cardbookUtils.cardToVcardData(aList[i], aMediaConversion);
					k = 1;
				} else {
					dataForExport = dataForExport + "\r\n" + cardbookUtils.cardToVcardData(aList[i], aMediaConversion);
				}
			}
			return dataForExport;
		},

		getSelectedCardsForList: function (aTree) {
			var myTreeName = aTree.id.replace("Tree", "");
			var listOfUid = [];
			var numRanges = aTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				aTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push([aTree.view.getCellText(j, {id: myTreeName + "Id"}), aTree.view.getCellText(j, {id: myTreeName + "Name"}), j]);
				}
			}
			return listOfUid;
		},

		setSelectedCardsForList: function (aTree, aListOfUid) {
			var myTreeName = aTree.id.replace("Tree", "");
			for (let i = 0; i < aTree.view.rowCount; i++) {
				for (let j = 0; j < aListOfUid.length; j++) {
					if (aTree.view.getCellText(i, {id: myTreeName + "Id"}) == aListOfUid[j][0]) {
						aTree.view.selection.rangedSelect(i,i,true);
						break;
					}
				}
			}
		},

		getSelectedCards: function () {
			var myTree = document.getElementById('cardsTree');
			var listOfUid = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push(myTree.view.getCellText(j, {id: "uid"}));
				}
			}
			return listOfUid;
		},

		getSelectedCardsCount: function () {
			var listOfUid = [];
			listOfUid = cardbookUtils.getSelectedCards();
			return listOfUid.length;
		},

		setSelectedCards: function (aListOfUid, aFirstVisibleRow, aLastVisibleRow) {
			if (aListOfUid.length == 0) {
				return;
			}
			var found = false;
			var foundIndex;
			var myTree = document.getElementById('cardsTree');
			for (var i = 0; i < aListOfUid.length; i++) {
				for (var j = 0; j < myTree.view.rowCount; j++) {
					if (myTree.view.getCellText(j, {id: "uid"}) == aListOfUid[i]) {
						myTree.view.selection.rangedSelect(j,j,true);
						found = true;
						foundIndex = j;
						break;
					}
				}
			}
			if (foundIndex < aFirstVisibleRow || foundIndex > aLastVisibleRow) {
				myTree.boxObject.scrollToRow(foundIndex);
			} else {
				myTree.boxObject.scrollToRow(aFirstVisibleRow);
			}
		},

		getSelectedCardsDirPrefId: function () {
			var myTree = document.getElementById('cardsTree');
			var listOfUid = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push(myTree.view.getCellText(j, {id: "dirPrefId"}));
				}
			}
			return cardbookRepository.arrayUnique(listOfUid);
		},

		getSelectedCardsId: function () {
			var myTree = document.getElementById('cardsTree');
			var listOfUid = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push(myTree.view.getCellText(j, {id: "dirPrefId"}) + "::" + myTree.view.getCellText(j, {id: "uid"}));
				}
			}
			return listOfUid;
		},

		getAccountId: function(aPrefId) {
			var mySepPosition = aPrefId.indexOf("::",0);
			if (mySepPosition != -1) {
				return aPrefId.substr(0,mySepPosition);
			} else {
				return aPrefId;
			}
		},

		getPositionOfAccountId: function(aAccountId) {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
					return i;
				}
			}
			return -1;
		},

		getPositionOfCardId: function(aAccountId, aCardId) {
			for (var i = 0; i < cardbookRepository.cardbookDisplayCards[aAccountId].length; i++) {
				if (cardbookRepository.cardbookDisplayCards[aAccountId][i].uid == aCardId) {
					return i;
				}
			}
			return -1;
		},

		isThereNetworkAccountToSync: function() {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6] != "FILE" && cardbookRepository.cardbookAccounts[i][6] != "CACHE" 
					&& cardbookRepository.cardbookAccounts[i][6] != "DIRECTORY" && cardbookRepository.cardbookAccounts[i][6] != "SEARCH" && cardbookRepository.cardbookAccounts[i][6] != "LOCALDB"
					&& cardbookRepository.cardbookAccounts[i][5]) {
					return true;
				}
			}
			return false;
		},

		isFileAlreadyOpen: function(aAccountPath) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && cardbookRepository.cardbookAccounts[i][6] == "FILE") {
					var cardbookPrefService = new cardbookPreferenceService(cardbookRepository.cardbookAccounts[i][4]);
					if (cardbookPrefService.getUrl() == aAccountPath) {
						return true;
					}
				}
			}
			return false;
		},

		isDirectoryAlreadyOpen: function(aAccountPath) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && cardbookRepository.cardbookAccounts[i][6] == "DIRECTORY") {
					var cardbookPrefService = new cardbookPreferenceService(cardbookRepository.cardbookAccounts[i][4]);
					if (cardbookPrefService.getUrl() == aAccountPath) {
						return true;
					}
				}
			}
			return false;
		},

		isToggleOpen: function(aPrefId) {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] == aPrefId) {
					if (cardbookRepository.cardbookAccounts[i][2]) {
						return true;
					} else {
						return false;
					}
				}
			}
			return false;
		},

		searchTagCreated: function(aCard) {
			for (var i = 0; i < aCard.others.length; i++) {
				if (aCard.others[i].indexOf("X-THUNDERBIRD-MODIFICATION:CREATED") >= 0) {
					return true;
				}
			}
			return false;
		},

		addTagCreated: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:CREATED");
			aCard.created = true;
		},

		addTagUpdated: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:UPDATED");
			aCard.updated = true;
		},

		addTagDeleted: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:DELETED");
			aCard.deleted = true;
		},

		nullifyTagModification: function(aCard) {
			function removeTagModification(element) {
				return (element.indexOf("X-THUNDERBIRD-MODIFICATION:") == -1);
			}
			aCard.others = aCard.others.filter(removeTagModification);
			aCard.created = false;
			aCard.updated = false;
			aCard.deleted = false;
		},

		updateRev: function(aCard) {
			var sysdate = new Date();
			var year = sysdate.getFullYear();
			var month = ("0" + (sysdate.getMonth() + 1)).slice(-2);
			var day = ("0" + sysdate.getDate()).slice(-2);
			var hour = ("0" + sysdate.getHours()).slice(-2);
			var min = ("0" + sysdate.getMinutes()).slice(-2);
			var sec = ("0" + sysdate.getSeconds()).slice(-2);
			aCard.rev = year + month + day + "T" + hour + min + sec + "Z";
		},

		addEtag: function(aCard, aEtag) {
			if (!(aEtag != null && aEtag !== undefined && aEtag != "")) {
				aEtag = "0";
			} else {
				var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
				var myPrefType = cardbookPrefService.getType();
				if (myPrefType != "FILE" || myPrefType != "CACHE" || myPrefType != "DIRECTORY" || myPrefType != "LOCALDB") {
					cardbookUtils.nullifyEtag(aCard);
					aCard.others.push("X-THUNDERBIRD-ETAG:" + aEtag);
					aCard.etag = aEtag;
				}
			}
		},

		nullifyEtag: function(aCard) {
			function removeEtag(element) {
				return (element.indexOf("X-THUNDERBIRD-ETAG:") == -1);
			}
			aCard.others = aCard.others.filter(removeEtag);
			aCard.etag = "";
		},

		prepareCardForCreation: function(aCard, aPrefType, aUrl) {
			if (aUrl[aUrl.length - 1] != '/') {
				aUrl += '/';
			}
			if (aPrefType === "GOOGLE") {
				aCard.cardurl = aUrl + aCard.uid;
			} else {
				aCard.cardurl = aUrl + aCard.uid + ".vcf";
			}
		},

		getCardsFromAccountsOrCats: function () {
			try {
				var listOfSelectedCard = [];
				var myTree = document.getElementById('accountsOrCatsTree');
				if (cardbookRepository.cardbookSearchMode === "SEARCH" || cardbookRepository.cardbookComplexSearchMode === "SEARCH") {
					var myAccountPrefId = cardbookRepository.cardbookSearchValue;
				} else {
					var myAccountPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				}
				for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAccountPrefId].length; i++) {
					listOfSelectedCard.push(cardbookRepository.cardbookDisplayCards[myAccountPrefId][i]);
				}
				return listOfSelectedCard;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getCardsFromAccountsOrCats error : " + e, "Error");
			}
		},

		getCardsFromCards: function () {
			try {
				var listOfSelectedCard = [];
				var myTree = document.getElementById('cardsTree');
				var numRanges = myTree.view.selection.getRangeCount();
				var start = new Object();
				var end = new Object();
				for (var i = 0; i < numRanges; i++) {
					myTree.view.selection.getRangeAt(i,start,end);
					for (var j = start.value; j <= end.value; j++){
						listOfSelectedCard.push(cardbookRepository.cardbookCards[myTree.view.getCellText(j, {id: "dirPrefId"})+"::"+myTree.view.getCellText(j, {id: "uid"})]);
					}
				}
				return listOfSelectedCard;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getCardsFromCards error : " + e, "Error");
			}
		},

		getMediaCacheFile: function (aUid, aDirPrefId, aEtag, aType, aExtension) {
			try {
				aEtag = cardbookUtils.cleanEtag(aEtag);
				var mediaFile = cardbookRepository.getLocalDirectory();
				mediaFile.append(aDirPrefId);
				mediaFile.append("mediacache");
				if (!mediaFile.exists() || !mediaFile.isDirectory()) {
					// read and write permissions to owner and group, read-only for others.
					mediaFile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
				}
				var fileName = aUid.replace(/^urn:uuid:/i, "") + "." + aEtag + "." + aType + "." + aExtension.toLowerCase();
				fileName = fileName.replace(/([\\\/\:\*\?\"\<\>\|]+)/g, '-');
				mediaFile.append(fileName);
				return mediaFile;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getMediaCacheFile error : " + e, "Error");
			}
		},

		changeMediaFromFileToContent: function (aCard) {
			try {
				var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var mediaName = [ 'photo', 'logo', 'sound' ];

				for (var i in mediaName) {
					if (aCard[mediaName[i]].localURI != null && aCard[mediaName[i]].localURI !== undefined && aCard[mediaName[i]].localURI != "") {
						var myFileURISpec = aCard[mediaName[i]].localURI.replace("VALUE=uri:","");
						if (myFileURISpec.indexOf("file:///") === 0) {
							var myFileURI = ioService.newURI(myFileURISpec, null, null);
							aCard[mediaName[i]].value = cardbookSynchronization.getFileBinary(myFileURI);
							aCard[mediaName[i]].localURI = "";
						}
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.changeMediaFromFileToContent error : " + e, "Error");
			}
		},

		clipboardSet: function (aText, aMessage) {
			let ss = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
			if (!ss)
				return;
	
			let trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans)
				return;
	
			let clipid = Components.interfaces.nsIClipboard;
			let clipboard   = Components.classes['@mozilla.org/widget/clipboard;1'].getService(clipid);
			if (!clipboard)
				return;
	
			ss.data = aText;
			trans.addDataFlavor('text/unicode');
			trans.setTransferData('text/unicode', ss, aText.length * 2);
			clipboard.setData(trans, null, clipid.kGlobalClipboard);
			
			if (aMessage != null && aMessage !== undefined && aMessage != "") {
				wdw_cardbooklog.updateStatusProgressInformation(aMessage);
			}
		},

		clipboardGet: function () {
			try {
				let clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
	
				let trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
				trans.addDataFlavor("text/unicode");
	
				clipboard.getData(trans, clipboard.kGlobalClipboard);
	
				let str       = {};
				let strLength = {};
	
				trans.getTransferData("text/unicode", str, strLength);
				if (str)
					str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
	
				return str ? str.data.substring(0, strLength.value / 2) : null;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.clipboardGet error : " + e, "Error");
			}
		},

		clipboardGetImage: function(aFile) {
			var extension = "png";
			var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
			var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
			trans.addDataFlavor("image/" + extension);
			clip.getData(trans,clip.kGlobalClipboard);
			var data = {};
			var dataLength = {};
			trans.getTransferData("image/" + extension,data,dataLength);
			if (data && data.value) {
				// remove an existing image (overwrite)
				if (aFile.exists()) {
					aFile.remove(true);
				}
				aFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
				var outStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				outStream.init(aFile, 0x04 | 0x08 | 0x20, -1, 0); // readwrite, create, truncate
				var inputStream = data.value.QueryInterface(Components.interfaces.nsIInputStream)
				var binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				binInputStream.setInputStream(inputStream);
				try {
					while(true) {
						var len = Math.min(512,binInputStream.available());
						if (len == 0) break;
						var data = binInputStream.readBytes(len);
						if (!data || !data.length) break; outStream.write(data, data.length);
					}
				}
				catch(e) { return false; }
				try {
					inputStream.close();
					binInputStream.close();
					outStream.close();
				}
				catch(e) { return false; }
			} else {
				return false;
			}
			return true;
		},

		callFilePicker: function (aTitle, aMode, aType, aDefaultFileName) {
			try {
				var strBundle = document.getElementById("cardbook-strings");
				var myWindowTitle = strBundle.getString(aTitle);
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
				if (aMode === "SAVE") {
					fp.init(window, myWindowTitle, nsIFilePicker.modeSave);
				} else if (aMode === "OPEN") {
					fp.init(window, myWindowTitle, nsIFilePicker.modeOpen);
				}
				if (aType === "VCF") {
					fp.appendFilter("VCF File","*.vcf");
				} else if (aType === "EXPORTFILE") {
					//bug 545091 on linux and macosx
					fp.defaultExtension = "vcf";
					fp.appendFilter("VCF File","*.vcf");
					fp.appendFilter("CSV File","*.csv");
				} else if (aType === "IMAGES") {
					fp.appendFilters(nsIFilePicker.filterImages);
				}
				fp.appendFilters(fp.filterAll);
				if (aDefaultFileName != null && aDefaultFileName !== undefined && aDefaultFileName != "") {
					fp.defaultString = aDefaultFileName;
				}
				var ret = fp.show();
				if (ret == nsIFilePicker.returnOK || ret == nsIFilePicker.returnReplace) {
					return fp.file;
				}
				return "";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.callFilePicker error : " + e, "Error");
			}
		},

		callDirPicker: function (aTitle) {
			try {
				var strBundle = document.getElementById("cardbook-strings");
				var myWindowTitle = strBundle.getString(aTitle);
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
				fp.init(window, myWindowTitle, nsIFilePicker.modeGetFolder);
				var ret = fp.show();
				if (ret == nsIFilePicker.returnOK || ret == nsIFilePicker.returnReplace) {
					return fp.file;
				}
				return "";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.callDirPicker error : " + e, "Error");
			}
		},

		getTempFile: function (aFileName) {
			var myFile = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);
			myFile.append(aFileName);
			return myFile;
		},

		getEditionPhotoTempFile: function (aExtension) {
			var myFile = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);
			myFile.append("cardbook");
			if (!myFile.exists() || !myFile.isDirectory()) {
				// read and write permissions to owner and group, read-only for others.
				myFile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
			}
			myFile.append(cardbookUtils.getUUID() + "." + aExtension);
			return myFile;
		},

		purgeEditionPhotoTempFile: function () {
			var myFile = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);
			myFile.append("cardbook");
			if (myFile.exists()) {
				myFile.remove(true);
			}
		},

		getExtension: function (aFile) {
			var myFileArray = aFile.split(".");
			if (myFileArray.length == 1) {
				var myExtension = "";
			} else {
				var myExtension = myFileArray[myFileArray.length-1];
			}
			return myExtension;
		},

		cleanEtag: function (aEtag) {
			if (aEtag) {
				if (aEtag.indexOf("https://") == 0 || aEtag.indexOf("http://") == 0 ) {
					// for open-exchange
					var myEtagArray = aEtag.split("/");
					aEtag = myEtagArray[myEtagArray.length - 1];
					aEtag = aEtag.replace(/(.*)_([^_]*)/, "$2");
				}
				return aEtag;
			}
			return "";
		},

		getPrefNameFromPrefId: function(aPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			let cardbookPrefService = new cardbookPreferenceService(aPrefId);
			return cardbookPrefService.getName();
		},

		getFreeFileName: function(aDirName, aName, aId, aExtension) {
			var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			myFile.initWithPath(aDirName);
			myFile.append(aName.replace(/([\\\/\:\*\?\"\<\>\|]+)/g, '-') + aExtension);
			if (myFile.exists()) {
				var i = 0;
				while (i < 100) {
					var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					myFile.initWithPath(aDirName);
					myFile.append(aName.replace(/([\\\/\:\*\?\"\<\>\|]+)/g, '-') + "." + i + aExtension);
					if (!(myFile.exists())) {
						return myFile.leafName;
					}
					i++;
				}
				return aId + aExtension;
			} else {
				return myFile.leafName;
			}
		},

		getFileNameForCard: function(aDirName, aName, aId) {
			return cardbookUtils.getFreeFileName(aDirName, aName, aId.replace(/^urn:uuid:/i, ""), ".vcf");
		},

		getFileNameFromUrl: function(aUrl) {
			var keyArray = aUrl.split("/");
			var key = decodeURIComponent(keyArray[keyArray.length - 1]);
			return key.replace(/^urn:uuid:/i, "").replace(/([\\\/\:\*\?\"\<\>\|]+)/g, '-');
		},

		getFileCacheNameFromCard: function(aCard, aPrefIdType) {
			if (aCard.cacheuri != "") {
				return aCard.cacheuri;
			} else if (aPrefIdType === "DIRECTORY") {
				var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
				var myDirPrefIdUrl = cardbookPrefService.getUrl();
				aCard.cacheuri = cardbookUtils.getFileNameForCard(myDirPrefIdUrl, aCard.fn, aCard.uid);
			} else {
				if (aCard.cardurl != null && aCard.cardurl !== undefined && aCard.cardurl != "") {
					aCard.cacheuri = cardbookUtils.getFileNameFromUrl(aCard.cardurl);
				} else {
					if (aPrefIdType === "GOOGLE") {
						aCard.cacheuri = cardbookUtils.getFileNameFromUrl(aCard.uid);
					} else {
						aCard.cacheuri = cardbookUtils.getFileNameFromUrl(aCard.uid) + ".vcf";
					}
				}
			}
			return aCard.cacheuri;
		},

		randomChannel: function(brightness) {
			var r = 255-brightness;
			var n = 0|((Math.random() * r) + brightness);
			var s = n.toString(16);
			return (s.length==1) ? '0'+s : s;
		},

		randomColor: function(brightness) {
			return '#' + cardbookUtils.randomChannel(brightness) + cardbookUtils.randomChannel(brightness) + cardbookUtils.randomChannel(brightness);
		},

		isMyAccountEnabled: function(aDirPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			return cardbookPrefService.getEnabled();
		},

		isMyAccountReadOnly: function(aDirPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			return cardbookPrefService.getReadOnly();
		},

		getEmailsFromCard: function (aCard, aEmailPref) {
			var listOfEmail = [];
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookMailPopularity.js", "chrome://cardbook/content/cardbookSynchronization.js", "chrome://cardbook/content/wdw_log.js"]);
			if (aCard != null && aCard !== undefined && aCard != "") {
				var notfoundOnePrefEmail = true;
				var listOfPrefEmail = [];
				var myPrefValue;
				var myOldPrefValue = 0;
				for (var j = 0; j < aCard.email.length; j++) {
					var emailText = aCard.email[j][0][0];
					if (aEmailPref) {
						for (var k = 0; k < aCard.email[j][1].length; k++) {
							if (aCard.email[j][1][k].toUpperCase().indexOf("PREF") >= 0) {
								if (aCard.email[j][1][k].toUpperCase().indexOf("PREF=") >= 0) {
									myPrefValue = aCard.email[j][1][k].toUpperCase().replace("PREF=","");
								} else {
									myPrefValue = 1;
								}
								if (myPrefValue == myOldPrefValue || myOldPrefValue === 0) {
									listOfPrefEmail.push(emailText);
									myOldPrefValue = myPrefValue;
								} else if (myPrefValue < myOldPrefValue) {
									listOfPrefEmail = [];
									listOfPrefEmail.push(emailText);
									myOldPrefValue = myPrefValue;
								}
								notfoundOnePrefEmail = false;
							}
						}
					} else {
						listOfEmail.push(emailText);
						notfoundOnePrefEmail = false;
					}
				}
				if (notfoundOnePrefEmail) {
					for (var j = 0; j < aCard.email.length; j++) {
						var email = aCard.email[j][0][0];
						listOfEmail.push(email);
					}
				} else {
					for (var j = 0; j < listOfPrefEmail.length; j++) {
						listOfEmail.push(listOfPrefEmail[j]);
					}
				}
			}
			return listOfEmail;
		},

		getEmailsFromList: function (aList) {
			var emailResult = [];
			var recursiveList = [];
			
			function _verifyRecursivity(aList1) {
				for (var i = 0; i < recursiveList.length; i++) {
					if (recursiveList[i] == aList1) {
						cardbookUtils.formatStringForOutput("errorInfiniteLoopRecursion", [recursiveList.toSource()], "Error");
						return false;
					}
				}
				recursiveList.push(aList1);
				return true;
			};
					
			function _getEmails(aCard, aPrefEmails) {
				if (aCard.isAList) {
					var myList = aCard.fn;
					if (_verifyRecursivity(aCard)) {
						_convert(aCard);
					}
				} else {
					emailResult.push([aCard.fn, aCard.emails]);
				}
			};
					
			function _convert(aList) {
				recursiveList.push(aList.fn);
				if (aList.version == "4.0") {
					for (var k = 0; k < aList.member.length; k++) {
						var uid = aList.member[k].replace("urn:uuid:", "");
						if (cardbookRepository.cardbookCards[aList.dirPrefId+"::"+uid]) {
							var myTargetCard = cardbookRepository.cardbookCards[aList.dirPrefId+"::"+uid];
							_getEmails(myTargetCard);
						}
					}
				} else if (aList.version == "3.0") {
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
					for (var k = 0; k < aList.others.length; k++) {
						var localDelim1 = aList.others[k].indexOf(":",0);
						if (localDelim1 >= 0) {
							var header = aList.others[k].substr(0,localDelim1);
							var trailer = aList.others[k].substr(localDelim1+1,aList.others[k].length);
							if (header == memberCustom) {
								if (cardbookRepository.cardbookCards[aList.dirPrefId+"::"+trailer.replace("urn:uuid:", "")]) {
									var myTargetCard = cardbookRepository.cardbookCards[aList.dirPrefId+"::"+trailer.replace("urn:uuid:", "")];
									_getEmails(myTargetCard);
								}
							}
						}
					}
				}
			};
			
			_convert(aList);
			return emailResult;
		},

		getMimeEmailsFromCards: function (aListOfCards) {
			Components.utils.import("resource:///modules/mailServices.js");
			var result = [];
			for (var i = 0; i < aListOfCards.length; i++) {
				for (var j = 0; j < aListOfCards[i].emails.length; j++) {
					result.push(MailServices.headerParser.makeMimeAddress(aListOfCards[i].fn, aListOfCards[i].emails[j]));
				}
			}
			return result;
		},

		getMimeEmailsFromCardsAndLists: function (aListOfCards) {
			Components.utils.import("resource:///modules/mailServices.js");
			var result = [];
			for (var i = 0; i < aListOfCards.length; i++) {
				if (aListOfCards[i].isAList) {
					var listOfEmail = [];
					listOfEmail = cardbookUtils.getEmailsFromList(aListOfCards[i]);
					for (var j = 0; j < listOfEmail.length; j++) {
						for (var k = 0; k < listOfEmail[j][1].length; k++) {
							result.push(MailServices.headerParser.makeMimeAddress(listOfEmail[j][0], listOfEmail[j][1][k]));
						}
					}
				} else {
					for (var j = 0; j < aListOfCards[i].emails.length; j++) {
						result.push(MailServices.headerParser.makeMimeAddress(aListOfCards[i].fn, aListOfCards[i].emails[j]));
					}
				}
			}
			return result;
		},

		getAddressesFromCards: function (aListOfCards) {
			var listOfAddresses= [];
			if (aListOfCards != null && aListOfCards !== undefined && aListOfCards != "") {
				for (var i = 0; i < aListOfCards.length; i++) {
					for (var j = 0; j < aListOfCards[i].adr.length; j++) {
						var adress = aListOfCards[i].adr[j][0];
						listOfAddresses.push(adress);
					}
				}
			}
			return listOfAddresses;
		},

		getURLsFromCards: function (aListOfCards) {
			var listOfURLs= [];
			if (aListOfCards != null && aListOfCards !== undefined && aListOfCards != "") {
				for (var i = 0; i < aListOfCards.length; i++) {
					for (var j = 0; j < aListOfCards[i].url.length; j++) {
						var url = aListOfCards[i].url[j][0];
						listOfURLs.push(url);
					}
				}
			}
			return listOfURLs;
		},

		openURL: function (aUrl) {
			try {
				var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var uri = ioService.newURI(aUrl, null, null);
			}
			catch(e) {
				cardbookUtils.formatStringForOutput("invalidURL", [aUrl], "Error");
				return;
			}
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var localizeTarget = prefs.getComplexValue("extensions.cardbook.localizeTarget", Components.interfaces.nsISupportsString).data;
			if (localizeTarget === "in") {
				let tabmail = document.getElementById("tabmail");
				if (!tabmail) {
					// Try opening new tabs in an existing 3pane window
					let mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("mail:3pane");
					if (mail3PaneWindow) {
						tabmail = mail3PaneWindow.document.getElementById("tabmail");
						mail3PaneWindow.focus();
					}
				}
				if (tabmail) {
					tabmail.openTab("contentTab", {contentPage: aUrl});
				} else {
					window.openDialog("chrome://messenger/content/", "_blank","chrome,dialog=no,all", null,
					{ tabType: "contentTab", tabParams: {contentPage: aUrl} });
				}
			} else if (localizeTarget === "out") {
				cardbookUtils.openExternalURL(aUrl);
			}
		},

		openIMPP: function (aIMPPRow) {
			var serviceCode = cardbookTypes.getIMPPCode(aIMPPRow[1]);
			var serviceProtocol = cardbookTypes.getIMPPProtocol(aIMPPRow[0]);
			if (serviceCode != "") {
				var serviceLine = [];
				serviceLine = cardbookTypes.getIMPPLineForCode(serviceCode)
				if (serviceLine[0]) {
					var myValue = aIMPPRow[0].join(" ");
					var myRegexp = new RegExp("^" + serviceLine[2] + ":");
					var myAddress = aIMPPRow[0][0].replace(myRegexp, "");
					cardbookUtils.openExternalURL(cardbookUtils.formatIMPPForOpenning(serviceLine[2] + ":" + myAddress));
				}
			} else if (serviceProtocol != "") {
				var serviceLine = [];
				serviceLine = cardbookTypes.getIMPPLineForProtocol(serviceProtocol)
				if (serviceLine[0]) {
					var myRegexp = new RegExp("^" + serviceLine[2] + ":");
					var myAddress = aIMPPRow[0][0].replace(myRegexp, "");
					cardbookUtils.openExternalURL(cardbookUtils.formatIMPPForOpenning(serviceLine[2] + ":" + myAddress));
				}
			}
		},

		openExternalURL: function (aUrl) {
			var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uri = ioService.newURI(aUrl, null, null);
			var externalProtocolService = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
			externalProtocolService.loadURI(uri, null);
		},

		isMyCardAList: function (aCard) {
			if (aCard.version == "4.0") {
				return (aCard.kind.toLowerCase() == 'group');
			} else if (aCard.version == "3.0") {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					var localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						if (header == kindCustom) {
							var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
							return (trailer.toLowerCase() == 'group');
						}
					}
				}
			}
			return false;
		},
		
		getAllAvailableColumns: function (aMode) {
			var strBundle = document.getElementById("cardbook-strings");
			var result = [];
			for (var i in cardbookRepository.allColumns) {
				for (var j = 0; j < cardbookRepository.allColumns[i].length; j++) {
					if (i != "arrayColumns" && i != "categories") {
						result.push([cardbookRepository.allColumns[i][j], strBundle.getString(cardbookRepository.allColumns[i][j] + "Label")]);
					} else if (i == "categories") {
						result.push([cardbookRepository.allColumns[i][j] + ".0.array", strBundle.getString(cardbookRepository.allColumns[i][j] + "Label")]);
					}
				}
			}
			for (var i in cardbookRepository.customFields) {
				if (cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] != "") {
					result.push([cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]], cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]]]);
				}
			}
			if (aMode === "export" || aMode === "all") {
				for (var i = 0; i < cardbookRepository.allColumns.arrayColumns.length; i++) {
					for (var k = 0; k < cardbookRepository.allColumns.arrayColumns[i][1].length; k++) {
						result.push([cardbookRepository.allColumns.arrayColumns[i][0] + "." + k + ".all",
													strBundle.getString(cardbookRepository.allColumns.arrayColumns[i][1][k] + "Label")]);
					}
				}
			}
			if (aMode === "import" || aMode === "all") {
				for (var i = 0; i < cardbookRepository.allColumns.arrayColumns.length; i++) {
					for (var k = 0; k < cardbookRepository.allColumns.arrayColumns[i][1].length; k++) {
						if (cardbookRepository.allColumns.arrayColumns[i][0] != "adr") {
							result.push([cardbookRepository.allColumns.arrayColumns[i][0] + "." + k + ".notype",
														strBundle.getString(cardbookRepository.allColumns.arrayColumns[i][1][k] + "Label") + " (" + strBundle.getString("importNoTypeLabel") + ")"]);
						}
					}
				}
			}
			var cardbookPrefService = new cardbookPreferenceService();
			for (var i = 0; i < cardbookRepository.allColumns.arrayColumns.length; i++) {
				var myPrefTypes = cardbookPrefService.getAllTypesByType(cardbookRepository.allColumns.arrayColumns[i][0]);
				for (var j = 0; j < myPrefTypes.length; j++) {
					for (var k = 0; k < cardbookRepository.allColumns.arrayColumns[i][1].length; k++) {
						result.push([cardbookRepository.allColumns.arrayColumns[i][0] + "." + k + "." + myPrefTypes[j][0],
													strBundle.getString(cardbookRepository.allColumns.arrayColumns[i][1][k] + "Label") + " (" + myPrefTypes[j][1] + ")"]);
					}
				}
			}
			return result;
		},

		CSVToArray: function (aContent, aDelimiter) {
			var result = [];
			var re = /[\n\u0085\u2028\u2029]|\r\n?/;
			var aContentArray = aContent.split(re);
			while (aContentArray[aContentArray.length - 1] == "") {
				aContentArray.pop();
			}
			if (aDelimiter != null && aDelimiter !== undefined && aDelimiter != "") {
				var myDelimiter = aDelimiter;
			} else {
				var myDelimiter = ",";
			}
			// first part for the splitted lines
			var myNewContent = [];
			for (var i = 0; i < aContentArray.length; i++) {
				var myCurrentContent = aContentArray[i].replace(/\\\"/g,"@ESCAPEDDOUBLEQUOTES@").replace(/\\\,/g,"@ESCAPEDCOMMA@").replace(/\\\;/g,"@ESCAPEDSEMICOLON@");
				while (true) {
					var countDoublequotes = (myCurrentContent.match(/\"/g) || []).length;
					if ((countDoublequotes % 2) === 0) {
						myNewContent.push(myCurrentContent);
						break;
					} else {
						i++;
						myCurrentContent = myCurrentContent + "\r\n" + aContentArray[i].replace(/\\\"/g,"@ESCAPEDDOUBLEQUOTES@").replace(/\\\,/g,"@ESCAPEDCOMMA@").replace(/\\\;/g,"@ESCAPEDSEMICOLON@");
					}
				}
			}
			// second part for the splitted fields
			for (var i = 0; i < myNewContent.length; i++) {
				var tmpResult = [];
				var tmpArray = myNewContent[i].split(myDelimiter);
				for (var j = 0; j < tmpArray.length; j++) {
					var myCurrentContent = tmpArray[j];
					while (true) {
						if ((myCurrentContent[0] == '"')) {
							var countDoublequotes = (myCurrentContent.match(/\"/g) || []).length;
							if ((countDoublequotes % 2) === 0) {
								tmpResult = tmpResult.concat(myCurrentContent.replace(/@ESCAPEDDOUBLEQUOTES@/g , '\"').replace(/@ESCAPEDCOMMA@/g , "\,").replace(/@ESCAPEDSEMICOLON@/g , "\;"));
								break;
							} else {
								j++;
								myCurrentContent = myCurrentContent + myDelimiter + tmpArray[j];
							}
						} else {
							tmpResult = tmpResult.concat(myCurrentContent.replace(/@ESCAPEDDOUBLEQUOTES@/g , '\"').replace(/@ESCAPEDCOMMA@/g , "\,").replace(/@ESCAPEDSEMICOLON@/g , "\;"));
							break;
						}
					}
				}
				result.push(tmpResult);
			}
			return {result: result, delimiter: myDelimiter};
		},

		addToCardBookMenuSubMenu: function(aMenuName, aCallback) {
			try {
				var myPopup = document.getElementById(aMenuName);
				while (myPopup.hasChildNodes()) {
					myPopup.removeChild(myPopup.firstChild);
				}
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && !cardbookRepository.cardbookAccounts[i][7] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
						var menuItem = document.createElement("menuitem");
						menuItem.setAttribute("id", cardbookRepository.cardbookAccounts[i][4]);
						menuItem.addEventListener("command", function(aEvent) {
								aCallback(this.id);
								aEvent.stopPropagation();
							}, false);
						menuItem.setAttribute("label", cardbookRepository.cardbookAccounts[i][0]);
						myPopup.appendChild(menuItem);
					}
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "addToCardBookMenuSubMenu";
				prompts.alert(null, errorTitle, e);
			}
		},

		addToIMPPMenuSubMenu: function(aMenuName) {
			try {
				if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
					var selectedUid = cardbookUtils.getSelectedCardsId();
					if (selectedUid.length == 1) {
						if (cardbookRepository.cardbookCards[selectedUid[0]]) {
							cardbookUtils.addCardToIMPPMenuSubMenu(cardbookRepository.cardbookCards[selectedUid], aMenuName)
						} else {
							cardbookUtils.addCardToIMPPMenuSubMenu(null, aMenuName);
						}
					} else {
						cardbookUtils.addCardToIMPPMenuSubMenu(null, aMenuName);
					}
				} else {
					cardbookUtils.addCardToIMPPMenuSubMenu(null, aMenuName);
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "addToIMPPMenuSubMenu";
				prompts.alert(null, errorTitle, e);
			}
		},

		addCardToIMPPMenuSubMenu: function(aCard, aMenuName) {
			try {
				if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
					var myPopup = document.getElementById(aMenuName);
					var myMenu = document.getElementById(aMenuName.replace("MenuPopup", ""));
					while (myPopup.hasChildNodes()) {
						myPopup.removeChild(myPopup.firstChild);
					}
					
					myMenu.disabled = true;
					if (aCard != null && aCard !== undefined && aCard != "") {
						var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
						var telProtocolLine = "";
						try {
							var telProtocolLine = prefs.getComplexValue("extensions.cardbook.tels.0", Components.interfaces.nsISupportsString).data;
						}
						catch(e) {
						}
						if (telProtocolLine != "") {
							var telProtocolLineArray = telProtocolLine.split(':');
							var telLabel = telProtocolLineArray[1];
							var telProtocol = telProtocolLineArray[2];
							for (var i = 0; i < aCard.tel.length; i++) {
								var menuItem = document.createElement("menuitem");
								var myRegexp = new RegExp("^" + telProtocol + ":");
								var myAddress = aCard.tel[i][0][0].replace(myRegexp, "");
								menuItem.setAttribute("id", telProtocol + ":" + myAddress);
								menuItem.addEventListener("command", function(aEvent) {
										cardbookUtils.openExternalURL(cardbookUtils.formatTelForOpenning(this.id));
										aEvent.stopPropagation();
									}, false);
								menuItem.setAttribute("label", telLabel + ": " + myAddress);
								myPopup.appendChild(menuItem);
								myMenu.disabled = false;
							}
						}
						for (var i = 0; i < aCard.impp.length; i++) {
							var serviceCode = cardbookTypes.getIMPPCode(aCard.impp[i][1]);
							var serviceProtocol = cardbookTypes.getIMPPProtocol(aCard.impp[i][0]);
							if (serviceCode != "") {
								var serviceLine = [];
								serviceLine = cardbookTypes.getIMPPLineForCode(serviceCode)
								if (serviceLine[0]) {
									var menuItem = document.createElement("menuitem");
									var myRegexp = new RegExp("^" + serviceLine[2] + ":");
									var myAddress = aCard.impp[i][0][0].replace(myRegexp, "");
									menuItem.setAttribute("id", serviceLine[2] + ":" + myAddress);
									menuItem.addEventListener("command", function(aEvent) {
											cardbookUtils.openExternalURL(cardbookUtils.formatIMPPForOpenning(this.id));
											aEvent.stopPropagation();
										}, false);
									menuItem.setAttribute("label", serviceLine[1] + ": " + myAddress);
									myPopup.appendChild(menuItem);
									myMenu.disabled = false;
								}
							} else if (serviceProtocol != "") {
								var serviceLine = [];
								serviceLine = cardbookTypes.getIMPPLineForProtocol(serviceProtocol)
								if (serviceLine[0]) {
									var menuItem = document.createElement("menuitem");
									var myRegexp = new RegExp("^" + serviceLine[2] + ":");
									var myAddress = aCard.impp[i][0][0].replace(myRegexp, "");
									menuItem.setAttribute("id", serviceLine[2] + ":" + myAddress);
									menuItem.addEventListener("command", function(aEvent) {
											cardbookUtils.openExternalURL(cardbookUtils.formatIMPPForOpenning(this.id));
											aEvent.stopPropagation();
										}, false);
									menuItem.setAttribute("label", serviceLine[1] + ": " + myAddress);
									myPopup.appendChild(menuItem);
									myMenu.disabled = false;
								}
							}
						}
					}
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "addToIMPPMenuSubMenu";
				prompts.alert(null, errorTitle, e);
			}
		},

		addCardsToCategoryMenuSubMenu: function(aMenuName) {
			try {
				if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
					var myPopup = document.getElementById(aMenuName);
					var myMenu = document.getElementById(aMenuName.replace("MenuPopup", ""));
					for (let i = myPopup.childNodes.length; i > 2; --i) {
						myPopup.lastChild.remove();
					}

					var listOfDirPrefId = cardbookUtils.getSelectedCardsDirPrefId();
					var selectedUid = cardbookUtils.getSelectedCardsId();
					if (selectedUid.length > 0 && listOfDirPrefId.length == 1) {
						var myDirPrefId = listOfDirPrefId[0];
						var myCategoryList = cardbookUtils.cleanCategories(cardbookRepository.cardbookAccountsCategories[myDirPrefId]);
						for (var i = 0; i < myCategoryList.length; i++) {
							var myCategory = myCategoryList[i];
							var myMenuItem = document.createElement("menuitem");
							myMenuItem.setAttribute("id", myCategory);
							myMenuItem.setAttribute("type", "checkbox");
							myMenuItem.addEventListener("command", function(aEvent) {
									if (this.getAttribute("checked") == "true") {
										wdw_cardbook.addCategoryToSelectedCards(this.id, "", false);
									} else {
										wdw_cardbook.removeCategoryFromSelectedCards(this.id);
									}
									aEvent.stopPropagation();
								}, false);
							myMenuItem.setAttribute("label", myCategory);
							myMenuItem.setAttribute("checked", "false");
							myPopup.appendChild(myMenuItem);
						}
						if (selectedUid.length == 1) {
							var myCard = cardbookRepository.cardbookCards[selectedUid[0]];
							for (var i = 0; i < myCard.categories.length; i++) {
								var myMenuItem = document.getElementById(myCard.categories[i]);
								myMenuItem.setAttribute("checked", "true");
							}
						}
					}
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "addCardToCategoryMenuSubMenu";
				prompts.alert(null, errorTitle, e);
			}
		},

		openEditionWindow: function(aCard, aMode, aSource) {
			try {
				var myArgs = {cardIn: aCard, cardOut: {}, editionMode: aMode, cardEditionAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/cardEdition/wdw_cardEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.cardEditionAction == "SAVE") {
					cardbookRepository.saveCard(aCard, myArgs.cardOut, aSource);
					cardbookRepository.reWriteFiles([myArgs.cardOut.dirPrefId]);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.openEditionWindow error : " + e, "Error");
			}
		},

		setCardUUID: function (aCard) {
			var result = cardbookUtils.getUUID();
			if (aCard.dirPrefId != null && aCard.dirPrefId !== undefined && aCard.dirPrefId != "") {
				var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
				if (cardbookPrefService.getUrnuuid()) {
					aCard.uid = "urn:uuid:" + result;
				} else {
					aCard.uid = result;
				}
			} else {
				aCard.uid = result;
			}
			aCard.cbid = aCard.dirPrefId + "::" + aCard.uid;
		},

		getUUID: function () {
			var uuidGen = Components.classes["@mozilla.org/uuid-generator;1"].getService(Components.interfaces.nsIUUIDGenerator);
			return uuidGen.generateUUID().toString().replace(/[{}]/g, '');
		},

		notifyObservers: function (aTopic, aParam) {
			if (aTopic != null && aTopic !== undefined && aTopic != "") {
				Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService).notifyObservers(null, aTopic, aParam);
			}
		},

		formatStringForOutput: function(aStringCode, aValuesArray, aErrorCode) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			if (aValuesArray) {
				if (aErrorCode) {
					wdw_cardbooklog.updateStatusProgressInformation(strBundle.formatStringFromName(aStringCode, aValuesArray, aValuesArray.length), aErrorCode);
				} else {
					wdw_cardbooklog.updateStatusProgressInformation(strBundle.formatStringFromName(aStringCode, aValuesArray, aValuesArray.length));
				}
			} else {
				if (aErrorCode) {
					wdw_cardbooklog.updateStatusProgressInformation(strBundle.GetStringFromName(aStringCode), aErrorCode);
				} else {
					wdw_cardbooklog.updateStatusProgressInformation(strBundle.GetStringFromName(aStringCode));
				}
			}
		}

	};
};