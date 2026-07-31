let gstSwitch=document.getElementById("switchCheckChecked");
gstSwitch.addEventListener("click",()=>{
    let taxinfo=document.getElementsByClassName("gst");
    for(info of taxinfo){
        if(info.style.display!="inline"){
            info.style.display="inline";
        }
        else{
            info.style.display="none";
        }
    }
})