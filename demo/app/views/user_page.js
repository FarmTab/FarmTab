define( ['jquery', 'backbone', 'underscore', 'models/Customer', 'text!templates/user_page.html'],
        function( $, Backbone, _ , Customer, user_page) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var UserList = Backbone.View.extend( {
                el: $( "#userview" ),

                initialize: function() {
                    this.collection = new Customer;
                    _.bindAll(this, "renderList");
                    this.collection.bind( "reset", this.renderList );
                },

                renderList: function( collection ) {

                    var compiled_template = _.template(user_page),
                        collection = this.collection,
                        $el = $(this.el);

                    FarmTab.utils.loadPrompt( "Loading user..." );
                    $( '#photo .ui-title' ).html( 'User view' );
                    $el.html( compiled_template( { results: collection.models } ) );

                    setTimeout( function() {
                        $el.listview('refresh');
                    }, 0 );

                }
            } );

            return UserList;
} );
