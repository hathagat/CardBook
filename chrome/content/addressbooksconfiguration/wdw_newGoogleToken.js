if ("undefined" == typeof(wdw_newGoogleToken)) {
	var wdw_newGoogleToken = {

		closeKO: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			cardbookRepository.cardbookGoogleRefreshTokenError[window.arguments[0].dirPrefId]++;
			cardbookRepository.cardbookGoogleRefreshTokenResponse[window.arguments[0].dirPrefId]++;
			cardbookRepository.cardbookServerSyncResponse[window.arguments[0].dirPrefId]++;
			close();
		}
	};

};