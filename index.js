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

var detailsPannelData = {
    "wikipedia_ApiOngoing": false,   // current status of API resquest
    "wikimedia_ApiOngoing": false,   // current status of API resquest
    "wikidata_ApiOngoing": false,    // current status of API resquest
    "wikipedia_QueryDone": false,     // Data collection status
    "wikimedia_QueryDone": false,    // Data collection status
    "wikidata_QueryDone": false      // Data collection status
};


function hideAboutpanel() {
    document.getElementById("about").style.display = "none";
}
  
  function openAboutpanel() {
    document.getElementById("about").style.display = "block";
}

function openHamburger() {
    document.getElementById("hamburgermenu").style.display = "block";
  }
  
function closeHamburger() {
document.getElementById("hamburgermenu").style.display = "none";
}


mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fza2VzIiwiYSI6ImNqYW1tNGdwdjN3MW8yeWp1cWNsaXZveDYifQ.MNpL7SYvoVgR4s_4ma5iyg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/caskes/cklkot3vu1nwy17qneh7f1hzd', // stylesheet location
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
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50,
    });

    //ad layers to bring data sources to map
    // map.addLayer({ // wikipediaLayer
    //     "id": "wikipediaLayer",
    //     "type": "symbol",
    //     "source": "wikipediaSource",
    //     'layout': {
    //         'icon-image': 'wikipedia',
    //     }
    // });





    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'wikipediaSource',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#08415C'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'wikipediaSource',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'wikipediaSource',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#497983',
            'circle-radius': 10,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('wikipediaSource').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    // map.on('click', 'unclustered-point', function (e) {
    // var coordinates = e.features[0].geometry.coordinates.slice();

    // // Ensure that if the map is zoomed out such that
    // // multiple copies of the feature are visible, the
    // // popup appears over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }
    // });

    map.on('mouseenter', 'clusters', function (e) {
        var articleTitle = e.features[0].properties.title;
        // if (ResultsObject[hoverdQID].imgthum != undefined) {
        // var html = '<img src="' + ResultsObject[hoverdQID].imgthum + '" alt="' + ResultsObject[hoverdQID].label + '" class="popupImg">';
        var html = '<h1 class="wikipediaHoverPopupTitle">' + articleTitle + '</h1>';


        var coordinates = e.features[0].geometry.coordinates.slice();
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map);

        map.getCanvas().style.cursor = 'pointer';
        // } else {
        // var html = '<p class="popupText">No image</p>';
        // }
        // console.log(e);
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });








    // map.addLayer({
    //     "id": "QnbrLayer",
    //     "type": "circle",
    //     "source": "QnbrSource",
    //     // "source-layer": "QnbrSource",
    //     "layout": {},
    //     "paint": {
    //         'circle-radius': {
    //             stops: [[8, 1], [11, 4], [16, 15]]
    //         },
    //         'circle-color': [
    //             "match",
    //             ["get", "cat"],
    //             ["Architectural"],
    //             "#D08770",
    //             ["Event"],
    //             "#BF616A",
    //             "#EBCB8B"
    //         ],
    //         'circle-stroke-width': 1,
    //         'circle-stroke-color': '#000000',
    //         'circle-stroke-opacity': 0.2,
    //     }
    // });




    // map.loadImage(
    //        'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/architecture_small.png',
    //        function (error, image) {
    //            if (error) throw error;
    //            map.addImage('archi', image);
    //            map.loadImage(
    //                'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/event.png',
    //                function (error, image) {
    //                    if (error) throw error;
    //                    map.addImage('event', image);
    //                    map.loadImage(
    //                        'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/other.png',
    //                        function (error, image) {
    //                            if (error) throw error;
    //                            map.addImage('other', image);
    //                            addLayerWithIcons() // All images are now loaded, add layer that uses the images
    //                        }
    //                    );
    //                }
    //            );
    //        }
    //    );
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
                            map.loadImage(
                                'https://casper-and-daan-explore-history.github.io/wiki-battle-map/img/wikipedia.png',
                                function (error, image) {
                                    if (error) throw error;
                                    map.addImage('wikipedia', image);
                                    addLayerWithIcons() // All images are now loaded, add layer that uses the images

                                }
                            );

                        }
                    );
                }
            );
        }
    );

    function addLayerWithIcons() {
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


    // hover popup QnumberLayer
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

    // hover popup Wikipedia Layer
    map.on('mouseenter', 'unclustered-point', function (e) {
        var articleTitle = e.features[0].properties.title;
        // if (ResultsObject[hoverdQID].imgthum != undefined) {
        // var html = '<img src="' + ResultsObject[hoverdQID].imgthum + '" alt="' + ResultsObject[hoverdQID].label + '" class="popupImg">';
        var html = '<h1 class="wikipediaHoverPopupTitle">' + articleTitle + '</h1>';


        var coordinates = e.features[0].geometry.coordinates.slice();
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map);

        map.getCanvas().style.cursor = 'pointer';
        // } else {
        // var html = '<p class="popupText">No image</p>';
        // }
        // console.log(e);
    });
    map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // click
    map.on('click', function (e) { //cancel selection
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        // selectNew(undefined);
    });
    map.on('click', 'QnbrLayerIcon', function (e) { // select point and open "window"
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        // selectNew(e.features[0].properties.Qnbr);
    });

    map.on('click', 'unclustered-point', function (e) { // select point and open "window"
        // window.open(e.features[0].properties.url);
        openDetailPannel(e.features[0].properties);

    });

    // Map panning ends
    map.on('moveend', function () {
        // runQuery();
        wikipdiaApiGeoRequest();
    });
});


