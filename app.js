const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
const prefix = '*';
const memesbdd = require('./memes.json');
const firebase = require('firebase');
var firebaseConfig = {
apiKey: "AIzaSyBH93qqVoKXv6QLlQbI4gYUdqGg0KqPyzE",
authDomain: "chill-code.firebaseapp.com",
projectId: "chill-code",
storageBucket: "chill-code.appspot.com",
messagingSenderId: "964220540395",
appId: "1:964220540395:web:d27c7f8b88addb3d4135ae",
measurementId: "G-FGQNZSLDXQ"
};
  
firebase.initializeApp(firebaseConfig);
firebase.firestore();
const db = firebase.firestore();
const incrementu = firebase.firestore.FieldValue.increment(1);
const incrementc = firebase.firestore.FieldValue.increment(5);
bot.on('ready', () => {
	console.log('Bot Démarré');
	bot.user.setActivity('Chill \'N Code (*help)', { type: 'WATCHING' });
	bot.user.setStatus('online');
})
bot.on('guildMemberAdd', async(member) => {
	console.log(member.user.username + " has joined");
	if(!member.bot){
		try {
	console.log(member.user.username + " a rejoint le serveur");
	const embed = new Discord.MessageEmbed()
	.setTitle("Bienvenue " + member.user.username + " !")
	.setImage('https://i.imgur.com/Kbl451j.gif')
	.setDescription("__**Voici quelques informations utiles :**__")
	.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: '<:channel:840513546416554045> **Règlement**', value: 'Nous T\'invitions à lire le [règlement](https://discord.com/channels/836947422122344448/836947422173200410/836962049484390449)', inline: false },
		{ name: '<:add_reaction:840512848266657792> **Rôles**', value: 'Tu peux prendre tes rôles [ici](https://discord.com/channels/836947422122344448/836947422617141290/837022973830496286)', inline: false },
		{ name: '<:moderation:840528469317517333> **Devenir Staff**', value: 'Tu peux devenir staff [ici](https://forms.gle/rGV26bZytcx5atG28)', inline: false },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Github', value: '[Github](https://github.com/chillncode)', inline: false },
		{ name: 'Twitter', value: '[Twitter](https://twitter.com/ChillNCode1)', inline: false }
	)
	.setFooter('Chill \'N Code', 'https://cdn.discordapp.com/icons/836947422122344448/d27317d317a5b260d0365f6ca0da5455.png');
	member.send(embed);
	console.log("message envoyé");
		}
		catch (error) {
			console.error(error);
		  }
}

})

