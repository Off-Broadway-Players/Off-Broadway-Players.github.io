$(document).ready(function () { //only does stuff when page is loaded

const CREWLINK = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRvraRhOE86QuO1UlDiSozzWIZuTZdyO02JtphVVvONv9wUfzlnqIM3yJmyOlbPKHDlljH2TLdJ0OlQ/pub?gid=416459707&single=true&output=csv`;
const CASTLINK = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRvraRhOE86QuO1UlDiSozzWIZuTZdyO02JtphVVvONv9wUfzlnqIM3yJmyOlbPKHDlljH2TLdJ0OlQ/pub?gid=0&single=true&output=csv`;

const tecCats = new Map(); //holds the departments of tech and the people under them
const castMap = new Map(); //holds the cast members, searchable by last name
const alphaCastArr = []; //holds the cast members' last name for sorting purposes

class cast { //cast [card] class. stores all info, with a method (createCard) to genereate the html for the card
    constructor(i, name, photo, role, bio, p) {
        this.index = i; //so far unused, but keeping just in case
        this.name = name;
        this.photo = photo; //image url
        let arr = name.split(" ");
        this.ln = arr.at(-1); //takes the last word of the name, surname if there are multiple given, first name if no surname given
        this.role = role;
        this.bio = bio;
        this.p = p; //priority field, if someone should be ordered specially (i.e. not by last name, like the director) their priority should be higher
    }

    createCard(){
        let cardDiv = $(`<div></div>`).addClass("card cast-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png" //add photo functionality -> "src": this.photo
                    }).addClass("d-block w-100 card-img-top"));
        // let cfoot = $("<div></div>").addClass("card-footer role").append(this.role); //dw about this shhh
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center")
        .append("<span class=\"name\">" + this.name + "</span><br><span class=\"as\">as</span><br><span class=\"role\">" + this.role + "</span>"); //'title' with name and role
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").text(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"'))); //bio, with \n functioning as line break, \" functioning as "
        cbody.click(expandCard); //enables the "read more" functionality
        let foot = $("<div></div>").addClass("card-footer read-more").append("^");
        foot.click(expandCard); //enables the "read more" functionality
        cardDiv.append(ctitle, cbody, foot);
        let wrapper = $("<div></div>").addClass("col order-" + this.p).append(cardDiv); //wrapper with priority functionality
        return wrapper;
    }
}

class crew {
    constructor(i, cat, name, photo, role, bio, p) { //overall similar to cast class
        this.index = i;
        this.cat = cat; //holds department, felt cute, might delete later
        this.name = name;
        let arr = name.split(" ");
        this.ln = arr.at(-1);
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
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append("<span class=\"name\">" + this.name + "</span><br><span class=\"as\">as</span><br><span class=\"role\">" + this.role + "</span>");
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").text(this.bio.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("^").css("transform", "rotate(180deg)");
        foot.click(expandCard);
        cardDiv.append(ctitle, /*cfoot,*/ cbody, foot);
        let wrapper = $("<div></div>").addClass("col order-" + this.p).append(cardDiv);
        return wrapper;
    }
}

let postnum = 0; //index functionality my beloved

if($("#post-container").hasClass("crew")) { //parsing instructions for the crew page
    Papa.parse(
    CREWLINK,
    {
        download: true, //look at papaParse docs if interested in config options
        complete: function(results) {
            for(result of results.data) { //iterate through the rows of the sheet
                const crewItem = new crew(postnum, result.category, result.name, result.photo, result.role, result.bio, result.priority); //create crew object
                if(!tecCats.has(result.category)) { //if category not yet logged
                    tecCats.set(result.category, [crewItem]); //log it (with an array containing the current crew object)
                } else {
                    let temp = tecCats.get(result.category).concat([crewItem]); //else create a new array with whats there already + current crew object
                    tecCats.set(result.category, temp); //update the map
                }
                postnum++;
            }
            crewSetUp($("#post-container")); //put it all together
        },
        header: true
    }
    );
}

if($("#post-container").hasClass("cast")) {
    Papa.parse(
    CASTLINK,
    {
        download: true,
        complete: function(results) {
            for(result of results.data) {
                const castItem = new cast(postnum, result.name, result.photo, result.role, result.bio, result.priority);
                castMap.set(castItem.ln, castItem); //map shenanagans
                alphaCastArr.push(castItem.ln); //construct array of last names
                postnum++;
            }
            castSetUp($("#post-container")); //put it all together
        },
        header: true
    }
    );
}


function expandCard () { 
    $(this).parent().toggleClass("card-hidden"); //toggle hidden state
    // if($(this).parent().hasClass("card-hidden")) { //check for hidden state
        // $(this).parent().css("max-height", "450px"); //might change this later
        // if($(this).hasClass("read-more")) { //if clicked on 'read more'
        //     $(this).css("opacity", 1); //make 'read more' text visible 
        // } else {
        //     $(this).next().css("opacity", 1); 
        // }
    // } else {
        // $(this).parent().css("max-height", $(this).parent()[0].scrollHeight + "px"); //shows all
        if($(this).hasClass("read-more")) {
            if($(this).parent().hasClass("card-hidden")) {
                $(this).prev().css("max-height", 0);
            } else {
                $(this).prev().css("max-height", "10000px");
            }
            // let deg = $(this).css("transform");
            let deg = $(this).get(0).style.transform;
            console.log(deg)
            deg = Number(deg.match(/\d+/)[0]);
            $(this).css("transform", "rotate(" + (deg + 180) + "deg)"); //make read more text invisible
        } else {
            if($(this).parent().hasClass("card-hidden")) {
                $(this).css("max-height", 0);
            } else {
                $(this).css("max-height", "10000px");
            }
            let deg = $(this).next().css("transform");
            deg = Number(deg.match(/\d+/)[0]);
            console.log(deg)
            $(this).next().css("transform", "rotate(" + (deg + 180) + "deg)"); //make read more text invisible
        }
    // }
}

function crewSetUp (place) {
    for (const x of tecCats.keys()) { //makes headings for each department
        place.append($("<h3></h3>").addClass("crewCat text-center").append(x));
        let cdiv = $("<div></div>").addClass("row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 pb-4 justify-content-evenly crewDiv CD-" + x);
        const alphaMap = new Map(); //yayy alphabetizing is sooooo fun ._.
        const alphaArr = [];
        for(const y of tecCats.get(x)) {
            alphaArr.push(y.ln); //add to surname array
            alphaMap.set(y.ln, y); 
            // cdiv.append(y.createCard());
        }
        alphaArr.sort(); //sort surnames alphabetically
        for (const a of alphaArr) {
            let aa = alphaMap.get(a);
            cdiv.append(aa.createCard()); //append in alpha order
        }
        place.append(cdiv); //bop it right in there
    }
}

function castSetUp (place) {
    alphaCastArr.sort(); //same as crew but like, easy
    for (const a of alphaCastArr) {
        let aa = castMap.get(a);
        place.append(aa.createCard());
    }
}

});