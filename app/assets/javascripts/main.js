  var map, pointArray, heatmap, mgr, markerCluster, newMarker, newLat, newLng, geocoder;

  var markerData = [];
  var markers = [];
  var mPlace = false;
  var isPlaced = false;

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.alert("This site isn't currently optimised for mobile devices. We're working on it as fast as we can. We recommend using a computer or tablet for now.");
  }

  function modifyUrl(urlPath){
    window.history.pushState(null,"", urlPath);
  };
  modifyUrl("?#about");

 function initialize() {
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    center: new google.maps.LatLng(51.48, -0.05),
    zoom: 12,
    streetViewControl: false
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  var pointArray = new google.maps.MVCArray(markerData);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });


  heatmap.setMap(map);
  console.log("markers = " + markers.length);
  var markerCluster = new MarkerClusterer(map, markers);

  google.maps.event.addListener(map, 'click', function(event) {
    mapZoom = map.getZoom();
    startLocation = event.latLng;
    console.log(startLocation);
    placeMarker(startLocation);
    newLat = event.latLng.lat();
    newLng = event.latLng.lng();
  });

  function placeMarker(location) {
    if (mPlace == true){
      if (isPlaced == true) {
        newMarker.setMap(null);
      }
      newMarker = new google.maps.Marker({
        position: location,
        map: map
      });
      $(".btn-place").html('<i class="fa fa-check"></i> Marker placed').button('refresh');
      mPlace = false;
      isPlaced = true;
    }
  }
}

function updateStats(response) {
  var i = 0, len = response.length;

  var busC = 0, carC = 0, motorcycleC = 0, pedestrianC = 0, lorryC = 0, vanC = 0, taxiC = 0, bicycleC = 0, totalC = 0;

  for ( ; i < len ; i++ ) {

    var parts = response[i].vehicle.split(',');
    var j = 0, lenP = parts.length;
    for ( ; j < len ; j++ ) {
      totalC++;
      switch(parts[j]) {
        case "bus":
        busC++;
        break;
        case "car":
        carC++;
        break;
        case "motorcycle":
        motorcycleC++;
        break;
        case "pedestrian":
        pedestrianC++;
        break;
        case "lorry":
        lorryC++;
        break;
        case "van":
        vanC++;
        break;
        case "taxi":
        taxiC++;
        break;
        case "bicycle":
        bicycleC++;
      }
    }
  }
  doughnutData[0].value = (100.0 * busC)/totalC;
  doughnutData[1].value = (100.0 * motorcycleC)/totalC;
  doughnutData[2].value = (100.0 * carC)/totalC;
  doughnutData[3].value = (100.0 * pedestrianC)/totalC;
  doughnutData[4].value = (100.0 * lorryC)/totalC;
  doughnutData[5].value = (100.0 * vanC)/totalC;
  doughnutData[6].value = (100.0 * taxiC)/totalC;
  doughnutData[7].value = (100.0 * bicycleC)/totalC;

  // For showing accidents per each hour, [0] is 00.00 i.e 12am.
  var timeCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  var i = 0, len = response.length;

  for ( ; i < len ; i++ ) {
    var h = new Date(response[i].time).getHours();
    timeCounts[h]++;
  }
  console.log(timeCounts);


  var weekChartData = {
    labels: ["00", "", "", "03", "", "", "06","", "", "09", "", "", "12","", "", "15", "", "", "18","", "", "21", "", ""],
    datasets: [
    {
      label: "My First dataset",
      fillColor: "rgba(236, 240, 241,1.0)",
      strokeColor: "rgba(236, 240, 241 ,1.0)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: timeCounts
    }
    ]
  };

  var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(weekChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 11, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.6});
}

