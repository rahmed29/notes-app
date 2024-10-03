// get: [
//     "/api/get/list",
//     "/api/get/image-list",
//     "/api/get/notebooks/:name",
//     "/api/get/family/:book",
//     "/api/get/flashcards",
//     "/api/get/users",
//     "/api/get/published",
//     "/api/get/fdg",
//     "/api/get/fuzzy/:term",
//     "/api/export/:name",
//   ],
//   patch: [
//     "/api/nest/:child/:parent",
//     "/api/relinquish/:child/:parent",
//     "/api/rename/:name/:newName",
//     "/api/publish/:name",
//     "/api/unpublish/:name",
//   ],
//   put: ["/api/save/notebooks/:name"],
//   delete: ["/api/delete/notebooks/:name", "/api/delete/images/:name"],
//   post: ["/api/save/images", "/api/chatgpt", "/api/ollama", "/api/query"],

class get {
  async list() {
    return await fetch("/api/get/list", {
      cache: "no-store",
    });
  }
  async imageList() {
    return await fetch("/api/get/image-list", {
      cache: "no-store",
    });
  }
  async notebooks(name) {
    return await fetch(`/api/get/notebooks/${name}`, {
      cache: "no-store",
    });
  }
  async family(book) {
    return await fetch(`/api/get/family/${book}`, {
      cache: "no-store",
    });
  }
  async flashcards() {
    return await fetch("/api/get/flashcards", {
      cache: "no-store",
    });
  }
  async users() {
    return await fetch("/api/get/users", {
      cache: "no-store",
    });
  }
  async published() {
    return await fetch("/api/get/published", {
      cache: "no-store",
    });
  }
  async fdg() {
    return await fetch("/api/get/fdg", {
      cache: "no-store",
    });
  }
  async fuzzy(term) {
    return await fetch(`/api/get/fuzzy/${term}`, {
      cache: "no-store",
    });
  }
  async export(name) {
    return await fetch(`/api/export/${name}`, {
      cache: "no-store",
    });
  }
}

class patch {
  async nest(child, parent) {
    return await fetch(`/api/nest/${child}/${parent}`, {
      method: "PATCH",
    });
  }
  async relinquish(child, parent) {
    return await fetch(`/api/relinquish/${child}/${parent}`, {
      method: "PATCH",
    });
  }
  async rename(name, newName) {
    return await fetch(`/api/rename/${name}/${newName}`, {
      method: "PATCH",
    });
  }
  async publish(name) {
    return await fetch(`/api/publish/${name}`, {
      method: "PATCH",
    });
  }
  async unpublish(name) {
    return await fetch(`/api/unpublish/${name}`, {
      method: "PATCH",
    });
  }
}

class put {
  async saveNotebooks(name, data) {
    return await fetch(`/api/save/notebooks/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

class del {
  async notebooks(name) {
    return await fetch(`/api/delete/notebooks/${name}`, {
      method: "DELETE",
    });
  }
  async images(name) {
    return await fetch(`/api/delete/images/${name}`, {
      method: "DELETE",
    });
  }
}

class post {
  async saveImages(formData) {
    return await fetch("/api/save/images", {
      method: "POST",
      body: formData,
    });
  }
  async chatgpt(body) {
    return await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  async ollama(body) {
    return await fetch("/api/ollama", {
      method: "POST",
      hedaers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  async query() {
    return await fetch("/api/query", {
      method: "POST",
    });
  }
}

class API {
  constructor() {
    this.get = new get();
    this.patch = new patch();
    this.put = new put();
    this.del = new del();
    this.post = new post();
  }
}

let notes_api = new API();

export default notes_api;
