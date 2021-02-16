
const db = require("../models");


const setContentOrder = async (createdContent, userId, type) => {

    const userContent = await db.content.findAll({where: { userId: userId }})
    const newContent = await db.content.create({
        userId: userId,
        type: type,
        contentId: createdContent.id,
        index: userContent.length,
        show: true,
    })
    return newContent

}


module.exports = setContentOrder