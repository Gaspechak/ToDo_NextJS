import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const insert = async (todo) => {
    return await db.todo.create({ data: todo })
}

const update = async (todo) => {
    return await db.todo.update({
        where: { id: todo.id },
        data: todo
    })
}

const remove = async (todoId) => {
    return await db.todo.delete({ where: { id: todoId } })
}

const listAll = async () => {
    return await db.todo.findMany()
}

export { insert, update, remove, listAll }