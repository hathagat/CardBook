if ("undefined" == typeof(wdw_password)) {
	var wdw_password = {
		
		checkRequired: function () {
			if (document.getElementById('passwordTextBox').value != "") {
				document.getElementById('saveEditionLabel').disabled = false;
			} else {
				document.getElementById('saveEditionLabel').disabled = true;
			}
		},

		showPassword: function () {
			var passwordType = document.getElementById('passwordTextBox').type;
			if (passwordType != "password") {
				document.getElementById('passwordTextBox').type = "password";
			} else {
				document.getElementById('passwordTextBox').type = "";
			}
		},

		load: function () {
			document.getElementById('siteTextBox').value = window.arguments[0].site;
			document.getElementById('usernameTextBox').value = window.arguments[0].username;
			document.getElementById('passwordTextBox').focus();
		},

		save: function () {
			window.arguments[0].password = document.getElementById('passwordTextBox').value;
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};