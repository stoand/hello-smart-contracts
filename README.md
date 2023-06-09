# Hello Smart Contracts

Built with Polkadot and Ink. Uses the [Aleph Testnet](http://test.azero.dev/#/accounts)

## Setup

* `rustup default stable`
* `cargo install cargo-contract`
* `cargo contract build --release`

* Install [Polkadot Browser Extension](https://polkadot.js.org/extension/)
* Create an Account in the Extension

* Open [Contracts UI](https://contracts-ui.substrate.io/contract)
* Copy `./target/ink/incrementer.contract` to `Add New Contract > Upload New Contract Code`
* `cp target/ink/hello_smart_contracts.json ui/src/contract-meta.json`
* Open `./ui/src/routes/contract.ts` and copy contract id to `const CONTRACT = "..";`

* `cd ui`
* `npm i`
* `npm start`
* Open [localhost:8000](http://localhost:8000)