bot.on('message', async(msg) => {
	const docuserRef = db.collection('members').doc(msg.author.id);
	docuserRef.get()
	.then((doc) => {
		if(doc.exists){
		  db.collection('members').doc(msg.author.id).update({
			 messages: incrementu,
			 chillpoints: incrementc
		  })
		}
		else{
		  const embed = new Discord.MessageEmbed()
		  .setTitle('Activation Réussie :white_check_mark:')
		  .setColor(0x00FF00)
		  .setDescription("Grâce à votre premier message, vous venez d'activer le système de monnaie :upside_down:");
			msg.member.send(embed);
		  docuserRef.set({
			  id: msg.author.id,
			  username: msg.author.username,
			  contributions: 0,
			  chillpoints: 0,
			  messages: 1,
			  invitations: 0,
			  services: 0
		  })
		}
	})
	if(msg.content === prefix + "balance"){
		docuserRef.get()
		.then((doc) => {
		  const embed = new Discord.MessageEmbed()
		  .setTitle(`Balance de ${msg.author.username}#${msg.author.discriminator} :moneybag:`)
		  .setColor(0x00ff00)
		  .setDescription("Voici les montants de messages, de chillpoints et d'invitations et contribution que vous avez :")
		  .setThumbnail(msg.author.avatarURL())
		  .addFields(
			  { name: '\u200B', value: '\u200B' },
			  { name: 'Messages', value: doc.data().messages + " messages", inline: false },
			  { name: 'Chill\'Points', value: doc.data().chillpoints + " chill'points", inline: false },
			  { name: 'Contributions', value: doc.data().contributions + " contributions", inline: false },
			  { name: 'Invitations', value: doc.data().invitations + " invitations", inline: false }
		  )
			msg.channel.send(embed)
		})
		if(msg.content.startsWith(prefix + "addpoints")){
			let mention = msg.mentions.members.first();
			let args = msg.content.split(" ");
		   if(msg.member.hasPermission('ADMINISTRATOR')){
			   db.collection('members').doc(mention.id).update({
			   chillpoints: firebase.firestore.FieldValue.increment(args[2])
			   })
			   .then(() => {
				  const embed = new Discord.MessageEmbed()
				  .setTitle(`Opération Réussie :white_check_mark:`)
				  .setColor(0x00FF00)
			  .setDescription(`Le montant a été ajouté avec succès !`)
				   msg.channel.send(embed);
				   if(mention === undefined){
					   msg.channel.send("Vvous n'avez mentionné personne");
				   }
			   })
		   }
		   else {
			  const embed = new Discord.MessageEmbed()
			  .setTitle(`Échec de l'Opération :negative_squared_cross_mark:`)
			  .setColor(0xff0000)
		  .setDescription(`Vous n'avez pas les permissions nécessaires pour faire cette action`)
			   msg.channel.send(embed);
		   }
		}
	}
	if(msg.content === prefix + "meme"){
		var counter = 0;
		memesbdd.forEach(file => {
			counter++
			
		})
		random = Math.floor(Math.random() * counter);
		msg.channel.send({files: [`./memes/${memesbdd[random]}`]});
		msg.channel.send("Voici Un Même tout frais");
	}
	if(msg.content.startsWith(prefix + "embed")){
		if(msg.member.hasPermission('ADMINISTRATOR')){
		let mention = msg.mentions.channels.first();
		let message = msg.content.split(" ");
		if(mention === undefined){
			msg.reply("Vous devez mentionner un salon")
		}else {
		const embed = new Discord.MessageEmbed()
		.setTitle("Nouveau Message")
		.setDescription(message.slice(2).join(' '))
		.setTimestamp()
		.setFooter("Envoyé depuis Chill 'N Code", "https://www.discordl.org/icons/8/836947422122344448/1777e03a2942747425161766b143825c.png")
		bot.channels.cache.get(mention.id).send(embed);
	}
	}
}
if(msg.content.startsWith(prefix + "dm")){
	if(msg.member.hasPermission('ADMINISTRATOR')){
 let mention = msg.mentions.members.first();
 let message = msg.content.split(" ");

 const embed = new Discord.MessageEmbed()
 .setAuthor(msg.author.username + "#" + msg.author.discriminator)
 .setTitle("Nouveau Message")
 .setDescription(message.slice(2).join(' '))
 .setTimestamp()
 .setFooter("Envoyé depuis Chill 'N Code", "https://www.discordl.org/icons/8/836947422122344448/1777e03a2942747425161766b143825c.png")
 mention.send(embed);
 const sembed = new Discord.MessageEmbed()
		.setDescription("<:success:840514717515776020> Message envoyé avec succès")
	    .setColor("#00FF00")
msg.channel.send(sembed);
	}
	else {
		const embed = new Discord.MessageEmbed()
		.setDescription("<:fail:840513592368955424> Vous n'avez pas la permission de faire ça")
	    .setColor("#FF0000")
		msg.channel.send(embed);
	}
}
if(msg.channel.id === "836947422886363148"){
	msg.react("840514717515776020");
	msg.react("840513592368955424");
}
if(msg.content.startsWith(prefix + "débat")){
	let sujet = msg.content.split(" ");
	const embed = new Discord.MessageEmbed()
	.setTitle("Nouveau Débat")
	.setDescription(sujet.slice(1).join(' '))
	.setTimestamp()
	.setFooter("Envoyé depuis Chill 'N Code", "https://www.discordl.org/icons/8/836947422122344448/1777e03a2942747425161766b143825c.png")
	msg.reply("Débat Lancé");
	bot.channels.cache.get("845700686745436170").send(embed);
	console.log("Débat Lancé par " + msg.author.id);
}
if(msg.content === prefix + "certif"){
	const embed = new Discord.MessageEmbed()
	.setDescription("Veuillez remplir ce formulaire : https://forms.gle/rGV26bZytcx5atG28")
	.setColor("#00FF00")
	msg.channel.send(embed);
}

})
  bot.login(config.token);