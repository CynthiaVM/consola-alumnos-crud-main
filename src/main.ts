import readline from 'readline'; //se usa para hacer preguntas en consola
import axios from 'axios'; // se usa para hacer solicitudes como en este caso a la app
import { Pokemon } from './pokemon.interface';
import fs from 'fs'; // para escribir datos en archivo

console.log('Preguntas de Pokémon');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}); 
//Con esto se crea una interfaz de lectura utilizando el módulo readline. 
//Esto permite hacer preguntas al usuario en la consola y recibir respuestas.

const consultas: Pokemon[] = []; // Array para almacenar las consultas de Pokémon

const hacerPreguntaPokemon = () => {
	rl.question('¿Qué Pokémon te gusta? (o escribe "salir" para terminar): ', (pokemon) => {
	  if (pokemon.toLowerCase() === 'salir') {
		// Si el usuario escribe "salir", muestra las consultas realizadas y termina el programa
		mostrarConsultas();
		rl.close();
	  } else {
		buscarPokemon(pokemon);
	  }
	});
  };
//Esta función utiliza rl.question para hacer la pregunta sobre el Pokémon. 
//despues se llama a la función buscarPokemon con la respuesta ingresada por el usuario.

const buscarPokemon = (pokemon: string) => {
  axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
    .then(response => {
      const pokemonData: Pokemon = {
        name: response.data.name,
        abilities: response.data.abilities.map((ability: any) => ability.ability.name),
      };

       // Guarda info en el array de consultas
      consultas.push(pokemonData);

      console.log(`Información del Pokémon:`, pokemonData);

      // Hacer la siguiente pregunta
      hacerPreguntaPokemon();
    })
    .catch(error => {
      console.error('No se encontró el Pokémon.');
      hacerPreguntaPokemon(); // Hacer la siguiente pregunta
    });
};
const mostrarConsultas = () => {
	console.log('Consultas realizadas:');
	console.log(consultas);
	// Guardar las consultas en un archivo (opcional)
	guardarConsultasEnArchivo();
  };
  
 //Esta función realiza una solicitud GET a la API de Pokémon (https://pokeapi.co/api/v2/pokemon/) con el nombre del Pokémon ingresado como parte de la URL. 
//Despues utiliza la respuesta de la API para crear un objeto pokemonData con el nombre del Pokémon,habilidades. 
//El objeto pokemonData sigue la estructura definida en la interfaz Pokemon.
//Después de obtener los datos del Pokémon, la función llama a guardarConsultasEnArchivo() para guardar la información en un archivo
//y despues muestra los datos del Pokémon en la consola.

const guardarConsultasEnArchivo = () => {
	const contenido = JSON.stringify(consultas, null, 2);
	fs.writeFile('consultas_pokemon.json', contenido, (err) => {
	  if (err) {
		console.error('Error al guardar las consultas:', err);
	  } else {
		console.log('Las consultas se han guardado en consultas_pokemon.json');
	  }
	});
  };
  
//Esta función recibe los datos del Pokémon (pokemonData)  y los convierte en formato JSON utilizando JSON.stringify(). 
//Despues utiliza fs.writeFile() para escribir el JSON en un archivo llamado pokemon_data.json.
//Si surge algún error durante la escritura del archivo, se muestra un mensaje de error en la consola sino se muestra un mensaje de éxito.

hacerPreguntaPokemon();

//se llama a la función hacerPreguntaPokemon() para iniciar el proceso de preguntar.

//el programa permite ingresar el nombre de un Pokémon, hace una solicitud a la API de Pokémon para obtener info sobre ese Pokémon y despues muestra las habilidades en consola.
//Además guarda la info del Pokémon en el archivo pokemon_data.json.

//rl.close() se llama al final para cerrar la interfaz de lectura de línea y finalizar el programa.