document.addEventListener('DOMContentLoaded', () => {
    // Select the container for the Three.js canvas
    const canvasContainer = document.getElementById('water-canvas-container');

    // Create the Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Create Plane Geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x80dfff, // Soft water-like color
        side: THREE.DoubleSide,
        flatShading: false,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Lay flat
    scene.add(plane);

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Simulates sunlight
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Position the Camera
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Mouse Position Tracking
    const mouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', (event) => {
        const rect = canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalize to [-1, 1]
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // Normalize to [-1, 1]
    });

    // Animate Waves on the Plane with Mouse Interaction
    const clock = new THREE.Clock();

    function animateWaves() {
        const time = clock.getElapsedTime();
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];

            // Apply mouse interaction for ripples
            const distance = Math.sqrt(
                (mouse.x * 5 - x) ** 2 + (mouse.y * 5 - y) ** 2
            );
            const rippleEffect = Math.exp(-(distance ** 2)) * Math.sin(2 * Math.PI * (distance - time * 2));

            positions[i + 2] = 0.5 * Math.sin(x * 2 + time) + 0.25 * Math.cos(y * 3 + time) + rippleEffect;
        }

        geometry.attributes.position.needsUpdate = true; // Notify Three.js of changes
    }

    // Render and Animate the Scene
    function animate() {
        requestAnimationFrame(animate);
        animateWaves();
        renderer.render(scene, camera);
    }

    // Adjust Canvas Size on Window Resize
    window.addEventListener('resize', () => {
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Start the Animation Loop
    animate();
});

// Function to calculate the brightness of an element's background
function getBackgroundBrightness(element) {
    const bgColor = window.getComputedStyle(element).backgroundColor;
    const rgb = bgColor.match(/\d+/g);
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);

    // Calculate brightness using a formula
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return brightness;
}

// Function to toggle navbar color based on brightness of background
function updateNavbarColor() {
    const navbar = document.querySelector('.navbar');
    const body = document.querySelector('body'); // Assuming you want to check the body background
    const brightness = getBackgroundBrightness(body);

    // If brightness is greater than 128, it's a light background, so use dark navbar
    if (brightness > 128) {
        navbar.classList.remove('navbar-dark');
        navbar.classList.add('navbar-light');
    } else {
        navbar.classList.remove('navbar-light');
        navbar.classList.add('navbar-dark');
    }
}

// Run on load and when the window is resized
window.addEventListener('load', updateNavbarColor);
window.addEventListener('resize', updateNavbarColor);
