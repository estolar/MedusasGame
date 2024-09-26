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
  // Actualizamos las rutas de los sonidos a la nueva estructura
  var shootSound = new Audio('assets/audio/laser-gun.mp3');
  var alienShipSound = new Audio('assets/audio/nave-fly.mp3');
  var lifeLostSound = new Audio('assets/audio/life-left.mp3');
  var alienDestructionSound = new Audio('assets/audio/crush.mp3');
  var backgroundMusic = new Audio('assets/audio/song.mp3');
  var isGamePaused = false;
  var isMusicPlaying = true; // Asume que la música comienza tocando
  var shotCount = 0;
  var canShoot = true;
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
          isGamePaused = true;
          clearInterval(alienInterval);
          clearInterval(moveAliensInterval);
          cancelAnimationFrame(requestId);
          pauseBackgroundMusic();
          pauseScreen.style.display = 'flex'; // Muestra el contenedor de pausa
          gameContainer.style.backgroundColor = '#D3D3D3'; // Cambia el color de fondo a gris claro
      } else {
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
          backgroundMusic.play();
          alienInterval = setInterval(createAlien, 3000);
          moveAliensInterval = setInterval(moveAliens, 60);
          isGamePaused = false;
      }
  }

  function startAlienInvasion() {
      clearInterval(alienInterval);
      clearInterval(moveAliensInterval);
      alienInterval = setInterval(createAlien, 3000); // Crear aliens cada 3 segundos
      moveAliensInterval = setInterval(moveAliens, 60); // Mueve los aliens cada 60ms
  }

  function playShootSound() {
      shootSound.play();
  }

  function playAlienShipSound() {
      alienShipSound.play();
  }

  function playLifeLostSound() {
      lifeLostSound.play();
  }

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
          const projectile = document.createElement('div');
          projectile.classList.add('projectile');
          playShootSound();
          projectile.style.left = `${cannonPosition - 2.5}px`;
          gameContainer.appendChild(projectile);
          projectiles.push(projectile);
          moveProjectile(projectile);
          shotCount++;
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
      alien.style.top = '0px';
      alien.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
      playAlienShipSound();
      gameContainer.appendChild(alien);
      aliens.push(alien);
  }

  function moveAliens() {
      if (!isGamePaused) {
          aliens.forEach((alien, index) => {
              const currentTop = parseInt(alien.style.top, 10);
              alien.style.top = `${currentTop + alienSpeed}px`;
              if (currentTop > window.innerHeight) {
                  alien.remove();
                  aliens.splice(index, 1);
                  loseLife();
              }
          });
      }
  }

  function keyDownHandler(event) {
      if (event.key === 'p' || event.key === 'P') {
          togglePause();
      } else {
          keysPressed[event.key] = true;
          if (event.key === ' ' && !isGamePaused) {
              shoot();
              event.preventDefault();
          }
      }
  }

  function keyUpHandler(event) {
      if (event.key === ' ') {
          canShoot = true;
          shotCount = 0;
      }
      keysPressed[event.key] = false;
  }

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  requestAnimationFrame(function gameLoop() {
      updateCannonPosition();
      requestAnimationFrame(gameLoop);
  });

  function updateScore(points) {
      score += points;
      document.getElementById('score').textContent = `Score: ${score}`;
      if (score >= 1000) {
          endGame(true);
      }
  }

  function loseLife() {
      lives -= 1;
      document.getElementById('lives').textContent = `Lives: ${lives}`;
      playLifeLostSound();
      gameContainer.classList.add('flash-red');
      setTimeout(() => {
          gameContainer.classList.remove('flash-red');
      }, 4000);
      if (lives <= 0) {
          endGame();
      }
  }

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
      if (victory) {
          showVictoryScreen();
      } else {
          showEndScreen();
      }
  }

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
