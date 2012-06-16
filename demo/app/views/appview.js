define( ['jquery', 'backbone', 'utils', 'views/customer_list', 'views/user_page'],
        function( $, Backbone, utils, CustomerList, UserPage ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";


            var AppView = Backbone.View.extend( {
                el: $( "#appview" ),

                setView: function( option ) {
                    switch(option) {
                      case 'userlist':
                        this.customer_list_view = new CustomerList;
                        break;
                      case 'info':
                        this.user_view = new UserPage;
                        break;
                      default:
                        console.error("should never reach this: " + option);
                    }
                }
            } );

            return AppView;
        } );





