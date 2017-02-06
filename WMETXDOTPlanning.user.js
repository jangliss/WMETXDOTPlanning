// ==UserScript==
// @name         WME TX DOT Planning
// @namespace    https://github.com/jangliss/WMETXDOTPlanning/blob/master/WMETXDOTPlanning.user.js
// @version      0.0.1
// @description  Redirect WME location to TXDOT FC Map
// @author       Jonathan Angliss
// @match        http://www.txdot.gov/*
// @match        http://txdot.gov/*
// @match        http://js.arcgis.com/*
// @match        https://www.waze.com/editor/*
// @include      http://www.txdot.gov/*
// @include      http://txdot.gov/*
// @include      http://js.arcgis.com/*
// @include      https://www.waze.com/editor/*
// @grant        none
// ==/UserScript==
debugger;


function TXDot_Init () {
    'use strict';

    var mURL = window.location.href;

    if (~mURL.toLowerCase().indexOf("txdot")) {
        window.addEventListener('load', function() {
            var re = /\?wmeloc=([-]?[\d\.]+,[-]?[\d\.]+,\d+)/i;
            var res = re.exec(mURL);
            if (res.length === 2) {
                var wmeArgs = res[1];
                document.getElementById("Functional_Classification").click();
                document.getElementById("tcLegend").click();

                require(
                    ["esri/geometry/Point",
                     "esri/SpatialReference",
                     "esri/geometry/webMercatorUtils"], function( Point, SpatialReference, webMercatorUtils) {
                         var paramsList = wmeArgs.split(',');
                         var theX = paramsList[0];
                         var theY = paramsList[1];
                         var theZ = paramsList[2];
                         var thePt = Point(theX,theY, new SpatialReference({ wkid: 4269 }));
                         map.centerAndZoom(webMercatorUtils.geographicToWebMercator(thePt),theZ);
                     });

            }
        }, true);
    }
    else if (~mURL.toLowerCase().indexOf('waze.com/editor')) {
        var location = $('div.location-info-region');
        if  (location.length === 0) {
            setTimeout(TXDot_Init, 1000);
            return;
        }
        location.after('<div class="btn-group btn-group-sm" style="float:left; margin-left:1rem;"><a id="txdot_planning" class="btn btn-default" style="border:1px solid" target="_blank" href="#">TXDOT</a></div>');

        W.map.events.register('moveend', null, function() {
            var outURL = 'http://txdot.gov/apps/statewide_mapping/StatewidePlanningMap.html?wmeloc=<lon>,<lat>,<zoom>';
            var center = W.map.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            var mZoom = Waze.map.zoom;
            mZoom = (mZoom < 4 ? mZoom + 12 : 15);
            $('#txdot_planning').prop('href', outURL.replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>', mZoom));
        });
    }
}

TXDot_Init();