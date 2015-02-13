/*
 *  The Syncro Soft SRL License
 *
 *  Copyright (c) 1998-2012 Syncro Soft SRL, Romania.  All rights
 *  reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *  1. Redistribution of source or in binary form is allowed only with
 *  the prior written permission of Syncro Soft SRL.
 *
 *  2. Redistributions of source code must retain the above copyright
 *  notice, this list of conditions and the following disclaimer.
 *
 *  3. Redistributions in binary form must reproduce the above copyright
 *  notice, this list of conditions and the following disclaimer in
 *  the documentation and/or other materials provided with the
 *  distribution.
 *
 *  4. The end-user documentation included with the redistribution,
 *  if any, must include the following acknowledgment:
 *  "This product includes software developed by the
 *  Syncro Soft SRL (http://www.sync.ro/)."
 *  Alternately, this acknowledgment may appear in the software itself,
 *  if and wherever such third-party acknowledgments normally appear.
 *
 *  5. The names "Oxygen" and "Syncro Soft SRL" must
 *  not be used to endorse or promote products derived from this
 *  software without prior written permission. For written
 *  permission, please contact support@oxygenxml.com.
 *
 *  6. Products derived from this software may not be called "Oxygen",
 *  nor may "Oxygen" appear in their name, without prior written
 *  permission of the Syncro Soft SRL.
 *
 *  THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 *  WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED.  IN NO EVENT SHALL THE SYNCRO SOFT SRL OR
 *  ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 *  USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 *  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 *  SUCH DAMAGE.
 */
var tree = "tree";

/**
 * Marks a link as being selected. 
 *
 * @param parentID the ID of the LI containing the link.
 */
function selectLink(parentID){
    // Clear all the classes from the a elements, and selects the target.
    var aElements = parent.tocwin.document.getElementById(tree).getElementsByTagName("a");
    var j = 0;
    for (j = 0; j < aElements.length; j++){
      if(aElements[j].parentNode.id == parentID){
        // Selected.
        aElements[j].className='selected';
      } else {
        // Unselected.
        aElements[j].className='';
      }
    }    
}

/**
 * Expands and selects a specified topic.
 *
 * @param referringTopicURL The URL of the referring topic, as string.
 * @param href The relative location of the target.
 */
function expandToTopic(referringTopicURL, href) {
  var targetAbsoluteURL = makeAbsolute(href);
  var targetAbsoluteURLArray = new Array();  
  var target;
  targetAbsoluteURLArray = targetAbsoluteURL.split("#");
  target = targetAbsoluteURLArray[0].replace("../", "");
  var idsToExpand = findIds(target);
  var toc = parent.tocwin.document;
  
   $(function(){
       if (idsToExpand != ''){
             $("#tree").dynatree("getTree").getNodeByKey(idsToExpand).focus();
       }
    });
}

function getParent(url){
  var str = "" + url;
   // Removes the last component from the path.
   url = url.substring(0, url.lastIndexOf('/'));
   return url;
}

/*
Finds all ids of parent elements of "a"'s having their hrefs ending in the target.
*/
function findIds(targetAbsoluteURL) {
  var returnedArray = new Array();
  var windowLocation = getParent(parent.tocwin.location.href);
  var toc = parent.tocwin.document.getElementById('tree');
  var aElements = toc.getElementsByTagName("a");
  var nr = aElements.length;
  var k = 0;
  for (var i = 0; i < nr; i++) {
     var linkURL = makeAbsolute(windowLocation + '/' + aElements[i].getAttribute("href"));
     if (linkURL.match(targetAbsoluteURL)) {
            returnedArray[k] = aElements[i].id;
            k++;
      }
    }
  return returnedArray;
}

/**
*  Makes absolute the input URL by stripping the .. constructs.
*/
function makeAbsolute(inputURL) {
  var url = inputURL;
  // matches a foo/../ expression
  var reParent = /[\-\w]+\/\.\.\//;
  
  // reduce all 'xyz/../' to just ''
  while (reParent.test(url)) {
    url = url.replace(reParent, "");
  }
  
  return url;
}

