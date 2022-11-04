import axios from 'axios'
import rateLimit from 'axios-rate-limit'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL+'/api'

export const api = rateLimit(axios.create({
  baseURL
}), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 })


api.interceptors.request.use(async (request)=>{

  console.log('>>>>> request: ', request)
  return request

})

api.interceptors.response.use(async (response)=>{

  console.log('>>>>> response: ', response)
  return response

})

// Fetch chain w Fetch
export async function getChainWithFetch(){
  await fetch(`${baseURL}/chain/`,{method: 'GET'})
  .then(res => res.json())
  .then(res => {
    return res.data
  })
}

export async function postChainWithFetch(post:any){

  if(post.type === 'new-block'){

    await fetch(`${baseURL}/chain/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: post.type,
        rewardAddress: post.rewardAddress,
        data: post.block,
      })
    }).then(res => res.json())
    .then(res => {
      return res        
    })

  }else if(post.type === 'chain'){

    const chain = post.data

    await fetch(`${baseURL}/chain/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'chain',
        data: chain,
      })
    }).then(res => res.json())
    .then(res => {
      if(res[0].hash === chain[0].hash){
        if(res.length !== chain.length && res.length > chain.length){
          if(chain[chain.length -1].hash === res[chain.length -1].hash)
          return res
        }
      }
    })

  }
  
}

// Fetch chain w Axios
export async function getChainWithAxios(){
  try {
    await api.get('/chain').then((response: any) => {
      const { data } = response
      return data
    })
  } catch (err) {}
}

export async function postChainWithAxios(post:any){
  try {
    const newChain = await api.post('/chain', {
        type: post.type,
        rewardAddress: post.rewardAddress,
        data: post.block,
      }).then((response: any) => {
        const { data } = response
      return data
    })
    return newChain
  } catch (err) {}
}

// Fetch pengings w Fetch
export async function getPendingsWithFetch(){
  await fetch(`${baseURL}/pendings`)
  .then(res => res.json())
  .then(pendings => {
    return pendings
  })
  
}

export async function postPendingsWithFetch(post:any){
    
  await fetch(`${baseURL}/pendings/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([post])
  }).then(res => res.json())
  .then(res => {
    return res        
  })
}


export async function deletePendingsWithFetch(deletation: Array<any>){
  for (let i = 0; i < deletation.length; i++) {
    const minedDataHash = deletation[i];
    try {
      await fetch(`${baseURL}/pendings/${minedDataHash}`, {
        method: 'DELETE'
      }).then(res => res.json())
      .then(res => {
        return res        
      })
    } catch (err) {}
    
  }
}
// Fetch pengings w Axios
export async function getPendingsWithAxios(){
  try {
    await api.get('/pendings').then((response: any) => {
      const { data } = response
      return data
    })
  } catch (err) {}
}

export async function postPendingsWithAxios(body:any){
  try {
    await api.post('/pendings', body).then((response: any) => {
      const { data } = response
      return data
    })
  } catch (err) {}
}

export async function deletePendingsWithAxios(deletation: Array<any>){
  for (let i = 0; i < deletation.length; i++) {
    const minedDataHash = deletation[i];
    try {
      await api.delete(`/pendings/?hash=${minedDataHash}`).then((response: any) => {
        const { data } = response
        return data
      })
    } catch (err) {}
    
  }
}
