var myDB = chrome.extension.getBackgroundPage().myDB;
var storeName = chrome.extension.getBackgroundPage().storeName;
var langarry = chrome.extension.getBackgroundPage().lang_arry;
var weekarry = chrome.i18n.getMessage("weekarry2").split(',');
var valChecked = '';

$(document).ready(function() {
	var op = "";
	var lang = "<option value='' disabled >" + chrome.i18n.getMessage("langsel") + "</option>";
    $(langarry).each(function(index, el) {
        lang += '<option value="' + el.lang + '">' + el.name + '</option>';
    });
    $(lang).appendTo('#langsel');
    $(weekarry).each(function(index, el) {
        op += '<option value="' + index + '">' + el + '</option>';
    });
    $(op).appendTo('#sel');
    var id = $.getUrlParam('xh');
    if (id != -1) {
        var transaction = myDB.db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var request = store.get(id);
        request.onsuccess = function(e) {
            var value = e.target.result;
            if (value.timefrequencys.split(',').length > 0) {
                var arrytimeFrequency = value.timefrequencys.split(',');
                for (var i = 0; i < arrytimeFrequency.length; i++) {
                    $("option[value=" + arrytimeFrequency[i] + "]").attr('selected', true);
                }
            }
            $("#inputHour").attr('value', value.hour);
            $("#inputMinute").attr('value', value.minute);
            $("#langsel option[value='" + value.lang + "']").attr('selected', 'selected');
            $("#inputTitle").attr('value', value.title);
            $("#inputContent").attr('value', value.content);
            $("#inputUrl").attr('value', value.url);
            if (JSON.parse(value.state)) {
                $("#used").attr('checked', true);
            } else {
                $(".labelBox").css('background', '#bbbbbb');
            }
            $("#inputHour").parent().addClass('input--filled');
            $("#inputMinute").parent().addClass('input--filled');
            $("#inputTitle").parent().addClass('input--filled');
            if (value.content != '') {
                $("#inputContent").parent().addClass('input--filled');
            }
            if (value.url != '') {
                $("#inputUrl").parent().addClass('input--filled');
            }
            checksel();
        };
    } else {
        checksel();
    }
    text_checkbox_read();
    btn_read();
    setInfo();
});

function checksel() {
    $("#sel").multiselect({
        show: ["bounce", 200],
        hide: ["explode", 1000],
        minWidth: 350,
        selectedText: function(numChecked, numTotal, checkedItems) {

                valChecked = "";
                if (numChecked == 0) {
                    valChecked = chrome.i18n.getMessage("never");
                } else if (numChecked == numTotal) {
                    valChecked = chrome.i18n.getMessage("everyday");
                } else {
                    for (var i = 0; i < checkedItems.length; i++) {
                        valChecked += weekarry[checkedItems[i].value] + ' ';
                    }
                }
            return valChecked;
        },
        checkAllText: chrome.i18n.getMessage("allSel"),
        uncheckAllText: chrome.i18n.getMessage("noSel"),
        noneSelectedText: chrome.i18n.getMessage("oneday")
    });
    var SelectFX = window.SelectFX;
    var selectElement = document.getElementById("langsel");
    new SelectFX(selectElement, {
        onChange: function(val) {
            $('.cs-options').parent().addClass('selected-underline');
        }
    });
}

//获取参数
(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    };
})(jQuery);

function text_checkbox_read() {
    var xh = $.getUrlParam('xh');
    //text绑定样式
    $("input[name='input']").each(function() {
        $(this).off('focus').on('focus', function() {
            if (!$(this).parent().hasClass('input--filled')) {
                $(this).parent().addClass('input--filled');
            }
        });
        $(this).off('blur').on('blur', function() {
            if ($.trim($(this).val()) == '') {
                $(this).parent().removeClass('input--filled');
            }
        });
    });

    //时间控制输入格式
    $("#inputHour").keyup(function() {
        $(this).val($(this).val().replace(/[^0-9]\D*$/, "") % 24);
        $(this).val($(this).val() < 10 ? '0' + $(this).val() : $(this).val());
    });
    $("#inputHour").on('paste', function() {
        return !clipboardData.getData('text').match(/\D/);
    });
    $("#inputMinute").keyup(function() {
        $(this).val($(this).val().replace(/[^0-9]\D*$/, "") % 60);
        $(this).val($(this).val() < 10 ? '0' + $(this).val() : $(this).val());
    });
    $("#inputMinute").on('paste', function() {
        return !clipboardData.getData('text').match(/\D/);
    });

    //checkbox 加载、改变样式
    if (xh == '-1') {
        $("#used").attr('checked', true);
    }

    $("#used").off('change').on('change', function() {
        if ($("#used").is(':checked')) {
            $(this).parent().css('background', '#26ca28');
        } else {
            $(this).parent().css('background', '#bbbbbb');
        }
    });
}

