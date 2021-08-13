topbar.config({
	autoRun: true,
	barThickness: 3,
	barColors: {
		".5": "rgba(250,  76, 76, .9)",
		"1.0": "rgba(26,  188, 156, .9)",
	},
	shadowBlur: 10,
	shadowColor: "rgba(0,   0,   0,   .6)",
});

document.getElementById("chat")?.addEventListener("click", () => {
	location.href = "/chat";
});

document.getElementById("rank").addEventListener("click", () => {
	location.href = "/rank";
});

document.getElementById("logout").addEventListener("click", () => {
	location.href = "/logout";
});

async function selectGang(gang) {
	topbar.show();
	console.log(gang);

	await fetch("/set-gang", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ gang: gang }),
	});
	topbar.hide();
	window.location.reload();
}

/////////////// Modal ///////////////////

// Get the modal
var modal = document.getElementById("select-gang-modal");

// Get the button that opens the modal
var btn = document.getElementById("select-gang");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
if (btn) {
	btn.onclick = function () {
		modal.style.display = "block";
	};
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};
