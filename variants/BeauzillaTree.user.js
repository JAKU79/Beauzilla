// ==UserScript==
// @name         Beauzilla Tree
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Stylování stromu Bugzilly
// @updateURL    https://github.com/JAKU79/Beauzilla/variants/raw/master/BeauzillaTree.user.js
// @downloadURL  https://github.com/JAKU79/Beauzilla/variants/raw/master/BeauzillaTree.user.js
// @author       Jan Kusák
// @grant        none
// @match        https://bugzilla.abra.eu/showdependencytree.cgi*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// *** AJAX ***
// Funkce pro přidělení symbolů k bugům v závislosti na jejich vztahu k dokumentaci
function bugMarker(thatBug) {
		var outerThis = this;
		$('<div>').load("https://bugzilla.abra.eu/show_bug.cgi?id=" + thatBug + " #bugzilla-body", function(){
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
					$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/check_mark_standard.png'></img>" )
				} else {
					$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/green_dot.png'></img>" )
				};
			} else if (myToHelp == "-") {
				$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross_green.png'></img>" )
			} else if (myToHelp == "?") {
				$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>" )
			} else if (myToHelp == "") {
				$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/questionmark.png'></img>" )
			};
		} else if (isWontfix == true) {
			$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else if (isInvalid == true) {
			$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else if (isDuplicate == true) {
			$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/cross.png'></img>" );
		} else {
			$(outerThis).before( "<img style=\"padding-left:5px;padding-right:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/red_dot.png'></img>" );
		};
	});
};

$("span")
    .filter(function() {
        return this.id.match(/[0-9]{5}/);
    })
	.each(function() {
  		var thisBug = $(this).attr("id");
		bugMarker.call(this, thisBug);
	});
