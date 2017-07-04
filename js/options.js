"use strict";
var weekarry = chrome.i18n.getMessage("weekarry").split(',');
var addconfig = '<p style="margin-bottom:10px;" ><a class="button button-caution  button-block button-rounded button-large" style="color:#fff;" id="upFileBtn" href="#"><i class="fa fa-folder-open"></i>' + chrome.i18n.getMessage("opReadBtn") + '</a></p><div class="fileInput"><input type="file" name="upfile" id="upfile" accept="text/plain" class="upfile" /></div><div id="drop_div"><div style="margin:auto">' + chrome.i18n.getMessage("opDraginfo") + '</div></div ><p style="margin-top:10px;"><a class="button button-action button-block button-rounded button-large "  style="color:#fff;" id="ok" href="#"><i class="fa fa-cloud-upload"></i>' + chrome.i18n.getMessage("opUploadBtn") + '</a></p>';
var textarea = '<textarea id="inportcontent" rows="6" readonly="readonly" wrap="off"></textarea>';
var myDB = chrome.extension.getBackgroundPage().myDB;
var storeName = 't_remind';
var Overlay;
var clocks = new $.tantt($("#clocks"), $("body"));
var speak = chrome.extension.getBackgroundPage().speak;
var lang_arry = chrome.extension.getBackgroundPage().lang_arry;
//是否启用
function ghost(noActivated) {
    var tmp = !noActivated;
    if (tmp) {
        $("a[name='addbtn']").off();
        $("a[name='delbtn']").off();
    } else {
        $("a[name='addbtn']").off().click(function () {
            loadWindowList('-1');
        });
        $("a[name='delbtn']").off().click(function () {
            delRow();
        });
    }
    chrome.extension.getBackgroundPage().remind();
}


//查询语言声音
function getLangVoice(lang_arry, lang) {
    return $.grep(lang_arry, function (n, i) {
        return n.lang == lang;
    });
}
//设置页面中文信息
function setInfo() {
    $(document).attr("title", chrome.i18n.getMessage("opTitle"));
    $('#opTitleTxt').text(chrome.i18n.getMessage("opTitleTxt"));
    $('#opEnable').text(chrome.i18n.getMessage("opEnable"));
    $('#opVoice').text(chrome.i18n.getMessage("opVoice"));
    $('#clocksel').text(chrome.i18n.getMessage("opSelcloBtn"));
    $('#testbtn').text(chrome.i18n.getMessage("opSimulateBtn"));
    $('#opList').text(chrome.i18n.getMessage("opList"));
    $('#addbtn').text(chrome.i18n.getMessage("opListAddbtn"));
    $('#delbtn').text(chrome.i18n.getMessage("opListDelbtn"));
    $('#inportbtn').text(chrome.i18n.getMessage("opListInbtn"));
    $('#exportbtn').html(chrome.i18n.getMessage("opListOutbtn"));
    $('#remindTab>thead th:eq(1)').text(chrome.i18n.getMessage("opListHeadCol2"));
    $('#remindTab>thead th:eq(2)').text(chrome.i18n.getMessage("opListHeadCol3"));
    $('#remindTab>thead th:eq(3)').text(chrome.i18n.getMessage("opListHeadCol4"));
    $('#remindTab>thead th:eq(4)').text(chrome.i18n.getMessage("opListHeadCol5"));
    $('#remindTab>thead th:eq(5)').text(chrome.i18n.getMessage("opListHeadCol6"));
    $('#remindTab>thead th:eq(6)').text(chrome.i18n.getMessage("opListHeadCol7"));
    $('#delbtn').text(chrome.i18n.getMessage("opListDelbtn"));
    $('#inportbtn').text(chrome.i18n.getMessage("opListInbtn"));
    $('#exportbtn').html(chrome.i18n.getMessage("opListOutbtn"));
}

