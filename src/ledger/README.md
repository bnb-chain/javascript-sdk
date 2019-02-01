# Ledger App

The general structure of Ledger commands and responses is as follows:

#### Payload

| Field   | Type     | Content                | Note |
|:------- |:-------- |:---------------------- | ---- |
| CLA     | byte (1) | Application Identifier | 0xBC |
| INS     | byte (1) | Instruction ID         |      |
| P1      | byte (1) | Parameter 1            |      |
| P2      | byte (1) | Parameter 2            |      |
| L       | byte (1) | Bytes in payload       |      |
| PAYLOAD | byte (L) | Payload                |      |

#### Response

| Field   | Type     | Content     | Note                     |
| ------- | -------- | ----------- | ------------------------ |
| ANSWER  | byte (?) | Answer      | depends on the command   |
| SW1-SW2 | byte (2) | Return code | see list of return codes |

#### Return codes

| Return code | Description             |
| ----------- | ----------------------- |
| 0x6400      | Execution Error         |
| 0x6982      | Empty buffer            |
| 0x6983      | Output buffer too small |
| 0x6986      | Command not allowed     |
| 0x6A80      | Incorrect tx data       |
| 0x6D00      | INS not supported       |
| 0x6E00      | CLA not supported       |
| 0x6F00      | Unknown                 |
| 0x9000      | Success                 |

---------

## Commands

### GET_VERSION

#### Payload

| Field | Type     | Content                | Expected |
| ----- | -------- | ---------------------- | -------- |
| CLA   | byte (1) | Application Identifier | 0xBC     |
| INS   | byte (1) | Instruction ID         | 0x00     |
| P1    | byte (1) | Parameter 1            | ignored  |
| P2    | byte (1) | Parameter 2            | ignored  |
| L     | byte (1) | Bytes in payload       | 0        |

#### Response

| Field   | Type     | Content       | Note                            |
| ------- | -------- | ------------- | ------------------------------- |
| CLA     | byte (1) | Test Mode     | 0xFF means test mode is enabled |
| MAJOR   | byte (1) | Version Major |                                 |
| MINOR   | byte (1) | Version Minor |                                 |
| PATCH   | byte (1) | Version Patch |                                 |
| SW1-SW2 | byte (2) | Return code   | see list of return codes        |

### PUBLIC_KEY_SECP256K1

#### Payload

| Field | Type     | Content                 | Expected |
| ----- | -------- | ----------------------  | -------- |
| CLA   | byte (1) | Application Identifier  | 0xBC     |
| INS   | byte (1) | Instruction ID          | 0x01     |
| P1    | byte (1) | Parameter 1             | ignored  |
| P2    | byte (1) | Parameter 2             | ignored  |
| L     | byte (1) | Bytes in payload        | (depends) |
| PL    | byte (1) | Derivation Path Length  | 3<=PL<=10 |
| Path[0] | byte (4) | Derivation Path Data    | 44 |
| Path[1] | byte (4) | Derivation Path Data    | 118 |
| ..  | byte (4) | Derivation Path Data    |  |
| Path[PL-1]  | byte (4) | Derivation Path Data    |  |

First three items in the derivation path will be hardened automatically hardened

#### Response

| Field   | Type      | Content       | Note                            |
| ------- | --------- | ------------- | ------------------------------- |
| PK      | byte (65) | Public Key    |  |
| SW1-SW2 | byte (2)  | Return code   | see list of return codes        |

### SIGN_SECP256K1

#### Payload

| Field | Type     | Content                | Expected |
| ----- | -------- | ---------------------- | -------- |
| CLA   | byte (1) | Application Identifier | 0xBC     |
| INS   | byte (1) | Instruction ID         | 0x02     |
| P1    | byte (1) | Packet Current Index   |   |
| P2    | byte (1) | Packet Total Count     | 
  |
| L     | byte (1) | Bytes in payload       | (depends)        |

The first packet/chunk includes only the derivation path

All other packets/chunks should contain message to sign 

*First Packet*

| Field | Type     | Content                | Expected |
| ----- | -------- | ---------------------- | -------- |
| PL    | byte (1) | Derivation Path Length  | 3<=PL<=10 |
| Path[0] | byte (4) | Derivation Path Data    | 44 |
| Path[1] | byte (4) | Derivation Path Data    | 118 |
| ..  | byte (4) | Derivation Path Data    |  |
| Path[PL-1]  | byte (4) | Derivation Path Data    |  |
| Message | bytes... | Message to Sign | |

*Other Chunks/Packets*

| Field | Type     | Content                | Expected |
| ----- | -------- | ---------------------- | -------- |
| Message | bytes... | Message to Sign | |

#### Response

| Field   | Type         | Content       | Note                            |
| ------- | ------------ | ------------- | ------------------------------- |
| SIG     | byte (~71)   | Signature     | DER encoded (length prefixed) |
| SW1-SW2 | byte (2)     | Return code   | see list of return codes        |

