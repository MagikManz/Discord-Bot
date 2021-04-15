const request = require('request')

const Command = {
  alias: [],
  description: 'snipe command',
  func: async ({ Client, channel }) => {
    const guild = channel.guild
    const deletedMessage = Client.messages[guild.id]?.deleted
    if (!deletedMessage) { channel.send('There is nothing to snipe!'); return }

    let snipeEmbed = deletedMessage.embed
    if (!snipeEmbed) {
      const currentDate = new Date()
      const link = await new Promise((resolve, reject) => {
        request('https://ghostbin.com/paste/new', {
          method: 'POST',
          formData: {
            title: `Message by: ${deletedMessage.member.user.tag}`,
            text: deletedMessage.content,
            password: deletedMessage.createdAt.getTime()
          }
        }, (e, r) => {
          if (e) { resolve(false); return }

          resolve(r.headers.location)
        })
      })

      /* eslint-disable camelcase */
      snipeEmbed = {
        content: '',
        embed: {
          color: 8238467,
          timestamp: currentDate.toString(),

          author: {
            name: 'Snipe',
            icon_url: 'https://cdn.discordapp.com/attachments/778562386063917086/831646271462834216/shut_up_dino.png'
          },

          description: `To view the entire message in raw, click [here](${link})`,

          fields: [
            {
              name: 'Message:',
              value: deletedMessage.content.substr(0, 1003)
            }
          ]
        }
      }
      /* eslint-enable camelcase */

      Client.messages[guild.id].deleted.embed = snipeEmbed
    }

    channel.send(snipeEmbed)
  }
}

module.exports = Command
