function setErr() {
    systemMsgTxt = document.getElementById('systemMsgTxt');
    systemMsgDisplay = document.getElementById('systemMsgDisplay');
    url = window.location.href;
    var regex = new RegExp("[?&]err(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) {
        return;
    }
    if (!results[2]) {
        return;
    }
    systemMsgDisplay.style.display = 'table-row';
    systemMsgTxt.innerHTML = 'login error: ' + decodeURIComponent(results[2].replace(/\+/g, " "));
    return;
}
