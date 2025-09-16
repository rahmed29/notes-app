import { alertUser, stopAlert } from "../alerts";
import { saveFlashcards } from "../data/flashcard_data";
import { delay } from "../data_utils";
import { saveStickyNotes } from "../sticky_note";

export { online, offline, netCheck, attachPoller, removePoller };

// we can check against this value to see if we should disable certain features
let network = {
  isOffline: false,
};

function offline() {
  if (!network.isOffline) {
    network.isOffline = true;
    alertUser(
      "network",
      "Your device (or the server) is offline. Changes will be saved locally. Some features may not work.",
    );
  }
}

function online() {
  if (network.isOffline) {
    network.isOffline = false;
    saveStickyNotes();
    saveFlashcards();
    stopAlert("network");
  }
}

let pollers = [];

function attachPoller(name, poller) {
  pollers.push({
    name,
    poller,
  });
}

function removePoller(name) {
  pollers = pollers.filter((poller) => poller.name !== name);
}

let count = 0;

async function netCheck() {
  // open this up to window so everything can see if we're offline
  window.network = network;
  while (true) {
    await delay(2000);
    try {
      await fetch("/assets/ping", { cache: "no-store" });
      count++;
      if (count > 5) {
        for (let poller of pollers) {
          poller.poller();
        }
        count = 0;
      }
      online();
    } catch (err) {
      offline();
    }
  }
}
