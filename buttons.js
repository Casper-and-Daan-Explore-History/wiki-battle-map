
function showInfopanel() {
    if ($(window).width() > 900) {
      infoOnethird();
    }
    if ($(window).width() < 900 && $(window).width() > 600) {
      infoFullscreen();
    }
    if ($(window).width() < 600) {
      infoFullscreen();
    }
  }

  
function hideInfopanel() {
    infoHidden();
  }


function toggleBigimage() {
  if ($(".article-image").hasClass('hide')) {
    if ($(window).width() > 900) {
      infoTwothirds();
      hideText();
      hideLinks();
      imageInFocus();
    }
    $(".article-image").removeClass('hide').addClass('show');
  }
  else {
    if ($(window).width() > 900) {
      infoOnethird();
      showEverything();
      imageOutFocus();
      
    }
    $(".article-image").removeClass('show').addClass('hide');
  }
}

function toggleBigtext() {
  if ($(".wiki-intro").hasClass('hide')) {
    if ($(window).width() > 900) {
      infoTwothirds();
      // mapOnethird();
      hideImage();
      hideLinks();
      textInFocus();
        
    }
    $(".wiki-intro").removeClass('hide').addClass('show');
  }
  else {
    if ($(window).width() > 900) {
      infoOnethird();
      showEverything();
      textOutFocus();
    }
    $(".wiki-intro").removeClass('show').addClass('hide');
  }
}


function hideImage() {
  //hide the image
  document.getElementById("articleimage").style.display = "none";
}

function hideText() {
  //hide the text
  document.getElementById("wiki-intro").style.display = "none";
}

function hideLinks() {
  //hide the links
  document.getElementById("wikilinks").style.display = "none";
}

function showEverything() {
  //show everything again
  document.getElementById("wikilinks").style.display = "flex";
  document.getElementById("wiki-intro").style.display = "block";
  document.getElementById("articleimage").style.display = "block";
}


function textInFocus() {
  // $(".wiki-intro").animate({
  //   'marginLeft': "16px"
  // }, 200, function () {
  //   // Animation complete.
  // });    
  // document.getElementById("readmore").style.display = "none";
  document.getElementById("wiki-intro").style.marginLeft = "16px";
  document.getElementById("closeicon").style.display = "block";
  document.getElementById("wiki-intro").style.padding = "5rem";
  document.getElementById("wiki-intro").style.maxHeight = "none";
  document.getElementById("wiki-intro").style.overflow = "visible";
  document.getElementById("wiki-intro-content-text").style.maxHeight = "none";


}

function textOutFocus() {
  // $(".wiki-intro").animate({
  //   'marginLeft': "0px"
  // }, 200, function () {
  //   // Animation complete.
  // });   
  // document.getElementById("readmore").style.display = "block";
  document.getElementById("wiki-intro").style.marginLeft = "0px";
  document.getElementById("closeicon").style.display = "none";
  document.getElementById("wiki-intro").style.padding = "1rem";
  document.getElementById("wiki-intro").style.maxHeight = "300px";
  document.getElementById("wiki-intro").style.overflow = "hidden";
  document.getElementById("wiki-intro-content-text").style.maxHeight = "300px";
}


function imageInFocus() {
  // $(".article-image").animate({
  //       'min-height': "500px",
  //     }, 200, function () {
  //       // Animation complete.
  // });
  document.getElementById("articleimage").style.minHeight = "500px";
  document.getElementById("article-image").style.objectFit = "contain";
}

function imageOutFocus() {
  // $(".article-image").animate({
  //   'min-height': "300px",
  // }, 200, function () {
  //   // Animation complete.
  // });
  document.getElementById("articleimage").style.minHeight = "300px";
  document.getElementById("article-image").style.objectFit = "cover";
}



function infoHidden() {
  
  $(".info").animate({
    width: "0%",
  }, 200, function () {
    // Animation complete.
    $(".info").hide();

  });
  // $(".info").hide();
}

function infoOnethird() {
  $(".info").show();
  $(".info").animate({
    left: "0px",
    width: "38%"
  }, 200, function () {
    // Animation complete.
  });
}

function infoTwothirds() {
    $(".info").show();
    $(".info").animate({
      left: "0px",
      width: "66%"
    }, 200, function () {
      // Animation complete.
    });
}

function infoFullscreen() {
  $(".info").show();
  $(".info").animate({
    left: "0px",
    width: "100%"
  }, 200, function () {
    // Animation complete.
  });
}