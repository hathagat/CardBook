if ("undefined" == typeof(cardbookMailPopularity)) {
	var cardbookMailPopularity = {

		updateMailPopularity: function (aEmail) {
			var addresses = {}, names = {}, fullAddresses = {};
			MailServices.headerParser.parseHeadersWithArray(aEmail, addresses, names, fullAddresses);
			for (var i = 0; i < addresses.value.length; i++) {
				if (addresses.value[i] == "") {
					continue;
				}
				if (cardbookRepository.cardbookMailPopularityIndex[addresses.value[i].toLowerCase()]) {
					cardbookRepository.cardbookMailPopularityIndex[addresses.value[i].toLowerCase()]++;
				} else {
					cardbookRepository.cardbookMailPopularityIndex[addresses.value[i].toLowerCase()] = 1;
				}
			}
			cardbookMailPopularity.writeMailPopularity();
		},

		loadMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (cacheDir.exists()) {
				var params = {};
				params["showError"] = true;
				cardbookSynchronization.getFileDataAsync(cacheDir.path, cardbookMailPopularity.loadMailPopularityAsync, params);
			}
		},

		loadMailPopularityAsync: function (aContent) {
			var re = /[\n\u0085\u2028\u2029]|\r\n?/;
			var fileContentArray = aContent.split(re);
			for (var i = 0; i < fileContentArray.length; i++) {
				var mySepPosition = fileContentArray[i].indexOf(":",0);
				var myEmail = fileContentArray[i].substr(0,mySepPosition).toLowerCase();
				var myCount = fileContentArray[i].substr(mySepPosition+1,fileContentArray[i].length);
				if (myEmail != null && myEmail !== undefined && myEmail != "") {
					if (myCount != null && myCount !== undefined && myCount != "" && myCount != "0") {
						cardbookRepository.cardbookMailPopularityIndex[myEmail] = myCount;
					}
				}
			}
		},

		writeMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (!cacheDir.exists()) {
				// read and write permissions to owner and group, read-only for others.
				cacheDir.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
			}
			if (cacheDir.exists()) {
				var sortable = [];
				for (var mail in cardbookRepository.cardbookMailPopularityIndex) {
					var lowerMail = mail.toLowerCase();
					sortable.push([lowerMail, cardbookRepository.cardbookMailPopularityIndex[lowerMail]]);
				}
				sortable = cardbookUtils.sortArrayByNumber(sortable,1,-1);

				var writable = [];
				for (var i = 0; i < sortable.length; i++) {
					var myEmail = sortable[i][0];
					var myCount = sortable[i][1];
					if (myEmail != null && myEmail !== undefined && myEmail != "") {
						if (myCount != null && myCount !== undefined && myCount != "" && myCount != "0") {
							writable.push([sortable[i].join(":").toLowerCase()]);
						}
					}
				}
				cardbookSynchronization.writeFileDataAsync(cacheDir.path, writable.join("\r\n"), function () {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : Mail popularity written to : " + cacheDir.path);
				});
			}
		},

		removeMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (cacheDir.exists() && cacheDir.isFile()) {
				cacheDir.remove(true);
			}
		}

	};

};