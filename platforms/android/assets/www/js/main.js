
var storage = window.localStorage;

$(document).ready(function () {
    checkItemStorage();
});

$(document).on('click', '#options', function () {
    $("#send").popup();
    $("#send").popup("open");
    $("#send #sms").on("click", function () {
        sendSms();
    });
});
var n = 0;
// Save entered text to localStorage
$(document).on('click', '#btn1', function () {
    if ($('#datavalue').val() == "" || $('#datavalue').val() == null) {
        $("#empty").popup();
        $("#empty").popup("open");
        // Proceed when the user confirms
        $("#confirm #ok").on("click", function () {
            $("#empty").popup("close");
        });
    } else {
        for (var key in storage) {
            if (parseInt(key) > n) {
                n = key;
            }
        }
        n++;
        storage.setItem(n, $('#datavalue').val());

        var htmlData = "";

        htmlData += "<li><div class='behind item' id='" + n + "' data-id='" + n + "'><a href='#' class='ui-btn bought-btn'>Bought</a><a href='#' class='ui-btn edit-btn pull-left'>Edit</a></div><a href='#' id='" + n + "bought'>" + $('#datavalue').val() + "</a></li>";

        $('#datalist').append(htmlData).promise().done(function () {
            $(this).listview("refresh");
            $('#datavalue').val("");
        });
    }
});

function checkItemStorage() {
    if (storage.length < 1) {
        $('#datalist').empty();
    } else {
        $('#datalist').empty();
        var htmlData = "";
        for (var i = 0; i < storage.length; i++) {
            htmlData += "<li><div class='behind item' id='" + storage.key(i) + "' data-id='" + storage.key(i) + "'><a href='#' class='ui-btn bought-btn'>Bought</a><a href='#' class='ui-btn edit-btn pull-left'>Edit</a></div><a href='#' id='" + storage.key(i) + "bought'>" + storage.getItem(storage.key(i)) + "</a></li>";
        }
        $('#datalist').append(htmlData).promise().done(function () {
            $(this).listview("refresh");
        });
    }
}

// Clear localStorage;
$(document).on('click', '#btn2', function () {
    $("#confirm").popup();
    $("#confirm").popup("open");
    // Proceed when the user confirms
    $("#confirm #yes").on("click", function () {
        n = 0;
        storage.clear();
        checkItemStorage();
    });
    $("#confirm #cancel").on("click", function () {
        $("#confirm #yes").off();
    });
});

$(function () {
    function prevent_default(e) {
        e.preventDefault();
    }
    function disable_scroll() {
        $(document).on('touchmove', prevent_default);
    }
    function enable_scroll() {
        $(document).unbind('touchmove', prevent_default)
    }
    var x;
    $('.swipe-delete')
        .on('touchstart', "li > a", function (e) {
            console.log(e.originalEvent.pageX)
            $('.swipe-delete li > a.open').css('left', '0px').removeClass('open') // close em all
            $(e.currentTarget).addClass('open')
            x = e.originalEvent.targetTouches[0].pageX // anchor point
        })
        .on('touchmove', "li > a", function (e) {
            var change = e.originalEvent.targetTouches[0].pageX - x
            change = Math.min(Math.max(-100, change), 100) // restrict to -100px left, 0px right
            e.currentTarget.style.left = change + 'px'
            if (change < -10 || change > 10) disable_scroll() // disable scroll once we hit 10px horizontal slide
        })
        .on('touchend', "li > a", function (e) {
            var left = parseInt(e.currentTarget.style.left)
            var new_left;
            if (left < -35) {
                new_left = '-100px'
            } else if (left > 35) {
                new_left = '100px'
            } else {
                new_left = '0px'
            }
            // e.currentTarget.style.left = new_left
            $(e.currentTarget).animate({ left: new_left }, 200)
            enable_scroll()
        });
    $(document).on('touchend', ".bought-btn", function (e) {
        e.preventDefault()
        $("#" + $(this).parent().attr('id') + "bought").toggleClass("bought");
    });
    $(document).on('touchend', ".edit-btn", function (e) {
        e.preventDefault()
        // $(this).parents('li').children('a').html('edited')
        var data_id = $(this).parents().data('id');
        $("#editMenu").popup();
        $("#editMenu").popup("open");

        $("#editMenu #takePhoto").on("click", function () {
            openCamera();
            $("#editMenu").popup("close");
        });
        $("#editMenu #delete").on("click", function () {
            $("li > a:contains(" + storage.getItem(data_id) + ")").each(function () {
                if ($(this).text() === storage.getItem(data_id)) {
                    $(this).parent().remove();
                }
            });
            localStorage.removeItem(data_id);
            $("#editMenu").popup("close");
        });
        $("#confirm #cancel").on("click", function () {
            $("#confirm #yes").off();
        });
    })
});


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log(navigator.camera);
    console.log(sms);
}

function sendSms() {
    var number = document.getElementById('numberTxt').value;
    var message = document.getElementById('messageTxt').value;
    console.log("number=" + number + ", message= " + message);

    //CONFIGURATION
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
        }
    };

    var success = function () { alert('Message sent successfully'); };
    var error = function (e) { alert('Message Failed:' + e); };
    sms.send(number, message, options, success, error);
}

function openCamera() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        targetWidth: 400,
        targetHeight: 400,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
    });
    console.log("Take Picture button clicked");
}; // "click" button event handler
// deviceready event handler

function onSuccess(imageData) {
    var image = document.getElementById('image');
    image.src = "data:image/jpeg;base64," + imageData;
    image.style.margin = "10px";
    image.style.display = "block";
}
function onFail(message) {
    console.log("Picture failure: " + message);
}