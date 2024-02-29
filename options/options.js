document.addEventListener("DOMContentLoaded", () => {
  //dropdown menu elements

  const dropdown = document.querySelector(".dropdown");
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".li");
  const selected = dropdown.querySelector(".selected");

  //background elements
  const options_container = document.body;
  const alif = document.getElementById("alif");
  const topLeft = document.getElementById("top-left");
  const topRight = document.getElementById("top-right");
  const bottomLeft = document.getElementById("bottom-left");
  const BottomRight = document.getElementById("bottom-right");
  const left = document.getElementById("left");
  const right = document.getElementById("right");

  const elementDark = () => {
    topLeft.src =
      topRight.src =
      bottomLeft.src =
      BottomRight.src =
        "../images/cornerLight.png";
    left.src = right.src = "../images/edgeLight.png";
    alif.src = "../images/squareLight.png";
  };

  //dark theme logic

  const check = document.getElementById("check");

  const enableDarkMode = () => {
    chrome.storage.sync.set({ darkMode: "true" });
    check.checked = true;
    elementDark();
  };

  const disableDarkMode = () => {
    chrome.storage.sync.set({ darkMode: "false" });
    check.checked = false;
  };

  const toggleTheme = () => {
    options_container.classList.toggle("bodyDark");
    document.getElementById("save").classList.toggle("buttonDark");
    document.getElementById("back").classList.toggle("buttonDark");
    document.querySelectorAll(".line").forEach((line) => {
      line.classList.toggle("lineDark");
    });
    caret.classList.toggle("caretDark");
    select.classList.toggle("selectDark");
    menu.classList.toggle("menuDark");
  };

  chrome.storage.sync.get("darkMode", function (data) {
    const dark = data.darkMode;
    if (dark === "true") {
      enableDarkMode();
      toggleTheme();
    }
  });

  check.addEventListener("change", () => {
    if (check.checked) {
      enableDarkMode();
      toggleTheme();
    } else {
      disableDarkMode();
      toggleTheme();
    }
  });

  //retrieving the frequency stored for it's correct display
  chrome.storage.sync.get("frequency", (data) => {
    const frequency = data.frequency || 10; // default is 10 minutes
    console.log("frequency retrieved " + frequency);
    options.forEach((op) => {
      op.classList.remove("activeDark", "active");
    });
    options.forEach((option) => {
      if (option.value == frequency) {
        console.log("frequency option found " + frequency);
        chrome.storage.sync.get("darkMode", function (data) {
          const dark = data.darkMode;
          console.log("dark value " + dark);
          if (dark === "true") {
            console.log("test 3 " + frequency);
            option.classList.add("activeDark");
          } else {
            option.classList.add("active");
          }
        });
        selected.innerText = option.innerText;
      }
    });
  });

  //dropdown menu logic
  select.addEventListener("click", () => {
    chrome.storage.sync.get("darkMode", function (data) {
      const dark = data.darkMode;

      if (dark === "true") {
        select.classList.toggle("select-clicked-dark");
        select.classList.remove("select-clicked");
      } else {
        select.classList.toggle("select-clicked");
        select.classList.remove("select-clicked-dark");
      }
      caret.classList.toggle("caret-rotate");
      menu.classList.toggle("menu-open");
      options.forEach((opt) => {
        if (dark === "true") {
          opt.classList.add("liDark");
          opt.classList.remove("li");
        } else {
          opt.classList.add("li");
          opt.classList.remove("liDark");
        }
        if (
          opt.classList.contains("active") ||
          opt.classList.contains("activeDark")
        ) {
          if (dark === "true") {
            opt.classList.add("activeDark");
            opt.classList.remove("active");
          } else {
            opt.classList.remove("activeDark");
            opt.classList.add("active");
          }
        }
      });
    });
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      chrome.storage.sync.get("darkMode", function (data) {
        const dark = data.darkMode;

        selected.innerText = option.innerText;
        if (dark === "true") {
          select.classList.remove("select-clicked-dark");
        } else {
          select.classList.remove("select-clicked");
        }
        caret.classList.remove("caret-rotate");
        menu.classList.remove("menu-open");

        options.forEach((op) => {
          op.classList.remove("activeDark", "active");
        });
        if (dark === "true") {
          option.classList.add("activeDark");
        } else {
          option.classList.add("active");
        }
      });
    });
  });

  const displayMessage = (message) => {
    let Message = document.createElement("div");
    Message.textContent = message;
    Message.classList.add("success-message");
    options_container.appendChild(Message);
    setTimeout(() => {
      Message.classList.add("hidden");
      setTimeout(() => {
        Message.remove();
      }, 500);
    }, 1100);
  };


  //saving the frequency
  document.getElementById("save").addEventListener("click", () => {
    options.forEach((option) => {
      if (
        option.classList.contains("active") ||
        option.classList.contains("activeDark")
      ) {
        chrome.runtime.sendMessage({ type: "update", value: option.value });
        chrome.storage.sync.set({ frequency: option.value }, () => {
          console.log("frequency set " + option.value);
          displayMessage("Save Successful!");
        });
      }
    });
  });

  chrome.storage.sync.get("status", function (data) {
    const status = data.status || "enabled";
    console.log("status fetched " + status);
    if (status === "enabled") {
      startStop.classList.remove("start");
      startStop.innerText = "Disable";
    } else if (status === "disabled") {
      startStop.classList.add("start");
      startStop.innerText = "Enable";
    } else {
      console.error("Error fetching status data");
    }
  });

  // start stop popups
  const startStop = document.querySelector(".startStop");
  startStop.addEventListener("click", () => {
    console.log("test");
    startStop.classList.toggle("start");
    if (startStop.innerText === "Enable") {
      chrome.runtime.sendMessage({ type: "popup", value: "enabled" });
      chrome.storage.sync.set({ status: "enabled" }, () => {
        console.log("status enabled ");
        startStop.innerText = "Disable";
        displayMessage("Popups Enabled Successfully!");
      });
    } else if (startStop.innerText === "Disable") {
      chrome.runtime.sendMessage({ type: "popup", value: "disabled" });
      chrome.storage.sync.set({ status: "disabled" }, () => {
        console.log("status disabled ");
        startStop.innerText = "Enable";
        displayMessage("Popups Disabled Successfully!");
      });
    }
  });
});
