define( ['jquery', 'backbone', 'underscore', 'collections/Farm', 'text!templates/_user_list_item.html'],
        function( $, Backbone, _, Farm, user_list_item ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Farm = Backbone.View.extend( {
                el: $( "#listviewholder" ),

                initialize: function() {
                    this.collection = new Farm;
                    _.bindAll(this, "renderList");
                    this.collection.bind( "reset", this.renderList );
                },

                renderList: function() {

                    var compiled_template = _.template( user_list_item ),
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

            return Farm;
        });
