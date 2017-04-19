if ("undefined" == typeof(wdw_cardbookConfigurationDisplayCard)) {
	var wdw_cardbookConfigurationDisplayCard = {
		
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById("vCardData").value = window.arguments[0].data
		},

		cancel: function () {
			window.arguments[0].typeAction="CANCEL";
			close();
		}

	};

};