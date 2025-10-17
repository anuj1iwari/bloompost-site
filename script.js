// --- MOCK DATA ---
const FLOWERS_DATA = {
    color: [
        { id: 'flower1', name: 'Pink Beauty', url: 'images/flow11.webp', quote: "Bloom with grace and kindness." },
        { id: 'flower2', name: 'Sunny Delight', url: 'images/flow22.webp', quote: "Radiate warmth and happiness." },
        { id: 'flower3', name: 'Gentle Love', url: 'images/flow33.webp', quote: "A symbol of love and fascination." },
        { id: 'flower4', name: 'Ocean Whisper', url: 'images/flow44.webp', quote: "Express your heartfelt emotions." },
        { id: 'flower5', name: 'Joyful Bloom', url: 'images/flow55.webp', quote: "Wishing you prosperity and joy." },
        { id: 'flower6', name: 'Vibrant Spirit', url: 'images/flow66.webp', quote: "Find your inner strength and shine." },
        { id: 'flower7', name: 'Deepest Passion', url: 'images/flow77.webp', quote: "A timeless message of the heart." },
        { id: 'flower8', name: 'Golden Hope', url: 'images/flow88.webp', quote: "Turn towards the light and grow." },
    ],
    bw: [
        { id: 'flower1', name: 'Classic Form', url: 'images/flow11.webp', quote: "Simplicity is the ultimate sophistication." },
        { id: 'flower2', name: 'Light & Shadow', url: 'images/flow22.webp', quote: "In black and white, the soul is revealed." },
        { id: 'flower3', name: 'Elegant Shape', url: 'images/flow33.webp', quote: "Elegance is about being remembered." },
        { id: 'flower4', name: 'Pure Beauty', url: 'images/flow44.webp', quote: "Beauty in its purest form." },
        { id: 'flower5', name: 'Timeless Gesture', url: 'images/flow55.webp', quote: "A classic gesture that never fades." },
        { id: 'flower6', name: 'Bold Lines', url: 'images/flow66.webp', quote: "Let light and shadow tell the story." },
        { id: 'flower7', name: 'Poetic Form', url: 'images/flow77.webp', quote: "Timeless beauty, endless emotion." },
        { id: 'flower8', name: 'Simple Joy', url: 'images/flow88.webp', quote: "Find joy in the simple things." },
    ]
};
const WRAPPER_DATA = [
    { id: 'wrapper1', name: 'Natural', url: 'images/flow-23.jpg' },
    { id: 'wrapper2', name: 'Elegant', url: 'images/flow24.jpg' },
    { id: 'wrapper3', name: 'Artistic', url: 'images/flow28.png' }
];

// --- GLOBAL STATE ---
let appState = {
    currentPage: 'landing',
    bouquetMode: 'color',
    selectedFlowers: [],
    selectedWrapper: WRAPPER_DATA[0],
    flowerArrangements: [],
    bouquetData: {}
};

// --- DOM ELEMENTS ---
const pages = { landing: document.getElementById('page-landing'), build: document.getElementById('page-build'), garden: document.getElementById('page-garden') };
const buildSteps = { select: document.getElementById('step-select'), arrangement: document.getElementById('step-arrangement'), message: document.getElementById('step-message') };
const flowerGrid = document.getElementById('flower-grid');
const counter = document.getElementById('selection-counter');
const nextButton = document.getElementById('next-button');
const messageForm = document.getElementById('message-form');
const submitButton = document.getElementById('submit-button');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');

// --- FUNCTIONS ---
function navigate(page) {
    Object.values(pages).forEach(p => { if (p.id !== 'page-garden') p.classList.add('hidden')});
    if (pages[page]) pages[page].classList.remove('hidden');
    appState.currentPage = page;
}

function startBuild(mode) {
    appState.bouquetMode = mode;
    appState.selectedFlowers = [];
    appState.selectedWrapper = WRAPPER_DATA[0];
    appState.flowerArrangements = [];
    if(mode === 'bw') {
        document.getElementById('page-build').classList.add('grayscale-mode');
    } else {
        document.getElementById('page-build').classList.remove('grayscale-mode');
    }
    renderFlowerGrid();
    updateCounter();
    goToSelectStep();
    navigate('build');
}

