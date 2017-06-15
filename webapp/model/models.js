sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			
			return oModel;
			
		},
		
		createJSONModel: function() {
			
			var oFilters = {
				suppliers: [],
				lowerBound: "",
				lowerBoundDate: null,
				upperBound: "",
				upperBoundDate: null,
				invoiceNumber: "",
				partite: 0,
				partiteAperte: true,
				partitePareggiate: true
			};
			
			var oModel = new JSONModel({
				suppliers: [],
				
				defaultFilters: JSON.parse(JSON.stringify(oFilters)), /* Backup copy for filters reset */
				
				filters: JSON.parse(JSON.stringify(oFilters)),
				
				invoices: []
			});
			
			oModel.setSizeLimit(99999999);
			return oModel;
		},
		
		createTempModel: function(){
			
			var sLanguage = sap.ui.getCore().getConfiguration().getLanguage(),
				bIsItalian = sLanguage.indexOf("it") !== -1,
				sRootPah = jQuery.sap.getModulePath("org.fater.paymenttracking");
			
			var oBundle = jQuery.sap.resources({
				url : sRootPah + "/i18n/i18n.properties", 
				locale: sLanguage
			});
			
			var oModel = new JSONModel({
				config: {
					datePickerValueFormat: (bIsItalian) ? "dd-MM-yyyy" : "yyyy-MM-dd",
					dataLoaded: false
				},
				tableColumns:[
					{
						name: oBundle.getText("docNumberLabel"),
						selected: true,
						visible: false
					},
					{
						name: oBundle.getText("docTypeLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("docAmountLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("documentDateLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("expireDateLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("pareggioDocNumberLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("pareggioDocDateLabel"),
						selected: true,
						visible:true
					},
					{
						name: oBundle.getText("internalDocNumberLabel"),
						selected: true,
						visible:true
					}
				],
				sortItems:[
					{
						name: oBundle.getText("docNumberLabel"),
						selected: false,
						key: "docNumber"
					},
					{
						name: oBundle.getText("docTypeLabel"),
						selected: false,
						key: "docType"
					},
					{
						name: oBundle.getText("docAmountLabel"),
						selected: false,
						key: "amount"
					},
					{
						name: oBundle.getText("documentDateLabel"),
						selected: false,
						key: "docDate"
					},
					{
						name: oBundle.getText("expireDateLabel"),
						selected: false,
						key: "expireDate"
					},
					{
						name: oBundle.getText("pareggioDocNumberLabel"),
						selected: true,
						key: "pareggioDocNumber"
					},
					{
						name: oBundle.getText("pareggioDocDateLabel"),
						selected: false,
						key: "pareggioDocDate"
					},
					{
						name: oBundle.getText("internalDocNumberLabel"),
						selected: false,
						key: "internalDocNumber"
					}					
				]
			});
			
			return oModel;
		}

	};

});