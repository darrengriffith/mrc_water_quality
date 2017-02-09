
var MRC = (function () {
  "use strict";

  function validate() {

    var returnVal;

    try {
      clearAlert();
      returnVal = validateSiteNumber(true);
      returnVal = validateSampleLocation(true) && returnVal;
      returnVal = dateUpdated(true) && returnVal;
      returnVal = timeUpdated(true) && returnVal;

      returnVal = validateAirTemp(true) && returnVal;
      returnVal = validateWaterTemp(true) && returnVal;
      returnVal = validateSecchi(true) && returnVal;
      returnVal = validateWaterDepth(true) && returnVal;
      returnVal = validateSalinity(true) && returnVal;
      returnVal = validatePh(true) && returnVal;
      returnVal = validateDo(true) && returnVal;

      $('#site_no').val($('#site_no_field').val() + '-' + $('#site_sample_loc').val());
      $('#dosat').val(computeDOSalinity());

    } catch (e) {
      showAlert(e.message);
      return false;
    }

    return returnVal;
  }

  function naButtonClick(naButton, naField) {
    $('#' + naField).prop('readonly', $('#' + naButton).prop('checked'));

    if ($('#' + naButton).prop('checked') === true) {
      $('#' + naField).val('N/A');
    } else {
      $('#' + naField).val('').focus();
    }
  }

  function secchiButtonClick() {
    $('#secchi').prop('readonly', $('#secchi_vab').prop('checked') || $('#secchi_na').prop('checked'));

    if ($('#secchi_na').prop('checked') === true) {
      $('#secchi').val('N/A');
      $('#secchi_vab').prop('checked', false);
      $('#secchi_vab').button('refresh');

    } else if ($('#secchi_vab').prop('checked') === true) {
      $('#secchi').val('VAB');

    } else {
      $('#secchi').val('').focus();

    }

    MRC.validateSecchi();
  }

  function validateAirTemp(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#atemp').css('background-color', 'transparent');
    }

    if ($('#atemp_na').prop('checked') === true) {
      $('#atemp').val('N/A');
      return true;
    }

    // check air temp in (C) for number between below freezing (-6) and 50 (the updated validation range)
    // (higher than the record high temp of 38.8)
    if (isNumeric($('#atemp').val())) {
      if ($('#atemp').val() < -6 ||
        $('#atemp').val() > 50) {
        showAlert("Air Temerature needs to be number between -6 and 50 degrees Celsius");
        $('#atemp').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("Air Temerature needs to be number");
      $('#atemp').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateWaterTemp(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#wtemp').css('background-color', 'transparent');
    }

    if ($('#wtemp_na').prop('checked') === true) {
      $('#wtemp').val('N/A');
      return true;
    }

    // check water temp in (C) for temperature
    if (isNumeric($('#wtemp').val())) {
      if ($('#wtemp').val() < -6 ||
        $('#wtemp').val() > 50) {
        $('#wtemp').css('background-color', 'pink');
        showAlert("Water Temerature needs to be number between -6 and 50 degrees Celsius");
        return false;
      }
    } else {
      showAlert("Water Temerature needs to be number");
      $('#wtemp').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateWaterDepth(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#depth').css('background-color', 'transparent');
    }

    if ($('#depth_na').prop('checked') === true) {
      $('#depth').val('N/A');
      return true;
    }

    // check water depth for valid range 0-10 (meters) - new validation range July 2016
    if (isNumeric($('#depth').val())) {
      if ($('#depth').val() < 0 ||
        $('#depth').val() > 10) {
        showAlert("Water Depth needs to be number between 0 and 10");
        $('#depth').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("Water Depth needs to be number");
      $('#depth').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateSecchi(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#secchi').css('background-color', 'transparent');
    }

    if ($('#secchi_na').prop('checked') === true) {
      $('#secchi').val('N/A');
      $('#secchi_vab').prop('checked', false);
      return true;
    }

    if ($('#secchi_vab').prop('checked') === true) {
      $('#secchi').val('VAB');
      return true;
    }

    // check for valid range of numbers
    if (isNumeric($('#secchi').val())) {
      if ($('#secchi').val() < 0 ||
        $('#secchi').val() > 10 ||
        Number($('#secchi').val()) > Number($('#depth').val())) {
        showAlert("Secchi Depth needs to be number between 0 and 10 and less than the Water Depth");
        $('#secchi').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("Secchi Depth needs to be number");
      $('#secchi').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateSalinity(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#salinity').css('background-color', 'transparent');
    }

    if ($('#salinity_na').prop('checked') === true) {
      $('#salinity').val('N/A');
      return true;
    }

    if (isNumeric($('#salinity').val())) {
      if ($('#salinity').val() < 0 ||
        $('#salinity').val() > 40) {
        showAlert("Salinity is outside of valid range. Please enter a number from 0 and 40");
        $('#salinity').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("Salinity is invalid, Please enter a number from 0 and 40");
      $('#salinity').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validatePh(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#ph').css('background-color', 'transparent');
    }

    if ($('#ph_na').prop('checked') === true) {
      $('#ph').val('N/A');
      return true;
    }

    if (isNumeric($('#ph').val())) {
      if ($('#ph').val() < 1 ||
        $('#ph').val() > 14) {
        showAlert("pH values can be between 1 and 14");
        $('#ph').css('background-color', 'pink');
        return false;
      } else if ($('#ph').val() < 6 ||
        $('#ph').val() > 9) {
        showAlert("ph is out of the normal range.  You can still submit, but verify that it is correct.");
      }
    } else {
      showAlert("Ph needs to be number");
      $('#ph').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateDo(appendAlerts) {

    if (!appendAlerts) {
      clearAlert();
      $('#do').css('background-color', 'transparent');
    }

    if ($('#do_na').prop('checked') === true) {
      $('#do').val('N/A');
      return true;
    }

    if (isNumeric($('#do').val())) {
      if ($('#do').val() < 0 ||
        $('#do').val() > 20) {
        showAlert("DO needs to be number between 0 and 20");
        $('#do').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("DO needs to be number between 0 and 20");
      $('#do').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateSiteNumber(appendAlerts) {
    if (!appendAlerts) {
      clearAlert();
      $('#site_no_field').css('background-color', 'transparent');
    }

    if ($('#site_code').val() === null) {
      showAlert("Please select a site code");
      $('#site_no_field').css('background-color', 'pink');
      return false;
    } else if (isNumeric($('#site_no_field').val())) {
      if ($('#site_no_field').val().length !== 4) {
        showAlert('The site number must contain 4-digits numerical characters');
        $('#site_no_field').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert("Site Number needs to be number");
      $('#site_no_field').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function validateSampleLocation(appendAlerts) {
    if (!appendAlerts) {
      clearAlert();
      $('#site_sample_loc').css('background-color', 'transparent');
    }
    if (isNumeric($('#site_sample_loc').val())) {
      if ($('#site_sample_loc').val().length !== 2) {
        showAlert('The sample location must have a 2 digit number ');
        $('#site_sample_loc').css('background-color', 'pink');
        return false;
      }
    } else {
      showAlert('The sample location must have a 2 digit number. ');
      $('#site_sample_loc').css('background-color', 'pink');
      return false;
    }
    return true;
  }

  function dateUpdated(appendAlerts) {
    try {
      if (!appendAlerts) {
        clearAlert();
        $('#date').css('background-color', 'transparent');
      }

      //var dateObj = new Date($('#date').datepicker('getDate'));
      var dateObj = new Date($('#date').val());

      if (dateObj.toString() === "Invalid Date") {
        showAlert("Invalid Date");
        $('#date').css('background-color', 'pink');
        return false;
      } else if (dateObj > new Date()) {
        showAlert("This date is in the future");
        $('#date').css('background-color', 'pink');
        return false;
      } else {
        var month = dateObj.getMonth() + 1;
        var monthStr = '';
        if (month < 10) {
          monthStr = '0';
        }
        monthStr += month;

        var day = dateObj.getDate();
        var dayStr = '';
        if (day < 10) {
          dayStr = '0';
        }
        dayStr += day;

        $('#month').val(monthStr);
        $('#day').val(dayStr);
        $('#year').val(dateObj.getYear() - 100);
      }

      var oldLimit = new Date();
      oldLimit.setMonth(oldLimit.getMonth() - 1);
      if (dateObj < oldLimit) {
        showAlert("This date is more than 1 month in the past.  You can still submit, but verify that it is correct.");
      }

    } catch (e) {
      showAlert(e.message);
      $('#date').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function timeUpdatedOnClose() {
    return timeUpdated();
  }

  function timeUpdated(appendAlerts) {
    try {
      if (!appendAlerts) {
        clearAlert();
        $('#timeField').css('background-color', 'transparent');
      }

      var today = new Date();
      var dateObj = new Date((today.getMonth() + 1).toString() + "/" + (today.getDate() + 1).toString() + "/" + today.getFullYear() + " " + $('#timeField').val());

      if (dateObj.toString() === "Invalid Date" || !$('#timeField').val().match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/)) {
        showAlert('Unknown time format.  Please use HH:MM AM/PM.');
        $('#timeField').css('background-color', 'pink');
        return false;
      } else {
        var hours = "";
        if (dateObj.getHours() < 10) {
          hours += "0";
        }
        hours += dateObj.getHours().toString();

        var mins = "";
        if (dateObj.getMinutes() < 10) {
          mins += "0";
        }
        mins += dateObj.getMinutes().toString();

        $('#time').val(hours + mins);
      }

    } catch (e) {
      showAlert(e.message);
      $('#timeField').css('background-color', 'pink');
      return false;
    }

    return true;
  }

  function computeDOSalinity() {

    try {
      var wt = parseFloat($('#wtemp').val());
      var SAL = parseFloat($('#salinity').val());
      var ox = parseFloat($('#do').val());

      // compute Kelvin temperature 
      var TEMPK = wt + 273;

      var sat = Math.exp(-139.34411 +
        (1.575701E5 +
          (-6.642308E7 +
            (1.2438E10 -
              8.621949E11 / TEMPK) /
            TEMPK) /
          TEMPK) /
        TEMPK) *
        Math.exp(-1 *
          SAL *
          (0.017674 +
            (-10.754 + 2140.7 / TEMPK) /
            TEMPK)
        );

      var psat = (ox / sat) * 100;
      psat = Math.round(psat * 100) / 100;

      return psat;

    } catch (e) {
      showAlert(e.message);
    }
    clearAlert();
  }

  function isNumeric(input) {
    return $.isNumeric(input);
  }

  function calculateAverage() {
    $('#do').val((parseFloat($('#do1').val()) + parseFloat($('#do2').val())) / 2);

    validateDo();
  }

  function getDefaultDate() {

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = month.toString() + "/" + day.toString() + "/" + now.getFullYear().toString();

    return today;
  }

  function getDefaultTime() {

    var now = new Date();

    var hours = now.getHours();
    var minutes = now.getMinutes();

    return ((hours > 12) ? hours - 12 : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ' ' + ((now.getHours() >= 12) ? "PM" : "AM");
  }

  function updateFirebase() {

    var observation = {
      siteID: $("#site_code option:selected").val() + $('#site_no').val(),
      observer: email,
      date: $('#date').val(),
      time: $('#timeField').val(),
      airTemp: $('#atemp').val(),
      waterTemp: $('#wtemp').val(),
      waterDepth: $('#depth').val(),
      secchiDepth: $('#secchi').val(),
      salinity: $('#salinity').val(),
      ph: $('#ph').val(),
      weather: $("#weather option:selected").val(),
      weatherStr: $("#weather option:selected").text(),
      waterColor: $("#color option:selected").val(),
      waterColorStr: $("#color option:selected").text(),
      waterSurface: $("#surface option:selected").val(),
      waterSurfaceStr: $("#surface option:selected").text(),
      windDirection: $("#wind option:selected").val(),
      windDirectionStr: $("#wind option:selected").text(),
      do: $('#do').val(),
      pSat: computeDOSalinity(),
      comments: $('#comments').val()
    }

    var dateStr = $('#date').val().replace(/[\/]/g, "-");

    console.log("Writing " + observation.siteID + "/" + dateStr);
    console.log(observation);

    return firebase.database().ref('/observations/' + observation.siteID + "/" + dateStr).set(observation);
  }

  function showAlert(alertMsg) {
    $('#alert').show();
    $('#alertMessage').html($('#alertMessage').html() + '<br>' + alertMsg);
  }

  function clearAlert() {
    $('#alert').hide();
    $('#alertMessage').html('');
  }

  function createDialog() {
    var dialog;
    var form;

    function submitData() {

      try {
        if (MRC.validate()) {
          updateFirebase().then(
            function () {
              dialog.dialog("close");
              generateChart($("#site_code option:selected").val() + $('#site_no').val());
            },
            function (error) {
              showAlert(error)
            }
          );
        }
      } catch (e) {
        showAlert(e.message);
      }
    }

    dialog = $("#confirmation").dialog({
      autoOpen: false,
      modal: true,
      height: Math.min($(window).height() * .9, 750),
      width: Math.min($(window).width() * .9, 550),
      buttons: {
        "Submit": submitData,
        Cancel: function () {
          dialog.dialog("close");
        }
      }
    });

    form = dialog.find("#waterData").on("submit", function (event) {
      event.preventDefault();
    });

    $("#confirmButton").button().on("click", function () {
      if (MRC.validate()) {
        $('#siteCodeConfirm').text($("#site_code option:selected").val());
        $('#siteNoConfirm').text($('#site_no').val());
        $('#dateConfirm').text($('#date').val());
        $('#timeConfirm').text($('#timeField').val());
        $('#airTempConfirm').text($('#atemp').val());
        $('#waterTempConfirm').text($('#wtemp').val());
        $('#waterDepthConfirm').text($('#depth').val());
        $('#secchiDepthConfirm').text($('#secchi').val());
        $('#salinityConfirm').text($('#salinity').val());
        $('#phConfirm').text($('#ph').val());
        $('#weatherConfirm').text($("#weather option:selected").text());
        $('#waterSurfaceConfirm').text($("#surface option:selected").text());
        $('#waterColorConfirm').text($("#color option:selected").text());
        $('#windDirectionConfirm').text($("#wind option:selected").text());
        $('#doConfirm').text($('#do').val());
        $('#psatConfirm').text(computeDOSalinity());
        $('#commentsConfirm').text($('#comments').val());

        dialog.dialog("open");
      }
    });
  }

  function initSiteID(email) {

    console.log(Base64.encode(email));

    firebase.database().ref('/users/' + Base64.encode(email) + '/siteID').once('value').then(function (snapshot) {

      console.log(snapshot.val());

      var site = snapshot.val().split('-');

      console.log(site);

      $('#site_code option[value=' + site[0] + '-]').prop('selected', true);
      $('#site_no_field').val(site[1]);
      $('#site_sample_loc').val(site[2]);
      MRC.validateSampleLocation();

      loadRecord();
      generateChart(snapshot.val());
    });
  }

  function loadRecord() {

    var siteID = $("#site_code option:selected").val() + $('#site_no_field').val() + "-" + $('#site_sample_loc').val();

    if (siteID !== "") {
      var dateStr = $('#date').val().replace(/[\/]/g, "-");

      console.log("Loading " + siteID + "/" + dateStr);

      firebase.database().ref('/observations/' + siteID + "/" + dateStr).once('value').then(function (snapshot) {

        console.log(snapshot.val());

        if (snapshot.val() !== null) {
          $('#timeField').val(snapshot.val().time);
          $('#atemp').val(snapshot.val().airTemp);
          $('#wtemp').val(snapshot.val().waterTemp);
          $('#depth').val(snapshot.val().waterDepth);
          $('#secchi').val(snapshot.val().secchiDepth);
          $('#salinity').val(snapshot.val().salinity);
          $('#ph').val(snapshot.val().ph);
          $('#weather option[value="' + snapshot.val().weather + '"]').prop('selected', true);
          $('#color option[value="' + snapshot.val().waterColor + '"]').prop('selected', true);
          $('#wind option[value="' + snapshot.val().windDirection + '"]').prop('selected', true);
          $('#do').val(snapshot.val().do);
          $('#comments').val(snapshot.val().comments);
        }
      });
    }
  }

  function generateChart(siteID) {

    if (siteID !== "") {
      console.log("Loading " + siteID);

      firebase.database().ref('/observations/' + siteID).once('value').then(function (snapshot) {

        console.log(snapshot.val());

        if (snapshot.val() !== null) {

          var labels = ['x'];
          var airTemp = ['Air Temp'];
          var waterTemp = ['Water Temp'];
          var waterDepth = ['Water Depth'];
          var secchiDepth = ['Secchi Depth'];
          var salinity = ['Salinity'];
          var ph = ['pH'];
          var do2 = ['Dissolved O2']
          for (var key in snapshot.val()) {
            var observation = snapshot.val()[key];
            labels.push(key);
            airTemp.push(observation.airTemp);
            waterTemp.push(observation.waterTemp);
            waterDepth.push(observation.waterDepth);
            secchiDepth.push(observation.secchiDepth);
            salinity.push(observation.salinity);
            ph.push(observation.ph);
            do2.push(observation.do);
          }

          var chart = c3.generate({
            bindto: '#chart',
            data: {
              x: 'x',
              columns: [
                labels,
                airTemp,
                waterTemp,
                waterDepth,
                secchiDepth,
                salinity,
                ph,
                do2
              ]
            },
            axis: {
              x: {
                type: 'category'
              }
            }
          });
        }
      });
    }
  }

  return {
    computeDOSalinity: computeDOSalinity,
    calculateAverage: calculateAverage,
    dateUpdated: dateUpdated,
    timeUpdated: timeUpdated,
    timeUpdatedOnClose: timeUpdatedOnClose,
    getDefaultDate: getDefaultDate,
    getDefaultTime: getDefaultTime,
    naButtonClick: naButtonClick,
    secchiButtonClick: secchiButtonClick,
    validate: validate,
    validateDo: validateDo,
    validateAirTemp: validateAirTemp,
    validateWaterTemp: validateWaterTemp,
    validateWaterDepth: validateWaterDepth,
    validateSampleLocation: validateSampleLocation,
    validateSecchi: validateSecchi,
    validateSalinity: validateSalinity,
    validatePh: validatePh,
    validateSiteNumber: validateSiteNumber,
    createDialog: createDialog,
    initSiteID: initSiteID,
    loadRecord: loadRecord,
    generateChart: generateChart
  };

} ());

$(document).ready(function () {
  "use strict";

  $("#date").datepicker({
    dateFormat: "mm/dd/yy",
    showOn: "button",
    buttonText: "Calendar"
  });
  $('button.ui-datepicker-trigger').button({
    text: false,
    icons: {
      primary: 'ui-icon-calendar',
      secondary: ''
    }
  });
  $("#date").datepicker('setDate', MRC.getDefaultDate());
  MRC.dateUpdated();

  $('#timeField').val(MRC.getDefaultTime());
  MRC.timeUpdated();
  $('#timeField').ptTimeSelect({
    onClose: MRC.timeUpdatedOnClose
  });

  MRC.createDialog();

  $('#siteList').button();
  $('#atemp_na').button();
  $('#wtemp_na').button();
  $('#depth_na').button();
  $('#secchi_vab').button();
  $('#secchi_na').button();
  $('#salinity_na').button();
  $('#ph_na').button();
  $('#do_na').button();
  $('#do_ave').button();
});

// knockout binding model for data entry
(function (ko, $) {
  'use strict';

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
    this.isNotNA = ko.computed(function () {
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
    this.value = ko.computed(function () {
      if (!vm.isNA() && vm.input.isValid()) {
        return vm.input();
      }
      return 'N/A';
    });
  }

  /**
   * @param {Date} time time to format
   * @return {String} formatted time HH:MM AM
   */
  function to12HourClock(time) {
    var h = time.getHours();
    return leftPad((h % 12) || 12) + ':' +
      leftPad(time.getMinutes()) + ' ' +
      (h >= 12 ? 'PM' : 'AM');
  }

  /**
   * @constructor
   */
  function WaterDataViewModel() {
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
    this.site = new (function () {
      this.codes = [
        { k: 'ML', v: 'ML-' },
        { k: 'BR', v: 'BR-' },
        { k: 'NL', v: 'NL-' },
        { k: 'CL', v: 'CL-' },
        { k: 'SL', v: 'SL-' },
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
      this.value = ko.computed(function () {
        if (this.number.isValid() && this.location.isValid()) {
          return this.number() + '-' + this.location();
        }
        return '';
      }, this);

      // collect errors so they can all be shown under row
      this.errors = ko.validation.group([
        this.code, this.number, this.location,
      ]);
      this.hilight = ko.computed(function () {
        return this.errors.isAnyMessageShown();
      }, this);
    })();

    // Date: month, day, year
    this.date = new (function (now) {
      var maxDate = new Date(now);
      var minDate = new Date(now);
      maxDate.setHours(23, 59, 59, 999);
      minDate.setHours(0, 0, 0, 0);
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
      this.warning = ko.computed(function () {
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

    // Time 
    this.time = new (function (now) {
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
      this.value = ko.computed(function () {
        if (this.input.isValid()) {
          var date = new Date('12/31/2001 ' + this.input());
          return leftPad(date.getHours()) + leftPad(date.getMinutes());
        }
        return '0000';
      }, this);
    })(to12HourClock(new Date()));

    // Air temperature
    this.airTemp = new OptionalValue({
      required: {
        message: 'Enter air temperature value or select N/A.',
      },
      min: {
        params: -6,
        message: 'Air temperature is too low. Value must be between -6&degrees; and 50&degrees; C'
      },
      max: {
        params: 50,
        message: 'Air temperature is too high. Value must be between -6&degrees; and 50&degrees; C'
      }
    });

    // Water temperature
    this.waterTemp = new OptionalValue({
      required: {
        message: 'Enter water temperature value or select N/A.',
      },
      min: {
        params: -6,
        message: 'Water temperature is too low. Value must be between -6&degrees; and 50&degrees; C'
      },
      max: {
        params: 50,
        message: 'Water temperature is too high. Value must be between -6&degrees; and 50&degrees; C'
      }
    });

    // Water depth
    this.waterDepth = new OptionalValue({
      required: {
        message: 'Enter water depth value or select N/A.',
      },
      min: {
        params: 0,
        message: 'Water depth is too low. Value must be between 0 and 10 meters.'
      },
      max: {
        params: 10,
        message: 'Water depth is too high. Value must be between 0 and 10 meters.'
      }
    });

    // Secchi depth
    this.secchiDepth = new (function () {
      var vm = this;
      this.isNA = ko.observable(false);
      this.isVAB = ko.observable(false);

      function mutuallyExclude(src, target) {
        src.subscribe(function (value) {
          if (value) {
            target(false);
          }
        });
      }
      mutuallyExclude(this.isNA, this.isVAB);
      mutuallyExclude(this.isVAB, this.isNA);

      this.isNotNA = ko.computed(function () {
        return !(vm.isNA() || vm.isVAB());
      });

      this.input = ko.observable().extend({
        required: {
          message: 'Enter secchi value or select N/A or VAB.',
          onlyIf: this.isNotNA,
        },
        min: {
          params: 0,
          message: 'Secchi depth is too low. Value must be between 0 and 10 meters.',
          onlyIf: this.isNotNA,
        },
        max: {
          params: 10,
          message: 'Secchi depth is too high. Value must be between 0 and 10 meters.',
          onlyIf: this.isNotNA,
        },
      });

      this.value = ko.computed(function () {
        if (vm.isNotNA() && vm.input.isValid()) {
          return vm.input();
        }
        if (vm.isVAB()) {
          return 'VAB';
        }
        return 'N/A';
      });

    })();

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
    this.ph.warning = ko.computed(function () {
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

    // Weather
    this.weather = new (function () {
      this.options = [
        { k: 'Clear', v: 1 },
        { k: 'Partly Cloudy', v: 2 },
        { k: 'Overcast', v: 3 },
        { k: 'Fog / Haze', v: 4 },
        { k: 'Drizzle', v: 5 },
        { k: 'Intermittent Rain', v: 6 },
        { k: 'Rain', v: 7 },
        { k: 'N/A', v: 'N/A' },
      ];
      this.value = ko.observable().extend({
        required: {
          message: 'Please select a weather code.'
        }
      });
    })();

    // Water surface
    this.surface = new (function () {
      this.options = [
        { k: 'Calm', v: 1 },
        { k: 'Water Ripples', v: 2 },
        { k: 'Waves', v: 3 },
        { k: 'White Caps', v: 4 },
        { k: 'N/A', v: 'N/A' },
      ];
      this.value = ko.observable().extend({
        required: {
          message: 'Please select a value for water surface.'
        }
      });
    })();

    // Water color
    this.color = new (function () {
      this.options = [
        { k: 'Normal', v: 1 },
        { k: 'Abnormal', v: 2 },
        { k: 'N/A', v: 'N/A' },
      ];
      this.value = ko.observable().extend({
        required: {
          message: 'Please select a value for water color.'
        }
      });
    })();

    // Wind direction
    this.wind = new (function () {
      this.options = [
        { k: 'From the North', v: 'N' },
        { k: 'From the Northeast', v: 'NE' },
        { k: 'From the East', v: 'E' },
        { k: 'From the Southeast', v: 'SE' },
        { k: 'From the South', v: 'S' },
        { k: 'From the Southwest', v: 'SW' },
        { k: 'From the West', v: 'W' },
        { k: 'From the Northwest', v: 'NW' },
        { k: 'Calm', v: 'Calm' },
        { k: 'N/A', v: 'N/A' },
      ];
      this.value = ko.observable().extend({
        required: {
          message: 'Please select a value for wind direction.'
        }
      });
    })();

    // Disolved Oxygen
    this.oxygen = new(function() {
      var vm = this;
      
      this.isNA = ko.observable(false);
      this.isNotNA = ko.computed(function() {
        return !vm.isNA();
      });

      this.readings = [
        ko.observable(),
        ko.observable(),
      ];
      
      this.average = function() {
        var n = 0, a = 0.0;
        ko.utils.arrayForEach(vm.readings, function(o) {
          var v = parseFloat(o());
          if (!isNaN(v)) {
            a = a + v;
            n = n + 1;
          }
        });
        this.input(n ? (a / n) : n);
      };

      this.input = ko.observable().extend({
        required: {
          message: 'Enter oxygen value or select N/A.',
          onlyIf: this.isNotNA,
        },
        min: {
          params: 0,
          message: 'Oxygen value is too low. Value must be between 0 and 20.',
          onlyIf: this.isNotNA,
        },
        max: {
          params: 20,
          message: 'Oxygen value is too high. Value must be between 0 and 20.',
          onlyIf: this.isNotNA,
        },
      });
      
      this.value = ko.computed(function() {
        if (vm.isNotNA() && vm.input.isValid()) {
          return vm.input();
        }
        return 'N/A';
      });

    })();

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
    this.comments = new (function () {
      this.input = ko.observable();
      this.value = ko.computed(function () {
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
      this.ph.input,
      this.salinity.input,
      this.effort
    ]);

  }

  // not ready for prime time
  var complete = false;
  if (complete) {

    ko.validation.init({
      insertMessages: false,
      errorClass: 'has-error',
      decorateInputElement: true,
      errorsAsTitle: false,
    });

    var vm = new WaterDataViewModel();
    ko.applyBindings(vm);

  }

})(this.ko, this.jQuery);