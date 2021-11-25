const axios = require('axios');
const { createAPIHeaderWithBearerToken } = require('../../common/service-helper')

const labUrl = `${process.env.BACKEND_URL}/internal/api/protected`

async function upload(auth, req) {

    var fd = new FormData();
    
    if (req.file) {
        fd.append('files', req.file.file, req.file.name)
    }

    if (req.files && Array.isArray(req.files)) {
        for (var i = 0; i < req.files.length; i++)
        {
            fd.append('files', req.files[i].file, req.files[i].name)
        }
    }

    const options = {
        method: 'POST',
        url: `${labUrl}/visits/${req.id}/upload`,
        headers: createAPIHeaderWithBearerToken(auth, {
            contentType: 'multipart/form-data'
        }),
        data: fd
    };

    return axios(options)
}

async function getFiles(auth, req) {
    const options = {
        method: 'GET',
        url: `${labUrl}/visits/${req.id}/files`,
        headers: createAPIHeaderWithBearerToken(auth)
    };

    return axios(options)
}

async function downloadFile(auth, req)
{
    const options = {
        method: 'GET',
        url: `${labUrl}/files/${req.id}`,
        headers: createAPIHeaderWithBearerToken(auth),
        responseType: 'blob'
    };

    return axios(options)
}

async function deleteFile(auth, req)
{
    const options = {
        method: 'DELETE',
        url: `${labUrl}/files/${req.id}`,
        headers: createAPIHeaderWithBearerToken(auth),
    };

    return axios(options)
}



export {
    upload,
    getFiles,
    downloadFile,
    deleteFile
}