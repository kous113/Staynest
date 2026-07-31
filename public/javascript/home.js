const howItWorks = document.getElementById("howItWorks");

if (howItWorks) {
    howItWorks.addEventListener("click", () => {

        document
            .getElementById("features")
            .scrollIntoView({
                behavior: "smooth"
            });

    });
}