$(document).ready( function(){
            var map, boroughSearch = [], theaterSearch = [], museumSearch = [];

            // Basemap Layers
            var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
                maxZoom: 19,
                subdomains: ["otile1", "otile2", "otile3", "otile4"],
                attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
            });
            var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
                maxZoom: 18,
                subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
                attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
            });
            var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
                maxZoom: 18,
                subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
            }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
                maxZoom: 19,
                subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
                attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
            })]);

            // Overlay Layers
            var boroughs = L.geoJson(null, {
                style: function (feature) {
                    return {
                        color: "black",
                        fill: false,
                        opacity: 1,
                        clickable: false
                    };
                },
                onEachFeature: function (feature, layer) {
                    boroughSearch.push({
                        value: layer.feature.properties.BoroName,
                        tokens: [layer.feature.properties.BoroName],
                        layer: "Boroughs",
                        id: L.stamp(layer),
                        bounds: layer.getBounds()
                    });
                }
            });
            $.getJSON("data/boroughs.geojson", function (data) {
                boroughs.addData(data);
            });

            var subwayLines = L.geoJson(null, {
                style: function (feature) {
                    if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
                        return {
                            color: "#ff3135",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "4" || feature.properties.route_id === "5" || feature.properties.route_id === "6") {
                        return {
                            color: "#009b2e",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "7") {
                        return {
                            color: "#ce06cb",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "A" || feature.properties.route_id === "C" || feature.properties.route_id === "E" || feature.properties.route_id === "SI" || feature.properties.route_id === "H") {
                        return {
                            color: "#fd9a00",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "Air") {
                        return {
                            color: "#ffff00",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "B" || feature.properties.route_id === "D" || feature.properties.route_id === "F" || feature.properties.route_id === "M") {
                        return {
                            color: "#ffff00",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "G") {
                        return {
                            color: "#9ace00",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "FS" || feature.properties.route_id === "GS") {
                        return {
                            color: "#6e6e6e",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "J" || feature.properties.route_id === "Z") {
                        return {
                            color: "#976900",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "L") {
                        return {
                            color: "#969696",
                            weight: 3,
                            opacity: 1
                        };
                    };
                    if (feature.properties.route_id === "N" || feature.properties.route_id === "Q" || feature.properties.route_id === "R") {
                        return {
                            color: "#ffff00",
                            weight: 3,
                            opacity: 1
                        };
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        var content =   "<table class='table table-striped table-bordered table-condensed'>"+
                                            "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>"+
                                            "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>"+
                                        "<table>";
                        if (document.body.clientWidth <= 767) {
                            layer.on({
                                click: function(e) {
                                    $("#feature-title").html(feature.properties.Line);
                                    $("#feature-info").html(content);
                                    $("#featureModal").modal("show");
                                }
                            });

                        } else {
                            layer.bindPopup(content, {
                                maxWidth: "auto",
                                closeButton: false
                            });
                        };
                    }
                    layer.on({
                        mouseover: function(e) {
                            var layer = e.target;
                            layer.setStyle({
                                weight: 3,
                                color: "#00FFFF",
                                opacity: 1
                            });
                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }
                        },
                        mouseout: function(e) {
                            subwayLines.resetStyle(e.target);
                        }
                    });
                }
            });
            $.getJSON("data/subways.geojson", function (data) {
                subwayLines.addData(data);
            });

            var theaters = L.geoJson(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: "img/theater.png",
                            iconSize: [24, 28],
                            iconAnchor: [12, 28],
                            popupAnchor: [0, -25]
                        }),
                        title: feature.properties.NAME,
                        riseOnHover: true
                    });
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        var content =   "<table class='table table-striped table-bordered table-condensed'>"+
                                            "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>"+
                                            "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>"+
                                            "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>"+
                                            "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>"+
                                        "<table>";

                        if (document.body.clientWidth <= 767) {
                            layer.on({
                                click: function(e) {
                                    $("#feature-title").html(feature.properties.NAME);
                                    $("#feature-info").html(content);
                                    $("#featureModal").modal("show");
                                }
                            });

                        } else {
                            layer.bindPopup(content, {
                                maxWidth: "auto",
                                closeButton: false
                            });
                        };
                        theaterSearch.push({
                            value: layer.feature.properties.NAME,
                            tokens: [layer.feature.properties.NAME],
                            layer: "Theaters",
                            id: L.stamp(layer),
                            lat: layer.feature.geometry.coordinates[1],
                            lng: layer.feature.geometry.coordinates[0]
                        });
                    }
                }
            });
            $.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
                theaters.addData(data);
            });

            var museums = L.geoJson(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: "img/museum.png",
                            iconSize: [24, 28],
                            iconAnchor: [12, 28],
                            popupAnchor: [0, -25]
                        }),
                        title: feature.properties.NAME,
                        riseOnHover: true
                    });
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        var content =   "<table class='table table-striped table-bordered table-condensed'>"+
                                            "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>"+
                                            "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>"+
                                            "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>"+
                                            "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>"+
                                        "<table>";
                        if (document.body.clientWidth <= 767) {
                            layer.on({
                                click: function(e) {
                                    $("#feature-title").html(feature.properties.NAME);
                                    $("#feature-info").html(content);
                                    $("#featureModal").modal("show");
                                }
                            });

                        } else {
                            layer.bindPopup(content, {
                                maxWidth: "auto",
                                closeButton: false
                            });
                        };
                        museumSearch.push({
                            value: layer.feature.properties.NAME,
                            tokens: [layer.feature.properties.NAME],
                            layer: "Museums",
                            id: L.stamp(layer),
                            lat: layer.feature.geometry.coordinates[1],
                            lng: layer.feature.geometry.coordinates[0]
                        });
                    }
                }
            });
            $.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
                museums.addData(data);
            });

            map = L.map("map", {
                zoom: 10,
                center: [40.702222, -73.979378],
                layers: [mapquestOSM, boroughs, subwayLines, theaters]
            });
            // Hack to preserver layer order in Layer control
            map.removeLayer(subwayLines);

            // Larger screens get expanded layer control
            if (document.body.clientWidth <= 767) {
                var isCollapsed = true;
            } else {
                var isCollapsed = false;
            };

            var baseLayers = {
                "Streets": mapquestOSM,
                "Imagery": mapquestOAM,
                "Hybrid": mapquestHYB
            };

            //var overlays = {
            //    "Boroughs": boroughs,
            //    "Subway Lines": subwayLines,
            //    "<img src='img/theater.png' width='24' height='28'>&nbsp;Theaters": theaters,
            //    "<img src='img/museum.png' width='24' height='28'>&nbsp;Museums": museums
            //};

            var layerControl = L.control.layers(baseLayers).addTo(map);

            // Highlight search box text on click
            $("#searchbox").click(function () {
                $(this).select();
            });

            // Typeahead search functionality
            $(document).one("ajaxStop", function () {
                map.fitBounds(boroughs.getBounds());
                $("#loading").hide();
                $("#searchbox").typeahead([{
                    name: "Boroughs",
                    local: boroughSearch,
                    minLength: 2,
                    header: "<h4 class='typeahead-header'>Boroughs</h4>"
                },
                {
                    name: "Theaters",
                    local: theaterSearch,
                    minLength: 2,
                    limit: 10,
                    header: "<h4 class='typeahead-header'><img src='img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>"
                },
                {
                    name: "Museums",
                    local: museumSearch,
                    minLength: 2,
                    limit: 10,
                    header: "<h4 class='typeahead-header'><img src='img/museum.png' width='24' height='28'>&nbsp;Museums</h4>"
                },
                {
                    name: "GeoNames",
                    remote: {
                        url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
                        beforeSend: function (jqXhr, settings) {
                            settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
                        },
                        filter: function (parsedResponse) {
                            var dataset = [];
                            for (i = 0; i < parsedResponse.geonames.length; i++) {
                                dataset.push({
                                    value: parsedResponse.geonames[i].name,
                                    tokens: [parsedResponse.geonames[i].name],
                                    layer: "GeoNames",
                                    lat: parsedResponse.geonames[i].lat,
                                    lng: parsedResponse.geonames[i].lng
                                });
                            }
                            return dataset;
                        }
                    },
                    minLength: 2,
                    limit: 5,
                    header: "<h4 class='typeahead-header'><img src='img/globe.png' width='25' height='25'>&nbsp;GeoNames Places</h4>"
                }]).on("typeahead:selected", function (obj, datum) {
                    if (datum.layer === "Boroughs") {
                        map.fitBounds(datum.bounds);
                    };
                    if (datum.layer === "Theaters") {
                        if (!map.hasLayer(theaters)) {
                            map.addLayer(theaters);
                        };
                        map.setView([datum.lat, datum.lng], 17);
                        if (map._layers[datum.id]) {
                            map._layers[datum.id].fire("click");
                        };
                    };
                    if (datum.layer === "Museums") {
                        if (!map.hasLayer(museums)) {
                            map.addLayer(museums);
                        };
                        map.setView([datum.lat, datum.lng], 17);
                        if (map._layers[datum.id]) {
                            map._layers[datum.id].fire("click");
                        };
                    };
                    if (datum.layer === "GeoNames") {
                        map.setView([datum.lat, datum.lng], 14);
                    };
                    if ($("#navbar-collapse").height() > 50) {
                        $("#navbar-collapse").collapse("hide");
                    };
                }).on("typeahead:initialized ", function () {
                    $(".tt-dropdown-menu").css("max-height", 300);
                }).on("typeahead:opened", function () {
                    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
                    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
                }).on("typeahead:closed", function () {
                    $(".navbar-collapse.in").css("max-height", "");
                    $(".navbar-collapse.in").css("height", "");
                });
            });

            // Placeholder hack for IE
            if (navigator.appName == "Microsoft Internet Explorer") {
                $("input").each( function () {
                    if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function () {
                            if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function () {
                            if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
            }
}); 
