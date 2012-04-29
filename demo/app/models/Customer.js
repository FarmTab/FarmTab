define( ['backbone'],
        function( Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Customer = Backbone.Model.extend( {
            	validate: function(attribs) {
            		if (attribs.name === undefined)
            			return "Customer name not set";
            		if (attribs.pin === undefined)
            			return "Customer PIN not set";
            		if (attribs.balance < 0) {
            			this.balance = this.previous('balance');
            			return "Customer balance cannot be negative";
            		}
            		return '';
            	},
            	           
            	defaults: {
            		balance: 0.00,
            		imgSrc: 'placeholder.jpg'
            	},
            	
            	initialize: function() {
            		Backbone.Model.prototype.initialize.apply(this, arguments);
				    var error = this.validate(this.attributes);
				    if (error) {
				      this.trigger('error', this, error);
				    }            	
            		console.log("created user: " + this.get('name'));
            		
            		this.bind("change:balance", function(){
			            var balance = this.get("balance");
			            console.log('User balance updated to ' + balance);
			        });
            		
            		this.bind("error", function(model, error){
			            console.log("User model error: " + error);
			        });
            	},
            	
            	updateBal: function ( amount, is_purchase ) {
            		
            		bal = this.get('balance');
            	
            		if (is_purchase) {
            			this.save({ balance: bal - amount });
            			// todo: send out fb blast, update purchase log, etc
            		} else {
            			this.save({ balance: bal + amount});
            		}
            	}
            } );

            return Customer;
        } );
