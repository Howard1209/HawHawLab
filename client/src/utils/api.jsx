const api = {
  hostname: 'http://localhost:8000/api',
  async postData(){
    const response = await fetch(`${this.hostname}/strategy`, {
      body: JSON.stringify({
        "startDate": "2023-06-01",
        "endDate": "2023-06-14",
        "type": "long",
        "ma": [5, 10, 20],
        "openCondition":{
          "method": ["ma","investmentTrust"],
          "symbol": ["greater","greater"],
          "value": [5, 100]
        },
        "closeCondition":{
            "method": "ma",
            "symbol": "less",
            "value": 5
        }    
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });
    return await response.json();
  },
  async getTaiexData(){
    const response = await fetch(`${this.hostname}/taiex`);
    return await response.json();
  }
};

export default api;
