const Command = {
  alias: ['commands'],
  description: 'Help command',
  func: async ({ Client, channel, member }) => {
    const rows = []
    let selectedRow = 0
    for (const name in Client.commands) {
      const cmd = Client.commands[name]
      if (member.roles.cache.find((role) => role.name === cmd.permissionLevel)) {
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

          const built = {
            name: name,
            value: info
          }
          if (rows[rows.length - 1]?.length < 4) {
            rows[rows.length - 1].push(built)
          } else {
            rows.push([{
              name: name,
              value: info
            }])
          }
        }
      }
    }

    const maxRows = rows.length - 1
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

        fields: rows[selectedRow],
        footer: {
          text: `Prefix: ${Client.prefix} | Page ${selectedRow + 1}/${maxRows + 1}`
        }
      }
    }
    /* eslint-enable camelcase */

    const message = await channel.send(helpEmbed).catch(() => {})
    if (rows.length > 1) {
      console.log('hello friend')
      const filter = (reaction, user) => (reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️') && user.id === member.id
      const collector = message.createReactionCollector(filter)

      let lastTouch = new Date().getTime() + 7000
      let reacting = false
      collector.on('collect', async (reaction) => {
        lastTouch = new Date().getTime() + 7000
        setTimeout(() => {
          if (new Date().getTime() > lastTouch) {
            console.log('disposing of collector')
            collector.stop()
            collector.empty()
          }
        }, 8000)
        if (reacting) return

        reacting = true
        await message.reactions.removeAll().catch(() => {})
        if (reaction.emoji.name === '➡️') {
          selectedRow = Math.min(maxRows, selectedRow + 1)
        } else {
          selectedRow = Math.max(0, selectedRow - 1)
        }

        helpEmbed.embed.fields = rows[selectedRow]
        helpEmbed.embed.footer.text = `Prefix: ${Client.prefix} | Page: ${selectedRow + 1}/${maxRows + 1}`
        await message.edit(helpEmbed).catch(() => {})
        if (selectedRow !== 0) {
          await message.react('⬅️')
        }

        if (selectedRow !== maxRows) {
          await message.react('➡️')
        }

        reacting = false
      })

      collector.on('end', () => {
        message.reactions.removeAll().catch(() => {})
      })

      await message.react('➡️')
      setTimeout(() => {
        if (new Date().getTime() > lastTouch) {
          console.log('disposing of collector')
          collector.stop()
          collector.empty()
        }
      }, 8000)
    }
  }
}

module.exports = Command
