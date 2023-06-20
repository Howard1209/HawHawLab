import api from "../utils/api";

function Button(){
  return<>
    <button className="bg-gray-300 mt-4 rounded px-1 py-1 transition-all" onClick={()=>api.postData()}>
      Sent fake data
    </button>
  </>
}

export default Button;