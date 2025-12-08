// Waitlist functionality
class WaitlistManager {
  constructor() {
    this.emailInputs = document.querySelectorAll(
      "#email-input, #bottom-email-input"
    );
    this.joinButtons = document.querySelectorAll(
      "#join-waitlist, #bottom-join-waitlist"
    );
    this.successMessages = document.querySelectorAll(
      "#waitlist-success, #bottom-waitlist-success"
    );

    this.init();
  }

  init() {
    this.joinButtons.forEach((button, index) => {
      button.addEventListener("click", () => this.handleJoinWaitlist(index));
    });

    this.emailInputs.forEach((input, index) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleJoinWaitlist(index);
        }
      });
    });
  }

  handleJoinWaitlist(index) {
    const email = this.emailInputs[index].value.trim();

    if (!this.validateEmail(email)) {
      this.showError(index, "Please enter a valid email address");
      return;
    }

    // Simulate API call
    this.showLoading(index);

    setTimeout(() => {
      this.showSuccess(index);
      this.emailInputs[index].value = "";
      // Here you would typically send the email to your backend
      console.log("Email added to waitlist:", email);
    }, 1000);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showLoading(index) {
    const button = this.joinButtons[index];
    const originalText = button.textContent;
    button.textContent = "Adding...";
    button.disabled = true;
    button.dataset.originalText = originalText;
  }

  showSuccess(index) {
    const button = this.joinButtons[index];
    const message = this.successMessages[index];

    button.textContent = button.dataset.originalText;
    button.disabled = false;
    message.style.display = "block";

    // Hide success message after 5 seconds
    setTimeout(() => {
      message.style.display = "none";
    }, 5000);
  }

  showError(index, message) {
    // You could implement error display here
    console.error("Error:", message);
  }
}

// FAQ functionality
class FAQManager {
  constructor() {
    this.faqItems = document.querySelectorAll(".faq-item");
    this.init();
  }

  init() {
    this.faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => this.toggleFAQ(item));
    });
  }

  toggleFAQ(item) {
    const isActive = item.classList.contains("active");

    // Close all FAQ items
    this.faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active");
    }
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOptions
      );

      this.observeElements();
    }
  }

  observeElements() {
    const elements = document.querySelectorAll(
      ".feature-card, .demo-step, .use-less-text, .approach-text"
    );
    elements.forEach((el) => {
      el.classList.add("scroll-animate");
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }
}

// Scroll Tour Typing Effect
class ScrollTourTyping {
  constructor() {
    this.input = document.getElementById("scroll-tour-input");
    this.inputWrapper = document.querySelector(".scroll-tour-input-wrapper");
    this.container = document.querySelector(".scroll-tour-container");
    this.cursor = document.querySelector(".scroll-tour-cursor");
    this.progressLine = document.querySelector(".scroll-progress-line");
    this.progressActive = document.querySelector(".scroll-progress-active");
    this.url = "https://capture.app/record-now";
    this.currentCharIndex = 0;
    this.isTyping = false;
    this.hasStarted = false;
    this.isInCenter = false;
    this.typingSpeed = 80;
    this.pauseBeforeRestart = 1000;
    this.pauseBeforeDelete = 1200;
    this.deleteSpeed = 40;

    this.init();
  }

  init() {
    if (!this.input) return;

    const observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: 0.5,
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    observer.observe(this.container);
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    if (!this.input) return;

    const rect = this.input.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
    const threshold = viewportHeight * 0.2;

    // Update progress line position based on scroll
    this.updateProgressLine(rect, viewportHeight);

    if (distanceFromCenter < threshold) {
      this.inputWrapper.classList.add("in-center");
      this.container.classList.add("active");
      this.isInCenter = true;

      if (!this.hasStarted) {
        this.hasStarted = true;
        this.cursor.classList.add("active");
        this.updateCursorPosition();
        setTimeout(() => this.startTyping(), 500);
      }
    } else {
      this.inputWrapper.classList.remove("in-center");
      this.container.classList.remove("active");
      this.isInCenter = false;

      if (this.isTyping) {
        this.isTyping = false;
      }
    }
  }

  updateProgressLine(rect, viewportHeight) {
    if (!this.progressLine || !this.progressActive) return;

    // Get the actual line element's position
    const lineRect = this.progressLine.getBoundingClientRect();
    const lineTop = lineRect.top; // Top of the line (the tip)
    const lineHeight = this.progressLine.offsetHeight;
    const lineBottom = lineTop + lineHeight;

    const viewportCenter = viewportHeight / 2;

    // Calculate progress based on line tip position relative to viewport center
    // When line tip is at viewport center, progress = 0 (segment at top)
    // When line bottom is at viewport center, progress = 1 (segment at bottom)
    let progress = 0;

    if (lineTop <= viewportCenter && lineBottom >= viewportCenter) {
      // Line is crossing the viewport center
      progress = (viewportCenter - lineTop) / lineHeight;
    } else if (lineBottom < viewportCenter) {
      // Line has completely passed the center
      progress = 1;
    }

    // Clamp between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Calculate segment position
    const activeSegmentHeight = 50; // Match CSS height
    const maxPosition = lineHeight - activeSegmentHeight;
    const position = progress * maxPosition;

    // Update segment position
    this.progressActive.style.transform = `translate(-50%, ${position}px)`;

    // Add extra brightness when input is centered (optional enhancement)
    const elementCenter = rect.top + rect.height / 2;
    const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
    const threshold = viewportHeight * 0.2;

    if (distanceFromCenter < threshold) {
      this.progressActive.style.filter = "brightness(0.5)";
    } else {
      this.progressActive.style.filter = "brightness(1)";
    }
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !this.hasStarted) {
        const rect = this.input.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
        const threshold = viewportHeight * 0.2;

        if (distanceFromCenter < threshold) {
          this.hasStarted = true;
          this.isInCenter = true;
          this.inputWrapper.classList.add("in-center");
          this.container.classList.add("active");
          this.cursor.classList.add("active");
          this.updateCursorPosition();
          setTimeout(() => this.startTyping(), 500);
        }
      }
    });
  }

  updateCursorPosition() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const computedStyle = window.getComputedStyle(this.input);
    context.font = computedStyle.font;

    const textWidth = context.measureText(this.input.value).width;
    const inputWidth = this.input.offsetWidth;
    const inputPaddingLeft = parseFloat(computedStyle.paddingLeft);
    const inputPaddingRight = parseFloat(computedStyle.paddingRight);

    const availableWidth = inputWidth - inputPaddingLeft - inputPaddingRight;
    const textStartX = inputPaddingLeft + (availableWidth - textWidth) / 2;

    this.cursor.style.left = `${textStartX + textWidth + 2}px`;
  }

  startTyping() {
    if (!this.isInCenter) {
      setTimeout(() => this.startTyping(), 100);
      return;
    }

    this.isTyping = true;
    this.typeURL();
  }

  typeURL() {
    if (!this.isInCenter) {
      this.isTyping = false;
      setTimeout(() => this.startTyping(), 100);
      return;
    }

    if (this.currentCharIndex < this.url.length) {
      this.input.value += this.url[this.currentCharIndex];
      this.currentCharIndex++;
      this.updateCursorPosition();
      setTimeout(() => this.typeURL(), this.typingSpeed);
    } else {
      setTimeout(() => {
        if (this.isInCenter) {
          this.deleteURL();
        } else {
          this.isTyping = false;
          setTimeout(() => this.startTyping(), 100);
        }
      }, this.pauseBeforeDelete);
    }
  }

  deleteURL() {
    if (!this.isInCenter) {
      this.isTyping = false;
      setTimeout(() => this.startTyping(), 100);
      return;
    }

    if (this.input.value.length > 0) {
      this.input.value = this.input.value.slice(0, -1);
      this.updateCursorPosition();
      setTimeout(() => this.deleteURL(), this.deleteSpeed);
    } else {
      this.currentCharIndex = 0;
      this.updateCursorPosition();
      setTimeout(() => {
        if (this.isInCenter) {
          this.typeURL();
        } else {
          this.isTyping = false;
          setTimeout(() => this.startTyping(), 100);
        }
      }, this.pauseBeforeRestart);
    }
  }
}

