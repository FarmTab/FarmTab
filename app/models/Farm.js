define( ['jquery', 'backbone', 'models/Customer'],
  function( $, Backbone, Customer ) {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";
    
    var Farm = Backbone.Collection.extend( {
      model: Customer,
      url: "http://farmtab.com/API/backend.php?type=farm",
      name: "",
      parse: function (response) {
        this.id   = response.data.id;
        this.name = response.data.name;
        return response.data.users;
      }
    } );

    return Farm;
} );
