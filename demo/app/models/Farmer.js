define( ['backbone'],
        function( Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Farmer = Backbone.Model.extend( {
            	validate: function(attribs) {
            		if (attribs.name === undefined)
            			return "Farmer name not set";
            	},
            	
            	initialize: function() {
            		console.log("created user: " + this.get('name'));
            		
            		this.bind("error", function(model, error){
			            console.log("User model error: " + error);
			        });
            	}
            } );

            return Customer;
        } );