// runQuery();
function runQuery() {
    // let canvas = map.getCanvas()
    // let w = canvas.width
    // let h = canvas.height
    // let cUL = map.unproject([0, 0]).toArray()
    // let cLR = map.unproject([w, h]).toArray()


    // // the function that process the query
    // function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
    //     var settings = {
    //         headers: { Accept: 'application/sparql-results+json' },
    //         data: { query: sparqlQuery }
    //     };
    //     return $.ajax(endpointUrl, settings).then(doneCallback);
    // }

    // var endpointUrl = 'https://query.wikidata.org/sparql',
    //     sparqlQuery = "#defaultView:ImageGride\n" +
    //         "SELECT\n" +
    //         "  ?item ?itemLabel ?itemDescription\n" +
    //         "  ?geo ?img ?categorie ?wikiMediaCategory\n" +
    //         "  (GROUP_CONCAT(?instanceLabel; SEPARATOR = \", \") AS ?instancesof) # a nices String with the labels of the different instances of related to the item\n" +
    //         "WITH\n" +
    //         "{\n" +
    //         "  SELECT \n" +
    //         "    ?item \n" +
    //         "    (SAMPLE(?geo_) AS ?geo) # The SAMPLE code is needed to inform the GROUP BY code what to do when there are more than one.\n" +
    //         "    (SAMPLE(?img_) AS ?img)\n" +
    //         "  WHERE\n" +
    //         "  {\n" +
    //         "    #### Selection based on location ####   \n" +
    //         "    SERVICE wikibase:box\n" +
    //         "    {\n" +
    //         "      ?item wdt:P625 ?geo_.\n" +
    //         "      bd:serviceParam wikibase:cornerWest \"Point(" + cUL[0] + " " + cUL[1] + ")\"^^geo:wktLiteral. \n" +
    //         "      bd:serviceParam wikibase:cornerEast \"Point(" + cLR[0] + " " + cLR[1] + ")\"^^geo:wktLiteral.\n" +
    //         "    }\n" +
    //         "\n" +
    //         "    MINUS { ?item (wdt:P31/(wdt:P279*)) wd:Q376799. } # Remove everything related to roads\n" +
    //         "    ?item wdt:P18 ?img_. # Only keep items with pictures\n" +
    //         "  }\n" +
    //         "  GROUP BY ?item\n" +
    //         "} AS %get_items\n" +
    //         "WHERE\n" +
    //         "{\n" +
    //         "  INCLUDE %get_items\n" +
    //         "\n" +
    //         "  #### Categorise items ####\n" +
    //         "  BIND(\n" +
    //         "    IF(EXISTS {?item (wdt:P31/(wdt:P279*)) wd:Q811979},\n" +
    //         "       \"Architectural\",\n" +
    //         "       IF(EXISTS {?item (wdt:P31/(wdt:P279*)) wd:Q1656682},\n" +
    //         "          \"Event\",\n" +
    //         "          \"Other\"\n" +
    //         "         )\n" +
    //         "      )\n" +
    //         "  AS ?categorie)\n" +
    //         "  \n" +
    //         "  OPTIONAL { ?item wdt:P31 ?instance. } # Get instances\n" +
    //         "   \n" +
    //         "  OPTIONAL { ?item wdt:P373 ?wikiMediaCategory. }\n" +
    //         "   \n" +
    //         "  #### Wikipedia link ####\n" +
    //         "  OPTIONAL {\n" +
    //         "    ?article schema:about ?item . # Get wikipedia link\n" +
    //         "    ?article schema:isPartOf <https://en.wikipedia.org/>. # Only keep EN language\n" +
    //         "  }\n" +
    //         "  \n" +
    //         "  #### Labels & discription #### \n" +
    //         "  SERVICE wikibase:label { # Get labels\n" +
    //         "    bd:serviceParam wikibase:language \"en\". \n" +
    //         "    ?instance rdfs:label ?instanceLabel.      # The specification of the variables to be labeld is needed for grouping the instances of correctly\n" +
    //         "    ?item rdfs:label ?itemLabel.\n" +
    //         "    ?item schema:description ?itemDescription.\n" +
    //         "  }\n" +
    //         "}\n" +
    //         "GROUP BY ?item ?itemLabel ?itemDescription ?geo ?img ?categorie ?article ?wikiMediaCategory";


    // makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
    //     // $( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
    //     // console.log( data );
    //     processQueryResults(data);
    // }
    // );
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



wikipdiaApiGeoRequest();
// Wikipedia query from here:

function wikipdiaApiGeoRequest() {
    let canvas = map.getCanvas()
    let w = canvas.width
    let h = canvas.height
    let cUL = map.unproject([0, 0]).toArray()
    let cLR = map.unproject([w, h]).toArray()

    requestURL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&origin=*&utf8=1&gsbbox=' + cUL[1] + '|' + cUL[0] + '|' + cLR[1] + '|' + cLR[0] + '&gslimit=500&gsprimary=all';
    // console.log('Request is for ' + requestURL);
    ajaxQueue.push($.getJSON(requestURL, function (data) {
        parseJSONResponse(data);
    }));
}

function parseJSONResponse(jsonData) {
    // console.log(jsonData);

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

        // console.log("Found Article " + index + ": " + article.title);
        // console.log(article);
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


function openDetailPannel(selectionInfo) {
    detailsPannelData = {
        "wikipedia_ApiOngoing": false,   // current status of API resquest
        "wikimedia_ApiOngoing": false,   // current status of API resquest
        "wikidata_ApiOngoing": false,    // current status of API resquest
        "wikipedia_QueryDone": false,     // Data collection status
        "wikimedia_QueryDone": false,    // Data collection status
        "wikidata_QueryDone": false      // Data collection status
    };


    detailsPannelData.Map_title = selectionInfo.title;
    detailsPannelData.wikipediaID = selectionInfo.pageId;
    detailsPannelData.Map_lonLat = selectionInfo.lonLat;

    WikipediaApiRequestDetails(detailsPannelData.wikipediaID);

    // pageId
    // title
    // "lonLat": [value.lon, value.lat]
}




function WikipediaApiRequestDetails(pageID) {
    detailsPannelData.wikipedia_ApiOngoing = true;
    requestURL = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts%7Cpageprops%7Cpageimages%7Ccategories&pageids=' + pageID + '&utf8=1&formatversion=latest&exintro=1';
    // API sandox link: https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&origin=*&prop=extracts%7Cpageprops%7Cpageimages%7Ccategories&pageids=58387057&utf8=1&formatversion=latest&exintro=1
    ajaxQueue.push($.getJSON(requestURL, function (data) {
        parseJSONResponseDetails(data);
    }));
}

function parseJSONResponseDetails(jsonData) {
    var wikipediaApiRespons = jsonData.query.pages[0];

    detailsPannelData.wikipedia_Intro = wikipediaApiRespons.extract;
    detailsPannelData.wikipedia_ImgTitle = wikipediaApiRespons.pageimage;
    detailsPannelData.Qnumber = wikipediaApiRespons.pageprops.wikibase_item;
    detailsPannelData.wikipedia_ImgUrl = "http://commons.wikimedia.org/wiki/Special:FilePath/" + wikipediaApiRespons.pageimage;
    detailsPannelData.wikipedia_Categories = [];

    //ToDo: get a desent thumnail. Maibe by transforming img url?

    // if (wikipediaApiRespons.thumbnail != undefined) {
    //     var url = wikipediaApiRespons.thumbnail.source;
    //     url.replace("50px", "500px"); // changing thmbnail size
    //     detailsPannelData.imgThumbnailUrl = url;
    // }

    for (i in wikipediaApiRespons.categories) {
        detailsPannelData.wikipedia_Categories.push(wikipediaApiRespons.categories[i].title); // adding all wikipediaApiRespons cathegories.
    }

    detailsPannelData.wikipedia_ApiOngoing = false; // change status to no API call ongoing.
    console.log(detailsPannelData);

    // If new Qnumber, and no data jet, then get Wikidata data:
    if (!detailsPannelData.wikidata_ApiOngoing && !detailsPannelData.wikidata_QueryDone && detailsPannelData.Qnumber != undefined) {
        console.log("should call Wikidata API");
        WikidataApiRequestDetails()
    }
}

function WikidataApiRequestDetails() {
    function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
        var settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };
        return $.ajax(endpointUrl, settings).then(doneCallback);
    }

    //https://query.wikidata.org/#SELECT%20%3Fitem%20%3FitemLabel%20%3FitemDescription%20%3Fimg%20%3Fcommons%20%3FWikipediaLink%20%3Felevation%20%3Farea%20%3FofficialWebsite%20%3FflagImage%20%3FLonLat%20%3FcoatOfArmsImage%20%3FCommonsCategory%20%3FFreebaseIdGoogleSearch%20%3FGoogleKnowledgeGraphId%20%3FstartTime%20%3FendTime%20%3Finception%20%3Freligion%20%3FsignificantEvent%20%3Faudio%20%3FmaximumCapacity%20%3FvisitorsPerYear%20%3FheritageDesignationLabel%20%3Flength%20%3Fwidth%20%3Fheight%20%3FplanViewImage%20%3FFacebookId%20%3FGoogleMapsCustomerId%20%3FInstagramUsername%20%3FMapillaryId%20%3FTwitterUsername%20%3FOpenStreetMapRelationId%20%3FInstagramLocationId%20%3FFoursquareVenueId%20%3FImdbId%20%3FLinkedInCompanyId%20%3FTripAdvisorId%20%3FYelpId%20%3FYouTubeChannelId%20%3FphoneNumber%20%3FemailAddress%20%3Fsubreddit%20%3FGoogleArtsCulturePartnerId%20%3Fpopulation%20%3FcommonsLink%20%3FinstanceOfLabel%20WHERE%20%7B%0A%0A%20%20%23%20https%3A%2F%2Fwww.wikidata.org%2Fwiki%2FQ2981%20Notre%20Dam%20of%20Paris%0A%20%20%23%20https%3A%2F%2Fwww.wikidata.org%2Fwiki%2FQ243%20Toure%20Eiffel%0A%20%20%20%20%0A%20%20VALUES%20%3Fitem%20%7B%20%23%3Fitem%20variable%20is%20set%20to%20Qnumber%0A%20%20%20%20wd%3AQ243%0A%20%20%7D%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP18%20%20%20%3Fimg.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP373%20%20%3FcommonsLink.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP31%20%20%20%3FinstanceOf.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP625%20%20%3FLonLat.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1082%20%3Fpopulation.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2044%20%3Felevation.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2046%20%3Farea.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP856%20%20%3FofficialWebsite.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP41%20%20%20%3FflagImage.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP94%20%20%20%3FcoatOfArmsImage.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP373%20%20%3FCommonsCategory.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP646%20%20%3FFreebaseIdGoogleSearch.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2671%20%3FGoogleKnowledgeGraphId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP580%20%20%3FstartTime.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP582%20%20%3FendTime.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP571%20%20%3Finception.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP140%20%20%3Freligion.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP793%20%20%3FsignificantEvent.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP51%20%20%20%3Faudio.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1083%20%3FmaximumCapacity.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1174%20%3FvisitorsPerYear.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1435%20%3FheritageDesignation.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2043%20%3Flength.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2049%20%3Fwidth.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2048%20%3Fheight.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP3311%20%3FplanViewImage.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2013%20%3FFacebookId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP3749%20%3FGoogleMapsCustomerId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2003%20%3FInstagramUsername.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1947%20%3FMapillaryId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP2002%20%3FTwitterUsername.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP402%20%20%3FOpenStreetMapRelationId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP4173%20%3FInstagramLocationId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP1968%20%3FFoursquareVenueId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP345%20%20%3FImdbId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP4264%20%3FLinkedInCompanyId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20%20wdt%3AP3134%20%3FTripAdvisorId.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20
    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "SELECT ?item ?itemLabel ?itemDescription ?img ?commons ?WikipediaLink ?elevation ?area ?officialWebsite ?flagImage ?LonLat ?coatOfArmsImage ?CommonsCategory ?FreebaseIdGoogleSearch ?GoogleKnowledgeGraphId ?startTime ?endTime ?inception ?religion ?significantEvent ?audio ?maximumCapacity ?visitorsPerYear ?heritageDesignationLabel ?length ?width ?height ?planViewImage ?FacebookId ?GoogleMapsCustomerId ?InstagramUsername ?MapillaryId ?TwitterUsername ?OpenStreetMapRelationId ?InstagramLocationId ?FoursquareVenueId ?ImdbId ?LinkedInCompanyId ?TripAdvisorId ?YelpId ?YouTubeChannelId ?phoneNumber ?emailAddress ?subreddit ?GoogleArtsCulturePartnerId ?population ?commonsLink ?instanceOfLabel WHERE {\n" +
            "\n" +
            "  # https://www.wikidata.org/wiki/Q2981 Notre Dam of Paris\n" +
            "  # https://www.wikidata.org/wiki/Q243 Toure Eiffel\n" +
            "    \n" +
            "  VALUES ?item { #?item variable is set to Qnumber\n" +
            "    wd:" + detailsPannelData.Qnumber + "\n" +
            "  }\n" +
            "  \n" +
            "  OPTIONAL { ?item  wdt:P18   ?img. }\n" +
            "  OPTIONAL { ?item  wdt:P373  ?commonsLink. }\n" +
            "  OPTIONAL { ?item  wdt:P31   ?instanceOf. }\n" +
            "  OPTIONAL { ?item  wdt:P625  ?LonLat. }\n" +
            "  OPTIONAL { ?item  wdt:P1082 ?population. }\n" +
            "  OPTIONAL { ?item  wdt:P2044 ?elevation. }\n" +
            "  OPTIONAL { ?item  wdt:P2046 ?area. }\n" +
            "  OPTIONAL { ?item  wdt:P856  ?officialWebsite. }\n" +
            "  OPTIONAL { ?item  wdt:P41   ?flagImage. }\n" +
            "  OPTIONAL { ?item  wdt:P94   ?coatOfArmsImage. }\n" +
            "  OPTIONAL { ?item  wdt:P373  ?CommonsCategory. }\n" +
            "  OPTIONAL { ?item  wdt:P646  ?FreebaseIdGoogleSearch. }\n" +
            "  OPTIONAL { ?item  wdt:P2671 ?GoogleKnowledgeGraphId. }\n" +
            "  OPTIONAL { ?item  wdt:P580  ?startTime. }\n" +
            "  OPTIONAL { ?item  wdt:P582  ?endTime. }\n" +
            "  OPTIONAL { ?item  wdt:P571  ?inception. }\n" +
            "  OPTIONAL { ?item  wdt:P140  ?religion. }\n" +
            "  OPTIONAL { ?item  wdt:P793  ?significantEvent. }\n" +
            "  OPTIONAL { ?item  wdt:P51   ?audio. }\n" +
            "  OPTIONAL { ?item  wdt:P1083 ?maximumCapacity. }\n" +
            "  OPTIONAL { ?item  wdt:P1174 ?visitorsPerYear. }\n" +
            "  OPTIONAL { ?item  wdt:P1435 ?heritageDesignation. }\n" +
            "  OPTIONAL { ?item  wdt:P2043 ?length. }\n" +
            "  OPTIONAL { ?item  wdt:P2049 ?width. }\n" +
            "  OPTIONAL { ?item  wdt:P2048 ?height. }\n" +
            "  OPTIONAL { ?item  wdt:P3311 ?planViewImage. }\n" +
            "  OPTIONAL { ?item  wdt:P2013 ?FacebookId. }\n" +
            "  OPTIONAL { ?item  wdt:P3749 ?GoogleMapsCustomerId. }\n" +
            "  OPTIONAL { ?item  wdt:P2003 ?InstagramUsername. }\n" +
            "  OPTIONAL { ?item  wdt:P1947 ?MapillaryId. }\n" +
            "  OPTIONAL { ?item  wdt:P2002 ?TwitterUsername. }\n" +
            "  OPTIONAL { ?item  wdt:P402  ?OpenStreetMapRelationId. }\n" +
            "  OPTIONAL { ?item  wdt:P4173 ?InstagramLocationId. }\n" +
            "  OPTIONAL { ?item  wdt:P1968 ?FoursquareVenueId. }\n" +
            "  OPTIONAL { ?item  wdt:P345  ?ImdbId. }\n" +
            "  OPTIONAL { ?item  wdt:P4264 ?LinkedInCompanyId. }\n" +
            "  OPTIONAL { ?item  wdt:P3134 ?TripAdvisorId. }\n" +
            "  OPTIONAL { ?item  wdt:P3108 ?YelpId. }\n" +
            "  OPTIONAL { ?item  wdt:P2397 ?YouTubeChannelId. }\n" +
            "  OPTIONAL { ?item  wdt:P1329 ?phoneNumber. }\n" +
            "  OPTIONAL { ?item  wdt:P968  ?emailAddress. }\n" +
            "  OPTIONAL { ?item  wdt:P3984 ?subreddit. }\n" +
            "  OPTIONAL { ?item  wdt:P4702 ?GoogleArtsCulturePartnerId. }\n" +
            "  \n" +
            "  OPTIONAL {\n" +
            "    ?WikipediaLink schema:about ?item;\n" +
            "      schema:isPartOf <https://en.wikipedia.org/>.\n" +
            "  }\n" +
            "  OPTIONAL { SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". } }\n" +
            "  OPTIONAL {\n" +
            "    SERVICE wikibase:label {\n" +
            "      bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\".\n" +
            "      ?item rdfs:label ?itemLabel;\n" +
            "        schema:description ?itemDescription.\n" +
            "    }\n" +
            "  }\n" +
            "}";

    makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
        $('body').append($('<pre>').text(JSON.stringify(data)));
        console.log(data.results.bindings);
        WikidataApiResultsProcessingDetails(data.results.bindings)
    }
    );

    function WikidataApiResultsProcessingDetails(data) {
        cleanResults()
        function cleanResults() {
            var gatherdResults = {}; //raw results come in with a lot of fluf and in repated fashon to account for several values. Here we keep the minimum and put the results in an array if needed.

            for (i in data) { // loop throug resonds sets
                var keys = Object.keys(data[i]); //get all the object's keys 
                for (k in keys) {
                    if (gatherdResults[keys[k]] === undefined) { //If no value was ever saved for this key(variable name)
                        gatherdResults[keys[k]] = [data[i][keys[k]].value]; // save value in a new array
                    } else {
                        if (jQuery.inArray(data[i][keys[k]].value, gatherdResults[keys[k]]) === -1) // If this value does not exist in array
                            gatherdResults[keys[k]].push(data[i][keys[k]].value) // then add to array
                    }
                }
            }
            console.log(gatherdResults);
            makeResultsUsefull(gatherdResults)
        }


        function makeResultsUsefull(data) {
            var keys = Object.keys(data);

            for (k in keys) {
                for (v in data[keys[k]]) {
                    var value = "";

                    switch (keys[k]) { // for every variable there is an other method of enriching.
                        case "CommonsCategory":
                            value = "https://commons.wikimedia.org/wiki/Category:" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "LonLat":
                            value = data[keys[k]][v];
                            value = value.replace("Point(", "");
                            value = value.replace(")", "");
                            value = value.split(" ");
                            value = [Number(value[0]), Number(value[1])]
                            break;

                        case "TwitterUsername":
                            value = "https://twitter.com/" + data[keys[k]][v];
                            break;

                        case "height":
                            value = data[keys[k]][v] + " meters";
                            break;

                        case "FreebaseIdGoogleSearch":
                            value = "https://www.google.com/search?kgmid=" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "commonsLink":
                            value = "https://commons.wikimedia.org/wiki/Category:" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "inception":
                            value = data[keys[k]][v].split("-");
                            value = value[0];
                            break;

                        case "length":
                            value = data[keys[k]][v] + " meters";
                            break;

                        case "FacebookId":
                            value = "https://www.facebook.com/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "FoursquareVenueId":
                            value = "https://foursquare.com/v/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "GoogleMapsCustomerId":
                            value = "https://maps.google.com/?cid=" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "InstagramLocationId":
                            value = "https://www.instagram.com/explore/locations/" + encodeURIComponent(data[keys[k]][v]) + "/";
                            break;

                        case "InstagramUsername":
                            value = "https://www.instagram.com/" + encodeURIComponent(data[keys[k]][v]) + "/";
                            break;

                        case "ImdbId":
                            value = "https://wikidata-externalid-url.toolforge.org/?p=345&url_prefix=https://www.imdb.com/&id=" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "LinkedInCompanyId":
                            value = "https://www.linkedin.com/company/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "MapillaryId":
                            value = "https://www.mapillary.com/map/im/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "TripAdvisorId":
                            value = "https://www.tripadvisor.com/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "YelpId":
                            // value = "https://www.yelp.com/biz/" + encodeURIComponent(data[keys[k]][v]);
                            value = "https://www.yelp.com/biz/" + data[keys[k]][v];
                            break;

                        case "YouTubeChannelId":
                            value = "https://www.youtube.com/channel/" + encodeURIComponent(data[keys[k]][v]);
                            break;

                        case "visitorsPerYear":
                            value = bigNumberFormater(data[keys[k]][v]) + " visitors per year";
                            break;

                        // case "":
                        //     break;
                        // case "":
                        //     break;
                        // case "":
                        //     break;
                        // case "":
                        //     break;

                        // value = "" + data[keys[k]][v];
                        // value = "" + encodeURIComponent(data[keys[k]][v]);
                        // value = value.replace(")", "");
                        // value = value.split(" ");




                        default:
                            value = data[keys[k]][v];
                            break;
                    }

                    // save enriched value to final object used to display results to UI
                    if (detailsPannelData["Wikidata_" + keys[k]] === undefined) { // does it exist?
                        detailsPannelData["Wikidata_" + keys[k]] = [value];
                    } else {
                        detailsPannelData["Wikidata_" + keys[k]].push(value);
                    }
                }
            }
            console.log(detailsPannelData);
        }

    }


    //detailsPannelData.Qnumber
}

function bigNumberFormater(num) {
    // if (num >= 1000000000) {
        // return (num / 1000000000).toFixed(0) + 'G';
        // return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    // }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + ' million';
        // return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + ' thousand';
        // return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}



// on map movement queries: wikipedia API, Wikidata query, Wiki commons API (toggle for all 3)

// plaatje, title, intro, Wikipedia link, Wikidata link, mini discription, (list of related categories: quality?)
// extra from Qnbr: instance of, official website, inception, part of, pronunciation audio, date of official opening, commons ategorie, significant event, 
    // audio, visitors per year, height, area, Google Maps Customer ID, Insta Location, Mapillary ID, Facebook ID, Freebase ID (Google Search), Instagram username, Twitter username
// extra LonLat: Google maps link, Bing maps, WikiShootMe
// extra form commons: photo album, hi qualit images, image locator tool
// options: see images arround this location