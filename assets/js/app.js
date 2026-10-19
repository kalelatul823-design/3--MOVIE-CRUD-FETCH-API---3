let cl = console.log;

const spinner = document.getElementById("spinner");
const form = document.getElementById("form");
const movieNameControl = document.getElementById("movieName");
const genreControl = document.getElementById("genre")
const releaseDateControl = document.getElementById("releaseDate")
const movieImgControl = document.getElementById("movieImg")
const movieDescriptionControl = document.getElementById("movieDescription")
const movieRatingControl = document.getElementById("movieRating");
const addBtn = document.getElementById("addBtn");
const backDrop = document.getElementById("backDrop");
const movieModel = document.getElementById("movieModel");
const closeIcon = document.getElementById("closeIcon");
const closeBtn = document.getElementById('closeBtn');
const movieInfo = document.getElementById("movieInfo");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn")

//spinner
function handleSpinner(flag){
    if(flag){
        spinner.classList.remove("d-none")
    }else{
        spinner.classList.add("d-none")
    }
}



const BASE_URL = "https://fetch-api-crud-c0cc4-default-rtdb.asia-southeast1.firebasedatabase.app";

const MOVIE_URL = `${BASE_URL}/movies3.json`;

let state = {
  movieArr : [],
  editId : null,

}

// snackBar
function snackBar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

//rating
function setRating(rating){
    if(rating >7){
        return "badge-success"
    }else if(rating > 5){
        return "badge-warning"
    }else{
        return "badge-danger"
    }
}

//backdroupadn
function onAllBtnAndBackdrop(){
    movieModel.classList.toggle("active")
    backDrop.classList.toggle("active")
    form.reset()
    if (!movieModel.classList.contains("active")) {
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
  }
}


//objtoArr
// function objtoArr(obj){
//     let arr = Object.entries(obj);
//     let arr2 = arr.map((ele)=>{
//       ele[1].id = ele[0];
//       state.movieArr.push(ele[1]);
//       //cl(state.movieArr)
//     })
    
// }

function objtoArr(obj){
    state.movieArr = [];

    let arr = Object.entries(obj);

    arr.forEach((ele)=>{
        ele[1].id = ele[0];
        state.movieArr.push(ele[1]);
    });
}


//generic function
function makeApiCall(url, methodType, msgBody = null){
   let body = msgBody ? JSON.stringify(msgBody) : null
   return fetch(url, {
    method : methodType,
    body : body,
    headers : {
        "content-type" : "application/json",
        "Authrization" : "JWT TOKEN"
    }
   })
   .then((res)=>{
    if(!res.ok){
        throw new Error()
    }
   return res.json()
   })
   .catch((err)=>{
    snackBar("something went wrong")
   })
   .finally(()=>{
     handleSpinner(false);
   })
}



//create

function onAddMovie(eve){
    eve.preventDefault();

    let newMovieObj = {
       movieName : movieNameControl.value,
       genre : genreControl.value,
       releaseDate : releaseDateControl.value,
       movieImg : movieImgControl.value,
       movieDescription : movieDescriptionControl.value,
       movieRating : movieRatingControl.value,
       updatedAt : null,
    }
    handleSpinner(true)
    makeApiCall(MOVIE_URL, "POST", newMovieObj)
      .then((data)=>{
        cl(data)
        let div = document.createElement("div");
        newMovieObj.id = data.id
        div.id = data.name;
        cl(state.movieArr)
        div.className = `col-md-3 mb-5`;
        div.innerHTML = `
                       <div class="card movieCard">
            <div class="card-header">
              <div class="row">
                <div class="col-10">
                  <h3 class="m-0">${newMovieObj.movieName}</h3>
                </div>
                <div class="col-2">
                  <h4 class="m-0">
                    <span class="badge ${setRating(newMovieObj.movieRating)}">${newMovieObj.movieRating}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body">
              <figure>
                <img
                  src="${newMovieObj.movieImg}"
                  alt="${newMovieObj.movieName}"
                />
                <figcaption>
                  <h3 class="m-0">${newMovieObj.movieName}</h3>
                  <h4 class="m-0">Genre: ${newMovieObj.genre}</h4>
                  <p class="m-0">
                    ${newMovieObj.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-pri-Color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>
        `
        movieInfo.append(div);
        onAllBtnAndBackdrop()
      })
      .catch((err)=>{
        snackBar(`Something went wrong`, `error`)
      })
      
}



//read
function showUi(arr){
    handleSpinner(true)
    makeApiCall(MOVIE_URL, "GET")
    .then((data)=>{
        cl(data)
         objtoArr(data);
         rederingUi(state.movieArr)
    })
    .catch((err)=>{
        snackBar("something went wrong")
    })
}

