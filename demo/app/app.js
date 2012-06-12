/*!
 * FarmTab - A mobile tab system
 * 
 * Uses modified backbone.js for correct jQuery Mobile routing
 * Copyright (c) 2011 Addy Osmani http://addyosmani.com
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 * by Adam Krebs
 * Spring 2012
 *
 */
define( ['backbone', 'views/appview', 'routers/workspace', 'models/Farmer', 'models/Farm', 'utils', 'ui'],
        function( Backbone, AppView, Workspace, Farmer, Farm, utils, ui ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";
           
           $(function(){
            
            window.FarmTab = window.FarmTab || {
                current_farmer: null,
                mobile_api_key: "124df26asdf",
                views: {
                    appview: new AppView
                },
                routers:{
                    workspace:new Workspace()
                },
                utils: utils,
                ui: ui,
                defaults:{
                    resultsPerPage: 32
                }
            }

            // DEBUG:::
            console.log("time to make the dougnuts");
            window.FarmTab.current_farmer = window.FarmTab.current_farmer || new Farmer({id: 2, name: "Johnny K"});
            window.FarmTab.current_farm   = window.FarmTab.current_farm   || new Farm;
            // /debug
            window.FarmTab.utils.toggleNavigation( false );
            Backbone.history.start();
        });

        } );
