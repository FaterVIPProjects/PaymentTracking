// AS - FIX bug #009: Creazione del file di utility

sap.ui.define([

], function() {
	"use strict";

	return {
		getTotal: function(invoices) {
			if (!invoices) {
				return "";
			}
			var total = 0;
			var change = [];
			var sInternalType = "string";
			var amount1 = new sap.ui.model.type.Currency({
				showMeasure: false
			});

			for (var i = 0; invoices[i]; i++) {
				if (invoices[i].amount.substr(invoices[i].amount.length - 1) === "-") {
					var amount = invoices[i].amount.substr(0, invoices[i].amount.length - 1);
					total -= parseFloat(amount, 10);
				} else {
					total += parseFloat(invoices[i].amount, 10);
				}
			}

			change.push(total);
			var currency;
			if (invoices[0])
				currency = invoices[0].currency;
			else
				currency = 'EUR';
			change.push(currency);
			return amount1.formatValue(change, sInternalType) + " " + currency;
		},

		invokeSaveAsDialog: function(file, fileName) {
			if (!file) {
				throw 'Blob object is required.';
			}

			if (!file.type) {
				file.type = 'video/webm';
			}

			var fileExtension = file.type.split('/')[1];

			if (fileName && fileName.indexOf('.') !== -1) {
				var splitted = fileName.split('.');
				fileName = splitted[0];
				fileExtension = splitted[1];
			}

			var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

			if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
				return navigator.msSaveOrOpenBlob(file, fileFullName);
			} else if (typeof navigator.msSaveBlob !== 'undefined') {
				return navigator.msSaveBlob(file, fileFullName);
			}

			var hyperlink = document.createElement('a');
			hyperlink.href = URL.createObjectURL(file);
			hyperlink.target = '_blank';
			hyperlink.download = fileFullName;

			if (!navigator.mozGetUserMedia) {
				hyperlink.onclick = function() {
					(document.body || document.documentElement).removeChild(hyperlink);
				};
				(document.body || document.documentElement).appendChild(hyperlink);
			}

			var evt = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});

			hyperlink.dispatchEvent(evt);

			if (!navigator.mozGetUserMedia) {
				URL.revokeObjectURL(hyperlink.href);
			}
		},

		splitSuppliersForCurrency: function(aInvoices) {
			// FIX AS: SPLIT DOCUMENTI PER DIVISA
			var newSuppliers = [];
			if (aInvoices.length > 0) {
				for (var x = 0; aInvoices[x]; x++) {
					var currentSupplier = aInvoices[x];
					var invoices = currentSupplier.Invoices;
					currentSupplier.Invoices = [];
					if (invoices && invoices.length > 0) {
						var currentCurrency = invoices[0].currency;
						for (var y = 0; invoices[y]; y++) {
							var currency = invoices[y].currency;
							if (currency === currentCurrency) {
								currentSupplier.Invoices.push(invoices[y]);
							} else {
								currentSupplier.currency = currentCurrency;
								currentSupplier.documentsCount = currentSupplier.Invoices.length;
								newSuppliers.push(currentSupplier);
								currentCurrency = currency;

								var newSupplier = jQuery.extend(true, {}, currentSupplier);
								var newInvoices = [];
								newInvoices.push(invoices[y]);
								newSupplier.Invoices = newInvoices;
								currentSupplier = newSupplier;
							}
						}
						currentSupplier.currency = currentCurrency;
						currentSupplier.documentsCount = currentSupplier.Invoices.length;
						newSuppliers.push(currentSupplier);
					} else {
						currentSupplier.currency = currentCurrency;
						currentSupplier.documentsCount = currentSupplier.Invoices.length;
						newSuppliers.push(currentSupplier);
					}
				}
			}

			return newSuppliers;
		}
	};
});