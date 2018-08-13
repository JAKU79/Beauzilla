// ==UserScript==
// @name         Beauzilla PAKE Devel
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Stylování Bugzilly
// @updateURL    https://github.com/JAKU79/Beauzilla/raw/master/variants/BeauzillaPAKE/BeauzillaPAKE.user.js
// @downloadURL  https://github.com/JAKU79/Beauzilla/raw/master/variants/BeauzillaPAKE/BeauzillaPAKE.user.js
// @author       Jan Kusák
// @grant        none
// @match        https://bugzilla.abra.eu/show_bug.cgi*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// *** funkce pro blikání textu ***
function blink_text() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
};

setInterval(blink_text, 1000);

// Barva položky Status umístěné v horní čáti bugzilla-body
var topStatusHtml = $("span#static_bug_status").html();
var topStatusLeftBracketPosition;

if (topStatusHtml.includes("DUPLICATE")) {
	topStatusLeftBracketPosition = topStatusHtml.indexOf("of");
} else {
	topStatusLeftBracketPosition = topStatusHtml.indexOf("(");
}
var topStatusLeftSlice = topStatusHtml.slice(0, topStatusLeftBracketPosition);
var topStatusRightSlice = topStatusHtml.slice(topStatusLeftBracketPosition, topStatusHtml.length);

$("span#static_bug_status").html("<span id='topStatus' style=''>"
								 +topStatusLeftSlice+"</span>"+topStatusRightSlice);

if (topStatusLeftSlice.includes("VERIFIED")) {
	$("#topStatus").css({"font-size":"11px","background-color":"#359b35","color":"white","padding":"3px 2px 3px 7px","border-radius":"6px","margin-right":"5px"});
} else {
	$("#topStatus").css({"font-size":"11px","background-color":"#b83333","color":"white","padding":"3px 2px 3px 7px","border-radius":"6px","margin-right":"5px"});
}

// *** Zobrazuje ikony pro keywordy L10N_SK, L10N_CZ, L10N_CH***
function oKey(keyword, icon, height, width) {
    this.keyword = keyword;
    this.icon = icon;
    this.height = height;
    this.width = width;
};

var myKey1 = new oKey("L10N_SK", "Flag_of_Slovakia.svg", 15, 20);
var myKey2 = new oKey("L10N_CZ", "Flag_of_the_Czech_Republic.svg", 15, 20);
var myKey3 = new oKey("L10N_CH", "Flag_of_Switzerland.svg", 15, 15);

var arrKey = [myKey1, myKey2, myKey3];
var lenKey = arrKey.length;
var i;

for (i = 0; i < lenKey ; i++) {
	$( "input[value*=" + arrKey[i].keyword + "]" ).parents(':eq(1)')
		.after( "<td valign=\"bottom\"style=\"padding-left:5px;width:20px\"><img src=\"https://help.abra.eu/icons/"
			   + arrKey[i].icon + "\" height=\""
			   + arrKey[i].height + "\" width=\""
			   + arrKey[i].width + "\"></td>" );
};

// Barva okrajů položky Typ
function oType(type, color) {
    this.type = type;
    this.color = color;
}

var myType1 = new oType("Error (chyba)", "#ff9933");
var myType2 = new oType("---", "#ff0000");
var myType3 = new oType("Improvement (zlepšení)", "#33cc33");
var myType4 = new oType("Development (rozvoj)", "#0099ff");
var myType5 = new oType("Legislation (legislativa)", "#cc0099");

var arrType = [myType1, myType2, myType3, myType4, myType5];
var lenType = arrType.length;
var j;

for (j = 0; j < lenType ; j++) {
	$("#cf_statistictype option[value=\"" + arrType[j].type + "\"][selected='selected']").parent().css({"border-color": arrType[j].color, "border-width": "2px"});
}

// *** Barva textu pro flag ToHelp a ToPubl v závislosti na hodnotě ***
function oFlagValue(value, color) {
	this.value = value;
	this.color = color;
};

var myFlagValue1 = new oFlagValue("+", "#009933");
var myFlagValue2 = new oFlagValue("-", "red");
var myFlagValue3 = new oFlagValue("?", "#cc00cc");

