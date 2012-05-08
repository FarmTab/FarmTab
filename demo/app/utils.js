define( ['jquery', 'underscore', 'backbone' ],
        function( $, _, Backbone ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            //"use strict";
            var utils = {};


            // summary:
            //            Manage passing search queries to the necessary handlers and the UI
            //            changes that are required based on query-type.
            // searchType: String
            //            The type of search to conduct. Supports 'search' for results or
            //            'photo' for individual photo entries
            // ctx: String
            //            The context (view) for which the requests are being made
            // id: Integer
            //            The id associated with the record (if applicable)
            // transaction: String
            //            A JSON-formatted transaction string (if applicable)

            utils.dfdQuery = function( searchType, ctx, id, transaction ) {

              var entries = null;
  
              utils.loadPrompt( 'Fetching information...' );
  
              $.when( utils.fetchResults( searchType, id, transaction ) )
                  .then( $.proxy( function( response ) {
  
                      ctx.setView( searchType );
    
                      if ( searchType == 'userlist' || searchType == undefined ) {
  
                          users = response.data;
                          
                          ctx.result_view.collection.reset( users );
  
                          // switch to search results view
                          utils.changePage( "#listviewusers", "slide", false, false );
  
                          // update title
                          utils.switchTitle( query + ' (Page ' + page + ' of ' + response.photos.total + ')' );
  
                      }
                      else {
  
                          entries = response.photo;
                          ctx.farm_view.collection.reset( entries );
  
                          // switch to the individual photo viewer
                          utils.changePage( "#photo", "slide", false, false );
                           
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
            //            Query for search results or individual photos from the Flickr API
            // searchType: String
            //            The type of search to conduct. All of the Farmtab API type
            //            modes are supported here (maps to backend.php GET['type'] param)
            // id: Integer
            //            The id associated with the record (if applicable)
            // transaction: String
            //            A JSON-formatted transaction string (if applicable)
            // returns:
            //            A promise for the ajax call to be completed

            utils.fetchResults = function( searchType, id, transaction ) {

                var serviceUrl =  "http://farmtab.com/API/backend.php?api_key=124df26asdf";
                    serviceUrl += "&type=" + searchType;
                     
               	if ( searchType == 'transaction' ) {
                    serviceUrl +=  "&userId=" + id + "&transaction=" + encodeURIComponent(transaction);
                } else if (searchType == 'linkuser') {
                    serviceUrl +=  "&userId=" + id;
                }

                return $.getJSON( serviceUrl, { "transaction": transaction} );
            };


            // summary:
            //            Format dates so that they're compatible with input passed through
            //            the datepicker component
            // date: String
            //            The date string to be formatted
            // returns:
            //            A formatted date
            utils.dateFormatter = function ( dateStr ) {
                return (dateStr == undefined)? '' : $.datepicker.formatDate( '@', new Date( dateStr ) );
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

                (mobileSearch.routers.workspace.q == undefined) ? hashQuery = '' : hashQuery = mobileSearch.routers.workspace.q;
                (mobileSearch.routers.workspace.p == undefined) ? pageQuery = 1 : pageQuery = mobileSearch.routers.workspace.p;
                (mobileSearch.routers.workspace.s == undefined) ? sortQuery = 'relevance' : sortQuery = mobileSearch.routers.workspace.s;

                pageQuery = parseInt( pageQuery );
                (state == 'next') ? pageQuery += 1 : pageQuery -= 1;

                (pageQuery < 1) ? utils.changePage( "/", "slide" ) : location.hash = utils.queryConstructor( hashQuery, sortQuery, pageQuery );

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
            //            Construct a search query for processing
            //
            // query: String
            //            The query-string to lookup. For search this is a keyword or set of
            //            keywords in string form, for photos this refers to the photo ID
            // sortType: String
            //            How the results returned should be sorted. All of the Farmtab API sort
            //            modes are supported here
            // id: Integer
            //            The id associated with the record (if applicable)

            utils.queryConstructor = function( query, sortType, id, transaction ) {
                return 'search/' + query + '/s' + sortType + '/p' + page;
            };


            // summary:
            //            Toggle whether the navigation is displayed or hidden
            //
            // toggleState: Boolean
            //            A boolean that decides whether the navigation should be toggled on or off.

            utils.toggleNavigation = function( toggleState ) {
                mobileSearch.ui.nextOption.toggle( toggleState );
                mobileSearch.ui.prevOption.toggle( toggleState );
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
			    this.attributes = _.clone(model.attributes);
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
			
			    this.addError = function(field, message) {
			      if (_.isUndefined(this.errors[field])) {
			        this.errors[field] = [];
			      }
			      this.errors[field].push(message);
			    };
			
			    return this.errors;
			  })();
			};

            return utils;
        } );



