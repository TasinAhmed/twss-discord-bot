require("dotenv").config();
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const twss = require("twss");
const { Client, Intents } = require("discord.js");
const token = process.env.BOT_TOKEN;
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.once("ready", () => {
  console.log("Bot is ready");
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  console.log(msg.author);

  if (!twss.is(msg.content)) return;

  await msg.reply("That's what she said ( ͡° ͜ʖ ͡°)");

  const Guild = client.guilds.cache.get(msg.guildId);
  const Member = Guild.members.cache.get(msg.author.id);
  const player = createAudioPlayer();
  const resource = createAudioResource("./audio.mp3");

  if (Member.voice.channel) {
    const connection = joinVoiceChannel({
      channelId: Member.voice.channelId,
      guildId: msg.guildId,
      adapterCreator: Guild.voiceAdapterCreator,
    });
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  }
});

client.login(token);
