(function (ko, $) {
  'use strict';
  ///
  /// binding handler for jquery-ui ptTimeSelect
  ///
  ko.bindingHandlers.timepicker = {
    init: function (element, valueAccessor) {
      var $element = $(element);

      $element.ptTimeSelect({
        onClose: function () {
          // trigger a change event to force update
          $element.trigger('change');
        },
      });

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $element.ptTimeSelect('destroy');
      });

      ko.utils.registerEventHandler(element, 'keydown', function () {
        $.ptTimeSelect.closeCntr();
      });

      ko.utils.registerEventHandler(element, 'change', function () {
        var boundValue = valueAccessor();
        var newValue = $element.val();
        var oldValue = boundValue();
        if (oldValue !== newValue) {
          boundValue(newValue);
        }
      });
    },
    update: function (element, valueAccessor) {
      var $element = $(element);
      var boundValue = valueAccessor();
      var newValue = boundValue();
      var oldValue = $element.val();
      if (oldValue !== newValue) {
        $element.val(newValue);
      }
    },
  };

  if ('object' === typeof ko.valiation) {
    ko.validation.makeBindingHandlerValidatable('timepicker');
  }

})(this.ko, this.jQuery);