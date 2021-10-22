const catchErrors = (error, callback) => {
  let errorMsg;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    console.error("Response error", error.response);
    errorMsg = error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error("Request error", error.request);
    errorMsg = "Request time out";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Other error", error);
    errorMsg = error.message || "Something went wrong";
  }

  if (typeof callback === "function") {
    callback(errorMsg);
  }
};

export default catchErrors;
