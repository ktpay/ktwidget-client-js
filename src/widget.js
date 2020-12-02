import sodium from "libsodium-wrappers";
export class ApiClient {
    constructor(sodiumKey, auth, testing) {
        this.sodiumKey = sodiumKey;
        this.auth = auth;
        this.testing = testing;
        let eventMethod = addEventListener ? "addEventListener" : "attachEvent";
        let eventer = window[eventMethod];
        let messageEvent =
            eventMethod === "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
            if (e.data === "close" || e.message === "close") {
                let frame = parent.document.getElementById("iframe_widget");
                frame.parentNode.removeChild(frame);
            }
            if (
                e.data !== undefined &&
                e.data !== "" &&
                typeof e.data !== "object"
            ) {
                if (e.data.includes("http")) {
                    location.href = e.data;
                }
            } else if (
                e.message !== undefined &&
                e.message !== "" &&
                typeof e.message !== "object"
            ) {
                if (e.message.includes("http")) {
                    location.href = e.message;
                }
            }
        });
    }
    getUrl(service) {
        return this.testing
            ? this.urlTest(service)
            : this.urlProduction(service);
    }
    urlTest(service) {
        if (service === "fintech") {
            return "https://fintech.test.nplus.tech";
        }
        if (service === "widget") {
            return "https://widget.test.nplus.tech";
        }
    }
    urlProduction(service) {
        if (service === "fintech") {
            return "https://fintech.nplus.tech";
        }
        if (service === "widget") {
            return "https://widget.nplus.tech";
        }
    }
    createIframe() {
        let iframe = document.createElement("iframe");
        let divElement = document.createElement("div");
        divElement.id = "ktpay_widget_wrapper";
        iframe.setAttribute("id", "iframe_widget");
        iframe.setAttribute(
                "style",
                "position: fixed;" +
                    "z-index: 1000;" +
                    "top: 0;" +
                    "left: 0;" +
                    "width: 100%;" +
                    "display: block;" +
                    "height: 100%;" +
                    "border: none;"
            );
        divElement.appendChild(iframe);
        document.body.appendChild(divElement);

        return iframe;
    }
    encrypted(data) {
        let recipientPk = sodium.from_base64(
            this.sodiumKey,
            sodium.base64_variants.ORIGINAL
        );
        let cipher = sodium.crypto_box_seal(JSON.stringify(data), recipientPk);

        return sodium.to_base64(
            cipher,
            sodium.base64_variants.ORIGINAL
        );
    }
    createTransaction(order) {
        let iframe = this.createIframe();
        let encrypted = this.encrypted({ order: order });
        let headers = {
            "Content-Type": "text/plain",
            "Auth-Identifier": this.auth
        };
        fetch(`${this.getUrl("fintech")}/api/v1/merchant-widget/payment`, {
            method: "post",
            headers: headers,
            body: encrypted
        })
            .then(response => response.json())
            .then(data => {
                iframe.src =
                    `${this.getUrl("widget")}/payment-card?hash=` +
                    data.response.data.transaction_hash;
            });
    }
}
