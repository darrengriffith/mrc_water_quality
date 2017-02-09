(function(ko, $) {
  'use strict';
  
  // quick and dirty binding handler for ui-button
  // one time init for options
  ko.bindingHandlers.button = {
    init: function(element, valueAccessor) {
      $(element).button(ko.unwrap(valueAccessor()));
    }
  };

})(this.ko, this.jQuery);