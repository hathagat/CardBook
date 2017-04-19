if ("undefined" == typeof(wdw_csvTranslator)) {
	var wdw_csvTranslator = {

		cardbookeditlists : {},
		blankColumn : "",
		nIntervId : "",

		getSelectedLines: function (aTreeName) {
			var myTree = document.getElementById(aTreeName + 'Tree');
			var listOfSelected = {};
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			var count = 0;
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfSelected[j] = true;
					count++;
				}
			}
			return {lines: listOfSelected, total: count};
		},

		upColumns: function () {
			var myTreeName = "addedColumns";
			var myTree = document.getElementById(myTreeName + 'Tree');
			var listOfSelected = {};
			listOfSelected = wdw_csvTranslator.getSelectedLines(myTreeName);
			var first = true;
			var found = false;
			for (var i = 0; i < wdw_csvTranslator.cardbookeditlists[myTreeName].length; i++) {
				if (listOfSelected.lines[i]) {
					if (!first) {
						var temp = wdw_csvTranslator.cardbookeditlists[myTreeName][i-1];
						wdw_csvTranslator.cardbookeditlists[myTreeName][i-1] = wdw_csvTranslator.cardbookeditlists[myTreeName][i];
						wdw_csvTranslator.cardbookeditlists[myTreeName][i] = temp;
						found = true;
					}
				} else {
					first = false;
				}
			}
			wdw_csvTranslator.displayListTrees(myTreeName);
			for (var i = 0; i < wdw_csvTranslator.cardbookeditlists[myTreeName].length; i++) {
				if (!found && listOfSelected.lines[i]) {
					myTree.view.selection.rangedSelect(i,i,true);
				} else {
					if (listOfSelected.lines[i] && i == 0) {
						myTree.view.selection.rangedSelect(i,i,true);
					} else if (listOfSelected.lines[i]) {
						myTree.view.selection.rangedSelect(i-1,i-1,true);
					}
				}
			}
		},

		downColumns: function () {
			var myTreeName = "addedColumns";
			var myTree = document.getElementById(myTreeName + 'Tree');
			var listOfSelected = {};
			listOfSelected = wdw_csvTranslator.getSelectedLines(myTreeName);
			var first = true;
			var found = false;
			for (var i = wdw_csvTranslator.cardbookeditlists[myTreeName].length-1; i >= 0; i--) {
				if (listOfSelected.lines[i]) {
					if (!first) {
						var temp = wdw_csvTranslator.cardbookeditlists[myTreeName][i+1];
						wdw_csvTranslator.cardbookeditlists[myTreeName][i+1] = wdw_csvTranslator.cardbookeditlists[myTreeName][i];
						wdw_csvTranslator.cardbookeditlists[myTreeName][i] = temp;
						found = true;
					}
				} else {
					first = false;
				}
			}
			wdw_csvTranslator.displayListTrees(myTreeName);
			for (var i = 0; i < wdw_csvTranslator.cardbookeditlists[myTreeName].length; i++) {
				if (!found && listOfSelected.lines[i]) {
					myTree.view.selection.rangedSelect(i,i,true);
				} else {
					if (listOfSelected.lines[i] && i == wdw_csvTranslator.cardbookeditlists[myTreeName].length-1) {
						myTree.view.selection.rangedSelect(i,i,true);
					} else if (listOfSelected.lines[i]) {
						myTree.view.selection.rangedSelect(i+1,i+1,true);
					}
				}
			}
		},

		displayListTrees: function (aTreeName) {
			var availableCardsTreeView = {
				get rowCount() { return wdw_csvTranslator.cardbookeditlists[aTreeName].length; },
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == aTreeName + "Id") {
						if (wdw_csvTranslator.cardbookeditlists[aTreeName][idx]) return wdw_csvTranslator.cardbookeditlists[aTreeName][idx][0];
					}
					else if (column.id == aTreeName + "Name") {
						if (wdw_csvTranslator.cardbookeditlists[aTreeName][idx]) return wdw_csvTranslator.cardbookeditlists[aTreeName][idx][1];
					}
				}
			}
			document.getElementById(aTreeName + 'Tree').view = availableCardsTreeView;
		},

		modifyLists: function (aMenuOrTree) {
			switch (aMenuOrTree.id) {
				case "availableColumnsTreeChildren":
					var myAction = "appendlistavailableColumnsTree";
					break;
				case "addedColumnsTreeChildren":
					var myAction = "deletelistaddedColumnsTree";
					break;
				default:
					var myAction = aMenuOrTree.id.replace("Button", "");
					break;
			}
			var myAvailableColumnsTree = document.getElementById('availableColumnsTree');
			var myAddedColumnsTree = document.getElementById('addedColumnsTree');
			var myAvailableColumns = cardbookUtils.getSelectedCardsForList(myAvailableColumnsTree);
			var myAddedColumns = cardbookUtils.getSelectedCardsForList(myAddedColumnsTree);
			switch (myAction) {
				case "appendlistavailableColumnsTree":
					for (var i = 0; i < myAvailableColumns.length; i++) {
						wdw_csvTranslator.cardbookeditlists.addedColumns.push([myAvailableColumns[i][0], myAvailableColumns[i][1]]);
					}
					break;
				case "deletelistaddedColumnsTree":
					for (var i = myAddedColumns.length-1; i >= 0; i--) {
						wdw_csvTranslator.cardbookeditlists.addedColumns.splice(myAddedColumns[i][2], 1);
					}
					break;
				default:
					break;
			}
			wdw_csvTranslator.displayListTrees("addedColumns");
		},

		validateImportColumns: function () {
			if (wdw_csvTranslator.cardbookeditlists.foundColumns.length != wdw_csvTranslator.cardbookeditlists.addedColumns.length) {
				var strBundle = document.getElementById("cardbook-strings");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var confirmTitle = strBundle.getString("confirmTitle");
				var confirmMsg = strBundle.getString("missingColumnsConfirmMessage");
				if (!prompts.confirm(window, confirmTitle, confirmMsg)) {
					return false;
				}
				var missing = wdw_csvTranslator.cardbookeditlists.foundColumns.length - wdw_csvTranslator.cardbookeditlists.addedColumns.length;
				for (var i = 0; i < missing; i++) {
					wdw_csvTranslator.cardbookeditlists.addedColumns.push(["blank", wdw_csvTranslator.blankColumn]);
				}
				var more = wdw_csvTranslator.cardbookeditlists.addedColumns.length - wdw_csvTranslator.cardbookeditlists.foundColumns.length;
				for (var i = 0; i < more; i++) {
					wdw_csvTranslator.cardbookeditlists.addedColumns.slice(wdw_csvTranslator.cardbookeditlists.addedColumns.length, 1);
				}
			}
			return true;
		},

		loadFoundColumns: function () {
			wdw_csvTranslator.cardbookeditlists.foundColumns = [];
			var mySep = document.getElementById('columnSeparatorTextBox').value;
			if (mySep == "") {
				mySep = ";";
			}
			var myTempArray = window.arguments[0].headers.split(mySep);
			for (var i = 0; i < myTempArray.length; i++) {
				wdw_csvTranslator.cardbookeditlists.foundColumns.push([i, myTempArray[i]]);
			}
			wdw_csvTranslator.displayListTrees("foundColumns");
		},

		windowControlShowing: function () {
			var myTreeName = "addedColumns";
			var listOfSelected = {};
			listOfSelected = wdw_csvTranslator.getSelectedLines("addedColumns");
			if (listOfSelected.total > 0) {
				document.getElementById('upAddedColumnsTreeButton').disabled = false;
				document.getElementById('downAddedColumnsTreeButton').disabled = false;
			} else {
				document.getElementById('upAddedColumnsTreeButton').disabled = true;
				document.getElementById('downAddedColumnsTreeButton').disabled = true;
			}
		},

		setSyncControl: function () {
			wdw_csvTranslator.nIntervId = setInterval(wdw_csvTranslator.windowControlShowing, 500);
		},

		clearSyncControl: function () {
			clearInterval(wdw_csvTranslator.nIntervId);
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_csvTranslator.setSyncControl();

			var strBundle = document.getElementById("cardbook-strings");
			document.title = strBundle.getString(window.arguments[0].mode + "MappingTitle");
			document.getElementById('availableColumnsGroupboxLabel').label = strBundle.getString(window.arguments[0].mode + "availableColumnsGroupboxLabel");
			document.getElementById('addedColumnsGroupboxLabel').label = strBundle.getString(window.arguments[0].mode + "addedColumnsGroupboxLabel");
			document.getElementById('columnSeparatorLabel').value = strBundle.getString("columnSeparatorLabel");
			document.getElementById('columnSeparatorTextBox').value = window.arguments[0].columnSeparator;
			
			wdw_csvTranslator.cardbookeditlists.availableColumns = [];
			wdw_csvTranslator.cardbookeditlists.addedColumns = [];
			
			if (window.arguments[0].mode == "export") {
				document.getElementById('foundColumnsVBox').hidden = true;
				document.getElementById('lineHeaderLabel').hidden = true;
				document.getElementById('lineHeaderCheckBox').hidden = true;
			} else if (window.arguments[0].mode == "import") {
				document.getElementById('foundColumnsGroupboxLabel').label = strBundle.getString(window.arguments[0].mode + "foundColumnsGroupboxLabel");
				document.getElementById('lineHeaderLabel').value = strBundle.getString("lineHeaderLabel");
				document.getElementById('lineHeaderCheckBox').setAttribute('checked', true);
				wdw_csvTranslator.blankColumn = strBundle.getString(window.arguments[0].mode + "blankColumn");
				wdw_csvTranslator.cardbookeditlists.availableColumns.push(["blank", wdw_csvTranslator.blankColumn]);
			}
			
			wdw_csvTranslator.cardbookeditlists.availableColumns = wdw_csvTranslator.cardbookeditlists.availableColumns.concat(cardbookUtils.getAllAvailableColumns(window.arguments[0].mode));
			
			wdw_csvTranslator.displayListTrees("availableColumns");

			if (window.arguments[0].mode == "import") {
				wdw_csvTranslator.loadFoundColumns();
			}
            
		},

		save: function () {
			window.arguments[0].template = wdw_csvTranslator.cardbookeditlists.addedColumns;
			window.arguments[0].columnSeparator = document.getElementById('columnSeparatorTextBox').value;
			window.arguments[0].lineHeader = document.getElementById('lineHeaderCheckBox').checked;
			if (window.arguments[0].columnSeparator == "") {
				window.arguments[0].columnSeparator = ";";
			}
			window.arguments[0].action = "SAVE";
			if (window.arguments[0].mode == "import") {
				if (!wdw_csvTranslator.validateImportColumns()) {
					return;
				}
			}
			wdw_csvTranslator.close();
		},

		cancel: function () {
			window.arguments[0].action = "CANCEL";
			wdw_csvTranslator.close();
		},

		close: function () {
			wdw_csvTranslator.clearSyncControl();
			close();
		}

	};

};