# Supported Transaction Types

Each transaction type has an encoded prefix, according to the
[amino](https://github.com/tendermint/go-amino/blob/master/README.md)
specification:

Some supported type prefixes are as follows:

| Type                       | Name                                  | Prefix     | Length   | Notes |
| -------------------------- | ------------------------------------- | ---------- | -------- | ----- |
| PubKeyEd25519              | tendermint/PubKeyEd25519              | 0x1624DE64 | 0x20     |       |
| PubKeySecp256k1            | tendermint/PubKeySecp256k1            | 0xEB5AE987 | 0x21     |       |
| PubKeyMultisigThreshold    | tendermint/PubKeyMultisigThreshold    | 0x22C1F7E2 | variable |       |
| PrivKeyEd25519             | tendermint/PrivKeyEd25519             | 0xA3288910 | 0x40     |       |
| PrivKeySecp256k1           | tendermint/PrivKeySecp256k1           | 0xE1B0F79B | 0x20     |       |
| StdTx                      | auth/StdTx                            | 0xF0625DEE | variable |       |
| CreateOrderMsg             | dex/NewOrder                          | 0xCE6DC043 | variable |       |
| CancelOrderMsg             | dex/CancelOrder                       | 0x166E681B | variable |       |
| TokenIssueMsg              | tokens/IssueMsg                       | 0x17EFAB80 | variable |       |
| TokenBurnMsg               | tokens/BurnMsg                        | 0x7ED2D2A0 | variable |       |
| TimeLockMsg                | tokens/TimeLockMsg                    | 0x07921531 | variable |       |
| TokenFreezeMsg             | tokens/FreezeMsg                      | 0xE774B32D | variable |       |
| TokenUnfreezeMsg           | tokens/UnfreezeMsg                    | 0x6515FF0D | variable |       |
| TimeUnlockMsg              | tokens/TimeUnlockMsg                  | 0xC4050C6C | variable |       |
| TimeRelockMsg              | tokens/TimeRelockMsg                  | 0x504711DA | variable |       |
| DexListMsg                 | dex/ListMsg                           | 0xB41DE13F | variable |       |
| MintMsg                    | tokens/MintMsg                        | 0x467E0829 | variable |       |
| SendMsg                    | cosmos-sdk/Send                       | 0x2A2C87FA | variable |       |
| SubmitProposalMsg          | cosmos-sdk/MsgSubmitProposal          | 0xB42D614E | variable |       |
| DepositMsg                 | cosmos-sdk/MsgDeposit                 | 0xA18A56E5 | variable |       |
| VoteMsg                    | cosmos-sdk/MsgVote                    | 0xA1CADD36 | variable |       |
| MsgCreateValidator         | cosmos-sdk/MsgCreateValidator         | 0xEB361D01 | variable |       |
| MsgRemoveValidator         | cosmos-sdk/MsgRemoveValidator         | 0xC1AFE85F | variable |       |
| MsgCreateValidatorProposal | cosmos-sdk/MsgCreateValidatorProposal | 0xDB6A19FD | variable |       |
