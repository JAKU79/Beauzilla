// ==UserScript==
// @name         Beauzilla
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Stylování Bugzilly
// @updateURL    https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @downloadURL  https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @author       Jan Kusák
// @grant        none
// @match        https://bugzilla.abra.eu/show_bug.cgi*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// *** Barva horní položky Status ***
if( $( "span#static_bug_status:contains('VERIFIED')" ).length > 0) {
    $( "span#static_bug_status" ).css({"color": "#17984e", "font-weight": "bold"});
} else {
    $( "span#static_bug_status" ).css({"color": "red", "font-weight": "bold"});
}

// *** Barví komentáře, které mají tagy help nebo tohelp. ***
$( "span:contains('Comment hidden (help)')" ).parents( ".bz_comment" ).css( "background-color", "khaki" );
$( "span:contains('tohelp')" ).parents( ".bz_comment" ).css( "background-color", "lightblue" );

// *** Barví tag inhelp. ***
$( "span:contains('inhelp')" ).css( "background-color", "#cdf2ba" );

// *** Zobrazuje ikony pro keywordy L10N_SK, L10N_CZ, L10N_CH, Reviewed, Published, InHelp a HelpInProcess. ***
function oKey(keyword, icon, height, width) {
    this.keyword = keyword;
    this.icon = icon;
    this.height = height;
    this.width = width;
}

var myKey1 = new oKey("L10N_SK", "Flag_of_Slovakia.svg", 15, 20);
var myKey2 = new oKey("L10N_CZ", "Flag_of_the_Czech_Republic.svg", 15, 20);
var myKey3 = new oKey("L10N_CH", "Flag_of_Switzerland.svg", 15, 15);
var myKey4 = new oKey("InHelp", "InHelp.svg", 15, 15);
var myKey5 = new oKey("HelpInProcess", "in_process.png", 15, 15);
var myKey6 = new oKey("Reviewed", "magnifying-glass1.png", 15, 15);
var myKey7 = new oKey("Published", "rocket_red1_cut.png", 15, 15);

var arrKey = [myKey1, myKey2, myKey3, myKey4, myKey5, myKey6, myKey7];
var lenKey = arrKey.length;
var i;

for (i = 0; i < lenKey ; i++) {
	$( "#keywords_container input[value*=" + arrKey[i].keyword + "]" ).parents(':eq(1)')
		.after( "<td valign=\"bottom\"style=\"padding-left:5px;width:20px\"><img src=\"https://help.abra.eu/icons/"
			   + arrKey[i].icon + "\" height=\""
			   + arrKey[i].height + "\" width=\""
			   + arrKey[i].width + "\"></td>" );
}

// *** Barva borderů položky Typ ***
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
}

var myFlagValue1 = new oFlagValue("+", "#009933");
var myFlagValue2 = new oFlagValue("-", "red");
var myFlagValue3 = new oFlagValue("?", "#cc00cc");

var arrFlag = ["ToHelp", "ToPubl"];
var arrFlagValue = [myFlagValue1, myFlagValue2, myFlagValue3];

var lenFlag = arrFlag.length;
var lenFlagValue = arrFlagValue.length;

var k;
var l;

for (l = 0; l < lenFlag ; l++) {
	for (k = 0; k < lenFlagValue ; k++) {
		$("option[value=\"" + arrFlagValue[k].value + "\"][selected]:contains(\"" + arrFlagValue[k].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrFlag[l] + "\")" ).css({"color": arrFlagValue[k].color, "font-weight": "bold"});
	};
}

// *** footer s uloženými definicemi hledání je umístěn po leve straně jako plovoucí ***
$( "#footer" ).css({"position":"fixed", "top": "0px", "width": "300px"});
$( "#bugzilla-body" ).css({"position": "absolute", "left": "335px", "width": "auto"});
$( "#footer ul li" ).css({"display": "block"});
$( "span:contains('| ')" ).empty();
$( ".form").css({"padding-top": "4px", "padding-bottom": "4px"});

// *** nastavení šířky těla ***
$( "#bugzilla-body" ).css({"max-width": "1100px"});

// *** odstranění hlavičky ***
$( "#header" ).empty();

// *** odstranění tabulky pro výkaz hodin ***
$( ".bz_time_tracking_table" ).empty();

// *** odstranění řádku s harwarem ***
$( "#field_label_rep_platform").parent().empty();

// *** přestylování patičky ***
$( "#footer").css({"background": "#f0f0f0", "color": "black"});
$( "div#footer a").css({"color": "#6070cf", "text-decoration": "underline"});
$( "div#footer a:visited").css({"color": "#636", "text-decoration": "underline"});
$( "div#footer li#links-actions").css({"font-weight": "bold"});

//  *** Součet tagů inhelp, tohelp a help. Vypíší se v levém plovoucím divu. ***
var sumCom = $(".bz_comment").length - 1;
var sumComInHelp = $("span.bz_comment_tag:contains('inhelp')").length;
var sumComToHelp = $("span.bz_comment_tag:contains('tohelp')").length;
var sumComHelp = $("span.bz_comment_tag").filter(function () {
    return this.innerHTML.match(/\bhelp\b/);
	})
	.length;

$( "div.outro").after( "<ul class='ComBold' id='mySum' ><li id='bz_comment' >Comments: " + sumCom + "</li>");
$( "#bz_comment").after( "<li id='hhelp' >Help: <span class='chhelp'>" + sumComHelp + "</span></li>" );
$( "#hhelp").after( "<li id='ToHelp' >ToHelp: <span class='ctohelp'>" + sumComToHelp + "</span></li>" );
$( "#ToHelp").after( "<li id='InHelp' >InHelp: <span class='cinhelp'>" + sumComInHelp + "</span></li></ul>" );

