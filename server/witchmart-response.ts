export interface WitchMartSupport {
  tag: string;
  description: string;
  disclaimer: string;
}

export interface WitchMartResponse<T = unknown> {
  status: "success" | "error";
  data: T;
  message?: string;
  support?: WitchMartSupport;
}

const SUPPORT_INFO: WitchMartSupport = {
  tag: "$RavensEvermore",
  description: "Supports build costs, tools, hosting, and development. Never more than necessary.",
  disclaimer: "Voluntary contributions only. This is not financial advice."
};

const SAFETY_DISCLAIMER = "WitchMart does not provide legal, medical, or financial advice. All information is for community reference only.";

export function createSuccessResponse<T>(data: T, options?: { message?: string; includeSupport?: boolean }): WitchMartResponse<T> {
  const response: WitchMartResponse<T> = {
    status: "success",
    data
  };

  if (options?.message) {
    response.message = options.message;
  }

  if (options?.includeSupport) {
    response.support = SUPPORT_INFO;
  }

  return response;
}

export function createEmptyListResponse(entityType: string): WitchMartResponse<[]> {
  return {
    status: "success",
    data: [],
    message: `No ${entityType} found yet. This part of the network is still being built. If you'd like to help build this section, you can support the project below.`,
    support: SUPPORT_INFO
  };
}

export function createErrorResponse(message: string): WitchMartResponse<null> {
  return {
    status: "error",
    data: null,
    message
  };
}

export function getSupportInfo(): WitchMartSupport {
  return SUPPORT_INFO;
}

export function getSafetyDisclaimer(): string {
  return SAFETY_DISCLAIMER;
}

export function createListResponse<T>(data: T[], entityType: string, options?: { includeSupport?: boolean }): WitchMartResponse<T[]> {
  if (data.length === 0) {
    return createEmptyListResponse(entityType);
  }

  return createSuccessResponse(data, { includeSupport: options?.includeSupport });
}
