define( ['jquery', 'backbone', 'underscore', 'models/Customer', 'text!templates/userview.html'],
        function( $, Backbone, _ , Farm, photoTemplate) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var UserList = Backbone.View.extend( {
                el: $( "#listviewholder" ),

                initialize: function() {
                    this.collection = new Farm;
                    _.bindAll(this, "renderList");
                    this.collection.bind( "reset", this.renderList );
                },

                renderList: function( collection ) {

                    var compiled_template = _.template(listTemplate),
                        collection = this.collection,
                        $el = $(this.el);

                    mobileSearch.utils.loadPrompt( "Loading user..." );
                    $( '#photo .ui-title' ).html( 'User view' );
                    $el.html( compiled_template( { results: collection.models } ) );

                    setTimeout( function() {
                        $el.listview('refresh');
                    }, 0 );

                }
            } );

            return UserList;
        } );
