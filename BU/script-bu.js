document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const cannon = document.getElementById('cannon');
    let cannonPosition = window.innerWidth / 2 - 25; // Centrar el cañón
    const cannonSpeed = 5;
    const keysPressed = {};

    function updateCannonPosition() {
        if (keysPressed['ArrowLeft']) {
            cannonPosition -= cannonSpeed;
            if (cannonPosition < 0) cannonPosition = 0;
        }
        if (keysPressed['ArrowRight']) {
            cannonPosition += cannonSpeed;
            if (cannonPosition > window.innerWidth - 50) cannonPosition = window.innerWidth - 50;
        }
        cannon.style.left = `${cannonPosition}px`;
        requestAnimationFrame(updateCannonPosition);
    }

    function shoot() {
        const projectile = document.createElement('div');
        projectile.classList.add('projectile');
        projectile.style.left = `${cannonPosition + 25}px`;
        gameContainer.appendChild(projectile);
        moveProjectile(projectile);
    }

    function moveProjectile(projectile) {
        let position = 50; // Posición inicial del proyectil
        function frame() {
            position += 2;
            projectile.style.bottom = `${position}px`;
            if (position > window.innerHeight) {
                projectile.remove();
            } else {
                requestAnimationFrame(frame);
            }
        }
        requestAnimationFrame(frame);
    }

    function keyDownHandler(event) {
        keysPressed[event.key] = true;
        if (event.key === ' ') {
            shoot();
            event.preventDefault(); // Evita el desplazamiento de la página con la barra espaciadora
        }
    }

    function keyUpHandler(event) {
        keysPressed[event.key] = false;
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Iniciar la animación del cañón
    requestAnimationFrame(updateCannonPosition);
});
