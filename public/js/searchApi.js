// searchApi.js
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

class SearchAPI {
  constructor() {
    this.baseUrl = process.env.BASE_URL;
    this.apiKey = process.env.API_KEY;
    this.secretKey = process.env.SECRET_KEY;
    this.customerId = process.env.CUSTOMER_ID;
  }

  generateSignature(timestamp, method, path) {
    const sign = `${timestamp}.${method}.${path}`;
    const signature = crypto
      .createHmac("sha256", this.secretKey)
      .update(sign)
      .digest("base64");
    return signature;
  }

  getHeaders(method, path) {
    const timestamp = Date.now();
    return {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Timestamp": timestamp,
      "X-API-KEY": this.apiKey,
      "X-Customer": this.customerId,
      "X-Signature": this.generateSignature(timestamp, method, path),
    };
  }

  async getKeywordStats(keyword) {
    const path = "/keywordstool";
    try {
      const response = await axios({
        method: "GET",
        url: `${this.baseUrl}${path}`,
        headers: this.getHeaders("GET", path),
        params: {
          hintKeywords: keyword,
          showDetail: "1",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`API 요청 실패: ${error.message}`);
    }
  }
}

module.exports = SearchAPI;
