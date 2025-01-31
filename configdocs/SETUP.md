# Development Setup

This development file contains steps to build NovaScript in a development configuration.
If you want a quick check + development see [bash run script](../unix/run.sh) for Linux or macOS
or see the [PowerShell run script](../windows/run.ps1)

To set up the Novascript development environment:

1. Clone the repository.
   ```bash
   git clone https://github.com/Repositoir/novascript-source
   ```
2. Install dependencies
    ```bash
   npm install
    ```
3. For running and debugging using the `repl()`, just run the development

   ```shell
   npm run rev
   ```
   
   For running in Script mode, add the NovaScript file as program arguments.

   ```shell
   npm run dev -- filename.nv
   ```
4. Run your tests.

## Encountering Errors

### Node.js Runtime Errors

- If you encounter an error thrown from the Nodejs environment which exists in the source
files,you don't have to worry about anything! Statements like these keep the programmer
syntax in check.
  - However, if you notice an error message that could be modified for better understanding
then please raise an issue and also a relevant pull requests which will later be merged
if possible.

- If your error doesn't exist in the source files and is a runtime error for the source
code, then raise an issue immediately

### NovaScript Errors

Error types are not yet a part of NovaScript (but please make it happen!) if you encounter
an error where the exit pattern is

[See issue #6](https://github.com/Repositoir/novascript-source/issues/6)

```javascript
console.error("Err msg");
process.exit(1);
```

Please change it to throw an error if it makes sense ti catch the thrown error in a 
NovaScript file

```javascript
throw new Error("Err msg");
```

## Security

If you encounter a security flaw please send an email directly to the email address at
the top of the source file and NOT on a public space.

> [!NOTE]
> This portion will be expanded when a `SECURITY.md` is added.