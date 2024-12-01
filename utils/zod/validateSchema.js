export const validateSchema = (schema, data, callbackError = "single") => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errormsg =
      callbackError === "single"
        ? result.error.issues[0].message
        : result.error.issues;
    return { error: errormsg };
  } else {
    return { error: null, data: result.data };
  }
};