function renderFlowerGrid() {
    flowerGrid.innerHTML = '';
    const flowers = FLOWERS_DATA[appState.bouquetMode];
    flowers.forEach(flower => {
        const isSelected = appState.selectedFlowers.some(f => f.id === flower.id);
        const card = document.createElement('div');
        card.className = `group relative cursor-pointer rounded-lg transition-all duration-300 transform ${isSelected ? 'border-primary-accent scale-105 shadow-xl' : 'border-transparent hover:shadow-lg hover:-translate-y-2'}`;
        
        const placeholder = document.createElement('div');
        placeholder.className = 'aspect-square w-full img-placeholder rounded-lg';
        
        const img = document.createElement('img');
        img.src = flower.url;
        img.alt = flower.name;
        img.className = 'w-full h-auto object-contain rounded-lg opacity-0 transition-opacity duration-500';
        img.onload = () => {
            placeholder.classList.add('hidden');
            img.classList.remove('opacity-0');
        };

        const quoteDiv = document.createElement('div');
        quoteDiv.className = "absolute bottom-0 left-0 right-0 mb-2 p-2 bg-black/60 text-white text-xs text-center rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none";
        quoteDiv.textContent = flower.quote;
        
        const checkmarkDiv = document.createElement('div');
        if (isSelected) {
            checkmarkDiv.className = "absolute top-2 right-2 bg-[var(--primary-accent)] text-white rounded-full p-1 shadow-lg";
            checkmarkDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        }

        card.appendChild(placeholder);
        card.appendChild(img);
        card.appendChild(quoteDiv);
        card.appendChild(checkmarkDiv);
        
        card.onclick = () => handleSelectFlower(flower);
        flowerGrid.appendChild(card);
    });
}

function handleSelectFlower(flower) {
    const index = appState.selectedFlowers.findIndex(f => f.id === flower.id);
    if (index > -1) {
        appState.selectedFlowers.splice(index, 1);
    } else if (appState.selectedFlowers.length < 8) {
        appState.selectedFlowers.push(flower);
    }
    renderFlowerGrid();
    updateCounter();
}

function updateCounter() {
    const count = appState.selectedFlowers.length;
    counter.textContent = `${count} / 8 selected`;
    nextButton.disabled = count < 4 || count > 8;
}

function changeStep(stepToShow) {
     Object.values(buildSteps).forEach(step => step.classList.add('hidden'));
     buildSteps[stepToShow].classList.remove('hidden');
     const titles = {
         select: 'Step 1: Pick 4 to 8 blooms',
         arrangement: 'Step 2: Customize your bouquet',
         message: 'Step 3: Write your message',
     };
     document.getElementById('build-step-title').textContent = titles[stepToShow];
}

function goToSelectStep() { changeStep('select'); }

function goToArrangementStep(fromMessage = false) {
    changeStep('arrangement');
    if (!fromMessage) {
        generateAndRenderArrangement();
    }
    renderWrapperOptions();
}

function generateAndRenderArrangement() {
    appState.flowerArrangements = [];
    const canvasSize = 400; // Reference size
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 1.8;
    const clusterRadius = canvasSize / 5;

    appState.selectedFlowers.forEach((flower, index) => {
        const angle = (index / appState.selectedFlowers.length) * 2 * Math.PI + (Math.random() - 0.5);
        const radius = clusterRadius * (0.5 + Math.random() * 0.5);
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const rotation = Math.random() * 50 - 25;
        
        appState.flowerArrangements.push({
            ...flower,
            x: (x / canvasSize) * 100, // as percentage
            y: (y / canvasSize) * 100,
            size: 25 + Math.random() * 10,
            rotation,
        });
    });
    renderArrangementCanvas();
}

function renderArrangementCanvas() {
    const canvas = document.getElementById('arrangement-canvas');
    canvas.innerHTML = '';
    
    const wrapperImg = document.createElement('img');
    wrapperImg.src = appState.selectedWrapper.url;
    wrapperImg.className = 'absolute inset-0 w-full h-full object-cover';
    canvas.appendChild(wrapperImg);

    appState.flowerArrangements.forEach(flowerData => {
        const img = document.createElement('img');
        img.src = flowerData.url;
        img.className = 'absolute';
        img.style.width = `${flowerData.size}%`;
        img.style.height = 'auto';
        img.style.left = `${flowerData.x}%`;
        img.style.top = `${flowerData.y}%`;
        img.style.transform = `translate(-50%, -50%) rotate(${flowerData.rotation}deg)`;
        canvas.appendChild(img);
    });
}

