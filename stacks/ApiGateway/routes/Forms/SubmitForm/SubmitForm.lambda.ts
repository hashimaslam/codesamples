import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  getFormFromDynamoDB,
  isEmailPresent,
  minBalanceRequirementChecks,
  updateFormSingleField,
  verifyWithGoogleAPI,
} from "../utils/Forms";
import { FORM_STATUS } from "../utils/Forms.types";
import {
  createAudience,
  isAddressPresentForATeam,
  validateAddress,
} from "../../Audiences/utils/Audiences";
import { Audience } from "../../Audiences/utils/Audiences.types";
import { v4 as uuid } from "uuid";
import { CHAIN_IDS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { Time } from "../../../../../shared/utils/DateTime";
import { getSourceById } from "../../Sources/utils/Sources";

interface Request
  extends Omit<APIGatewayProxyEvent, "pathParameters" | "body"> {
  pathParameters: {
    id: string;
  };

  body: {
    email: string;
    address: string;
    chain_id: number;
    recaptcha: string;
  };
}

const ivplementation = async (event: Request) => {
  const form_id = event.pathParameters.id;

  const formData = await getFormFromDynamoDB(form_id);

  const body = event.body;

  // Basic validations
  if (!body.address) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Wallet address not provided." })
    );
  }

  if (!formData) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid Form Id provided." })
    );
  }

  if (formData.requirements?.requiredFields) {
    if (formData.requirements.requiredFields.indexOf("email") === -1) {
      if (!body.email)
        return apiResponse(
          400,
          JSON.stringify({ error: "Email not provided." })
        );
    } else if (formData.requirements.requiredFields.indexOf("captcha") === -1) {
      if (!body.recaptcha) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Captcha not provided." })
        );
      }
    }
  }

  // Check the form status before submitting the form
  if (formData.status !== FORM_STATUS.PUBLISHED) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Form is not published." })
    );
  }

  // Check if we have achieved the max member size
  if (
    formData.max_member_size! > 0 &&
    formData.totalSubmissions! >= formData.max_member_size!
  ) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Max member size reached!" })
    );
  }

  // Following checks to be done before submitting the form
  // 1. Check for duplicate email
  // 2. Check for duplicate address
  // 3. Check for minimum balances
  // 4. Recaptcha validation

  // Firstly, lets check for the duplicate email
  if (formData.requirements?.requiredFields) {
    if (formData.requirements.requiredFields.indexOf("email") >= 0)
      if (await isEmailPresent(body.email, formData.id_team!)) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Email already taken." })
        );
      }
  }

  // Secondly, lets check for duplicate address
  // before that, lets validate address first
  const [flag] = await validateAddress(
    body.address,
    formData.id_team!,
    body.chain_id
  );

  if (!flag) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid address provided." })
    );
  }

  const audienceList = await isAddressPresentForATeam(
    body.address,
    formData.id_team!
  );

  if (audienceList.length > 0) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Audience member already exists." })
    );
  }

  // Now, lets check the min balance requirements
  const checks = await minBalanceRequirementChecks(
    formData.requirements?.minRequiredBalances!,
    body.address,
    formData.id_team!
  );

  if (!checks.success) {
    checks.errors.push(
      "Sorry, you couldn't meet one of the form requirements."
    );
    return apiResponse(
      400,
      JSON.stringify({
        checks,
      })
    );
  }

  // Final check is the recaptcha.
  if (formData.requirements?.requiredFields) {
    if (formData.requirements.requiredFields.indexOf("captcha") >= 0) {
      const recaptchaCheck = await verifyWithGoogleAPI(body.recaptcha);

      if (!recaptchaCheck.success) {
        return apiResponse(
          400,
          JSON.stringify({ error: recaptchaCheck.error })
        );
      }
    }
  }

  // If everything is successful, lets populate the user address to the audience table
  const aData = CHAIN_IDS.map((chainId: number) => {
    return {
      chainId: chainId,
      ethBalance: 0,
      usdBalance: 0,
      nfts: 0,
      allTimeTransactions: 0,
    };
  });
  const audience: Audience = {
    id: uuid(),
    team_id: formData.id_team,
    address: body.address,
    email: body.email,
    tags: ["form-add"],
    type: "wallet",
    source_ids: [formData.source_id!],
    sources: [(await getSourceById(formData.source_id!))?.source_name!],
    data: aData,
    nfts: 0,
    usdBalance: 0,
    allTimeTransactions: 0,
    firstTransactionDate: 0,
    lastTransactionDate: 0,
    createdAt: Time.now(),
  };

  await createAudience(audience);

  // Now lets update the form stats i.e. totalSubmission, firstSubmission, lastSubmission

  if (formData.totalSubmissions === 0) {
    await updateFormSingleField(formData.id!, "firstSubmission", Time.now());
  }

  await updateFormSingleField(
    formData.id!,
    "totalSubmissions",
    formData.totalSubmissions! + 1
  );

  await updateFormSingleField(formData.id!, "lastSubmission", Time.now());

  return apiResponse(
    200,
    JSON.stringify({ message: "successful", audience_id: audience.id })
  );
};

export const handler = middlewares(ivplementation);
