const noAppealMsg = 'You are not allowed to appeal this ban.'
const appealMsg = 'You are allowed to appeal this ban. Appeal At:\nhttps://discord.gg/dxgUeYS3KK'
const noticeMsg = 'You have been banned from the [name] server.'

const Command = {
  alias: [],
  description: 'Ban command',
  func: async ({ Client, member, mentions, message, channel }) => {
    if (mentions.length < 1) return

    const target = mentions[0]

    const currentDate = new Date()
    const senderId = member.id

    const argsLength = message.length
    const noAppeal = message[argsLength - 1].toLowerCase() === '(na)' && message.pop()

    message.shift() // Remove the target mention
    if (message.length < 1) message = ['No reason specified.']

    const banMessage = message.join(' ')

    /* eslint-disable camelcase */
    const banEmbed = {
      content: '',
      embed: {
        color: 8238467,
        timestamp: currentDate.toString(),

        author: {
          name: 'Moderation Action',
          icon_url: 'https://cdn.discordapp.com/attachments/778562386063917086/831646271462834216/shut_up_dino.png'
        },

        fields: [
          {
            name: 'Notice:',
            value: noticeMsg.replace('[name]', channel.guild.name)
          },
          {
            name: 'Banned By:',
            value: `<@${senderId}> (${senderId})`
          },
          {
            name: 'Banned At:',
            value: currentDate.toUTCString()
          },
          {
            name: 'Ban Reason:',
            value: banMessage
          },
          {
            name: 'Appeal:',
            value: (noAppeal && noAppealMsg) || appealMsg
          }
        ]
      }
    }
    /* eslint-enable camelcase */

    if (target.bannable) await target.ban(`${banMessage}, by ${member.user.tag}`).catch(() => {})
    Client.giveFeedback(channel, 'ban', 'Well... There they go ~', 'https://cdn.discordapp.com/emojis/777791373130203136.png?v=1', 'Banned')
    target.send(banEmbed).catch(() => {})
  }
}

module.exports = Command
