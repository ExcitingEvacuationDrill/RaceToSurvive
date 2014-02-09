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


            var theaters = L.geoJson(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: "img/shelter.png",
                            iconSize: [24, 28],
                            iconAnchor: [12, 28],
                            popupAnchor: [0, -25]
                        }),
                        title: feature.properties.NAME,
                        riseOnHover: true
                    });
                },
                onEachFeature: function (feature, layer) {
                    console.log(feature);
                    if (feature.properties) {
                        var content =   "<table class='table table-striped table-bordered table-condensed'>"+
                                            "<tr><th>Type</th><td>" + feature.properties.TYPE + "</td></tr>"+
                                            "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>"+
                                            "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>"+
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
            $.getJSON("data/shelters.geojson", function (data) {
                theaters.addData(data);
            });


            map = L.map("map", {
                zoom: 10,
                center: [35.1553609, 136.9660005],
                layers: [mapquestOSM, theaters]
            });

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
                $("#loading").hide();
                $("#searchbox").typeahead([
                {
                    name: "Theaters",
                    local: theaterSearch,
                    minLength: 2,
                    limit: 10,
                    header: "<h4 class='typeahead-header'><img src='img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>"
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
                    if (datum.layer === "Theaters") {
                        if (!map.hasLayer(theaters)) {
                            map.addLayer(theaters);
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
            // follow current location
            var watchID;
            var showLoc = function showLocation(position) {
              console.log(position.coords);
              var radius = position.coords.accuracy / 2;;
              var latitude = position.coords.latitude;
              var longitude = position.coords.longitude;
              map.setView([latitude,longitude],17);
              L.circle(L.latLng(latitude, longitude), radius).addTo(map);
            }        
            var locError = function errorHandler(err) {
                if (err.code == 1) {
                  alert("Error: Access is denied!");
              } else if (err.code == 2) {
                  alert("Error: Position is unavailable!");
              }
            }
            if (navigator.geolocation){
               var options = { timeout: 60000 };
               var geoLoc = navigator.geolocation;
               watchID = geoLoc.watchPosition(showLoc, locError, options);
            }
}); 
function showCard(value){
  var title = "";
  var img = "";
  var desc = "";
  switch (value){
    case "1":
      title = "火災発生";
      img = "img2/fire.png";
      desc = "覚王山で火災が発生しました！<br/>覚王山周辺は通行止めとなります 。";
      break;
    case "2":
      title = "橋の崩壊";
      img = "img2/bridge.png";
      desc = "千種橋が崩壊しました！千種橋は通行できません。";
      break;
    case "3":
      title = "川の氾濫";
      img = "img2/flood.png";
      desc = "庄内川の堤防が決壊しました！<br/>庄内川より南は通行できません。";
      break;
    default:
      return;
  }
  $("#card-title").html(title);
  $("#card-image").attr("src",img);
  $("#card-description").html(desc);
  $("#featureCard").modal("show");
}
