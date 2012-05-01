define( ['jquery', 'backbone'],
        function( $, Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Workspace = Backbone.Router.extend( {
                routes: {
                	"customers":					           "customers",     // #customers
                    "transaction/:id":             "transaction",   // #transaction/458
                    "transaction/:id/confirm":     "pinrequest",    // #transaction/458/confirm
                    "customers/:id":               "info",          // #customers/931
                    "":								             "root"           // main page
                },
                customers: function() {
                	mobileSearch.utils.dfdQuery( 'customers', mobileSearch.views.appview);
                },
                transaction: function( id ) {
                    mobileSearch.utils.dfdQuery( 'transaction', mobileSearch.views.appview, id );
                },
                pinrequest: function ( id ) {
                	alert('requesting pin for ' + id);
                	mobileSearch.utils.dfdQuery( 'pinrequest',  mobileSearch.views.appview, id )
                },
                info: function ( id ) {
                    mobileSearch.utils.dfdQuery( 'info', mobileSearch.views.appview, id );
                },
                root: function() {
                    mobileSearch.utils.changePage( "#index", "slide", false, false );
                }
            } );

            return Workspace;
        } );
