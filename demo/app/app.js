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
define( ['backbone', 'views/appview', 'routers/workspace', 'utils', 'ui'],
        function( Backbone, AppView, Workspace, utils, ui ) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";
           
           $(function(){
            
            window.FarmTab = window.FarmTab || {
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


            window.Farmtab.utils.toggleNavigation( false );
            Backbone.history.start();
        });

        } );