function getTimeFrequency() {
    if ($("#sel option:selected").length == 0) {
        return '-1';
    } else {
        var arry_timeFrequency = [];
        $("#sel option:selected").each(function() {
            arry_timeFrequency.push($(this).attr('value'));
        });
        return arry_timeFrequency.join(',');
    }

}

function setInfo() {
    $(document).attr("title", chrome.i18n.getMessage("addTitle"));
    $('#addRemLater').text(chrome.i18n.getMessage("addRemLater"));
    $('#addRemTime').text(chrome.i18n.getMessage("addRemTime"));
    $('#addRemTimeH').text(chrome.i18n.getMessage("addRemTimeH"));
    $('#addRemTimeM').text(chrome.i18n.getMessage("addRemTimeM"));
    $('#addRemPer').text(chrome.i18n.getMessage("addRemPer"));
    $('#addRemContent').text(chrome.i18n.getMessage("addRemContent"));
    $('#addRemContentT').text(chrome.i18n.getMessage("addRemContentT"));
    $('#addRemContentD').text(chrome.i18n.getMessage("addRemContentD"));
    $('#addRemContentL').text(chrome.i18n.getMessage("addRemContentL"));
    $('#sub').html(chrome.i18n.getMessage("addCommit"));
}

function saveData() {
    var info = "";
    var xh = $.getUrlParam('xh');
    if ($.trim($("#inputHour").val()) == "" || $.trim($("#inputMinute").val()) == "" || $.trim($("#inputTitle").val()) == "" || $("#langsel").val() == null) {
        info = chrome.i18n.getMessage("addTS");
    }
    console.log($("#langsel").val());
    if (info != "") {
        $("#tipinfo").text(info);
        showtip('tip', 'tipinfo');
        setTimeout(function() {
            closetip('tip');
        }, 3000);
        $("#inputHour").parent().addClass('input--filled');
        $("#inputMinute").parent().addClass('input--filled');
        $("#inputTitle").parent().addClass('input--filled');
        $("#langsel").parent().addClass('selected-underline');
        return false;
    } else {
        var reminds = [{
            id: chrome.extension.getBackgroundPage().guid(),
            state: $("#used").is(':checked') ? true : false,
            hour: $("#inputHour").val(),
            minute: $("#inputMinute").val(),
            lang: $("#langsel").val(),
            title: $("#inputTitle").val(),
            content: $("#inputContent").val(),
            url: $("#inputUrl").val(),
            timefrequencys: getTimeFrequency()
        }];
        if (xh == '-1') {
            chrome.extension.getBackgroundPage().addData(myDB.db, storeName, reminds);
        } else {
            id = xh;
            var transaction = myDB.db.transaction(storeName, 'readwrite');
            var store = transaction.objectStore(storeName);
            var request = store.get(id);
            request.onsuccess = function(e) {
                var remindinfo = e.target.result;
                remindinfo.state = $("#used").is(':checked') ? true : false;
                remindinfo.hour = $("#inputHour").val();
                remindinfo.minute = $("#inputMinute").val();
                remindinfo.lang = $("#langsel").val();
                remindinfo.title = $("#inputTitle").val();
                remindinfo.content = $("#inputContent").val();
                remindinfo.url = $("#inputUrl").val(),
                    remindinfo.timefrequencys = getTimeFrequency();
                store.put(remindinfo);
            };
        }
        return true;
    }
}

function btn_read() {
    $("#sub").off().on('click', function() {
        if (saveData()) {
            chrome.extension.getBackgroundPage().reloadOptionHtml('/options.html');
            chrome.extension.getBackgroundPage().remind();
            $("#ok").off();
            setTimeout(function() {
                window.close();
            }, 300);
        }
    });
}
