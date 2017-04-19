if ("undefined" == typeof(cardbookBirthdaysUtils)) {  
	var cardbookBirthdaysUtils = {
		lBirthdayList : [],
		lCalendarList : [],
		lBirthdaySyncResult : [],
		
		isCalendarWritable: function (aCalendar) {
			return (!aCalendar.getProperty("disabled") && !aCalendar.readOnly);
		},
		
		printf: function (S, L) {
			var nS = "";
			var tS = S.split("%S");
			if (tS.length != L.length+1) throw "Input error";
			
			for(var i=0; i<L.length; i++)
			nS += tS[i] + L[i];
			return nS + tS[tS.length-1];
		}, 

		getCalendars: function () {
			var myCalendar = cardbookBirthdaysUtils.getPref("extensions.cardbook.calendarsNameList");
			var calendarManager = Components.classes["@mozilla.org/calendar/manager;1"].getService(Components.interfaces.calICalendarManager);
			var lCalendars = calendarManager.getCalendars({});

			for (var i = 0; i < lCalendars.length; i++) {
				if (myCalendar.indexOf(lCalendars[i].id) >= 0) {
					cardbookBirthdaysUtils.lCalendarList.push(lCalendars[i]);
				}
			}
		},

		syncWithLightning: function () {
			var maxDaysUntilNextBirthday = cardbookBirthdaysUtils.getPref("extensions.cardbook.numberOfDaysForWriting");
			cardbookBirthdaysUtils.loadBirthdays(maxDaysUntilNextBirthday);

			cardbookBirthdaysUtils.getCalendars();
			
			if (cardbookBirthdaysUtils.lBirthdayList.length != 0) {
				cardbookBirthdaysUtils.lBirthdaySyncResult = [];
				Components.utils.import("resource://gre/modules/AddonManager.jsm");  
				AddonManager.getAddonByID(cardbookRepository.LIGHTNING_ID, cardbookBirthdaysUtils.doSyncWithLightning);
			}
		},

		doSyncWithLightning: function (addon) {
			if (addon && addon.isActive) {
				for (var i = 0; i < cardbookBirthdaysUtils.lCalendarList.length; i++) {
					cardbookBirthdaysUtils.syncCalendar(cardbookBirthdaysUtils.lCalendarList[i]);
				}
			}
		},

		syncCalendar: function (aCalendar) {
			var strBundle = document.getElementById("cardbook-strings");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var errorTitle;
			var errorMsg;

			// if calendar is not found, then abort 
			if (aCalendar == 0) {
				errorTitle = strBundle.getString("calendarNotFoundTitle");
				errorMsg = strBundle.getFormattedString("calendarNotFoundMessage",[aCalendar.name]);
				prompts.alert(null, errorTitle, errorMsg);
				return;	
			}

			// check if calendar is writable - if not, abort
			if (!(cardbookBirthdaysUtils.isCalendarWritable(aCalendar))) {
				errorTitle = strBundle.getString("calendarNotWritableTitle");
				errorMsg = strBundle.getFormattedString("calendarNotWritableMessage",[aCalendar.name]);
				prompts.alert(null, errorTitle, errorMsg);
				return;
			}

			cardbookBirthdaysUtils.lBirthdaySyncResult.push([aCalendar.name, 0, 0, 0, aCalendar.id]);
			cardbookBirthdaysUtils.syncBirthdays(aCalendar);
		},

		syncBirthdays: function (aCalendar1) {
			var strBundle = document.getElementById("cardbook-strings");
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
			var date_of_today = new Date();
			for (var i = 0; i < cardbookBirthdaysUtils.lBirthdayList.length; i++) {

				var ldaysUntilNextBirthday = cardbookBirthdaysUtils.lBirthdayList[i][0];
				var lBirthdayName  = cardbookBirthdaysUtils.lBirthdayList[i][1];
				var lBirthdayAge = cardbookBirthdaysUtils.lBirthdayList[i][2];
				var lDoB = cardbookBirthdaysUtils.lBirthdayList[i][3];

				// Calculate date of next birthday (i.e. current year / next year)
				var lDateOfBirth;
				if (lDoB.length == 5) {
					lDateOfBirth = new Date(convertStringToPRTime(convertDateToString(new Date(date_of_today.getFullYear(), lDoB.substring(3)-1, lDoB.substring(0,2)))) / 1000);
				} else {
					lDateOfBirth = new Date(convertStringToPRTime(lDoB) / 1000);
				}  
				var lBirthdayDate = new Date();
				lBirthdayDate.setDate(date_of_today.getDate()+parseInt(ldaysUntilNextBirthday));
	
				// generate Date as Ical compatible text string
				var lYear = lBirthdayDate.getFullYear();
				var lMonth = lBirthdayDate.getMonth() + 1;
				lMonth += "";
				if (lMonth.length == 1) {
					lMonth = "0"+lMonth;
				}
				var lDay = lBirthdayDate.getDate();
				lDay += "";
				if (lDay.length == 1) {
					lDay = "0" + lDay;
				}
				var lBirthdayDateString = lYear + "" + lMonth + "" + lDay;
				
				var lBirthdayDateNext = new Date(lBirthdayDate.getTime() + (24 * 60 * 60 * 1000));
				var lYear = lBirthdayDateNext.getFullYear();
				var lMonth = lBirthdayDateNext.getMonth() + 1;
				lMonth += "";
				if (lMonth.length == 1) {
					lMonth = "0"+lMonth;
				}
				var lDay = lBirthdayDateNext.getDate();
				lDay += "";
				if (lDay.length == 1) {
					lDay = "0" + lDay;
				}
				var lBirthdayDateNextString = lYear + "" + lMonth + "" + lDay;

				var lBirthdayId = cardbookUtils.getUUID();

				var leventEntryTitle = cardbookBirthdaysUtils.getPref("extensions.cardbook.eventEntryTitle");
				var checkTest = leventEntryTitle.split("%S").length - 1;
				if (checkTest != 2) {
					var lBirthdayTitle = strBundle.getFormattedString("eventEntryTitleMessage", [lBirthdayName, lBirthdayAge]);
				} else {
					var lBirthdayTitle = cardbookBirthdaysUtils.printf(leventEntryTitle, [lBirthdayName, lBirthdayAge]);		  
				}

				// prepare Listener
				var getListener = {
					mBirthdayId : lBirthdayId,
					mBirthdayName : lBirthdayName,
					mBirthdayAge : lBirthdayAge,
					mBirthdayDateString : lBirthdayDateString,
					mBirthdayDateNextString : lBirthdayDateNextString,
					mBirthdayTitle : lBirthdayTitle,
					mBirthdayResultGetCount : 0,
					mCalendar : aCalendar1, 
					onGetResult: function(aCalendar, aStatus, aItemType, aDetail, aCount, aItems) {
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.mCalendar.name + " : debug mode : aCount : " + aCount);
						for (let i=0; i < aCount; i++) {
							var summary = aItems[i].getProperty("SUMMARY");
							if (summary == this.mBirthdayTitle) {
								wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.mCalendar.name + " : debug mode : found : " + this.mBirthdayTitle + ", against : " + summary);
								this.mBirthdayResultGetCount++;
								break;
							} else {
								wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.mCalendar.name + " : debug mode : not found : " + this.mBirthdayTitle + ", against : " + summary);
							}
						}
					},
	
					onOperationComplete: function (aCalendar, aStatus, aOperationType, aId, aDetail) {
						if (this.mBirthdayResultGetCount === 0) {
							cardbookBirthdaysUtils.addNewCalendarEntry(this.mCalendar, this.mBirthdayId, this.mBirthdayName, this.mBirthdayAge, this.mBirthdayDateString, this.mBirthdayDateNextString, this.mBirthdayTitle);
						} else {
							cardbookUtils.formatStringForOutput("syncListExistingEntry", [this.mCalendar.name, this.mBirthdayName]);
							cardbookBirthdaysUtils.lBirthdaySyncResult.push([this.mCalendar.name, 1, 0, 0, this.mCalendar.id]);
						}
					}
				}
	
				var calICalendar = Components.interfaces.calICalendar;
				var startRange = new Date(lBirthdayDate.getTime() - (24 * 60 * 60 * 1000));
				var endRange = new Date(lBirthdayDate.getTime() + (24 * 60 * 60 * 1000));
				Components.utils.import("resource://calendar/modules/calUtils.jsm");
				startRange = cal.jsDateToDateTime(startRange);
				endRange = cal.jsDateToDateTime(endRange);
				aCalendar1.getItems(calICalendar.ITEM_FILTER_TYPE_EVENT, 0, startRange, endRange, getListener);
			}        
		},

		addNewCalendarEntry: function (aCalendar2, aBirthdayId, aBirthdayName, aBirthdayAge, aDate, aNextDate, aBirthdayTitle) {
			var strBundle = document.getElementById("cardbook-strings");

			// Strategy is to create iCalString and create Event from that string
			var iCalString = "BEGIN:VCALENDAR\n";
			iCalString += "BEGIN:VEVENT\n";

			var calendarEntryCategories = cardbookBirthdaysUtils.getPref("extensions.cardbook.calendarEntryCategories");
			if (calendarEntryCategories !== "") {
				iCalString += "CATEGORIES:" + calendarEntryCategories + "\n";
			}
			
			var eventEntryWholeDay = cardbookBirthdaysUtils.getPref("extensions.cardbook.eventEntryWholeDay");
			if (eventEntryWholeDay) {
				iCalString += "DTSTART:" + aDate + "\n";
				iCalString += "DTEND:" + aNextDate + "\n";
			} else {
				var eventEntryTime = cardbookBirthdaysUtils.getPref("extensions.cardbook.eventEntryTime");
				var EmptyParamRegExp1 = new RegExp("(.*)([^0-9])(.*)", "ig");
				if (eventEntryTime.replace(EmptyParamRegExp1, "$1")!=eventEntryTime) {
					var eventEntryTimeHour = eventEntryTime.replace(EmptyParamRegExp1, "$1");
					var eventEntryTimeMin = eventEntryTime.replace(EmptyParamRegExp1, "$3");
					if ( eventEntryTimeHour < 10 && eventEntryTimeHour.length == 1 ) {
						eventEntryTimeHour = "0" + eventEntryTimeHour;
					}
					if ( eventEntryTimeMin < 10 && eventEntryTimeMin.length == 1 ) {
						eventEntryTimeMin = "0" + eventEntryTimeMin;
					}
					var lBirthdayTimeString = eventEntryTimeHour.toString() + eventEntryTimeMin.toString() + "00";
				} else {
					var lBirthdayTimeString = "000000";
				}
				iCalString += "DTSTART:" + aDate + "T" + lBirthdayTimeString + "\n";
				iCalString += "DTEND:" + aDate + "T" + lBirthdayTimeString + "\n";
			}

			// set Alarm
			var lcalendarEntryAlarm = parseInt(cardbookBirthdaysUtils.getPref("extensions.cardbook.calendarEntryAlarm"));
			if (!isNaN(lcalendarEntryAlarm)) {
				iCalString += "BEGIN:VALARM\nACTION:DISPLAY\nTRIGGER:-P" + lcalendarEntryAlarm + "D\nEND:VALARM\n";
			}

			// finalize iCalString
			iCalString += "END:VEVENT\n";
			iCalString += "END:VCALENDAR\n";
			
			// create event Object out of iCalString
			var event = Components.classes["@mozilla.org/calendar/event;1"].createInstance(Components.interfaces.calIEvent);	
			event.icalString = iCalString;

			// set Title
			event.title = aBirthdayTitle;
			event.id = aBirthdayId;

			// prepare Listener
			var addListener = {
				mBirthdayId : aBirthdayId,
				mBirthdayName : aBirthdayName,
				mCalendar : aCalendar2, 
				onOperationComplete: function (aCalendar, aStatus, aOperationType, aId, aDetail) {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.mCalendar.name + " : debug mode : created operation finished : " + this.mBirthdayId + " : " + this.mBirthdayName);
					if (aStatus == 0) {
						cardbookUtils.formatStringForOutput("syncListCreatedEntry", [this.mCalendar.name, this.mBirthdayName]);
						cardbookBirthdaysUtils.lBirthdaySyncResult.push([this.mCalendar.name, 0, 0, 1, this.mCalendar.id]);
					} else {
						cardbookUtils.formatStringForOutput("syncListErrorEntry", [this.mCalendar.name, this.mBirthdayName], "Error");
						cardbookBirthdaysUtils.lBirthdaySyncResult.push([this.mCalendar.name, 0, 1, 0, this.mCalendar.id]);
					}
				}
			}

			// add Item to Calendar
			aCalendar2.addItem(event, addListener);
		},

		getPref: function (Name) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (prefs.getPrefType(Name) == prefs.PREF_STRING){
				var a = prefs.getComplexValue(Name, Components.interfaces.nsISupportsString).data;
				return a;
			} else if (prefs.getPrefType(Name) == prefs.PREF_BOOL){
				return prefs.getBoolPref(Name);
			}
		},
	
		daysBetween: function (date1, date2) {
			// The number of milliseconds in one day
			var oneDay = 1000 * 60 * 60 * 24
			
			date1.setHours(0);
			date2.setHours(0);
			date1.setMinutes(0);
			date2.setMinutes(0);
			date1.setSeconds(0);
			date2.setSeconds(0);
			
			// Convert both dates to milliseconds
			var date1_ms = date1.getTime()
			var date2_ms = date2.getTime()
			
			// Calculate the difference in milliseconds
			var difference_ms = date1_ms - date2_ms
			
			// Convert back to days and return
			return Math.round(difference_ms/oneDay)
		}, 

		calcDateOfNextBirthday: function (lDateRef, lDateOfBirth) {
			var lDoB_Year = lDateOfBirth.getFullYear();
			var lDoB_Month= lDateOfBirth.getMonth()+1;
			var lDoB_Day = lDateOfBirth.getDate();
			
			var lnextBirthday = new Date(lDateOfBirth);
			lnextBirthday.setFullYear(lDateRef.getFullYear());
			
			if (this.daysBetween(lnextBirthday, lDateRef)<0) {
				lnextBirthday = new Date(lDateRef.getFullYear()+1, lDoB_Month-1, lDoB_Day);
			}
			return lnextBirthday;
		},

		verifyDateFields: function (lFieldDay, lFieldMonth, lFieldYear) {
			var lReturn;
			if (lFieldDay == "" && lFieldMonth == "") {
				lReturn = "WRONGDATE";
			} else {
				if (lFieldDay <= 0 || lFieldDay > 31) {
					lReturn = "WRONGDATE";
				} else if (lFieldMonth <= 0 || lFieldMonth > 12) {
					lReturn = "WRONGDATE";
				} else if (lFieldYear <= 0 || lFieldYear > 3000) {
					lReturn = "WRONGDATE";
				} else {
					try {
						lReturn = convertDateToString(new Date(lFieldYear, lFieldMonth-1, lFieldDay));
					}
					catch (e) {
						lReturn = "WRONGDATE";
					}
				}
			}
			return lReturn;
		},

		convertDateToGoodFormat: function (lDateOfBirth2, aDateFormat) {
			switch(aDateFormat) {
				case "YYYY-MM-DD":
				case "DD-MM-YYYY":
				case "MM-DD-YYYY":
					var lSeparator = "-";
					break;
				case "YYYY.MM.DD":
				case "DD.MM.YYYY":
				case "MM.DD.YYYY":
					var lSeparator = ".";
					break;
				case "YYYY/MM/DD":
				case "DD/MM/YYYY":
				case "MM/DD/YYYY":
					var lSeparator = "/";
					break;
				default:
					var lSeparator = "";
					break;
			}
			var lReturn;
			var lFirstField;
			var lSecondField;
			var lThirdField;
			if (lDateOfBirth2.length < 3) {
				lReturn = "WRONGDATE";
			} else if (lSeparator != "" && lDateOfBirth2.indexOf(lSeparator) == -1) {
				lReturn = "WRONGDATE";
			} else if (lSeparator == "" && (lDateOfBirth2.indexOf("-") >= 0 || lDateOfBirth2.indexOf(".") >= 0 || lDateOfBirth2.indexOf("/") >= 0)) {
				lReturn = "WRONGDATE";
			} else {
				switch(aDateFormat) {
					case "YYYY-MM-DD":
					case "YYYY.MM.DD":
					case "YYYY/MM/DD":
						if (lDateOfBirth2.split(lSeparator).length == 3) {
							var EmptyParamRegExp2 = new RegExp("^([^\-]*)\\" + lSeparator + "([^\-]*)\\" + lSeparator + "([^\-]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
								lThirdField = lDateOfBirth2.replace(EmptyParamRegExp2, "$3");
								lThirdField = (lThirdField.length<2?'0':'') + lThirdField;
							}
							lReturn = this.verifyDateFields(lThirdField,lSecondField,lFirstField);
						} else {
							var EmptyParamRegExp2 = new RegExp("^([^\-]*)\\" + lSeparator + "([^\-]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							}
							lReturn = this.verifyDateFields(lSecondField,lFirstField,'666');
						}
						break;
					case "DD-MM-YYYY":
					case "DD.MM.YYYY":
					case "DD/MM/YYYY":
						if (lDateOfBirth2.split(lSeparator).length == 3) {
							var EmptyParamRegExp2 = new RegExp("^([^\.]*)\\" + lSeparator + "([^\.]*)\\" + lSeparator + "([^\.]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
								lThirdField = lDateOfBirth2.replace(EmptyParamRegExp2, "$3");
								lThirdField = (lThirdField.length<2?'0':'') + lThirdField;
							}
							lReturn = this.verifyDateFields(lFirstField,lSecondField,lThirdField);
						} else {
							var EmptyParamRegExp2 = new RegExp("^([^\.]*)\\" + lSeparator + "([^\.]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							}
							lReturn = this.verifyDateFields(lFirstField,lSecondField,'666');
						}
						break;
					case "MM-DD-YYYY":
					case "MM.DD.YYYY":
					case "MM/DD/YYYY":
						if (lDateOfBirth2.split(lSeparator).length == 3) {
							var EmptyParamRegExp2 = new RegExp("^([^\/]*)\\" + lSeparator + "([^\/]*)\\" + lSeparator + "([^\/]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
								lThirdField = lDateOfBirth2.replace(EmptyParamRegExp2, "$3");
								lThirdField = (lThirdField.length<2?'0':'') + lThirdField;
							}
							lReturn = this.verifyDateFields(lSecondField,lFirstField,lThirdField);
						} else {
							var EmptyParamRegExp2 = new RegExp("^([^\/]*)\\" + lSeparator + "([^\/]*)", "ig");
							if (lDateOfBirth2.replace(EmptyParamRegExp2, "$1")!=lDateOfBirth2) {
								lFirstField = lDateOfBirth2.replace(EmptyParamRegExp2, "$1");
								lFirstField = (lFirstField.length<2?'0':'') + lFirstField;
								lSecondField = lDateOfBirth2.replace(EmptyParamRegExp2, "$2");
								lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							}
							lReturn = this.verifyDateFields(lSecondField,lFirstField,'666');
						}
						break;
					case "YYYYMMDD":
						if (lDateOfBirth2.length == 8) {
							lFirstField = lDateOfBirth2.substr(0, 4);
							lSecondField = lDateOfBirth2.substr(4, 2);
							lThirdField = lDateOfBirth2.substr(6, 2);
							lReturn = this.verifyDateFields(lThirdField,lSecondField,lFirstField);
						} else if (lDateOfBirth2.length == 4 || lDateOfBirth2.length == 3) {
							lFirstField = lDateOfBirth2.substr(0, 2);
							lSecondField = lDateOfBirth2.substr(2, 2);
							lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							lReturn = this.verifyDateFields(lSecondField,lFirstField,'666');
						}
						break;
					case "DDMMYYYY":
						if (lDateOfBirth2.length == 8) {
							lFirstField = lDateOfBirth2.substr(0, 2);
							lSecondField = lDateOfBirth2.substr(2, 2);
							lThirdField = lDateOfBirth2.substr(4, 4);
							lReturn = this.verifyDateFields(lFirstField,lSecondField,lThirdField);
						} else if (lDateOfBirth2.length == 4 || lDateOfBirth2.length == 3) {
							lFirstField = lDateOfBirth2.substr(0, 2);
							lSecondField = lDateOfBirth2.substr(2, 2);
							lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							lReturn = this.verifyDateFields(lFirstField,lSecondField,'666');
						}
						break;
					case "MMDDYYYY":
						if (lDateOfBirth2.length == 8) {
							lFirstField = lDateOfBirth2.substr(0, 2);
							lSecondField = lDateOfBirth2.substr(2, 2);
							lThirdField = lDateOfBirth2.substr(4, 4);
							lReturn = this.verifyDateFields(lSecondField,lFirstField,lThirdField);
						} else if (lDateOfBirth2.length == 4 || lDateOfBirth2.length == 3) {
							lFirstField = lDateOfBirth2.substr(0, 2);
							lSecondField = lDateOfBirth2.substr(2, 2);
							lSecondField = (lSecondField.length<2?'0':'') + lSecondField;
							lReturn = this.verifyDateFields(lSecondField,lFirstField,'666');
						}
						break;
					default:
						lReturn = "WRONGDATE";
				}
			}
			return lReturn;
		},

		getAllBirthdaysByName: function (lDateOfBirth, lName, lNumberOfDays2, lDateOfBirthFound, lEmail) {
			var date_of_today = new Date();
			var endDate = new Date();
			var dateRef = new Date();
			var lnextBirthday;
			var lAge;
			var ldaysUntilNextBirthday;
			var lDateOfBirthOld = lDateOfBirth;
			lDateOfBirth = new Date(convertStringToPRTime(lDateOfBirth) / 1000);

			endDate.setDate(date_of_today.getDate()+parseInt(lNumberOfDays2));
			while (dateRef < endDate) {
				lnextBirthday = this.calcDateOfNextBirthday(dateRef,lDateOfBirth);
				if (lDateOfBirth.getFullYear() == "666") {
					lAge = "?";
					lDateOfBirthOld = "?";
				} else {
					lAge = lnextBirthday.getFullYear()-lDateOfBirth.getFullYear();
				}
				ldaysUntilNextBirthday = this.daysBetween(lnextBirthday, date_of_today);
				if (parseInt(ldaysUntilNextBirthday) <= parseInt(lNumberOfDays2)) {
					if (ldaysUntilNextBirthday === parseInt(ldaysUntilNextBirthday)) {
						cardbookBirthdaysUtils.lBirthdayList.push([ldaysUntilNextBirthday, lName, lAge, lDateOfBirthOld, lDateOfBirthFound, lEmail]);
					} else {
						cardbookBirthdaysUtils.lBirthdayList.push(["0", lName + " : Error", "0", "0", lDateOfBirthFound, lEmail]);
					}
				}
				dateRef.setMonth(dateRef.getMonth() + 12);
			}
		},
	
		loadBirthdays: function (lnumberOfDays) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://cardbook/content/wdw_log.js");
			loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
			var myContact = cardbookBirthdaysUtils.getPref("extensions.cardbook.addressBooksNameList");
			var searchInNote = cardbookBirthdaysUtils.getPref("extensions.cardbook.searchInNote");
			cardbookBirthdaysUtils.lBirthdayList = [];
			
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] && (cardbookRepository.cardbookAccounts[i][6] != "SEARCH")) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
					var dateFormat = cardbookPrefService.getDateFormat();
					if ((myContact.indexOf(myDirPrefId) >= 0 ) || (myContact === "allAddressBooks")) {
						var myDirPrefName = cardbookUtils.getPrefNameFromPrefId(myDirPrefId);
						for (var j = 0; j < cardbookRepository.cardbookDisplayCards[myDirPrefId].length; j++) {
							var myCard = cardbookRepository.cardbookDisplayCards[myDirPrefId][j];
							if (myCard.bday != "") {
								var lDateOfBirth = cardbookBirthdaysUtils.convertDateToGoodFormat(myCard.bday, dateFormat);
								if (lDateOfBirth != "WRONGDATE") {
									listOfEmail = cardbookUtils.getMimeEmailsFromCards([myCard]);
									cardbookBirthdaysUtils.getAllBirthdaysByName(lDateOfBirth, myCard.fn, lnumberOfDays, myCard.bday, listOfEmail);
								} else {
									cardbookUtils.formatStringForOutput("birthdayEntry1Wrong", [myDirPrefName, myCard.fn, myCard.bday, dateFormat], "Warning");
								}
							}
							if (searchInNote == true) {
								var lNotesLine = myCard.note.split("\n");
								for (var a=0;a<lNotesLine.length;a++) {
									var EmptyParamRegExp1 = new RegExp("^Birthday:([^:]*):([^:]*)([:]*)(.*)", "ig");
									if (lNotesLine[a].replace(EmptyParamRegExp1, "$1")!=lNotesLine[a]) {
										var lNotesName = lNotesLine[a].replace(EmptyParamRegExp1, "$1").replace(/^\s+|\s+$/g,"");
										if (lNotesLine[a].replace(EmptyParamRegExp1, "$2")!=lNotesLine[a]) {
											var lNotesDateFound = lNotesLine[a].replace(EmptyParamRegExp1, "$2").replace(/^\s+|\s+$/g,"");
											var lNotesDate = this.convertDateToGoodFormat(lNotesDateFound, dateFormat);
											if (lNotesDate != "WRONGDATE") {
												listOfEmail = cardbookUtils.getMimeEmailsFromCards([myCard]);
												cardbookBirthdaysUtils.getAllBirthdaysByName(lNotesDate, lNotesName, lnumberOfDays, lNotesDateFound, listOfEmail);
											} else {
												cardbookUtils.formatStringForOutput("birthdayEntry2Wrong", [myDirPrefName, myCard.fn, lNotesDateFound, dateFormat], "Warning");
											}
										}
									}
								}
							}
						}
					}
				}
			}
		} 
	};
};