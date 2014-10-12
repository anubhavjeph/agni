(function (window) {
    (function(w) {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'],x;
        for(x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
            w.requestAnimationFrame = w[vendors[x]+'RequestAnimationFrame'];
            w.cancelAnimationFrame = w[vendors[x]+'CancelAnimationFrame']
                || w[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!w.requestAnimationFrame){
            w.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = w.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!w.cancelAnimationFrame){
            w.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }

        w.requestTimeout = function(fn, delay) {
            if( !w.requestAnimationFrame)
                return w.setTimeout(fn, delay);

            var start = new Date().getTime(),
                handle = new Object();

            function loop(){
                var current = new Date().getTime(),
                    delta = current - start;
                delta >= delay ? fn.call() : handle.value = w.requestAnimationFrame(loop);
            };

            handle.value = w.requestAnimationFrame(loop);
            return handle;
        };

        w.clearRequestTimeout = function(handle) {
            w.cancelAnimationFrame(handle.value);
        };


    }(window));


    var mraidAvail = false;
    var DISPLAY = 'display', BLOCK = 'block', NONE = 'none', WEB_KIT_TRANSFORM = '-webkit-transform', VISIBILITY = 'visibility', HIDDEN = 'hidden', VISIBLE = 'visible', INDEX = 'index';
    var documentReference = document, mraid = window.mraid,
        querySelector = function ( parentNode, selector) {
            if (!parentNode) {
                parentNode = documentReference
            }
            return parentNode.querySelector(selector)
        },
        setStyle = function (node, styleAttribute, styleValue) {
            node.style[styleAttribute] = styleValue;
        }, showNode = function (node) {
            setStyle(node, DISPLAY, BLOCK);
        }, setTransform = function (node, styleValue) {
            setStyle(node, WEB_KIT_TRANSFORM, styleValue);
        }, getElementById = function (id) {
            return documentReference.getElementById.call(documentReference, id);
        }, createElement = function (tagName) {
            return documentReference.createElement.call(documentReference, tagName);
        }, getInteger = function (value) {
            return parseInt(value, 10);
        }, getFloat = function (value) {
            return parseFloat(value);
        }, getAttribute = function (node, attributeName) {
            return node.getAttribute(attributeName);
        }, getCardIndex = function (node) {
            return getInteger(getAttribute(node, INDEX));
        },setAttributes = function(node, attributesMap){
            for(var attribute in attributesMap){
                node.setAttribute(attribute, attributesMap[attribute]);
            }
        };


    var touchobj = null ,
        currentCard = null,
        MAIN_HEIGHT = 360 ,
        deckLock = null,
        cardsLength,
        maxCardIndex,
        minCardIndex,
        allCards = [],
        maxZ = 3,
        ss= [],mediumZ = 1,
        minZ = 0,
        currentCategory,
        timeStayed,
        storyBoardArr = [],
        completed = false,
        idbase = "card-",
        data = [],
        bodyHeight,
        bodyWidth,
        body = document.body,
        fullViewDiv = getElementById('fullview'),
        headerDiv = getElementById('header'),
        deckWrapperDiv = getElementById("deck_wrapper"),
        bottomDeck = getElementById('bottomdeck'),
        orientOverlay = getElementById('orientOverlay'), 
        tagPanel = getElementById('storytagOverlay'),
        taglinetext = getElementById('taglinetext'),
        initCard = null,
        freeimgArr = [document.createElement('img'),document.createElement('img'),document.createElement('img'),document.createElement('img'),document.createElement('img'),document.createElement('img')],
        imageLoadArr = [],
        recordCount = 0,
        startCardIndex,
        totalCount = 0,
        storyBoardId = 1,
        timeStamp1,
        cardArr = [],
        srInd ,
        endInd,
        inmobiAIVersion,
        sdkVersion,
        im_imai = window._im_imai,
        notifyArr= [],
        isIphone4 = false,
        skStoreSessionSt,
        isSkstoreThere,
        skStoreLaunchTime,
        DETACH=0,
        STARTPOS,minz,mediumz ,maxz,
        iosdevType = 'i5',
        serverdataload,
        topmove = false,
        weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        helpflag = true,
        newchange = true,
        appid =1,
        statesid = "a",
        last_interaction=null,
        last_card = null,
        send_card = null;

    function appStateGraph(){

        this.circular = false;

    }

    appStateGraph.prototype.generatestate= function(){

    }


    function collapse() {
        mraid.close();
        notifyArr = [];
    }

    var tagObj = {
        "rising":{
            val : "Rising Star",
            img : "risingstar"
        },
        "trending":{
            val : "Trending Now",
            img : "trending"
        },
        "editor":{
            val : "Editor's Choice",
            img : "editorial"
        }
    }
//    var tagArr = [{
//        val : "Editor's Choice",
//        img : "editorial"
//    },{
//        val : "Trending Now",
//        img : "trending"
//    },{
//        val : "Rising Star",
//        img : "risingstar"
//    }];

    function getTagObj(obj) {
        var val = obj[0];
        return  tagObj[val]? "<i class ='sprite splContainer' ><i class='sprite "+tagObj[val].img + "' ></i></i><span class='spltext'>" + tagObj[val].val + "</span>" :"";
    }


    function scaffold() {
        var str= "<div class='shadow one'></div><div class='shadow two'></div>";
        var ele = createElement('div');
        ele.innerHTML = str;
        deckWrapperDiv.appendChild(ele.children[0]);
        deckWrapperDiv.appendChild(ele.children[0]);
        tagPanel.classList.remove('hide');

       // var currentCardIndex = getCardIndex(currentCard);
        


       //  var previousCard = ss[getPreviousIndex(currentCardIndex)];
       //  var nextCard = ss[getNextIndex(currentCardIndex)];
        

        // if (currentCard) {
        //     // timeStamp1 = new Date().getTime();
        //     // var currentFlipper = querySelector(currentCard, '.flipper');


        // // requestTimeout(function(){
        // //     tagPanel.classList.remove('hide');
        // //     // tagPanel.classList.add('gotop');
        // //     tagPanel.addEventListener("webkitTransitionEnd" ,function(){
                
        // //         requestTimeout(function(){
        // //             // tagPanel.style.webkitTransform = 'scale(0.5)';
        // //             // tagPanel.style.top = -100 + "px";
        // //             // tagPanel.style.opacity = 0;
        // //             setTransform(currentCard, 'translate3d(0, -' + MAIN_HEIGHT + 'px,' + maxZ+ 'px) scale(1)');
        // //             setTransform(previousCard,'translate3d(0, -' + MAIN_HEIGHT + 'px,' + mediumZ + 'px) scale(1)');
        // //             setTransform(nextCard,'translate3d(0, 0px,' + maxZ + 'px) scale(.8)');
        // //         },50);
        // //     })
            
            
        // // },500);

        // // requestTimeout(function(){
        // //     // tagPanel.classList.remove('lazyup');
        // //     // tagPanel.classList.add('lazytop');
        // // },3000);
        // }
    }

    window.addEventListener("offline", function(e) {
//        var element = document.querySelector('.offline');
//        element.style.display = "block";
    }, false);

    window.addEventListener("online", function(e) {
//        var element = document.querySelector('.offline');
//        element.style.display = "none";

    }, false);


    function resizeBody() {
        if (typeof mraidAvail != "undefined" && mraidAvail) {

            var dimensions = mraid.getScreenSize();
            if(dimensions.width > dimensions.height){
                //landscape
                bodyWidth = dimensions.height;
                bodyHeight = dimensions.width;

            }else{
                fullViewDiv.classList.add('portrait');
                bodyWidth = dimensions.width;
                bodyHeight = dimensions.height;

            }
        }
        else {
            bodyWidth = window.innerWidth;
            bodyHeight = window.innerHeight;
        }
        if (bodyWidth >= 320 && bodyHeight <= 480) {
            bottomDeck.style.height = "310px";
            bottomDeck.style.top = "320px";
            body.classList.add('ip4');
            MAIN_HEIGHT = 270;
            touchIdentifierDistance = 35;
            isIphone4 = true;
            iosdevType = "i4"
            // removeRev();
        }
        else if (bodyHeight === 568) {
            bottomDeck.style.height = "380px";
            bottomDeck.style.top = "380px";
            MAIN_HEIGHT = 330;
            touchIdentifierDistance = 35;
        }
        else if (bodyHeight === 640) {
            // alert("Reached 3 ");
            bottomDeck.style.height = "480px";
            bottomDeck.style.top = "490px";
            MAIN_HEIGHT = 490;
        }
        // body.style.width = 
        deckWrapperDiv.style.width = fullViewDiv.style.width = bodyWidth + "px";

        //fullViewDiv.style.height = bodyHeight + "px";

        deckWrapperDiv.style.height = (bodyHeight ) + "px";
    }


    function checkForValidation(obj){
        if(obj.price === undefined || obj.price == 0){
            obj.price = "Free";
        }else{
            obj.price = '$' + obj.price;
        }
        if(!obj.tags[0]){
            obj.tags[0] = "";
        }
        if(obj.rating == 0 || obj.rating < 3 ) {
            obj.rating = 3;
        }


    }
    function createReview(item){
        return "<li> <div class='rating-title'>"+item[0]+"</div><div class='review_rating'><div class='rating_revire'>"+createStar(item[2])+ " by "+item[3]+" "+convertDate(item[4])+"</div><div class='review_content'>"+item[1]+"</div></div></li>";
    }
    function createStar(rating){
        var ratingstar = "";
        for(var j=0;j<5;j++){
            if(rating > (j*2+1)/2){
               startype = 'full';
            }else if ( rating > j){
                startype = 'half';
            }else {
                startype = '';
            }
            ratingstar += "<i class = 'star " + startype + "'>&#9733;</i>";
        }
        return ratingstar;
    }

    function showImage(index,card){
        if(typeof imageLoadArr[index] === 'undefined') {
            // getImage(index);
            setTimeout(function(){
                showImage(index,card)
            },100);
            return;
        }
        if(imageLoadArr[index].status === 1){
            setTimeout(function(){
                showImage(index,card);
            },50);
            return;
        }
        if(imageLoadArr[index].status === 2){
            if(typeof card === 'undefined'){
                card = getElementById(idbase + index);
            }
            if(card){
                setImage(index,card);
            }
               
        }
        if(imageLoadArr[index].status === 4){
            sendHit(99, {"action": "cocaine_error", "label": getCurrentAppDataString(index,'image_error')});   
        }
    }

    function setImage(index, card){
        var imgContainer = card.querySelector('.middleContainer');
        imgContainer.style.backgroundImage = 'url('+imageLoadArr[index].url + ')';  
        imgContainer.classList.add('loaded');
        imageLoadArr[index].status = 3;
    }

    function getImage(index,url){
        if(freeimgArr.length < 1 ) {
            setTimeout(function() {
                if(typeof(imageLoadArr[index]) === 'undefined'){
                    getImage(index,url);
                }
            }, 300);
            return;
        }
        var imgEle = freeimgArr.pop();
        var imageLoad = {};
        imageLoad.index = index;
        imageLoad.url = url;
        imageLoad.status = 1;
        imageLoadArr[index] = imageLoad;
        imgEle.src = url;
        imgEle.onload = function(){
            freeimgArr.push(imgEle);
            imageLoadArr[index].status = 2;
            // return url;
        }
        imgEle.onerror = function(){
            //dummy background image or hide 
            imageLoadArr[index].status = 4;
            freeimgArr.push(imgEle);
            return false;
        }
    }

    function renderCard(datasection, append, oldLength){
        oldLength = 0;
        var template = getElementById("card");
        var ele = createElement('div');
        var items = datasection;
        var url = null;

        var templateString = "", item, index, location, cardString="", templateEndString="</div>";
        for(var i = 0 ; i < items.length;i++){
            var xx =items[i];
            checkForValidation(items[i]);
            item = items[i];
            console.log(items[i]);
            var classAttach = "";
            if(xx.name === "Pet Rescue Saga"){
                    classAttach = "pushup";
            }
            url = getImage(i, item.background_images[iosdevType]);
            var ratingstar = createStar(item.rating);
            var bgImageString = "", showTransparentImg = true;
            if(append){
                location = "bottom"
            }
            else{
                if(i<startCardIndex-1){ 
                    location = "top";
                    if((i == startCardIndex) || (i == getPreviousIndex(startCardIndex) ) ) {
                        //bgImageString = "background-image: url('"+item.background_image +"');background-repeat:no-repeat";
                        showTransparentImg = false ;
                    }
                }
                else{
                    if((i == getNextIndex(startCardIndex)) || (i == getNextIndex(getNextIndex(startCardIndex)) ) ){
                        //bgImageString = "background-image: url('"+item.background_image +"');background-repeat:no-repeat";
                        showTransparentImg = false;
                    }
                    location = "bottom";
                }
            }
            var activeimageclass= "";
            var review_block="<ul class='reviewsContainer'>";


            if(item.reviews.length === 0){
                review_block = "<div class='desc-title'>No Reviews</div><ul>";
            }else{
                review_block = "<div class='desc-title hackCss'>Reviews</div><ul class='reviewsContainer'>";
                if(item.reviews.length === 1){
                    review_block+=createReview(item.reviews[0]);
                }
                if(item.reviews.length === 2){
                    review_block+=createReview(item.reviews[0]);
                    review_block+=createReview(item.reviews[1]);
                }

            }
            review_block += "</ul>"

            cardString = "<div class='flip-container'><div class='flipper'><div class='front deck'><div class='topContainer'><div class='leftContainer'><div class='appLogo' style='background-image: url("+ item.icon_url+")'></div><div class='appName'>"+ item.name +"</div><div class='smallName'>"+item.publisher+"</div><div class='sprite install'></div><div class='count'>"+ item.installs +" Gamers</div></div><div class='rightContainer'><div class='rating'>"+ratingstar+"</div><div class='category'>"+item.category+"</div></div></div><div class='middleContainer "+ classAttach +"'></div><div class='bottomContainer'><div class='bottomleft'><div class='tag'>"+ getTagObj(item.tags) +"</div></div><div class='price' ><div class='download'></div><div class='dowloadIcon' ></div><span class='app_price'>"+item.price+"</span> Install Now</div></div></div></div></div>" ;

            if(i >5){

                var newcard = createElement("div");

                newcard.className = "card smallDeck";
                setAttributes(newcard, {
                    id:idbase +  (oldLength+ i),
                    index:(oldLength+ i),
                    'data-location':'bottom',
                    'data-cat':item.category,
                    ontouchstart:'deckOnTouchStart(event,this)',
                    ontouchend:'deckOnTouchEnd(event,this)',
                    ontouchmove:'deckOnTouchMove(event,this)'
                })

                newcard.innerHTML = cardString;
                cardArr.push(newcard);
                //bottomdeck.appendChild(newcard);

            }
            else{
                //debugger;
                templateString += "<div ontouchstart='deckOnTouchStart(event,this)' ontouchend='deckOnTouchEnd(event,this)' ontouchmove='deckOnTouchMove(event,this)'class='card smallDeck' id='"+ (idbase + i )+"' index="+i+" data-location=" + location+" data-cat="+ item.category + " style='xvisibility:hidden;'>" + cardString + templateEndString;
                showImage(oldLength + i);
            }
        }

        if(!append && templateString) bottomDeck.innerHTML =  templateString;

    }

    function preventDefault(e) {
        e.preventDefault();
    }


    function getPreviousIndex(index) {
        var prev = index - 1;
        if (prev < 0) {
            prev = maxCardIndex;
        }
        return  prev;
    }

    function getNextIndex(index) {
        var next = index + 1;
        if (next > maxCardIndex) {
            next = 0;
        }
        return next;
    }

    function renderDeck(firstcall) {

        allCards = document.getElementsByClassName("card");
        ss = [];
        for(var i = 0 ;i< allCards.length ;i++){
            ss.push(allCards[i]);
        }
        for(var i = 0 ;i < cardArr.length ;i++){
            ss.push(cardArr[i]);
        }
        cardArr = null;

        cardsLength = allCards.length;
        if (cardsLength <= 0) return;
        minCardIndex = 0;
        srInd = 0 ;
        endInd = allCards.length-1;
        maxCardIndex = ss.length - 1;
        if (firstcall) {
            currentCard = allCards[2];
        }
    }

    function initializeCards() {


        var currentCardIndex = getCardIndex(currentCard);
        setTransform(currentCard,'translate3d(0,0,' + maxZ + 'px) scale(0.8)');
        scaffold();

        var nextCard = ss[getNextIndex(currentCardIndex)];
        setTransform(nextCard,'translate3d(0, 0px,' + mediumZ + 'px) scale(.8)');

        var next2nextCard = ss[getNextIndex(getNextIndex(currentCardIndex))];
        setTransform(next2nextCard,'translate3d(0, 0px,' + minZ + 'px) scale(.8)');

        var previousCard = ss[getPreviousIndex(currentCardIndex)];
        setTransform(previousCard,'translate3d(0, -' + MAIN_HEIGHT + 'px,' + mediumZ + 'px) scale(1)');
    }

    function shuffleCards(reset) {

        var currentCardIndex = getCardIndex(currentCard);
        if(reset!==undefined){

            currentCard = ss[getNextIndex(currentCardIndex)];
            currentCard.setAttribute("data-location", "top");

        }

        var location = getAttribute(currentCard, 'data-location');
        currentCardIndex = getCardIndex(currentCard);
        var card;
        var nextIndex = getNextIndex(currentCardIndex);
        var prevIndex = getPreviousIndex(currentCardIndex);
        // console.log(nextIndex);
        // console.log(prevIndex);
//        for (var i = 0; i < 6; i++) {
//            card = ss[i];
//
//            if ((i == prevIndex) || (i == nextIndex) || (i == currentCardIndex)) {
//                card.style.visibility = 'visible';
//            }
//            else {
//                card.style.visibility = 'hidden';
//            }
//
//        }


        var nextCard = ss[getNextIndex(currentCardIndex)];
        var next2nextCard = ss[getNextIndex(getNextIndex(currentCardIndex))];

        var previousCard = ss[getPreviousIndex(currentCardIndex)];
        var prev2prev = ss[getPreviousIndex(getPreviousIndex(currentCardIndex))];
        var prev2prev2prev = ss[getPreviousIndex(getPreviousIndex(getPreviousIndex(currentCardIndex)))];

        if (location == "top") {
            //  console.log("Top");
            // console.log(location);
            // console.log(currentCard);
            if(reset ===1){
                minz = minZ-2;
                    mediumz = mediumZ-1;
                    maxz = maxZ;
                    min2min2 = minz-1;
            }else{
                 minz = minZ;
                    mediumz = mediumZ;
                    maxz = maxZ;
            }
            console.log(reset !==undefined);
            console.log(minz + " "+mediumz + " "+ maxz);
//            currentCard.style.WebkitTransform = 'translate3d(0px, -'+MAIN_HEIGHT+'px,'+maxZ+'px) scale(1)';
            //currentCard.setAttribute("data-location", "top");
            requestTimeout(function() {
                /**
                *hack to position card properly
                **/
                    if(helpflag == true && initCard){
                        initCard.style.top = '0px';  
                    }
                setTransform(currentCard, 'translate3d(0px, -' + MAIN_HEIGHT + 'px,' + maxz + 'px) scale(1)');
                setTransform(nextCard, 'translate3d(0, 0px,' + maxz + 'px) scale(.8)');


                setTransform(next2nextCard, 'translate3d(0, 0px,' + mediumz + 'px) scale(.8)');
                next2nextCard.setAttribute("data-location", "bottom");

                next2nextCard.style.webkitTransitionDuration = "0s";
                setTimeout(function () {
                next2nextCard.style.webkitTransitionDuration = "0.3s";
                 }, 300);


                setTransform(previousCard, 'translate3d(0, -' + MAIN_HEIGHT + 'px,' + mediumz + 'px) scale(1)');
                setTransform(prev2prev, "translate3d(0, -" + MAIN_HEIGHT + "px, " + minz + "px) scale(1)");

                // setTransform(tagPanel,'translate3d())
                currentCard.addEventListener("webkitTransitionEnd" ,function(){
                    if(helpflag == true){
                        hideTopTagline();    
                    }   
                });
            },100);

        }
        else if (location == 'bottom') {
            console.log("Bottom");
            requestTimeout(function() {

                setTransform(currentCard, 'translate3d(0px, 0px,' + maxZ + 'px) scale(.8)');
                //currentCard.setAttribute("data-location", "bottom");


                setTransform(nextCard, 'translate3d(0px, 0px,' + mediumZ + 'px) scale(.8)');

                prev2prev.style.webkitTransitionDuration = "0s";
                setTransform(prev2prev, 'translate3d(0, -' + MAIN_HEIGHT + 'px,' + mediumZ + 'px) scale(1)');
                prev2prev.setAttribute("data-location", "top");

                setTransform(previousCard, 'translate3d(0, -' + MAIN_HEIGHT + 'px,' + maxZ + 'px) scale(1)');

                setTransform(next2nextCard, 'translate3d(0, 0px,' + minZ + 'px) scale(.8)');
                setTimeout(function () {
                    prev2prev.style.webkitTransitionDuration = ".3s";
                }, 300);

                 currentCard.addEventListener("webkitTransitionEnd" ,function(){
                    if(helpflag == true){
                        hideTopTagline();    
                    }   
                });

            },100);

        }



    }

    var touchIdentifierDistance = 20;


    function deckOnTouchStart(e, cardObj) {
        timeStayedOnskStore();
        e.preventDefault();

        var index = getAttribute(cardObj, "index");
        console.log("Start----------");
        deckLock = 0;

        cardObj.intialLocation  = getAttribute(cardObj, 'data-location');

        touchobj = e.changedTouches[0];
        cardObj.clientY = getInteger(touchobj.clientY);
        cardObj.clientX = getInteger(touchobj.clientX);

        if(cardObj.intialLocation === "top"){
            currentCard = cardObj;
        }

    }

    function deckOnTouchMove(e, cardObj, info, type) {
        if (deckLock === 1) {
            return;
        }
        if (info !== undefined) {
            cardObj = getElementById("card-" + info);

        }

        touchobj = e.changedTouches[0];
        var distV = getInteger(touchobj.clientY) - cardObj.clientY, distH;
        var location = getAttribute(cardObj, "data-location");
        console.log(cardObj.intialLocation);
        if (location == "top" || info === 1) { //flip + swipedown enabled
            distH = getInteger(touchobj.clientX) - cardObj.clientX;
            var currentFlipper = cardObj.querySelector('.flipper');
            var ind = getCardIndex(currentCard);
            if(DETACH ===1){
                    return;
                }
           if (distV > touchIdentifierDistance) {
                console.log("Swipr down");
                deckLock = 1;
                cardObj.setAttribute('data-location', "bottom");
                //moveDown();
                setTimeout(function(){
                    moveDown();
                },300);
                console.log("22222")
                shuffleCards();
                var index = getCardIndex(cardObj);
                var category = data[index].category;
                if (index == (recordCount - 3)){
                    // getData();
                }

            }else if(distV < -touchIdentifierDistance){

                deckLock = 1;
                if(DETACH ===1){
                    return;
                }
                console.log("yyyy");
                DETACH =1;
               topmove = true;
                setTimeout(function(){
                    DETACH = 0;
                },500);
                shuffleCards(1);
                 setTimeout(function(){
                    moveUp()
                },300);
            }
            else if ((distV > 0) && (distV < touchIdentifierDistance)) {
                console.log("t3");
                setTransform(cardObj,'translate3d(0px, -' + (MAIN_HEIGHT - distV) + 'px,' + maxZ + 'px) scale(1)');
            }


        }
        else if (location == "bottom") { //onlyswipe up
            if(DETACH ===1){
                    return;
                };
            if (distV < -touchIdentifierDistance) {
                console.log("b1");
                deckLock = 1;
                if(DETACH ===1){
                    return;
                }
                DETACH =1;
                setTimeout(function(){
                    DETACH = 0;
                },500);
                cardObj.setAttribute('data-location', "top");
                currentCard = cardObj;
                console.log("pppppp");
                shuffleCards();
                setTimeout(function(){
                    moveUp()
                },200);
                //moveUp();
                var index = getCardIndex(cardObj);
                var category = data[index].category;
//                if(category != currentCategory){
//                    currentCategory = category;
//                    showCategory();
//                }

                if (index == (recordCount - 3)){
                    //getData();
                }

            }
            else if (( distV < 0) && (distV > -touchIdentifierDistance)) {
                //deckLock = 1;
                //cardObj.setAttribute('data-location', "bottom");
                console.log("b2");
                currentCard = ss[getPreviousIndex(getCardIndex(cardObj))];
                setTransform(cardObj, 'translate3d(0px, ' + (distV) + 'px,' + maxZ + 'px) scale(.8)');
            }
            /*else if(( distV > 0) && (distV <  20)){
             //deckLock = 1;
             //cardObj.setAttribute('data-location', "bottom");

             cardObj.style.WebkitTransform = 'translate3d(0px, '+distV+'px,'+maxZ+'px) scale(.8)';
             }*/
            //console.log(distV);
        }

        /*return;
         console.log(distV);
         console.log(cardObj.clientY);
         //loadSurroundingImages(cardObj);

         if(location == "top" ){
         var currentFlipper = cardObj.querySelector('.flipper');
         if( distV > touchIdentifierDistance){
         deckLock = 1;
         cardObj.setAttribute('data-location', "bottom");
         }
         else if( distH > touchIdentifierDistance){
         deckLock = 1;

         currentFlipper.style['-webkit-transform']="rotateY(0deg)";

         var currentRorateY = currentFlipper.getAttribute(node, "rotateY") || 0;
         currentRorateY = getInteger(currentRorateY);
         var nextRotateY = (currentRorateY-180);
         currentFlipper.style['-webkit-transform']="rotateY(" + nextRotateY + "deg)";
         currentFlipper.setAttribute("rotateY", nextRotateY);

         }
         else{
         if( distH < -touchIdentifierDistance){
         deckLock = 1;
         var currentRorateY = currentFlipper.getAttribute(node, "rotateY") || 0;
         currentRorateY = getInteger(currentRorateY);
         var nextRotateY = (currentRorateY + 180);
         currentFlipper.style['-webkit-transform']="rotateY(" + nextRotateY + "deg)";
         currentFlipper.setAttribute("rotateY", nextRotateY);


         }
         }


         }
         else if(location == "bottom"){

         if(distV < -touchIdentifierDistance){
         deckLock = 1;
         cardObj.setAttribute('data-location', "top");
         }
         }*/

    }

    /*function animateBottomCard(card, counter){
     if(counter > 40) {
     animateBottomCard1(card, 1);
     return;
     }
     card.style.WebkitTransform = 'translate3d(0px, -'+counter+'px,'+maxZ+'px) scale(.8)';
     console.log(counter);
     setTimeout(function(){
     animateBottomCard(card, (counter+1));
     }, 10);
     }
     function animateBottomCard1(card, counter){
     if(counter > 40) return;
     card.style.WebkitTransform = 'translate3d(0px, '+counter+'px,'+maxZ+'px) scale(.8)';
     console.log(counter);
     setTimeout(function(){
     animateBottomCard(card, (counter+1));
     }, 10);
     }
     */


    // function removeRev(){
    //     for(var i=0;i< ss.length;i++) {
    //         var renameTit = ss[i].querySelector('.hackCss');
    //         renameTit.innerText = "Top Review";
    //         var elem = ss[i].querySelector('.reviewsContainer');
    //         if (elem.children.length > 1) {
    //             elem.removeChild(elem.children[0]);
    //         }
    //     }
    // }



    function moveUp(){
        var element = getElementById(idbase+srInd);
        element.parentNode.removeChild(element);
        if(endInd+1 > ss.length-1  ){
            endInd = 0
        }else{
            endInd++
        }
        if(srInd+1 > ss.length-1){
            srInd = 0
        }else{
            srInd++;
        }

        var ele = ss[endInd];
        ele.dataset.location ="bottom";

        bottomDeck.appendChild(ele);
        showImage(endInd, ele);
    }

    function moveDown(){
        var element = getElementById(idbase+endInd);
        element.parentNode.removeChild(element);
        if(endInd-1 <0   ){
            endInd = ss.length-1
        }else{
            endInd--
        }
        if(srInd-1 < 0){
            srInd = ss.length-1
        }else{
            srInd--;
        }
        var ele = ss[srInd];
        ele.dataset.location ="top"
        bottomDeck.insertBefore(ele,bottomDeck.firstChild);
        showImage(srInd, ele);
    }
   function calculateTimeStamp(diff, cardObj ,type ,topmov) {
        var diff = new Date().getTime() - timeStamp1;
        var ind = getCardIndex(cardObj);
        console.log("wowo");
        if (cardObj.intialLocation === "bottom") {

            if(type === "card_show"){
                sendHit(99, {"action": "card_show", "value": diff, "label": getCurrentAppDataString(ind, bucketMaping())});
            }else {
                ind = getPreviousIndex(ind);
                sendHit(99, {"action": "card_session", "value": diff, "label": getCurrentAppDataString(ind, bucketMaping(diff))});
            }
        } else if (cardObj.intialLocation === "top") {

            console.log("top" +diff);
            if(type === "card_show"){
                if(topmov){
                    ind = getNextIndex(ind);
                }else{
                    ind = getPreviousIndex(ind);
                }
                sendHit(99, {"action": "card_show", "value": diff, "label": getCurrentAppDataString(ind,bucketMaping())})
            }else{
                sendHit(99, {"action": "card_session", "value": diff, "label": getCurrentAppDataString(ind,bucketMaping(diff))})
            }

        }
    }


    function createState(device_id, start_state,x,y,x1,y1){           // device to id state

    }

    function installState(device_id , app_id , state , x,y,x1,y1){    // carrier and movemnet also can be integrated

    }

    function sendDatastart(app_id,device)
    {
        var xmlhttp;
        if (window.XMLHttpRequest)
          {// code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
          }
        else
          {// code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }
        xmlhttp.onreadystatechange=function()
          {
          // if (xmlhttp.readyState==4 && xmlhttp.status==200)
            // {
            // document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            // }
        }
        var ids = Math.floor(Math.random()*1000+1);
        xmlhttp.open("POST","http://localhost:9000/api/cord?action_state=initalize&app_id="+app_id+"&id="+ids+"&device="+device+"&node=1",true);
        xmlhttp.send();
    }

    function sendData(app_id,x,y,x1,y1,device,node,prevnode,interaction,last_card)
    {
        var xmlhttp;
        if (window.XMLHttpRequest)
          {// code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
          }
        else
          {// code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }
        xmlhttp.onreadystatechange=function()
          {
          // if (xmlhttp.readyState==4 && xmlhttp.status==200)
          //   {
          //   document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
          //   }
        }
        xmlhttp.open("POST","http://localhost:9000/api/cord?action_state=changestate&app_id="+app_id+"&x="+x+"&y="+y+"&x1="+x1+"&y1="+y1+"&device="+device+"&node="+node+"&prevnode="+prevnode+"&interaction="+interaction+"&last_node="+last_card,true);
        xmlhttp.send();
    }

    function deckOnTouchEnd(e, cardObj) {

        console.log("EOEOEO ===  "+cardObj.intialLocation);
        // cardObj= ss[getNextIndex(getCardIndex(cardObj))];
        cardObj.finalLocation = getAttribute(cardObj, 'data-location');
        var currentCardLocation = getAttribute(cardObj, 'data-location');
        var touchendobj = e.changedTouches[0];
        // alert(cardObj.clientY +" "+ touchendobj.clientY);
        // alert(cardObj.clientX +" "+ touchendobj.clientX);
        var device = (isIphone4===true)?"i4":"i5";

        console.log("WoW");
        var prev_card = getPreviousIndex(getCardIndex(currentCard));

        if((cardObj.clientY === touchendobj.clientY) && (cardObj.clientX===touchendobj.clientX) && currentCardLocation==="top"){
            console.log("wowowo");
            var index = getCardIndex(currentCard);
            var item = data[index];

            openInstall(encodeURIComponent(item.tracking_url), currentCard,item.appid)
            return;
        }

        if (cardObj.finalLocation != cardObj.intialLocation || topmove === true) {
            var ind = getCardIndex(currentCard);
//            if(cardObj.finalLocation === "bottom"){
//                currentCard = ss[getPreviousIndex(ind)];
//            }
            //loadSurroundingImages(cardObj);
            var interaction,curr,prev;
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            if(cardObj.finalLocation==="top"){
                console.log("Reached 1");
                interaction = "swipeup";
                curr = getCardIndex(currentCard);
                prev = prev_card;
                if(last_interaction !== "swipeup"){
                    send_card = last_card;
                    last_card = prev;
                }else{
                    send_card = undefined;
                }
                last_interaction = "swipeup";
            }else{
                interaction ="swipedown";
                curr =prev_card;
                prev = getCardIndex(currentCard);
                if(last_interaction !== "swipedown"){
                    send_card = last_card;
                    last_card = curr;
                }else{
                    send_card = undefined;
                }
                last_interaction = "swipedown";
            }
            console.log(interaction);
            var date_node = generateTime();
            sendData("cocaine_",cardObj.clientX,cardObj.clientY,touchendobj.clientY,touchendobj.clientY,device,curr,prev,interaction,send_card,date_node);
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            var diff = new Date().getTime() - timeStamp1;
            calculateTimeStamp(diff, cardObj,"card_show" ,topmove);
            topmove = false;
            //sendHit(99, {"action": "card_show", "label": getCurrentAppDataString(ind ,bucketMaping())});
            calculateTimeStamp(diff, cardObj);
            timeStamp1 = new Date().getTime();
            /*var index = getInteger(cardObj.getAttribute(node);
             var counter = 0;
             card = allCards[getNextIndex(index)];
             animateBottomCard(card, 1);*/
        }
        else if (currentCardLocation === 'bottom') {
            console.log("bottom ==== ");
//            currentCard = ss[getPreviousIndex(getCardIndex(cardObj))];


            setTransform(cardObj,'translate3d(0px, 0px,' + maxZ + 'px) scale(.8)');
        }
        else if (currentCardLocation === 'top') {
             console.log("top ==== ");

            setTransform(cardObj,'translate3d(0px, -' + MAIN_HEIGHT + 'px,' + maxZ + 'px) scale(1)');
        }

    }
    function convertDate(date){
        var parts = date.split('/');
        var mydate = new Date(parts[2],parts[0]-1,parts[1]);
        return (mydate.getDate()<10 ? "0" : "") + mydate.getDate()+'-'+(mydate.toString().split(' ')[1])+'-'+mydate.getFullYear();
    }


    function hbcb(serverdata){
        if(serverdata && serverdata.completed){
            completed = serverdata.completed;
        }

        if(serverdata && serverdata.storyboardLength > 0){
            var oldLength = data.length;
            serverdataload = serverdata;
            data = data.concat(serverdata.storyboard);
            storyBoardArr.push(serverdata.storyboardId);
            storyBoardId = serverdata.storyboardId;
            recordCount += serverdata.storyboardLength;
            startCardIndex = 3;

            completed = serverdata.completed;
            notifyMeOnLoading("dataLoded");
        }
    }


    function notifyMeOnLoading(obj){
        notifyArr.push(obj);
        if(notifyArr.length === 2){
            showAd();
        }

    }

    function getData() {

        if (completed) return;
        var script = getElementById('datascript');
        if (!script) {
            script = createElement('script');
            script.setAttribute('id', 'datascript');
            script.setAttribute('async', true);
            document.body.appendChild(script);
        }
        
        script.src = 'http://heisenberg-786053400.us-west-1.elb.amazonaws.com/appData?headline=true';
    // script.src = 'http://10.14.121.247/heisenberg/appdata.json';    

    }

    getData();

    function bucketMaping(value){
        if(value == undefined ){
            return 0
        }
        if(value === 0 ){
            return 0;
        }
        var sec = parseFloat(value /1000);
        var bucketName ;
        if(sec >=0 && sec <=1){
            bucketName = "0_1";
        }else if(sec >1 && sec <=2){
            bucketName = "1_2";
        }else if(sec >2 && sec <=3){
            bucketName = "2_3";
        }else if(sec >3 && sec <=4){
            bucketName = "3_4";
        }else if(sec >4 && sec <=5){
            bucketName = "4_5";
        }else if(sec >5 && sec <=6){
            bucketName = "5_6";
        }else if(sec >6 && sec <=7){
            bucketName = "6_7";
        }else if(sec >7 && sec <=8){
            bucketName = "7_8";
        }else if(sec >8 && sec <=12){
            bucketName = "8_12";
        }else if(sec >12){
            bucketName = "12+";
        }
        return bucketName+"s";

    }
// for multiple image catagery

//---------------------------------------------------------------

    function getCurrentAppDataString(index ,bucketName,start) {
        var currentData
        if(start !== undefined){
            currentData = data[index-1];
        }else{
            currentData = data[index];
        }
        console.log("currentCard");
        var devType =  isIphone4 === true ? "i4" : "i5";
        console.log([storyBoardId, currentData.appid, currentData.category, index,devType,bucketName].join(','));
        return [storyBoardId, currentData.appid, currentData.category, index,devType,bucketName].join(',');
    }

    function openInstall(url, obj,appid){
        timeStayedOnskStore();
        var ind = getCardIndex(currentCard);
        var url = decodeURIComponent(url);
        url = url.replace("$IMP_ID", impId+"_carousal_"+ind).replace("$UID", deviceId).replace("$IDA", deviceId);
        url += "&device_ip=" + device_ip + "&user_agent=" + user_agent;
        if(deckLock == 1){ return;}
        var site_id = appid;
        _im_imai.pingInWebView(url);
        if(deckLock == 1){ return;}
        obj.className += " scalOpac";
        skStoreLaunchTime = new Date().getTime();
        obj.className = obj.className.replace(/scalOpac/g, "").replace("  ", " ");
        sendHit(8);
        var deg = getInteger(getAttribute(currentCard.querySelector('.flipper'), 'rotatey')) / 180;
        deg = isNaN(deg)?0:deg;
        if (deg % 2 !== 0) {
            sendHit(99, {"action": "back_install", "label": getCurrentAppDataString(ind ,bucketMaping())});

        }else{
            sendHit(99, {"action": "front_install", "label": getCurrentAppDataString(ind ,bucketMaping())});
        }
        setTimeout(function(){
            _im_imai.ios.openItunesProductView(site_id);
        },50);

    }

    function showAd() {
        showNode(fullViewDiv);
        timeStayed = new Date().getTime();
        timeStamp1 = new Date().getTime()
        resizeBody();
        renderCard(serverdataload.storyboard, (storyBoardArr.length !=1 ), serverdataload.storyboardLength);
        renderDeck(storyBoardArr.length ===1);

        initializeCards();
        var ind = getCardIndex(currentCard);
        console.log(ind);
        showTopTagline();
        var device = (isIphone4 === true)?"ip4" : "ip5";
        sendDatastart("cocaine_",device);
        sendHit(99, {"action": "card_show", "label": getCurrentAppDataString(ind ,bucketMaping(),1)});
        
    }

    function generateTime(){
        var d = new Date();
        return weekday[d.getDay()]+", "+d.getDate()+" "+month[d.getMonth()]+", "+d.getFullYear();
    }

    function showTopTagline(){
        currentCardIndex = currentCard.getAttribute('index');
        initCard = ss[getPreviousIndex(currentCardIndex)];
        headerDiv.classList.add('headerInline');

        var createHeading = headerDiv.children[0];
        createHeading.innerText = generateTime();

        if(isIphone4){
            // initCard.style.height = '270px';
        }else{
            initCard.style.height = '330px';
        }
        // initCard.style.top = '50px';

        initCard.classList.add('smallDeck');
        taglinetext.innerText = serverdataload.tagline;

    }

    function hideTopTagline(){
        tagPanel.classList.add('hidecircle');
        return false;
        headerDiv.classList.remove('headerInline');
        var createHeading = headerDiv.children[0];
        console.log("therer");
        createHeading.innerText = serverdataload.headline;
        if(initCard){
            if(isIphone4){
                initCard.style.height = '310px';
            }else{
                initCard.style.height = '380px';
            }

            initCard.style.top = '0px';
            // deckWrapperDiv.style.top = '61px';
            initCard.classList.remove('smallDeck');
        }

    }

   function skStore(event){
       var ind = getCardIndex(currentCard);
       skStoreSessionSt = new Date().getTime();
       var tim = (skStoreSessionSt - skStoreLaunchTime);
       isSkstoreThere = true;
       sendHit(99, {"action": "sk_store_launched", "label": getCurrentAppDataString(ind ,tim)});
   }

    function skstoreError(message,action){
        sendHit(99,{"action":"cocaine_error","label":encodeURIComponent("m:" + message + ",a:" + action)});
    }

    function timeStayedOnskStore(){
        if(isSkstoreThere) {
            var ind = getCardIndex(currentCard);
            var tim = (new Date().getTime() - skStoreSessionSt);
            sendHit(99, {"action": "sk_store_session", "label": getCurrentAppDataString(ind, tim)});
            isSkstoreThere = false;
        }
    }

    function onMraidReady() {
        im_imai.addEventListener("openItunesProductView",skStore);
        im_imai.addEventListener("error",skstoreError);
        if (typeof mraid.useCustomClose === "function") {
            mraid.useCustomClose(true);
        }
        //Wait for the ad to become visible for the first time
        if (typeof mraid.isViewable === "function" && mraid.isViewable()) {
            notifyMeOnLoading("mraidLoaded");
            sendHit(18);
        } else {
            mraid.addEventListener("viewableChange", function (viewable) {
                if (viewable) {
                    mraid.removeEventListener("viewableChange", arguments.callee);
                    notifyMeOnLoading("mraidLoaded");
                    sendHit(18);
                }
            });
        }
        mraid.addEventListener("stateChange", function (state) {

            if (state == "hidden") {
                timeStayed = (new Date().getTime() - timeStayed) / 1000;
                sendHit(3, {"secs": timeStayed});
                var ind = getCardIndex(currentCard);
                var diff = new Date().getTime() - timeStamp1;
                sendHit(99, {"action": "card_session", "value": diff, "label": getCurrentAppDataString(ind,bucketMaping(diff),1)});
                timeStamp1 = new Date().getTime();
                timeStayedOnskStore();
            }

        });
    }

    var count = 0;

    function checkForMraid() { 
            count++;
            if (4 !== count) {
                if ("undefined" !== typeof mraid) {
                    inmobiAIVersion = (typeof mraid.getInMobiAIVersion == 'function') ? mraid.getInMobiAIVersion() : "1.0";

                    mraidAvail = true;
                    if (mraid.getState() === "loading") {
                        mraid.addEventListener("ready", onMraidReady);
                    } else {
                        onMraidReady();
                    }
                } else {
                    setTimeout(checkForMraid, 500);
                }
            } else {
                     notifyMeOnLoading("mraidNotLoaded");
            }
    }

    function sendHit(id, extraParams) {
        var params = {"spid": "hw-P3YL4Q1JYRZ3eABld", "src": "handwritten"};
        if (id === 99 || id === 3) {
            for (var key in extraParams) {
                if (extraParams.hasOwnProperty(key)) {
                    params[key] = extraParams[key];
                }
            }
        } else if (id === 8) {
            params["cta"] = "exit";
            params["ctaid"] = "click";
            params["it"] = "1";
            params["as"] = "1.0.0";
        }
        if(recordEventFun && typeof recordEventFun == "function"){
            recordEventFun(id, params);
        }

    }

    var impId = "$IMPRESSION_ID";
    var device_ip,user_agent;

   function getDeviceId() {
       var rawHtml = document.documentElement.innerHTML;
       var regEx = /cocaineId\=(.+)\&extraId\=extraValue\&device_ip\=(.+)\&user_agent=(.+)\&ex\=exV/;
       var matches = regEx.exec(rawHtml),
           deviceId = "";
       if (matches && matches.length > 0) {
           deviceId = matches[1];
           device_ip = matches[2];
           user_agent = matches[3];
       }
       return deviceId;
   }

    var deviceId = getDeviceId();

    var recordEventFun = window["$RECORD_EVENT_FUN"];
    checkForMraid();
    sendHit(1);
    window.deckOnTouchStart = deckOnTouchStart;
    window.deckOnTouchMove = deckOnTouchMove;
    window.deckOnTouchEnd = deckOnTouchEnd;
    window.hbcb=hbcb;
    window.preventDefault = preventDefault;
    window.openInstall = openInstall;
})(window);