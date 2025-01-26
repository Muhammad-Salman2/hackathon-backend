export default function sendResponse(res, status, data, error, msg) {
    res.status(status).json({
      error,
      msg,
      data: data,
    });
  }

// -----------------

// function sendResponse(res, status, data, message, error) {
//   return res.status(status).json({
//     data,
//     message,
//     error,
//   });
// }
