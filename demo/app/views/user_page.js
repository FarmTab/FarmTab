define( ['jquery', 'backbone', 'underscore', 'models/Customer', 'text!templates/user_page.html'],
        function( $, Backbone, _ , Customer, user_page) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var UserPage = Backbone.View.extend( {
                $el: $( "#userview" ),

                initialize: function() {
                    var compiled_template = _.template(user_page),
                        model = this.model;

                    FarmTab.utils.loadPrompt( "Loading user..." );
                    $( '#user .ui-title' ).text( model.get('name') );
                    $el.html( compiled_template( { user : model } ) );
                }
            } );

            return UserPage;
} );
