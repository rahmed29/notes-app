import notes_api from "../important_stuff/api";
import { asyncPalette, beginAsyncPal } from "./cmd";

export { showUserList };

async function showUserList() {
  beginAsyncPal();
  const users = await notes_api.get.users();
  const json = await users.json();
  const dat = json.data.map((e) => ({
    name: e.settings.nickname ? `${e.settings.nickname} (${e.email})` : e.email,
    icon: e.settings.pfp
      ? `<img src="${e.settings.pfp}" style="width: 2em; height: 2em; border-radius: 50%;">`
      : "?",
    handler: () => {
      console.log("Nothing here yet");
    },
  }));

  asyncPalette(
    "Search users...",
    (results, text, render, filter) => {
      render(2, filter(dat, text), results);
    },
    (results, render) => {
      render(2, dat, results);
    }
  );
}
