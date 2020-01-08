/*******************************************************************************
 * alerts.js
 *
 * This file updates service status indicator images and appends
 * active status alerts to an alerts list.
 *
 ******************************************************************************/

var serviceStates = {
  "Optimal": {
    image: "dot-green.png",
    title: "System Up"
  },
  "Degraded": {
    image: "dot-yellow.png",
    title: "System Intermittent"
  },
  "Intermittent Service Interruption": {
    image: "dot-yellow.png",
    title: "System Intermittent"
  },
  "Service Interruption": {
    image: "dot-red.png",
    title: "System Down"
  }
};

var alertsApiBaseUrl = "https://api.alerts.uaservice.arizona.edu";
var serviceStatusUrl = alertsApiBaseUrl + "/services.json";
var alertsUrl = alertsApiBaseUrl + "/alerts.json";

function updateService(id, service) {
  // Update the service if it exists on the page
  if ($(id).length !== 0) {
    if (service.currentstate in serviceStates) {
      $(id).attr("src", "images/" + serviceStates[service.currentstate].image);
    } else {
      console.error("Unknown state '" + service.currentstate + "' for service '" + id + "'");
    }
    $(id).attr("alt", service.currentstate);
    $(id).attr("title", service.currentstate);
  }
}

function addAlert(alert) {
  var $alertLink = $("<a>", { href: alert["servicealerturl"], target: "_blank", rel: "noopener" }).text(alertToText(alert));
  var $span = $("<span>", { style: "font-size: 8px; display: inline-block; padding-left: 3px; vertical-align: top;" }).html("&#9701;");
  $alertLink.append($span);

  var $alertLi = $("<li>");
  $alertLi.append($alertLink);

  $("#alertlist").append($alertLi);
}

function alertToText(alert) {
  var txt = alert["overview"];
  return txt;
}

$(function () {

  $.getJSON(serviceStatusUrl, function (serviceList) {
    // Iterate over the list and update service statuses
    serviceList.forEach(function (service) {
      var serviceId = "#ua-service-status-" + service['machinename'];

      // Special case to treat student center mobile the same as student center
      if (service['machinename'] == 'uaccessstudent') {
        updateService('#ua-service-status-uaccessstudentmobile', service);
      }

      updateService(serviceId, service);
    });
  });

  // Add alerts if #alertlist exists
  if ($("#alertlist")) {
    $.getJSON(alertsUrl, function (activeAlertList) {
      // Iterate over the list and add alerts
      activeAlertList.forEach(function (alert) {
        addAlert(alert);
      });

      // Show the alerts div if there are alerts
      if (activeAlertList.length > 0) {
        $("#ua-service-alert-box").show();
      }
    });
  }

});
