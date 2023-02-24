import http from "k6/http";
import { sleep } from "k6";

export const options = {
      stages: [
        { duration: '1m', target: 300 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1800 },
        { duration: '1m', target: 2000 },
        { duration: '1m', target: 3000 },
      ],

      thresholds: {
        http_req_duration: [{threshold: 'p(95) < 1500', abortOnFail: true}],
        http_req_failed: [{threshold: 'rate < .01', abortOnFail: true}],

      }
};

export default function () {
  const BASE_URL = "http://localhost:3000"; // make sure this is not production
  const responses = http.batch([
    ["GET", `${BASE_URL}/questions?product_id=40343`],
    ["GET", `${BASE_URL}/questions?product_id=40366`],
    // ["GET", `${BASE_URL}/public/crocodiles/2/`],
    // ["GET", `${BASE_URL}/public/crocodiles/3/`],
    // ["GET", `${BASE_URL}/public/crocodiles/4/`],
  ]);
}

