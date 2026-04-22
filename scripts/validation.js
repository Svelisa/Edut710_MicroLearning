document.addEventListener('DOMContentLoaded', () => {
    // אתחול תרגיל הקרקוע הקיים
    InitGroundingExercise();

    // אתחול קרוסלת הצוות
    InitTeamCarousel();

    // אתחול אקורדיון (מתוך unit1.html)
    InitAccordion();

    // אתחול אינטראקציית גרירה ב-unit2.html
    InitDragAndDrop();

    // אתחול אנימציית גלילה (Workflow) ב-unit1.html
    InitWorkflowScrollAnimation();
});

/**
 * ניהול תרגיל הקרקוע (הקוד הקיים שלך)
 */
function InitGroundingExercise() {
    const steps = [
        { id: 'step5', inputsSelector: '#step5 .exercise-input', btnId: 'nextSenseBtn5', nextStepId: 'step4' },
        { id: 'step4', inputsSelector: '#step4 .exercise-input', btnId: 'nextSenseBtn4', nextStepId: 'step3' },
        { id: 'step3', inputsSelector: '#step3 .exercise-input', btnId: 'nextSenseBtn3', nextStepId: 'step2' },
        { id: 'step2', inputsSelector: '#step2 .exercise-input', btnId: 'nextSenseBtn2', nextStepId: 'step1' },
        { id: 'step1', inputsSelector: '#step1 .exercise-input', btnId: 'nextSenseBtn1', nextStepId: null }
    ];

    steps.forEach(step => {
        const stepEl = document.getElementById(step.id);
        if (!stepEl) return;

        const inputs = stepEl.querySelectorAll(step.inputsSelector);
        const nextBtn = document.getElementById(step.btnId);

        if (!inputs.length || !nextBtn) return;

        function checkInputs() {
            const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
            nextBtn.disabled = !allFilled;
        }

        inputs.forEach(input => {
            input.addEventListener('input', checkInputs);
        });

        nextBtn.addEventListener('click', () => {
            if (step.nextStepId) {
                const nextEl = document.getElementById(step.nextStepId);
                if (nextEl) {
                    nextEl.classList.remove('d-none');
                    nextBtn.parentElement.classList.add('d-none');
                    nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                const mainEl = document.querySelector('main');
                if (mainEl) {
                    Array.from(mainEl.children).forEach(child => {
                        if (child.id !== 'step-summary') {
                            child.classList.add('d-none');
                        }
                    });
                }
                const summaryEl = document.getElementById('step-summary');
                if (summaryEl) {
                    summaryEl.classList.remove('d-none');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
}

/**
 * ניהול קרוסלת הצוות
 */
function InitTeamCarousel() {
    const carouselWrapper = document.getElementById('team3DCarousel');
    if (!carouselWrapper) return;

    const cards = Array.from(document.querySelectorAll('.team-3d-card'));
    const prevBtn = document.getElementById('teamPrevBtn');
    const nextBtn = document.getElementById('teamNextBtn');
    const total = cards.length;
    let currentIndex = 0;

    const dynamicNameEl = document.getElementById('dynamicTeamName');
    const dynamicRoleEl = document.getElementById('dynamicTeamRole');

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.className = 'team-3d-card'; // reset classes
            let offset = index - currentIndex;

            // Handle wrapping
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            if (offset === 0) {
                card.classList.add('active');
                // Update dynamic text for center card
                if (dynamicNameEl) dynamicNameEl.textContent = card.dataset.name;
                if (dynamicRoleEl) dynamicRoleEl.textContent = card.dataset.role;
            }
            else if (offset === -1) card.classList.add('prev-1');
            else if (offset === 1) card.classList.add('next-1');
            else if (offset === -2) card.classList.add('prev-2');
            else if (offset === 2) card.classList.add('next-2');
            else card.classList.add('hidden');
        });
    }

    function moveNext() {
        currentIndex = (currentIndex + 1) % total;
        updateCarousel();
    }

    function movePrev() {
        currentIndex = (currentIndex - 1 + total) % total;
        updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', moveNext);
    if (prevBtn) prevBtn.addEventListener('click', movePrev);

    // Click on a card to bring it to center
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (currentIndex !== index) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Touch support (Swipe)
    let startX = 0;
    carouselWrapper.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].screenX;
        let diff = endX - startX;
        if (diff > 50) movePrev(); // Swipe right -> prev
        if (diff < -50) moveNext(); // Swipe left -> next
    }, { passive: true });

    // Expand Button Logic
    const expandBtn = document.getElementById('teamExpandBtn');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const activeCard = document.querySelector('.team-3d-card.active');
            if (!activeCard) return;

            const name = activeCard.dataset.name;
            const role = activeCard.dataset.role;
            const imgEl = activeCard.querySelector('img');
            const bioEl = activeCard.querySelector('.card-bio');

            document.getElementById('modalTeamName').textContent = name || '';
            document.getElementById('modalTeamRole').textContent = role || '';
            if (imgEl) document.getElementById('modalTeamImg').src = imgEl.src;
            if (bioEl) document.getElementById('modalTeamBio').textContent = bioEl.textContent;

            // Use Bootstrap modal API to show the modal
            const modalElement = document.getElementById('teamMemberModal');
            if (window.bootstrap && modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        });
    }

    // Initial update
    updateCarousel();
}

