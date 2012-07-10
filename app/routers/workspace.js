define( ['jquery', 'backbone'],
        function( $, Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var Workspace = Backbone.Router.extend( {
                routes: {
                    "customers":                   "customers",     // #customers
                    "customers/:id":               "info",          // #customers/931
                    "login":                       "farmer_login",  // #login
                    "transaction/:id":             "transaction",   // #transaction/458
                    "transaction/:id/confirm":     "pinrequest",    // #transaction/458/confirm
                    "register":                    "register",      // #register
                    "":                            "root"           // main page
                },
                customers: function() {
									FarmTab.current_farm.fetch();
									FarmTab.views.appview.setView( 'userlist' );
									FarmTab.utils.changePage( "#listviewusers", "slide", false, false );
									FarmTab.utils.switchTitle( FarmTab.current_farm.name );
                },
                transaction: function( id ) {
                    FarmTab.utils.dfdQuery( 'transaction', FarmTab.views.appview, id );
                },
                farmer_login: function() {
                    FarmTab.utils.changePage( "#farmer_login", "slide", false, false );
                    new LoginView({model: new Farmer()});
                },
                farmer_logout: function() {
                    FarmTab.utils.do_logout();
                },
                pinrequest: function ( id ) {
                    console.log('requesting pin for ' + id);
                    FarmTab.utils.dfdQuery( 'pinrequest',  FarmTab.views.appview, id )
                },
                info: function ( id ) {
                  //FarmTab.utils.dfdQuery( 'info', FarmTab.views.appview, id );

									if (!FarmTab.current_farm.id)
										FarmTab.current_farm.fetch();
									FarmTab.views.appview.setView( 'userlist' );
									FarmTab.utils.changePage( "#user", "slide", false, false );
									FarmTab.utils.switchTitle( FarmTab.current_farm.get(id).get('name') );
                },
                register: function ( id ) {
                    FarmTab.utils.dfdQuery( 'register', FarmTab.views.appview, id );
                },
                root: function() {
                    FarmTab.utils.changePage( "#index", "slide", false, false );
                }
            } );

            return Workspace;
        } );
