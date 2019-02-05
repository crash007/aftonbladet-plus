function save_options() {
    var intervall = Number(document.getElementById('intervall').value);
    var notify = document.getElementById('notify').checked;
    console.log("Intervall: "+intervall);
    console.log("Notify: "+ notify);

    chrome.storage.local.set({
        'intervall': intervall,
        'notify': notify
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
        'intervall': 15,
        'notify': false
    }, function (items) {
        document.getElementById('intervall').value = items.intervall;
        document.getElementById('notify').checked = items.notify;
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
    });

}

function exportData() {
    console.log("exporting data");
    readCacheFromStorage(function (linksCache) {
        
        var result =[];
        console.log(linksCache);
        $(linksCache).each(function(){
            result.push(this.key, decompress(this.value));
        });

        var linksCacheStr = JSON.stringify(result);
        console.log(linksCacheStr);

        // Save as file
        var blob = new Blob([linksCacheStr], {type: "application/json"});
        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: 'export.json',
            conflictAction : 'uniquify'
        });
    });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('export').addEventListener('click', exportData);