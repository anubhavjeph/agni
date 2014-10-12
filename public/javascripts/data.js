  var DataTemplate = ' \
    <div class="accordion" id="accordion"> \
      <% _.each(users, function(val, user) { %> \
        <div class="accordion-group"> \
          <div class="accordion-heading"> \
            <span class="pull-right" > </span> \
            <% if (val[0].lr > 0 ) { img = "/img/right_hand.png"; } else { img = "/img/left_hand.png"; } %> \
            <a class="accordion-toggle" style="background:url(<%= img %>) no-repeat 100%" data-toggle="collapse" data-parent="#accordion" href="#<%= user %>"> \
              Device ID <%= user.replace("swipe_left", "") %> \
            </a> \
          </div> \
          <div id="<%= user %>" class="accordion-body collapse"> \
          <div class="accordion-inner"> \
            <div class="card pull-left" id="card_<%= user %>_android"> \
            <img src="/img/android.png"></img> \
            </div> \
            <div class="card pull-left" id="card_<%= user %>_ios"> \
            <img src="/img/ios.png"></img> \
            </div> \
          </div> \
        </div> \
       </div> \
      <% }); %> \
    </div> \
  ';

  var testTemplate = _.template(DataTemplate);
  var tempHTML = testTemplate({ users: users });
  $('.wrapper').append(tempHTML);

_.each(users, function(val ,user) {
  var config = {
      container: document.getElementById('card_' + user + '_android'),
      radius: 30,
      maxOpacity: .5,
      minOpacity: 0,
      blur: .75
  };

  var dataPoints = _.filter(val, function(point) {
    if (point['x.device'] == 'android') { return true }
    return false;
  });

  var data = {
      data: dataPoints
  };

  var heatmapInstance = h337.create(config);
  console.log('card_'+ user + '_android', val);
  heatmapInstance.setData(data);

  // heatmapInstance.repaint();
  // heatmapsArr.push(heatmapInstance);
});

_.each(users, function(val ,user) {
  var config = {
      container: document.getElementById('card_' + user + '_ios'),
      radius: 30,
      maxOpacity: .5,
      minOpacity: 0,
      blur: .75
  };

  var dataPoints = _.filter(val, function(point) {
    if (point['x.device'] == 'ip5' || point['x.device'] == 'ip4') { return true; }
    return false;
  });

  var data = {
      data: dataPoints
  };

  var heatmapInstance = h337.create(config);
  console.log('card_'+ user + '_ios', val);
  heatmapInstance.setData(data);

  // heatmapInstance.repaint();
  // heatmapsArr.push(heatmapInstance);
});

// var dataPoints = _.filter(heatmapData, function(point) {
//     if (point.state == app_id + 0) {
//         return true;
//     }

//     return false;
// });

// var data = {
//     data: dataPoints
// };

// heatmapsArr[0].setData(data);
// heatmapsArr[0].repaint()
