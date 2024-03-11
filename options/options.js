$(document).ready(function () {
  // Dropdown menu elements
  const dropdown = $(".dropdown");
  const select = dropdown.find(".select");
  const caret = dropdown.find(".caret");
  const menu = dropdown.find(".menu");
  const options = dropdown.find(".li");
  const selected = dropdown.find(".selected");

  // Background elements
  const options_container = $("body");
  const alif = $("#alif");
  const topLeft = $("#top-left");
  const topRight = $("#top-right");
  const bottomLeft = $("#bottom-left");
  const BottomRight = $("#bottom-right");
  const left = $("#left");
  const right = $("#right");

  const elementDark = () => {
    topLeft.attr("src", "../images/cornerLight.png");
    topRight.attr("src", "../images/cornerLight.png");
    bottomLeft.attr("src", "../images/cornerLight.png");
    BottomRight.attr("src", "../images/cornerLight.png");
    left.attr("src", "../images/edgeLight.png");
    right.attr("src", "../images/edgeLight.png");
    alif.attr("src", "../images/squareLight.png");
  };

  // Dark theme logic
  const check = $("#check");

  const enableDarkMode = () => {
    chrome.storage.sync.set({ darkMode: "true" });
    check.prop("checked", true);
    elementDark();
  };

  const disableDarkMode = () => {
    chrome.storage.sync.set({ darkMode: "false" });
    check.prop("checked", false);
  };

  const toggleTheme = () => {
    options_container.toggleClass("bodyDark");
    $("#save").toggleClass("buttonDark");
    $("#back").toggleClass("buttonDark");
    $(".line").toggleClass("lineDark");
    caret.toggleClass("caretDark");
    select.toggleClass("selectDark");
    menu.toggleClass("menuDark");
  };

  chrome.storage.sync.get("darkMode", function (data) {
    const dark = data.darkMode;
    if (dark === "true") {
      enableDarkMode();
      toggleTheme();
    }
  });

  check.on("change", () => {
    if (check.prop("checked")) {
      enableDarkMode();
      toggleTheme();
    } else {
      disableDarkMode();
      toggleTheme();
    }
  });
  // Retrieving the frequency stored for its correct display
  chrome.storage.sync.get("frequency", function (data) {
    const frequency = data.frequency || 10; // default is 10 minutes
    console.log("frequency retrieved " + frequency);
    options.removeClass("activeDark active");
    options.each(function () {
      const option = $(this); // Store reference to the current DOM element
      if (option.val() == frequency) {
        console.log("frequency option found " + frequency);
        chrome.storage.sync.get("darkMode", function (data) {
          const dark = data.darkMode;
          console.log("dark value " + dark);
          if (dark === "true") {
            console.log("test 3 " + frequency);
            option.addClass("activeDark"); // Use the stored reference
          } else {
            option.addClass("active"); // Use the stored reference
          }
        });
        selected.text(option.text()); // Use the stored reference
      }
    });
  });

  // Dropdown menu logic
  select.on("click", function () {
    chrome.storage.sync.get("darkMode", function (data) {
      const dark = data.darkMode;

      if (dark === "true") {
        select.toggleClass("select-clicked-dark").removeClass("select-clicked");
      } else {
        select.toggleClass("select-clicked").removeClass("select-clicked-dark");
      }
      caret.toggleClass("caret-rotate");
      menu.toggleClass("menu-open");
      options.each(function () {
        const option = $(this);
        if (dark === "true") {
          option.addClass("liDark").removeClass("li");
          console.log("test lidark 1");
        } else {
          option.addClass("li").removeClass("liDark");
          console.log("test lidark 2");
        }
        if (option.hasClass("active") || option.hasClass("activeDark")) {
          if (dark === "true") {
            option.addClass("activeDark").removeClass("active");
          } else {
            option.removeClass("activeDark").addClass("active");
          }
        }
      });
    });
  });

  options.on("click", function () {
    const clickedOption = $(this); // Store reference to the clicked DOM element
    chrome.storage.sync.get(["darkMode", "frequency"], function (data) {
      const dark = data.darkMode;
      const frequency = data.frequency;

      if (frequency === clickedOption.val()) {
        $(".unsaved").hide();
        $("#save").removeClass("unsaved_button");
      } else {
        $(".unsaved").show();
        $("#save").addClass("unsaved_button");
      }

      selected.text(clickedOption.text());
      if (dark === "true") {
        select.removeClass("select-clicked-dark");
      } else {
        select.removeClass("select-clicked");
      }
      caret.removeClass("caret-rotate");
      menu.removeClass("menu-open");

      options.removeClass("activeDark active");
      if (dark === "true") {
        clickedOption.addClass("activeDark");
      } else {
        clickedOption.addClass("active");
      }
    });
  });

  const displayMessage = (message) => {
    let Message = $("<div>").text(message).addClass("success-message");
    options_container.append(Message);
    setTimeout(() => {
      Message.addClass("hidden");
      setTimeout(() => {
        Message.remove();
      }, 500);
    }, 1100);
  };

  // Saving the frequency
  $("#save").on("click", function () {
    options.each(function () {
      const option = $(this);
      if (option.hasClass("active") || option.hasClass("activeDark")) {
        chrome.storage.sync.get("frequency", function (freq) {
          if (freq.frequency === option.val()) {
            return;
          } else {
            console.log("test option.val() = "+ option.val())
            chrome.runtime.sendMessage({ type: "update", value: option.val() });
            chrome.storage.sync.set({ frequency: option.val() }, () => {
              console.log("frequency set " + option.val());
              displayMessage("Save Successful!");
              $(".unsaved").hide();
              $("#save").removeClass("unsaved_button");
            });
          }
        });
      }
    });
  });

  chrome.storage.sync.get("status", function (data) {
    const status = data.status || "enabled";
    console.log("status fetched " + status);
    if (status === "enabled") {
      startStop.removeClass("start").text("Disable");
    } else if (status === "disabled") {
      startStop.addClass("start").text("Enable");
    } else {
      console.error("Error fetching status data");
    }
  });

  // Start stop popups
  const startStop = $(".startStop");
  startStop.on("click", function () {
    console.log("test");
    startStop.toggleClass("start");
    if (startStop.text() === "Enable") {
      chrome.runtime.sendMessage({ type: "popup", value: "enabled" });
      chrome.storage.sync.set({ status: "enabled" }, () => {
        console.log("status enabled ");
        startStop.text("Disable");
        displayMessage("Popups Enabled Successfully!");
      });
    } else if (startStop.text() === "Disable") {
      chrome.runtime.sendMessage({ type: "popup", value: "disabled" });
      chrome.storage.sync.set({ status: "disabled" }, () => {
        console.log("status disabled ");
        startStop.text("Enable");
        displayMessage("Popups Disabled Successfully!");
      });
    }
  });
});
