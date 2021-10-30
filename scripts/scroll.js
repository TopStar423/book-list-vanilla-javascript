// script for fixed header on scroll
window.onscroll = function() {scrollFunction()};

const scrollFunction = () => {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        if (width > 576) {
            document.getElementById("navbar").style.padding = "10px 60px";
            document.getElementById("logo").style.fontSize = "25px";
        } else {
            document.getElementById("navbar").style.padding = "10px 30px";
            document.getElementById("logo").style.fontSize = "20px";
        }
    } else {
        if (width > 576) {
            document.getElementById("navbar").style.padding = "30px 80px";
            document.getElementById("logo").style.fontSize = "35px";
        } else {
            document.getElementById("navbar").style.padding = "20px 30px";
            document.getElementById("logo").style.fontSize = "30px";
        }
    }
}