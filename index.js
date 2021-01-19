var selectedQ = undefined;
var QnbrGeojson = {
    'type': 'FeatureCollection',
    'features': [
    ]
};
var wikipediaGeojson = {
    'type': 'FeatureCollection',
    'features': [
        //     { 
        //     "type": "Feature",
        //     "properties": {}, 
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [0, 0]
        //     }
        // }
    ]
};
var resultsFromQuery = [];
var allQnbrs = [];
var ResultsObject = {};
var results; // results form commons.wikimedia img search from category
var imgSlideIndex = 1;
var mapIsActive = false;

var ajaxQueue = new Array();


mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fza2VzIiwiYSI6ImNqYW1tNGdwdjN3MW8yeWp1cWNsaXZveDYifQ.MNpL7SYvoVgR4s_4ma5iyg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/caskes/ckfe8z5vq028519ovap041fj6', // stylesheet location
    center: [2.32008, 48.85578], // starting position [lng, lat]
    zoom: 15,
    hash: true
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

document.getElementById('geocoderWelcome').appendChild(geocoder.onAdd(map))

// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


// Zoom and rotation constroles.
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// Fullscreen constroles.
map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

// location search


var geocoder2 = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

document.getElementById('geocoderMap').appendChild(geocoder2.onAdd(map))



// Add geolocate control to the map.
// map.addControl(
//     new mapboxgl.GeolocateControl({
//         positionOptions: {
//             enableHighAccuracy: true
//         },
//         trackUserLocation: true
//     })
// );

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}


$(".startButton").click(
    hideWelcomCoverPage
);
// $("#coverContainer").click(
//     hideWelcomCoverPage
// );

function hideWelcomCoverPage() {
    $(".WelcomeDiv").toggleClass("transparent");
    $("#coverContainer").toggleClass("transparent");
    runQuery();


    setTimeout(function () {
        $(".WelcomeDiv").hide();
        $("#coverContainer").hide();
    }, 500);
}

var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

function buildAllVisibleItems() {

    // var features = map.queryRenderedFeatures({ layers: ['QnbrLayer'] });

    // console.log(features);
    // console.log(QnbrDone);
}

function flyTo(lon, lat, zoom) {
    if (zoom === undefined) { zoom = 14 };
    map.flyTo({
        center: [
            lon,
            lat
        ],
        zoom: zoom,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
};

map.on('load', function () {
    mapIsActive = true;

    // create data sources for layers to use
    map.addSource('QnbrSource', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
            ]
        }
    });

    map.addSource('wikipediaSource', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
            ]
        }
    });

    // add images to map for usage in map layers as icons
    map.loadImage(
        'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/architecture_small.png',
        function (error, image) {
            if (error) throw error;
            map.addImage('archi', image);
            map.loadImage(
                'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/event.png',
                function (error, image) {
                    if (error) throw error;
                    map.addImage('event', image);
                    map.loadImage(
                        'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/other.png',
                        function (error, image) {
                            if (error) throw error;
                            map.addImage('other', image);
                            addLayerWithIcons() // All images are now loaded, add layer that uses the images
                        }
                    );
                }
            );
        }
    );

    // add layers to bring data sources to map
    map.addLayer({ // wikipediaLayer
        "id": "wikipediaLayer",
        "type": "circle",
        "source": "wikipediaSource",
        "layout": {},
        "paint": {
            'circle-radius': {
                stops: [[8, 2], [11, 8], [16, 20]]
            },
            'circle-color': '#000000',
            'circle-opacity': 1,
        }
    });


    function addLayerWithIcons() { // this function is called when icons are ready
        map.addLayer({
            "id": "QnbrLayerIcon",
            "type": "symbol",
            "source": "QnbrSource",
            // "source-layer": "gp_registered_patients",
            // "filter": ["in", "stack", "two","three","five","nine","one"],
            // "minzoom": 11,
            // "interactive": true,
            "layout": {
                // "icon-offset": [14,-154],
                "icon-image": [
                    "match",
                    ["get", "cat"],
                    ["Architectural"],
                    "archi",
                    ["Event"],
                    "event",
                    "other"
                ],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                "icon-padding": 0,
                "icon-size": 0.6,
            },
        });
    }

    // hover popup
    map.on('mousemove', 'QnbrLayerIcon', function (e) {
        var hoverdQID = e.features[0].properties.Qnbr;
        if (ResultsObject[hoverdQID].imgthum != undefined) {
            var html = '<img src="' + ResultsObject[hoverdQID].imgthum + '" alt="' + ResultsObject[hoverdQID].label + '" class="popupImg">';
            popup
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);

            map.getCanvas().style.cursor = 'pointer';
        } else {
            var html = '<p class="popupText">No image</p>';
        }
        // console.log(e);
    });
    map.on('mouseleave', 'QnbrLayerIcon', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // click
    map.on('click', function (e) { //cancel selection
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        selectNew(undefined);
    });
    map.on('click', 'QnbrLayerIcon', function (e) { // select point and open "window"
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        selectNew(e.features[0].properties.Qnbr);
    });

    map.on('click', 'wikipediaLayer', function (e) { // select point and open "window"
        window.open(e.features[0].properties.url);
    });

    // Map panning ends
    map.on('moveend', function () {
        runQuery();
        wikipdiaAPIrequest();
    });
});


