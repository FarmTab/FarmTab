require.config( {
    paths: {
        'backbone':         'libs/AMDbackbone-0.5.3',
        'underscore':       'libs/underscore-1.2.2',
        'text':             'libs/require/text',
        'jquery':           'libs/jquery-1.7.1',
        'json2':            'libs/json2',
        'jquerymobile':     'libs/jquery.mobile-1.0'
    },
    baseUrl: 'app'
} );

require(
        ['require', 'underscore', 'backbone', 'jquery'],
        function( require, _, Backbone, $ ) {
            // framework loaded
            require(
                    ['require', 'jquerymobile', 'json2', 'app'],
                    function( require ) {
                        
                         // Global overrides to disable hashchange listening
                         // (as opposed to using urlHistory.listeningEnabled)
                         // This makes it easier to focus on using Backbone's own
                         // routing:
                    
                        $.mobile.hashListeningEnabled = false;
                        $.mobile.pushStateEnabled = false;
                        $.mobile.orientationChangeEnabled = false;

                        document.cookie = "api_key=" + FarmTab.mobile_api_key
                              + "; path=/; domain=.farmtab.com; "
                              + document.cookie;
                    } );
        } );
