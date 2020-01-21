import axios from 'axios'  
  
const SERVER_URL = 'http://localhost:8005';  
  
const instance = axios.create({  
  baseURL: SERVER_URL,  
  timeout: 1000  
});  
  
export default {  
  getByAddress: (address) => instance.get('/scraping/address='+ address, {  
    transformResponse: [function (data) {  
      return data ? JSON.parse(data)._embedded.dataserver : data;  
    }]  
  }),
  
  getAll: () => instance.get('/scraping/', {  
    transformResponse: [function (data) {
      return data ? JSON.parse(data)._embedded.todos : data;  
    }]  
  })
}