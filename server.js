const express = require ('express');
const bodyParser= require ('body-parser');
const cors= require ('cors');
var bcrypt = require('bcryptjs');

//script imports
const register = require ('./controllers/register.js');

const app =  express();

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'nanob99311',
    database : 'bot-brain'
  }
});


app.use(bodyParser.json());
app.use(cors());


const database = {
			users:[
				{
					id:'1',
					name:'Prahas',
					email:'prahas@nanobotz.lk',
					password:'nb1',
					entries:0,
					joined: new Date()
				},
				{
					id:'2',
					name:'Dinuka',
					email:'dinuka@nanobotz.lk',
					password:'nb2',
					entries:0,
					joined: new Date()
				}
			]
}

app.get('/', (req,res) => {
	res.send(database.users);
})

app.post('/SignIn', (req,res) => {
	
	db.select('*').from('login').where('email','=',req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid){
			return db.select('*').from('users').where('id','=',data[0].id)
			.then (user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('unable to get user'));
		}else{
			 res.status(400).json('Incorrect Credentials');
		}
	}).catch(err => res.status(400).json('Incorrect Credentials'));
	//res.json('SignIn');
})

app.post('/Register', (req,res) => { register.handleRegister(req,res,db,bcrypt) });

app.get('/Profile/:id' , (req,res) => {
	const {id} = req.params;
	
	db.select('*').from('users').where({
		id:id
	}).then( user => {
		if(user.length){
			res.json(user[0])
		}else{
			res.status(400).json('not found');
		}
	}).catch(res.status(400).json('Error Getting User'));
	

})

app.put('/Image' , (req,res) => {
	const {id} = req.body;
	
	db('users').where({id:id}).increment('entries',1).returning('entries')
	.then(entries => res.json(entries[0]))
	.catch(err => res.status(400).json('unable to get entries'));
	

})

app.listen(3000 , () => {
	console.log('server running on 3000');
} )