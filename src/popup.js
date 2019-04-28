function populate(){
readCacheFromStorage(function(linksCache){
    console.log(linksCache.length);
    $.each(linksCache, function(index, link) {
        console.log(link.key);
        let name = link.key.substring(link.key.lastIndexOf("/") + 1, link.key.length).replace(new RegExp('-','g'),' '); //get name from url
        name = name.charAt(0).toUpperCase() + name.slice(1); //Uppercase
        $("#plus-links").prepend('<li><a target="_blank" href="https://www.aftonbladet.se'+link.key+'/promo"><h3>'+name+'</h3></a></li>');
    });
});
}

document.addEventListener('DOMContentLoaded', populate);