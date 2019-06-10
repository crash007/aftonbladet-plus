jQuery(document).ready(function () {

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations) {
        //console.log(window.location.pathname);
        $(mutations).each(function (i) {

            let aa = this;
            console.log(aa.target);

            //Title change perfom
		setTimeout(inject, 400);
            //inject();

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
                background: url("' + chrome.extension.getURL("icon5.svg") + '") no-repeat center; \
                background-size: cover;\
        }';

    document.head.appendChild(css);


});

function inject() {
    readPlusArticlesCacheFromStorage(function (cache) {
        //main page relace icons
        $(cache).each(function (i, e) {
            var link = e.key;
            let plus = $('a[href="' + link + '"] svg');
            $(plus).addClass("icon");
            $(plus).find('use').remove();
 	    $('a[href="' + link + '"]').attr('href', link+'/promo');

        });

        var relativePath = window.location.pathname;
        console.log(relativePath);
        $(cache).each(function () {

            if (relativePath.includes(this.key) && this.key.length > 3) {
                console.log("Cachehit!");
                let content = (this.value.data) ? decompress(this.value.data) : decompress(this.value); 
                content = $(content);
                $(content).find('picture').append('<img class="img"></img>');

                let articleImageDiv = $('h1').next().clone();
                console.log(articleImageDiv);
                
                if(!$('main').hasClass('injected')){

                    
                    $('main').fadeOut("slow", function(){
                        $(content).hide();
                        //var div = $("<div id='foo'>test2</div>").hide();
                        $('main').replaceWith(content);
                        $('main').fadeIn("slow");
                    });
                   
                    $('main').replaceWith(content);
                    
                    $('main').addClass('injected');
                    $('main div div ').first().prepend('<img class="plusset-logo" src="'+ chrome.extension.getURL("logo_aftonplusset_plus.png")+'"></img>');
                    
                    
                    if($(articleImageDiv).hasClass('lcgxF')){
                        $('[data-test-tag="@spp/video-asset"]').first().parents().eq(5).replaceWith(articleImageDiv);
                    }

                    $('aside').remove();
                    
                }
                
                $('[data-test-tag="@spp/video-asset"]').parents().eq(5).remove();   
               
            }
        });


    });
}
