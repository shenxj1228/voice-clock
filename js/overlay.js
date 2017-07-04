/* 显示遮罩层 */

function OverLay(overlayObject,dialogObject){
this.overlay=overlayObject;
this.dialog=dialogObject;
overlayclick(this.overlay,this.dialog);
}

function overlayclick(overlay,dialog){
	$(overlay).on("click",function(){
		overlay.hide();
		dialog.hide();
	});
}
OverLay.prototype.showOverlay=function(){
	this.overlay.height(document.body.scrollHeight);
	this.overlay.width(document.body.scrollWidth);
	this.overlay.fadeTo(200, 0.5);
}
OverLay.prototype.hideOverlay=function(){
	this.overlay.hide();
}

OverLay.prototype.showDialog=function(){
	this.dialog.show();
}

OverLay.prototype.hideDialog=function(){
	this.dialog.hide();
}

OverLay.prototype.showOverlayDialog=function(){
	this.overlay.height(document.body.scrollHeight);
	this.overlay.width(document.body.scrollWidth);
	//this.overlay.fadeTo(200, 0.5,function(){});
	this.overlay.fadeTo(200, 0.5);
	this.dialog.show();
}

OverLay.prototype.hideOverlayDialog=function(){
	this.overlay.hide();
	this.dialog.hide();
}

/*提示框*/
var prox;
var proy;
var proxc;
var proyc;
function showtip(id,info_id,context,type){/*--打开--*/
	clearInterval(prox);
	clearInterval(proy);
	clearInterval(proxc);
	clearInterval(proyc);
	var top=(parseInt($(document).scrollTop())+20)+"px";
	var o = $("#"+id);
	var f=$('#'+info_id);
	f.text(context);
	o.removeClass();
	if(type=="error"){
		o.addClass("error-bg");
	}else if(type=="success"){
		o.addClass("success-bg");
	}else if(type=="danger"){
		o.addClass("danger-bg");
	}else if(type=="info"){
		o.addClass("info-bg");
	}else{
		o.addClass("other-bg");
	}

	var new_width=f.css("font-size").replace('px','')*(f.text().length+2);
	var h=o.css("height");
	if(o.css("display")!="block"){
		o.css({"display":"block","width":"1px","height":"1px","top":top});
	} 
	prox = setInterval(function(){openx(o,new_width)},10);
	var newname='tipname-'+Date.parse(new Date());
	o.attr("name",newname);
	return newname;
}	
function openx(o,x){/*--打开x--*/
	var cx = parseInt(o.css("width"));
	if(cx < x)
	{
		o.css("width",(cx + Math.ceil((x-cx)/5)) +"px");
	}
	else
	{
		clearInterval(prox);
		proy = setInterval(function(){openy(o,40)},10);
	}
}	
function openy(o,y){/*--打开y--*/	
	var cy = parseInt(o.css("height"));
	if(cy < y)
	{
		o.css("height",(cy + Math.ceil((y-cy)/5)) +"px");
	}
	else
	{
		clearInterval(proy);			
	}
}	
function closetip(name){/*--关闭--*/
	clearInterval(prox);
	clearInterval(proy);
	clearInterval(proxc);
	clearInterval(proyc);		
	var o = $("div[name='"+name+"']");
	if(o.css("display") == "block")
	{
		proyc = setInterval(function(){closey(o)},10);			
	}		
}	
function closey(o){/*--打开y--*/	
	var cy = parseInt(o.css("height"));
	if(cy > 0)
	{
		o.css("height",(cy - Math.ceil(cy/5)) +"px");
	}
	else
	{
		clearInterval(proyc);				
		proxc = setInterval(function(){closex(o)},10);
	}
}	
function closex(o){/*--打开x--*/
	var cx = parseInt(o.css("width"));
	if(cx > 0)
	{
		o.css("width",(cx - Math.ceil(cx/5)) +"px");
	}
	else
	{
		clearInterval(proxc);
		o.css("display","none");
	}
}	

