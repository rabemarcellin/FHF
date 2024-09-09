const express = require('express')
const cors = require('cors')
const { PassThrough } = require('stream')

const app = express()

app.use(cors()) 

const CHUNK_SIZE = 98 * 1024 * 1024

const getChunksLength = (chunks) => {
    return chunks.reduce((acc, curr) => acc+curr.length, 0)
}

app.post('/upload', (req, res) => {
    let videoBuffer = Buffer.alloc(0)
    const chunks = []
    const videosPart = []
    const signature = 'video-signature'  
    const chunkIndex = req.headers['chunk-index']


    req.on('data', (chunk) => {
        chunks.push(chunk)
        videoBuffer = Buffer.concat([videoBuffer, chunk])
        if(videoBuffer >= CHUNK_SIZE) {
            // means chunks streamed attempt chunk size
            // todo: save part in cloudinary
            console.log('diviser en partie')
            videoBuffer = videoBuffer.subarray(CHUNK_SIZE)
        }
        const totalUploaded = getChunksLength(chunks)
        res.write(`${totalUploaded}`)
    })

    req.on('end', () => {
        console.log('chunk')
        res.write(JSON.stringify({
            chunkIndex: chunkIndex,
            status: 201,
            signature: signature,
            message: 'Video upload complete',
            totalChunks: getChunksLength(chunks)
        }));
        res.end();
    })

    req.on('error', (error) => {
        console.error(error)
        console.log('taille stream a enresitrer', videoBuffer.length)
            res.write(JSON.stringify({
                chunkIndex: chunkIndex,
                status: 500,
                signature: signature,
                message: 'Error processing the upload',
                totalChunks: getChunksLength(chunks)
            }));
            res.end()
        
    })


})

app.listen(3000,() => {
    console.log('Server running on port 3000.')
})