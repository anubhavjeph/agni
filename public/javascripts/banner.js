(function(window){

var current_state = 0;

var ids = Math.floor(Math.random()*10000+1);
var full = document.getElementById("fullview").children,
	full_view = document.getElementById("fullview"),
	startX,
	startY,
	endX,
	endY,
	app_id='banner_',
    heatmapsArr = [],
    states = 7,
    device_width =window.innerWidth;

    var body = document.body;
    var bodyStyle = getComputedStyle(body);
    var hmEl = document.getElementById('fullview');

    hmEl.style.width = bodyStyle.width;
    hmEl.style.height = '1400px';
    body.style.width = device_width+"px";

function resetPosition(){
    for(var i = 0 ; i<7 ; i++){
        var elm = document.getElementById("card_"+i);
        if(elm.getAttribute("data-location")==="left"){
            elm.style.left= "-"+device_width+"px";
        } else if(elm.getAttribute("data-location")==="right"){
            elm.style.left= device_width+"px";
        } else {
            elm.style.left = "0";
        }
    }
}

var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

if(WIDTH === 320 && HEIGHT === 568){

	device = "ip5";
}else if(WIDTH === 320 && HEIGHT === 480){
	device = "ip4";
}else{
	device = "android";
}

resetPosition();
var cardNodes = new Array(7);
if (heatmap == 'true') {
    for (var i = 0; i < 7; i++) {
        var config = {
            container: document.getElementById('card_' + i),
            radius: 30,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75
        };

        var heatmapInstance = h337.create(config);
        heatmapsArr.push(heatmapInstance);
    }

    var dataPoints = _.filter(heatmapData, function(point) {
        if (point.state == app_id + 0) {
            return true;
        }

        return false;
    });

    var data = {
        data: dataPoints
    };

    heatmapsArr[0].setData(data);
    heatmapsArr[0].repaint()
}

function init(){
    var cards = document.getElementsByClassName('card');
    var i=0;
    for(i=0; i < cards.length; i++){
        var ge_id = parseInt(cards[i].getAttribute('data-index'));
        cardNodes[ge_id] = cards[i];
    }
}

init();

function touchstart(event,obj){
    var taget = event.targetTouches[0];
    startX = taget.pageX;
    startY = taget.pageY;
}

var deadlock = 0;
function touchend(event,obj){

    var taget = event.changedTouches[0],
        interaction;
    if(startX === endX && startY === endY){
        event.preventDefault();
        return;
    }
    endX = taget.pageX;
    endY = taget.pageY;

    var deltaX = endX - startX,
        deltaY = endY - startY;

    var cardObj =  document.getElementsByClassName('card'),
        no_card = cardObj.length;

    if(startX === endX && startY === endY){
    	console.log(event);
    	var get_target = event.target;
    	console.log(get_target.tagName);
    	if(get_target.tagName === "IMG"){
    		var inven  = get_target.getAttribute("data-inventory"),
    			state = parseInt(full_view.getAttribute("data-state"));

    		sendInventory("ip4",state,inven);
    	}
    	return;

    }

    if(deltaX > 20 && (Math.abs(deltaY) < Math.abs(deltaX)) ){
    	deadlock =1;
    	setTimeout(function(){
			deadlock =0;
    	},500);
        interaction = 'swipe_right';
        var prev = current_state;
        if(current_state === 0){
            current_state = (cardNodes.length-1);

        }else{
            current_state = current_state -1;
        }

        full_view.setAttribute('data-state',current_state);
        cardNodes[current_state].setAttribute('data-location','current');
        cardNodes[prev].setAttribute('data-location','right');
        var store_last =  full[no_card-1];
        full[no_card-1].remove();
        store_last.setAttribute('data-location','left');
        full_view.insertBefore(store_last,full_view.childNodes[0]);
    }

    if(deltaX < -20 && (Math.abs(deltaY) < Math.abs(deltaX))) {
    	deadlock =1;
    	setTimeout(function(){
			deadlock =0;
    	},500);
        interaction = 'swipe_left';
        var prev = current_state;
        if(current_state === (cardNodes.length-1)){
            current_state = 0;
        }else{
            current_state = current_state +1;
        }
        full_view.setAttribute('data-state',current_state)
        cardNodes[current_state].setAttribute('data-location','current');
        cardNodes[prev].setAttribute('data-location','left');
        var store_first =  full[0];
        store_first.setAttribute('data-location','right');
        full[0].remove();
        full_view.appendChild(store_first);
    }
    resetPosition();

    if(heatmap === 'true'){
        heatmapData = heatmapData || [];
        var state = parseInt(full_view.getAttribute('data-state'));
        var dataPoints = _.filter(heatmapData, function(point) {
            if (point.state == app_id + state) {
                return true;
            }

            return false;
        });

   
        var data = {
            data: dataPoints
        };

        heatmapsArr[state].setData(data);
        heatmapsArr[state].repaint()
    } else {
       sendData(app_id,startX,startY,endX,endY,'i5',current_state,prev,interaction);
    }
}

sendDatastart(app_id,'ip5');


function sendInventory(device_1,state,inventory){
	  var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.onreadystatechange=function() {
      // if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      //   document.getElementById('myDiv').innerHTML=xmlhttp.responseText;
      // }
    }
    console.log(state);
    xmlhttp.open("POST","http://localhost:9000/api/cord?action_state=tap&app_id="+app_id+"&id="+ids+"&device="+device+"&node="+state+"&inven="+inventory+"&x="+startX+"&y="+startY+"&x1="+endX+"&y1="+endY,true);
    xmlhttp.send();
}

function sendDatastart(app_id,device_1){
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.onreadystatechange=function() {
      // if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      //   document.getElementById('myDiv').innerHTML=xmlhttp.responseText;
      // }
    }

    xmlhttp.open("POST","http://localhost:9000/api/cord?action_state=initalize&app_id="+app_id+"&id="+ids+"&device="+device+"&node=0",true);
    xmlhttp.send();
}

function sendData(app_id,x,y,x1,y1,device_1,node,prevnode,interaction,last_card){
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.onreadystatechange=function() {
      // if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      //   document.getElementById('myDiv').innerHTML=xmlhttp.responseText;
      // }
    }

     xmlhttp.open("POST","http://localhost:9000/api/cord?action_state=changestate&device_id="+ids+"&app_id="+app_id+"&x="+x+"&y="+y+"&x1="+x1+"&y1="+y1+"&device="+device+"&node="+node+"&prevnode="+prevnode+"&interaction="+interaction,true);
    xmlhttp.send();
}

window.touchstart = touchstart;
window.touchend = touchend;
// window.previousState = previousState;
// window.nextState = nextState;

})(window);