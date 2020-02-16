<script>
    import { onMount } from "svelte";
    import Grid from "./GridContainer.svelte";
    import DestinationCard from "./DestinationCard.svelte";
    let container;
    let map;

    const coordinates = [
      { location: "London", lat: 51.5074, lng: 0.1278, arrival: "2020-05-18T09:00", departure: "2020-05-18T11:00" },
      { location: "Amsterdam", lat: 52.3667, lng: 4.8945,  arrival: "2020-05-18T15:00", departure: "2020-05-21T12:00" }, 
      { location: "Berlin", lat: 52.52, lng: 13.405,  arrival: "2020-05-21T18:00", departure: "2020-05-26T12:00" },
      { location: "Prague", lat: 50.0755, lng: 14.4378, arrival: "2020-05-26T16:30", departure: "2020-05-29T12:00" },
      { location: "Bratislava", lat: 48.1486, lng: 17.1077, arrival: "2020-05-29T16:00", departure: "2020-06-01T09:00" },
      { location: "Vienna", lat: 48.2082, lng: 16.3738, arrival: "2020-06-01T10:00", departure: "2020-06-01T22:40" },
      { location: "Krakow", lat: 50.0647, lng: 19.945, arrival: "2020-06-02T06:00", departure: "2020-06-03T22:40" },
      { location: "Budapest", lat: 47.4979, lng: 19.0402, arrival: "2020-06-04T08:00", departure: "2020-06-08T14:00" },
      { location: "Ljubljana", lat: 46.0569, lng: 14.5058, arrival: "2020-06-08T20:00", departure: "2020-06-10T14:00" },
      { location: "Bled", lat: 46.3683, lng: 14.1146,  arrival: "2020-06-10T16:00", departure: "2020-06-12T14:00" },
      { location: "Venice", lat: 45.4408, lng: 12.3155, arrival: "2020-06-12T22:00", departure: "2020-06-16T14:00" }
    ];

    const current = coordinates.find(coordinate => {
        const now = new Date();
        const departure = new Date(coordinate.departure);
        return now < departure; 
    });

    console.log(current);

    onMount(_ => {
        map = new google.maps.Map(container, {
        center: { lat: 48.7758, lng: 9.1829 },
        zoom: 5,
        styles: [
            {
                elementType: "geometry",
                stylers: [
                    {
                        color: "#242f3e"
                    }
                ]
            },
            {
                elementType: "labels.text.fill",
                stylers: [
                    {
                        color: "#746855"
                    }
                ]
            },
            {
                elementType: "labels.text.stroke",
                stylers: [
            {
              color: "#242f3e"
            }
          ]
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#d59563"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#d59563"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#263c3f"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#6b9a76"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              color: "#38414e"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#212a37"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9ca5b3"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              color: "#746855"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#1f2835"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#f3d19c"
            }
          ]
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            {
              color: "#2f3948"
            }
          ]
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#d59563"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#17263c"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#515c6d"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#17263c"
            }
          ]
        }
      ]
    });

    const path = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: "#13d3a3",
      strokeOpacity: 1,
      strokeWeight: 3
    });

    path.setMap(map);

    for (const coordinate of coordinates) {
          const cityCircle = new google.maps.Circle({
            strokeColor: '#13d3a3',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#13d3a3',
            fillOpacity: 0.35,
            map: map,
            center: coordinate,
            radius: 6000
          });
    }
  });
</script>

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

<div class="map-container">
  <div class="map" bind:this={container} />
</div>
<Grid>
{#each coordinates as location, i}
    <DestinationCard 
        location={location.location} 
        arrivalDateTime={location.arrival} 
        departureDateTime={location.departure} 
        number={i + 1}/>
{/each}
</Grid>


