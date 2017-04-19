if ("undefined" == typeof(wdw_cardbookAddType)) {
	var wdw_cardbookAddType = {
		
		load: function () {
			document.getElementById('typeCodeTextBox').value = window.arguments[0].code;
			document.getElementById('typeLabelTextBox').value = window.arguments[0].label;
			document.getElementById('typeCodeTextBox').focus();
		},

		save: function () {
			window.arguments[0].code = document.getElementById('typeCodeTextBox').value.trim();
			window.arguments[0].label = document.getElementById('typeLabelTextBox').value.trim();
			window.arguments[0].typeAction="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].typeAction="CANCEL";
			close();
		}

	};

};

window.addEventListener("popupshowing", wdw_cardEdition.loadRichContext, true);
