var markers = [];
var cardTemplate = $('.card').clone();
var icons = 
    {
        open: 'assets/icons/open.png',
        completed: 'assets/icons/completed.png'
    };

function getDataSet(status)
{
    // clear out current markers and cards
    clearMarkers();
    clearCards();

    var url = "https://data.cityofchicago.org/resource/cdmx-wzbz.json?$limit=5";

    var wardNumber = $('#ward-number').val();

    // add necessary parameters to url
    if(wardNumber)
    {
        url = url + '&ward=' + wardNumber;
    }
    if(!(status ==='Both'))
    {
        url = url + '&status=' + status;
    }

    // check if ward number is valid
    if(wardNumber <= 0 || wardNumber > 50)
    {
        generateInvalidWardNumber();
        return;
    }

    $.get(url, function(response) {
        if(response.length > 0)
        {
            // change default center to something closer to results
            var newCenter = { lat: parseFloat(response[0].latitude), lng: parseFloat(response[0].longitude) };
            map.setCenter(newCenter);

            $.each(response, function(i, v) {
                var coordinates = { lat: parseFloat(v.latitude), lng: parseFloat(v.longitude) };

                var address = v.street_address;
                var currentStatus = v.status;
                var serviceRequestNum = v.service_request_number;
                var location = v.where_is_the_graffiti_located_;
                var surfaceType = v.what_type_of_surface_is_the_graffiti_on_;
                var creationDate = v.creation_date;
                var completionDate = (v.completion_date ? v.completion_date : "N/A");

                generateUIElements(coordinates, address, currentStatus, serviceRequestNum, location, surfaceType, creationDate, completionDate);
            });
        }
    });
}

function generateUIElements(coordinates, address, currentStatus, serviceRequestNum, location, surfaceType, creationDate, completionDate)
{
    var marker = generateMarker(coordinates, address, currentStatus);
    generateInfoWindow(marker, address, currentStatus, serviceRequestNum, location, surfaceType, creationDate, completionDate);
    generateCard(address, currentStatus, serviceRequestNum, location, surfaceType, creationDate, completionDate);
}

function generateMarker(coordinates, address, status)
{
    var iconImage = (status === 'Open' ? icons.open : icons.completed);

    var marker = new google.maps.Marker({
        position: coordinates,
        title: address,
        icon: 
        {
            size: new google.maps.Size(25, 25),
            scaledSize: new google.maps.Size(25, 25),
            url: iconImage
        }
    });

    // add marker to array so that they can be cleared when necessary
    markers.push(marker);

    marker.setMap(map);

    return marker;
}

function generateInfoWindow(marker, address, status, serviceRequestNum, location, surfaceType, creationDate, completionDate)
{
    var contentString = '<div>'
                      +    '<h5><b>' + address + '</b> (' + status + ')</h5>'
                      +    '<h6>Service Request #' + serviceRequestNum + '</h6>'
                      +    '<p>' + location + '</p>'
                      +    '<p><b>Surface type: </b>' + surfaceType + '</p>'
                      +    '<p><b>Created on: </b>' + creationDate + '</p>'
                      +    '<p><b>Completed on: </b>' + completionDate + '</p>'
                      + '</div>';

    var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}

function generateCard(address, status, serviceRequestNum, location, surfaceType, creationDate, completionDate)
{
    var card = cardTemplate.clone();
    card.removeAttr('hidden');
    card.find('#address-and-status').text(address + ' (' + status + ')');
    card.find('#service-request-num').text('Service Request #' + serviceRequestNum);
    card.find('#location').text(location);
    card.find('#surface-type').text('Surface type: ' + surfaceType);
    card.find('#creation-date').text('Created on: ' + creationDate);
    card.find('#completion-date').text('Completed on: ' + completionDate);
    
    card.appendTo('#list');
}

function generateInvalidWardNumber()
{
    var containerDiv = $('<div>');
    var invalidHeader = $('<h1>');
    var invalidSubtitle = $('<p>');

    containerDiv.addClass('container');
    invalidHeader.addClass('display-4');
    invalidSubtitle.addClass('lead');
    
    invalidHeader.text('Invalid ward number');
    invalidSubtitle.text('Please enter a number from 1 to 50.');

    containerDiv.append(invalidHeader);
    containerDiv.append(invalidSubtitle);

    $('#list').append(containerDiv);
}

function clearMarkers()
{
    markers.forEach(function(marker) {
        marker.setMap(null);
    });

    // clear out array
    markers.length = 0;
}

function clearCards()
{
    $('#list').empty();
}