//判断是否打开新增提醒页面
function loadWindowList(xh) {
    var windowidList = [];
    var windowurlList = [];
    chrome.windows.getAll({
        populate: true
    }, function (windowList) {
        for (var i = 0; i < windowList.length; i++) {
            windowidList.push(String(windowList[i].id));
            for (var j = 0; j < windowList[i].tabs.length; j++) {
                windowurlList.push(windowList[i].tabs[j].url);
            }
            windowurlList.push(windowList[i].url);
        }
        if ((windowidList.indexOf(localStorage.add_window) > -1 && xh == -1) || windowurlList.indexOf(window.location.href.replace('options', 'add').replace('#', '') + '?xh=' + xh) > -1) {
            chrome.windows.update(parseInt(localStorage.add_window, 10), {
                focused: true
            });
        } else {
            openaddHtml(xh);
        }
    });
}



//打开提醒页面
function openaddHtml(xh) {
    var ileft = (window.screen.width - 730) / 2;
    var iheight = 800;
    if (window.height <= 800) {
        iheight = window.height;
    }
    chrome.windows.create({
        url: "add.html?xh=" + xh + "",
        left: ileft,
        width: 730,
        height: iheight,
        type: "popup"
    }, function (window) {
        localStorage.add_window = window.id;
    });

}

//删除行
function delRow() {
    if ($("a[name='checkSel'][class='divCheckBoxSel']").length == 0) {
        var newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opNoRowsel"), "info");
        setTimeout(function () {
            closetip(newname);
        }, 2000);
    } else {

        $("a[name='checkSel'][class='divCheckBoxSel']").each(function () {
            var delId = $(this).attr('id').replace($(this).attr('name') + '-', '');
            chrome.extension.getBackgroundPage().deleteDataByKey(myDB.db, storeName, delId);
            $("a[name='checkSel'][class='divCheckBoxSel']").parent().parent().remove();
        });

    }
}

//checkBOX加载
function clickCbx() {
    $("#remindTab").on("click", "a[name='checkSel']", function () {
        if ($(this).hasClass('divCheckBoxSel')) {
            $(this).removeClass('divCheckBoxSel').addClass('divCheckBoxNoSel');
        } else {
            $(this).removeClass().addClass('divCheckBoxSel');
        }
    });
    $("#remindTab").on("click", "a[id='checkAllSel']", function () {
        if ($(this).hasClass('divCheckBoxSel')) {
            $(this).removeClass().addClass('divCheckBoxNoSel');
            $("a[name='checkSel']").removeClass().addClass('divCheckBoxNoSel');
        } else {
            $(this).removeClass().addClass('divCheckBoxSel');
            $("a[name='checkSel']").removeClass().addClass('divCheckBoxSel');
        }
    });

    $("#remindTab").on('change', "input[name='isuse']", function () {
        var zt;
        var transaction = myDB.db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var updateId = $(this).attr('id').replace($(this).attr('name') + '-', '');
        var request = store.get(updateId);
        if ($(this).is(':checked')) {
            $(this).parent().css('background', '#26ca28');
            zt = true;
        } else {
            $(this).parent().css('background', '#bbbbbb');
            zt = false;
        }
        request.onsuccess = function (e) {
            var remindinfo = e.target.result;
            remindinfo.state = zt;
            store.put(remindinfo);
            chrome.extension.getBackgroundPage().remind();
        };
    });
}
//提醒列表加载
function tab_ready() {
    var transaction = myDB.db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore(storeName);
    var cursorRequest = store.openCursor();
    cursorRequest.onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            //console.log(cursor.value.hour);
            if (cursor.key != '') {
                var id = cursor.key;
                var state = cursor.value.state;
                var hour = cursor.value.hour;
                var minute = cursor.value.minute;
                var lang = cursor.value.lang;
                chrome.extension.getBackgroundPage().lang_arry.forEach(function (el) {
                    if (el.lang == lang) {
                        lang = el.name;
                        return;
                    }
                });
                var title = cursor.value.title;
                var content = cursor.value.content;
                var url = cursor.value.url;
                var weeks = cursor.value.timefrequencys;
                var remindWeek = "";
                var isuse;
                var isuesid = "isuse-" + id;
                var timeid = "time-" + id;
                var checkSelid = "checkSel-" + id;
                if (weeks == '-1') {
                    remindWeek = chrome.i18n.getMessage("oneday");
                } else {
                    if (weeks.split(',').length == 7) {
                        remindWeek = chrome.i18n.getMessage("everyday");
                    } else {
                        for (var j = 0; j < weeks.split(',').length; j++) {
                            remindWeek += weekarry[parseInt(weeks.split(',')[j], 10)] + ' ';
                        }
                    }
                }
                if (state) {
                    isuse = 'checked="true"';
                } else {
                    isuse = "";
                }
                var newRow = '<tr><th><a name="checkSel" id=' + checkSelid + ' class="divCheckBoxNoSel"></a></th><th><div  class="labelBox"><input type="checkbox"  id=' + isuesid + ' name="isuse" ' + isuse + '><label for=' + isuesid + ' class="check"></label></div></th><th><a id=' + timeid + ' name=time href="javascript:void(0);" >' + hour + ':' + minute + '(' + remindWeek + ')</a></th><th><div name="lang">' + lang + '</div></th><th><div name="title"    >' + title + '</div></th><th><div  name="content" >' + content + '</div></th><th><a name="addrs" href=' + url + ' target="_blank" >' + url + '</a></th></tr>';
                $("#remindTab").append(newRow);
                $("a[name='time']").each(function () {
                    $(this).off().on('click', function () {
                        loadWindowList($(this).attr('id').replace('time-', ''));
                    });
                });
                $("input[name='isuse']").each(function () {
                    if ($(this).is(':checked')) {
                        $(this).parent().css('background', '#26ca28');
                    } else {
                        $(this).parent().css('background', '#bbbbbb');
                    }
                });
            }
            cursor.continue();
        }
    };
}
//将内容下载到本地
function downloadFile(fileName, content) {
    var blob = new Blob([content]);
    if (window.saveAs) {
        window.saveAs(blob, fileName);
    } else {
        var aLink = document.createElement('a');
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    }

}

