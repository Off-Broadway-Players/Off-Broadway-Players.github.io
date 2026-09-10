$(document).ready(function () {
    

let PostData;
let HData;

function bufferCards (place) {
    let cola = $("<div></div>").addClass("col h-col h-col-3 h-col-2 h-col-1");
    let colb = $("<div></div>").addClass("col h-col h-col-2 h-col-1");
    let colc = $("<div></div>").addClass("col h-col h-col-1");
    place.prepend(cola, colb, colc);
}


class shorts {
    constructor(i, title, desc, accessed, posted, link) {
        this.index = i;
        this.title = title;
        this.desc = desc;
        this.accessed = accessed;
        this.posted = posted;
        this.pDate = new Date(posted);
        this.chron = this.pDate.valueOf();
        this.link = link;
    }

    createCard(){
        let cardDiv = $(`<div></div>`).addClass("card s-card card-hidden");
        cardDiv.append($("<img>").attr({
                        "src": "https://www.w3schools.com/howto/img_avatar.png"
                    }).addClass("d-block w-100 card-img-top"));
        let cfoot = $("<div></div>").addClass("card-footer posted-date").append(this.pDate.toLocaleDateString());
        let ctitle = $("<h6></h6>").addClass("card-header card-title text-center").append(this.title);
        let cbody = $("<div></div>").addClass("card-body").append($("<p></p>").append(this.desc.replaceAll(/\\n/g, "<br>").replaceAll(/\\"/g, '"')));
        cbody.click(expandCard);
        let foot = $("<div></div>").addClass("card-footer read-more").append("read more");
        foot.click(expandCard);
        cardDiv.append(ctitle, cfoot, cbody, foot);
        cardDiv.append($('<a></a>').attr({
            "target" : "_blank",
            "href" : this.link
        }).addClass("cardLink bi bi-youtube"));
        let wrapper = $("<div></div>").addClass("col").append(cardDiv);
        return wrapper;
    }
}

let postnum = 0;

//ssssssssssssssssssssssssssssssssssssssssss

Papa.parse(
`https://docs.google.com/spreadsheets/d/e/2PACX-1vSXzA9ZHAVXMEjfUTS_JBtk5iz7X1i4auwWJHwErdmDYsuYeEcuL8h78sXxxiFvgtYWBWRt8wx8RHl2/pub?gid=1454037593&single=true&output=csv`,
{
    download: true,
    complete: function(results) {
        for(result of results.data) {
            const shortsItem = new shorts(Number(result.index), result.title, result.description, result.accessed, result.date, result.link);
            $("#post-container").prepend(shortsItem.createCard());
            postnum++;
        }
        bufferCards($("#post-container"));
        calcBuffer();
    },
    header: true
}
);

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

$(window).resize(calcBuffer);
});