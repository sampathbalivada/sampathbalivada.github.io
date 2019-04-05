var instagram = document.getElementById("instagram");
instagram.onclick = function(event) {
    window.location.href = 'https://instagram.com/sampathbalivada';
};

var linkedin = document.getElementById("linkedin");
linkedin.onclick = function(event) {
    window.location.href = 'https://linkedin.com/in/sampathbalivada';
};

var github = document.getElementById("github");
github.onclick = function(event) {
    window.location.href = 'https://github.com/sampathbalivada';
};

var email = document.getElementById("email");
email.onclick = function(event) {
    window.location.href = 'mailto:balivadask2000@gmail.com';
};

var email = document.getElementById("medium");
medium.onclick = function(event) {
    window.location.href = 'https://www.medium.com/@sampathbalivada';
};

window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var content = document.getElementById("info");
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky-header");
    content.classList.add("sticky-content");
    document.getElementById("designation").style.display = "none";
    isMobile ? header.classList.add("mobile") : header.classList.add("desktop");
  } else {
    header.classList.remove("sticky-header");
    content.classList.remove("sticky-content")
    document.getElementById("designation").style.display = "block";    
    isMobile ? header.classList.remove("mobile") : header.classList.remove("desktop");
  }
}

var techStack = new Array("C", "C++", "Java", "Python", "Dart", "Flutter");

for(var x=0; x<techStack.length; x++) {
  techTable = document.getElementById("tech-table");
  techTable.innerHTML += '<div align="center" style="display: table-cell"><img class="content-icon" src="assets/languages/'+ (x+1) +'.png"/><p>' + techStack[x] +'</p></div>';
}