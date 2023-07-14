if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

function parseDate(date) {
    var splitDateTime = date.split(' ');
    var splitDate = splitDateTime[0].split('/');
    console.log(splitDate[0] + '/' + (splitDate[1] - 1) + '/' + splitDate[2]);
    return new Date(splitDate[2], (splitDate[1] - 1), splitDate[0]);
}

var enableDateTimePickers = function (onChange) {
    jQuery.validator.methods["date"] = function (value, element) { return Date.parseExact(value, "dd/MM/yyyy"); }
    var language = window.navigator.userLanguage || window.navigator.language;
    $('.datetime-picker').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        language: language
    }).on('changeDate', onChange);
   
};

//var enableDateTimePickers = function (onChange) {
//    jQuery.validator.methods["date"] = function (value, element) { return Date.parseExact(value, "dd/MM/yyyy"); }
//    $('.datetime-picker').datetimepicker({
//        format: 'DD/MM/YYYY'
//    }).on('dp.change', onChange);

//    $(".datetime-picker-group").each(function () {
//        var parent = this;
//        $('.datetime-picker-end', parent).data("DateTimePicker").useCurrent(false);
//        $(".datetime-picker-start", parent).on("dp.change", function (e) {
//            $(".datetime-picker-end", parent).data("DateTimePicker").minDate(e.date);
//        });
//        $(".datetime-picker-end", parent).on("dp.change", function (e) {
//            $(".datetime-picker-start", parent).data("DateTimePicker").maxDate(e.date);
//        });
//    });
//};

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        if ($(settings.nTable).closest('.modal').length == 0)
        {
            var dateFilter = parseInt($('#DateFilter').val());
            var startDate = $('#StartDate').val();
            var endDate = $('#EndDate').val();

            if (dateFilter > 0 && startDate != '' && endDate != '') {
                var start = Date.parseExact(startDate, 'dd/MM/yyyy');
                var end = Date.parseExact(endDate, 'dd/MM/yyyy');
                var current = Date.parseExact(data[dateFilter], 'dd/MM/yyyy');

                if (current >= start && current <= end) 
                    return true;
                
                return false;
            }
        }
        return true;
    }
);

$(document).ready(function () {
  
    $('.modal').on('show.bs.modal', reposition);

    var checkLogin = function () {
        if (docCookies.getItem(".ADAuthCookie") == null) {
            $('#modal-session').modal('show');
            window.clearInterval(intervalID);
        }
    };

    var intervalID = window.setInterval(checkLogin, 120000);
});

var reposition = function () {
    repositionModal($(this));
};

var repositionModal = function (modal) {
    $(window).trigger('resize');
};

var updateError = function (responseText) {
    $('#modal-error-content').html(responseText);
    $('#modal-error').modal({
        keyboard: true
    }, 'show');
};

var docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};