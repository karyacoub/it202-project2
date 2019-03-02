var markers = [];

function getDataSet(status)
{
    // clear out current markers and cards
    clearMarkers();

    var url = "https://data.cityofchicago.org/resource/cdmx-wzbz.json?$limit=5";

    var wardNumber = $('#ward-number').val();

    // add necessary parameters to url
    if(wardNumber)
    {
        url = url + '&ward=' + wardNumber + '&status=' + status;
    }
    else
    {
        url = url + '&status=' + status;
    }

    $.get(url, function(response) {
        if(response.length > 0)
        {
            // change default center to something closer to results
            var newCenter = { lat: parseFloat(response[0].latitude), lng: parseFloat(response[0].longitude) };
            map.setCenter(newCenter);

            $.each(response, function(i, v) {
                var coordinates = { lat: parseFloat(v.latitude), lng: parseFloat(v.longitude) };

                generateMarker(coordinates, v.street_address);
            });
        }
    });
}

function generateMarker(coordinates, address)
{
    var marker = new google.maps.Marker({
        position: coordinates,
        title: address
    });

    // add marker to array so that they can be cleared when necessary
    markers.push(marker);

    marker.setMap(map);
}

function clearMarkers()
{
    markers.forEach(function(marker) {
        marker.setMap(null);
    });

    // clear out array
    markers.length = 0;
}

function generateCard()
{

}