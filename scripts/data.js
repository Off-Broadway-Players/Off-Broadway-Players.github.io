$(document).ready(function () {

const tecCats = new Map();

function bufferCards (place) {
    let cola = $("<div></div>").addClass("col h-col h-col-3 h-col-2 h-col-1");
    let colb = $("<div></div>").addClass("col h-col h-col-2 h-col-1");
    let colc = $("<div></div>").addClass("col h-col h-col-1");
    place.prepend(cola, colb, colc);
}

class cast {
    constructor(i, name, photo, role, bio, p) {
        this.index = i;
        this.name = name;
        this.photo = photo;
        this.role = role;
        this.bio = bio;
        this.p = p;
    }

    createCard(){
        let cardDiv = $(`<div></div>`).addClass("card crew-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png" //add photo functionality
                    }).addClass("d-block w-100 card-img-top"));
        // let cfoot = $("<div></div>").addClass("card-footer role").append(this.role);
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append(this.name + "<br><span class=\"as\">as</span><br>" + this.role);
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").append(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("read more");
        foot.click(expandCard);
        cardDiv.append(ctitle, /*cfoot,*/ cbody, foot);
        // cardDiv.append($('<a></a>').attr({
        //     "target" : "_blank",
        //     "href" : this.link
        // }).addClass("cardLink bi bi-youtube"));
        let wrapper = $("<div></div>").addClass("col pri" + this.p).append(cardDiv);
        return wrapper;
    }
}

class crew {
    constructor(i, cat, name, photo, role, bio, p) {
        this.index = i;
        this.cat = cat;
        this.name = name;
        this.photo = photo;
        this.role = role;
        this.bio = bio;
        this.p = p;
    }

    createCard(){
        let cardDiv = $(`<div></div>`).addClass("card crew-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png"//same deal
                    }).addClass("d-block w-100 card-img-top"));
        // let cfoot = $("<div></div>").addClass("card-footer posted-date").append(this.pDate.toLocaleDateString());
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append(this.title);
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").append(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("read more");
        foot.click(expandCard);
        cardDiv.append(ctitle, /*cfoot,*/ cbody, foot);
        let wrapper = $("<div></div>").addClass("col").append(cardDiv);
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
                console.log(crewItem);
                if(!tecCats.has(result.cat)) {
                    tecCats.set(result.cat, [crewItem]);
                } else {
                    let temp = tecCats.get(result.cat).concat([crewItem]);
                    tecCats.set(result.cat, temp);
                }
                // $("#post-container").prepend(shortsItem.createCard());
                postnum++;
            }
            crewSetUp($("#post-container"));
            // bufferCards($("#post-container"));
            // calcBuffer();
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
                const shortsItem = new cast(postnum, result.name, result.photo, result.role, result.bio, result.priority);
                $("#post-container").prepend(shortsItem.createCard());
                postnum++;
            }
            bufferCards($("#post-container"));
            calcBuffer();
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


function calcBuffer () {
    let w = $(document).width();
    let n;
    $(".h-col").css("display", "initial");
    if(w < 576) {
        n = 1;
    } else if(w < 768) {
        n = 2;
    } else if(w < 992) {
        n = 3;
    } else {
        n = 4
    }
    if(postnum % n) {
        $(".h-col-" + (n-((postnum - 1) % n))).css("display", "none");
    } else {
        $(".h-col").css("display", "none");
    }
}

function crewSetUp (place) {
    for (const x of tecCats.keys()) {
        console.log(x);
        place.append($("<h3></h3>").addClass("crewCat").append(x));
        let cdiv = $("<div></div>").addClass("crewDiv CD-" + x);
        for(const y of tecCats.get(x)) {
            cdiv.append(y.createCard());
        }
        place.append(cdiv);
    }
}

// $(window).resize(calcBuffer);
});