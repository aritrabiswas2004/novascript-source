# Running Development on Unix Machines

> [!NOTE]
> This documentation is still subject to more information. Please contribute to improve the
> bash script and execution.

## Running 

You need a Unix-based OS like macOS, Linux or WSL and the right permissions to run the below
command.

The file [`run.sh`](./run.sh) checks if there is a valid version of `node` nad `npm` on your system then
executes the equivalent of `npm run dev -- args`.

```shell
./run.sh filename.nv
```

## The Script

Running the unix build script is mostly for developers
looking to develop the project in their own unix machine.
The script has not undergone rigorous testing and is
not fully optimised for running the project in a development
configuration.

For a true development configuration see the [Development
Guide](../configdocs/SETUP.md). 

### Arguments

- `-h` / `--help`
  - Prints a help message

- `-o` / `--skip-node`
  - Skips testing for a valid nodejs version.

- `-p` / `--skip-npm`
  - Skips checking `npm` on local system
