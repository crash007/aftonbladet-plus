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

}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
