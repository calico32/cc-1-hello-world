import { Client, GuildMember, Message, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';

import { getCatImage } from './cat';

dotenv.config();

const client = new Client({
  disableMentions: 'everyone',
});

// client.user is null because we haven't logged in yet
let mention: string;

client.on('message', async (msg: Message) => {
  if (msg.author.bot) return;
  if (msg.author.id == client.user?.id) return;
  if (!msg.guild) return; // don't respond to DMs

  const guild = msg.guild;
  const me = guild.me as GuildMember;
  const channel = guild.channels.cache.get(msg.channel.id);

  if (!channel) return;

  if (msg.mentions.has(me)) {
    if (!channel.permissionsFor(me)?.has('SEND_MESSAGES')) {
      if (channel.permissionsFor(me)?.has('ADD_REACTIONS')) {
        msg.react('❌');
      }
      return console.error('no perms to send messages');
    }

    const embed = new MessageEmbed({
      author: { name: client.user?.username },
      title: 'hello world',
      description: 'cat image',
      image: { url: await getCatImage() },
    });
    msg.channel.send(embed);
  }
});

client.on('ready', () => {
  mention = `<@!${client.user?.id}> `;
  console.log(`${client.user?.tag} ready`);
  const setPresence = () => {
    client.user?.setPresence({
      activity: {
        name: `vscode | @${client.user?.username}`,
        type: 'PLAYING',
      },
    });
  };
  setPresence();
  setInterval(setPresence, 1000 * 60 * 10);
});

client
  .on('warn', console.warn)
  .on('error', console.error)
  .on('disconnect', () => console.log('client disconnected'))
  .login(process.env.DISCORD_TOKEN);
