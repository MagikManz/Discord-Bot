const noticeMsg = 'You have been kicked from the [name] server.'

const Command = {
  alias: [],
  description: 'Kick command',
  mention: true,
  func: async ({ Client, member, mentions, message, channel }) => {
    if (mentions.length < 1) return

    const target = mentions[0]

    const currentDate = new Date()
    const senderId = member.id

    message.shift() // Remove the target mention
    if (message.length < 1) message = ['No reason specified.']

    const kickMessage = message.join(' ')

    /* eslint-disable camelcase */
    const kickEmbed = {
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
            name: 'Kicked By:',
            value: `<@${senderId}> (${senderId})`
          },
          {
            name: 'Kicked At:',
            value: currentDate.toUTCString()
          },
          {
            name: 'Kick Reason:',
            value: kickMessage
          },
          {
            name: 'Joining back:',
            value: 'Getting kicked means you\'re walking on thin fucking ice dude, please calm down, and you may join back.'
          }
        ]
      }
    }
    /* eslint-enable camelcase */

    if (target.kickable) await target.kick(`${kickMessage}, by ${member.user.tag}`).catch(() => {})
    Client.giveFeedback(channel, 'kick', 'Well... There they go ~', 'https://cdn.discordapp.com/emojis/659462596193157210.png?v=1', 'Kicked')
    target.send(kickEmbed).catch(() => {})
  }
}

module.exports = Command