// runQuery();
function runQuery() {
    let canvas = map.getCanvas()
    let w = canvas.width
    let h = canvas.height
    let cUL = map.unproject([0, 0]).toArray()
    let cLR = map.unproject([w, h]).toArray()


    // the function that process the query
    function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
        var settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };
        return $.ajax(endpointUrl, settings).then(doneCallback);
    }

    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "#defaultView:ImageGride\n" +
            "SELECT\n" +
            "  ?item ?itemLabel ?itemDescription\n" +
            "  ?geo ?img ?categorie ?wikiMediaCategory\n" +
            "  (GROUP_CONCAT(?instanceLabel; SEPARATOR = \", \") AS ?instancesof) # a nices String with the labels of the different instances of related to the item\n" +
            "WITH\n" +
            "{\n" +
            "  SELECT \n" +
            "    ?item \n" +
            "    (SAMPLE(?geo_) AS ?geo) # The SAMPLE code is needed to inform the GROUP BY code what to do when there are more than one.\n" +
            "    (SAMPLE(?img_) AS ?img)\n" +
            "  WHERE\n" +
            "  {\n" +
            "    #### Selection based on location ####   \n" +
            "    SERVICE wikibase:box\n" +
            "    {\n" +
            "      ?item wdt:P625 ?geo_.\n" +
            "      bd:serviceParam wikibase:cornerWest \"Point(" + cUL[0] + " " + cUL[1] + ")\"^^geo:wktLiteral. \n" +
            "      bd:serviceParam wikibase:cornerEast \"Point(" + cLR[0] + " " + cLR[1] + ")\"^^geo:wktLiteral.\n" +
            "    }\n" +
            "\n" +
            "    MINUS { ?item (wdt:P31/(wdt:P279*)) wd:Q376799. } # Remove everything related to roads\n" +
            "    ?item wdt:P18 ?img_. # Only keep items with pictures\n" +
            "  }\n" +
            "  GROUP BY ?item\n" +
            "} AS %get_items\n" +
            "WHERE\n" +
            "{\n" +
            "  INCLUDE %get_items\n" +
            "\n" +
            "  #### Categorise items ####\n" +
            "  BIND(\n" +
            "    IF(EXISTS {?item (wdt:P31/(wdt:P279*)) wd:Q811979},\n" +
            "       \"Architectural\",\n" +
            "       IF(EXISTS {?item (wdt:P31/(wdt:P279*)) wd:Q1656682},\n" +
            "          \"Event\",\n" +
            "          \"Other\"\n" +
            "         )\n" +
            "      )\n" +
            "  AS ?categorie)\n" +
            "  \n" +
            "  OPTIONAL { ?item wdt:P31 ?instance. } # Get instances\n" +
            "   \n" +
            "  OPTIONAL { ?item wdt:P373 ?wikiMediaCategory. }\n" +
            "   \n" +
            "  #### Wikipedia link ####\n" +
            "  OPTIONAL {\n" +
            "    ?article schema:about ?item . # Get wikipedia link\n" +
            "    ?article schema:isPartOf <https://en.wikipedia.org/>. # Only keep EN language\n" +
            "  }\n" +
            "  \n" +
            "  #### Labels & discription #### \n" +
            "  SERVICE wikibase:label { # Get labels\n" +
            "    bd:serviceParam wikibase:language \"en\". \n" +
            "    ?instance rdfs:label ?instanceLabel.      # The specification of the variables to be labeld is needed for grouping the instances of correctly\n" +
            "    ?item rdfs:label ?itemLabel.\n" +
            "    ?item schema:description ?itemDescription.\n" +
            "  }\n" +
            "}\n" +
            "GROUP BY ?item ?itemLabel ?itemDescription ?geo ?img ?categorie ?article ?wikiMediaCategory";


    makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
        // $( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
        // console.log( data );
        processQueryResults(data);
    }
    );
}

