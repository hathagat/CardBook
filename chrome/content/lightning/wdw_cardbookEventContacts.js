if ("undefined" == typeof(wdw_cardbookEventContacts)) {  
	var wdw_cardbookEventContacts = {
		allEvents: [],
		emailArray: [],
		attendeeId: "",
		attendeeName: "",

		sortTreesFromCol: function (aEvent, aColumn) {
			if (aEvent.button == 0) {
				wdw_cardbookEventContacts.sortTrees(aColumn);
			}
		},

		sortTrees: function (aColumn) {
			var myTree = document.getElementById('eventsTree');
			if (aColumn) {
				if (myTree.currentIndex !== -1) {
					var mySelectedValue = myTree.view.getCellText(myTree.currentIndex, {id: aColumn.id});
				}
			}

			var columnName;
			var columnArray;
			var columnType;
			var order = myTree.getAttribute("sortDirection") == "ascending" ? 1 : -1;

			if (aColumn) {
				var myColumn = aColumn;
				columnName = aColumn.id;
				if (myTree.getAttribute("sortResource") == columnName) {
					order *= -1;
				}
			} else {
				columnName = myTree.getAttribute("sortResource");
				var myColumn = document.getElementById(columnName);
			}
            var sortKey = myColumn.getAttribute("itemproperty");
            var sortType = cal.getSortTypeForSortKey(sortKey);
            cal.sortEntry.mSortKey = sortKey;
            cal.sortEntry.mSortStartedDate = cal.now();
            var entries = wdw_cardbookEventContacts.allEvents.map(cal.sortEntry, cal.sortEntry);
            entries.sort(cal.sortEntryComparer(sortType, order));
            wdw_cardbookEventContacts.allEvents = entries.map(cal.sortEntryItem);

			//setting these will make the sort option persist
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);
			
			wdw_cardbookEventContacts.displayEvents();
			
			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select back
			if (aColumn && mySelectedValue) {
				for (var i = 0; i < myTree.view.rowCount; i++) {
					if (myTree.view.getCellText(i, {id: aColumn.id}) == mySelectedValue) {
						myTree.view.selection.rangedSelect(i,i,true);
						found = true
						foundIndex = i;
						break;
					}
				}
			}
		},

		doubleClickTree: function (aEvent) {
			var myTree = document.getElementById('eventsTree');
			if (myTree.currentIndex != -1) {
				var row = { }, col = { }, child = { };
				myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
				if (row.value != -1) {
					wdw_cardbookEventContacts.editEvent();
				}
			}
		},

		columnSelectorContextShowing: function (aEvent) {
			var target = document.popupNode;
			// If a column header was clicked, show the column picker.
			if (target.localName == "treecol") {
				let treecols = target.parentNode;
				let nodeList = document.getAnonymousNodes(treecols);
				let treeColPicker;
				for (let i = 0; i < nodeList.length; i++) {
					if (nodeList.item(i).localName == "treecolpicker") {
						treeColPicker = nodeList.item(i);
						break;
					}
				}
				let popup = document.getAnonymousElementByAttribute(treeColPicker, "anonid", "popup");
				treeColPicker.buildPopup(popup);
				popup.openPopup(target, "after_start", 0, 0, true);
				return false;
			}
			return true;
		},

		displayEvents: function () {
			var eventsTreeView = {
				get rowCount() { return wdw_cardbookEventContacts.allEvents.length; },
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					var calendarEvent = wdw_cardbookEventContacts.allEvents[idx];
					if (column.id == "title") return (calendarEvent.title ? calendarEvent.title.replace(/\n/g, ' ') : "");
					else if (column.id == "startDate") return wdw_cardbookEventContacts.formatEventDateTime(calendarEvent.startDate);
					else if (column.id == "endDate") {
						let eventEndDate = calendarEvent.endDate.clone();
						if (calendarEvent.startDate.isDate) {
							eventEndDate.day = eventEndDate.day - 1;
						}
						return wdw_cardbookEventContacts.formatEventDateTime(eventEndDate);
					} else if (column.id == "categories") return calendarEvent.getCategories({}).join(", ");
					else if (column.id == "location") return calendarEvent.getProperty("LOCATION");
					else if (column.id == "status") return getEventStatusString(calendarEvent);
					else if (column.id == "calendarName") return calendarEvent.calendar.name;
				}
			}
			document.getElementById('eventsTree').view = eventsTreeView;
			wdw_cardbookEventContacts.selectEvents();
		},

		formatEventDateTime: function (aDatetime) {
			return cal.getDateFormatter().formatDateTime(aDatetime.getInTimezone(cal.calendarDefaultTimezone()));
		},
		
		getItemFromEvent: function (event) {
			let row = document.getElementById('eventsTree').treeBoxObject.getRowAt(event.clientX, event.clientY);
			if (row > -1) {
				return wdw_cardbookEventContacts.allEvents[row];
			}
			return null;
		},

		selectEvents: function() {
			var btnEdit = document.getElementById("editEventLabel");
			var myTree = document.getElementById("eventsTree");
			if (myTree.view.selection.getRangeCount() > 0) {
				btnEdit.disabled = false;
			} else {
				btnEdit.disabled = true;
			}
		},

		editEvent: function() {
			var myTree = document.getElementById('eventsTree');
			if (myTree.currentIndex == -1) {
				return;
			} else {
				var myItem = wdw_cardbookEventContacts.allEvents[myTree.currentIndex];
				let dlg = cal.findItemWindow(myItem);
				if (dlg) {
					dlg.focus();
					disposeJob(null);
					return;
				}
				
				let onModifyItem = function(item, calendar, originalItem, listener) {
					doTransaction('modify', item, calendar, originalItem, listener);
					wdw_cardbookEventContacts.loadEvents();
				};
				
				let item = myItem;
				let futureItem, response;
				[item, futureItem, response] = promptOccurrenceModification(myItem, true, "edit");
				
				if (item && (response || response === undefined)) {
					openEventDialog(item, item.calendar, "modify", onModifyItem, null, null);
				} else {
					disposeJob(null);
				}
			}
		},

		createEvent: function() {
			var onNewEvent = function(item, calendar, originalItem, listener) {
				if (item.id) {
					// If the item already has an id, then this is the result of
					// saving the item without closing, and then saving again.
					doTransaction('modify', item, calendar, originalItem, listener);
				} else {
					// Otherwise, this is an addition
					doTransaction('add', item, calendar, null, listener);
				}
				wdw_cardbookEventContacts.loadEvents();
			};
		
			event = cal.createEvent();
			var calendar = cal.getCompositeCalendar().defaultCalendar;
			var refDate = cal.now();
			
			var attendee = cal.createAttendee();
			attendee.id = wdw_cardbookEventContacts.attendeeId;
			attendee.commonName = wdw_cardbookEventContacts.attendeeName;
			attendee.isOrganizer = false;
			attendee.role = "REQ-PARTICIPANT";
			attendee.userType = "INDIVIDUAL";
			event.addAttendee(attendee);
			
			setDefaultItemValues(event, calendar, null, null, refDate, null);
			openEventDialog(event, event.calendar, "new", onNewEvent, null);
		},

		chooseActionForKey: function (aEvent) {
			if (aEvent.key == "Enter") {
				wdw_cardbookEventContacts.editEvent();
				aEvent.stopPropagation();
			}
		},
		
		addItemsFromCalendar: function (aCalendar, aAddItemsInternalFunc) {
			var refreshListener = {
				QueryInterface: XPCOMUtils.generateQI([Components.interfaces.calIOperationListener]),
				mEventArray: [],
				onOperationComplete: function (aCalendar, aStatus, aOperationType, aId, aDateTime) {
					var refreshTreeInternalFunc = function() {
						aAddItemsInternalFunc(refreshListener.mEventArray);
					};
					setTimeout(refreshTreeInternalFunc, 0);
				},
				
				onGetResult: function (aCalendar, aStatus, aItemType, aDetail, aCount, aItems) {
					refreshListener.mEventArray = refreshListener.mEventArray.concat(aItems);
				}
			};
			
			let filter = 0;
			filter |= aCalendar.ITEM_FILTER_TYPE_EVENT;
			
			aCalendar.getItems(filter, 0, null, null, refreshListener);
		},

		addItemsFromCompositeCalendarInternal: function (eventArray) {
			wdw_cardbookEventContacts.allEvents = wdw_cardbookEventContacts.allEvents.concat(eventArray);

			// filter does not work
			for (var i = 0; i < wdw_cardbookEventContacts.allEvents.length; i++) {
				let found = false;
				let attendeesArray = cal.getRecipientList(wdw_cardbookEventContacts.allEvents[i].getAttendees({})).split(', ');
				for (let j = 0; !found && j < attendeesArray.length; j++) {
					for (let k = 0; !found && k < wdw_cardbookEventContacts.emailArray.length; k++) {
						if (attendeesArray[j].indexOf(wdw_cardbookEventContacts.emailArray[k].toLowerCase()) >= 0) {
							found = true;
						}
					}
				}
				if (!found) {
					wdw_cardbookEventContacts.allEvents.splice(i,1);
					i--;
				}
			}
			wdw_cardbookEventContacts.sortTrees(null);
		},

		loadEvents: function () {
			wdw_cardbookEventContacts.allEvents = [];
			for each (let calendar in cal.getCalendarManager().getCalendars({})) {
				if (!calendar.getProperty("disabled")) {
					wdw_cardbookEventContacts.addItemsFromCalendar(calendar, wdw_cardbookEventContacts.addItemsFromCompositeCalendarInternal);
				}
			}
		},

		load: function () {
			Components.utils.import("resource://calendar/modules/calUtils.jsm");
			Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var strBundle = document.getElementById("cardbook-strings");
			wdw_cardbookEventContacts.emailArray = window.arguments[0].listOfEmail;
			wdw_cardbookEventContacts.attendeeId = window.arguments[0].attendeeId;
			wdw_cardbookEventContacts.attendeeName = window.arguments[0].attendeeName;
			document.title=strBundle.getFormattedString("eventContactsWindowLabel", [window.arguments[0].displayName]);

			wdw_cardbookEventContacts.loadEvents();
		},
	
		do_close: function () {
			close();
		}
	}; 
};

function ensureCalendarVisible(aCalendar) {};
function goUpdateCommand(aCommand) {};
