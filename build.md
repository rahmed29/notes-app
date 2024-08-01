# Building

1. Run `npm i`
2. Acquire `src-min` dir from [Ace Editor](https://github.com/ajaxorg/ace-builds) and move it into `./public/assets`. Rename it to `ace-editor`
3. Create environment variables, you can see what you need in server.js
4. Run `build.py`. You can pass in a commit message like so if you want to push to GitHub

    ```
    python3 build.py "Commit message"
    ```