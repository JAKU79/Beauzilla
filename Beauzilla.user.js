// ==UserScript==
// @name         Beauzilla
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  Stylování Bugzilly
// @updateURL    https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @downloadURL  https://github.com/JAKU79/Beauzilla/raw/master/Beauzilla.user.js
// @author       Jan Kusák
// @grant        none
// @match        https://bugzilla.abra.eu/show_bug.cgi*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// TESTOVACÍ BUG
// https://bugzilla.abra.eu/show_bug.cgi?id=54627

// ÚLOŽIŠTĚ IKON
// https://help.abra.eu/icons/

// *** F.0 **
// UNIVERZÁLNÍ FUNKCE

// *** F.1 ***
// Funkce, která v závislosti na statusu, hodnotě ToHelp a keywordu InHelp vloží za linkovaný bug informační ikonu
function bugMarker(bug) {
	var outerThis = this; // http://exploringjs.com/es6/ch_arrow-functions.html#_solution-1-that--this
	$("<div>").load("https://bugzilla.abra.eu/show_bug.cgi?id=" + bug + " #bugzilla-body", function(){
		var myStatus = $(this).find( "#static_bug_status").text();
		var myKeywords = $(this).find( "#keywords").val();
		var myToHelp = $(this).find( "select[title^='Zda se má zveřejnit do helpu'] > option[selected='']").text();
		var isVerified = myStatus.includes("VERIFIED");
		var isWontfix = myStatus.includes("WONTFIX");
		var isInvalid = myStatus.includes("INVALID");
		var isDuplicate = myStatus.includes("DUPLICATE");
		var isInHelp = myKeywords.includes("InHelp");
		if (isVerified == true) {
			if (myToHelp == "+") {
				if (isInHelp == true) {
					$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/check_mark_standard.png'></img>")
				} else {
					$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/green_dot.png'></img>")
				};
			} else if (myToHelp == "-") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross_green.png'></img>")
			} else if (myToHelp == "?") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>")
			} else if (myToHelp == "") {
				$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>")
			};
		} else if (isWontfix == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>");
		} else if (isInvalid == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>");
		} else if (isDuplicate == true) {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>");
		} else {
			$(outerThis).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/red_dot.png'></img>");
		};
	});
}

// *** F.2 ***
// Funkce pro blikání elemetu mající třídu .blink
function blink_text() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}

setInterval(blink_text, 1000);

// *** 1.0 ***
// BUGZILLA-BODY

// *** 1.1 ***
// Nastavení šířky těla
$("#bugzilla-body").css({"max-width": "1100px"});

// *** 1.2 ***
// Odstranění hlavičky
$("#header").empty();

// *** 1.3 ***
// Odstranění tabulky pro výkaz hodin
$(".bz_time_tracking_table").empty();

// *** 1.4 ***
// Odstranění řádku s harwarem
$("#field_label_rep_platform").parent().empty();

// *** 1.5 ***
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

// *** 1.6 ***
// Barva komentářů dle tagů help nebo tohelp
$("span:contains('Comment hidden (help)')").parents( ".bz_comment").css( "background-color", "khaki");
$("span:contains('tohelp')").parents( ".bz_comment").css( "background-color", "lightblue");

// *** 1.7 ***
// Barva tagu inhelp
$("span:contains('inhelp')").css( "background-color", "#cdf2ba");

// *** 1.8 ***
// Zobrazení ikon pro keywordy L10N_SK, L10N_CZ, L10N_CH, Reviewed, Published, InHelp a HelpInProcess
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
var myKey7 = new oKey("Published", "rocket.png", 15, 15);

var arrKey = [myKey1, myKey2, myKey3, myKey4, myKey5, myKey6, myKey7];
var lenKey = arrKey.length;
var i;

for (i = 0; i < lenKey ; i++) {
	$("#keywords_container input[value*=" + arrKey[i].keyword + "]").parents(':eq(1)')
		.after( "<td valign=\"bottom\"style=\"padding-left:5px;width:20px\"><img src=\"https://help.abra.eu/icons/"
			   + arrKey[i].icon + "\" height=\""
			   + arrKey[i].height + "\" width=\""
			   + arrKey[i].width + "\"></td>");
}

// *** 1.9 ***
// POLOŽKA TYP

// *** 1.9.1 ***
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

// *** 1.9.2 ***
// Automatické nastavení položky Typ, pokud je nenastavená a pokud je typ uveden mezi keywordy
var setType = $("#cf_statistictype option[selected='selected']").val();
var myKeywords = $("#keywords").val();

