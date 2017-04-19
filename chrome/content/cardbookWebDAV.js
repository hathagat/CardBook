Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function XMLToJSONParser(doc) {
	this._buildTree(doc);
}

XMLToJSONParser.prototype = {
	_buildTree: function XMLToJSONParser_buildTree(doc) {
		let nodeName = doc.documentElement.localName;
		this[nodeName] = [this._translateNode(doc.documentElement)];
	},
	
	_translateNode: function XMLToJSONParser_translateNode(node) {
		let value = null;
		if (node.childNodes.length) {
			let textValue = "";
			let dictValue = {};
			let hasElements = false;
			for (let i = 0; i < node.childNodes.length; i++) {
				let currentNode = node.childNodes[i];
				let nodeName = currentNode.localName;
				if (currentNode.nodeType == Components.interfaces.nsIDOMNode.TEXT_NODE) {
					textValue += currentNode.nodeValue;
				} else if (currentNode.nodeType == Components.interfaces.nsIDOMNode.CDATA_SECTION_NODE) {
					textValue += currentNode.nodeValue;
				} else if (currentNode.nodeType == Components.interfaces.nsIDOMNode.ELEMENT_NODE) {
					hasElements = true;
					let nodeValue = this._translateNode(currentNode);
					if (!dictValue[nodeName]) {
						dictValue[nodeName] = [];
					}
					dictValue[nodeName].push(nodeValue);
				}
			}
			if (hasElements) {
				value = dictValue;
			} else {
				value = textValue;
			}
		}
		return value;
	}
};

function cardbookWebDAV(connection, target, etag, asJSON) {
	this.prefId = connection.connPrefId;
	this.url = connection.connUrl;
	this.logDescription = connection.connDescription;
	this.target = target;
	this.etag = etag;
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var requestsTimeout = prefs.getComplexValue("extensions.cardbook.requestsTimeout", Components.interfaces.nsISupportsString).data;
	this.timeout = requestsTimeout * 1000;

	this.requestJSONResponse = false;
	this.requestXMLResponse = false;
	if (typeof asJSON != "undefined") {
		this.requestJSONResponse = asJSON;
		this.requestXMLResponse = !asJSON;
	}
	
	this.username = connection.connUser;
	this.password = "";
	this.accessToken = connection.accessToken;
	this.reportLength = 0;
	this.askCertificate = false;
}

