// with Ligthning 4.7
// onToolbarsPopupShowingWithMode
(function() {
	if (!("undefined" == typeof(onToolbarsPopupShowingWithMode))) {
		// Keep a reference to the original function.
		var _original = onToolbarsPopupShowingWithMode;
	
		// Override a function.
		onToolbarsPopupShowingWithMode = function() {
			// Execute original function.
			var rv = _original.apply(null, arguments);
			
			// Execute some action afterwards.
			if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook') {
				onViewToolbarsPopupShowing(arguments[0], ["navigation-toolbox", "cardbook-toolbox"], arguments[1]);
			}
			
			// return the original result
			return rv;
		};
	}

})();

// with Ligthning 5.4
// onToolbarsPopupShowingForTabType
(function() {
	if (!("undefined" == typeof(onToolbarsPopupShowingForTabType))) {
		// Keep a reference to the original function.
		var _original = onToolbarsPopupShowingForTabType;
	
		// Override a function.
		onToolbarsPopupShowingForTabType = function() {
			// Execute original function.
			var rv = _original.apply(null, arguments);
			
			// Execute some action afterwards.
			if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook') {
				onViewToolbarsPopupShowing(arguments[0], ["navigation-toolbox", "cardbook-toolbox"], arguments[1]);
			}
			
			// return the original result
			return rv;
		};
	}

})();
