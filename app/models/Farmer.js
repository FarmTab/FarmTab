define( ['backbone', 'utils'], 
  function( Backbone, utils ) {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";

    var Farmer = Backbone.Model.extend( {
      
      initialize: function() {
        console.log("created farmer: " + this.get('name') + "(" + this.get('id') + ")");
        
        this.bind("error", function(model, error){
          console.log("User model error: " + error);
        });
      }
    });
    
    return Farmer;
});
