define( ['jquery', 'backbone'],
        function( $, Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Workspace = Backbone.Router.extend( {
                routes: {
                	  "customers":					         "customers",     // #customers
                    "transaction/:id":             "transaction",   // #transaction/458
                    "transaction/:id/confirm":     "pinrequest",    // #transaction/458/confirm
                    "customers/:id":               "info",          // #customers/931
                    "":								             "root"           // main page
                },
                customers: function() {
                	  FarmTab.utils.dfdQuery( 'userlist', FarmTab.views.appview);
                },
                transaction: function( id ) {
                    FarmTab.utils.dfdQuery( 'transaction', FarmTab.views.appview, id );
                },
                pinrequest: function ( id ) {
                  	console.log('requesting pin for ' + id);
                  	FarmTab.utils.dfdQuery( 'pinrequest',  FarmTab.views.appview, id )
                },
                info: function ( id ) {
                    FarmTab.utils.dfdQuery( 'info', FarmTab.views.appview, id );
                },
                root: function() {
                    FarmTab.utils.changePage( "#index", "slide", false, false );
                }
            } );

            return Workspace;
        } );