function processQueryResults(data) {
    //remove duplicates

    resultsFromQuery = [];//empties result array
    for (d in data.results.bindings) {
        var result = {};
        result.qnumber = qnumberExtraction(data.results.bindings[d].item.value);
        result.qnumberURL = data.results.bindings[d].item.value;
        if (data.results.bindings[d].article != undefined) { result.wikipedia = data.results.bindings[d].article.value; }
        if (data.results.bindings[d].geo != undefined) { result.geo = extractLngLat(data.results.bindings[d].geo.value); }
        if (data.results.bindings[d].img != undefined) { result.img = data.results.bindings[d].img.value; }
        if (data.results.bindings[d].img != undefined) { result.imgthum = data.results.bindings[d].img.value + "?width=600px"; }
        if (data.results.bindings[d].wikiMediaCategory != undefined) { result.commons = data.results.bindings[d].wikiMediaCategory.value; }
        if (data.results.bindings[d].wikiMediaCategory != undefined) { result.commonsurl = "https://commons.wikimedia.org/wiki/Category:" + encodeURIComponent(data.results.bindings[d].wikiMediaCategory.value); }
        if (data.results.bindings[d].itemLabel != undefined) { result.label = data.results.bindings[d].itemLabel.value; }
        if (data.results.bindings[d].itemDescription != undefined) { result.description = data.results.bindings[d].itemDescription.value; }
        if (data.results.bindings[d].instancesof != undefined) { result.instanceof = data.results.bindings[d].instancesof.value; }
        if (data.results.bindings[d].categorie != undefined) { result.categorie = data.results.bindings[d].categorie.value; }

        // resultsFromQuery.push(result);//pushes every result into the array
        ResultsObject[result.qnumber] = result;
        // buildResultsObject(result);
    }
    allQnbrs = Object.keys(ResultsObject);


    console.log(ResultsObject);
    // console.log(resultsFromQuery);
    console.log("@1");
    buildGeojsonFromQueryResults();
}

// Helper - organising query results to a usefull object
function buildResultsObject(result) {
    var Q = result.qnumber;
    if (ResultsObject[Q] != undefined) {
        if (ResultsObject[Q].wikipedia != results.wikipedia) {
            ResultsObject[Q].wikipedia = "";
        };
        if (ResultsObject[Q].geo != results.geo) {
            ResultsObject[Q].geo = "";
        };
        if (ResultsObject[Q].img != results.img) {
            ResultsObject[Q].img = "";
        };
        if (ResultsObject[Q].imgthum != results.imgthum) {
            ResultsObject[Q].imgthum = "";
        };
        if (ResultsObject[Q].commons != results.commons) {
            ResultsObject[Q].commons = "";
        };
        if (ResultsObject[Q].label != results.label) {
            ResultsObject[Q].label = "";
        };
        if (ResultsObject[Q].description != results.description) {
            ResultsObject[Q].description = "";
        };
        if (ResultsObject[Q].instanceof != results.instanceof) {
            ResultsObject[Q].instanceof = "";
        };
        if (ResultsObject[Q].categorie != results.categorie) {
            ResultsObject[Q].categorie = "";
        };

    } else {
        ResultsObject[Q] = result;
    }
}

// Processing - Data from wikidata to Geojson
function buildGeojsonFromQueryResults() {
    console.log("@2");
    QnbrGeojson.features = [];
    for (i in allQnbrs) {
        addPointToQnbrGeojson(ResultsObject[allQnbrs[i]].geo, ResultsObject[allQnbrs[i]].qnumber, ResultsObject[allQnbrs[i]].categorie)
    }
    if (mapIsActive) {
        console.log("@3");
        map.getSource('QnbrSource').setData(QnbrGeojson);
        $("#loadingBox").hide();
        setTimeout(function () {
            buildAllVisibleItems()
        }, 500);
    } else {
        console.log("@4");
        map.on('load', function () {
            map.getSource('QnbrSource').setData(QnbrGeojson);
            $("#loadingBox").hide();
            buildAllVisibleItems()
        });
    }
}

