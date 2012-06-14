define( ['backbone', 'underscore', 'utils'],
  function( Backbone, _, utils ) {
      // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
      "use strict";      

      var Customer = Backbone.Model.extend( {

        url: "API/backend.php?type=customer",
  
        defaults: {
          balance: 0.00
        },
        
        initialize: function() {
          Backbone.Model.prototype.initialize.apply(this, arguments);
          
          this.bind("change:balance", function( amount, is_purchase ){

            if (is_purchase)
              if (this.get("balance") - amount < 0) {
                this.set("balance", this.previous("balance"), {silent: true});
                this.trigger("error", "Balance can't be negative");
              }

            updateBal(amount, is_purchase);
            console.log('User balance updated to ' + this.get("balance"));
          });
          
          this.bind("error", function(model, error){
            console.log("User model error: " + error);
          });
        },
        
        updateBal: function ( amount, is_purchase ) {
          
          bal = this.get('balance');
        
          if (is_purchase) {
            this.save( { balance: bal - amount }, {silent: true} );
          } else {
            this.save( { balance: bal + amount }, {silent: true} );
          }
        }
      } );

      return Customer;
});
