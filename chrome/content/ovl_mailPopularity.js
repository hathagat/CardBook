if ("undefined" == typeof(ovl_mailPopularity)) {
	Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
	cardbookMailPopularity.loadMailPopularity();
};