cardbookWebDAV.prototype = {
	jsInclude: function(files, target) {
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
		for (var i = 0; i < files.length; i++) {
			try {
				loader.loadSubScript(files[i], target);
			}
			catch(e) {
				dump("cardbookWebDAV.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
			}
		}
	},

	// btoa does not encode €
	_b64EncodeUnicode: function (aString) {
		return btoa(encodeURIComponent(aString).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	},

	_getCredentials: function (aHeader) {
		this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js", "chrome://cardbook/content/cardbookPasswordManager.js"]);
		if (this.accessToken != null && this.accessToken !== undefined && this.accessToken != "") {
			if (this.accessToken !== "NOACCESSTOKEN") {
				aHeader["Authorization"] = this.accessToken;
				aHeader["GData-Version"] = "3";
			}
			this.username = "";
			this.password = "";
		} else {
			if (!(this.username != null && this.username !== undefined && this.username != "")) {
				if (this.prefId != null && this.prefId !== undefined && this.prefId != "") {
					var cardbookPrefService = new cardbookPreferenceService(this.prefId);
					this.username = cardbookPrefService.getUser();
				} else {
					this.username = "";
				}
			}
			if (this.username != null && this.username !== undefined && this.username != "") {
				this.password = cardbookPasswordManager.getNotNullPassword(this.username, this.prefId);
			}
			aHeader["Authorization"] = "Basic " + this._b64EncodeUnicode(this.username + ':' + this.password);
		}
	},

	_createTCPErrorFromFailedChannel: function (aChannel) {
		let status = aChannel.channel.QueryInterface(Components.interfaces.nsIRequest).status;
		let errType;
		
		if ((status & 0xff0000) === 0x5a0000) { // Security module
			const nsINSSErrorsService = Components.interfaces.nsINSSErrorsService;
			let nssErrorsService = Components.classes['@mozilla.org/nss_errors_service;1'].getService(nsINSSErrorsService);
			let errorClass;
			
			// getErrorClass will throw a generic NS_ERROR_FAILURE if the error code is
			// somehow not in the set of covered errors.
			try {
				errorClass = nssErrorsService.getErrorClass(status);
			} catch (ex) {
				//catching security protocol exception
				errorClass = 'SecurityProtocol';
			}
			
			if (errorClass == nsINSSErrorsService.ERROR_CLASS_BAD_CERT) {
				errType = 'SecurityCertificate';
			} else {
				errType = 'SecurityProtocol';
			}
			
			// NSS_SEC errors (happen below the base value because of negative vals)
			if ((status & 0xffff) < Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE)) {
				this.askCertificate = true;
				// The bases are actually negative, so in our positive numeric space, we
				// need to subtract the base off our value.
				let nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE) - (status & 0xffff);
				
				switch (nssErr) {
					case 11: // SEC_ERROR_EXPIRED_CERTIFICATE, sec(11)
						errName = 'SecurityExpiredCertificateError';
						break;
					case 12: // SEC_ERROR_REVOKED_CERTIFICATE, sec(12)
						errName = 'SecurityRevokedCertificateError';
						break;
					// per bsmith, we will be unable to tell these errors apart very soon,
					// so it makes sense to just folder them all together already.
					case 13: // SEC_ERROR_UNKNOWN_ISSUER, sec(13)
					case 20: // SEC_ERROR_UNTRUSTED_ISSUER, sec(20)
					case 21: // SEC_ERROR_UNTRUSTED_CERT, sec(21)
					case 36: // SEC_ERROR_CA_CERT_INVALID, sec(36)
						errName = 'SecurityUntrustedCertificateIssuerError';
						break;
					case 90: // SEC_ERROR_INADEQUATE_KEY_USAGE, sec(90)
						errName = 'SecurityInadequateKeyUsageError';
						break;
					case 176: // SEC_ERROR_CERT_SIGNATURE_ALGORITHM_DISABLED, sec(176)
						errName = 'SecurityCertificateSignatureAlgorithmDisabledError';
						break;
					default:
						errName = 'SecurityError';
						break;
				}
			} else {
				// Calculating the difference 
				let sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE) - (status & 0xffff);
				switch (sslErr) {
					case 3: // SSL_ERROR_NO_CERTIFICATE, ssl(3)
						errName = 'SecurityNoCertificateError';
						break;
					case 4: // SSL_ERROR_BAD_CERTIFICATE, ssl(4)
						errName = 'SecurityBadCertificateError';
						break;
					case 8: // SSL_ERROR_UNSUPPORTED_CERTIFICATE_TYPE, ssl(8)
						errName = 'SecurityUnsupportedCertificateTypeError';
						break;
					case 9: // SSL_ERROR_UNSUPPORTED_VERSION, ssl(9)
						errName = 'SecurityUnsupportedTLSVersionError';
						break;
					case 12: // SSL_ERROR_BAD_CERT_DOMAIN, ssl(12)
						errName = 'SecurityCertificateDomainMismatchError';
						break;
					default:
						errName = 'SecurityError';
						break;
				}
			}
		} else {
			errType = 'Network';
			switch (status) {
				// connect to host:port failed
				case 0x804B000C: // NS_ERROR_CONNECTION_REFUSED, network(13)
					errName = 'ConnectionRefusedError';
					break;
				// network timeout error
				case 0x804B000E: // NS_ERROR_NET_TIMEOUT, network(14)
					errName = 'NetworkTimeoutError';
					break;
				// hostname lookup failed
				case 0x804B001E: // NS_ERROR_UNKNOWN_HOST, network(30)
					errName = 'DomainNotFoundError';
					break;
				case 0x804B0047: // NS_ERROR_NET_INTERRUPT, network(71)
					errName = 'NetworkInterruptError';
					break;
				default:
					errName = 'NetworkError';
					break;
			}
		}
		
		wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Connection status : Failed : " + errName);
		this._dumpSecurityInfo(aChannel);
		// XXX: errType goes unused
	},

	_dumpSecurityInfo: function (aChannel) {
		let channel = aChannel.channel;
		try {
			let secInfo = channel.securityInfo;
			
			// Print general connection security state
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Security Information :");
			if (secInfo instanceof Components.interfaces.nsITransportSecurityInfo) {
				secInfo.QueryInterface(Components.interfaces.nsITransportSecurityInfo);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Security state of connection :");
				
				// Check security state flags
				if ((secInfo.securityState & Components.interfaces.nsIWebProgressListener.STATE_IS_SECURE) == Components.interfaces.nsIWebProgressListener.STATE_IS_SECURE) {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Secure connection");
				} else if ((secInfo.securityState & Components.interfaces.nsIWebProgressListener.STATE_IS_INSECURE) == Components.interfaces.nsIWebProgressListener.STATE_IS_INSECURE) {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Insecure connection");
				} else if ((secInfo.securityState & Components.interfaces.nsIWebProgressListener.STATE_IS_BROKEN) == Components.interfaces.nsIWebProgressListener.STATE_IS_BROKEN) {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Unknown");
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Security description : " + secInfo.shortSecurityDescription);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Security error message : " + secInfo.errorMessage);
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : No security info available for this channel");
			}
			
			// Print SSL certificate details
			if (secInfo instanceof Components.interfaces.nsISSLStatusProvider) {
				if (secInfo.QueryInterface(Components.interfaces.nsISSLStatusProvider).SSLStatus) {
					var cert = secInfo.QueryInterface(Components.interfaces.nsISSLStatusProvider).SSLStatus.QueryInterface(Components.interfaces.nsISSLStatus).serverCert;
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Common name (CN) : " + cert.commonName);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Issuer : " + cert.issuerOrganization);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Organisation : " + cert.organization);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : SHA1 fingerprint : " + cert.sha1Fingerprint);
					var validity = cert.validity.QueryInterface(Components.interfaces.nsIX509CertValidity);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Valid from " + validity.notBeforeGMT);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(this.logDescription + " : debug mode : Valid until " + validity.notAfterGMT);
				}
			}
		}
		catch(e) {
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var errorTitle = "_dumpSecurityInfo error";
			prompts.alert(null, errorTitle, e);
		}
	},

    _sendHTTPRequest: function(method, body, headers, aOverrideMime) {
    	try {
		let httpChannel = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
		httpChannel.loadFlags |= Components.interfaces.nsIRequest.LOAD_ANONYMOUS | Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE | Components.interfaces.nsIRequest.INHIBIT_PERSISTENT_CACHING;
		httpChannel.notificationCallbacks = this;

			if (this.timeout != null && this.timeout !== undefined && this.timeout != "") {
				httpChannel.timeout = this.timeout;
			}

			headers["X-client"] = "CardBook (Thunderbird)";
			// needed for Apple
			headers["User-Agent"] = "Thunderbird";

			// let httpAuthManager = Components.classes["@mozilla.org/network/http-auth-manager;1"].getService(Components.interfaces.nsIHttpAuthManager);
			// httpAuthManager.clearAll();
			this._getCredentials(headers);

			// if (this.username != null && this.username !== undefined && this.username != "") {
				// httpChannel.overrideMimeType("text/xml");
			// }

            let this_ = this;
			httpChannel.onerror = function(aEvent) {
				this_._createTCPErrorFromFailedChannel(httpChannel);
				this_._handleHTTPResponse(httpChannel, aEvent.target.status, aEvent.target.responseText.length, aEvent.target.responseText);
			};
			httpChannel.ontimeout = function(aEvent) {
				this_._createTCPErrorFromFailedChannel(httpChannel);
				this_._handleHTTPResponse(httpChannel, 408, aEvent.target.responseText.length, aEvent.target.responseText);
			};
			httpChannel.onload = function(aEvent) {
				this_._handleHTTPResponse(httpChannel, aEvent.target.status, aEvent.target.responseText.length, aEvent.target.responseText);
			};

			wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : method : ", method);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : body : ", body);
			if (headers) {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : headers : ", headers.toSource());
			}
			wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : username : ", this.username);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : url : ", this.url);

			httpChannel.open(method, this.url, true, this.username, this.password);
			
			if (aOverrideMime) {
				httpChannel.overrideMimeType('text/plain; charset=x-user-defined');
			}
			if (headers) {
				for (let header in headers) {
					httpChannel.setRequestHeader(header, headers[header]);
				}
			}

			if (body) {
				let converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8";
				let stream = converter.convertToInputStream(body);
				httpChannel.send(stream);
			} else {
				httpChannel.send();
			}

		}
		catch(e) {
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var errorTitle = "_sendHTTPRequest error";
			prompts.alert(null, errorTitle, e);
		}
    },

    _handleHTTPResponse: function(aChannel, aStatus, aResultLength, aResult) {
		var status = aStatus;
		var headers = {};
		var response = null;
		wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : response text : ", aResult);
		wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : response code : ", aStatus);
		wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : response etag : ", aChannel.getResponseHeader("etag"));
		if (status !== 499 && status !== 0 && status !== 408) {
			if (aResultLength > 0) {
				var responseText = aResult;
				if (this.requestJSONResponse || this.requestXMLResponse) {
					let xmlParser = Components.classes["@mozilla.org/xmlextras/domparser;1"].createInstance(Components.interfaces.nsIDOMParser);
					let responseXML = xmlParser.parseFromString(responseText, "text/xml");
					if (this.requestJSONResponse) {
						let parser = new XMLToJSONParser(responseXML);
						response = parser;
					} else {
						response = responseXML;
					}
				} else {
					response = responseText;
				}
			}
		}
		if (this.target && this.target.onDAVQueryComplete) {
			this.target.onDAVQueryComplete(status, response, this.askCertificate, aChannel.getResponseHeader("ETag"), this.reportLength);
		}
    },

    load: function(operation, parameters) {
        if (operation == "GET") {
			var headers = {};
			if (parameters.accept !== null) {
				headers.accept = parameters.accept;
			}
			this._sendHTTPRequest(operation, null, headers);
        } else if (operation == "GETIMAGE") {
			var headers = {};
			if (parameters.accept !== null) {
				headers.accept = parameters.accept;
			}
			this._sendHTTPRequest("GET", null, headers, "override");
        } else if (operation == "PUT") {
			if ((this.etag != null && this.etag !== undefined && this.etag != "") && (this.etag != "0")) {
				this._sendHTTPRequest(operation, parameters.data, { "content-type": parameters.contentType,
																	"If-Match": this.etag });
			} else {
				this._sendHTTPRequest(operation, parameters.data, { "content-type": parameters.contentType,
																	"If-None-Match": "*" });
			}
        } else if (operation == "PROPFIND") {
			let headers = { "depth": (parameters.deep ? "1": "0"), "content-type": "application/xml; charset=utf-8"};
			let query = this._propfindQuery(parameters.props);
			this._sendHTTPRequest(operation, query, headers);
       } else if (operation == "REPORT") {
			let headers = { "depth": (parameters.deep ? "1": "0"), "content-type": "application/xml; charset=utf-8"};
			let query = this._reportQuery(parameters.props);
			this._sendHTTPRequest(operation, query, headers);
        } else if (operation == "DELETE") {
        	this._sendHTTPRequest(operation, parameters, {});
        }
    },

	get: function(accept) {
		this.load("GET", {accept: accept});
	},

	getimage: function(accept) {
		this.load("GETIMAGE", {accept: accept});
	},

	put: function(data, contentType) {
		this.load("PUT", {data: data, contentType: contentType});
	},

	propfind: function(props, deep) {
		if (typeof deep == "undefined") {
			deep = true;
		}
		this.load("PROPFIND", {props: props, deep: deep});
	},

	report: function(props, deep) {
		if (typeof deep == "undefined") {
			deep = true;
		}
		this.load("REPORT", {props: props, deep: deep});
	},

	googleToken: function(aType, aParams, aHeaders) {
		var paramsString = "";
		for (var param in aParams) {
			if (!(paramsString != null && paramsString !== undefined && paramsString != "")) {
				paramsString = param + "=" + encodeURIComponent(aParams[param]);
			} else {
				paramsString = paramsString + "&" + param + "=" + encodeURIComponent(aParams[param]);
			}
		}
		var body = paramsString;

		this._sendHTTPRequest(aType, body, aHeaders);
	},
	
	delete: function() {
		this.load("DELETE");
	},
	
	_propfindQuery: function(props) {
		let nsDict = { "DAV:": "D" };
		let propPart = "";
		let nsCount = 0;
		for (let property in props) {
			let prop = props[property];
			let propParts = prop.split(" ");
			let ns = propParts[0];
			let nsS = nsDict[ns];
			if (!nsS) {
				nsS = "x" + nsCount;
				nsDict[ns] = nsS;
				nsCount++;
			}
			propPart += "<" + nsS + ":" + propParts[1] + "/>";
		}
		let query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><D:propfind";
		for (let ns in nsDict) {
			query += " xmlns:" + nsDict[ns] + "=\"" + ns + "\"";
		}
		query += ("><D:prop>" + propPart + "</D:prop></D:propfind>");
		return query;
	},

	_reportQuery: function(props) {
		var query = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
		query = query + "<C:addressbook-multiget xmlns:D=\"DAV:\" xmlns:C=\"urn:ietf:params:xml:ns:carddav\">";
		query = query + "<D:prop><D:getetag/><C:address-data content-type='text/vcard'/></D:prop>";
		for (var i = 0; i < props.length; i++) {
			this.reportLength++;
			query = query + "<D:href>" + this._formatRelativeHref(props[i]) + "</D:href>";
		}
		query = query + "</C:addressbook-multiget>";
		return query;
	},

	_formatRelativeHref: function(aString) {
		var decodeReport = true;
		try {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			decodeReport = prefs.getBoolPref("extensions.cardbook.decodeReport");
		} catch (e) {
			decodeReport = true;
		}
		var relative = aString.match("(https?)(://[^/]*)/([^#?]*)");
		if (relative && relative[3]) {
			var relativeHrefArray = [];
			relativeHrefArray = relative[3].split("/");
			for (var i = 0; i < relativeHrefArray.length; i++) {
				if (decodeReport) {
					relativeHrefArray[i] = decodeURIComponent(relativeHrefArray[i]);
				} else {
					relativeHrefArray[i] = encodeURIComponent(relativeHrefArray[i]);
				}
			}
			return "/" + relativeHrefArray.join("/");
		}
		wdw_cardbooklog.updateStatusProgressInformationWithDebug1(this.logDescription + " : debug mode : can not parse relative href : ", aString);
		return "";
	}
};
	