//弹出框加载
function Dialog_ready() {
    //提交按钮
    $("#dialog").on('click', "#ok", function () {
        var content = [];
        if ($("#inportcontent").length < 1) {

            var newname = showtip('tip', 'tipinfo', chrome.i18n.getMessage("opNoFile"), 'info');
            setTimeout(function () {
                closetip(newname);
            }, 3000);
            return;
        }
        var str = $("#inportcontent").val();
        content = str.split('\n');
        var info = "";
        var reminds = [];
        for (var i = 0; i < content.length; i++) {
            if (content[i] === "") {
                continue;
            }
            var new_arry = content[i].split('~');
            if (new_arry.length != 9) {
                info += '|' + (i + 1);
            } else {
                var remind = {
                    id: new_arry[0],
                    hour: new_arry[1],
                    minute: new_arry[2],
                    lang: new_arry[3],
                    title: new_arry[4],
                    content: new_arry[5],
                    url: new_arry[6],
                    state: new_arry[7],
                    timefrequencys: new_arry[8]
                };
                reminds.push(remind);
            }
        }
        info = info.substr(1, info.length - 1);
        chrome.extension.getBackgroundPage().addData(myDB.db, storeName, reminds);
        if (info == "") {
            setTimeout(function () {
                location.reload();
            }, 100);
        }
        if (info.split('|').length > 10) {
            var newname = showtip('tip', 'tipinfo', chrome.i18n.getMessage("opInfoManyErr"), 'error');
            setTimeout(function () {
                closetip(newname);
            }, 2000);
        } else {
            var newname = showtip('tip', 'tipinfo', info + chrome.i18n.getMessage("opInfoHErr"), 'error');
            setTimeout(function () {
                closetip(newname);
            }, 2000);
        }

    });
    //上传按钮
    $("#dialog").on('click', "#upFileBtn", function () {
        $("#upfile").click();
    });
    $("#dialog").on('change', "#upfile", function () {
        var resultFile = $("#upfile")[0].files[0];
        var file = $("#upfile");
        file.after(file.clone().val(""));
        file.remove();
        if (resultFile.size > 30000) {
            var newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opInfoTooLarge"), "error");
            setTimeout(function () {
                closetip(newname);
            }, 3000);
            return false;
        }
        if (resultFile) {
            var reader = new FileReader();
            reader.readAsText(resultFile, 'utf-8');
            reader.onload = function () {
                var urlData = this.result;
                $("#drop_div")[0].innerHTML = "";
                $("#drop_div").append(textarea);
                $("#inportcontent")[0].innerHTML = urlData;
            };
        }
    });
    //拖拽上传
    $('#dialog').on(
        'dragover',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    $('#dialog').on(
        'dragenter',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    $("#dialog").on('drop', function (e) {
        if (e.originalEvent.dataTransfer) {
            if (e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                if (e.originalEvent.dataTransfer.files[0].type.substring(0, 5) != 'text/') {
                    var newname = showtip('tip', 'tipinfo', chrome.i18n.getMessage("opInfoNoTxt"), 'error');
                    setTimeout(function () {
                        closetip(newname);
                    }, 2000);
                    return false;
                }
                if (e.originalEvent.dataTransfer.files[0].size > 30000) {
                    var newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opInfoTooLarge"), "error");
                    setTimeout(function () {
                        closetip(newname);
                    }, 3000);
                    return false;
                }
                var reader = new FileReader();
                reader.readAsText(e.originalEvent.dataTransfer.files[0], 'utf-8');
                reader.onload = function () {
                    var urlData = this.result;
                    $("#drop_div")[0].innerHTML = "";
                    $("#drop_div").append(textarea);
                    $("#inportcontent")[0].innerHTML = urlData;
                };
            }
        }
    });
    //关闭按钮
    $("#dialog").on('click', "#close", function () {
        Overlay.hideOverlayDialog();
        $("#dialog").empty();
    });

}

//时钟加载
function clock_load() {
    if (typeof (localStorage.clockstyle) == 'undefined' || localStorage.clockstyle == "") {
        localStorage.clockstyle = "";
        $("#clock1").css("display", "none");
        $("#clock2").css("display", "none");
    } else {
        if (localStorage.clockstyle == "a") {
            $("#clock2").css("display", "none");
            $("#clock1").css("display", "block");
        }
        if (localStorage.clockstyle == "b") {
            $("#clock1").css("display", "none");
            $("#clock2").css("display", "block");
        }
        var newX = 0,
            newY = 0;
        if (typeof (localStorage.clockX) == "undefined" || localStorage.clockX == '') {
            newX = 0;
            localStorage.clockX = 0;
        } else {
            newX = localStorage.clockX;
        }
        if (typeof (localStorage.clockY) == "undefined" || localStorage.clockY == '') {
            newY = 0;
            localStorage.clockY = 0;
        } else {
            newY = localStorage.clockY;
        }

        clocks.init({
            newX: newX,
            newY: newY,
            end: function (obj) {
                localStorage.clockY = obj.css("top");
                localStorage.clockX = obj.css("left");
            }
        });
        $("#clocks").css("display", "block");

    }

}

function overlaydialogReload(overlayObj, dialogObj) {
    let objLeft = ($(window).width() - dialogObj.width()) / 2;
    let objTop = ($(window).height() - dialogObj.height()) / 2 + $(document).scrollTop();
    dialogObj.css({
        left: objLeft + 'px',
        top: objTop + 'px'
    });
    overlayObj.css({
        "width": "100%",
        "height": "100%"
    });

}
//按钮加载
function button_ready() {
    //查看样式按钮
    $('#testbtn').click(function () {
        var demoInfo = chrome.i18n.getMessage("opDemoInfo");
        chrome.extension.getBackgroundPage().ShowNotification({
            title: demoInfo,
            icon: '../images/tx.png',
            message: demoInfo,
            delayTime: 4000
        });
        speak(demoInfo, 'zh-CN', getLangVoice(lang_arry, 'zh-CN')[0].name);
        if (JSON.parse(localStorage.conn_google)) {
            speak('This is a demonstration', 'en-US', getLangVoice(lang_arry, 'en-US')[0].name);
            speak('これはデモです', 'ja-JP', getLangVoice(lang_arry, 'ja-JP')[0].name);
            speak('이 데모입니다', 'ko-KR', getLangVoice(lang_arry, 'ko-KR')[0].name);
            speak('這是壹個演示', 'zh-HK', getLangVoice(lang_arry, 'zh-HK')[0].name);
        }
    });
    //增加按钮
    $("a[name='addbtn']").click(function () {
        loadWindowList('-1');
    });
    //删除按钮
    $("a[name='delbtn']").click(function () {
        delRow();
    });
    //导出按钮
    $("a[name='exportbtn']").click(function () {
        var transaction = myDB.db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var cursorRequest = store.openCursor();
        var i = 0;
        var str = "";
        var currentstr = '';
        cursorRequest.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                currentstr = chrome.extension.getBackgroundPage().guid() + '~' + cursor.value.hour + '~' + cursor.value.minute + '~' + cursor.value.lang + '~' + cursor.value.title + '~' + cursor.value.content + '~' + cursor.value.url + '~' + cursor.value.state + '~' + cursor.value.timefrequencys;
                if (i == 0) {
                    str = currentstr;
                } else {
                    str = str + '\r\n' + currentstr;
                }
                i++;
                cursor.continue();
            }
        };
        setTimeout(function () {
            if (i == 0) {
                var newname = showtip('tip', 'tipinfo', chrome.i18n.getMessage("opNoContentDown"), 'info');
                setTimeout(function () {
                    closetip(newname);
                }, 2000);
            } else {
                downloadFile(chrome.i18n.getMessage("opDownloadFileName"), str);
            }
        }, 100);
    });

    //导入按钮
    $("a[name='inportbtn']").click(function () {
        $("#dialog").empty().append(addconfig);
        Overlay.showOverlayDialog();
        overlaydialogReload($("#overlay"), $("#dialog"));
    });

    //打开选择时钟DIV
    $("#clocksel").on("click", function () {
        var $clockselDiv = '<div class="clock-sel-dialog"><a class="dialog-part" style="border-right:#9CC2EF 1px solid;"><img class="dialog-part-img"  src="images/clock1.png" /></a><a  class="dialog-part"><img class="dialog-part-img" src="images/clock2.png" /></a></div>';
        $("#dialog").empty().append($clockselDiv);
        Overlay.showOverlayDialog();
        overlaydialogReload($("#overlay"), $("#dialog"));
        //选择A或B时钟
        $(".dialog-part").on("click", function () {
            if ($(".dialog-part").index(this) == 0) {
                localStorage.clockstyle = 'a';
            } else {
                localStorage.clockstyle = 'b';
            }
            Overlay.hideOverlayDialog();
            $("#dialog").empty();
            localStorage.clockX = localStorage.clockY = '';
            clock_load();

        });
    });

    //上移下移按钮
    $("#up_down").click(function () {
        var image = $("#up_down>:first-child")[0].src;
        if (image.indexOf("arrow_up.png") > -1) {
            $(".options").slideUp(400, function () {
                $("#up_down>:first-child")[0].src = image.replace('arrow_up.png', 'arrow_down.png');
                $("#up_down").tooltipster('content', chrome.i18n.getMessage("opDownBtn"));
            });

        } else {
            $('.options').slideDown(500,
                function () {
                    $("#up_down>:first-child")[0].src = image.replace('arrow_down.png', 'arrow_up.png');
                    $("#up_down").tooltipster('content', chrome.i18n.getMessage("opUpBtn"));

                });
        }
    });


}

