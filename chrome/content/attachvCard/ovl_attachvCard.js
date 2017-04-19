if ("undefined" == typeof(ovl_attachvCard)) {
	var ovl_attachvCard = {
		
		attachvCard: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			var selected = document.getElementById("msgIdentity").selectedItem;
			var key = selected.getAttribute("identitykey");
			if (cardbookPrefService.getMailAccountEnabled(key)) {
				var filename = cardbookPrefService.getMailAccountFileName(key)
				if (filename != null && filename !== undefined && filename != "") {
					var cardbookId = cardbookPrefService.getMailAccountDirPrefId(key)+"::"+cardbookPrefService.getMailAccountUid(key)
					if (cardbookRepository.cardbookCards[cardbookId]) {
						var myCard = cardbookRepository.cardbookCards[cardbookId];
						var attachment = Components.classes["@mozilla.org/messengercompose/attachment;1"].createInstance(Components.interfaces.nsIMsgAttachment);
						attachment.contentType = "text/vcard";
						attachment.name = filename;
						var myFile = cardbookUtils.getTempFile(filename);
						if (myFile.exists() && myFile.isFile()) {
							try {
								myFile.remove(true);
							} catch(e) {
								cardbookUtils.formatStringForOutput("errorAttachingFile", [myFile.path, e], "Error");
								return;
							}
						}
						cardbookSynchronization.writeContentToFile(myFile.path, cardbookUtils.getvCardForEmail(myCard), "UTF8");
						if (myFile.exists() && myFile.isFile()) {
							attachment.url = "file:///" + myFile.path;
							gMsgCompose.compFields.addAttachment(attachment);
						} else {
							cardbookUtils.formatStringForOutput("errorAttachingFile", [myFile.path], "Error");
						}
					}
				}
			}
		}
	}
};

window.addEventListener("compose-send-message", function(e) { ovl_attachvCard.attachvCard(e); }, true);
