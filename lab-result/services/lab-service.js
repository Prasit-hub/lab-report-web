const axios = require('axios');
const { createAPIHeaderWithBearerToken } = require('../../common/service-helper')

const labUrl = `${process.env.BACKEND_URL}/internal/api/protected`

async function search(auth, req) {

    const options = {
        method: 'POST',
        url: `${labUrl}/visits/search?l=${req.limit}&o=${req.offset}`,
        headers: createAPIHeaderWithBearerToken(auth),
        data: JSON.stringify({
            keyword: req.keyword,
            from: req.from,
            to: req.to,
            status: req.status,
            result: req.result,
        })
    };

    return axios(options)
}

async function getLinkHistory(auth, req) {
    const options = {
        method: 'GET',
        url: `${labUrl}/visits/${req.id}/links`,
        headers: createAPIHeaderWithBearerToken(auth)
    };

    return axios(options)
}

async function getVisit(auth, req) {
    const options = {
        method: 'GET',
        url: `${labUrl}/visits/${req.id}`,
        headers: createAPIHeaderWithBearerToken(auth)
    };

    return axios(options)
}

async function updateVisitStatus(auth, req) {
    const options = {
        method: 'POST',
        url: `${labUrl}/visits`,
        headers: createAPIHeaderWithBearerToken(auth),
        data: JSON.stringify({
            id: req.id,
            status: req.status
        })
    };

    return axios(options)
}

async function sendLink(auth, req) {
    const options = {
        method: 'POST',
        url: `${labUrl}/notify`,
        headers: createAPIHeaderWithBearerToken(auth),
        data: JSON.stringify({
            id: req.id,
            userId: req.userId,
            email: req.email,
            mobilePhone: req.mobilePhone,
            ccEmail: req.ccEmail,
            dob: req.dob,
            result: req.result,
            raw: req.raw,
            labResults: req.labResults,
            sentOption: req.sentOption,
        })
    };

    return axios(options)
}

export {
    search,
    getLinkHistory,
    getVisit,
    updateVisitStatus,
    sendLink
}