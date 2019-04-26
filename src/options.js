function save_options() {
    var intervall = Number(document.getElementById('intervall').value);
    
    chrome.storage.local.set({
        'intervall': intervall
    }, function () {

        chrome.alarms.clear("checkerAlarm", function(wasCleared){
            console.log(wasCleared);
            chrome.alarms.create("checkerAlarm", {
                delayInMinutes: 1,
                periodInMinutes: intervall
            });
        });

        var status = document.getElementById('status');
        status.textContent = 'Sparat';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.local.get({
        'intervall': 15
    }, function (items) {
        document.getElementById('intervall').value = items.intervall;
        });

    if(typeof chrome.storage.local.getBytesInUse == 'function') { 
        chrome.storage.local.getBytesInUse(function (bytes) {
            console.log(bytes)
            document.getElementById('mem').textContent = bytes;
            document.getElementById('mem-div').style.display="block";
        }); 
    }
    
    readCacheFromStorage(function(linksCache){
        console.log(linksCache.length);
        document.getElementById('article-count').textContent = linksCache.length;
        $.each(linksCache, function(index, link) {
            console.log(link.key);
            let name = link.key.substring(link.key.lastIndexOf("/") + 1, link.key.length).replace(new RegExp('-','g'),' ');
            $("#plus-links").prepend('<li><a target="_blank" href="https://www.aftonbladet.se'+link.key+'"><h3>'+name.charAt(0).toUpperCase() + name.slice(1)+'</h3></a></li>');
        });
    });

}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
