if ("undefined" == typeof(wdw_cardbookAddIMPP)) {
	var wdw_cardbookAddIMPP = {
		
		checkRequired: function () {
			if (document.getElementById('IMPPCodeTextBox').value != "" && document.getElementById('IMPPLabelTextBox').value != "" && document.getElementById('IMPPProtocolTextBox').value != "") {
				document.getElementById('saveEditionLabel').disabled = false;
			} else {
				document.getElementById('saveEditionLabel').disabled = true;
			}
		},

		load: function () {
			document.getElementById('IMPPCodeTextBox').value = window.arguments[0].code;
			document.getElementById('IMPPLabelTextBox').value = window.arguments[0].label;
			document.getElementById('IMPPProtocolTextBox').value = window.arguments[0].protocol;
			document.getElementById('IMPPCodeTextBox').focus();
			wdw_cardbookAddIMPP.checkRequired();
		},

		save: function () {
			window.arguments[0].code = document.getElementById('IMPPCodeTextBox').value.replace(/:/g, "").trim();
			window.arguments[0].label = document.getElementById('IMPPLabelTextBox').value.replace(/:/g, "").trim();
			window.arguments[0].protocol = document.getElementById('IMPPProtocolTextBox').value.replace(/:/g, "").trim();
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
window.addEventListener("input", wdw_cardbookAddIMPP.checkRequired, true);
window.addEventListener("command", wdw_cardbookAddIMPP.checkRequired, true);
