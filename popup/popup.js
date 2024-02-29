document.addEventListener("DOMContentLoaded", () => {
  //logic to make the settings icon come up when the mouse is mouse on the popup
  const popup_container = document.querySelectorAll(".popup_container");
  const settings = document.getElementById("settings");

  popup_container.forEach((container) => {
    container.addEventListener("mouseover", () => {
      settings.style.bottom = "2%";
    });

    container.addEventListener("mouseout", () => {
      settings.style.bottom = "-2rem";
    });
  });

  //background elements
  const alif = document.getElementById("alif");
  const topLeft = document.getElementById("top-left");
  const topRight = document.getElementById("top-right");
  const bottomLeft = document.getElementById("bottom-left");
  const BottomRight = document.getElementById("bottom-right");
  const left = document.getElementById("left");
  const right = document.getElementById("right");
  const text = document.querySelector(".text");

  //dark heme
  const toggleTheme = () => {
    popup_container.forEach((container) => {
      container.classList.toggle("bodyDark");
    });

    topLeft.src =
      topRight.src =
      bottomLeft.src =
      BottomRight.src =
        "../images/cornerLight.png";
    left.src = right.src = "../images/edgeLight.png";
    alif.src = "../images/squareLight.png";
    settings.src = "../images/settings-64-lightbrown.png";
    text.style.color = "rgb(216, 204, 183)";
  };

  chrome.storage.sync.get("darkMode", function (data) {
    const dark = data.darkMode;
    if (dark === "true") {
      toggleTheme();
    }
  });

  ///let dark = localStorage.getItem("darkMode");

  //adhkar display logic
  fetch(chrome.runtime.getURL("../popup/adhkar.json"))
    .then((result) => result.json())
    .then((adhkar) => {
      chrome.storage.local.get("index", (result) => {
        const currentIndex = result.index || 0; //giving it 0 in case of null (first time launching for example)
        const nextIndex = (currentIndex + 1) % adhkar.length;
        chrome.storage.local.set({ index: nextIndex });
        document.querySelector(".text").textContent = adhkar[currentIndex];
      });
    })
    .catch((error) => {
      console.error("Error loading:", error);
    });
});
