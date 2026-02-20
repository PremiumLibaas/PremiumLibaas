import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  "https://gemntdgboyxotbuwpiss.supabase.co",
  "sb_publishable_PCnYzjM7FYGxrcEJb-sihg_B7xInX6Y"
);

const BUY_LINKS={
 instagram:"https://instagram.com/premium_libaas",
 tiktok:"https://www.tiktok.com/@premium_libaas",
 facebook:"https://www.facebook.com/profile.php?id=61585372481020"
};

let products=[];
const grid=document.getElementById("productGrid");
const modal=document.getElementById("modal");
const slider=document.getElementById("modalSlider");
const modalTitle=document.getElementById("modalTitle");
const prevArrow=document.getElementById("prevArrow");
const nextArrow=document.getElementById("nextArrow");
const sizesContainer=document.getElementById("sizesContainer");

let currentImages=[];
let currentIndex=0;
let startX=0;

/* LOAD PRODUCTS */
async function loadProducts(){
 const {data}=await supabase.from("products").select("*").eq("active",true);
 products=data||[];
 renderProducts(products);
}
loadProducts();

/* RENDER GRID */
function renderProducts(list){
 grid.innerHTML="";
 list.forEach(p=>{
  const card=document.createElement("div");
  card.className="card";
  card.dataset.id=p.id;
  card.innerHTML=`
    <img src="${p.main_image}">
    <div class="info">
      <h3>${p.title}</h3>
      <span>${p.subtitle||""}</span>
    </div>
  `;
  grid.appendChild(card);
 });
}

/* OPEN MODAL */
grid.addEventListener("click",e=>{
 const card=e.target.closest(".card");
 if(!card)return;
 const p=products.find(x=>x.id==card.dataset.id);

 currentImages=[p.main_image,...(p.extra_images||[])];
 loadImages(currentImages);

 modalTitle.innerText=p.title;
 renderSizes(p.sizes||[]);

 document.querySelector(".instagram").href=BUY_LINKS.instagram;
 document.querySelector(".tiktok").href=BUY_LINKS.tiktok;
 document.querySelector(".facebook").href=BUY_LINKS.facebook;

 modal.style.display="flex";
});

/* IMAGES */
function loadImages(images){
 slider.innerHTML="";
 images.forEach(src=>{
  const img=document.createElement("img");
  img.src=src;
  slider.appendChild(img);
 });
 currentIndex=0;
 updateSlide();
}
function updateSlide(){
 slider.style.transform=`translateX(-${currentIndex*100}%)`;
}
prevArrow.onclick=()=>{currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;updateSlide();}
nextArrow.onclick=()=>{currentIndex=(currentIndex+1)%currentImages.length;updateSlide();}

/* TOUCH SWIPE */
slider.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
slider.addEventListener("touchend",e=>{
 let diff=startX-e.changedTouches[0].clientX;
 if(diff>50&&currentIndex<slider.children.length-1)currentIndex++;
 if(diff<-50&&currentIndex>0)currentIndex--;
 updateSlide();
});

/* SIZES */
function renderSizes(sizes){
 sizesContainer.innerHTML="";
 sizes.forEach(s=>{
  const pill=document.createElement("div");
  pill.className="size-pill";
  pill.innerText=s.label;
  if(!s.stock)pill.classList.add("out");
  sizesContainer.appendChild(pill);
 });
}

/* CLOSE */
window.closeModal=()=>modal.style.display="none";
modal.addEventListener("click",e=>{if(e.target===modal)modal.style.display="none";});
