require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const mongoose = require('mongoose')
const db = (process.env.BD_TOKEN)
const Pli = require('./models/post')
const regNewMember = /^new_chat_members/

mongoose
.set("strictQuery", false)
.connect(db, {useNewUrlParser: true})
.then((res)=> console.log(`connect to DB`))
.catch((error) => console.log(error))

bot.start(async (ctx) => {
    try{
    }
    catch(e){
        console.log('🛑 start error')
        console.log(e)
    }
})

bot.on('message', async (ctx) => {
    try{
        ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
        if (typeof ctx.message['new_chat_members'] !== "undefined"){
            const dellMes = await Pli.findOne({id: 'infoBazaPlitka'}, {welcomMessageId: 1, _id: 0})
            if (dellMes.welcomMessageId !== null){
                bot.telegram.deleteMessage(ctx.chat.id, dellMes.welcomMessageId)
            }
            await Pli.updateOne({id: 'infoBazaPlitka'}, {$inc: {countUsers: 1}}, {upsert: true})
            await Pli.updateOne({id: ctx.from.id}, {username: ctx.from.username, firstName: ctx.from.first_name, status: false}, {upsert: true})
            const mes = await bot.telegram.sendMessage(ctx.chat.id, `Приветствую тебя ${ctx.from.first_name ? ctx.from.first_name : 'Человек без имени'}!\n Меня зовут Дмитрий, я занимаюсь укладкой тротуарной плитки и обучением этому ремеслу.\n Данная услуга сегодня очень востребована, а мастеров не хватает, в чем я убедился на своем опыте и по отзывам коллег.\n Если вам интересен заработок от 1000$ в месяц или вы хотите благоустроить двор своими руками, сэкономив деньги на работниках, буду рад обучить вас этому делу\nПожалуйста, выбери один из 3 вариантов!`, {parse_mode: 'HTML',...Markup.inlineKeyboard(
            [
                [Markup.button.callback(`Хочу стать мастером`, `b2`)],
                [Markup.button.callback(`Хочу уложить плитку себе!`, `b1`)],
                [Markup.button.callback(`Хочу и то и то!`, `b3`)]
            ]
            )})
            await Pli.updateOne({id: 'infoBazaPlitka'}, {welcomMessageId: mes.message_id})
        }
    }
    catch(e){
        console.log('🛑 new_chat_members error')
        console.log(e)
    }
})

bot.action('b1', async (ctx) => {
    await ctx.answerCbQuery()
    const data = (await Pli.findOne({id: ctx.from.id}, {status: 1, _id: 0})).status
    if (data == false){
        await Pli.updateOne({id: ctx.from.id}, {home: true, status: true})
        ctx.reply('Спасибо за ответ!')  
    }
    else{
    }
})
bot.action('b2', async (ctx) => {
    await ctx.answerCbQuery()
    const data = (await Pli.findOne({id: ctx.from.id}, {status: 1, _id: 0})).status
    if (data == false){
        await Pli.updateOne({id: ctx.from.id}, {work: true, status: true})
        ctx.reply('Спасибо за ответ!')   
    }
    else{
    }
})
bot.action('b3', async (ctx) => {
    await ctx.answerCbQuery()
    const data = (await Pli.findOne({id: ctx.from.id}, {status: 1, _id: 0})).status
    if (data == false){
        await Pli.updateOne({id: ctx.from.id}, {homekWork: true, status: true})
        ctx.reply('Спасибо за ответ!')   
    }
    else{
    }
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))