const app = document.getElementById('app');
const nextBtn = document.getElementById('next-btn');
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
        videoSrc: '/video/1.mp4',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_2',
        videoSrc: '/video/2.mp4',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_3',
        videoSrc: '/video/3.mp4',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_4',
        videoSrc: '/video/4.mp4',
        feedback: 'correct'
    },
    {
        name: 'CONCLUSION',
        onEnter: () => {
            feedbackOverlay.classList.add('hidden');
            videoOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            title.textContent = 'Правильный выбор!';
            description.textContent = 'Вам придется подождать в полицейском участке несколько часов, но когда приедет ответственное лицо из университета, он объяснит полицейскому, что вы иностранец и только недавно приехали в Россию. Скорее всего, вас отпустят или выпишут штраф в размере 500 рублей, если полицейский будет принципиальным, но, по крайней мере, у вас не возникнет других серьезных проблем.';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.remove('pulse');
            nextBtn.textContent = 'Завершить';
        }
    }
];

function updateState() {
    const state = states[currentState];

    // --- STAGE 1: HARD RESET ---
    // Kill all video tasks immediately
    video.onended = null;
    video.onerror = null;
    video.onplaying = null;
    video.oncanplay = null;
    video.onwaiting = null;

    // Force hide everything
    videoOverlay.classList.add('hidden');
    feedbackOverlay.classList.add('hidden');
    loader.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Clear icons and text to be safe
    feedbackContent.textContent = '';
    feedbackText.textContent = '';

    // Reset staggered animations
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('option-visible'));
    nextBtn.disabled = false;
    nextBtn.classList.remove('pulse');

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
    
    // Preload next video
    const nextState = states[currentState + 1];
    if (nextState && nextState.videoSrc) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = nextState.videoSrc;
        document.head.appendChild(link);
    }
}

function playVideoSequence(src, type, stateIndex) {
    mainContent.classList.add('hidden');
    videoOverlay.classList.remove('hidden');
    nextBtn.disabled = true;

    // Ensure loader is hidden initially unless it stays stuck for too long
    loader.classList.add('hidden');

    video.src = src;

    // Only show loader if video takes more than 400ms to start
    const loaderTimeout = setTimeout(() => {
        if (currentState === stateIndex && video.paused) {
            loader.classList.remove('hidden');
        }
    }, 400);

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
    
    nextBtn.disabled = false;
}

nextBtn.addEventListener('click', (e) => {
    if (currentState < states.length - 1) {
        // IMMEDIATE CLEANUP BEFORE INCREMENT
        video.onended = null;
        video.onerror = null;
        video.onplaying = null;
        try {
            video.pause();
            video.src = '';
            video.load(); // Flush buffer
        } catch (err) {}

        currentState++;
        updateState();
    } else {
        location.reload();
    }
});

// Initial start
updateState();
