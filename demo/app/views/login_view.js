define( ['jquery', 'backbone', 'underscore', 'models/Farmer'],
        function( $, Backbone, _ , Farmer) {

      var LoginView = Backbone.View.extend({
        $el: "#login_form",

        events: {
          "click #login":     "performLogin",
        },

        initialize: function(){
          this.email       = $("#email");
          this.password    = $("#password");
          this.loginButton = $("#login");
        },

        performLogin: function(){
          FarmTab.utils.dfdQuery( 'login', this, null, { email: this.email, password: this.password } );
          return false;
        }
      });

} );
