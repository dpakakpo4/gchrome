let  add = document.getElementById('add');
let shorcutMain = document.getElementById('shorcutMain');
let close = document.getElementById('close_modal');
let modal = document.getElementById('modal');
let urlForm = document.getElementById('urlForm');
let urlInput = document.getElementById('urlInput');
const btnMessage = document.getElementById('submit');
const img = document.getElementById('image');

add?.addEventListener('click',()=>{
    showModal();
});

close?.addEventListener('click',()=>{
    closeModal();
});
chrome.storage.sync.get(['GChromeTABLE'], function(result) {
  console.log('Value currently is equal to :' + JSON.stringify(result.key));
});
initializeGChromeBoxTable();
urlForm.onsubmit = (event = new Event()) =>{
    event.preventDefault();
    const link = event.target[0].value;
    btnMessage.innerText  = 'loading...';
    btnMessage.style.backgroundColor = '#ffbf00';
    loadData(link);
}

function showModal(){
    modal.classList.add('visible');
};

function closeModal(){
    modal.classList.remove('visible');
}

async function loadData(url){
    postData(`https://ezolinkpreview.herokuapp.com/getlinkpreview`, { url: url })
    .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
      btnMessage.innerText  = 'completed...';
      btnMessage.style.backgroundColor = 'green';
      img.style.backgroundImage = `url(${data.imgUrl})`;
      closeModal();
      setTimeout(()=>{
        addBox(data);
      },1000)
      // img.style.display = 'block';  
    })

}
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
  

function addBox(data = {}){
    let box = document.createElement('a');
    let img = document.createElement('img');
    img.src = `${data.imgUrl}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '0.5em';
    box.setAttribute('class','box animate__animated animate__fadeIn');
    box.append(img);
    box.href = data.link;
    box.target = '_blank';
    shorcutMain.insertBefore(box,shorcutMain.children[shorcutMain.children.length-1]);
    chrome.storage.sync.set({'link': data.link}, function() {
      console.log('Table initialized successfully');
    });
}

function initializeGChromeBoxTable(data) {
  // Get a value saved in a form.
  var TAB = [''];
  // Check that there's some code there.
  chrome.storage.sync.get(['GChromeTABLE'], function(result) {
    console.log('Value currently is ' + result.key);
    if(result){
      return;
    }
  });
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'GChromeTABLE': TAB}, function() {
    console.log('Table initialized successfully');
  });
}