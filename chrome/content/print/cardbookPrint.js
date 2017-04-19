if ("undefined" == typeof(cardbookPrint)) {
	var cardbookPrint = {
		result: "",
		indentation: "",

		getTypes: function (aType, aInputTypes, aPgType, aCardValue) {
			var myInputTypes = [];
			myInputTypes = cardbookUtils.getOnlyTypesFromTypes(aInputTypes);
			var cardbookPrefService = new cardbookPreferenceService();
			var myDisplayedTypes = [];
			for (let i = 0; i < myInputTypes.length; i++) {
				myDisplayedTypes.push(cardbookPrefService.getTypeLabel(aType, myInputTypes[i]));
			}
			if (aPgType[0]) {
				myDisplayedTypes.push(aPgType[0]);
			}
			if (aType == "impp") {
				var serviceCode = cardbookTypes.getIMPPCode(aInputTypes);
				var serviceProtocol = cardbookTypes.getIMPPProtocol(aCardValue);
				if (serviceCode != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForCode(serviceCode)
					if (serviceLine[0]) {
						myDisplayedTypes = myDisplayedTypes.concat(serviceLine[1]);
					} else {
						myDisplayedTypes = myDisplayedTypes.concat(serviceCode);
					}
				} else if (serviceProtocol != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForProtocol(serviceProtocol)
					if (serviceLine[0]) {
						myDisplayedTypes = myDisplayedTypes.concat(serviceLine[1]);
					} else {
						myDisplayedTypes = myDisplayedTypes.concat(serviceCode);
					}
				}
			}
			return myDisplayedTypes;
		},

		openTag: function (aTag, aParameters, aValue) {
			cardbookPrint.indentation = cardbookPrint.indentation + "   ";
			cardbookPrint.result = cardbookPrint.result + "\r\n";
			if (aParameters == "") {
				cardbookPrint.result = cardbookPrint.result + cardbookPrint.indentation + "<" + aTag + ">" + aValue;
			} else {
				cardbookPrint.result = cardbookPrint.result + cardbookPrint.indentation + "<" + aTag + " " + aParameters + ">" + aValue;
			}
		},

		closeTag: function (aTag, aCarriageReturn) {
			if (aCarriageReturn) {
				cardbookPrint.result = cardbookPrint.result + "\r\n" + cardbookPrint.indentation + "</" + aTag + ">";
			} else {
				cardbookPrint.result = cardbookPrint.result + "</" + aTag + ">";
			}
			cardbookPrint.indentation = cardbookPrint.indentation.replace("   ", "");
		},

		buildHTML: function (aListOfCards, aTitle, aColumnChoice) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var strBundle = document.getElementById("cardbook-strings");
			cardbookPrint.result = '';
			for (var i = 0; i < aListOfCards.length; i++) {
				cardbookPrint.openTag("div", 'class="vCard"', "");
				cardbookPrint.openTag("table", 'class="table"', "");
				for (var j in cardbookRepository.allColumns) {
					if (j == "technical") {
						continue;
						textarea 
					} else if ((j == "note" && aColumnChoice["note"]) || (j == "display" && aColumnChoice["display"])) {
						var myField = cardbookRepository.allColumns[j][0];
						if (aListOfCards[i][myField] != "") {
							if (aColumnChoice.headers) {
								cardbookPrint.openTag("tr", '', "");
								if (aColumnChoice.fieldNames) {
									cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', strBundle.getString(j + 'GroupboxLabel'));
								} else {
									cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', "");
								}
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
								cardbookPrint.openTag("tr", '', "");
								cardbookPrint.openTag("td", 'class="dummyvalue"', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", 'class="datavalue"', aListOfCards[i][myField]);
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
							} else {
								cardbookPrint.openTag("tr", '', "");
								if (aColumnChoice.fieldNames) {
									cardbookPrint.openTag("td", 'class="titlevalue"', strBundle.getString(j + 'GroupboxLabel'));
								} else {
									cardbookPrint.openTag("td", 'class="titlevalue"', "");
								}
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", 'class="datavalue"', aListOfCards[i][myField]);
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
							}
						}
					} else if (j == "categories" && aColumnChoice["categories"]) {
						var myField = cardbookRepository.allColumns[j][0];
						if (aListOfCards[i][myField] != "") {
							if (aColumnChoice.headers) {
								cardbookPrint.openTag("tr", '', "");
								if (aColumnChoice.fieldNames) {
									cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', strBundle.getString(j + 'GroupboxLabel'));
								} else {
									cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', "");
								}
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
								cardbookPrint.openTag("tr", '', "");
								cardbookPrint.openTag("td", 'class="dummyvalue"', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", 'class="datavalue"', cardbookUtils.formatCategories(aListOfCards[i][myField]));
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
							} else {
								cardbookPrint.openTag("tr", '', "");
								if (aColumnChoice.fieldNames) {
									cardbookPrint.openTag("td", 'class="titlevalue"', strBundle.getString(j + 'GroupboxLabel'));
								} else {
									cardbookPrint.openTag("td", 'class="titlevalue"', "");
								}
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", '', "");
								cardbookPrint.closeTag("td", false);
								cardbookPrint.openTag("td", 'class="datavalue"', cardbookUtils.formatCategories(aListOfCards[i][myField]));
								cardbookPrint.closeTag("td", false);
								cardbookPrint.closeTag("tr", true);
							}
						}
					} else if (j != "arrayColumns") {
						if (aColumnChoice[j]) {
							var found = false;
							for (var k = 0; k < cardbookRepository.allColumns[j].length; k++) {
								var myField = cardbookRepository.allColumns[j][k];
								if (aListOfCards[i][myField] != "") {
									if (aColumnChoice.headers) {
										if (!found) {
											cardbookPrint.openTag("tr", '', "");
											if (aColumnChoice.fieldNames) {
												cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', strBundle.getString(j + 'GroupboxLabel'));
											} else {
												cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', "");
											}
											cardbookPrint.closeTag("td", false);
											cardbookPrint.closeTag("tr", true);
											found = true;
										}
										cardbookPrint.openTag("tr", '', "");
										cardbookPrint.openTag("td", 'class="dummyvalue"', "");
										cardbookPrint.closeTag("td", false);
										if (aColumnChoice.fieldNames) {
											cardbookPrint.openTag("td", 'class="titlevalue"', strBundle.getString(myField + "Label"));
										} else {
											cardbookPrint.openTag("td", 'class="titlevalue"', "");
										}
										cardbookPrint.closeTag("td", false);
										cardbookPrint.openTag("td", '', "");
										cardbookPrint.closeTag("td", false);
									} else {
										cardbookPrint.openTag("tr", '', "");
										if (aColumnChoice.fieldNames) {
											cardbookPrint.openTag("td", 'class="titlevalue"', strBundle.getString(myField + "Label"));
										} else {
											cardbookPrint.openTag("td", 'class="titlevalue"', "");
										}
										cardbookPrint.closeTag("td", false);
										cardbookPrint.openTag("td", '', "");
										cardbookPrint.closeTag("td", false);
										cardbookPrint.openTag("td", '', "");
										cardbookPrint.closeTag("td", false);
									}
									cardbookPrint.openTag("td", 'class="datavalue"', aListOfCards[i][myField]);
									cardbookPrint.closeTag("td", false);
									cardbookPrint.closeTag("tr", true);
								}
							}
						}
					} else {
						for (var l = 0; l < cardbookRepository.allColumns.arrayColumns.length; l++) {
							var found = false;
							var myField = cardbookRepository.allColumns.arrayColumns[l][0];
							if (aColumnChoice[myField]) {
								for (var m = 0; m < aListOfCards[i][myField].length; m++) {
									if (aListOfCards[i][myField][m][0].join(" ").trim() != "") {
										if (aColumnChoice.headers) {
											if (!found) {
												cardbookPrint.openTag("tr", '', "");
												if (aColumnChoice.fieldNames) {
													cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', strBundle.getString(myField + 'GroupboxLabel'));
												} else {
													cardbookPrint.openTag("td", 'colspan="8" class="titlevalue"', "");
												}
												cardbookPrint.closeTag("td", false);
												cardbookPrint.closeTag("tr", true);
												found = true;
											}
											cardbookPrint.openTag("td", 'class="dummyvalue"', "");
											cardbookPrint.closeTag("td", false);
										} else {
											if (aColumnChoice.fieldNames) {
												cardbookPrint.openTag("td", 'class="titlevalue"', strBundle.getString(myField + 'Label'));
											} else {
												cardbookPrint.openTag("td", 'class="titlevalue"', "");
											}
											cardbookPrint.closeTag("td", false);
										}
										if (cardbookUtils.getPrefBooleanFromTypes(aListOfCards[i][myField][m][1]) && aColumnChoice.types) {
											var myCheck = "✓";
										} else {
											var myCheck = "";
										}
										cardbookPrint.openTag("td", 'class="typevalue"', myCheck);
										cardbookPrint.closeTag("td", false);
										if (aColumnChoice.types) {
											cardbookPrint.openTag("td", 'class="typevalue"', cardbookPrint.getTypes(myField, aListOfCards[i][myField][m][1], aListOfCards[i][myField][m][3], aListOfCards[i][myField][m][0][0]).join(" "));
										} else {
											cardbookPrint.openTag("td", 'class="typevalue"', "");
										}
										cardbookPrint.closeTag("td", false);
										if (myField == "adr") {
											cardbookPrint.openTag("td", 'class="datavalue"', cardbookUtils.formatAddress(aListOfCards[i][myField][m][0]));
										} else {
											cardbookPrint.openTag("td", 'class="datavalue"', aListOfCards[i][myField][m][0][0].trim());
										}
										cardbookPrint.closeTag("td", false);
										cardbookPrint.closeTag("tr", true);
									}
								}
							}
						}
					}
				}
				cardbookPrint.closeTag("table", true);
				cardbookPrint.closeTag("div", true);
			}
			return cardbookPrint.result;
		}
	};
};