/**
 * Opens a page (topic) file and highlights a word from it.
 */
function openAndHighlight(page, words, linkName){
    var links = document.getElementsByTagName('a');
    for (var i = 0 ; i < links.length ; i++){
        if (links[i].id == linkName ){
            document.getElementById(linkName).className = 'otherLink';
        } else if (links[i].id.startsWith('foundLink')) {
            document.getElementById(links[i].id).className = 'foundResult';
        }
    }
    
	parent.termsToHighlight = words;
	parent.frames['contentwin'].location = page;	
}

/**
 * Hide and show div-s
 */
 
function showMenu(displayTab){
    parent.termsToHighlight = Array();
    var contentLinkText = getLocalization("Content");
    var searchLinkText = getLocalization("Search");
    var indexLinkText = getLocalization("Index");
    var tabs = document.getElementById('tocMenu').getElementsByTagName("div");
    for (var i = 0 ; i < tabs.length; i++){
        var currentTabId = tabs[i].id;
        // generates menu tabs        
        document.getElementById(currentTabId).innerHTML = '<span onclick="showMenu(\'' + currentTabId + '\')">' + eval(currentTabId + "LinkText") + '</span>';
        
        // show selected block
        selectedBlock = displayTab + "Block";
        if (currentTabId == displayTab){
            document.getElementById(selectedBlock).style.display = "block";
            $('#' + currentTabId).addClass('selected');
        } else  {
            document.getElementById(currentTabId + 'Block').style.display = "none";
            $('#' + currentTabId).removeClass('selected');
         }   
    }
	if (displayTab == 'content') {
        var pathPrefix = parent.location.pathname;
        var expandPage = getHTMLPage2Expand(parent.contentwin.location.pathname);
        if(expandPage){
            expandPage = expandPage.replace(pathPrefix, "");
            expandToTopic(window.location.href, expandPage);
        }
    }
   
    if (displayTab == 'search') {
        $('.textToSearch').focus();
    }
    if (displayTab == 'index') {
        $('#id_search').focus();
    }
  //  $('*', window.parent.contentwin.document).unhighlight();
} 

 
function hideDiv(hiddenDiv,showedDiv){   
    parent.termsToHighlight = Array();
    document.getElementById(hiddenDiv).style.display = "none";
    document.getElementById(showedDiv).style.display = "block";
    var contentLinkText = getLocalization("Content");
    var searchLinkText = getLocalization("Search");
    
	if (hiddenDiv == 'searchDiv') {
		document.getElementById('divContent').innerHTML = '<font class="normalLink">' + contentLinkText + '</font>';
		document.getElementById('divSearch').innerHTML = '<a href="javascript:void(0);" class="activeLink" id="searchLink" onclick="hideDiv(\'displayContentDiv\',\'searchDiv\')">' + searchLinkText + '</a>';
        var pathPrefix = parent.location.pathname;
        var expandPage = getHTMLPage2Expand(parent.contentwin.location.pathname);
        expandPage = expandPage.replace(pathPrefix, "");
        expandToTopic(window.location.href, expandPage);
    } else {
		document.getElementById('divContent').innerHTML = '<a href="javascript:void(0);" class="activeLink" id="contentLink" onclick="hideDiv(\'searchDiv\',\'displayContentDiv\')">' + contentLinkText + '</a>';
		document.getElementById('divSearch').innerHTML = '<font class="normalLink">' + searchLinkText + '</font>';
	}
    
  //  $('*', window.parent.contentwin.document).unhighlight();
}

/**
 *  Get the localized string for the specified key.
 */
function getLocalization(localizationKey) {
	if (localization[localizationKey]){
		return localization[localizationKey];
	}else{
		return localizationKey;
	}
}


    function getHTMLPage2Expand(url){
        currentPage =url;
    if(typeof url != 'undefined'){
      var page = url.substr(1);
      //var page = url;
      currentPage = page;
      page = parent.location.search.substr(1).split("&");
      for (x in page) {
        var q;
        q = page[x].split("=");;
        if(q[0] == 'q'){
         currentPage = q[1];
        }
      }
      }
      return currentPage;
    }