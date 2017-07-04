var timeout_arry = [];
var lang_arry = [];
var storeName = 't_remind';
var myDB = {
    name: 'VoiceRemindEX',
    version: 1,
    db: null
};

//browserAction点击事件
chrome.browserAction.onClicked.addListener(
    function () {
        chrome.tabs.create({
            "url": '../options.html',
            "selected": true
        }, function () {});
    });

if (!localStorage.conn_google) {
    localStorage.conn_google = false;
}
if (!localStorage.add_window) {
    localStorage.add_window = '';
}
if (!localStorage.isActivated) {
    localStorage.isActivated = true;
}
if (!localStorage.isSpeak) {
    localStorage.isSpeak = true;
}
//获取google语音
chrome.tts.getVoices(function (voices) {
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].remote && (voices[i].lang == 'en-US' || voices[i].lang == 'ja-JP' || voices[i].lang == 'ko-KR' || voices[i].lang === 'zh-CN' || voices[i].lang == 'zh-HK')) {
            lang_arry.push({
                'name': voices[i].voiceName,
                'lang': voices[i].lang
            });
        }
    }
    //console.log(lang_arry);
});

//
/**
 * 获取语音结果
 * @param {Array} lang_arry 
 * @param {String} lang 
 * @returns 
 */
function getLangVoice(lang_arry, lang) {
    return $.grep(lang_arry, function (n, i) {
        return n.lang == lang;
    });
}

/**
 * 打开数据库
 * 
 * @param {any} callback 
 */
function openDB(callback) {
    var version = myDB.version || 1;
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    var request = indexedDB.open(myDB.name, version);
    request.onerror = function (e) {
        console.log(e.currentTarget.error.message);
    };
    request.onsuccess = function (e) {
        myDB.db = e.target.result;
        if (typeof callback == "function")
            callback();
    };
    request.onupgradeneeded = function (e) {
        myDB.db = e.target.result;
        if (!myDB.db.objectStoreNames.contains(storeName)) {
            myDB.db.createObjectStore(storeName, {
                keyPath: "id"
            });
        }
        console.log('DB version changed to ' + myDB.version);
    };
}

/**
 * 关闭数据库
 * @param {indexedDB} db 
 */
function closeDB(db) {
    db.close();
}

/**
 * 删除数据库
 * 
 * @param {String} name 
 */
function devareDB(name) {
    indexedDB.devareDatabase(name);
}

/**
 * 增加数据
 * 
 * @param {indexedDB} db 数据库
 * @param {String} storeName 存储名称
 * @param {String} reminds 提醒内容
 */
function addData(db, storeName, reminds) {
    var transaction = db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore(storeName);
    for (var i = 0; i < reminds.length; i++) {
        reminds[i].id = guid();
        store.add(reminds[i]);
    }
}
/*查询数据
function getDataByKey(db,storeName,id){
var transaction=db.transaction(storeName,'readwrite');
var store=transaction.objectStore(storeName);
var request=store.get(id);
request.onsuccess=function(e){
var result=e.target.result;
};
} */

/**
 * 更新数据
 * 
 * @param {indexedDB} db 数据库
 * @param {String} storeName 存储名称
 * @param {String} id guid
 * @param {String} key 键
 * @param {String} value 值
 */
function updateDataByKey(db, storeName, id, key, value) {
    var transaction = db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore(storeName);
    var request = store.get(id);
    request.onsuccess = function (e) {
        var remindinfo = e.target.result;
        remindinfo.key = value;
        store.put(remindinfo);
    };
}

/**
 * 删除数据
 * 
 * @param {indexedDB} db 数据库
 * @param {String} storeName 存储名称
 * @param {String} id guid
 */
function devareDataByKey(db, storeName, id) {
    var transaction = db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore(storeName);
    store.devare(id);
}


/**
 * 产生guid
 * 
 * @returns 
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * 分辨语言
 * 
 * @param {String} str 
 * @returns 
 */
