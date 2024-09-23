# Building

1. Install `mongodb` and `npm`
2. Run `npm i`
3. Acquire `src-min` dir from [Ace Editor](https://github.com/ajaxorg/ace-builds) and move it into `./public/assets`. Rename it to `ace-editor`
4. Create environment variables, you can see what you need in server.js
5. Run `build.py`. You can pass in a commit message like so if you want to push to GitHub
6. At the moment, there is no authentication. This app supports multi-user features when paired with CloudFlare Acess.

    ```
    python3 build.py "Commit message"
    ```