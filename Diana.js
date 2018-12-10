const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const http = require('http');
const express = require('express');
const app = express();
const isaac = require("tboiajs");
const jsel = require("jsel");
const cleverbot = require("cleverbot.io");
const osu = require("osu-call");
const Youtube = require("simple-youtube-api");
const youtube = new Youtube(process.env.YT_API);
const yt = require('ytdl-core');
const info = require("./info.json");
const bot = new cleverbot(process.env.CLEVER_1, process.env.CLEVER_2);
const prefix = config.prefix
let queue = {};

app.use(express.static('public'));

app.get("/", function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 240000);

client.on("ready", () => {
  var status = info.Status

setInterval(function() {

  var random = [Math.floor(Math.random() * status.length)]

  client.user.setPresence({
    game: {
      name: status[random], 
      url: "https://www.twitch.tv/CircusRockS_",
      type: "STREAMING",
    }
  });
  }, 500000);
	console.log("¡Estoy lista!");
});

client.login(process.env.BOT_TOKEN);

client.on("message", (message) => {
  if (message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
	if (!message.content.startsWith(config.prefix)) return;

	if (command === "ping") {
    let ping = Math.floor(message.client.ping);
    message.channel.send("¡Pong! :ping_pong:")
    .then(m => {
      const embed = new Discord.RichEmbed()
			.setColor(0x00ff00)
			.addField("Ping de Mensajes", `:incoming_envelope: \`${m.createdTimestamp - message.createdTimestamp}ms\``, true)
			.addField("Pind de DiscordAPI", `:satellite_orbital:  \`${ping} ms\``, true)
      .setTimestamp()
		  message.channel.send({
			  embed
		  })
      m.delete()
    });
	}
	if (command === "help") {
    let nakido = client.users.get(config.nakido)
		const embed = new Discord.RichEmbed()
		.setTitle("Menú de ayuda")
    .setThumbnail(client.user.avatarURL)
		.setAuthor(message.author.username, message.author.avatarURL)
		.setColor(0x00ff00)
		.setDescription("¿Necesitas ayuda con mis comandos?, ¡No te preocupes! Acá te dejo toda la información")
		.setFooter("Para más información visita: https://dianabot.glitch.me/ (WIP)", client.user.avatarURL)
		.setThumbnail(client.user.avatarURL)
		.setTimestamp()
		.addField("General",
		"&help = Muestra este mensaje de ayuda\r&serverinfo = Muestra información detallada del servidor\r&userinfo @mencion = Muestra información detallada de un usuario\r&botinfo = Muestra información sobre Diana\r&avatar @mención = Muestro el avatar del usuario mencionado\r&lista = Enseña la lista de cosas que mi autora añadirá en el futuro ♡")
		.addField("Moderación",
		"&kick @mencion [razon] = ¡Saca un usuario molesto de tu servidor!\r&clear [cantidad] = Elimino la cantidad de mensajes indicados")
		.addField("Diversión",
		"&visto @mencion = ¡Dejas en visto a un usuario! :o\r&ping = ¡Pong!\r&decir [texto] = ¡Digo lo que quieras!\r&caracola = Preguntale algo a la caracola mágica :o (Solo preguntas que se puedan responder con si o no)\r&spray @mencion = ¡Mojas a alguien cuando sea malo!\r&bautizar @mencion = Le ofreces la bendición eterna a un usuario~\r&lyrics = Enseña un fragmento de una canción al azar.\r&talk = Habla conmigo (Tardo en responder, tengo mejores cosas que hacer)\r&c = Envia un mensaje completamente anónimo.")
		.addField("Busqueda",
		"&yt [texto] = Busca videos en youtube\r&osu [modo] [nombre de usuario] = Te enseña las estadisticas de dicho usuario | `Creditos: "+`${nakido.username}#${nakido.discriminator}`+"`")
		.addField("Música", 
		"&play = Reproduce la lista de canciones añadidas\r&add [texto] = Añade una canción a la lista de reproducción\r&queue = Enseña la lista de canciones en espera\r&join = Me uno a tu canal de voz\r&leave = Salgo del canal de voz\r&pause = Pauso la canción que está sonando\r&resume = Continuo la reproducción de la canción que suena\r&time = Enseño el tiempo que lleva sonando la canción\r&skip = Salto la canción que esté sonando")
		.addBlankField(true)
		message.channel.send({
      embed
    });
	}
	if (command === "visto") {
    let noMention = new Discord.RichEmbed()
    .setDescription("**Debes mencionar a alguien**\nEjemplo: `&visto @diana#1961`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
    if (message.mentions.users.size < 1) return message.channel.send(noMention)
		message.channel.send("**"+message.author.username+"**"+" te ha clavado el visto "+message.mentions.users.first()+" <:Visto:424701850953056279>")
	}
	if (command === "decir"){
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Debes escribir algo para que yo pueda decirlo**\nEjemplo: `&decir Me gusta el pan con harina pan`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
		if(!args) return message.channel.send(noArgs);
    message.delete();
		message.channel.send(`${args}`);
    }
  if (command === "caracola") {
    const content = message.content.split(' ').slice(1);
		const args = content.join(' ');
    var rpts = ["Sí","No","¿Por qué?","Por favor", "Tal vez", "No sé", "Definitivamente", "¡Claro!","¡Por supuesto!","Por supuesto que no","¿Qué?, deja el tang.","No cuentes con ello","Cuenta con ello","io k c no soi 100tifika","¿Tengo cara de que me importe?"];
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Debes escribir una pregunta de si o no**\nEjemplo: `&caracola ¿Ella me amará algún día?`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
    if (!args) return message.channel.send(noArgs);
    const embed = new Discord.RichEmbed()
      .setColor(0x00ff00)
      .setTitle(message.author.username+" ha hablado la caracola mágica.")
      .setDescription("Preguntaste: `"+args+"`")
      .addField("La caracola respondió:","`"+ rpts[Math.floor(Math.random() * rpts.length)]+"`")
    message.channel.send({
      embed
    });
    }
  if (command === "serverinfo") {
		var server = message.guild;
		const embed = new Discord.RichEmbed()
			.setThumbnail(server.iconURL)
			.setAuthor(server.name, server.iconURL)
			.addField('ID', server.id, true)
			.addField('Region', server.region, true)
			.addField('Creado el', server.createdAt.toDateString(), true)
			.addField('Dueño del Servidor', server.owner.user.username + '#' + server.owner.user.discriminator + ' ', true)
			.addField('Miembros', server.memberCount, true)
			.addField('Canales', server.channels.size, true)
			.addField('Roles', `\`${server.roles.map(r=>r.name).join("` | `")}\``)
      .addBlankField(true)
      .setTimestamp()
			.setColor(0x00ff00)
		message.channel.send({
			embed
		});
	}
  if (command === "kick" ) {
    let razon = args.slice(1).join(" ");
    let user = message.mentions.users.first();
    var respuestas = ["Le cayo la onu","Lo mandaron a freir esparragos","Nadie lo queria"]
    let noPer = new Discord.RichEmbed()
    .setDescription("**Este comando requiere de permisos para kickear usuarios**")
    .setFooter("Sistema de seguridad de Diana")
    .setColor("ff0000")
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(noPer)
    let noMention = new Discord.RichEmbed()
    .setDescription("**Debes mencionar a alguien**\nEjemplo: `&kick @diana#1961 [Razón]`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
    if (message.mentions.users.size < 1) return message.channel.send(noMention).catch(console.error);
    let noReason = new Discord.RichEmbed()
    .setDescription("**Escribe una razón**\nEjemplo: `&kick @diana#1961 [Razón]`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
    if (!razon) return message.channel.send(noReason);
    let equalMember = new Discord.RichEmbed()
    .setDescription("**El usuario mencionado tiene un rango igual o mayor al tuyo y por ello no puedo kickerlo.**")
    .setFooter("Sistema de seguridad de Diana")
    .setColor("ff0000")
    if (!message.guild.member(user).kickable) return message.channel.send(equalMember);
    message.guild.member(user).kick(razon);
    message.channel.send(`A **${user.username}** ${respuestas[Math.floor(Math.random() * respuestas.length)]}, fue kickeado del servidor por ${razon}. :eyes:`);
  }
  if (command === "userinfo") {
    let userm = message.mentions.users.first()
    if(!userm){
      var user = message.author;
        const embed = new Discord.RichEmbed()
        .setThumbnail(user.avatarURL)
        .setAuthor(user.username+'#'+user.discriminator, user.avatarURL)
        .addField('Jugando a', user.presence.game != null ? user.presence.game.name : "Nada", true)
        .addField('ID', user.id, true)
        .addField('Estado', user.presence.status, true)
        .addField('Apodo', message.member.nickname, true)
        .addField('Cuenta Creada', user.createdAt.toDateString(), true)
        .addField('Fecha de Ingreso', message.member.joinedAt.toDateString())
        .addField('Roles', message.member.roles.map(roles => `\`${roles.name}\``).join(', '))
        .setColor(0x00ff00)
        .addBlankField(true)
        .setTimestamp()
        message.channel.send({
          embed
        });
    }else{
      const embed = new Discord.RichEmbed()
      .setThumbnail(userm.avatarURL)
      .setAuthor(userm.username+'#'+userm.discriminator, userm.avatarURL)
      .addField('Jugando a', userm.presence.game != null ? userm.presence.game.name : "Nada", true)
      .addField('ID', userm.id, true)
      .addField('Estado', userm.presence.status, true)
      .addField('Cuenta Creada', userm.createdAt.toDateString(), true)
      .addField('Fecha de Ingreso', message.member.joinedAt.toDateString())
      .addField('Roles', message.member.roles.map(roles => `\`${roles.name}\``).join(', '))
      .setColor(0x00ff00)
      .addBlankField(true)
      .setTimestamp()
      message.channel.send({
        embed
      });
    }
  }
  if (command === "lista") {
    const embed = new Discord.RichEmbed()
    .setTitle("Lista de cosas por hacer:")
    .setThumbnail(client.user.avatarURL)
    .setAuthor(message.author.username, message.author.avatarURL)
    .setColor(0x00ff00)
    .setFooter("Para más información visita: https://dianabot.glitch.me/ (WIP)", client.user.avatarURL)
    .addField("Añadir comandos de moderación:","Ban\rMute\rLogs\rOtros")
    .addField("Añadir más comandos de diversión:","Acciones (Abrazos, besos, golpes, pats etc)\rJuegos de azar y mujerz... Digo, y trivias\rBatallas pokemon\rSistema de niveles y roles (Muy, muy, muy en el futuro)\rShipeos\r~~Molestar a nakido~~\rPreguntas filosoficas\rRetos\rGalletas de la fortuna\rFrases random\rOtros")
    .addField("Añadir comandos de busqueda","Imagenes\rPokedex\rClima\rWikipedia :thinking:\rOtros")
    .addField("Añadir comandos generales","Calculadora :thinking:\rRecordador\rOtros")
    .addField("Mejorar comandos actuales","\rTalk (Hacer que Diana responda de inmediato)")
    .setTimestamp()
    message.channel.send({
      embed
    })
  }
  if (command === "osu") {
		let args = message.content.split(' ').slice(1);
		let ur = args.slice(1).join(' ');
		let md = args[0];
    let noMD = new Discord.RichEmbed()
    .setDescription("**Escribe un modo de juego**\nEjemplo: `&osu ctb CircusRockS`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
		if (!md) return message.channel.send(noMD);
    let noUR = new Discord.RichEmbed()
    .setDescription("**Escribe un nombre de usuario**\nEjemplo: `&osu ctb CircusRockS`")
    .setFooter("Manual del Usuario de Diana")
    .setColor("ff0000")
		if (!ur) return message.channel.send(noUR);
		if (md === "std" || md === "taiko" || md === "ctb" || md === "mania") {
			if (md === "std") md = 0
			if (md === "taiko") md = 1
			if (md === "ctb") md = 2
			if (md === "mania") md = 3
			osu.give_key(process.env.OSU_API);
			osu.get_user({
					u: ur,
					m: md
				})
				.then(result => {
					osu.get_user_best({
							u: ur,
							m: md
						})
						.then(best => {
							let user = JSON.parse(JSON.stringify(result));
							let top = JSON.parse(JSON.stringify(best))
							osu.get_beatmaps({
									b: top[0]["beatmap_id"]
								})
								.then(bmb => {
									let nbm = JSON.parse(JSON.stringify(bmb))
									const embed = new Discord.RichEmbed()
										.setColor(0x00ff00)
                    .setTimestamp()
										.setFooter("Id de usuario: "+user[0]["user_id"]+" | Codigo by: Nakido")
                    .setThumbnail("https://a.ppy.sh/"+user[0]["user_id"]+"?.png")
										.setAuthor(`${user[0]["username"]}'s profile`, "http://up.ppy.sh/files/osu!logo4-0.png")
										.setURL("https://osu.ppy.sh/u/" + user[0]["user_id"])
                    .addField("Pais", ":flag_"+user[0]["country"].toLowerCase()+": "+user[0]["country"] + "(#" + user[0]["pp_country_rank"].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")", true)
										.addField("Rendimiento", Number(user[0]["pp_raw"]).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "pp (#" + user[0]["pp_rank"].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")", true)
										.addField("Precisión", Number(user[0]["accuracy"]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%', true)
                    .addField("Nivel", Number(user[0]["level"]).toFixed(1), true)
										.addField("Partidas", user[0]["playcount"].replace(/\B(?=(\d{3})+(?!\d))/g, ","), true)
										.addField("Puntuación", user[0]["ranked_score"].replace(/\B(?=(\d{3})+(?!\d))/g, ","), true)
										.addField("Rangos", "<:SS:420845892808212480>"+user[0]["count_rank_ss"].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"                              <:S_:420845833223798786>"+user[0]["count_rank_s"].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"                              <:A_:420845949267476480>"+user[0]["count_rank_a"].replace(/\B(?=(\d{3})+(?!\d))/g, ","), true)
										.addField("Mejor partida", `[${"["+nbm[0]["creator"]+"] "+nbm[0]["artist"]+" - "+nbm[0]["title"]+" ["+nbm[0]["version"]+"]"}](https://osu.ppy.sh/b/${top[0]["beatmap_id"]})${" ["+Number(top[0]["pp"]).toFixed(0)+"pp]"}`)
									message.channel.send({
										embed
									})
								})
						})
						.catch(error => message.channel.send("No se ha podido encontrar el usuario especificado."))
				})
		}
	}
  if (command === "diana") {
    let noOwner = new Discord.RichEmbed()
    .setDescription("**Tú no me das ordenes.**")
    .setFooter("Sistema de seguridad de Diana")
    .setColor("ff0000")
	if (message.author.id !== config.ownerID) return message.channel.send(noOwner);
    message.channel.send("Yes *my darling*.");
    const clean = text => {
			if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			else
				return text;
		}
		try {
			const code = args.join(" ");
			let evaled = eval(code);
			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
      console.log(clean(evaled))
			const embed = new Discord.RichEmbed()
				.setColor(0x00ff00)
				.setFooter("Diana Eval")
				.addField("INPUT", `\`\`\`js\n${code}\n\`\`\``)
				.addField("OUTPUT", `\`\`\`js\n${clean(evaled)}\n\`\`\``);
			message.channel.send({
				embed
			});
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
  }
  if (command === "yt") {
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Escribe un titulo para buscarlo**\nEjemplo: `&yt Mayu - Circus Monster`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
    if (!args) return message.channel.send(noArgs);
    youtube.searchVideos(args, 1)
      .then(results => {
	    message.channel.send("*"+message.author.username+"-sama* busqué en youtube `"+args+"` y encontré esto:\n"+results[0].url);
     });
  }
  if (command === "spray") {
	  let noMention = new Discord.RichEmbed()
	  .setDescription("**Menciona a un usuario**\nEjemplo: `&spray @diana#1961`")
	  .setFooter("Manual del usuario de Diana")
	  .setColor("ff0000")
    if (message.mentions.users.size < 1) return message.channel.send(noMention);
    message.channel.send("*Toma un spray con agua y moja a "+message.mentions.users.first()+"* ¡Malo, malo, malo!")
  }
  if (command === "botinfo") {
    let circus = client.users.get(config.ownerID)
		let ping = Math.floor(message.client.ping)
		const embed = new Discord.RichEmbed()
			.setAuthor("Información de Diana", client.user.avatarURL)
			.setColor(0x00ff00)
      .setTimestamp()
			.setFooter(`Desarrollada por ${circus.username}#${circus.discriminator}`, circus.avatarURL)
			.addField("RAM", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
			.addField("Servidores", `${client.guilds.size}`, true)
			.addField("Ping", `${ping} ms`, true)
			.addField("Discord.js", `v${Discord.version}`, true)
			.addField("Node", "v8.1.2", true)
			.addField("Página Web", "https://dianabot.glitch.me", true)
		message.channel.send({
			embed
		});
  }
  if (command === "bautizar") {
    let noMention = new Discord.RichEmbed()
    .setDescription("**Debes mencionar a alguien**\nEjemplo: `&bautizar @diana#1961`")
    .setFooter("Manual del usuario de Diana")
    .setColor("ff0000")
      if (message.mentions.users.size < 1) return message.channel.send(noMention);
    message.channel.send("*Toma un sobre de tang y lo rocia sobre "+message.mentions.users.first()+"* ***Has sido bendecido.***")
  }
  if (command === "setavatar") {
		const content = message.content.split(' ').slice(1);
		const avatar = content.join(' ');
    let noOwner = new Discord.RichEmbed()
    .setDescription("**Tú no me das ordenes.**")
    .setFooter("Sistema de seguridad de Diana")
    .setColor("ff0000")
	if (message.author.id !== config.ownerID) return message.channel.send(noOwner);
    let noAvatar = new Discord.RichEmbed()
    .setDescription("**Envia el enlace de la imagen que quieres ponerme.**")
    .setColor("ff0000")
    .setFooter("Manual del usuario de Diana")
		if (!avatar) return message.channel.send(noAvatar);
				message.channel.send("Yes *my darling*.");
				client.user.setAvatar(avatar)
  }
  if (command === "lyrics") {
    var phrase = info.Letras
    const embed = new Discord.RichEmbed()
		.setColor(0x00ff00)
		.setDescription(phrase[Math.floor(Math.random() * phrase.length)])
    message.channel.send({
      embed
    });
    }
	if (command === "talk"){
		bot.setNick("DianaCavendishBot")
		bot.create(function(err, session) {
			bot.ask(args.join(" "), function(err, response) {
					message.channel.send(response)			
			})
		})
	}
	if (command === "c"){
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Debes añadir texto para enviarlo.**\nEjemplo: `&c Puto el que lo lea.`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
		if(!args) return message.channel.send();
    message.delete();
		const embed = new Discord.RichEmbed()
		.setColor(0x00ff00)
		.setTitle("Anónimo:")
		.setDescription(`${args}`)
		.setTimestamp()
		message.channel.send({
			embed
	});
    }
  if (command === "avatar"){
    let usera = message.mentions.users.first()
    if(!usera){
      let userAvatar = new Discord.RichEmbed()
      .setTitle("Avatar de "+message.author.username+":")
      .setImage(message.author.avatarURL)
      .setColor("00FF00")
      message.channel.send(userAvatar);
    }else{
      let userAv = new Discord.RichEmbed()
      .setTitle("Avatar de "+usera.username+":")
      .setImage(usera.avatarURL)
      .setColor("00FF00")
      message.channel.send(userAv);
    }
  }
  if (command === "play") {
    let noSongs = new Discord.RichEmbed()
    .setDescription("**Agrega canciones a la lista de reproducción.**\nEjemplo: `&add Mili - world.execute(me);`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
    if (queue[message.guild.id] === undefined) return message.channel.send(noSongs);
    let noVoiceConection = new Discord.RichEmbed()
    .setDescription("**No estoy en ningún canal de voz.**\nPuedes pedirme que me una a uno usando: `&join`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
    if (!message.guild.voiceConnection) return message.channel.send(noVoiceConection);
    let alreadyPlaying = new Discord.RichEmbed()
    .setDescription("**Ya se encuentran en reproducción las canciones solicitadas.**")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
    if (queue[message.guild.id].playing) return message.channel.send(alreadyPlaying);
    let dispatcher;
    queue[message.guild.id].playing = true;
    
    console.log(queue);
    (function play(song) {
      console.log(song);
      let endSong = new Discord.RichEmbed()
      .setDescription("**La lista de reproducción está vacia.**")
      .setFooter("Sistema músical de Diana")
      .setColor("0000FF")
      if (song === undefined) return message.channel.send(endSong).then(() => {
        queue[message.guild.id].playing = false;
        message.member.voiceChannel.leave();
      });
      let songSound = new Discord.RichEmbed()
      .setDescription(`Reproduciendo: **${song.title}**\nSolicitada por: **${song.requester}**`)
      .setFooter("Sistema músical de Diana")
      .setColor("0000FF")
      message.channel.send(songSound);
      dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : config.passes });
      let collector = message.channel.createCollector(m => m);
      collector.on('message', m => {
        if (m.content.startsWith(config.prefix + 'pause')){
          let pauseCMD = new Discord.RichEmbed()
          .setDescription("Se ha pausado la reproducción.")
          .setFooter("Sistema músical de Diana")
          .setColor("0000FF")
          message.channel.send(pauseCMD).then(() => {dispatcher.pause();});
        } else if (m.content.startsWith(config.prefix + 'resume')){
          let resumeCMD = new Discord.RichEmbed()
          .setDescription("He continuado con la reproducción.")
          .setFooter("Sistema músical de Diana")
          .setColor("0000FF")
          message.channel.send(resumeCMD).then(() => {dispatcher.resume();});
        } else if (m.content.startsWith(config.prefix + 'skip')){
          let skipCMD = new Discord.RichEmbed()
          .setDescription("He salteado la canción que sonaba.")
          .setFooter("Sistema músical de Diana")
          .setColor("0000FF")
          message.channel.send(skipCMD).then(() => {dispatcher.end();});
        } else if (m.content.startsWith(config.prefix + 'time')){
          let timeCMD = new Discord.RichEmbed()
          .setDescription(`La canción lleva sonando: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`)
          .setFooter("Sistema músical de Diana")
          .setColor("0000FF")
          message.channel.send(timeCMD);
        }
      });
      dispatcher.on('end', () => {
        collector.stop();
        play(queue[message.guild.id].songs.shift());
      });
      dispatcher.on('error', (err) => {
        return message.channel.send('error: ' + err).then(() => {
          collector.stop();
          play(queue[message.guild.id].songs.shift());
        });
      });
    })(queue[message.guild.id].songs.shift());
  }
  if (command === "join") {
    return new Promise((resolve, reject) => {
      const voiceChannel = message.member.voiceChannel;
      let noVoice = new Discord.RichEmbed()
      .setDescription("**No estás en un canal de voz, por favor ingresa a uno.**")
      .setFooter("Manual del usuario de Diana")
      .setColor("FF0000")
      if (!voiceChannel || voiceChannel.type !== 'voice') return message.channel.send(noVoice);
      voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
  }
  if (command === "add") {
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Escribe el titulo de una canción para añadirla a la lista de reproducción.**\nEjemplo: `&add Mili - World.execute(me);`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
    if (!args) return message.channel.send(noArgs);
    let noVoiceConection = new Discord.RichEmbed()
    .setDescription("**No estoy en ningún canal de voz**\nPuedes pedirme que me una a uno usando: `&join`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
    if (!message.guild.voiceConnection) return message.channel.send(noVoiceConection);
    youtube.searchVideos(args, 1)
      .then(results => {
      let url = results[0].url
      yt.getInfo(url, (err, info) => {
        if(err) return message.channel.send('El enlace de youtube es invalido: ' + err);
        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
        queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
        let addedEmbed = new Discord.RichEmbed()
        .setDescription(`**${info.title}**\nHa sido añadido a la lista de reproducción`)
        .setFooter("Sistema músical de Diana")
        .setColor("0000FF")
        message.channel.send(addedEmbed);
      });
    });
  }
    if (command === "queue") {
      let emptyEmbed = new Discord.RichEmbed()
      .setDescription("**La lista de reproducción está vacía.**\nAñade canciones con: `&add <titulo de la canción>`")
      .setFooter("Manual del usuario de Diana.")
      .setColor("FF0000")
      if (queue[message.guild.id] === undefined) return message.channel.sendMessage(emptyEmbed);
      let tosend = [];
      queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Solicitado por: ${song.requester}`);});
      message.channel.sendMessage(`__**Lista de reproducción de ${message.guild.name}**__ **${tosend.length}** Canciones en espera ${(tosend.length > 15 ? '*[Solo se muestran las siguientes 15]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
    }
  if (command === "leave"){
    message.member.voiceChannel.leave()
  }
  if (command === "clear") {
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
	  let nanEmbed = new Discord.RichEmbed()
	  .setDescription("**Por favor especifica un número de mensajes para eliminar.**\nEjemplo: `&clear <cantidad>`")
	  .setFooter("Manual del usuario de Diana.")
	  .setColor("FF0000")
    if (isNaN(args[0])) return message.channel.send(nanEmbed)
	  let adminEmbed = new Discord.RichEmbed()
         .setDescription("**Este comando requiere de permisos de Administrador**")
         .setFooter("Sistema de seguridad de Diana.")
         .setColor("FF0000")
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(adminEmbed)
    async function delet() {
      message.delete()
      const fetched = await message.channel.fetchMessages({
        limit: args
      });
      console.log("Se han encontrado "+fetched.size+" mensajes... Borrando");
      message.channel.bulkDelete(fetched)
        .catch(error => message.channel.send(`Error: ${error}`));
      message.channel.send("Se han eliminado "+fetched.size+" mensajes")
    }
    delet();
  }
  if (command === "confesar"){
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    let noArgs = new Discord.RichEmbed()
    .setDescription("**Debes añadir una confesión para enviarla.**\nEjemplo: `&c Me gusta comer patatas fritas`")
    .setFooter("Manual del usuario de Diana")
    .setColor("FF0000")
		if(!args) return message.channel.send();
    message.delete();
		const embed = new Discord.RichEmbed()
		.setColor(0xff00ff)
		.setTitle("Anónimo:")
		.setDescription(`${args}`)
		.setTimestamp()
		.setFooter("Sistema de confesiones de Diana.")
    client.channels.get("470786494270013442").send(embed)
  }
});
