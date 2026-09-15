$(document).ready(function () {

const tecCats = new Map();
const castMap = new Map();
const alphaCastArr = [];

class cast {
    constructor(i, name, photo, role, bio, p) {
        this.index = i;
        this.name = name;
        this.photo = photo;
        let arr = name.split(" ");
        this.ln = arr.at(-1);
        this.role = role;
        this.bio = bio;
        this.p = p;
    }

    createCard(){
        let cardDiv = $(`<div></div>`).addClass("card cast-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png" //add photo functionality
                    }).addClass("d-block w-100 card-img-top"));
        // let cfoot = $("<div></div>").addClass("card-footer role").append(this.role);
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append("<span class=\"name\">" + this.name + "</span><br><span class=\"as\">as</span><br><span class=\"role\">" + this.role + "</span>");
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").append(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("read more");
        foot.click(expandCard);
        cardDiv.append(ctitle, /*cfoot,*/ cbody, foot);
        // cardDiv.append($('<a></a>').attr({
        //     "target" : "_blank",
        //     "href" : this.link
        // }).addClass("cardLink bi bi-youtube"));
        let wrapper = $("<div></div>").addClass("col order-" + this.p).append(cardDiv);
        return wrapper;
    }
}

class crew {
    constructor(i, cat, name, photo, role, bio, p) {
        this.index = i;
        this.cat = cat;
        this.name = name;
        let arr = name.split(" ");
        this.ln = arr.at(-1);
        this.photo = photo;
        this.role = role;
        this.bio = bio;
        this.p = p;
    }

    createCard(){
        console.log(this.ln);
        let cardDiv = $(`<div></div>`).addClass("card crew-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png"//same deal
                    }).addClass("d-block w-100 card-img-top"));
        // let cfoot = $("<div></div>").addClass("card-footer posted-date").append(this.pDate.toLocaleDateString());
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append("<span class=\"name\">" + this.name + "</span><br><span class=\"as\">as</span><br><span class=\"role\">" + this.role + "</span>");
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").append(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("read more");
        foot.click(expandCard);
        cardDiv.append(ctitle, /*cfoot,*/ cbody, foot);
        let wrapper = $("<div></div>").addClass("col order-" + this.p).append(cardDiv);
        return wrapper;
    }
}

let postnum = 0;

if($("#post-container").hasClass("crew")) {
    Papa.parse(
    `https://docs.google.com/spreadsheets/d/e/2PACX-1vRvraRhOE86QuO1UlDiSozzWIZuTZdyO02JtphVVvONv9wUfzlnqIM3yJmyOlbPKHDlljH2TLdJ0OlQ/pub?gid=416459707&single=true&output=csv`,
    {
        download: true,
        complete: function(results) {
            for(result of results.data) {
                const crewItem = new crew(postnum, result.category, result.name, result.photo, result.role, result.bio, result.priority);
                if(!tecCats.has(result.category)) {
                    tecCats.set(result.category, [crewItem]);
                } else {
                    let temp = tecCats.get(result.category).concat([crewItem]);
                    tecCats.set(result.category, temp);
                }
                // $("#post-container").prepend(shortsItem.createCard());
                postnum++;
            }
            crewSetUp($("#post-container"));
        },
        header: true
    }
    );
}

if($("#post-container").hasClass("cast")) {
    Papa.parse(
    `https://docs.google.com/spreadsheets/d/e/2PACX-1vRvraRhOE86QuO1UlDiSozzWIZuTZdyO02JtphVVvONv9wUfzlnqIM3yJmyOlbPKHDlljH2TLdJ0OlQ/pub?gid=0&single=true&output=csv`,
    {
        download: true,
        complete: function(results) {
            for(result of results.data) {
                const castItem = new cast(postnum, result.name, result.photo, result.role, result.bio, result.priority);
                castMap.set(castItem.ln, castItem);
                alphaCastArr.push(castItem.ln);
                // $("#post-container").prepend(shortsItem.createCard());
                postnum++;
            }
            castSetUp($("#post-container"));
        },
        header: true
    }
    );
}


function expandCard () { 
    $(this).parent().toggleClass("card-hidden");
    if($(this).parent().hasClass("card-hidden")) {
        if($(this).parent().hasClass("insta-card") || $(this).parent().hasClass("v-card")) {
            $(this).parent().css("max-height", "450px");
        } else if ($(this).parent().hasClass("s-card")) {
            $(this).parent().css("max-height", "600px");
        }
        if($(this).hasClass("read-more")) {
            $(this).css("opacity", 1);
        } else {
            $(this).next().css("opacity", 1);
        }
    } else {
        $(this).parent().css("max-height", $(this).parent()[0].scrollHeight + "px");
        if($(this).hasClass("read-more")) {
            $(this).css("opacity", 0);
        } else {
            $(this).next().css("opacity", 0);
        }
    }
}

function crewSetUp (place) {
    for (const x of tecCats.keys()) {
        place.append($("<h3></h3>").addClass("crewCat text-center").append(x));
        let cdiv = $("<div></div>").addClass("row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 pb-4 justify-content-evenly crewDiv CD-" + x);
        const alphaMap = new Map();
        const alphaArr = [];
        for(const y of tecCats.get(x)) {
            alphaArr.push(y.ln);
            alphaMap.set(y.ln, y);
            // cdiv.append(y.createCard());
        }
        alphaArr.sort();
        for (const a of alphaArr) {
            let aa = alphaMap.get(a);
            cdiv.append(aa.createCard());
        }
        place.append(cdiv);
    }
}

function castSetUp (place) {
    alphaCastArr.sort();
    for (const a of alphaCastArr) {
        let aa = castMap.get(a);
        place.append(aa.createCard());
    }
}

});