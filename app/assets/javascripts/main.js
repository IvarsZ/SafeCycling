  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var map, pointArray, heatmap, mgr, markerCluster;

var taxiData = [];
var markers = [];

for (i=0; i< 1000; i++){

  var myLatlng = new google.maps.LatLng(getRandomArbitrary(getRandomArbitrary(51.4, 51.5), getRandomArbitrary(51.5, 51.61)),(getRandomArbitrary(getRandomArbitrary(-0.3, -0.1), getRandomArbitrary(0, 0.1))));
  taxiData[i] = myLatlng;
  var marker = new google.maps.Marker({
    position: myLatlng,
    title: "hello!"
  });
  markers.push(marker);
};

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(51.48, -0.05),
    zoom: 11,
    streetViewControl: false

  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  var pointArray = new google.maps.MVCArray(taxiData);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });

  heatmap.setMap(map);
  console.log("markers = " + markers.length);
  var markerCluster = new MarkerClusterer(map, markers);

  /*google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });*/
}


/*
function placeMarker(location) {
  console.log(location);
  var marker = new google.maps.Marker({
    position: location, 
    map: map
  });
  markers.push(marker);
  console.log("markers = " + markers.length);
  var markerCluster = new MarkerClusterer(map, markers);
  google.maps.event.trigger(map, 'resize');
}
*/


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

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function(){

  $('.stats').click(function() {

    $('.statsDiv').animate({
      right: "0px"
    });
    $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0.92)');

    var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(weekChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 14, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.5});
    var myDoughnut = new Chart(document.getElementById("donutcanvas").getContext("2d")).Doughnut(doughnutData);

    $('.submitDiv').animate({
      right: "-366px"
    });
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');

  });

  $('.submit').click(function() {

    $('.statsDiv').animate({
      right: "-366px",
    });
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
    $('.submitDiv').animate({
      right: "0px"
    });
    $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0.92)');

  });

  $('.glyphicon-remove').click(function() {

    $('.statsDiv').animate({
      right: "-366px"
    });
    setTimeout( function(){
      $('.statsDiv').css('background-color', 'rgba(46, 204, 113,0)');
    },500);
    $('.submitDiv').animate({
      right: "-366px"
    });
    setTimeout( function(){
      $('.submitDiv').css('background-color', 'rgba(46, 204, 113,0)');
    },500);

  });


  $('#week').click(function() {
    var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(weekChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 14, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.5});
  });
  $('#month').click(function() {
    var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(monthChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 14, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.5});
  });
  $('#year').click(function() {
    var myBarChart = new Chart(document.getElementById("barcanvas").getContext("2d")).Bar(yearChartData, {scaleFontColor: "#ecf0f1", scaleFontSize: 14, scaleGridLineColor : "rgba(255,255,255,0.75)",  scaleGridLineWidth : 0.5});
  });

});

var weekChartData = {
      labels: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
      datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(236, 240, 241,1.0)",
        strokeColor: "rgba(236, 240, 241 ,1.0)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: [12, 10, 6, 4, 8, 10, 14]
      },
      {
        label: "My Second dataset",
        fillColor: "rgba(189, 195, 199,1.0)",
        strokeColor: "rgba(189, 195, 199,1.0)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: [3, 5, 1, 4, 3, 7, 10]
      }
      ]
    };
    var monthChartData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(236, 240, 241,1.0)",
        strokeColor: "rgba(236, 240, 241 ,1.0)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: [45, 30, 32, 17]
      },
      {
        label: "My Second dataset",
        fillColor: "rgba(189, 195, 199,1.0)",
        strokeColor: "rgba(189, 195, 199,1.0)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: [13, 17, 3, 14]
      }
      ]
    }; var yearChartData = {
      labels: ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"],
      datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(236, 240, 241,1.0)",
        strokeColor: "rgba(236, 240, 241 ,1.0)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: [501, 432, 342, 638]
      },
      {
        label: "My Second dataset",
        fillColor: "rgba(189, 195, 199,1.0)",
        strokeColor: "rgba(189, 195, 199,1.0)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: [150, 65, 76, 247]
      }
      ]
    };

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
    }

    ];
