document.getElementById("save").addEventListener("click", save_handler);
// you can use submit_handler without setTimeout by replacing submit_handler_withTimeout with submit_handler
document.getElementById("submit").addEventListener("click", submit_handler_withTimeout);
document.getElementById("cancel").addEventListener("click", cancel_handler);
document.getElementById("male").addEventListener("click", male_radio_handler);
document.getElementById("female").addEventListener("click", female_radio_handler);

// this function handles event of clicking on cancel button and tries to remove saved gender prediction
function cancel_handler(event) {
    document.getElementById("footer").innerHTML = "";
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("name-alert").innerHTML = " ";
    document.getElementById("gender_alert").innerHTML = " ";
    document.getElementById("saved_alert").innerHTML = " ";
    let inputName = document.getElementById("name").value;
    if (set_if_saved()) {
        localStorage.removeItem(inputName);
        document.getElementById("saved_alert").innerHTML = "Deleted!";
        document.getElementById("saved_alert").style.color = "green";
        document.getElementById("saved_answer").innerHTML = "Saved Answer";

    }
    event.preventDefault()
}
// this function validate name text input
function name_textarea_handler() {
    let inputName = document.getElementById("name").value;
    document.getElementById("name-alert").innerHTML = " ";
    if (inputName == "name" || inputName == "" || inputName == null || inputName == " ") {
        document.getElementById("name-alert").innerHTML = "*You must fill it"
        return false
    } else if (inputName.length > 225) {
        document.getElementById("name-alert").innerHTML = "*Name must be shorter than 255 character"
        return false
    } else if (!inputName.match(/^[a-z A-Z]*$/)) {
        document.getElementById("name-alert").innerHTML = "*Name must be consist of alphabet and space"
        return false
    }
    return true
}

// this function handles event of clicking on save button and it tries to save users mindset about name in LocalStorage
function save_handler(event) {
    event.preventDefault()
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("name-alert").innerHTML = " ";
    document.getElementById("gender_alert").innerHTML = " ";
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("footer").innerHTML = "";

    let inputName = document.getElementById("name").value;
    let response = document.getElementById("response_gender").innerHTML.split(" ")


    if (response.length == 2 && document.getElementById("male").checked == false && document.getElementById("female").checked == false) {
        localStorage.setItem(inputName, response[1]);
        document.getElementById("saved_alert").innerHTML = "Saved!";
        document.getElementById("saved_alert").style.color = "green";
        set_if_saved()
        document.getElementById("male").checked = false
        document.getElementById("female").checked = false
    } else {
        if (document.getElementById("male").checked == false && document.getElementById("female").checked == false)
            document.getElementById("gender_alert").innerHTML = "*You must choose one"
        else if (name_textarea_handler()) {

            if (document.getElementById("male").checked)
                var gender = "male"
            if (document.getElementById("female").checked)
                var gender = "female"

            localStorage.setItem(inputName, gender);
            document.getElementById("saved_alert").innerHTML = "*Saved!";
            document.getElementById("saved_alert").style.color = "green";
            set_if_saved()
        }
    }

    event.preventDefault()

}
// this function handles event of clicking on submit button by using set TIMEOUT
function submit_handler_withTimeout(event) {
    event.preventDefault()
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("name-alert").innerHTML = " ";
    document.getElementById("gender_alert").innerHTML = " ";
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("saved_answer").innerHTML = "Saved Answer";
    document.getElementById("footer").innerHTML = "";
    document.getElementById("response_gender").innerHTML = "Gender";
    document.getElementById("response_accuracy").innerHTML = "Probability";
    document.getElementById("footer").innerHTML = "";
    if (name_textarea_handler()) {
        setTimeout(set_if_saved, 0);
        setTimeout(request_sender, 1);
    }
}
// this function sends http request by XMLHttpRequest
function request_sender(){
    let inputName = document.getElementById("name").value;
    let urlAddress = "https://api.genderize.io/?name=" + inputName

        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", urlAddress, false);
            xmlHttp.send(null);
            var flag = true
        } catch (error) {
            document.getElementById("footer").innerHTML = "We have an Error in connection"
            document.getElementById("footer").style.color = "red";
            document.getElementById("female").checked = false
            document.getElementById("male").checked = false
            var flag = false
        }

        let result = JSON.parse(xmlHttp.responseText);
        let gender = result.gender
        let probability = result.probability

        if (xmlHttp.status == 200 && flag) {
            if (gender == null || gender == 0 || probability == null || probability == 0) {
                document.getElementById("footer").innerHTML = "Sorry, we can't help about this name!\n Help us by saving your opinion...";
                document.getElementById("footer").style.color = "orange";
                document.getElementById("female").checked = false
                document.getElementById("male").checked = false
            } else {
                document.getElementById("footer").innerHTML = "Successful!";
                document.getElementById("footer").style.color = "green";
                document.getElementById("response_gender").innerHTML = "Gender: " + gender
                document.getElementById("response_accuracy").innerHTML = "Probability: " + probability
                document.getElementById("female").checked = false
                document.getElementById("male").checked = false
            }
        } else {
            document.getElementById("footer").innerHTML = "We have an Error: " + xmlHttp.status + " : " + xmlHttp.getAllResponseHeaders() + "\n";
            document.getElementById("footer").style.color = "red";
            document.getElementById("female").checked = false
            document.getElementById("male").checked = false

        }
}
// this function add saved gender of name to text area
function set_if_saved() {
    let name = document.getElementById("name").value;
    let gender = localStorage.getItem(name);
    if (gender) {
        document.getElementById("saved_answer").innerHTML = localStorage.getItem(name);
        return true
    }
    return false
}

