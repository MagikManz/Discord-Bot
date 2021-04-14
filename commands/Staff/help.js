const Command = {
  alias: ['owo', 'helpmedaddy'],
  description: 'Help command',
  func: ({ Client, channel }) => {
    const fields = []
    for (const name in Client.commands) {
      const cmd = Client.commands[name]
      if (cmd && !cmd.alias.includes(name)) {
        let info = cmd.info
        if (cmd.alias.length > 0) {
          info += '\naliases: ['
          cmd.alias.forEach((alias) => {
            info += `${alias}, `
          })

          info = info.substring(0, info.length - 2)
          info += ']'
        }

        fields.push({
          name: name,
          value: info
        })
      }
    }

    /* eslint-disable camelcase */
    const helpEmbed = {
      content: '',
      embed: {
        color: 8238467,
        timestamp: new Date().toString(),

        author: {
          name: 'Commands',
          icon_url: 'https://cdn.discordapp.com/attachments/778562386063917086/831646271462834216/shut_up_dino.png'
        },

        fields: fields,
        footer: {
          text: `Prefix: ${Client.prefix}`
        }
      }
    }
    /* eslint-enable camelcase */

    channel.send(helpEmbed).catch(() => {})
  }
}

module.exports = Command
