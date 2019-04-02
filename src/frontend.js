

jQuery(document).ready(function () {

    $('.Vg5tT').remove(); //Remove ads
    $('.AxIVT').remove(); //Remove paywall wrap

    setTimeout(function () {
        readPlusArticlesCacheFromStorage(function (cache) {
            //main page relace icons
            $(cache).each(function (i, e) {
                var link = e.key;
                $('a[href="' + link + '"]').addClass("plus-cached");
                $('a[href="' + link + '"] > div > h3').addClass("plus-cached");

            });
            
            var relativePath = window.location.pathname;
            console.log(relativePath);
            $(cache).each(function () {

                if (relativePath.includes(this.key)) {
                    console.log("Cachehit!");
                    var content = decompress(this.value);
                    $('main').replaceWith(content);

                }
            });
            

        }); 
        console.log("dssdfdsf")
        $('.Vg5tT').remove(); //Remove ads
        //$('.AxIVT').remove(); //Remove paywall wrap
    }, 3000);
});


    /*
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
        //console.log(window.location.pathname);
        $(mutations).each(function (i) {

            let aa = this;
            console.log(aa.target);
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