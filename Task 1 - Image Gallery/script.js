document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allGalleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.close-icon');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    // --- State Variables ---
    // ERROR FIXED: Removed the space in the variable name below
    let visibleItems = []; 
    let activeIndex = 0; 

    // ===========================
    // 1. Filtering Functionality
    // ===========================
    
    // Initialize: assume "all" are visible at start
    visibleItems = Array.from(allGalleryItems);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button styling
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            visibleItems = []; // Reset visible list

            allGalleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hide');
                    visibleItems.push(item); // Add to current visible list
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });


    // ===========================
    // 2. Lightbox Functionality
    // ===========================

    // Add click events to all items to open lightbox
    allGalleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Find index of clicked item within the currently filtered set
            const indexInVisibleList = visibleItems.indexOf(item);
            
            if(indexInVisibleList > -1) {
                 // Only open if it's part of the current filter view
                 openLightbox(indexInVisibleList);
            }
        });
    });

    function openLightbox(index) {
        activeIndex = index;
        updateLightboxImage();
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    }

    function closeLightboxModal() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // Update image source based on activeIndex
    function updateLightboxImage() {
        const imgSource = visibleItems[activeIndex].querySelector('img').src;
        // Optional: add a small fade effect when switching images
        lightboxImg.style.opacity = '0.5';
        setTimeout(() => {
             lightboxImg.src = imgSource;
             lightboxImg.style.opacity = '1';
        }, 150);
    }


    // ===========================
    // 3. Navigation Controls
    // ===========================

    function slideNext() {
        activeIndex++;
        // Loop back to start if at end
        if (activeIndex >= visibleItems.length) {
            activeIndex = 0;
        }
        updateLightboxImage();
    }

    function slidePrev() {
        activeIndex--;
        // Loop to end if at start
        if (activeIndex < 0) {
            activeIndex = visibleItems.length - 1;
        }
        updateLightboxImage();
    }

    // Event Listeners for controls
    nextBtn.addEventListener('click', slideNext);
    prevBtn.addEventListener('click', slidePrev);
    closeBtn.addEventListener('click', closeLightboxModal);

    // Close when clicking outside the image content area
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        if (e.key === 'Escape') closeLightboxModal();
        if (e.key === 'ArrowRight') slideNext();
        if (e.key === 'ArrowLeft') slidePrev();
    });

});