export function warn(...args) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  } catch (err) {
    // env
  }
}
