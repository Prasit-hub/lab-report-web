
function createAPIHeader() {
    return { 
        'Content-Type': 'application/json',
        'X-Api-Key': `${process.env.API_KEY}`
    }
}

function createAPIHeaderWithBearerToken(auth, options) {
    return { 
        'Content-Type': (options && options.contentType) || 'application/json',
        'X-Api-Key': `${process.env.API_KEY}`,
        'Authorization': `Bearer ${auth.token}`
    }
}


export {
    createAPIHeader,
    createAPIHeaderWithBearerToken
}