// Helper - Add point to geojson object
function addPointToQnbrGeojson(LngLat, Qnbr, categorie) {
    // console.log("show point");
    // for (i in LngLat) {
    var point = {
        "type": "Feature",
        "properties": {
            'Qnbr': Qnbr,
            'cat': categorie
        },
        "geometry": {
            "type": "Point",
            "coordinates": LngLat
        }
    };


    QnbrGeojson.features.push(point)
    // }
}

// Helper - procesing String
function extractLngLat(dirtyGeo) {
    var cleanLongLat = dirtyGeo.replace("Point(", "");
    cleanLongLat = cleanLongLat.replace(")", "");
    const lonlat = cleanLongLat.split(" ");
    lonlat[0] = Number(lonlat[0]);
    lonlat[1] = Number(lonlat[1]);
    return lonlat;
}

// Helper - procesing String
function qnumberExtraction(QURL) {
    var value = QURL.replace("http://www.wikidata.org/entity/", "");
    return value;
}

// Query - for images from Wiki commons
function getCommonsCategoryImgs(pageTitle, Qdestination, vieuwDestination) {
    if (ResultsObject[Qdestination].commonsImgs != undefined) {
        resultsFromCommonsReady(Qdestination, vieuwDestination);
        return;
    }

    // pageTitle = encodeURIComponent(pageTitle)
    // var apiURL = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&pageids=4606622&utf8=1&cmtitle=Category%3A" + pageTitle + "&cmtype=subcat%7Cfile&cmlimit=max"
    $(document).ready(function () {
        $.ajax({
            url: 'http://commons.wikimedia.org/w/api.php',
            data: {
                action: 'query',
                format: 'json',
                list: 'categorymembers',
                utf8: '1',
                cmtitle: 'Category:' + pageTitle + '',
                cmtype: 'subcat|file',
                cmlimit: 'max'
            },
            dataType: 'jsonp',
            success: processResult
        });
    });

    function processResult(apiResult) {
        var imgUrlPrefix = "http://commons.wikimedia.org/wiki/Special:FilePath/";
        var pageUrlPrefix = "http://commons.wikimedia.org/wiki/";
        var thumSufix = "?width=300px";
        var arrayOfImgs = [];
        for (r in apiResult.query.categorymembers) {
            if (apiResult.query.categorymembers[r].title.slice(0, 8) != "Category") {
                var imgObject = {
                    imgurl: imgUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title),
                    thumurl: imgUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title) + thumSufix,
                    pageurl: pageUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title)
                };
                arrayOfImgs.push(imgObject)
            }
        }

        var firstImgObject = {
            imgurl: ResultsObject[selectedQ].img,
            thumurl: ResultsObject[selectedQ].imgthum,
            // pageurl: pageUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title)
        };
        arrayOfImgs.unshift(firstImgObject);

        ResultsObject[Qdestination].commonsImgs = arrayOfImgs;
        //  for (var i = 0; i < apiResult.query.search.length; i++){
        //       $('#display-result').append('<p>'+apiResult.query.search[i].title+'</p>');
        //  }
        resultsFromCommonsReady(Qdestination, vieuwDestination);
    };
}

// Processing Commons images
function resultsFromCommonsReady(Q, vieuwDestination) {
    console.log(ResultsObject[Q]);
    switch (vieuwDestination) {
        case "gallery":
            populateGalleryVieuw(Q);

            break;
        case "carousel":
            buildCarouselContent(Q);

            break;
        default:
            break;
    }

    // return results;
}

// Helper - open link in new window
function openInNewWindow(url) {
    if (selectedQ === undefined) {
        var lngLat = map.getCenter();
        var lng = lngLat.lng;
        var lat = lngLat.lat;
    } else {
        var lng = ResultsObject[selectedQ].geo[0];
        var lat = ResultsObject[selectedQ].geo[1];
    }


    //selectedQ
    switch (url) {
        case "wikidata":
            url = "https://www.wikidata.org/wiki/" + selectedQ;
            break;
        case "wikipedia":
            url = ResultsObject[selectedQ].wikipedia;
            break;
        case "commons":
            url = "url-commons";
            break;
        case "wikimedia":
            url = ResultsObject[selectedQ].commonsurl;
            break;
        case "googleMaps":
            url = "https://www.google.com/maps/@" + lat + "," + lng + ",1000m/data=!3m1!1e3";
            break;
        case "flickr":
            url = "https://www.flickr.com/map?&fLat=" + lat + "&fLon=" + lng + "&zl=15"
            break;
        case "wikishootme":
            url = "https://tools.wmflabs.org/wikishootme/#lat=" + lat + "&lng=" + lng + "&zoom=14";
            break;
        default:
            console.log("no url recognised")
            break;
    }
    console.log("open: " + url)
    window.open(url); //This will open the url in a new window.
}

