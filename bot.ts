import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { text } from 'stream/consumers';
import requestDataFromPolygon from './request';

dotenv.config();

//create bot object using telegraf
const bot = new Telegraf(process.env.BOT_TOKEN as string);
const helpMessage = ` Here is a list of useful commands
        /help - for help
        /start - to start the bot
        /nft  <nft name> - to get details about the polygon token`;

//invoked when we use the start command on telegram bot
bot.start((ctx) => {
  ctx.reply('welcome to polygon token bot');
  ctx.reply(helpMessage);
});

bot.command(['nft', 'NFT', 'Nft'], async (ctx) => {
  const textArr = ctx.message.text.split(' ');
  const command = textArr.shift();
  const tokenName = textArr.join(' ') || null;

  if (tokenName && textArr.length === 1) {
    const record = await requestDataFromPolygon(tokenName);
    //check if returned record has value or not
    if (!record?.contract_address) {
      return ctx.reply('No record with given token name');
    }

    // custom message to send with the received record
    // const messageToSend = `<i>Details for Ens Name:</i><b>${tokenName}</>\n<b>Name</b> - ${
    //   record!.name
    // }\n<b>Contract Address</b> - <a href='https://etherscan.io/address/${
    //   record.contract_address
    // }'>${record!.contract_address}</a>\n<b>Label</b> - ${
    //   record!.label
    // }\n<b>Cost</b> - ${record!.cost}\n<b>Expires</b> - ${
    //   record!.expires
    // }\n<b>transaction_hash</b> - <a href='https://etherscan.io/tx/${
    //   record.transaction_hash
    // }'>${record!.transaction_hash}</a>
    // `;

    const messageToSend = `<i>Details for nft Name: </i><b>${tokenName}</b>\n<b>standard</b>-${record?.standard}\n<b>Name</b> - ${record?.name}\n<b>symbol</b> - ${record?.symbol}\n<b>Contract Address</b> - ${record?.contract_address}\n<b>process time</b> - ${record?.process_time}
    `;

    ctx.replyWithHTML(messageToSend, { disable_web_page_preview: true });
  } else {
    ctx.reply('invalid command! Try again');
  }
});

//on help command
bot.help((ctx) => {
  ctx.reply(helpMessage);
});

//make bot ready
bot.launch();
