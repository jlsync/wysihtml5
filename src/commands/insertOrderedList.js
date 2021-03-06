wysihtml5.commands.insertOrderedList = {
  exec: function(composer, command) {
    var doc           = composer.doc,
        selectedNode  = composer.selection.getSelectedNode(),
        list          = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "OL" }),
        otherList     = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "UL" }),
        tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
        isEmpty,
        tempElement;

    // do not count list elements outside of composer
    if (list && !composer.element.contains(list)) {
      list = null
    }
    if (otherList && !composer.element.contains(otherList)) {
      otherList = null
    }

    if (!list && !otherList && composer.commands.support(command)) {
      doc.execCommand(command, false, null);
      return;
    }

    if (list) {
      // Unwrap list
      // <ol><li>foo</li><li>bar</li></ol>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        wysihtml5.dom.resolveList(list, composer.config.useLineBreaks);
      });
    } else if (otherList) {
      // Turn an unordered list into an ordered list
      // <ul><li>foo</li><li>bar</li></ul>
      // becomes:
      // <ol><li>foo</li><li>bar</li></ol>
      composer.selection.executeAndRestore(function() {
        wysihtml5.dom.renameElement(otherList, "ol");
      });
    } else {
      // Create list
      tempElement = composer.selection.deblockAndSurround({
        "nodeName": "div",
        "className": tempClassName
      });
      if (tempElement) {
        isEmpty = tempElement.innerHTML === "" || tempElement.innerHTML === wysihtml5.INVISIBLE_SPACE || tempElement.innerHTML === "<br>";
        composer.selection.executeAndRestore(function() {
          list = wysihtml5.dom.convertToList(tempElement, "ol", composer.parent.config.uneditableContainerClassname);
        });
        if (isEmpty) {
          composer.selection.selectNode(list.querySelector("li"), true);
        }
      }
    }
  },

  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode(),
        node = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "OL" });

    return (composer.element.contains(node) ? node : false);
  }
};
