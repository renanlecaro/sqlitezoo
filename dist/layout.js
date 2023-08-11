
const content = document.getElementById('content')
const menu = document.getElementById('menu')

if(localStorage.getItem('content-width')){
    content.style.width=localStorage.getItem('content-width')+'px'
}
if(localStorage.getItem('menu-width')){
    menu.style.width=localStorage.getItem('menu-width')+'px'
}
let observer = new ResizeObserver(function(mutations) {
    console.log('resized',content.getBoundingClientRect().width)
    localStorage.setItem('content-width', content.getBoundingClientRect().width)
    localStorage.setItem('menu-width', menu.getBoundingClientRect().width)
});

observer.observe(content);
observer.observe(menu);

menu.querySelector('a[href="'+window.location.pathname.slice(1)+'"]')?.classList.add('active')