function Distinguishlanguage(str) {
    var hwkeycode = /[\uac00-\ud7ff]/gi;
    var rwkeycode = /[\u0800-\u4e00]/gi;
    var zwkeycode = /[\u4e00-\u9fa5]/gi;
    var ywkeycode = /[\u2E80-\u9FFF]/gi;
    if (str.match(hwkeycode)) {
        return 'ko-KR'; //韩语
    } else if (str.match(rwkeycode)) {
        return 'ja-JP'; //日语
    } else if (str.match(zwkeycode)) {
        return 'zh-CN'; //汉语
    } else {
        return 'en-US'; //英语
    }
}

/**
 * 组合事件-区分上下午
 * 
 * @param {int} hh 小时
 * @param {int} mm 分钟
 * @returns 
 */
function getTimeString(hh, mm) {
    var ampm = hh >= 12 ? 'PM' : 'AM';
    hh = (hh % 12);
    if (hh === 0)
        hh = 12;
    return hh + ':' + mm + ' ' + ampm;
}

/**
 * 修改状态
 * 
 * @param {int} xh 序号 
 */
function updatestate(xh) {
    var transaction = myDB.db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore(storeName);
    var request = store.get(xh);
    request.onsuccess = function (e) {
        var remindinfo = e.target.result;
        remindinfo.state = false;
        store.put(remindinfo);
        reloadOptionHtml('/options.html');
    };

}

/**
 * 初始化安装
 * 
 */
function oninstall() {
    if (typeof localStorage.version === 'undefined') {
        chrome.tabs.create({
            selected: true,
            url: "../options.html"
        });
        localStorage.version = 1.1;
    }
}


/**
 * 弹出通知的方法
 * 
 * @param {Object} myNotification 
 */
function ShowNotification(myNotification) {
    var title = myNotification.title;
    var icon = myNotification.icon;
    var message = myNotification.message;
    var notifica_id = myNotification.id;
    var click_function = myNotification.callback;
    var delayTime = myNotification.delayTime;
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (!notifica_id) {
        chrome.notifications.create('', {
            type: 'basic',
            iconUrl: icon,
            title: title,
            message: message
        }, function (notificationId) {
            chrome.notifications.onClicked.addListener(function (id) {
                if (id == notificationId) {
                    if (click_function) {
                        click_function();
                    }
                    chrome.notifications.clear(notificationId, function () {});
                }
            });
            if (re.test(delayTime)) {
                setTimeout(function () {
                    chrome.notifications.clear(notificationId, function () {});
                }, delayTime);
            }
        });
    } else {
        chrome.notifications.create(notifica_id, {
            type: 'basic',
            iconUrl: icon,
            title: title,
            message: message
        }, function (notificationId) {
            chrome.notifications.onClicked.addListener(function (id) {
                if (id == notificationId) {
                    if (click_function) {
                        click_function();
                    }
                    chrome.notifications.clear(notificationId);
                }
            });
            if (re.test(delayTime)) {
                setTimeout(function () {
                    chrome.notifications.clear(notificationId);
                }, delayTime);
            }
        });
    }
}

/**
 * 重新加载选项页
 * 
 * @param {any} pathname 
 */
function reloadOptionHtml(pathname) {
    var str = window.location.host + pathname;
    chrome.windows.getAll({
        populate: true
    }, function (windowList) {
        for (var i = 0; i < windowList.length; i++) {
            windowList[i].tabs.forEach(function (e) {
                if (e.url.indexOf(str) > -1) {
                    chrome.tabs.reload(e.id);
                }
            });
        }
    });

}

/**
 * 播放语音
 * 
 * @param {String} speakingtxt 内容
 * @param {String} language 语言
 * @param {String} voice 声音
 */
function speak(speakingtxt, language, voice) {
    if (JSON.parse(localStorage.isSpeak)) {
        chrome.tts.speak(speakingtxt, {
            lang: language,
            rate: 1.0,
            voiceName: voice,
            enqueue: true
        }, function () {
            if (chrome.runtime.lastError) {
                console.log('Error: ' + chrome.runtime.lastError.message);
            }
        });
    }
}


/**
 * 弹出通知提示
 * 
 * @param {String} value 内容
 * @param {int} index 序号
 */
