import { CSVRow } from "../../../../../shared/utils/csv/CSV";
import { isAddress } from "ethers/lib/utils";
import { getERC20, ERC20Token } from "../../../../../shared/utils/Web3";
import { ethers } from "ethers";
import { Chain, defaultChains } from "@thirdweb-dev/chains";

export async function getValidationErrorsForRow(
  row: CSVRow,
  chain_id: number,
  teamId: string
) {
  const errors: string[] = [];
  const requiredAttributes = [
    "address",
    //"email",
    "maxClaimable",
    "price",
  ];
  for (let requiredAttribute of requiredAttributes) {
    if (!row[requiredAttribute]) {
      errors.push(`Missing a required attribute: ${requiredAttribute}`);
    }
  }
  if (
    !isAddress(row["address"]) ||
    row["address"] === ethers.constants.AddressZero
  ) {
    errors.push(
      `Address is not a valid Ethereum address, received ${row["address"]}`
    );
  }
  if (isNaN(Number(row["maxClaimable"])) || Number(row["maxClaimable"]) < 1) {
    errors.push(
      `Max claimable should be a number greater than 0, received ${row["maxClaimable"]}`
    );
  }
  if (isNaN(Number(row["price"])) || Number(row["price"]) < 0) {
    errors.push(
      `Price should be a number greater than 0, received ${row["price"]}`
    );
  }
  if (
    row["currencyAddress"].trim() === "" ||
    row["currencyAddress"].trim() === ethers.constants.AddressZero
  ) {
    const chain = defaultChains.find((c: Chain) => c.chainId === chain_id);
    if (!chain) {
      errors.push(`This chain_id ${chain_id} is not available in the app`);
      return { errors, undefined };
    }
    const nativeToken: ERC20Token = {
      address: ethers.constants.AddressZero,
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
    };
    return { errors, nativeToken };
  } else {
    if (!isAddress(row["currencyAddress"])) {
      errors.push(
        `Currency address is not a valid Ethereum address, received ${row["currencyAddress"]}`
      );
      return { errors, undefined };
    }

    const [erc20, error] = await getERC20(
      row["currencyAddress"],
      chain_id,
      teamId
    );
    if (error) {
      errors.push(
        `${error}, received currencyAddress: ${row["currencyAddress"]}`
      );
    }
    return { errors, erc20 };
  }
}

export async function getAggregateErrors(
  rows: CSVRow[],
  chain_id: number,
  teamId: string
) {
  const aggregateErrors: string[] = [];
  const erc20s: ERC20Token[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const rowResult = await getValidationErrorsForRow(row, chain_id, teamId);
    if (rowResult.errors) {
      rowResult.errors.forEach((rowError) => {
        aggregateErrors.push(`Row ${index + 1}: ${rowError}`);
      });
    }
    if (rowResult.erc20) {
      erc20s.push(rowResult.erc20);
    }
  }
  return { aggregateErrors, erc20s };
}
