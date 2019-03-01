function getDataSet(status)
{
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

    console.log(url);

    $.get(url, function(response){
        console.log(response);
    });
}

function generateMarkers()
{

}

function generateCards()
{

}