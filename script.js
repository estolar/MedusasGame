document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const cannon = document.getElementById('cannon');
    const startScreen = document.getElementById('start-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    let cannonPosition = window.innerWidth / 2 - 25; // Centrar el cañón
    const cannonSpeed = 2.5;
    const keysPressed = {};
    const projectiles = [];
    const aliens = [];
    const alienSpeed = 1; // Puedes ajustar la velocidad
    let score = 0;
    let lives = 3;
	let alienInterval;
	let moveAliensInterval; 
	var shootSound = new Audio('laser-gun.mp3'); // Cargar el efecto de sonido
	var alienShipSound = new Audio('nave-fly.mp3'); // Cargar el efecto de sonido de la nave enemiga
	var lifeLostSound = new Audio('life-left.mp3'); // Cargar el efecto de sonido de pérdida de vida
	var alienDestructionSound = new Audio('crush.mp3'); // Cargar el efecto de sonido de la destrucción de la nave alienígena
	var backgroundMusic = new Audio('song.mp3');
	var isGamePaused = false;
	var isMusicPlaying = true; // Asume que la música comienza tocando
	var shotCount = 0;
	var canShoot = true;
	// Asegúrate de definir la variable requestId globalmente
	let requestId = null;
	backgroundMusic.loop = true; // Hace que la música se repita automáticamente
	backgroundMusic.volume = 0.5; // Establece el volumen a la mitad
	playBackgroundMusic();

	function showStoryScreen() {
		document.getElementById('story-screen').style.display = 'flex';
		document.getElementById('start-screen').style.display = 'none';
		gameContainer.style.display = 'none';
		endScreen.style.display = 'none';
	}

	
	function togglePause() {
	  const pauseScreen = document.getElementById('pause-screen');
	  const gameContainer = document.getElementById('game-container');
	  
	  if (!isGamePaused) {
		// Pausar el juego
		isGamePaused = true;
		clearInterval(alienInterval);
		clearInterval(moveAliensInterval);
		cancelAnimationFrame(requestId);
		pauseBackgroundMusic();
		pauseScreen.style.display = 'flex'; // Muestra el contenedor de pausa
		gameContainer.style.backgroundColor = '#D3D3D3'; // Cambia el color de fondo a gris claro
	  } else {
		// Reanudar el juego
		isGamePaused = false;
		alienInterval = setInterval(createAlien, 3000);
		moveAliensInterval = setInterval(moveAliens, 60);
		requestId = requestAnimationFrame(gameLoop);
		playBackgroundMusic();
		pauseScreen.style.display = 'none'; // Oculta el contenedor de pausa
		gameContainer.style.backgroundColor = ''; // Restablece el color de fondo original
	  }
	}

	function resumeGame() {
	  if (isGamePaused) {
		// Reanudar la música si es necesario
		backgroundMusic.play();
		// Restablecer los intervalos y reanudar la lógica del juego
		alienInterval = setInterval(createAlien, 3000);
		moveAliensInterval = setInterval(moveAliens, 60);
		// Reanudar cualquier otra animación o lógica del juego aquí
		isGamePaused = false;
	  }
	}	

	function startAlienInvasion() {
	  // Asegúrate de que no haya una invasión en curso antes de comenzar una nueva
	  clearInterval(alienInterval);
	  clearInterval(moveAliensInterval); // Limpia el intervalo previo si existe
	  
	  alienInterval = setInterval(createAlien, 3000); // Continúa creando aliens cada 3 segundos
	  moveAliensInterval = setInterval(moveAliens, 60); // Mueve los aliens cada 60ms
	}
	
	// Función para reproducir el sonido
	function playShootSound() {
	  shootSound.play();
	}

	// Función para reproducir el sonido de la nave enemiga
	function playAlienShipSound() {
	  alienShipSound.play();
	}

	// Función para reproducir el sonido de pérdida de vida
	function playLifeLostSound() {
	  lifeLostSound.play();
	}
	// Función para reproducir el sonido de la destrucción de la nave alienígena
	function playAlienDestructionSound() {
	  alienDestructionSound.play();
	}

	function playBackgroundMusic() {
	  backgroundMusic.play();
	}

	function pauseBackgroundMusic() {
	  backgroundMusic.pause();
	}


    function showStartScreen() {
        startScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
        endScreen.style.display = 'none';
    }
	
    function showEndScreen() {
        endScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
    }

    function startGame() {
        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        // Restablece las variables del juego y comienza la lógica del juego
        score = 0;
        lives = 3;
		playBackgroundMusic();
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('lives').textContent = `Lives: ${lives}`;
        startAlienInvasion();
        requestAnimationFrame(gameLoop);
    }


    function updateCannonPosition() {
        if (keysPressed['ArrowLeft'] && cannonPosition > 0) {
            cannonPosition -= cannonSpeed;
        }
        if (keysPressed['ArrowRight'] && cannonPosition < (window.innerWidth - 50)) {
            cannonPosition += cannonSpeed;
        }
        cannon.style.left = `${cannonPosition}px`;
    }

	function shoot() {
	if (canShoot && shotCount < 10) {
		// ...código existente para crear y mover el proyectil...
		const projectile = document.createElement('div');
		projectile.classList.add('projectile');
		playShootSound(); // Llamar a esta función cada vez que el jugador dispara
		// Centrar el proyectil en el cañón, ajustando solo por la mitad del ancho del proyectil
		projectile.style.left = `${cannonPosition - 2.5}px`; // Restamos 2.5px que es la mitad del ancho del proyectil
		gameContainer.appendChild(projectile);
		projectiles.push(projectile);
		moveProjectile(projectile);
		shotCount++; // Incrementa el contador de disparos
	}		
		

	}

	
    function moveProjectile(projectile) {
        let position = 50;
        function frame() {
            position += 5;
            projectile.style.bottom = `${position}px`;
            if (position > window.innerHeight) {
                projectile.remove();
                const index = projectiles.indexOf(projectile);
                if (index > -1) {
                    projectiles.splice(index, 1);
                }
            } else {
                requestAnimationFrame(frame);
            }
        }
        requestAnimationFrame(frame);
    }



	function createAlien() {
	  const alien = document.createElement('div');
	  alien.classList.add('alien');
	  // Establece la posición inicial en la parte superior y una posición horizontal aleatoria dentro del contenedor
	  alien.style.top = '0px';
	  alien.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
	  playAlienShipSound();
	  gameContainer.appendChild(alien);
	  aliens.push(alien);
	  
	}

	function moveAliens() {
		if (!isGamePaused) {
			// Lógica para mover aliens aquí
			console.log('Velocidad de los aliens: ' + alienSpeed + 'px por intervalo'); // Muestra la velocidad actual
			aliens.forEach((alien, index) => {
				const currentTop = parseInt(alien.style.top, 10);
				alien.style.top = `${currentTop + alienSpeed}px`;

			// Si el alien llega al fondo de la pantalla, elimínalo y resta una vida
				if (currentTop > window.innerHeight) {
				  alien.remove();
				  aliens.splice(index, 1);
				  loseLife();
			}
			});			
		}

	}

 /*   function keyDownHandler(event) {
        keysPressed[event.key] = true;
        if (event.key === ' ') {
            shoot();
            event.preventDefault(); // Evita el desplazamiento de la página con la barra espaciadora
        }
    }*/

	function keyDownHandler(event) {
	  if (event.key === 'p' || event.key === 'P') {
		togglePause();
	  } else {
		keysPressed[event.key] = true;
		if (event.key === ' ' && !isGamePaused) {
		  shoot();
		  event.preventDefault(); // Evita el desplazamiento de la página con la barra espaciadora
		}
	  }
	}	

    function keyUpHandler(event) {
		if (event.key === ' ') {
			canShoot = true; // Permite que el jugador dispare de nuevo
			shotCount = 0; // Resetear el contador de disparos
		}		
        keysPressed[event.key] = false;
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Iniciar la animación del cañón
    requestAnimationFrame(function gameLoop() {
        updateCannonPosition();
        requestAnimationFrame(gameLoop);
    });

    // Iniciar la invasión alienígena

	
	// Asumiendo que ya tienes el resto del código de la configuración del juego...





    function updateCannonPosition() {
        const cannonWidth = 50; // Asegúrate de que esto coincida con el ancho del cañón en CSS
        if (keysPressed['ArrowLeft']) {
            cannonPosition -= cannonSpeed;
            if (cannonPosition < -cannonWidth) {
                cannonPosition = window.innerWidth;
            }
        }
        if (keysPressed['ArrowRight']) {
            cannonPosition += cannonSpeed;
            if (cannonPosition > window.innerWidth) {
                cannonPosition = -cannonWidth;
            }
        }
        cannon.style.left = `${cannonPosition}px`;
    }
	
	function updateScore(points) {
		score += points;
		document.getElementById('score').textContent = `Score: ${score}`;
		// Verifica si el jugador alcanzó 200 puntos
		if (score >= 1000) {
			endGame(true); // Añade un nuevo argumento para indicar una victoria
		}	
	}
	

	function loseLife() {
		lives -= 1;
		document.getElementById('lives').textContent = `Lives: ${lives}`;
		playLifeLostSound(); // Reproduce el sonido cuando se pierde una vida
		// Agrega la clase para cambiar el fondo a rojo y negro
		gameContainer.classList.add('flash-red');

		// Después de 5 segundos, quita la clase para volver al fondo original
		setTimeout(() => {
			gameContainer.classList.remove('flash-red');
		}, 4000);
	
		// Verificar si el juego ha terminado
		if (lives <= 0) {
			endGame();
		}
	}

	// Modifica la función endGame para manejar una victoria
	function endGame(victory = false) {
	  clearInterval(alienInterval);
	  clearInterval(moveAliensInterval);
	  aliens.forEach(alien => alien.remove());
	  projectiles.forEach(projectile => projectile.remove());
	  aliens.length = 0;
	  projectiles.length = 0;
	  document.removeEventListener('keydown', keyDownHandler);
	  document.removeEventListener('keyup', keyUpHandler);
	  pauseBackgroundMusic();
	  // Si el jugador ganó, muestra la pantalla de felicitación y solicita las iniciales
	  if (victory) {
		showVictoryScreen(); // Mostrará la imagen de felicitación y pedirá las iniciales
	  } else {
		showEndScreen();
	  }
	}
	


	function showVictoryScreen() {
	  // Crear el contenedor de la pantalla de victoria
	  const victoryScreen = document.createElement('div');
	  victoryScreen.id = 'victory-screen';
	  
	  // Crear y añadir la imagen de felicitación
	  const victoryImage = document.createElement('img');
	  victoryImage.src = 'victoria-game.png';
	  victoryImage.alt = 'Congratulations!';
	  victoryScreen.appendChild(victoryImage);
	  
	  // Crear y añadir el botón de continuar
	  const continueButton = document.createElement('button');
	  continueButton.textContent = 'Continue';
	  continueButton.classList.add('continue-button');
	  continueButton.onclick = function() {
		// Lógica para continuar el juego o reiniciar
		victoryScreen.style.display = 'none'; // Esconde la pantalla de victoria
		restartGame(); // Llama a la función que reinicia el juego
	  };
	  victoryScreen.appendChild(continueButton);

	  // Añadir la pantalla de victoria al DOM y mostrarla
	  document.body.appendChild(victoryScreen);
	  
	  // Pide al jugador que ingrese sus iniciales
	  const initials = prompt('Congratulations! Enter your initials:');
	  if (initials) {
		saveInitials(initials);
	  }
	}



	function checkCannonCollisions() {
		const cannonRect = cannon.getBoundingClientRect();

		aliens.forEach((alien, index) => {
			const alienRect = alien.getBoundingClientRect();

			// Verificar si los rectángulos del cañón y del alien se solapan
			if (
				alienRect.x < cannonRect.x + cannonRect.width &&
				alienRect.x + alienRect.width > cannonRect.x &&
				alienRect.y < cannonRect.y + cannonRect.height &&
				alienRect.height + alienRect.y > cannonRect.y
			) {
				// Colisión detectada, elimina el alien y quita una vida
				alien.remove();
				aliens.splice(index, 1);
				loseLife();
			}
		});
	}

	// Asegúrate de llamar a checkCannonCollisions en tu game loop

	// Modifica la función gameLoop para que detenga el loop si el juego está pausado
	function gameLoop() {
	  if (!isGamePaused) {
		updateCannonPosition();
		moveAliens();
		checkCannonCollisions();
		detectCollisions();
		requestId = requestAnimationFrame(gameLoop);
	  }
	}	

	function restartGame() {
	  console.log('Reiniciando juego.');
	  clearInterval(alienInterval);
	  clearInterval(moveAliensInterval);
	  alienInterval = null;
	  moveAliensInterval = null;
	  // Simula la liberación de todas las teclas presionadas
	  Object.keys(keysPressed).forEach(key => {
		keysPressed[key] = false;
	  });

	  // Restablece las variables del juego
	  score = 0;
	  lives = 3;
	  cannonPosition = window.innerWidth / 2 - 25; // Centrar el cañón
	  
	  // Actualiza el HUD
	  document.getElementById('score').textContent = `Score: ${score}`;
	  document.getElementById('lives').textContent = `Lives: ${lives}`;

	  // Restablece los proyectiles y aliens
	  projectiles.forEach(projectile => projectile.remove());
	  aliens.forEach(alien => alien.remove());
	  projectiles.length = 0;
	  aliens.length = 0;

	  // Reestablece los event listeners en caso de que hayan sido eliminados
	  document.addEventListener('keydown', keyDownHandler);
	  document.addEventListener('keyup', keyUpHandler);

	  // Comienza el juego de nuevo
	  startGame();
	}
	
	

/*	function detectCollisions() {
	  for (let i = projectiles.length - 1; i >= 0; i--) {
		const projectile = projectiles[i];
		const projectileRect = projectile.getBoundingClientRect();

		for (let j = aliens.length - 1; j >= 0; j--) {
		  const alien = aliens[j];
		  const alienRect = alien.getBoundingClientRect();

		  // Verificar si los rectángulos del proyectil y del alien se solapan
		  if (
			projectileRect.x < alienRect.x + alienRect.width &&
			projectileRect.x + projectileRect.width > alienRect.x &&
			projectileRect.y < alienRect.y + alienRect.height &&
			projectileRect.height + projectileRect.y > alienRect.y
		  ) {
			projectile.remove();
			alien.remove();
			projectiles.splice(i, 1);
			aliens.splice(j, 1);

			updateScore(10); // Incrementa la puntuación cada vez que se detecta una colisión
			break; // Salir del bucle interno una vez que se encuentra una colisión
		  }
		}
	  }
	}
*/

	function detectCollisions() {
	  for (let i = projectiles.length - 1; i >= 0; i--) {
		const projectile = projectiles[i];
		const projectileRect = projectile.getBoundingClientRect();

		for (let j = aliens.length - 1; j >= 0; j--) {
		  const alien = aliens[j];
		  const alienRect = alien.getBoundingClientRect();

		  // Verificar si los rectángulos del proyectil y del alien se solapan
		  if (
			projectileRect.x < alienRect.x + alienRect.width &&
			projectileRect.x + projectileRect.width > alienRect.x &&
			projectileRect.y < alienRect.y + alienRect.height &&
			projectileRect.height + projectileRect.y > alienRect.y
		  ) {
			// Reproduce el sonido de destrucción antes de eliminar los elementos
			playAlienDestructionSound();
			
			// Elimina el proyectil y el alien del DOM
			projectile.remove();
			alien.remove();
			
			// Elimina el proyectil y el alien de sus respectivos arrays
			projectiles.splice(i, 1);
			aliens.splice(j, 1);

			// Actualiza la puntuación
			updateScore(10);
			
			break; // Salir del bucle interno una vez que se encuentra una colisión
		  }
		}
	  }
	}
  // Event handler para el botón de empezar el juego en la pantalla de historia
  document.getElementById('start-game-button').addEventListener('click', function() {
    document.getElementById('story-screen').style.display = 'none';
    startGame();
  });

  // Cambia la llamada a showStartScreen() por showStoryScreen() al final de tu script
  showStoryScreen();

    // Añadir manejadores de eventos a los botones
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    // Mostrar pantalla de inicio cuando se carga la página
    showStartScreen();

	requestAnimationFrame(gameLoop);
	
});