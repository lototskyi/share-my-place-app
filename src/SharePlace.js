import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";

class PlaceFinder {
    constructor(props) {
        const addressForm = document.querySelector("form");
        const locateUserBtn = document.getElementById("locate-btn");

        locateUserBtn.addEventListener("click", this.locateUserHandler.bind(this));
        addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
    }

    selectPlace(coordinates) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
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
            (successResult) => {
                modal.hide();
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude,
                };
                this.selectPlace(coordinates);
            },
            (error) => {
                modal.hide();
                alert(
                    "Could not locate you unfortunately. Please enter your address manually!"
                );
            }
        );
    }

    findAddressHandler() {}
}

new PlaceFinder();
