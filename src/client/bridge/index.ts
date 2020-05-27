import { TransferInClaim, ClaimMsg, ClaimTypes } from "types"

import { checkAddress, decodeAddress } from "../../crypto"

/**
 * Transfer smart chain token to binance chain receiver
 * @param param -  TransferInParams
 */
export const buildTransferInClaim = ({
  sequence,
  contract_address,
  refund_addresses,
  receiver_addresses,
  amounts,
  relay_fee,
  expire_time,
  symbol,
  fromAddress,
}: TransferInClaim & { sequence: number; fromAddress: string }) => {
  if (sequence < 0) {
    throw new Error("sequence should not be less than 0")
  }

  if (!contract_address) {
    throw new Error("contract address should not be empty")
  }

  if (!relay_fee) {
    throw new Error("relay fee should not be empty")
  }

  if (!symbol) {
    throw new Error("symbol should not be null")
  }

  const hrp = fromAddress.startsWith("tbnb") ? "tbnb" : "bnb"

  if (!checkAddress(fromAddress, hrp)) {
    throw new Error("fromAddress is not a valid Binance Chain address")
  }

  if (
    refund_addresses.length != receiver_addresses.length ||
    refund_addresses.length != amounts.length
  ) {
    throw new Error(
      "the length of refund address array, recipient address array and transfer amount array must be the same"
    )
  }

  const receiverAddresses = receiver_addresses.map((address) => {
    const addressHrp = address.startsWith("tbnb") ? "tbnb" : "bnb"
    if (!checkAddress(address, addressHrp)) {
      throw new Error(
        `${address} in receiver_addresses is not a valid Binance Chain address`
      )
    }

    return decodeAddress(address)
  })

  const refundAddresses = refund_addresses.map((address) => {
    if (!address.startsWith("0x")) {
      throw new Error(`${address} is invalid`)
    }

    return Buffer.from(address.slice(2), "hex")
  })

  const claimBzStr = Buffer.from(
    JSON.stringify({
      contract_address,
      refund_addresses: refundAddresses,
      receiver_addresses: receiverAddresses,
      amounts,
      symbol,
      relay_fee,
      expire_time,
    })
  ).toString()

  const claimMsg = new ClaimMsg({
    claim_type: ClaimTypes.ClaimTypeTransferIn,
    sequence,
    claim: claimBzStr,
    validator_address: fromAddress,
  })
}
