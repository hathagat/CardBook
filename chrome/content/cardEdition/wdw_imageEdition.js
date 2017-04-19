if ("undefined" == typeof(wdw_imageEdition)) {
	var wdw_imageEdition = {

		displayImageCard: function (aCard, aDisplayDefault) {
			if (aCard.photo.localURI != null && aCard.photo.localURI !== undefined && aCard.photo.localURI != "") {
				document.getElementById('imageBox').removeAttribute('hidden');
				wdw_imageEdition.resizeImageCard(aCard.photo.localURI);
			} else {
				if (aDisplayDefault) {
					document.getElementById('imageBox').removeAttribute('hidden');
					wdw_imageEdition.resizeImageCard("chrome://cardbook/skin/missing_photo_200_214.png");
				} else {
					document.getElementById('imageBox').setAttribute('hidden', 'true');
				}
			}
		},

		resizeImageCard: function (aFileURI) {
			var myImage = document.getElementById('defaultCardImage');
			var myDummyImage = document.getElementById('imageForSizing');
			
			myImage.src = "";
			myDummyImage.src = "";
			myDummyImage.src = aFileURI;
			myDummyImage.onload = function() {
				var myImageWidth = 170;
				var myImageHeight = 170;
				if (myDummyImage.width >= myDummyImage.height) {
					widthFound = myImageWidth + "px" ;
					heightFound = Math.round(myDummyImage.height * myImageWidth / myDummyImage.width) + "px" ;
				} else {
					widthFound = Math.round(myDummyImage.width * myImageHeight / myDummyImage.height) + "px" ;
					heightFound = myImageHeight + "px" ;
				}
				myImage.width = widthFound;
				myImage.height = heightFound;
				myImage.src = aFileURI;
			}
			myDummyImage.onerror = function() {
				if (document.getElementById('photolocalURITextBox')) {
					document.getElementById('photolocalURITextBox').value = "";
				}
				if (document.getElementById('photoURITextBox')) {
					document.getElementById('photoURITextBox').value = "";
				}
				if (document.getElementById('photoExtensionTextBox')) {
					document.getElementById('photoExtensionTextBox').value = "";
				}
				cardbookUtils.adjustFields();
				wdw_imageEdition.resizeImageCard("chrome://cardbook/skin/missing_photo_200_214.png");
			}
		},

		addImageCardFromFile: function () {
			if (document.getElementById('photolocalURITextBox').value == "") {
				var myFile = cardbookUtils.callFilePicker("imageSelectionTitle", "OPEN", "IMAGES");
				var myExtension = cardbookUtils.getExtension(myFile.path);
				if (myExtension != "") {
					var myCard = wdw_cardEdition.workingCard;
					myExtension = cardbookUtils.formatExtension(myExtension, myCard.version);
					var targetFile = cardbookUtils.getEditionPhotoTempFile(myExtension);
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURISpec = "file:///" + targetFile.path;
					var myFileURI = ioService.newURI(myFileURISpec, null, null);
					var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
					myFile.copyToFollowingLinks(myFile1.parent, myFile1.leafName);
					cardbookUtils.formatStringForOutput("imageSavedToFile", [myFile1.path]);
					wdw_imageEdition.addImageCard(myFile1, myCard, myExtension);
				}
			}
		},

		addImageCardFromUrl: function () {
			if (document.getElementById('photolocalURITextBox').value == "") {
				var myUrl = cardbookUtils.clipboardGet();
				var myExtension = cardbookUtils.getExtension(myUrl);
				if (myExtension != "") {
					var myCard = wdw_cardEdition.workingCard;
					myExtension = cardbookUtils.formatExtension(myExtension, myCard.version);
					var targetFile = cardbookUtils.getEditionPhotoTempFile(myExtension);
					
					Components.utils.import("resource://gre/modules/Downloads.jsm");
					Components.utils.import("resource://gre/modules/Task.jsm");
					try {
						Task.spawn(function () {
							// Fetch a file in the background.
							let download_1 = Downloads.fetch(myUrl, targetFile);
							yield Promise.all([download_1]);
							
							// Do something with the saved files.
							cardbookUtils.formatStringForOutput("urlDownloaded", [myUrl]);
							wdw_imageEdition.addImageCard(targetFile, myCard, myExtension);
						});
					}
					catch(e) {
						cardbookUtils.formatStringForOutput("imageErrorWithMessage", [e]);
					}
				}
			}
		},

		addImageCardFromClipboard: function () {
			if (document.getElementById('photolocalURITextBox').value == "") {
				var myExtension = "png";
				var myCard = wdw_cardEdition.workingCard;
				var targetFile = cardbookUtils.getEditionPhotoTempFile(myExtension);
				var myResult = cardbookUtils.clipboardGetImage(targetFile);
				if (myResult) {
					wdw_imageEdition.addImageCard(targetFile, myCard, myExtension);
				} else {
					cardbookUtils.formatStringForOutput("imageError");
				}
			}
		},

		addImageCard: function (aFile, aCard, aExtension) {
			if (aFile != null && aFile !== undefined && aFile != "") {
				if (aCard.version === "4.0") {
					aExtension = aExtension.toLowerCase();
				} else {
					aExtension = aExtension.toUpperCase();
				}
				document.getElementById('photoURITextBox').value = "";
				document.getElementById('photolocalURITextBox').value = "file:///" + aFile.path;
				document.getElementById('photoExtensionTextBox').value = aExtension;
				wdw_cardEdition.workingCard.photo.URI = "";
				wdw_cardEdition.workingCard.photo.localURI = "file:///" + aFile.path;
				wdw_cardEdition.workingCard.photo.extension = aExtension;
				wdw_imageEdition.displayImageCard(wdw_cardEdition.workingCard, true);
			}
		},

		saveImageCard: function () {
			if (document.getElementById('photolocalURITextBox').value !== "") {
				var myFile = cardbookUtils.callFilePicker("imageSaveTitle", "SAVE", "IMAGES");
				if (myFile != null && myFile !== undefined && myFile != "") {
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURISpec = document.getElementById('photolocalURITextBox').value;
					var myFileURI = ioService.newURI(myFileURISpec, null, null);
					var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
					myFile1.copyToFollowingLinks(myFile.parent,myFile.leafName);
					cardbookUtils.formatStringForOutput("imageSavedToFile", [myFile.path]);
				}
			}
		},

		deleteImageCard: function () {
			var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
			document.getElementById('defaultCardImage').src = "chrome://cardbook/skin/missing_photo_200_214.png";
			document.getElementById('photolocalURITextBox').value = "";
			document.getElementById('photoURITextBox').value = "";
			wdw_cardEdition.workingCard.photo.URI = "";
			wdw_cardEdition.workingCard.photo.localURI = "";
			wdw_cardEdition.workingCard.photo.extension = "";
			wdw_imageEdition.displayImageCard(wdw_cardEdition.workingCard, true);
		},

		imageCardContextShowing: function () {
			if (document.getElementById('defaultCardImage').src == "chrome://cardbook/skin/missing_photo_200_214.png") {
				document.getElementById('addImageCardFromFile').disabled=false;
				document.getElementById('addImageCardFromClipboard').disabled=false;
				document.getElementById('addImageCardFromUrl').disabled=false;
				document.getElementById('saveImageCard').disabled=true;
				document.getElementById('deleteImageCard').disabled=true;
			} else {
				document.getElementById('addImageCardFromFile').disabled=true;
				document.getElementById('addImageCardFromClipboard').disabled=true;
				document.getElementById('addImageCardFromUrl').disabled=true;
				document.getElementById('saveImageCard').disabled=false;
				document.getElementById('deleteImageCard').disabled=false;
			}
		}

	};

};
