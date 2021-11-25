
const axios = require('axios');
const { createAPIHeader, createAPIHeaderWithBearerToken } = require('../../common/service-helper')

const aaaUrl = `${process.env.BACKEND_URL}/internal/api/protected`

/*
function login(data) {

    const options = {
        method: 'POST',
        url: `${aaaUrl}/login`,
        headers: createAPIHeader(),
        data: JSON.stringify({username: data.username, password: data.password})
    };

    return axios(options)
}

function logout(token) {
    const options = {
        method: 'POST',
        url: `${aaaUrl}/logout`,
        headers: createAPIHeaderWithBearerToken(token),
    };

    return axios(options)

}

function ping(token) {
    const options = {
        method: 'GET',
        url: `${aaaUrl}/ping`,
        headers: createAPIHeaderWithBearerToken(token)
    };

    return axios(options)
}


*/

function logout(auth) {
    const options = {
        method: 'POST',
        url: `${aaaUrl}/logout`,
        headers: createAPIHeaderWithBearerToken(auth),
    };

    return axios(options)

}


async function getUser(auth) {

    const options = {
        method: 'GET',
        url: `${aaaUrl}/user`,
        headers: createAPIHeaderWithBearerToken(auth),
    };

    return await axios(options)
}


export {
    getUser,
    logout
}