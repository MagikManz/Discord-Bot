const request = require('request')

const Command = {
  alias: [],
  description: 'snipe edits command',
  func: async ({ Client, channel }) => {
    const guild = channel.guild
    const editedMessage = Client.messages[guild.id]?.edited
    if (!editedMessage) { channel.send('There is nothing to snipe!'); return }

    let snipeEmbed = editedMessage.embed
    if (!snipeEmbed) {
      const currentDate = new Date()
      const link = await new Promise((resolve, reject) => {
        request('https://ghostbin.com/paste/new', {
          method: 'POST',
          formData: {
            title: `Message by: ${editedMessage.member.user.tag}`,
            text: `OLD MESSAGE:\n${editedMessage.oContent}\n${'-'.repeat(45)}\nNEW MESSAGE:\n${editedMessage.content}`,
            password: editedMessage.createdAt.getTime()
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
            name: 'Edit Snipe',
            icon_url: 'https://cdn.discordapp.com/attachments/778562386063917086/831646271462834216/shut_up_dino.png'
          },

          description: `To view the entire message in raw, click [here](${link})`,

          fields: [
            {
              name: 'Old message:',
              value: editedMessage.oContent.substr(0, 1003)
            },
            {
              name: 'Message:',
              value: editedMessage.content.substr(0, 1003)
            }
          ]
        }
      }
      /* eslint-enable camelcase */

      Client.messages[guild.id].edited.embed = snipeEmbed
    }

    channel.send(snipeEmbed)
  }
}

module.exports = Command
