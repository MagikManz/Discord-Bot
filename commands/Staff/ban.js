const Discord = require("discord.js");

const NO_APPEAL_MSG = "You are not allowed to appeal this ban."
const APPEAL_MSG = "You are allowed to appeal this ban. Appeal At:\nhttps://discord.gg/dxgUeYS3KK"
const NOTICE_MSG = "You have been banned from the Script-Ware server.";

const Command = {
    func: (sender, mentions, channel, args) => {
        if (mentions.length < 1)
            return; 

        const CURRENT_DATE = new Date();
        const SENDER_ID = sender.id;

        const argsLength = args.length;
        const noAppeal = args[argsLength - 1].toLowerCase() == "(na)" && args.pop();
        const banMessage = args.join(" ");

        const BAN_EMBED = new Discord.MessageEmbed()
        .setAuthor("Script-Ware Bot")
        .setImage(sender.user.avatar)
        .addField("Notice:", NOTICE_MSG)
        .addField("Banned By:", `<@${SENDER_ID}> with an ID: ${SENDER_ID}`)
        .addField("Banned At:", CURRENT_DATE.toUTCString())
        .addField("Ban Reason:", banMessage)
        .addField("Appeal", noAppeal && NO_APPEAL_MSG || APPEAL_MSG)
        .setTimestamp(CURRENT_DATE);

        
    }
}

module.exports = Command;