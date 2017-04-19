if ("undefined" == typeof(cardbookTabType)) {
	var cardbookTabMonitor = {
		monitorName: "cardbook",
		onTabTitleChanged: function() {},
		onTabOpened: function(aTab) {
			if (aTab.mode.name == "cardbook") {
				wdw_cardbook.loadFirstWindow();
			}
		},
		onTabClosing: function(aTab) {
			if (aTab.mode.name == "cardbook") {
				document.getElementById("cardboookModeBroadcaster").setAttribute("mode", "mail");
				document.getElementById("unreadMessageCount").hidden=false;
			}
		},
		onTabPersist: function() {},
		onTabRestored: function() {},
		onTabSwitched: function(aNewTab, aOldTab) {
			var strBundle = document.getElementById("cardbook-strings");
			if (aNewTab.mode.name == "cardbook") {
				document.getElementById("cardboookModeBroadcaster").setAttribute("mode", "cardbook");
				document.getElementById("totalMessageCount").setAttribute("tooltiptext", strBundle.getString("statusProgressInformationTooltip"));
			} else {
				document.getElementById("cardboookModeBroadcaster").setAttribute("mode", "mail");
				document.getElementById("totalMessageCount").removeAttribute("tooltiptext");
				wdw_cardbook.setElementLabel('statusText', "");
				document.getElementById("unreadMessageCount").hidden=false;
			}
		}
	};

	var cardbookTabType = {
		name: "cardbook",
		panelId: "cardbookTabPanel",
		modes: {
			cardbook: {
				type: "cardbookTab",
				maxTabs: 1,
				openTab: function(aTab, aArgs) {
					aTab.title = aArgs["title"];
				},

				showTab: function(aTab) {
				},

				closeTab: function(aTab) {
				},
				
				persistTab: function(aTab) {
					let tabmail = document.getElementById("tabmail");
					return {
						background: (aTab != tabmail.currentTabInfo)
						};
				},
				
				restoreTab: function(aTabmail, aState) {
					var strBundle = document.getElementById("cardbook-strings");
					aState.title = strBundle.getString("cardbookTitle");
					ovl_cardbookLayout.orientPanes();
					aTabmail.openTab('cardbook', aState);
				},
				
				onTitleChanged: function(aTab) {
					var strBundle = document.getElementById("cardbook-strings");
					aTab.title = strBundle.getString("cardbookTitle");
				},
				
				supportsCommand: function supportsCommand(aCommand, aTab) {
					switch (aCommand) {
						case "cmd_viewClassicMailLayout":
						case "cmd_viewVerticalMailLayout":
						case "cmd_printSetup":
						case "cmd_print":
						case "cmd_printpreview":
							return true;
						default:
							return false;
					}
				},
				
				isCommandEnabled: function isCommandEnabled(aCommand, aTab) {
					switch (aCommand) {
						case "cmd_viewClassicMailLayout":
						case "cmd_viewVerticalMailLayout":
						case "cmd_printSetup":
						case "cmd_print":
						case "cmd_printpreview":
							return true;
						default:
							return false;
					}
				},
				
				doCommand: function doCommand(aCommand, aTab) {
					switch (aCommand) {
						case "cmd_viewClassicMailLayout":
						case "cmd_viewVerticalMailLayout":
							ovl_cardbookLayout.changeOrientPanes(aCommand);
							break;
						case "cmd_printSetup":
							PrintUtils.showPageSetup();
							break;
						case "cmd_print":
						case "cmd_printpreview":
							wdw_cardbook.print();
							break;
					}
				},

				onEvent: function(aEvent, aTab) {}
			}
		},

		saveTabState: function(aTab) {
		}
	};
};

if ("undefined" == typeof(ovl_cardbook)) {
	var ovl_cardbook = {
		// if Lightning is not installed the CardBook toolbar is shown this way
		// if Lightning is installed the CardBook toolbar is shown in the file ovl_lightningMenus.js
		overrideToolbarMenu: function(addon) {
			if (!(addon && addon.isActive)) {
				var menus = [ 'toolbar-context-menu', 'menu_Toolbars' ];
				for (var i in menus) {
					if (document.getElementById(menus[i])) {
						var myMenu = document.getElementById(menus[i]);
						myMenu.removeEventListener('popupshowing', arguments.callee, true);
						myMenu.addEventListener("popupshowing", function(event) {
							if (document.getElementById('cardboookModeBroadcaster').getAttribute('mode') == 'cardbook') {
								onViewToolbarsPopupShowing(event, ["navigation-toolbox", "cardbook-toolbox"]);
							}
						});
					}
				}
			}
		},

		open: function() {
			var tabmail = document.getElementById("tabmail");
			if (!tabmail) {
				// Try opening new tabs in an existing 3pane window
				let mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("mail:3pane");
				if (mail3PaneWindow) {
					tabmail = mail3PaneWindow.document.getElementById("tabmail");
					mail3PaneWindow.focus();
				}
			}
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			tabmail.openTab('cardbook', {title: strBundle.GetStringFromName("cardbookTitle")});
		}
	};
};

window.addEventListener("load", function(e) {
	let tabmail = document.getElementById('tabmail');
	if (tabmail) {
		tabmail.registerTabType(cardbookTabType);
		tabmail.registerTabMonitor(cardbookTabMonitor);
	}

	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var firstRun = prefs.getBoolPref("extensions.cardbook.firstRun");

	if (firstRun) {
		var toolbar = document.getElementById("mail-bar3");
		if (toolbar) {
			var toolbarItems = toolbar.currentSet.split(",");
			var found = false;
			for (var i=0; i<toolbarItems.length; i++) {
				if (toolbarItems[i] == "cardbookToolbarButton") {
					found = true;
					break;
				}
			}
			if (!found) {
				toolbar.insertItem("cardbookToolbarButton");
				toolbar.setAttribute("currentset", toolbar.currentSet);
				document.persist(toolbar.id, "currentset");
			}
		}
		prefs.setBoolPref("extensions.cardbook.firstRun", false);
	}

	if (document.getElementById("addressBook")) {
		document.getElementById("addressBook").removeAttribute("key");
	}
	if (document.getElementById("appmenu_addressBook")) {
		document.getElementById("appmenu_addressBook").removeAttribute("key");
	}
	if (document.getElementById("key_addressbook")) {
		document.getElementById("key_addressbook").setAttribute("key", "");
	}

	// for CardBook toolbar if Lightning is not installed
	Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
	Components.utils.import("resource://gre/modules/AddonManager.jsm");  
	AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, ovl_cardbook.overrideToolbarMenu);
	
	window.removeEventListener('load', arguments.callee, true);
}, false);
