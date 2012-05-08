define( ['backbone', 'underscore', 'utils'],
  function( Backbone, _, utils ) {
      // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
      "use strict";
      
      
      function validate_name(name) {
        if (name === undefined)
          return "Customer name not set";
        return '';
      }
      
      function validate_balance(balance) {
        if (balance < 0) {
          this.balance = this.previous('balance');
          return "Customer balance cannot be negative";
        }
        return '';
      }
      

      var Customer = Backbone.Model.extend( {
        validates: { required: ['name'] },
        errors:    {},
      
        validate: function(attribs) {
          this.errors = Backbone.Validate(this, attribs);
        
          if (!_.isEmpty(this.errors)) {
            return this.errors;
          }
        },
      	           
      	defaults: {
      		balance: 0.00,
      		imgSrc: 'placeholder.jpg'
      	},
      	
      	initialize: function() {
      		Backbone.Model.prototype.initialize.apply(this, arguments);
    	    
      		console.log("created user: " + this.get('name'));
      		
      		this.bind("change:balance", function(){
            var balance = this.get("balance");
            validate_balance(); // do something with this??
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
});
