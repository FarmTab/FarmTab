define( ['jquery', 'backbone', 'underscore', 'models/Customer', 'text!templates/listview.html'],
        function( $, Backbone, _, ResultCollection, listTemplate ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var UserPage = Backbone.View.extend( {
                el: $( "#listviewholder" ),

                initialize: function() {
                    this.collection = new UserPage;
                    _.bindAll(this, "renderList");
                    this.collection.bind( "reset", this.renderList );
                },

                renderList: function() {

                    var compiled_template = _.template( userView ),
                        collection = this.collection,
                        $el = $(this.el);

                    mobileSearch.utils.loadPrompt( "Loading results..." );
                    mobileSearch.utils.toggleNavigation( true );
                    $el.html( compiled_template( { results: collection.models } ) );

                    setTimeout( function() {
                       $el.listview('refresh');
                    }, 0 );

                }
            } );

            return UserPage;
        });