// Demo step animation
class DemoAnimation {
  constructor() {
    this.demoSteps = document.querySelectorAll(".demo-step");
    this.currentStep = 0;
    this.init();
  }

  init() {
    if (this.demoSteps.length > 0) {
      this.startAnimation();
    }
  }

  startAnimation() {
    setInterval(() => {
      this.demoSteps.forEach((step) => step.classList.remove("active"));
      this.demoSteps[this.currentStep].classList.add("active");
      this.currentStep = (this.currentStep + 1) % this.demoSteps.length;
    }, 3000);
  }
}

// Smooth scrolling for navigation links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleClick(e, link));
    });
  }

  handleClick(e, link) {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }
}

// NavbarScroll class
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.lastScrollY = window.scrollY;
    this.heroSection = document.querySelector(".hero");
    this.emailInputSection = document.querySelector(".hero-cta");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > this.lastScrollY;
    const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);

    // Only trigger animations if there's significant scroll movement (threshold)
    if (scrollDifference < 10) {
      return;
    }

    // Determine navbar state based on scroll position
    let shouldBeScrolled = currentScrollY > 100;
    let shouldBeHidden = false;

    // Show/hide based on scroll direction (only after initial 100px scroll)
    if (currentScrollY > 100) {
      if (isScrollingDown) {
        shouldBeHidden = true; // Show when scrolling up
      } else {
        shouldBeHidden = false; // Hide when scrolling down
      }
    }

    // Remove all state classes first
    this.navbar.classList.remove("scrolled", "hide-up", "show-down");

    // Apply new state
    if (shouldBeScrolled) {
      this.navbar.classList.add("scrolled");

      if (shouldBeHidden) {
        this.navbar.classList.add("hide-up");
      } else {
        this.navbar.classList.add("show-down");
      }
    } else {
      // Normal state (not scrolled)
      if (shouldBeHidden) {
        this.navbar.classList.add("hide-up");
      } else {
        this.navbar.classList.add("show-down");
      }
    }

    this.lastScrollY = currentScrollY;
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images when they're added
    this.observeImages();

    // Preload critical resources
    this.preloadResources();
  }

  observeImages() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  preloadResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement("link");
    criticalCSS.rel = "preload";
    criticalCSS.as = "style";
    criticalCSS.href = "css/style.css";
    document.head.appendChild(criticalCSS);
  }
}

//scroll progress active boxes
class ScrollProgressBoxes {
  constructor() {
    this.progressActive = document.querySelector(".scroll-progress-active");
    this.boxes = [
      document.querySelector(".scroll-progress-box-1"),
      document.querySelector(".scroll-progress-box-2"),
      document.querySelector(".scroll-progress-box-3"),
      document.querySelector(".meet-box"),
    ];
    this.scrollProgressLine = document.querySelector(".scroll-progress-line");

    if (
      !this.progressActive ||
      !this.scrollProgressLine ||
      this.boxes.some((box) => !box)
    ) {
      console.warn("ScrollProgressBoxes: Required elements not found");
      return;
    }

    this.init();
  }

