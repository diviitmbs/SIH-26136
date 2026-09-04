/* =====================================================
   PROCUREX — SCREEN 1 JAVASCRIPT
===================================================== */


/* ================= ELEMENTS ================= */

const governmentButton =
    document.getElementById("governmentButton");

const startupButton =
    document.getElementById("startupButton");

const innovationButton =
    document.getElementById("innovationButton");

const helpButton =
    document.getElementById("helpBtn");

const themeButton =
    document.getElementById("themeButton");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");


/* ================= TOAST ================= */

function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3200);

}


/* ================= GOVERNMENT ================= */

governmentButton.addEventListener(
    "click",
    function () {

        showToast(
            "Government Portal",
            "Government workspace selected."
        );

        /*
            BACKEND TEAM:

            Replace this with your route later.

            Example:

            window.location.href =
                "/government";
        */

    }
);


/* ================= STARTUP ================= */

startupButton.addEventListener(
    "click",
    function () {

        showToast(
            "Startup Portal",
            "Startup workspace selected."
        );

        /*
            BACKEND TEAM:

            Replace this with:

            window.location.href =
                "/startup";
        */

    }
);


/* ================= INNOVATION HUB ================= */

innovationButton.addEventListener(
    "click",
    function () {

        showToast(
            "Innovation Hub",
            "Opening public innovation space."
        );

        setTimeout(() => {

            document
                .getElementById("innovation")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }, 250);

    }
);


/* ================= HELP ================= */

helpButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showToast(
            "PROCUREX Help",
            "Help and support will be connected soon."
        );

    }
);


/* ================= DARK MODE ================= */

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");

        const dark =
            document.body.classList.contains("dark");


        if (dark) {

            themeButton.textContent = "☀";

            localStorage.setItem(
                "procurex-theme",
                "dark"
            );

        } else {

            themeButton.textContent = "☾";

            localStorage.setItem(
                "procurex-theme",
                "light"
            );

        }

    }
);


/* ================= LOAD SAVED THEME ================= */

const savedTheme =
    localStorage.getItem("procurex-theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀";

}


/* ================= NAV ACTIVE STATE ================= */

const menuItems =
    document.querySelectorAll(".menu-item");


menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function () {

            menuItems.forEach(
                menu => menu.classList.remove("active")
            );

            this.classList.add("active");

        }
    );

});


/* ================= START ================= */

console.log(
    "PROCUREX Screen 1 loaded."
);

console.log(
    "Government, Startup and Innovation Hub portals ready."
);