// this function handles event of clicking on submit button without TIMEOUT  ( for using it on replace submit_handler_withTimeout with submit_handler)
function submit_handler(event) {
    event.preventDefault()
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("name-alert").innerHTML = " ";
    document.getElementById("gender_alert").innerHTML = " ";
    document.getElementById("saved_alert").innerHTML = " ";
    document.getElementById("saved_answer").innerHTML = "Saved Answer";
    document.getElementById("footer").innerHTML = "";
    let inputName = document.getElementById("name").value;
    document.getElementById("response_gender").innerHTML = "Gender";
    document.getElementById("response_accuracy").innerHTML = "Probability";
    document.getElementById("footer").innerHTML = "";

    if (name_textarea_handler()) {

        set_if_saved()
        let urlAddress = "https://api.genderize.io/?name=" + inputName

        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", urlAddress, false);
            xmlHttp.send(null);
            var flag = true
        } catch (error) {
            document.getElementById("footer").innerHTML = "We have an Error in connection"
            document.getElementById("footer").style.color = "red";
            document.getElementById("female").checked = false
            document.getElementById("male").checked = false
            var flag = false
        }


        let result = JSON.parse(xmlHttp.responseText);

        let gender = result.gender
        let probability = result.probability

        if (xmlHttp.status == 200 && flag) {
            if (gender == null || gender == 0 || probability == null || probability == 0) {
                document.getElementById("footer").innerHTML = "Sorry, we can't help about this name!\n Help us by saving your opinion...";
                document.getElementById("footer").style.color = "orange";
                document.getElementById("female").checked = false
                document.getElementById("male").checked = false
            } else {
                document.getElementById("footer").innerHTML = "Successful!";
                document.getElementById("footer").style.color = "green";
                document.getElementById("response_gender").innerHTML = "Gender: " + gender
                document.getElementById("response_accuracy").innerHTML = "Probability: " + probability
                document.getElementById("female").checked = false
                document.getElementById("male").checked = false

            }
        } else {
            document.getElementById("footer").innerHTML = "We have an Error: " + xmlHttp.status + " : " + xmlHttp.getAllResponseHeaders() + "\n";
            document.getElementById("footer").style.color = "red";
            document.getElementById("female").checked = false
            document.getElementById("male").checked = false

        }

    }


}

// this function handles just one checkbox checked on click on female checkbox
function female_radio_handler() {

    document.getElementById("male").checked = !document.getElementById("female").checked
}
// this function handles just one checkbox checked on click on male checkbox
function male_radio_handler() {
    document.getElementById("female").checked = !document.getElementById("male").checked

}