  init() {
    // Check on scroll with passive listener for performance
    window.addEventListener("scroll", () => this.checkActiveBox(), {
      passive: true,
    });

    // Initial check on load
    this.checkActiveBox();
  }

  checkActiveBox() {
    // Get the scroll progress line's position
    const lineRect = this.scrollProgressLine.getBoundingClientRect();
    const activeRect = this.progressActive.getBoundingClientRect();

    // Calculate the active indicator's center position relative to the line
    const activeCenter = activeRect.top + activeRect.height / 2 - lineRect.top;

    // Check each box
    this.boxes.forEach((box) => {
      const boxRect = box.getBoundingClientRect();

      // Get box's top and bottom positions relative to the scroll progress line
      const boxTop = boxRect.top - lineRect.top;
      const boxBottom = boxRect.bottom - lineRect.top;

      // Check if active indicator's center is within the box's height range
      const isInRange = activeCenter >= boxTop && activeCenter <= boxBottom;

      // Toggle active class immediately based on position
      if (isInRange) {
        box.classList.add("active");
      } else {
        box.classList.remove("active");
      }
    });
  }
}
// Progress Icon Animation
class ProgressIconAnimation {
  constructor() {
    this.progressActive = document.querySelector(".scroll-progress-active");
    this.box3 = document.querySelector(".scroll-progress-box-3");
    this.rolaaBot = document.querySelector(".participant-box:nth-child(4)");
    this.icon = document.querySelector(".progress-icon");
    this.scrollProgressLine = document.querySelector(".scroll-progress-line");
    this.lastProgress = 0;
    this.lastRolaaBotProgress = 0;
    this.startDistance = -500; // Increased from -150px
    this.startDistanceToRolaabot = 0; // Increased from -150px

    if (
      !this.progressActive ||
      !this.box3 ||
      !this.icon ||
      !this.scrollProgressLine
    ) {
      console.warn("ProgressIconAnimation: Required elements not found");
      return;
    }

    this.init();
  }

  init() {
    // Check on scroll with passive listener for performance
    window.addEventListener("scroll", () => this.checkIconVisibility(), {
      passive: true,
    });

    // Initial check on load
    this.checkIconVisibility();
  }

  checkIconVisibility() {
    // Get positions relative to the scroll progress line
    const lineRect = this.scrollProgressLine.getBoundingClientRect();
    const activeRect = this.progressActive.getBoundingClientRect();
    const box3Rect = this.box3.getBoundingClientRect();
    const rolaaBotRect = this.rolaaBot.getBoundingClientRect();
    // Calculate RolaaBot center positions
    const rolaaBotCenterX = rolaaBotRect.left + rolaaBotRect.width / 2;
    const rolaaBotCenterY = rolaaBotRect.top + rolaaBotRect.height / 2;
    // Calculate scroll progress line center X position
    const lineCenterX = lineRect.left + lineRect.width / 2;

    // Calculate the active indicator's center position relative to the line
    const activeCenter = activeRect.top + activeRect.height / 2 - lineRect.top;

    // Get box-3's top position relative to the line
    const box3Top = box3Rect.top - lineRect.top;
    const rolaaBotTop = rolaaBotRect.top - lineRect.top;
    // Calculate horizontal (X) distance from line to RolaaBot center
    const xDistanceFromLine = rolaaBotCenterX - lineCenterX;
    const yDistanceFromTopRolaaBot = rolaaBotRect.height / 2;
    // console.log('yDistanceFromTopRolaaBot:', rolaaBotCenterY - lineRect.top);
    this.startDistanceToRolaabot = xDistanceFromLine;

    // Calculate progress percentage (0 to 1) as we approach box-3
    const triggerDistance = yDistanceFromTopRolaaBot; // Start animation 200px before reaching box-3
    const distanceToRolaabot =
      rolaaBotTop - activeCenter + yDistanceFromTopRolaaBot;
    const distanceToBox3 = box3Top - activeCenter;
    const progress = Math.max(0, Math.min(1, 1 - distanceToBox3 / 50));
    const progressToRolaabot = Math.max(
      0,
      Math.min(1, 1 - distanceToRolaabot / triggerDistance)
    );

    // Calculate translateX position based on progress
    // startDistance (hidden further left) to -50 (centered)
    const translateValue =
      this.startDistance + (Math.abs(this.startDistance) - 50) * progress;
    const translateValueToRolaabot =
      this.startDistanceToRolaabot * progressToRolaabot;

    // Show/hide RolaaBot based on progressToRolaabot
    if (progressToRolaabot >= 1) {
      this.rolaaBot.style.opacity = progressToRolaabot;
      this.rolaaBot.style.visibility = "visible";
      // this.icon.style.opacity = 0;
    } else {
      this.rolaaBot.style.opacity = "0";
      this.rolaaBot.style.visibility = "hidden";
    }

    // Update icon position and opacity based on scroll progress
    if (progress > 0) {
      // console.log('translateValue:', translateValue);
      if (progress >= 1) {
        this.icon.classList.add("visible");
      } else {
        this.icon.classList.remove("visible");
      }
      if (progressToRolaabot > 0) {
        this.progressActive.style.opacity = 1 - progressToRolaabot;
        this.icon.style.transform = `translateX(${translateValueToRolaabot}px)`;
        this.icon.classList.remove("visible");
      } else {
        this.icon.style.opacity = progress;
        this.icon.style.transform = `translateX(${translateValue}px)`;
      }
    } else {
      this.icon.classList.remove("visible");
      this.icon.style.opacity = "0";
      this.icon.style.transform = `translateX(${this.startDistance}px)`;
    }

    // this.lastRolaaBotProgress = progressToRolaabot;
    // this.lastProgress = progress;
  }
}