/**
 * ניהול אקורדיון המטרות (unit1)
 */
function InitAccordion() {
    document.querySelectorAll('.goal-item').forEach(item => {
        item.addEventListener('click', function () {
            const svg = this.querySelector('.goal-plus svg');
            if(!svg) return; // ignore if no svg inside

            // We let bootstrap handle the aria-expanded toggle natively via collapse.
            setTimeout(() => {
                const expandedNow = this.getAttribute('aria-expanded') === 'true';
                if (expandedNow) {
                    svg.innerHTML = '<line x1="5" y1="12" x2="19" y2="12"></line>'; // minus
                } else {
                    svg.innerHTML = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'; // plus
                }
            }, 10);
        });
    });
}

/**
 * ניהול אינטראקציית גרירה ב-unit2 (Drag & Drop + Tap to Drop for mobile)
 */
function InitDragAndDrop() {
    const wordBank = document.getElementById('word-bank');
    const scenariosContainer = document.getElementById('scenarios-container');
    if (!wordBank || !scenariosContainer) return;

    let selectedPrinciple = null;
    let selectedElement = null;

    const chips = document.querySelectorAll('.draggable-chip');
    const dropZones = document.querySelectorAll('.drop-zone');

    // פונקציית עזר להצלחה
    function handleSuccess(zone, principleKey, text) {
        zone.classList.remove('error-drop', 'drag-over');
        zone.classList.add('success-drop');
        zone.innerHTML = `<span class="d-flex align-items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${text}
        </span>`;
        // ביטול אירועים נוספים על האזור
        zone.dataset.completed = "true";

        // חשיפה הדרגתית של השאלה הבאה
        const currentCard = zone.closest('.scenario-card');
        if (currentCard) {
            const nextCard = currentCard.nextElementSibling;
            if (nextCard && nextCard.classList.contains('scenario-card')) {
                setTimeout(() => {
                    nextCard.classList.remove('d-none');
                    // גלילה חלקה לשאלה הבאה
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400); // השהייה קלה לחווית משתמש נעימה
            }
        }
    }

    // פונקציית עזר לכישלון
    function handleError(zone) {
        zone.classList.add('error-drop');
        zone.classList.remove('drag-over');
        setTimeout(() => {
            zone.classList.remove('error-drop');
        }, 500);
    }

    // --- אירועי Drag & Drop למחשב ---
    chips.forEach(chip => {
        chip.addEventListener('dragstart', (e) => {
            chip.classList.add('dragging');
            e.dataTransfer.setData('text/plain', chip.dataset.principle);
            e.dataTransfer.setData('application/json', JSON.stringify({
                key: chip.dataset.principle,
                text: chip.innerText
            }));
            
            // איפוס בחירה בלחיצה אם המשתמש בחר לגרור
            if (selectedElement) {
                selectedElement.classList.remove('selected');
                selectedPrinciple = null;
                selectedElement = null;
            }
        });

        chip.addEventListener('dragend', () => {
            chip.classList.remove('dragging');
        });

        // --- אירועי לחיצה לנייד ---
        chip.addEventListener('click', () => {
            // הסרת בחירה קודמת
            chips.forEach(c => c.classList.remove('selected'));
            
            // בחירה נוכחית
            chip.classList.add('selected');
            selectedPrinciple = {
                key: chip.dataset.principle,
                text: chip.innerText
            };
            selectedElement = chip;
            
            // הדגשת אזורי גרירה פנויים כדי לסמן למשתמש איפה אפשר ללחוץ
            dropZones.forEach(zone => {
                if(zone.dataset.completed !== "true") {
                    zone.classList.add('highlight');
                }
            });
        });
    });

    dropZones.forEach(zone => {
        // מניעת ברירת מחדל כדי לאפשר שחרור
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (zone.dataset.completed !== "true") {
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (zone.dataset.completed === "true") return;

            zone.classList.remove('drag-over');
            try {
                const dataRaw = e.dataTransfer.getData('application/json');
                const data = JSON.parse(dataRaw);
                const correctPrinciple = zone.dataset.correct;

                if (data.key === correctPrinciple) {
                    handleSuccess(zone, data.key, data.text);
                } else {
                    handleError(zone);
                }
            } catch (err) {
                console.error("Drop Parse Error", err);
            }
        });

        // אירוע לחיצה על אזור הגרירה (מיועד בעיקר לנייד)
        zone.addEventListener('click', () => {
            if (zone.dataset.completed === "true") return;
            
            if (selectedPrinciple) {
                const correctPrinciple = zone.dataset.correct;
                
                if (selectedPrinciple.key === correctPrinciple) {
                    handleSuccess(zone, selectedPrinciple.key, selectedPrinciple.text);
                } else {
                    handleError(zone);
                }

                // איפוס בחירה לאחר ניסיון התאמה
                if (selectedElement) {
                    selectedElement.classList.remove('selected');
                }
                selectedPrinciple = null;
                selectedElement = null;

                // הסרת הדגשה
                dropZones.forEach(z => z.classList.remove('highlight'));
            }
        });
    });

    // הסרת בחירה אם לוחצים במקום אחר במסך
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.draggable-chip') && !e.target.closest('.drop-zone')) {
            if (selectedElement) {
                selectedElement.classList.remove('selected');
                dropZones.forEach(z => z.classList.remove('highlight'));
                selectedPrinciple = null;
                selectedElement = null;
            }
        }
    });
}

/**
 * Workflow Scroll Text Reveal Animation
 */
function InitWorkflowScrollAnimation() {
    const steps = document.querySelectorAll('.workflow-step');
    const progressLine = document.getElementById('workflow-progress');
    const container = document.querySelector('.workflow-scroll-container');
    
    if (!steps.length) return;

    // Intersection Observer to detect when a step is in the middle of the viewport
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Trigger when item is near the middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));

    // Scroll event for the progress line
    if (progressLine && container) {
        window.addEventListener('scroll', () => {
            const containerRect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the container has been scrolled past
            // Start progressing when the top of the container is near the middle of the screen
            const startScroll = viewportHeight * 0.5; 
            
            let progress = 0;
            
            // Distance from start trigger to bottom of container
            const totalScrollDistance = containerRect.height;
            const currentScroll = startScroll - containerRect.top;
            
            if (currentScroll > 0) {
                progress = (currentScroll / totalScrollDistance) * 100;
            }
            
            // Clamp between 0 and 100
            progress = Math.max(0, Math.min(100, progress));
            
            progressLine.style.height = `${progress}%`;
        }, { passive: true });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }
}
