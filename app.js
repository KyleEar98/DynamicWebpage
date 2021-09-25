//we are using gsap, scrollmagic, and add indicators for animations
//we are using barbajs for animations when switching pages
let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  //Init Controller

  controller = new ScrollMagic.Controller();

  //Select some things
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //Loop over each sllide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
        //grabbing div that is covering all the context
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");  
        //gsap
        //can create a timeline and chain multiple animations
        const slideTl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" }
        });
      
          slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
          slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
          slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
      
    //pass the img 
    //first object will tell where to animate from
    //second object will tell where to animate to
    //-=1 animates 1 second sooner
    //zooming effect of the image
    //we had to add overflow hidden to hero-img so img wont be bigger than webpage when animating

    //create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
        //class will be added once it hits position .25 of the page
        reverse: false
      })
    .setTween(slideTl)
    .addIndicators({
      colorStart: "white",
      colorTrigger: "white",
      name: "slide"
    })
    .setTween(slideTl)
    //passes in the timeline we made above
    //will start the transitions of revealimg and text when we scroll down to each part
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "slide"
      // })
      .addTo(controller); //makes it gsap adding to controller

    //new animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
        duration: '100%', //lasts the whole height of the slide
        triggerHook: 0
      })
        // .addIndicators({
        //   colorStart: "white",
        //   colorTrigger: "white",
        //   name: "page",
        //   indent: 200
        // })
        .setPin(slide, { pushFollowers: false })
    //push followers makes content come on top after opacity is 0 of current slide
    //setting pin is for the fromTo above
    //which makes opacity change of each section as we scroll
    .setTween(pageTl)
    .addTo(controller);
});
}
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
function cursor(e) {
mouse.style.top = e.pageY + "px";
mouse.style.left = e.pageX + "px";
}


function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
        //this is the title changing color check css it is white from transform translate
        //and this gsap above changes it to its original color
        mouseTxt.innerText = "Tap";
      } else {
        mouse.classList.remove("explore-active");
        mouseTxt.innerText = "";
        gsap.to(".title-swipe", 1, { y: "100%" });
      }
    }

  function navToggle(e) {
    if (!e.target.classList.contains("active")) {
      e.target.classList.add("active");
    
      //use gsap to rotate line one and two 45 deg in .5sec
      gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
      //y rotates the line the right way we want
      gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
      gsap.to("#logo", 1, { color: "black" });
      gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
      //we are increasing our white circle that we hid in the top right of the screen
    document.body.classList.add("hide");
  } else {
      e.target.classList.remove("active");
      gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to("#logo", 1, { color: "white" });
      gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
      document.body.classList.remove("hide");
  }
}


//barba page transitions

const logo = document.querySelector("#logo");
//invoke barba
barba.init({
  views: [

    //will let us run certain functionality on certain pages
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        //not using scroll magic on next page so destroy it
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      }
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        //for when we go to other page and want to go back to home with logo
        detailAnimation();
        //ease in nav after transitioning pages
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      }
    }
  ],
  transitions: [
    {
      leave({ current, next }) {
        //current main part of website  and next container
        let done = this.async(); 
        //part of where when to tell barba to do these animations
        window.scrollTo(0,0);//x and y
        //will scroll back to top of page after animation
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
         //fade out current container from opac 1 to 0
         tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //x and y
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
        //x is which way to staggered pages come in
        { x: "100%", stagger: 0.2, onComplete: done }
        );
        //stagger makes the color pages go one by one
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      }
    }
  ]
});
//first thing we do is fade out current content
//second animation we grab all the swipes and move them into view one by one


function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "detailScene"
      // })
      .addTo(controller);
  });
}
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
