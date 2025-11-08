const gameContainer = document.querySelector('.memory-game');

// --- 1. DEFINISI DATA GLOBAL ---

// Daftar semua gambar yang tersedia
const ALL_CARD_IMAGES = [
    'hellokitty.jpg',
    'mymelody.jpg',
    'kuromi.jpg',
    'kiki.jpg',
    'pochacco.jpg',
    'cinnamoroll.jpg',
    'badtzmaru.jpg',
    'keroppi.jpg',
    'lala.jpg' 
];

// Definisi Level
const LEVELS = {
    easy: { pairs: 6, max_columns: 4 }, // 12 Kartu
    medium: { pairs: 8, max_columns: 4 }, // 16 Kartu
    hard: { pairs: 18, max_columns: 6 } // 36 Kartu
};

// --- FUNGSI UNTUK MENGATUR LAYOUT OTOMATIS (PERBAIKAN KRITIS DI SINI) ---
function setDynamicGrid(columns, totalCards) {
    gameContainer.style.setProperty('--columns', columns);
    
    // Asumsi ukuran kartu (termasuk gap/margin) adalah 150px
    const cardSize = 150; 
    
    // Hitung jumlah baris yang dibutuhkan (dibulatkan ke atas)
    const rows = Math.ceil(totalCards / columns); 

    // Atur lebar dan tinggi container dengan perhitungan yang benar
    gameContainer.style.width = `${columns * cardSize}px`; 
    gameContainer.style.height = `${rows * cardSize}px`;
}


// --- 2. FUNGSI UTAMA UNTUK MEMULAI GAME ---

function startGame(levelName) {
    const levelConfig = LEVELS[levelName];
    if (!levelConfig) {
        console.error("Level tidak ditemukan!");
        return;
    }

    // 1. Bersihkan papan lama 
    gameContainer.innerHTML = '';
    
    // 2. Pilih gambar yang dibutuhkan
    const requiredImages = ALL_CARD_IMAGES.slice(0, levelConfig.pairs);

    // 3. Siapkan Kartu: Gandakan dan Acak
    let gameCards = [...requiredImages, ...requiredImages];
    gameCards.sort(() => 0.5 - Math.random()); 
    
    // *** AMBIL JUMLAH TOTAL KARTU SEBELUM MEMBUATNYA ***
    const totalCards = gameCards.length; 

    // 4. Atur Grid Otomatis (Mengirimkan jumlah kolom dan total kartu)
    setDynamicGrid(levelConfig.max_columns, totalCards); 

    // 5. Membuat HTML Kartu Secara Dinamis
    gameCards.forEach(imageName => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.card = imageName; 

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        const frontImg = document.createElement('img');
        frontImg.src = `assets/img/front-card/${imageName}`; 
        frontFace.appendChild(frontImg);

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.innerHTML = `<img src="assets/img/back-card/1.jpg">`; 

        card.appendChild(frontFace);
        card.appendChild(backFace);
        card.addEventListener('click', flipCard);
        // Kartu ditambahkan setelah setDynamicGrid dipanggil
        gameContainer.appendChild(card); 
    });
}


// --- Logika Permainan Inti (Flip & Match) ---

let hasFlippedCard = false;
let lockBoard = false; 
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return; 
    if (this === firstCard) return; 

    this.classList.add('flip'); 

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true; 

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000); 
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


// --- INISIALISASI ---
startGame('easy');