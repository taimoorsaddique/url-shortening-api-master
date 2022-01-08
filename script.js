const form = document.getElementById("form");
const linkInput = document.getElementById("link");
const outputContainer = document.getElementById("outputContainer");
const errorContainer = document.getElementById("errorContainer");
const submitBtn = document.getElementById("submitBtn");

const bindCopyEvent = () =>{
  let copyBtns = document.querySelectorAll(".output-btn");
  copyBtns.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      btn.innerHTML = "copied!";
      navigator.clipboard.writeText(btn.dataset.shortlink);
       window.setTimeout(()=>{
        btn.innerHTML = "copy!";
      }, 1000);
    });
  });
};
bindCopyEvent();

let errorActivated = false;
const requestNewUrl = async (originalUrl) =>{
  const apiUrl = `https://api.shrtco.de/v2/shorten?url=${originalUrl}`;
  try{
    const response = await fetch(apiUrl);
    const data = await response.json();
    outputContainer.prepend(createChildren(data));
    bindCopyEvent();
    submitBtn.value = "Shorten It!";
    submitBtn.disabled = false;
}catch(e){
    console.log(e);
  } 
}




form.addEventListener("submit", (e) => {
  e.preventDefault();
  if(linkInput.value == ""){
    errorContainer.style.display = "block";
    linkInput.style.border = "2px solid red";
    if(!errorActivated){
        errorActivated = !errorActivated;
    }
  }else{
   
    requestNewUrl(linkInput.value);
    submitBtn.disabled = true;
    submitBtn.value = "Processing...";
  }
});


linkInput.addEventListener('keyup', (e)=>{
    if(errorActivated){
        if(event.target.value != ""){
            errorActivated = false;
            errorContainer.style.display = "none";
            linkInput.style.border = "none";
        }
    }
});

const createChildren = (data)=>{
  
    if(!data){
      console.log("hello");
    }
    const output = document.createElement('div');
    output.innerHTML = `
    <div class="output-link original-link">${data.result.original_link}</div>
    <div class="output-link short-link">${data.result.full_short_link}</div>
    <button class="btn output-btn" data-shortlink="${data.result.full_short_link}">Copy!</button>
   `;
    output.classList.add("output");
    return output;
}