function getAllAccidents() {  
  $.ajax({
    url : "/accidents/all_accidents",
    type : "GET",
    success: function (resp) {
      console.log("resp =" + resp);
      response = resp;

      var i = 0, len = response.length;
      for
       ( ; i < len ; i++ ){
        var myLatlng = new google.maps.LatLng(response[i].lat, response[i].lng);
        markerData[i] = myLatlng;
        if (response[i].severity == "hospital"){
          var marker = new google.maps.Marker({
            position: myLatlng,
            icon: 'assets/hospital.png',
            severity: 'hospital',
            datetime: response[i].time,
            vehicle: response[i].vehicle,
            description: response[i].description
          });
        }
        else if (response[i].severity == "minor"){
          console.log(response[i].severity);
          var marker = new google.maps.Marker({
            position: myLatlng,
            icon: 'assets/minor.png',
            severity: 'minor',
            datetime: response[i].time,
            vehicle: response[i].vehicle,
            description: response[i].description
          });
          console.log("marker added");
        }      
        else {
          var marker = new google.maps.Marker({
            position: myLatlng,
            icon: 'assets/death.png',
            severity: 'death',
            datetime: response[i].time,
            vehicle: response[i].vehicle,
            description: response[i].description
          });
        }
        google.maps.event.addListener(marker, 'click', function() {
          console.log(this.position);
          $('.statsDiv').animate({
            right: "-386px",
          });
          $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0)');
          $('.detailDiv').animate({
            right: "-20px"
          });
          $('.detailDiv').css('background-color', 'rgba(46, 204, 113,0.92)');
          $('.submitDiv').animate({
            right: "-386px"
          });
          $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
          $('.aboutDiv').animate({
            right: "-386px"
          });
          $('.aboutDiv').css('background-color', 'rgba(46, 204, 113,0)');
          d = new Date(this.datetime);
          geocoder.geocode({'latLng': this.position}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                $(".detailLocation").html('<i class="fa fa-calendar"></i>  ' + results[1].formatted_address);
                $(".detailDate").html('<i class="fa fa-clock-o"></i>  ' + d);
              } else {

              }
            } else {
            }
          });
          if (this.severity == "minor"){
            $('.detailDiv > .btn-minor').addClass('btn-active');
            $('.detailDiv > .btn-hospital').removeClass('btn-active');
            $('.detailDiv > .btn-death').removeClass('btn-active');
          }
          else if (this.severity == "hospital") {
            $('.detailDiv > .btn-minor').removeClass('btn-active');
            $('.detailDiv > .btn-hospital').addClass('btn-active');
            $('.detailDiv > .btn-death').removeClass('btn-active');
          }
          else {
            $('.detailDiv > .btn-minor').removeClass('btn-active');
            $('.detailDiv > .btn-hospital').removeClass('btn-active');
            $('.detailDiv > .btn-death').addClass('btn-active');
          }
          $('.detail-involved-div').html("");
          if (this.vehicle.match("bus")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #3498db; color: white">Bus</button>');
          }
          if (this.vehicle.match("motorcycle")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #e74c3c; color: white">Motorcycle</button>');
          }
          if (this.vehicle.match("car")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #f1c40f; color: white">Car</button>');
          }
          if (this.vehicle.match("van")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #2ecc71; color: white">Van</button>');
          }
          if (this.vehicle.match("lorry")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #9b59b6; color: white">Lorry</button>');
          }
          if (this.vehicle.match("pedestrian")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #34495e; color: white">Pedestrian</button>');
          }
          if (this.vehicle.match("taxi")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #ecf0f1; color: gray">Taxi</button>');
          }
          if (this.vehicle.match("bicycle")){
            $('.detail-involved-div').append('<button type="button" class="btn btn-default" style="background-color: #1abc9c; color: white">Bicycle</button>');
          }
          $('.detailDescription').text(this.description);
    });
  markers.push(marker);      
};
updateStats(resp);
initialize();
},
error: function(err) { console.log("error get: " + err) }
});
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
  'rgba(0, 255, 255, 0)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(0, 127, 255, 1)',
  'rgba(0, 63, 255, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 0, 223, 1)',
  'rgba(0, 0, 191, 1)',
  'rgba(0, 0, 159, 1)',
  'rgba(0, 0, 127, 1)',
  'rgba(63, 0, 91, 1)',
  'rgba(127, 0, 63, 1)',
  'rgba(191, 0, 31, 1)',
  'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function loadMapScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript'
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=visualization&callback=loadClusterScript';
  document.body.appendChild(script);
}
function loadClusterScript() {
  $.getScript('http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.0.1/src/markerclusterer.js', function(){
    getAllAccidents();
  });
}
window.onload = loadMapScript;