// Broadcast Indicator Scroll Animation
class BroadcastIndicatorScroll {
  constructor() {
    this.indicator = document.querySelector(".broadcast-indicator");
    this.meetBox = document.querySelector(".meet-box");
    this.lineElement = document.querySelector(".broadcast-line");
    this.messageContainer = document.querySelector(
      ".active-broadcast-message-container"
    );
    this.actionContainer = document.querySelector(".messages-action-container");
    this.messagesWrapper = null;
    this.messageElements = null;
    this.pauseStartProgress = 0.3; // 30% - where to pause
    this.pauseThreshold = 0.015; // Slightly relaxed threshold for smoother detection
    this.isPaused = false;
    this.scrollLocked = false;
    this.lockedScrollPosition = 0;
    this.internalScrollProgress = 0;
    this.scrollThreshold = 0;
    this.hasPassedForward = false; // User has scrolled past 30% going down
    this.hasPassedBackward = false; // User has scrolled past 30% going up
    this.lastPageProgress = 0;
    this.scrollDirection = null; // 'down' or 'up'
    this.textMessages = [
      "Rolaa captures your meeting with real-time transcription and speaker identification",
      "AI processes audio with noise reduction and detects key moments automatically",
      "Smart analysis highlights decisions, action items, and important questions",
      "Everything syncs securely to your workspace with instant multi-device access",
    ];
    this.init();
  }

  init() {
    if (!this.indicator || !this.meetBox || !this.lineElement) {
      console.warn("BroadcastIndicatorScroll: Required elements not found");
      return;
    }

    this.createMessageElements();
    
    // Use passive:false only when necessary (during locked scroll)
    window.addEventListener("scroll", () => this.handleScroll(), {
      passive: true,
    });
    
    window.addEventListener("wheel", (e) => this.handleWheel(e), {
      passive: false,
    });
    
    window.addEventListener("touchmove", (e) => this.handleTouchMove(e), {
      passive: false,
    });
    
    // Initial position update
    requestAnimationFrame(() => this.updateIndicatorPosition());
  }

  createMessageElements() {
    if (!this.messageContainer) return;

    this.messageContainer.innerHTML = "";
    this.messagesWrapper = document.createElement("div");
    this.messagesWrapper.className = "broadcast-text-wrapper";

    this.textMessages.forEach((text, index) => {
      const messageEl = document.createElement("div");
      messageEl.className = "broadcast-text-item";
      messageEl.textContent = text;
      messageEl.dataset.index = index;
      this.messagesWrapper.appendChild(messageEl);
    });

    this.messageContainer.appendChild(this.messagesWrapper);
    this.messageElements = this.messageContainer.querySelectorAll(
      ".broadcast-text-item"
    );

    // Calculate total scrollable height for messages (match CSS gap of 16px)
    const messageHeight = 60; // Approximate height per message including gap
    this.scrollThreshold = (this.textMessages.length - 1) * messageHeight;
  }

  handleWheel(e) {
    if (this.scrollLocked && this.isPaused) {
      e.preventDefault();

      const delta = e.deltaY;

      // Slower scroll sensitivity for better control (0.15 = 15% of normal speed)
      const scrollSensitivity = 0.15;
      this.internalScrollProgress += delta * scrollSensitivity;

      // Clamp between 0 and threshold
      this.internalScrollProgress = Math.max(
        0,
        Math.min(this.scrollThreshold, this.internalScrollProgress)
      );

      // Calculate progress for message scroll
      const pauseZoneProgress =
        this.internalScrollProgress / this.scrollThreshold;
      this.updateMessageScroll(pauseZoneProgress);

      // Check unlock conditions based on scroll direction
      if (delta > 0) {
        // Scrolling DOWN through messages
        if (this.internalScrollProgress >= this.scrollThreshold) {
          this.hasPassedForward = true;
          this.unlockScroll("forward");
        }
      } else if (delta < 0) {
        // Scrolling UP through messages
        if (this.internalScrollProgress <= 0) {
          this.hasPassedBackward = true;
          this.unlockScroll("backward");
        }
      }
    }
  }

  handleTouchMove(e) {
    if (this.scrollLocked && this.isPaused) {
      e.preventDefault();
    }
  }

