const environment = process.env.NEXT_PUBLIC_ENV
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
const certificate = process.env.NEXT_PUBLIC_CERT

export const options = {
	// PRODUÇÃO = false
	// HOMOLOGAÇÃO = true
    sandbox: environment==='dev',
    client_id: client_id?client_id:'',
    client_secret: client_secret?client_secret:'',
    certificate,
}

