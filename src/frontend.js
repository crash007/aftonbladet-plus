

jQuery(document).ready(function () {

    $('.Vg5tT').remove(); //Remove ads
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
        $(mutations).each(function (i) {
            let aa = this;
            console.log(aa);
            /*if (this.previousSibling != null && this.previousSibling.id == "ad-blocker-dialog-popup") {
                removeAdblockerPopup();
            }*/

        });

    });


    observer.observe(document, {
        subtree: true,
        childList: true
    });

   
    readPlusArticlesCacheFromStorage(function(cache){
        var relativePath = window.location.pathname;
        console.log(relativePath);
            //Visiting an premium article
            if(relativePath.endsWith('/promo')){
                console.log('plus article');    
                $('.AxIVT').remove()
                $(cache).each(function(){
                    
                    if(relativePath.includes(this.key) ){
                        console.log("Cachehit!");
                        let content = decompress(this.value);
                        console.log(content);
                        $(content).remove('.AxIVT');
                        console.log(content)
                        $('main').replaceWith(content);
                        //$('.AxIVT').remove();
                        //replaceContent(decompress(this.value));//});
                        //return false; //break loop*/
                    }
                });
                    
                    
                /*console.log('Not main page');
                let plus = $('.teaserButton > a.btn.plus');
                if( plus.length > 0){
                    console.log("plus article");
                }
*/
                /*
                console.log("Visiting premium-page");
                var searchKey = relativePath.split("/").pop();
    
                console.log("Searching for "+searchKey+" , in cache");
                
                $(cache).each(function(){
                    
                    if(this.key.includes(searchKey) ){
                        console.log("Cachehit!");
                        $('.locked-wrapper').hide(1000);//, done:  
                        replaceContent(decompress(this.value));//});
                        return false; //break loop
                    }
                });
                */
            }else{
                console.log("Main page");
                /*
                //main page relace icons
                $(cache).each(function(i,e){
                    var link = e.key;
                    
                    //Senaste nyheter - top of page
                    $('a[href="'+link+'"] h3 .premium-label.m-icon-plus').addClass("cached-content");
                    
                    //Right now
                    $('.right-now a[href="'+link+'"]').siblings('span.premium-label').addClass('cached-content');
                    //Rest of page
                    $('.content a[href="'+link+'"] ').parent().find('.premium-label.m-icon-plus').addClass('cached-content');
                });
                */
            }
    });
});

function replaceContent(content){
    console.log("replaceing content");
    $('.row.unpadded.single-article').replaceWith(content).hide('fast').show(2000);
    $('.main-wrapper.main-fullwidth .extended-headline').after('<p style="color: orange;">STanna uppdaterad: Visar innehåll från cache.</p>');
    $('.locked-article-image-wrapper').hide(1000);
    
}