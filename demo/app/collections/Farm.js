define( ['jquery', 'backbone', 'models/Customer'],
  function( $, Backbone, Customer ) {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";
    
    var Farm = Backbone.Collection.extend( {
      model: Customer
    } );
    
    listCustomers: function() {
      return this.filter(function(customer){ return customer.get('farmId'); });
    }

    return Farm;
} );