if ( setType == "---" ) {
	if (myKeywords.includes("Error") == true ) {
			$("#cf_statistictype").val("Error (chyba)");
		} else if ( myKeywords.includes("Legislation") == true ) {
			$("#cf_statistictype").val("Legislation (legislativa)");
		} else if ( myKeywords.includes("Development") == true ) {
			$("#cf_statistictype").val("Development (rozvoj)");
		} else if ( myKeywords.includes("Improvement") == true ) {
			$("#cf_statistictype").val("Improvement (zlepšení)");
		} else if ( myKeywords.includes("Overhead") == true ) {
			$("#cf_statistictype").val("Overhead (režie)");
		} else {
			$("#cf_statistictype").addClass("blink");
			// $("#cf_statistictype").val("Error (chyba)");
		}
}

// *** 1.10 ***
// Barva ToHelp a ToPubl ***
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
		$("option[value=\"" + arrFlagValue[k].value + "\"][selected]:contains(\"" + arrFlagValue[k].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrFlag[l] + "\")").css({"color": arrFlagValue[k].color, "font-weight": "bold"});
	};
}

// *** 1.11 ***
// informační ikony u bůgů v sekci Sea Also
$("#field_container_see_also ul li a").each(function() {
  		var thisBug = $(this).text();
		bugMarker.call(this, thisBug);
});

// *** 1.12 ***
// informační ikony u bugů v sekcích Depends on a Blocks
$("#bz_show_bug_column_1 a").each(function() {
  		var thisBug = $(this).text();
		bugMarker.call(this, thisBug);
});

// *** 2.0 ***
// FOOTER

// *** 2.1 ***
// Obecné úpravy včetně nastavení patičky jako float a sticky
$("#footer #links-actions .links li").css({"display": "inline"});
$("#footer form").css({"margin-top": "5px"});
$("#footer").css({"position":"fixed", "top": "0px", "width": "300px", "height":"auto","resize":"both","overflow":"auto"});
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

//  *** 2.4 ***
// Součty tagů inhelp, tohelp a help
var sumCom = $(".bz_comment").length - 1;
var sumComInHelp = $("span.bz_comment_tag:contains('inhelp')").length;
var sumComToHelp = $("span.bz_comment_tag:contains('tohelp')").length;
var sumComHelp = $("span.bz_comment_tag").filter(function () {
    return this.innerHTML.match(/\bhelp\b/);
	})
	.length;

$("div.outro").after("<ul class='ComBold' id='mySum' ><li id='bz_comment' >Comments: " + sumCom + "</li>");
$("#bz_comment").after("<li id='hhelp' >Help: <span class='chhelp'>" + sumComHelp + "</span></li>");
$("#hhelp").after("<li id='ToHelp' >ToHelp: <span class='ctohelp'>" + sumComToHelp + "</span></li>");
$("#ToHelp").after("<li id='InHelp' >InHelp: <span class='cinhelp'>" + sumComInHelp + "</span></li></ul>");

$(".ComBold").css({"color": "black", "padding-left": "5px", "font-weight": "bold"});

function oSum(sumKey, sumClass, sumBlinkClass) {
    this.sumKey = sumKey;
    this.sumClass = sumClass;
	this.sumBlinkClass = sumBlinkClass;
}

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

