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

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
