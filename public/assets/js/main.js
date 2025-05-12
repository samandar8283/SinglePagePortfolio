// === Accardion js start ===
$(document).ready(function () {
    $('#education-itemFirst, #work-itemFirst').show();

    $('.toggle-button').click(function () {
        const targetSelector = $(this).data('target');
        const target = $(targetSelector);
        const icon = $(this).find('.toggle-icon');
        if (target.is(':visible')) {
            icon.text('+');
        } else {
            icon.text('-');
        }
        target.slideToggle(400);
    });
    $(window).on("resize", function () {
        if ($(window).width() > 767.9) {
            $('#education-itemFirst, #work-itemFirst').show();
        }
    });
});
// === Accardion js end ===

// === Splide js start ===
$(function () {
    const carousels = [
        { selector: '#card-carousel-left', speed: ($(window).width() < 767.9 ? 0.2 : 0.2)},
        { selector: '#card-carousel-right', speed: -($(window).width() < 767.9 ? 0.2 : 0.2)}
    ];

    carousels.forEach(c => {
        new Splide(c.selector, {
            type: 'loop',
            perPage: 5,
            gap: '20px',
            arrows: false,
            pagination: false,
            drag: false,
            wheel: false,
            autoScroll: {
                speed: c.speed,
                pauseOnHover: false,
                pauseOnFocus: false
            },
            breakpoints: {
                1099.9: {
                    perPage: 4 // Kichik ekranlar uchun
                }
            }
        }).mount({ AutoScroll: window.splide.Extensions.AutoScroll });
    });
});
// === Splide js end ===

// === Progress-bar js start ===
$(document).ready(function () {
    let animated = false;

    function animateProgressBars() {
        $('.progress-bar').each(function (i) {
            const $bar = $(this);
            const percent = parseInt($bar.data('percent'));
            const $valueDisplay = $('.percent').eq(i);

            let start = 0;
            const end = percent;
            const duration = 2000;
            let startTime = null;

            function animate(time) {
                if (!startTime) startTime = time;
                const progress = time - startTime;
                const percentNow = Math.min((progress / duration) * end, end);

                $bar.css('width', end + '%');
                $valueDisplay.css('left', end + '%');
                $valueDisplay.text(Math.floor(percentNow) + '%');

                if (percentNow < end) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        });
    }

    function isInViewport($el) {
        const rect = $el[0].getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    $(window).on('scroll', function () {
        const $skill = $('.technologic-knowledge');
        if (!animated && isInViewport($skill)) {
            animateProgressBars();
            animated = true;
        }
    });
});
// === Progress-bar js end ===

// === Form js start ===
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async (event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')

            if(form.checkValidity()) {
                event.preventDefault();

                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                };
            
                try {
                    console.error("Xatolik");
                    const response = await fetch('/.netlify/functions/telegramBot', {
                      method: 'POST',
                      body: JSON.stringify(data),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                
                    const result = await response.json();
                    if (response.ok) {
                        $('#successMessage').fadeIn().delay(3000).fadeOut();
                        $('#contact-form')[0].reset();
                        form.classList.remove('was-validated');
                    } else {
                        $('#errorMessage').fadeIn().delay(3000).fadeOut();
                        form.classList.remove('was-validated');
                    }
                } catch (error) {
                    $('#errorMessage').fadeIn().delay(3000).fadeOut();
                    form.classList.remove('was-validated');
                }
            }
        });
    });
})();
// === Form js end === 

// === Scroll js start ===
$(document).ready(function () {
    const $sections = $("section");
    const $navLinks = $(".nav-link");
    const $header = $("header#home");
    const $navbar = $("#navigation");

    $(window).on("scroll", function () {
        let currentSection = "";
        const scrollPos = $(window).scrollTop() + ($(window).width() < 991.9 ? 70 : 65);

        const headerBottom = $header.offset().top + $header.outerHeight() + ($(window).width() < 991.9 ? 0 : 65);

        if (scrollPos <= headerBottom) {
            currentSection = "home";
            if($navbar.hasClass("navigation-shadow")) {
                $navbar.removeClass("navigation-shadow");
            }
        } else {
            $navbar.addClass("navigation-shadow");
            $sections.each(function () {
                const $section = $(this);
                const id = $section.attr("id");
                const sectionTop = $section.offset().top;
                const sectionHeight = $section.outerHeight();

                const $about = $("#about");
                const aboutBottom = $about.offset().top + $about.outerHeight();

                if (scrollPos > headerBottom && scrollPos < aboutBottom) {
                    currentSection = "about";
                }
                else if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    if (
                        id === "resume" ||
                        id === "soft-skills" ||
                        id === "technologic-knowledge"
                    ) {
                        currentSection = "resume";
                    } else {
                        currentSection = id;
                    }
                }
            });
        }

        $navLinks.removeClass("active");
        $navLinks.each(function () {
            const href = $(this).attr("href").substring(1);
            if (href === currentSection) {
                $(this).addClass("active");
            }
        });
    });

    function smoothScroll($target, duration) {
        const targetPosition = $target.offset().top - ($(window).width() < 991.9 ? 69 : 64);
        const startPosition = $(window).scrollTop();
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const ease = progress < 0.5
                ? 4 * Math.pow(progress, 3)
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const scrollAmount = startPosition + distance * ease;
            window.scrollTo(0, scrollAmount);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    $(".nav-link, .about-me, #to-top-button").on("click", function (event) {
        event.preventDefault();
        const targetId = $(this).attr("href").substring(1);
        const $targetSection = $("#" + targetId);
        smoothScroll($targetSection, 1000);

        const $navbarCollapse = $("#navbarSupportedContentBottom");
    
        if ($navbarCollapse.hasClass("show")) {
            $navbarCollapse.collapse("hide");
        }
    });
});
// === Scroll js end ===

