if ("undefined" == typeof(cardbookPasswordManager)) {
	var cardbookPasswordManager = {

		googleHostname : "chrome://cardbook/oauth",
		
		getRootUrl: function (aUrl) {
			try {
				var urlArray1 = aUrl.split("://");
				var urlArray2 = urlArray1[1].split("/");
				return urlArray1[0] + "://" + urlArray2[0];
			}
			catch (e) {
				return "";
			}
		},
		
		getNotNullPassword: function (aUsername, aPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aPrefId);
			var myUrl = cardbookPrefService.getUrl();
			var result = cardbookPasswordManager.getPassword(aUsername, myUrl);
			if (result == "") {
				var myArgs = {site: myUrl, username: aUsername, password: "", action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_password.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					cardbookPasswordManager.removeAccount(aUsername, myUrl);
					cardbookPasswordManager.addAccount(aUsername, myUrl, myArgs.password);
					return myArgs.password;
				}
			}
			return result;
		},
		
		getPassword: function (aUsername, aUrl) {
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
			if (aUrl.indexOf(cardbookRepository.cardbookgdata.GOOGLE_API) === -1) {
				var logins = myLoginManager.findLogins({}, cardbookPasswordManager.getRootUrl(aUrl), "User login", null);
			} else {
				// google case
				var logins = myLoginManager.findLogins({}, this.googleHostname, "User Refresh Token", null);
			}
			for (var i = 0; i < logins.length; i++) {
				if (logins[i].username == aUsername) {
					return logins[i].password;
				}
			}
			return "";
		},
		
		addAccount: function (aUsername, aUrl, aPassword) {
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
			var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init");
			if (aUrl != null && aUrl !== undefined && aUrl != "") {
				var login_info = new nsLoginInfo(cardbookPasswordManager.getRootUrl(aUrl), "User login", null, aUsername, aPassword, "", "");
			} else {
				// google case
				var login_info = new nsLoginInfo(this.googleHostname, "User Refresh Token", null, aUsername, aPassword, "", "");
			}
			myLoginManager.addLogin(login_info);
			return true;
		},
		
		removeAccount: function (aUsername, aUrl) {
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
			if (aUrl != null && aUrl !== undefined && aUrl != "") {
				var logins = myLoginManager.findLogins({}, cardbookPasswordManager.getRootUrl(aUrl), "User login", null);
			} else {
				// google case
				var logins = myLoginManager.findLogins({}, this.googleHostname, "User Refresh Token", null);
			}
			for (var i = 0; i < logins.length; i++) {
				if (logins[i].username == aUsername) {
					myLoginManager.removeLogin(logins[i]);
					return true;
				}
			}
			return false;
		}
		
	};

};