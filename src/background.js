chrome.storage.local.get({'intervall': 15}, function(result){
    var intervall = result.intervall;

    chrome.alarms.create("checkerAlarm", {
        delayInMinutes: 1,
        periodInMinutes: intervall
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  console.log("message");
  if(message.popupOpen) { 
	chrome.browserAction.setBadgeText({ "text": ""});
  }
});

chrome.runtime.onInstalled.addListener(function () {

    //setBadgeText();
    checkForUpdates();

});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("alarm larm");
    console.log(alarm);
    if (alarm.name === "checkerAlarm") {
        checkForUpdates();
    }
});


function checkForUpdates() {
   downloadLinks();
   /* $.get("https://www.aftonbladet.se", function (data) {
        parsePage(data)
    }); */
}

//Collect new articles from main page
/*
function parsePage(data) {

    var plusLinks= new Map();
    var nonPlusLinks= new Map();

    $(data).find('.abThemeGradientPage').find(':not([href="#plus-logo"])').closest('a').each(function(i,e){
        if(!(e.pathname.includes('kampanj') 
            || e.pathname.includes('rabattkod') 
            || e.pathname.includes('email-protection') 
            || e.pathname.includes('manager-2') 
            || e.pathname.includes('nivasvarld/')
            || e.pathname.includes('/hc/sv')
            || e.pathname.includes('/hjalpinfo/')
            || e.pathname.includes('/aftonbladet-tools/forms/')
            || e.pathname.includes('schlagerbloggen/'
	    || e.pathname == '/')     
            )){
            nonPlusLinks.set(e.pathname,e);
        }
    });

    $(data).find('.abThemeGradientPage').find('[href="#plus-logo"]').closest('a')
        .each(function(i,e){
            plusLinks.set(e.pathname,e);
            if(nonPlusLinks.has(e.pathname)){
                console.log("removing pluslink from nonpluslinks. this shouldnt happen", e.pathname);
                nonPlusLinks.delete(e.pathname);
            }
        }
    );

    readCacheFromStorage(function(plusArticlesCache, nonPlusArticlesCache){
        update(cacheArrayToMap(plusArticlesCache), cacheArrayToMap(nonPlusArticlesCache), plusLinks, nonPlusLinks);
    });

}*/

function update(plusArticlesCacheMap, nonPlusArticlesCacheMap, plusLinks, nonPlusLinks) {
    
    let newArticles = new Map();

    //Move cached articles from nonPlusArticlesCacheMap to plusArticlesCacheMap
   let newPlusCounter = 0;
    for (let link of plusLinks.keys()) {
        console.log(link);
        if(nonPlusArticlesCacheMap.has(link)){
            
            if(plusArticlesCacheMap.has(link)){
                console.log("Link is already in plusArticles cache");
            }else{
                console.log("Found plus article thats was previous open", link);
                plusArticlesCacheMap.set(link, nonPlusArticlesCacheMap.get(link));
                nonPlusArticlesCacheMap.delete(link);
		newPlusCounter++;
            }
        }
    };

    if(newPlusCounter > 0){
	chrome.browserAction.getBadgeText({},function(text){
		console.log(text);
		if(isNaN(text)){
		        chrome.browserAction.setBadgeText({ "text": newPlusCounter.toString() });
		}else{
		        let b = Number(text)+newPlusCounter;
		        chrome.browserAction.setBadgeText({ "text": b.toString() });
		}
	});

    }
    
    //New Articles we want to get content for
    //$.each(nonPlusLinks, function (i, link) {
    for (let link of nonPlusLinks.keys()) {
        if (!nonPlusArticlesCacheMap.has(link)) {
            newArticles.set(link, nonPlusLinks.get(link));
        }
    };

    //Remove articles from nonPlusArticelsCache that are not on frontpage anymore
    for(let link of nonPlusArticlesCacheMap.keys()){
        if(!nonPlusLinks.has(link)){
            console.log("deleting old link from cache: "+link);
            nonPlusArticlesCacheMap.delete(link);
        }
    }

    if(newArticles.size > 0){
        console.log("new articles");
        
        var deferreds = Array.from(newArticles).map(function(a){
            return getArticleContent(a,nonPlusArticlesCacheMap);
        })
        
        $.when.apply($, deferreds).then(function() {
            console.log('All calls done');
            saveCachemapToStorageAndUpdateBadge(plusArticlesCacheMap,nonPlusArticlesCacheMap);
        }).fail(function(data){
            console.log("failure. wait for calls to finish")
            setTimeout(function(){ saveCachemapToStorageAndUpdateBadge(plusArticlesCacheMap,nonPlusArticlesCacheMap); }, 3000);
        });
    }
}