// === To-top button js start ===
$(document).ready(function() {
    const $topButton = $("#to-top-button");
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > ($(window).width() < 767.9 ? 200 : 300)) {
            $topButton.fadeIn(300);
            $topButton.css("display","block");
        } else {
            $topButton.fadeOut(100);
        }
    });
});
// === /To-top button js end ===

// === .collapse scroll block start ===
$(document).ready(function () {
    const $navbarCollapse = $("#navbarSupportedContentBottom");
    
    $navbarCollapse.on("show.bs.collapse", function () {
        $("body").css("overflow", "hidden");
    });

    $navbarCollapse.on("hidden.bs.collapse", function () {
        $("body").css("overflow", "auto");
    });
});
// === .collapse scroll block end ===

// === Settings js start ===
$(document).ready(function() {
    // fonts
    const $fonts = $("span.font");
    const $primary_text = $(".primary-text");
    const $secondary_text = $(".secondary-text");
    $fonts.on("click", function(event) {
        $fonts.removeClass("active");
        $(this).addClass("active");
        const $font = $(this).css("font-family");
        $primary_text.css("font-family",$font);
        $secondary_text.css("font-family",$font);
        $("html").removeClass();
        $("html").addClass($font.toLowerCase());
    });

    // colors
    const $colors = $("span.color");
    const $changeable_bgs = $(".changeable-bg");
    const $changeable_texts= $(".changeable-text");

    $colors.on("click", function(event) {
        $colors.removeClass("active");
        $(this).addClass("active");
        const $color = $(this).css("background-color");
        $changeable_bgs.css("background-color", $color);
        $changeable_texts.css("color", $color);
    });

    // buttons
    $("#switch-style__toggle").on("click", function() {
        $(".switch-style").toggleClass("active");
    });

    const $font_button = $("#fonts-refresh");
    $font_button.on("click", function() {
        $("html").removeClass();
        $fonts.removeClass("active");
        $primary_text.css("font-family", "Montserrat");
        $secondary_text.css("font-family", "Open sans");
    });

    const $color_button = $("#colors-refresh");
    $color_button.on("click", function() {
        $colors.removeClass("active");
        $changeable_bgs.css("background-color", "blue");
        $changeable_texts.css("color", "blue");
    })
});
// === Settings js end ===

// === Mode toggle js start ===
$(document).ready(function() {
    const $toggleBtn = $('#mode-toggle-1, #mode-toggle-2');
    const $root = $('html');
  
    $toggleBtn.click(function() {
      const currentTheme = $root.attr('data-theme');
      const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
  
      $root.attr('data-theme', newTheme);
      $('.navbar').attr('data-bs-theme', newTheme);
  
      localStorage.setItem('theme', newTheme);
    });
});
// === Mode toggle js end ===

// === Dropdown-menu position js start ===
$(document).ready(function() {
    if ($(window).width() > 992) {
        $(window).on("scroll", function () {
            if($(this).scrollTop() < 300) {
                $(".dropdown-menu").css("top", "-260%");
                $(".dropdown-menu[data-bs-popper]").css("top", "-260%");
            }
            else {
                $(".dropdown-menu").css("top", "100%");
                $(".dropdown-menu[data-bs-popper]").css("top", "100%");
            }
        });     
    };
    $(".dropdown-toggle").on("click", function(event) {
        event.preventDefault();
        if($(window).scrollTop() < 300) {
            $(".dropdown-menu").css("top", "-260%");
            $(".dropdown-menu[data-bs-popper]").css("top", "-260%");
        }
        else {
            $(".dropdown-menu").css("top", "100%");
            $(".dropdown-menu[data-bs-popper]").css("top", "100%");
        }
    });
});
// === Dropdown-menu position js end ===

// === Download modal js start ===
$(document).ready(function () {
    
    let scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    function ownRightSize() {
        $(".switch-style__toggle").css({
            "right": ($(window).width() > 575.9 ? 239 : 219) + "px",
        });
        $(".to-top").css({
            "right": ($(window).width() > 575.9 ? 3 : 5) + "%",
        });
    }

    function updateRightSize() {
        $(".switch-style__toggle").css({
            "right": scrollWidth + ($(window).width() > 575.9 ? 239 : 219) + "px",
        });
        $(".to-top").css({
            "right": "calc(" + ($(window).width() > 575.9 ? 3 : 5) + "% + " + scrollWidth + "px)",
        });
    }
    
    $("#download-resume, .portfolio-card__link").on("click", function (event) {
        updateRightSize();
    });

    $("#download-close-btn, #portfolio-close-btn-1, #portfolio-close-btn-2").on("click", function (event) {
        ownRightSize();
    });

    $(window).on("resize", function () {
        scrollWidth = window.innerWidth - document.documentElement.clientWidth;
        if ($(".modal").hasClass("show")) {
            updateRightSize();
        }
        else {
            ownRightSize();
        }
    });

    $("#download-modal, #portfolio-modal").on("hide.bs.modal", function () {
        ownRightSize();
    });
});
// === /Download modal js end ===