//页面加载
$(document).ready(function () {
    $.ajax({
        url: 'https://www.google.com.hk/favicon.ico',
        type: 'GET',
        timeout: 5000,
        beforeSend: function () {
            $("a[name='connect_google']").html(chrome.i18n.getMessage("opLinkGoogle0"));
        },
        success: function () {
            localStorage.conn_google = true;
            $("a[name='connect_google']").html(chrome.i18n.getMessage("opLinkGoogle2"));
        },
        error: function () {
            localStorage.conn_google = false;
            $("a[name='connect_google']").html(chrome.i18n.getMessage("opLinkGoogle1"));
        }
    });

    $(window).resize(function () {
        overlaydialogReload($("#overlay"), $("#dialog"));
        clock_load();
    });

    var _isActivated = $("#isActivated");
    setInfo();
    tab_ready();
    clickCbx();
    button_ready();
    Dialog_ready();
    clock_load();
    _isActivated.attr("checked", JSON.parse(localStorage.isActivated));
    $("#tts").attr("checked", JSON.parse(localStorage.isSpeak));
    ghost(_isActivated.is(':checked'));
    // Set the display activation and frequency.
    _isActivated.change(function () {
        var tmp = _isActivated.is(':checked');
        localStorage.isActivated = tmp;
        ghost(tmp);
        var newname;
        if (tmp) {
            newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opRemindOpenInfo"), 'success');
        } else {
            newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opRemindCloseInfo"), 'other');
        }
        setTimeout(function () {
            closetip(newname);
        }, 2000);

    });
    $("#tts").change(function () {
        localStorage.isSpeak = $("#tts").is(':checked');
        var newname;
        if ($("#tts").is(':checked')) {
            newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opVoiceOpenInfo"), 'success');
        } else {
            var newname = showtip("tip", "tipinfo", chrome.i18n.getMessage("opVoiceCloseInfo"), 'other');
        }
        setTimeout(function () {
            closetip(newname);
        }, 2000);
    });
    $('#up_down').tooltipster();

    Overlay = new OverLay($("#overlay"), $("#dialog"));

});

