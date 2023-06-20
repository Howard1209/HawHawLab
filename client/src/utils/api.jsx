const api = {
  hostname: 'http://localhost:8000',
  async postData(){
    const response = await fetch(`${this.hostname}/api/backtesting`, {
      body: JSON.stringify({
        "startDate": "2023-06-01",
        "endDate": "2023-06-14",
        "type": "long",
        "ma": [5, 10, 20],
        "openCondition":{
            "method": "ma",
            "symbol": "greater",
            "value": 5
        },
        "closeCondition":{
            "method": ["stopProfit", "stopLoss"],
            "symbol": ["greater", "less"],
            "value": [10, 3]
        }    
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });
    console.log(response.json());
    return await response.json();
  }
};

export default api;
