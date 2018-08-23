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
  client.user.setPresence({
  game: {
  name: "Touhou 15: Legacy of Lunatic Kingdom",
  url: "https://www.twitch.tv/CircusRockS_",
  type: "STREAMING"
  }});
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
	if (command === "hola") {
		message.channel.send("Hola, ¿Qué tal?");
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
		"&kick @mencion [razon] = ¡Saca un usuario molesto de tu servidor!")
		.addField("Diversión",
		"&visto @mencion = ¡Dejas en visto a un usuario! :o\r&hola = ¡Holi!\r&ping = ¡Pong!\r&decir [texto] = ¡Digo lo que quieras!\r&caracola = Preguntale algo a la caracola mágica :o (Solo preguntas que se puedan responder con si o no)\r&spray @mencion = ¡Mojas a alguien cuando sea malo!\r&bautizar @mencion = Le ofreces la bendición eterna a un usuario~\r&lyrics = Enseña un fragmento de una canción al azar.\r&talk = Habla conmigo (Tardo en responder, tengo mejores cosas que hacer)\r&c = Envia un mensaje completamente anónimo.")
		.addField("Busqueda",
		"&yt [texto] = Busca videos en youtube\r&osu [modo] [Nombre de usuario] = Te enseña las estadisticas de dicho usuario | `Creditos: "+`${nakido.username}#${nakido.discriminator}`+"`")
		.addField("Música", 
		"&play = Reproduce la lista de canciones añadidas\r&add [Texto] = Añade una canción a la lista de reproducción\r&queue = Enseña la lista de canciones en espera\r&join = Me uno al canal de voz donde estas\r&leave = Salgo del canal de voz donde estas\r&pause = Pauso la canción que está sonando\r&resume = Continuo la reproducción de la canción que suena\r&time = Enseño el minuto en el que la canción está")
		.addBlankField(true)
		message.channel.send({
      embed
    });
	}
	if (command === "visto") {
    if (message.mentions.users.size < 1) return message.channel.send("Debes mencionar a alguien: `&visto @diana#1961`")
    message.delete();
		message.channel.send("**"+message.author.username+"**"+" te ha clavado el visto "+message.mentions.users.first()+" <:Visto:424701850953056279>")
	}
	if (command === "decir"){
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
		if(!args) return message.channel.send('Debes añadir texto para decir.');
    message.delete();
		message.channel.send(`${args}`);
    }
  if (command === "caracola") {
    const content = message.content.split(' ').slice(1);
		const args = content.join(' ');
    var rpts = ["Sí","No","¿Por qué?","Por favor", "Sí", "Tal vez", "No sé", "Definitivamente", "Sí", "¡Claro!","¡Por supuesto!","Por supuesto que no","¿Qué?, deja el tang.","No cuentes con ello","Cuenta con ello","io k c no soi 100tifika","¿Tengo cara de que me importe?"];
    if (!args) return message.reply(`¡Escribe una pregunta!.`);
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
    if (message.mentions.users.size < 1) return message.channel.send('Debes mencionar a alguien: `&kick @diana#1961 [Razón]`').catch(console.error);
    if (!razon) return message.channel.send("Escribe una razón: `&kick @diana#1961 [Razón]`");
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("No tienes permitido hacer eso.")
    if (!message.guild.member(user).kickable) return message.channel.send('No puedo kickear a este usuario :(');
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
    .addField("Añadir comandos de moderación:","~~Kick~~\rBan\rMute\rLogs\rOtros")
    .addField("Añadir más comandos de diversión:","Acciones (Abrazos, besos, golpes, pats etc)\rJuegos de azar y mujerz... Digo, y trivias\r~~Reproducir música~~\rBatallas pokemon\r~Hablar con Diana~\rSistema de niveles y roles (Muy, muy, muy en el futuro)\rShipeos\r~~Molestar a nakido~~\rPreguntas filosoficas\rRetos\rGalletas de la fortuna\r~~Lyrics~~\rFrases random\rOtros")
    .addField("Añadir comandos de busqueda","~~Youtube~~/Descargar audio de los videos\rImagenes\r~~Estadisticas de osu~~\rPokedex\rClima\rWikipedia :thinking:\rOtros")
    .addField("Añadir comandos generales","~~Userinfo\rBotinfo~~\r~~Avatar (Todos los bots lo tienen, yo solo quiero ser popular :c)~~\rCalculadora :thinking:\rRecordador\rOtros")
    .addField("Mejorar comandos actuales","~~Ping (Que muestre el ping y no solo diga *Pong*)\rCaracola (Colocar las respuestas en un formato mas bonito)\rKick (Que diga cosas diferentes al kickear usuarios del servidor~~\rTalk (Hacer que Diana responda de inmediato)\rAvatar (colocarle un formato más bonito)")
    .setTimestamp()
    message.channel.send({
      embed
    })
  }
  if (command === "osu") {
		let args = message.content.split(' ').slice(1);
		let ur = args.slice(1).join(' ');
		let md = args[0];
		if (!md) return message.channel.send("Escribe un modo de juego: `&osu ctb CircusRockS`");
		if (!ur) return message.channel.send("Escribe un nombre de usuario: `&osu ctb CircusRockS`");
		if (md === "std" || md === "taiko" || md === "ctb" || md === "mania") {
			if (md === "std") md = 0
			if (md === "taiko") md = 1
			if (md === "ctb") md = 2
			if (md === "mania") md = 3
			osu.give_key('167deeafb500d910ab446a46e53ffa1b44c935a9');
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
    if (message.author.id !== config.ownerID) return message.channel.send("Tú no me das ordenes.");
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
  if (command === "nakido") {
    if (message.author.id !== config.nakido) return message.channel.send("No eres nakido.");
    message.channel.send("Bueno.");
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
    if (!args) return message.channel.send("Escribe un titulo para buscarlo `&yt Circus Monster Mayu`");
    youtube.searchVideos(args, 1)
      .then(results => {
	    message.channel.send("*"+message.author.username+"-sama* busqué en youtube `"+args+"` y encontré esto:\n"+results[0].url);
     });
  }
  if (command === "spray") {
    if (message.mentions.users.size < 1) return message.channel.send("Menciona a un usuario: `&spray @diana#1961`");
    message.channel.send("*Toma un spray con agua y moja a "+message.mentions.users.first()+"* ¡Gato Malo!")
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
      if (message.mentions.users.size < 1) return message.channel.send("Menciona a un usuario: `&bautizar @diana#1961`");
    message.channel.send("*Toma un sobre de tang y lo rocia sobre "+message.mentions.users.first()+"* **Has sido bendecido.**")
  }
  if (command === "setavatar") {
		const content = message.content.split(' ').slice(1);
		const avatar = content.join(' ');
		if (!avatar) return message.channel.send("Envia un enlace de imagen para ponerme.");
			if (message.author.id !== config.ownerID) return message.channel.send("Tú no me das ordenes.");
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
		if(!args) return message.channel.send('Debes añadir una confesión para enviarla.');
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
      message.channel.send(message.author.avatarURL);
    }else{
      message.channel.send(usera.avatarURL);
    }
  }
  if (command === "play") {
    if (queue[message.guild.id] === undefined) return message.channel.send("Agrega canciones a la lista primero con `&add`");
    if (!message.guild.voiceConnection) return command.join(message).then(() => command.play(message));
    if (queue[message.guild.id].playing) return message.channel.sendMessage("Ya está reproduciendo una canción");
    let dispatcher;
    queue[message.guild.id].playing = true;
    
    console.log(queue);
    (function play(song) {
      console.log(song);
      if (song === undefined) return message.channel.sendMessage("La lista de repruducción está vacia.").then(() => {
        queue[message.guild.id].playing = false;
        message.member.voiceChannel.leave();
      });
      message.channel.sendMessage(`Reproduciendo: **${song.title}** Pedida por **${song.requester}**`);
      dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : config.passes });
      let collector = message.channel.createCollector(m => m);
      collector.on('message', m => {
        if (m.content.startsWith(config.prefix + 'pause')){
          message.channel.sendMessage('Pausando...').then(() => {dispatcher.pause();});
        } else if (m.content.startsWith(config.prefix + 'resume')){
          message.channel.sendMessage('Reproduciendo...').then(() => {dispatcher.resume();});
        } else if (m.content.startsWith(config.prefix + 'skip')){
          message.channel.sendMessage('Saltado...').then(() => {dispatcher.end();});
        } else if (m.content.startsWith(config.prefix + 'time')){
          message.channel.sendMessage(`Tiempo: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
        }
      });
      dispatcher.on('end', () => {
        collector.stop();
        play(queue[message.guild.id].songs.shift());
      });
      dispatcher.on('error', (err) => {
        return message.channel.sendMessage('error: ' + err).then(() => {
          collector.stop();
          play(queue[message.guild.id].songs.shift());
        });
      });
    })(queue[message.guild.id].songs.shift());
  }
  if (command === "join") {
    return new Promise((resolve, reject) => {
      const voiceChannel = message.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('No me puedo unir a tu canal de voz...');
      voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
  }
  if (command === "add") {
    const content = message.content.split(' ').slice(1);
    const args = content.join(' ');
    if (!args) return message.channel.send("Escribe un titulo para buscarlo `&yt Circus Monster Mayu`");
    youtube.searchVideos(args, 1)
      .then(results => {
      let url = results[0].url
      yt.getInfo(url, (err, info) => {
        if(err) return message.channel.sendMessage('El enlace de youtube es invalido: ' + err);
        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
        queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
        message.channel.sendMessage(`**${info.title}** ha sido añadido a la lista de repruducción`);
      });
    });
  }
    if (command === "queue") {
      if (queue[message.guild.id] === undefined) return message.channel.sendMessage(`Añade canciones a la lista de reproducción primero.`);
      let tosend = [];
      queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Solicitado por: ${song.requester}`);});
      message.channel.sendMessage(`__**Lista de reproducción de ${message.guild.name}**__ **${tosend.length}** Canciones en espera ${(tosend.length > 15 ? '*[Solo se muestran las siguientes 15]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
    }
  if (command === "leave"){
    message.member.voiceChannel.leave()
  }
});
