
(function (ko, $) {
  'use strict';

  ko.validation.init({
    insertMessages: false,
    errorClass: 'has-error',
    decorateInputElement: true,
    errorsAsTitle: false,
  });

  /**
   * Pad string on left.
   * @param {String} value Value to pad.
   * @param {Number} length Length of resulting string. Length defaults to 2
   *  if not supplied.
   * @param {String} character Characgter to use for padding. Character
   *  defaults to '0' if not supplied.
   * @return {String} Padded value.
   */
  function leftPad(value, length, character) {
    var padding;
    length = length || 2;
    padding = new Array(length).join(character || '0');

    return (padding + value).slice(-1 * length);
  }

  /**
   * @constructor OptionalValue
   * @param {Object} validation rules to apply
   */
  function OptionalValue(validation) {
    var vm = this;
    this.isNA = ko.observable(false);
    this.isNotNA = ko.computed(function() {
      return !vm.isNA();
    });
    
    // update supplied validation rules to disable when
    // N/A is selected. This assumes that the supplied
    // validation rules are dedicated and do not already
    // use onlyIf!!!
    for (var key in validation) {
      validation[key].onlyIf = this.isNotNA;
    }

    this.input = ko.observable().extend(validation);
    this.value = ko.computed(function() {
      if (!vm.isNA() && vm.input.isValid()) {
        return vm.input();
      } 
      return 'N/A';
    });
  }

  /**
   * @constructor
   */
  function WaterQualityViewModel() {
    var vm = this;

    // First Name: first. 
    this.first = ko.observable().extend({
      required: {
        message: 'First Name is required.', 
      },
    });

    // Last Name: last 
    this.last = ko.observable().extend({
      required: {
        message: 'Last Name is required.'
      },
    });

    // Password: password
    this.password = ko.observable().extend({
      required: {
        message: 'Password is required.'
      },
    });

    // Site: code, number, location
    this.site = new (function() {
      this.codes = [
        {k:'ML',v:'ML-'},
        {k:'BR',v:'BR-'},
        {k:'NL',v:'NL-'},
        {k:'CL',v:'CL-'},
        {k:'SL',v:'SL-'},
      ];
      this.code = ko.observable().extend({
        required: {
          message: 'Please select a site code.' 
        }
      });
      this.number = ko.observable().extend({
        required: {
          message: 'Site number is required.'
        },
        pattern: {
          params: /^\d\d\d\d$/,
          message: 'Site number must be 4 digits (0-9).'
        }
      });
      this.location = ko.observable().extend({
        required: {
          message: 'Site location is required.'
        },
        pattern: {
          params: /^\d\d$/,
          message: 'Site location must be 2 digits (0-9).'
        }
      });
      this.value = ko.computed(function() {
        if (this.number.isValid() && this.location.isValid()) {
          return this.number() + '-' + this.location();
        }
        return '';
      }, this);

      // collect errors so they can all be shown under row
      this.errors = ko.validation.group([
        this.code, this.number, this.location,
      ]);
      this.hilight = ko.computed(function() {
        return this.errors.isAnyMessageShown();
      }, this);
    })();

    // Date: month, day, year
    this.date = new (function(now) {
      var maxDate = new Date(now);
      var minDate = new Date(now);
      maxDate.setHours(23,59,59,999);
      minDate.setHours(0,0,0,0);
      minDate.setMonth(minDate.getMonth() - 1);
      
      this.input = ko.observable(now).extend({
        required: {
          message: 'A valid date is required.'
        },
        max: {
          params: maxDate,
          message: 'This date is in the future.',
        }
      });

      this.month = ko.observable();
      this.day = ko.observable();
      this.year = ko.observable();
      this.display = ko.observable();
      this.warning = ko.computed(function() {
        var dt = this.input();
        if (dt instanceof Date) {
          this.year(leftPad(dt.getYear() - 100));
          this.month(leftPad(1 + dt.getMonth()));
          this.day(leftPad(dt.getDate()));
          this.display($.datepicker.formatDate('mm/dd/yy', dt));
          if (dt < minDate) {
            return 'This date is more than 1 month in the past. You can still submit, but verify that it is correct.';
          }
        } else { 
          this.year('00');
          this.month('00');
          this.day('00');
          this.display('');
        }
        return null;
      }, this);
    })(new Date());

    function to12HourClock(time) {
      var h = time.getHours();
      return leftPad((h % 12) || 12) + ':' +
        leftPad(time.getMinutes()) + ' ' +
        (h >= 12 ? 'PM' : 'AM');
    }

    // Time 
    this.time = new (function(now) {
      // format the time as 12 hour clock
      this.input = ko.observable(now).extend({
        required: {
          message: 'Time value is required.',
        },
        pattern: {
          params: /^(0?\d|1[012])\:([0-5]\d)\s(A|P)M$/i,
          message: 'Unknown time format. Please use HH:MM AM/PM.'
        }
      });
      this.value = ko.computed(function()  {
        if (this.input.isValid()) {
          var date = new Date('12/31/2001 ' + this.input());
          return leftPad(date.getHours())+leftPad(date.getMinutes());
        }
        return '0000';
      },this);
    })(to12HourClock(new Date()));

    // Kit Number 
    this.kitNumber = ko.observable().extend({
      required: {
        message: 'Kit number is required.'
      }
    });

    // Sample ID 
    this.sampleId = ko.observable().extend({
      required: {
        message: 'Sample ID is required.'
      }
    });

    // pH: ph.value.
    this.ph = new OptionalValue({
      required: {
        message: 'Enter pH value or select N/A.',
      },
      number: {
        message: 'pH value must be between 1.0 and 14.0.',
      },
      min: {
        params: 1.0,
        message: 'pH is too low. Value must be between 1.0 and 14.0.',
      },
      max: {
        params: 14.0,
        message: 'pH is too high. Value must be between 1.0 and 14.0.',
      },
    });
    // pH warning if valid but outside range
    this.ph.warning = ko.computed(function() {
      if (!vm.ph.isNA() && vm.ph.input.isValid()) {
        var n = parseFloat(vm.ph.input());
        if (!(6.0 <= n && n <= 9.0)) {
          return 'pH is out of the normal range. You can still submit, but verify that it is correct.';
        }
      }
      return '';
    });

    // Salinity: salinity.value
    this.salinity = new OptionalValue({
      required: {
        message: 'Enter Salinity value or select N/A.',
      },
      number: {
        message: 'Salinity value must be between 0.0 and 40.0.',
      },
      min: {
        params: 0.0,
        message: 'Salinity is too low. Value must be between 0.0 and 40.0.',
      },
      max: {
        params: 40.0,
        message: 'Salinity is too high. Value must be between 0.0 and 40.0.',
      },
    });

    // Effort:
    this.effort = ko.observable(0.5).extend({
      required: { 
        message: 'Effort is required.'
      },
      min: {
        params: 0.25,
        message: 'Effort is too low. Value must be between 0.25 and 8.00.',
      }, 
      max: {
        params: 8.00,
        message: 'Effort is too high. Value must be between 0.25 and 8.00.',
      },
    });

    // Comments:
    this.comments = new (function() {
      this.input = ko.observable();
      this.value = ko.computed(function() {
        var c = this.input();
        if (c) {
          // strip newlines and commas.
          c = c.replace(/\r?\n|\r|,/g, ' ');
        }
        return c;
      }, this);
    })();

    // gather errors for testing validity
    this.errors = ko.validation.group([
      this.first, 
      this.last,
      this.password,
      this.site.code,
      this.site.number,
      this.site.location,
      this.date.input,
      this.time.input,
      this.kitNumber,
      this.sampleId,
      this.ph.input,
      this.salinity.input,
      this.effort
    ]);

    this.isValid = ko.computed(function() {
      return vm.errors().length === 0;
    });

    // alert is now only used for password
    this.alert = new (function() {
      this.message = ko.observable(null);
      this.clear = function() {
        vm.alert.message(null);
        // return true so keyboard events process
        return true;
      };
      this.setMessage = function(message) {
        vm.alert.message(message);
      };
    });

    this.confirmed = false;
    this.confirm = function() {
      
      if (!vm.isValid()) {
        vm.errors.showAllMessages();
        return false;
      } 

      if ('water' !== vm.password()) {
        vm.alert.setMessage('User name / password not found.');
        return false;
      }

      if (!this.confirmed) {
        var dialog = $('#confirmation').dialog({
          autoOpen: true,
          modal: true,
          height: Math.min($(window).height() * .9, 650),
          width: Math.min($(window).width() * .9, 550),
          buttons: {
            Submit: function() {
              // code submit calls js handler
              // use flag to bypass dialog 
              vm.confirmed = true;
              $('#waterData').submit();
              vm.confirmed = false;
              dialog.dialog('destroy');
            },
            Cancel: function () {
              dialog.dialog('destroy');
            }
          }
        });
      }
      return vm.confirmed;
    };
  }

  var vm = new WaterQualityViewModel();
  ko.applyBindings(vm);

})(this.ko, this.jQuery);