var arrFlag = ["ToPubl"];
var arrFlagValue = [myFlagValue1, myFlagValue2, myFlagValue3];

var lenFlag = arrFlag.length;
var lenFlagValue = arrFlagValue.length;

var k;
var l;

for (l = 0; l < lenFlag ; l++) {
	for (k = 0; k < lenFlagValue ; k++) {
		$("option[value=\"" + arrFlagValue[k].value + "\"][selected]:contains(\"" + arrFlagValue[k].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrFlag[l] + "\")" ).css({"color": arrFlagValue[k].color, "font-weight": "bold"});
	};

// *** nastavení šířky těla ***
$( "#bugzilla-body" ).css({"max-width": "1100px"});
};

// *** odstranění hlavičky ***
$( "#header" ).empty();

// *** odstranění řádku s harwarem ***
$( "#field_label_rep_platform").parent().empty();

// *** 2.0 ***
// FOOTER

// *** 2.1 ***
// Obecné úpravy včetně nastavení patičky jako float a sticky
$("#footer #links-actions .links li").css({"display": "inline"});
$("#footer form").css({"margin-top": "5px"});
$("#footer").css({"position":"fixed", "top": "0px", "width": "300px", "height":"auto","overflow":"auto"});
$("#bugzilla-body").css({"position": "absolute", "left": "335px", "width": "auto"});
$("#footer #links-saved .links li").css({"display": "block"});
$("#footer #links-shared .links li").css({"display": "block"});
$("span:contains('| ')").empty();
$(".form").css({"padding-top": "4px", "padding-bottom": "4px"});
$("#footer").css({"background": "#f0f0f0", "color": "black"});
$("div#footer a").css({"color": "#6070cf", "text-decoration": "underline"});
$("div#footer a:visited").css({"color": "#636", "text-decoration": "underline"});

// *** 2.2 ***
// Umístění čísla a název bugu do horní části
var myName = $("#short_desc_nonedit_display").text();
var myBugNumber = $("div.bz_short_desc_container > a").text();
$("#useful-links").before( "<div id='myName' style='padding: 5px; font-weight: bold; margin: 5px; background-color: #d0d0d0; border-radius: 5px'></div>");
$("#myName").text(myBugNumber + " - " + myName);

// *** 2.3 ***
// LINKS-ACTION

// **** 2.3.1 ***
// Skrytí původní sekce
$("#footer #useful-links #links-actions").hide();

// *** 2.3.2 ***
// Uložení formuláře pro hledání do proměnné linksActionSearchForm obaleného tagem p. Je to z důvodu,
// abych při vkládání nemusel nastavovat původní atributy formuláře.
var linksActionSearchForm = $("#footer #useful-links #links-actions ul li form").wrap('<p/>').parent().html();

// *** 2.3.4 ***
// uložení links-action do pole arrLinksAction
var linksActionLength = $("#footer #useful-links #links-actions ul li").length;
var arrLinksAction = [];
var p;
for (p = 0; p < linksActionLength; p++) {
	let text = $("#footer #useful-links #links-actions ul li:eq("+p+") a").text(); // Vyberu text ...
	let link = $("#footer #useful-links #links-actions ul li:eq("+p+") a").prop("href"); // ... vyberu odkaz ...
	arrLinksAction.push("<a href='"+link+"'style='color: rgb(96, 112, 207); text-decoration: underline;'>"+text+"</a>"); // ... a při vkládání do pole obalím text a odkaz původním stylem atributu a.
}

// *** 2.3.5 ***
// vložení formuláře hledání za název bugu [#myName viz 2.2]
linksActionSearchForm = $(linksActionSearchForm).wrap("<div id='searchForm' />").parent();
$("#myName").after(linksActionSearchForm);
$("#searchForm").css({"padding": "10px 0px 0px 05px"});
$("#quicksearch_bottom").css({"margin-left":"", "width": ""});
$("#searchForm").append("<span style='margin-left:5px;font-weight:bold'>" + arrLinksAction[4] + "</span>"); // prvek [?]