//加载时钟
window.onload = function () {

    //时钟2
    (function () {
        var $clock = $('#clock2'),
            $date = $('#date'),
            $hour = $('#hour'),
            $min = $('#min'),
            $sec = $('#sec');
        for (var i = 1; i < 61; i++) {
            var tempSecs = $('<em class="ishour"></em>'),
                pos = getSecPos(i);
            if (i % 5 == 0) {
                tempSecs.css({
                    "height": $clock.width() * 3 / 80 + "px",
                    "width": "2px"
                });
                tempSecs.append('<i style="-webkit-transform:rotate(' + (-i * 6) + 'deg);">' + (i / 5) + '</i>');
            }
            tempSecs.css({
                "left": pos.x + "px",
                "top": pos.y + "px",
                "-webkit-transform": "rotate(" + i * 6 + "deg)"
            });
            tempSecs.appendTo($clock);
        }

        // 圆弧上的坐标换算
        function getSecPos(dep) {
            var hudu = (2 * Math.PI / 360) * 6 * dep,
                r = $clock.width() / 2; //半径大小由于边框影响x方向增加了2px
            return {
                x: Math.floor(r + 2 + Math.sin(hudu) * r),
                y: Math.floor(r - Math.cos(hudu) * r),
            }
        };

        // 当前时间
        var _now = new Date(),
            _h = _now.getHours(),
            _m = _now.getMinutes(),
            _s = _now.getSeconds();
        var p = 0,
            c = 0;
        var _day = _now.getDay(),
            weekAry = chrome.i18n.getMessage("weekarry2").split(',');
        $date.html(_now.getFullYear() + '-' + padNumber(_now.getMonth() + 1) + '-' + padNumber(_now.getDate()) + ' ' + weekAry[_day]);
        //绘制时钟
        $sec.css("display", "none");
        $hour.css("display", "none");
        $min.css("display", "none");
        var gotime = function () {
            var _h_dep = 0;
            _s++;
            if (_s > 59) {
                _s = 0;
                _m++;
                p++;
            }
            if (_m > 59) {
                _m = 0;
                _h++;
                p = 0;
            }
            if (_h > 12) {
                _h = _h - 12;
            }

            //时针偏移距离
            _h_dep = Math.floor(_m / 12) * 6;
            $sec.css("-webkit-transform", "rotateZ(" + (_s * 6 + p * 360 - 90) + "deg)").css("display", "block");
            $hour.css("-webkit-transform", "rotate(" + (_h * 30 - 90 + _h_dep) + "deg)").css("display", "block");
            $min.css("-webkit-transform", "rotate(" + (_m * 6 - 90) + "deg)").css("display", "block");
        };
        gotime();
        setTimeout(function () {
            accurateInterval(gotime, 1000);
        }, 1000 - _now.getMilliseconds());



    })();

    //时钟1
    (function () {
        var _now = new Date(),
            _h = _now.getHours(),
            _m = _now.getMinutes(),
            _s = _now.getSeconds(),
            _day = _now.getDay(),
            weekAry = chrome.i18n.getMessage("weekarry2").split(',');
        var $seclefthalf = $(".sec-round>.div-lefthalf"),
            $secrighthalf = $(".sec-round>.div-righthalf"),
            $minlefthalf = $(".min-round>.div-lefthalf"),
            $minrighthalf = $(".min-round>.div-righthalf"),
            $hourlefthalf = $(".hour-round>.div-lefthalf"),
            $hourrighthalf = $(".hour-round>.div-righthalf");
        $("#c1-date").html(_now.getFullYear() + '-' + padNumber(_now.getMonth() + 1) + '-' + padNumber(_now.getDate()) + ' ' + weekAry[_day]);
        var gotime = function () {
            _s++;
            if (_s > 30) {
                $secrighthalf.css("display", "block");
            } else {
                $secrighthalf.css("display", "none");
            }
            if (_m > 30) {
                $minrighthalf.css("display", "block");
            } else {
                $minrighthalf.css("display", "none");
            }
            if (_h > 12) {
                $hourrighthalf.css("display", "block");
            } else {
                $hourrighthalf.css("display", "none");
            }
            var secleftP = _s <= 30 ? _s : 30,
                secrightP = _s > 30 ? _s - 30 : 0;
            if (_s > 59) {
                _s = 0;
                _m++;
            }

            var minleftP = _m <= 30 ? _m : 30,
                minrightP = _m > 30 ? _m - 30 : 0;
            if (_m > 59) {
                _m = 0;
                _h++;
            }
            var hourleftP = _h <= 12 ? _h : 12,
                hourrightP = _h > 12 ? _h - 12 : 0;
            if (_h > 23) {
                _h = 0;
            }

            $(".secvalue").html(padNumber(_s));
            $(".minvalue").html(padNumber(_m));
            $(".hourvalue").html(padNumber(_h));

            $seclefthalf.css("transform", "rotate(" + secleftP * 6 + "deg)");
            $secrighthalf.css("transform", "rotate(" + secrightP * 6 + "deg)");

            $minlefthalf.css("transform", "rotate(" + minleftP * 6 + "deg)");
            $minrighthalf.css("transform", "rotate(" + minrightP * 6 + "deg)");

            $hourlefthalf.css("transform", "rotate(" + hourleftP * 15 + "deg)");
            $hourrighthalf.css("transform", "rotate(" + hourrightP * 15 + "deg)");
        }
        $seclefthalf.css("transform", "rotate(180deg)");
        $secrighthalf.css({
            "transform": "rotate(180deg)",
            "display": "block"
        });
        $minlefthalf.css("transform", "rotate(180deg)");
        $minrighthalf.css({
            "transform": "rotate(180deg)",
            "display": "block"
        });
        $hourlefthalf.css("transform", "rotate(180deg)");
        $hourrighthalf.css({
            "transform": "rotate(180deg)",
            "display": "block"
        });
        gotime();
        setTimeout(function () {
            accurateInterval(gotime, 1000);
        }, 1000 - _now.getMilliseconds());
    })();
}



//弥补时间差
function accurateInterval(callback, interval) {
    var now = +new Date();
    setTimeout(function run() {
        now += interval;
        var fix = now - (+Date.now());
        setTimeout(run, interval + fix);

        callback();
    }, interval);
}

//时间补0
function padNumber(s) {
    if (s == 60) {
        return '00';
    } else {
        return s < 10 ? '0' + s : s;
    }
}

//页面通信