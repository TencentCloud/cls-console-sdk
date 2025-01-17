export const mfa = {
  verify: async () => true,
};

export const mfaModules = {
  'widget/mfa/mfa': mfa,
  mfa,
};
