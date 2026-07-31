let filters=document.getElementsByClassName("filter");
for(let filter of filters){
    filter.addEventListener("click",()=>{
        filter.style.opacity="1";
        const category = filter.innerText;
        window.location.href=`/listings?category=${category}`;
    })
}
