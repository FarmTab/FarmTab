define( ['backbone'],
        function( Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Transaction = Backbone.Model.extend( {

              url: "API/backend.php?type=transaction",

              validate: function(attribs) {
                if (attribs.isWithdrawal === undefined)
                  return "isWithdrawal needs to be set";
                if (attribs.amount === undefined || attribs.amount < 0) {
                  return "Transaction must have a positive amount";
                }
                if (attribs.customer_id === undefined) {
                  return "Transaction needs a customer";
                }
                if (attribs.farm_id === undefined) {
                  return "Transaction needs a farm";
                }
                return '';
              },
              
              initialize: function() {
                Backbone.Model.prototype.initialize.apply(this, arguments);
                
                this.bind("error", function(model, error){
                  console.log("User model error: " + error);
                });
              }
            } );

            return Transaction;
        } );
