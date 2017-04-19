if ("undefined" == typeof(cardbookSynchronization)) {
	var cardbookSynchronization = {

		autoSync: "",
		autoSyncInterval: "",
		autoSyncId: "",

		initRefreshToken: function(aPrefId) {
			cardbookRepository.cardbookServerValidation = {};
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initSync: function(aPrefId) {
			cardbookRepository.cardbookSyncMode = "SYNC";
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initURLValidation: function(aPrefId) {
			cardbookRepository.cardbookServerValidation = {};
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initMultipleOperations: function(aPrefId) {
			cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId] = 0;
			cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId] = 0;
			cardbookRepository.cardbookGoogleAccessTokenError[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId] = 0;
			cardbookRepository.cardbookDirRequest[aPrefId] = 0;
			cardbookRepository.cardbookDirResponse[aPrefId] = 0;
			cardbookRepository.cardbookFileRequest[aPrefId] = 0;
			cardbookRepository.cardbookFileResponse[aPrefId] = 0;
			cardbookRepository.cardbookDBRequest[aPrefId] = 0;
			cardbookRepository.cardbookDBResponse[aPrefId] = 0;
			cardbookRepository.filesFromCacheDB[aPrefId] = [];
			cardbookRepository.cardbookServerDiscoveryRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerDiscoveryResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerDiscoveryError[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncLoadCacheDone[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncLoadCacheTotal[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDone[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncTotal[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncError[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNotUpdated[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNewOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNewOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnBoth[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncAgain[aPrefId] = false;
			cardbookRepository.cardbookServerSyncCompareWithCacheDone[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncHandleRemainingDone[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncHandleRemainingTotal[aPrefId] = 0;
			cardbookRepository.cardbookServerGetRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerGetResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerGetError[aPrefId] = 0;
			cardbookRepository.cardbookServerGetForMergeRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerGetForMergeResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerGetForMergeError[aPrefId] = 0;
			cardbookRepository.cardbookServerMultiGetArray[aPrefId] = [];
			cardbookRepository.cardbookServerMultiGetParams[aPrefId] = [];
			cardbookRepository.cardbookServerMultiGetRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerMultiGetResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerMultiGetError[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedError[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedError[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedError[aPrefId] = 0;
			cardbookRepository.cardbookImageGetRequest[aPrefId] = 0;
			cardbookRepository.cardbookImageGetResponse[aPrefId] = 0;
			cardbookRepository.cardbookImageGetError[aPrefId] = 0;
		},

		nullifyMultipleOperations: function() {
			cardbookRepository.cardbookGoogleAccessTokenRequest = {};
			cardbookRepository.cardbookGoogleAccessTokenResponse = {};
			cardbookRepository.cardbookGoogleAccessTokenError = {};
			cardbookRepository.cardbookGoogleRefreshTokenRequest = {};
			cardbookRepository.cardbookGoogleRefreshTokenResponse = {};
			cardbookRepository.cardbookGoogleRefreshTokenError = {};
			cardbookRepository.cardbookDirRequest = {};
			cardbookRepository.cardbookDirResponse = {};
			cardbookRepository.cardbookFileRequest = {};
			cardbookRepository.cardbookFileResponse = {};
			cardbookRepository.cardbookDBRequest = {};
			cardbookRepository.cardbookDBResponse = {};
			cardbookRepository.filesFromCacheDB = {};
			cardbookRepository.cardbookServerDiscoveryRequest = {};
			cardbookRepository.cardbookServerDiscoveryResponse = {};
			cardbookRepository.cardbookServerDiscoveryError = {};
			cardbookRepository.cardbookServerSyncRequest = {};
			cardbookRepository.cardbookServerSyncResponse = {};
			cardbookRepository.cardbookServerSyncEmptyCache = {};
			cardbookRepository.cardbookServerSyncLoadCacheDone = {};
			cardbookRepository.cardbookServerSyncLoadCacheTotal = {};
			cardbookRepository.cardbookServerSyncDone = {};
			cardbookRepository.cardbookServerSyncTotal = {};
			cardbookRepository.cardbookServerSyncError = {};
			cardbookRepository.cardbookServerSyncNotUpdated = {};
			cardbookRepository.cardbookServerSyncNewOnServer = {};
			cardbookRepository.cardbookServerSyncNewOnDisk = {};
			cardbookRepository.cardbookServerSyncUpdatedOnServer = {};
			cardbookRepository.cardbookServerSyncUpdatedOnDisk = {};
			cardbookRepository.cardbookServerSyncUpdatedOnBoth = {};
			cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer = {};
			cardbookRepository.cardbookServerSyncDeletedOnDisk = {};
			cardbookRepository.cardbookServerSyncDeletedOnServer = {};
			cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer = {};
			cardbookRepository.cardbookServerSyncAgain = {};
			cardbookRepository.cardbookServerSyncCompareWithCacheDone = {};
			cardbookRepository.cardbookServerSyncCompareWithCacheTotal = {};
			cardbookRepository.cardbookServerSyncHandleRemainingDone = {};
			cardbookRepository.cardbookServerSyncHandleRemainingTotal = {};
			cardbookRepository.cardbookServerGetRequest = {};
			cardbookRepository.cardbookServerGetResponse = {};
			cardbookRepository.cardbookServerGetError = {};
			cardbookRepository.cardbookServerGetForMergeRequest = {};
			cardbookRepository.cardbookServerGetForMergeResponse = {};
			cardbookRepository.cardbookServerGetForMergeError = {};
			cardbookRepository.cardbookServerMultiGetArray = {};
			cardbookRepository.cardbookServerMultiGetParams = {};
			cardbookRepository.cardbookServerMultiGetRequest = {};
			cardbookRepository.cardbookServerMultiGetResponse = {};
			cardbookRepository.cardbookServerMultiGetError = {};
			cardbookRepository.cardbookServerUpdatedRequest = {};
			cardbookRepository.cardbookServerUpdatedResponse = {};
			cardbookRepository.cardbookServerUpdatedError = {};
			cardbookRepository.cardbookServerCreatedRequest = {};
			cardbookRepository.cardbookServerCreatedResponse = {};
			cardbookRepository.cardbookServerCreatedError = {};
			cardbookRepository.cardbookServerDeletedRequest = {};
			cardbookRepository.cardbookServerDeletedResponse = {};
			cardbookRepository.cardbookServerDeletedError = {};
			cardbookRepository.cardbookImageGetRequest = {};
			cardbookRepository.cardbookImageGetResponse = {};
			cardbookRepository.cardbookImageGetError = {};
		},

		finishMultipleOperations: function(aPrefId) {
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},

		getRequest: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleAccessTokenRequest : ", cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleRefreshTokenRequest : ", cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetRequest : ", cardbookRepository.cardbookServerGetRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetForMergeRequest : ", cardbookRepository.cardbookServerGetForMergeRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerMultiGetRequest : ", cardbookRepository.cardbookServerMultiGetRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerUpdatedRequest : ", cardbookRepository.cardbookServerUpdatedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerCreatedRequest : ", cardbookRepository.cardbookServerCreatedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerDeletedRequest : ", cardbookRepository.cardbookServerDeletedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDirRequest : ", cardbookRepository.cardbookDirRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookFileRequest : ", cardbookRepository.cardbookFileRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDBRequest : ", cardbookRepository.cardbookDBRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookImageGetRequest : ", cardbookRepository.cardbookImageGetRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncRequest : ", cardbookRepository.cardbookServerSyncRequest[aPrefId]);
				return cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId] +
						cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId] +
						cardbookRepository.cardbookServerGetRequest[aPrefId] +
						cardbookRepository.cardbookServerGetForMergeRequest[aPrefId] +
						cardbookRepository.cardbookServerMultiGetRequest[aPrefId] +
						cardbookRepository.cardbookServerUpdatedRequest[aPrefId] +
						cardbookRepository.cardbookServerCreatedRequest[aPrefId] +
						cardbookRepository.cardbookServerDeletedRequest[aPrefId] +
						cardbookRepository.cardbookDirRequest[aPrefId] +
						cardbookRepository.cardbookFileRequest[aPrefId] +
						cardbookRepository.cardbookDBRequest[aPrefId] +
						cardbookRepository.cardbookImageGetRequest[aPrefId] +
						cardbookRepository.cardbookServerSyncRequest[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleAccessTokenRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleRefreshTokenRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetForMergeRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetForMergeRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerMultiGetRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerMultiGetRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerUpdatedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerCreatedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerDeletedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDirRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookDirRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookFileRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookFileRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDBRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookDBRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookImageGetRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookImageGetRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncRequest));
				return cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetForMergeRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerMultiGetRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDirRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookFileRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDBRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookImageGetRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncRequest);
			}
		},
		
		getResponse: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleAccessTokenResponse : ", cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleRefreshTokenResponse : ", cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetResponse : ", cardbookRepository.cardbookServerGetResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetForMergeResponse : ", cardbookRepository.cardbookServerGetForMergeResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerMultiGetResponse : ", cardbookRepository.cardbookServerMultiGetResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerUpdatedResponse : ", cardbookRepository.cardbookServerUpdatedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerCreatedResponse : ", cardbookRepository.cardbookServerCreatedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerDeletedResponse : ", cardbookRepository.cardbookServerDeletedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDirResponse : ", cardbookRepository.cardbookDirResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookFileResponse : ", cardbookRepository.cardbookFileResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDBResponse : ", cardbookRepository.cardbookDBResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookImageGetResponse : ", cardbookRepository.cardbookImageGetResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncResponse : ", cardbookRepository.cardbookServerSyncResponse[aPrefId]);
				return cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId] +
						cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] +
						cardbookRepository.cardbookServerGetResponse[aPrefId] +
						cardbookRepository.cardbookServerGetForMergeResponse[aPrefId] +
						cardbookRepository.cardbookServerMultiGetResponse[aPrefId] +
						cardbookRepository.cardbookServerUpdatedResponse[aPrefId] +
						cardbookRepository.cardbookServerCreatedResponse[aPrefId] +
						cardbookRepository.cardbookServerDeletedResponse[aPrefId] +
						cardbookRepository.cardbookDirResponse[aPrefId] +
						cardbookRepository.cardbookFileResponse[aPrefId] +
						cardbookRepository.cardbookDBResponse[aPrefId] +
						cardbookRepository.cardbookImageGetResponse[aPrefId] +
						cardbookRepository.cardbookServerSyncResponse[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleAccessTokenResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleRefreshTokenResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetForMergeResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetForMergeResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerMultiGetResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerMultiGetResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerUpdatedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerCreatedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerDeletedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDirResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookDirResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookFileResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookFileResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDBResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookDBResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookImageGetResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookImageGetResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncResponse));
				return cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetForMergeResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerMultiGetResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDirResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookFileResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDBResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookImageGetResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncResponse);
			}
		},
		
		getDone: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncDone : ", cardbookRepository.cardbookServerSyncDone[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncCompareWithCacheDone : ", cardbookRepository.cardbookServerSyncCompareWithCacheDone[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncHandleRemainingDone : ", cardbookRepository.cardbookServerSyncHandleRemainingDone[aPrefId]);
				return cardbookRepository.cardbookServerSyncDone[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncDone : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncDone));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncCompareWithCacheDone : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncCompareWithCacheDone));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncHandleRemainingDone : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncHandleRemainingDone));
				return cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncDone);
			}
		},
		
		getTotal: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncTotal : ", cardbookRepository.cardbookServerSyncTotal[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncCompareWithCacheTotal : ", cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncHandleRemainingTotal : ", cardbookRepository.cardbookServerSyncHandleRemainingTotal[aPrefId]);
				return cardbookRepository.cardbookServerSyncTotal[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncTotal : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncTotal));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncCompareWithCacheTotal : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncCompareWithCacheTotal));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncHandleRemainingTotal : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncHandleRemainingTotal));
				return cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncTotal);
			}
		},
		
		finishOpenFile: function(aPrefId, aPrefName) {
			var errorNum = cardbookRepository.cardbookServerUpdatedError[aPrefId] + cardbookRepository.cardbookServerCreatedError[aPrefId];
			if (errorNum === 0) {
				cardbookUtils.formatStringForOutput("allContactsLoadedFromFile", [aPrefName]);
			} else {
				cardbookUtils.formatStringForOutput("notAllContactsLoadedFromFile", [aPrefName, errorNum]);
			}
		},
		
		finishSync: function(aPrefId, aPrefName, aPrefType) {
			if (aPrefType === "GOOGLE" || aPrefType === "CARDDAV" || aPrefType === "APPLE") {
				if (cardbookRepository.cardbookServerSyncRequest[aPrefId] == 0) {
					cardbookUtils.formatStringForOutput("synchroNotTried", [aPrefName]);
					wdw_cardbooklog.finishSyncActivity(aPrefId, aPrefName);
				} else {
					var errorNum = cardbookRepository.cardbookGoogleAccessTokenError[aPrefId] + cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId] + cardbookRepository.cardbookServerDiscoveryError[aPrefId] + cardbookRepository.cardbookServerSyncError[aPrefId];
					if (errorNum === 0) {
						wdw_cardbooklog.finishSyncActivityOK(aPrefId, aPrefName);
						cardbookUtils.formatStringForOutput("synchroFinishedResult", [aPrefName]);
						cardbookUtils.formatStringForOutput("synchroCardsUpToDate", [aPrefName, cardbookRepository.cardbookServerSyncNotUpdated[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsNewOnServer", [aPrefName, cardbookRepository.cardbookServerSyncNewOnServer[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnServer[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsDeletedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsDeletedOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnDisk[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsDeletedOnDiskUpdatedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsNewOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncNewOnDisk[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnDisk[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnBoth", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnBoth[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnDiskDeletedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroModifGetOKFromServer", [aPrefName, cardbookRepository.cardbookServerGetResponse[aPrefId]]);
						cardbookUtils.formatStringForOutput("synchroModifGetKOFromServer", [aPrefName, cardbookRepository.cardbookServerGetError[aPrefId]]);
						var error = cardbookRepository.cardbookServerCreatedError[aPrefId] + cardbookRepository.cardbookServerUpdatedError[aPrefId] + cardbookRepository.cardbookServerDeletedError[aPrefId];
						var success = cardbookRepository.cardbookServerCreatedResponse[aPrefId] + cardbookRepository.cardbookServerUpdatedResponse[aPrefId] + cardbookRepository.cardbookServerDeletedResponse[aPrefId] - error;
						cardbookUtils.formatStringForOutput("synchroModifPutOKFromServer", [aPrefName, success]);
						cardbookUtils.formatStringForOutput("synchroModifPutKOFromServer", [aPrefName, error]);
						cardbookUtils.formatStringForOutput("imageGetResponse", [aPrefName, cardbookRepository.cardbookImageGetResponse[aPrefId]]);
						cardbookUtils.formatStringForOutput("imageGetError", [aPrefName, cardbookRepository.cardbookImageGetError[aPrefId]]);
					} else {
						wdw_cardbooklog.finishSyncActivity(aPrefId, aPrefName);
						cardbookUtils.formatStringForOutput("synchroImpossible", [aPrefName]);
					}
				}
			} else if (aPrefType === "FILE") {
				cardbookUtils.formatStringForOutput("synchroFileFinishedResult", [aPrefName]);
				cardbookUtils.formatStringForOutput("synchroFileCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId]]);
				cardbookUtils.formatStringForOutput("synchroFileCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
				cardbookUtils.formatStringForOutput("imageGetResponse", [aPrefName, cardbookRepository.cardbookImageGetResponse[aPrefId]]);
				cardbookUtils.formatStringForOutput("imageGetError", [aPrefName, cardbookRepository.cardbookImageGetError[aPrefId]]);
			} else if (aPrefType === "CACHE" || aPrefType === "DIRECTORY" || aPrefType === "LOCALDB") {
				cardbookUtils.formatStringForOutput("synchroDirFinishedResult", [aPrefName]);
				cardbookUtils.formatStringForOutput("synchroDirCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId]]);
				cardbookUtils.formatStringForOutput("synchroDirCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
			}
		},
		
		finishImport: function(aPrefId, aPrefName) {
			cardbookUtils.formatStringForOutput("importFinishedResult", [aPrefName]);
			cardbookUtils.formatStringForOutput("importCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId] - cardbookRepository.cardbookServerSyncError[aPrefId]]);
			cardbookUtils.formatStringForOutput("importCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
		},
		
		askUser: function(aMessage, aButton1, aButton2, aButton3, aButton4, aConfirmMessage, aConfirmValue) {
			var myArgs = {message: aMessage, button1: aButton1, button2: aButton2, button3: aButton3, button4: aButton4,
							confirmMessage: aConfirmMessage, confirmValue: aConfirmValue, 
							result: "cancel", resultConfirm: false};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookAskUser.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			return {result: myArgs.result, resultConfirm: myArgs.resultConfirm};
		},
		
		getRootUrl: function (aUrl) {
			try {
				var urlArray1 = aUrl.split("://");
				var urlArray2 = urlArray1[1].split("/");
				return urlArray1[0] + "://" + urlArray2[0];
			}
			catch (e) {
				return "";
			}
		},
		
		getFileBinary: function (afileURI) {
            var content = "";
            var data = "";
			var file = afileURI.QueryInterface(Components.interfaces.nsIFileURL).file;

			if (file.exists() && file.isReadable()) {
				var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
				fstream.init(file, 0x01, 0004, 0);
				var bStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				bStream.setInputStream(fstream);
				data = bStream.readBytes(bStream.available());
				bStream.close();
				fstream.close();
			}
			return data;
		},

		getFileDataAsync: function (aFilePath, aCallback, aParams) {
			Components.utils.import("resource://gre/modules/FileUtils.jsm");
			Components.utils.import("resource://gre/modules/NetUtil.jsm");
			function readFile(aFile, aCallback, aParams) {
				NetUtil.asyncFetch(aFile, function (inputStream, status) {
					if (!Components.isSuccessCode(status)) {
						if (aParams.showError) {
							wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.getFileDataAsync error : filename : " + aFile.path, "Error");
						}
						aCallback("", aParams);
						return;
					}
					try {
						var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
					} catch (e) {
						// The file is empty.
						if (e.name == "NS_BASE_STREAM_CLOSED") {
							data = "";
						} else {
							data = "";
						}
					}
					try {
						// for UT8 files
						var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].getService(Components.interfaces.nsIUTF8ConverterService);
						var dataConverted = utf8Converter.convertURISpecToUTF8(data, "UTF-8");
					} catch (e) {
						// for non UTF8 files 
						var dataConverted = data;
					}
					aCallback(dataConverted, aParams);
				});
			}
			var myFile = FileUtils.File(aFilePath);
			readFile(myFile, aCallback, aParams);
		},

		writeFileDataAsync: function (aFilePath, aData, aCallback, aParams) {
			Components.utils.import("resource://gre/modules/FileUtils.jsm");
			Components.utils.import("resource://gre/modules/NetUtil.jsm");
			function writeFile(aFile, aData, aCallback, aParams) {
				var ostream = FileUtils.openSafeFileOutputStream(aFile)
				var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8";
				var istream = converter.convertToInputStream(aData);
				NetUtil.asyncCopy(istream, ostream, function (status) {
					if (!Components.isSuccessCode(status)) {
						wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeFileDataAsync error : filename : " + aFile.path, "Error");
						return;
					}
					aCallback(aParams);
				});
			}
			var myFile = FileUtils.File(aFilePath);
			writeFile(myFile, aData, aCallback, aParams);
		},

		// from Sogo
		cleanedUpHref: function(origHref, origUrl) {
			// href might be something like: http://foo:80/bar while this.gURL might
			// be something like: http://foo/bar so we strip the port value if the URLs
			// don't match. eGroupWare sends back such data.
		
			let hrefArray = origHref.split("/");
			let noprefix = false;
			// 		dump("hrefArray: " + hrefArray + "\n");
		
			if (hrefArray[0].substr(0,5) == "https"
				&& hrefArray[2].indexOf(":443") > 0) {
				hrefArray[2] = hrefArray[2].substring(0, hrefArray[2].length-4);
			}
			else if (hrefArray[0].substr(0,4) == "http" && hrefArray[2].indexOf(":80") > 0) {
				hrefArray[2] = hrefArray[2].substring(0, hrefArray[2].length-3);
			} else {
				noprefix = true;
			}
			let href = hrefArray.join("/");
		
			// We also check if this.gURL begins with http{s}:// but NOT href. If
			// that's the case, with servers such as OpenGroupware.org (OGo), we
			// prepend the relevant part.
			//
			// For example, this.gURL could be:
			// http://foo.bar/zidestore/dav/fred/public/Contacts/
			// while href is:
			// /dav/fred/public/Contacts/
			//
			if (noprefix && origUrl.substr(0,4) == "http") {
				let gURLArray = origUrl.split("/");
				href = gURLArray[0] + "//" + gURLArray[2] + href;
			}
		
			// 		dump("Cleaned up href: " + href + "\n");
		
			return href;
		},
		
		// from Sogo
		URLsAreEqual: function(href1, href2) {
			if (href1 == href2) {
				return true;
			}
			
			let resPathComponents1 = href1.split("/");
			let resPathComponents2 = href2.split("/");
	
			return ((resPathComponents1[2] == resPathComponents2[2]) && (resPathComponents1[resPathComponents1.length-2] == resPathComponents2[resPathComponents2.length-2]));
		},

		// from Sogo
		isSupportedvCardType: function(aContentType, aFileName) {
			if (aContentType.indexOf("text/x-vcard") == 0 || aContentType.indexOf("text/vcard") == 0) {
				return true;
			} else {
				var myFileArray = aFileName.split(".");
				var myExtension =  myFileArray[myFileArray.length-1];
				if (myExtension.toLowerCase() == "vcf") {
					return true;
				}
				return false;
			}
		},

		// from Sogo
		isSupportedvCardListType: function(aContentType, aFileName) {
			if (aContentType.indexOf("text/x-vlist") == 0) {
				return true;
			} else {
				var myFileArray = aFileName.split(".");
				var myExtension =  myFileArray[myFileArray.length-1];
				if (myExtension.toLowerCase() == "vcf") {
					return true;
				}
				return false;
			}
		},

		isSupportedContentType: function(aContentType, aFileName) {
			if (cardbookSynchronization.isSupportedvCardType(aContentType, aFileName) || cardbookSynchronization.isSupportedvCardListType(aContentType, aFileName) ) {
				return true;
			} else {
				return false;
			}
		},

		cacheDeleteMediaCard: function(aCard) {
			try {
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
				var mediaName = [ 'photo', 'logo', 'sound' ];

				for (var i in mediaName) {
					var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, mediaName[i], aCard[mediaName[i]].extension);
					if (cacheDir.exists() && cacheDir.isFile()) {
						cacheDir.remove(true);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : Contact " + aCard.fn + " " + [mediaName[i]] + " deleted from cache");
					}
				}
			}
			catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cacheDeleteMediaCard error : " + e, "Error");
			}
		},

		cachePutMediaCard: function(aCard, aField, aPrefIdType) {
			try {
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);

				var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, aField, aCard[aField].extension);
				if (aCard[aField].value != null && aCard[aField].value !== undefined && aCard[aField].value != "") {
					if (aPrefIdType === "FILE" || aPrefIdType === "DIRECTORY") {
						if (!(cacheDir.exists() && cacheDir.isFile())) {
							cardbookSynchronization.writeContentToFile(cacheDir.path, aCard[aField].value, "NOUTF8");
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " " + aField + " written to cache");
						}
						aCard[aField].localURI = "file:///" + cacheDir.path;
						aCard[aField].value = "";
						aCard[aField].extension = cardbookUtils.getExtension(cacheDir.path);
					} else {
						cardbookSynchronization.writeContentToFile(cacheDir.path, aCard[aField].value, "NOUTF8");
						aCard[aField].localURI = "file:///" + cacheDir.path;
						aCard[aField].value = "";
						aCard[aField].extension = cardbookUtils.getExtension(cacheDir.path);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " " + aField + " written to cache");
					}
				} else if (aCard[aField].localURI != null && aCard[aField].localURI !== undefined && aCard[aField].localURI != "") {
					if (!cacheDir.exists()) {
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var myFileURI = ioService.newURI(aCard[aField].localURI, null, null);
						var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
						myFile1.copyToFollowingLinks(cacheDir.parent,cacheDir.leafName);
						aCard[aField].localURI = "file:///" + cacheDir.path;
					}
				} else if (aCard[aField].URI != null && aCard[aField].URI !== undefined && aCard[aField].URI != "") {
					if (!cacheDir.exists()) {
						if (aCard[aField].URI.indexOf("http") == 0) {
							cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
							var listener_getimage = {
								onDAVQueryComplete: function(status, response, askCertificate, etag) {
									if (status > 199 && status < 400) {
										cardbookUtils.formatStringForOutput("serverCardGetImageOK", [aImageConnection.connDescription, aCard.fn]);
										var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, aField, aCard[aField].extension);
										cardbookSynchronization.writeContentToFile(cacheDir.path, response, "NOUTF8");
										aCard[aField].localURI = "file:///" + cacheDir.path;
									} else {
										cardbookRepository.cardbookImageGetError[aCard.dirPrefId]++;
										cardbookUtils.formatStringForOutput("serverCardGetImageFailed", [aImageConnection.connDescription, aCard.fn, aImageConnection.connUrl, status]);
									}
									cardbookRepository.cardbookImageGetResponse[aCard.dirPrefId]++;
								}
							};
							var aDescription = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
							var aImageConnection = {connPrefId: aCard.dirPrefId, connUrl: aCard[aField].URI, connDescription: aDescription};
							var request = new cardbookWebDAV(aImageConnection, listener_getimage);
							cardbookUtils.formatStringForOutput("serverCardGettingImage", [aImageConnection.connDescription, aCard.fn]);
							cardbookRepository.cardbookImageGetRequest[aCard.dirPrefId]++;
							request.getimage();
						} else {
							var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
							var myFileURI = ioService.newURI(aCard[aField].URI, null, null);
							var fileContent = btoa(cardbookSynchronization.getFileBinary(myFileURI));
							cardbookSynchronization.writeContentToFile(cacheDir.path, fileContent, "NOUTF8");
							aCard[aField].localURI = "file:///" + cacheDir.path;
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " " + aField + " written to cache");
						}
					} else {
						aCard[aField].localURI = "file:///" + cacheDir.path;
						aCard[aField].value = "";
						aCard[aField].extension = cardbookUtils.getExtension(cacheDir.path);
					}
				}
			}
			catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cachePutMediaCard error : " + e, "Error");
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cachePutMediaCard aPrefIdType : " + aPrefIdType, "Error");
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cachePutMediaCard aCard : " + aCard.toSource(), "Error");
			}
		},

		serverDelete: function(aConnection, aMode, aCard, aPrefIdType) {
			var listener_delete = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status > 199 && status < 400) {
						cardbookUtils.formatStringForOutput("serverCardDeletedFromServer", [aConnection.connDescription, aCard.fn]);
						cardbookRepository.removeCardFromRepository(aCard, true);
					} else if (status == 404) {
						cardbookUtils.formatStringForOutput("serverCardNotExistServer", [aConnection.connDescription, aCard.fn]);
						cardbookRepository.removeCardFromRepository(aCard, true);
					} else {
						cardbookRepository.cardbookServerDeletedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardDeleteFailed", [aConnection.connDescription, aCard.fn, aConnection.connUrl, status]);
						cardbookUtils.addTagDeleted(aCard);
						cardbookRepository.addCardToCache(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid]) {
							cardbookRepository.removeCardFromRepository(aCard, false);
						}
					}
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerDeletedResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.nullifyTagModification(aCard);

			var request = new cardbookWebDAV(aConnection, listener_delete);
			cardbookUtils.formatStringForOutput("serverCardSendingDeletion", [aConnection.connDescription, aCard.fn]);
			request.delete();
		},

		serverUpdate: function(aConnection, aMode, aCard, aModifiedCard, aPrefIdType) {
			var listener_update = {
				onDAVQueryComplete: function(status, response, askCertificate, etag) {
					if (status > 199 && status < 400) {
						if (etag != null && etag !== undefined && etag != "") {
							cardbookUtils.formatStringForOutput("serverCardUpdatedOnServerWithEtag", [aConnection.connDescription, aModifiedCard.fn, etag]);
							cardbookUtils.addEtag(aModifiedCard, etag);
						} else {
							cardbookRepository.cardbookServerSyncAgain[aConnection.connPrefId] = true;
							cardbookUtils.formatStringForOutput("serverCardUpdatedOnServerWithoutEtag", [aConnection.connDescription, aModifiedCard.fn]);
							cardbookUtils.addEtag(aModifiedCard, "0");
						}
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						// if aCard and aCard have the same cached medias
						cardbookUtils.changeMediaFromFileToContent(aModifiedCard);
						cardbookRepository.removeCardFromRepository(aCard, true);
						cardbookRepository.addCardToRepository(aModifiedCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
					} else {
						cardbookUtils.addTagUpdated(aModifiedCard);
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerUpdatedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardUpdateFailed", [aConnection.connDescription, aModifiedCard.fn, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerUpdatedResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.nullifyTagModification(aModifiedCard);

			var request = new cardbookWebDAV(aConnection, listener_update, aModifiedCard.etag);
			var cardContent = cardbookUtils.cardToVcardData(aModifiedCard, true);
			cardbookUtils.formatStringForOutput("serverCardSendingUpdate", [aConnection.connDescription, aModifiedCard.fn]);
			request.put(cardContent, "text/vcard; charset=utf-8");
		},

		serverCreate: function(aConnection, aMode, aCard, aPrefIdType) {
			var listener_create = {
				onDAVQueryComplete: function(status, response, askCertificate, etag) {
					if (status > 199 && status < 400) {
						if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid]) {
							// if aCard and aCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aCard);
							var myOldCard = cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid];
							cardbookRepository.removeCardFromRepository(myOldCard, true);
						}
						if (etag != null && etag !== undefined && etag != "") {
							cardbookUtils.formatStringForOutput("serverCardCreatedOnServerWithEtag", [aConnection.connDescription, aCard.fn, etag]);
							cardbookUtils.addEtag(aCard, etag);
						} else {
							cardbookRepository.cardbookServerSyncAgain[aConnection.connPrefId] = true;
							cardbookUtils.formatStringForOutput("serverCardCreatedOnServerWithoutEtag", [aConnection.connDescription, aCard.fn]);
						}
						cardbookRepository.addCardToRepository(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
					} else {
						cardbookUtils.addTagCreated(aCard);
						cardbookRepository.cardbookServerCreatedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardCreateFailed", [aConnection.connDescription, aCard.fn, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerCreatedResponse[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.prepareCardForCreation(aCard, aPrefIdType, aConnection.connUrl);
			aConnection.connUrl = aCard.cardurl;
			cardbookUtils.nullifyTagModification(aCard);
			cardbookUtils.addEtag(aCard, "0");

			var request = new cardbookWebDAV(aConnection, listener_create, aCard.etag);
			var cardContent = cardbookUtils.cardToVcardData(aCard, true);
			cardbookUtils.formatStringForOutput("serverCardSendingCreate", [aConnection.connDescription, aCard.fn]);
			request.put(cardContent, "text/vcard; charset=utf-8");
		},

		serverGetForMerge: function(aConnection, aMode, aEtag, aCacheCard, aPrefIdType) {
			var listener_get = {
				onDAVQueryComplete: function(status, response, askCertificate, etag) {
					if (status > 199 && status < 400) {
						try {
							var myCard = new cardbookCardParser(response, aConnection.connUrl, etag, aConnection.connPrefId);
							var photoTmpFile = cardbookUtils.getTempFile("CardBookPhotoTemp." + myCard.photo.extension);
							cardbookSynchronization.writeContentToFile(photoTmpFile.path, myCard.photo.value, "NOUTF8");
							myCard.photo.value = "";
							myCard.photo.URI = "";
							myCard.photo.localURI = "file:///" + photoTmpFile.path;
						}
						catch (e) {
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetForMergeResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetForMergeError[aConnection.connPrefId]++;
							if (e.message == "") {
								var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
								var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
								cardbookUtils.formatStringForOutput("parsingCardError", [aConnection.connDescription, strBundle.GetStringFromName(e.code), response], "Error");
							} else {
								cardbookUtils.formatStringForOutput("parsingCardError", [aConnection.connDescription, e.message, response], "Error");
							}
							return;
						}
						cardbookUtils.formatStringForOutput("serverCardGetOK", [aConnection.connDescription, myCard.fn]);
						var myArgs = {cardsIn: [myCard, aCacheCard], cardsOut: [], hideCreate: true, action: ""};
						var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
						if (myArgs.action == "CREATEANDREPLACE") {
							myArgs.cardsOut[0].uid = aCacheCard.uid;
							cardbookUtils.addEtag(myArgs.cardsOut[0], aEtag);
							cardbookUtils.setCalculatedFields(myArgs.cardsOut[0]);
							cardbookRepository.cardbookServerUpdatedRequest[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetForMergeResponse[aConnection.connPrefId]++;
							cardbookSynchronization.serverUpdate(aConnection, aMode, aCacheCard, myArgs.cardsOut[0], aPrefIdType);
						} else {
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetForMergeResponse[aConnection.connPrefId]++;
						}
					} else {
						cardbookRepository.cardbookServerGetForMergeError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerGetForMergeResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardGetFailed", [aConnection.connDescription, aConnection.connUrl, status]);
					}
				}
			};
			let request = new cardbookWebDAV(aConnection, listener_get);
			request.get("text/vcard");
		},

		serverGet: function(aConnection, aMode) {
			var listener_get = {
				onDAVQueryComplete: function(status, response, askCertificate, etag) {
					if (status > 199 && status < 400) {
						try {
							var myCard = new cardbookCardParser(response, aConnection.connUrl, etag, aConnection.connPrefId);
						}
						catch (e) {
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
							if (e.message == "") {
								var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
								var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
								cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, strBundle.GetStringFromName(e.code), cardContent], "Error");
							} else {
								cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, e.message, cardContent], "Error");
							}
							return;
						}
						if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid]) {
							var myOldCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid];
							cardbookRepository.removeCardFromRepository(myOldCard, true);
						}
						cardbookRepository.addCardToRepository(myCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						cardbookUtils.formatStringForOutput("serverCardGetOK", [aConnection.connDescription, myCard.fn]);
					} else {
						cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardGetFailed", [aConnection.connDescription, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
				}
			};
			let request = new cardbookWebDAV(aConnection, listener_get);
			request.get("text/vcard");
		},

		serverMultiGet: function(aConnection, aMode) {
			var listener_multiget = {
				onDAVQueryComplete: function(status, response, askCertificate, etagDummy, length) {
					if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] = cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] + length;
						cardbookRepository.cardbookServerMultiGetError[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								try {
									let href = decodeURIComponent(jsonResponse["href"][0]);
									let propstats = jsonResponse["propstat"];
									// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/
									// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:[null], getetag:[null]}], status:["HTTP/1.1 404 Not Found"]}]
									// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/C68894CF-D340-0001-78C3-1E301B4011F5.vcf
									// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:["text/x-vcard"], getetag:["\"6163e30117192647e1967de751fb5467\""]}], status:["HTTP/1.1 200 OK"]}]
									for (var prop1 in propstats) {
										var propstat = propstats[prop1];
										cardbookRepository.cardbookServerGetRequest[aConnection.connPrefId]++;
										if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
											if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
												let prop = propstat["prop"][0];
												if (typeof(prop["getetag"]) == "undefined") {
													var etag = "";
												} else {
													var etag = prop["getetag"][0];
												}
												var myUrl = aConnection.connUrl + href;
												try {
													var myContent = decodeURIComponent(prop["address-data"][0]);
												}
												catch (e) {
													var myContent = prop["address-data"][0];
												}
												try {
													var aRootUrl = cardbookSynchronization.getRootUrl(aConnection.connUrl);
													var myCard = new cardbookCardParser(myContent, aRootUrl + href, etag, aConnection.connPrefId);
												}
												catch (e) {
													cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
													cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
													cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
													if (e.message == "") {
														var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
														var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
														cardbookUtils.formatStringForOutput("parsingCardError", [aConnection.connDescription, strBundle.GetStringFromName(e.code), myContent], "Error");
													} else {
														cardbookUtils.formatStringForOutput("parsingCardError", [aConnection.connDescription, e.message, myContent], "Error");
													}
													continue;
												}
												if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid]) {
													var myOldCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid];
													cardbookRepository.removeCardFromRepository(myOldCard, true);
												}
												cardbookRepository.addCardToRepository(myCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl + href));
												cardbookUtils.formatStringForOutput("serverCardGetOK", [aConnection.connDescription, myCard.fn]);
											} else {
												cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
												cardbookUtils.formatStringForOutput("serverCardGetFailed", [aConnection.connDescription, aConnection.connUrl, status]);
											}
										} else {
											cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
											cardbookUtils.formatStringForOutput("serverCardGetFailed", [aConnection.connDescription, aConnection.connUrl, status]);
										}
										cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
										cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
									}
								}
								catch(e) {
									cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
									cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
									cardbookRepository.cardbookServerMultiGetError[aConnection.connPrefId]++;
									wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.serverMultiGet error : " + e, "Error");
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] = cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] + length;
							cardbookRepository.cardbookServerMultiGetError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.serverMultiGet error : " + e, "Error");
						}
					} else {
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] = cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId] + length;
						cardbookRepository.cardbookServerMultiGetError[aConnection.connPrefId]++;
					}
					cardbookRepository.cardbookServerMultiGetResponse[aConnection.connPrefId]++;
				}
			};
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var multiget = prefs.getComplexValue("extensions.cardbook.multiget", Components.interfaces.nsISupportsString).data;
			for (var i = 0; i < cardbookRepository.cardbookServerMultiGetArray[aConnection.connPrefId].length; i = i + +multiget) {
				var subArray = cardbookRepository.cardbookServerMultiGetArray[aConnection.connPrefId].slice(i, i + +multiget);
				let request = new cardbookWebDAV(aConnection, listener_multiget, "", true);
				cardbookRepository.cardbookServerMultiGetRequest[aConnection.connPrefId]++;
				request.report(subArray);
			}
		},

		getFilesFromCache: function (aPrefId) {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(aPrefId);
			return cardbookSynchronization.getFilesFromDir(cacheDir.path);
		},

		getCacheFiles: function (aPrefId) {
			if (!(cardbookRepository.filesFromCacheDB[aPrefId])) {
				cardbookRepository.filesFromCacheDB[aPrefId] = [];
			}
			if (cardbookRepository.cardbookFileCacheCards[aPrefId]) {
				for (var i in cardbookRepository.cardbookFileCacheCards[aPrefId]) {
					cardbookRepository.filesFromCacheDB[aPrefId].push(i);
				}
			}
		},

		getFilesFromDir: function (aDirName) {
			var listOfFileName = [];
			try {
				var myDirectory = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myDirectory.initWithPath(aDirName);
				var files = myDirectory.directoryEntries;
				while (files.hasMoreElements()) {
					var file = files.getNext().QueryInterface(Components.interfaces.nsILocalFile);
					if (file.isFile()) {
						listOfFileName.push(file.leafName);
					}
				}
			} catch(e) {}
			return listOfFileName;
		},

		loadCache: function (aPrefId, aPrefName, aPrefType, aPrefUser, aPrefUrl, aSync, aMode, aDBCached) {
			if (aDBCached) {
				cardbookRepository.cardbookServerSyncEmptyCache[aPrefId] = false;
				cardbookRepository.cardbookDBRequest[aPrefId]++;
				cardbookIndexedDB.loadDB(aPrefId, aPrefName, aMode);
			} else {
				cardbookRepository.cardbookServerSyncEmptyCache[aPrefId] = true;
				var aListOfFileName = [];
				aListOfFileName = cardbookSynchronization.getFilesFromCache(aPrefId);
				for (var i = 0; i < aListOfFileName.length; i++) {
					cardbookRepository.cardbookServerSyncLoadCacheTotal[aPrefId]++;
					cardbookRepository.cardbookServerSyncEmptyCache[aPrefId] = false;
					myFileName = aListOfFileName[i];
					var cacheDir = cardbookRepository.getLocalDirectory();
					cacheDir.append(aPrefId);
					cacheDir.append(myFileName);
					if (cacheDir.exists() && cacheDir.isFile()) {
						var params = {};
						params["showError"] = true;
						params["aPrefId"] = aPrefId;
						params["aPrefName"] = aPrefName;
						params["aMode"] = aMode;
						params["aFileName"] = myFileName;
						params["aCacheDir"] = cacheDir;
						cardbookSynchronization.getFileDataAsync(cacheDir.path, cardbookSynchronization.loadCacheAsync, params);
					}
				}
			}
			if (aSync) {
				cardbookSynchronization.waitForLoadCacheFinished(aPrefId, aPrefName, aPrefType, aPrefUser, aPrefUrl, aMode);
			} else {
				if (aPrefType === "GOOGLE" || aPrefType === "CARDDAV" || aPrefType === "APPLE") {
					cardbookSynchronization.waitForSyncFinished(aPrefId, aPrefName, aMode);
				} else {
					cardbookSynchronization.waitForDirFinished(aPrefId, aPrefName, aMode);
				}
			}

		},

		loadCacheAsync: function (aContent, aParams) {
			if (aContent != null && aContent !== undefined && aContent != "") {
				try {
					var myCard = new cardbookCardParser(aContent, "", "", aParams.aPrefId);
					if (!(cardbookRepository.cardbookCards[aParams.aPrefId+"::"+myCard.uid])) {
						cardbookRepository.addCardToRepository(myCard, aParams.aMode, aParams.aFileName);
						cardbookUtils.formatStringForOutput("cardLoadedFromCache", [aParams.aPrefName, myCard.fn]);
					}
				}
				catch (e) {
					aParams.aCacheDir.remove(true);
				}
			} else {
				aParams.aCacheDir.remove(true);
			}
			cardbookRepository.cardbookServerSyncLoadCacheDone[aParams.aPrefId]++;
		},

		loadDir: function (aDir, aTarget, aDirPrefId, aMode, aSource) {
			if (aTarget == "") {
				var myDirPrefId = aDirPrefId;
			} else {
				var myDirPrefId = cardbookUtils.getAccountId(aTarget);
			}
			var aListOfFileName = [];
			aListOfFileName = cardbookSynchronization.getFilesFromDir(aDir.path);
			for (var i = 0; i < aListOfFileName.length; i++) {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(aDir.path);
				myFile.append(aListOfFileName[i]);
				if (myFile.exists() && myFile.isFile()) {
					cardbookRepository.cardbookFileRequest[myDirPrefId]++;
					cardbookSynchronization.loadFile(myFile, aTarget, aDirPrefId, aMode, aSource);
				}
			}
			cardbookRepository.cardbookDirResponse[myDirPrefId]++;
		},

		handleRemainingCache: function (aPrefIdType, aConnection, aMode) {
			if (cardbookRepository.filesFromCacheDB[aConnection.connPrefId]) {
				for (var i = 0; i < cardbookRepository.filesFromCacheDB[aConnection.connPrefId].length; i++) {
					var params = {};
					params["showError"] = true;
					params["aConnection"] = aConnection;
					params["aMode"] = aMode;
					params["aPrefIdType"] = aPrefIdType;
					params["aDirPrefId"] = aConnection.connPrefId;
					cardbookIndexedDB.getItemByCacheuri(cardbookRepository.filesFromCacheDB[aConnection.connPrefId][i], cardbookSynchronization.handleRemainingCacheAsync, params);
				}
			}
		},

		handleRemainingCacheAsync: function (aCard, aParams) {
			try {
				if (aCard.created) {
					// "NEWONDISK";
					cardbookUtils.formatStringForOutput("cardNewOnDisk", [aParams.aConnection.connDescription, aCard.fn]);
					cardbookRepository.cardbookServerCreatedRequest[aParams.aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncTotal[aParams.aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncNewOnDisk[aParams.aConnection.connPrefId]++;
					var aCreateConnection = JSON.parse(JSON.stringify(aParams.aConnection));
					cardbookSynchronization.serverCreate(aCreateConnection, aParams.aMode, aCard, aParams.aPrefIdType);
				} else if (aCard.updated) {
					// "UPDATEDONDISKDELETEDONSERVER";
					cardbookUtils.formatStringForOutput("cardUpdatedOnDiskDeletedOnServer", [aParams.aConnection.connDescription, aCard.fn]);
					cardbookRepository.cardbookServerSyncTotal[aParams.aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aParams.aConnection.connPrefId]++;
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var solveConflicts = prefs.getComplexValue("extensions.cardbook.solveConflicts", Components.interfaces.nsISupportsString).data;
					if (solveConflicts === "Local") {
						var conflictResult = "keep";
					} else if (solveConflicts === "Remote") {
						var conflictResult = "delete";
					} else {
						var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
						var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
						var message = strBundle.formatStringFromName("cardUpdatedOnDiskDeletedOnServer", [aParams.aConnection.connDescription, aCard.fn], 2);
						var askUserResult = cardbookSynchronization.askUser(message, "keep", "delete");
						var conflictResult = askUserResult.result;
					}
					
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aParams.aConnection.connDescription + " : debug mode : conflict resolution : ", conflictResult);
					switch (conflictResult) {
						case "keep":
							cardbookRepository.cardbookServerCreatedRequest[aParams.aConnection.connPrefId]++;
							var aCreateConnection = JSON.parse(JSON.stringify(aParams.aConnection));
							cardbookSynchronization.serverCreate(aCreateConnection, aParams.aMode, aCard, aParams.aPrefIdType);
							break;
						case "delete":
							cardbookRepository.removeCardFromRepository(aCard, true);
							cardbookRepository.cardbookServerGetRequest[aParams.aConnection.connPrefId]++;
							cardbookRepository.cardbookServerGetResponse[aParams.aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncDone[aParams.aConnection.connPrefId]++;
							break;
						case "cancel":
							cardbookRepository.cardbookServerSyncDone[aParams.aConnection.connPrefId]++;
							break;
					}
				} else {
					// "DELETEDONSERVER";
					cardbookRepository.cardbookServerSyncTotal[aParams.aConnection.connPrefId]++;
					cardbookUtils.formatStringForOutput("cardDeletedOnServer", [aParams.aConnection.connDescription, aCard.fn]);
					cardbookRepository.removeCardFromRepository(aCard, true);
					cardbookRepository.cardbookServerSyncDone[aParams.aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncDeletedOnServer[aParams.aConnection.connPrefId]++;
				}
				cardbookRepository.cardbookServerSyncHandleRemainingDone[aParams.aConnection.connPrefId]++;
			}
			catch (e) {}
		},

		compareServerCardWithCache: function (aCardConnection, aConnection, aMode, aPrefIdType, aUrl, aEtag, aFileName) {
			if (cardbookRepository.cardbookFileCacheCards[aConnection.connPrefId] && cardbookRepository.cardbookFileCacheCards[aConnection.connPrefId][aFileName]) {
				var myCacheCard = cardbookRepository.cardbookFileCacheCards[aConnection.connPrefId][aFileName];
				var myServerCard = new cardbookCardParser();
				cardbookUtils.cloneCard(myCacheCard, myServerCard);
				cardbookUtils.addEtag(myServerCard, aEtag);
				if (myCacheCard.etag == aEtag) {
					if (myCacheCard.deleted) {
						// "DELETEDONDISK";
						cardbookRepository.cardbookServerDeletedRequest[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncDeletedOnDisk[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("cardDeletedOnDisk", [aConnection.connDescription, myCacheCard.fn]);
						cardbookSynchronization.serverDelete(aCardConnection, aMode, myCacheCard, aPrefIdType);
					} else if (myCacheCard.updated) {
						// "UPDATEDONDISK";
						cardbookRepository.cardbookServerUpdatedRequest[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncUpdatedOnDisk[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("cardUpdatedOnDisk", [aConnection.connDescription, myCacheCard.fn]);
						cardbookSynchronization.serverUpdate(aCardConnection, aMode, myCacheCard, myServerCard, aPrefIdType);
					} else {
						// "NOTUPDATED";
						if (cardbookRepository.cardbookCards[aConnection.connPrefId+"::"+myCacheCard.uid]) {
							cardbookRepository.cardbookCards[aConnection.connPrefId+"::"+myCacheCard.uid].cardurl = aUrl;
							cardbookUtils.formatStringForOutput("cardAlreadyGetFromCache", [aConnection.connDescription, myCacheCard.fn]);
						} else {
							cardbookRepository.addCardToRepository(myCacheCard, aMode);
							cardbookUtils.formatStringForOutput("cardGetFromCache", [aConnection.connDescription, myCacheCard.fn]);
						}
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncNotUpdated[aConnection.connPrefId]++;
					}
				} else if (myCacheCard.deleted) {
					// "DELETEDONDISKUPDATEDONSERVER";
					cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[aConnection.connPrefId]++;
					cardbookUtils.formatStringForOutput("cardDeletedOnDiskUpdatedOnServer", [aConnection.connDescription, myCacheCard.fn]);
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var solveConflicts = prefs.getComplexValue("extensions.cardbook.solveConflicts", Components.interfaces.nsISupportsString).data;
					if (solveConflicts === "Local") {
						var conflictResult = "delete";
					} else if (solveConflicts === "Remote") {
						var conflictResult = "keep";
					} else {
						var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
						var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
						var message = strBundle.formatStringFromName("cardDeletedOnDiskUpdatedOnServer", [aConnection.connDescription, myCacheCard.fn], 2);
						var askUserResult = cardbookSynchronization.askUser(message, "keep", "delete");
						var conflictResult = askUserResult.result;
					}
					
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aConnection.connDescription + " : debug mode : conflict resolution : ", conflictResult);
					switch (conflictResult) {
						case "keep":
							cardbookRepository.removeCardFromRepository(myCacheCard, true);
							cardbookRepository.cardbookServerMultiGetArray[aCardConnection.connPrefId].push(aUrl);
							break;
						case "delete":
							cardbookRepository.cardbookServerDeletedRequest[aConnection.connPrefId]++;
							cardbookSynchronization.serverDelete(aCardConnection, aMode, myCacheCard, aPrefIdType);
							break;
						case "cancel":
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
							break;
					}
				} else if (myCacheCard.updated) {
					// "UPDATEDONBOTH";
					cardbookRepository.cardbookServerSyncUpdatedOnBoth[aConnection.connPrefId]++;
					cardbookUtils.formatStringForOutput("cardUpdatedOnBoth", [aConnection.connDescription, myCacheCard.fn]);
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var solveConflicts = prefs.getComplexValue("extensions.cardbook.solveConflicts", Components.interfaces.nsISupportsString).data;
					if (solveConflicts === "Local") {
						var conflictResult = "local";
					} else if (solveConflicts === "Remote") {
						var conflictResult = "remote";
					} else {
						var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
						var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
						var message = strBundle.formatStringFromName("cardUpdatedOnBoth", [aConnection.connDescription, myCacheCard.fn], 2);
						var askUserResult = cardbookSynchronization.askUser(message, "local", "remote", "merge");
						var conflictResult = askUserResult.result;
					}
					
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aConnection.connDescription + " : debug mode : conflict resolution : ", conflictResult);
					switch (conflictResult) {
						case "local":
							cardbookRepository.cardbookServerUpdatedRequest[aConnection.connPrefId]++;
							cardbookSynchronization.serverUpdate(aCardConnection, aMode, myCacheCard, myServerCard, aPrefIdType);
							break;
						case "remote":
							cardbookRepository.cardbookServerMultiGetArray[aCardConnection.connPrefId].push(aUrl);
							break;
						case "merge":
							cardbookRepository.cardbookServerGetForMergeRequest[aConnection.connPrefId]++;
							cardbookSynchronization.serverGetForMerge(aCardConnection, aMode, aEtag, myCacheCard, aPrefIdType);
							break;
						case "cancel":
							cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
							break;
					}
				} else {
					// "UPDATEDONSERVER";
					cardbookRepository.cardbookServerMultiGetArray[aCardConnection.connPrefId].push(aUrl);
					cardbookRepository.cardbookServerSyncUpdatedOnServer[aConnection.connPrefId]++;
					cardbookUtils.formatStringForOutput("cardUpdatedOnServer", [aConnection.connDescription, myCacheCard.fn, aEtag, myCacheCard.etag]);
				}
			} else {
				// "NEWONSERVER";
				cardbookRepository.cardbookServerMultiGetArray[aCardConnection.connPrefId].push(aUrl);
				cardbookRepository.cardbookServerSyncNewOnServer[aConnection.connPrefId]++;
				cardbookUtils.formatStringForOutput("cardNewOnServer", [aConnection.connDescription]);
			}
			cardbookRepository.cardbookServerMultiGetParams[aCardConnection.connPrefId] = [ aConnection, aMode ];
			cardbookRepository.cardbookServerSyncCompareWithCacheDone[aConnection.connPrefId]++;
		},

		googleSyncCards: function(aConnection, aMode, aPrefIdType) {
			var listener_propfind = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(cardbookSynchronization.getRootUrl(aConnection.connUrl));
							if (certificateExceptionAdded) {
								cardbookSynchronization.serverSyncCards(aConnection, aMode, aPrefIdType);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleSyncCards", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleSyncCards", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							cardbookSynchronization.getCacheFiles(aConnection.connPrefId);
							cardbookRepository.cardbookServerSyncHandleRemainingTotal[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].length;
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let href = decodeURIComponent(jsonResponse["href"][0]);
								let propstats = jsonResponse["propstat"];
								// 2015.04.27 13:53:48 : href : /carddav/v1/principals/foo.bar@gmail.com/lists/default/
								// 2015.04.27 13:53:48 : propstats : [{status:["HTTP/1.1 200 OK"]}, {status:["HTTP/1.1 404 Not Found"], prop:[{getetag:[null]}]}]
								// 2015.04.27 14:03:54 : href : /carddav/v1/principals/foo.bar@gmail.com/lists/default/69ada43d89c0d90b
								// 2015.04.27 14:03:54 : propstats : [{status:["HTTP/1.1 200 OK"], prop:[{getetag:["\"2014-07-15T13:43:23.997-07:00\""]}]}]
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
											cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aConnection.connPrefId]++;
											var prop = propstat["prop"][0];
											var etag = prop["getetag"][0];
											var keyArray = href.split("/");
											var key = decodeURIComponent(keyArray[keyArray.length - 1]);
											var myUrl = baseUrl + key;
											var myFileName = cardbookUtils.getFileNameFromUrl(myUrl);
											var aCardConnection = {accessToken: aConnection.accessToken, connPrefId: aConnection.connPrefId, connUrl: myUrl, connDescription: aConnection.connDescription};
											cardbookSynchronization.compareServerCardWithCache(aCardConnection, aConnection, aMode, aPrefIdType, myUrl, etag, myFileName);
											function filterFileName(element) {
												return (element != myFileName);
											}
											cardbookRepository.filesFromCacheDB[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].filter(filterFileName);
											cardbookRepository.cardbookServerSyncHandleRemainingTotal[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].length;
										}
									}
								}
							}
						cardbookSynchronization.handleRemainingCache(aPrefIdType, aConnection, aMode);
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleSyncCards error : " + e, "Error");
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleSyncCards", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			var baseUrl = aConnection.connUrl;
			if (baseUrl.indexOf("/", baseUrl.length -1) === -1) {
				baseUrl = baseUrl + "/";
			}
			cardbookUtils.formatStringForOutput("synchronizationSearchingCards", [aConnection.connDescription]);
            let request = new cardbookWebDAV(aConnection, listener_propfind, "", true);
            request.propfind(["DAV: getetag"]);
		},

		serverSyncCards: function(aConnection, aMode, aPrefIdType) {
			var listener_propfind = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(cardbookSynchronization.getRootUrl(aConnection.connUrl));
							if (certificateExceptionAdded) {
								cardbookSynchronization.serverSyncCards(aConnection, aMode, aPrefIdType);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "serverSyncCards", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "serverSyncCards", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							cardbookSynchronization.getCacheFiles(aConnection.connPrefId);
							cardbookRepository.cardbookServerSyncHandleRemainingTotal[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].length;
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let href = decodeURIComponent(jsonResponse["href"][0]);
								let propstats = jsonResponse["propstat"];
								// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/
								// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:[null], getetag:[null]}], status:["HTTP/1.1 404 Not Found"]}]
								// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/C68894CF-D340-0001-78C3-1E301B4011F5.vcf
								// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:["text/x-vcard"], getetag:["\"6163e30117192647e1967de751fb5467\""]}], status:["HTTP/1.1 200 OK"]}]
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (href != aConnection.connUrl) {
												var contType = "";
												if (prop["getcontenttype"]) {
													contType = prop["getcontenttype"][0];
												}
												if (typeof(prop["getetag"]) == "undefined") {
													continue;
												}
												if (href.indexOf("/", href.length -1) !== -1) {
													continue;
												}
												var etag = prop["getetag"][0];
												var keyArray = href.split("/");
												var key = decodeURIComponent(keyArray[keyArray.length - 1]);
												var myUrl = baseUrl + key;
												var myFileName = cardbookUtils.getFileNameFromUrl(myUrl);
												if (cardbookSynchronization.isSupportedContentType(contType, myFileName)) {
													cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
													cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aConnection.connPrefId]++;
													var aCardConnection = {connPrefId: aConnection.connPrefId, connUrl: myUrl, connDescription: aConnection.connDescription};
													cardbookSynchronization.compareServerCardWithCache(aCardConnection, aConnection, aMode, aPrefIdType, myUrl, etag, myFileName);
													function filterFileName(element) {
														return (element != myFileName);
													}
													cardbookRepository.filesFromCacheDB[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].filter(filterFileName);
													cardbookRepository.cardbookServerSyncHandleRemainingTotal[aConnection.connPrefId] = cardbookRepository.filesFromCacheDB[aConnection.connPrefId].length;
												}
											}
										}
									}
								}
							}
						cardbookSynchronization.handleRemainingCache(aPrefIdType, aConnection, aMode);
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.serverSyncCards error : " + e, "Error");
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "serverSyncCards", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			var baseUrl = aConnection.connUrl;
			if (baseUrl.indexOf("/", baseUrl.length -1) === -1) {
				baseUrl = baseUrl + "/";
			}
			cardbookUtils.formatStringForOutput("synchronizationSearchingCards", [aConnection.connDescription]);
            let request = new cardbookWebDAV(aConnection, listener_propfind, "", true);
            request.propfind(["DAV: getcontenttype", "DAV: getetag"]);
		},

		validateWithoutDiscovery: function(aConnection, aRootUrl) {
			var listener_checkpropfind4 = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(aRootUrl);
							if (certificateExceptionAdded) {
								cardbookSynchronization.validateWithoutDiscovery(aConnection, aRootUrl);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let href = decodeURIComponent(jsonResponse["href"][0]);
								if (href[href.length - 1] != '/') {
									href += '/';
								}
								let propstats = jsonResponse["propstat"];
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
												let rsrcType = prop["resourcetype"][0];
												wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : rsrcType found : " + rsrcType.toSource());
												if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
													var displayname = "";
													if (prop["displayname"] != null && prop["displayname"] !== undefined && prop["displayname"] != "") {
														displayname = prop["displayname"][0];
													}
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : href found : " + href);
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : displayname found : " + displayname);
													if (href.indexOf(aRootUrl) >= 0 ) {
														aConnection.connUrl = href;
													} else {
														aConnection.connUrl = aRootUrl + href;
													}
													cardbookRepository.cardbookServerValidation[aRootUrl].push([displayname, aConnection.connUrl]);
												}
											}
										}
									}
								}
							}
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.validateWithoutDiscovery error : " + e, "Error");
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookRepository.cardbookServerValidation[aRootUrl] = [];
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind4, "", true);
			request.propfind(["DAV: resourcetype", "DAV: displayname"], true);
		},

		discoverPhase3: function(aConnection, aRootUrl, aOperationType, aParams) {
			var listener_checkpropfind3 = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(aRootUrl);
							if (certificateExceptionAdded) {
								cardbookSynchronization.discoverPhase3(aConnection, aRootUrl, aOperationType, aParams);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							// first : try to determine if there are multiples addressbooks
							var allAddressbooks = [];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let href = decodeURIComponent(jsonResponse["href"][0]);
								if (href[href.length - 1] != '/') {
									href += '/';
								}
								let propstats = jsonResponse["propstat"];
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
												let rsrcType = prop["resourcetype"][0];
												if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
													if (href.indexOf(aRootUrl) >= 0 ) {
														aConnection.connUrl = href;
													} else {
														aConnection.connUrl = aRootUrl + href;
													}
													allAddressbooks.push(aConnection.connUrl);
												}
											}
										}
									}
								}
							}
							if (allAddressbooks.length > 1 && aOperationType !== "GETDISPLAYNAME") {
								var strBundle = document.getElementById("cardbook-strings");
								var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
								var multipleAddressBooksTitle = strBundle.getString("multipleAddressBooksTitle");
								var multipleAddressBooksMsg = strBundle.getFormattedString("multipleAddressBooksMsg", [aRootUrl]) + "\r\n\r\n" + allAddressbooks.join("\r\n");
								prompts.alert(null, multipleAddressBooksTitle, multipleAddressBooksMsg);
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
							} else {
								for (var prop in jsonResponses) {
									var jsonResponse = jsonResponses[prop];
									let href = decodeURIComponent(jsonResponse["href"][0]);
									if (href[href.length - 1] != '/') {
										href += '/';
									}
									let propstats = jsonResponse["propstat"];
									for (var prop1 in propstats) {
										var propstat = propstats[prop1];
										if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
											if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
												let prop = propstat["prop"][0];
												if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
													let rsrcType = prop["resourcetype"][0];
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : rsrcType found : " + rsrcType.toSource());
													if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
														var displayname = "";
														if (prop["displayname"] != null && prop["displayname"] !== undefined && prop["displayname"] != "") {
															displayname = prop["displayname"][0];
														}
														wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : href found : " + href);
														wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : displayname found : " + displayname);
														if (href.indexOf("http") == 0 ) {
															aConnection.connUrl = href;
														} else {
															aConnection.connUrl = aRootUrl + href;
														}
														if (aOperationType == "GETDISPLAYNAME") {
															cardbookRepository.cardbookServerValidation[aRootUrl].push([displayname, aConnection.connUrl]);
														} else if (aOperationType == "SYNCGOOGLE") {
															cardbookSynchronization.googleSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
														} else if (aOperationType == "SYNCSERVER") {
															cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
														}
													}
												}
											}
										}
									}
								}
							}
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase3 error : " + e, "Error");
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase3", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookRepository.cardbookServerValidation[aRootUrl] = [];
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery3", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind3, "", true);
			request.propfind(["DAV: resourcetype", "DAV: displayname"], true);
		},

		discoverPhase2: function(aConnection, aRootUrl, aOperationType, aParams) {
			var listener_checkpropfind2 = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(aRootUrl);
							if (certificateExceptionAdded) {
								cardbookSynchronization.discoverPhase2(aConnection, aRootUrl, aOperationType, aParams);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let propstats = jsonResponse["propstat"];
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											let rsrcType = prop["addressbook-home-set"][0];
											let href = decodeURIComponent(rsrcType["href"][0]);
											if (href[href.length - 1] != '/') {
												href += '/';
											}
											wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : addressbook-home-set found : " + href);
											if (href.indexOf("http") == 0 ) {
												aConnection.connUrl = href;
											} else {
												aConnection.connUrl = aRootUrl + href;
											}
											cardbookSynchronization.discoverPhase3(aConnection, aRootUrl, aOperationType, aParams);
											cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
										}
									}
								}
							}
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase2 error : " + e, "Error");
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase2", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery2", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind2, "", true);
			request.propfind(["urn:ietf:params:xml:ns:carddav addressbook-home-set"], false);
		},

		discoverPhase1: function(aConnection, aOperationType, aParams) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_checkpropfind1 = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status == 0) {
						if (askCertificate) {
							var certificateExceptionAdded = false;
							var certificateExceptionAdded = cardbookSynchronization.addCertificateException(cardbookSynchronization.getRootUrl(aConnection.connUrl));
							if (certificateExceptionAdded) {
								cardbookSynchronization.discoverPhase1(aConnection, aOperationType, aParams);
							} else {
								cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							}
						} else {
							cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
					} else if (response && response["parsererror"] && response["parsererror"][0]["sourcetext"] && response["parsererror"][0]["sourcetext"][0]) {
						cardbookUtils.formatStringForOutput("unableToParseResponse", [aConnection.connDescription, response["parsererror"][0]["sourcetext"][0]], "Error");
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					} else if (response && response["multistatus"] && (status > 199 && status < 400)) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for (var prop in jsonResponses) {
								var jsonResponse = jsonResponses[prop];
								let propstats = jsonResponse["propstat"];
								for (var prop1 in propstats) {
									var propstat = propstats[prop1];
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											let rsrcType = prop["current-user-principal"][0];
											let href = decodeURIComponent(rsrcType["href"][0]);
											if (href[href.length - 1] != '/') {
												href += '/';
											}
											wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : current-user-principal found : " + href);
											aConnection.connUrl = aRootUrl + href;
											cardbookSynchronization.discoverPhase2(aConnection, aRootUrl, aOperationType, aParams);
											cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
										}
									}
								}
							}
						}
						catch(e) {
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase1 error : " + e, "Error");
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						}
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase1", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			var aRootUrl = cardbookSynchronization.getRootUrl(aConnection.connUrl);
			if (aRootUrl + '/' === aConnection.connUrl) {
				cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
				if (aConnection.connPrefIdType !== "APPLE") {
					aConnection.connUrl = aConnection.connUrl + '.well-known/carddav';
				}
				cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery1", [aConnection.connDescription, aConnection.connUrl]);
				var request = new cardbookWebDAV(aConnection, listener_checkpropfind1, "", true);
				request.propfind(["DAV: current-user-principal"], false);
			} else {
				if (aOperationType == "GETDISPLAYNAME") {
					cardbookSynchronization.validateWithoutDiscovery(aConnection, aRootUrl);
				} else if (aOperationType == "SYNCGOOGLE") {
					cardbookSynchronization.googleSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
				} else if (aOperationType == "SYNCSERVER") {
					cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
				}
			}
		},

		googleGetAccessToken: function(aConnection, aCode, aOperationType, aParams) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_getAccessToken = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status > 199 && status < 400) {
						try {
							cardbookUtils.formatStringForOutput("googleAccessTokenOK", [aConnection.connDescription, response]);
							var responseText = JSON.parse(response);
							aConnection.accessToken = responseText.token_type + " " + responseText.access_token;
							aConnection.connUrl = cardbookRepository.cardbookgdata.GOOGLE_API;
							cardbookSynchronization.discoverPhase1(aConnection, aOperationType, aParams);
						}
						catch(e) {
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookGoogleAccessTokenError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleGetAccessToken error : " + e, "Error");
						}
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleGetAccessToken", aConnection.connUrl, status]);
						if (status == 400 || status == 401) {
							cardbookUtils.formatStringForOutput("googleGetNewRefreshToken", [aConnection.connDescription, aConnection.connUrl]);
							cardbookSynchronization.requestNewRefreshToken(aConnection, cardbookSynchronization.googleGetAccessToken, aOperationType, aParams);
						} else {
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookGoogleAccessTokenError[aConnection.connPrefId]++;
						}
					}
					cardbookRepository.cardbookGoogleAccessTokenResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.formatStringForOutput("googleRequestAccessToken", [aConnection.connDescription, aConnection.connUrl]);
			cardbookRepository.cardbookGoogleAccessTokenRequest[aConnection.connPrefId]++;
			aConnection.accessToken = "NOACCESSTOKEN";
			let params = {"refresh_token": aCode, "client_id": cardbookRepository.cardbookgdata.CLIENT_ID, "client_secret": cardbookRepository.cardbookgdata.CLIENT_SECRET, "grant_type": cardbookRepository.cardbookgdata.REFRESH_REQUEST_GRANT_TYPE};
			let headers = { "content-type": "application/x-www-form-urlencoded", "GData-Version": "3" };
			let request = new cardbookWebDAV(aConnection, listener_getAccessToken);
			request.googleToken(cardbookRepository.cardbookgdata.REFRESH_REQUEST_TYPE, params, headers);
		},

		googleGetRefreshToken: function(aConnection, aCode, aCallback) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_getRefreshToken = {
				onDAVQueryComplete: function(status, response, askCertificate) {
					if (status > 199 && status < 400) {
						try {
							cardbookUtils.formatStringForOutput("googleRefreshTokenOK", [aConnection.connDescription, response]);
							if (aCallback) {
								aCallback(JSON.parse(response));
							}
						}
						catch(e) {
							cardbookRepository.cardbookGoogleRefreshTokenError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleGetRefreshToken error : " + e, "Error");
						}
					} else {
						cardbookRepository.cardbookGoogleRefreshTokenError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleGetRefreshToken", aConnection.connUrl, status]);
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
					}
					cardbookRepository.cardbookGoogleRefreshTokenResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.formatStringForOutput("googleRequestRefreshToken", [aConnection.connDescription, aConnection.connUrl]);
			let params = {"code": aCode, "client_id": cardbookRepository.cardbookgdata.CLIENT_ID, "client_secret": cardbookRepository.cardbookgdata.CLIENT_SECRET, "redirect_uri": cardbookRepository.cardbookgdata.REDIRECT_URI, "grant_type": cardbookRepository.cardbookgdata.TOKEN_REQUEST_GRANT_TYPE};
			let headers = { "content-type": "application/x-www-form-urlencoded", "GData-Version": "3" };
			aConnection.accessToken = "NOACCESSTOKEN";
			let request = new cardbookWebDAV(aConnection, listener_getRefreshToken);
			request.googleToken(cardbookRepository.cardbookgdata.REFRESH_REQUEST_TYPE, params, headers);
		},

		requestNewRefreshToken: function (aConnection, aCallback, aOperationType, aParams) {
			cardbookRepository.cardbookGoogleRefreshTokenRequest[aConnection.connPrefId]++;
			cardbookUtils.jsInclude(["chrome://cardbook/content/addressbooksconfiguration/wdw_newGoogleToken.js"]);
			var myArgs = {dirPrefId: aConnection.connPrefId};
			var wizard = window.openDialog("chrome://cardbook/content/addressbooksconfiguration/wdw_newGoogleToken.xul", "", "chrome,resizable,scrollbars=no,status=no", myArgs);
			wizard.addEventListener("load", function onloadListener() {
				// var strBundle = document.getElementById("cardbook-strings");
				// var myWindowTitle = strBundle.getString("NewGoogleTokenTitle");
				// wizard.title = wizard.title + " totot";
				var browser = wizard.document.getElementById("browser");
				var url = cardbookSynchronization.getOAuthURL(aConnection.connUser);
				browser.loadURI(url);
				lTimerCheckTitle = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerCheckTitle.initWithCallback({ notify: function(lTimerCheckTitle) {
							var title = browser.contentTitle;
							if (title && title.indexOf(cardbookRepository.cardbookgdata.REDIRECT_TITLE) === 0) {
								var myCode = title.substring(cardbookRepository.cardbookgdata.REDIRECT_TITLE.length);
								cardbookUtils.formatStringForOutput("googleNewRefreshTokenOK", [aConnection.connDescription, myCode]);
								browser.loadURI("");
								var connection = {connUser: "", connUrl: cardbookRepository.cardbookgdata.TOKEN_REQUEST_URL, connPrefId: aConnection.connPrefId, connDescription: aConnection.connDescription};
								cardbookSynchronization.googleGetRefreshToken(connection, myCode, function callback(aResponse) {
																										wizard.close();
																										cardbookPasswordManager.removeAccount(aConnection.connUser);
																										cardbookPasswordManager.addAccount(aConnection.connUser, "", aResponse.refresh_token);
																										if (aCallback != null && aCallback !== undefined && aCallback != "") {
																											aCallback(aConnection, aResponse.refresh_token, aOperationType, aParams);
																										}
																										});
							}
						}
						}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
			});
		},

		getOAuthURL: function (aEmail) {
			return cardbookRepository.cardbookgdata.OAUTH_URL +
			"?response_type=" + cardbookRepository.cardbookgdata.RESPONSE_TYPE +
			"&client_id=" + cardbookRepository.cardbookgdata.CLIENT_ID +
			"&redirect_uri=" + cardbookRepository.cardbookgdata.REDIRECT_URI +
			"&scope=" + cardbookRepository.cardbookgdata.SCOPE +
			"&login_hint=" + cardbookRepository.aEmail;
		},

		addCertificateException: function (aUrl) {
			var params = {
			  exceptionAdded: false,
			  sslStatus : 0,
			  prefetchCert: true,
			  location: aUrl
			};
			window.openDialog("chrome://pippki/content/exceptionDialog.xul", "", "chrome,centerscreen,modal", params);
			return params.exceptionAdded;
		},

		setPeriodicSyncControl: function () {
			var nIntervId = setInterval(cardbookSynchronization.setPeriodicSync, 1000);
		},

		setPeriodicSync: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookSynchronization.js", "chrome://cardbook/content/wdw_log.js"]);
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);

			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var autoSync = prefs.getBoolPref("extensions.cardbook.autoSync");
			var autoSyncInterval = prefs.getComplexValue("extensions.cardbook.autoSyncInterval", Components.interfaces.nsISupportsString).data;
			if ((cardbookSynchronization.autoSync == "") ||
				(cardbookSynchronization.autoSync != autoSync || cardbookSynchronization.autoSyncInterval != autoSyncInterval)) {
				var autoSyncIntervalMs = autoSyncInterval * 60 * 1000;
				if (cardbookSynchronization.autoSyncId != null && cardbookSynchronization.autoSyncId !== undefined && cardbookSynchronization.autoSyncId != "") {
					cardbookUtils.formatStringForOutput("periodicSyncDeleting", [cardbookSynchronization.autoSyncId]);
					clearInterval(cardbookSynchronization.autoSyncId);
					cardbookSynchronization.autoSyncId = "";
				}
				
				if (autoSync) {
					cardbookSynchronization.autoSyncId = setInterval(cardbookSynchronization.syncAccounts, autoSyncIntervalMs);
					cardbookUtils.formatStringForOutput("periodicSyncSetting", [autoSyncIntervalMs, cardbookSynchronization.autoSyncId]);
				}
				cardbookSynchronization.autoSync = autoSync;
				cardbookSynchronization.autoSyncInterval = autoSyncInterval;
			}
		},

		syncAccounts: function () {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService();
				var result = [];
				result = cardbookPrefService.getAllPrefIds();
				for (let i = 0; i < result.length; i++) {
					var myPrefId = result[i];
					var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
					if (cardbookPrefService1.getType() !== "FILE" && cardbookPrefService1.getType() !== "DIRECTORY" && cardbookPrefService1.getType() !== "CACHE"
						&& cardbookPrefService1.getType() !== "SEARCH" && cardbookPrefService1.getType() !== "LOCALDB" && cardbookPrefService1.getEnabled()) {
						cardbookUtils.formatStringForOutput("periodicSyncSyncing");
						cardbookSynchronization.initSync(myPrefId);
						cardbookSynchronization.syncAccount(myPrefId);
					}
				}
			}
		},

		syncAccount: function (aPrefId) {
			try {
				cardbookUtils.jsInclude(["chrome://cardbook/content/wdw_log.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookPasswordManager.js"]);
				var cardbookPrefService = new cardbookPreferenceService(aPrefId);
				var myPrefIdType = cardbookPrefService.getType();
				var myPrefIdUrl = cardbookPrefService.getUrl();
				var myPrefIdName = cardbookPrefService.getName();
				var myPrefIdUser = cardbookPrefService.getUser();
				var myPrefEnabled = cardbookPrefService.getEnabled();
				var myMode = "WINDOW";
				if (myPrefEnabled) {
					if (myPrefIdType === "GOOGLE" || myPrefIdType === "CARDDAV" || myPrefIdType === "APPLE") {
						wdw_cardbooklog.initSyncActivity(aPrefId, myPrefIdName);
						cardbookRepository.cardbookServerSyncRequest[aPrefId]++;
						var params = {aMode: myMode, aPrefIdType: myPrefIdType};
						if (myPrefIdType === "GOOGLE" ) {
							var connection = {connUser: myPrefIdUser, connPrefId: aPrefId, connPrefIdType: myPrefIdType, connUrl: cardbookRepository.cardbookgdata.REFRESH_REQUEST_URL, connDescription: myPrefIdName};
							var myCode = cardbookPasswordManager.getPassword(myPrefIdUser, myPrefIdUrl);
							cardbookSynchronization.googleGetAccessToken(connection, myCode, "SYNCGOOGLE", params);
						} else {
							var connection = {connPrefId: aPrefId, connPrefIdType: myPrefIdType, connUrl: myPrefIdUrl, connDescription: myPrefIdName};
							cardbookSynchronization.discoverPhase1(connection, "SYNCSERVER", params);
						}
						cardbookSynchronization.waitForSyncFinished(aPrefId, myPrefIdName, myMode);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.syncAccount error : " + e, "Error");
			}
		},

		waitForSyncFinished: function (aPrefId, aPrefName, aMode) {
			cardbookRepository.lTimerSyncAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerSync = cardbookRepository.lTimerSyncAll[aPrefId];
			lTimerSync.initWithCallback({ notify: function(lTimerSync) {
						cardbookUtils.notifyObservers("cardbook.syncRunning");
						if (cardbookRepository.cardbookServerSyncCompareWithCacheDone[aPrefId] != 0) {
							if (cardbookRepository.cardbookServerSyncCompareWithCacheDone[aPrefId] == cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aPrefId]) {
								cardbookRepository.cardbookServerSyncCompareWithCacheDone[aPrefId] = 0;
								cardbookRepository.cardbookServerSyncCompareWithCacheTotal[aPrefId] = 0;
								if (cardbookRepository.cardbookServerMultiGetArray[aPrefId].length != 0) {
									cardbookSynchronization.serverMultiGet(cardbookRepository.cardbookServerMultiGetParams[aPrefId][0], cardbookRepository.cardbookServerMultiGetParams[aPrefId][1]);
								}
							}
						}
						if (cardbookRepository.cardbookServerSyncHandleRemainingDone[aPrefId] == cardbookRepository.cardbookServerSyncHandleRemainingTotal[aPrefId]) {
							var request = cardbookSynchronization.getRequest(aPrefId, aPrefName) + cardbookSynchronization.getTotal(aPrefId, aPrefName);
							var response = cardbookSynchronization.getResponse(aPrefId, aPrefName) + cardbookSynchronization.getDone(aPrefId, aPrefName);
							var cardbookPrefService = new cardbookPreferenceService(aPrefId);
							var myPrefIdType = cardbookPrefService.getType();
							if (myPrefIdType === "GOOGLE" || myPrefIdType === "CARDDAV" || myPrefIdType === "APPLE") {
								wdw_cardbooklog.fetchSyncActivity(aPrefId, cardbookRepository.cardbookServerSyncDone[aPrefId], cardbookRepository.cardbookServerSyncTotal[aPrefId]);
							}
							if (request == response) {
								cardbookSynchronization.finishSync(aPrefId, aPrefName, myPrefIdType);
								if (cardbookRepository.cardbookServerSyncAgain[aPrefId]) {
									cardbookSynchronization.finishMultipleOperations(aPrefId);
									cardbookUtils.formatStringForOutput("synchroForcedToResync", [aPrefName]);
									cardbookSynchronization.initSync(aPrefId);
									cardbookSynchronization.syncAccount(aPrefId);
								} else {
									cardbookSynchronization.finishMultipleOperations(aPrefId);
									var total = cardbookSynchronization.getRequest() + cardbookSynchronization.getTotal() + cardbookSynchronization.getResponse() + cardbookSynchronization.getDone();
									if (total === 0) {
										cardbookRepository.cardbookSyncMode = "NOSYNC";
										cardbookUtils.formatStringForOutput("synchroAllFinished");
										if (aMode == "INITIAL") {
											cardbookUtils.jsInclude(["chrome://cardbook/content/birthdays/cardbookBirthdaysUtils.js","chrome://cardbook/content/birthdays/ovl_birthdays.js"]);
											ovl_birthdays.onLoad();
										}
									}
								}
								lTimerSync.cancel();
							}
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForDirFinished: function (aPrefId, aPrefName, aMode) {
			cardbookRepository.lTimerDirAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerDir = cardbookRepository.lTimerDirAll[aPrefId];
			lTimerDir.initWithCallback({ notify: function(lTimerDir) {
						cardbookUtils.notifyObservers("cardbook.syncRunning");
						if (cardbookRepository.cardbookServerSyncHandleRemainingDone[aPrefId] == cardbookRepository.cardbookServerSyncHandleRemainingTotal[aPrefId]) {
							var request = cardbookSynchronization.getRequest(aPrefId, aPrefName) + cardbookSynchronization.getTotal(aPrefId, aPrefName);
							var response = cardbookSynchronization.getResponse(aPrefId, aPrefName) + cardbookSynchronization.getDone(aPrefId, aPrefName);
							var cardbookPrefService = new cardbookPreferenceService(aPrefId);
							var myPrefIdType = cardbookPrefService.getType();
							if (request == response) {
								cardbookSynchronization.finishSync(aPrefId, aPrefName, myPrefIdType);
								cardbookSynchronization.finishMultipleOperations(aPrefId);
								var total = cardbookSynchronization.getRequest() + cardbookSynchronization.getTotal() + cardbookSynchronization.getResponse() + cardbookSynchronization.getDone();
								if (total === 0) {
									cardbookRepository.cardbookSyncMode = "NOSYNC";
									if (aMode == "INITIAL") {
										cardbookUtils.jsInclude(["chrome://cardbook/content/birthdays/cardbookBirthdaysUtils.js","chrome://cardbook/content/birthdays/ovl_birthdays.js"]);
										ovl_birthdays.onLoad();
									}
								}
								lTimerDir.cancel();
							}
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForLoadCacheFinished: function (aPrefId, aPrefName, aPrefType, aPrefUser, aPrefUrl, aMode) {
			cardbookRepository.lTimerLoadCacheAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerLoadCache = cardbookRepository.lTimerLoadCacheAll[aPrefId];
			lTimerLoadCache.initWithCallback({ notify: function(lTimerLoadCache) {
					cardbookUtils.notifyObservers("cardbook.syncRunning");
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncEmptyCache : ", cardbookRepository.cardbookServerSyncEmptyCache[aPrefId]);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncLoadCacheDone : ", cardbookRepository.cardbookServerSyncLoadCacheDone[aPrefId]);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncLoadCacheTotal : ", cardbookRepository.cardbookServerSyncLoadCacheTotal[aPrefId]);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDBRequest : ", cardbookRepository.cardbookDBRequest[aPrefId]);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDBResponse : ", cardbookRepository.cardbookDBResponse[aPrefId]);
					if ((cardbookRepository.cardbookServerSyncEmptyCache[aPrefId]) ||
						((!cardbookRepository.cardbookServerSyncEmptyCache[aPrefId]) && 
							(cardbookRepository.cardbookServerSyncLoadCacheDone[aPrefId] + cardbookRepository.cardbookDBRequest[aPrefId] == 
								cardbookRepository.cardbookServerSyncLoadCacheTotal[aPrefId] + cardbookRepository.cardbookDBResponse[aPrefId]))) {
							var params = {aMode: aMode, aPrefIdType: aPrefType};
							var cardbookPrefService = new cardbookPreferenceService(aPrefId);
							cardbookPrefService.setDBCached(true);
							wdw_cardbooklog.initSyncActivity(aPrefId, aPrefName);
							if (aPrefType === "GOOGLE" ) {
								var connection = {connUser: aPrefUser, connPrefId: aPrefId, connPrefIdType: aPrefType, connUrl: cardbookRepository.cardbookgdata.REFRESH_REQUEST_URL, connDescription: aPrefName};
								var myCode = cardbookPasswordManager.getPassword(aPrefUser, aPrefUrl);
								cardbookRepository.cardbookServerSyncRequest[aPrefId]++;
								cardbookSynchronization.googleGetAccessToken(connection, myCode, "SYNCGOOGLE", params);
							} else {
								var connection = {connPrefId: aPrefId, connPrefIdType: aPrefType, connUrl: aPrefUrl, connDescription: aPrefName};
								cardbookRepository.cardbookServerSyncRequest[aPrefId]++;
								cardbookSynchronization.discoverPhase1(connection, "SYNCSERVER", params);
							}
							if (aPrefType === "GOOGLE" || aPrefType === "CARDDAV" || aPrefType === "APPLE") {
								cardbookSynchronization.waitForSyncFinished(aPrefId, aPrefName, aMode);
							} else {
								cardbookSynchronization.waitForDirFinished(aPrefId, aPrefName, aMode);
							}
							lTimerLoadCache.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForImportFinished: function (aPrefId, aPrefName) {
			cardbookRepository.lTimerImportAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerImport = cardbookRepository.lTimerImportAll[aPrefId];
			lTimerImport.initWithCallback({ notify: function(lTimerImport) {
						cardbookUtils.notifyObservers("cardbook.syncRunning");
						var request = cardbookSynchronization.getRequest(aPrefId, aPrefName) + cardbookSynchronization.getTotal(aPrefId, aPrefName);
						var response = cardbookSynchronization.getResponse(aPrefId, aPrefName) + cardbookSynchronization.getDone(aPrefId, aPrefName);
						if (request == response) {
							cardbookSynchronization.finishImport(aPrefId, aPrefName);
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							var total = cardbookSynchronization.getRequest() + cardbookSynchronization.getTotal() + cardbookSynchronization.getResponse() + cardbookSynchronization.getDone();
							if (total === 0) {
								cardbookRepository.cardbookSyncMode = "NOSYNC";
								cardbookUtils.formatStringForOutput("importAllFinished");
							}
							lTimerImport.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		loadAccounts: function () {
			cardbookRepository.cardbookAccounts = [];
			cardbookRepository.cardbookAccountsCategories = {};
			cardbookRepository.cardbookDisplayCards = {};
			cardbookRepository.cardbookFileCacheCards = {};
			cardbookRepository.cardbookCards = {};
			cardbookRepository.cardbookCardSearch1 = {};
			cardbookRepository.cardbookCardSearch2 = {};
	
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var initialSync = prefs.getBoolPref("extensions.cardbook.initialSync");
			var myMode = "INITIAL";
			var cardbookPrefService = new cardbookPreferenceService();
			var result = [];
			result = cardbookPrefService.getAllPrefIds();
			for (let i = 0; i < result.length; i++) {
				cardbookSynchronization.loadAccount(result[i], initialSync, true, myMode);
			}
			cardbookSynchronization.setPeriodicSyncControl();
		},

		loadAccount: function (aDirPrefId, aSync, aAddAccount, aMode) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/wdw_log.js"]);
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js", "chrome://cardbook/content/cardbookCardParser.js"]);
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js", "chrome://cardbook/content/cardbookPasswordManager.js"]);
			var cardbookPrefService1 = new cardbookPreferenceService(aDirPrefId);
			var myPrefName = cardbookPrefService1.getName();
			if (myPrefName == "") {
				cardbookPrefService1.delBranch();
				return;
			} else {
				var myPrefType = cardbookPrefService1.getType();
				var myPrefUrl = cardbookPrefService1.getUrl();
				var myPrefUser = cardbookPrefService1.getUser();
				var myPrefColor = cardbookPrefService1.getColor();
				var myPrefEnabled = cardbookPrefService1.getEnabled();
				var myPrefExpanded = cardbookPrefService1.getExpanded();
				var myPrefVCard = cardbookPrefService1.getVCard();
				var myPrefReadOnly = cardbookPrefService1.getReadOnly();
				var myPrefDateFormat = cardbookPrefService1.getDateFormat();
				var myPrefUrnuuid = cardbookPrefService1.getUrnuuid();
				var myPrefDBCached = cardbookPrefService1.getDBCached();
				if (aAddAccount) {
					cardbookRepository.addAccountToRepository(aDirPrefId, myPrefName, myPrefType, myPrefUrl, myPrefUser, myPrefColor, myPrefEnabled, myPrefExpanded,
																myPrefVCard, myPrefReadOnly, myPrefDateFormat, myPrefUrnuuid, myPrefDBCached, false);
					cardbookUtils.formatStringForOutput("addressbookOpened", [myPrefName]);
				}
			}

			if (myPrefEnabled) {
				if (myPrefType !== "SEARCH") {
					cardbookSynchronization.initSync(aDirPrefId);
				}
				if (myPrefType === "GOOGLE" || myPrefType === "CARDDAV" || myPrefType === "APPLE") {
					cardbookSynchronization.loadCache(aDirPrefId, myPrefName, myPrefType, myPrefUser, myPrefUrl, aSync, aMode, myPrefDBCached);
				} else if (myPrefType === "LOCALDB") {
					cardbookRepository.cardbookDBRequest[aDirPrefId]++;
					cardbookIndexedDB.loadDB(aDirPrefId, myPrefName, aMode);
					cardbookSynchronization.waitForDirFinished(aDirPrefId, myPrefName, aMode);
				} else if (myPrefType === "FILE") {
					cardbookRepository.cardbookFileRequest[aDirPrefId]++;
					var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					myFile.initWithPath(myPrefUrl);
					cardbookSynchronization.loadFile(myFile, "", aDirPrefId, aMode, "");
					cardbookSynchronization.waitForDirFinished(aDirPrefId, myPrefName, aMode);
				} else if (myPrefType === "DIRECTORY") {
					cardbookRepository.cardbookDirRequest[aDirPrefId]++;
					var myDir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					myDir.initWithPath(myPrefUrl);
					cardbookSynchronization.loadDir(myDir, "", aDirPrefId, aMode, "");
					cardbookSynchronization.waitForDirFinished(aDirPrefId, myPrefName, aMode);
				} else if (myPrefType === "CACHE") {
					cardbookRepository.cardbookDirRequest[aDirPrefId]++;
					var myDir = cardbookRepository.getLocalDirectory();
					myDir.append(cardbookRepository.cardbookCollectedCardsId);
					cardbookSynchronization.loadDir(myDir, "", aDirPrefId, aMode, "");
					cardbookSynchronization.waitForDirFinished(aDirPrefId, myPrefName, aMode);
				}
			}
		},

		loadFile: function (aFile, aTarget, aFileId, aMode, aSource) {
			if (aTarget == "") {
				var myDirPrefId = aFileId;
			} else {
				var myDirPrefId = cardbookUtils.getAccountId(aTarget);
			}
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
			var params = {};
			params["showError"] = true;
			params["aFile"] = aFile;
			params["aTarget"] = aTarget;
			params["aFileId"] = aFileId;
			params["aMode"] = aMode;
			params["aPrefId"] = myDirPrefId;
			params["aPrefIdType"] = cardbookPrefService.getType();
			params["aPrefIdName"] = cardbookPrefService.getName();
			params["aPrefIdUrl"] = cardbookPrefService.getUrl();
			params["aSource"] = aSource;
			cardbookSynchronization.getFileDataAsync(aFile.path, cardbookSynchronization.loadFileAsync, params);
		},
				
		loadFileAsync: function (aContent, aParams) {
			try {
				if (aContent != null && aContent !== undefined && aContent != "") {
					var re = /[\n\u0085\u2028\u2029]|\r\n?/;
					var fileContentArray = aContent.split(re);

					var fileContentArrayLength = fileContentArray.length
					for (let i = 0; i < fileContentArrayLength; i++) {
						if (fileContentArray[i] == "BEGIN:VCARD") {
							cardbookRepository.cardbookServerSyncTotal[aParams.aPrefId]++;
						}
					}
					cardbookRepository.importConflictChoicePersist = false;
					cardbookRepository.importConflictChoice = "write";
					for (let i = 0; i < fileContentArrayLength; i++) {
						if (fileContentArray[i] == "BEGIN:VCARD") {
							cardContent = fileContentArray[i];
						} else if (fileContentArray[i] == "END:VCARD") {
							cardContent = cardContent + "\r\n" + fileContentArray[i];
							try {
								var myCard = new cardbookCardParser(cardContent, "", "", aParams.aFileId);
							}
							catch (e) {
								cardbookRepository.cardbookServerSyncError[aParams.aPrefId]++;
								cardbookRepository.cardbookServerSyncDone[aParams.aPrefId]++;
								if (e.message == "") {
									var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
									var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
									cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, strBundle.GetStringFromName(e.code), fileContentArray[i]], "Error");
								} else {
									cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, e.message, fileContentArray[i]], "Error");
								}
								continue;
							}
							if (myCard.version == "") {
								if (aTarget == "") {
									cardbookRepository.cardbookServerSyncError[aParams.aPrefId]++;
									cardbookRepository.cardbookServerSyncDone[aParams.aPrefId]++;
								}
							} else {
								if (aParams.aTarget == "") {
									if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid]) {
										var myOldCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid];
										// if aCard and aModifiedCard have the same cached medias
										cardbookUtils.changeMediaFromFileToContent(myCard);
										cardbookRepository.removeCardFromRepository(myOldCard, true);
									}
									if (aParams.aPrefIdType === "CACHE" || aParams.aPrefIdType === "DIRECTORY") {
										cardbookRepository.addCardToRepository(myCard, aParams.aMode, aParams.aFile.leafName);
									} else if (aParams.aPrefIdType === "FILE") {
										myCard.cardurl = "";
										cardbookRepository.addCardToRepository(myCard, aParams.aMode);
									}
								} else {
									// performance reason
									// update the UI only at the end
									if (i == fileContentArrayLength - 1) {
										cardbookSynchronization.importCard(myCard, aParams.aTarget, true, aParams.aSource);
									} else {
										cardbookSynchronization.importCard(myCard, aParams.aTarget, true);
									}
								}
								cardbookRepository.cardbookServerSyncDone[aParams.aPrefId]++;
							}
							cardContent = "";
						} else if (fileContentArray[i] == "") {
							continue;
						} else {
							cardContent = cardContent + "\r\n" + fileContentArray[i];
						}
					}
					if (aParams.aTarget != null && aParams.aTarget !== undefined && aParams.aTarget != "") {
						if (aParams.aPrefIdType === "FILE") {
							cardbookRepository.reWriteFiles([aParams.aPrefId]);
						}
					}
				} else {
					if (aParams.aFileId != null && aParams.aFileId !== undefined && aParams.aFileId != "") {
						cardbookRepository.cardbookAccountsCategories[aParams.aFileId]=[];
						cardbookRepository.cardbookDisplayCards[aParams.aFileId]=[];
					}
					cardbookUtils.formatStringForOutput("fileEmpty", [aParams.aFile.path]);
				}
				cardbookRepository.cardbookFileResponse[aParams.aPrefId]++;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.loadFileAsync error : " + e, "Error");
				cardbookRepository.cardbookFileResponse[aParams.aPrefId]++;
			}
		},

		loadCSVFile: function (aFile, aTarget, aMode, aSource) {
			var myDirPrefId = cardbookUtils.getAccountId(aTarget);
				
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
			var params = {};
			params["showError"] = true;
			params["aFile"] = aFile;
			params["aTarget"] = aTarget;
			params["aMode"] = aMode;
			params["aPrefId"] = myDirPrefId;
			params["aPrefIdType"] = cardbookPrefService.getType();
			params["aPrefIdName"] = cardbookPrefService.getName();
			params["aPrefIdUrl"] = cardbookPrefService.getUrl();
			params["aSource"] = aSource;
			cardbookSynchronization.getFileDataAsync(aFile.path, cardbookSynchronization.loadCSVFileAsync, params);
		},

		loadCSVFileAsync: function (aContent, aParams) {
			try {
				if (aContent != null && aContent !== undefined && aContent != "") {
					var result = cardbookUtils.CSVToArray(aContent);
					var fileContentArray = result.result;
					var myDelimiter = result.delimiter;
					if (myDelimiter != null && myDelimiter !== undefined && myDelimiter != "") {
						var myHeader = fileContentArray[0].join(myDelimiter);
					} else {
						var myHeader = fileContentArray[0];
					}
					
					var myArgs = {template: [], headers: myHeader, lineHeader: true, columnSeparator: myDelimiter, mode: "import", action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/csvTranslator/wdw_csvTranslator.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						var result = cardbookUtils.CSVToArray(aContent, myArgs.columnSeparator);
						var fileContentArray = result.result;
						if (myArgs.lineHeader) {
							var start = 1;
						} else {
							var start = 0;
						}
						cardbookRepository.importConflictChoicePersist = false;
						cardbookRepository.importConflictChoice = "write";
						var fileContentArrayLength = fileContentArray.length
						cardbookRepository.cardbookServerSyncTotal[aParams.aPrefId] = fileContentArrayLength - start;
						for (var i = start; i < fileContentArrayLength; i++) {
							try {
								var myCard = new cardbookCardParser();
								myCard.dirPrefId = aParams.aPrefId;
								for (var j = 0; j < fileContentArray[i].length; j++) {
									if (myArgs.template[j]) {
										cardbookUtils.setCardValueByField(myCard, myArgs.template[j][0], fileContentArray[i][j]);
									}
								}
								var cardbookPrefService = new cardbookPreferenceService(aParams.aPrefId);
								myCard.version = cardbookPrefService.getVCard();
								cardbookUtils.setCardUUID(myCard);
								cardbookUtils.setCalculatedFields(myCard);
								if (myCard.fn == "") {
									myCard.fn = cardbookUtils.getDisplayedName([myCard.prefixname, myCard.firstname, myCard.othername, myCard.lastname, myCard.suffixname], myCard.org);
								}
							}
							catch (e) {
								cardbookRepository.cardbookServerSyncError[aParams.aPrefId]++;
								cardbookRepository.cardbookServerSyncDone[aParams.aPrefId]++;
								if (e.message == "") {
									var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
									var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
									cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, strBundle.GetStringFromName(e.code), fileContentArray[i]], "Error");
								} else {
									cardbookUtils.formatStringForOutput("parsingCardError", [aParams.aPrefIdName, e.message, fileContentArray[i]], "Error");
								}
								continue;
							}
							// performance reason
							// update the UI only at the end
							if (i == fileContentArrayLength - 1) {
								cardbookSynchronization.importCard(myCard, aParams.aTarget, true, aParams.aSource);
							} else {
								cardbookSynchronization.importCard(myCard, aParams.aTarget, true);
							}
							delete myCard;
							cardbookRepository.cardbookServerSyncDone[aParams.aPrefId]++;
						}
						if (aParams.aPrefIdType === "FILE") {
							cardbookRepository.reWriteFiles([aParams.aPrefId]);
						}
					}
				} else {
					cardbookUtils.formatStringForOutput("fileEmpty", [aParams.aFile.path]);
				}
				cardbookRepository.cardbookFileResponse[aParams.aPrefId]++;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.loadCSVFileAsync error : " + e, "Error");
				cardbookRepository.cardbookFileResponse[aParams.aPrefId]++;
			}
		},

		importCard: function (aCard, aTarget, aAskUser, aSource) {
			try {
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js", "chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var myTargetPrefId = cardbookUtils.getAccountId(aTarget);
				let cardbookPrefService = new cardbookPreferenceService(myTargetPrefId);
				var myTargetPrefIdType = cardbookPrefService.getType();
				var myTargetPrefIdName = cardbookPrefService.getName();
				var myTargetPrefIdUrl = cardbookPrefService.getUrl();

				var aNewCard = new cardbookCardParser();
				var myNullCard = new cardbookCardParser();
				cardbookUtils.cloneCard(aCard, aNewCard);
				aNewCard.dirPrefId = myTargetPrefId;
				var mySepPosition = aTarget.indexOf("::",0);
				if (mySepPosition != -1) {
					var myCategory = aTarget.substr(mySepPosition+2,aTarget.length);
					if (myCategory != cardbookRepository.cardbookUncategorizedCards) {
						cardbookRepository.addCategoryToCard(aNewCard, myCategory);
					} else {
						aNewCard.categories = [];
					}
				}

				var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				if (aAskUser && !cardbookRepository.importConflictChoicePersist && cardbookRepository.cardbookCards[myTargetPrefId+"::"+aNewCard.uid]) {
					var message = strBundle.formatStringFromName("cardAlreadyExisting", [myTargetPrefIdName, aNewCard.fn], 2);
					var confirmMessage = strBundle.GetStringFromName("askUserPersistMessage");
					var askUserResult = cardbookSynchronization.askUser(message, "keep", "overwrite", "duplicate", "merge", confirmMessage, false);
					cardbookRepository.importConflictChoice = askUserResult.result;
					cardbookRepository.importConflictChoicePersist = askUserResult.resultConfirm;
					if (cardbookRepository.importConflictChoicePersist) {
						cardbookUtils.notifyObservers("cardbook.importConflictChoicePersist");
					}
				}
				switch (cardbookRepository.importConflictChoice) {
					case "cancel":
					case "keep":
						break;
					case "duplicate":
						aNewCard.cardurl = "";
						aNewCard.fn = aNewCard.fn + " " + strBundle.GetStringFromName("fnDuplicatedMessage");
						cardbookUtils.setCardUUID(aNewCard);
						cardbookRepository.saveCard(myNullCard, aNewCard, aSource);
						break;
					case "write":
						cardbookRepository.saveCard(myNullCard, aNewCard, aSource);
						break;
					case "overwrite":
						var myTargetCard = cardbookRepository.cardbookCards[myTargetPrefId+"::"+aNewCard.uid];
						cardbookRepository.deleteCards([myTargetCard]);
						cardbookRepository.saveCard(myNullCard, aNewCard, aSource);
						break;
					case "merge":
						var myTargetCard = cardbookRepository.cardbookCards[myTargetPrefId+"::"+aNewCard.uid];
						var myArgs = {cardsIn: [myTargetCard, aNewCard], cardsOut: [], hideCreate: false, action: ""};
						var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
						if (myArgs.action == "CREATE") {
							var myNullCard = new cardbookCardParser();
							cardbookRepository.saveCard(myNullCard, myArgs.cardsOut[0], "cardbook.cardAddedDirect");
							cardbookRepository.reWriteFiles([myArgs.cardsOut[0].dirPrefId]);
						} else if (myArgs.action == "CREATEANDREPLACE") {
							var myNullCard = new cardbookCardParser();
							cardbookRepository.deleteCards(myArgs.cardsIn);
							cardbookRepository.saveCard(myNullCard, myArgs.cardsOut[0], "cardbook.cardAddedDirect");
							cardbookRepository.reWriteFiles([myArgs.cardsOut[0].dirPrefId]);
						}
						break;
				}

				// inside same account to a category
				if (aTarget != aCard.dirPrefId) {
					if (myCategory && myCategory != cardbookRepository.cardbookUncategorizedCards) {
						cardbookUtils.formatStringForOutput("cardAddedToCategory", [myTargetPrefIdName, aNewCard.fn, myCategory]);
					} else if (myCategory && myCategory == cardbookRepository.cardbookUncategorizedCards) {
						cardbookUtils.formatStringForOutput("cardRemovedFromAllCategory", [myTargetPrefIdName, aNewCard.fn]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCard error : " + e, "Error");
			}
		},

		writeCardsToCSVFile: function (aFileName, aFileLeafName, aListofCard) {
			try {
				var output = "";
				var myArgs = {template: [], mode: "export", lineHeader: true, columnSeparator: "", action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/csvTranslator/wdw_csvTranslator.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					var k = 0;
					for (var i = 0; i < myArgs.template.length; i++) {
						if (k === 0) {
							output = "\"" + myArgs.template[i][1] + "\"";
							k++;
						} else {
							output = output + myArgs.columnSeparator + "\"" + myArgs.template[i][1] + "\"";
						}
					}
					k = 0;
					for (var i = 0; i < aListofCard.length; i++) {
						for (var j = 0; j < myArgs.template.length; j++) {
							if (myArgs.template[j][0] == "categories.0.array") {
								var tmpValue = cardbookUtils.getCardValueByField(aListofCard[i], myArgs.template[j][0]);
								tmpValue = cardbookUtils.unescapeArrayComma(cardbookUtils.escapeArrayComma(tmpValue)).join(",");
							} else {
								var tmpValue = cardbookUtils.getCardValueByField(aListofCard[i], myArgs.template[j][0]).join("\r\n");
							}
							var tmpResult = "\"" + tmpValue + "\""; 
							if (k === 0) {
								output = output + "\r\n" + tmpResult;
								k++;
							} else {
								output = output + myArgs.columnSeparator + tmpResult;
							}
						}
						k = 0;
					}

					cardbookSynchronization.writeContentToFile(aFileName, output, "UTF8");

					if (aListofCard.length > 1) {
						cardbookUtils.formatStringForOutput("exportsOKIntoFile", [aFileLeafName]);
					} else {
						cardbookUtils.formatStringForOutput("exportOKIntoFile", [aFileLeafName]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeCardsToCSVFile error : " + e, "Error");
			}
		},

		writeCardsToFile: function (aFileName, aListofCard, aMediaConversion) {
			try {
				var output = cardbookUtils.getDataForUpdatingFile(aListofCard, aMediaConversion);

				cardbookSynchronization.writeContentToFile(aFileName, output, "UTF8");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeCardsToFile error : " + e, "Error");
			}
		},

		writeCardsToDir: function (aDirName, aListofCard, aMediaConversion) {
			try {
				var myDirectory = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				for (var i = 0; i < aListofCard.length; i++) {
					var myCard = aListofCard[i];
					myDirectory.initWithPath(aDirName);
					var myFile = myDirectory;
					myFile.append(cardbookUtils.getFileNameForCard(aDirName, myCard.fn, myCard.uid));
					if (myFile.exists() == false){
						myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					}
					cardbookSynchronization.writeContentToFile(myFile.path, cardbookUtils.cardToVcardData(myCard, aMediaConversion), "UTF8");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeCardsToDir error : " + e, "Error");
			}
		},

		writeContentToFile: function (aFileName, aContent, aConvertion) {
			try {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(aFileName);

				if (myFile.exists() == false){
					myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
				}
				
				var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				outputStream.init(myFile, 0x02 | 0x08 | 0x20, 0666, 0);

				if (aConvertion === "UTF8") {
					var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
					converter.init(outputStream, "UTF-8", aContent.length, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
					converter.writeString(aContent);
					converter.close();
				} else {
					var result = outputStream.write(aContent, aContent.length);
				}
				
				outputStream.close();
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : file rewritten : " + aFileName);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeContentToFile error : filename : " + aFileName + ", error : " + e, "Error");
			}
		}

	};

};