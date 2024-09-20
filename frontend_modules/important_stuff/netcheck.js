import { alertUser, stopAlert } from "../dom_utils";
import { saveFlashcards } from "../data/flashcard_data";
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
      "Looks like you (or the server) is offline. Changes will be saved locally. Some features may not work."
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

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms));
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
      await fetch("/assets/ping.gif", { cache: "no-store" });
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
