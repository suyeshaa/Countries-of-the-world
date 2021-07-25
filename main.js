/*=================UI=====================*/
$(".filter-head").click(() => {
  $(".filter-modal").toggle("");
});

$(".theme").click(() => {
  let currTheme = $("body").attr("data-theme");
  $("body").attr("data-theme", `${currTheme == "light" ? `dark` : `light`}`);
});

// ==============================API==========================
let arrName = [];
let dataArr = [];
let filtered = false;

fetch("https://restcountries.eu/rest/v2/all")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    showBlocks(data);
    arrayNm(data);
    onSearch(data);
    selectFilter();
    description(data);
    // dataArr = [...data];
  });

console.log(dataArr);

function showBlocks(data) {
  let block = data
    .map((el) => {
      return ` <div class="block" data-info=${el.alpha2Code}>
    <div class="flag">
      <img src=${el.flag} />
    </div>
    <div class="descrip">
      <span class="name">${el.name}</span>
      <p class="des">
        Population:
        <span class="var">${el.population.toLocaleString()}</span>
      </p>
      <p class="des">
        Region:
        <span class="var">${el.region}</span>
      </p>
      <p class="des">
        Capital:
        <span class="var">${el.capital}</span>
      </p>
    </div>
  </div>`;
    })
    .join("");
  $(".countries").append(block);
}

function arrayNm(data) {
  $.each(data, function (i, v) {
    arrName.push(v.name.toLowerCase());
  });
  // console.log(arrName);
}

// =================================SEARCH==================================
let toShow = [];
let idArr = [];
function onSearch(data) {
  toShow = [...data];
  document.querySelector("input").addEventListener("input", (e) => {
    let keyword = e.target.value.toLowerCase();
    toShow = data.filter(({ name, alpha2Code }) => {
      name = name.toLowerCase();
      return name.includes(keyword);
    });

    idArr = toShow.map((el) => el.alpha2Code);

    // console.log(idArr);

    $.each($(".block"), function (i, v) {
      if (idArr.includes(v.dataset.info)) {
        v.style.display = "flex";
      } else {
        v.style.display = "none";
      }
    });

    if (toShow.length == 0) {
      console.log("0");
    }

    //========================DOUBT===============================
    // $.each(toShow, function (i, v) {
    //   $.each($(".block"), function (j, el) {
    //     if (el.dataset.info == v.alpha2Code) {
    //       el.style.display = "flex";
    //       // console.log(el);
    //     }
    //   });
    // });
    // selectFilter();
  });
  // filter("Asia");
}

let modalObj = {
  name: "ïndia",
};

// ====================================FILTER======================================
function selectFilter() {
  $(".region").click((e) => {
    // console.log(e.target.innerText);
    let filterTxt = e.target.innerText;
    filter(filterTxt);
    filtered = true;
    $(".filter-modal").hide();
  });
}

let filterId = [];
function filter(txt) {
  let filterArr = toShow.filter(({ region }) => {
    return region.includes(txt);
  });
  filterId = filterArr.map((el) => el.alpha2Code);

  console.log(filterArr);

  // console.log(filterId);
  $.each($(".block"), function (i, v) {
    if (filterId.includes(v.dataset.info)) {
      v.style.display = "flex";
    } else {
      v.style.display = "none";
    }
  });
}

// =============================BLOCK-DESCRIPTION===================================

function description(data) {
  $(".block").click(function () {
    // console.log(this.dataset.info);
    let code = this.dataset.info;
    $.each(data, function (i, v) {
      if (code == v.alpha2Code) {
        showDetails(v, data);
        $(".modal").css("display", "flex");
      }
    });
    // showDetails(data);
    $(".back-btn ").click(() => {
      $(".modal").css("display", "none");
      // alert();
    });
    borderCount(data);
  });
}

function showDetails(el, data) {
  $(".modal").html("");
  let details = `
 
    <div class="modal-cont">
    <div class="back-btn">
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="caret-left"
      class="svg-inline--fa fa-caret-left fa-w-6"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 512"
    >
      <path
        fill="currentColor"
        d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
      ></path>
    </svg>
    <button>Back</button>
  </div>
      <div class="division">
      
          <img src=${el.flag} />
        
        <div class="right">
          <div class="country-name">${el.name}</div>
          <div class="rep">
            <div class="former">
              <p class="expl">
                Native Name: <span class="temp">${el.nativeName}</span>
              </p>
              <p class="expl">
                Population: <span class="temp">${el.population.toLocaleString()}</span>
              </p>
              <p class="expl">Region: <span class="temp">${el.region}</span></p>
              <p class="expl">
                Sub Region: <span class="temp">${el.subregion}</span>
              </p>
              <p class="expl">
                Capital: <span class="temp">${el.capital}</span>
              </p>
            </div>
            <div class="latter">
              <p class="expl">
                Top level Domain: <span class="temp">${
                  el.topLevelDomain[0]
                }</span>
              </p>
              <p class="expl">Currencies: <span class="temp">${
                el.currencies[0].name
              }</span></p>
              <p class="expl">
                Languages: <span class="temp"></span>
                ${el.languages
                  .map((v) => `<span class="temp">${v.name}</span>`)
                  .join("")}
              </p>
            </div>
          </div>
          <div class="border-countries">
            Border Countries:
            ${el.borders.map((v) => {
              $.each(data, function (i, p) {
                if (v == p.alpha3Code) {
                  console.log(v, p.alpha3Code);
                  return `<div class="tag">${p.name}</div> `;
                }
              });
            })}
            
          </div>
        </div>
      </div>
    </div>
  `;

  $(".modal").append(details);
  borderCount(data);
}

// ============================BORDER-COUNTRIES========================
function borderCount(data) {
  $(".tag").click(function () {
    let code = this.textContent;
    $.each(data, function (i, v) {
      if (code == v.alpha3Code) {
        showDetails(v, data);
        $(".modal").css("display", "flex");
      }
    });
    $(".back-btn ").click(() => {
      $(".modal").css("display", "none");
      // alert();
    });
  });
}