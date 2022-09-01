import { handleRequest } from 'modules/service/TodoService'

export default async function handler(req, res) {
    const reqParams = {
        query: req.query,
        data: req.body,
        method: req.method
    }

    const { status, data } = await handleRequest(reqParams)
    res.status(status).json(data)
    res.end()
}
