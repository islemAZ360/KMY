const app = document.getElementById('app');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const mainContent = document.getElementById('main-content');
const title = document.getElementById('title');
const description = document.getElementById('description');
const optionsContainer = document.getElementById('options-container');
const videoOverlay = document.getElementById('video-overlay');
const video = document.getElementById('presentation-video');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackContent = document.getElementById('feedback-content');

const loader = document.getElementById('loader');
const feedbackText = document.getElementById('feedback-text');

let currentState = 0;

const states = [
    {
        name: 'SCENARIO',
        onEnter: () => {
            title.textContent = 'Что делать?';
            description.textContent = 'Представьте, что вы очень спешили и решили перебежать пешеходный переход за несколько секунд до того, как загорелся зеленый свет. После этого вас остановил полицейский. Вы иностранный студент, и ваш русский язык пока не очень хорош. Как лучше всего поступить в этой ситуации?';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'CHOICES',
        onEnter: () => {
            title.textContent = 'Выберите вариант:';
            description.textContent = '';
            optionsContainer.classList.remove('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'VIDEO_1',
        videoSrc: '/video/1.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_2',
        videoSrc: '/video/2.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_3',
        videoSrc: '/video/3.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_4',
        videoSrc: '/video/4.webm',
        feedback: 'correct'
    },
    {
        name: 'CONCLUSION',
        onEnter: () => {
            feedbackOverlay.classList.add('hidden');
            videoOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            title.textContent = 'Правильный выбор!';
            description.innerHTML = `
                Вам придется подождать в полицейском участке несколько часов, но когда приедет ответственное лицо из университета, он объяснит полицейскому, что вы иностранец и только недавно приехали в Россию. 
                Скорее всего, вас отпустят или выпишут штраф в размере 500 рублей, если полицейский будет принципиальным, но, по крайней мере, у вас не возникнет других серьезных проблем.
                <br><br>
                <strong>Помните: не стоит совершать необдуманные поступки, даже если мы, например, неправы.</strong>
                <br><br>
                <a href="https://kmy-cyan.vercel.app/" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: bold;">kmy-cyan.vercel.app</a>
            `;
            optionsContainer.classList.add('hidden');
            nextBtn.classList.remove('pulse');
            nextBtn.textContent = 'Завершить';
        }
    }
];

// Global Preloader
const preloadedVideos = new Map();

async function preloadAllVideos() {
    states.forEach(async (state) => {
        if (state.videoSrc) {
            try {
                const response = await fetch(state.videoSrc);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                preloadedVideos.set(state.videoSrc, url);
                console.log(`Preloaded: ${state.videoSrc}`);
            } catch (err) {
                // Fallback to invisible video element if fetch fails (CORS issue)
                const videoElem = document.createElement('video');
                videoElem.src = state.videoSrc;
                videoElem.preload = 'auto';
                videoElem.load();
                preloadedVideos.set(state.videoSrc, state.videoSrc);
            }
        }
    });
}

function updateState() {
    const state = states[currentState];

    // --- STAGE 1: HARD RESET ---
    // Kill only event listeners, keep video source if we need it
    video.onended = null;
    video.onerror = null;
    video.onplaying = null;
    video.oncanplay = null;
    video.onwaiting = null;

    // Force hide overlays
    videoOverlay.classList.add('hidden');
    feedbackOverlay.classList.add('hidden');
    loader.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Clear icons and text
    feedbackContent.textContent = '';
    feedbackText.textContent = '';

    // Reset staggered animations
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('option-visible'));
    nextBtn.classList.remove('pulse');

    // --- STAGE 1.5: NAVIGATION BUTTONS ---
    if (currentState === 0) {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }

    // --- STAGE 2: APPLY NEW STATE ---
    if (state.onEnter) {
        state.onEnter();
        
        if (!optionsContainer.classList.contains('hidden')) {
            setTimeout(() => {
                document.querySelectorAll('.option').forEach(opt => {
                    if (!optionsContainer.classList.contains('hidden')) {
                         opt.classList.add('option-visible');
                    }
                });
            }, 30);
        }
    }

    if (state.videoSrc) {
        playVideoSequence(state.videoSrc, state.feedback, currentState);
    }
}

function playVideoSequence(src, type, stateIndex) {
    mainContent.classList.add('hidden');
    videoOverlay.classList.remove('hidden');

    // Use preloaded video source if it exists
    const preloaded = preloadedVideos.get(src);
    if (preloaded) {
        video.src = preloaded;
    } else {
        video.src = src;
    }

    // Since it's likely preloaded, it should play almost instantly
    // Only show loader if video takes more than 300ms to start
    const loaderTimeout = setTimeout(() => {
        if (currentState === stateIndex && video.paused) {
            loader.classList.remove('hidden');
        }
    }, 300);

    video.onplaying = () => {
        clearTimeout(loaderTimeout);
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
        }
    };

    video.onerror = () => {
        clearTimeout(loaderTimeout);
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            showFeedback(type, stateIndex);
        }
    };

    video.onended = () => {
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            showFeedback(type, stateIndex);
        }
    };

    video.play().catch(() => {
        // Fallback if autoplay fails
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            showFeedback(type, stateIndex);
        }
    });
}

function showFeedback(type, stateIndex) {
    // SECURITY CHECK: Don't show feedback if we moved to a different state
    if (currentState !== stateIndex || !states[stateIndex].feedback) return;

    feedbackOverlay.classList.remove('hidden');
    
    const isCorrect = type === 'correct';
    feedbackOverlay.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    feedbackContent.textContent = isCorrect ? '✓' : '✗';
    feedbackText.textContent = isCorrect ? 'Правильное!' : 'Неверно!';
}

// Options Interaction
document.querySelectorAll('.option').forEach((opt, index) => {
    opt.addEventListener('click', () => {
        // Mapping: Option 1 (index 0) -> VIDEO_1 (index 2)
        // Option 2 (index 1) -> VIDEO_2 (index 3)
        // etc.
        currentState = index + 2; 
        updateState();
    });
});

nextBtn.addEventListener('click', (e) => {
    const currentStateObj = states[currentState];
    
    // If we just finished a "wrong" video, go back to CHOICES
    if (currentStateObj.feedback === 'wrong') {
        stopVideo();
        currentState = 1; // CHOICES state
        updateState();
        return;
    }

    if (currentState < states.length - 1) {
        stopVideo();
        currentState++;
        updateState();
    } else {
        location.reload();
    }
});

backBtn.addEventListener('click', (e) => {
    if (currentState > 0) {
        stopVideo();
        
        // If we are on a video screen, go back to CHOICES
        if (states[currentState].videoSrc) {
            currentState = 1; // CHOICES state
        } else {
            currentState--;
        }
        
        updateState();
    }
});

function stopVideo() {
    video.onended = null;
    video.onerror = null;
    video.onplaying = null;
    try {
        video.pause();
    } catch (err) {}
}

// Initial start
preloadAllVideos();
updateState();
