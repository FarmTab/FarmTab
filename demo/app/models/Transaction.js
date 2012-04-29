define( ['backbone'],
        function( Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Transaction = Backbone.Model.extend( {
            	validate: function(attribs) {
            		if (attribs.isWithdrawal === undefined)
            			return "isWithdrawal needs to be set";
            		if (attribs.amount === undefined || attribs.amount < 0) {
            			return "Transaction amount cannot be negative";
            		}
            		if (attribs.customer === undefined) {
            			return "Transaction needs a customer";
            		}
            		if (attribs.farm === undefined) {
            			return "Transaction needs a farm";
            		}
            		return '';
            	},
            	
            	initialize: function() {
            		Backbone.Model.prototype.initialize.apply(this, arguments);
				    var error = this.validate(this.attributes);
				    if (error) {
				      this.trigger('error', this, error);
				    }            	
            		console.log("created transaction for " + this.get('customer').get('name'));
            		
            		this.bind("error", function(model, error){
			            console.log("User model error: " + error);
			        });
            	}
            } );

            return Transaction;
        } );
