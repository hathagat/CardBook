if ("undefined" == typeof(cardbookTypes)) {
	var cardbookTypes = {
		
		allIMPPs: [],
		
		getIMPPLineForCode: function (aCode) {
			var serviceLine = [];
			var cardbookPrefService = new cardbookPreferenceService();
			myPrefResults = cardbookPrefService.getAllIMPPs();
			for (var i = 0; i < myPrefResults.length; i++) {
				if (aCode == myPrefResults[i][0]) {
					serviceLine = [myPrefResults[i][0], myPrefResults[i][1], myPrefResults[i][2]];
					break;
				}
			}
			return serviceLine;
		},

		getIMPPLineForProtocol: function (aProtocol) {
			var serviceLine = [];
			var cardbookPrefService = new cardbookPreferenceService();
			myPrefResults = cardbookPrefService.getAllIMPPs();
			for (var i = 0; i < myPrefResults.length; i++) {
				if (aProtocol == myPrefResults[i][2]) {
					serviceLine = [myPrefResults[i][0], myPrefResults[i][1], myPrefResults[i][2]];
					break;
				}
			}
			return serviceLine;
		},

		getIMPPCode: function (aInputTypes) {
			var serviceCode = "";
			for (var j = 0; j < aInputTypes.length; j++) {
				serviceCode = aInputTypes[j].replace(/^X-SERVICE-TYPE=/i, "");
				if (serviceCode != aInputTypes[j]) {
					break;
				} else {
					serviceCode = "";
				}
			}
			return serviceCode;
		},

		getIMPPProtocol: function (aCardValue) {
			var serviceProtocol = "";
			if (aCardValue[0].indexOf(":") >= 0) {
				serviceProtocol = aCardValue[0].split(":")[0];
			}
			return serviceProtocol;
		},

		loadIMPPs: function (aArray) {
			var myPrefResults = [];
			var cardbookPrefService = new cardbookPreferenceService();
			myPrefResults = cardbookPrefService.getAllIMPPs();
			var serviceCode = "";
			var serviceProtocol = "";
			for (var i = 0; i < aArray.length; i++) {
				serviceCode = cardbookTypes.getIMPPCode(aArray[i][1]);
				serviceProtocol = cardbookTypes.getIMPPProtocol(aArray[i][0]);
				if (serviceCode != "" || serviceProtocol != "") {
					var found = false;
					for (var j = 0; j < myPrefResults.length; j++) {
						if (serviceCode != "") {
							if (myPrefResults[j][0] == serviceCode) {
								found = true;
								break;
							}
						} else if (serviceProtocol != "") {
							if (myPrefResults[j][2] == serviceProtocol) {
								found = true;
								break;
							}
						}
					}
					if (!found) {
						if (serviceCode == "") {
							myPrefResults.push([serviceProtocol, serviceProtocol, serviceProtocol]);
						} else if (serviceProtocol == "") {
							myPrefResults.push([serviceCode, serviceCode, serviceCode]);
						} else {
							myPrefResults.push([serviceCode, serviceCode, serviceProtocol]);
						}
					}
				}
			}
			cardbookTypes.allIMPPs = JSON.parse(JSON.stringify(myPrefResults));
			cardbookTypes.allIMPPs = cardbookUtils.sortArrayByString(cardbookTypes.allIMPPs,1,1);
		},

		validateDynamicTypes: function () {
			var limit = 100;
			var typesList = [ 'email', 'tel', 'impp', 'url', 'adr' ];
			for (var i in typesList) {
				if (document.getElementById(typesList[i] + 'Groupbox')) {
					var aListRows = document.getElementById(typesList[i] + 'Groupbox');
					var j = 0;
					while (true) {
						if (document.getElementById(typesList[i] + '_' + j + '_prefWeightBox')) {
							var field = document.getElementById(typesList[i] + '_' + j + '_prefWeightBoxLabel').value.toLowerCase();
							var data = document.getElementById(typesList[i] + '_' + j + '_prefWeightBox').value;
							var dummy = data.replace(/[0-9]*/g, "");
							if (data == "") {
								j++;
								continue;
							} else if (dummy == "") {
								if (data >=1 && data <= limit) {
									j++;
									continue;
								}
							}
							var strBundle = document.getElementById("cardbook-strings");
							var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
							var errorTitle = strBundle.getString("errorTitle");
							var validateIntegerMsg = strBundle.getFormattedString("validateIntegerMsg", [field, limit, data]);
							prompts.alert(null, errorTitle, validateIntegerMsg);
							return false;
						} else {
							break;
						}
					}
				}
			}
			return true;
		},

		validateMailPopularity: function () {
			var limit = 100000;
			var i = 0;
			while (true) {
				if (document.getElementById('mailPopularity_' + i + '_row')) {
					var field = document.getElementById('mailPopularityTab').label.toLowerCase();
					var data = document.getElementById('popularity_' + i + '_Textbox').value;
					var dummy = data.replace(/[0-9]*/g, "");
					if (data == "") {
						i++;
						continue;
					} else if (dummy == "") {
						if (data >=1 && data <= limit) {
							i++;
							continue;
						}
					}
					var strBundle = document.getElementById("cardbook-strings");
					var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
					var errorTitle = strBundle.getString("errorTitle");
					var validateIntegerMsg = strBundle.getFormattedString("validateIntegerMsg", [field, limit, data]);
					prompts.alert(null, errorTitle, validateIntegerMsg);
					return false;
				} else {
					break;
				}
			}
			return true;
		},

		getTypeForLine: function (aType, aIndex) {
			var myLineResult = [];
			var myLineTypeResult = [];
			
			var myPrefBox = document.getElementById(aType + '_' + aIndex + '_prefCheckbox');
			if (document.getElementById('versionTextBox').value === "4.0") {
				if (myPrefBox.checked) {
					var aPrefWeightBoxValue = document.getElementById(aType + '_' + aIndex + '_prefWeightBox').value;
					if (aPrefWeightBoxValue != null && aPrefWeightBoxValue !== undefined && aPrefWeightBoxValue != "") {
						myLineTypeResult.push("PREF=" + aPrefWeightBoxValue);
					} else {
						myLineTypeResult.push("PREF");
					}
				}
			} else {
				if (myPrefBox.checked) {
					myLineTypeResult.push("TYPE=PREF");
				}
			}
			var myLineOtherType = document.getElementById(aType + '_' + aIndex + '_othersTypesBox').value;
			if (myLineOtherType != null && myLineOtherType !== undefined && myLineOtherType != "") {
				myLineTypeResult = myLineTypeResult.concat(myLineOtherType.split(','));
			}
			
			var j = 0;
			var myLineTypeType = [];
			while (true) {
				if (document.getElementById(aType + '_' + aIndex + '_typeBox_' + j)) {
					var myTypeBox = document.getElementById(aType + '_' + aIndex + '_typeBox_' + j);
					if (myTypeBox.checked) {
						var cardbookPrefService = new cardbookPreferenceService();
						var myTypeValue = cardbookPrefService.getTypeCode(aType, myTypeBox.label);
						myLineTypeType.push("TYPE=" + myTypeValue);
					}
					j++;
				} else {
					break;
				}
			}
			var myLinepgTypeType = [];
			if (document.getElementById(aType + '_' + aIndex + '_pgtypeBox')) {
				var mypgTypeBox = document.getElementById(aType + '_' + aIndex + '_pgtypeBox');
				if (mypgTypeBox.checked) {
					var mypgTypeValue = document.getElementById(aType + '_' + aIndex + '_pgtypeBox').label;
					myLinepgTypeType.push(mypgTypeValue);
				}
			}
			
			if (myLineTypeType.length > 0) {
				myLineTypeResult = myLineTypeResult.concat(myLineTypeType);
				var myOutputPg = [];
				var myPgName = "";
			} else if (myLinepgTypeType.length > 0) {
				var myOutputPg = myLinepgTypeType;
				var myPgName = document.getElementById(aType + '_' + aIndex + '_pgNameBox').value;
			} else {
				var myOutputPg = [];
				var myPgName = "";
			}
			
			if (aType == "adr") {
				var j = 0;
				var myLineTypeValue = [];
				while (true) {
					if (document.getElementById(aType + '_' + aIndex + '_valueBox_' + j)) {
						var myTypeValue = document.getElementById(aType + '_' + aIndex + '_valueBox_' + j).value.replace(/\\n/g, "\n").trim();
						myLineTypeValue.push(myTypeValue);
						j++;
					} else {
						break;
					}
				}
			} else {
				var myLineTypeValue = [document.getElementById(aType + '_' + aIndex + '_valueBox').value.trim()];
			}
			
			if (aType == "impp" && document.getElementById(aType + '_' + aIndex + '_menulistIMPP').selectedItem) {
				return [myLineTypeValue, myLineTypeResult, myPgName, myOutputPg, document.getElementById(aType + '_' + aIndex + '_menulistIMPP').selectedItem.value];
			} else {
				return [myLineTypeValue, myLineTypeResult, myPgName, myOutputPg, ""];
			}
		},

		getIMPPTypes: function () {
			var i = 0;
			var myResult = [];
			while (true) {
				if (document.getElementById('impp_' + i + '_hbox')) {
					var lineResult = cardbookTypes.getTypeForLine('impp', i);
					if (lineResult[0].join("") != "") {
						var serviceProtocol = "";
						var value = "";
						var valueArray = [];
						for (var j = 0; j < cardbookTypes.allIMPPs.length; j++) {
							if (cardbookTypes.allIMPPs[j][0] == lineResult[4]) {
								serviceProtocol = cardbookTypes.allIMPPs[j][2];
								break;
							}
						}
						function removeServiceType(element) {
							return (element == element.replace(/^X-SERVICE-TYPE=/i, ""));
						}
						lineResult[1] = lineResult[1].filter(removeServiceType);
						lineResult[1].push("X-SERVICE-TYPE=" + lineResult[4]);

						var myValue = lineResult[0].join(" ");
						serviceLine = cardbookTypes.getIMPPLineForCode(lineResult[4])
						if (serviceLine[0]) {
							var myRegexp = new RegExp("^" + serviceLine[2] + ":");
							myValue = myValue.replace(myRegexp, "");
						}
						myResult.push([[myValue], lineResult[1], "", []]);
					}
					i++;
				} else {
					break;
				}
			}
			return myResult;
		},

		getAllTypes: function (aType, aRemoveNull) {
			var i = 0;
			var myResult = [];
			while (true) {
				if (document.getElementById(aType + '_' + i + '_hbox')) {
					var lineResult = cardbookTypes.getTypeForLine(aType, i);
					if (lineResult[0].join("") != "" || !aRemoveNull) {
						myResult.push(lineResult);
					}
					i++;
				} else {
					break;
				}
			}
			return myResult;
		},

		disableButtons: function (aType, aIndex, aVersion) {
			if (aIndex == 0) {
				if (document.getElementById(aType + '_' + aIndex + '_valueBox').value == "") {
					document.getElementById(aType + '_' + aIndex + '_' + aVersion + '_cardbookaddButton').disabled = true;
					document.getElementById(aType + '_' + aIndex + '_' + aVersion + '_cardbookremoveButton').disabled = true;
				} else {
					document.getElementById(aType + '_' + aIndex + '_' + aVersion + '_cardbookaddButton').disabled = false;
					document.getElementById(aType + '_' + aIndex + '_' + aVersion + '_cardbookremoveButton').disabled = false;
				}
			} else {
				for (var i = 0; i < aIndex; i++) {
					document.getElementById(aType + '_' + i + '_' + aVersion + '_cardbookaddButton').disabled = true;
					document.getElementById(aType + '_' + i + '_' + aVersion + '_cardbookdownButton').disabled = false;
				}
			}
			document.getElementById(aType + '_' + aIndex + '_' + aVersion + '_cardbookdownButton').disabled = true;
			document.getElementById(aType + '_0_' + aVersion + '_cardbookupButton').disabled = true;
		},

		findNextLine: function (aType) {
			var i = 0;
			while (true) {
				if (document.getElementById(aType + '_' + i + '_hbox') || document.getElementById(aType + '_' + i + '_row')) {
					i++;
				} else {
					return i;
				}
			}
		},

		constructDynamicRows: function (aType, aArray, aVersion) {
			var start = cardbookTypes.findNextLine(aType);
			for (var i = 0; i < aArray.length; i++) {
				if (aArray[i][4]) {
					cardbookTypes.loadDynamicTypes(aType, i+start, aArray[i][1], aArray[i][2], aArray[i][3], aArray[i][0], aVersion, aArray[i][4]);
				} else {
					cardbookTypes.loadDynamicTypes(aType, i+start, aArray[i][1], aArray[i][2], aArray[i][3], aArray[i][0], aVersion, "");
				}
			}
			if (aArray.length == 0) {
				cardbookTypes.loadDynamicTypes(aType, start, [], "", [], [""], aVersion, "");
			}
		},

		constructDynamicMailPopularity: function (aArray) {
			for (var i = 0; i < aArray.length; i++) {
				cardbookTypes.loadDynamicMailPopularity(i, aArray[i]);
			}
		},

		constructStaticRows: function (aType, aArray, aVersion) {
			for (var i = 0; i < aArray.length; i++) {
				cardbookTypes.loadStaticTypes(aType, i, aArray[i][1], aArray[i][2], aArray[i][3], aArray[i][0], aVersion);
			}
			if (aArray.length == 0) {
				cardbookTypes.loadStaticTypes(aType, 0, [], "", [], [""], aVersion);
			}
		},

		constructStaticMailPopularity: function (aArray) {
			for (var i = 0; i < aArray.length; i++) {
				cardbookTypes.loadStaticMailPopularity(i, aArray[i]);
			}
		},

		display40: function (aVersion) {
			var typesList = [ 'email', 'tel', 'impp', 'url', 'adr' ];
			for (var i in typesList) {
				if (document.getElementById(typesList[i] + 'Groupbox')) {
					var j = 0;
					while (true) {
						if (document.getElementById(typesList[i] + '_' + j + '_prefWeightBox')) {
							var myPrefWeightBoxLabel = document.getElementById(typesList[i] + '_' + j + '_prefWeightBoxLabel');
							var myPrefWeightBox = document.getElementById(typesList[i] + '_' + j + '_prefWeightBox');
							if (aVersion === "4.0") {
								myPrefWeightBoxLabel.removeAttribute('hidden');
								myPrefWeightBox.removeAttribute('hidden');
							} else {
								myPrefWeightBoxLabel.setAttribute('hidden', 'true');
								myPrefWeightBox.setAttribute('hidden', 'true');
							}
							if (document.getElementById(typesList[i] + '_' + j + '_prefCheckbox').checked) {
								myPrefWeightBoxLabel.removeAttribute('readonly');
							} else {
								myPrefWeightBoxLabel.setAttribute('readonly', 'true');
							}
							j++;
						} else {
							break;
						}
					}
				}
			}
		},

		constructOrg: function (aReadOnly, aOrgValue, aTitleValue, aRoleValue, aCustomField1OrgValue, aCustomField1OrgLabel, aCustomField2OrgValue, aCustomField2OrgLabel) {
			var strBundle = document.getElementById("cardbook-strings");
			var aOrigBox = document.getElementById('orgRows');
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var orgStructure = prefs.getComplexValue("extensions.cardbook.orgStructure", Components.interfaces.nsISupportsString).data;
			var currentRow;
			if (orgStructure != "") {
				var myOrgStructure = cardbookUtils.unescapeArray(cardbookUtils.escapeString(orgStructure).split(";"));
				var myOrgValue = cardbookUtils.unescapeArray(cardbookUtils.escapeString(aOrgValue).split(";"));
				for (var i = 0; i < myOrgStructure.length; i++) {
					var myValue = "";
					if (myOrgValue[i]) {
						myValue = myOrgValue[i];
					}
					if (aReadOnly) {
						if (myValue != "") {
							currentRow = cardbookTypes.addRow(aOrigBox, 'orgRow_' + i);
							cardbookTypes.addLabel(currentRow, 'orgLabel_' + i, myOrgStructure[i], 'orgTextBox_' + i, {class: 'header'});
							cardbookElementTools.addTextbox(currentRow, 'orgTextBox_' + i, myValue, {flex: '1', readonly: 'true'});
						}
					} else {
						currentRow = cardbookTypes.addRow(aOrigBox, 'orgRow_' + i);
						cardbookTypes.addLabel(currentRow, 'orgLabel_' + i, myOrgStructure[i], 'orgTextBox_' + i, {class: 'header'});
						var myTextBox = cardbookElementTools.addTextbox(currentRow, 'orgTextBox_' + i, myValue, {flex: '1'});
						myTextBox.addEventListener("input", wdw_cardEdition.setDisplayName, false);
					}
				}
			} else {
				var myOrgValue = cardbookUtils.unescapeString(cardbookUtils.escapeString(aOrgValue));
				if (aReadOnly) {
					if (myOrgValue != "") {
						currentRow = cardbookTypes.addRow(aOrigBox, 'orgRow_0');
						cardbookTypes.addLabel(currentRow, 'orgLabel', strBundle.getString("orgLabel"), 'orgTextBox_0', {class: 'header'});
						cardbookElementTools.addTextbox(currentRow, 'orgTextBox_0', myOrgValue, {flex: '1', readonly: 'true'});
					}
				} else {
					currentRow = cardbookTypes.addRow(aOrigBox, 'orgRow_0');
					cardbookTypes.addLabel(currentRow, 'orgLabel', strBundle.getString("orgLabel"), 'orgTextBox_0', {class: 'header'});
					var myTextBox = cardbookElementTools.addTextbox(currentRow, 'orgTextBox_0', myOrgValue, {flex: '1'});
					myTextBox.addEventListener("input", wdw_cardEdition.setDisplayName, false);
				}
			}
			if (aReadOnly) {
				if (aTitleValue != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'titleRow');
					cardbookTypes.addLabel(currentRow, 'titleLabel', strBundle.getString("titleLabel"), 'titleTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'titleTextBox', aTitleValue, {flex: '1', readonly: 'true'});
				}
				if (aRoleValue != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'roleRow');
					cardbookTypes.addLabel(currentRow, 'roleLabel', strBundle.getString("roleLabel"), 'roleTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'roleTextBox', aRoleValue, {flex: '1', readonly: 'true'});
				}
				if (aCustomField1OrgValue != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'customField1OrgRow');
					cardbookTypes.addLabel(currentRow, 'customField1OrgLabel', aCustomField1OrgLabel, 'customField1OrgTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'customField1OrgTextBox', aCustomField1OrgValue, {flex: '1', readonly: 'true'});
				}
				if (aCustomField2OrgValue != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'customField2OrgRow');
					cardbookTypes.addLabel(currentRow, 'customField2OrgLabel', aCustomField2OrgLabel, 'customField2OrgTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'customField2OrgTextBox', aCustomField2OrgValue, {flex: '1', readonly: 'true'});
				}
			} else {
				currentRow = cardbookTypes.addRow(aOrigBox, 'titleRow');
				cardbookTypes.addLabel(currentRow, 'titleLabel', strBundle.getString("titleLabel"), 'titleTextBox', {class: 'header'});
				cardbookElementTools.addTextbox(currentRow, 'titleTextBox', aTitleValue, {flex: '1'});
				currentRow = cardbookTypes.addRow(aOrigBox, 'roleRow');
				cardbookTypes.addLabel(currentRow, 'roleLabel', strBundle.getString("roleLabel"), 'roleTextBox', {class: 'header'});
				cardbookElementTools.addTextbox(currentRow, 'roleTextBox', aRoleValue, {flex: '1'});
				if (aCustomField1OrgLabel != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'customField1OrgRow');
					cardbookTypes.addLabel(currentRow, 'customField1OrgLabel', aCustomField1OrgLabel, 'customField1OrgTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'customField1OrgTextBox', aCustomField1OrgValue, {flex: '1'});
				}
				if (aCustomField2OrgLabel != "") {
					currentRow = cardbookTypes.addRow(aOrigBox, 'customField2OrgRow');
					cardbookTypes.addLabel(currentRow, 'customField2OrgLabel', aCustomField2OrgLabel, 'customField2OrgTextBox', {class: 'header'});
					cardbookElementTools.addTextbox(currentRow, 'customField2OrgTextBox', aCustomField2OrgValue, {flex: '1'});
				}
			}
		},

		addRow: function (aOrigBox, aId) {
			var aRow = document.createElement('row');
			aOrigBox.appendChild(aRow);
			aRow.setAttribute('id', aId);
			aRow.setAttribute('align', 'center');
			return aRow;
		},

		addLabel: function (aOrigBox, aId, aValue, aControl, aParameters) {
			var aLabel = document.createElement('label');
			aOrigBox.appendChild(aLabel);
			aLabel.setAttribute('id', aId);
			aLabel.setAttribute('value', aValue);
			aLabel.setAttribute('control', aControl);
			for (var prop in aParameters) {
				aLabel.setAttribute(prop, aParameters[prop]);
			}
		},

		loadDynamicTypes: function (aType, aIndex, aInputTypes, aPgName, aPgType, aCardValue, aVersion, aImppDefault) {
			var strBundle = document.getElementById("cardbook-strings");
			var aOrigBox = document.getElementById(aType + 'Groupbox');
			
			if (aIndex == 0) {
				cardbookElementTools.addCaption(aType, aOrigBox);
			}
			
			var aHBox = cardbookElementTools.addHBox(aType, aIndex, aOrigBox);

			var cardbookPrefService = new cardbookPreferenceService();
			var myPrefTypes = [];
			myPrefTypes = cardbookPrefService.getAllTypesByType(aType);
			var myInputTypes = [];
			myInputTypes = cardbookUtils.getOnlyTypesFromTypes(aInputTypes);
			var myOthersTypes = cardbookUtils.getNotTypesFromTypes(aInputTypes);
			
			var aPrefBox = document.createElement('checkbox');
			aHBox.appendChild(aPrefBox);
			aPrefBox.setAttribute('id', aType + '_' + aIndex + '_prefCheckbox');
			aPrefBox.setAttribute('checked', cardbookUtils.getPrefBooleanFromTypes(aInputTypes));
			aPrefBox.setAttribute('label', cardbookPrefService.getPrefLabel());

			cardbookTypes.addLabel(aHBox, aType + '_' + aIndex + '_prefWeightBoxLabel', cardbookPrefService.getPrefValueLabel(), aType + '_' + aIndex + '_prefWeightBox', {tooltip: strBundle.getString("prefWeightTooltip")});
			cardbookElementTools.addTextbox(aHBox, aType + '_' + aIndex + '_prefWeightBox', cardbookUtils.getPrefValueFromTypes(aInputTypes, document.getElementById('versionTextBox').value), {size: "5"});
			if (aPrefBox.checked) {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBoxLabel').disabled = false;
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').disabled = false;
			} else {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBoxLabel').disabled = true;
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').disabled = true;
			}

			function firePrefCheckBox(event) {
				var myIdArray = this.id.split('_');
				var myPrefWeightBoxLabel = document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_prefWeightBoxLabel');
				var myPrefWeightBox = document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_prefWeightBox');
				if (this.checked) {
					myPrefWeightBoxLabel.disabled = false;
					myPrefWeightBox.disabled = false;
				} else {
					myPrefWeightBoxLabel.disabled = true;
					myPrefWeightBox.disabled = true;
				}
				myPrefWeightBox.value = "";
			};
			aPrefBox.addEventListener("command", firePrefCheckBox, false);

			if (document.getElementById('versionTextBox').value === "4.0") {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBoxLabel').removeAttribute('hidden');
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').removeAttribute('hidden');
			} else {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBoxLabel').setAttribute('hidden', 'true');
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').setAttribute('hidden', 'true');
			}

			cardbookElementTools.addTextbox(aHBox, aType + '_' + aIndex + '_othersTypesBox', myOthersTypes, {hidden: "true"});

			var checked = false;
			for (var i = 0; i < myPrefTypes.length; i++) {
				var aCheckbox = document.createElement('checkbox');
				aHBox.appendChild(aCheckbox);
				aCheckbox.setAttribute('id', aType + '_' + aIndex + '_typeBox_' + i);
				aCheckbox.setAttribute('checked', false);
				aCheckbox.setAttribute('label', myPrefTypes[i][1]);
				aCheckbox.setAttribute('tooltip', strBundle.getString("typesTooltip"));
				for (var j = 0; j < myInputTypes.length; j++) {
					if (myInputTypes[j].toLowerCase() == myPrefTypes[i][0].toLowerCase()) {
						aCheckbox.setAttribute('checked', true);
						var removed = myInputTypes.splice(j, 1);
						checked = true;
						break;
					}
				}
				for (var j = 0; j < aPgType.length; j++) {
					if (aPgType[j].toLowerCase() == myPrefTypes[i][0].toLowerCase()) {
						aCheckbox.setAttribute('checked', true);
						checked = true;
						break;
					}
				}
			}
			for (var j = 0; j < myInputTypes.length; j++) {
				var index = i+j;
				var aCheckbox = document.createElement('checkbox');
				aHBox.appendChild(aCheckbox);
				aCheckbox.setAttribute('id', aType + '_' + aIndex + '_typeBox_' + index);
				aCheckbox.setAttribute('checked', true);
				aCheckbox.setAttribute('label', myInputTypes[j]);
				aCheckbox.setAttribute('tooltip', strBundle.getString("typesTooltip"));
				checked = true;
			}
			if (!checked && aPgType.length != 0 && aPgName != "") {
				var aCheckbox = document.createElement('checkbox');
				aHBox.appendChild(aCheckbox);
				aCheckbox.setAttribute('id', aType + '_' + aIndex + '_pgtypeBox');
				aCheckbox.setAttribute('checked', true);
				aCheckbox.setAttribute('label', aPgType[0]);
				cardbookElementTools.addTextbox(aHBox, aType + '_' + aIndex + '_pgNameBox', aPgName, {hidden: "true"});
			}

			if (aType == "impp") {
				var serviceCode = cardbookTypes.getIMPPCode(aInputTypes);
				var serviceProtocol = cardbookTypes.getIMPPProtocol(aCardValue);
				cardbookElementTools.addMenuIMPPlist(aHBox, aType, aIndex, cardbookTypes.allIMPPs, aImppDefault, serviceCode, serviceProtocol);
				var myValue = aCardValue.join(" ");
				if (serviceCode != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForCode(serviceCode)
					if (serviceLine[0]) {
						var myRegexp = new RegExp("^" + serviceLine[2] + ":");
						myValue = myValue.replace(myRegexp, "");
					}
				} else if (serviceProtocol != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForProtocol(serviceProtocol)
					if (serviceLine[0]) {
						var myRegexp = new RegExp("^" + serviceLine[2] + ":");
						myValue = myValue.replace(myRegexp, "");
					}
				}
				cardbookElementTools.addKeyTextbox(aHBox, aType + '_' + aIndex + '_valueBox', myValue, {flex: "1"}, aVersion, aIndex);
			} else {
				cardbookElementTools.addKeyTextbox(aHBox, aType + '_' + aIndex + '_valueBox', cardbookUtils.cleanArray(aCardValue).join(" "), {flex: "1"}, aVersion, aIndex);
			}

			if (aType == "adr") {
				function fireEditAdr(event) {
					var myIdArray = this.id.split('_');
					var myTempResult = cardbookTypes.getTypeForLine(myIdArray[0], myIdArray[1]);
					if (myTempResult.length == 0) {
						var adrLine = [ ["", "", "", "", "", "", ""], [""], "", [""] ];
					} else {
						var adrLine = myTempResult;
					}
					wdw_cardEdition.openAdrPanel(adrLine, myIdArray);
				};
				document.getElementById(aType + '_' + aIndex + '_valueBox').addEventListener("click", fireEditAdr, false);
				document.getElementById(aType + '_' + aIndex + '_valueBox').addEventListener("input", fireEditAdr, false);
			}
		
			for (var i = 0; i < aCardValue.length; i++) {
				cardbookElementTools.addTextbox(aHBox, aType + '_' + aIndex + '_valueBox_' + i, aCardValue[i].replace(/\n/g, "\\n"), {hidden: "true"});
			}
			
			function fireUpButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookTypes.getAllTypes(myIdArray[0], false);
				if (myAllValuesArray.length <= 1) {
					return;
				}
				var temp = myAllValuesArray[myIdArray[1]*1-1];
				myAllValuesArray[myIdArray[1]*1-1] = myAllValuesArray[myIdArray[1]];
				myAllValuesArray[myIdArray[1]] = temp;
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				cardbookTypes.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "up", fireUpButton);
			
			function fireDownButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookTypes.getAllTypes(myIdArray[0], false);
				if (myAllValuesArray.length <= 1) {
					return;
				}
				var temp = myAllValuesArray[myIdArray[1]*1+1];
				myAllValuesArray[myIdArray[1]*1+1] = myAllValuesArray[myIdArray[1]];
				myAllValuesArray[myIdArray[1]] = temp;
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				cardbookTypes.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "down", fireDownButton);

			function fireRemoveButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myAllValuesArray = cardbookTypes.getAllTypes(myIdArray[0], false);
				cardbookElementTools.deleteRowsType(myIdArray[0]);
				if (myAllValuesArray.length == 0) {
					cardbookTypes.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
				} else {
					var removed = myAllValuesArray.splice(myIdArray[1], 1);
					cardbookTypes.constructDynamicRows(myIdArray[0], myAllValuesArray, myIdArray[2]);
				}
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "remove", fireRemoveButton);
			
			function fireAddButton(event) {
				if (document.getElementById(this.id).disabled) {
					return;
				}
				var myIdArray = this.id.split('_');
				var myValue = document.getElementById(myIdArray[0] + '_' + myIdArray[1] + '_valueBox').value;
				if (myValue == "") {
					return;
				}
				var myNextIndex = 1+ 1*myIdArray[1];
				cardbookTypes.loadDynamicTypes(myIdArray[0], myNextIndex, [], "", [], [""], myIdArray[2], "");
			};
			cardbookElementTools.addEditButton(aHBox, aType, aIndex, aVersion, "add", fireAddButton);

			cardbookTypes.disableButtons(aType, aIndex, aVersion);
		},

		loadStaticTypes: function (aType, aIndex, aInputTypes, aPgName, aPgType, aCardValue, aVersion) {
			if (aCardValue.join(" ") == "") {
				return;
			}
			var strBundle = document.getElementById("cardbook-strings");
			var aOrigBox = document.getElementById(aType + 'Groupbox');
			
			if (aIndex == 0) {
				cardbookElementTools.addCaption(aType, aOrigBox);
			}
			
			var aRow = document.createElement('row');
			aOrigBox.appendChild(aRow);
			aRow.setAttribute('id', aType + '_' + aIndex + '_row');
			aRow.setAttribute('flex', '1');
			aRow.setAttribute('align', 'center');
			aRow.setAttribute('context', aType + 'TreeContextMenu');
			function fireClick(event) {
				if (wdw_cardbook) {
					wdw_cardbook.chooseActionTreeForClick(event)
				}
			};
			aRow.addEventListener("click", fireClick, false);

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
			
			var aPrefImage = document.createElement('image');
			aRow.appendChild(aPrefImage);
			aPrefImage.setAttribute('id', aType + '_' + aIndex + '_prefCheckbox');
			aPrefImage.setAttribute('context', aType + 'TreeContextMenu');
			if (cardbookUtils.getPrefBooleanFromTypes(aInputTypes)) {
				aPrefImage.setAttribute('class', 'cardbookPrefClass');
			} else {
				aPrefImage.setAttribute('class', 'cardbookNotPrefClass');
			}

			cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_prefWeightBox', cardbookUtils.getPrefValueFromTypes(aInputTypes, document.getElementById('versionTextBox').value),
										{context: aType + 'TreeContextMenu', readonly: 'true'});
			if (document.getElementById('versionTextBox').value === "4.0") {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').setAttribute('hidden', 'false');
			} else {
				document.getElementById(aType + '_' + aIndex + '_prefWeightBox').setAttribute('hidden', 'true');
			}

			if (aType == "impp") {
				var serviceCode = cardbookTypes.getIMPPCode(aInputTypes);
				var serviceProtocol = cardbookTypes.getIMPPProtocol(aCardValue);
				var myValue = aCardValue.join(" ");
				if (serviceCode != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForCode(serviceCode)
					if (serviceLine[0]) {
						myDisplayedTypes = myDisplayedTypes.concat(serviceLine[1]);
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
						var myRegexp = new RegExp("^" + serviceLine[2] + ":");
						myValue = myValue.replace(myRegexp, "");
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', myValue, {context: aType + 'TreeContextMenu', flex: '1'});
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('link', 'true');
					} else {
						myDisplayedTypes = myDisplayedTypes.concat(serviceCode);
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', myValue, {context: aType + 'TreeContextMenu', flex: '1'});
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('readonly', 'true');
					}
				} else if (serviceProtocol != "") {
					var serviceLine = [];
					serviceLine = cardbookTypes.getIMPPLineForProtocol(serviceProtocol)
					if (serviceLine[0]) {
						myDisplayedTypes = myDisplayedTypes.concat(serviceLine[1]);
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
						var myRegexp = new RegExp("^" + serviceLine[2] + ":");
						myValue = myValue.replace(myRegexp, "");
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', myValue, {context: aType + 'TreeContextMenu', flex: '1'});
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('link', 'true');
					} else {
						myDisplayedTypes = myDisplayedTypes.concat(serviceCode);
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
						cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', myValue, {context: aType + 'TreeContextMenu', flex: '1'});
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('readonly', 'true');
					}
				} else {
					cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
					cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', myValue, {context: aType + 'TreeContextMenu', flex: '1'});
					document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('readonly', 'true');
				}
			} else {
				cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_typeBox', myDisplayedTypes.join(" "), {context: aType + 'TreeContextMenu', readonly: 'true'});
	
				cardbookElementTools.addTextbox(aRow, aType + '_' + aIndex + '_valueBox', cardbookUtils.cleanArray(aCardValue).join(" "), {context: aType + 'TreeContextMenu', flex: '1'});
				if (aType == "url" || aType == "email" || aType == "adr") {
					document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('link', 'true');
				} else if (aType == "tel") {
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var telProtocol = "";
					try {
						var telProtocol = prefs.getComplexValue("extensions.cardbook.tels.0", Components.interfaces.nsISupportsString).data;
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('link', 'true');
					}
					catch(e) {
						document.getElementById(aType + '_' + aIndex + '_valueBox').setAttribute('readonly', 'true');
					}
				}
			}
		},

		loadStaticMailPopularity: function (aIndex, aInputTypes) {
			var aOrigRows = document.getElementById('mailPopularityRows');

			var aRow = document.createElement('row');
			aOrigRows.appendChild(aRow);
			aRow.setAttribute('id', 'mailPopularity_' + aIndex + '_row');
			aRow.setAttribute('flex', '1');

			var myEmail = aInputTypes[0][0].toLowerCase(); 
			if (cardbookRepository.cardbookMailPopularityIndex[myEmail]) {
				var mailPopularityValue = cardbookRepository.cardbookMailPopularityIndex[myEmail];
			} else {
				var mailPopularityValue = "";
			}
			cardbookElementTools.addTextbox(aRow, 'popularity_' + aIndex + '_Textbox', mailPopularityValue, {readonly: 'true'});
			cardbookElementTools.addTextbox(aRow, 'email_' + aIndex + '_Textbox', myEmail, {readonly: 'true'});
		},

		loadDynamicMailPopularity: function (aIndex, aInputTypes) {
			var aOrigRows = document.getElementById('mailPopularityRows');
			
			var aRow = document.createElement('row');
			aOrigRows.appendChild(aRow);
			aRow.setAttribute('id', 'mailPopularity_' + aIndex + '_row');
			aRow.setAttribute('flex', '1');

			var myEmail = aInputTypes[0][0].toLowerCase(); 
			if (cardbookRepository.cardbookMailPopularityIndex[myEmail]) {
				var mailPopularityValue = cardbookRepository.cardbookMailPopularityIndex[myEmail];
			} else {
				var mailPopularityValue = "";
			}
			cardbookElementTools.addTextbox(aRow, 'popularity_' + aIndex + '_Textbox', mailPopularityValue);
			cardbookElementTools.addTextbox(aRow, 'email_' + aIndex + '_Textbox', myEmail);
		},

		loadStaticList: function (aCard) {
			cardbookElementTools.deleteRows('addedCardsBox');
			var strBundle = document.getElementById("cardbook-strings");
			var aOrigBox = document.getElementById('addedCardsBox');
			
			var addedCards = [];
			if (aCard.version == "4.0") {
				for (var i = 0; i < aCard.member.length; i++) {
					var uid = aCard.member[i].replace("urn:uuid:", "");
					if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+uid]) {
						var cardFound = cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+uid];
						if (cardFound.isAList) {
							addedCards.push([cardFound.fn, [""], cardFound.dirPrefId+"::"+cardFound.uid]);
						} else {
							addedCards.push([cardFound.fn, cardFound.emails, cardFound.dirPrefId+"::"+cardFound.uid]);
						}
					}
				}
			} else if (aCard.version == "3.0") {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					var localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
						if (header == memberCustom) {
							if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")]) {
								var cardFound = cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")];
								if (cardFound.isAList) {
									addedCards.push([cardFound.fn, [""], cardFound.dirPrefId+"::"+cardFound.uid]);
								} else {
									addedCards.push([cardFound.fn, cardFound.emails, cardFound.dirPrefId+"::"+cardFound.uid]);
								}
							}
						}
					}
				}
			}

			for (var i = 0; i < addedCards.length; i++) {
				var aRow = document.createElement('row');
				aOrigBox.appendChild(aRow);
				aRow.setAttribute('id', addedCards[i][2] + '_row');
				aRow.setAttribute('flex', '1');
				aRow.setAttribute('align', 'center');
				aRow.setAttribute('context', 'listsContextMenu');
				function fireDblClick(event) {
					var myId = this.id.replace(/_row$/, "");
					var myCardToDisplay = cardbookRepository.cardbookCards[myId];
					wdw_cardbook.editCardFromCard(myCardToDisplay)
					var myCardToRefresh = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
					cardbookTypes.loadStaticList(myCardToRefresh);
				};
				aRow.addEventListener("dblclick", fireDblClick, false);
	
				cardbookElementTools.addTextbox(aRow, addedCards[i][2] + '_fnBox', addedCards[i][0], {context: 'listsContextMenu', readonly: 'true'});
	
				cardbookElementTools.addTextbox(aRow, addedCards[i][2] + '_mailBox', addedCards[i][1].join(" "), {context: 'listsContextMenu', flex: '1', readonly: 'true'});
			}
		}

	};

};