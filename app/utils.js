define( ['jquery', 'underscore', 'backbone', 'views/user_page', 'models/Farm' ],
        function( $, _, Backbone, UserPage, Farm ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            //"use strict";
            var utils = {};


            // summary:
            //            Manage passing search queries to the necessary handlers and the UI
            //            changes that are required based on query-type.
            // queryType: String
            //            The type of query to conduct. Supports 'search' for results or
            //            'photo' for individual photo entries
            // ctx: String
            //            The context (view) for which the requests are being made
            // id: Integer
            //            The id associated with the record (if applicable)
            // payload: Object
            //            A JSON-object (if applicable) to send as POSTDATA. Defaults to an empty object

            utils.dfdQuery = function( queryType, ctx, id, payload ) {

              payload = payload || {};
              var entries = null;
  
              utils.loadPrompt( 'Fetching information...' );

              if (queryType == 'info') {
                utils.changePage( "#user", "slide", false, false );
                new UserPage({ model : utils.getCustomer(id) });
                return false;
              }


              if (queryType == "" || queryType == undefined ) queryType = 'userlist';
  
              $.when( utils.fetchResults( queryType, id, payload ) )
                  .then( $.proxy( function( response ) {
                  
                      ctx.setView( queryType );
    
                      if ( queryType == 'login') {
                          FarmTab.current_farmer = new Farmer(response.data);
                      }
                      else if ( queryType == 'userlist' ) {
  
                          users = response.data.users;
                          
                          FarmTab.current_farm.reset( users );
                          ctx.customer_list_view.collection = FarmTab.current_farm;
  
                          // switch to search results view
                          utils.changePage( "#listviewusers", "slide", false, false );
  
                          // update title
                          utils.switchTitle( FarmTab.current_farmer.get("name") );
                      }
                      else if (queryType == 'userinfo') {
                        utils.changePage( "#user", "slide", false, false );
                        new UserPage({ model : new Customer(response.user) });
                      }
  
              }, ctx ) );
            };


            // summary:
            //            A convenience method for accessing $mobile.changePage(), included
            //            in case any other actions are required in the same step.
            // changeTo: String
            //            Absolute or relative URL. In this app references to '#index', '#search' etc.
            // effect: String
            //            One of the supported jQuery mobile transition effects
            // direction: Boolean
            //            Decides the direction the transition will run when showing the page
            // updateHash: Boolean
            //            Decides if the hash in the location bar should be updated

            utils.changePage = function( viewID, effect, direction, updateHash ) {
                $.mobile.changePage( viewID, { transition: effect, reverse:direction, changeHash: updateHash} );
            };


            // summary:
            //            Call the logout route of the API, destroys the session on the server-side

            utils.doLogout = function() {
              $.get("API/backend.php?type=logout", function() {
                FarmTab.utils.changePage( "#index", "slide", false, false );
              });
            }


            // summary:
            //           check pin for user

            utils.checkPin = function( user_id, test_pin ) {
              console.log("requesting pin for " + user_id);

              $.post("API/backend.php?type=validate", function(response) {
                return response.status == "success";
              });
            }


            // summary:
            //            Query for search results or individual photos from the Farmtab API
            // queryType: String
            //            The type of query to conduct. All of the Farmtab API type
            //            modes are supported here (maps to backend.php GET['type'] param)
            // id: Integer
            //            The id associated with the record (if applicable)
            // payload: Object
            //            A JSON-object (if applicable) to send as POSTDATA
            // returns:
            //            A promise for the ajax call to be completed

            utils.fetchResults = function( queryType, id, payload ) {

                var serviceUrl =  "http://farmtab.com/API/backend.php?";
                    serviceUrl += "&type=" + queryType;
                     
               	if ( queryType == 'transaction' || queryType == 'linkuser') {
                    serviceUrl +=  "&userId=" + id;
                }

                return $.getJSON( serviceUrl, payload );
            };

            // summary:
            //            Manage the URL construction and navigation for pagination
            //            (e.g next/prev)
            //
            // state: String
            //            The direction in which to navigate (either 'next' or 'prev')

            utils.historySwitch = function( state ) {
                var sortQuery,
                    hashQuery = "", pageQuery = 0, increment = 0;

                (FarmTab.routers.workspace.q == undefined) ? hashQuery = '' : hashQuery = FarmTab.routers.workspace.q;
                (FarmTab.routers.workspace.p == undefined) ? pageQuery = 1 : pageQuery = FarmTab.routers.workspace.p;
                (FarmTab.routers.workspace.s == undefined) ? sortQuery = 'relevance' : sortQuery = FarmTab.routers.workspace.s;

                pageQuery = parseInt( pageQuery );
                (state == 'next') ? pageQuery += 1 : pageQuery -= 1;

            };


            // summary:
            //            Display a custom notification using the loader extracted from jQuery mobile.
            //            The only reason this is here is for further customization.
            //
            // message: String
            //            The message to display in the notification dialog

            utils.loadPrompt = function( message ) {
                message = (message == undefined) ? "" : message;

                $( "<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + message + "</h1></div>" )
                .css( { "display": "block", "opacity": 0.96, "top": $( window ).scrollTop() + 100 } )
                .appendTo( $.mobile.pageContainer )
                .delay( 800 )
                .fadeOut( 400, function() {
                    $( this ).remove();
                } );
                
            };


            // summary:
            //            Adjust the title of the current view
            //
            // title: String
            //            The title to update the view with
            utils.switchTitle = function( title ) {
                $( '.ui-title' ).text( title || "" );
            };


            // summary:
            //            Toggle whether the navigation is displayed or hidden
            //
            // toggleState: Boolean
            //            A boolean that decides whether the navigation should be toggled on or off.

            utils.toggleNavigation = function( toggleState ) {
                FarmTab.ui.nextOption.toggle( toggleState );
                FarmTab.ui.prevOption.toggle( toggleState );
            };
            
            
            // summary:
            //            Validate attributes of a model using Underscore
            //            based on Backbone Validators by Gary Rennie
            //              https://github.com/Gazler/backbone_validators
            //
            // model: Backbone.model
            //            The Backbone model to validate
            // changedAttributes: Array
            //            The attributes of the model that have changed
            
            Backbone.Validate = function(model, changedAttributes) {
  
			  return (function() {
			    this.errors = {};
	/*		    this.attributes = _.clone(model.attributes);
			    _.extend(this.attributes, changedAttributes);
			    _.each(model.validates, function(value, rule) {
			      this.validators[rule](value);
			    });
			
			    this.validators = {
			      required: function(fields) {
			       _.each(fields, function(field) {
			          if(_.isEmpty(this.attributes[field]) === true) {
			            this.addError(field, I18n.t('errors.form.required'));
			          }
			        });
			      }
			    };
/// not ready for primetime		
			    this.addError = function(field, message) {
			      if (_.isUndefined(this.errors[field])) {
			        this.errors[field] = [];
			      }
			      this.errors[field].push(message);
			    };
	*/		
			    return this.errors;
			  })();
			};

            return utils;
        } );



