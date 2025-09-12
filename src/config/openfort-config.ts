import Openfort from "@openfort/openfort-js";

const openfort = new Openfort({
    baseConfiguration: {
        publishableKey: "YOUR_OPENFORT_PUBLISHABLE_KEY",
    },
    shieldConfiguration: {
        shieldPublishableKey: "YOUR_SHIELD_PUBLISHABLE_KEY",
    }
});