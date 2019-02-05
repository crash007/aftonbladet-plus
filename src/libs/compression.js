function compress(content){
    
    //save space in storage
    /*var replaced = insertVariables(content);
    var compressedReplaced = LZString.compressToUTF16(replaced);
    console.log("Compressed size: "+ compressedReplaced.length+" , before: "+replaced.length);
    return compressedReplaced;
    */
    let compressed = LZString.compressToUTF16(content);
   console.log("Compressed size: "+ compressed.length+" , before: "+content.length);
   return compressed;
}

function decompress(compressed){
    var decompressed= LZString.decompressFromUTF16(compressed);
    return replaceVariables(decompressed);
}

function insertVariables(content){
   
    var originalLength = content.length;
    
    $.each(getReplacementStrings(), function(index, value){
        content = content.split(value).join('$'+index+'$');   
    });
    var diff = originalLength- content.length;
    console.log("Length before variables "+originalLength+"  and length after "+content.length+ " , difference: "+diff+' , procent: '+(content.length/originalLength));
    
    return content;
}


function replaceVariables(content){
    var strings = getReplacementStrings();
    $.each(strings, function(index, value){
        content = content.split('$'+index+'$').join(value);
    });
    return content;
}

function getReplacementStrings(){

    return [
        '<div class="row unpadded single-article"><div class="column large-full medium-full"><section class="leadin" itemprop="description"><p>' 
        ,'</div></div></div><div class="clearfix"></div></figure><figure class="inline-image-wrapper inline-resource"><div class="inline-inner-image-wrapper"><span class="m-icon-enlarge-image"></span><img src="https://bildix.mmcloud.se/bildix/api/images/'
        ,'</p></section></div><div class="column large-two-thirds medium-full article-content"><section class="body" itemprop="articleBody"><figure class="inline-image-wrapper inline-resource"><div class="inline-inner-image-wrapper"><span class="m-icon-enlarge-image"></span><img src="https://bildix.mmcloud.se/bildix/api/images/',
        ,'</p></section></div><div class="column large-two-thirds medium-full article-content"><section class="body" itemprop="articleBody"><p class="body">'
        ,'</p><figure class="inline-image-wrapper inline-resource"><div class="inline-inner-image-wrapper"><span class="m-icon-enlarge-image"></span><img src="https://bildix.mmcloud.se/bildix/api/images/'
        ,'</p></section></div><div class="column large-third medium-third article-aside"></div></div>'

        ,'.jpeg?fit=crop&amp;w=300" srcset="https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=300 300w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=490 490w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=600 600w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=750 750w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=910 910w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpeg?fit=crop&amp;w=1200 1200w" itemprop="image" class="lazy unobserved inline-image" alt='

        ,'.jpg?fit=crop&amp;w=300" srcset="https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpg?fit=crop&amp;w=300 300w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpg?fit=crop&amp;w=490 490w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpg?fit=crop&amp;w=600 600w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpg?fit=crop&amp;w=750 750w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.jpg?fit=crop&amp;w=910 910w, https://bildix.mmcloud.se/bildix/api/images/'

        ,'.png?fit=crop&amp;w=300" srcset="https://bildix.mmcloud.se/bildix/api/images/'
        ,'.png?fit=crop&amp;w=300 300w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.png?fit=crop&amp;w=490 490w, https://bildix.mmcloud.se/bildix/api/images/'
        ,'.png?fit=crop&amp;w=600 600w, https://bildix.mmcloud.se/bildix/api/images/'

        ,'.jpg?fit=crop&amp;w=1200 1200w" itemprop="image" class="lazy unobserved inline-image" alt="" onerror="this.style.display=\'none !important\'"></div><div class="byline-caption"><div class="byline-caption-inner"><div class="byline" itemprop="copyrightHolder">Bild: '
        ,'.jpg?fit=crop&amp;w=1200 1200w" itemprop="image" class="lazy unobserved inline-image" alt='
        ,'</div></div></div><div class="clearfix"></div></figure><p class="body"></p></section><section class="byline"><div class="name" itemprop="author">'
        ,'</div></div></div><div class="clearfix"></div></figure><p class="body"><strong>'
        ,'</div></div></div><div class="clearfix"></div></figure><p class="body">'
        ,'</a></section></div><div class="column large-third medium-third article-aside"></div></div>'

        ,'</div></div></div><p class="body"></p></section><section class="byline"><div class="name" itemprop="author">'
        ,'</p></section><section class="byline"><div class="name" itemprop="author">'
        ,'</a></p><p class="body"></p><p class="body"><strong>'
        ,'</a></p><p class="body"><a href="/artikel/'
        ,'</a></section><section class="byline"><div class="name" itemprop="author">'

        ,'</div></div></div><p class="body">'
        ,'</strong></p><p class="body">'
        ,'</a></p><p class="body">'
        ,'onerror="this.style.display=\'none !important\'"></div><div class="byline-caption"><div class="byline-caption-inner"><figcaption class="caption">'
        ,'onerror="this.style.display=\'none !important\'"></div><div class="clearfix"></div></figure><p class="body">'
        ,'</figcaption></div></div><div class="clearfix"></div></figure><p class="body">'
        ,'</figcaption><div class="byline" itemprop="copyrightHolder">Bild: '
        ,'</div></div></div><div class="clearfix"></div></figure><h2 class="subheadline1">'

        ,'</div><a href="tel://" class="phone"></a><a href="mailto:" class="email">'
        ,'</div><a href="tel://" class="phone"></a><a href="mailto'
        ,'</p><div class="row unpadded"><div class="column large-full inline-resource"><div class=""><iframe id='
        ,'src="https://resource-service.mmcloud.se/api/v1/resources/ssl'

        ,'</p><div class="row unpadded"><div class="column large-full inline-resource"><div class="responsive-iframe-container'
        ,' frameborder="0" width="100%" scrolling="no" class="twittertweet-resource" allowfullscreen=""></iframe><script>(function() {var iframe = document.getElementById("resource-id-'
        ,'");function messageHandler(event) {try {var data = JSON.parse(event.data);if(data.origin === \'https://resource-service.mmcloud.se/api/v1/resources/ssl/'
        ,'{iframe.height = data.height;}} catch(e) {}}if(window.addEventListener) {window.addEventListener("message", messageHandler, false);} else {window.attachEvent("onmessage", messageHandler);}})();</script>'
        ,'frameborder="0" width="100%" scrolling="no" class="solidtango-resource" allowfullscreen=""></iframe><script>(function() {var iframe = document.getElementById("resource-id-'

        ,'frameborder="0" width="100%" scrolling="no" class="infogram-resource" allowfullscreen=""></iframe><script>(function() {var iframe = document.getElementById("resource-id-'
        ,'frameborder="0" width="100%" scrolling="no" class="googlemaps-resource" allowfullscreen=""></iframe><script>(function() {var iframe = document.getElementById("resource-id-'
        ,'</p><h2 class="subheadline1">'
        ,'</p><p class="body"><strong>'
        ,'</p><p class="body">'
        ,'</h2><p class="body">'
        ,'<a href="/artikel/'
        ,'</div><a href="tel:'
        ,'</a><a href="mailto'
        ,'https://bildix.mmcloud.se/bildix/api/images/'
        ,'</p><h2 class="subheadline1">'
        ,'<p class="body">'
        ,'@mittmedia.se" class="email">'
        ,'</p><blockquote class="pull-quote">'
        ,'onerror="this.style.display=\'none !important\'"></div><div class="byline-caption"><div class="byline-caption-inner"><div class="byline" itemprop="copyrightHolder">'
        ,'</figcaption><div class="byline" itemprop="copyrightHolder">'
        ,'ratio-4-3"><iframe id="resource-'
        ,'scrolling="no" class="googlemaps-resource" allowfullscreen=""></iframe><script>\n(function() {\nvar iframe = document.getElementById("resource-id-'
        ,'");\nfunction messageHandler(event) {\ntry {\nvar data = JSON.parse(event.data);\nif(data.origin === \'https://resource-service.mmcloud.se/api/v1/resources/ssl/'
        ,'{\niframe.height = data.height;\n}\n} catch(e) {}\n}\nif(window.addEventListener) {\nwindow.addEventListener("message", messageHandler, false);\n} else {\nwindow.attachEvent("onmessage", messageHandler);\n}\n})();\n</script>'
    ];
}

