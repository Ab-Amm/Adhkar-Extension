
$(document).ready(function () {
  //logic to make the settings icon come up when the mouse is mouse on the popup
  const popup_container = $(".popup_container");
  const settings = $("#settings");

  popup_container.on("mouseover", () => {
    settings.css("bottom", "2%");
  });
  popup_container.on("mouseout", () => {
    settings.css("bottom", "-2rem");
  });

  //background elements
  const alif = $("#alif");
  const topLeft = $("#top-left");
  const topRight = $("#top-right");
  const bottomLeft = $("#bottom-left");
  const BottomRight = $("#bottom-right");
  const left = $("#left");
  const right = $("#right");
  const text = $(".adhText");

  //dark heme
  const toggleTheme = () => {
    popup_container.toggleClass("bodyDark");

    alif.attr("src", "../images/squareLight.png");
    topLeft.attr("src", "../images/cornerLight.png");
    topRight.attr("src", "../images/cornerLight.png");
    bottomLeft.attr("src", "../images/cornerLight.png");
    BottomRight.attr("src", "../images/cornerLight.png");
    left.attr("src", "../images/edgeLight.png");
    right.attr("src", "../images/edgeLight.png");
    settings.attr("src", "../images/settings-64-lightbrown.png");
    text.css("color", "rgb(216, 204, 183)");
  };

  chrome.storage.sync.get("darkMode", function (data) {
    const dark = data.darkMode;
    if (dark === "true") {
      toggleTheme();
    }
  });

  //adhkar display logic
  $.ajax({
    url: chrome.runtime.getURL("../popup/adhkar.json"),
    dataType: "json",
    success: function (adhkar) {
      chrome.storage.local.get("index", function (result) {
        const currentIndex = result.index || 0;
        const nextIndex = (currentIndex + 1) % adhkar.length;
        chrome.storage.local.set({ index: nextIndex });
        $(".adhText").text(adhkar[currentIndex]);
      });
    },
    error: function (error) {
      console.error("Error loading:", error);
    },
  });
});
