(function($) {
    $.tantt = function(obj, parentObj) {
        this.default={
            obj:obj,
            pObj:parentObj,
            initX:0,
            initY:0,
            newX:'0px',
            newY:'0px',
            moveTimer:null,
            disX:0,
            disY:0,
            prevX:0,//上一记录点
            prevY:0,//上一记录点
            iSpeedX:0,//松手速度 = 松手点 - 上一记录点
            iSpeedY:0,//松手速度 = 松手点 - 上一记录点
            end:function(){}
        }
    };
    $.extend($.tantt.prototype, {
        init: function(options) {
        	var opts=$.extend({},this.default, options);
        	opts.initX=opts.pObj.width() - opts.obj.width();
        	opts.initY = opts.pObj.height() - opts.obj.height();
            opts.obj.css({
                "left": opts.newX=='0'?opts.initX:opts.newX,
                "top": opts.newY=='0'?opts.initY:opts.newY
            });
            $.tantt.prototype.start(opts);
        },
        start: function(opts) {
            opts.obj.off('mousedown').mousedown(function(ev){
                $(this).css("opacity", 0.9);
                var pObj = opts.pObj;
                opts.disX = ev.pageX - $(this).offset().left + opts.pObj.offset().left;
                opts.disY = ev.pageY - $(this).offset().top + opts.pObj.offset().top;
                opts.prevX = ev.pageX;
                opts.prevY = ev.pageY;

                $(document).off('mousemove').mousemove(function(ev) {
                    var x = ev.pageX - opts.disX;
                    var y = ev.pageY - opts.disY;
                    setTimeout(function(){opts.prevX = ev.pageX;opts.prevY = ev.pageY;},1)
                    if (x <= 0) {
                        x = 0;
                    } else if (x > opts.initX) {
                        x = opts.initX;
                    }
                    if (y <= 0) {
                        y = 0;
                    } else if (y > opts.initY) {
                        y = opts.initY;
                    }
                    opts.obj.css({
                        "left": x,
                        "top": y
                    });

                    opts.iSpeedX = ev.pageX - opts.prevX; //松手速度 = 松手点 - 上一记录点
                    opts.iSpeedY = ev.pageY - opts.prevY;

                    //opts.prevX = ev.pageX; //随着拖动 不断更新 上一记录点
                    //opts.prevY = ev.pageY;

                   // console.log(opts.iSpeedX + "||" + opts.iSpeedY)

                });
                $(document).off('mouseup').mouseup(function() {
                    opts.obj.css("opacity", 0.8);
                    $(document).off();
                    $.tantt.prototype.move(opts);
                });
                return false;
            });
        },
        move: function(opts) {
            clearInterval(opts.moveTimer);
            opts.moveTimer = setInterval(function() {
                opts.iSpeedY += 1;
                var iL = opts.obj.position().left + opts.iSpeedX*5;
                var iT = opts.obj.position().top + opts.iSpeedY*5;
                if (iL > opts.initX) {
                    iL = opts.initX;
                    opts.iSpeedX *= -1;
                    opts.iSpeedX *= 0.8;
                } else if (iL < 0) {
                    iL = 0;
                    opts.iSpeedX *= -1;
                    opts.iSpeedX *= 0.8;
                }
                if (iT > opts.initY) {
                    iT = opts.initY;
                    opts.iSpeedY *= -1;
                    opts.iSpeedY *= 0.8;
                    opts.iSpeedX *= 0.8;
                } else if (iT < 0) {
                    iT = 0;
                    opts.iSpeedY *= -1;
                    opts.iSpeedY *= 0.8;
                }
                if (Math.abs(opts.iSpeedX) < 1 && Math.abs(opts.iSpeedY) < 1 && Math.abs(iT - opts.initY) < 1) {
                    clearInterval(opts.moveTimer);
                    $.tantt.prototype.end(opts);
                }

                opts.obj.css({
                    "left": iL,
                    "top": iT
                });
            }, 30);
        },
        end:function(opts){
            opts.obj.css("opacity", 1);
            opts.end(opts.obj)
        }
    });
})(jQuery);