function ts(value, index) {
    var now = new Date();
    var PercentTime = (function getPercentTime() {
        var nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        var differenceSeconds = parseInt(value.hour, 10) * 3600 + parseInt(value.minute, 10) * 60 - nowSeconds;
        if (differenceSeconds < 0) {
            differenceSeconds = differenceSeconds + 24 * 3600;
        }
        return differenceSeconds * 1000;
    })();
    var state = value.state;
    var Arrweek = value.timefrequencys.split(',');
    var hours = value.hour;
    var minutes = value.minute;
    var lang = (typeof (value.lang) == 'undefined') ? Distinguishlanguage(title) : value.lang;
    var title = value.title;
    var body = value.content;
    var orderWeek = new Date(now.getTime() + PercentTime).getDay().toString();
    var cunt = value.timefrequencys;
    if ((Arrweek.indexOf(orderWeek) >= 0 || cunt == "-1") && state === true) {
        var voice = "native";
        var clickMe = "";
        var time = getTimeString(hours, minutes);
        var speakingtxt = "It is " + time;
        if (JSON.parse(localStorage.conn_google)) {
            lang_arry.forEach(function (l) {
                if (l.lang == lang) {
                    voice = l.name;
                    return;
                }
            });
            switch (lang) {
                case 'ko-KR':
                    speakingtxt = '이제' + time + " " + title;
                    clickMe = '로 이동 합니다';
                    break;
                case 'ja-JP':
                    speakingtxt = '今' + time + "、" + title;
                    clickMe = 'に移動するにはクリック';
                    break;
                case 'zh-CN':
                    speakingtxt = '现在是' + time + "，" + title;
                    clickMe = '点击前往';
                    break;
                case 'en-US':
                    speakingtxt = 'It is' + time + " now, " + title;
                    clickMe = 'Click to GO';
                    break;
                case 'zh-HK':
                case 'zh-TW':
                    speakingtxt = '現在是' + time + "，" + title;
                    clickMe = '點擊前往';
                    break;
            }
        } else {
            speakingtxt = "现在是:" + hours + '时，' + minutes + '分。' + "," + title;
            lang = 'zh-CN';
            voice = 'native';
            clickMe = '点击前往';
        }
        var addurl = value.url;
        timeout_arry[index] = window.setTimeout(
            function () {
                if (cunt == "-1") {
                    updatestate(value.id);
                }
                if (addurl === "") {
                    ShowNotification({
                        title: title,
                        icon: "../images/tx.png",
                        message: body
                    });
                } else {
                    ShowNotification({
                        title: title + '(' + clickMe + ')',
                        icon: "../images/tx.png",
                        message: body,
                        callback: function () {
                            window.open(addurl);
                        }
                    });
                }
                speak(speakingtxt, lang, voice);
            }, PercentTime);
        //console.log(timeout_arry.length);
    }
}

/**
 * 加载通知Neri
 * 
 */
function remind() {
    if (JSON.parse(localStorage.isActivated)) {
        var transaction = myDB.db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var cursorRequest = store.openCursor();
        var i = 0;
        cursorRequest.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                //console.log(cursor.value.hour);
                ts(cursor.value, i);
                i++;
                cursor.continue();
            }
        };

    }
    if (timeout_arry.length > 0) {
        for (var j = 0; j < timeout_arry.length; j++) {
            clearTimeout(timeout_arry[j]);
        }
        timeout_arry = [];
    }
}

//加载页面
window.onload = function () {
    /* openDB(myDB);
    setTimeout(function(){
    addData(myDB.db,storeName,reminds);
    closeDB(myDB.db);
    },100); */
    if (!myDB.db) {
        openDB(function () {
            remind();
            oninstall();
            setInterval(function () {
                this.location.reload();
            }, 3600 * 1000);
            if (!localStorage.version) {
                window.open('./options.html');
                localStorage.version = true;
            }
        });

    } else {
        remind();
        oninstall();
        setInterval(function () {
            this.location.reload();
        }, 3600 * 1000);
        if (!localStorage.version) {
            window.open('./options.html');
            localStorage.version = true;
        }
    }
    window.clearInterval(); //清除周期性方法
    chrome.tts.stop(); //取消tts朗读

};