  handleScroll() {
    if (this.scrollLocked && this.isPaused) {
      // Prevent scroll but don't use preventDefault (already handled in wheel/touch)
      window.scrollTo(0, this.lockedScrollPosition);
      return;
    }

    // Use requestAnimationFrame for smooth updates
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.updateIndicatorPosition();
        this.updateScheduled = false;
      });
    }
  }

  lockScroll(direction) {
    this.scrollLocked = true;
    this.lockedScrollPosition = window.pageYOffset;
    this.scrollDirection = direction;

    // Set initial internal progress based on scroll direction
    if (direction === "down") {
      this.internalScrollProgress = 0;
    } else if (direction === "up") {
      this.internalScrollProgress = this.scrollThreshold;
    }

    // Lock body scroll smoothly
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.lockedScrollPosition}px`;
    document.body.style.width = "100%";
  }

   unlockScroll(completionDirection) {
    this.scrollLocked = false;
    this.isPaused = false;

    const scrollY = this.lockedScrollPosition;

    // Restore body scroll
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    // Handle scroll continuation based on completion direction
    if (completionDirection === "forward") {
      // Completed scrolling forward (down) - continue page scroll down slightly
      window.scrollTo(0, scrollY + 20);

      // Clean up message container with delay
      setTimeout(() => {
        if (!this.isPaused) {
          this.messageContainer.classList.remove("active", "animating");
          
          // Hide action container with delay
          if (this.actionContainer) {
            this.actionContainer.classList.remove("active");
          }
        }
      }, 800);
    } else if (completionDirection === "backward") {
      // Completed scrolling backward (up) - continue page scroll up slightly
      window.scrollTo(0, scrollY - 20);

      // Clean up message container with delay
      setTimeout(() => {
        this.messageContainer.classList.remove("active", "animating");
        this.resetMessages();
        
        // Hide action container
        if (this.actionContainer) {
          this.actionContainer.classList.remove("active");
        }
      }, 800);
    }

    // Force indicator position update
    requestAnimationFrame(() => {
      this.updateIndicatorPosition();
    });
  }

   updateIndicatorPosition() {
    if (this.scrollLocked) return;

    const isMeetBoxActive = this.meetBox.classList.contains("active");

    if (!isMeetBoxActive) {
      this.indicator.style.opacity = "0";
      if (this.messageContainer) {
        this.messageContainer.classList.remove("active", "animating");
        this.resetMessages();
      }
      if (this.actionContainer) {
        this.actionContainer.classList.remove("active");
      }
      this.isPaused = false;
      this.scrollLocked = false;
      this.hasPassedForward = false;
      this.hasPassedBackward = false;
      this.lastPageProgress = 0;
      return;
    }

    // Get indicator and line positions
    const indicatorRect = this.indicator.getBoundingClientRect();
    const indicatorHeight = indicatorRect.height;
    const lineRect = this.lineElement.getBoundingClientRect();
    const lineTop = lineRect.top;
    const lineHeight = this.lineElement.offsetHeight;
    const lineBottom = lineTop + lineHeight;
    const disappearingHeight = 100;
    const startingAppearingHeight = 100;

    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    let progress = 0;

    // Calculate scroll progress along the line
    if (lineTop <= viewportCenter && lineBottom >= viewportCenter) {
      progress = (viewportCenter - lineTop) / lineHeight;
    } else if (lineBottom < viewportCenter) {
      progress = 1;
    }

    progress = Math.max(0, Math.min(1, progress));

    // Determine scroll direction based on progress change
    const progressDiff = progress - this.lastPageProgress;
    const currentDirection =
      Math.abs(progressDiff) > 0.0001
        ? progressDiff > 0
          ? "down"
          : "up"
        : null;

    // Check if at pause point (30%)
    const isAtPausePoint =
      Math.abs(progress - this.pauseStartProgress) <= this.pauseThreshold;

    // Determine if we should pause based on direction and pass status
    let shouldPause = false;

    if (isAtPausePoint && currentDirection) {
      if (currentDirection === "down" && !this.hasPassedForward) {
        shouldPause = true;
      } else if (currentDirection === "up" && !this.hasPassedBackward) {
        shouldPause = true;
      }
    }

    // Lock scroll if should pause
    if (shouldPause && !this.isPaused && !this.scrollLocked) {
      this.isPaused = true;
      this.lockScroll(currentDirection);
      this.messageContainer.classList.add("active", "animating");
      
      // Activate action container when pausing at 30%
      if (this.actionContainer) {
        this.actionContainer.classList.add("active");
      }

      // Update message scroll position
      const pauseZoneProgress =
        this.internalScrollProgress / this.scrollThreshold;
      this.updateMessageScroll(pauseZoneProgress);

      // Keep indicator at 30%
      progress = this.pauseStartProgress;
    }

    // Reset pass flags when far from pause zone
    const resetDistance = 0.12; // 12% away from pause point

    if (progress < this.pauseStartProgress - resetDistance) {
      this.hasPassedForward = false;
    }

    if (progress > this.pauseStartProgress + resetDistance) {
      this.hasPassedBackward = false;
    }

    // Update indicator position with fade in/out at edges
    const maxPosition = lineHeight - indicatorHeight;
    const indicatorProgress = progress * maxPosition;
    const appearingProgress = Math.min(
      1,
      indicatorProgress / startingAppearingHeight
    );
    const disappearingProgress = Math.min(
      1,
      (maxPosition - indicatorProgress) / disappearingHeight
    );
    const finalOpacity = Math.min(appearingProgress, disappearingProgress);

    this.indicator.style.opacity = finalOpacity;
    this.indicator.style.transform = `translateY(${indicatorProgress}px)`;

    // Show/hide message container and action container hint when near pause zone
    if (this.messageContainer) {
      const hintRange = 0.06; // Show hint 6% before/after pause point

      if (
        progress >= this.pauseStartProgress - hintRange &&
        progress <= this.pauseStartProgress + hintRange
      ) {
        this.messageContainer.classList.add("active");
        
        // Also show action container in hint range
        if (this.actionContainer) {
          this.actionContainer.classList.add("active");
        }
      } else if (!this.isPaused) {
        this.messageContainer.classList.remove("active", "animating");
        
        // Hide action container when outside range
        if (this.actionContainer) {
          this.actionContainer.classList.remove("active");
        }
      }
    }

    // Update last progress for direction detection
    this.lastPageProgress = progress;
  }

  updateMessageScroll(pauseZoneProgress) {
    if (!this.messageElements) return;

    const totalMessages = this.messageElements.length;
    const currentMessageFloat = pauseZoneProgress * (totalMessages - 1);
    const currentMessageIndex = Math.floor(currentMessageFloat);

    // Update each message state with smooth transitions
    this.messageElements.forEach((message, index) => {
      message.classList.remove("active", "completed");

      if (index < currentMessageIndex) {
        message.classList.add("completed");
      } else if (index === currentMessageIndex) {
        message.classList.add("active");
      }
    });

    // Smooth scroll position based on internal progress
    this.messagesWrapper.style.transform = `translateY(-${this.internalScrollProgress}px)`;
  }

  resetMessages() {
    if (!this.messageElements) return;

    this.messageElements.forEach((message) => {
      message.classList.remove("active", "completed");
    });

    if (this.messagesWrapper) {
      this.messagesWrapper.style.transform = "translateY(0)";
    }

    this.internalScrollProgress = 0;
  }
}

// video autoplay class
class VideoAutoplay {
  constructor() {
    this.videos = document.querySelectorAll(".shared-screen-video");
    this.init();
  }

  init() {
    if (this.videos.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const container = video.closest(".video-shared-screen");

        if (entry.isIntersecting) {
          this.loadAndPlayVideo(video, container);
        } else {
          this.pauseVideo(video);
        }
      });
    }, observerOptions);

    this.videos.forEach((video) => {
      this.observer.observe(video);
    });
  }

  loadAndPlayVideo(video, container) {
    // Load video source if not already loaded
    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      const source = video.querySelector("source");
      if (source && source.dataset.src) {
        source.src = source.dataset.src;
      }
    }

    // Play video when loaded
    video.addEventListener(
      "loadeddata",
      () => {
        video.classList.add("loaded");
        if (container) {
          container.classList.add("video-loaded");
        }
      },
      { once: true }
    );

    // Play with error handling
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }

  pauseVideo(video) {
    if (!video.paused) {
      video.pause();
    }
  }
}
// Broadcast Message Animator Class
class BroadcastMessageAnimator {
  constructor() {
    this.broadcastLine = document.querySelector(".broadcast-line");
    this.indicator = document.querySelector(".broadcast-indicator");
    this.messageBoxes = document.querySelectorAll(".broadcast-message-box");
    this.meetBox = document.querySelector(".meet-box");

    if (this.broadcastLine && this.indicator && this.messageBoxes.length > 0) {
      this.init();
    }
  }

  init() {
    this.setupScrollListener();
  }

  setupScrollListener() {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateActiveMessage();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    this.updateActiveMessage();
  }

  updateActiveMessage() {
    // Only run if meet-box is active
    if (!this.meetBox.classList.contains("active")) {
      return;
    }

    // Get indicator position relative to viewport
    const indicatorRect = this.indicator.getBoundingClientRect();
    const indicatorTop = indicatorRect.top + indicatorRect.height / 2;

    // Check each message box
    this.messageBoxes.forEach((box, index) => {
      const boxRect = box.getBoundingClientRect();
      const boxTop = boxRect.top;
      const boxBottom = boxRect.bottom;

      // Add active class if indicator is within box bounds
      if (indicatorTop >= boxTop && indicatorTop <= boxBottom) {
        box.classList.add("active");
      } else {
        box.classList.remove("active");
      }
    });
  }
}
// Transcript Animation Class
class TranscriptAnimation {
  constructor() {
    this.container = document.querySelector("[data-transcript-container]");
    if (!this.container) return;

    this.messages = [
      {
        speaker: "Vishal",
        time: "12:46 PM",
        text: "Let's start with the quarterly results overview",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:46 PM",
        text: "Sure, I've prepared the slides. Should I share my screen?",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:47 PM",
        text: "The numbers look promising this quarter. Revenue is up 23%",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "12:47 PM",
        text: "📝 Recording in progress. All participants visible.",
        type: "bot",
      },
      {
        speaker: "Vishal",
        time: "12:48 PM",
        text: "Great work team! Let's dive into the metrics breakdown",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:48 PM",
        text: "I'll walk through the customer acquisition numbers first",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:49 PM",
        text: "CAC is down 15% while retention improved significantly",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "12:49 PM",
        text: "💬 Transcript quality: Excellent. Audio clear.",
        type: "bot",
      },
      {
        speaker: "Vishal",
        time: "12:50 PM",
        text: "Excellent results. How's the product roadmap looking?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:50 PM",
        text: "On track for Q4 launch. Beta testing starts next month",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:51 PM",
        text: "We've completed 80% of the core features already",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "12:51 PM",
        text: "That's ahead of schedule! What about the mobile app?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:52 PM",
        text: "iOS version is in TestFlight. Android following in two weeks",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:52 PM",
        text: "Early feedback from beta testers has been overwhelmingly positive",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "12:52 PM",
        text: "🎯 Key topics detected: Product roadmap, mobile apps, beta testing",
        type: "bot",
      },
      {
        speaker: "Vishal",
        time: "12:53 PM",
        text: "Let's talk about the marketing strategy for launch",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:53 PM",
        text: "We're planning a phased rollout starting with existing users",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:54 PM",
        text: "Content marketing pieces are ready. Blog posts, case studies, and tutorials",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "12:54 PM",
        text: "Good. What's the social media calendar looking like?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:55 PM",
        text: "We have 4 weeks of content scheduled across all platforms",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:55 PM",
        text: "Influencer partnerships are confirmed. Launch event is set for the 15th",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "12:55 PM",
        text: "⏰ Meeting duration: 9 minutes. Recording quality: HD",
        type: "bot",
      },
      {
        speaker: "Vishal",
        time: "12:56 PM",
        text: "Perfect timing. Now, let's review the financial projections",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:56 PM",
        text: "Q4 projections show 35% growth over Q3 numbers",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:57 PM",
        text: "Operating costs are down 12% due to infrastructure optimizations",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "12:57 PM",
        text: "That's impressive. How are we handling the increased server load?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:58 PM",
        text: "Moved to auto-scaling architecture. Can handle 10x current traffic",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "12:58 PM",
        text: "Plus we've implemented CDN for faster global content delivery",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "12:58 PM",
        text: "💡 Action items detected: Review financial projections, infrastructure updates",
        type: "bot",
      },
      {
        speaker: "Vishal",
        time: "12:59 PM",
        text: "Excellent updates all around. Team morale and bandwidth?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "12:59 PM",
        text: "Team is energized. We hired 3 new engineers this month",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:00 PM",
        text: "Everyone's excited about the upcoming launch. No burnout concerns",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:00 PM",
        text: "That's what I like to hear. Let's wrap up with next steps",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:01 PM",
        text: "Final QA testing completes Friday. Marketing assets go live Monday",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:01 PM",
        text: "Press release drafted. Waiting for your final approval Vishal",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:02 PM",
        text: "I'll review it today. Great work team, this is going to be huge!",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "1:02 PM",
        text: "✅ Meeting summary ready. Recording saved. Transcript available.",
        type: "bot",
      },
      {
        speaker: "Harsh",
        time: "1:03 PM",
        text: "Before we wrap, should we discuss the customer support strategy?",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:03 PM",
        text: "Good point. We're setting up 24/7 support with a chatbot for initial queries",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:04 PM",
        text: "What's the escalation process for complex issues?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:04 PM",
        text: "Three-tier system. Chatbot, then support team, then engineering if needed",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "1:04 PM",
        text: "📊 Sentiment analysis: Positive tone detected throughout meeting",
        type: "bot",
      },
      {
        speaker: "Mayank",
        time: "1:05 PM",
        text: "We've also created a comprehensive knowledge base with 50+ articles",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:05 PM",
        text: "Response time targets? What are we committing to customers?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:06 PM",
        text: "Under 2 hours for critical issues, 24 hours for general inquiries",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:06 PM",
        text: "We're tracking everything in our new ticketing system with real-time analytics",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:07 PM",
        text: "Love it. What about enterprise customers? Any special considerations?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:07 PM",
        text: "They get dedicated account managers and priority support channels",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "1:07 PM",
        text: "🔍 Key decision point identified: Enterprise support tier structure",
        type: "bot",
      },
      {
        speaker: "Mayank",
        time: "1:08 PM",
        text: "Custom SLAs for enterprise tier with 99.9% uptime guarantee",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:08 PM",
        text: "That's competitive. How are we differentiating from competitors?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:09 PM",
        text: "AI-powered features, better pricing, and superior user experience",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:09 PM",
        text: "Our onboarding is 60% faster than the closest competitor",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:10 PM",
        text: "Impressive data. Have we validated these claims with actual users?",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:10 PM",
        text: "Yes, through our beta program. 87% reported easier setup than alternatives",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "1:10 PM",
        text: "⚡ Meeting insights: 12 action items, 8 decisions made, 3 follow-ups needed",
        type: "bot",
      },
      {
        speaker: "Mayank",
        time: "1:11 PM",
        text: "We should schedule a follow-up next week to review launch prep",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:11 PM",
        text: "Agreed. Same time next Thursday? I'll send calendar invites",
        type: "normal",
      },
      {
        speaker: "Harsh",
        time: "1:12 PM",
        text: "Works for me. I'll prepare a final checklist for that meeting",
        type: "normal",
      },
      {
        speaker: "Mayank",
        time: "1:12 PM",
        text: "Perfect. I'll have updated metrics and any early user feedback ready",
        type: "normal",
      },
      {
        speaker: "Vishal",
        time: "1:13 PM",
        text: "Fantastic session everyone. Really proud of this team's execution",
        type: "normal",
      },
      {
        speaker: "Rolaa Bot",
        time: "1:13 PM",
        text: "🎬 Recording complete. Duration: 27 minutes. Transcript processing complete.",
        type: "bot",
      },
    ];

    this.currentIndex = 0;
    this.isTyping = false;
    this.typingSpeed = 30;
    this.messageDelay = 1500;
    this.loopDelay = 3000;
    this.observer = null;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: "0px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isTyping) {
          this.startAnimation();
        }
      });
    }, options);

    this.observer.observe(this.container);
  }

  async startAnimation() {
    this.isTyping = true;
    this.container.innerHTML = "";
    this.currentIndex = 0;

    while (this.currentIndex < this.messages.length) {
      await this.displayMessage(this.messages[this.currentIndex]);
      this.currentIndex++;
      await this.delay(this.messageDelay);
    }

    await this.delay(this.loopDelay);
    this.isTyping = false;
    this.startAnimation();
  }

  async displayMessage(messageData) {
    const messageEl = document.createElement("div");
    messageEl.className = `transcript-message ${
      messageData.type === "bot" ? "bot-message" : ""
    }`;

    const headerEl = document.createElement("div");
    headerEl.className = "message-header";
    headerEl.innerHTML = `
            <span class="speaker-name">${messageData.speaker}</span>
            <span class="message-time">${messageData.time}</span>
        `;

    const textEl = document.createElement("p");
    textEl.className = "message-text typing";

    messageEl.appendChild(headerEl);
    messageEl.appendChild(textEl);
    this.container.appendChild(messageEl);

    // Smooth scroll to bottom with animation
    await this.smoothScrollToBottom();

    // Trigger slide-in animation with delay for smoother effect
    await this.delay(100);
    messageEl.classList.add("visible");

    // Type out the message
    await this.typeText(textEl, messageData.text);

    // Remove typing cursor
    textEl.classList.remove("typing");
  }

  async typeText(element, text) {
    for (let i = 0; i < text.length; i++) {
      element.textContent = text.substring(0, i + 1);
      await this.delay(this.typingSpeed);

      // Auto-scroll as text appears
      if (i % 10 === 0) {
        // Update scroll every 10 characters for performance
        await this.smoothScrollToBottom();
      }
    }

    // Final scroll after typing completes
    await this.smoothScrollToBottom();
  }

  async smoothScrollToBottom() {
    const targetScroll = this.container.scrollHeight;
    const currentScroll = this.container.scrollTop;
    const distance = targetScroll - currentScroll;

    if (distance > 0) {
      // Use smooth scroll behavior
      this.container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Card Cycling Animation Class
class HeroCardCycling {
  constructor() {
    this.cards = [
      document.querySelector(".hero-card-back-1"),
      document.querySelector(".hero-card-back-2"),
      document.querySelector(".hero-card-back-3"),
      document.querySelector(".hero-card-back-4"),
      document.querySelector(".hero-card-back-5"),
    ];

    if (this.cards.some((card) => !card)) {
      console.warn("HeroCardCycling: Required card elements not found");
      return;
    }

    this.cycleInterval = 4000; // 4 seconds between cycles
    this.transitionDuration = 1200; // Must match CSS transition duration
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Start the cycling animation
    this.startCycling();
  }

  startCycling() {
    setInterval(() => {
      if (!this.isAnimating) {
        this.cycleCards();
      }
    }, this.cycleInterval);
  }

  async cycleCards() {
    this.isAnimating = true;

    // Step 1: Fade out the last card (card-5)
    const lastCard = this.cards[4];
    lastCard.classList.add("transitioning-out");

    // Wait for fade out to complete
    await this.delay(this.transitionDuration);

    // Step 2: Move all cards back by one position
    // Remove the last card from array
    const removedCard = this.cards.pop();

    // Add moving-back class to all remaining cards for smooth transition
    this.cards.forEach((card) => card.classList.add("moving-back"));

    // Update card classes to move them back one position
    this.cards[3].className = "hero-card-back-5 moving-back"; // card-4 becomes card-5
    this.cards[2].className = "hero-card-back-4 moving-back"; // card-3 becomes card-4
    this.cards[1].className = "hero-card-back-3 moving-back"; // card-2 becomes card-3
    this.cards[0].className = "hero-card-back-2 moving-back"; // card-1 becomes card-2

    // Wait for position change
    await this.delay(50);

    // Remove moving-back class to let CSS transitions take effect
    this.cards.forEach((card) => card.classList.remove("moving-back"));

    // Step 3: Add new card at the front
    removedCard.className = "hero-card-back-1 transitioning-in";
    removedCard.classList.remove("transitioning-out");

    // Add to beginning of array
    this.cards.unshift(removedCard);

    // Trigger reflow
    void removedCard.offsetWidth;

    // Make new card visible
    await this.delay(50);
    removedCard.classList.add("visible");

    // Wait for new card to fully appear
    await this.delay(this.transitionDuration);

    // Clean up classes
    removedCard.classList.remove("transitioning-in", "visible");

    this.isAnimating = false;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Starfield Background Animation Class
class StarfieldBackground {
  constructor() {
    this.heroSection = document.querySelector(".hero");
    this.starCounts = {
      small: 700,
      medium: 200,
      large: 100,
    };
    this.init();
  }

  init() {
    if (!this.heroSection) {
      console.warn("Hero section not found for starfield background");
      return;
    }
    this.createStarfield();
  }

  createStarfield() {
    const starfield = document.createElement("div");
    starfield.className = "starfield";

    // Create three layers of stars with different speeds
    for (let layer = 1; layer <= 3; layer++) {
      const starsLayer = document.createElement("div");
      starsLayer.className = `stars-layer stars-layer-${layer}`;

      let count, size;
      if (layer === 1) {
        count = this.starCounts.small;
        size = "small";
      } else if (layer === 2) {
        count = this.starCounts.medium;
        size = "medium";
      } else {
        count = this.starCounts.large;
        size = "large";
      }

      // Generate stars
      for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = `star star-${size}`;

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        // Add slight random opacity variation
        const opacity = 0.5 + Math.random() * 0.5;
        star.style.opacity = opacity;

        starsLayer.appendChild(star);
      }

      starfield.appendChild(starsLayer);
    }

    // Insert starfield as first child of hero section
    this.heroSection.insertBefore(starfield, this.heroSection.firstChild);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WaitlistManager();
  new FAQManager();
  new ScrollProgressBoxes();
  new ScrollAnimations();
  new ScrollTourTyping();
  new DemoAnimation();
  new SmoothScroll();
  new NavbarScroll();
  new PerformanceOptimizer();
  new ProgressIconAnimation();
  new BroadcastIndicatorScroll();
  new VideoAutoplay();
  new TranscriptAnimation();
  new BroadcastMessageAnimator();
  new HeroCardCycling();
  new StarfieldBackground();
});

// Handle page visibility changes for better performance
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.body.style.animationPlayState = "paused";
  } else {
    // Resume animations when page becomes visible
    document.body.style.animationPlayState = "running";
  }
});

// Add loading states and error handling
window.addEventListener("load", () => {
  // Remove any loading indicators
  document.body.classList.add("loaded");

  // Add fade-in effect to hero section
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.add("fade-in-up");
  }
});

// Handle form submissions with proper error handling
document.addEventListener("submit", (e) => {
  e.preventDefault();
  // Handle form submissions here if needed
});

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // ESC key closes any open modals or dropdowns
  if (e.key === "Escape") {
    document.querySelectorAll(".faq-item.active").forEach((item) => {
      item.classList.remove("active");
    });
  }
});

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
