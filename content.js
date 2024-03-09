let alif,
  topLeft,
  topRight,
  bottomLeft,
  BottomRight,
  left,
  right,
  text,
  popup_container;

// Create a div element to hold the HTML content
div = document.createElement("div");
div.id = "extension-container";

// A span to hide the div on click
const hide = document.createElement("span");
hide.id = "hide";
hide.textContent = "X";

const fetchAdhkar = () => {
  fetch(chrome.runtime.getURL("popup/adhkar.json"))
    .then((result) => result.json())
    .then((adhkar) => {
      chrome.storage.local.get("index", (result) => {
        const currentIndex = result.index || 0; //giving it 0 in case of null (first time launching for example)
        const nextIndex = (currentIndex + 1) % adhkar.length;
        chrome.storage.local.set({ index: nextIndex });
        div.querySelector(".adhText").textContent = adhkar[currentIndex];
      });
    })
    .catch((error) => {
      console.error("Error loading:", error);
    });
};

//dark heme
const toggleDark = () => {
  alif = document.getElementById("alif");
  topLeft = document.getElementById("top-left");
  topRight = document.getElementById("top-right");
  bottomLeft = document.getElementById("bottom-left");
  BottomRight = document.getElementById("bottom-right");
  left = document.getElementById("left");
  right = document.getElementById("right");
  text = document.querySelector(".adhText");
  popup_container = document.querySelector(".popup_container");
  popup_container.classList.add("bodyDark");
  hide.classList.add("hideDark");
  topLeft.src =
    topRight.src =
    bottomLeft.src =
    BottomRight.src =
      chrome.runtime.getURL("images/cornerLight.png");
  left.src = right.src = chrome.runtime.getURL("images/edgeLight.png");
  alif.src = chrome.runtime.getURL("images/squareLight.png");
  text.style.color = "rgb(216, 204, 183)";
};

const toggleLight = () => {
  alif = document.getElementById("alif");
  topLeft = document.getElementById("top-left");
  topRight = document.getElementById("top-right");
  bottomLeft = document.getElementById("bottom-left");
  BottomRight = document.getElementById("bottom-right");
  left = document.getElementById("left");
  right = document.getElementById("right");
  text = document.querySelector(".adhText");
  popup_container = document.querySelector(".popup_container");
  popup_container.classList.remove("bodyDark");
  hide.classList.remove("hideDark");
  topLeft.src =
    topRight.src =
    bottomLeft.src =
    BottomRight.src =
      chrome.runtime.getURL("images/corner.png");
  left.src = right.src = chrome.runtime.getURL("images/edge.png");
  alif.src = chrome.runtime.getURL("images/square.png");
  text.style.color = "rgb(87, 72, 25)";
};

const toggleTheme = () => {
  chrome.storage.sync.get("darkMode", function (data) {
    const dark = data.darkMode;
    console.log(dark);
    if (dark === "true") {
      toggleDark();
    } else if (dark === "false") {
      toggleLight();
    } else {
      console.error("dark value undefined");
    }
  });
};

// Fetch popup.html content
fetch(chrome.runtime.getURL("popup/popup.html"))
  .then((response) => response.text())
  .then((html) => {
    div.innerHTML = html;
    div.appendChild(hide);
    // Referencing the CSS file
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("popup/popup.css");
    document.head.appendChild(link);
    toggleTheme();
    fetchAdhkar();
    div.style.transform = "translateX(110%)";
    document.body.appendChild(div);
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
  });

div.addEventListener("mouseover", () => {
  hide.style.display = "block";
});

div.addEventListener("mouseout", () => {
  hide.style.display = "none";
});

// Handling the span's behavior
hide.addEventListener("click", () => {
  // Toggle the visibility of the div
  div.style.display = "none";
  setTimeout(() => {
    div.style.display = "block";
  }, 7000);
});

function display() {
  // fetch new data to display
  fetchAdhkar();
  toggleTheme();
  div.style.transform = "translateX(0)";
  setTimeout(() => {
    div.style.transform = "translateX(110%)";
    console.log("currently displaying");
  }, 6000);
}

//chrome message
chrome.runtime.onMessage.addListener((message) => {
  console.log("test1");
  // Check if the message is intended to update the value
  if (message.type === "display") {
    console.log("test2");
    display();
  }
});
