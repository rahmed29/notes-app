function mimicError(err = new Error("Network Error")) {
  return {
    ok: false,
    status: -1,
    statusText: err.message || "Network Error",
    json: async () => ({ error: err.message }),
    text: async () => err.message,
    blob: async () => new Blob([err.message], { type: "text/plain" }),
  };
}

class get {
  async snippets() {
    try {
      return await fetch("/api/get/snippets", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError();
    }
  }
  async tagged(tag) {
    try {
      return await fetch(`/api/get/tagged/${tag}`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async tags() {
    try {
      return await fetch(`/api/get/tags/`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async list() {
    try {
      return await fetch("/api/get/list", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async imageList() {
    try {
      return await fetch("/api/get/image-list", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async notebooks(name) {
    try {
      return await fetch(`/api/get/notebooks/${name}`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async family(book) {
    try {
      return await fetch(`/api/get/family/${book}`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async flashcards() {
    try {
      return await fetch("/api/get/flashcards", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async users() {
    try {
      return await fetch("/api/get/users", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async published() {
    try {
      return await fetch("/api/get/published", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async fdg() {
    try {
      return await fetch("/api/get/fdg", {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async fuzzy(term) {
    try {
      return await fetch(`/api/get/fuzzy/${term}`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async export(name) {
    try {
      return await fetch(`/api/export/${name}`, {
        cache: "no-store",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
}

class patch {
  async nest(child, parent) {
    try {
      return await fetch(`/api/nest/${child}/${parent}`, {
        method: "PATCH",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async relinquish(child, parent) {
    try {
      return await fetch(`/api/relinquish/${child}/${parent}`, {
        method: "PATCH",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async rename(name, newName) {
    try {
      return await fetch(`/api/rename/${name}/${newName}`, {
        method: "PATCH",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async publish(name) {
    try {
      return await fetch(`/api/publish/${name}`, {
        method: "PATCH",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async unpublish(name) {
    try {
      return await fetch(`/api/unpublish/${name}`, {
        method: "PATCH",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
}

class put {
  async saveNotebooks(name, data) {
    try {
      return await fetch(`/api/save/notebooks/${name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      return mimicError(err);
    }
  }
}

class del {
  async notebooks(name) {
    try {
      return await fetch(`/api/delete/notebooks/${name}`, {
        method: "DELETE",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async images(name) {
    try {
      return await fetch(`/api/delete/images/${name}`, {
        method: "DELETE",
      });
    } catch (err) {
      return mimicError(err);
    }
  }
}

class post {
  async saveImages(formData) {
    try {
      return await fetch("/api/save/images", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async chatgpt(body) {
    try {
      return await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async ollama(body) {
    try {
      return await fetch("/api/ollama", {
        method: "POST",
        hedaers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      return mimicError(err);
    }
  }
  async query() {
    try {
      return await fetch("/api/query", {
        method: "POST",
      });
    } catch (err) {
      return mimicError(err);
    }
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
