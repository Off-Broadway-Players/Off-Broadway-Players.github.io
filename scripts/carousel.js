$(document).ready(function () {
    Papa.parse(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vRvraRhOE86QuO1UlDiSozzWIZuTZdyO02JtphVVvONv9wUfzlnqIM3yJmyOlbPKHDlljH2TLdJ0OlQ/pub?gid=2132180595&single=true&output=csv`,
        {
            download: true,
            complete: function (results) {
                console.log(results);
                for(let i = 0; i < results.length; i++) {
                    let div = $("<div></div>").addClass("carousel-item").append($("<img>").attr("src", results[0][i]).addClass("d-block w-100"));
                    if (i == 0) {
                        div.addClass("active");
                    }
                    $("#c-inner").append(div);
                }
            }
        }
    );
});