import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getCoordsFromAddress, getAddressFromCoords } from "./Utility/Location";

class PlaceFinder {
    constructor(props) {
        const addressForm = document.querySelector("form");
        const locateUserBtn = document.getElementById("locate-btn");
        this.shareBtn = document.getElementById("share-btn");

        locateUserBtn.addEventListener(
            "click",
            this.locateUserHandler.bind(this)
        );
        addressForm.addEventListener(
            "submit",
            this.findAddressHandler.bind(this)
        );
        //this.shareBtn.addEventListener("click");
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const shareLinkInputElement = document.getElementById("share-link");
        shareLinkInputElement.value = `${
            location.origin
        }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
            coordinates.lng
        }`;
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert(
                "Your browser doesn't support navigator features, please use more modern browser or add an address manually."
            );
            return;
        }

        const modal = new Modal(
            "loading-modal-content",
            "Loading location - please wait!"
        );
        modal.show();

        navigator.geolocation.getCurrentPosition(
            async (successResult) => {
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude,
                };
                const address = await getAddressFromCoords(coordinates);
                modal.hide();
                this.selectPlace(coordinates, address);
            },
            (error) => {
                modal.hide();
                alert(
                    "Could not locate you unfortunately. Please enter your address manually!"
                );
            }
        );
    }

    async findAddressHandler(event) {
        event.preventDefault();

        const address = event.target.querySelector("input").value;

        if (!address || address.trim().length === 0) {
            alert("Invalid address entered - pls try again!");
            return;
        }
        const modal = new Modal(
            "loading-modal-content",
            "Loading location - please wait!"
        );

        modal.show();

        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (error) {
            alert(error.message);
        }

        modal.hide();
    }
}

new PlaceFinder();
