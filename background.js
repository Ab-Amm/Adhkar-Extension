let frequency;
chrome.storage.sync.get("frequency", (data) => {
  console.log("storage get frequency: outside " + data.frequency);
  frequency = data.frequency || 10;
});

const sendToActiveTab = async (message) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        // Check if tabs array is not empty
        const activeTab = tabs[0]; // Get the current active tab
        console.log("test active tabs");
        if (activeTab.id) {
          // Check if activeTab.id is defined
          chrome.tabs.sendMessage(activeTab.id, { type: message });
        } else {
          reject("Active tab ID is undefined"); // Reject the promise if activeTab.id is undefined
        }
      } else {
        reject("No active tabs found"); // Reject the promise if tabs array is empty
      }
      resolve(); // Resolve the promise once message sending is done
    });
  });
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "trigger") {
    console.log("triggered");
    console.log("alarm trigger 1/2 " + frequency);
    await sendToActiveTab("display");
    console.log("alarm trigger 2/2 " + frequency);
  }
});

function createAlarm(frequency) {
  chrome.alarms.clear("trigger");
  console.log("create alarm function " + frequency);
  chrome.alarms.create("trigger", {
    periodInMinutes: frequency,
    delayInMinutes: frequency,
  });
}

chrome.runtime.onMessage.addListener((message, sender) => {
  // Check if the message is intended to update the value
  if (message.type === "update") {
    frequency = message.value || 10;
    console.log("message value " + message.value);
    console.log("updated frequency " + frequency);
    createAlarm(frequency);
  }
});

const start = () => {
  chrome.storage.sync.get("frequency", (data) => {
    console.log("storage get frequency; inside " + data.frequency);
    frequency = data.frequency || 10;
    createAlarm(frequency);
  });
};

const stop = () => {
  chrome.alarms.clearAll((wasCleared) => {
    if (wasCleared) {
      console.log("All alarms cleared successfully.");
    } else {
      console.error("Failed to clear alarms.");
    }
  });
  clearInterval(interval);
};

chrome.storage.sync.get("status", function (data) {
  const status = data.status || "enabled";
  console.log(status);
  if (status === "enabled") {
    start();
  } else if (status === "disabled") {
    stop();
  } else {
    console.error("Error fetching status data");
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "popup") {
    if (message.value === "enabled") {
      start();
    } else if (message.value === "disabled") {
      stop();
    } else {
      console.error("Error fetching status data");
    }
  }
});

// Execute code when the extension is installed or uninstalled
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.sync.set({ darkMode: "false" });
    chrome.storage.sync.set({ frequency: "10" });
    chrome.storage.sync.set({ status: "enabled" });
    console.log("defaultsettings applied");
  } else if (details.reason === "uninstall") {
    chrome.storage.sync.clear(() => {
      console.log("Values cleared from Chrome storage sync.");
    });
    stop();
  }
});
