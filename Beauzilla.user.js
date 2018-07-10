// ==UserScript==
// @name         Beauzilla
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stylování Bugzilly
// @updateURL    https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @downloadURL  https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @author       Jan Kusák
// @grant        none
// @match        https://bugzilla.abra.eu/show_bug.cgi*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// Pokus

console.time();

// *** funkce pro blikání textu ***
function blink_text() {
    $('.blink').fadeOut(200);
    $('.blink').fadeIn(200);
}
setInterval(blink_text, 500);

// *** Barva horní položky Status ***
if( $( "span#static_bug_status:contains('VERIFIED')" ).length > 0) {
    $( "span#static_bug_status" ).css({"color": "#17984e", "font-weight": "bold"});
} else {
    $( "span#static_bug_status" ).css({"color": "red", "font-weight": "bold"});
};

// *** Barví komentáře, které mají tagy help nebo tohelp. ***
$( "span:contains('Comment hidden (help)')" ).parent().parent().css( "background-color", "khaki" );
$( "span:contains('tohelp')" ).parent().parent().css( "background-color", "lightblue" );

// *** Barví tag inhelp. ***
$( "span:contains('inhelp')" ).css( "background-color", "#cdf2ba" );

// *** Zobrazuje ikony pro keywordy L10N_SK, L10N_CZ, L10N_CH, Reviewed, Published, InHelp a HelpInProcess. ***
// Nový kód je, zdá se, rychlejší s přibývajícím počtem nalezených keywordů.
function oKey(keyword, icon, height, width) {
    this.keyword = keyword;
    this.icon = icon;
    this.height = height;
    this.width = width;
};

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
	$( "input[value*=" + arrKey[i].keyword + "]" ).parents(':eq(1)')
		.after( "<td valign=\"bottom\"style=\"padding-left:5px;width:20px\"><img src=\"https://help.abra.eu/icons/"
			   + arrKey[i].icon + "\" height=\""
			   + arrKey[i].height + "\" width=\""
			   + arrKey[i].width + "\"></td>" );
};

// *** Barva borderů položky Typ ***
function oType(type, color) {
    this.type = type;
    this.color = color;
};

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
};

// *** Barva textu pro flag ToHelp a ToPubl v závislosti na hodnotě ***
function oFlagValue(value, color) {
	this.value = value;
	this.color = color;
};

var myFlagValue1 = new oFlagValue("+", "#009933");
var myFlagValue2 = new oFlagValue("-", "red");
var myFlagValue3 = new oFlagValue("?", "#cc00cc");

var arrFlag = ["ToHelp", "ToPubl"];
var arrFlagValue = [myFlagValue1, myFlagValue2, myFlagValue3];

var lenFlag = arrFlag.length;
var lenFlagValue = arrFlagValue.length;

var k;
var l;

// Zapřemýšlet, jestli by se změna názvu flagu nedala vyřešit přes metodu...
for (l = 0; l < lenFlag ; l++) {
	for (k = 0; k < lenFlagValue ; k++) {
		$("option[value=\"" + arrFlagValue[k].value + "\"][selected]:contains(\"" + arrFlagValue[k].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrFlag[l] + "\")" ).css({"color": arrFlagValue[k].color, "font-weight": "bold"});
	};
};

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
var sumComHelp = $(".bz_default_collapsed:contains('help')").length; // snad ok, ale lepší by bylo použít přesný match přes .filter(). Potíž by např. nastala, pokud by se řádek skryl tagem test a ještě tam byl např. tag inhelp.

// Možná by šlo řešit smyčkou...
$( "div.outro").after( "<ul class='ComBold' ><li id='bz_comment' >Comments: " + sumCom + "</li>");
$( "#bz_comment").after( "<li id='hhelp' >Help: <span class='chhelp'>" + sumComHelp + "</span></li>" );
$( "#hhelp").after( "<li id='ToHelp' >ToHelp: <span class='ctohelp'>" + sumComToHelp + "</span></li>" );
$( "#ToHelp").after( "<li id='InHelp' >InHelp: <span class='cinhelp'>" + sumComInHelp + "</span></li></ul>" );

$( ".ComBold" ).css({"color": "black", "padding-left": "5px", "font-weight": "bold"});

// Možná by šlo řešit smyčkou...
if (sumComToHelp > 0) {
	$( ".ctohelp" ).addClass( "blink" ).css({"color": "red"});
};

if (sumComHelp > 0) {
	$( ".chhelp" ).addClass( "blink" ).css({"color": "red"});
};

if (sumComInHelp > 0) {
	$( ".cinhelp" ).css({"color": "#red"});
};

// *** Tlačítka pro skok na začátek a na konec stránky ***
// ...
console.timeEnd();
