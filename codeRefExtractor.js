function codeRef(injectUrl, tag) {
  /* Finds the specific tagged section delimited as follows:
   *  /// code_ref: [refName]
   *
   *  blah blah...
   *
   *  /// end_code_ref
   *
   */
  var startRegex = /\s*\/\/\/\s*code_ref:\s*([\w_]+)/;
  var endRegex = /\s*\/\/\/\s*end_code_ref\s*/;

  function findTag(lines) {
    var refName = null;
    var startLine = -1;

    for (var i=0; i < textLines.length; i++) {
      if (refName == null) { // look for the start tag
        var match = startRegex.exec(textLines[i]);
        //console.log(match + ': line ' + i + ': ' + textLines[i]);
        if (match != null && match.length == 2 && match[1] == tag) {
          refName = match[1];
          startLine = i;
        }
      }
      else {  // look for the end tag
        if (endRegex.test(textLines[i])) {
          var sampleLines = textLines.slice(startLine + 1, i);
          console.log('Found code reference "' + refName + '": lines ' + startLine + ' to ' + i);
          return sampleLines.join('\n');
        }
      }
    }

    if (refName == null) {
      // didn't find a tag
      console.log('Code reference not found');
    } else {
      // Found opening tag but no closing tag
      console.log('Found Ref tag' + refName + ' without closing reference');
    }
    return null;
  }

  var xmlHttp = new XMLHttpRequest();
  //var theUrl = "test.txt";
  xmlHttp.open("GET", injectUrl, false);
  xmlHttp.send(null);
  var textLines = xmlHttp.responseText.split('\n');

  return findTag(textLines);
}

function injectCodeRef(targetDiv, refName, sourceTarget) {
  var target = document.getElementById(targetDiv);
  
  if (target == null) {
    console.log('Invalid target element: ' + targetDiv);
    return null;
  }

  var source = codeRef(sourceTarget, refName);
  if (source == null) {
    console.log('Failed to extract code reference "' + refName + '" from ' + sourceTarget);
    return null;
  }

  // we have the code and the destination... Lets go.
  var node = document.createElement("code");
  node.className = 'language-scala';
  node.innerHTML = source;
  target.appendChild(node);
  Prism.highlightElement(node);
}
