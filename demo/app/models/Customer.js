define( ['backbone', 'underscore', 'utils'],
  function( Backbone, _, utils ) {
      // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
      "use strict";      

      var Customer = Backbone.Model.extend( {

        url: "API/backend.php?type=",
  
        defaults: {
          balance: 0.00
        },
        
        initialize: function() {
          Backbone.Model.prototype.initialize.apply(this, arguments);
          
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
          } else {
            this.save({ balance: bal + amount});
          }
        }
      } );

      return Customer;
});