// *** 2.3.6
// vložení #links-action za formulář s hledáním [#searchForm viz 2.3.5]
$("#searchForm").after("<div id='arrLinksAction'></div>")
$("#arrLinksAction").append(arrLinksAction[0] + " ▪ "
							  + arrLinksAction[1] + " ▪ "
							  + arrLinksAction[2] + " ▪ "
							  + arrLinksAction[3] + " ▪ "
							  + arrLinksAction[5] + " ▪ "
							  + arrLinksAction[6] + " ▪ "
							  + arrLinksAction[7] + " ▪ "
							  + arrLinksAction[8] + " ▪ "
							  + arrLinksAction[9] + " ▪ "
							  + arrLinksAction[10]
							 );

$("#arrLinksAction").css({"padding-top": "10px", "font-weight": "bold", "margin-left":"5px"});

//  *** Součet tagů inhelp, tohelp a help. Vypíší se v levém plovoucím divu. ***
var sumCom = $(".bz_comment").length - 1;
var sumComPake = $("span.bz_comment_tag:contains('pake')").length;
var sumComTotest = $("span.bz_comment_tag:contains('totest')").length;

$( "div.outro").after( "<ul class='ComBold' id='mySum' ><li id='bz_comment' >Comments: " + sumCom + "</li>");
$( "#bz_comment").after( "<li id='sumComPake' >pake: <span class='sumComPake'>" + sumComPake + "</span></li>" );
$( "#sumComPake").after( "<li id='sumComTotest' >totest: <span class='sumComTotest'>" + sumComTotest + "</span></li>" );

$( ".ComBold" ).css({"color": "black", "padding-left": "5px", "font-weight": "bold"});

function oSum(sumKey, sumClass, sumBlinkClass) {
    this.sumKey = sumKey;
    this.sumClass = sumClass;
	this.sumBlinkClass = sumBlinkClass;
};

var mySum1 = new oSum(sumComPake, ".sumComPake", "blink");
var mySum2 = new oSum(sumComTotest, ".sumComTotest", "blink");

var arrSum = [mySum1, mySum2];
var lenSum = arrSum.length;
var m;

for (m = 0; m < lenSum; m++) {
	if (arrSum[m].sumKey > 0) {
		$( arrSum[m].sumClass ).addClass( arrSum[m].sumBlinkClass ).css({"color": "red"});
	};
};

// *** Tlačítka pro skok na začátek a na konec stránky ***
function toBottom() {
	var scrollingElement = (document.scrollingElement || document.body);
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
};

function toTop() {
	$(window).scrollTop(0);
};

$( "#sumComTotest").after( "<div id='toTop'><img class='myButton' src='https://help.abra.eu/icons/arrow_up.png'></img></div>" );
$( "#toTop" ).on("click", toTop);

$( "#toTop").after( "<div id='toBottom'><img class='myButton' src='https://help.abra.eu/icons/arrow_down.png'></img></div>" );
$( "#toBottom" ).on("click", toBottom);

$( ".myButton" ).css({"border": "1px solid grey", "padding": "3px", "margin": "5px 5px 5px 0px", "font-weight": "", "width": "20px", "color": "black", "float": "left"});

// *** AJAX ***
// Funkce pro označení elementu s id čísla bugu, pokud je ve stavu VERIFIED
function isKeywordFull(bug, keyword) {
		$('<div>').load("https://bugzilla.abra.eu/show_bug.cgi?id=" + bug + " span#static_bug_status", function(){
		var myAjaxStatus = $(this).text();
		console.log( myAjaxStatus );
		var isVerified = myAjaxStatus.includes("VERIFIED");
		if (isVerified == true) {
			$("#" + bug).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/green_dot.png'></img>" );
		} else {
			$("#" + bug).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/red_dot.png'></img>" );
		};
	});
};

// *** Semafory u bugů v See Also
$( "#field_container_see_also ul li a" ).each(function() {
  		var myBug = $( this ).text();
		$( this ).attr("id", myBug);
		isKeywordFull( myBug, "InHelp" );
});
