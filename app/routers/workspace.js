define( ['jquery', 'backbone'],
        function( $, Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";

            var __slice = [].slice;

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
                },
                _register_broadcaster_event_handlers: function() {
                    destinations = ["recipes:show", "favorites:show", "favorites:index", "daily:show", "links:show", "scenes:show", "bios:show"]
                    for (var i=0; i < destinations.length; i++) {
                      this._register(destinations[i]);
                    }
                },
                _register: function(destination) {
                    FarmTab.Broadcaster.bind("navigate:" + destination, function(/* event, other... */){
                      var event, other;
                      event = arguments[0], other = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                      this.navigate_to(destination, other);
                    });
                },

                  navigate_to: function() {
                    var action, destination, go_back_to_index, id, matches, other, section, _ref;
                    destination = arguments[0], other = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    _ref = destination.split(":"), section = _ref[0], action = _ref[1];
                    destination = "" + section + "_" + action;
                    this["build_" + destination + "_view"].apply(this, other);
                    if (destination !== this._active_destination()) {
                      matches = this.matching_destinations(destination);
                      if (matches.length > 0) {
                        go_back_to_index = this.destinations_stack.indexOf(matches[0]);
                      }
                      if (go_back_to_index >= 0) {
                        this.insert_and_animate_views(this[this._active_destination()], this[destination], true);
                        return this.destinations_stack = this.destinations_stack.slice(0, go_back_to_index + 1 || 9e9);
                      } else {
                        this.insert_and_animate_views(this[this._active_destination()], this[destination], false);
                        id = other.length > 0 ? other[0].id : null;
                        return this.destinations_stack.push([section, action, id]);
                      }
                    }
                  }


            } );

            return Workspace;
        } );
