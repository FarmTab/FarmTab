define( ['jquery', 'backbone', 'underscore', 'models/Farm', 'text!templates/_user_list_item.html'],
        function( $, Backbone, _, Farm, user_list_item ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var CustomerList = Backbone.View.extend( {
                el: $( "#listviewholder" ),

								events: {
									"click li": "showUserPage"
								},

                initialize: function() {
                    this.collection = FarmTab.current_farm || new Farm; // NUR FOR TEST. TODO get rid of this by making login work
                    _.bindAll(this, "renderList");
                    this.collection.bind( "reset", this.renderList );
                },

                renderList: function() {

                    var compiled_template = _.template( user_list_item ),
                        collection = this.collection,
                        $el = $(this.el);

                    FarmTab.utils.loadPrompt( "Loading results..." );
                    FarmTab.utils.toggleNavigation( true );
                    $el.html( compiled_template( { results: collection.models } ) );

                    setTimeout( function() {
                       $el.listview('refresh');
                    }, 0 );

                },

								showUserPage: function(el) {
									if (!FarmTab.current_farm.id)
										FarmTab.current_farm.fetch();
									FarmTab.views.appview.setView( 'info', el.target.id );
									FarmTab.utils.changePage( "#user", "slide", false, false );
									FarmTab.utils.switchTitle( FarmTab.current_farm.get(el.target.id).get('name') );
								}
            } );

            return CustomerList;
        });
