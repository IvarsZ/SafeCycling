  var map, pointArray, heatmap, mgr, markerCluster, newMarker, newLat, newLng;

  var markerData = [];
  var markers = [];
  var mPlace = false;
  var isPlaced = false;

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(51.48, -0.05),
      zoom: 12,
      streetViewControl: false
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
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



  $.ajax({
    url : "/accidents/all_accidents",
    type : "GET",
    success: function (resp) {
      console.log("resp =" + resp);
      response = resp;

      var i = 0,
      len = response.length;
      for
       ( ; i < len ; i++ ){
        var myLatlng = new google.maps.LatLng(response[i].lat, response[i].lng);
        markerData[i] = myLatlng;
        console.log(response[i].severity);
        if (response[i].severity == "hospital"){
          var marker = new google.maps.Marker({
            position: myLatlng,
            title: "hello!",
            icon: 'assets/hospital.png'
          });
        }
        else if (response[i].severity == "minor"){
          var marker = new google.maps.Marker({
            position: myLatlng,
            title: "hello!",
            icon: 'assets/minor.png'
          });
        }      
        else {

          var marker = new google.maps.Marker({
            position: myLatlng,
            title: "hello!",
            icon: 'assets/death.png'
          });
        }
        markers.push(marker);      
      };
    },
    error: console.log("error get")
  });





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
      var vehicles = [];
      $('.involved-div :checked').each(function () {
        vehicles.push($(this).val());
      });
      vehicles = vehicles.join(",");
      lat = newLat;
      lng = newLng;
      data = {"accident" : {"time" : datetime, "severity" : severity, "vehicle" : vehicles, "lat" : lat, "lng" : lng}};
      console.log("data = " + data);

      if (time && date && severity && (vehicles != []) && lat && lng) {


        $.ajax({
          url : "/accidents/create_accident",
          type : "POST",
          data : data,
          success : function(response){
            console.log("Success! Response = " + response);
          },
          error: function(err){
            console.log("Something went wrong. Err = " + err);
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
