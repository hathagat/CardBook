if ("undefined" == typeof(ovl_attachments)) {
	var ovl_attachments = {
		
		setCardBookMenus: function (aValue) {
			document.getElementById('attachments1CardBookImport').disabled = aValue;
			document.getElementById('attachments2CardBookImport').disabled = aValue;
			document.getElementById('attachment1CardBookImport').disabled = aValue;
			document.getElementById('attachment2CardBookImport').disabled = aValue;
			if (!aValue) {
				Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
				cardbookUtils.addToCardBookMenuSubMenu('attachments1CardBookImportPopup', ovl_attachments.importFileIntoCardBook);
				cardbookUtils.addToCardBookMenuSubMenu('attachments2CardBookImportPopup', ovl_attachments.importFileIntoCardBook);
				cardbookUtils.addToCardBookMenuSubMenu('attachment1CardBookImportPopup', ovl_attachments.importFileIntoCardBook);
				cardbookUtils.addToCardBookMenuSubMenu('attachment2CardBookImportPopup', ovl_attachments.importFileIntoCardBook);
			}
		},

		displayCardBookMenu: function() {
			var disabled = true;
			var attachmentList = document.getElementById('attachmentList');
			var selectedAttachments = attachmentList.selectedItems;
			if (selectedAttachments.length == 0) {
				for (var i = 0; i < currentAttachments.length; i++) {
					var attachment = currentAttachments[i];
					var myFileArray = attachment.name.split(".");
					var myExtension =  myFileArray[myFileArray.length-1];
					if (myExtension.toLowerCase() == "vcf") {
						disabled = false;
						break;
					}
				}
			} else {
				for (var i = 0; i < selectedAttachments.length; i++) {
					var attachment = selectedAttachments[i].attachment;
					var myFileArray = attachment.name.split(".");
					var myExtension =  myFileArray[myFileArray.length-1];
					if (myExtension.toLowerCase() == "vcf") {
						disabled = false;
						break;
					}
				}
			}
			ovl_attachments.setCardBookMenus(disabled);
		},

		loadAttachment: function(aAttachment, aDirPrefId) {
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://cardbook/content/cardbookSynchronization.js");
			loader.loadSubScript("chrome://cardbook/content/cardbookUtils.js");
			var myFileArray = aAttachment.name.split(".");
			var myExtension =  myFileArray[myFileArray.length-1];
			if (myExtension.toLowerCase() == "vcf") {
				var myFile = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);
				var myUuid = cardbookUtils.getUUID();
				var myFileName = myUuid + ".vcf";
				myFile.append(myFileName);
				var listener_loadFile = {
					mFile : myFile,
					myDirPrefId : aDirPrefId,
					OnStartRunningUrl: function (aUrl) {
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : start downloading attachment...");
					},
					OnStopRunningUrl: function (aUrl, aStatus) {
						if (aStatus == 0) {
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : attachment successfully downloaded");
							cardbookSynchronization.loadFile(this.mFile, this.myDirPrefId, "", "WINDOW", "");
						} else {
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : attachment not successfully downloaded, status : " + aStatus);
						}
						if (this.mFile.exists() && this.mFile.isFile()) {
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : deleting file : " + this.mFile.path);
							this.mFile.remove(true);
						}
					}
				};
				messenger.saveAttachmentToFile(myFile, aAttachment.url, aAttachment.uri, aAttachment.contentType, listener_loadFile);
			}
		},

		importFileIntoCardBook: function(aDirPrefId) {
			var attachmentList = document.getElementById('attachmentList');
			var selectedAttachments = attachmentList.selectedItems;
			if (selectedAttachments.length == 0) {
				for (var i = 0; i < currentAttachments.length; i++) {
					ovl_attachments.loadAttachment(currentAttachments[i], aDirPrefId);
				}
			} else {
				for (var i = 0; i < selectedAttachments.length; i++) {
					ovl_attachments.loadAttachment(selectedAttachments[i].attachment, aDirPrefId);
				}
			}
		}
	}
};

// for the displaying or not import into CardBook for all attachments
// onShowSaveAttachmentMenuMultiple
(function() {
	// Keep a reference to the original function.
	var _original = onShowSaveAttachmentMenuMultiple;
	
	// Override a function.
	onShowSaveAttachmentMenuMultiple = function() {
		
		// Execute original function.
		var rv = _original.apply(null, arguments);
		ovl_attachments.displayCardBookMenu();
		
		// return the original result
		return rv;
	};

})();

// for the displaying or not import into CardBook for one attachment
// onShowSaveAttachmentMenuSingle
(function() {
	// Keep a reference to the original function.
	var _original = onShowSaveAttachmentMenuSingle;
	
	// Override a function.
	onShowSaveAttachmentMenuSingle = function() {
		
		// Execute original function.
		var rv = _original.apply(null, arguments);
		ovl_attachments.displayCardBookMenu();
		
		// return the original result
		return rv;
	};

})();

// for the displaying or not import into CardBook for all attachments
// goUpdateAttachmentCommands
(function() {
	// Keep a reference to the original function.
	var _original = goUpdateAttachmentCommands;
	
	// Override a function.
	goUpdateAttachmentCommands = function() {
		
		// Execute original function.
		var rv = _original.apply(null, arguments);
		ovl_attachments.displayCardBookMenu();
		
		// return the original result
		return rv;
	};

})();

// for the displaying or not import into CardBook for one attachment
// onShowAttachmentItemContextMenu
(function() {
	// Keep a reference to the original function.
	var _original = onShowAttachmentItemContextMenu;
	
	// Override a function.
	onShowAttachmentItemContextMenu = function() {
		
		// Execute original function.
		var rv = _original.apply(null, arguments);
		ovl_attachments.displayCardBookMenu();
		
		// return the original result
		return rv;
	};

})();
