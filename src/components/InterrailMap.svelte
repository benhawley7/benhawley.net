<script>
    import {onMount} from "svelte";
    let container;
    let map;

    const coordinates = [
        {
            location: "London",
            lat: 51.5074,
            lng: 0.1278,
            arrival: "2020-05-18T09:00",
            departure: "2020-05-18T11:00"
        },
        {
            location: "Amsterdam",
            lat: 52.3667,
            lng: 4.8945,
            arrival: "2020-05-18T15:00",
            departure: "2020-05-21T12:00"
        },
        {
            location: "Berlin",
            lat: 52.52,
            lng: 13.405,
            arrival: "2020-05-21T18:00",
            departure: "2020-05-26T12:00"
        },
        {
            location: "Prague",
            lat: 50.0755,
            lng: 14.4378,
            arrival: "2020-05-26T16:30",
            departure: "2020-05-29T12:00"
        },
        {
            location: "Bratislava",
            lat: 48.1486,
            lng: 17.1077,
            arrival: "2020-05-29T16:00",
            departure: "2020-06-01T09:00"
        },
        {
            location: "Vienna",
            lat: 48.2082,
            lng: 16.3738,
            arrival: "2020-06-01T10:00",
            departure: "2020-06-01T22:40"
        },
        {
            location: "Krakow",
            lat: 50.0647,
            lng: 19.945,
            arrival: "2020-06-02T06:00",
            departure: "2020-06-03T22:40"
        },
        {
            location: "Budapest",
            lat: 47.4979,
            lng: 19.0402,
            arrival: "2020-06-04T08:00",
            departure: "2020-06-08T14:00"
        },
        {
            location: "Ljubljana",
            lat: 46.0569,
            lng: 14.5058,
            arrival: "2020-06-08T20:00",
            departure: "2020-06-10T14:00"
        },
        {
            location: "Bled",
            lat: 46.3683,
            lng: 14.1146,
            arrival: "2020-06-10T16:00",
            departure: "2020-06-12T14:00"
        },
        {
            location: "Venice",
            lat: 45.4408,
            lng: 12.3155,
            arrival: "2020-06-12T22:00",
            departure: "2020-06-16T14:00"
        }
    ];

    const current = coordinates.find(coordinate => {
        const now = new Date();
        const departure = new Date(coordinate.departure);
        return now < departure;
    });

    onMount(_ => {
        map = new google.maps.Map(container, {
            center: {lat: 48.7758, lng: 9.1829},
            zoom: 5,
            styles: [
                {
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#212121"
                        }
                    ]
                },
                {
                    elementType: "labels.icon",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#757575"
                        }
                    ]
                },
                {
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            color: "#212121"
                        }
                    ]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#757575"
                        },
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.country",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#9e9e9e"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#bdbdbd"
                        }
                    ]
                },
                {
                    featureType: "administrative.neighborhood",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#757575"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#181818"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#616161"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            color: "#1b1b1b"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            color: "#2c2c2c"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels.icon",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#8a8a8a"
                        }
                    ]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#373737"
                        }
                    ]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#3c3c3c"
                        }
                    ]
                },
                {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#4e4e4e"
                        }
                    ]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#616161"
                        }
                    ]
                },
                {
                    featureType: "transit",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "transit",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#757575"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#000000"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "labels.text",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#3d3d3d"
                        }
                    ]
                }
            ]
        });

        const path = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#f26c4f",
            strokeOpacity: 1,
            strokeWeight: 3
        });

        path.setMap(map);

        for (const coordinate of coordinates) {
            const cityCircle = new google.maps.Circle({
                strokeColor: "#f26c4f",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#f26c4f",
                fillOpacity: 0.35,
                map: map,
                center: coordinate,
                radius: 6000
            });
        }
    });
</script>

<div class="map-container">
    <div class="map" bind:this={container} />
</div>

<style>
    .map-container {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .map {
        width: 100%;
        height: 60vh;
        max-height: 40rem;
        max-width: 80rem;
    }
</style>