// *** 2.5 ***
/// Tlačítka v patičce, vkládají se za součty tagů
function toBottom() {
	var scrollingElement = (document.scrollingElement || document.body);
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function toTop() {
	$(window).scrollTop(0);
}

function toHelpYes() {
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']").val("+");
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']").parent().parent().parent().removeClass("bz_flag_type bz_default_hidden");
	$("#toHelpNo").find("img").attr("src", "https://help.abra.eu/icons/minusGray.png");
	$("#toHelpYes").find("img").attr("src", "https://help.abra.eu/icons/plus.png");
}

function toHelpNo() {
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']").val("-");
	$("#flags").find( "select[title^='Zda se má zveřejnit do helpu']").parent().parent().parent().removeClass("bz_flag_type bz_default_hidden");
	$("#toHelpYes").find("img").attr("src", "https://help.abra.eu/icons/plusGray.png");
	$("#toHelpNo").find("img").attr("src", "https://help.abra.eu/icons/minus.png");
}

function myKeywordButton(keyword, id, imageColor, imageGray) {
	id = "#"+id
	myKeywords = $("#keywords").val();
	var selected = $(id).attr("class");
	if (selected == "unselected") {
		if (myKeywords != "") {
			$("#keywords").attr("value", myKeywords + ", " + keyword);
			$(id).attr("class", "selected");
			$(id).find("img").attr("src", "https://help.abra.eu/icons/" + imageColor);
		} else {
			$("#keywords").attr("value", keyword);
			$(id).attr("class", "selected");
			$(this).find("img").attr("src", "https://help.abra.eu/icons/" + imageColor);
		}
	} else if (selected == "selected") {
		if (myKeywords != "") {
			let re1 = /^,\s/;
			let re2 = /,\s$/;
			myKeywords = myKeywords.replace(keyword, "");
			myKeywords = myKeywords.replace(", , ", ", ");
			myKeywords = myKeywords.replace(re1, "");
			myKeywords = myKeywords.replace(re2, "");
			$("#keywords").attr("value", myKeywords);
			$(id).attr("class", "unselected");
			$(id).find("img").attr("src", "https://help.abra.eu/icons/" + imageGray);
		}
	}
}

$("#InHelp").after( "<div id='toTop'><img class='myButton' src='https://help.abra.eu/icons/arrow_up.png'></img></div>");
$("#toTop").on("click", toTop);

$("#toTop").after( "<div id='toBottom'><img class='myButton' src='https://help.abra.eu/icons/arrow_down.png'></img></div>");
$("#toBottom").on("click", toBottom);

var toHelpVal = $("#flags").find( "select[title^='Zda se má zveřejnit do helpu']").val();

if (toHelpVal == "+") {
	$("#toBottom").after( "<div id='toHelpYes'><img class='myButton' src='https://help.abra.eu/icons/plus.png'></img></div>");
	$("#toHelpYes").after( "<div id='toHelpNo'><img class='myButton' src='https://help.abra.eu/icons/minusGray.png'></img></div>")
} else if (toHelpVal == "-") {
	$("#toBottom").after( "<div id='toHelpYes'><img class='myButton' src='https://help.abra.eu/icons/plusGray.png'></img></div>");
	$("#toHelpYes").after( "<div id='toHelpNo'><img class='myButton' src='https://help.abra.eu/icons/minus.png'></img></div>");
} else {
	$("#toBottom").after( "<div id='toHelpYes'><img class='myButton' src='https://help.abra.eu/icons/plusGray.png'></img></div>");
	$("#toHelpYes").after( "<div id='toHelpNo'><img class='myButton' src='https://help.abra.eu/icons/minusGray.png'></img></div>");
}

$("#toHelpYes").on("click", toHelpYes);
$("#toHelpNo").on("click", toHelpNo);

if (myKeywords.includes("InHelp")) {
		$("#toHelpNo").after( "<div id='setInHelp' class='selected'><img class='myButton' src='https://help.abra.eu/icons/InHelp.svg'></img></div>");
	} else {
		$("#toHelpNo").after( "<div id='setInHelp' class='unselected'><img class='myButton' src='https://help.abra.eu/icons/InHelpGray.svg'></img></div>");
}

$("#setInHelp").click(function() {
	myKeywordButton("InHelp", "setInHelp", "InHelp.svg", "InHelpGray.svg");
});

if (myKeywords.includes("Reviewed")) {
		$("#setInHelp").after( "<div id='setReviewed' class='selected'><img class='myButton' src='https://help.abra.eu/icons/magnifying-glass1.png'></img></div>");
	} else {
		$("#setInHelp").after( "<div id='setReviewed' class='unselected'><img class='myButton' src='https://help.abra.eu/icons/magnifying-glass1Gray.png'></img></div>");
}

$("#setReviewed").click(function() {
	myKeywordButton("Reviewed", "setReviewed", "magnifying-glass1.png", "magnifying-glass1Gray.png");
});

if (myKeywords.includes("Published")) {
		$("#setReviewed").after( "<div id='setPublished' class='selected'><img class='myButton' src='https://help.abra.eu/icons/rocket.png'></img></div>");
	} else {
		$("#setReviewed").after( "<div id='setPublished' class='unselected'><img class='myButton' src='https://help.abra.eu/icons/rocketGray.png'></img></div>");
}

$("#setPublished").click(function() {
	myKeywordButton("Published-05", "setPublished", "rocket.png", "rocketGray.png");
});

/* $("#setPublished").after( "<div id='save'><form name='changeform' id='changeform' method='post' action='process_bug.cgi'><div class='bz_short_desc_container edit_form'><div class='knob-buttons'><input type='submit' value='Save' id='commit'><div></div></form></div>");*/

$(".myButton").css({"border": "1px solid grey", "padding": "3px", "margin": "5px 5px 5px 0px", "font-weight": "", "width": "20px", "color": "black", "float": "left"});
$(".myButtonText").css({"border": "1px solid grey", "padding": "3px", "margin": "5px 5px 5px 0px", "font-weight": "", "width": "60px","height": "20px", "color": "black", "float": "left"});

$(".myButton").mouseenter(function(){
	$( this ).css({"box-shadow":"1px 1px 5px #585858"});
});

$(".myButton").mouseleave(function(){
	$( this ).css({"box-shadow":""});
});
