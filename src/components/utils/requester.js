import axios from "axios"

  export default {
    post: (url, params) => {
      const get = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        const img = new FormData();
        Object.keys(params).map((v) =>{
          img.append(v, params[v]); 
        })
        axios.post(`https://api.chat.besoft.kg/v1${url}`,
          img, 
          {
            headers: get ? {
              Authorization: 'Bearer ' + get
            } : {}
          }
        )
          .then((response) => {
            resolve(response)
          }).catch((e) => {
            console.log(e)
            alert(e.message)
            reject(e)
          })
      })
    },

  get: (url, params) => {
    const get = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      axios.get(`https://api.chat.besoft.kg/v1${url}`, {
        params,
        headers: {
          Authorization: 'Bearer ' + get
        } ,
      }).then((response) => {
        resolve(response)
      }).catch((e) => {
        console.log(e);
        alert(e.message);
        reject(e)
      })
    })
  }

}
