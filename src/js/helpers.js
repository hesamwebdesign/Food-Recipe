import { TIMEOUT_SEC } from "./config.js";

const timeout = function (x) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `Low Network 😟 Request took too long! (Timeout after ${x} seconds)`
        )
      );
    }, x * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Check if we have New Recipe or Not:
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Fetch Data:
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
