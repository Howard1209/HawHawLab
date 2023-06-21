import api from "../utils/api";

// eslint-disable-next-line react/prop-types
export default function PostStrategy({ renderChart }){
  return<>
    <button className="bg-gray-300 mt-4 rounded px-1 py-1 transition-all" onClick={async ()=> {
      const result = await api.postData();
      renderChart(result);
    }}>
      Sent fake data
    </button>
  </>
}

// export default function PostStrategy(){
//   return<>
//     <button className="bg-gray-300 mt-4 rounded px-1 py-1 transition-all" onClick={()=>api.postData()}>
//       Sent fake data
//     </button>
//   </>
// }