$( ".ComBold" ).css({"color": "black", "padding-left": "5px", "font-weight": "bold"});

function oSum(sumKey, sumClass, sumBlinkClass) {
    this.sumKey = sumKey;
    this.sumClass = sumClass;
	this.sumBlinkClass = sumBlinkClass;
}

// *** funkce pro blikání textu ***
function blink_text() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}

setInterval(blink_text, 1000);

var mySum1 = new oSum(sumComToHelp, ".ctohelp", "blink");
var mySum2 = new oSum(sumComHelp, ".chhelp", "blink");
var mySum3 = new oSum(sumComInHelp, ".cinhelp", "");

var arrSum = [mySum1, mySum2, mySum3];
var lenSum = arrSum.length;
var m;

for (m = 0; m < lenSum; m++) {
	if (arrSum[m].sumKey > 0) {
		$( arrSum[m].sumClass ).addClass( arrSum[m].sumBlinkClass ).css({"color": "red"});
	};
}

// *** Tlačítka ***
function toBottom() {
	var scrollingElement = (document.scrollingElement || document.body);
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function toTop() {
	$(window).scrollTop(0);
}

function toHelpYes() {
	// $("#flags").find( "select[title^='Zda se má zveřejnit do helpu'] > option[value='+']" ).toggleClass("selected").change();
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']" ).val("+");
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']" ).parent().parent().parent().removeClass("bz_flag_type bz_default_hidden");
}

function toHelpNo() {
	// $("#flags").find( "select[title^='Zda se má zveřejnit do helpu'] > option[value='-']" ).toggleClass("selected").change();
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']" ).val("-");
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']" ).parent().parent().parent().removeClass("bz_flag_type bz_default_hidden");
}

$( "#InHelp").after( "<div id='toTop'><img class='myButton' src='https://help.abra.eu/icons/arrow_up.png'></img></div>" );
$( "#toTop" ).on("click", toTop);

$( "#toTop").after( "<div id='toBottom'><img class='myButton' src='https://help.abra.eu/icons/arrow_down.png'></img></div>" );
$( "#toBottom" ).on("click", toBottom);

$( "#toBottom").after( "<div id='toHelpYes'><img class='myButton' src='https://help.abra.eu/icons/plus.png'></img></div>" );
$( "#toHelpYes" ).on("click", toHelpYes);

$( "#toHelpYes").after( "<div id='toHelpNo'><img class='myButton' src='https://help.abra.eu/icons/minus.png'></img></div>" );
$( "#toHelpNo" ).on("click", toHelpNo);

$( ".myButton" ).css({"border": "1px solid grey", "padding": "3px", "margin": "5px 5px 5px 0px", "font-weight": "", "width": "20px", "color": "black", "float": "left"});
$( ".myButtonText" ).css({"border": "1px solid grey", "padding": "3px", "margin": "5px 5px 5px 0px", "font-weight": "", "width": "60px","height": "20px", "color": "black", "float": "left"});

$( ".myButton" ).mouseenter(function(){
	$( this ).css({"box-shadow":"1px 1px 5px #585858", "background-color":""});
});

$( ".myButton" ).mouseleave(function(){
	$( this ).css({"box-shadow":"","background-color":""});
});

// *** Jméno bugu v patičce ***
var myName = $( "#short_desc_nonedit_display" ).text();
var myBugNumber = $( "div.bz_short_desc_container > a" ).text();
$( "#useful-links").before( "<div id='myName' style='padding: 5px; font-weight: bold; margin: 5px; background-color: #d0d0d0; border-radius: 5px'></div>" );
$( "#myName" ).text(myBugNumber + " - " + myName);

// *** Doplnění ikon k bugům v sekci See Also ***
// *** Funkce využívající AJAX pro přidělení symbolů k bugům v závislosti na jejich vztahu k dokumentaci ***
function bugMarker(bug) {
	var outerThis = this;
	$('<div>').load("https://bugzilla.abra.eu/show_bug.cgi?id=" + bug + " #bugzilla-body", function(){
		var myStatus = $(this).find( "#static_bug_status").text();
		var myKeywords = $(this).find( "#keywords").val();
		var myToHelp = $(this).find( "select[title^='Zda se má zveřejnit do helpu'] > option[selected='']" ).text();
		var isVerified = myStatus.includes("VERIFIED");
		var isWontfix = myStatus.includes("WONTFIX");
		var isInvalid = myStatus.includes("INVALID");
		var isDuplicate = myStatus.includes("DUPLICATE");
		var isInHelp = myKeywords.includes("InHelp");
		if (isVerified == true) {
			if (myToHelp == "+") {
				if (isInHelp == true) {
					$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/check_mark_standard.png'></img>" )
				} else {
					$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/green_dot.png'></img>" )
				};
			} else if (myToHelp == "-") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross_green.png'></img>" )
			} else if (myToHelp == "?") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>" )
			} else if (myToHelp == "") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>" )
			};
		} else if (isWontfix == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else if (isInvalid == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else if (isDuplicate == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/red_dot.png'></img>" );
		};
	});
}

$( "#field_container_see_also ul li a" ).each(function() {
  		var thisBug = $(this).text();
		bugMarker.call(this, thisBug);
});