// Interaction - Selection processing
function selectNew(Q) {
    if (Q === undefined) {
        selectedQ = undefined;
        // $("#selectionContainer").hide();
        $("#selectionContainer").css({ 'display': 'none' });
        $(".singleImgSelection").hide();
        $("#slideshow-container").hide();
        $("#wikidata").hide();
        $("#commons").hide();
        console.log("unselected");
    } else {
        var data = ResultsObject[Q]
        selectedQ = Q;
        console.log("selected" + Q);

        $("#wikidata").show();
        $("#commons").show();
        $("#slideshow-container").hide();
        // $("#selectionContainer").show();
        $("#selectionContainer").css({ 'display': 'flex' });
        $(".singleImgSelection").attr("src", data.imgthum);
        $("#slectedItemTitle").text(data.label);
        $("#slectedItemDescription").text(data.description);
        $("#slectedItemCategory").text(data.categorie);
        // $(".singleImgSelection").attr("src", data.imgthum);
        $(".singleImgSelection").show();
        // getCommonsCategoryImgs(data.commons, selectedQ, "carousel");
    };

    // if (data != undefined && lat != undefined) {
    //     flyTo(lng, lat, zoom); //camera flyes to selection
    //     showPoint(lng, lat); // highlight map point
    // };
}



wikipdiaAPIrequest();
// Wikipedia query from here:

function wikipdiaAPIrequest() {
    let canvas = map.getCanvas()
    let w = canvas.width
    let h = canvas.height
    let cUL = map.unproject([0, 0]).toArray()
    let cLR = map.unproject([w, h]).toArray()

    requestURL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&origin=*&utf8=1&gsbbox=' + cUL[1] + '|' + cUL[0] + '|' + cLR[1] + '|' + cLR[0] + '&gslimit=500&gsprimary=all';
    console.log('Request is for ' + requestURL);
    ajaxQueue.push($.getJSON(requestURL, function (data) {
        parseJSONResponse(data);
    }));
}

function parseJSONResponse(jsonData) {
    console.log(jsonData);

    $.each(jsonData.query.geosearch, function (index, value) {
        //console.log( index + ": " + value.title );
        var article = {
            "pageId": value.pageid,
            "title": value.title,
            "lonLat": [value.lon, value.lat]
        }

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            article.url = 'https://en.m.wikipedia.org/?curid=' + value.pageid;
        } else {
            article.url = 'https://en.wikipedia.org/?curid=' + value.pageid;
        }

        console.log("Found Article " + index + ": " + article.title);
        console.log(article);
        addWikipadiaPage(article)
    });
}

function stopAllAjax() {
    $.each(ajaxQueue, function (index, item) {
        item.abort();
        item = null;
    });
    ajaxQueue = new Array();
}

function addWikipadiaPage(article) {
    addWikipediaPageToGeojson(article);
    updateWikipediaGeojsonSource();

}

function addWikipediaPageToGeojson(article) {
    if (mapIsActive) { // is map active?
        if (isArticleNew(article)) {
            var point = { //write the specific geojson feature for this point
                "type": "Feature",
                "properties": article, // all info known about the article is saved as property
                "geometry": {
                    "type": "Point",
                    "coordinates": article.lonLat
                }
            };
            wikipediaGeojson.features.push(point) // add the newly created geojson feature the geojson
            map.getSource('wikipediaSource').setData(wikipediaGeojson); // update map with the geojson (includng most recent addition)            
        } // else it already exist, so ignor.
    } else { // map is not ready
        setTimeout(function () {
            addWikipediaPageToGeojson(article) // do identical second attempt
        }, 250); // wait quater of a second
    }
}

function isArticleNew(article) {
    for (i in wikipediaGeojson.features) {
        if (wikipediaGeojson.features[i].properties.pageId == article.pageId) {
            return false;
        }
    }
    return true;
}

function updateWikipediaGeojsonSource() {
    if (mapIsActive) {
        map.getSource('wikipediaSource').setData(wikipediaGeojson);
        $("#loadingBox").hide();
    } else {
        map.on('load', function () {
            map.getSource('wikipediaSource').setData(wikipediaGeojson);
            $("#loadingBox").hide();
        });
    }
}