$(document).ready(function(){

  $('.stats').click(function() {

    $('.statsDiv').animate({
      right: "-20px"
    });
    $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0.92)');
    var myDoughnut = new Chart(document.getElementById("donutcanvas").getContext("2d")).Doughnut(doughnutData);

    $('.submitDiv').animate({
      right: "-386px"
    });
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.detailDiv').animate({
      right: "-386px"
    });
    $('.aboutDiv').animate({
      right: "-386px"
    });
    $('.detailDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.aboutDiv').css('background-color', 'rgba(46, 204, 113,0)');
  });

  $('.submit').click(function() {
    $('.submitDiv').animate({
      right: "-20px"
    });
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0.92)');
    $('.statsDiv').animate({
      right: "-386px",
    });
    $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.detailDiv').animate({
      right: "-386px"
    });
    $('.aboutDiv').animate({
      right: "-386px"
    });
    $('.detailDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.aboutDiv').css('background-color', 'rgba(46, 204, 113,0)');
  });

  $('.about').click(function() {
    $('.aboutDiv').animate({
      right: "-20px"
    });
    $('.aboutDiv').css('background-color', 'rgba(46, 204, 113,0.92)');
    $('.statsDiv').animate({
      right: "-386px",
    });
    $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.detailDiv').animate({
      right: "-386px"
    });
    $('.submitDiv').animate({
      right: "-386px"
    });
    $('.detailDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
  });

  $('.btn-minor').click(function() {

    $(this).addClass('btn-active');
    $('.btn-hospital').removeClass('btn-active');
    $('.btn-death').removeClass('btn-active');
  });

  $('.btn-hospital').click(function() {

    $(this).addClass('btn-active');
    $('.btn-minor').removeClass('btn-active');
    $('.btn-death').removeClass('btn-active');
  });

  $('.btn-death').click(function() {

    $(this).addClass('btn-active');
    $('.btn-hospital').removeClass('btn-active');
    $('.btn-minor').removeClass('btn-active');
  });

  $('.btn-place').click(function() {
    mPlace = true;
  });


$('.glyphicon-remove').click(function() {

    $('.statsDiv').animate({
      right: "-386px"
    });
    setTimeout( function(){
      $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0)');
    },500);
    $('.submitDiv').animate({
      right: "-386px"
    });
    setTimeout( function(){
      $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
    },500);
    $('.detailDiv').animate({
      right: "-386px"
    });
    $('.aboutDiv').animate({
      right: "-386px"
    });
    setTimeout( function(){
      $('.detailDiv').css('background-color', 'rgba(46, 204, 113,0)');
      $('.aboutDiv').css('background-color', 'rgba(46, 204, 113,0)');
    },500);

  });


  $('#week').click(function() {
    var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(weekChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 14, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.5});
  });

    // FORM SUBMIT
    $('.incSubmit').click(function() {
      time = $('#time').val();
      date = $('#date').val();
      datetime = date + "T" + time + ":00";
      if ($('.btn-minor').hasClass('btn-active')){
        severity = "minor"
      }
      else if ($('.btn-hospital').hasClass('btn-active')){
        severity = "hospital"
      }
      else {
        severity = "death"
      }
      var vehicle = [];
      $('.involved-div :checked').each(function () {
        vehicle.push($(this).val());
      });
      vehicle = vehicle.join(",");
      description = $('#description').val();
      lat = newLat;
      lng = newLng;
      data = {"accident" : {"time" : datetime, "severity" : severity, "vehicle" : vehicle, "description" : description, "lat" : lat, "lng" : lng}};

      if (time && date && severity && (vehicle != []) && lat && lng) {


        $.ajax({
          url : "/accidents/create_accident",
          type : "POST",
          data : data,
          success : function(response){
          },
          error: function(err){
          }
        });
        $(".btn-place").html('<i class="fa fa-map-marker"></i> Place Marker').button('refresh');
        $('#time').val("");
        $('#date').val("");
        $('input:checkbox').removeAttr('checked');
        newLat = 0;
        newLng = 0;
        isPlaced = false;
      }
    });

});

  var doughnutData = [
  {
    value : 60,
    color : "#3498db"
  },
  {
    value : 25,
    color : "#e74c3c"
  },
  {
    value : 15,
    color : "#f1c40f"
  },
  {
    value : 15,
    color : "#2ecc71"
  },
  {
    value : 15,
    color : "#9b59b6"
  },
  {
    value : 15,
    color : "#34495e"
  },
  {
    value : 15,
    color : "#ecf0f1"
  },
  {
    value : 15,
    color : "#1abc9c"
  }

  ];
