
//Checking to see if the user in on McGill.ca
if (document.location.href.includes("mcgill.ca")) {

    //Getting the Instructors names as a raw string
    instructors = document.getElementsByClassName("catalog-instructors")[0].innerHTML;

    //Splitting the string into an array according to following delimiters: , ; : ( )
    instArray = instructors.split(/,|;|:|\(|\)/);

    //Removing redundencies in the string (whitespaces and accents)
    for (i = 0; i < instArray.length; i++) {
        instArray[i] = instArray[i].trim();
    }

    //Verifying if the Instructors names have been extracted correctly
    if (instArray[0] == "Instructors") {

        //Catching an edge case where there are no instructors associated with the course
        if (instArray.length == 2) {
            throw new Error("No instructors associated with this course!");
        }

        //Removing redundant initial array element "Instructors"
        instArray.shift();

        //Popping end whitespace array element
        if (instArray[-1] != "Fall" && instArray[-1] != "Winter" && instArray[-1] != "Summer") {
            instArray.pop();
        }

        //Creating an array to store indices of names in array
        nameIndices = [];
        var count = 0;

        //Iterating through array and finding indices corresponding to instructors last names
        while (count<instArray.length) {
            if (instArray[count]!="Fall" && instArray[count]!="Winter" && instArray[count]!="Summer") {
                nameIndices.push(count);
                count+=2;
            }
            else {
                count+=1;
            }
        }

        //Creating an array to store the indicies of the instructors last names
        urlArray = [];

        //Iterating for each instructor
        for (j=0; j<nameIndices.length; j++) {

            //Creating a RateMyProfessors.com URL related to the professor
            var url = 'https://www.ratemyprofessors.com/search/teachers?query='
                    + instArray[nameIndices[j]].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '+' 
                    + instArray[nameIndices[j]+1].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '&sid=U2Nob29sLTE0Mzk=';
            urlArray.push(url);
        }
        
        //Re-injecting the professors names into the page
        var newInstructorsStr = "Instructors: ";
        var instructorHyperLinks = [];

        //Adding links to the names to be injected
        for (l = 0; l < nameIndices.length; l++) {
            str = "<a href=\"" + urlArray[l] + "\">" + instArray[nameIndices[l]] + ", " + instArray[nameIndices[l] + 1] +  "</a>";
            instructorHyperLinks.push(str);
        }

        lastNameIndex = 0;

        //Adding the terms of the course back to the names (fall, winter or summer)
        for (i = 0; i < instArray.length; i++) {
            if (i == nameIndices[lastNameIndex]) {
                if (lastNameIndex > 0 && i - 2 == nameIndices[lastNameIndex-1]) {
                    newInstructorsStr+= "; "
                }
                newInstructorsStr += instructorHyperLinks[lastNameIndex];
                lastNameIndex += 1;
                continue;
            }
            else if (lastNameIndex > 0 && i - 1 == nameIndices[lastNameIndex - 1]) {
                continue;
            }
            else if (instArray[i] == "Fall") {
                newInstructorsStr += " (Fall) ";
            }
            else if (instArray[i] == "Winter") {
                newInstructorsStr += " (Winter) ";
            }
            else if (instArray[i] == "Summer") {
                newInstructorsStr += " (Summer) ";
            }
        }

        //Removing the original instructors names
        var toRemove = document.getElementsByClassName('catalog-instructors');
        toRemove[0].parentNode.removeChild(toRemove[0]);

        //Adding a div to hold an image
        var imgNode = document.createElement('div');
        imgNode.className = 'bird-img-holder';
        var img = document.createElement('img');
        img.src = chrome.runtime.getURL('./bird.png');
        imgNode.appendChild(img);

        //Getting the div to append to
        var parentNode = document.getElementsByClassName('node-catalog')[0];

        //Creating a new div that holds the instructors names
        var profNode = document.createElement('div');
        profNode.className = 'instructors-node';

        //Creating a banner for the div
        var banner = document.createElement('div');
        banner.className = 'instructor-node-banner';

        //Creating a node to hold the title
        var titleText = document.createElement('div');
        titleText.className = 'instructors-node-title';
        titleText.innerHTML = "Click on an instructors name to find their RateMyProfessor score!";

        //Creating a node to hold the instructors names
        var text = document.createElement('div');
        text.className = 'instructors-names';
        text.innerHTML = newInstructorsStr;

        //Appedding everything to the node
        profNode.appendChild(banner);
        profNode.appendChild(titleText);
        profNode.appendChild(text);

        //Injecting the new div onto the page
        parentNode.appendChild(imgNode);
        parentNode.appendChild(profNode);

    }
}

//If the user is redirected to RateMyProfs, then it brings them directly to the first link
if (document.location.href.includes("ratemyprofessors")) {
    if ((document.referrer).includes("mcgill.ca")) {
        window.location.replace(document.getElementsByClassName("TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx")[0].href);
    }
}