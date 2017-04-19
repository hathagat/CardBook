if ("undefined" == typeof(wdw_birthdayList)) {  
	var wdw_birthdayList = {
		
		enableSyncList: function(addon) {
			if (addon && addon.isActive) {
				document.getElementById('syncLightningMenuItemLabel').disabled = false;
			} else {
				document.getElementById('syncLightningMenuItemLabel').disabled = true;
			}
		},

		setupWindow: function () {
			Components.utils.import("resource://gre/modules/AddonManager.jsm");  
			AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, this.enableSyncList);
		},
	
		displayAllBirthdays: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_birthdayList.setupWindow();
			
			var strBundle = document.getElementById("cardbook-strings");
			var maxDaysUntilNextBirthday = cardbookBirthdaysUtils.getPref("extensions.cardbook.numberOfDaysForSearching");
			cardbookBirthdaysUtils.loadBirthdays(maxDaysUntilNextBirthday);
			cardbookBirthdaysUtils.lBirthdayList = cardbookUtils.sortArrayByNumber(cardbookBirthdaysUtils.lBirthdayList,0,1);

			// if there are no birthdays in the configured timespan
			if (cardbookBirthdaysUtils.lBirthdayList.length == 0) {
				var today = new Date();
				today = new Date(today.getTime() + maxDaysUntilNextBirthday *24*60*60*1000);
				var noBirthdaysFoundMessage = strBundle.getFormattedString("noBirthdaysFoundMessage", new Array(convertDateToString(today)));
				var treeView = {
					rowCount : 1,
					getCellText : function(row,column){
						if (column.id == "daysleft") return noBirthdaysFoundMessage;
					}
				}
			} else {
				var treeView = {
					rowCount : cardbookBirthdaysUtils.lBirthdayList.length,
					getCellText : function(row,column){
						if (column.id == "daysleft") return cardbookBirthdaysUtils.lBirthdayList[row][0];
						else if (column.id == "name") return cardbookBirthdaysUtils.lBirthdayList[row][1];
						else if (column.id == "age") return cardbookBirthdaysUtils.lBirthdayList[row][2];
						else if (column.id == "dateofbirth") return cardbookBirthdaysUtils.lBirthdayList[row][3];
						else if (column.id == "dateofbirthfound") return cardbookBirthdaysUtils.lBirthdayList[row][4];
						else if (column.id == "email") return cardbookBirthdaysUtils.lBirthdayList[row][5];
						else return cardbookBirthdaysUtils.lBirthdayList[row][5];
					}
				}
			}
			document.getElementById('birthdayListTree').view = treeView;
			document.title=strBundle.getFormattedString("birthdaysListWindowLabel", [cardbookBirthdaysUtils.lBirthdayList.length.toString()]);
		},
	
		configure: function () {
			var myArgs = {showTab: "birthdaylistTab"};
			var MyWindows = window.openDialog("chrome://cardbook/content/wdw_cardbookConfiguration.xul", "", "chrome,centerscreen,modal", myArgs);
			wdw_birthdayList.displayAllBirthdays();
		},
	
		displaySyncList: function() {
			var MyWindows = window.openDialog("chrome://cardbook/content/birthdays/wdw_birthdaySync.xul", "", "chrome,centerscreen,modal,resizable");
		},

		sendEmail: function () {
			var strBundle = document.getElementById("cardbook-strings");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var myTree = document.getElementById('birthdayListTree');
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();

			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
			    for (var k = start.value; k <= end.value; k++){
					var myEmail = myTree.view.getCellText(k, myTree.columns.getNamedColumn('email'));
					var myName = myTree.view.getCellText(k, myTree.columns.getNamedColumn('name'));
					if (myEmail == "") {
						var errorTitle = strBundle.getString("warningTitle");
						var errorMsg = strBundle.getFormattedString("noEmailFoundMessage", new Array(myName));
						prompts.alert(null, errorTitle, errorMsg);
					} else {
						var msgComposeType = Components.interfaces.nsIMsgCompType;
						var msgComposFormat = Components.interfaces.nsIMsgCompFormat;
						var msgComposeService = Components.classes["@mozilla.org/messengercompose;1"].getService();
						var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
						
						msgComposeService = msgComposeService.QueryInterface(Components.interfaces.nsIMsgComposeService);
						if (params) {
							params.type = msgComposeType.New;
							params.format = msgComposFormat.Default;
							var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
							if (composeFields) {
								composeFields.to = myEmail;
								params.composeFields = composeFields;
								msgComposeService.OpenComposeWindowWithParams(null, params);
							}
						}
					}
			    }
			}
		},
	
		do_close: function () {
			close();
		}
	}; 
};