function renderWrapperOptions() {
    const optionsContainer = document.getElementById('wrapper-options');
    optionsContainer.innerHTML = '';
    WRAPPER_DATA.forEach(wrapper => {
        const isSelected = wrapper.id === appState.selectedWrapper.id;
        const option = document.createElement('div');
        option.className = `wrapper-option cursor-pointer border-4 p-1 rounded-lg transition-all ${isSelected ? 'selected' : 'border-transparent'}`;
        option.innerHTML = `<img src="${wrapper.url}" alt="${wrapper.name}" class="w-20 h-20 object-cover rounded">`;
        option.onclick = () => {
            appState.selectedWrapper = wrapper;
            renderArrangementCanvas();
            renderWrapperOptions();
        };
        optionsContainer.appendChild(option);
    });
}

function goToMessageStep() {
    changeStep('message');
    const previewContainer = document.getElementById('selected-flowers-preview');
    previewContainer.innerHTML = '';
    appState.selectedFlowers.forEach(f => {
        previewContainer.innerHTML += `<img src="${f.url}" class="w-10 h-10" alt="${f.name}"/>`;
    });
}

messageForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitText.textContent = 'Preparing...';
    submitSpinner.classList.remove('hidden');
    submitButton.disabled = true;

    const formData = new FormData(this);
    appState.bouquetData = {
        recipientName: formData.get('recipientName'),
        senderName: formData.get('senderName'),
        message: formData.get('message'),
        arrangement: appState.flowerArrangements,
        wrapper: appState.selectedWrapper
    };
    
    await downloadBouquet(); // Await the download

    submitText.textContent = 'Create & Download';
    submitSpinner.classList.add('hidden');
    submitButton.disabled = false;
});

async function downloadBouquet() {
    const { recipientName, senderName, message, arrangement, wrapper } = appState.bouquetData;
    
    document.getElementById('capture-recipient-name').textContent = `Dear ${recipientName},`;
    document.getElementById('capture-message-text').textContent = message;
    document.getElementById('capture-sender-name').textContent = senderName;

    const preview = document.getElementById('capture-bouquet-display');
    preview.innerHTML = '';
    
    const wrapperImg = document.createElement('img');
    wrapperImg.src = wrapper.url;
    wrapperImg.className = 'absolute inset-0 w-full h-full object-cover';
    preview.appendChild(wrapperImg);
    
    arrangement.forEach((flowerData) => {
        const img = document.createElement('img');
        img.src = flowerData.url;
        img.className = 'absolute';
        img.style.width = `${(flowerData.size / 100) * 600}px`; 
        img.style.height = 'auto';
        img.style.left = `${(flowerData.x / 100) * 600}px`;
        img.style.top = `${(flowerData.y / 100) * 600}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${flowerData.rotation}deg)`;
        preview.appendChild(img);
    });

    // Wait for local images to render, 500ms should be enough
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const captureArea = document.getElementById('capture-area');
    try {
        const canvas = await html2canvas(captureArea, {
            backgroundColor: 'var(--bg-cream)',
            scale: 2 // Higher resolution
        });

        const link = document.createElement('a');
        link.download = `bloompost-for-${recipientName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch(e) {
        console.error("Error capturing canvas:", e);
        alert("Sorry, there was an error downloading the image. Please try again.");
    }
}

function resetApp() {
    messageForm.reset();
    navigate('landing');
}

function showGarden() {
    const gardenGrid = document.getElementById('garden-grid');
    gardenGrid.innerHTML = '';
    FLOWERS_DATA.color.forEach(flower => {
        gardenGrid.innerHTML += `
            <div class="text-center">
                <img src="${flower.url}" alt="${flower.name}" class="w-full h-auto object-cover rounded-lg shadow-lg mb-2"/>
                <p class="font-semibold">${flower.name}</p>
            </div>
        `;
    });
    pages.garden.classList.remove('hidden');
}

function hideGarden() {
    pages.garden.classList.add('hidden');
}

