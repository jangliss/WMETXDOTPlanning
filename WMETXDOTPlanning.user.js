// ==UserScript==
// @name         WME TX DOT Planning
// @namespace    https://github.com/jangliss/WMETXDOTPlanning/blob/master/WMETXDOTPlanning.user.js
// @version      0.0.10
// @description  Redirect WME location to TXDOT FC Map
// @author       Jonathan Angliss
// @include      https://www.txdot.gov/*
// @include      https://txdot.gov/*
// @include      https://js.arcgis.com/*
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// ==/UserScript==

/*
  == ChangeLog ==
  0.0.10 - Updates for new TXDOT FC Map
  0.0.9 - Call new init not old one.
  0.0.8 - Fixing Waze changes.
  0.0.7 - Fix for Waze object changes
  0.0.6 - Fix URLs as TXDOT has moved to https
  0.0.5 - Fix for missing / in the editor URLs
  0.0.4 - Adjust code to handle new localizations options in URL.
  0.0.3 - Move to www.txdot.gov
        - Add code to check for map loading instead of depending on timer (handles slower connections)
  0.0.2 - Use timer after code change on txdot.gov
  0.0.1 - Initial build.

*/

// debugger;

function TXDOTP_WME_Init() {
    var location = $('div.location-info-region');
    if  (location.length === 0) {
        setTimeout(TXDOTP_WME_Init, 1000);
        return;
    }
    location.after('<div class="btn-group btn-group-sm" style="float:left; margin-left:1rem;"><a id="txdot_planning" class="btn btn-default" style="border:1px solid" target="_blank" href="#">TXDOT</a></div>');
    var outURL = 'https://www.txdot.gov/apps/statewide_mapping/StatewidePlanningMap.html?location=<lat>,<lon>,<zoom>&overlays=Functional%20Classification%20%26%20Urban%20Areas';
    var center = W.map.getOLMap().getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
    var mZoom = W.map.getZoom();
    mZoom = (mZoom < 4 ? mZoom + 12 : 15);
    $('#txdot_planning').prop('href', outURL.replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>', mZoom));


    W.map.events.register('moveend', null, function() {
        var outURL = 'https://www.txdot.gov/apps/statewide_mapping/StatewidePlanningMap.html?location=<lat>,<lon>,<zoom>&overlays=Functional%20Classification%20%26%20Urban%20Areas';
        var center = W.map.getOLMap().getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
        var mZoom = W.map.getZoom();
        mZoom = (mZoom < 4 ? mZoom + 12 : 15);
        $('#txdot_planning').prop('href', outURL.replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>', mZoom));
    });
}


function TXDOTP_Init() {

    var mURL = window.location.href;

    if (mURL.includes("waze.com")) {
        if (W?.userscripts?.state.isReady) {
            TXDOTP_WME_Init();
        } else {
            document.addEventListener('wme-ready', TXDOTP_WME_Init, { once: true });
        }        
    }
}

TXDOTP_Init();