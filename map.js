var map;

function initMap() 
{
    map = new google.maps.Map(document.getElementById('map-div'), {
        center: { lat: 41.8781, lng: -87.6298 },
        zoom: 10
    });
}