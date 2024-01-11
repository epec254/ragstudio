var ajax = {};
var uid = 'e8a46fbb-1e09-11e9-b6f5-06d762ad9a62';
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
function instanceRegexMatch(pageRatingInstanceArray){
    var found = 0;
    var pageRatingInstanceCategory = '';
    for(var i=0; i<pageRatingInstanceArray.pageRatingInstanceData.length; i++){
      if( typeof document.referrer == 'string' && document.referrer.match(pageRatingInstanceArray.pageRatingInstanceData[i]['instance_regex'])){
        pageRatingInstanceCategory = pageRatingInstanceArray.pageRatingInstanceData[i].instance_name;
        found = 1;
        break;
      }
    }
    return {"found":found, "pageRatingInstanceCategory":pageRatingInstanceCategory};
}
function regexMatch(pageRatingArray){
    var found = 0;
   // console.log(typeof JSON.parse(pageRatingArray));
    for(var i=0; i<pageRatingArray.pageRatingData.length; i++){
      if(window.location.href && window.location.href.match(pageRatingArray.pageRatingData[i]['regex'])){
        pageRatingCategory = pageRatingArray.pageRatingData[i].name;
        found = 1;
        break;
      }
    }
    return {"found":found, "pageRatingCategory":pageRatingCategory};
}
function storePageRatingFeedback(feedback){
    if(gza){
        gza("pageRating", {
          referer: document.referrer,
          url: window.location.href,
          t: document.getElementsByTagName('title')[0]?document.getElementsByTagName('title')[0].innerText:window.location.href,
          "uid": uid,
          feedback: feedback,
          pageCategory: pageRatingCategory            
        });
        pageRatingResponseRecorded = true;
        var  fdhtml = '<div class="su_page_rating_box"><div class="su_feedback_success">';
        fdhtml += '<p>Thank you for your feedback.</p>';
        fdhtml += '</div>';
        fdhtml += '</div></div>';
          document.getElementById('suPageRateApp').innerHTML = fdhtml;
      }else{
        console.log('su: gza not defined');
      }
    }

function getHTML() {


    ajax.post('https://databricks.searchunify.com/pageRating/getPageRatingDataInstance', { 'uid':uid, '_csrf': localStorage.getItem("_csrf")}, function(data) {
      var instanceRegexResult = instanceRegexMatch(JSON.parse(data));
     
      if(instanceRegexResult.found == 1){
          var fdhtml = '<meta name="viewport" content="initial-scale=1, maximum-scale=1">';
          fdhtml += '<div class="su_page_rating_box">';
          if(!pageRatingResponseRecorded){
            fdhtml += '<div class="su_feedback_form">';
            fdhtml += '<p style="color:black;">Was this article helpful?</p>';
            fdhtml += '<span class="su_helpful"  onclick="storePageRatingFeedback(1)">Yes</span>';
            fdhtml += '<span class="su_unhelpful" onclick="storePageRatingFeedback(0)">No</span>';
            fdhtml += '</div>';
          }
          // fdhtml += '<div class="su_feedback_success">';
          // fdhtml += '<p>Thank you for your feedback.</p>';
          // fdhtml += '</div>';
          // fdhtml += '</div>';
          document.getElementById('suPageRateApp').innerHTML = fdhtml;
      }

});



}

var pageRatingResponseRecorded = false;
ajax.post('https://databricks.searchunify.com/pageRating/getPageRatingData', { 'uid':uid, '_csrf': localStorage.getItem("_csrf")}, function(data) {
  var regexResult = regexMatch(JSON.parse(data));       
if(regexResult.found == 1){
      getHTML();
    } 
});