function readCacheFromStorage(callbackFn){
    chrome.storage.local.get({ 'plusArticlesCache':[] ,'nonPlusArticlesCache':[]}, function (result) {
        let plusArticlesCache = result.plusArticlesCache;
        let nonPlusArticlesCache = result.nonPlusArticlesCache;
        callbackFn(plusArticlesCache, nonPlusArticlesCache);
    });
}

function readPlusArticlesCacheFromStorage(callbackFn){
    chrome.storage.local.get({ 'plusArticlesCache':[] }, function (result) {
        let plusArticlesCache = result.plusArticlesCache;
        callbackFn(plusArticlesCache);
    });
}

function readNonPlusArticlesCacheFromStorage(callbackFn){
    chrome.storage.local.get({ 'nonPlusArticlesCache':[] }, function (result) {
        let nonPlusArticlesCache = result.nonPlusArticlesCache;
        callbackFn(nonPlusArticlesCache);
    });
}


function saveCachemapToStorageAndUpdateBadge(plusArticlesCacheMap, nonPlusArticlesCacheMap){
  
    var plusArticlesCache = cacheMapToArray(plusArticlesCacheMap);
    var nonPlusArticlesCache = cacheMapToArray(nonPlusArticlesCacheMap);
    
    set(plusArticlesCache, nonPlusArticlesCache);

    function set(plusArticlesCache, nonPlusArticlesCache){
        console.log("storage.set: plusArticlesCache:"+ plusArticlesCache.length+ " , nonPlusArticlesCache:"+nonPlusArticlesCache.length);
        chrome.storage.local.set({ 'plusArticlesCache': plusArticlesCache,  'nonPlusArticlesCache': nonPlusArticlesCache}, function () {
            var error = chrome.runtime.lastError;  
            if (error) {  
                console.log(error);
                //Remove the oldest articles and try again
                plusArticlesCache.shift();
                nonPlusArticlesCache.shift();
                set(plusArticlesCache, nonPlusArticlesCache);
            } else{
                //chrome.browserAction.setBadgeText({ "text": plusArticlesCache.length+"/"+nonPlusArticlesCache.length });
                chrome.browserAction.setBadgeText({ "text": plusArticlesCache.length.toString() });
            }
        });
    }
}


function cacheArrayToMap(arr){
    result = new Map();
    
    $(arr).each(function(){
        result.set(this.key, this.value);
    });
    return result;
}

function cacheMapToArray(map){
   
    result = [];
    for (const [key, value] of map.entries()) {
        result.push({key, value});
    };
    return result;
}
