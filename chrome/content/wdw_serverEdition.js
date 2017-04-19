if ("undefined" == typeof(wdw_serverEdition)) {
	var wdw_serverEdition = {

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById("serverNameTextBox").value = window.arguments[0].serverEditionName;
			document.getElementById("serverTypeTextBox").value = window.arguments[0].serverEditionType;
			document.getElementById("serverUserTextBox").value = window.arguments[0].serverEditionUser;
			document.getElementById("serverUrlTextBox").value = window.arguments[0].serverEditionUrl;
			document.getElementById("serverColorInput").value = window.arguments[0].serverEditionColor;
			if (window.arguments[0].serverEditionVCard == "3.0") {
				document.getElementById("serverVCardVersionMenu").selectedIndex = 0;
			} else {
				document.getElementById("serverVCardVersionMenu").selectedIndex = 1;
			}
			document.getElementById("serverReadOnlyCheckBox").setAttribute('checked', window.arguments[0].serverEditionReadOnly);
			cardbookElementTools.loadDateFormats("dateFormatMenuPopup", "dateFormatMenuList", window.arguments[0].serverEditionDateFormat);
			document.getElementById("serverReadOnlyCheckBox").setAttribute('checked', window.arguments[0].serverEditionReadOnly);
			document.getElementById("serverUrnuuidCheckBox").setAttribute('checked', window.arguments[0].serverEditionUrnuuid);
		},

		save: function () {
			window.arguments[0].serverCallback("SAVE", window.arguments[0].serverEditionId, document.getElementById('serverNameTextBox').value,
												document.getElementById('serverColorInput').value, document.getElementById('serverVCardVersionMenu').value,
												document.getElementById('serverReadOnlyCheckBox').checked, document.getElementById('dateFormatMenuList').value,
												document.getElementById('serverUrnuuidCheckBox').checked);
			close();
		},

		cancel: function () {
			window.arguments[0].serverCallback("CANCEL");
			close();
		}

	};

};