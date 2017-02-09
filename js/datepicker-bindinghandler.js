(function (ko, $) {
  'use strict';
  ///
  /// binding handler for jquery-ui datepicker
  /// Expects/Uses Date instances to track value.
  ///
  ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor) {
      var $element = $(element);
      var DATEFORMAT = 'mm/dd/yy';

      $element.datepicker({
        dateFormat: DATEFORMAT,
        showOn: 'button',
        buttonText: 'Calendar',
        onClose: function (dateText, inst) {
          var boundValue = valueAccessor();
          // console.log('onClose("%s",%o)',dateText,inst);
          // dateText will be empty string if no new date was selected.
          if ('' != dateText) {
            var newValue = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
            var oldValue = boundValue();
            if (newValue > oldValue || oldValue > newValue) {
              boundValue(newValue);
            }
          }
        },
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $element.datepicker('destroy');
      });
      
      // add style to widget button
      var $button = $element.next();
      $element.next().button({
        text: false,
        icons: {
          primary: 'ui-icon-calendar',
          secondary: ''
        }
      });
      ko.utils.domNodeDisposal.addDisposeCallback($button[0], function () {
        $button.button('destroy');
      });

      // listen for updates when user types into the input field.
      ko.utils.registerEventHandler(element, 'change', function () {
        var boundValue = valueAccessor();
        // console.log('change(%o)', arguments[0]);
        var pickerDate = $element.datepicker('getDate');
        // the current incarnation of the date picker allows entry and display
        // of an invalid date. Before updating boundValue, make sure that both
        // the text date and the picker date are in agreement. If they are not,
        // clear both the text field and boundValue
        var textDate = new Date($element.val());
        if (isNaN(textDate).valueOf() || textDate > pickerDate || textDate < pickerDate) {
          pickerDate = null;
        }
        // update picker to clear or reformat value
        $element.datepicker('setDate', pickerDate);
        boundValue(pickerDate);
        return true;
      });

    },
    update: function (element, valueAccessor) {
      var boundValue = valueAccessor();
      // console.log('update', boundValue());
      var $element = $(element);
      var newValue = boundValue() || null;
      var oldValue = $element.datepicker('getDate') || null;
      //
      // If incomming value is a string, parse it into a Date
      //
      if ('string' === typeof newValue) {
        newValue = new Date(newValue);
        if (isNaN(newValue.valueof())) {
          newValue = null;
        }
      }
      if (newValue > oldValue || newValue < oldValue) {
        $element.datepicker('setDate', newValue);
      }
    },
  };

  if ('object' === typeof ko.valiation) {
    ko.validation.makeBindingHandlerValidatable('datepicker');
  }

})(this.ko, this.jQuery);