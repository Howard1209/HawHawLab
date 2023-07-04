const url = import.meta.env.VITE_REACT_MODE==='production'?'https://hawhawlab.com/api':'http://localhost:8000/api';

const api = {
  hostname: url,
  async postData(data){
    const response = await fetch(`${this.hostname}/strategy`, {
      body: JSON.stringify({
        "startDate": data.startDate.value,
        "endDate": data.endDate.value,
        "stockId": data.stockId.value,
        "type": data.type.value,
        "ma": [5, 10, 20],
        "openCondition":{
          "method": data.openMethod.value === "" ? 
          Array.from(data.openMethod).map((obj) => obj.value):
          data.openMethod.value,
          "symbol": data.openSymbol.value === "" ? 
          Array.from(data.openSymbol).map((obj) => obj.value):
          data.openSymbol.value,
          "value": data.openValue.value === "" ?
          Array.from(data.openValue).map((obj) => obj.value):
          data.openValue.value,
        },
        "closeCondition":{
          "method": data.closeMethod.value === "" ?
          Array.from(data.closeMethod).map((obj) => obj.value):
          data.closeMethod.value,
          "symbol": data.closeSymbol.value === "" ?
          Array.from(data.closeSymbol).map((obj) => obj.value):
          data.closeSymbol.value,
          "value": data.closeValue.value === ""?
          Array.from(data.closeValue).map((obj) => obj.value):
          data.closeValue.value
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
  },
  async postScript(code){
    const response = await fetch((`${this.hostname}/script`), {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({code})
    });
    return await response.json();
  },
  async postSignUp(data){
    const response = await fetch((`${this.hostname}/user/signup`), {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  async postSignIn(data){
    const response = await fetch((`${this.hostname}/user/signin`), {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  async getProfile(jwtToken) {
    const response = await fetch(`${this.hostname}/user/profile`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
};

export default api;
