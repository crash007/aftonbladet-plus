function populate(){
readCacheFromStorage(function(linksCache){

    if(linksCache.length > 0 ) {
        $.each(linksCache, function (index, article) {
            let pathname = article.key;
            let headline = "";
            console.log(article);
            if (article.value.headline) {
                headline = article.value.headline;
            } else {
                headline = pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length).replace(new RegExp('-', 'g'), ' '); //get name from url
                headline = headline.charAt(0).toUpperCase() + headline.slice(1); //Uppercase
            }
            $("#plus-links").prepend('<li><a target="_blank" href="https://www.aftonbladet.se' + pathname + '/promo"><h3>' + headline + '</h3></a></li>');
        });
    } else{
        $("#plus-links").prepend('<li><h3>Snart syns artiklar här...</h3></a></li>');
    }
});
}

document.addEventListener('DOMContentLoaded', populate);
