

jQuery(document).ready(function () {

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations) {
        //console.log(window.location.pathname);
        $(mutations).each(function (i) {

            let aa = this;
            console.log(aa.target);

            //Title change perfom
            inject();

        });
    });

    observer.observe(document.querySelector('title'), {
        subtree: true,
        childList: true,
        attributes: true
    });

    if(window.location.pathname == '/'){
        inject();
    }

    var css = document.createElement("style");
    css.type = "text/css";

    css.innerHTML = '.icon \{ \
                color: rgba(0, 0, 0, 0); \
                background: url("' + chrome.extension.getURL("icon.svg") + '") no-repeat center; \
                background-size: cover;\
        }';

    document.head.appendChild(css);


});

function inject() {
    readPlusArticlesCacheFromStorage(function (cache) {
        //main page relace icons
        $(cache).each(function (i, e) {
            var link = e.key;
            //$('a[href="' + link + '"]').addClass("plus-cached");
            let plus = $('a[href="' + link + '"] svg');
            $(plus).addClass("icon");
            $(plus).find('use').remove();

        });

        var relativePath = window.location.pathname;
        console.log(relativePath);
        $(cache).each(function () {

            if (relativePath.includes(this.key) && this.key.length > 3) {
                console.log("Cachehit!");
                var content = decompress(this.value);
                content = $(content).find('._3p4DP._1lEgk div:first');
                console.log(content);
                let articleImageDiv = $('h1').next().clone();
                console.log(articleImageDiv);
                if(!$('main').hasClass('injected')){
                    //$('main').replaceWith(content);
                    $('main ._3p4DP._1lEgk div').replaceWith(content);
                    
                    //$('main ._3p4DP._1lEgk div').append('<div class="AxIVT"><div id="pymComponent0"/></div> ');
                    $('main').addClass('injected');
                    
                    if($(articleImageDiv).hasClass('lcgxF')){
                        $('._1W-u7').replaceWith(articleImageDiv);
                    }
                }
                //$('.Vg5tT').remove(); //Remove ads
                //$('.AxIVT').remove(); //Remove paywall wrap
                //$('._2BIi5').remove();

                $('aside').remove();

            }
        });


    });
}


/*
   MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

   var observer = new MutationObserver(function (mutations, observer) {
       //console.log(window.location.pathname);
       $(mutations).each(function (i) {

           let aa = this;
           console.log(aa.target);
});
      $('.Vg5tT').remove()
           let bb = $('.AxIVT').remove();
           if (bb != null && window.location.pathname != '/') {
               console.log("removed paywall");
               console.log(window.location.pathname);

               readPlusArticlesCacheFromStorage(function (cache) {
                   var relativePath = window.location.pathname;
                   console.log(relativePath);
                   //Visiting an premium article
                   //if(relativePath.endsWith('/promo')){
                   //    console.log('plus article');
                   //$('.AxIVT').remove()
                   $(cache).each(function () {

                       if (relativePath.includes(this.key)) {
                           console.log("Cachehit!");
                           var content = decompress(this.value);
                           $('main').replaceWith(content);

                       }
                   });
               });

           }
           /*if (this.previousSibling != null && this.previousSibling.id == "ad-blocker-dialog-popup") {
               removeAdblockerPopup();
           }*/
/*
        });

    });


    observer.observe(document, {
        subtree: true,
        childList: true
    });

*/
/*
    readPlusArticlesCacheFromStorage(function (cache) {

        var relativePath = window.location.pathname;
        console.log(relativePath);
        $(cache).each(function () {

            if (relativePath.includes(this.key)) {
                console.log("Cachehit!");
                var content = decompress(this.value);
                $('main').replaceWith(content);

            }
        });
        //main page relace icons
        $(cache).each(function (i, e) {
            var link = e.key;
            $('a[href="' + link + '"]').addClass("plus-cached");
            $('a[href="' + link + '"] > div > h3').addClass("plus-cached");

        });
    });
});
*/
/*
function replaceContent(content) {
        console.log("replaceing content");
        $('.row.unpadded.single-article').replaceWith(content).hide('fast').show(2000);
        $('.main-wrapper.main-fullwidth .extended-headline').after('<p style="color: orange;">AftonBLADET: Visar innehåll från cache.</p>');
        $('.locked-article-image-wrapper').hide(1000);

    }*/
