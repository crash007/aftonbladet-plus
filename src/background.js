chrome.runtime.onInstalled.addListener(function () {

    //setBadgeText();
    //checkForUpdates();
    
    chrome.storage.local.get({'intervall': 15}, function(result){
        var intervall = result.intervall;
        
        chrome.alarms.create("checkerAlarm", {
            delayInMinutes: intervall,
            periodInMinutes: intervall
        });
    }); 
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("alarm larm");
    if (alarm.name === "checkerAlarm") {       
        checkForUpdates();
    }
});


function checkForUpdates() {
    $.get("https://www.aftonbladet.se", function (data) {
        parsePage(data)
    });
}

//Collect new articles from main page
function parsePage(data) {

    var plusLinks= new Set();
    var nonPlusLinks= new Set();

    $(data).find('.abThemeGradientPage').find(':not([href="#plus-logo"])').closest('a').each(function(i,e){
    //$(data).find('.abThemeGradientPage').find('a').each(function(i,e){
        if(!(e.pathname.includes('kampanj') 
            || e.pathname.includes('rabattkod') 
            || e.pathname.includes('email-protection') 
            || e.pathname.includes('manager-2') 
            || e.pathname.includes('nivasvarld/')
            || e.pathname.includes('/hc/sv')
            || e.pathname.includes('/hjalpinfo/')
            || e.pathname.includes('/aftonbladet-tools/forms/')
            || e.pathname.includes('schlagerbloggen/')

            
            )){
            nonPlusLinks.add(e.pathname);
        }
    });

    $(data).find('.abThemeGradientPage').find('[href="#plus-logo"]').closest('a')
        .each(function(i,e){
            plusLinks.add(e.pathname);
            if(nonPlusLinks.has(e.pathname)){
                console.log("removing pluslink from nonpluslinks. this shouldnt happen", e.pathname);
                nonPlusLinks.delete(e.pathname);
            }
        }
    );

    readCacheFromStorage(function(plusArticlesCache, nonPlusArticlesCache){
        update(cacheArrayToMap(plusArticlesCache), cacheArrayToMap(nonPlusArticlesCache), plusLinks, nonPlusLinks);
    });

}

function update(plusArticlesCacheMap, nonPlusArticlesCacheMap, plusLinks, nonPlusLinks) {
    
    var newArticles = [];

    //Move cached articles from nonPlusArticlesCacheMap to plusArticlesCacheMap
    //$.each(plusLinks, function (i, link) {
    for (let link of plusLinks.keys()) {
        console.log(link);
        if(nonPlusArticlesCacheMap.has(link)){
            
            if(plusArticlesCacheMap.has(link)){
                console.log("Link is already in plusArticles cache");
            }else{
                console.log("Found plus article thats was previous open", link);
                plusArticlesCacheMap.set(link, nonPlusArticlesCacheMap.get(link));
                nonPlusArticlesCacheMap.delete(link);
            }
        }
    };
    
    //New Articles we want to get content for
    //$.each(nonPlusLinks, function (i, link) {
    for (let link of nonPlusLinks.keys()) {
        if (!nonPlusArticlesCacheMap.has(link)) {
            newArticles.push(link);
        }
    };

    //Remove articles from nonPlusArticelsCache that are not on frontpage anymore
    for(let link of nonPlusArticlesCacheMap.keys()){
        if(!nonPlusLinks.has(link)){
            console.log("deleting old link from cache: "+link);
            nonPlusArticlesCacheMap.delete(link);
        }
    }


    if(newArticles.length > 0){
        var deferreds = $.map(newArticles, function(link) {
            return getArticleContent(link,nonPlusArticlesCacheMap);
        });

        $.when.apply($, deferreds).then(function() {
            console.log('All calls done');
            saveCachemapToStorageAndUpdateBadge(plusArticlesCacheMap,nonPlusArticlesCacheMap);
        }).fail(function(data){
            console.log("failure. wait for calls to finish")
            setTimeout(function(){ saveCachemapToStorageAndUpdateBadge(plusArticlesCacheMap,nonPlusArticlesCacheMap); }, 3000);
        });
    }
}


function getArticleContent(link, cacheMap){

    return jQuery.ajax({
        url: "https://www.aftonbladet.se" + link,
        success: function (data) {        
            let content = removeElements(data);
            let result = $(content).find('main')[0];
            
            if(result !=null){
            
                result = whiteWashContent(result.outerHTML);
                console.log("Adding to cache", link);
                cacheMap.set(link, compress(result));
               
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
    $(content).find('._2BIi5').remove();
    $(content).find('.AxIVT').remove();
    $(content).find('.Vg5tT').remove();
    //fb and twitter
    $(content).find('._2XS3K').remove();
    //read more about..
    //$(content).find('._3u81U').remove();
    

    return content; 
}