function downloadLinks(){
    console.log("downloading links");
    let sites = ["https://www.aftonbladet.se", "https://www.aftonbladet.se/sport", "https://www.aftonbladet.se/nojesbladet"];
    let result = [ ];
    let deferreds = Array.from(sites).map(function(a){
        return  $.get(a, function (data) {
            result.push($(data).find('.abThemeGradientPage'));
        });
    });

    $.when.apply($, deferreds).then(function() {
        console.log('All calls done');
        console.log(result);
        parseLinks(result);

    });

}

function parseLinks(pages){
    var plusLinks= new Map();
    var nonPlusLinks= new Map();

    pages.forEach(function (page, index) {
        $(page).find(':not([href="#plus-logo"])').closest('a').each(function(i,e){
            if(!(e.pathname.includes('kampanj')
                || e.pathname.includes('rabattkod')
                || e.pathname.includes('email-protection')
                || e.pathname.includes('manager-2')
                || e.pathname.includes('nivasvarld/')
                || e.pathname.includes('/hc/sv')
                || e.pathname.includes('/hjalpinfo/')
                || e.pathname.includes('/aftonbladet-tools/forms/')
                || e.pathname.includes('schlagerbloggen/'
                    || e.pathname == '/')
            )){
                nonPlusLinks.set(e.pathname,e);
            }
        });

        $(page).find('[href="#plus-logo"]').closest('a')
            .each(function(i,e){
                    plusLinks.set(e.pathname,e);
                    if(nonPlusLinks.has(e.pathname)){
                        console.log("removing pluslink from nonpluslinks. this shouldnt happen", e.pathname);
                        nonPlusLinks.delete(e.pathname);
                    }
                }
            );
    });

    readCacheFromStorage(function(plusArticlesCache, nonPlusArticlesCache){
        update(cacheArrayToMap(plusArticlesCache), cacheArrayToMap(nonPlusArticlesCache), plusLinks, nonPlusLinks);
    });
}

function getArticleContent(a, cacheMap){
    console.log(a);
    let link =a[0];
    
    let headline = $(a[1]).find('h3').first().text();
    if(headline.startsWith(">")){
        headline = headline.substr(1).trim();
    }

    console.log(headline);

    return jQuery.ajax({
        url: "https://www.aftonbladet.se" + link,
        success: function (data) {        
            
            let result = $(data).find('main')[0];
            
            result = removeElements(result);

            if(result[0]){
            
                if(!result[0] ){
                    console.log(result);
                    console.log(link)
                }
                result = whiteWashContent(result[0].outerHTML);
                console.log("Adding to cache", link);
                let storeObject =  new Object;
                storeObject["data"] = compress(result);
                storeObject['headline'] = headline;
                cacheMap.set(link, storeObject);
               
            }
        },
        error: function(response) {
            console.log("Error", response);
            return $.Deferred().resolve("don't care");
          },
        async: true
    }).fail(function (jqXHR, textStatus, error) {
        console.log( textStatus, error);
        return $.Deferred().resolve("don't care");
    });
}

function whiteWashContent(str){
    return str.replace(new RegExp('\n\\s+','g'),'\n').replace(/>\n</gi, '><');
}

function removeElements(data){
    let content =$(data);
    $(content).find('[id^="abAdArea"]').remove();
    return content; 
}
