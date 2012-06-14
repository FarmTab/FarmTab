define( ['jquery', 'backbone', 'models/Customer'],
  function( $, Backbone, Customer ) {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";
    
    var Farm = Backbone.Collection.extend( {
      model: Customer,
      url: "API/backend.php?type=userlist",
      name: "",
      parse: function (customers) {
	      return customers;
      }
    } );

    return Farm;
} );
