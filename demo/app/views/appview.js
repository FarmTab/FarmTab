define( ['jquery', 'backbone', 'utils', 'views/customer_list', 'views/user_page'],
        function( $, Backbone, utils, CustomerList, UserPage ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";


            var AppView = Backbone.View.extend( {
                el: $( "#appview" ),

                setView: function( option ) {
                    if ( option == 'search' ) {
                        this.result_view = new CustomerList;
                    }
                    else {
                        this.user_view = new UserPage;
                    }
                }
            } );

            return AppView;
        } );





