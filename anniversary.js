var context;
var announcementID;
var hostweburl;
var web;
var user;
var announcementTrackingList;
var getuserannouncement;
var cUser = "";
var annID;
var today = new Date();


$(document).ready(function () {

    ExecuteOrDelayUntilScriptLoaded(loadConstantanniversary, "sp.js");
});
// Load Constants for birthday and anniversary web part
function loadConstantanniversary() {
    context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
    hostweburl = _spPageContextInfo.siteAbsoluteUrl;
    web = context.get_web();
    user = web.get_currentUser();
    context.load(user);
    context.executeQueryAsync(function () {
        AnniversaryWebPart();
    }, function () { });

}
// Rest API call to get data from list
function AnniversaryWebPart() {

    var res = null;
    var vhtml = "";

    var restQueryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Anniversary')/Items?$top=1000";

    $.ajax({
        method: 'GET',
        url: restQueryUrl,
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    }).success(function (data) {
        res = data.d.results;
        if (res.length > 0) {

            GetHtmlStringForAnniversaryWebPart(res);

        }

    }).error(function (sender, args) {
        console.log('Request failed. ' + args.get_message() +
            '\n' + args.get_stackTrace());
    });

};

// Generate HTML string for anniversary web part 
function GetHtmlStringForAnniversaryWebPart(result) {

    var vBirthDayString = "";
    var vAnniversaryString = "";
    var vCurrentMonth = new Date().getMonth();
    var vCurrentDate = new Date().getDate();

    var sortedAscAnniversary = _.sortBy(result, 'AnniversaryDefault')


    for (var j = 0; j < sortedAscAnniversary.length; j++) {
        var vAnniversaryDate = sortedAscAnniversary[j].AnniversaryDate;
        if (vAnniversaryDate != null) {
            var vAnniversaryMonth = new Date(vAnniversaryDate).getMonth();
            var vAnniversaryDateonly = new Date(vAnniversaryDate).getDate();
            if (vAnniversaryMonth == vCurrentMonth) {
                if (vAnniversaryDateonly >= vCurrentDate) {
                    var vvName = sortedAscAnniversary[j].NameofPerson;//3   
                    var vfinalAnniversaryDate = getDateFormatAnniversary(vAnniversaryDate);

                    vAnniversaryString += '<li><span>' + vvName + '</span><i>' + vfinalAnniversaryDate + '</i></li>';
                }
            }
            else if (vAnniversaryMonth > vCurrentMonth) {
                var vvName = sortedAscAnniversary[j].NameofPerson;//4
                var vfinalAnniversaryDate = getDateFormatAnniversary(vAnniversaryDate);

                vAnniversaryString += '<li><span>' + vvName + '</span><i>' + vfinalAnniversaryDate + '</i></li>';
            }
        }

    }



    $('.anniversary').append(vAnniversaryString);

    $('.clsAnniversaryroom').addClass('custm_scroll');
    $('.custm_scroll').mCustomScrollbar({ axis: "y" });






}



// Return Date Time format in mm/yyyy
function getDateFormatAnniversary(date) {
    var m_names = new Array("Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec");

    var d = new Date(date);

    var curr_month = d.getMonth();

    var vCurrentYear = new Date().getFullYear().toString().substr(-2);
    var lenghtofdate = d.getDate().toString();
    var dateanni = "";
    if (lenghtofdate < 2) {
        dateanni = "0" + d.getDate().toString();
    }
    else {
        dateanni = d.getDate().toString();
    }

    return m_names[curr_month] + " " + dateanni;

}