//templeting
function rederingUi(arr){
  let result = "";
  arr.forEach((obj)=>{
    result += `<div class="col-md-3 mb-5" id=${obj.id}>
          <div class="card movieCard">
            <div class="card-header">
              <div class="row">
                <div class="col-10">
                  <h3 class="m-0">${obj.movieName}</h3>
                </div>
                <div class="col-2">
                  <h4 class="m-0">
                    <span class="badge ${setRating(obj.movieRating)}">${obj.movieRating}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body">
              <figure>
                <img
                  src="${obj.movieImg}"
                  alt="${obj.movieName}"
                />
                <figcaption>
                  <h3 class="m-0">${obj.movieName}</h3>
                  <p class="m-0">
                    ${obj.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-pri-Color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>
        </div>`
  })
  movieInfo.innerHTML = result;
}

showUi()



//edit
function onEdit(ele){
  let edit_Id = ele.closest(".col-md-3").id; 
  
  state.editId = edit_Id;
  let EDIT_URL = `${BASE_URL}/movies3/${edit_Id}.json`;
  handleSpinner(true);
  makeApiCall(EDIT_URL, "GET")
  .then((data)=>{
    cl(data);
    onAllBtnAndBackdrop()
            movieNameControl.value = data.movieName;
            genreControl.value = data.genre;
            releaseDateControl.value = data.releaseDate;
            movieImgControl.value = data.movieImg;
            movieDescriptionControl.value = data.movieDescription;
            movieRatingControl.value = data.movieRating;
            submitBtn.classList.add("d-none");
updateBtn.classList.remove("d-none");

    
  })
  .catch((err)=>{
    snackBar("something went wrong")
  })
}

function updateMovie() {
  let updateId = state.editId;
  let UPDATE_URL = `${BASE_URL}/movies3/${updateId}.json`;
  let updatedObj = {
     movieName : movieNameControl.value,
       genre : genreControl.value,
       releaseDate : releaseDateControl.value,
       movieImg : movieImgControl.value,
       movieDescription : movieDescriptionControl.value,
       movieRating : movieRatingControl.value,
    updatedAt: new Date().toLocaleDateString(),
    id: updateId,
  };
  handleSpinner();
  makeApiCall(UPDATE_URL, "PATCH", updatedObj)
    .then((data) => {
      cl(data);
      let getIndex = state.movieArr.findIndex((ele) => ele.id === updateId);
      state.movieArr[getIndex] = updatedObj;
      let div = document.getElementById(updateId);
      div.innerHTML = `
    <div class="card h-100 movieCard">
            <div class="card-header">
              <div class="row">
                <div class="col-10">
                  <h3 class="m-0">${updatedObj.movieName}</h3>
                  <small class="realeaseDate">Realease Date:${updatedObj.realeaseDate} </small> <br />
                  <small class="updateAt">Updated At: ${updatedObj.updatedAt} </small>
                </div>
                <div class="col-2">
                  <h4 class="m-0">
                    <small class="badge ${setRating(updatedObj.rating)}">${updatedObj.rating}</small>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body">
              <figure>
                <img src="${updatedObj.movieImg}" alt="${updatedObj.movieName}" />
                <figcaption>
                  <h3 class="m-0">${updatedObj.movieName}</h3>
                  <strong>Genre : ${updatedObj.genre}</strong>
                  <p>
                   ${updatedObj.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-sec-color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
            </div>
          </div>`;
          form.reset()
          state.editId = null
          showUpdateSmallElement()
      onMoviemodelAndBackDrop();

    })
    .catch((err) => {
      snackBar("Something went wrong");
    });
}

//remove
function onRemove(ele) {
  let removeId = ele.closest(".col-md-3").id;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let REMOVE_URL = `${BASE_URL}/movies3/${removeId}.json`;
      handleSpinner();
      makeApiCall(REMOVE_URL, "DELETE")
        .then((data) => {
          cl(data);
          let getIndex = state.movieArr.findIndex((ele) => ele.id === removeId);
          state.movieArr.splice(getIndex, 1);
          ele.closest(".col-md-3").remove();
        })
        .catch((err) => {
          snackBar("something went wrong");
        });
    }
  });
}


form.addEventListener("submit", onAddMovie)
addBtn.addEventListener("click", onAllBtnAndBackdrop)
closeBtn.addEventListener("click", onAllBtnAndBackdrop)
closeIcon.addEventListener("click", onAllBtnAndBackdrop)
backDrop.addEventListener("click", onAllBtnAndBackdrop)
updateBtn.addEventListener("click", updateMovie)