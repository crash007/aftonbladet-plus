function populate(){
readCacheFromStorage(function(linksCache){

    if(linksCache.length > 0 ) {
        let list = '';

        let size = linksCache.length-1;
        for(let i = size; i>=0; i--){
            let article = linksCache[i];
            let headline = article.value.headline;
            
            if (headline) {
                if(headline.startsWith(">")){
                    headline = headline.substr(1).trim();
                }
                list +=  '<li><a target="_blank" href="https://www.aftonbladet.se' + article.key + '/promo"><h3>' + headline + '</h3></a></li>';
            }
        }
        
        $("#plus-links").append(list)
    } else{
        $("#plus-links").prepend('<li><h3>Snart syns artiklar här...</h3></a></li>');
    }
});
}

document.addEventListener('DOMContentLoaded', populate);
